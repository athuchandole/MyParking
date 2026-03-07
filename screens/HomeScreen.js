//Parking/screens/HomeScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function HomeScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Hello Home</Text>
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('Checkin')}
            >
                <Text style={styles.buttonText}>Vehicle In</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
    button: { backgroundColor: '#137fec', paddingVertical: 14, paddingHorizontal: 32, borderRadius: 16 },
    buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 }
});