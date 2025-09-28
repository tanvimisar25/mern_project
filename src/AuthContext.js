import React, { createContext, useContext, useState, useEffect } from 'react';
import * as Realm from "realm-web";

const APP_ID = "realmwebsite-hyrdqzm"; 
const app = new Realm.App({ id: APP_ID });

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setCurrentUser(app.currentUser);
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

    // --- EDITED SIGN-UP FUNCTION ---
    const signUp = async (email, password, username) => {
        // This part remains the same: create the auth user
        await app.emailPasswordAuth.registerUser({ email, password });
        
        // Log the user in to get a session
        const credentials = Realm.Credentials.emailPassword(email, password);
        const user = await app.logIn(credentials);
        setCurrentUser(user);

        try {
            const mongo = user.mongoClient("mongodb-atlas");
            const usersCollection = mongo.db("prepdeck").collection("user");

            // THE MAIN CHANGE IS HERE:
            // This now inserts the complete blueprint with separate username and email fields.
            await usersCollection.insertOne({
                auth_id: user.id,
                username: username, // Use the username from the form
                email: email,       // Add the new email field
                todos: [],
                "accuracy score": 0,
                favs: {},
                completedDecks: {},
                masteredDecks: {},
                editedDecks: {}
            });
        } catch (error) {
            console.error("Failed to create user profile in database:", error);
        }
        
        return user;
    };


    const contextValue = { currentUser, login, logout, signUp, app };

    return (
        <AuthContext.Provider value={contextValue}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};