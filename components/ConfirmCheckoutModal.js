// components/ConfirmCheckoutModal.js

import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

/**
 * NOTE:
 * - No self import
 * - No barrel (index.js) import
 * - Pure standalone component (prevents require cycle)
 */

const ConfirmCheckoutModal = ({
    visible,
    onClose,
    onConfirm,
    name,
    vehicleNumber,
    amount
}) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            statusBarTranslucent
        >
            <View style={styles.overlay}>
                <View style={styles.modalBox}>

                    {/* Title */}
                    <Text style={styles.title}>Confirm Checkout</Text>

                    {/* Center Info */}
                    <View style={styles.centerBox}>
                        <Text style={styles.name}>{name}</Text>

                        <View style={styles.plateBox}>
                            <Text style={styles.plate}>{vehicleNumber}</Text>
                        </View>
                    </View>

                    {/* Amount */}
                    <View style={styles.amountBox}>
                        <Text style={styles.amountLabel}>Total Amount</Text>
                        <Text style={styles.amount}>₹{amount}</Text>
                    </View>

                    {/* Info */}
                    <Text style={styles.message}>
                        Collect payment and complete vehicle checkout
                    </Text>

                    {/* Buttons */}
                    <View style={styles.actions}>
                        <TouchableOpacity
                            style={styles.cancelBtn}
                            onPress={onClose}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.checkoutBtn}
                            onPress={onConfirm}
                            activeOpacity={0.9}
                        >
                            <Text style={styles.checkoutText}>Checkout</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
        </Modal>
    );
};

export default React.memo(ConfirmCheckoutModal); // ✅ prevents unnecessary re-renders

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center"
    },

    modalBox: {
        width: "88%",
        backgroundColor: "#fff",
        borderRadius: 18,
        padding: 22,
        elevation: 5
    },

    title: {
        fontSize: 20,
        fontWeight: "900",
        textAlign: "center",
        marginBottom: 18,
        color: "#111"
    },

    centerBox: {
        alignItems: "center",
        marginBottom: 18
    },

    name: {
        fontSize: 18,
        fontWeight: "800",
        color: "#111",
        marginBottom: 8
    },

    plateBox: {
        backgroundColor: "#f1f5f9",
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 8
    },

    plate: {
        fontSize: 15,
        fontWeight: "800",
        letterSpacing: 2
    },

    amountBox: {
        alignItems: "center",
        marginVertical: 16
    },

    amountLabel: {
        fontSize: 12,
        color: "#64748b",
        marginBottom: 4
    },

    amount: {
        fontSize: 40,
        fontWeight: "900",
        color: "#16a34a"
    },

    message: {
        fontSize: 13,
        textAlign: "center",
        color: "#92400e",
        backgroundColor: "#fffbeb",
        borderWidth: 1,
        borderColor: "#fde68a",
        padding: 12,
        borderRadius: 10,
        marginBottom: 20
    },

    actions: {
        flexDirection: "row",
        justifyContent: "space-between"
    },

    cancelBtn: {
        flex: 1,
        marginRight: 8,
        paddingVertical: 12,
        borderRadius: 10,
        backgroundColor: "#e2e8f0",
        alignItems: "center"
    },

    cancelText: {
        fontWeight: "700",
        color: "#334155"
    },

    checkoutBtn: {
        flex: 1,
        marginLeft: 8,
        paddingVertical: 12,
        borderRadius: 10,
        backgroundColor: "#dc2626",
        alignItems: "center"
    },

    checkoutText: {
        color: "#fff",
        fontWeight: "900"
    }
});