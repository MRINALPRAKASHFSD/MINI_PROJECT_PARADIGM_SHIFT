import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useDataStore } from '../store/dataStore';
import { logout as firebaseLogout } from '../config/firebase';
import {
  LayoutDashboard, Users, CheckSquare, Clock, Camera, FileText,
  BarChart3, Settings, LogOut, Menu, X, Bell, Sun, Moon,
  Sparkles, Calendar, User, Palmtree, IndianRupee, Receipt, FolderOpen, Blocks
} from 'lucide-react';
import './Layout.css';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const { user, logout: clearUser } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Real unread count from dataStore
  const notifications = useDataStore(s => s.notifications);
  const companySettings = useDataStore(s => s.companySettings);
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    // Sync theme settings and system mode
    if (companySettings?.theme) {
      if (companySettings.theme.mode === 'light') setDarkMode(false);
      else if (companySettings.theme.mode === 'dark') setDarkMode(true);
      
      if (companySettings.theme.primaryColor) {
        document.documentElement.style.setProperty('--primary', companySettings.theme.primaryColor);
      }
    }
  }, [companySettings?.theme]);

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/workspace', icon: Blocks, label: 'My Workspace' },
    { path: '/teams', icon: Users, label: 'Teams' },
    companySettings?.features?.enableTasks !== false && { path: '/tasks', icon: CheckSquare, label: 'Tasks' },
    companySettings?.features?.enableTimeTracking !== false && { path: '/time-tracker', icon: Clock, label: 'Time Tracker' },
    { path: '/submit-proof', icon: Camera, label: 'Submit Proof' },
    { path: '/notifications', icon: Bell, label: 'Notifications', badge: unreadCount || null },
    companySettings?.features?.enableLeaves !== false && { path: '/leave', icon: Palmtree, label: 'Leave' },
    { path: '/reports', icon: FileText, label: 'Reports' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics' },
    companySettings?.features?.enablePayroll !== false && { path: '/payslips', icon: IndianRupee, label: 'Payslips' },
    companySettings?.features?.enableExpenses !== false && { path: '/expenses', icon: Receipt, label: 'Expenses' },
    companySettings?.features?.enableDocuments !== false && { path: '/documents', icon: FolderOpen, label: 'Documents' },
    companySettings?.features?.enableMeetings !== false && { path: '/meetings', icon: Calendar, label: 'Meetings' },
  ].filter(Boolean);

  const handleLogout = async () => {
    await firebaseLogout();
    clearUser();
    navigate('/login');
  };

  const renderUserInitial = () => {
    if (user?.displayName) return user.displayName.charAt(0).toUpperCase();
    if (user?.name) return user.name.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return '?';
  };
  const renderUserName = () => user?.displayName || user?.name || user?.email || 'User';

  const pageTitle = menuItems.find(i => i.path === location.pathname)?.label
    || (location.pathname === '/profile' ? 'Profile' : location.pathname === '/calendar' ? 'Calendar' : location.pathname === '/settings' ? 'Settings' : 'Dashboard');

  return (
    <div className={`layout-container ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <div className="noise-overlay" />
      {/* ── SIDEBAR ─────────────────────────────────────────── */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
          <div className="logo-icon">
            <Sparkles size={20} />
          </div>
          <span className="logo-text">Paradigm Shift</span>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button key={item.path} 
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => navigate(item.path)}>
                <div className="nav-icon">
                  <item.icon size={20} />
                  {item.badge && (
                    <span className="nav-badge">{item.badge > 99 ? '99+' : item.badge}</span>
                  )}
                </div>
                <span className="nav-label">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item" onClick={() => navigate('/settings')}>
            <div className="nav-icon"><Settings size={20} /></div>
            <span className="nav-label">Settings</span>
          </button>
          <button className="nav-item" onClick={() => navigate('/profile')}>
            <div className="nav-icon"><User size={20} /></div>
            <span className="nav-label">Profile</span>
          </button>
          <button className="nav-item logout-item" onClick={handleLogout} style={{ color: '#ef4444' }}>
            <div className="nav-icon"><LogOut size={20} /></div>
            <span className="nav-label">Logout</span>
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ────────────────────────────────────── */}
      <div className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <button className="mobile-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu size={22} />
            </button>
            <h2 className="page-title">{pageTitle}</h2>
          </div>
          <div className="topbar-right">
            <button className="topbar-btn" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className="topbar-btn" onClick={() => navigate('/notifications')}>
              <Bell size={20} />
              {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
            </button>
            <div className="user-profile" onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>
              <div className="user-avatar">{renderUserInitial()}</div>
              <div className="user-info">
                <span className="user-name" style={{ fontSize: '14px', fontWeight: '600' }}>{renderUserName()}</span>
                <span className="user-role" style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block' }}>Developer</span>
              </div>
            </div>
          </div>
        </header>

        <main className="page-container">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;