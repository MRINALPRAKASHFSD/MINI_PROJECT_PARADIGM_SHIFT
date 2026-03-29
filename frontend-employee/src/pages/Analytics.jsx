import { useState } from 'react';
import { motion } from 'framer-motion';
import { useDataStore } from '../store/dataStore';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { BarChart3, TrendingUp, Clock, CheckSquare, Target, Award, Activity, Zap } from 'lucide-react';
import './AnalyticsSimple.css';

const CHART_COLORS = ['#3b82f6', '#10b981', '#a855f7', '#f59e0b', '#ec4899', '#06b6d4'];

const Analytics = () => {
  const { tasks, timeEntries } = useDataStore();
  const [timeRange, setTimeRange] = useState('month');

  // ── Computed stats ──────────────────────────────────────────
  const completed = tasks.filter(t => t.status === 'completed').length;
  const total = tasks.length;
  const totalHours = Math.round(timeEntries.reduce((s, e) => s + e.seconds, 0) / 3600);

  const performanceStats = [
    { label: 'Productivity Score', value: `${total > 0 ? Math.round((completed / total) * 100) : 0}%`, change: '+5%', trend: 'up', icon: TrendingUp, color: '#10b981' },
    { label: 'Tasks Efficiency', value: `${completed}/${total}`, change: `${completed} done`, trend: 'up', icon: CheckSquare, color: '#3b82f6' },
    { label: 'Hours Logged', value: `${totalHours}h`, change: `${timeEntries.length} entries`, trend: 'up', icon: Clock, color: '#a855f7' },
    { label: 'Quality Score', value: '96%', change: '+2%', trend: 'up', icon: Award, color: '#f97316' },
  ];

  // ── Weekly hours chart (from real entries) ──────────────────
  const weeklyData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const hours = timeEntries.filter(e => e.date === dateStr).reduce((s, e) => s + e.seconds, 0) / 3600;
    return { day: d.toLocaleDateString('en-IN', { weekday: 'short' }), hours: Math.round(hours * 10) / 10 };
  });

  // ── Project breakdown (from real entries) ──────────────────
  const projectMap = {};
  timeEntries.forEach(e => {
    projectMap[e.project] = (projectMap[e.project] || 0) + e.seconds;
  });
  const projectBreakdown = Object.entries(projectMap)
    .map(([name, seconds], i) => ({ name, hours: Math.round(seconds / 3600 * 10) / 10, color: CHART_COLORS[i % CHART_COLORS.length] }))
    .sort((a, b) => b.hours - a.hours);
  const totalProjectHours = projectBreakdown.reduce((s, p) => s + p.hours, 0);
  const projectPie = projectBreakdown.map(p => ({ ...p, percentage: totalProjectHours > 0 ? Math.round((p.hours / totalProjectHours) * 100) : 0 }));

  // ── Productivity trend (last 14 days) ──────────────────────
  const productivityTrend = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (13 - i));
    const dateStr = d.toISOString().split('T')[0];
    const hours = timeEntries.filter(e => e.date === dateStr).reduce((s, e) => s + e.seconds, 0) / 3600;
    const tasksCompleted = tasks.filter(t => t.status === 'completed' && t.dueDate === dateStr).length;
    return {
      date: d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
      hours: Math.round(hours * 10) / 10,
      tasks: tasksCompleted,
      score: Math.min(100, Math.round(hours * 12 + tasksCompleted * 5 + 50)),
    };
  });

  // ── Task status pie ────────────────────────────────────────
  const taskStatusPie = [
    { name: 'To Do', value: tasks.filter(t => t.status === 'todo').length, color: '#3b82f6' },
    { name: 'In Progress', value: tasks.filter(t => t.status === 'inProgress').length, color: '#eab308' },
    { name: 'Review', value: tasks.filter(t => t.status === 'review').length, color: '#a855f7' },
    { name: 'Completed', value: tasks.filter(t => t.status === 'completed').length, color: '#10b981' },
  ].filter(s => s.value > 0);

  const skillsData = [
    { skill: 'Coding', score: 95, color: '#3b82f6' },
    { skill: 'Problem Solving', score: 88, color: '#10b981' },
    { skill: 'Communication', score: 92, color: '#a855f7' },
    { skill: 'Time Mgmt', score: 85, color: '#f97316' },
    { skill: 'Teamwork', score: 90, color: '#ec4899' },
    { skill: 'Leadership', score: 78, color: '#eab308' },
  ];

  const cardStyle = { background: 'rgba(15,23,42,0.6)', borderRadius: '20px', padding: '28px', border: '1px solid rgba(255,255,255,0.06)' };

  return (
    <div style={{ padding: '24px', color: '#e2e8f0', minHeight: '100vh' }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: 'linear-gradient(135deg, #6366f1, #818cf8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BarChart3 size={28} color="#fff" />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '700' }}>Analytics</h1>
            <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Your performance insights</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['week', 'month', 'year'].map(r => (
            <button key={r} onClick={() => setTimeRange(r)}
              style={{ padding: '8px 20px', borderRadius: '10px', border: 'none', fontSize: '13px', fontWeight: '600', cursor: 'pointer', background: timeRange === r ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : 'rgba(255,255,255,0.05)', color: timeRange === r ? '#fff' : '#94a3b8', textTransform: 'capitalize', transition: 'all 0.2s' }}>
              {r}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '24px' }}>
        {performanceStats.map((stat, i) => (
          <div key={i} style={{ ...cardStyle, padding: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${stat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color }}>
                <stat.icon size={22} />
              </div>
              <span style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '8px', fontWeight: '600', background: 'rgba(16,185,129,0.15)', color: '#10b981' }}>{stat.change}</span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: '700' }}>{stat.value}</div>
            <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Charts Row 1: Trend + Weekly */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px', marginBottom: '24px' }}>
        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 20px', fontSize: '18px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <TrendingUp size={20} style={{ color: '#10b981' }} /> Productivity Trend (14 days)
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={productivityTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#e2e8f0' }} />
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="score" stroke="#10b981" fill="url(#areaGrad)" strokeWidth={2} name="Score" />
              <Area type="monotone" dataKey="hours" stroke="#3b82f6" fill="none" strokeWidth={2} strokeDasharray="4 4" name="Hours" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 20px', fontSize: '18px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Activity size={20} style={{ color: '#3b82f6' }} /> Weekly Hours
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} unit="h" />
              <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#e2e8f0' }}
                formatter={(v) => [`${v}h`, 'Hours']} />
              <Bar dataKey="hours" radius={[6, 6, 0, 0]}>
                {weeklyData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2: Project Pie + Task Status + Skills */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
        {/* Project Breakdown */}
        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 20px', fontSize: '18px', fontWeight: '600' }}>Project Time</h3>
          {projectPie.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={projectPie} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="hours" nameKey="name" paddingAngle={2}>
                    {projectPie.map((p, i) => <Cell key={i} fill={p.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#e2e8f0' }}
                    formatter={(v) => [`${v}h`, 'Hours']} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
                {projectPie.map((p, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: p.color }} />
                      <span>{p.name}</span>
                    </div>
                    <span style={{ color: '#94a3b8', fontWeight: '600' }}>{p.hours}h ({p.percentage}%)</span>
                  </div>
                ))}
              </div>
            </>
          ) : <p style={{ color: '#64748b', textAlign: 'center', padding: '40px' }}>No data yet</p>}
        </div>

        {/* Task Status */}
        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 20px', fontSize: '18px', fontWeight: '600' }}>Task Status</h3>
          {taskStatusPie.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={taskStatusPie} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" nameKey="name" paddingAngle={2}>
                    {taskStatusPie.map((s, i) => <Cell key={i} fill={s.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#e2e8f0' }} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
                {taskStatusPie.map((s, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: s.color }} />
                      <span>{s.name}</span>
                    </div>
                    <span style={{ color: '#94a3b8', fontWeight: '600' }}>{s.value} tasks</span>
                  </div>
                ))}
              </div>
            </>
          ) : <p style={{ color: '#64748b', textAlign: 'center', padding: '40px' }}>No tasks</p>}
        </div>

        {/* Skills Radar (as bars) */}
        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 20px', fontSize: '18px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Zap size={20} style={{ color: '#f59e0b' }} /> Skills
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {skillsData.map((skill, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
                  <span>{skill.skill}</span>
                  <span style={{ color: skill.color, fontWeight: '600' }}>{skill.score}%</span>
                </div>
                <div style={{ height: '8px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: '4px', background: skill.color, width: `${skill.score}%`, transition: 'width 1s ease' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;