// Parking/screens/Checkout.js

import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert, Animated, Easing, Linking } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Header from "../components/Header";
import { checkoutVehicle } from "../storage/CheckinStorage";
import ConfirmCheckoutModal from "../components/ConfirmCheckoutModal";
import { getMessageTemplates } from "../storage/MessageTemplateStorage";

export default function Checkout({ route, navigation }) {

    const { item } = route.params;
    const [showModal, setShowModal] = useState(false);

    const entryTime = new Date(item.createdAt);
    const endTime = item.checkoutAt ? new Date(item.checkoutAt) : new Date();

    const diff = endTime - entryTime;

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff / (1000 * 60)) % 60);

    const totalHours = Math.max(1, Math.ceil(diff / (1000 * 60 * 60)));

    const rate = Number(item.rate || 0);
    const perHours = Number(item.perHours || 1);

    const billableBlocks = Math.ceil(totalHours / perHours);
    const amount = billableBlocks * rate;

    const goHome = () => {
        navigation.reset({ index: 0, routes: [{ name: "Home" }] });
    };

    // ✅ WhatsApp logic (copied EXACT behavior)
    const replaceVars = (template, data) => {
        let msg = template;
        Object.keys(data).forEach(key => {
            msg = msg.replaceAll(`@${key}`, data[key] ?? "");
        });
        return msg;
    };

    const shareOnWhatsApp = async () => {
        try {

            const entry = new Date(item.createdAt);
            const exit = new Date();

            const diff = exit - entry;

            const hrs = Math.floor(diff / (1000 * 60 * 60));
            const mins = Math.floor((diff / (1000 * 60)) % 60);

            const totalHours = Math.max(1, Math.ceil(diff / (1000 * 60 * 60)));
            const billableBlocks = Math.ceil(totalHours / perHours);
            const amount = billableBlocks * rate;

            const duration = `${hrs}h ${mins}m`;

            const templates = await getMessageTemplates();

            const data = {
                vehicleNumber: item.vehicleNumber,
                driverName: item.driverName,
                phoneNumber: item.phoneNumber || "",
                vehicleType: item.vehicleType,
                rate: item.rate,
                entryTime: entry.toLocaleString(),
                exitTime: exit.toLocaleString(),
                duration: duration,
                billableHours: billableBlocks,
                amount: amount
            };

            const template = templates.inactive;

            const message = replaceVars(template, data);

            let phone = item.phoneNumber ? item.phoneNumber.replace(/[^0-9]/g, "") : "";

            let url = "";

            if (phone.length === 10) {
                const fullNumber = `91${phone}`;
                url = `whatsapp://send?phone=${fullNumber}&text=${encodeURIComponent(message)}`;
            } else {
                url = `whatsapp://send?text=${encodeURIComponent(message)}`;
            }

            const supported = await Linking.canOpenURL(url);

            if (supported) {
                await Linking.openURL(url);
            } else {
                Alert.alert("WhatsApp not installed");
            }

        } catch (e) {
            Alert.alert("Error", "Unable to share receipt");
        }
    };

    // ✅ Only change: wrapped with popup + share
    const confirmExit = async () => {

        setShowModal(false);

        if (item.status === "inactive") {
            Alert.alert("Vehicle already checked out");
            goHome();
            return;
        }

        const success = await checkoutVehicle(item.id);

        if (success) {
            await shareOnWhatsApp(); // ✅ Added
            Alert.alert("Success", "Vehicle marked OUT", [{ text: "OK", onPress: goHome }]);
        } else {
            Alert.alert("Error", "Checkout failed");
        }
    };

    const pulseAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true, easing: Easing.ease }),
                Animated.timing(pulseAnim, { toValue: 0, duration: 800, useNativeDriver: true, easing: Easing.ease }),
            ])
        ).start();
    }, []);

    const pulseStyle = {
        transform: [{ scale: pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.5] }) }],
        opacity: pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0.5] })
    };

    return (
        <View style={styles.container}>
            <ScrollView>
                <Header title="Exit Summary" navigation={navigation} />

                <View style={styles.sectionPadding}>
                    <View style={styles.imageRow}>
                        <View style={styles.imageBox}>
                            <Image source={{ uri: item.driverImage }} style={styles.fullImage} />
                            <View style={styles.imageLabel}>
                                <Text style={styles.imageLabelText}>DRIVER</Text>
                            </View>
                        </View>
                        <View style={styles.imageBox}>
                            <Image source={{ uri: item.vehicleImage }} style={styles.fullImage} />
                            <View style={styles.imageLabel}>
                                <Text style={styles.imageLabelText}>{item.vehicleType}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.sectionPadding}>
                    <View style={styles.infoCard}>
                        <Text style={styles.driverName}>{item.driverName}</Text>

                        <View style={styles.numberPlate}>
                            <Text style={styles.vehicleNumber}>{item.vehicleNumber}</Text>
                        </View>

                        <View style={styles.vehicleTypeRow}>
                            <MaterialCommunityIcons name="car" size={20} color="#137fec" />
                            <Text style={styles.vehicleTypeText}>{item.vehicleType}</Text>
                        </View>

                        <Text style={styles.entryTime}>{entryTime.toLocaleString()}</Text>

                        <View style={styles.statusRow}>
                            {item.status === "active" && <Animated.View style={[styles.activeDot, pulseStyle]} />}
                            <Text style={[styles.statusText, item.status === "active" ? styles.activeText : styles.inactiveText]}>
                                {item.status === "active" ? "ACTIVE PARKING" : "VEHICLE EXITED"}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* ❌ Share button REMOVED (nothing else touched) */}

                <View style={styles.sectionPadding}>
                    <View style={styles.receiptCard}>
                        <Text style={styles.receiptTitle}>PARKING RECEIPT</Text>

                        <ReceiptRow icon="login" label="Entry Time" value={entryTime.toLocaleString()} />
                        <View style={styles.divider} />

                        <ReceiptRow icon="clock-outline" label="Parking Duration" value={`${hours}h ${minutes}m`} highlight />

                        <ReceiptRow icon="cash" label={`Rate / ${perHours} hr`} value={`₹${rate}`} />

                        <ReceiptRow icon="calculator" label="Billable Blocks" value={`${billableBlocks}`} />

                        <View style={styles.divider} />

                        <View style={styles.amountBox}>
                            <View>
                                <Text style={styles.amountLabel}>Total Amount</Text>
                                <Text style={styles.amountValue}>₹{amount}</Text>
                            </View>
                            <Text style={styles.gstText}>Incl. 18% GST</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.sectionPadding}>
                    <View style={styles.infoBox}>
                        <MaterialCommunityIcons name="information-outline" size={22} color="#b45309" />
                        <Text style={styles.infoText}>
                            Once confirmed, the vehicle will be marked as exited and billing will stop.
                        </Text>
                    </View>
                </View>

            </ScrollView>

            <View style={styles.bottomBar}>
                <TouchableOpacity style={styles.exitBtn} onPress={() => setShowModal(true)}>
                    <MaterialCommunityIcons name="gate" size={22} color="#fff" />
                    <Text style={styles.exitText}>Confirm Vehicle OUT</Text>
                </TouchableOpacity>
            </View>

            <ConfirmCheckoutModal
                visible={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={confirmExit}
            />

        </View>
    );
}

