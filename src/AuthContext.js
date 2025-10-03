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

  // --- Core Authentication Functions (Unchanged) ---
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

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('user');
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
        return await fetchUserProfile(email); // Re-fetch after update
    } catch (error) {
        console.error("Failed to update user profile", error);
        throw error;
    }
  };

  // ✅ 1. ADD THIS NEW, CONSOLIDATED FUNCTION
  // This function will handle both deck progress and accuracy stats in one go.
  const updateUserProgress = async (email, deckData, statsData) => {
    try {
      // First, update the completed/mastered decks
      await axios.put(`${API_URL}/user/${email}`, deckData);

      // Second, update the accuracy stats
      await axios.post(`${API_URL}/user/${email}/stats`, statsData);

      // Finally, fetch the fresh user profile to update the entire app
      return await fetchUserProfile(email);
    } catch (error) {
      console.error("Failed to update user progress", error);
      throw error;
    }
  };

  // ✅ 1. ADD THE NEW RESET FUNCTION
  const resetUserProgress = async (email) => {
    try {
      // Call the new backend endpoint
      await axios.post(`${API_URL}/user/${email}/reset`);
      
      // After a successful reset, re-fetch the profile to update the app
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
    resetUserProgress, // ✅ 2. EXPORT THE NEW FUNCTION
  };


  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};