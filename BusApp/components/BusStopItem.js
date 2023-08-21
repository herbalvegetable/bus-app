import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ScrollView } from "react-native";
import { useFonts, Rubik_400Regular } from '@expo-google-fonts/dev';
import { MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import axios from 'axios';

import { LTA_API_KEY } from '@env';
import useCalcLatLongDist from '../hooks/useCalcLatLongDist';
import useCalcTimeDiff from '../hooks/useCalcTimeDiff';

export default function BusStopItem(props) {

    let [fontsLoaded] = useFonts({
        Rubik_400Regular,
    });

    const { bstop, dist } = props;

    const [expanded, setExpanded] = useState(false);
    const [services, setServices] = useState([]);

    useEffect(() => {
        const config = {
            headers: {
                'Accept': 'application/json',
                'AccountKey': LTA_API_KEY,
            },
        }

        console.log('BUSSTOPCODE: ', bstop.BusStopCode);

        axios.get(`http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2?BusStopCode=${bstop.BusStopCode}`, config)
            .then(res => {
                console.log(bstop.BusStopCode, res.data);
                setServices(res.data.Services);

                // TESTING AT NIGHT ZZZZZZZZ
                // let data = {
                //     "odata.metadata": "http://datamall2.mytransport.sg/ltaodataservice/$metadata#BusArrivalv2/@Element",
                //     "BusStopCode": "43601",
                //     "Services": [
                //         {
                //             "ServiceNo": "187",
                //             "Operator": "SMRT",
                //             "NextBus": {
                //                 "OriginCode": "43009",
                //                 "DestinationCode": "44009",
                //                 "EstimatedArrival": "2023-08-21T22:59:13+08:00",
                //                 "Latitude": "0.0",
                //                 "Longitude": "0.0",
                //                 "VisitNumber": "1",
                //                 "Load": "SEA",
                //                 "Feature": "WAB",
                //                 "Type": "SD"
                //             },
                //             "NextBus2": {
                //                 "OriginCode": "43009",
                //                 "DestinationCode": "44009",
                //                 "EstimatedArrival": "2023-08-21T23:13:27+08:00",
                //                 "Latitude": "0.0",
                //                 "Longitude": "0.0",
                //                 "VisitNumber": "1",
                //                 "Load": "SEA",
                //                 "Feature": "WAB",
                //                 "Type": "DD"
                //             },
                //             "NextBus3": {
                //                 "OriginCode": "43009",
                //                 "DestinationCode": "44009",
                //                 "EstimatedArrival": "2023-08-21T23:27:27+08:00",
                //                 "Latitude": "0.0",
                //                 "Longitude": "0.0",
                //                 "VisitNumber": "1",
                //                 "Load": "SEA",
                //                 "Feature": "WAB",
                //                 "Type": "SD"
                //             }
                //         },
                //         {
                //             "ServiceNo": "188",
                //             "Operator": "SMRT",
                //             "NextBus": {
                //                 "OriginCode": "43009",
                //                 "DestinationCode": "44009",
                //                 "EstimatedArrival": "2023-08-21T22:59:13+08:00",
                //                 "Latitude": "0.0",
                //                 "Longitude": "0.0",
                //                 "VisitNumber": "1",
                //                 "Load": "SEA",
                //                 "Feature": "WAB",
                //                 "Type": "DD"
                //             },
                //             "NextBus2": {
                //                 "OriginCode": "43009",
                //                 "DestinationCode": "44009",
                //                 "EstimatedArrival": "2023-08-21T23:13:27+08:00",
                //                 "Latitude": "0.0",
                //                 "Longitude": "0.0",
                //                 "VisitNumber": "1",
                //                 "Load": "SDA",
                //                 "Feature": "WAB",
                //                 "Type": "DD"
                //             },
                //             "NextBus3": {
                //                 "OriginCode": "43009",
                //                 "DestinationCode": "44009",
                //                 "EstimatedArrival": "2023-08-21T23:27:27+08:00",
                //                 "Latitude": "0.0",
                //                 "Longitude": "0.0",
                //                 "VisitNumber": "1",
                //                 "Load": "LSD",
                //                 "Feature": "WAB",
                //                 "Type": "SD"
                //             }
                //         },
                //         {
                //             "ServiceNo": "991",
                //             "Operator": "SMRT",
                //             "NextBus": {
                //                 "OriginCode": "43009",
                //                 "DestinationCode": "44009",
                //                 "EstimatedArrival": "2023-08-21T22:59:13+08:00",
                //                 "Latitude": "0.0",
                //                 "Longitude": "0.0",
                //                 "VisitNumber": "1",
                //                 "Load": "SEA",
                //                 "Feature": "WAB",
                //                 "Type": "DD"
                //             },
                //             "NextBus2": {
                //                 "OriginCode": "43009",
                //                 "DestinationCode": "44009",
                //                 "EstimatedArrival": "2023-08-21T23:13:27+08:00",
                //                 "Latitude": "0.0",
                //                 "Longitude": "0.0",
                //                 "VisitNumber": "1",
                //                 "Load": "SEA",
                //                 "Feature": "WAB",
                //                 "Type": "DD"
                //             },
                //             "NextBus3": {
                //                 "OriginCode": "43009",
                //                 "DestinationCode": "44009",
                //                 "EstimatedArrival": "2023-08-21T23:27:27+08:00",
                //                 "Latitude": "0.0",
                //                 "Longitude": "0.0",
                //                 "VisitNumber": "1",
                //                 "Load": "SEA",
                //                 "Feature": "WAB",
                //                 "Type": "DD"
                //             }
                //         }
                //     ]
                // }
                // setServices(data.Services);
            })
            .catch(err => console.log(err))
    }, []);

    return (
        <TouchableOpacity
            style={{
                flex: 1,
                flexDirection: 'column',
                paddingHorizontal: 10,
                paddingTop: 15,
                paddingBottom: 5,
                marginTop: expanded ? 10 : 0,
                marginBottom: expanded ? 20 : 10,
                borderRadius: 5,
                backgroundColor: '#D6F5FF',
            }}
            onPress={e => {
                console.log('EXPAND', bstop.BusStopCode);
                // setExpanded(true);
                setExpanded(!expanded);
            }}>
            <Text style={{
                fontSize: 20,
                // fontWeight: 'bold',
                fontFamily: fontsLoaded ? 'Rubik_400Regular' : 'Roboto',
                marginBottom: 5,
            }}>
                {bstop.Description}
            </Text>
            <Text style={{
                fontSize: 16,
                fontFamily: fontsLoaded ? 'Rubik_400Regular' : 'Roboto',
                color: 'gray',
            }}>
                {dist}m away
            </Text>
            {
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
                                                                    'SEA': 'green',
                                                                    'SDA': 'orange',
                                                                    'LSD': 'red',
                                                                }

                                                                let typeIcons = {
                                                                    'SD': 'bus-side',
                                                                    'DD': 'bus-double-decker',
                                                                }

                                                                let arrivalTime = useCalcTimeDiff(new Date().toString(), eta);

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
                                                                            }}>{arrivalTime || '-'}</Text>
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

                                                                                <FontAwesome name={'wheelchair'} size={15} color={'#000'}/>

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
                                                        backgroundColor: '#555',
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

                    <Text>Loading bus services...</Text>
            }
        </TouchableOpacity>
    )
}