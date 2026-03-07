//Parking/screens/SettingsScreen.js
import React, { useState } from 'react';
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

export default function SettingsScreen({ navigation }) {
    const [darkMode, setDarkMode] = useState(false);
    const [language, setLanguage] = useState('English');

    return (
        <View style={styles.container}>

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation?.goBack()}>
                    <MaterialCommunityIcons name="arrow-left" size={26} color="#111" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Settings</Text>
            </View>

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

                {/* Parking Rates */}
                <View style={styles.section}>

                    <View style={styles.headerRow}>
                        <Text style={styles.sectionTitle}>
                            Parking Rates (per hour)
                        </Text>

                        <Text style={styles.editTag}>
                            EDITABLE
                        </Text>
                    </View>

                    <ParkingRates />

                </View>

                {/* Account & Security */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account & Security</Text>

                    <View style={styles.card}>

                        <TouchableOpacity style={styles.buttonRow}>
                            <View style={styles.left}>
                                <MaterialCommunityIcons
                                    name="lock-outline"
                                    size={20}
                                    color="#6b7280"
                                />
                                <Text style={styles.label}>Change Password</Text>
                            </View>

                            <MaterialCommunityIcons
                                name="chevron-right"
                                size={20}
                                color="#9ca3af"
                            />
                        </TouchableOpacity>

                        <View style={styles.divider} />

                        <TouchableOpacity style={styles.buttonRow}>
                            <View style={styles.left}>
                                <MaterialCommunityIcons
                                    name="logout"
                                    size={20}
                                    color="#ef4444"
                                />
                                <Text style={[styles.label, { color: '#ef4444' }]}>
                                    Logout
                                </Text>
                            </View>
                        </TouchableOpacity>

                    </View>
                </View>

                {/* System */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>System</Text>

                    <View style={styles.card}>

                        <View style={styles.row}>
                            <Text style={styles.label}>App Version</Text>
                            <Text style={styles.version}>2.4.1-stable</Text>
                        </View>

                        <View style={styles.divider} />

                        <TouchableOpacity style={styles.buttonRow}>
                            <Text style={styles.label}>Terms of Service</Text>
                            <MaterialCommunityIcons
                                name="open-in-new"
                                size={20}
                                color="#9ca3af"
                            />
                        </TouchableOpacity>

                        <View style={styles.divider} />

                        <TouchableOpacity style={styles.buttonRow}>
                            <Text style={styles.label}>Privacy Policy</Text>
                            <MaterialCommunityIcons
                                name="open-in-new"
                                size={20}
                                color="#9ca3af"
                            />
                        </TouchableOpacity>

                    </View>
                </View>

            </ScrollView>

        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#f6f7f8',
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },

    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginLeft: 10,
    },

    section: {
        marginTop: 20,
        paddingHorizontal: 16,
    },

    sectionTitle: {
        fontSize: 12,
        fontWeight: '700',
        color: '#6b7280',
        marginBottom: 8,
    },

    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },

    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 14,
    },

    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 14,
    },

    left: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },

    label: {
        fontSize: 15,
        fontWeight: '500',
    },

    divider: {
        height: 1,
        backgroundColor: '#e5e7eb',
    },

    iconBox: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: 'rgba(19,127,236,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    smallLabel: {
        fontSize: 13,
        fontWeight: '500',
        marginBottom: 8,
    },

    colorRow: {
        flexDirection: 'row',
        gap: 12,
    },

    colorDot: {
        width: 28,
        height: 28,
        borderRadius: 14,
    },

    languageInput: {
        fontWeight: '600',
        fontSize: 14,
        color: '#137fec',
        textAlign: 'right',
    },

    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },

    editTag: {
        fontSize: 10,
        fontWeight: '700',
        color: '#137fec',
    },

    version: {
        color: '#9ca3af',
        fontWeight: '600',
    },

});