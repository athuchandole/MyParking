// utils/whatsapp.js

import { Linking, Alert } from "react-native";

export const openWhatsApp = async (phone, message) => {
    try {
        const cleanPhone = phone?.replace(/[^0-9]/g, "") || "";

        // Primary (App)
        let appUrl = cleanPhone.length === 10
            ? `whatsapp://send?phone=91${cleanPhone}&text=${encodeURIComponent(message)}`
            : `whatsapp://send?text=${encodeURIComponent(message)}`;

        // Fallback (Browser - ALWAYS works)
        let webUrl = cleanPhone.length === 10
            ? `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(message)}`
            : `https://wa.me/?text=${encodeURIComponent(message)}`;

        try {
            await Linking.openURL(appUrl); // Try app directly
        } catch (e) {
            await Linking.openURL(webUrl); // Fallback to browser
        }

    } catch (err) {
        Alert.alert("Error", "Unable to open WhatsApp");
    }
};