import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDataStore } from '../store/dataStore';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { 
  Clock, Play, Pause, Square, Calendar, 
  Plus, Trash2, X, Save, BarChart3, 
  Activity, Zap, Info, ArrowUpRight, Timer
} from 'lucide-react';

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

  // Weekly chart data
  const weekChart = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const hours = timeEntries.filter(e => e.date === dateStr).reduce((s, e) => s + e.seconds, 0) / 3600;
    return { day: d.toLocaleDateString('en-IN', { weekday: 'short' }), hours: Math.round(hours * 10) / 10 };
  });

  const statCards = [
    { label: 'Today', value: fmtDur(todaySec), sub: todaySec > 28800 ? 'Over target!' : `${fmtDur(Math.max(0, 28800 - todaySec))} left`, color: 'var(--primary)' },
    { label: 'This Week', value: fmtDur(weekSec), sub: `${timeEntries.length} entries`, color: 'var(--secondary)' },
    { label: 'Entries', value: timeEntries.length, sub: `${timeEntries.filter(e => e.date === todayStr).length} today`, color: '#a855f7' },
    { label: 'Avg/Day', value: fmtDur(avgPerDay), sub: 'Last 7 days', color: '#10b981' },
  ];

  return (
    <div style={{ padding: '24px', minHeight: '100vh', position: 'relative' }}>
      {/* Background Ambient Glows */}
      <div className="ambient-glow" style={{ top: '15%', left: '10%', background: 'var(--primary-glow)', width: '380px', height: '380px' }} />
      <div className="ambient-glow" style={{ bottom: '5%', right: '15%', background: 'var(--secondary-glow)', width: '420px', height: '420px' }} />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '20px', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} style={{ width: '64px', height: '64px', borderRadius: '20px', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 12px 25px var(--primary-glow)' }}>
            <Timer size={32} color="#fff" />
          </motion.div>
          <div>
            <h1 style={{ margin: 0, fontSize: '34px', fontWeight: '800', letterSpacing: '-1px' }}>Time Pulse</h1>
            <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontSize: '15px', fontWeight: '500' }}>Precision tracking for your professional output</p>
          </div>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05, boxShadow: '0 12px 30px var(--primary-glow)' }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddModal(true)}
          style={{ background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '18px', padding: '14px 32px', fontSize: '15px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
        >
          <Plus size={20} strokeWidth={3} /> Add Manual Log
        </motion.button>
      </div>

      {/* Stats Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        {statCards.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}
            className="glass-panel stat-card-smooth" style={{ padding: '24px', borderRadius: '28px', border: '1px solid var(--border-glass)' }}>
            <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '12px' }}>{s.label}</div>
            <div style={{ fontSize: '32px', fontWeight: '900', color: s.color, letterSpacing: '-1px' }}>{s.value}</div>
            <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', marginTop: '6px' }}>{s.sub}</div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px', marginBottom: '24px' }}>
        {/* Timer Control Center */}
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel" 
          style={{ borderRadius: '36px', padding: '48px', border: '1px solid var(--border-glass)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', background: isRunning ? 'radial-gradient(circle at 50% 50%, rgba(79,70,229,0.05), transparent)' : 'none', pointerEvents: 'none' }} />
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.03)', padding: '12px 24px', borderRadius: '20px', border: '1px solid var(--border-glass)', marginBottom: '40px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: isRunning ? '#10b981' : 'var(--text-muted)', boxShadow: isRunning ? '0 0 10px #10b981' : 'none' }} />
              <span style={{ fontSize: '14px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-primary)' }}>{isRunning ? 'Session Active' : 'System Idle'}</span>
            </div>

            <div style={{ fontSize: '84px', fontWeight: '900', fontFamily: '"JetBrains Mono", monospace', letterSpacing: '8px', marginBottom: '40px', color: 'var(--text-primary)', textShadow: isRunning ? '0 0 30px var(--primary-glow)' : 'none', transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}>
              {fmtTime(time)}
            </div>

            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '40px', maxWidth: '500px', margin: '0 auto 40px' }}>
              <input 
                placeholder="Target Task..." 
                value={currentTask} 
                onChange={e => setCurrentTask(e.target.value)}
                style={{ flex: 1.5, padding: '18px 24px', borderRadius: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', color: '#fff', fontSize: '15px', fontWeight: '700', outline: 'none' }} 
              />
              <select 
                value={selectedProject} 
                onChange={e => setSelectedProject(e.target.value)} 
                style={{ flex: 1, padding: '18px 24px', borderRadius: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', color: '#fff', fontSize: '15px', fontWeight: '700', outline: 'none', cursor: 'pointer' }}
              >
                {PROJECTS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
              <motion.button 
                whileHover={{ scale: 1.05, boxShadow: isRunning ? '0 12px 30px rgba(245,158,11,0.3)' : '0 12px 30px rgba(16,185,129,0.3)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsRunning(!isRunning)}
                style={{ padding: '20px 48px', borderRadius: '24px', border: 'none', background: isRunning ? 'linear-gradient(135deg, #f59e0b, #fbbf24)' : 'linear-gradient(135deg, #10b981, #34d399)', color: '#fff', fontSize: '18px', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}
              >
                {isRunning ? <><Pause size={24} strokeWidth={3} /> Pause Session</> : <><Play size={24} strokeWidth={3} /> Ignite Timer</>}
              </motion.button>
              {(isRunning || time > 0) && (
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleStop}
                  style={{ padding: '20px 32px', borderRadius: '24px', border: '1px solid var(--border-glass)', background: 'rgba(239,68,68,0.1)', color: '#f43f5e', fontSize: '18px', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}
                >
                  <Square size={24} strokeWidth={3} /> Terminate
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Weekly Chart */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-panel" style={{ borderRadius: '36px', padding: '36px', border: '1px solid var(--border-glass)' }}>
          <h3 style={{ margin: '0 0 32px', fontSize: '20px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <BarChart3 size={24} color="var(--primary)" /> Intensity Report
          </h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: 'var(--text-muted)', fontSize: 12, fontWeight: '700' }} axisLine={false} tickLine={false} dy={15} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12, fontWeight: '700' }} axisLine={false} tickLine={false} unit="h" dx={-10} />
                <Tooltip contentStyle={{ background: 'var(--surface-panel)', border: '1px solid var(--border-glass)', borderRadius: '20px', backdropFilter: 'blur(30px)' }}
                  formatter={(val) => [`${val}h`, 'Efficiency']} />
                <Bar dataKey="hours" radius={[12, 12, 0, 0]} barSize={32}>
                  {weekChart.map((_, i) => <Cell key={i} fill={i === 6 ? 'var(--primary)' : 'var(--secondary)'} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ marginTop: '32px', padding: '24px', borderRadius: '24px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)' }}>
            <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}><Zap size={18} color="var(--primary)" /> Peak Performance</div>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600', lineHeight: '1.6' }}>You log 22% more hours on Thursdays compared to the weekly average.</p>
          </div>
        </motion.div>
      </div>

      {/* Recent History */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel" style={{ borderRadius: '36px', padding: '36px', border: '1px solid var(--border-glass)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Calendar size={24} color="var(--primary)" /> Timeline Ledger
          </h3>
          <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.03)', padding: '8px 20px', borderRadius: '16px' }}>Showing {timeEntries.length} Records</span>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '16px' }}>
          {timeEntries.slice(0, 12).map((entry, i) => (
            <motion.div key={entry.id} whileHover={{ y: -4 }} 
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderRadius: '24px', background: 'rgba(255,255,255,0.015)', border: '1px solid var(--border-glass)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'rgba(79,70,229,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                  <Clock size={24} strokeWidth={2.5} />
                </div>
                <div>
                  <div style={{ fontWeight: '800', fontSize: '15px' }}>{entry.task}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600', marginTop: '2px' }}>{entry.project} · {entry.date}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <span style={{ fontSize: '18px', fontWeight: '900', color: '#10b981', fontFamily: '"JetBrains Mono", monospace' }}>{fmtDur(entry.seconds)}</span>
                <motion.button 
                  whileHover={{ scale: 1.1, background: 'rgba(239,68,68,0.2)' }}
                  onClick={() => deleteTimeEntry(entry.id)}
                  style={{ background: 'rgba(239,68,68,0.1)', border: 'none', borderRadius: '12px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#f43f5e' }}
                >
                  <Trash2 size={16} />
                </motion.button>
              </div>
            </motion.div>
          ))}
          {timeEntries.length === 0 && (
            <div style={{ gridColumn: '1 / -1', padding: '80px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Timer size={64} style={{ opacity: 0.1, marginBottom: '24px' }} />
              <p style={{ fontSize: '18px', fontWeight: '700' }}>Chronicle is empty. Start your first session!</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Manual Entry Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddModal(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
            <motion.div onClick={e => e.stopPropagation()} initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="glass-panel" style={{ width: '100%', maxWidth: '480px', padding: '40px', borderRadius: '40px', border: '1px solid var(--border-glass)', boxShadow: '0 30px 100px rgba(0,0,0,0.6)' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'rgba(79,70,229,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Plus size={24} color="var(--primary)" /></div>
                  <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '900' }}>Chronicle Log</h2>
                </div>
                <button onClick={() => setShowAddModal(false)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={24} /></button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '800', display: 'block', marginBottom: '10px' }}>What did you build?</label>
                  <input placeholder="Feature name or bug ID" value={manualEntry.task} onChange={e => setManualEntry(p => ({ ...p, task: e.target.value }))} 
                    style={{ width: '100%', padding: '16px', borderRadius: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', color: '#fff', fontSize: '15px', fontWeight: '600', outline: 'none' }} />
                </div>
                
                <div>
                  <label style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '800', display: 'block', marginBottom: '10px' }}>Target Project</label>
                  <select value={manualEntry.project} onChange={e => setManualEntry(p => ({ ...p, project: e.target.value }))} 
                    style={{ width: '100%', padding: '16px', borderRadius: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', color: '#fff', fontSize: '15px', fontWeight: '600', outline: 'none', cursor: 'pointer' }}>
                    {PROJECTS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '800', display: 'block', marginBottom: '10px' }}>Duration</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input type="number" min="0" placeholder="Hrs" value={manualEntry.hours} onChange={e => setManualEntry(p => ({ ...p, hours: e.target.value }))} 
                        style={{ width: '100%', padding: '16px', borderRadius: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', color: '#fff', fontSize: '15px', fontWeight: '600', outline: 'none' }} />
                      <input type="number" min="0" max="59" placeholder="Min" value={manualEntry.minutes} onChange={e => setManualEntry(p => ({ ...p, minutes: e.target.value }))} 
                        style={{ width: '100%', padding: '16px', borderRadius: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', color: '#fff', fontSize: '15px', fontWeight: '600', outline: 'none' }} />
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '800', display: 'block', marginBottom: '10px' }}>Log Date</label>
                    <input type="date" value={manualEntry.date} onChange={e => setManualEntry(p => ({ ...p, date: e.target.value }))} 
                      style={{ width: '100%', padding: '16px', borderRadius: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', color: '#fff', fontSize: '15px', fontWeight: '600', outline: 'none' }} />
                  </div>
                </div>

                <motion.button 
                  whileHover={{ scale: 1.02, boxShadow: '0 12px 30px var(--primary-glow)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddManual}
                  style={{ width: '100%', padding: '20px', borderRadius: '20px', border: 'none', background: 'var(--primary)', color: '#fff', fontSize: '16px', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginTop: '12px' }}>
                  <Save size={20} strokeWidth={3} /> Record Entry
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TimeTracker;