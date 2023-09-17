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

    const [locationStatus, setLocationStatus] = useState(null);
    const [location, setLocation] = useState(null);

    const [nearBusStops, setNearBusStops] = useState([]);

    const [expandedBusStopCode, setExpandedBusStopCode] = useState(null);

    async function getLocStatus() {
        return (await Location.requestForegroundPermissionsAsync()).status;
    }

    async function getLocation() {
        return await Location.getCurrentPositionAsync();
    }

    async function initNearBusStops(loc) {
        console.log('My Location: ', loc);

        if (!loc) {
            console.log('no location: ', loc);
            setLocation(await getLocation());
            return;
        };

        let nbs = BUS_STOP_DATA.value
            .map((bstop, i) => {
                let { Latitude: stopLat, Longitude: stopLon } = bstop;
                let { latitude, longitude } = loc.coords;
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
            await initHome();
        })();
    }, []);

    async function initHome() {
        const locStatus = await getLocStatus();

        let loc;

        if (!locStatus) {
            console.log('INITHOME - no loc status :*(', locStatus);
            return;
        };

        console.log('INITHOME - Loc status: ', locStatus);
        loc = await getLocation();
        setLocation(loc);

        initNearBusStops(loc);

        await updateFavouriteBusStops();
    }


    const [favBusStops, setFavBusStops] = useState([]);

    const updateFavouriteBusStops = useUpdateFavBusStops(setFavBusStops);

    useEffect(() => {
        console.log();
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
            // await initLocation();
            await initHome();
            console.log('REFRESHREFRESHREFRESHREFRESHREFRESHREFRESHREFRESHREFRESH');
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

                            <Text style={{ fontSize: 16 }}>Turn on location to view nearby bus stops!</Text>
                }
            </View>
        </Screen>
    )
}