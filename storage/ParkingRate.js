//storage/ParkingRate.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'PARKING_RATES';

export const defaultRates = {
    bike: '10',
    auto: '20',
    car: '40',
};

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