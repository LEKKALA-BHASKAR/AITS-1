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
//import StudentDashboard from './pages/student/StudentDashboard';
//import StudentProfile from './pages/student/StudentProfile';
//import StudentAttendance from './pages/student/StudentAttendance';
//import StudentResults from './pages/student/StudentResults';
//import StudentAchievements from './pages/student/StudentAchievements';
//import StudentRemarks from './pages/student/StudentRemarks';
//import TeacherDashboard from './pages/teacher/TeacherDashboard';
//import TeacherProfile from './pages/teacher/TeacherProfile';
//import TeacherSections from './pages/teacher/TeacherSections';
//import TeacherStudents from './pages/teacher/TeacherStudents';
//import TeacherAttendance from './pages/teacher/TeacherAttendance';
//import TeacherResults from './pages/teacher/TeacherResults';
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

  const getDefaultRoute = () => {
    if (!user) return '/login';
    if (user.role === 'Super Admin' || user.role === 'Department Admin') return '/admin';
    if (user.role === 'teacher') return '/teacher';
    if (user.role === 'student') return '/student';
    return '/login';
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={!user ? <LoginPage onLogin={handleLogin} /> : <Navigate to={getDefaultRoute()} />}
          />
          
          {/* Admin Routes */}
          <Route
            path="/admin"
            element={user && (user.role === 'Super Admin' || user.role === 'Department Admin') ? <AdminDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin/departments"
            element={user && (user.role === 'Super Admin' || user.role === 'Department Admin') ? <DepartmentsPage user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin/sections"
            element={user && (user.role === 'Super Admin' || user.role === 'Department Admin') ? <SectionsPage user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin/students"
            element={user && (user.role === 'Super Admin' || user.role === 'Department Admin') ? <StudentsPage user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin/teachers"
            element={user && (user.role === 'Super Admin' || user.role === 'Department Admin') ? <TeachersPage user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin/notifications"
            element={user && (user.role === 'Super Admin' || user.role === 'Department Admin') ? <NotificationsPage user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
          />

          {/* Student Routes */}
          <Route
            path="/student"
            element={user && user.rollNumber ? <StudentDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
          />
          <Route
            path="/student/profile"
            element={user && user.rollNumber ? <StudentProfile user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
          />
          <Route
            path="/student/attendance"
            element={user && user.rollNumber ? <StudentAttendance user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
          />
          <Route
            path="/student/results"
            element={user && user.rollNumber ? <StudentResults user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
          />
          <Route
            path="/student/achievements"
            element={user && user.rollNumber ? <StudentAchievements user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
          />
          <Route
            path="/student/remarks"
            element={user && user.rollNumber ? <StudentRemarks user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
          />

          {/* Teacher Routes */}
          <Route
            path="/teacher"
            element={user && user.teacherId ? <TeacherDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
          />
          <Route
            path="/teacher/profile"
            element={user && user.teacherId ? <TeacherProfile user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
          />
          <Route
            path="/teacher/sections"
            element={user && user.teacherId ? <TeacherSections user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
          />
          <Route
            path="/teacher/students"
            element={user && user.teacherId ? <TeacherStudents user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
          />
          <Route
            path="/teacher/attendance"
            element={user && user.teacherId ? <TeacherAttendance user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
          />
          <Route
            path="/teacher/results"
            element={user && user.teacherId ? <TeacherResults user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
          />

          <Route path="*" element={<Navigate to={getDefaultRoute()} />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" richColors />
    </div>
  );
}

export default App;