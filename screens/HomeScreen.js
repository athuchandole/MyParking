//Parking/screens/HomeScreen.js
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import { getCheckins } from '../storage/CheckinStorage';
import VehicleCard from '../components/VehicleCard';
import Header from '../components/Header';

export default function HomeScreen({ navigation }) {

    const [vehicles, setVehicles] = useState([]);
    const [search, setSearch] = useState("");

    const loadVehicles = async () => {
        const data = await getCheckins();
        setVehicles(data || []);
    };

    useFocusEffect(
        useCallback(() => {
            loadVehicles();
        }, [])
    );

    // Safe search filtering
    const filteredVehicles = vehicles.filter(v => {

        const part1 = String(v?.part1 || "");
        const part2 = String(v?.part2 || "");
        const plate = (part1 + part2).toLowerCase();

        return plate.includes(search.toLowerCase());
    });

    return (
        <View style={{ flex: 1 }}>

            <Header
                navigation={navigation}
                showBack={false}
                showSearch={true}
                searchValue={search}
                onSearchChange={setSearch}
            />

            <ScrollView style={styles.container}>

                {/* Vehicle IN Button */}
                <View style={styles.actionGrid}>

                    <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() => navigation.navigate('Checkin')}
                    >
                        <View style={styles.iconCircle}>
                            <MaterialCommunityIcons name="login" size={30} color="#059669" />
                        </View>

                        <Text style={styles.actionText}>
                            Vehicle IN
                        </Text>
                    </TouchableOpacity>

                </View>

                {/* Latest Vehicles */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>
                        Latest Added Vehicle
                    </Text>
                </View>

                <View style={styles.vehicleList}>

                    {filteredVehicles.slice(0, 5).map((item) => (
                        <VehicleCard key={item.id} item={item} />
                    ))}

                    {vehicles.length === 0 && (
                        <Text style={styles.emptyText}>
                            No vehicles yet
                        </Text>
                    )}

                </View>

            </ScrollView>

        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
        padding: 16
    },

    actionGrid: {
        flexDirection: 'row',
        marginBottom: 18
    },

    actionBtn: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        alignItems: 'center'
    },

    iconCircle: {
        height: 56,
        width: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#d1fae5'
    },

    actionText: {
        marginTop: 10,
        fontWeight: '700'
    },

    sectionHeader: {
        marginBottom: 10
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold'
    },

    vehicleList: {
        gap: 12
    },

    emptyText: {
        textAlign: 'center',
        color: '#6b7280',
        marginTop: 20
    }

});