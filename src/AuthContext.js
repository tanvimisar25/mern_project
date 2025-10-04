import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// The base URL of your backend server
const API_URL = 'http://localhost:5000/api';

// 1. Create the Auth Context
const AuthContext = createContext();

// 2. Create a custom hook to use the context easily
export const useAuth = () => {
    return useContext(AuthContext);
};

// 3. Create the AuthProvider component
export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // This effect runs once when the app starts
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    // --- Core Authentication Functions ---
    const signup = async (username, email, password) => {
        try {
            const response = await axios.post(`${API_URL}/signup`, {
                username,
                email,
                password,
            });
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

    // --- ✅ THE CORRECTED LOGOUT FUNCTION ---
    const logout = () => {
        setCurrentUser(null);

        // THIS IS THE CRITICAL FIX:
        // localStorage.removeItem('user') ONLY removes the user's login status.
        // It leaves behind other data like edited decks, progress, etc.
        // localStorage.clear() removes ALL data for the site, guaranteeing
        // that the next user starts with a completely clean slate.
        localStorage.clear();
    };

    // --- User Profile Management Functions ---

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

    const value = {
        currentUser,
        login,
        signup,
        logout,
        fetchUserProfile,
        updateUserProfile,
        updateUserProgress,
        resetUserProgress,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};