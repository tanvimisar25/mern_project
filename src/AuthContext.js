import React, { createContext, useContext, useState, useEffect } from 'react';
import * as Realm from "realm-web";

// 1. INITIALIZE THE REALM APP HERE. This is the only place.
const APP_ID = "realmwebsite-hyrdqzm"; 
const app = new Realm.App({ id: APP_ID });

// 2. Create the context
const AuthContext = createContext(null);

// 3. Create the Provider component (the "intercom system")
export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(app.currentUser);

    useEffect(() => {
        setCurrentUser(app.currentUser);
    }, []);

    const login = async (credentials) => {
        const user = await app.logIn(credentials);
        setCurrentUser(user); // Announce the new user to the app
        return user;
    };

    const logout = async () => {
        if (app.currentUser) {
            await app.currentUser.logOut();
        }
        setCurrentUser(null); // Announce that the user has left
    };

    const contextValue = {
        currentUser,
        login,
        logout,
        app 
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

// 4. Create a custom hook to easily "listen" to the intercom
export const useAuth = () => {
    return useContext(AuthContext);
};

