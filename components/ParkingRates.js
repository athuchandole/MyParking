//Parking/components/ParkingRates.js
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
    getParkingRates,
    saveParkingRates,
    getRateMeta,
    saveRateMeta
} from '../storage/ParkingRate';

export default function ParkingRates() {
    const [rates, setRates] = useState({ bike: '', auto: '', car: '' });
    const [perHours, setPerHours] = useState('1');
    const [editing, setEditing] = useState({ bike: false, auto: false, car: false, perHours: false });
    const [originalRates, setOriginalRates] = useState({ bike: '', auto: '', car: '' });
    const [originalPerHours, setOriginalPerHours] = useState('1');
    const [showSaveButton, setShowSaveButton] = useState(false);

    useEffect(() => {
        loadAll();
    }, []);

    const loadAll = async () => {
        const storedRates = await getParkingRates();
        const meta = await getRateMeta();
        setRates(storedRates);
        setOriginalRates(storedRates);
        setPerHours(meta.perHours || '1');
        setOriginalPerHours(meta.perHours || '1');
    };

    const updateRate = (type, value) => {
        const updated = { ...rates, [type]: value };
        setRates(updated);
        checkChanges(updated, perHours);
    };

    const updatePerHours = (value) => {
        const clean = value.replace(/[^0-9]/g, '');
        setPerHours(clean);
        checkChanges(rates, clean);
    };

    const checkChanges = (newRates, newPerHours) => {
        const changedRates = Object.keys(newRates).some(key => newRates[key] !== originalRates[key]);
        const changedPerHour = newPerHours !== originalPerHours;
        setShowSaveButton(changedRates || changedPerHour);
    };

    const handleSave = async () => {
        await saveParkingRates(rates);
        await saveRateMeta({ perHours });
        setOriginalRates(rates);
        setOriginalPerHours(perHours);
        setEditing({ bike: false, auto: false, car: false, perHours: false });
        setShowSaveButton(false);
        Alert.alert('Saved', 'Parking rates and per hour value updated successfully!');
    };

    const toggleEdit = (key) => {
        setEditing({ ...editing, [key]: true });
    };

    const rows = [
        { key: 'bike', label: 'Bike', icon: 'motorbike' },
        { key: 'auto', label: 'Auto', icon: 'rickshaw' },
        { key: 'car', label: 'Car', icon: 'car' },
    ];

    return (
        <View>
            {/* RATE PER HR SETTING */}
            <View style={styles.metaCard}>
                <Text style={styles.metaLabel}>Rate per hour:</Text>
                {editing.perHours ? (
                    <View style={styles.inputRow}>
                        <TextInput
                            style={styles.metaInput}
                            keyboardType="numeric"
                            value={perHours}
                            onChangeText={updatePerHours}
                        />
                        <Text style={styles.metaSuffix}>hr</Text>
                    </View>
                ) : (
                    <TouchableOpacity onPress={() => toggleEdit('perHours')}>
                        <Text style={styles.metaValue}>{perHours} hr</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* VEHICLE RATES */}
            <View style={styles.card}>
                {rows.map((item, index) => (
                    <View key={item.key} style={[styles.row, index !== rows.length - 1 && styles.rowDivider]}>
                        <View style={styles.left}>
                            <MaterialCommunityIcons
                                name={item.icon}
                                size={22}
                                color="#6b7280"
                            />
                            <Text style={styles.label}>{item.label}</Text>
                        </View>
                        {editing[item.key] ? (
                            <View style={styles.inputRow}>
                                <Text style={styles.currency}>₹</Text>
                                <TextInput
                                    style={styles.input}
                                    keyboardType="numeric"
                                    value={rates[item.key]}
                                    onChangeText={(v) => updateRate(item.key, v)}
                                />
                            </View>
                        ) : (
                            <TouchableOpacity style={styles.inputRow} onPress={() => toggleEdit(item.key)}>
                                <Text style={styles.currency}>₹</Text>
                                <Text style={styles.metaValue}>{rates[item.key]}</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                ))}
            </View>

            {/* SAVE BUTTON */}
            {showSaveButton && (
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveText}>Save</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    metaCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        padding: 14,
        marginBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    metaLabel: { fontSize: 14, fontWeight: '600', color: '#374151' },
    metaInput: {
        width: 60,
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 6,
        textAlign: 'center',
        fontWeight: '600',
        fontSize: 14,
        backgroundColor: '#f3f4f6'
    },
    metaValue: { fontSize: 14, fontWeight: '600', color: '#374151' },
    metaSuffix: { marginLeft: 6, fontWeight: '600', fontSize: 14, color: '#374151' },
    card: { backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#e5e7eb', paddingVertical: 8, paddingHorizontal: 12 },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
    rowDivider: { borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
    left: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    label: { fontSize: 15, fontWeight: '500', color: '#374151' },
    inputRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    currency: { fontSize: 14, color: '#6b7280' },
    input: {
        width: 70,
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 6,
        textAlign: 'right',
        fontWeight: '600',
        fontSize: 14,
        backgroundColor: '#f3f4f6'
    },
    saveButton: {
        marginTop: 16,
        marginHorizontal: 16,
        backgroundColor: '#137fec',
        borderRadius: 12,
        padding: 14,
        alignItems: 'center',
        justifyContent: 'center'
    },
    saveText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});