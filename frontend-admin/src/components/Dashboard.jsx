import { 
  Users, 
  CheckCircle2, 
  Clock, 
  Building2, 
  FileText, 
  UserPlus, 
  BarChart3, 
  Megaphone,
  Calendar,
  LayoutDashboard,
  Sparkles
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useDataStore } from '../store/dataStore';
import './Dashboard.css';

function Dashboard() {
  const { isDarkMode } = useTheme();
  const { dashboardStats, dashboardActivities, employees, departments, leaves } = useDataStore();

  const totalEmps = employees.length || 0;
  const pendingLeavesCount = leaves.filter(l => (l.status || '').toLowerCase() === 'pending').length || 0;
  const totalDepts = departments.length || 0;
  const presentToday = dashboardStats?.presentToday || 0;

  const stats = [
    { icon: <Users size={20} />, value: totalEmps, label: 'Total Employees', color: '#6366f1' },
    { icon: <CheckCircle2 size={20} />, value: presentToday, label: 'Present Today', color: '#10b981' },
    { icon: <Clock size={20} />, value: pendingLeavesCount, label: 'Pending Leaves', color: '#f59e0b' },
    { icon: <Building2 size={20} />, value: totalDepts, label: 'Departments', color: '#06b6d4' },
  ];

  const fallbackActivities = [
    { icon: <Sparkles size={16} />, text: 'Diya Sharma joined as Senior Developer', time: '2 hours ago' },
    { icon: <FileText size={16} />, text: 'Pratham Verma requested 3 days leave', time: '3 hours ago' },
  ];

  const activities = dashboardActivities?.length ? dashboardActivities : fallbackActivities;

  const quickActions = [
    { icon: <UserPlus size={20} />, text: 'Add Employee', color: '#6366f1', route: '/employees/add' },
    { icon: <CheckCircle2 size={20} />, text: 'Approve Leaves', color: '#10b981', route: '/leaves' },
    { icon: <BarChart3 size={20} />, text: 'View Reports', color: '#06b6d4', route: '/reports' },
    { icon: <Megaphone size={20} />, text: 'Send Notice', color: '#f59e0b', route: '/announcements' },
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="dashboard-header-title">
          <div className="header-icon-wrapper">
            <LayoutDashboard size={24} color="#6366f1" />
          </div>
          <div>
            <h1>Dashboard Overview</h1>
            <p>Welcome back! Here's what's happening today.</p>
          </div>
        </div>
        <div className="date-time">
          <span className="date">
            <Calendar size={14} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
            {new Date().toLocaleDateString('en-IN', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </span>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="stat-card"
            style={{ '--card-color': stat.color }}
          >
            <div className="stat-icon" style={{ backgroundColor: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-info">
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-content">
        <div className="activities-section">
          <h2>Recent Activities</h2>
          <div className="activities-list">
            {activities.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="activity-icon">
                  {activity.icon || <Sparkles size={16} />}
                </div>
                <div className="activity-content">
                  <p className="activity-text">{activity.text}</p>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="quick-actions-section">
          <h2>Quick Actions</h2>
          <div className="quick-actions-grid">
            {quickActions.map((action, index) => (
              <button
                key={index}
                className="action-card"
                style={{ '--action-color': action.color }}
                onClick={() => window.location.href = action.route}
              >
                <div className="action-icon" style={{ color: action.color }}>
                  {action.icon}
                </div>
                <span>{action.text}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;