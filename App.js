// Parking/App.js
import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BottomTabs from "./navigation/BottomTabs";
import Onboarding from "./Onboarding";

const Stack = createNativeStackNavigator();
const ONBOARDING_KEY = "hasLaunchedBefore";

export default function App() {
  const [isFirstLaunch, setIsFirstLaunch] = useState(null); // null while checking storage

  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const value = await AsyncStorage.getItem(ONBOARDING_KEY);
        if (value === null) {
          // First launch
          setIsFirstLaunch(true);
          await AsyncStorage.setItem(ONBOARDING_KEY, "true");
        } else {
          setIsFirstLaunch(false);
        }
      } catch (error) {
        console.error("Error checking app launch status:", error);
        setIsFirstLaunch(false); // fallback
      }
    };
    checkFirstLaunch();
  }, []);

  if (isFirstLaunch === null) {
    // Optional: show splash/loading screen
    return null;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {isFirstLaunch && (
            <Stack.Screen name="Onboarding" component={Onboarding} />
          )}
          <Stack.Screen name="Home" component={BottomTabs} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}