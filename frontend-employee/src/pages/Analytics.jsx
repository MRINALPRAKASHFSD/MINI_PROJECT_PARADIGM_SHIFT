import { useState } from 'react';
import { motion } from 'framer-motion';
import { useDataStore } from '../store/dataStore';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { BarChart3, TrendingUp, Clock, CheckSquare, Target, Award, Activity, Zap, Info, ArrowUpRight } from 'lucide-react';

// New Cyber Blue & Violet Palette for charts
const CHART_COLORS = ['#4f46e5', '#8b5cf6', '#a855f7', '#6366f1', '#7c3aed', '#4338ca'];

const Analytics = () => {
  const { tasks, timeEntries } = useDataStore();
  const [timeRange, setTimeRange] = useState('month');

  // Computed stats
  const completed = tasks.filter(t => t.status === 'completed').length;
  const total = tasks.length;
  const totalHours = Math.round(timeEntries.reduce((s, e) => s + e.seconds, 0) / 3600);

  const performanceStats = [
    { label: 'Productivity Score', value: `${total > 0 ? Math.round((completed / total) * 100) : 0}%`, change: '+5%', trend: 'up', icon: TrendingUp, color: 'var(--primary)' },
    { label: 'Tasks Efficiency', value: `${completed}/${total}`, change: `${completed} done`, trend: 'up', icon: CheckSquare, color: 'var(--secondary)' },
    { label: 'Hours Logged', value: `${totalHours}h`, change: `${timeEntries.length} entries`, trend: 'up', icon: Clock, color: '#a855f7' },
    { label: 'Quality Score', value: '96%', change: '+2%', trend: 'up', icon: Award, color: '#6366f1' },
  ];

  // Weekly hours chart
  const weeklyData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const hours = timeEntries.filter(e => e.date === dateStr).reduce((s, e) => s + e.seconds, 0) / 3600;
    return { day: d.toLocaleDateString('en-IN', { weekday: 'short' }), hours: Math.round(hours * 10) / 10 };
  });

  // Project breakdown
  const projectMap = {};
  timeEntries.forEach(e => {
    projectMap[e.project] = (projectMap[e.project] || 0) + e.seconds;
  });
  const projectBreakdown = Object.entries(projectMap)
    .map(([name, seconds], i) => ({ name, hours: Math.round(seconds / 3600 * 10) / 10, color: CHART_COLORS[i % CHART_COLORS.length] }))
    .sort((a, b) => b.hours - a.hours);
  const totalProjectHours = projectBreakdown.reduce((s, p) => s + p.hours, 0);
  const projectPie = projectBreakdown.map(p => ({ ...p, percentage: totalProjectHours > 0 ? Math.round((p.hours / totalProjectHours) * 100) : 0 }));

  // Productivity trend
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

  // Task status pie
  const taskStatusPie = [
    { name: 'To Do', value: tasks.filter(t => t.status === 'todo').length, color: 'var(--primary)' },
    { name: 'In Progress', value: tasks.filter(t => t.status === 'inProgress').length, color: 'var(--secondary)' },
    { name: 'Review', value: tasks.filter(t => t.status === 'review').length, color: '#a855f7' },
    { name: 'Completed', value: tasks.filter(t => t.status === 'completed').length, color: '#10b981' },
  ].filter(s => s.value > 0);

  const skillsData = [
    { skill: 'Coding', score: 95 },
    { skill: 'Problem Solving', score: 88 },
    { skill: 'Communication', score: 92 },
    { skill: 'Time Mgmt', score: 85 },
    { skill: 'Teamwork', score: 90 },
    { skill: 'Leadership', score: 78 },
  ];

  return (
    <div style={{ padding: '24px', minHeight: '100vh', position: 'relative' }}>
      {/* Background Ambient Glows */}
      <div className="ambient-glow" style={{ top: '10%', left: '5%', background: 'var(--primary-glow)', width: '400px', height: '400px' }} />
      <div className="ambient-glow" style={{ bottom: '20%', right: '10%', background: 'var(--secondary-glow)', width: '350px', height: '350px' }} />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '20px', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} style={{ width: '64px', height: '64px', borderRadius: '20px', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 12px 25px var(--primary-glow)' }}>
            <BarChart3 size={32} color="#fff" />
          </motion.div>
          <div>
            <h1 style={{ margin: 0, fontSize: '34px', fontWeight: '800', letterSpacing: '-1px' }}>Performance Insights</h1>
            <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontSize: '15px', fontWeight: '500' }}>Deep dive into your productivity and efficiency metrics</p>
          </div>
        </div>
        <div className="glass-panel" style={{ display: 'flex', gap: '8px', padding: '6px', borderRadius: '16px', border: '1px solid var(--border-glass)', background: 'rgba(255,255,255,0.02)' }}>
          {['week', 'month', 'year'].map(r => (
            <button key={r} onClick={() => setTimeRange(r)}
              style={{ padding: '10px 24px', borderRadius: '12px', border: 'none', fontSize: '14px', fontWeight: '800', cursor: 'pointer', background: timeRange === r ? 'var(--primary)' : 'transparent', color: timeRange === r ? '#fff' : 'var(--text-secondary)', textTransform: 'capitalize', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}>
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        {performanceStats.map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}
            className="glass-panel stat-card-smooth" style={{ borderRadius: '28px', padding: '28px', border: '1px solid var(--border-glass)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: `${stat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color, border: `1px solid ${stat.color}30` }}>
                <stat.icon size={26} />
              </div>
              <span style={{ fontSize: '12px', padding: '6px 14px', borderRadius: '10px', fontWeight: '800', background: 'rgba(79,70,229,0.1)', color: 'var(--primary)' }}>{stat.change}</span>
            </div>
            <div style={{ fontSize: '36px', fontWeight: '900', color: 'var(--text-primary)', letterSpacing: '-1px' }}>{stat.value}</div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '8px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.8px' }}>{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Main Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '24px', marginBottom: '24px' }}>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-panel" style={{ borderRadius: '32px', padding: '36px', border: '1px solid var(--border-glass)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <TrendingUp size={24} style={{ color: 'var(--primary)' }} /> Productivity Pulse
            </h3>
            <div style={{ display: 'flex', gap: '16px', fontSize: '12px', fontWeight: '800' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)' }} /> Efficiency</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--secondary)' }} /> Work Hours</div>
            </div>
          </div>
          <div style={{ height: '320px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={productivityTrend}>
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: 'var(--text-muted)', fontSize: 11, fontWeight: '700' }} axisLine={false} tickLine={false} dy={15} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11, fontWeight: '700' }} axisLine={false} tickLine={false} dx={-10} />
                <Tooltip 
                  contentStyle={{ background: 'var(--surface-panel)', border: '1px solid var(--border-glass)', borderRadius: '20px', backdropFilter: 'blur(30px)', color: 'var(--text-primary)', boxShadow: '0 20px 50px rgba(0,0,0,0.4)', padding: '16px' }} 
                  itemStyle={{ fontWeight: '800', fontSize: '14px' }}
                />
                <Area type="monotone" dataKey="score" stroke="var(--primary)" fill="url(#areaGrad)" strokeWidth={4} name="Efficiency Score" />
                <Area type="monotone" dataKey="hours" stroke="var(--secondary)" fill="none" strokeWidth={3} strokeDasharray="6 6" name="Work Hours" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-panel" style={{ borderRadius: '32px', padding: '36px', border: '1px solid var(--border-glass)' }}>
          <h3 style={{ margin: '0 0 32px', fontSize: '20px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Activity size={24} style={{ color: 'var(--secondary)' }} /> Weekly Activity
          </h3>
          <div style={{ height: '320px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: 'var(--text-muted)', fontSize: 12, fontWeight: '700' }} axisLine={false} tickLine={false} dy={15} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12, fontWeight: '700' }} axisLine={false} tickLine={false} unit="h" dx={-10} />
                <Tooltip 
                  contentStyle={{ background: 'var(--surface-panel)', border: '1px solid var(--border-glass)', borderRadius: '20px', backdropFilter: 'blur(30px)', padding: '12px' }}
                  formatter={(v) => [`${v}h`, 'Log Hours']} 
                />
                <Bar dataKey="hours" radius={[12, 12, 0, 0]} barSize={36}>
                  {weeklyData.map((_, i) => <Cell key={i} fill={i === 6 ? 'var(--primary)' : CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Project Pie */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel" style={{ borderRadius: '32px', padding: '36px', border: '1px solid var(--border-glass)' }}>
          <h3 style={{ margin: '0 0 28px', fontSize: '18px', fontWeight: '800' }}>Project Allocation</h3>
          <div style={{ height: '220px', position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={projectPie} cx="50%" cy="50%" innerRadius={65} outerRadius={95} dataKey="hours" nameKey="name" paddingAngle={5} stroke="none">
                  {projectPie.map((p, i) => <Cell key={i} fill={p.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--surface-panel)', border: '1px solid var(--border-glass)', borderRadius: '16px', backdropFilter: 'blur(20px)' }} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: '900', color: 'var(--primary)' }}>{totalHours}h</div>
              <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total logged</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '32px' }}>
            {projectPie.map((p, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderRadius: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.03)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: p.color }} />
                  <span style={{ fontSize: '14px', fontWeight: '700' }}>{p.name}</span>
                </div>
                <span style={{ fontSize: '14px', fontWeight: '800' }}>{p.percentage}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Task Lifecycle */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-panel" style={{ borderRadius: '32px', padding: '36px', border: '1px solid var(--border-glass)' }}>
          <h3 style={{ margin: '0 0 28px', fontSize: '18px', fontWeight: '800' }}>Task Dynamics</h3>
          <div style={{ height: '220px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={taskStatusPie} cx="50%" cy="50%" innerRadius={65} outerRadius={95} dataKey="value" nameKey="name" paddingAngle={5} stroke="none">
                  {taskStatusPie.map((s, i) => <Cell key={i} fill={s.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--surface-panel)', border: '1px solid var(--border-glass)', borderRadius: '16px', backdropFilter: 'blur(20px)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginTop: '32px' }}>
            {taskStatusPie.map((s, i) => (
              <div key={i} style={{ padding: '14px', borderRadius: '18px', background: `${s.color}08`, border: `1px solid ${s.color}20` }}>
                <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '4px' }}>{s.name}</div>
                <div style={{ fontSize: '20px', fontWeight: '900', color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Skills Growth */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-panel" style={{ borderRadius: '32px', padding: '36px', border: '1px solid var(--border-glass)' }}>
          <h3 style={{ margin: '0 0 32px', fontSize: '18px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Zap size={22} style={{ color: 'var(--primary)' }} /> Competency Matrix
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            {skillsData.map((skill, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '13px' }}>
                  <span style={{ fontWeight: '800' }}>{skill.skill}</span>
                  <span style={{ color: 'var(--primary)', fontWeight: '900' }}>{skill.score}%</span>
                </div>
                <div style={{ height: '8px', borderRadius: '4px', background: 'rgba(255,255,255,0.03)', overflow: 'hidden' }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${skill.score}%` }} transition={{ duration: 1.5, ease: "easeOut", delay: 0.4 + i * 0.1 }} style={{ height: '100%', background: 'linear-gradient(90deg, var(--primary), var(--secondary))', borderRadius: '4px', boxShadow: `0 0 15px ${CHART_COLORS[0]}40` }} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '36px', padding: '24px', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(79,70,229,0.1), transparent)', border: '1px solid rgba(79,70,229,0.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--primary)', fontWeight: '900', fontSize: '15px' }}>
              <Award size={20} /> Performance Milestone
            </div>
            <p style={{ margin: '10px 0 0', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6', fontWeight: '600' }}>
              Your coding efficiency index has surged by <span style={{ color: 'var(--primary)', fontWeight: '800' }}>14%</span> since the last sprint cycle. Keep it up!
            </p>
          </div>
        </motion.div>
      </div>

      <div className="glass-panel" style={{ marginTop: '40px', padding: '28px 36px', borderRadius: '24px', border: '1px solid var(--border-glass)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ padding: '12px', background: 'rgba(79,70,229,0.1)', borderRadius: '14px' }}><Info size={24} color="var(--primary)" /></div>
          <div>
            <div style={{ fontSize: '16px', fontWeight: '800' }}>Automated Insights Generation</div>
            <div style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: '600' }}>Next comprehensive report scheduled for April 30, 2026</div>
          </div>
        </div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ padding: '12px 28px', borderRadius: '14px', background: 'var(--primary)', color: '#fff', border: 'none', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 8px 20px var(--primary-glow)' }}>
          Export Detailed PDF <ArrowUpRight size={18} />
        </motion.button>
      </div>
    </div>
  );
};

export default Analytics;