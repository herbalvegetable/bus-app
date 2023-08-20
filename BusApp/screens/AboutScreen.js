import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from "react-native";

export default function AboutScreen(){
    return (
        <View style={styles.main}>
            <Text>About Screen</Text>
            <StatusBar styles='auto' />
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