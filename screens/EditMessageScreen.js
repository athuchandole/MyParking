// Parking/screens/EditMessageScreen.js

import React, { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import Header from "../components/Header";
import { getMessageTemplates, saveMessageTemplates } from "../storage/MessageTemplateStorage";

export default function EditMessageScreen({ navigation }) {

    const [activeTemplate, setActiveTemplate] = useState("");
    const [inactiveTemplate, setInactiveTemplate] = useState("");

    useEffect(() => {

        load();

    }, []);

    const load = async () => {

        const data = await getMessageTemplates();

        setActiveTemplate(data.active);
        setInactiveTemplate(data.inactive);

    };

    const save = async () => {

        await saveMessageTemplates({
            active: activeTemplate,
            inactive: inactiveTemplate
        });

        alert("Templates saved");

    };

    return (

        <View style={{ flex: 1, backgroundColor: "#f6f7f8" }}>

            <Header title="Edit WhatsApp Message" navigation={navigation} />

            <ScrollView style={{ padding: 16 }}>

                <Text style={styles.title}>Available Variables</Text>

                <Text style={styles.vars}>
                    @vehicleNumber {"\n"}
                    @driverName {"\n"}
                    @phoneNumber {"\n"}
                    @vehicleType {"\n"}
                    @rate {"\n"}
                    @entryTime {"\n"}
                    @exitTime {"\n"}
                    @duration {"\n"}
                    @billableHours {"\n"}
                    @amount
                </Text>

                <Text style={styles.title}>Active Parking Message</Text>

                <TextInput
                    multiline
                    value={activeTemplate}
                    onChangeText={setActiveTemplate}
                    style={styles.input}
                />

                <Text style={styles.title}>Vehicle Exit Message</Text>

                <TextInput
                    multiline
                    value={inactiveTemplate}
                    onChangeText={setInactiveTemplate}
                    style={styles.input}
                />

                <TouchableOpacity style={styles.saveBtn} onPress={save}>
                    <Text style={{ color: "#fff", fontWeight: "700" }}>Save Templates</Text>
                </TouchableOpacity>

            </ScrollView>

        </View>

    );

}

const styles = StyleSheet.create({

    title: {
        fontSize: 14,
        fontWeight: "700",
        marginTop: 16,
        marginBottom: 6
    },

    vars: {
        backgroundColor: "#fff",
        padding: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        lineHeight: 20
    },

    input: {
        backgroundColor: "#fff",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        minHeight: 180,
        padding: 12,
        textAlignVertical: "top"
    },

    saveBtn: {
        backgroundColor: "#137fec",
        marginTop: 20,
        height: 50,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center"
    }

});