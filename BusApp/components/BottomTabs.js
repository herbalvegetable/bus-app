import { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { MaterialCommunityIcons, AntDesign } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

import HomeScreen from '../screens/HomeScreen';
import FavScreen from "../screens/FavScreen";
import AboutScreen from '../screens/AboutScreen';
import SearchScreen from "../screens/SearchScreen";

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
                    tabBarIcon: ({ color }) => <AntDesign name='home' size={22} color={color} />,
                }} />
            <Tab.Screen
                name='Fav'
                component={FavScreen}
                options={{
                    tabBarIcon: ({ color }) => <AntDesign name='hearto' size={22} color={color} />,
                }} />
            <Tab.Screen
                name='Search'
                component={SearchScreen}
                options={{
                    tabBarIcon: ({ color }) => <AntDesign name='search1' size={22} color={color} />,
                }} />
        </Tab.Navigator>
    )
}