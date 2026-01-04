import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CheckSquare, 
  Clock, 
  Camera, 
  User,
  TrendingUp,
  Calendar,
  Award,
  FileText,
  ChevronRight,
  Activity,
  BarChart3,
  Zap
} from 'lucide-react';
import './DashboardPro.css';

const Dashboard = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const stats = [
    { 
      icon:  CheckSquare, 
      label: 'Tasks Completed', 
      value: 24, 
      total: 30,
      trend: '+12%',
      trendUp: true,
      color: 'blue',
      bgGradient: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)'
    },
    { 
      icon: Clock, 
      label: 'Hours Logged', 
      value: 156, 
      total: 200,
      trend: '+8%',
      trendUp: true,
      color: 'green',
      bgGradient:  'linear-gradient(135deg, #10B981 0%, #34D399 100%)'
    },
    { 
      icon: Award, 
      label: 'Active Projects', 
      value:  8, 
      total:  10,
      trend: '+2',
      trendUp:  true,
      color: 'purple',
      bgGradient: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)'
    },
    { 
      icon: TrendingUp, 
      label: 'Performance', 
      value: 94, 
      total: 100,
      trend: '+5%',
      trendUp: true,
      color: 'orange',
      bgGradient: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)'
    },
  ];

  const quickActions = [
    { 
      icon: CheckSquare, 
      label:  'View Tasks', 
      desc: 'Manage your assignments', 
      path: '/tasks', 
      color: 'blue',
      count: 6
    },
    { 
      icon: Clock, 
      label: 'Track Time', 
      desc: 'Log your working hours', 
      path: '/time-tracker', 
      color: 'green'
    },
    { 
      icon:  Camera, 
      label: 'Submit Proof', 
      desc: 'Upload work screenshots', 
      path: '/submit-proof', 
      color:  'purple'
    },
    { 
      icon: FileText, 
      label: 'Reports', 
      desc:  'View your analytics', 
      path: '/reports', 
      color: 'orange'
    },
  ];

  const recentActivities = [
    { 
      action: 'Completed task:  Website Redesign', 
      time: '2 hours ago', 
      icon: CheckSquare, 
      color:  'blue'
    },
    { 
      action: 'Logged 8 hours of work', 
      time: '5 hours ago', 
      icon: Clock, 
      color: 'green'
    },
    { 
      action:  'Submitted proof for project', 
      time: 'Yesterday', 
      icon: Camera, 
      color: 'purple'
    },
    { 
      action: 'Received performance award', 
      time: '2 days ago', 
      icon: Award, 
      color: 'orange'
    },
  ];

  const performanceMetrics = [
    { label: 'Task Completion', value: 94, color: 'blue', icon: '✓', bgGradient: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)' },
    { label:  'Quality Score', value: 88, color: 'green', icon: '★', bgGradient: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)' },
    { label: 'Time Management', value: 92, color:  'purple', icon: '⏱', bgGradient:  'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)' },
  ];

  return (
    <div className="dashboard-pro dark">
      {/* Animated Background */}
      <div className="animated-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
        <div className="grid-pattern"></div>
      </div>

      <main className="pro-main">
        {/* Welcome Banner with Glassmorphism */}
        <motion.div
          className="welcome-card glass-card"
          initial={{ scale:  0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay:  0.1 }}
          whileHover={{ scale: 1.01 }}
        >
          <div className="welcome-content">
            <motion.div 
              className="welcome-icon"
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Zap size={28} />
            </motion.div>
            <div className="welcome-text">
              <h2>Hi {user?. name || 'there'}, Ready to be productive today?  🚀</h2>
              <p>You have 6 pending tasks and 3 meetings scheduled</p>
            </div>
          </div>
          <motion.div 
            className="welcome-glow"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity:  [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
        </motion. div>

        {/* Stats Grid with Enhanced Glassmorphism */}
        <motion.div 
          className="stats-container"
          initial="hidden"
          animate="visible"
          variants={{
            hidden:  { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1 }
            }
          }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="stat-box glass-card"
              style={{ '--stat-gradient': stat.bgGradient }}
              variants={{
                hidden: { y: 20, opacity: 0 },
                visible: { y: 0, opacity: 1 }
              }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <div className="stat-header">
                <motion.div 
                  className={`stat-icon icon-${stat.color}`}
                  style={{ background: stat.bgGradient }}
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <stat.icon size={24} strokeWidth={2.5} />
                </motion. div>
                <motion.span 
                  className={`stat-trend ${stat.trendUp ? 'up' : 'down'}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1, type: 'spring' }}
                >
                  {stat. trend}
                </motion.span>
              </div>
              <div className="stat-body">
                <h3 className="stat-number">
                  <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                  >
                    {stat.value}
                  </motion.span>
                  <span className="stat-max">/{stat.total}</span>
                </h3>
                <p className="stat-title">{stat.label}</p>
              </div>
              <div className="stat-progress-container">
                <motion.div
                  className="stat-progress-fill"
                  style={{ background: stat.bgGradient }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(stat.value / stat.total) * 100}%` }}
                  transition={{ duration: 1, delay: index * 0.1 + 0.4, ease: 'easeOut' }}
                >
                  <motion.div
                    className="progress-shine"
                    animate={{ x:  [-100, 300] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                  />
                </motion. div>
              </div>
              <div className="stat-glow" style={{ background: stat.bgGradient }} />
            </motion.div>
          ))}
        </motion.div>

        <div className="content-wrapper">
          {/* Left Column */}
          <div className="left-column">
            {/* Quick Actions with Glassmorphism */}
            <motion.div 
              className="pro-card glass-card"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x:  0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="card-header">
                <Activity size={22} strokeWidth={2.5} />
                <h3>Quick Actions</h3>
              </div>
              <div className="actions-container">
                {quickActions.map((action, index) => (
                  <motion.button
                    key={index}
                    onClick={() => navigate(action.path)}
                    className="action-button glass-button"
                    whileHover={{ scale: 1.02, x: 8 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                  >
                    <motion.div 
                      className={`action-icon-wrapper icon-${action.color}`}
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    >
                      <action.icon size={20} strokeWidth={2.5} />
                    </motion.div>
                    <div className="action-text">
                      <span className="action-title">{action.label}</span>
                      <span className="action-subtitle">{action.desc}</span>
                    </div>
                    {action.count && (
                      <motion.span 
                        className="action-count"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', delay: 0.5 }}
                      >
                        {action.count}
                      </motion.span>
                    )}
                    <ChevronRight className="action-arrow" size={18} />
                  </motion. button>
                ))}
              </div>
            </motion. div>

            {/* Profile Card with Enhanced Glassmorphism */}
            <motion.div 
              className="pro-card glass-card profile-card"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y:  0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="card-header">
                <User size={22} strokeWidth={2.5} />
                <h3>Profile Information</h3>
              </div>
              <div className="profile-section">
                <div className="profile-main">
                  <motion.div 
                    className="profile-avatar-large"
                    whileHover={{ scale: 1.05, rotate: 5 }}
                  >
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                    <motion.div 
                      className="avatar-ring"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                    />
                  </motion.div>
                  <div className="profile-details">
                    <h4>{user?.name || 'User'}</h4>
                    <p className="profile-role">Senior Developer</p>
                    <div className="profile-rating">
                      {[...Array(5)].map((_, i) => (
                        <motion.span
                          key={i}
                          className="rating-star"
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: 0.5 + i * 0.1, type: 'spring' }}
                        >
                          ⭐
                        </motion. span>
                      ))}
                      <span className="rating-text">Excellent</span>
                    </div>
                  </div>
                </div>
                
                <div className="profile-info-grid">
                  {[
                    { icon: '📧', label: 'Email', value: user?.email || 'N/A' },
                    { icon: '📱', label: 'Phone', value: '+1 234 567 890' },
                    { icon:  '🏢', label: 'Department', value: 'Engineering' },
                    { icon: '📅', label: 'Join Date', value: '2025-01-01' },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      className="profile-info-item glass-light"
                      initial={{ opacity:  0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      whileHover={{ scale: 1.03, x: 5 }}
                    >
                      <span className="info-icon">{item.icon}</span>
                      <div className="info-text">
                        <span className="info-label">{item.label}</span>
                        <span className="info-value">{item.value}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="right-column">
            {/* Recent Activity with Glassmorphism */}
            <motion.div 
              className="pro-card glass-card"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="card-header">
                <Calendar size={22} strokeWidth={2.5} />
                <h3>Recent Activity</h3>
              </div>
              <div className="activity-timeline">
                {recentActivities.map((activity, index) => (
                  <motion.div
                    key={index}
                    className="timeline-item glass-light"
                    initial={{ opacity:  0, x: 20 }}
                    animate={{ opacity:  1, x: 0 }}
                    transition={{ delay:  0.4 + index * 0.1 }}
                    whileHover={{ x: 8, scale: 1.02 }}
                  >
                    <motion.div 
                      className={`timeline-icon icon-${activity.color}`}
                      whileHover={{ rotate: 360, scale: 1.2 }}
                      transition={{ duration: 0.6 }}
                    >
                      <activity.icon size={16} strokeWidth={2.5} />
                    </motion.div>
                    <div className="timeline-content">
                      <p className="timeline-action">{activity.action}</p>
                      <span className="timeline-time">{activity.time}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Performance Metrics with Enhanced Glassmorphism */}
            <motion.div 
              className="pro-card glass-card"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="card-header">
                <BarChart3 size={22} strokeWidth={2.5} />
                <h3>Performance Metrics</h3>
              </div>
              <div className="metrics-list">
                {performanceMetrics.map((metric, index) => (
                  <motion.div 
                    key={index} 
                    className="metric-item"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="metric-header">
                      <span className="metric-label">
                        <span className="metric-emoji">{metric.icon}</span>
                        {metric.label}
                      </span>
                      <motion.span 
                        className="metric-value"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                      >
                        {metric.value}%
                      </motion.span>
                    </div>
                    <div className="metric-bar-container">
                      <motion. div
                        className="metric-bar-fill"
                        style={{ background: metric.bgGradient }}
                        initial={{ width: 0 }}
                        animate={{ width: `${metric.value}%` }}
                        transition={{ duration: 1, delay: 0.7 + index * 0.2, ease: 'easeOut' }}
                      >
                        <motion.div
                          className="metric-shine"
                          animate={{ x: [-100, 300] }}
                          transition={{ duration: 2, repeat: Infinity, delay: 1.5 + index * 0.2 }}
                        />
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;