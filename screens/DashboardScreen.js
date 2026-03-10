//Parking/screens/DashboardScreen.js
import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Alert } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import Header from "../components/Header";
import { getCheckins, deleteCheckin } from "../storage/CheckinStorage";

export default function DashboardScreen({ navigation }) {

    const [list, setList] = useState([]);
    const [search, setSearch] = useState("");

    const load = async () => {
        const data = await getCheckins();
        setList(data);
    };

    useFocusEffect(useCallback(() => { load(); }, []));

    const remove = async (id) => {
        Alert.alert("Delete Entry", "Are you sure?", [
            { text: "Cancel" },
            {
                text: "Delete", style: "destructive", onPress: async () => {
                    await deleteCheckin(id);
                    load();
                }
            }
        ]);
    };

    const filtered = list.filter(v => {
        const q = search.toLowerCase();
        return v.vehicleNumber?.toLowerCase().includes(q) || v.driverName?.toLowerCase().includes(q);
    });

    const renderItem = ({ item }) => {

        const entryTime = new Date(item.createdAt).toLocaleString();

        return (

            <View style={styles.card}>

                <View style={styles.left}>

                    <Text style={styles.vehicle}>{item.vehicleNumber}</Text>

                    <View style={styles.row}>
                        <MaterialCommunityIcons name="account-outline" size={16} color="#64748b" />
                        <Text style={styles.text}>{item.driverName}</Text>
                    </View>

                    <View style={styles.row}>
                        <MaterialCommunityIcons name="clock-outline" size={16} color="#64748b" />
                        <Text style={styles.text}>{entryTime}</Text>
                    </View>

                </View>

                <View style={styles.right}>

                    <View style={[styles.badge, { backgroundColor: item.status === "active" ? "#dcfce7" : "#fee2e2" }]}>
                        <Text style={[styles.badgeText, { color: item.status === "active" ? "#16a34a" : "#dc2626" }]}>
                            {item.status.toUpperCase()}
                        </Text>
                    </View>

                    <TouchableOpacity style={styles.deleteBtn} onPress={() => remove(item.id)}>
                        <MaterialCommunityIcons name="delete-outline" size={22} color="#dc2626" />
                    </TouchableOpacity>

                </View>

            </View>
        );
    };

    return (

        <View style={styles.container}>

            <Header title="Parking Dashboard" navigation={navigation} />

            <View style={styles.searchBar}>
                <MaterialCommunityIcons name="magnify" size={20} color="#64748b" />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search vehicle / driver"
                    value={search}
                    onChangeText={setSearch}
                />
            </View>

            <FlatList
                data={filtered}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <MaterialCommunityIcons name="database-off-outline" size={46} color="#94a3b8" />
                        <Text style={styles.emptyText}>No parking records</Text>
                    </View>
                }
            />

        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f6f7f8" },
    searchBar: { margin: 16, marginTop: 8, backgroundColor: "#fff", borderRadius: 12, borderWidth: 1, borderColor: "#e2e8f0", flexDirection: "row", alignItems: "center", paddingHorizontal: 12, height: 46 },
    searchInput: { flex: 1, fontSize: 14, marginLeft: 6 },
    card: { backgroundColor: "#fff", borderRadius: 12, borderWidth: 1, borderColor: "#e2e8f0", padding: 14, marginBottom: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    left: { flex: 1 },
    vehicle: { fontSize: 17, fontWeight: "800" },
    row: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 6 },
    text: { fontSize: 13, color: "#64748b" },
    right: { alignItems: "flex-end", gap: 10 },
    badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    badgeText: { fontSize: 11, fontWeight: "700" },
    deleteBtn: { padding: 6 },
    empty: { alignItems: "center", marginTop: 80 },
    emptyText: { marginTop: 8, color: "#64748b", fontSize: 14 }
});