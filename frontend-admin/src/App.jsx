import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Employees from './components/Employees';
import LeaveManagement from './components/LeaveManagement';
import AttendanceReport from './components/AttendanceReport';
import Reports from './components/Reports';
import Payroll from './components/Payroll';
import Departments from './components/Departments';
import Announcements from './components/Announcements';
import VideoBackground from './components/VideoBackground';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const ProtectedRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/" />;
  };

  return (
    <Router>
      <div className="app">
        {! isAuthenticated ? (
          <Routes>
            <Route path="/" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        ) : (
          <>
            <VideoBackground />
            <Navbar />
            <div className="app-container">
              <Sidebar />
              <div className="main-content">
                <Routes>
                  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/employees" element={<ProtectedRoute><Employees /></ProtectedRoute>} />
                  <Route path="/leaves" element={<ProtectedRoute><LeaveManagement /></ProtectedRoute>} />
                  <Route path="/attendance" element={<ProtectedRoute><AttendanceReport /></ProtectedRoute>} />
                  <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
                  <Route path="/payroll" element={<ProtectedRoute><Payroll /></ProtectedRoute>} />
                  <Route path="/departments" element={<ProtectedRoute><Departments /></ProtectedRoute>} />
                  <Route path="/announcements" element={<ProtectedRoute><Announcements /></ProtectedRoute>} />
                  <Route path="/" element={<Navigate to="/dashboard" />} />
                  <Route path="*" element={<Navigate to="/dashboard" />} />
                </Routes>
              </div>
            </div>
          </>
        )}
      </div>
    </Router>
  );
}

export default App;