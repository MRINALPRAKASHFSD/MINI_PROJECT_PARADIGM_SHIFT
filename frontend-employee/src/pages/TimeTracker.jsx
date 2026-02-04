import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  Play, 
  Pause, 
  Square,
  Calendar,
  TrendingUp,
  Filter,
  Download,
  BarChart3
} from 'lucide-react';
import './TimeTracker.css';

const TimeTracker = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [currentTask, setCurrentTask] = useState('');

  const timeEntries = [
    {
      id: 1,
      task: 'Frontend Development',
      project: 'Employee Portal',
      duration: '3h 45m',
      date: '2025-01-10',
      status: 'completed'
    },
    {
      id: 2,
      task: 'Code Review',
      project: 'API Integration',
      duration: '1h 30m',
      date: '2025-01-10',
      status: 'completed'
    },
    {
      id: 3,
      task: 'Bug Fixes',
      project: 'Dashboard',
      duration: '2h 15m',
      date:  '2025-01-09',
      status: 'completed'
    },
    {
      id: 4,
      task: 'Team Meeting',
      project: 'Sprint Planning',
      duration: '1h 00m',
      date: '2025-01-09',
      status: 'completed'
    }
  ];

  const stats = [
    { label: 'Today', value: '5h 15m', color: '#3b82f6', change: '+15%' },
    { label:  'This Week', value: '32h 45m', color: '#10b981', change: '+8%' },
    { label:  'This Month', value: '128h 30m', color: '#a855f7', change: '+12%' },
    { label: 'Avg/Day', value: '6h 30m', color: '#f97316', change: '+5%' }
  ];

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartStop = () => {
    setIsRunning(!isRunning);
    if (!isRunning) {
      // Start timer logic
      const interval = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setCurrentTask('');
  };

  return (
    <div className="time-tracker-container dark">
      <div className="tracker-header">
        <div className="header-left">
          <motion.div 
            className="header-icon"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <Clock size={28} />
          </motion.div>
          <div>
            <h1>Time Tracker</h1>
            <p>Track your work hours efficiently</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="tracker-stats">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y:  0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
          >
            <div className="stat-info">
              <span className="stat-label">{stat.label}</span>
              <span className="stat-value" style={{ color: stat.color }}>{stat.value}</span>
            </div>
            <span className="stat-change">{stat.change}</span>
          </motion.div>
        ))}
      </div>

      {/* Active Timer */}
      <motion.div 
        className="active-timer-card"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale:  1, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="timer-display">
          <motion.div 
            className="timer-circle"
            animate={{ rotate: isRunning ? 360 : 0 }}
            transition={{ duration: 2, repeat: isRunning ? Infinity : 0, ease: 'linear' }}
          >
            <Clock size={48} />
          </motion.div>
          <h2 className="timer-time">{formatTime(time)}</h2>
          <input
            type="text"
            placeholder="What are you working on?"
            value={currentTask}
            onChange={(e) => setCurrentTask(e.target.value)}
            className="task-input"
          />
        </div>

        <div className="timer-controls">
          <motion.button
            className={`control-btn ${isRunning ? 'stop' : 'start'}`}
            onClick={handleStartStop}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isRunning ? <Pause size={24} /> : <Play size={24} />}
            {isRunning ? 'Pause' : 'Start'}
          </motion.button>
          <motion.button
            className="control-btn reset"
            onClick={handleReset}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Square size={24} />
            Reset
          </motion.button>
        </div>
      </motion.div>

      {/* Time Entries */}
      <div className="time-entries-section">
        <div className="section-header">
          <h3>Recent Time Entries</h3>
          <div className="header-actions">
            <button className="filter-btn">
              <Filter size={18} />
              Filter
            </button>
            <button className="export-btn">
              <Download size={18} />
              Export
            </button>
          </div>
        </div>

        <div className="entries-list">
          {timeEntries. map((entry, index) => (
            <motion.div
              key={entry. id}
              className="entry-card"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay:  0.3 + index * 0.1 }}
              whileHover={{ x: 5 }}
            >
              <div className="entry-main">
                <div className="entry-icon">
                  <Clock size={20} />
                </div>
                <div className="entry-details">
                  <h4>{entry.task}</h4>
                  <p className="entry-project">{entry.project}</p>
                </div>
              </div>
              <div className="entry-meta">
                <span className="entry-duration">{entry.duration}</span>
                <span className="entry-date">{entry.date}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimeTracker;