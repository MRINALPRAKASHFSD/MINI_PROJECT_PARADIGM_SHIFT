import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProfileSetup from './pages/ProfileSetup';
import Teams from './pages/Teams';
import Tasks from './pages/Tasks';
import TimeTracker from './pages/TimeTracker';
import SubmitProof from './pages/SubmitProof';
import Reports from './pages/Reports';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Layout from './components/Layout';
import './App.css';

// Protected Route Wrapper Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Public Route Wrapper (redirects to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing Page (Public - Always Accessible) */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />
        
        <Route 
          path="/register" 
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } 
        />
        
        {/* Profile Setup (requires authentication) */}
        <Route 
          path="/profile-setup" 
          element={
            <ProtectedRoute>
              <ProfileSetup />
            </ProtectedRoute>
          } 
        />
        
        {/* Protected Routes with Layout */}
        <Route 
          path="/*" 
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard */}
          <Route path="dashboard" element={<Dashboard />} />
          
          {/* Teams */}
          <Route path="teams" element={<Teams />} />
          
          {/* Tasks */}
          <Route path="tasks" element={<Tasks />} />
          
          {/* Time Tracker */}
          <Route path="time-tracker" element={<TimeTracker />} />
          
          {/* Submit Proof */}
          <Route path="submit-proof" element={<SubmitProof />} />
          
          {/* Reports */}
          <Route path="reports" element={<Reports />} />
          
          {/* Analytics */}
          <Route path="analytics" element={<Analytics />} />
          
          {/* Settings */}
          <Route path="settings" element={<Settings />} />
          
          {/* Redirect empty path to dashboard */}
          <Route path="" element={<Navigate to="/dashboard" replace />} />
          
          {/* 404 Fallback - redirect to dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;