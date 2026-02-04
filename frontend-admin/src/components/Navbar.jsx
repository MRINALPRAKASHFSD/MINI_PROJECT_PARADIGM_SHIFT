import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/');
    window.location.reload();
  };

  return (
    <motion.nav 
      className="navbar"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
    >
      <motion.div 
        className="navbar-brand"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <motion.span 
          className="brand-icon"
          animate={{ 
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            repeatDelay: 2
          }}
        >
          🏢
        </motion. span>
        <span className="brand-text">Paradigm Shift Admin</span>
      </motion. div>

      <div className="navbar-actions">
        <motion.button
          className="theme-toggle"
          onClick={toggleTheme}
          whileHover={{ scale: 1.1, rotate: 180 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.3 }}
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? '☀️' : '🌙'}
        </motion.button>

        <motion.div 
          className="user-info"
          whileHover={{ scale: 1.02 }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x:  0 }}
          transition={{ delay: 0.2 }}
        >
          <motion. div 
            className="user-avatar"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            👤
          </motion.div>
          <span className="user-email">admin@paradigmshift.com</span>
        </motion.div>

        <motion.button
          className="logout-btn glass-button"
          onClick={handleLogout}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x:  0 }}
          transition={{ delay: 0.3 }}
        >
          <span className="logout-icon">🚪</span>
          <span>Logout</span>
        </motion.button>
      </div>
    </motion. nav>
  );
}

export default Navbar;