// ✅ untouched
function ReceiptRow({ icon, label, value, highlight }) {
    return (
        <View style={styles.receiptRow}>
            <View style={styles.rowLeft}>
                <MaterialCommunityIcons name={icon} size={18} color="#64748b" />
                <Text style={styles.rowLabel}>{label}</Text>
            </View>
            <Text style={[styles.rowValue, highlight && { color: '#137fec', fontWeight: '700' }]}>{value}</Text>
        </View>
    );
}

// ✅ FULL original styles (no change)
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f6f7f8' },
    sectionPadding: { padding: 16 },

    imageRow: { flexDirection: 'row', gap: 12 },
    imageBox: { flex: 1, height: 180, borderRadius: 12, overflow: 'hidden' },
    fullImage: { width: '100%', height: '100%' },
    imageLabel: { position: 'absolute', bottom: 10, left: 10, backgroundColor: 'rgba(255,255,255,0.9)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
    imageLabelText: { fontSize: 11, fontWeight: '700', color: '#137fec' },

    infoCard: { backgroundColor: '#fff', borderRadius: 14, padding: 20, borderWidth: 1, borderColor: "#e2e8f0", shadowColor: '#000', shadowOpacity: 0.08, shadowOffset: { width: 0, height: 4 }, shadowRadius: 8, elevation: 3 },
    driverName: { fontSize: 20, fontWeight: '900', color: '#111', marginBottom: 8 },
    numberPlate: { backgroundColor: '#f0f0f0', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6, marginBottom: 8, alignSelf: 'flex-start' },
    vehicleNumber: { fontSize: 16, fontWeight: '700', letterSpacing: 2 },
    vehicleTypeRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
    vehicleTypeText: { fontSize: 16, fontWeight: '600', color: '#137fec' },
    entryTime: { fontSize: 14, color: '#64748b', marginBottom: 6 },
    statusRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    activeDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#22c55e' },
    statusText: { fontWeight: '700', fontSize: 13 },
    activeText: { color: '#16a34a' },
    inactiveText: { color: '#dc2626' },

    receiptCard: { backgroundColor: '#fff', borderRadius: 14, padding: 18, borderWidth: 2, borderStyle: 'dashed', borderColor: '#e2e8f0' },
    receiptTitle: { fontSize: 11, fontWeight: '800', color: '#94a3b8', marginBottom: 16, letterSpacing: 1 },
    receiptRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 },
    rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    rowLabel: { fontSize: 14, color: '#64748b' },
    rowValue: { fontWeight: '600' },
    divider: { borderTopWidth: 1, borderColor: '#e2e8f0', marginVertical: 10 },
    amountBox: { marginTop: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
    amountLabel: { fontSize: 12, color: '#64748b' },
    amountValue: { fontSize: 32, fontWeight: '900' },
    gstText: { fontSize: 10, color: '#94a3b8' },

    infoBox: { flexDirection: 'row', backgroundColor: '#fffbeb', borderWidth: 1, borderColor: '#fde68a', padding: 14, borderRadius: 12 },
    infoText: { fontSize: 12, marginLeft: 8, flex: 1, color: '#92400e' },

    bottomBar: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: '#fff', padding: 16, borderTopWidth: 1, borderColor: '#f1f5f9' },
    exitBtn: { height: 56, backgroundColor: '#dc2626', borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
    exitText: { color: '#fff', fontSize: 17, fontWeight: '800' }
});