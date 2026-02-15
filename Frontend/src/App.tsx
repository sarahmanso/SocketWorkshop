import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './components/Pages/AuthArea/Login/Login';
import Header from './components/LayoutArea/Header/Header';
import OrderActivity from './components/Pages/OrderActivity/OrderActivity';
import authService from './services/AuthService';
import './App.css';

const Rides: React.FC = () => {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="page-content">
      <div className="content-container">
        <h1>נסיעות</h1>
        <p>ניהול נסיעות יופיע כאן</p>
      </div>
    </div>
  );
};

const Vehicles: React.FC = () => {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="page-content">
      <div className="content-container">
        <h1>רכבים</h1>
        <p>ניהול רכבים יופיע כאן</p>
      </div>
    </div>
  );
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    window.location.href = '/login';
  };

  return (
    <div className="app-layout" dir="rtl">
      {!isLoginPage && authService.isAuthenticated() && (
        <Header 
          userName={user?.username}
          userRole={user?.role}
          onLogout={handleLogout}
        />
      )}
      <main className={isLoginPage ? '' : 'main-content'}>
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Login Page */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route path="/activities" element={<OrderActivity />} />
          <Route path="/rides" element={<Rides />} />
          <Route path="/vehicles" element={<Vehicles />} />

          {/* Root - redirect based on auth */}
          <Route
            path="/"
            element={
              authService.isAuthenticated() 
                ? <Navigate to="/activities" replace />
                : <Navigate to="/login" replace />
            }
          />

          {/* Catch all - redirect to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;