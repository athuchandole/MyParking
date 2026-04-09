// Parking/screens/Checkin.js

import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Image,
    Alert
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { getParkingRates, getRateMeta } from '../storage/ParkingRate';
import { saveCheckin, getCheckins } from '../storage/CheckinStorage';
import { getDefaultPlate } from '../storage/DefaultPlateStorage';
import { useFocusEffect } from '@react-navigation/native';
import Header from "../components/Header";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getMessageTemplates } from "../storage/MessageTemplateStorage";
import ConfirmCheckinModal from '../components/ConfirmCheckinModal';
import CameraCaptureModal from '../components/CameraCaptureModal';
import { openWhatsApp } from "../utils/whatsapp";

export default function Checkin({ navigation, route }) {

    const editMode = route?.params?.editMode || false;
    const editItem = route?.params?.item;

    const [vehicleNumber, setVehicleNumber] = useState('');
    const [driverName, setDriverName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [keyboardType, setKeyboardType] = useState('default');

    const [vehicleImage, setVehicleImage] = useState(null);
    const [driverImage, setDriverImage] = useState(null);

    const [cameraVisible, setCameraVisible] = useState(false);
    const [captureType, setCaptureType] = useState(null);

    const [selectedVehicle, setSelectedVehicle] = useState(null);

    const [rates, setRates] = useState({ bike: '10', auto: '20', car: '40' });
    const [rateMeta, setRateMeta] = useState({ perHours: '1' });

    const [defaultPlate, setDefaultPlate] = useState({ part1: '', part2: '' });
    const [showModal, setShowModal] = useState(false);
    const [pendingCheckin, setPendingCheckin] = useState(null);

    const [fontsLoaded] = useFonts({
        ...MaterialCommunityIcons.font,
    });

    const loadRates = async () => {
        const data = await getParkingRates();
        const meta = await getRateMeta();
        setRates(data);
        setRateMeta(meta);
    };

    const loadDefaultPlate = async () => {
        if (editMode) return;
        const plate = await getDefaultPlate();
        if (plate) {
            setDefaultPlate(plate);
            const formatted = [plate.part1, plate.part2].filter(Boolean).join(' ');
            setVehicleNumber(formatted);
        }
    };

    useEffect(() => {
        loadRates();
        loadDefaultPlate();

        if (editMode && editItem) {
            setVehicleNumber(editItem.vehicleNumber);
            setDriverName(editItem.driverName);
            setPhoneNumber(editItem.phoneNumber);
            setVehicleImage(editItem.vehicleImage);
            setDriverImage(editItem.driverImage);
            setSelectedVehicle(editItem.vehicleType);
        }
    }, []);

    useFocusEffect(useCallback(() => { loadRates(); }, []));

    const vehicleTypes = [
        { key: 'bike', label: 'Bike', icon: 'bike' },
        { key: 'auto', label: 'Auto', icon: 'rickshaw' },
        { key: 'car', label: 'Car', icon: 'car' },
    ];

    const currentRate = rates[selectedVehicle] || '0';
    const perHours = rateMeta?.perHours || '1';

    const handleVehicleNumber = (text) => {
        if (editMode) return;

        let clean = text.toUpperCase().replace(/[^A-Z0-9]/g, '');

        let part1 = clean.slice(0, 2).replace(/[^A-Z]/g, '');
        let part2 = clean.slice(2, 4).replace(/[^0-9]/g, '');
        let part3 = clean.slice(4, 6).replace(/[^A-Z]/g, '');
        let part4 = clean.slice(6, 10).replace(/[^0-9]/g, '');

        let formatted = [part1, part2, part3, part4].filter(Boolean).join(' ');
        setVehicleNumber(formatted);

        if (clean.length < 2) setKeyboardType('default');
        else if (clean.length < 4) setKeyboardType('numeric');
        else if (clean.length < 6) setKeyboardType('default');
        else setKeyboardType('numeric');
    };

    const openCamera = (type) => {
        if (editMode) return;
        setCaptureType(type);
        setCameraVisible(true);
    };

    const handleCapture = (uri) => {
        if (captureType === 'vehicle') setVehicleImage(uri);
        else setDriverImage(uri);
    };

    const updateEntry = async () => {
        const data = await getCheckins();
        const updated = data.map(v =>
            v.id === editItem.id
                ? { ...v, driverName, phoneNumber, vehicleType: selectedVehicle, rate: currentRate }
                : v
        );

        await AsyncStorage.setItem("PARKING_CHECKINS", JSON.stringify(updated));
        Alert.alert("Updated", "Entry updated successfully");
        navigation.goBack();
    };

    const replaceVars = (template, data) => {
        let msg = template;
        Object.keys(data).forEach(key => {
            msg = msg.replaceAll(`@${key}`, data[key] ?? "");
        });
        return msg;
    };

    const shareOnWhatsApp = async (checkinItem) => {
        try {
            const templates = await getMessageTemplates();

            const data = {
                vehicleNumber: checkinItem.vehicleNumber,
                driverName: checkinItem.driverName,
                phoneNumber: checkinItem.phoneNumber || "",
                vehicleType: checkinItem.vehicleType,
                rate: checkinItem.rate,
                entryTime: new Date(checkinItem.createdAt).toLocaleString()
            };

            const template = templates.active;
            const message = replaceVars(template, data);

            await openWhatsApp(checkinItem.phoneNumber, message);

        } catch (e) {
            Alert.alert("Error", "Unable to share receipt");
        }
    };

    const handleSubmit = async () => {
        if (!selectedVehicle)
            return Alert.alert("Vehicle Type Required", "Please select vehicle type.");

        if (editMode) {
            updateEntry();
            return;
        }

        if (!vehicleNumber || !driverName)
            return Alert.alert("Missing Details", "Please fill vehicle number and driver name.");

        const data = {
            vehicleType: selectedVehicle,
            rate: currentRate,
            perHours,
            vehicleNumber,
            driverName,
            phoneNumber,
            vehicleImage,
            driverImage,
            createdAt: new Date().toISOString()
        };

        setPendingCheckin(data);
        setShowModal(true);
    };

    const confirmCheckin = async () => {
        setShowModal(false);

        if (!pendingCheckin) return;

        const success = await saveCheckin(pendingCheckin);

        if (success) {
            navigation.goBack();
            setTimeout(() => shareOnWhatsApp(pendingCheckin), 500);
        } else {
            Alert.alert("Error", "Check-in failed");
        }
    };

    if (!fontsLoaded) return null;

    return (
        <View style={styles.container}>

            {/* Camera Component */}
            <CameraCaptureModal
                visible={cameraVisible}
                onClose={() => setCameraVisible(false)}
                onCapture={handleCapture}
            />

            <Header
                title={editMode ? "Edit Entry" : "Vehicle IN Entry"}
                navigation={navigation}
            />

            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>

                {/* Vehicle Type */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Vehicle Type</Text>

                    <View style={styles.vehicleTypeContainer}>
                        {vehicleTypes.map(type => {
                            const active = selectedVehicle === type.key;

                            return (
                                <TouchableOpacity
                                    key={type.key}
                                    style={[
                                        styles.vehicleTypeCard,
                                        active && styles.vehicleActive
                                    ]}
                                    onPress={() => setSelectedVehicle(type.key)}
                                >
                                    <MaterialCommunityIcons
                                        name={type.icon}
                                        size={32}
                                        color={active ? "#fff" : "#137fec"}
                                    />
                                    <Text style={[
                                        styles.vehicleTypeText,
                                        active && { color: "#fff" }
                                    ]}>
                                        {type.label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                {/* Rate */}
                <View style={styles.section}>
                    <View style={styles.rateBox}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                            <MaterialCommunityIcons name="cash" size={20} color="#137fec" />
                            <Text style={styles.rateText}>Standard Parking Rate</Text>
                        </View>
                        <Text style={styles.rateAmount}>
                            ₹{currentRate} / {perHours} hr
                        </Text>
                    </View>
                </View>

                {/* Inputs */}
                <View style={styles.section}>

                    <Text style={styles.inputLabel}>Vehicle Number</Text>
                    <View style={styles.inputWrapper}>
                        <MaterialCommunityIcons name="card-text-outline" size={24} color="#888" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="MH 12 AB 1234"
                            value={vehicleNumber}
                            editable={!editMode}
                            onChangeText={handleVehicleNumber}
                            keyboardType={keyboardType}
                        />
                        {editMode && <MaterialCommunityIcons name="lock" size={18} color="red" />}
                    </View>

                    {!editMode && defaultPlate.part1 && defaultPlate.part2 && (
                        <Text style={styles.defaultPlateText}>
                            Default Plate: {defaultPlate.part1} {defaultPlate.part2}
                        </Text>
                    )}

                    <Text style={styles.inputLabel}>Driver Name</Text>
                    <View style={styles.inputWrapper}>
                        <MaterialCommunityIcons name="account" size={24} color="#888" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Enter full name"
                            value={driverName}
                            onChangeText={setDriverName}
                        />
                    </View>

                    <Text style={styles.inputLabel}>Phone Number</Text>
                    <View style={styles.inputWrapper}>
                        <MaterialCommunityIcons name="phone" size={24} color="#888" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Enter phone number"
                            keyboardType="number-pad"
                            value={phoneNumber}
                            onChangeText={text => setPhoneNumber(text.replace(/[^0-9]/g, '').slice(0, 10))}
                            maxLength={10}
                        />
                    </View>

                </View>

                {/* Images */}
                <View style={styles.section}>
                    <View style={styles.imageRow}>

                        <TouchableOpacity style={styles.captureBox} onPress={() => openCamera('vehicle')}>
                            {vehicleImage ? (
                                <Image source={{ uri: vehicleImage }} style={styles.previewImage} />
                            ) : (
                                <>
                                    <MaterialCommunityIcons name="camera" size={32} color="#888" />
                                    <Text style={styles.captureText}>Vehicle</Text>
                                </>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.captureBox} onPress={() => openCamera('driver')}>
                            {driverImage ? (
                                <Image source={{ uri: driverImage }} style={styles.previewImage} />
                            ) : (
                                <>
                                    <MaterialCommunityIcons name="account-box" size={32} color="#888" />
                                    <Text style={styles.captureText}>Driver</Text>
                                </>
                            )}
                        </TouchableOpacity>

                    </View>
                </View>

            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <MaterialCommunityIcons name="login" size={24} color="#fff" />
                    <Text style={styles.submitText}>
                        {editMode ? "UPDATE ENTRY" : "SUBMIT / VEHICLE IN"}
                    </Text>
                </TouchableOpacity>
            </View>

            <ConfirmCheckinModal
                visible={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={confirmCheckin}
                driverName={driverName}
                vehicleNumber={vehicleNumber}
                rate={currentRate}
            />

        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f6f7f8' },
    section: { paddingHorizontal: 16, paddingVertical: 8 },
    sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
    vehicleTypeContainer: { flexDirection: 'row', justifyContent: 'space-between' },
    vehicleTypeCard: { flex: 1, marginHorizontal: 4, backgroundColor: '#e5e7eb', borderRadius: 16, padding: 12, alignItems: 'center' },
    vehicleActive: { backgroundColor: '#137fec' },
    vehicleTypeText: { fontSize: 12, fontWeight: '700', marginTop: 4 },
    rateBox: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'rgba(19,127,236,0.1)', borderColor: 'rgba(19,127,236,0.2)', borderWidth: 1, padding: 12, borderRadius: 16, alignItems: 'center' },
    rateText: { fontSize: 14, fontWeight: '500', color: '#374151' },
    rateAmount: { fontSize: 18, fontWeight: '700', color: '#137fec' },
    inputLabel: { fontSize: 14, fontWeight: '600', marginBottom: 4, marginTop: 8 },
    defaultPlateText: { fontSize: 14, fontWeight: '500', color: '#137fec', marginVertical: 4 },
    inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f3f4f6', borderRadius: 16, borderWidth: 1, borderColor: '#d1d5db', paddingHorizontal: 12, height: 52, marginBottom: 8 },
    inputIcon: { marginRight: 8 },
    input: { flex: 1, fontSize: 16 },
    imageRow: { flexDirection: 'row', gap: 10 },
    captureBox: { flex: 1, backgroundColor: '#f3f4f6', height: 120, borderRadius: 16, borderWidth: 2, borderStyle: 'dashed', borderColor: '#d1d5db', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
    previewImage: { width: '100%', height: '100%', resizeMode: 'cover' },
    captureText: { fontSize: 12, fontWeight: '700', marginTop: 4 },
    footer: { padding: 16, borderTopWidth: 1, borderTopColor: '#ddd', backgroundColor: '#fff' },
    submitButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#137fec', borderRadius: 16, paddingVertical: 14, gap: 8 },
    submitText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});