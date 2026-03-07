//Parking/screens/DashboardScreen.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function DashboardScreen() {
    return (
        <View style={styles.container}>
            <Text>Hello Dashboard</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
});