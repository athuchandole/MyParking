//Parking/screens/Checkout.js
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function Checkout({ route, navigation }) {

    const { item } = route.params;

    const entryTime = new Date(item.createdAt);
    const now = new Date();

    const diff = now - entryTime;

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff / (1000 * 60)) % 60);

    const totalHours = Math.max(1, Math.ceil(diff / (1000 * 60 * 60)));

    const amount = totalHours * item.rate;

    return (

        <View style={styles.container}>

            <ScrollView>

                {/* Header */}

                <View style={styles.header}>

                    <TouchableOpacity
                        style={styles.backBtn}
                        onPress={() => navigation.goBack()}
                    >
                        <MaterialCommunityIcons name="arrow-left" size={24} />
                    </TouchableOpacity>

                    <Text style={styles.headerTitle}>
                        Exit Summary
                    </Text>

                </View>


                {/* Vehicle Card */}

                <View style={styles.sectionPadding}>

                    <View style={styles.vehicleCard}>

                        <Image
                            source={{ uri: item.vehicleImage }}
                            style={styles.vehicleImage}
                        />

                        <View style={styles.vehicleOverlay}>
                            <Text style={styles.overlayText}>
                                {item.vehicleType}
                            </Text>
                        </View>

                        <View style={styles.vehicleDetails}>

                            <View>

                                <Text style={styles.vehicleNumber}>
                                    {item.vehicleNumber}
                                </Text>

                                <View style={styles.driverRow}>

                                    <Image
                                        source={{ uri: item.driverImage }}
                                        style={styles.driverImage}
                                    />

                                    <Text style={styles.driverName}>
                                        {item.driverName}
                                    </Text>

                                </View>

                            </View>

                            <View style={styles.activeBadge}>
                                <Text style={styles.activeText}>
                                    ACTIVE
                                </Text>
                            </View>

                        </View>

                    </View>

                </View>


                {/* Receipt */}

                <View style={styles.sectionPadding}>

                    <View style={styles.receiptCard}>

                        <Text style={styles.receiptTitle}>
                            PARKING RECEIPT
                        </Text>

                        <ReceiptRow
                            icon="login"
                            label="Entry Time"
                            value={entryTime.toLocaleString()}
                        />

                        <View style={styles.divider} />

                        <ReceiptRow
                            icon="clock-outline"
                            label="Total Duration"
                            value={`${hours}h ${minutes}m`}
                            highlight
                        />

                        <View style={styles.amountBox}>

                            <View>
                                <Text style={styles.amountLabel}>
                                    Total Amount Due
                                </Text>

                                <Text style={styles.amountValue}>
                                    ₹{amount}.00
                                </Text>
                            </View>

                            <Text style={styles.gstText}>
                                Incl. 18% GST
                            </Text>

                        </View>

                    </View>

                </View>


                {/* Info Box */}

                <View style={styles.sectionPadding}>

                    <View style={styles.infoBox}>

                        <MaterialCommunityIcons
                            name="information-outline"
                            size={22}
                            color="#b45309"
                        />

                        <Text style={styles.infoText}>
                            Once confirmed, the vehicle will be marked as exited
                            and the parking slot will be released for new
                            vehicles. Payment receipt will be sent to the
                            driver's registered mobile number.
                        </Text>

                    </View>

                </View>

            </ScrollView>


            {/* Bottom Action */}

            <View style={styles.bottomBar}>

                <TouchableOpacity style={styles.exitBtn}>

                    <MaterialCommunityIcons
                        name="gate"
                        size={22}
                        color="#fff"
                    />

                    <Text style={styles.exitText}>
                        Confirm Vehicle OUT
                    </Text>

                </TouchableOpacity>

                <Text style={styles.terminalText}>
                    Terminal ID: T4-SOUTH-EXIT • ID: 8829-XJ
                </Text>

            </View>

        </View>

    );
}


function ReceiptRow({ icon, label, value, highlight }) {

    return (
        <View style={styles.receiptRow}>

            <View style={styles.rowLeft}>
                <MaterialCommunityIcons
                    name={icon}
                    size={18}
                    color="#64748b"
                />
                <Text style={styles.rowLabel}>
                    {label}
                </Text>
            </View>

            <Text
                style={[
                    styles.rowValue,
                    highlight && { color: '#137fec', fontWeight: '700' }
                ]}
            >
                {value}
            </Text>

        </View>
    );
}


const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#f6f7f8'
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderColor: '#f1f5f9'
    },

    backBtn: {
        height: 40,
        width: 40,
        justifyContent: 'center',
        alignItems: 'center'
    },

    headerTitle: {
        flex: 1,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '700',
        marginRight: 40
    },

    sectionPadding: {
        padding: 16
    },

    vehicleCard: {
        backgroundColor: '#fff',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        overflow: 'hidden'
    },

    vehicleImage: {
        width: '100%',
        height: 180
    },

    vehicleOverlay: {
        position: 'absolute',
        bottom: 10,
        left: 10,
        backgroundColor: 'rgba(255,255,255,0.9)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6
    },

    overlayText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#137fec'
    },

    vehicleDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 14
    },

    vehicleNumber: {
        fontSize: 20,
        fontWeight: '800'
    },

    driverRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6
    },

    driverImage: {
        width: 32,
        height: 32,
        borderRadius: 20,
        marginRight: 8
    },

    driverName: {
        fontSize: 14,
        color: '#64748b'
    },

    activeBadge: {
        backgroundColor: '#e0f2fe',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20
    },

    activeText: {
        color: '#137fec',
        fontWeight: '700',
        fontSize: 12
    },

    receiptCard: {
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 18,
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: '#e2e8f0'
    },

    receiptTitle: {
        fontSize: 11,
        fontWeight: '800',
        color: '#94a3b8',
        marginBottom: 16,
        letterSpacing: 1
    },

    receiptRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 14
    },

    rowLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6
    },

    rowLabel: {
        fontSize: 14,
        color: '#64748b'
    },

    rowValue: {
        fontWeight: '600'
    },

    divider: {
        borderTopWidth: 1,
        borderColor: '#e2e8f0',
        marginVertical: 10
    },

    amountBox: {
        marginTop: 20,
        borderTopWidth: 1,
        borderColor: '#e2e8f0',
        paddingTop: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end'
    },

    amountLabel: {
        fontSize: 12,
        color: '#64748b'
    },

    amountValue: {
        fontSize: 32,
        fontWeight: '900'
    },

    gstText: {
        fontSize: 10,
        color: '#94a3b8'
    },

    infoBox: {
        flexDirection: 'row',
        backgroundColor: '#fffbeb',
        borderWidth: 1,
        borderColor: '#fde68a',
        padding: 14,
        borderRadius: 12
    },

    infoText: {
        fontSize: 12,
        marginLeft: 8,
        flex: 1,
        color: '#92400e'
    },

    bottomBar: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: '#fff',
        padding: 16,
        borderTopWidth: 1,
        borderColor: '#f1f5f9'
    },

    exitBtn: {
        height: 56,
        backgroundColor: '#dc2626',
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8
    },

    exitText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '800'
    },

    terminalText: {
        textAlign: 'center',
        marginTop: 8,
        fontSize: 11,
        color: '#94a3b8'
    }

});