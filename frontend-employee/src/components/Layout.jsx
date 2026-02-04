import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { logout as firebaseLogout } from '../config/firebase'; // <-- import Firebase logout
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
  Sparkles,
  Zap,
  Target
} from 'lucide-react';
import './Layout.css';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const { user, logout: clearUser } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', color: '#3B82F6', gradient: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)', particles: '✨', badge: null },
    { path: '/teams', icon: Users, label: 'Teams', color: '#8B5CF6', gradient: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)', particles: '👥', badge: 3  },
    { path: '/tasks', icon: CheckSquare, label: 'Tasks', color: '#10B981', gradient:  'linear-gradient(135deg, #10B981 0%, #34D399 100%)', particles: '✓', badge: 12 },
    { path: '/time-tracker', icon: Clock, label: 'Time Tracker', color: '#06B6D4', gradient: 'linear-gradient(135deg, #06B6D4 0%, #22D3EE 100%)', particles: '⏱', badge: null },
    { path: '/submit-proof', icon: Camera, label: 'Submit Proof', color:  '#F59E0B', gradient: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)', particles: '📸', badge: 5 },
    { path: '/reports', icon: FileText, label: 'Reports', color: '#EC4899', gradient: 'linear-gradient(135deg, #EC4899 0%, #F472B6 100%)', particles: '📄', badge: null },
    { path: '/analytics', icon: BarChart3, label:  'Analytics', color:  '#6366F1', gradient: 'linear-gradient(135deg, #6366F1 0%, #818CF8 100%)', particles: '📊', badge: null },
  ];

  // **Important! Use Firebase logout**
  const handleLogout = async () => {
    // Logs out from Firebase and clears Zustand store
    const result = await firebaseLogout();
    clearUser(); // removes user info from the app store
    navigate('/login');
  };

  // Render user initials or name/email
  const renderUserInitial = () => {
    if (user?.displayName) return user.displayName.charAt(0).toUpperCase();
    if (user?.name) return user.name.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return '?';
  };
  const renderUserName = () => {
    return user?.displayName || user?.name || user?.email || 'User';
  };

  return (
    <div className={`layout-container ${darkMode ? 'dark' : 'light'}`}>
      {/* Animated Background */}
      <div className="layout-background">
        <motion.div 
          className="gradient-orb orb-1"
          animate={{ x: [0, 50, 0], y: [0, -50, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease:  'easeInOut' }}
        />
        <motion.div 
          className="gradient-orb orb-2"
          animate={{ x: [0, -60, 0], y:  [0, 40, 0], scale:  [1, 1.15, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease:  'easeInOut', delay: 2 }}
        />
        <motion.div 
          className="gradient-orb orb-3"
          animate={{ x: [0, 30, 0], y:  [0, -30, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
        />
        <div className="grid-pattern"></div>

        {/* Floating Particles */}
        <div className="floating-particles">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="particle"
              style={{
                left:  `${Math.random() * 100}%`,
                fontSize: `${8 + Math.random() * 8}px`
              }}
              initial={{ y: 0, opacity: 0 }}
              animate={{ 
                y: -800,
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 8 + Math.random() * 10,
                repeat: Infinity,
                delay: Math.random() * 5
              }}
            >
              ✨
            </motion.div>
          ))}
        </div>
      </div>

      {/* Sidebar */}
      <motion.aside 
        className="sidebar glass-sidebar"
        animate={{ width: sidebarOpen ? 300 : 100 }}
        transition={{ type:  'spring', stiffness:  200, damping: 25 }}
      >
        {/* Sidebar Background Effects */}
        <div className="sidebar-bg-effects">
          <motion.div 
            className="sidebar-blob blob-1"
            animate={{ x: [0, 30, 0], y: [0, -40, 0], scale:  [1, 1.2, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease:  'easeInOut' }}
          />
          <motion.div 
            className="sidebar-blob blob-2"
            animate={{ x: [0, -40, 0], y:  [0, 30, 0], scale: [1, 1.15, 1] }}
            transition={{ duration: 10, repeat: Infinity, ease:  'easeInOut', delay: 2 }}
          />
        </div>
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <motion.div 
            className="logo"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div 
              className="logo-icon"
              animate={{ rotateY: [0, 360], boxShadow: [ '0 8px 24px rgba(59, 130, 246, 0.4)', '0 12px 32px rgba(139, 92, 246, 0.6)', '0 8px 24px rgba(59, 130, 246, 0.4)' ] }}
              transition={{ rotateY: { duration: 4, repeat: Infinity, repeatDelay: 3 }, boxShadow: { duration: 3, repeat: Infinity } }}
            >
              <LayoutDashboard size={28} strokeWidth={2.5} />
            </motion.div>
            <AnimatePresence>
              {sidebarOpen && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="logo-text"
                >
                  Employee Portal
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
          
          <motion.button
            className="sidebar-toggle glass-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            whileHover={{ scale: 1.15, rotate: sidebarOpen ? 90 :  0 }}
            whileTap={{ scale: 0.9 }}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </motion.button>
        </div>

        {/* Divider */}
        {sidebarOpen && (
          <motion.div 
            className="sidebar-divider"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Sparkles size={12} className="divider-icon" />
            <span>NAVIGATION</span>
          </motion.div>
        )}

        {/* Navigation */}
        <nav className="sidebar-nav">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <motion.button
                key={item.path}
                data-label={item.label}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => navigate(item.path)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                initial={{ opacity: 0, x:  -50 }}
                animate={{ opacity:  1, x: 0 }}
                transition={{ delay: index * 0.05, type: 'spring' }}
                whileHover={{ x: sidebarOpen ? 12 : 5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div 
                  className="nav-icon"
                  style={{ background: isActive ? item.gradient :  'transparent', border: isActive ? 'none' : `2px solid ${item.color}40`, boxShadow: isActive ? `0 8px 24px ${item.color}60` : 'none' }}
                  animate={isActive ? { rotate: [0, -10, 10, -10, 0], scale: [1, 1.1, 1.1, 1.1, 1] } : {}}
                  transition={{ duration: 0.6, repeat: isActive ? Infinity : 0, repeatDelay: 3 }}
                  whileHover={{ rotate: 360, scale: 1.15, background: item.gradient, boxShadow: `0 12px 32px ${item.color}80` }}
                >
                  <item.icon size={22} strokeWidth={2.5} />
                  {item.badge && (
                    <motion.span
                      className="nav-badge"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', delay: 0.5 + index * 0.05, stiffness:  500, damping: 15 }}
                    >
                      {item.badge > 99 ? '99+' : item.badge}
                    </motion.span>
                  )}
                  <AnimatePresence>
                    {(hoveredIndex === index || isActive) && (
                      <motion.div
                        className="icon-particle"
                        initial={{ scale:  0, opacity: 0 }}
                        animate={{ scale: [0, 1.5, 0], opacity: [0, 1, 0] }}
                        exit={{ scale: 0, opacity:  0 }}
                        transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
                      >
                        {item.particles}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0, x:  -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="nav-label"
                    >
                      {item.label. split('').map((char, i) => (
                        <motion.span
                          key={i}
                          initial={{ opacity: 0, y:  20 }}
                          animate={{ opacity: 1, y:  0 }}
                          transition={{ delay: 0.3 + i * 0.02 }}
                          whileHover={{ y: -2 }}
                          style={{ display: 'inline-block' }}
                        >
                          {char === ' ' ? '\u00A0' : char}
                        </motion.span>
                      ))}
                    </motion.span>
                  )}
                </AnimatePresence>
                {isActive && (
                  <>
                    <motion.div
                      className="nav-indicator"
                      layoutId="navIndicator"
                      style={{ background: item.gradient }}
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ type: 'spring' }}
                    >
                      <motion.div
                        className="indicator-pulse"
                        animate={{ scale:  [1, 1.5, 1], opacity: [0.8, 0, 0.8] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </motion.div>
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="energy-line"
                        style={{ background: item.gradient }}
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 300, opacity: [0, 1, 0] }}
                        transition={{
                          duration: 2,
                          delay: i * 0.3,
                          repeat: Infinity,
                          repeatDelay: 2
                        }}
                      />
                    ))}
                  </>
                )}
                <motion.div 
                  className="nav-glow"
                  style={{ background: item.gradient }}
                  animate={{ opacity: isActive ? 0.2 : (hoveredIndex === index ? 0.15 : 0) }}
                />
              </motion.button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          {sidebarOpen && (
            <motion.div 
              className="sidebar-divider"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
            >
              <Zap size={12} className="divider-icon" />
              <span>SYSTEM</span>
            </motion.div>
          )}

          <motion.button
            className="nav-item"
            data-label="Settings"
            onClick={() => navigate('/settings')}
            whileHover={{ x: sidebarOpen ? 12 : 5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div 
              className="nav-icon"
              whileHover={{ rotate: 180, scale: 1.15, background: 'linear-gradient(135deg, #6366F1 0%, #818CF8 100%)', boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)' }}
            >
              <Settings size={22} strokeWidth={2.5} />
            </motion.div>
            <AnimatePresence>
              {sidebarOpen && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="nav-label"
                >
                  Settings
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          <motion.button
            className="nav-item logout"
            data-label="Logout"
            onClick={handleLogout}
            whileHover={{ x: sidebarOpen ?  12 : 5, scale: 1.02 }}
            whileTap={{ scale:  0.98 }}
          >
            <motion.div 
              className="nav-icon"
              whileHover={{ x: 8, scale: 1.15 }}
            >
              <LogOut size={22} strokeWidth={2.5} />
            </motion.div>
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
          </motion.button>
          {sidebarOpen && (
            <motion.div 
              className="status-bar"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div 
                className="status-dot"
                animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span>System Online</span>
            </motion.div>
          )}
        </div>
      </motion.aside>

      {/* Main Content */}
      <motion.div 
        className="main-content"
        animate={{ marginLeft: sidebarOpen ? 300 : 100 }}
        transition={{ type:  'spring', stiffness:  200, damping: 25 }}
      >
        {/* Top Bar */}
        <motion.header 
          className="topbar glass-topbar"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring' }}
        >
          <div className="topbar-left">
            <button 
              className="mobile-menu-btn glass-btn"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu size={24} />
            </button>
            <motion.h2 
              className="page-title"
              key={location.pathname}
              initial={{ opacity: 0, x:  -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {menuItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
            </motion.h2>
          </div>

          <div className="topbar-right">
            <motion.button
              className="topbar-btn glass-btn"
              onClick={() => setDarkMode(!darkMode)}
              whileHover={{ scale: 1.1, rotate: 180 }}
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
                    initial={{ rotate: 180, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -180, opacity: 0 }}
                  >
                    <Moon size={20} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            <motion.button
              className="topbar-btn glass-btn notification-btn"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Bell size={20} />
              <motion.span 
                className="notification-badge"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                3
              </motion.span>
            </motion.button>

            <motion.div 
              className="user-profile glass-profile"
              whileHover={{ scale: 1.02 }}
            >
              <motion.div 
                className="user-avatar"
                animate={{ boxShadow: [ '0 0 20px rgba(59, 130, 246, 0.4)', '0 0 30px rgba(139, 92, 246, 0.6)', '0 0 20px rgba(59, 130, 246, 0.4)' ] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                {renderUserInitial()}
              </motion.div>
              <div className="user-info">
                <span className="user-name">{renderUserName()}</span>
                <span className="user-role">Developer</span>
              </div>
            </motion.div>
          </div>
        </motion.header>

        {/* Page Content */}
        <motion.main 
          className="page-content"
          initial={{ opacity:  0, y: 20 }}
          animate={{ opacity:  1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Outlet />
        </motion.main>
      </motion.div>
    </div>
  );
};

export default Layout;