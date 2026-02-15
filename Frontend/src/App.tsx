import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './components/Pages/AuthArea/Login/Login';
import authService from './services/AuthService';
import AddOrder from './components/Pages/Orders/AddOrder/AddOrder';
import MyOrders from './components/Pages/Orders/MyOrders/MyOrders';
import ProtectedRoute from './components/Pages/AuthArea/ProtectedRoute/ProtectedRoute';
import PublicRoute from './components/Pages/AuthArea/PublicRoute/PublicRoute';
import Header from './components/LayoutArea/Header/Header';
import './App.css';
import OrderActivity from './components/Pages/OrderActivity/OrderActivity';

// Root redirect component with role-based logic
const RootRedirect: React.FC = () => {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const user = authService.getCurrentUser();
  
  if (user?.role === 'admin') {
    return <Navigate to="/activities" replace />;
  } else {
    return <Navigate to="/my-orders" replace />;
  }
};

// Layout wrapper component
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    window.location.href = '/login';
  };

  return (
    <div className="app-layout" >
      {!isLoginPage && authService.isAuthenticated() && (
        <Header 
          userName={user?.sub}
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
          {/* Public Route - Login */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/activities"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <OrderActivity />
              </ProtectedRoute>
            }
          />

          {/* User Routes */}
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

          {/* Root - redirect based on auth and role */}
          <Route path="/" element={<RootRedirect />} />

          {/* Catch all - redirect to root */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;