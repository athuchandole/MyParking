// Parking/storage/MessageTemplateStorage.js

import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "PARKING_WHATSAPP_TEMPLATE";

export const DEFAULT_ACTIVE_TEMPLATE =
    `🚗 PARKING RECEIPT

Vehicle : @vehicleNumber
Driver : @driverName
Phone : @phoneNumber
Type : @vehicleType
Rate/hr : ₹@rate

Entry Time : @entryTime
Current Time : @exitTime

Status : ACTIVE PARKING

Duration : @duration
Billable Hours : @billableHours

Total Amount : ₹@amount

Thank you for visiting 🙏`;

export const DEFAULT_EXIT_TEMPLATE =
    `🚗 PARKING RECEIPT

Vehicle : @vehicleNumber
Driver : @driverName
Phone : @phoneNumber
Type : @vehicleType
Rate/hr : ₹@rate

Entry Time : @entryTime
Exit Time : @exitTime

Status : VEHICLE EXITED

Duration : @duration
Billable Hours : @billableHours

Total Amount : ₹@amount

Thank you for visiting 🙏`;

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