import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ScrollView } from "react-native";
import { useFonts, Rubik_400Regular } from '@expo-google-fonts/dev';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import Constants from 'expo-constants';

import BUS_STOP_DATA from '../assets/bus_stops.json';
import useCalcLatLongDist from '../hooks/useCalcLatLongDist';
import BusStopItem from '../components/BusStopItem';
import Screen from '../components/Screen';
import { useGlobalContext } from '../context/GlobalContext';
import useUpdateFavBusStops from '../hooks/useUpdateFavBusStops';

export default function FavScreen() {

    const { theme, updatingFavData, setUpdatingFavData } = useGlobalContext();

    let [fontsLoaded] = useFonts({
        Rubik_400Regular,
    });

    const [locStatus, setLocStatus] = useState(null);
    const [location, setLocation] = useState(null);

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

    const [favBusStops, setFavBusStops] = useState([]);

    async function initFavData() {
        const favDataStr = await AsyncStorage.getItem('favData');
        if (favDataStr !== null) {
            let favData = JSON.parse(favDataStr);

            console.log('FAVDATA: ', favData);
            setFavBusStops(
                BUS_STOP_DATA.value
                    .filter((bstop, i) => {
                        return bstop.BusStopCode in favData;
                    })
                    .map((bstop, i) => {
                        let { Latitude: stopLat, Longitude: stopLon } = bstop;
                        let dist = '-';
                        if (location) {
                            let { latitude, longitude } = location.coords;
                            dist = Math.floor(useCalcLatLongDist(stopLat, stopLon, latitude, longitude) * 1000);
                        }
                        return {
                            bstop,
                            dist,
                            favServices: favData[bstop.BusStopCode],
                        }
                    })
            );
        }
        else {
            await AsyncStorage.setItem('favData', JSON.stringify({}));
            await initFavData();
        }
    }

    useEffect(() => {
        (async () => {
            console.log('LOCATION: ', location);
            if (locStatus) {
                await initLocation();
            }
            await initFavData();
        })();
    }, [locStatus, location]);

    const [expandedBusStopCode, setExpandedBusStopCode] = useState(null);

    // Update favourited bus stops
    const updateFavouriteBusStops = useUpdateFavBusStops(setFavBusStops);

    useEffect(() => {
        console.log('FAV CTX FAVDATA: ', updatingFavData);
        (async () => {
            const favDataStr = await AsyncStorage.getItem('favData');

            if (favDataStr !== null && !updatingFavData.includes('fav')) {
                let favData = JSON.parse(favDataStr);
                await initFavData();
                
                setUpdatingFavData([...updatingFavData, 'fav']);
            }
        })();
    }, [updatingFavData]);

    return (
        <Screen onRefreshEvent={async setRefreshing => {
            console.log(location, favBusStops);
            await initFavData();
            setRefreshing(false); //placeholder
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
                    Favourites
                </Text>
            </View>
            <View style={{
                width: '100%',
                // backgroundColor: 'cyan',
                paddingVertical: 10,
                paddingHorizontal: 16,
            }}>
                {
                    favBusStops.length > 0 ?

                        <FlatList
                            data={favBusStops}
                            renderItem={({ item, index }) => {
                                // console.log('FAVBSITEM: ', item);
                                return <BusStopItem
                                    type={'fav'}
                                    {...item}
                                    expandedBusStopCode={true}
                                    setExpandedBusStopCode={setExpandedBusStopCode}
                                    updateFavouriteBusStops={updateFavouriteBusStops}
                                    favourited={true} />
                            }}
                            keyExtractor={(item, i) => i.toString()}
                            numColumns={1}
                            scrollEnabled={false} />

                        : location ?

                            <Text>Location not found</Text>

                            :

                            <Text>No favourited bus stops</Text>
                }
            </View>
        </Screen>
    )
}