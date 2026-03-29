import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuthStore } from '../store/authStore';
import { logout as firebaseLogout } from '../config/firebase';
import { LogOut, Sun, Moon, Shield } from 'lucide-react';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  const { user, logout: storeLogout } = useAuthStore();

  const handleLogout = async () => {
    await firebaseLogout();
    storeLogout();
    navigate('/');
  };

  const displayName = user?.displayName || user?.name || 'Admin';
  const displayEmail = user?.email || 'admin@paradigmshift.com';

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="brand-icon">
          <Shield size={22} />
        </span>
        <span className="brand-text">Paradigm Shift Admin</span>
      </div>

      <div className="navbar-actions">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className="user-info">
          <div className="user-avatar">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div className="user-details">
            <span className="user-name">{displayName}</span>
            <span className="user-email">{displayEmail}</span>
          </div>
        </div>

        <button className="logout-btn glass-button" onClick={handleLogout}>
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;