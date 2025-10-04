import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// The base URL for your backend API server.
const API_URL = 'http://localhost:5000/api';

// 1. Create the Authentication Context
const AuthContext = createContext();

// 2. Create a custom hook for easy access to the context.
export const useAuth = () => {
    return useContext(AuthContext);
};

// 3. Create the AuthProvider component
export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // This effect runs once when the application starts.
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }
        setLoading(false); // Auth check is complete, allow the app to render.
    }, []);

    // --- Core Authentication Functions (Unchanged) ---
    const signup = async (username, email, password) => {
        try {
            const response = await axios.post(`${API_URL}/signup`, { username, email, password });
            return response.data;
        } catch (error) {
            console.error('Signup error:', error.response.data.message);
            throw new Error(error.response.data.message);
        }
    };

    const login = async (email, password) => {
        try {
            const response = await axios.post(`${API_URL}/login`, { email, password });
            if (response.data && response.data.user) {
                const user = response.data.user;
                setCurrentUser(user);
                localStorage.setItem('user', JSON.stringify(user));
                return user;
            }
        } catch (error) {
            console.error('Login error:', error.response.data.message);
            throw new Error(error.response.data.message);
        }
    };

    const logout = () => {
        setCurrentUser(null);
        localStorage.clear();
    };

    // --- User Profile Management Functions (Unchanged) ---
    const fetchUserProfile = async (email) => {
        try {
            const response = await axios.get(`${API_URL}/user/${email}`);
            setCurrentUser(response.data);
            localStorage.setItem('user', JSON.stringify(response.data));
            return response.data;
        } catch (error) {
            console.error("Failed to fetch user profile", error);
            throw error;
        }
    };

    const updateUserProfile = async (email, dataToUpdate) => {
        try {
            await axios.put(`${API_URL}/user/${email}`, dataToUpdate);
            return await fetchUserProfile(email);
        } catch (error) {
            console.error("Failed to update user profile", error);
            throw error;
        }
    };

    const updateUserProgress = async (email, deckData, statsData) => {
        try {
            await axios.put(`${API_URL}/user/${email}`, deckData);
            await axios.post(`${API_URL}/user/${email}/stats`, statsData);
            return await fetchUserProfile(email);
        } catch (error) {
            console.error("Failed to update user progress", error);
            throw error;
        }
    };

    const resetUserProgress = async (email) => {
        try {
            await axios.post(`${API_URL}/user/${email}/reset`);
            return await fetchUserProfile(email);
        } catch (error) {
            console.error("Failed to reset user progress", error);
            throw error;
        }
    };

    // The value object holds all state and functions.
    // ✅ CHANGE: Added 'loading' here to share it with the rest of the app.
    const value = {
        currentUser,
        loading, // This is the new piece of information we are sharing.
        login,
        signup,
        logout,
        fetchUserProfile,
        updateUserProfile,
        updateUserProgress,
        resetUserProgress,
    };

    // The `!loading && children` part ensures the app only renders after the initial check is done.
    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};