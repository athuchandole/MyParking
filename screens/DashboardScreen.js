//Parking/screens/DashboardScreen.js
import React, { useState, useCallback } from "react";
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

    const remove = (id) => {
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

    const active = list.filter(v => v.status === "active").length;
    const inactive = list.filter(v => v.status === "inactive").length;

    let revenue = 0;
    list.forEach(v => {
        if (v.status === "inactive") {
            const entry = new Date(v.createdAt);
            const exit = new Date(v.checkoutAt);
            const hrs = Math.max(1, Math.ceil((exit - entry) / (1000 * 60 * 60)));
            revenue += hrs * v.rate;
        }
    });

    const openCard = (item) => {
        if (item.status === "active") {
            navigation.navigate("Checkout", { item });
        } else {
            navigation.navigate("BillScreen", { item });
        }
    };

    const renderItem = ({ item }) => {
        const entryTime = new Date(item.createdAt).toLocaleString();
        return (
            <TouchableOpacity onPress={() => openCard(item)} activeOpacity={0.9}>
                <View style={styles.card}>

                    <View style={{ flex: 1 }}>
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

                        <TouchableOpacity onPress={() => remove(item.id)}>
                            <MaterialCommunityIcons name="delete-outline" size={22} color="#dc2626" />
                        </TouchableOpacity>

                    </View>

                </View>
            </TouchableOpacity>
        );
    };

    return (

        <View style={styles.container}>

            <Header title="Parking Dashboard" navigation={navigation} />

            <View style={styles.stats}>

                <View style={styles.statBox}>
                    <Text style={styles.statNumber}>{active}</Text>
                    <Text style={styles.statLabel}>Active</Text>
                </View>

                <View style={styles.statBox}>
                    <Text style={styles.statNumber}>{inactive}</Text>
                    <Text style={styles.statLabel}>Exited</Text>
                </View>

                <View style={styles.statBox}>
                    <Text style={styles.statNumber}>₹{revenue}</Text>
                    <Text style={styles.statLabel}>Revenue</Text>
                </View>

            </View>

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
                keyExtractor={i => i.id}
                renderItem={renderItem}
                contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <MaterialCommunityIcons name="database-off-outline" size={46} color="#94a3b8" />
                        <Text style={styles.emptyText}>No records</Text>
                    </View>
                }
            />

        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f6f7f8" },
    stats: { flexDirection: "row", justifyContent: "space-around", padding: 12 },
    statBox: { backgroundColor: "#fff", padding: 12, borderRadius: 10, alignItems: "center", borderWidth: 1, borderColor: "#e2e8f0", minWidth: 90 },
    statNumber: { fontSize: 18, fontWeight: "800" },
    statLabel: { fontSize: 11, color: "#64748b", marginTop: 3 },
    searchBar: { margin: 16, marginTop: 8, backgroundColor: "#fff", borderRadius: 12, borderWidth: 1, borderColor: "#e2e8f0", flexDirection: "row", alignItems: "center", paddingHorizontal: 12, height: 46 },
    searchInput: { flex: 1, fontSize: 14, marginLeft: 6 },
    card: { backgroundColor: "#fff", borderRadius: 12, borderWidth: 1, borderColor: "#e2e8f0", padding: 14, marginBottom: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    vehicle: { fontSize: 17, fontWeight: "800" },
    row: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 6 },
    text: { fontSize: 13, color: "#64748b" },
    right: { alignItems: "flex-end", gap: 10 },
    badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    badgeText: { fontSize: 11, fontWeight: "700" },
    empty: { alignItems: "center", marginTop: 80 },
    emptyText: { marginTop: 8, color: "#64748b" }
});