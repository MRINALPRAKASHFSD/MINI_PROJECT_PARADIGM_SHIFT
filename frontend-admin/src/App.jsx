import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from './store/authStore';
import { useDataStore } from './store/dataStore';
import socket from './services/socket';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Employees from './components/Employees';
import EmployeeForm from './components/EmployeeForm';
import LeaveManagement from './components/LeaveManagement';
import AttendanceReport from './components/AttendanceReport';
import Reports from './components/Reports';
import Payroll from './components/Payroll';
import Departments from './components/Departments';
import Announcements from './components/Announcements';
import ExpenseApprovals from './components/ExpenseApprovals';
import DocumentVerification from './components/DocumentVerification';
import TaskAssignment from './components/TaskAssignment';
import VideoBackground from './components/VideoBackground';
import './App.css';

function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/" replace />;
}

function App() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const fetchAll = useDataStore((s) => s.fetchAll);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAll();
      
      // Listen for global data updates
      socket.on('DATA_UPDATED', (data) => {
        console.log('📡 [ADMIN REAL-TIME] Data update received:', data);
        fetchAll(true); // Force re-fetch all data
      });
    }
    return () => {
      socket.off('DATA_UPDATED');
    };
  }, [isAuthenticated, fetchAll]);

  return (
    <Router>
      <div className="app">
        {!isAuthenticated ? (
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="*" element={<Navigate to="/" replace />} />
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
                  <Route path="/employees/add" element={<ProtectedRoute><EmployeeForm /></ProtectedRoute>} />
                  <Route path="/employees/edit/:id" element={<ProtectedRoute><EmployeeForm /></ProtectedRoute>} />
                  <Route path="/leaves" element={<ProtectedRoute><LeaveManagement /></ProtectedRoute>} />
                  <Route path="/attendance" element={<ProtectedRoute><AttendanceReport /></ProtectedRoute>} />
                  <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
                  <Route path="/payroll" element={<ProtectedRoute><Payroll /></ProtectedRoute>} />
                  <Route path="/departments" element={<ProtectedRoute><Departments /></ProtectedRoute>} />
                  <Route path="/announcements" element={<ProtectedRoute><Announcements /></ProtectedRoute>} />
                  <Route path="/expense-approvals" element={<ProtectedRoute><ExpenseApprovals /></ProtectedRoute>} />
                  <Route path="/document-verification" element={<ProtectedRoute><DocumentVerification /></ProtectedRoute>} />
                  <Route path="/task-assignment" element={<ProtectedRoute><TaskAssignment /></ProtectedRoute>} />
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
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