import AsyncStorage from '@react-native-async-storage/async-storage';
import { useToast } from 'react-native-toast-notifications';
import { useGlobalContext } from '../context/GlobalContext';

export default function useUpdateFavBusStops(setFavBusStops) {

    const { setUpdatingFavData } = useGlobalContext();

    const toast = useToast();

    // Update favourited bus stops
    return async (type, bscode, bsservices, bsdesc) => {
        /*
        type!: 'add', 'remove', 'removeAll'
        bscode!: e.g. 43467 
        bsservices: e.g. [187, 188]

        favData = {
            43467: [187, 188, 947, 985]
        }
        */

        // 1. Perform add/remove operation
        try {
            const favDataStr = await AsyncStorage.getItem('favData');
            if (favDataStr !== null) {

                let favData = JSON.parse(favDataStr);

                if (favData[bscode] === undefined) {
                    favData[bscode] = [];
                }

                switch (type) {
                    case 'add':
                        favData[bscode] = [...new Set([...favData[bscode], ...bsservices])];
                        toast.show(`❤️ ${bsservices.join(', ')} from ${bsdesc}`);
                        break;

                    case 'remove':
                        // console.log('REMOVE LIST: ', bsservices);
                        for (var service of bsservices) {
                            // console.log('REM: ', favData[bscode], service, favData[bscode].indexOf(service));
                            favData[bscode].splice(favData[bscode].indexOf(service), 1);
                        }
                        toast.show(`- ${bsservices.join(', ')} from ${bsdesc}`);

                        if (favData[bscode].length <= 0) {
                            delete favData[bscode];
                            toast.show(`Removed ${bsdesc} from favourites`);
                        }
                        break;
                }

                await AsyncStorage.setItem('favData', JSON.stringify(favData));
                console.log('NEW FAVDATA: ', await AsyncStorage.getItem('favData'));
            }
            else {
                // init favdata and reexecute function
                await AsyncStorage.setItem('favData', JSON.stringify({}));
                await updateFavouriteBusStops(type, bscode, bsservices, bsdesc);
            }
        }
        catch (err) {
            console.log(err);
        }

        setUpdatingFavData([]);

        // 2. Update favourite bus stops list (useState)
        // const favDataStr = await AsyncStorage.getItem('favData');

        // if (favDataStr !== null) {
        //     let favData = JSON.parse(favDataStr);
        //     setUpdatingFavData([]);
        //     setFavBusStops(favData);
        // }
        // else {

        // }
    }
}