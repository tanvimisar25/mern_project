import React, { createContext, useContext, useState, useEffect } from 'react';
import * as Realm from "realm-web";

const APP_ID = "realmwebsite-hyrdqzm"; 
const app = new Realm.App({ id: APP_ID });

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    // ✅ 1. ADD A NEW 'LOADING' STATE, STARTING AS TRUE
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // This runs once when the app starts and checks for a stored session.
        setCurrentUser(app.currentUser);
        // ✅ 2. AFTER THE CHECK, SET LOADING TO FALSE
        setLoading(false);
    }, []);

    const login = async (credentials) => {
        const user = await app.logIn(credentials);
        setCurrentUser(user);
        return user;
    };

    const logout = async () => {
        if (app.currentUser) {
            await app.currentUser.logOut();
        }
        setCurrentUser(null);
    };

    const contextValue = { currentUser, login, logout, app };

    return (
        <AuthContext.Provider value={contextValue}>
            {/* ✅ 3. ONLY RENDER THE APP WHEN NOT LOADING */}
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};