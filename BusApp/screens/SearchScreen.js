import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from "react-native";
import { useFonts, Rubik_400Regular } from '@expo-google-fonts/dev';
import { useToast } from 'react-native-toast-notifications';
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';

import BUS_STOP_DATA from '../assets/bus_stops.json';
import Screen from '../components/Screen';
import { useGlobalContext } from '../context/GlobalContext';

export default function SearchScreen(){

    const { theme, updatingFavData, setUpdatingFavData } = useGlobalContext();

    const toast = useToast();

    let [fontsLoaded] = useFonts({
        Rubik_400Regular,
    });

    return (
        <Screen onRefreshEvent={async setRefreshing => {
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
                    Search
                </Text>
            </View>
        </Screen>
    )
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});