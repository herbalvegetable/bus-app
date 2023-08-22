import { useState, useEffect, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, ScrollView, RefreshControl } from "react-native";
import { wrapScrollView } from 'react-native-scroll-into-view';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useGlobalContext } from '../context/GlobalContext';

const CustomScrollView = wrapScrollView(ScrollView);
const scrollOptions = {
    align: 'center',
}

export default function Screen({ children }) {

    const { theme } = useGlobalContext();

    const tabBarHeight = useBottomTabBarHeight();

    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    return (
        <GestureHandlerRootView>
            <CustomScrollView
                scrollIntoViewOptions={scrollOptions}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
                }>
                <SafeAreaView style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    paddingBottom: tabBarHeight + 100,
                    backgroundColor: theme != 'dark' ? '#fff' : '#13283E',
                }}>
                    {children}
                    <StatusBar style='auto' />
                </SafeAreaView>
            </CustomScrollView>
        </GestureHandlerRootView>
    )
}