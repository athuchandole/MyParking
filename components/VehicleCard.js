//Parking/components/VehicleCard.js

import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function VehicleCard({ item, search }) {

    const navigation = useNavigation();

    const created = new Date(item.createdAt);

    const time = created.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    });

    const date = created.toLocaleDateString();

    const [duration, setDuration] = useState('');

    const pulse = useRef(new Animated.Value(1)).current;

    const vehicleIcon =
        item.vehicleType === 'bike'
            ? 'bike'
            : item.vehicleType === 'auto'
                ? 'rickshaw'
                : 'car';

    const vehicleColor =
        item.vehicleType === 'bike'
            ? '#22c55e'
            : item.vehicleType === 'auto'
                ? '#f59e0b'
                : '#2563eb';

    useEffect(() => {

        const updateTimer = () => {

            const now = new Date();
            const diff = now - created;

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const secs = Math.floor((diff % (1000 * 60)) / 1000);

            if (hours > 0)
                setDuration(`${hours}h ${mins}m ${secs}s`);
            else
                setDuration(`${mins}m ${secs}s`);
        };

        updateTimer();

        const interval = setInterval(updateTimer, 1000);

        Animated.loop(
            Animated.sequence([
                Animated.timing(pulse, {
                    toValue: 1.4,
                    duration: 800,
                    useNativeDriver: true
                }),
                Animated.timing(pulse, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true
                })
            ])
        ).start();

        return () => clearInterval(interval);

    }, []);

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

                    {/* Driver Image */}
                    <View style={styles.imageBox}>

                        {item.driverImage ? (
                            <Image
                                source={{ uri: item.driverImage }}
                                style={styles.image}
                            />
                        ) : (
                            <MaterialCommunityIcons
                                name="account-circle"
                                size={44}
                                color="#94a3b8"
                            />
                        )}

                        {/* Vehicle badge */}
                        <View style={[styles.vehicleBadge, { backgroundColor: vehicleColor }]}>
                            <MaterialCommunityIcons
                                name={vehicleIcon}
                                size={16}
                                color="#fff"
                            />
                        </View>

                    </View>

                    <View style={styles.content}>

                        <View style={styles.header}>

                            <View>

                                <Text style={styles.vehicleNumber}>
                                    {highlight(item.vehicleNumber)}
                                </Text>

                                <Text style={styles.vehicleType}>
                                    {highlight(item.vehicleType)}
                                </Text>

                            </View>

                            {/* Active Indicator */}
                            <View style={styles.statusBox}>

                                <Animated.View
                                    style={[
                                        styles.activeDot,
                                        { transform: [{ scale: pulse }] }
                                    ]}
                                />


                                <Text style={styles.activeText}>
                                    Active
                                </Text>

                            </View>

                        </View>

                        <View style={styles.infoRow}>
                            <MaterialCommunityIcons name="account-outline" size={16} color="#64748b" />
                            <Text style={styles.driverName}>
                                {highlight(item.driverName)}
                            </Text>
                        </View>

                        <View style={styles.infoRow}>
                            <MaterialCommunityIcons name="phone-outline" size={16} color="#64748b" />
                            <Text style={styles.infoText}>
                                {highlight(item.phoneNumber)}
                            </Text>
                        </View>

                        <View style={styles.infoRow}>
                            <MaterialCommunityIcons name="calendar-outline" size={16} color="#64748b" />
                            <Text style={styles.infoText}>
                                {highlight(date)}
                            </Text>
                        </View>

                        <View style={styles.bottomRow}>

                            <View style={styles.infoRow}>
                                <MaterialCommunityIcons name="clock-outline" size={16} color="#64748b" />
                                <Text style={styles.infoText}>
                                    {highlight(time)}
                                </Text>
                            </View>

                            {/* Live Parking Timer */}
                            <View style={styles.duration}>
                                <MaterialCommunityIcons
                                    name="timer-outline"
                                    size={14}
                                    color="#f59e0b"
                                />
                                <Text style={styles.durationText}>
                                    {duration}
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
        borderRadius: 14,
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
        height: 100,
        backgroundColor: '#f1f5f9',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative'
    },

    image: {
        width: '100%',
        height: '100%'
    },

    vehicleBadge: {
        position: 'absolute',
        bottom: 6,
        right: 6,
        padding: 5,
        borderRadius: 14
    },

    content: {
        flex: 1,
        padding: 12
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    vehicleNumber: {
        fontSize: 19,
        fontWeight: '800',
        color: '#0f172a'
    },

    vehicleType: {
        fontSize: 12,
        color: '#64748b',
        marginTop: 2,
        textTransform: 'capitalize'
    },

    statusBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4
    },

    activeDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#22c55e'
    },

    activeText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#16a34a'
    },

    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 6
    },

    driverName: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1e293b'
    },

    infoText: {
        fontSize: 13,
        color: '#475569'
    },

    bottomRow: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    rate: {
        backgroundColor: '#eff6ff',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 6
    },

    rateText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#2563eb'
    },

    duration: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#fff7ed',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6
    },

    durationText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#f59e0b'
    },

    highlight: {
        backgroundColor: '#fde047',
        fontWeight: '700'
    }

});