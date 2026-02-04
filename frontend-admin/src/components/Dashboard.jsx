import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import './Dashboard.css';

function Dashboard() {
  const { isDarkMode } = useTheme();

  const stats = [
    { icon: '👥', value: 150, label: 'Total Employees', color: '#667eea', delay: 0.1 },
    { icon: '✅', value: 128, label: 'Present Today', color:  '#4ade80', delay:  0.2 },
    { icon: '📅', value: 12, label: 'Pending Leaves', color: '#f59e0b', delay:  0.3 },
    { icon: '🏢', value: 8, label: 'Departments', color: '#06b6d4', delay: 0.4 },
  ];

  const activities = [
    { icon: '✨', text: 'Diya Sharma joined as Senior Developer', time: '2 hours ago', name: 'Diya Sharma' },
    { icon: '📝', text: 'Pratham Verma requested 3 days leave', time: '3 hours ago', name: 'Pratham Verma' },
    { icon: '🎉', text: 'Aditya Patel completed onboarding', time: '5 hours ago', name: 'Aditya Patel' },
    { icon: '📊', text:  'Mahin Khan submitted monthly report', time: '6 hours ago', name: 'Mahin Khan' },
    { icon: '🏆', text:  'Ishan Singh received Employee of the Month', time: '1 day ago', name: 'Ishan Singh' },
    { icon: '💼', text: 'Priya Gupta promoted to Team Lead', time:  '1 day ago', name:  'Priya Gupta' },
    { icon: '🎓', text: 'Arjun Reddy completed training program', time: '2 days ago', name: 'Arjun Reddy' },
  ];

  const quickActions = [
    { icon: '➕', text: 'Add Employee', color: '#667eea', route: '/employees/add' },
    { icon: '✅', text: 'Approve Leaves', color: '#4ade80', route: '/leaves' },
    { icon: '📊', text: 'View Reports', color: '#06b6d4', route: '/reports' },
    { icon: '📢', text: 'Send Notice', color: '#f59e0b', route: '/announcements' },
  ];

  const containerVariants = {
    hidden:  { opacity: 0 },
    visible: {
      opacity:  1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  return (
    <div className="dashboard">
      <motion.div 
        className="dashboard-header"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div>
          <h1>📊 Dashboard Overview</h1>
          <p>Welcome back!  Here's what's happening today. </p>
        </div>
        <div className="date-time">
          <span className="date">🗓️ {new Date().toLocaleDateString('en-IN', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day:  'numeric' 
          })}</span>
        </div>
      </motion.div>

      <motion.div 
        className="stats-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            className="stat-card glass"
            variants={itemVariants}
            whileHover={{ 
              scale: 1.05, 
              boxShadow:  `0 20px 40px ${stat.color}33`,
              transition: { duration: 0.3 }
            }}
            style={{ '--card-color':  stat.color }}
          >
            <motion.div 
              className="stat-icon"
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                delay: stat.delay
              }}
            >
              {stat.icon}
            </motion.div>
            <div className="stat-info">
              <motion.h3
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: 'spring',
                  stiffness: 200,
                  delay: stat.delay + 0.2
                }}
              >
                {stat. value}
              </motion.h3>
              <p>{stat.label}</p>
            </div>
            <div className="stat-glow" style={{ background: stat.color }}></div>
          </motion.div>
        ))}
      </motion.div>

      <div className="dashboard-content">
        <motion.div 
          className="activities-section glass"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration:  0.6, delay: 0.3 }}
        >
          <h2>⚡ Recent Activities</h2>
          <div className="activities-list">
            {activities.map((activity, index) => (
              <motion.div
                key={index}
                className="activity-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity:  1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ x: 10, backgroundColor: isDarkMode ? '#2d2d44' : '#f9f9ff' }}
              >
                <div className="activity-icon">{activity.icon}</div>
                <div className="activity-content">
                  <p className="activity-text">{activity.text}</p>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          className="quick-actions-section glass"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2>⚡ Quick Actions</h2>
          <div className="quick-actions-grid">
            {quickActions. map((action, index) => (
              <motion.button
                key={index}
                className="action-card"
                style={{ '--action-color': action.color }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1, type: 'spring' }}
                whileHover={{ 
                  scale: 1.1,
                  rotate: 5,
                  boxShadow: `0 10px 30px ${action.color}44`
                }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="action-icon">{action.icon}</div>
                <span>{action.text}</span>
              </motion. button>
            ))}
          </div>
        </motion. div>
      </div>
    </div>
  );
}

export default Dashboard;