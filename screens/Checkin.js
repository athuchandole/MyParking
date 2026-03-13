//Parking/screens/Checkin.js
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Modal, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { getParkingRates } from '../storage/ParkingRate';
import { saveCheckin, getCheckins } from '../storage/CheckinStorage';
import { getDefaultPlate } from '../storage/DefaultPlateStorage';
import { useFocusEffect } from '@react-navigation/native';
import { CameraView } from 'expo-camera';
import Header from "../components/Header";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Checkin({ navigation, route }) {

    const editMode = route?.params?.editMode || false;
    const editItem = route?.params?.item;

    const cameraRef = useRef(null);

    const [vehicleNumber, setVehicleNumber] = useState('');
    const [driverName, setDriverName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [keyboardType, setKeyboardType] = useState('default');

    const [vehicleImage, setVehicleImage] = useState(null);
    const [driverImage, setDriverImage] = useState(null);

    const [cameraVisible, setCameraVisible] = useState(false);
    const [captureType, setCaptureType] = useState(null);

    const [flash, setFlash] = useState('off');

    const [selectedVehicle, setSelectedVehicle] = useState(null);

    const [rates, setRates] = useState({ bike: '10', auto: '20', car: '40' });

    const [fontsLoaded] = useFonts({
        ...MaterialCommunityIcons.font,
    });

    const [defaultPlate, setDefaultPlate] = useState({ part1: '', part2: '' });

    const loadRates = async () => {
        const data = await getParkingRates();
        setRates(data);
    };

    const loadDefaultPlate = async () => {

        if (editMode) return;

        const plate = await getDefaultPlate();

        if (plate) {

            setDefaultPlate(plate);

            const formatted = [plate.part1, plate.part2]
                .filter(Boolean)
                .join(' ');

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

    useFocusEffect(
        useCallback(() => {
            loadRates();
        }, [])
    );

    const vehicleTypes = [
        { key: 'bike', label: 'Bike', icon: 'bike' },
        { key: 'auto', label: 'Auto', icon: 'rickshaw' },
        { key: 'car', label: 'Car', icon: 'car' },
    ];

    const currentRate = rates[selectedVehicle] || '0';

    const handleVehicleNumber = (text) => {

        if (editMode) return;

        let clean = text.toUpperCase().replace(/[^A-Z0-9]/g, '');

        let part1 = clean.slice(0, 2).replace(/[^A-Z]/g, '');
        let part2 = clean.slice(2, 4).replace(/[^0-9]/g, '');
        let part3 = clean.slice(4, 6).replace(/[^A-Z]/g, '');
        let part4 = clean.slice(6, 10).replace(/[^0-9]/g, '');

        let formatted = [part1, part2, part3, part4]
            .filter(Boolean)
            .join(' ');

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

    const takePhoto = async () => {

        if (!cameraRef.current) return;

        const photo = await cameraRef.current.takePictureAsync({ quality: 0.6 });

        if (captureType === 'vehicle') {
            setVehicleImage(photo.uri);
        } else {
            setDriverImage(photo.uri);
        }

        setCameraVisible(false);

    };

    const updateEntry = async () => {

        const data = await getCheckins();

        const updated = data.map(v => {

            if (v.id === editItem.id) {

                return {
                    ...v,
                    driverName,
                    phoneNumber,
                    vehicleType: selectedVehicle,
                    rate: currentRate
                };

            }

            return v;

        });

        await AsyncStorage.setItem("PARKING_CHECKINS", JSON.stringify(updated));

        Alert.alert("Updated", "Entry updated successfully");

        navigation.goBack();

    };

    const handleSubmit = async () => {

        if (!selectedVehicle) {
            Alert.alert("Vehicle Type Required", "Please select vehicle type.");
            return;
        }

        if (editMode) {
            updateEntry();
            return;
        }

        if (!vehicleNumber || !driverName) {
            Alert.alert("Missing Details", "Please fill vehicle number and driver name.");
            return;
        }

        const data = {
            vehicleType: selectedVehicle,
            rate: currentRate,
            vehicleNumber,
            driverName,
            phoneNumber,
            vehicleImage,
            driverImage
        };

        const success = await saveCheckin(data);

        if (success) {
            Alert.alert("Success", "Vehicle check-in saved");
            navigation.navigate('HomeMain');
        }

    };

    if (!fontsLoaded) return null;

    return (

        <View style={styles.container}>

            <Modal visible={cameraVisible} animationType="slide">

                <View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>

                    <CameraView ref={cameraRef} style={styles.passportCamera} facing="back" flash={flash} />

                    <TouchableOpacity style={styles.flashBtn} onPress={() => setFlash(flash === 'off' ? 'on' : 'off')}>
                        <MaterialCommunityIcons name={flash === 'on' ? 'flash' : 'flash-off'} size={28} color="#fff" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.captureButton} onPress={takePhoto}>
                        <MaterialCommunityIcons name="camera" size={32} color="#fff" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.closeCamera} onPress={() => setCameraVisible(false)}>
                        <MaterialCommunityIcons name="close" size={28} color="#fff" />
                    </TouchableOpacity>

                </View>

            </Modal>

            <Header title={editMode ? "Edit Entry" : "Vehicle IN Entry"} navigation={navigation} />

            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>

                <View style={styles.section}>

                    <Text style={styles.sectionTitle}>Vehicle Type</Text>

                    <View style={styles.vehicleTypeContainer}>

                        {vehicleTypes.map(type => {

                            const active = selectedVehicle === type.key;

                            return (

                                <TouchableOpacity
                                    key={type.key}
                                    style={[styles.vehicleTypeCard, active && styles.vehicleActive]}
                                    onPress={() => setSelectedVehicle(type.key)}
                                >

                                    <MaterialCommunityIcons name={type.icon} size={32} color={active ? "#fff" : "#137fec"} />
                                    <Text style={[styles.vehicleTypeText, active && { color: "#fff" }]}>{type.label}</Text>

                                </TouchableOpacity>

                            );

                        })}

                    </View>

                </View>

                {/* STANDARD RATE UI RESTORED */}

                <View style={styles.section}>

                    <View style={styles.rateBox}>

                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                            <MaterialCommunityIcons name="cash" size={20} color="#137fec" />
                            <Text style={styles.rateText}>Standard Parking Rate</Text>
                        </View>

                        <Text style={styles.rateAmount}>₹{currentRate}/hr</Text>

                    </View>

                </View>

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

                    {defaultPlate.part1 && defaultPlate.part2 && !editMode && (
                        <Text style={styles.defaultPlateText}>
                            Default Plate: {defaultPlate.part1} {defaultPlate.part2}
                        </Text>
                    )}

                    <Text style={styles.inputLabel}>Driver Name</Text>

                    <View style={styles.inputWrapper}>
                        <MaterialCommunityIcons name="account" size={24} color="#888" style={styles.inputIcon} />
                        <TextInput style={styles.input} placeholder="Enter full name" value={driverName} onChangeText={setDriverName} />
                    </View>

                    <Text style={styles.inputLabel}>Phone Number</Text>

                    <View style={styles.inputWrapper}>
                        <MaterialCommunityIcons name="phone" size={24} color="#888" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Enter phone number"
                            keyboardType="number-pad"
                            value={phoneNumber}
                            onChangeText={(text) => {
                                const clean = text.replace(/[^0-9]/g, '');
                                setPhoneNumber(clean.slice(0, 10));
                            }}
                            maxLength={10}
                        />
                    </View>

                </View>

                <View style={styles.section}>

                    <View style={styles.imageRow}>

                        <TouchableOpacity style={styles.captureBox} onPress={() => openCamera('vehicle')}>

                            {vehicleImage
                                ? <Image source={{ uri: vehicleImage }} style={styles.previewImage} />
                                :
                                <>
                                    <MaterialCommunityIcons name="camera" size={32} color="#888" />
                                    <Text style={styles.captureText}>Vehicle</Text>
                                </>
                            }

                            {editMode && <MaterialCommunityIcons name="lock" size={20} color="red" style={styles.lockOverlay} />}

                        </TouchableOpacity>

                        <TouchableOpacity style={styles.captureBox} onPress={() => openCamera('driver')}>

                            {driverImage
                                ? <Image source={{ uri: driverImage }} style={styles.previewImage} />
                                :
                                <>
                                    <MaterialCommunityIcons name="account-box" size={32} color="#888" />
                                    <Text style={styles.captureText}>Driver</Text>
                                </>
                            }

                            {editMode && <MaterialCommunityIcons name="lock" size={20} color="red" style={styles.lockOverlay} />}

                        </TouchableOpacity>

                    </View>

                </View>

            </ScrollView>

            <View style={styles.footer}>

                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <MaterialCommunityIcons name="login" size={24} color="#fff" />
                    <Text style={styles.submitText}>
                        {editMode ? "UPDATE ENTRY" : "SUBMIT / VEHICLE IN"}
                    </Text>
                </TouchableOpacity>

            </View>

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

    lockOverlay: { position: 'absolute', top: 6, right: 6 },

    footer: { padding: 16, borderTopWidth: 1, borderTopColor: '#ddd', backgroundColor: '#fff' },

    submitButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#137fec', borderRadius: 16, paddingVertical: 14, gap: 8 },

    submitText: { color: '#fff', fontWeight: '700', fontSize: 16 },

    passportCamera: { width: 260, height: 360, borderRadius: 20, overflow: 'hidden' },

    captureButton: { position: 'absolute', bottom: 60, backgroundColor: '#137fec', width: 70, height: 70, borderRadius: 40, alignItems: 'center', justifyContent: 'center' },

    flashBtn: { position: 'absolute', top: 60, right: 30 },

    closeCamera: { position: 'absolute', top: 60, left: 30 }

});