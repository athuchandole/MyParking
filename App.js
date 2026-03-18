// Parking/App.js (testing onboarding every time)
import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomTabs from "./navigation/BottomTabs";
import Onboarding from "./Onboarding";

const Stack = createNativeStackNavigator();

export default function App() {
  // Force onboarding every time
  const [isFirstLaunch, setIsFirstLaunch] = useState(true); // <-- always true for testing

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Onboarding" component={Onboarding} />
          <Stack.Screen name="Home" component={BottomTabs} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}