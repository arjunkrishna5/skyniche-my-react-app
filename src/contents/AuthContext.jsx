import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { REST_API } from '../constants/DefaultValues';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Start as false to show login screen
  const [user, setUser] = useState(null); // No logged-in user at start
  const [loading, setLoading] = useState(false); // Ready to render immediately

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${REST_API}auth/me`, { withCredentials: true });
      setUser(res.data.user);
      setIsAuthenticated(true);
    } catch (err) {
      console.error("Auth check failed:", err.response?.data || err.message);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // fetchUser(); // Temporarily disabled for frontend-only development
  }, []);

  const login = async (email, password) => {
    try {
      // Simulate a 500ms network delay for button spinner visual feedback
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // Accept any credentials, setting the user email dynamically
      setUser({ name: "Demo User", email: email, profile_pic: "" });
      setIsAuthenticated(true);
      return { success: true };
    } catch (err) {
      console.error("Login failed:", err);
      return { success: false, error: 'Login failed' };
    }
  };

  const logout = async () => {
    // Directly clear state without waiting for backend in offline mode
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
