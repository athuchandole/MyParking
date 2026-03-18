//storage/ParkingRate.js

import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'PARKING_RATES';
const RATE_META_KEY = 'PARKING_RATE_META';

export const defaultRates = {
    bike: '10',
    auto: '20',
    car: '40',
};

export const defaultRateMeta = {
    perHours: '1', // NEW (rate per X hours)
};

// -------------------- RATES --------------------

export const getParkingRates = async () => {
    try {
        const data = await AsyncStorage.getItem(KEY);
        if (data) return JSON.parse(data);
        return defaultRates;
    } catch (e) {
        return defaultRates;
    }
};

export const saveParkingRates = async (rates) => {
    try {
        await AsyncStorage.setItem(KEY, JSON.stringify(rates));
    } catch (e) { }
};

// -------------------- RATE META --------------------

export const getRateMeta = async () => {
    try {
        const data = await AsyncStorage.getItem(RATE_META_KEY);
        if (data) return JSON.parse(data);
        return defaultRateMeta;
    } catch (e) {
        return defaultRateMeta;
    }
};

export const saveRateMeta = async (meta) => {
    try {
        await AsyncStorage.setItem(RATE_META_KEY, JSON.stringify(meta));
    } catch (e) { }
};