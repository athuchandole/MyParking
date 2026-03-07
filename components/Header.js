//components/Header.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Header({
    title,
    navigation,
    showBack = true,
    rightIcon = null,
    onRightPress = null
}) {

    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.wrapper, { paddingTop: insets.top }]}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            <View style={styles.container}>

                {showBack ? (
                    <TouchableOpacity
                        style={styles.iconBtn}
                        onPress={() => navigation?.goBack()}
                    >
                        <MaterialCommunityIcons name="arrow-left" size={26} />
                    </TouchableOpacity>
                ) : (
                    <View style={styles.iconPlaceholder} />
                )}

                <Text style={styles.title}>
                    {title}
                </Text>

                {rightIcon ? (
                    <TouchableOpacity
                        style={styles.iconBtn}
                        onPress={onRightPress}
                    >
                        <MaterialCommunityIcons name={rightIcon} size={24} color="#137fec" />
                    </TouchableOpacity>
                ) : (
                    <View style={styles.iconPlaceholder} />
                )}

            </View>
        </View>
    );
}

const styles = StyleSheet.create({

    wrapper: {
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#e5e7eb"
    },

    container: {
        height: 56,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12
    },

    title: {
        flex: 1,
        textAlign: "center",
        fontSize: 18,
        fontWeight: "700",
        color: "#111"
    },

    iconBtn: {
        width: 40,
        alignItems: "center",
        justifyContent: "center"
    },

    iconPlaceholder: {
        width: 40
    }

});
