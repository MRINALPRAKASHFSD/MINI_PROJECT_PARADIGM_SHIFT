import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

// Layout shell (sidebar + topbar + <Outlet/>)
import Layout from './components/Layout';

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

import './App.css';

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Router>
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
          <Route path="/profile" element={<Profile />} />
          <Route path="/calendar" element={<Calendar />} />
        </Route>

        {/* Default redirect */}
        <Route 
          path="/" 
          element={
            isAuthenticated 
              ? <Navigate to="/dashboard" replace /> 
              : <Navigate to="/login" replace />
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;