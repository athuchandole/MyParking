//Parking/screens/BillScreen.js

import React from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Header from "../components/Header";
import ShareOnWhatsApp from "../components/ShareOnWhatsApp";

export default function BillScreen({ route, navigation }) {

    const { item } = route.params;

    const entry = new Date(item.createdAt);
    const exit = new Date(item.checkoutAt);

    const diff = exit - entry;

    const hrs = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff / (1000 * 60)) % 60);

    const totalHours = Math.max(1, Math.ceil(diff / (1000 * 60 * 60)));

    const rate = Number(item.rate || 0);
    const perHours = Number(item.perHours || 1);

    const billableBlocks = Math.ceil(totalHours / perHours);
    const amount = billableBlocks * rate;

    return (
        <View style={styles.container}>
            <Header title="Parking Bill" navigation={navigation} />
            <ScrollView>

                <View style={styles.section}>
                    <View style={styles.imageRow}>
                        <View style={styles.imageBox}>
                            <Image source={{ uri: item.driverImage }} style={styles.fullImage} />
                        </View>
                        <View style={styles.imageBox}>
                            <Image source={{ uri: item.vehicleImage }} style={styles.fullImage} />
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <View style={styles.infoCard}>
                        <Text style={styles.driverName}>{item.driverName}</Text>

                        <View style={styles.numberPlate}>
                            <Text style={styles.vehicleNumber}>{item.vehicleNumber}</Text>
                        </View>

                        <View style={styles.vehicleTypeRow}>
                            <MaterialCommunityIcons name="car" size={20} color="#137fec" />
                            <Text style={styles.vehicleTypeText}>{item.vehicleType}</Text>
                        </View>

                        <Text style={styles.timeText}>Entry: {entry.toLocaleString()}</Text>
                        <Text style={styles.timeText}>Exit: {exit.toLocaleString()}</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <View style={styles.receipt}>
                        <Text style={styles.title}>PARKING RECEIPT</Text>

                        <Row icon="clock-outline" label="Duration" value={`${hrs}h ${mins}m`} highlight />
                        <Row icon="calculator" label="Billable Blocks" value={`${billableBlocks}`} />
                        <Row icon="cash" label={`Rate / ${perHours} hr`} value={`₹${rate}`} />

                        <View style={styles.amountBox}>
                            <View>
                                <Text style={styles.amountLabel}>Total Amount</Text>
                                <Text style={styles.amount}>₹{amount}</Text>
                            </View>
                            <Text style={styles.gst}>Incl. GST</Text>
                        </View>
                    </View>
                </View>

                <View style={{ padding: 16 }}>
                    <ShareOnWhatsApp item={item} />
                </View>

            </ScrollView>
        </View>
    );
}

function Row({ icon, label, value, highlight }) {
    return (
        <View style={styles.row}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <MaterialCommunityIcons name={icon} size={18} color="#64748b" />
                <Text style={styles.label}>{label}</Text>
            </View>
            <Text style={[styles.value, highlight && { color: "#137fec", fontWeight: "700" }]}>{value}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f6f7f8" },
    section: { padding: 16 },

    imageRow: { flexDirection: 'row', gap: 12 },
    imageBox: { flex: 1, height: 180, borderRadius: 12, overflow: 'hidden' },
    fullImage: { width: '100%', height: '100%' },
    imageLabel: {
        position: 'absolute',
        bottom: 10,
        left: 10,
        backgroundColor: 'rgba(255,255,255,0.9)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6
    },
    imageLabelText: { fontSize: 11, fontWeight: '700', color: '#137fec' },

    infoCard: { backgroundColor: '#fff', borderRadius: 14, padding: 20, borderWidth: 1, borderColor: "#e2e8f0", shadowColor: '#000', shadowOpacity: 0.08, shadowOffset: { width: 0, height: 4 }, shadowRadius: 8, elevation: 3 },
    driverName: { fontSize: 20, fontWeight: '900', color: '#111', marginBottom: 8 },
    numberPlate: { backgroundColor: '#f0f0f0', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6, marginBottom: 8, alignSelf: 'flex-start' },
    vehicleNumber: { fontSize: 16, fontWeight: '700', letterSpacing: 2 },
    vehicleTypeRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
    vehicleTypeText: { fontSize: 16, fontWeight: '600', color: '#137fec' },
    infoTimes: {},
    timeText: { fontSize: 14, color: '#64748b', marginBottom: 2 },

    receipt: { backgroundColor: "#fff", borderRadius: 14, padding: 18, borderWidth: 2, borderStyle: "dashed", borderColor: "#e2e8f0" },
    title: { fontSize: 11, fontWeight: "800", color: "#94a3b8", marginBottom: 16, letterSpacing: 1 },
    row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 14 },
    label: { fontSize: 14, color: "#64748b" },
    value: { fontWeight: "600" },
    amountBox: { marginTop: 20, borderTopWidth: 1, borderColor: "#e2e8f0", paddingTop: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
    amountLabel: { fontSize: 12, color: "#64748b" },
    amount: { fontSize: 32, fontWeight: "900" },
    gst: { fontSize: 10, color: "#94a3b8" }
});