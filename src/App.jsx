import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ViteLanding from './components/ViteLanding';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Storefront from './components/Storefront';
import CustomerAccount from './components/CustomerAccount';
import { useAuth } from './contents/AuthContext';
import { ProductProvider } from './contents/ProductContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role?.toLowerCase() !== "admin") return <Navigate to="/shop" replace />;
  return children;
};

function App() {
  const { isAuthenticated, user } = useAuth();

  return (
    <ProductProvider>
      <Router>
        <Routes>
          {/* Homepage - Redirects directly to Authentication Page (ViteLanding preserved for toggle) */}
          <Route 
            path="/" 
            element={<Navigate to="/login" replace />} 
          />
          {/* Optional Landing Page Route (Uncomment anytime to re-enable) */}
          <Route 
            path="/landing" 
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

          {/* Login / Registration Route */}
          <Route 
            path="/login" 
            element={
              !isAuthenticated ? (
                <Login />
              ) : (
                <Navigate to={user?.role?.toLowerCase() === "admin" ? "/dashboard" : "/shop"} replace />
              )
            } 
          />
          
          {/* Protected Admin Dashboard Route */}
          <Route 
            path="/dashboard" 
            element={
              <AdminRoute>
                <Dashboard />
              </AdminRoute>
            } 
          />

          {/* Fallback redirection to storefront */}
          <Route 
            path="*" 
            element={<Navigate to="/shop" replace />} 
          />
        </Routes>
      </Router>
    </ProductProvider>
  );
}

export default App;
