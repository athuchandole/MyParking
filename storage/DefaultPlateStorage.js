//Parking/storage/DefaultPlateStorage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const PLATE_KEY = 'default_plate';

export const saveDefaultPlate = async ({ part1, part2 }) => {
    try {
        await AsyncStorage.setItem(PLATE_KEY, JSON.stringify({ part1, part2 }));
        return true;
    } catch (e) {
        console.error('Error saving default plate', e);
        return false;
    }
};

export const getDefaultPlate = async () => {
    try {
        const data = await AsyncStorage.getItem(PLATE_KEY);
        return data ? JSON.parse(data) : { part1: '', part2: '' };
    } catch (e) {
        console.error('Error loading default plate', e);
        return { part1: '', part2: '' };
    }
};