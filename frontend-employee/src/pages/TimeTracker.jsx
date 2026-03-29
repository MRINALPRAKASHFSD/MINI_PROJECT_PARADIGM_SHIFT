import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDataStore } from '../store/dataStore';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Clock, Play, Pause, Square, Calendar, TrendingUp, Plus, Trash2, X, Save, BarChart3 } from 'lucide-react';
import './TimeTracker.css';

const PROJECTS = ['Karmachari Portal', 'Razorpay Integration', 'Dashboard Redesign', 'Aadhaar KYC Module', 'Mobile App', 'Documentation'];

const TimeTracker = () => {
  const { timeEntries, addTimeEntry, deleteTimeEntry } = useDataStore();
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [currentTask, setCurrentTask] = useState('');
  const [selectedProject, setSelectedProject] = useState('Karmachari Portal');
  const [showAddModal, setShowAddModal] = useState(false);
  const [manualEntry, setManualEntry] = useState({ task: '', project: 'Karmachari Portal', hours: '', minutes: '', date: new Date().toISOString().split('T')[0] });
  const intervalRef = useRef(null);

  // Timer
  useEffect(() => {
    if (isRunning) { intervalRef.current = setInterval(() => setTime(p => p + 1), 1000); }
    else { clearInterval(intervalRef.current); }
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const fmtTime = (s) => `${String(Math.floor(s / 3600)).padStart(2, '0')}:${String(Math.floor((s % 3600) / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  const fmtDur = (s) => { const h = Math.floor(s / 3600); const m = Math.floor((s % 3600) / 60); return h > 0 ? `${h}h ${m}m` : `${m}m`; };

  const handleStop = () => {
    if (time > 0) {
      addTimeEntry({ task: currentTask || 'Untitled Task', project: selectedProject, seconds: time, date: new Date().toISOString().split('T')[0] });
    }
    setIsRunning(false); setTime(0); setCurrentTask('');
  };

  const handleAddManual = () => {
    if (!manualEntry.task.trim()) return;
    const totalSec = (parseInt(manualEntry.hours || 0) * 3600) + (parseInt(manualEntry.minutes || 0) * 60);
    if (totalSec === 0) return;
    addTimeEntry({ task: manualEntry.task, project: manualEntry.project, seconds: totalSec, date: manualEntry.date });
    setShowAddModal(false);
    setManualEntry({ task: '', project: 'Karmachari Portal', hours: '', minutes: '', date: new Date().toISOString().split('T')[0] });
  };

  // Stats
  const todayStr = new Date().toISOString().split('T')[0];
  const todaySec = timeEntries.filter(e => e.date === todayStr).reduce((s, e) => s + e.seconds, 0);
  const weekSec = timeEntries.reduce((s, e) => s + e.seconds, 0);
  const avgPerDay = timeEntries.length > 0 ? Math.round(weekSec / 7) : 0;

  // Weekly chart data (last 7 days)
  const weekChart = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const dayLabel = d.toLocaleDateString('en-IN', { weekday: 'short' });
    const hours = timeEntries.filter(e => e.date === dateStr).reduce((s, e) => s + e.seconds, 0) / 3600;
    return { day: dayLabel, hours: Math.round(hours * 10) / 10, date: dateStr };
  });

  const statCards = [
    { label: 'Today', value: fmtDur(todaySec), sub: todaySec > 28800 ? 'Over target!' : `${fmtDur(Math.max(0, 28800 - todaySec))} left`, color: '#10b981' },
    { label: 'This Week', value: fmtDur(weekSec), sub: `${timeEntries.length} entries`, color: '#3b82f6' },
    { label: 'Entries', value: timeEntries.length, sub: `${timeEntries.filter(e => e.date === todayStr).length} today`, color: '#a855f7' },
    { label: 'Avg/Day', value: fmtDur(avgPerDay), sub: 'Over 7 days', color: '#f59e0b' },
  ];

  const cardStyle = { background: 'rgba(15,23,42,0.6)', borderRadius: '20px', padding: '28px', border: '1px solid rgba(255,255,255,0.06)' };
  const inputStyle = { width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#e2e8f0', fontSize: '14px', boxSizing: 'border-box' };

  return (
    <div style={{ padding: '24px', color: '#e2e8f0', minHeight: '100vh' }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: 'linear-gradient(135deg, #06b6d4, #22d3ee)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={28} color="#fff" />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '700' }}>Time Tracker</h1>
            <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Track your work hours efficiently</p>
          </div>
        </div>
        <button onClick={() => setShowAddModal(true)}
          style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', border: 'none', borderRadius: '14px', padding: '12px 28px', color: '#fff', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} /> Manual Entry
        </button>
      </motion.div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '24px' }}>
        {statCards.map((s, i) => (
          <div key={i} style={{ ...cardStyle, padding: '20px' }}>
            <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '8px' }}>{s.label}</div>
            <div style={{ fontSize: '26px', fontWeight: '700', color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '12px', color: '#475569', marginTop: '4px' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        {/* Timer */}
        <div style={{ ...cardStyle, textAlign: 'center' }}>
          <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(59,130,246,0.2))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', border: isRunning ? '3px solid #8b5cf6' : '3px solid rgba(255,255,255,0.1)', transition: 'border-color 0.3s' }}>
            <Clock size={44} style={{ color: isRunning ? '#8b5cf6' : '#64748b' }} />
          </div>
          <div style={{ fontSize: '48px', fontWeight: '700', fontFamily: 'monospace', letterSpacing: '4px', marginBottom: '20px', background: isRunning ? 'linear-gradient(135deg, #10b981, #34d399)' : 'linear-gradient(135deg, #e2e8f0, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {fmtTime(time)}
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px' }}>
            <input placeholder="What are you working on?" value={currentTask} onChange={e => setCurrentTask(e.target.value)}
              style={{ ...inputStyle, maxWidth: '240px', textAlign: 'center' }} />
            <select value={selectedProject} onChange={e => setSelectedProject(e.target.value)} style={{ ...inputStyle, maxWidth: '180px' }}>
              {PROJECTS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button onClick={() => setIsRunning(!isRunning)}
              style={{ padding: '14px 36px', borderRadius: '14px', border: 'none', background: isRunning ? 'linear-gradient(135deg, #f59e0b, #fbbf24)' : 'linear-gradient(135deg, #10b981, #34d399)', color: '#fff', fontSize: '15px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {isRunning ? <><Pause size={18} /> Pause</> : <><Play size={18} /> Start</>}
            </button>
            {(isRunning || time > 0) && (
              <button onClick={handleStop}
                style={{ padding: '14px 28px', borderRadius: '14px', border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.1)', color: '#ef4444', fontSize: '15px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Square size={18} /> Save & Stop
              </button>
            )}
          </div>
        </div>

        {/* Weekly Chart */}
        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 20px', fontSize: '18px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BarChart3 size={20} style={{ color: '#3b82f6' }} /> Weekly Hours
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weekChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} unit="h" />
              <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#e2e8f0' }}
                formatter={(val) => [`${val}h`, 'Hours']} />
              <Bar dataKey="hours" fill="url(#barGrad)" radius={[6, 6, 0, 0]} />
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Time Entries */}
      <div style={cardStyle}>
        <h3 style={{ margin: '0 0 20px', fontSize: '18px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Calendar size={20} style={{ color: '#a855f7' }} /> Recent Entries ({timeEntries.length})
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {timeEntries.slice(0, 12).map((entry, i) => (
            <div key={entry.id} className="stat-card-smooth"
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 18px', borderRadius: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', transition: 'transform 0.15s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
                  <Clock size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '14px' }}>{entry.task}</div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{entry.project} · {entry.date}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <span style={{ fontSize: '16px', fontWeight: '700', color: '#10b981', fontFamily: 'monospace' }}>{fmtDur(entry.seconds)}</span>
                <button onClick={() => deleteTimeEntry(entry.id)}
                  style={{ background: 'rgba(239,68,68,0.1)', border: 'none', borderRadius: '8px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#ef4444', transition: 'background 0.2s' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
          {timeEntries.length === 0 && <p style={{ color: '#64748b', textAlign: 'center', padding: '30px' }}>No entries yet. Start the timer or add a manual entry!</p>}
        </div>
      </div>

      {/* Manual Entry Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddModal(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <motion.div onClick={e => e.stopPropagation()} initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              style={{ ...cardStyle, width: '100%', maxWidth: '440px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h2 style={{ margin: 0, fontSize: '22px' }}>Add Manual Entry</h2>
                <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}><X size={20} /></button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <input placeholder="Task name" value={manualEntry.task} onChange={e => setManualEntry(p => ({ ...p, task: e.target.value }))} style={inputStyle} />
                <select value={manualEntry.project} onChange={e => setManualEntry(p => ({ ...p, project: e.target.value }))} style={inputStyle}>
                  {PROJECTS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                  <input type="number" min="0" placeholder="Hours" value={manualEntry.hours} onChange={e => setManualEntry(p => ({ ...p, hours: e.target.value }))} style={inputStyle} />
                  <input type="number" min="0" max="59" placeholder="Minutes" value={manualEntry.minutes} onChange={e => setManualEntry(p => ({ ...p, minutes: e.target.value }))} style={inputStyle} />
                  <input type="date" value={manualEntry.date} onChange={e => setManualEntry(p => ({ ...p, date: e.target.value }))} style={inputStyle} />
                </div>
                <button onClick={handleAddManual}
                  style={{ padding: '14px', borderRadius: '14px', border: 'none', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', color: '#fff', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>
                  <Save size={16} style={{ verticalAlign: 'middle', marginRight: '8px' }} /> Add Entry
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TimeTracker;