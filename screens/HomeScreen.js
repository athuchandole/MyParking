//Parking/screens/HomeScreen.js
import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Header from "../components/Header";
import VehicleCard from "../components/VehicleCard";
import SearchBar from "../components/SearchBar";
import { getCheckins } from "../storage/CheckinStorage";

export default function HomeScreen() {

    const navigation = useNavigation();

    const [list, setList] = useState([]);
    const [search, setSearch] = useState("");

    const loadVehicles = async () => {
        const data = await getCheckins();
        const active = data.filter(v => v.status === "active");
        setList(active);
    };

    useFocusEffect(useCallback(() => { loadVehicles(); }, []));

    const filtered = list.filter(v => {

        const q = search.toLowerCase();

        const time = new Date(v.createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });

        return (
            v.vehicleNumber?.toLowerCase().includes(q) ||
            v.driverName?.toLowerCase().includes(q) ||
            v.phoneNumber?.toLowerCase().includes(q) ||
            v.vehicleType?.toLowerCase().includes(q) ||
            String(v.rate)?.toLowerCase().includes(q) ||
            time?.toLowerCase().includes(q)
        );
    });

    const renderItem = ({ item }) => (
        <VehicleCard item={item} search={search} />
    );

    return (

        <View style={styles.container}>

            <Header title="Vehicles In Parking" showBack={false} />


            <SearchBar value={search} onChange={setSearch} />

            <FlatList
                data={filtered}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <MaterialCommunityIcons name="parking" size={46} color="#94a3b8" />
                        <Text style={styles.emptyText}>No Active Vehicles</Text>
                    </View>
                }
            />

            <View style={styles.checkinBar}>
                <TouchableOpacity
                    style={styles.checkinBtn}
                    onPress={() => navigation.navigate("Checkin")}
                >
                    <MaterialCommunityIcons name="login" size={22} color="#fff" />
                    <Text style={styles.checkinText}>Vehicle IN</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f6f7f8' },
    empty: { alignItems: 'center', marginTop: 80 },
    emptyText: { marginTop: 8, color: '#64748b', fontSize: 14 },
    checkinBar: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: '#fff', padding: 16, borderTopWidth: 1, borderColor: '#e2e8f0' },
    checkinBtn: { backgroundColor: '#137fec', height: 54, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
    checkinText: { color: '#fff', fontSize: 16, fontWeight: '700' }
});