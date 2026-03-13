// Parking/components/ShareOnWhatsApp.js

import React from "react";
import { TouchableOpacity, Text, StyleSheet, Linking, Alert } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getMessageTemplates } from "../storage/MessageTemplateStorage";

export default function ShareOnWhatsApp({ item }) {

    const replaceVars = (template, data) => {

        let msg = template;

        Object.keys(data).forEach(key => {

            msg = msg.replaceAll(`@${key}`, data[key] ?? "");

        });

        return msg;

    };

    const shareBill = async () => {

        try {

            const entry = new Date(item.createdAt);
            const exit = item.checkoutAt ? new Date(item.checkoutAt) : new Date();

            const diff = exit - entry;

            const hrs = Math.floor(diff / (1000 * 60 * 60));
            const mins = Math.floor((diff / (1000 * 60)) % 60);

            const totalHours = Math.max(1, Math.ceil(diff / (1000 * 60 * 60)));
            const amount = totalHours * (item.rate || 0);

            const duration = `${hrs}h ${mins}m`;

            const templates = await getMessageTemplates();

            const isActive = item.status === "active";

            const data = {

                vehicleNumber: item.vehicleNumber,
                driverName: item.driverName,
                phoneNumber: item.phoneNumber || "",
                vehicleType: item.vehicleType,
                rate: item.rate,

                entryTime: entry.toLocaleString(),
                exitTime: exit.toLocaleString(),

                duration: duration,
                billableHours: totalHours,
                amount: amount

            };

            const template = isActive ? templates.active : templates.inactive;

            const message = replaceVars(template, data);

            let phone = item.phoneNumber ? item.phoneNumber.replace(/[^0-9]/g, "") : "";

            let url = "";

            if (phone.length === 10) {

                const fullNumber = `91${phone}`;

                url = `whatsapp://send?phone=${fullNumber}&text=${encodeURIComponent(message)}`;

            } else {

                url = `whatsapp://send?text=${encodeURIComponent(message)}`;

            }

            const supported = await Linking.canOpenURL(url);

            if (supported) {

                await Linking.openURL(url);

            } else {

                Alert.alert("WhatsApp not installed");

            }

        } catch (e) {

            Alert.alert("Error", "Unable to share receipt");

        }

    };

    return (

        <TouchableOpacity style={styles.btn} onPress={shareBill}>
            <MaterialCommunityIcons name="whatsapp" size={20} color="#fff" />
            <Text style={styles.text}>Share on WhatsApp</Text>
        </TouchableOpacity>

    );

}

const styles = StyleSheet.create({

    btn: {
        height: 52,
        backgroundColor: "#25D366",
        borderRadius: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        marginTop: 10
    },

    text: {
        color: "#fff",
        fontWeight: "800",
        fontSize: 15
    }

});