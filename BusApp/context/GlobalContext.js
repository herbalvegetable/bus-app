import { createContext, useState, useContext } from "react";

const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

export default function AppContext({ children }) {

    const [theme, setTheme] = useState('light');
    const [updatingFavData, setUpdatingFavData] = useState(['home', 'fav']); // ['home', 'fav']

    return (
        <GlobalContext.Provider
            value={{
                theme, setTheme,
                updatingFavData, setUpdatingFavData,
            }}>
            {children}
        </GlobalContext.Provider>
    )
}