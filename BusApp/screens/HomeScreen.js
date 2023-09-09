import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ScrollView } from "react-native";
import { useFonts, Rubik_400Regular } from '@expo-google-fonts/dev';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import Constants from 'expo-constants';
import { useToast } from 'react-native-toast-notifications';

import BUS_STOP_DATA from '../assets/bus_stops.json';
import useCalcLatLongDist from '../hooks/useCalcLatLongDist';
import BusStopItem from '../components/BusStopItem';
import Screen from '../components/Screen';
import { useGlobalContext } from '../context/GlobalContext';
import useUpdateFavBusStops from '../hooks/useUpdateFavBusStops';

export default function HomeScreen() {

    const { theme, updatingFavData, setUpdatingFavData } = useGlobalContext();

    const toast = useToast();

    let [fontsLoaded] = useFonts({
        Rubik_400Regular,
    });

    const [locStatus, setLocStatus] = useState(null);
    const [location, setLocation] = useState(null);

    const [nearBusStops, setNearBusStops] = useState([]);

    const [expandedBusStopCode, setExpandedBusStopCode] = useState(null);

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

    async function initLocation() {
        if (locStatus) {
            console.log('YAYY LOCSTATUS', locStatus);
            setLocation(await getLocation());
        };

        setLocStatus(await getLocStatus());
    }

    async function initNearBusStops() {
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
    }

    useEffect(() => {
        (async () => {
            await updateFavouriteBusStops();

            console.log('NBS LEN: ', nearBusStops.length, nearBusStops.length > 0);

            if (location) {
                console.log('init near bus stops');
                await initNearBusStops();
            }
            else if (locStatus) {
                await initLocation();
            }
        })();
    }, [locStatus, location]);


    const [favBusStops, setFavBusStops] = useState([]);

    const updateFavouriteBusStops = useUpdateFavBusStops(setFavBusStops);

    useEffect(() => {
        console.log('HOME CTX FAVDATA: ', updatingFavData);
        (async () => {
            const favDataStr = await AsyncStorage.getItem('favData');

            if (favDataStr !== null && !updatingFavData.includes('home')) {
                let favData = JSON.parse(favDataStr);
                setFavBusStops(favData);
                
                setUpdatingFavData([...updatingFavData, 'home']);
            }
        })();
    }, [updatingFavData]);

    return (
        <Screen onRefreshEvent={async setRefreshing => {
            await initLocation();
            console.log(setRefreshing);
            setRefreshing(false); // code could be better
        }}>
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: '100%',
                // backgroundColor: 'cyan',
                paddingTop: 20,
                paddingBottom: 10,
                paddingHorizontal: 16,
            }}>
                <MaterialCommunityIcons name='bus' size={40} color={theme != 'dark' ? 'black' : 'white'} />
                <Text style={{
                    fontFamily: fontsLoaded ? 'Rubik_400Regular' : 'Roboto',
                    fontSize: 30,
                    color: theme != 'dark' ? 'black' : 'white',
                    marginLeft: 8,
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
                            renderItem={({ item, index }) => {
                                const { BusStopCode } = item.bstop;

                                return <BusStopItem
                                    type={'home'}
                                    {...item}
                                    expandedBusStopCode={expandedBusStopCode}
                                    setExpandedBusStopCode={setExpandedBusStopCode}
                                    updateFavouriteBusStops={updateFavouriteBusStops}
                                    favourited={BusStopCode in favBusStops}
                                    favServices={favBusStops[BusStopCode] || []} />
                            }}
                            keyExtractor={(item, i) => i.toString()}
                            numColumns={1}
                            scrollEnabled={false} />

                        : location ?

                            <Text>No bus stops near you :"(</Text>

                            :

                            <Text>Turn on location to view nearby bus stops!</Text>
                }
            </View>
        </Screen>
    )
}