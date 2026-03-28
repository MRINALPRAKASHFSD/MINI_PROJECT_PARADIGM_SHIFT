import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Play, Pause, Square, Calendar, TrendingUp, Filter, Download, BarChart3, Plus, Trash2, X, Save } from 'lucide-react';
import './TimeTracker.css';

const PROJECTS = ['Employee Portal', 'API Integration', 'Dashboard Redesign', 'Payment Module', 'Mobile App', 'Documentation'];

const TimeTracker = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [currentTask, setCurrentTask] = useState('');
  const [selectedProject, setSelectedProject] = useState('Employee Portal');
  const [showAddModal, setShowAddModal] = useState(false);
  const [manualEntry, setManualEntry] = useState({ task: '', project: 'Employee Portal', hours: '', minutes: '', date: new Date().toISOString().split('T')[0] });
  const intervalRef = useRef(null);

  const [timeEntries, setTimeEntries] = useState([
    { id: 1, task: 'Frontend Development', project: 'Employee Portal', duration: '3h 45m', seconds: 13500, date: '2026-03-28', status: 'completed' },
    { id: 2, task: 'Code Review', project: 'API Integration', duration: '1h 30m', seconds: 5400, date: '2026-03-28', status: 'completed' },
    { id: 3, task: 'Bug Fixes - Login Flow', project: 'Dashboard Redesign', duration: '2h 15m', seconds: 8100, date: '2026-03-27', status: 'completed' },
    { id: 4, task: 'Sprint Planning Meeting', project: 'Employee Portal', duration: '1h 00m', seconds: 3600, date: '2026-03-27', status: 'completed' },
    { id: 5, task: 'Database Optimization', project: 'API Integration', duration: '2h 30m', seconds: 9000, date: '2026-03-26', status: 'completed' },
    { id: 6, task: 'UI Testing', project: 'Mobile App', duration: '1h 45m', seconds: 6300, date: '2026-03-26', status: 'completed' },
  ]);

  // Actual working timer
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDuration = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
  };

  const handleStartStop = () => setIsRunning(!isRunning);

  const handleStop = () => {
    if (time > 0) {
      const entry = {
        id: Date.now(),
        task: currentTask || 'Untitled Task',
        project: selectedProject,
        duration: formatDuration(time),
        seconds: time,
        date: new Date().toISOString().split('T')[0],
        status: 'completed'
      };
      setTimeEntries(prev => [entry, ...prev]);
    }
    setIsRunning(false);
    setTime(0);
    setCurrentTask('');
  };

  const handleAddManual = () => {
    if (!manualEntry.task.trim()) return;
    const totalSeconds = (parseInt(manualEntry.hours || 0) * 3600) + (parseInt(manualEntry.minutes || 0) * 60);
    if (totalSeconds === 0) return;
    const entry = {
      id: Date.now(),
      task: manualEntry.task,
      project: manualEntry.project,
      duration: formatDuration(totalSeconds),
      seconds: totalSeconds,
      date: manualEntry.date,
      status: 'completed'
    };
    setTimeEntries(prev => [entry, ...prev]);
    setShowAddModal(false);
    setManualEntry({ task: '', project: 'Employee Portal', hours: '', minutes: '', date: new Date().toISOString().split('T')[0] });
  };

  const handleDeleteEntry = (id) => setTimeEntries(prev => prev.filter(e => e.id !== id));

  const todaySeconds = timeEntries.filter(e => e.date === new Date().toISOString().split('T')[0]).reduce((sum, e) => sum + e.seconds, 0) + (isRunning ? time : 0);
  const weekSeconds = timeEntries.reduce((sum, e) => sum + e.seconds, 0) + (isRunning ? time : 0);

  const stats = [
    { label: 'Today', value: formatDuration(todaySeconds), color: '#3b82f6', change: '+15%' },
    { label: 'This Week', value: formatDuration(weekSeconds), color: '#10b981', change: '+8%' },
    { label: 'Entries', value: timeEntries.length.toString(), color: '#a855f7', change: `+${timeEntries.filter(e => e.date === new Date().toISOString().split('T')[0]).length}` },
    { label: 'Avg/Day', value: formatDuration(Math.round(weekSeconds / 7)), color: '#f97316', change: '+5%' }
  ];

  const inputStyle = { width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#e2e8f0', fontSize: '14px', outline: 'none', boxSizing: 'border-box' };
  const selectStyle = { ...inputStyle, background: 'rgba(15,23,42,0.9)' };

  return (
    <div className="time-tracker-container dark">
      <div className="tracker-header">
        <div className="header-left">
          <motion.div className="header-icon" whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}><Clock size={28} /></motion.div>
          <div><h1>Time Tracker</h1><p>Track your work hours efficiently</p></div>
        </div>
        <motion.button className="btn-primary" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowAddModal(true)} style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', border: 'none', borderRadius: '14px', padding: '12px 24px', color: '#fff', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={20} /> Add Manual Entry
        </motion.button>
      </div>

      <div className="tracker-stats">
        {stats.map((stat, i) => (
          <motion.div key={i} className="stat-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} whileHover={{ y: -5 }}>
            <div className="stat-info"><span className="stat-label">{stat.label}</span><span className="stat-value" style={{ color: stat.color }}>{stat.value}</span></div>
            <span className="stat-change">{stat.change}</span>
          </motion.div>
        ))}
      </div>

      {/* Active Timer */}
      <motion.div className="active-timer-card" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }}>
        <div className="timer-display">
          <motion.div className="timer-circle" animate={{ rotate: isRunning ? 360 : 0 }} transition={{ duration: 2, repeat: isRunning ? Infinity : 0, ease: 'linear' }}><Clock size={48} /></motion.div>
          <h2 className="timer-time" style={{ fontFamily: 'monospace', letterSpacing: '4px', color: isRunning ? '#10b981' : '#e2e8f0' }}>{formatTime(time)}</h2>
          <div style={{ display: 'flex', gap: '12px', width: '100%', maxWidth: '500px' }}>
            <input type="text" placeholder="What are you working on?" value={currentTask} onChange={e => setCurrentTask(e.target.value)} className="task-input" style={{ flex: 1 }} />
            <select value={selectedProject} onChange={e => setSelectedProject(e.target.value)} style={{ padding: '10px 14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(15,23,42,0.8)', color: '#e2e8f0', fontSize: '13px', cursor: 'pointer', outline: 'none' }}>
              {PROJECTS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>
        <div className="timer-controls">
          <motion.button className={`control-btn ${isRunning ? 'stop' : 'start'}`} onClick={handleStartStop} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            {isRunning ? <Pause size={24} /> : <Play size={24} />}{isRunning ? 'Pause' : 'Start'}
          </motion.button>
          <motion.button className="control-btn reset" onClick={handleStop} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} disabled={time === 0 && !isRunning}>
            <Square size={24} /> {time > 0 ? 'Save & Stop' : 'Reset'}
          </motion.button>
        </div>
      </motion.div>

      {/* Time Entries */}
      <div className="time-entries-section">
        <div className="section-header">
          <h3>Recent Time Entries ({timeEntries.length})</h3>
          <div className="header-actions">
            <button className="export-btn"><Download size={18} /> Export CSV</button>
          </div>
        </div>
        <div className="entries-list">
          {timeEntries.map((entry, i) => (
            <motion.div key={entry.id} className="entry-card" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.05 }} whileHover={{ x: 5 }}>
              <div className="entry-main">
                <div className="entry-icon"><Clock size={20} /></div>
                <div className="entry-details"><h4>{entry.task}</h4><p className="entry-project">{entry.project}</p></div>
              </div>
              <div className="entry-meta" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span className="entry-duration">{entry.duration}</span>
                <span className="entry-date">{new Date(entry.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleDeleteEntry(entry.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}><Trash2 size={16} /></motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Add Manual Entry Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddModal(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(8px)' }}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9 }} onClick={e => e.stopPropagation()}
              style={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '480px', color: '#e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h2 style={{ margin: 0 }}>Add Manual Entry</h2>
                <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}><X size={24} /></button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div><label style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '6px', display: 'block' }}>Task Name *</label><input value={manualEntry.task} onChange={e => setManualEntry({ ...manualEntry, task: e.target.value })} placeholder="What did you work on?" style={inputStyle} /></div>
                <div><label style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '6px', display: 'block' }}>Project</label><select value={manualEntry.project} onChange={e => setManualEntry({ ...manualEntry, project: e.target.value })} style={selectStyle}>{PROJECTS.map(p => <option key={p} value={p}>{p}</option>)}</select></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  <div><label style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '6px', display: 'block' }}>Hours</label><input type="number" min="0" max="24" value={manualEntry.hours} onChange={e => setManualEntry({ ...manualEntry, hours: e.target.value })} placeholder="0" style={inputStyle} /></div>
                  <div><label style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '6px', display: 'block' }}>Minutes</label><input type="number" min="0" max="59" value={manualEntry.minutes} onChange={e => setManualEntry({ ...manualEntry, minutes: e.target.value })} placeholder="0" style={inputStyle} /></div>
                  <div><label style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '6px', display: 'block' }}>Date</label><input type="date" value={manualEntry.date} onChange={e => setManualEntry({ ...manualEntry, date: e.target.value })} style={inputStyle} /></div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <motion.button whileHover={{ scale: 1.02 }} onClick={() => setShowAddModal(false)} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>Cancel</motion.button>
                <motion.button whileHover={{ scale: 1.02 }} onClick={handleAddManual} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', color: '#fff', cursor: 'pointer', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}><Save size={16} /> Save Entry</motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TimeTracker;