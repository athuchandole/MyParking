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
    const amount = totalHours * item.rate;

    return (

        <View style={styles.container}>

            <Header title="Parking Bill" navigation={navigation} />

            <ScrollView>

                <View style={styles.section}>

                    <View style={styles.vehicleCard}>

                        <Image source={{ uri: item.vehicleImage }} style={styles.vehicleImage} />

                        <View style={styles.overlay}>
                            <Text style={styles.overlayText}>{item.vehicleType}</Text>
                        </View>

                        <View style={styles.details}>

                            <View>
                                <Text style={styles.number}>{item.vehicleNumber}</Text>

                                <View style={styles.driverRow}>
                                    <Image source={{ uri: item.driverImage }} style={styles.driverImage} />
                                    <Text style={styles.driver}>{item.driverName}</Text>
                                </View>

                            </View>

                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>INACTIVE</Text>
                            </View>

                        </View>

                    </View>

                </View>

                <View style={styles.section}>

                    <View style={styles.receipt}>

                        <Text style={styles.title}>PARKING RECEIPT</Text>

                        <Row icon="login" label="Entry Time" value={entry.toLocaleString()} />
                        <Row icon="logout" label="Exit Time" value={exit.toLocaleString()} />

                        <View style={styles.divider} />

                        <Row icon="clock-outline" label="Duration" value={`${hrs}h ${mins}m`} highlight />

                        <View style={styles.amountBox}>
                            <View>
                                <Text style={styles.amountLabel}>Total Amount</Text>
                                <Text style={styles.amount}>₹{amount}.00</Text>
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
    vehicleCard: { backgroundColor: "#fff", borderRadius: 14, overflow: "hidden", borderWidth: 1, borderColor: "#e2e8f0" },
    vehicleImage: { width: "100%", height: 180 },
    overlay: { position: "absolute", bottom: 10, left: 10, backgroundColor: "rgba(255,255,255,0.9)", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
    overlayText: { fontSize: 11, fontWeight: "700", color: "#137fec" },
    details: { flexDirection: "row", justifyContent: "space-between", padding: 14 },
    number: { fontSize: 20, fontWeight: "800" },
    driverRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
    driverImage: { width: 32, height: 32, borderRadius: 20, marginRight: 8 },
    driver: { fontSize: 14, color: "#64748b" },
    badge: { backgroundColor: "#fee2e2", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
    badgeText: { color: "#dc2626", fontWeight: "700", fontSize: 12 },
    receipt: { backgroundColor: "#fff", borderRadius: 14, padding: 18, borderWidth: 2, borderStyle: "dashed", borderColor: "#e2e8f0" },
    title: { fontSize: 11, fontWeight: "800", color: "#94a3b8", marginBottom: 16, letterSpacing: 1 },
    row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 14 },
    label: { fontSize: 14, color: "#64748b" },
    value: { fontWeight: "600" },
    divider: { borderTopWidth: 1, borderColor: "#e2e8f0", marginVertical: 10 },
    amountBox: { marginTop: 20, borderTopWidth: 1, borderColor: "#e2e8f0", paddingTop: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
    amountLabel: { fontSize: 12, color: "#64748b" },
    amount: { fontSize: 32, fontWeight: "900" },
    gst: { fontSize: 10, color: "#94a3b8" }
});