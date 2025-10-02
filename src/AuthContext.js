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
      console.log('Signup successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('Signup error:', error.response.data.message);
      throw new Error(error.response.data.message);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });

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

  // --- ✅ NEW FUNCTIONS FOR MANAGING USER PROFILE DATA ---

  // Fetches the most up-to-date user profile from the backend
  const fetchUserProfile = async (email) => {
    try {
        const response = await axios.get(`${API_URL}/user/${email}`);
        // Update the user in our context and localStorage with the fresh data
        setCurrentUser(response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
        return response.data;
    } catch (error) {
        console.error("Failed to fetch user profile", error);
        throw error;
    }
  };

  // Sends updated data (like a new todo list) to the backend to be saved
  const updateUserProfile = async (email, dataToUpdate) => {
    try {
        await axios.put(`${API_URL}/user/${email}`, dataToUpdate);
        // After a successful update, we re-fetch the profile to ensure our
        // frontend state is perfectly in sync with the database.
        return await fetchUserProfile(email);
    } catch (error) {
        console.error("Failed to update user profile", error);
        throw error;
    }
  };


  // The value provided to the context consumers
  const value = {
    currentUser,
    login,
    signup,
    logout,
    fetchUserProfile, // <-- ✅ Add the new function here
    updateUserProfile, // <-- ✅ And here
  };

  // Don't render the app until we've checked for a logged-in user
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};