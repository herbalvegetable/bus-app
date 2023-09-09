import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppContext from './context/GlobalContext';
import { ToastProvider } from 'react-native-toast-notifications';

import BottomTabs from './components/BottomTabs';

export default function App() {
	return (
		<AppContext>
			<ToastProvider
				duration={2500}
				animationType='zoom-in'
				offsetBottom={50}>
				<NavigationContainer>
					<BottomTabs />
				</NavigationContainer>
			</ToastProvider>
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
