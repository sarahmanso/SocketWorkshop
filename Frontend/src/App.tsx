import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Pages/AuthArea/Login/Login';
import authService from './services/AuthService';
import AddOrder from './components/Pages/Orders/AddOrder/AddOrder';
import MyOrders from './components/Pages/Orders/MyOrders/MyOrders';
import ProtectedRoute from './components/Pages/AuthArea/ProtectedRoute/ProtectedRoute';
import PublicRoute from './components/Pages/AuthArea/PublicRoute/PublicRoute';

const Dashboard: React.FC = () => {
  const user = authService.getCurrentUser();
  
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  
  const handleLogout = () => {
    authService.logout();
    window.location.href = '/login';
  };

  return (
    <div style={{ padding: '40px' }}>
      <h1>Dashboard</h1>
      <p>Welcome, {user?.username}!</p>
      <p>Role: {user?.role}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />


              <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/add-order"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <AddOrder />
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-orders"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <MyOrders />
          </ProtectedRoute>
        }
      />


        <Route
          path="/"
          element={
            authService.isAuthenticated() 
              ? <Navigate to="/dashboard" replace />
              : <Navigate to="/login" replace />
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App
