import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useDataStore } from '../store/dataStore';
import { logout as firebaseLogout } from '../config/firebase';
import {
  LayoutDashboard, Users, CheckSquare, Clock, Camera, FileText,
  BarChart3, Settings, LogOut, Menu, X, Bell, Sun, Moon,
  Sparkles, Calendar, User, Palmtree, IndianRupee, Receipt, FolderOpen
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
  const unreadCount = notifications.filter(n => !n.read).length;

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', color: '#3B82F6', gradient: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)' },
    { path: '/teams', icon: Users, label: 'Teams', color: '#8B5CF6', gradient: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)' },
    { path: '/tasks', icon: CheckSquare, label: 'Tasks', color: '#10B981', gradient: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)' },
    { path: '/time-tracker', icon: Clock, label: 'Time Tracker', color: '#06B6D4', gradient: 'linear-gradient(135deg, #06B6D4 0%, #22D3EE 100%)' },
    { path: '/submit-proof', icon: Camera, label: 'Submit Proof', color: '#F59E0B', gradient: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)' },
    { path: '/notifications', icon: Bell, label: 'Notifications', color: '#EF4444', gradient: 'linear-gradient(135deg, #EF4444 0%, #F87171 100%)', badge: unreadCount || null },
    { path: '/leave', icon: Palmtree, label: 'Leave', color: '#10B981', gradient: 'linear-gradient(135deg, #10B981 0%, #6EE7B7 100%)' },
    { path: '/reports', icon: FileText, label: 'Reports', color: '#EC4899', gradient: 'linear-gradient(135deg, #EC4899 0%, #F472B6 100%)' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics', color: '#6366F1', gradient: 'linear-gradient(135deg, #6366F1 0%, #818CF8 100%)' },
    { path: '/payslips', icon: IndianRupee, label: 'Payslips', color: '#14B8A6', gradient: 'linear-gradient(135deg, #14B8A6 0%, #5EEAD4 100%)' },
    { path: '/expenses', icon: Receipt, label: 'Expenses', color: '#F97316', gradient: 'linear-gradient(135deg, #F97316 0%, #FB923C 100%)' },
    { path: '/documents', icon: FolderOpen, label: 'Documents', color: '#8B5CF6', gradient: 'linear-gradient(135deg, #8B5CF6 0%, #C4B5FD 100%)' },
  ];

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
    <div className={`layout-container ${darkMode ? 'dark' : 'light'}`}>
      {/* Background — CSS only, no JS animations */}
      <div className="layout-background">
        <div className="gradient-orb orb-1" />
        <div className="gradient-orb orb-2" />
        <div className="grid-pattern" />
      </div>

      {/* ── SIDEBAR ─────────────────────────────────────────── */}
      <aside className="sidebar glass-sidebar" style={{ width: sidebarOpen ? 280 : 80, transition: 'width 0.25s ease' }}>
        {/* Header */}
        <div className="sidebar-header">
          <div className="logo" style={{ cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>
            <div className="logo-icon" style={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)' }}>
              <LayoutDashboard size={24} strokeWidth={2.5} />
            </div>
            {sidebarOpen && <span className="logo-text" style={{ transition: 'opacity 0.2s' }}>Employee Portal</span>}
          </div>
          <button className="sidebar-toggle glass-btn" onClick={() => setSidebarOpen(!sidebarOpen)} style={{ transition: 'transform 0.2s' }}>
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {sidebarOpen && (
          <div className="sidebar-divider">
            <Sparkles size={12} className="divider-icon" />
            <span>NAVIGATION</span>
          </div>
        )}

        {/* Nav Items — CSS transitions only, no framer-motion per item */}
        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button key={item.path} data-label={item.label}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => navigate(item.path)}
                style={{ transition: 'all 0.15s ease' }}>
                <div className="nav-icon"
                  style={{
                    background: isActive ? item.gradient : 'transparent',
                    border: isActive ? 'none' : `2px solid ${item.color}40`,
                    boxShadow: isActive ? `0 6px 20px ${item.color}50` : 'none',
                    transition: 'all 0.2s ease',
                  }}>
                  <item.icon size={20} strokeWidth={2.5} />
                  {item.badge && (
                    <span className="nav-badge">{item.badge > 99 ? '99+' : item.badge}</span>
                  )}
                </div>
                {sidebarOpen && <span className="nav-label">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="sidebar-bottom">
          {sidebarOpen && (
            <div className="sidebar-divider">
              <Sparkles size={12} className="divider-icon" />
              <span>ACCOUNT</span>
            </div>
          )}

          <button className="nav-item" data-label="Settings"
            style={{ transition: 'all 0.15s ease' }}
            onClick={() => navigate('/settings')}>
            <div className="nav-icon" style={{ border: '2px solid rgba(148,163,184,0.3)', transition: 'all 0.2s' }}>
              <Settings size={20} strokeWidth={2.5} />
            </div>
            {sidebarOpen && <span className="nav-label">Settings</span>}
          </button>

          <button className="nav-item" data-label="Profile"
            style={{ transition: 'all 0.15s ease' }}
            onClick={() => navigate('/profile')}>
            <div className="nav-icon" style={{ border: '2px solid rgba(148,163,184,0.3)', transition: 'all 0.2s' }}>
              <User size={20} strokeWidth={2.5} />
            </div>
            {sidebarOpen && <span className="nav-label">Profile</span>}
          </button>

          <button className="nav-item logout-item" data-label="Logout"
            style={{ transition: 'all 0.15s ease' }}
            onClick={handleLogout}>
            <div className="nav-icon" style={{ border: '2px solid rgba(239,68,68,0.3)', color: '#ef4444', transition: 'all 0.2s' }}>
              <LogOut size={20} strokeWidth={2.5} />
            </div>
            {sidebarOpen && <span className="nav-label" style={{ color: '#ef4444' }}>Logout</span>}
          </button>

          {sidebarOpen && (
            <div className="status-bar">
              <div className="status-dot" />
              <span>System Online</span>
            </div>
          )}
          {sidebarOpen && (
            <div style={{ textAlign: 'center', padding: '8px 0 4px', fontSize: '10px', color: '#334155', letterSpacing: '1px', textTransform: 'uppercase' }}>
              Paradigm Shift&trade;
            </div>
          )}
        </div>
      </aside>

      {/* ── MAIN CONTENT ────────────────────────────────────── */}
      <div className="main-content" style={{ marginLeft: sidebarOpen ? 280 : 80, transition: 'margin-left 0.25s ease' }}>
        {/* Top Bar */}
        <header className="topbar glass-topbar">
          <div className="topbar-left">
            <button className="mobile-menu-btn glass-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu size={22} />
            </button>
            <h2 className="page-title">{pageTitle}</h2>
          </div>
          <div className="topbar-right">
            <button className="topbar-btn glass-btn" onClick={() => setDarkMode(!darkMode)} style={{ transition: 'transform 0.2s' }}>
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className="topbar-btn glass-btn notification-btn" onClick={() => navigate('/notifications')} style={{ transition: 'transform 0.2s' }}>
              <Bell size={20} />
              {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
            </button>
            <div className="user-profile glass-profile" onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>
              <div className="user-avatar">{renderUserInitial()}</div>
              <div className="user-info">
                <span className="user-name">{renderUserName()}</span>
                <span className="user-role">Developer</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content — simple fade */}
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;