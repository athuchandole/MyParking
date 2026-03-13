//Parking/screens/SettingsScreen.js
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    Switch,
    TouchableOpacity,
    TextInput,
    StyleSheet,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ParkingRates from '../components/ParkingRates';
import Header from "../components/Header";
import { saveDefaultPlate, getDefaultPlate } from '../storage/DefaultPlateStorage';

export default function SettingsScreen({ navigation }) {
    const [darkMode, setDarkMode] = useState(false);
    const [language, setLanguage] = useState('English');

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
        if (
            defaultPart1 !== originalPart1 ||
            defaultPart2 !== originalPart2
        ) {
            setShowSaveButton(true);
        } else {
            setShowSaveButton(false);
        }
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

    return (
        <View style={styles.container}>

            <Header title="Settings" navigation={navigation} />

            <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>

                {/* Appearance */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Appearance</Text>
                    <View style={styles.card}>
                        <View style={styles.row}>
                            <View style={styles.left}>
                                <View style={styles.iconBox}>
                                    <MaterialCommunityIcons
                                        name="theme-light-dark"
                                        size={20}
                                        color="#137fec"
                                    />
                                </View>
                                <Text style={styles.label}>Dark Mode</Text>
                            </View>

                            <Switch
                                value={darkMode}
                                onValueChange={setDarkMode}
                                trackColor={{ true: '#137fec', false: '#d1d5db' }}
                            />
                        </View>

                        <View style={styles.divider} />

                        <View style={{ padding: 14 }}>
                            <Text style={styles.smallLabel}>Primary Color Selection</Text>
                            <View style={styles.colorRow}>
                                <View style={[styles.colorDot, { backgroundColor: '#137fec' }]} />
                                <View style={[styles.colorDot, { backgroundColor: '#10b981' }]} />
                                <View style={[styles.colorDot, { backgroundColor: '#f59e0b' }]} />
                                <View style={[styles.colorDot, { backgroundColor: '#ef4444' }]} />
                                <View style={[styles.colorDot, { backgroundColor: '#8b5cf6' }]} />
                            </View>
                        </View>
                    </View>
                </View>

                {/* Localization */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Localization</Text>
                    <View style={styles.card}>
                        <View style={styles.row}>
                            <View style={styles.left}>
                                <View style={styles.iconBox}>
                                    <MaterialCommunityIcons
                                        name="translate"
                                        size={20}
                                        color="#137fec"
                                    />
                                </View>
                                <Text style={styles.label}>Language</Text>
                            </View>
                            <TextInput
                                style={styles.languageInput}
                                value={language}
                                onChangeText={setLanguage}
                            />
                        </View>
                    </View>
                </View>

                {/* Default Plate Settings */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Default Vehicle Plate</Text>
                    <View style={styles.card}>
                        <View style={styles.row}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.label}>Part 1 (Letters)</Text>
                                <TextInput
                                    style={styles.input}
                                    value={defaultPart1}
                                    maxLength={2}
                                    autoCapitalize="characters"
                                    onChangeText={setDefaultPart1}
                                    placeholder="AA"
                                />
                            </View>

                            <View style={{ flex: 1, marginLeft: 12 }}>
                                <Text style={styles.label}>Part 2 (Numbers)</Text>
                                <TextInput
                                    style={styles.input}
                                    value={defaultPart2}
                                    maxLength={2}
                                    keyboardType="numeric"
                                    onChangeText={setDefaultPart2}
                                    placeholder="00"
                                />
                            </View>
                        </View>

                        {showSaveButton && (
                            <TouchableOpacity
                                style={[styles.submitButton, { marginTop: 16 }]}
                                onPress={handleSaveDefaultPlate}
                            >
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

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({

    container: { flex: 1, backgroundColor: '#f6f7f8' },

    section: { marginTop: 20, paddingHorizontal: 16 },

    sectionTitle: { fontSize: 12, fontWeight: '700', color: '#6b7280', marginBottom: 8 },

    card: { backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#e5e7eb', padding: 12 },

    row: { flexDirection: 'row', alignItems: 'center' },

    left: { flexDirection: 'row', alignItems: 'center', gap: 10 },

    label: { fontSize: 15, fontWeight: '500', marginBottom: 4 },

    divider: { height: 1, backgroundColor: '#e5e7eb', marginVertical: 8 },

    iconBox: { width: 32, height: 32, borderRadius: 8, backgroundColor: 'rgba(19,127,236,0.1)', justifyContent: 'center', alignItems: 'center' },

    smallLabel: { fontSize: 13, fontWeight: '500', marginBottom: 8 },

    colorRow: { flexDirection: 'row', gap: 12 },

    colorDot: { width: 28, height: 28, borderRadius: 14 },

    languageInput: { fontWeight: '600', fontSize: 14, color: '#137fec', textAlign: 'right' },

    headerRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },

    editTag: { fontSize: 10, fontWeight: '700', color: '#137fec' },

    input: { backgroundColor: '#f3f4f6', borderRadius: 12, paddingHorizontal: 10, height: 44, borderWidth: 1, borderColor: '#d1d5db' },

    submitButton: { backgroundColor: '#137fec', borderRadius: 12, padding: 12, alignItems: 'center', justifyContent: 'center' },

    submitText: { color: '#fff', fontWeight: '700' }
});