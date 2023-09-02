import { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ScrollView } from "react-native";
import { useFonts, Rubik_400Regular, Rubik_600SemiBold } from '@expo-google-fonts/dev';
import { MaterialCommunityIcons, FontAwesome, AntDesign } from '@expo/vector-icons';
import axios from 'axios';
import { useScrollIntoView } from 'react-native-scroll-into-view';
import { useToast } from "react-native-toast-notifications";

import { LTA_API_KEY } from '@env';
import useCalcLatLongDist from '../hooks/useCalcLatLongDist';
import useCalcTimeDiff from '../hooks/useCalcTimeDiff';
import testData from '../assets/test_bus_service.json';
import { useGlobalContext } from '../context/GlobalContext';

export default function BusStopItem(props) {

    const { theme } = useGlobalContext();
    const toast = useToast();

    let [fontsLoaded] = useFonts({
        Rubik_400Regular,
        Rubik_600SemiBold,
    });
    const scrollIntoView = useScrollIntoView();
    const mainRef = useRef();

    const { bstop, dist, expandedBusStopCode, setExpandedBusStopCode } = props;

    const [expanded, setExpanded] = useState(false);
    useEffect(() => {
        if (expandedBusStopCode != bstop.BusStopCode) {
            setExpanded(false);
        }
    }, [expandedBusStopCode])

    const [services, setServices] = useState(null);

    useEffect(() => {
        fetchServicesData(bstop.BusStopCode);
    }, []);

    useEffect(() => {
        if (!expanded) return;

        fetchServicesData(bstop.BusStopCode);
        setExpandedBusStopCode(bstop.BusStopCode);

    }, [expanded]);

    function fetchServicesData(bscode) {
        console.log('FETCH SERVICE DATA: ', bscode);
        const config = {
            headers: {
                'Accept': 'application/json',
                'AccountKey': LTA_API_KEY,
            },
        }

        console.log('BUSSTOPCODE: ', bscode);

        axios.get(`http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2?BusStopCode=${bscode}`, config)
            .then(res => {
                console.log(bscode, res.data);
                setServices(res.data.Services);

                scrollIntoView(mainRef.current);

                // TESTING AT NIGHT ZZZZZZZZ
                // setServices(testData.Services);
            })
            .catch(err => {
                console.log(err);
                fetchServicesData(bscode);
            });
    }

    return (
        <TouchableOpacity
            style={{
                flexDirection: 'row',
                marginTop: expanded ? 20 : 0,
                marginBottom: expanded ? 30 : 10,
                backgroundColor: theme != 'dark' ? '#D6F5FF' : '#1D3C5E'
            }}
            onPress={e => {
                console.log('EXPAND', bstop.BusStopCode);
                // setExpanded(true);
                setExpanded(!expanded);
            }}>
            <View
                ref={mainRef}
                style={{
                    flex: 1,
                    flexDirection: 'column',
                    paddingHorizontal: 10,
                    paddingTop: 15,
                    paddingBottom: 5,
                    borderTopLeftRadius: 5,
                    borderBottomLeftRadius: 5,
                }}>
                <Text style={{
                    fontSize: 20,
                    // fontWeight: 'bold',
                    fontFamily: !fontsLoaded ? 'Roboto' : expanded ? 'Rubik_600SemiBold' : 'Rubik_400Regular',
                    marginBottom: 5,
                    color: theme != 'dark' ? 'black' : 'white',
                }}>
                    {bstop.Description}
                </Text>
                <Text style={{
                    fontSize: 16,
                    fontFamily: fontsLoaded ? 'Rubik_400Regular' : 'Roboto',
                    color: theme != 'dark' ? 'gray' : 'lightgray',
                }}>
                    {dist}m away
                </Text>
                {
                    !services ?

                        <Text>Loading bus services...</Text>

                        :

                        services.length > 0 ?

                            <>
                                {
                                    expanded ?

                                        <View style={{
                                            flexDirection: 'column',
                                            alignItems: 'flex-start',
                                            marginTop: 10,
                                        }}>
                                            {
                                                services.map((service, i) => {

                                                    const { ServiceNo, NextBus: bus1, NextBus2: bus2, NextBus3: bus3 } = service;
                                                    const busList = [bus1, bus2, bus3];
                                                    return (
                                                        <TouchableOpacity
                                                            key={i.toString()}
                                                            style={{
                                                                flexDirection: 'row',
                                                                // borderWidth: 1,
                                                                // borderColor: 'black',
                                                                marginBottom: 15,
                                                            }}
                                                            onPress={e => {
                                                                e.stopPropagation();
                                                            }}>
                                                            <View style={{
                                                                flex: 1,
                                                                alignItems: 'flex-start',
                                                                justifyContent: 'center',
                                                                // backgroundColor: 'beige',
                                                                // paddingHorizontal: 10,
                                                                paddingLeft: 5,
                                                                marginRight: 10,
                                                            }}>
                                                                <Text style={{
                                                                    fontSize: 24,
                                                                    fontFamily: fontsLoaded ? 'Rubik_400Regular' : 'Roboto',
                                                                    color: theme != 'dark' ? 'black' : 'white',
                                                                }}>{ServiceNo}</Text>
                                                            </View>
                                                            <View style={{
                                                                flex: 4,
                                                                flexDirection: 'row',
                                                            }}>
                                                                {
                                                                    busList.map((bus, i) => {
                                                                        const {
                                                                            OriginCode: ocode,
                                                                            DestinationCode: dcode,
                                                                            EstimatedArrival: eta,
                                                                            Latitude: lan,
                                                                            Longitude: lon,
                                                                            Load,
                                                                            Feature,
                                                                            Type
                                                                        } = bus;

                                                                        let loadColours = {
                                                                            'SEA': '#5AB22E',
                                                                            'SDA': 'orange',
                                                                            'LSD': 'red',
                                                                        }

                                                                        let typeIcons = {
                                                                            'SD': 'bus-side',
                                                                            'DD': 'bus-double-decker',
                                                                        }

                                                                        let arrivalTime = useCalcTimeDiff(new Date().toString(), eta);
                                                                        console.log("ARRIVING: ", arrivalTime);

                                                                        return (
                                                                            <View
                                                                                key={i.toString()}
                                                                                style={{
                                                                                    flexGrow: 1,
                                                                                    flexDirection: 'row',
                                                                                    // paddingHorizontal: 10,
                                                                                    // paddingLeft: 10,
                                                                                    borderRightWidth: i < 2 ? 2 : 0,
                                                                                    borderColor: '#aaa',
                                                                                }}>

                                                                                <View style={{
                                                                                    flex: 2,
                                                                                    flexDirection: 'column',
                                                                                    alignItems: 'center',
                                                                                    justifyContent: 'center',
                                                                                    // paddingVertical: 10,
                                                                                    // backgroundColor: 'cyan',
                                                                                }}>
                                                                                    <Text style={{
                                                                                        fontSize: 20,
                                                                                        fontFamily: fontsLoaded ? 'Rubik_400Regular' : 'Roboto',
                                                                                        color: theme != 'dark' ? 'black' : 'white',
                                                                                    }}>{
                                                                                            isNaN(arrivalTime) ? '-' : arrivalTime > 0 ? arrivalTime : 'Arr'
                                                                                        }</Text>
                                                                                    <MaterialCommunityIcons name={typeIcons[Type]} size={30} color={loadColours[Load]} />
                                                                                </View>

                                                                                <View style={{
                                                                                    flex: 1,
                                                                                    flexDirection: 'column',
                                                                                    alignItems: 'flex-start',
                                                                                    justifyContent: 'flex-end',
                                                                                    // backgroundColor: 'pink',
                                                                                    paddingVertical: 8,
                                                                                }}>
                                                                                    {
                                                                                        Feature == 'WAB' ?

                                                                                            <FontAwesome
                                                                                                name={'wheelchair'}
                                                                                                size={15}
                                                                                                color={theme != 'dark' ? 'black' : 'white'} />

                                                                                            :

                                                                                            null
                                                                                    }
                                                                                </View>

                                                                            </View>
                                                                        )
                                                                    })
                                                                }
                                                            </View>
                                                        </TouchableOpacity>
                                                    )
                                                })
                                            }
                                        </View>

                                        :

                                        <View style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            paddingTop: 10,
                                            paddingBottom: 5,
                                        }}>
                                            {
                                                services.map((service, i) => {
                                                    const { ServiceNo } = service;
                                                    return (
                                                        <View
                                                            key={i.toString()}
                                                            style={{
                                                                backgroundColor: theme != 'dark' ? '#224870' : '#4062C9',
                                                                borderRadius: 5,
                                                                paddingHorizontal: 10,
                                                                paddingTop: 5,
                                                                paddingBottom: 5,
                                                                marginRight: 7,
                                                            }}>
                                                            <Text style={{
                                                                fontFamily: fontsLoaded ? 'Rubik_400Regular' : 'Roboto',
                                                                fontSize: 16,
                                                                color: 'white',
                                                            }}>{ServiceNo}</Text>
                                                        </View>
                                                    )
                                                })
                                            }
                                        </View>
                                }
                            </>

                            :

                            <View style={{
                                paddingVertical: 5,
                            }}>
                                <MaterialCommunityIcons name='sleep' size={30} color={'#3688BF'} />
                            </View>
                }
            </View>
            <TouchableOpacity
                onPress={e => {
                    e.stopPropagation();
                }}>
                <View style={{
                    width: 40,
                    alignItems: 'center',
                    justifyContent: 'center',
                    // backgroundColor: 'pink',
                    borderTopRightRadius: 5,
                    borderBottomRightRadius: 5,
                }}>
                    <AntDesign name='hearto' size={22} color={'#000'} />
                </View>
            </TouchableOpacity>
        </TouchableOpacity>
    )
}