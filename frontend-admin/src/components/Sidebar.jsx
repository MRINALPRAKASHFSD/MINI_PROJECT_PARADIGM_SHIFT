import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Sidebar.css';

function Sidebar() {
  const menuItems = [
    { 
      path: '/dashboard', 
      icon: '📊', 
      label: 'Dashboard', 
      color:  '#4F46E5',
      bgGradient: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)'
    },
    { 
      path: '/employees', 
      icon: '👥', 
      label: 'Employees', 
      color: '#7C3AED',
      bgGradient: 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 100%)'
    },
    { 
      path: '/leaves', 
      icon: '📋', 
      label: 'Leave Management', 
      color: '#0891B2',
      bgGradient: 'linear-gradient(135deg, #0891B2 0%, #06B6D4 100%)'
    },
    { 
      path: '/attendance', 
      icon: '✅', 
      label: 'Attendance', 
      color: '#059669',
      bgGradient: 'linear-gradient(135deg, #059669 0%, #10B981 100%)'
    },
    { 
      path: '/reports', 
      icon: '📈', 
      label: 'Reports', 
      color: '#D97706',
      bgGradient: 'linear-gradient(135deg, #D97706 0%, #F59E0B 100%)'
    },
    { 
      path: '/payroll', 
      icon: '💰', 
      label:  'Payroll', 
      color: '#DC2626',
      bgGradient: 'linear-gradient(135deg, #DC2626 0%, #EF4444 100%)'
    },
    { 
      path: '/departments', 
      icon: '🏢', 
      label:  'Departments', 
      color: '#2563EB',
      bgGradient: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)'
    },
    { 
      path: '/announcements', 
      icon: '📢', 
      label:  'Announcements', 
      color: '#DB2777',
      bgGradient: 'linear-gradient(135deg, #DB2777 0%, #EC4899 100%)'
    },
  ];

  return (
    <motion.aside 
      className="sidebar admin-sidebar"
      initial={{ x: -280, opacity: 0 }}
      animate={{ x:  0, opacity: 1 }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 80 }}
    >
      <div className="sidebar-brand">
        <div className="brand-icon-container">
          <motion.div 
            className="brand-icon"
            animate={{ 
              rotateY: [0, 360],
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              repeatDelay: 2
            }}
          >
            🏢
          </motion. div>
        </div>
        <div className="brand-info">
          <h1 className="brand-title">PARADIGM SHIFT</h1>
          <p className="brand-subtitle">Admin Control Panel</p>
        </div>
      </div>

      <div className="sidebar-divider">
        <span className="divider-text">MAIN NAVIGATION</span>
      </div>

      <nav className="sidebar-navigation">
        {menuItems.map((item, index) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            {({ isActive }) => (
              <motion.div
                className="nav-link-content"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x:  0, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ x: 8 }}
              >
                <div 
                  className="nav-icon-wrapper"
                  style={{ 
                    background: isActive ? item.bgGradient : 'transparent',
                    border: isActive ? 'none' : `2px solid ${item.color}40`
                  }}
                >
                  <span className="nav-icon">{item.icon}</span>
                </div>
                <span className="nav-text">{item.label}</span>
                {isActive && (
                  <motion.div
                    className="active-bar"
                    layoutId="activeBar"
                    style={{ background: item.bgGradient }}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
                <div 
                  className="nav-glow" 
                  style={{ 
                    background: item.bgGradient,
                    opacity: isActive ? 0.15 : 0
                  }}
                />
              </motion. div>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-divider">
        <span className="divider-text">SYSTEM</span>
      </div>

      <div className="sidebar-footer">
        <div className="system-status">
          <div className="status-indicator">
            <motion.div 
              className="status-dot"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [1, 0.7, 1]
              }}
              transition={{ 
                duration:  2,
                repeat:  Infinity
              }}
            />
            <span className="status-text">System Online</span>
          </div>
          <div className="version-badge">
            <span className="version-label">v1.0.0</span>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}

export default Sidebar;