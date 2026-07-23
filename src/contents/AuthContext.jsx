import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { REST_API } from '../constants/DefaultValues';

const AuthContext = createContext();

const API_BASE = REST_API.endsWith('/') ? REST_API.slice(0, -1) : REST_API;

export const AuthProvider = ({ children }) => {
  // Session persistence per tab using sessionStorage (allows multi-tab testing)
  const [user, setUser] = useState(() => {
    const savedUser = sessionStorage.getItem("ecommerce_current_user") || localStorage.getItem("ecommerce_current_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!(sessionStorage.getItem("ecommerce_current_user") || localStorage.getItem("ecommerce_current_user"));
  });

  useEffect(() => {
    if (user) {
      sessionStorage.setItem("ecommerce_current_user", JSON.stringify(user));
      setIsAuthenticated(true);
    } else {
      sessionStorage.removeItem("ecommerce_current_user");
      localStorage.removeItem("ecommerce_current_user");
      setIsAuthenticated(false);
    }
  }, [user]);

  // Registered users list (starts clean)
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const saved = localStorage.getItem("ecommerce_registered_users");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("ecommerce_registered_users", JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  // Fetch users from MySQL database via backend if server is running
  useEffect(() => {
    const fetchUsersFromDB = async () => {
      try {
        const res = await axios.post(`${API_BASE}/webservices/users/get-all-users`);
        const userList = Array.isArray(res.data?.data) ? res.data.data : (Array.isArray(res.data) ? res.data : []);
        if (userList.length > 0) {
          const dbUsers = userList.map((u) => ({
            id: `USER-${u.id}`,
            name: u.name,
            email: u.email,
            role: u.role || (u.email.includes("admin") ? "admin" : "customer"),
            joined: u.timestamp
              ? new Date(u.timestamp * 1000).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
              : "Jul 2026",
            status: u.status === 1 ? "Active" : "Suspended",
          }));
          setRegisteredUsers(dbUsers);
        }
      } catch (err) {
        // Backend offline fallback - keep localStorage state
      }
    };
    fetchUsersFromDB();
  }, []);

  const login = async (email, password) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      const cleanEmail = email.trim().toLowerCase();
      const isAdmin = cleanEmail.includes("admin");

      // Check if user is registered in our database / state
      const registeredAccount = registeredUsers.find((u) => u.email.toLowerCase() === cleanEmail);

      if (registeredAccount && password && registeredAccount.password && registeredAccount.password !== password) {
        return { success: false, error: "Incorrect password. Please try again." };
      }

      const loggedUser = {
        id: registeredAccount?.id || `USER-${Math.floor(100 + Math.random() * 900)}`,
        name: registeredAccount?.name || (isAdmin ? "Admin User" : cleanEmail.split("@")[0].replace(".", " ")),
        email: cleanEmail,
        role: isAdmin ? "admin" : (registeredAccount?.role || "customer"),
        profile_pic: "",
      };

      setUser(loggedUser);
      setIsAuthenticated(true);
      return { success: true, user: loggedUser };
    } catch (err) {
      console.error("Login failed:", err);
      return { success: false, error: 'Login failed' };
    }
  };

  const registerUser = async (name, email, password) => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      const isAdmin = cleanEmail.includes("admin");

      const newUser = {
        id: `USER-${Math.floor(100 + Math.random() * 900)}`,
        name: name || cleanEmail.split("@")[0],
        email: cleanEmail,
        password: password,
        role: isAdmin ? "admin" : "customer",
        joined: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
        status: "Active",
      };

      // 1. Sync to MySQL database via Backend API (/signup)
      try {
        await axios.post(`${API_BASE}/signup`, {
          name: newUser.name,
          email: newUser.email,
          password: password || '123456',
        });
      } catch (dbErr) {
        console.warn("Backend MySQL sync skipped (server offline or already exists):", dbErr.message);
      }

      // 2. Save only explicitly registered users to state & localStorage
      setRegisteredUsers((prev) => [newUser, ...prev.filter((u) => u.email.toLowerCase() !== cleanEmail)]);
      setUser(newUser);
      setIsAuthenticated(true);
      return { success: true, user: newUser };
    } catch (err) {
      console.error("Registration failed:", err);
      return { success: false, error: 'Registration failed' };
    }
  };

  const deleteUserAccount = (targetId) => {
    if (!targetId) return;
    setRegisteredUsers((prev) =>
      prev.filter(
        (u) =>
          u.id !== targetId &&
          u.email !== targetId &&
          (u.email ? u.email.toLowerCase() !== String(targetId).toLowerCase() : true)
      )
    );
  };

  const toggleUserStatus = (targetId) => {
    if (!targetId) return;
    setRegisteredUsers((prev) =>
      prev.map((u) =>
        u.id === targetId || u.email === targetId
          ? { ...u, status: u.status === "Active" ? "Suspended" : "Active" }
          : u
      )
    );
  };

  const toggleUserRole = (targetId) => {
    if (!targetId) return;
    setRegisteredUsers((prev) =>
      prev.map((u) =>
        u.id === targetId || u.email === targetId
          ? { ...u, role: u.role === "admin" ? "customer" : "admin" }
          : u
      )
    );
  };

  const logout = async () => {
    setUser(null);
    setIsAuthenticated(false);
    sessionStorage.removeItem("ecommerce_current_user");
    localStorage.removeItem("ecommerce_current_user");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        registeredUsers,
        login,
        registerUser,
        deleteUserAccount,
        toggleUserStatus,
        toggleUserRole,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
