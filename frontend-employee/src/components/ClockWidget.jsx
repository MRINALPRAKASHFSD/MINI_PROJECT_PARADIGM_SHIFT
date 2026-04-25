import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Clock, Play, Square, Timer, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const ClockWidget = () => {
  const [status, setStatus] = useState('idle'); // idle, clocked_in, clocked_out
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [attendance, setAttendance] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    fetchTodayStatus();
    return () => clearInterval(timer);
  }, []);

  const fetchTodayStatus = async () => {
    try {
      const res = await api.get('/attendance/today');
      if (res.data.attendance) {
        setAttendance(res.data.attendance);
        if (res.data.attendance.checkOut) {
          setStatus('clocked_out');
        } else {
          setStatus('clocked_in');
        }
      } else {
        setStatus('idle');
      }
    } catch (err) {
      console.error('Error fetching attendance status', err);
    } finally {
      setInitialLoad(false);
    }
  };

  const handleClockIn = async () => {
    try {
      setLoading(true);
      const res = await api.post('/attendance/clock-in', {});
      if (res.data.attendance) {
        setAttendance(res.data.attendance);
        setStatus('clocked_in');
        toast.success('Shift started! Have a great day.');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to clock in');
    } finally {
      setLoading(false);
    }
  };

  const handleClockOut = async () => {
    try {
      setLoading(true);
      const res = await api.post('/attendance/clock-out', {});
      if (res.data.attendance) {
        setAttendance(res.data.attendance);
        setStatus('clocked_out');
        toast.success('Shift completed. Rest well!');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to clock out');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoad) {
    return (
      <div className="glass-panel" style={{ minHeight: '320px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="pulse" style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', boxShadow: '0 0 20px var(--primary-glow)' }} />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel attendance-widget pro-card"
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center',
        minHeight: '320px',
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
        padding: '32px',
        border: '1px solid rgba(255,255,255,0.1)',
        background: 'linear-gradient(135deg, rgba(30,41,59,0.4), rgba(15,23,42,0.6))',
        boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
        textAlign: 'center'
      }}
    >
      {/* Loading Overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'absolute', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <div className="pulse" style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', boxShadow: '0 0 20px var(--primary-glow)' }} />
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '150px', height: '150px', background: 'var(--primary-glow)', filter: 'blur(60px)', opacity: 0.2 }} />
      
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, flex: 1, justifyContent: 'center' }}>
        <div style={{ width: '52px', height: '52px', background: 'rgba(255,255,255,0.03)', borderRadius: '18px', border: '1px solid var(--border-glass)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px rgba(0,0,0,0.2)', marginBottom: '20px' }}>
          <Clock size={26} style={{ color: 'var(--primary)', filter: 'drop-shadow(0 0 8px var(--primary-glow))' }} />
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', justifyContent: 'center' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: status === 'clocked_in' ? '#10b981' : 'var(--primary)', boxShadow: status === 'clocked_in' ? '0 0 15px #10b981' : '0 0 10px var(--primary-glow)' }} />
          <span style={{ fontSize: '12px', fontWeight: '900', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
            {status === 'clocked_in' ? 'Shift Active' : status === 'clocked_out' ? 'System Standby' : 'Ready to Start'}
          </span>
        </div>

        <h2 style={{ fontSize: '42px', fontWeight: '900', margin: 0, letterSpacing: '-2px', color: '#fff', fontFamily: '"JetBrains Mono", monospace' }}>
          {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).split(' ')[0]}
          <span style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-muted)', marginLeft: '10px', verticalAlign: 'baseline', letterSpacing: '0' }}>
            {currentTime.toLocaleTimeString([], { second: '2-digit' })}
          </span>
        </h2>
        <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginTop: '6px', fontWeight: '600' }}>
          {currentTime.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'short' })}
        </p>
      </div>

      <div style={{ marginTop: '32px', zIndex: 1 }}>
        <AnimatePresence mode="wait">
          {status === 'idle' && (
            <motion.button
              key="clock-in"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={handleClockIn}
              disabled={loading}
              style={{ 
                width: '100%', 
                padding: '18px', 
                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                color: '#fff',
                border: 'none',
                borderRadius: '16px',
                fontSize: '16px',
                fontWeight: '800',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                cursor: 'pointer',
                boxShadow: '0 12px 30px var(--primary-glow)',
              }}
              whileHover={{ scale: 1.02, boxShadow: '0 20px 40px var(--primary-glow)' }}
              whileTap={{ scale: 0.98 }}
            >
              <Play size={18} fill="currentColor" strokeWidth={3} /> Start Shift
            </motion.button>
          )}

          {status === 'clocked_in' && (
            <motion.div
              key="clocked-in-area"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}
            >
              <div style={{ 
                display: 'flex', 
                gap: '24px', 
                alignItems: 'center', 
                padding: '12px 20px', 
                background: 'rgba(16,185,129,0.05)', 
                border: '1px solid rgba(16,185,129,0.15)', 
                borderRadius: '16px' 
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div className="pulse" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
                  <span style={{ fontSize: '13px', fontWeight: '800', color: '#10b981' }}>Live Session</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                  <Timer size={14} />
                  <span style={{ fontSize: '12px', fontWeight: '700' }}>In: {attendance?.checkIn}</span>
                </div>
              </div>
              <motion.button
                onClick={handleClockOut}
                disabled={loading}
                style={{ 
                  width: '100%', 
                  padding: '18px', 
                  background: 'rgba(244,63,94,0.05)',
                  color: '#f43f5e',
                  border: '1px solid rgba(244,63,94,0.15)',
                  borderRadius: '16px',
                  fontSize: '16px',
                  fontWeight: '800',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                }}
                whileHover={{ background: 'rgba(244,63,94,0.1)', borderColor: 'rgba(244,63,94,0.3)', scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Square size={18} fill="currentColor" /> End Shift
              </motion.button>
            </motion.div>
          )}

          {status === 'clocked_out' && (
            <motion.div
              key="clocked-out"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ 
                background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(16,185,129,0.05))', 
                border: '1px solid rgba(16,185,129,0.2)', 
                borderRadius: '16px', 
                padding: '20px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '16px',
                width: '100%'
              }}
            >
              <div style={{ width: '48px', height: '48px', background: '#10b981', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px rgba(16,185,129,0.3)', flexShrink: 0 }}>
                <CheckCircle size={24} color="#fff" strokeWidth={3} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <p style={{ margin: 0, fontWeight: '800', color: '#fff', fontSize: '16px' }}>Mission Complete</p>
                <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#10b981', fontWeight: '700' }}>
                  <Sparkles size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                  {attendance?.hoursWorked?.toFixed(2) || '0.00'} Hours Logged
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ClockWidget;
