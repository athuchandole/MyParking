//Parking/screens/SettingsScreen.js
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    StyleSheet,
    Linking,
    TextInput,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ParkingRates from '../components/ParkingRates';
import Header from "../components/Header";
import { saveDefaultPlate, getDefaultPlate } from '../storage/DefaultPlateStorage';
import Constants from 'expo-constants';

export default function SettingsScreen({ navigation }) {
    const [defaultPart1, setDefaultPart1] = useState('');
    const [defaultPart2, setDefaultPart2] = useState('');
    const [originalPart1, setOriginalPart1] = useState('');
    const [originalPart2, setOriginalPart2] = useState('');
    const [showSaveButton, setShowSaveButton] = useState(false);

    useEffect(() => {
        const loadDefaultPlate = async () => {
            const plate = await getDefaultPlate();
            if (plate) {
                setDefaultPart1(plate.part1);
                setDefaultPart2(plate.part2);
                setOriginalPart1(plate.part1);
                setOriginalPart2(plate.part2);
            }
        };
        loadDefaultPlate();
    }, []);

    useEffect(() => {
        setShowSaveButton(defaultPart1 !== originalPart1 || defaultPart2 !== originalPart2);
    }, [defaultPart1, defaultPart2, originalPart1, originalPart2]);

    const handleSaveDefaultPlate = async () => {
        const part1 = defaultPart1.toUpperCase();
        const part2 = defaultPart2;
        await saveDefaultPlate({ part1, part2 });
        setOriginalPart1(part1);
        setOriginalPart2(part2);
        setShowSaveButton(false);
        alert('Default Plate saved!');
    };

    const renderArrow = () => <MaterialCommunityIcons name="chevron-right" size={22} color="#94a3b8" />;

    return (
        <View style={styles.container}>
            <Header title="Settings" navigation={navigation} showBack={false} />
            <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>

                {/* App Info */}
                <View style={styles.section}>
                    <View style={styles.centered}>
                        <Image source={require('../assets/app-icon.png')} style={styles.appIcon} />
                        <Text style={styles.appName}>Advanced Parking App</Text>
                        <Text style={styles.appVersion}>v{Constants.manifest?.version || '1.0.0'}</Text>
                        <Text style={styles.appSubtitle}>Manage your parking efficiently</Text>
                    </View>
                </View>

                {/* Default Plate */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Default Vehicle Plate</Text>
                    <Text style={styles.sectionSubtitle}>Automatically prefill your most used vehicle plate.</Text>
                    <View style={styles.card}>
                        <View style={styles.plateRow}>
                            <TextInput
                                style={styles.plateInput}
                                value={defaultPart1}
                                maxLength={2}
                                autoCapitalize="characters"
                                onChangeText={setDefaultPart1}
                                placeholder="AA"
                            />
                            <TextInput
                                style={styles.plateInput}
                                value={defaultPart2}
                                maxLength={2}
                                keyboardType="numeric"
                                onChangeText={setDefaultPart2}
                                placeholder="00"
                            />
                        </View>
                        {showSaveButton && (
                            <TouchableOpacity style={styles.submitButton} onPress={handleSaveDefaultPlate}>
                                <Text style={styles.submitText}>Save Default Plate</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {/* Parking Rates */}
                <View style={styles.section}>
                    <View style={styles.headerRow}>
                        <Text style={styles.sectionTitle}>Parking Rates (per hour)</Text>
                        <Text style={styles.editTag}>EDITABLE</Text>
                    </View>
                    <ParkingRates />
                </View>

                {/* WhatsApp Message */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>WhatsApp Message</Text>
                    <Text style={styles.sectionSubtitle}>Send automated messages via WhatsApp.</Text>
                    <View style={styles.card}>
                        <TouchableOpacity style={styles.row} onPress={() => navigation.navigate("EditMessage")}>
                            <View style={styles.left}>
                                <View style={styles.iconBox}>
                                    <MaterialCommunityIcons name="whatsapp" size={20} color="#137fec" />
                                </View>
                                <Text style={styles.label}>Edit WhatsApp Message</Text>
                            </View>
                            {renderArrow()}
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Legal / About */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Legal & About</Text>
                    <View style={styles.card}>
                        <TouchableOpacity style={styles.row} onPress={() => Linking.openURL('https://example.com/privacy')}>
                            <View style={styles.left}>
                                <View style={styles.iconBox}>
                                    <MaterialCommunityIcons name="shield-lock" size={20} color="#137fec" />
                                </View>
                                <Text style={styles.label}>Privacy Policy</Text>
                            </View>
                            {renderArrow()}
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.row, { marginTop: 12 }]} onPress={() => Linking.openURL('https://example.com/terms')}>
                            <View style={styles.left}>
                                <View style={styles.iconBox}>
                                    <MaterialCommunityIcons name="file-document" size={20} color="#137fec" />
                                </View>
                                <Text style={styles.label}>Terms of Service</Text>
                            </View>
                            {renderArrow()}
                        </TouchableOpacity>

                        <View style={styles.divider} />

                        <View style={styles.row}>
                            <View style={styles.left}>
                                <View style={styles.iconBox}>
                                    <MaterialCommunityIcons name="information" size={20} color="#137fec" />
                                </View>
                                <Text style={styles.label}>App Version</Text>
                            </View>
                            <Text style={styles.versionText}>{Constants.manifest?.version || '1.0.0'}</Text>
                        </View>
                    </View>
                </View>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f6f7f8' },
    section: { marginTop: 20, paddingHorizontal: 16 },
    sectionTitle: { fontSize: 14, fontWeight: '700', color: '#374151', marginBottom: 4 },
    sectionSubtitle: { fontSize: 12, color: '#6b7280', marginBottom: 8 },
    card: { backgroundColor: '#fff', borderRadius: 16, padding: 16 },
    row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    left: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    label: { fontSize: 15, fontWeight: '500' },
    divider: { height: 1, backgroundColor: '#e5e7eb', marginVertical: 12 },
    iconBox: { width: 32, height: 32, borderRadius: 8, backgroundColor: 'rgba(19,127,236,0.1)', justifyContent: 'center', alignItems: 'center' },
    plateRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    plateInput: { flex: 1, backgroundColor: '#f3f4f6', borderRadius: 12, paddingHorizontal: 12, height: 50, fontSize: 16, marginRight: 12 },
    submitButton: { backgroundColor: '#137fec', borderRadius: 12, padding: 14, alignItems: 'center', justifyContent: 'center' },
    submitText: { color: '#fff', fontWeight: '700', fontSize: 15 },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    editTag: { fontSize: 10, fontWeight: '700', color: '#137fec' },
    centered: { alignItems: 'center', marginVertical: 16 },
    appIcon: { width: 80, height: 80, borderRadius: 20 },
    appName: { fontSize: 18, fontWeight: '700', marginTop: 8 },
    appVersion: { fontSize: 12, color: '#6b7280', marginTop: 4 },
    appSubtitle: { fontSize: 12, color: '#9ca3af', marginTop: 4, textAlign: 'center' },
    versionText: { fontSize: 14, fontWeight: '600', color: '#137fec' },
});