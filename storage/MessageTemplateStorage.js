// Parking/storage/MessageTemplateStorage.js

import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "PARKING_WHATSAPP_TEMPLATE";

// Upgraded Active Template - Simple English, more info, using @vehicleType
export const DEFAULT_ACTIVE_TEMPLATE =
    `Dear @driverName,

Your @vehicleType is safely parked at our facility. We have received your vehicle at @entryTime, and it is currently under our care. Here are some important details for your reference:

• Vehicle Owner: @driverName
• Contact Number: @phoneNumber
• Vehicle Number: @vehicleNumber
• Parking Rate: ₹@rate
• Current Status: ACTIVE PARKING

You can relax knowing your @vehicleType is in safe hands. We are always here to assist you if needed. Thank you for choosing our parking service. 🚗`;

// Upgraded Inactive Template - Simple English, more info, using @vehicleType
export const DEFAULT_EXIT_TEMPLATE =
    `Dear @driverName,

Thank you for parking with us. Your @vehicleType, number @vehicleNumber, has been safely returned. Here are the details of your parking session:

• Vehicle Owner: @driverName
• Contact Number: @phoneNumber
• Vehicle Type: @vehicleType
• Vehicle Number: @vehicleNumber
• Entry Time: @entryTime
• Exit Time: @exitTime
• Duration Parked: @duration
• Total Amount: ₹@amount
• Status: VEHICLE EXITED

We hope you had a smooth experience and look forward to welcoming you again. Drive safely! 🙏`;

export async function saveMessageTemplates(data) {
    try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
        console.log("Save template error", e);
    }
}

export async function getMessageTemplates() {
    try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);

        if (!raw) {
            return {
                active: DEFAULT_ACTIVE_TEMPLATE,
                inactive: DEFAULT_EXIT_TEMPLATE
            };
        }

        return JSON.parse(raw);

    } catch (e) {
        return {
            active: DEFAULT_ACTIVE_TEMPLATE,
            inactive: DEFAULT_EXIT_TEMPLATE
        };
    }
}