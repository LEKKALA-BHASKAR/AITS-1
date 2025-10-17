import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import DepartmentsPage from './pages/admin/DepartmentsPage';
import SectionsPage from './pages/admin/SectionsPage';
import StudentsPage from './pages/admin/StudentsPage';
import TeachersPage from './pages/admin/TeachersPage';
import NotificationsPage from './pages/admin/NotificationsPage';
import { Toaster } from './components/ui/sonner';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={!user ? <LoginPage onLogin={handleLogin} /> : <Navigate to="/admin" />}
          />
          
          <Route
            path="/admin"
            element={user ? <AdminDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin/departments"
            element={user ? <DepartmentsPage user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin/sections"
            element={user ? <SectionsPage user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin/students"
            element={user ? <StudentsPage user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin/teachers"
            element={user ? <TeachersPage user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin/notifications"
            element={user ? <NotificationsPage user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
          />

          <Route path="*" element={<Navigate to={user ? "/admin" : "/login"} />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" richColors />
    </div>
  );
}

export default App;