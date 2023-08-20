import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from "react-native";

export default function FavScreen(){
    return (
        <SafeAreaView style={styles.main}>
            <Text>Favourites Screen</Text>
            <StatusBar style='auto' />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});