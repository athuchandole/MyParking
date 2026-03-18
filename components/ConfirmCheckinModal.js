// Parking/components/ConfirmCheckinModal.js

import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ConfirmCheckinModal = ({ visible, onClose, onConfirm, driverName, vehicleNumber, rate, vehicleType }) => {
    // helper to get icon name based on vehicle type
    const getVehicleIcon = () => {
        if (vehicleType === 'bike') return 'bike';
        if (vehicleType === 'auto') return 'rickshaw';
        return 'car';
    };

    return (
        <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
            <View style={styles.overlay}>
                <View style={styles.modalBox}>

                    <Text style={styles.title}>Confirm Vehicle IN</Text>

                    {/* Big Vehicle Icon */}
                    <View style={styles.iconBox}>
                        <MaterialCommunityIcons name={getVehicleIcon()} size={80} color="#137fec" />
                    </View>

                    {/* Driver & Vehicle */}
                    <View style={styles.centerBox}>
                        <Text style={styles.name}>{driverName}</Text>
                        <View style={styles.plateBox}>
                            <Text style={styles.plate}>{vehicleNumber}</Text>
                        </View>
                        <Text style={styles.vehicleTypeText}>{vehicleType?.toUpperCase()}</Text>
                    </View>

                    {/* Small Rate */}
                    <View style={styles.amountBox}>
                        <Text style={styles.amountLabel}>Rate</Text>
                        <Text style={styles.amount}>₹{rate}</Text>
                    </View>

                    <Text style={styles.message}>Confirm entry and notify driver via WhatsApp.</Text>

                    <View style={styles.actions}>
                        <TouchableOpacity style={styles.cancelBtn} onPress={onClose} activeOpacity={0.8}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.confirmBtn} onPress={onConfirm} activeOpacity={0.9}>
                            <Text style={styles.confirmText}>Check-In</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
        </Modal>
    );
};

export default React.memo(ConfirmCheckinModal);

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
    modalBox: { width: "88%", backgroundColor: "#fff", borderRadius: 18, padding: 22, elevation: 5 },
    title: { fontSize: 20, fontWeight: "900", textAlign: "center", marginBottom: 18, color: "#111" },
    iconBox: { alignItems: "center", marginBottom: 16 },
    centerBox: { alignItems: "center", marginBottom: 12 },
    name: { fontSize: 18, fontWeight: "800", color: "#111", marginBottom: 6 },
    plateBox: { backgroundColor: "#f1f5f9", paddingHorizontal: 14, paddingVertical: 6, borderRadius: 8, marginBottom: 6 },
    plate: { fontSize: 15, fontWeight: "800", letterSpacing: 2 },
    vehicleTypeText: { fontSize: 16, fontWeight: "700", color: "#137fec", marginTop: 4 },
    amountBox: { alignItems: "center", marginVertical: 8 },
    amountLabel: { fontSize: 12, color: "#64748b", marginBottom: 2 },
    amount: { fontSize: 18, fontWeight: "600", color: "#374151" },
    message: { fontSize: 13, textAlign: "center", color: "#92400e", backgroundColor: "#fffbeb", borderWidth: 1, borderColor: "#fde68a", padding: 12, borderRadius: 10, marginBottom: 20 },
    actions: { flexDirection: "row", justifyContent: "space-between" },
    cancelBtn: { flex: 1, marginRight: 8, paddingVertical: 12, borderRadius: 10, backgroundColor: "#e2e8f0", alignItems: "center" },
    cancelText: { fontWeight: "700", color: "#334155" },
    confirmBtn: { flex: 1, marginLeft: 8, paddingVertical: 12, borderRadius: 10, backgroundColor: "#137fec", alignItems: "center" },
    confirmText: { color: "#fff", fontWeight: "900" }
});