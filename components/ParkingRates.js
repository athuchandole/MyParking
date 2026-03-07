//Parking/components/ParkingRates.js
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getParkingRates, saveParkingRates } from '../storage/ParkingRate';

export default function ParkingRates() {
    const [rates, setRates] = useState({
        bike: '',
        auto: '',
        car: '',
    });

    useEffect(() => {
        loadRates();
    }, []);

    const loadRates = async () => {
        const stored = await getParkingRates();
        setRates(stored);
    };

    const updateRate = async (type, value) => {
        const updated = { ...rates, [type]: value };
        setRates(updated);
        await saveParkingRates(updated);
    };

    const rows = [
        { key: 'bike', label: 'Bike', icon: 'motorbike' },
        { key: 'auto', label: 'Auto', icon: 'taxi' },
        { key: 'car', label: 'Car', icon: 'car' },
    ];

    return (
        <View style={styles.card}>
            {rows.map((item) => (
                <View key={item.key} style={styles.row}>
                    <View style={styles.left}>
                        <MaterialCommunityIcons
                            name={item.icon}
                            size={22}
                            color="#6b7280"
                        />
                        <Text style={styles.label}>{item.label}</Text>
                    </View>

                    <View style={styles.inputRow}>
                        <Text style={styles.currency}>₹</Text>
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            value={rates[item.key]}
                            onChangeText={(v) => updateRate(item.key, v)}
                        />
                    </View>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        paddingHorizontal: 12,
        paddingVertical: 8,
    },

    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
    },

    left: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },

    label: {
        fontSize: 15,
        fontWeight: '500',
    },

    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },

    currency: {
        fontSize: 14,
        color: '#6b7280',
    },

    input: {
        width: 60,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 6,
        paddingHorizontal: 6,
        paddingVertical: 2,
        textAlign: 'right',
        fontWeight: '700',
    },
});