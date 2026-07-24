import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { useDataStore } from './store/dataStore';
import socket from './services/socket';
import { Toaster } from 'react-hot-toast';

// Layout shell (sidebar + topbar + <Outlet/>)
import Layout from './components/Layout';
import CompanySetupModal from './components/CompanySetupModal';
import ReminderEngine from './components/workspace/ReminderEngine';

// Auth pages (rendered outside the layout)
import Login from './pages/Login';
import Register from './pages/Register';
import LandingPage from './pages/LandingPage';
import ProfileSetup from './pages/ProfileSetup';

// Main pages (rendered inside <Outlet/> of Layout)
import Dashboard from './pages/Dashboard';
import Teams from './pages/Teams';
import Tasks from './pages/Tasks';
import TimeTracker from './pages/TimeTracker';
import SubmitProof from './pages/SubmitProof';
import Reports from './pages/Reports';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Calendar from './pages/Calendar';
import Notifications from './pages/Notifications';
import LeaveManagement from './pages/LeaveManagement';
import Payslips from './pages/Payslips';
import Expenses from './pages/Expenses';
import Documents from './pages/Documents';
import Meetings from './pages/Meetings';
import Workspace from './pages/Workspace';

import './App.css';

function App() {
  const { isAuthenticated } = useAuthStore();
  const fetchAll = useDataStore((state) => state.fetchAll);

  React.useEffect(() => {
    let pollingId = null;
    const startPolling = () => {
      if (pollingId) return;
      pollingId = window.setInterval(() => {
        fetchAll(true);
      }, 30000);
    };
    const stopPolling = () => {
      if (!pollingId) return;
      window.clearInterval(pollingId);
      pollingId = null;
    };

    if (isAuthenticated) {
      // Connect to unified company room
      if (useAuthStore.getState().user?.companyName) {
        socket.emit('joinCompanyRoom', useAuthStore.getState().user.companyName);
      }

      // Listen for data updates from the server
      socket.on('DATA_UPDATED', (data) => {
        console.log('📡 [REAL-TIME] Data update received:', data);
        fetchAll(true); // Force refresh regardless of _loaded state
      });

      socket.on('newMessage', (msg) => {
        useDataStore.getState().addMessage(msg);
      });

      socket.on('connect', stopPolling);
      socket.on('disconnect', startPolling);
      if (!socket.connected) startPolling();
    }
    return () => {
      socket.off('DATA_UPDATED');
      socket.off('newMessage');
      socket.off('connect', stopPolling);
      socket.off('disconnect', startPolling);
      stopPolling();
    };
  }, [isAuthenticated, fetchAll]);

  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />
      {isAuthenticated && <CompanySetupModal />}
      <ReminderEngine />
      <Routes>
        {/* Public routes */}
        <Route 
          path="/landing" 
          element={<LandingPage />} 
        />
        <Route 
          path="/login" 
          element={
            isAuthenticated 
              ? <Navigate to="/dashboard" replace /> 
              : <Login />
          } 
        />
        <Route 
          path="/register" 
          element={
            isAuthenticated 
              ? <Navigate to="/dashboard" replace /> 
              : <Register />
          } 
        />
        <Route 
          path="/profile-setup" 
          element={<ProfileSetup />} 
        />

        {/* Protected routes inside Layout shell */}
        <Route 
          element={
            isAuthenticated 
              ? <Layout /> 
              : <Navigate to="/login" replace />
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/time-tracker" element={<TimeTracker />} />
          <Route path="/submit-proof" element={<SubmitProof />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/leave" element={<LeaveManagement />} />
          <Route path="/payslips" element={<Payslips />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/meetings" element={<Meetings />} />
          <Route path="/workspace" element={<Workspace />} />
        </Route>

        {/* Default redirect */}
        <Route 
          path="/" 
          element={
            isAuthenticated 
              ? <Navigate to="/dashboard" replace /> 
              : <LandingPage />
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;