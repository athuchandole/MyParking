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
                        <Image
                            source={item.driverImage ? { uri: item.driverImage } : require('../assets/app-icon.png')}
                            style={styles.image}
                        />
                        {/* Vehicle Icon Badge */}
                        <View style={[styles.vehicleBadge, { backgroundColor: vehicleColor }]}>
                            <MaterialCommunityIcons
                                name={vehicleIcon}
                                size={20}
                                color="#fff"
                            />
                        </View>
                    </View>

                    <View style={styles.content}>

                        <View style={styles.header}>
                            <Text style={styles.vehicleNumber}>
                                {highlight(item.vehicleNumber)}
                            </Text>

                            {/* Active Indicator */}
                            <View style={styles.statusBox}>
                                <Animated.View
                                    style={[
                                        styles.activeDot,
                                        { transform: [{ scale: pulse }] }
                                    ]}
                                />
                                <Text style={styles.activeText}>Active</Text>
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
        backgroundColor: '#ecf5fd',
        borderRadius: 16,
        marginBottom: 14,
        overflow: 'hidden'
    },

    row: {
        flexDirection: 'row',
        padding: 12
    },

    imageBox: {
        width: 100,
        height: 110,
        borderRadius: 16,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        backgroundColor: '#e2e8f0'
    },

    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover'
    },

    vehicleBadge: {
        position: 'absolute',
        bottom: 6,
        right: 6,
        padding: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#fff'
    },

    content: {
        flex: 1,
        paddingLeft: 14,
        justifyContent: 'center'
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    vehicleNumber: {
        fontSize: 20,
        fontWeight: '800',
        color: '#0f172a'
    },

    statusBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4
    },

    activeDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
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
        marginTop: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    rate: {
        backgroundColor: '#e0f2fe',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8
    },

    rateText: {
        fontSize: 13,
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
        borderRadius: 8
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