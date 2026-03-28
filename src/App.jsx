import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuthStore } from './store/authStore';
import { useToast } from './hooks/useToast';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import ToastContainer from './components/Toast';
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
    return <Navigate to="/" replace />;
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

// Enhanced Layout Wrapper with Sidebar, Navbar, and Toast
const EnhancedLayout = ({ children, showToast }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    showToast('Logged out successfully', 'success');
  };

  return (
    <div className="app-container">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        showToast={showToast}
      />
      
      <div className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <Navbar 
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          onLogout={handleLogout}
          showToast={showToast}
        />
        
        <div className="page-content">
          {children}
        </div>
      </div>
    </div>
  );
};

function App() {
  const { toasts, showToast, removeToast } = useToast();

  return (
    <Router>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/" 
          element={
            <PublicRoute>
              <Login showToast={showToast} />
            </PublicRoute>
          } 
        />
        
        <Route 
          path="/register" 
          element={
            <PublicRoute>
              <Register showToast={showToast} />
            </PublicRoute>
          } 
        />
        
        {/* Profile Setup (requires authentication) */}
        <Route 
          path="/profile-setup" 
          element={
            <ProtectedRoute>
              <ProfileSetup showToast={showToast} />
            </ProtectedRoute>
          } 
        />
        
        {/* Protected Routes with Enhanced Layout */}
        <Route 
          path="/*" 
          element={
            <ProtectedRoute>
              <EnhancedLayout showToast={showToast}>
                <Routes>
                  {/* Dashboard */}
                  <Route path="dashboard" element={<Dashboard showToast={showToast} />} />
                  
                  {/* Teams */}
                  <Route path="teams" element={<Teams showToast={showToast} />} />
                  
                  {/* Tasks */}
                  <Route path="tasks" element={<Tasks showToast={showToast} />} />
                  
                  {/* Time Tracker */}
                  <Route path="time-tracker" element={<TimeTracker showToast={showToast} />} />
                  
                  {/* Submit Proof */}
                  <Route path="submit-proof" element={<SubmitProof showToast={showToast} />} />
                  
                  {/* Reports */}
                  <Route path="reports" element={<Reports showToast={showToast} />} />
                  
                  {/* Analytics */}
                  <Route path="analytics" element={<Analytics showToast={showToast} />} />
                  
                  {/* Settings */}
                  <Route path="settings" element={<Settings showToast={showToast} />} />
                  
                  {/* Redirect root to dashboard */}
                  <Route path="" element={<Navigate to="/dashboard" replace />} />
                  
                  {/* 404 Fallback - redirect to dashboard */}
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </EnhancedLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;