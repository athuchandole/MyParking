//Parking/storage/CheckinStorage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'PARKING_CHECKINS';

export const saveCheckin = async (data) => {
    try {

        const existing = await AsyncStorage.getItem(STORAGE_KEY);
        const parsed = existing ? JSON.parse(existing) : [];

        const newEntry = {
            id: Date.now().toString(),
            ...data,
            createdAt: new Date().toISOString()
        };

        parsed.unshift(newEntry);

        await AsyncStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(parsed)
        );

        return true;

    } catch (error) {
        console.log('Save Checkin Error:', error);
        return false;
    }
};

export const getCheckins = async () => {
    try {
        const data = await AsyncStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.log('Get Checkins Error:', error);
        return [];
    }
};

export const clearCheckins = async () => {
    try {
        await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.log('Clear Checkins Error:', error);
    }
};