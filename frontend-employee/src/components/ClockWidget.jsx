import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Clock, Play, Square, Timer, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const ClockWidget = () => {
  const [status, setStatus] = useState('idle'); // idle, clocked_in, clocked_out
  const [loading, setLoading] = useState(true);
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
      setLoading(false);
    }
  };

  const handleClockIn = async () => {
    try {
      setLoading(true);
      const res = await api.post('/attendance/clock-in', {});
      setAttendance(res.data.attendance);
      setStatus('clocked_in');
      toast.success('Clocked in successfully!');
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
      setAttendance(res.data.attendance);
      setStatus('clocked_out');
      toast.success('Clocked out successfully!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to clock out');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !attendance) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 animate-pulse h-40" />
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-xl border border-white/10"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-indigo-100 text-sm font-medium">Daily Attendance</p>
          <h2 className="text-3xl font-bold tracking-tight">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </h2>
          <p className="text-xs text-indigo-200 mt-1">
            {currentTime.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'short' })}
          </p>
        </div>
        <div className="p-2 bg-white/10 rounded-xl">
          <Clock className="w-6 h-6 text-indigo-100" />
        </div>
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="wait">
          {status === 'idle' && (
            <motion.button
              key="clock-in"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={handleClockIn}
              disabled={loading}
              className="w-full py-3 bg-white text-indigo-600 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-50 transition-colors shadow-lg active:scale-95 disabled:opacity-50"
            >
              <Play className="w-5 h-5 fill-current" />
              Clock In
            </motion.button>
          )}

          {status === 'clocked_in' && (
            <motion.div
              key="clocked-in-area"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-3"
            >
              <div className="flex items-center gap-2 text-sm text-indigo-100 bg-white/10 p-2 rounded-lg">
                <Timer className="w-4 h-4" />
                <span>Started at {attendance?.checkIn}</span>
              </div>
              <button
                onClick={handleClockOut}
                disabled={loading}
                className="w-full py-3 bg-rose-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-rose-600 transition-colors shadow-lg active:scale-95 disabled:opacity-50"
              >
                <Square className="w-5 h-5 fill-current" />
                Clock Out
              </button>
            </motion.div>
          )}

          {status === 'clocked_out' && (
            <motion.div
              key="clocked-out"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-emerald-500/20 border border-emerald-500/30 rounded-xl p-4 flex items-center gap-3"
            >
              <div className="p-2 bg-emerald-500 rounded-full">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-sm">Shift Completed</p>
                <p className="text-xs text-emerald-100">{attendance?.hoursWorked.toFixed(2)} Hours Worked today</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Decorative background circle */}
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
    </motion.div>
  );
};

export default ClockWidget;
