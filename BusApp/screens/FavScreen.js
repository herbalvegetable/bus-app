import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from "react-native";

export default function FavScreen(){
    return (
        <View style={styles.main}>
            <Text>Favourites Screen</Text>
            <StatusBar style='auto' />
        </View>
    )
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});