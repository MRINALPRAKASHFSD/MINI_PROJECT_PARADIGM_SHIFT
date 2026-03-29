import { useAuthStore } from '../store/authStore';
import { useDataStore } from '../store/dataStore';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import {
  CheckSquare, Clock, Camera, User, TrendingUp, Calendar,
  Award, FileText, ChevronRight, Activity, BarChart3, Zap,
  Bell, ArrowUpRight, Target, Briefcase, AlertTriangle
} from 'lucide-react';
import './Dashboardpro.css';

const Dashboard = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { tasks, timeEntries, activities, notifications } = useDataStore();

  // ── live clock ─────────────────────────────────────────────
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // ── computed stats ─────────────────────────────────────────
  const todayStr = new Date().toISOString().split('T')[0];
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const totalTasks = tasks.length;
  const todaySeconds = timeEntries.filter(e => e.date === todayStr).reduce((s, e) => s + e.seconds, 0);
  const weekSeconds = timeEntries.reduce((s, e) => s + e.seconds, 0);
  const myTasks = tasks.filter(t => t.assignee === 'Rajesh Kumar');
  const overdueTasks = tasks.filter(t => t.status !== 'completed' && t.dueDate && new Date(t.dueDate) < new Date());
  const unreadNotifs = notifications.filter(n => !n.read).length;

  const formatDur = (sec) => { const h = Math.floor(sec / 3600); const m = Math.floor((sec % 3600) / 60); return h > 0 ? `${h}h ${m}m` : `${m}m`; };

  const stats = [
    { label: 'Tasks Completed', value: completedTasks, total: totalTasks, trend: `${totalTasks > 0 ? Math.round(completedTasks / totalTasks * 100) : 0}%`, trendUp: true, color: 'blue', icon: CheckSquare, bgGradient: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)' },
    { label: 'Today\'s Hours', value: formatDur(todaySeconds), total: '9h target', trend: todaySeconds > 28800 ? 'On track' : `${formatDur(28800 - todaySeconds)} left`, trendUp: todaySeconds >= 25200, color: 'green', icon: Clock, bgGradient: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)' },
    { label: 'Week Hours', value: formatDur(weekSeconds), total: '45h target', trend: `${Math.round(weekSeconds / 162000 * 100)}%`, trendUp: true, color: 'purple', icon: TrendingUp, bgGradient: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)' },
    { label: 'My Active Tasks', value: myTasks.filter(t => t.status !== 'completed').length, total: myTasks.length, trend: overdueTasks.length > 0 ? `${overdueTasks.length} overdue` : 'All on track', trendUp: overdueTasks.length === 0, color: 'orange', icon: Target, bgGradient: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)' },
  ];

  const quickActions = [
    { icon: CheckSquare, label: 'View Tasks', desc: `${myTasks.filter(t => t.status !== 'completed').length} active tasks`, path: '/tasks', color: 'blue', count: myTasks.filter(t => t.status !== 'completed').length },
    { icon: Clock, label: 'Track Time', desc: formatDur(todaySeconds) + ' logged today', path: '/time-tracker', color: 'green' },
    { icon: Camera, label: 'Submit Proof', desc: 'Upload work screenshots', path: '/submit-proof', color: 'purple' },
    { icon: Bell, label: 'Notifications', desc: `${unreadNotifs} unread`, path: '/notifications', color: 'orange', count: unreadNotifs },
  ];

  const performanceMetrics = [
    { label: 'Code Quality', value: 94, icon: '🎯', bgGradient: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)' },
    { label: 'Task Completion', value: totalTasks > 0 ? Math.round(completedTasks / totalTasks * 100) : 0, icon: '✅', bgGradient: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)' },
    { label: 'Communication', value: 92, icon: '💬', bgGradient: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)' },
    { label: 'Punctuality', value: 96, icon: '⏰', bgGradient: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)' },
  ];

  // ── upcoming deadlines (sorted, only active tasks) ─────────
  const deadlines = tasks
    .filter(t => t.status !== 'completed' && t.dueDate)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  const cardStyle = { background: 'rgba(15,23,42,0.6)', borderRadius: '20px', padding: '28px', border: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)' };

  return (
    <div className="dashboard-container dark" style={{ padding: '24px', minHeight: '100vh', color: '#e2e8f0' }}>
      {/* ── HEADER with live clock ── */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '700', margin: '0 0 4px' }}>
            {now.getHours() < 12 ? '🌅 Good Morning' : now.getHours() < 17 ? '☀️ Good Afternoon' : '🌙 Good Evening'}, {user?.displayName?.split(' ')[0] || 'Rajesh'}
          </h1>
          <p style={{ color: '#64748b', margin: 0, fontSize: '15px' }}>
            {now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '36px', fontWeight: '700', fontFamily: 'monospace', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
          </div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>IST — India Standard Time</div>
        </div>
      </motion.div>

      {/* ── STATS ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        {stats.map((stat, i) => (
          <div key={i} className="stat-card-smooth" style={{ ...cardStyle, padding: '24px', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
            onClick={() => navigate(i === 0 ? '/tasks' : i === 1 ? '/time-tracker' : i === 2 ? '/time-tracker' : '/tasks')}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: stat.bgGradient, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <stat.icon size={24} color="#fff" />
              </div>
              <span style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '8px', fontWeight: '600', background: stat.trendUp ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', color: stat.trendUp ? '#10b981' : '#ef4444' }}>
                {stat.trend}
              </span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: '700' }}>{stat.value}</div>
            <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>{stat.label} <span style={{ color: '#475569' }}>/ {stat.total}</span></div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '28px' }}>
        {/* ── QUICK ACTIONS ── */}
        <div style={cardStyle}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '0 0 20px', fontSize: '18px' }}>
            <Zap size={22} style={{ color: '#f59e0b' }} /> Quick Actions
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {quickActions.map((action, i) => (
              <div key={i} onClick={() => navigate(action.path)}
                className="stat-card-smooth"
                style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '16px', padding: '20px', border: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer', transition: 'transform 0.2s, background 0.2s', position: 'relative' }}>
                <action.icon size={24} style={{ color: `var(--color-${action.color}, #3b82f6)`, marginBottom: '10px' }} />
                <div style={{ fontWeight: '600', fontSize: '15px', marginBottom: '4px' }}>{action.label}</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>{action.desc}</div>
                {action.count > 0 && (
                  <span style={{ position: 'absolute', top: '12px', right: '12px', width: '22px', height: '22px', borderRadius: '50%', background: '#ef4444', color: '#fff', fontSize: '11px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{action.count}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── UPCOMING DEADLINES ── */}
        <div style={cardStyle}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '0 0 20px', fontSize: '18px' }}>
            <AlertTriangle size={22} style={{ color: '#ef4444' }} /> Upcoming Deadlines
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {deadlines.map((task, i) => {
              const daysLeft = Math.ceil((new Date(task.dueDate) - new Date()) / 86400000);
              const isOverdue = daysLeft < 0;
              const isUrgent = daysLeft <= 2 && !isOverdue;
              return (
                <div key={i} onClick={() => navigate('/tasks')} className="stat-card-smooth"
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderRadius: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer', transition: 'transform 0.15s', borderLeft: `4px solid ${isOverdue ? '#ef4444' : isUrgent ? '#f59e0b' : '#10b981'}` }}>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '14px' }}>{task.title}</div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{task.assignee} · {task.priority}</div>
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: '600', padding: '4px 10px', borderRadius: '8px', whiteSpace: 'nowrap',
                    background: isOverdue ? 'rgba(239,68,68,0.15)' : isUrgent ? 'rgba(245,158,11,0.15)' : 'rgba(16,185,129,0.15)',
                    color: isOverdue ? '#ef4444' : isUrgent ? '#f59e0b' : '#10b981' }}>
                    {isOverdue ? `${Math.abs(daysLeft)}d overdue` : daysLeft === 0 ? 'Due today' : `${daysLeft}d left`}
                  </span>
                </div>
              );
            })}
            {deadlines.length === 0 && <p style={{ color: '#64748b', fontSize: '14px', textAlign: 'center', padding: '20px' }}>No upcoming deadlines 🎉</p>}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '28px' }}>
        {/* ── RECENT ACTIVITY ── */}
        <div style={cardStyle}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '0 0 20px', fontSize: '18px' }}>
            <Activity size={22} style={{ color: '#3b82f6' }} /> Recent Activity
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {activities.slice(0, 6).map((act, i) => (
              <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', transition: 'background 0.2s' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${act.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: act.color, flexShrink: 0, fontSize: '14px' }}>
                  {act.icon === 'task' ? '✓' : act.icon === 'time' ? '⏱' : act.icon === 'proof' ? '📸' : act.icon === 'award' ? '🏆' : act.icon === 'deploy' ? '🚀' : '📋'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', lineHeight: '1.5' }}>{act.action}</div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>{formatDistanceToNow(new Date(act.createdAt), { addSuffix: true })}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── PERFORMANCE METRICS ── */}
        <div style={cardStyle}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '0 0 20px', fontSize: '18px' }}>
            <BarChart3 size={22} style={{ color: '#a855f7' }} /> Performance
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {performanceMetrics.map((metric, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '16px', padding: '20px', textAlign: 'center' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>{metric.icon}</div>
                <div style={{ position: 'relative', width: '80px', height: '80px', margin: '0 auto 12px' }}>
                  <svg width="80" height="80" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
                    <circle cx="40" cy="40" r="34" fill="none" stroke={metric.bgGradient.includes('#3B82F6') ? '#3b82f6' : metric.bgGradient.includes('#10B981') ? '#10b981' : metric.bgGradient.includes('#8B5CF6') ? '#8b5cf6' : '#f59e0b'}
                      strokeWidth="6" strokeLinecap="round" strokeDasharray={`${metric.value * 2.136} 999`} style={{ transition: 'stroke-dasharray 1s ease' }} />
                  </svg>
                  <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: '700' }}>{metric.value}%</span>
                </div>
                <div style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '500' }}>{metric.label}</div>
              </div>
            ))}
          </div>

          {/* Profile Info */}
          <div style={{ marginTop: '24px', padding: '20px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h4 style={{ margin: '0 0 14px', fontSize: '15px', fontWeight: '600' }}>Quick Profile</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {[
                { icon: '📧', label: 'Email', value: user?.email || 'N/A' },
                { icon: '📱', label: 'Phone', value: '+91 98765 43210' },
                { icon: '🏢', label: 'Department', value: 'Engineering' },
                { icon: '📅', label: 'Joined', value: '15 Jan 2024' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', padding: '8px', borderRadius: '8px', background: 'rgba(255,255,255,0.02)' }}>
                  <span>{item.icon}</span>
                  <div><div style={{ color: '#64748b', fontSize: '11px' }}>{item.label}</div><div style={{ fontWeight: '500' }}>{item.value}</div></div>
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