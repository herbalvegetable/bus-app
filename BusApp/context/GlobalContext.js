import { createContext, useState, useContext } from "react";

const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

export default function AppContext({ children }) {

    return (
        <GlobalContext.Provider
            value={{}}>
            {children}
        </GlobalContext.Provider>
    )
}