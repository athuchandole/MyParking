//Parking/components/SearchBar.js
import React, { useRef, useState } from "react";
import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function SearchBar({ value, onChange }) {

    const inputRef = useRef(null);

    const [numericMode, setNumericMode] = useState(false);

    const toggleKeyboard = () => {

        const next = !numericMode;
        setNumericMode(next);

        setTimeout(() => {
            inputRef.current?.focus();
        }, 100);
    };

    return (

        <View style={styles.searchBar}>

            <MaterialCommunityIcons
                name="magnify"
                size={20}
                color="#64748b"
            />

            <TextInput
                ref={inputRef}
                style={styles.searchInput}
                placeholder={
                    numericMode
                        ? "Search vehicle / phone number"
                        : "Search vehicle / driver / phone / type"
                }
                value={value}
                onChangeText={onChange}
                keyboardType={numericMode ? "numeric" : "default"}
                returnKeyType="search"
            />

            <TouchableOpacity
                style={styles.iconBtn}
                onPress={toggleKeyboard}
                activeOpacity={0.7}
            >
                <MaterialCommunityIcons
                    name={numericMode ? "keyboard-off-outline" : "numeric"}
                    size={20}
                    color="#137fec"
                />
            </TouchableOpacity>

        </View>

    );
}

const styles = StyleSheet.create({

    searchBar: {
        margin: 16,
        marginTop: 8,
        backgroundColor: "#fff",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#e2e8f0",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        height: 46
    },

    searchInput: {
        flex: 1,
        fontSize: 14,
        marginLeft: 6
    },

    iconBtn: {
        padding: 6,
        marginLeft: 6
    }

});