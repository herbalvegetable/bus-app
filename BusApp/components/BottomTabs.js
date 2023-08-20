import { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

import HomeScreen from '../screens/HomeScreen';
import FavScreen from "../screens/FavScreen";
import AboutScreen from '../screens/AboutScreen';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: {
                    position: 'absolute',
                    borderTopWidth: 0,
                    elevation: 0, // remove top box shadow on android
                },
                tabBarActiveTintColor: '#72AFE1',
                tabBarBackground: () => <BlurView tint='light' intensity={100} style={StyleSheet.absoluteFill} />
            }}
            initialRouteName="Home">
            <Tab.Screen
                name='Home'
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ color }) => <MaterialCommunityIcons name='home' size={26} color={color} />,
                }} />
            <Tab.Screen
                name='Fav'
                component={FavScreen}
                options={{
                    tabBarIcon: ({ color }) => <MaterialCommunityIcons name='heart' size={26} color={color} />,
                }} />
            <Tab.Screen
                name='About'
                component={AboutScreen}
                options={{
                    tabBarIcon: ({ color }) => <MaterialCommunityIcons name='progress-question' size={26} color={color} />,
                }} />
        </Tab.Navigator>
    )
}