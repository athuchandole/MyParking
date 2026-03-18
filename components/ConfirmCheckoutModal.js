// Parking/components/ConfirmCheckoutModal.js

import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function ConfirmCheckoutModal({ visible, onClose, onConfirm }) {
    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.modalBox}>

                    <Text style={styles.title}>Confirm Checkout</Text>
                    <Text style={styles.message}>
                        Are you sure you want to checkout this vehicle?
                    </Text>

                    <View style={styles.actions}>
                        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                            <Text style={styles.closeText}>Close</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.confirmBtn} onPress={onConfirm}>
                            <Text style={styles.confirmText}>Checkout</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center"
    },
    modalBox: {
        width: "85%",
        backgroundColor: "#fff",
        borderRadius: 14,
        padding: 20
    },
    title: {
        fontSize: 18,
        fontWeight: "800",
        marginBottom: 8,
        color: "#111"
    },
    message: {
        fontSize: 14,
        color: "#64748b",
        marginBottom: 20
    },
    actions: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 10
    },
    closeBtn: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        backgroundColor: "#e2e8f0"
    },
    closeText: {
        fontWeight: "700",
        color: "#334155"
    },
    confirmBtn: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        backgroundColor: "#dc2626"
    },
    confirmText: {
        color: "#fff",
        fontWeight: "800"
    }
});