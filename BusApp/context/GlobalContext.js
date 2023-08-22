import { createContext, useState, useContext } from "react";

const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

export default function AppContext({ children }) {

    const [theme, setTheme] = useState('light');

    return (
        <GlobalContext.Provider
            value={{
                theme, setTheme,
            }}>
            {children}
        </GlobalContext.Provider>
    )
}