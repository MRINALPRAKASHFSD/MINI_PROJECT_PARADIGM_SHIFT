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
      className="relative overflow-hidden bg-slate-900/60 backdrop-blur-xl rounded-[24px] p-6 text-white shadow-2xl border border-white/10 flex flex-col justify-between"
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Daily Attendance</p>
          </div>
          <h2 className="text-4xl font-black tracking-tight text-slate-100">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            <span className="text-sm font-medium text-slate-500 ml-2">
              {currentTime.toLocaleTimeString([], { second: '2-digit' })}
            </span>
          </h2>
          <p className="text-sm font-semibold text-slate-500 mt-1">
            {currentTime.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
          <Clock className="w-6 h-6 text-indigo-400" />
        </div>
      </div>

      <div className="mt-8">
        <AnimatePresence mode="wait">
          {status === 'idle' && (
            <motion.button
              key="clock-in"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onClick={handleClockIn}
              disabled={loading}
              className="group relative w-full py-4 bg-white text-slate-900 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-100 transition-all shadow-[0_10px_20px_-5px_rgba(255,255,255,0.2)] active:scale-95 disabled:opacity-50 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <Play className="w-5 h-5 fill-current text-indigo-600" />
              <span className="tracking-tight">Clock In for Today</span>
            </motion.button>
          )}

          {status === 'clocked_in' && (
            <motion.div
              key="clocked-in-area"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between px-4 py-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                <div className="flex items-center gap-2">
                  <Timer className="w-4 h-4 text-indigo-400" />
                  <span className="text-sm font-medium text-indigo-200">Session Active</span>
                </div>
                <span className="text-xs font-bold text-slate-400">Since {attendance?.checkIn}</span>
              </div>
              <button
                onClick={handleClockOut}
                disabled={loading}
                className="w-full py-4 bg-rose-500 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-rose-600 transition-all shadow-[0_10px_20px_-5px_rgba(244,63,94,0.3)] active:scale-95 disabled:opacity-50"
              >
                <Square className="w-5 h-5 fill-current" />
                <span className="tracking-tight">Clock Out</span>
              </button>
            </motion.div>
          )}

          {status === 'clocked_out' && (
            <motion.div
              key="clocked-out"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5 flex items-center gap-4"
            >
              <div className="p-3 bg-emerald-500 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-slate-100">Shift Completed</p>
                <p className="text-sm font-medium text-emerald-400/80">{attendance?.hoursWorked.toFixed(2)} Hours Logged</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
    </motion.div>
  );
};

export default ClockWidget;
