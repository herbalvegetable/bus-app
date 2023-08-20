import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ScrollView } from "react-native";
import { useFonts, Rubik_400Regular } from '@expo-google-fonts/dev';
import { useState, useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import Constants from 'expo-constants';

import BUS_STOP_DATA from '../assets/bus_stops.json';
import { LTA_API_KEY } from '@env';
import useCalcLatLongDist from '../hooks/useCalcLatLongDist';


export default function HomeScreen() {

    let [fontsLoaded] = useFonts({
        Rubik_400Regular,
    });

    const [locStatus, setLocStatus] = useState(null);
    const [location, setLocation] = useState(null);

    const [nearBusStops, setNearBusStops] = useState([]);

    async function getLocStatus() {
        let { status } = await Location.requestForegroundPermissionsAsync();
        console.log('GETTING LOC STATUS', status);
        return status;
    }

    async function getLocation() {
        if (locStatus !== 'granted') {
            console.log('Permission to access location was denied');
            console.log('LOCSTATUS', locStatus);
            return;
        }

        let loc = await Location.getCurrentPositionAsync();
        return loc;
    }

    useEffect(() => {
        (async () => {
            if (locStatus) {
                console.log('YAYY LOCSTATUS', locStatus);
                setLocation(await getLocation());
            };

            setLocStatus(await getLocStatus());
        })();
    }, [locStatus]);

    useEffect(() => {
        (async () => {
            console.log('My Location: ', location);

            if (!location) {
                console.log('no location: ', location);
                setLocation(await getLocation());
                return;
            };

            let nbs = BUS_STOP_DATA.value
                .map((bstop, i) => {
                    let { Latitude: stopLat, Longitude: stopLon } = bstop;
                    let { latitude, longitude } = location.coords;
                    let dist = useCalcLatLongDist(stopLat, stopLon, latitude, longitude);
                    if (dist < 0.5) {
                        return {
                            bstop,
                            dist: Math.floor(dist * 1000),
                        }
                    }

                    return false
                })
                .filter(bstop => bstop)
                .sort((b1, b2) => b1.dist - b2.dist);

            console.log('NBS: ', nbs);

            setNearBusStops(nbs);
        })();
    }, [location]);

    return (
        <ScrollView>
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

                <View style={{
                    width: '100%',
                    // backgroundColor: 'cyan',
                    paddingVertical: 10,
                    paddingHorizontal: 16,
                }}>
                    {
                        nearBusStops.length > 0 ?

                            <FlatList
                                data={nearBusStops}
                                renderItem={({ item }) => {
                                    return (
                                        <TouchableOpacity style={{
                                            flex: 1,
                                            flexDirection: 'column',
                                            paddingHorizontal: 10,
                                            paddingVertical: 10,
                                            margin: 1,
                                            borderRadius: 5,
                                            backgroundColor: '#ddd',
                                        }}>
                                            <Text style={{
                                                fontSize: 20,
                                                fontFamily: fontsLoaded ? 'Rubik_400Regular' : 'Roboto',
                                            }}>{item.bstop.Description}</Text>
                                        </TouchableOpacity>
                                    )
                                }}
                                keyExtractor={(item, i) => i}
                                numColumns={1}
                                scrollEnabled={false} />

                            : location ?

                                <Text>No bus stops near you :"(</Text>

                                :

                                <Text>Turn on location to view nearby bus stops!</Text>
                    }
                </View>

                <StatusBar style='auto' />
            </SafeAreaView>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginBottom: Constants.statusBarHeight,
        overflow: 'scroll',
    },

});