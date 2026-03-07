//screens/Checkin.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { getParkingRates } from '../storage/ParkingRate';

export default function Checkin({ navigation }) {

    const [vehicleNumber, setVehicleNumber] = useState('');
    const [driverName, setDriverName] = useState('');
    const [selectedVehicle, setSelectedVehicle] = useState('bike');
    const [rates, setRates] = useState({ bike: '10', auto: '20', car: '40' });

    const [fontsLoaded] = useFonts({
        ...MaterialCommunityIcons.font,
    });

    useEffect(() => {
        loadRates();
    }, []);

    const loadRates = async () => {
        const data = await getParkingRates();
        setRates(data);
    };

    const vehicleTypes = [
        { key: 'bike', label: 'Bike', icon: 'bike' },
        { key: 'auto', label: 'Auto', icon: 'rickshaw' },
        { key: 'car', label: 'Car', icon: 'car' },
    ];

    const currentRate = rates[selectedVehicle] || '0';

    if (!fontsLoaded) return null;

    return (
        <View style={styles.container}>

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialCommunityIcons name="arrow-left" size={28} color="#000" />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>Vehicle IN Entry</Text>

                <MaterialCommunityIcons name="history" size={28} color="#137fec" />
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>

                {/* Vehicle Type */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Vehicle Type</Text>

                    <View style={styles.vehicleTypeContainer}>
                        {vehicleTypes.map((type) => {

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

                        <Text style={styles.rateAmount}>₹{currentRate}/hr</Text>
                    </View>
                </View>

                {/* Vehicle Number */}
                <View style={styles.section}>

                    <Text style={styles.inputLabel}>Vehicle Number</Text>

                    <View style={styles.inputWrapper}>
                        <MaterialCommunityIcons name="card-text-outline" size={24} color="#888" style={styles.inputIcon} />

                        <TextInput
                            style={styles.input}
                            placeholder="e.g. MH 12 AB 1234"
                            value={vehicleNumber}
                            onChangeText={setVehicleNumber}
                            autoCapitalize="characters"
                        />
                    </View>

                    <Text style={styles.inputLabel}>Driver Name (Optional)</Text>

                    <View style={styles.inputWrapper}>
                        <MaterialCommunityIcons name="account" size={24} color="#888" style={styles.inputIcon} />

                        <TextInput
                            style={styles.input}
                            placeholder="Enter full name"
                            value={driverName}
                            onChangeText={setDriverName}
                        />
                    </View>

                </View>

                {/* Images */}
                <View style={styles.section}>

                    <Text style={styles.inputLabel}>Vehicle Image</Text>

                    <View style={styles.captureBox}>
                        <MaterialCommunityIcons name="camera" size={32} color="#888" />
                        <Text style={styles.captureText}>Capture</Text>
                    </View>

                    <Text style={styles.inputLabel}>Driver Image</Text>

                    <View style={styles.captureBox}>
                        <MaterialCommunityIcons name="account-box" size={32} color="#888" />
                        <Text style={styles.captureText}>Capture</Text>
                    </View>

                </View>

                {/* Info */}
                <View style={[styles.section, styles.infoBox]}>
                    <MaterialCommunityIcons name="information" size={20} color="#f59e0b" />

                    <Text style={styles.infoText}>
                        Entry time will be recorded automatically upon submission.
                        Ensure the vehicle number matches the plate for accurate billing.
                    </Text>
                </View>

            </ScrollView>

            {/* Submit */}
            <View style={styles.footer}>

                <TouchableOpacity style={styles.submitButton}>
                    <MaterialCommunityIcons name="login" size={24} color="#fff" />
                    <Text style={styles.submitText}>SUBMIT / VEHICLE IN</Text>
                </TouchableOpacity>

            </View>

        </View>
    );
}

const styles = StyleSheet.create({

    container: { flex: 1, backgroundColor: '#f6f7f8' },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },

    headerTitle: { fontSize: 18, fontWeight: 'bold' },

    section: { paddingHorizontal: 16, paddingVertical: 8 },

    sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 8 },

    vehicleTypeContainer: { flexDirection: 'row', justifyContent: 'space-between' },

    vehicleTypeCard: {
        flex: 1,
        marginHorizontal: 4,
        backgroundColor: '#e5e7eb',
        borderRadius: 16,
        padding: 12,
        alignItems: 'center',
    },

    vehicleActive: { backgroundColor: '#137fec' },

    vehicleTypeText: { fontSize: 12, fontWeight: '700', marginTop: 4 },

    rateBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(19,127,236,0.1)',
        borderColor: 'rgba(19,127,236,0.2)',
        borderWidth: 1,
        padding: 12,
        borderRadius: 16,
        alignItems: 'center',
    },

    rateText: { fontSize: 14, fontWeight: '500', color: '#374151' },

    rateAmount: { fontSize: 18, fontWeight: '700', color: '#137fec' },

    inputLabel: { fontSize: 14, fontWeight: '600', marginBottom: 4, marginTop: 8 },

    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f3f4f6',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#d1d5db',
        paddingHorizontal: 12,
        height: 52,
        marginBottom: 8,
    },

    inputIcon: { marginRight: 8 },

    input: { flex: 1, fontSize: 16 },

    captureBox: {
        backgroundColor: '#f3f4f6',
        height: 120,
        borderRadius: 16,
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: '#d1d5db',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },

    captureText: { fontSize: 12, fontWeight: '700', marginTop: 4 },

    infoBox: {
        flexDirection: 'row',
        backgroundColor: '#f9fafb',
        padding: 12,
        borderRadius: 16,
        alignItems: 'flex-start',
        gap: 8,
    },

    infoText: { fontSize: 12, color: '#6b7280', flex: 1 },

    footer: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        backgroundColor: '#fff',
    },

    submitButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#137fec',
        borderRadius: 16,
        paddingVertical: 14,
        gap: 8,
    },

    submitText: { color: '#fff', fontWeight: '700', fontSize: 16 },

});