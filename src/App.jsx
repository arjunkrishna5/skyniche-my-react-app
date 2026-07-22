import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ViteLanding from './components/ViteLanding';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Storefront from './components/Storefront';
import CustomerAccount from './components/CustomerAccount';
import { useAuth } from './contents/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Homepage - Original Vite Landing Page */}
        <Route 
          path="/" 
          element={<ViteLanding />} 
        />

        {/* Public Customer Storefront */}
        <Route 
          path="/shop" 
          element={<Storefront />} 
        />

        {/* Customer Account & Orders */}
        <Route 
          path="/my-orders" 
          element={
            <ProtectedRoute>
              <CustomerAccount />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <CustomerAccount />
            </ProtectedRoute>
          } 
        />

        {/* Public Login Route */}
        <Route 
          path="/login" 
          element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" replace />} 
        />
        
        {/* Protected Dashboard Route */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />

        {/* Fallback redirection to storefront */}
        <Route 
          path="*" 
          element={<Navigate to="/shop" replace />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
