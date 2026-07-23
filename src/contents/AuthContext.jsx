import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Initialize with real registered users from localStorage (starting empty if new)
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const saved = localStorage.getItem("ecommerce_registered_users");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("ecommerce_registered_users", JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  const login = async (email, password) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      const cleanEmail = email.trim().toLowerCase();
      const isAdmin = cleanEmail.includes("admin");

      // Admin Login
      if (isAdmin) {
        const adminUser = {
          id: `USER-${Math.floor(100 + Math.random() * 900)}`,
          name: "Admin User",
          email: cleanEmail.includes("@") ? cleanEmail : "admin@gmail.com",
          role: "admin",
          joined: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
          status: "Active",
          profile_pic: "",
        };

        // Ensure Admin exists in registeredUsers list
        if (!registeredUsers.some((u) => u.email.toLowerCase() === adminUser.email)) {
          setRegisteredUsers((prev) => [adminUser, ...prev]);
        }

        setUser(adminUser);
        setIsAuthenticated(true);
        return { success: true, user: adminUser };
      }
      
      // Customer Login: Look up existing user
      let existingUser = registeredUsers.find((u) => u.email.toLowerCase() === cleanEmail);

      if (!existingUser) {
        // Auto-register new customer if signing in for first time
        existingUser = {
          id: `USER-${Math.floor(100 + Math.random() * 900)}`,
          name: cleanEmail.split("@")[0].replace(".", " "),
          email: cleanEmail,
          password: password || "123456",
          role: "Customer",
          joined: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
          status: "Active",
        };
        setRegisteredUsers((prev) => [existingUser, ...prev]);
      } else if (password && existingUser.password && existingUser.password !== password) {
        return { success: false, error: "Incorrect password. Please try again." };
      }

      setUser(existingUser);
      setIsAuthenticated(true);
      return { success: true, user: existingUser };
    } catch (err) {
      console.error("Login failed:", err);
      return { success: false, error: 'Login failed' };
    }
  };

  const registerUser = async (name, email, password) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      
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

      setRegisteredUsers((prev) => [newUser, ...prev.filter((u) => u.email.toLowerCase() !== cleanEmail)]);
      setUser(newUser);
      setIsAuthenticated(true);
      return { success: true, user: newUser };
    } catch (err) {
      console.error("Registration failed:", err);
      return { success: false, error: 'Registration failed' };
    }
  };

  const deleteUserAccount = (id) => {
    setRegisteredUsers((prev) => prev.filter((u) => u.id !== id && u.email !== id));
  };

  const toggleUserStatus = (id) => {
    setRegisteredUsers((prev) =>
      prev.map((u) =>
        u.id === id || u.email === id ? { ...u, status: u.status === "Active" ? "Suspended" : "Active" } : u
      )
    );
  };

  const toggleUserRole = (id) => {
    setRegisteredUsers((prev) =>
      prev.map((u) =>
        u.id === id || u.email === id ? { ...u, role: u.role === "Admin" ? "Customer" : "Admin" } : u
      )
    );
  };

  const logout = async () => {
    setUser(null);
    setIsAuthenticated(false);
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
