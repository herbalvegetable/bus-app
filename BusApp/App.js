import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppContext from './context/GlobalContext';

import BottomTabs from './components/BottomTabs';

export default function App() {
	return (
		<AppContext>
			<NavigationContainer>
				<BottomTabs />
			</NavigationContainer>
		</AppContext>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
});
