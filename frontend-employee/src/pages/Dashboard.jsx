import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { useDataStore } from '../store/dataStore';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { formatDistanceToNow } from 'date-fns';
import {
  CheckSquare, Clock, Camera, TrendingUp, Calendar,
  BarChart3, Zap, Bell, Target, AlertTriangle,
  Activity, Quote, Users, Coffee, IndianRupee,
  FileText, Palmtree, FolderOpen, Wallet, Flame, Info, ArrowRight
} from 'lucide-react';
import ClockWidget from '../components/ClockWidget';
import './Dashboardpro.css';

const QUOTES = [
  { text: "The best way to predict the future is to create it.", author: "Peter Drucker" },
  { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
  { text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", author: "Martin Fowler" },
  { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
  { text: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
  { text: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
  { text: "Programs must be written for people to read, and only incidentally for machines to execute.", author: "Hal Abelson" },
];

const TEAM_MEMBERS = [
  { name: 'Priya Sharma', role: 'Backend Dev', online: true, avatar: 'PS' },
  { name: 'Vikram Patel', role: 'Tech Lead', online: true, avatar: 'VP' },
  { name: 'Ananya Gupta', role: 'QA Lead', online: false, avatar: 'AG' },
  { name: 'Amit Joshi', role: 'DevOps', online: true, avatar: 'AJ' },
  { name: 'Sneha Iyer', role: 'Frontend Dev', online: false, avatar: 'SI' },
  { name: 'Deepika Nair', role: 'UI Designer', online: true, avatar: 'DN' },
];

const Dashboard = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { tasks, timeEntries, activities, notifications, expenses, leaves, fetchAll } = useDataStore();

  useEffect(() => { fetchAll(); }, []);

  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const quote = useMemo(() => QUOTES[Math.floor(Math.random() * QUOTES.length)], []);

  const todayStr = new Date().toISOString().split('T')[0];
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const totalTasks = tasks.length;
  const todaySeconds = timeEntries.filter(e => e.date === todayStr).reduce((s, e) => s + e.seconds, 0);
  const weekSeconds = timeEntries.reduce((s, e) => s + e.seconds, 0);
  const userName = user?.name || user?.displayName || 'You';
  const myTasks = tasks.filter(t => t.assignee === userName || t.assigneeName === userName);
  const overdueTasks = tasks.filter(t => t.status !== 'completed' && t.dueDate && new Date(t.dueDate) < new Date());
  const unreadNotifs = notifications.filter(n => !n.read).length;
  const pendingLeaves = leaves.filter(l => l.status === 'pending').length;
  const recentExpenseTotal = expenses.filter(e => e.date && e.date.startsWith(new Date().toISOString().slice(0, 7))).reduce((s, e) => s + e.amount, 0);

  const formatDur = (sec) => { const h = Math.floor(sec / 3600); const m = Math.floor((sec % 3600) / 60); return h > 0 ? `${h}h ${m}m` : `${m}m`; };

  const firstName = userName.split(' ')[0] || 'User';
  const greeting = now.getHours() < 12 ? 'Good Morning' : now.getHours() < 17 ? 'Good Afternoon' : 'Good Evening';

  const deadlines = tasks
    .filter(t => t.status !== 'completed' && t.dueDate)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 4);

  return (
    <div className="dashboard-pro dark">
      {/* Premium Background Elements */}
      <div className="animated-background">
        <div className="grid-pattern" />
        <div className="gradient-orb orb-1" />
        <div className="gradient-orb orb-2" />
        <div className="gradient-orb orb-3" />
      </div>

      <div className="pro-main">
        <header className="dashboard-header" style={{ marginBottom: '40px', position: 'relative', zIndex: 10 }}>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="hero-text" style={{ fontSize: '3rem', fontWeight: 800, letterSpacing: '-1px', marginBottom: '8px' }}>{greeting}, {firstName}</h1>
            <p className="sub-text" style={{ fontSize: '1.1rem', opacity: 0.7 }}>{now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
          </motion.div>
        </header>

        <div className="dashboard-grid-top" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '32px' }}>
          <ClockWidget />
        
        <div className="glass-card pro-card balance-widget">
          <div className="card-header" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px', marginBottom: '20px' }}>
            <Calendar size={20} style={{ color: 'var(--primary)' }} />
            <h3>Attendance & Leave</h3>
            <button className="btn-link" style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }} onClick={() => navigate('/leave')}>Manage <ArrowRight size={14} /></button>
          </div>
          
          <div className="balance-grid">
            {[
              { label: 'Casual', value: user?.leaveBalances?.casual || 12, max: 12, color: 'var(--primary)' },
              { label: 'Earned', value: user?.leaveBalances?.earned || 15, max: 15, color: 'var(--secondary)' },
              { label: 'Sick', value: user?.leaveBalances?.sick || 10, max: 10, color: '#f43f5e' }
            ].map((item, i) => (
              <div key={i} className="balance-item">
                <div className="balance-info">
                  <span>{item.label}</span>
                  <span className="balance-val">{item.value}</span>
                </div>
                <div className="progress-track">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.value / item.max) * 100}%` }}
                    className="progress-fill"
                    style={{ background: item.color }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="quote-strip glass-panel">
        <Quote size={18} className="quote-icon" />
        <p>"{quote.text}" — <span>{quote.author}</span></p>
      </div>

      <div className="stats-row">
        <div onClick={() => navigate('/time-tracker')} className="stat-card-smooth glass-panel highlight">
          <div className="stat-icon-wrapper icon-teal">
            <Clock className="stat-icon" />
          </div>
          <div className="stat-content">
            <span className="stat-label">Today's Focus</span>
            <div className="stat-value">{formatDur(todaySeconds)}</div>
            <div className="stat-footer">{todaySeconds >= 28800 ? 'Target achieved!' : `${formatDur(32400 - todaySeconds)} to go`}</div>
          </div>
        </div>

        {[
          { label: 'Tasks Done', value: `${completedTasks}/${totalTasks}`, icon: CheckSquare, color: '#2dd4bf', path: '/tasks', iconClass: 'icon-teal' },
          { label: 'My Active', value: myTasks.filter(t => t.status !== 'completed').length, icon: Target, color: '#0ea5e9', path: '/tasks', iconClass: 'icon-blue', extra: overdueTasks.length > 0 ? `${overdueTasks.length} overdue` : null },
          { label: 'Weekly Log', value: formatDur(weekSeconds), icon: TrendingUp, color: '#8b5cf6', path: '/analytics', iconClass: 'icon-purple' },
          { label: 'Day Streak', value: 5, icon: Flame, color: '#f97316', iconClass: 'icon-orange' }
        ].map((s, i) => (
          <div key={i} onClick={() => s.path && navigate(s.path)} className={`stat-card-smooth glass-panel ${s.centered ? 'centered' : ''}`}>
            <div className={`stat-icon-wrapper ${s.iconClass}`}>
              <s.icon className="stat-icon" style={{ color: s.color }} />
            </div>
            <div className="stat-content">
              <span className="stat-label">{s.label}</span>
              <div className="stat-value">{s.value}</div>
              {s.extra && <div className="stat-footer danger">{s.extra}</div>}
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid-main">
        <div className="glass-panel actions-panel">
          <h3 className="section-title">Quick Access</h3>
          <div className="actions-grid">
            {[
              { icon: CheckSquare, label: 'Tasks', path: '/tasks', color: '#4f46e5' },
              { icon: Clock, label: 'Time', path: '/time-tracker', color: '#8b5cf6' },
              { icon: Camera, label: 'Proof', path: '/submit-proof', color: '#10b981' },
              { icon: Bell, label: 'Inbox', path: '/notifications', color: '#f43f5e', badge: unreadNotifs },
              { icon: Wallet, label: 'Wallet', path: '/expenses', color: '#f59e0b' },
              { icon: Palmtree, label: 'Leave', path: '/leave', color: '#06b6d4' },
              { icon: IndianRupee, label: 'Pay', path: '/payslips', color: '#10b981' },
              { icon: FolderOpen, label: 'Docs', path: '/documents', color: '#8b5cf6' },
            ].map((action, i) => (
              <motion.div key={i} whileHover={{ y: -4, background: 'rgba(255,255,255,0.06)' }} onClick={() => navigate(action.path)} className="action-item">
                <div className="action-icon-bg" style={{ background: `${action.color}15` }}>
                  <action.icon size={20} style={{ color: action.color }} />
                </div>
                <span className="action-label">{action.label}</span>
                {action.badge > 0 && <span className="action-badge">{action.badge}</span>}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="glass-panel deadlines-panel">
          <h3 className="section-title">Upcoming Deadlines</h3>
          <div className="deadline-list">
            {deadlines.map((task, i) => {
              const daysLeft = Math.ceil((new Date(task.dueDate) - new Date()) / 86400000);
              const status = daysLeft < 0 ? 'late' : daysLeft <= 2 ? 'urgent' : 'normal';
              return (
                <div key={i} className={`deadline-item ${status}`}>
                  <div className="deadline-main">
                    <span className="deadline-title">{task.title}</span>
                    <span className="deadline-date">{new Date(task.dueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</span>
                  </div>
                  <span className={`deadline-tag ${status}`}>
                    {status === 'late' ? `${Math.abs(daysLeft)}d overdue` : status === 'urgent' ? 'Due soon' : `${daysLeft}d left`}
                  </span>
                </div>
              );
            })}
            {deadlines.length === 0 && <div className="empty-state rgb-text">No upcoming deadlines 🎉</div>}
          </div>
        </div>

        <div className="glass-panel team-panel">
          <h3 className="section-title">Collaborators</h3>
          <div className="team-list">
            {TEAM_MEMBERS.map((member, i) => (
              <div key={i} className="team-member">
                <div className="member-avatar" style={{ background: `linear-gradient(135deg, hsl(${i * 60}, 70%, 40%), hsl(${i * 60 + 40}, 70%, 30%))` }}>
                  {member.avatar}
                  <div className={`status-dot ${member.online ? 'online' : ''}`} />
                </div>
                <div className="member-info">
                  <span className="member-name">{member.name}</span>
                  <span className="member-role">{member.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);
};

export default Dashboard;