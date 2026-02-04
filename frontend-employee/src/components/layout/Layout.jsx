import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { 
  LayoutDashboard,
  Users,
  CheckSquare,
  Clock,
  Camera,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Sun,
  Moon,
  User
} from 'lucide-react';
import './Layout.css';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Teams', path: '/teams' },
    { icon: CheckSquare, label: 'Tasks', path: '/tasks' },
    { icon: Clock, label: 'Time Tracker', path: '/time-tracker' },
    { icon: Camera, label: 'Submit Proof', path: '/submit-proof' },
    { icon:  FileText, label: 'Reports', path: '/reports' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics' },
    { icon: Settings, label: 'Settings', path: '/settings' }
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className={`layout-container ${darkMode ? 'dark' : 'light'}`}>
      {/* Animated Background */}
      <div className="layout-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="grid-pattern"></div>
      </div>

      {/* Sidebar */}
      <motion.aside 
        className={`sidebar ${sidebarOpen ? 'open' :  'closed'}`}
        animate={{ width: sidebarOpen ?  280 : 80 }}
        transition={{ duration: 0.3 }}
      >
        <div className="sidebar-header">
          <motion.div 
            className="logo"
            whileHover={{ scale: 1.05, rotate: 5 }}
          >
            <div className="logo-icon">
              <LayoutDashboard size={28} />
            </div>
            <AnimatePresence>
              {sidebarOpen && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="logo-text"
                >
                  Portal
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
          
          <motion. button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            whileHover={{ scale:  1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {sidebarOpen ?  <X size={20} /> :  <Menu size={20} />}
          </motion.button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item, index) => (
            <motion.button
              key={item. path}
              className={`nav-item ${location.pathname === item.path ? 'active' :  ''}`}
              onClick={() => navigate(item.path)}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity:  0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="nav-icon">
                <item. icon size={22} />
              </div>
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="nav-label"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {location. pathname === item.path && (
                <motion.div
                  className="nav-indicator"
                  layoutId="navIndicator"
                />
              )}
            </motion.button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <motion.button
            className="nav-item logout"
            onClick={handleLogout}
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="nav-icon">
              <LogOut size={22} />
            </div>
            <AnimatePresence>
              {sidebarOpen && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="nav-label"
                >
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
          </motion. button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="main-content">
        {/* Top Bar */}
        <header className="topbar">
          <div className="topbar-left">
            <button 
              className="mobile-menu-btn"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu size={24} />
            </button>
            <h2 className="page-title">
              {menuItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
            </h2>
          </div>

          <div className="topbar-right">
            <motion.button
              className="topbar-btn"
              onClick={() => setDarkMode(!darkMode)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence mode="wait">
                {darkMode ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -180, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 180, opacity: 0 }}
                  >
                    <Sun size={20} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: 180, opacity:  0 }}
                    animate={{ rotate: 0, opacity:  1 }}
                    exit={{ rotate: -180, opacity:  0 }}
                  >
                    <Moon size={20} />
                  </motion. div>
                )}
              </AnimatePresence>
            </motion.button>

            <motion.button
              className="topbar-btn notification-btn"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Bell size={20} />
              <span className="notification-badge">3</span>
            </motion.button>

            <div className="user-profile">
              <div className="user-avatar">
                {user?.name?. charAt(0).toUpperCase()}
              </div>
              <div className="user-info">
                <span className="user-name">{user?.name}</span>
                <span className="user-role">Developer</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;