import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Pages/AuthArea/Login/Login';
import authService from './services/AuthService';
import AddOrder from './components/Pages/Orders/AddOrder/AddOrder';
import MyOrders from './components/Pages/Orders/MyOrders/MyOrders';

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
        {/* Login Page */}
        <Route path="/login" element={<Login />} />

        {/* Dashboard - checks auth inside component */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-order" element={<AddOrder />} />
        <Route path="/my-orders" element={<MyOrders />} />



        {/* Root - redirect based on auth */}
        <Route
          path="/"
          element={
            authService.isAuthenticated() 
              ? <Navigate to="/dashboard" replace />
              : <Navigate to="/login" replace />
          }
        />

        {/* Catch all - redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App
