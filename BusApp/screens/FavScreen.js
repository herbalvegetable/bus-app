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

export default function FavScreen() {

    const { theme } = useGlobalContext();

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
            
            console.log(favData.busStops);
            setFavBusStops(BUS_STOP_DATA.value.filter((bstop, i) => {
                return favData.busStops.includes(bstop.BusStopCode);
            }));
        }
        else {
            await AsyncStorage.setItem('favData', JSON.stringify({
                busStops: [],
            }));
        }
    }

    useEffect(() => {
        (async () => {
            await initFavData();
            await initLocation();
        })();
    }, [locStatus]);

    const [expandedBusStopCode, setExpandedBusStopCode] = useState(null);

    // Update favourited bus stops
    async function updateFavouriteBusStops(){
        const favDataStr = await AsyncStorage.getItem('favData');

        if(favDataStr !== null){
            let favData = JSON.parse(favDataStr);
            setFavBusStops(favData.busStops);
        }
        else{

        }
    }

    return (
        <Screen>
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
            {
                favBusStops.length > 0 ?

                    <FlatList
                        data={favBusStops}
                        renderItem={({ item, index }) =>
                            <BusStopItem
                                type={'fav'}
                                {...item}
                                expandedBusStopCode={expandedBusStopCode}
                                setExpandedBusStopCode={setExpandedBusStopCode}
                                updateFavouriteBusStops={updateFavouriteBusStops}
                                favourited={true} />
                        }
                        keyExtractor={(item, i) => i.toString()}
                        numColumns={1}
                        scrollEnabled={false} />

                    :

                    <Text>No favourited bus stops</Text>
            }
        </Screen>
    )
}