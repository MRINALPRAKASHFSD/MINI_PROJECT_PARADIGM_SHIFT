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
  FileText, Palmtree, FolderOpen, Wallet, Flame, Info
} from 'lucide-react';
import ClockWidget from '../components/ClockWidget';
import './Dashboardpro.css';

// different quotes each refresh — feels hand-picked
const QUOTES = [
  { text: "The best way to predict the future is to create it.", author: "Peter Drucker" },
  { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
  { text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", author: "Martin Fowler" },
  { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
  { text: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
  { text: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
  { text: "Programs must be written for people to read, and only incidentally for machines to execute.", author: "Hal Abelson" },
  { text: "It works on my machine is not a valid deployment strategy.", author: "Every DevOps Engineer" },
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

  // ── load data from backend on mount ─────────────────────────
  useEffect(() => { fetchAll(); }, []);

  // ── live clock ─────────────────────────────────────────────
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // ── pick a "random" quote that stays for the session
  const quote = useMemo(() => QUOTES[Math.floor(Math.random() * QUOTES.length)], []);

  // ── computed stats ─────────────────────────────────────────
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
  const pendingExpenses = expenses.filter(e => e.status === 'pending').length;
  const recentExpenseTotal = expenses.filter(e => e.date && e.date.startsWith(new Date().toISOString().slice(0, 7))).reduce((s, e) => s + e.amount, 0);

  const formatDur = (sec) => { const h = Math.floor(sec / 3600); const m = Math.floor((sec % 3600) / 60); return h > 0 ? `${h}h ${m}m` : `${m}m`; };

  // ── safe date formatting ──
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return 'TBD';
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
  };

  // ── streak: days in a row with time entries ────────────────
  const streak = useMemo(() => {
    let count = 0;
    const d = new Date();
    for (let i = 0; i < 30; i++) {
      const dateStr = d.toISOString().split('T')[0];
      if (timeEntries.some(e => e.date === dateStr)) count++;
      else if (i > 0) break;
      d.setDate(d.getDate() - 1);
    }
    return count;
  }, [timeEntries]);

  const firstName = userName.split(' ')[0] || 'User';
  const greeting = now.getHours() < 12 ? 'Good Morning' : now.getHours() < 17 ? 'Good Afternoon' : 'Good Evening';

  // ── upcoming deadlines (sorted, only active tasks) ─────────
  const deadlines = tasks
    .filter(t => t.status !== 'completed' && t.dueDate)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 4);

  return (
    <div style={{ padding: '24px', minHeight: '100vh', color: '#e2e8f0' }}>

      {/* ── HEADER ROW ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '20px', maxWidth: '1400px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', margin: '0 0 6px', letterSpacing: '-0.5px' }}>
            {greeting}, {firstName} 👋
          </h1>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: '15px', fontWeight: '500' }}>
            {now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div style={{ textAlign: 'right', background: 'rgba(255,255,255,0.03)', padding: '10px 18px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ fontSize: '34px', fontWeight: '800', fontFamily: "'JetBrains Mono', monospace", color: '#f1f5f9', letterSpacing: '1px' }}>
            {now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
          </div>
          <div style={{ fontSize: '12px', color: '#64748b', letterSpacing: '2px', fontWeight: '700', marginTop: '2px' }}>IST</div>
        </div>
      </div>

      {/* ── ATTENDANCE & LEAVE QUICK VIEW ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2.8fr', gap: '20px', marginBottom: '24px' }}>
        <ClockWidget />
        
        <div style={{ 
          background: 'rgba(15,23,42,0.5)', 
          borderRadius: '16px', 
          padding: '22px', 
          border: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '600', color: '#94a3b8' }}>Leave Balances</h3>
            <button 
              onClick={() => navigate('/leave')}
              style={{ fontSize: '12px', color: '#4f46e5', fontWeight: '600', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              View History
            </button>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {[
              { label: 'Casual Leave', value: user?.leaveBalances?.casual || 12, max: 12, color: '#3b82f6' },
              { label: 'Earned Leave', value: user?.leaveBalances?.earned || 15, max: 15, color: '#10b981' },
              { label: 'Sick Leave', value: user?.leaveBalances?.sick || 10, max: 10, color: '#ef4444' }
            ].map((item, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.03)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                  <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>{item.label}</span>
                  <span style={{ fontSize: '16px', fontWeight: '700', color: '#f1f5f9' }}>{item.value}</span>
                </div>
                <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.value / item.max) * 100}%` }}
                    style={{ height: '100%', background: item.color }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── QUOTE — casual human touch ── */}
      <div style={{ padding: '14px 20px', marginBottom: '24px', borderLeft: '3px solid #475569', background: 'rgba(255,255,255,0.02)', borderRadius: '0 10px 10px 0' }}>
        <p style={{ margin: 0, fontSize: '14px', fontStyle: 'italic', color: '#94a3b8', lineHeight: '1.5' }}>
          "{quote.text}" <span style={{ fontStyle: 'normal', color: '#64748b' }}>— {quote.author}</span>
        </p>
      </div>

      {/* ── MAIN STATS — 5 cards, not 4. Varied importance ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {/* Big card: Today's hours */}
        <div onClick={() => navigate('/time-tracker')} className="stat-card-smooth"
          style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(6,182,212,0.06) 100%)', borderRadius: '18px', padding: '22px', border: '1px solid rgba(16,185,129,0.12)', cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <Clock size={20} color="#10b981" />
            <span style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Today's Work</span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#10b981' }}>{formatDur(todaySeconds)}</div>
          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
            {todaySeconds >= 28800 ? '✅ Target hit!' : `${formatDur(32400 - todaySeconds)} to 9h target`}
          </div>
          {/* Mini progress bar */}
          <div style={{ marginTop: '10px', height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.06)' }}>
            <div style={{ height: '100%', borderRadius: '2px', background: '#10b981', width: `${Math.min(100, (todaySeconds / 32400) * 100)}%`, transition: 'width 0.5s' }} />
          </div>
        </div>

        {/* Tasks */}
        <div onClick={() => navigate('/tasks')} className="stat-card-smooth"
          style={{ background: 'rgba(15,23,42,0.55)', borderRadius: '14px', padding: '20px', border: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer' }}>
          <CheckSquare size={18} color="#3b82f6" style={{ marginBottom: '10px' }} />
          <div style={{ fontSize: '24px', fontWeight: '700' }}>{completedTasks}<span style={{ color: '#475569', fontSize: '16px', fontWeight: '400' }}>/{totalTasks}</span></div>
          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>Tasks done</div>
        </div>

        {/* Active tasks */}
        <div onClick={() => navigate('/tasks')} className="stat-card-smooth"
          style={{ background: 'rgba(15,23,42,0.55)', borderRadius: '14px', padding: '20px', border: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer' }}>
          <Target size={18} color="#f59e0b" style={{ marginBottom: '10px' }} />
          <div style={{ fontSize: '24px', fontWeight: '700' }}>{myTasks.filter(t => t.status !== 'completed').length}</div>
          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>My active tasks</div>
          {overdueTasks.length > 0 && (
            <div style={{ fontSize: '11px', color: '#ef4444', marginTop: '4px' }}>{overdueTasks.length} overdue!</div>
          )}
        </div>

        {/* Week hours */}
        <div onClick={() => navigate('/analytics')} className="stat-card-smooth"
          style={{ background: 'rgba(15,23,42,0.55)', borderRadius: '14px', padding: '20px', border: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer' }}>
          <TrendingUp size={18} color="#a855f7" style={{ marginBottom: '10px' }} />
          <div style={{ fontSize: '24px', fontWeight: '700' }}>{formatDur(weekSeconds)}</div>
          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>This week</div>
        </div>

        {/* Streak — small fun card */}
        <div style={{ background: 'rgba(15,23,42,0.55)', borderRadius: '14px', padding: '20px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
          <Flame size={20} color="#f97316" style={{ marginBottom: '8px' }} />
          <div style={{ fontSize: '22px', fontWeight: '700' }}>{streak}</div>
          <div style={{ fontSize: '11px', color: '#64748b' }}>day streak</div>
        </div>
      </div>

      {/* ── MIDDLE ROW: 3 columns (intentionally unequal) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px' }}>

        {/* Quick Actions — bigger panel */}
        <div style={{ background: 'rgba(15,23,42,0.5)', borderRadius: '16px', padding: '22px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: '600', color: '#94a3b8' }}>Quick Actions</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {[
              { icon: CheckSquare, label: 'Tasks', desc: `${myTasks.filter(t => t.status !== 'completed').length} active`, path: '/tasks', color: '#3b82f6' },
              { icon: Clock, label: 'Time', desc: formatDur(todaySeconds) + ' today', path: '/time-tracker', color: '#10b981' },
              { icon: Camera, label: 'Proof', desc: 'Submit work', path: '/submit-proof', color: '#a855f7' },
              { icon: Bell, label: 'Inbox', desc: `${unreadNotifs} unread`, path: '/notifications', color: '#ef4444', badge: unreadNotifs },
              { icon: Wallet, label: 'Expenses', desc: `₹${recentExpenseTotal.toLocaleString('en-IN')}`, path: '/expenses', color: '#f59e0b' },
              { icon: Palmtree, label: 'Leave', desc: pendingLeaves > 0 ? `${pendingLeaves} pending` : 'Apply', path: '/leave', color: '#06b6d4' },
              { icon: IndianRupee, label: 'Payslips', desc: 'View salary', path: '/payslips', color: '#10b981' },
              { icon: FolderOpen, label: 'Docs', desc: 'My files', path: '/documents', color: '#8b5cf6' },
            ].map((action, i) => (
              <div key={i} onClick={() => navigate(action.path)} className="stat-card-smooth"
                style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer', position: 'relative' }}>
                <action.icon size={18} color={action.color} />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '600' }}>{action.label}</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>{action.desc}</div>
                </div>
                {action.badge > 0 && (
                  <span style={{ position: 'absolute', top: '8px', right: '8px', width: '18px', height: '18px', borderRadius: '50%', background: '#ef4444', color: '#fff', fontSize: '10px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{action.badge}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Deadlines */}
        <div style={{ background: 'rgba(15,23,42,0.5)', borderRadius: '16px', padding: '22px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: '600', color: '#94a3b8' }}>Upcoming Deadlines</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {deadlines.map((task, i) => {
              const daysLeft = Math.ceil((new Date(task.dueDate) - new Date()) / 86400000);
              const isOverdue = daysLeft < 0;
              const isUrgent = daysLeft <= 2 && !isOverdue;
              return (
                <div key={i} onClick={() => navigate('/tasks')} className="stat-card-smooth"
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer', borderLeft: `3px solid ${isOverdue ? '#ef4444' : isUrgent ? '#f59e0b' : '#10b981'}` }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: '600', fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{task.title}</div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{formatDate(task.dueDate)} · {task.assignee}</div>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: '600', padding: '3px 8px', borderRadius: '6px', whiteSpace: 'nowrap', flexShrink: 0, marginLeft: '8px',
                    background: isOverdue ? 'rgba(239,68,68,0.1)' : isUrgent ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)',
                    color: isOverdue ? '#ef4444' : isUrgent ? '#f59e0b' : '#10b981' }}>
                    {isOverdue ? `${Math.abs(daysLeft)}d late` : daysLeft === 0 ? 'Today' : `${daysLeft}d`}
                  </span>
                </div>
              );
            })}
            {deadlines.length === 0 && <p style={{ color: '#64748b', fontSize: '13px', textAlign: 'center', padding: '20px' }}>All clear, enjoy your coffee ☕</p>}
          </div>
        </div>

        {/* Team Online — new feature */}
        <div style={{ background: 'rgba(15,23,42,0.5)', borderRadius: '16px', padding: '22px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: '600', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Users size={16} /> Team
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {TEAM_MEMBERS.map((member, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `hsl(${i * 50 + 200}, 50%, 25%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '600', position: 'relative', flexShrink: 0 }}>
                  {member.avatar}
                  <span style={{ position: 'absolute', bottom: '-2px', right: '-2px', width: '8px', height: '8px', borderRadius: '50%', background: member.online ? '#10b981' : '#475569', border: '2px solid #0f172a' }} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: '500' }}>{member.name.split(' ')[0]}</div>
                  <div style={{ fontSize: '10px', color: '#64748b' }}>{member.role}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '12px', fontSize: '11px', color: '#475569' }}>
            {TEAM_MEMBERS.filter(m => m.online).length}/{TEAM_MEMBERS.length} online
          </div>
        </div>
      </div>

      {/* ── BOTTOM ROW: Activity + Performance ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
        {/* Recent Activity */}
        <div style={{ background: 'rgba(15,23,42,0.5)', borderRadius: '16px', padding: '22px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: '600', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Activity size={16} /> Recent Activity
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {activities.slice(0, 7).map((act, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '10px 12px', borderRadius: '10px', transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: act.color, marginTop: '7px', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', lineHeight: '1.5' }}>{act.action}</div>
                  <div style={{ fontSize: '11px', color: '#475569', marginTop: '2px' }}>
                    {act.user !== 'Rajesh Kumar' ? `${act.user} · ` : ''}{formatDistanceToNow(new Date(act.createdAt), { addSuffix: true })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance + Quick Profile */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Performance rings */}
          <div style={{ background: 'rgba(15,23,42,0.5)', borderRadius: '16px', padding: '22px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: '600', color: '#94a3b8' }}>Performance</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              {[
                { label: 'Code Quality', value: 94, color: '#3b82f6' },
                { label: 'Task Completion', value: totalTasks > 0 ? Math.round(completedTasks / totalTasks * 100) : 0, color: '#10b981' },
                { label: 'Communication', value: 92, color: '#a855f7' },
                { label: 'Punctuality', value: 96, color: '#f59e0b' },
              ].map((metric, i) => (
                <div key={i} style={{ textAlign: 'center', padding: '12px' }}>
                  <div style={{ position: 'relative', width: '60px', height: '60px', margin: '0 auto 8px' }}>
                    <svg width="60" height="60" style={{ transform: 'rotate(-90deg)' }}>
                      <circle cx="30" cy="30" r="25" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="5" />
                      <circle cx="30" cy="30" r="25" fill="none" stroke={metric.color}
                        strokeWidth="5" strokeLinecap="round" strokeDasharray={`${metric.value * 1.57} 999`} style={{ transition: 'stroke-dasharray 1s ease' }} />
                    </svg>
                    <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '700' }}>{metric.value}%</span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>{metric.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick info */}
          <div style={{ background: 'rgba(15,23,42,0.5)', borderRadius: '16px', padding: '22px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {[
                { label: 'Department', value: 'Engineering' },
                { label: 'Employee ID', value: 'PS-EMP-1047' },
                { label: 'Joined', value: '15 Jan 2024' },
                { label: 'Manager', value: 'Vikram Patel' },
              ].map((item, i) => (
                <div key={i} style={{ padding: '8px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '10px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>{item.label}</div>
                  <div style={{ fontSize: '13px', fontWeight: '500' }}>{item.value}</div>
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