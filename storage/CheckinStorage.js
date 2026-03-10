//Parking/storage/CheckinStorage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'PARKING_CHECKINS';

export const saveCheckin = async (data) => {
    try {
        const existing = await AsyncStorage.getItem(STORAGE_KEY);
        const parsed = existing ? JSON.parse(existing) : [];

        const newEntry = {
            id: Date.now().toString(),
            status: "active",
            checkoutAt: null,
            ...data,
            createdAt: new Date().toISOString()
        };

        parsed.unshift(newEntry);

        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
        return true;
    } catch (error) { console.log('Save Checkin Error:', error); return false; }
};

export const getCheckins = async () => {
    try {
        const data = await AsyncStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) { console.log('Get Checkins Error:', error); return []; }
};

export const checkoutVehicle = async (id) => {
    try {
        const data = await getCheckins();

        const updated = data.map(item => {
            if (item.id === id) {
                return {
                    ...item,
                    status: "inactive",
                    checkoutAt: new Date().toISOString()
                };
            }
            return item;
        });

        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return true;
    } catch (e) { console.log("Checkout Error:", e); return false; }
};

export const deleteCheckin = async (id) => {
    try {
        const data = await getCheckins();
        const filtered = data.filter(item => item.id !== id);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
        return true;
    } catch (e) { console.log("Delete Error:", e); return false; }
};

export const clearCheckins = async () => {
    try {
        await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) { console.log('Clear Checkins Error:', error); }
};