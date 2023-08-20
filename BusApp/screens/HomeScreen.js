import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from "react-native";
import { useFonts, Rubik_400Regular } from '@expo-google-fonts/dev';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
// import * as Location from 'expo-location';
import { LTA_API_KEY } from '@env';

export default function HomeScreen() {

    let [fontsLoaded] = useFonts({
        Rubik_400Regular,
    });

    let [location, setLocation] = useState(null);

    // useEffect(() => {
    //     (async () => {
    //         let { status } = await Location.requestForegroundPermissionsAsync();
    //         if (status !== 'granted'){
    //             console.log('Permission to access location was denied');
    //             return
    //         }

    //         let loc = await Location.getCurrentPositionAsync();
    //         setLocation(loc);
    //     })();
    // }, []);

    useEffect(() => {
        console.log('My Location: ', location);
    }, [location]);

    return (
        <SafeAreaView style={styles.main}>
            <View style={{
                width: '100%',
                // backgroundColor: 'cyan',
                paddingVertical: 10,
                paddingHorizontal: 16,
            }}>
                <Text style={{
                    fontSize: 30,
                    fontWeight: 'bold',
                    fontFamily: fontsLoaded ? 'Rubik_400Regular' : 'Roboto',
                }}>
                    Nearby
                </Text>
            </View>
            <StatusBar style='auto' />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },

});