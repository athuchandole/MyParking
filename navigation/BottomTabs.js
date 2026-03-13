//Parking/navigation/BottomTabs.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import DashboardScreen from '../screens/DashboardScreen';
import SettingsScreen from '../screens/SettingsScreen';
import Checkin from '../screens/Checkin';
import Checkout from '../screens/Checkout';
import BillScreen from '../screens/BillScreen';

const Tab = createBottomTabNavigator();
const RootStack = createNativeStackNavigator();

/* -------------------------------------------------------
   HOME STACK
------------------------------------------------------- */

function HomeStackScreen() {

    return (

        <RootStack.Navigator
            screenOptions={{
                headerShown: false,
                animation: "slide_from_right",
                gestureEnabled: true
            }}
        >

            <RootStack.Screen
                name="HomeMain"
                component={HomeScreen}
            />

            <RootStack.Screen
                name="Checkin"
                component={Checkin}
            />

            <RootStack.Screen
                name="Checkout"
                component={Checkout}
            />

            <RootStack.Screen
                name="BillScreen"
                component={BillScreen}
            />

        </RootStack.Navigator>

    );
}

/* -------------------------------------------------------
   DASHBOARD STACK
------------------------------------------------------- */

function DashboardStackScreen() {

    return (

        <RootStack.Navigator
            screenOptions={{
                headerShown: false,
                animation: "slide_from_right",
                gestureEnabled: true
            }}
        >

            <RootStack.Screen
                name="DashboardMain"
                component={DashboardScreen}
            />

            {/* Needed for edit mode */}
            <RootStack.Screen
                name="Checkin"
                component={Checkin}
            />

            <RootStack.Screen
                name="Checkout"
                component={Checkout}
            />

            <RootStack.Screen
                name="BillScreen"
                component={BillScreen}
            />

        </RootStack.Navigator>

    );
}

/* -------------------------------------------------------
   BOTTOM TAB NAVIGATION
------------------------------------------------------- */

export default function BottomTabs() {

    return (

        <Tab.Navigator

            screenOptions={({ route }) => ({

                headerShown: false,

                tabBarActiveTintColor: '#137fec',
                tabBarInactiveTintColor: '#64748b',

                tabBarStyle: {
                    height: 60,
                    paddingBottom: 6,
                    paddingTop: 6
                },

                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '600'
                },

                tabBarIcon: ({ color, size }) => {

                    let iconName;

                    if (route.name === 'Home')
                        iconName = 'home';

                    else if (route.name === 'Dashboard')
                        iconName = 'view-dashboard';

                    else if (route.name === 'Settings')
                        iconName = 'cog';

                    return (
                        <MaterialCommunityIcons
                            name={iconName}
                            size={size}
                            color={color}
                        />
                    );
                }

            })}

        >

            <Tab.Screen
                name="Home"
                component={HomeStackScreen}
            />

            <Tab.Screen
                name="Dashboard"
                component={DashboardStackScreen}
            />

            <Tab.Screen
                name="Settings"
                component={SettingsScreen}
            />
        </Tab.Navigator>

    );
}