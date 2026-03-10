//Parking/components/VehicleCard.js
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function VehicleCard({ item, search }) {

    const navigation = useNavigation();

    const time = new Date(item.createdAt).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    });

    const vehicleIcon =
        item.vehicleType === 'bike'
            ? 'bike'
            : item.vehicleType === 'auto'
                ? 'rickshaw'
                : 'car';

    const highlight = (text) => {

        if (!search) return <Text>{text}</Text>;

        const q = search.toLowerCase();
        const parts = text.toString().split(new RegExp(`(${q})`, 'gi'));

        return (
            <Text>
                {parts.map((part, i) =>
                    part.toLowerCase() === q ? (
                        <Text key={i} style={styles.highlight}>{part}</Text>
                    ) : (
                        <Text key={i}>{part}</Text>
                    )
                )}
            </Text>
        );
    };

    return (

        <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigation.navigate('Checkout', { item })}
        >

            <View style={styles.card}>

                <View style={styles.row}>

                    <View style={styles.imageBox}>
                        {item.vehicleImage ? (
                            <Image
                                source={{ uri: item.vehicleImage }}
                                style={styles.image}
                            />
                        ) : (
                            <MaterialCommunityIcons
                                name="car"
                                size={36}
                                color="#94a3b8"
                            />
                        )}
                    </View>

                    <View style={styles.content}>

                        <View style={styles.header}>

                            <View>
                                <Text style={styles.vehicleNumber}>
                                    {highlight(item.vehicleNumber)}
                                </Text>

                                <View style={styles.vehicleTypeRow}>
                                    <MaterialCommunityIcons
                                        name={vehicleIcon}
                                        size={15}
                                        color="#64748b"
                                    />
                                    <Text style={styles.vehicleType}>
                                        {highlight(item.vehicleType)}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>Active</Text>
                            </View>

                        </View>

                        <View style={styles.infoRow}>
                            <MaterialCommunityIcons name="account-outline" size={16} color="#64748b" />
                            <Text style={styles.infoText}>
                                {highlight(item.driverName)}
                            </Text>
                        </View>

                        <View style={styles.infoRow}>
                            <MaterialCommunityIcons name="phone-outline" size={16} color="#64748b" />
                            <Text style={styles.infoText}>
                                {highlight(item.phoneNumber)}
                            </Text>
                        </View>

                        <View style={styles.bottomRow}>

                            <View style={styles.infoRow}>
                                <MaterialCommunityIcons name="clock-outline" size={16} color="#64748b" />
                                <Text style={styles.infoText}>
                                    {highlight(time)}
                                </Text>
                            </View>

                            <View style={styles.rate}>
                                <Text style={styles.rateText}>
                                    ₹{highlight(item.rate)}
                                </Text>
                            </View>

                        </View>

                    </View>

                </View>

            </View>

        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({

    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        overflow: 'hidden',
        marginBottom: 12
    },

    row: {
        flexDirection: 'row'
    },

    imageBox: {
        width: 90,
        height: 90,
        backgroundColor: '#f1f5f9',
        justifyContent: 'center',
        alignItems: 'center'
    },

    image: {
        width: '100%',
        height: '100%'
    },

    content: {
        flex: 1,
        padding: 12
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    vehicleNumber: {
        fontSize: 18,
        fontWeight: '700'
    },

    vehicleTypeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4
    },

    vehicleType: {
        fontSize: 12,
        color: '#64748b'
    },

    badge: {
        backgroundColor: '#dcfce7',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 10
    },

    badgeText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#16a34a'
    },

    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 6
    },

    infoText: {
        fontSize: 13,
        color: '#475569'
    },

    bottomRow: {
        marginTop: 8,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    rate: {
        backgroundColor: '#eff6ff',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6
    },

    rateText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#2563eb'
    },

    highlight: {
        backgroundColor: '#fde047',
        fontWeight: '700'
    }

});