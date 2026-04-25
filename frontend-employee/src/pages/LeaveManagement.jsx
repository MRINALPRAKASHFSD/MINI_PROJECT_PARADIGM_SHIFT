import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  Send, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  History, 
  Plus,
  Info,
  ChevronRight,
  TrendingUp,
  FileText,
  X
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

const LeaveManagement = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [balances, setBalances] = useState({
    casual: 12,
    earned: 18,
    sick: 7,
    unpaid: 0
  });

  const [form, setForm] = useState({
    type: 'casual',
    startDate: '',
    endDate: '',
    reason: ''
  });

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const res = await api.get('/leaves/my-requests');
      setLeaves(res.data.leaves || []);
    } catch (err) {
      console.error('Error fetching leaves', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post('/leaves/request', form);
      toast.success('Request sent to HQ. Monitoring approval...');
      setShowModal(false);
      fetchLeaves();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Uplink failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return '#10b981';
      case 'rejected': return '#f43f5e';
      default: return 'var(--primary)';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto', color: '#fff' }}
    >
      <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <Calendar size={20} style={{ color: 'var(--primary)', filter: 'drop-shadow(0 0 8px var(--primary-glow))' }} />
            <span style={{ color: 'var(--primary)', fontWeight: '900', letterSpacing: '2px', fontSize: '12px', textTransform: 'uppercase' }}>Time-Off Terminal</span>
          </div>
          <h1 style={{ fontSize: '48px', fontWeight: '900', margin: 0, letterSpacing: '-2px' }}>Leave <span className="text-glow">Management</span></h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '16px', marginTop: '10px', fontWeight: '600' }}>Monitor your mission downtime and request rest cycles.</p>
        </div>
        
        <motion.button 
          whileHover={{ scale: 1.05, boxShadow: '0 0 20px var(--primary-glow)' }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowModal(true)}
          style={{
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            color: '#fff',
            border: 'none',
            padding: '16px 32px',
            borderRadius: '16px',
            fontWeight: '900',
            fontSize: '15px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            boxShadow: '0 10px 25px var(--primary-glow)'
          }}
        >
          <Plus size={20} strokeWidth={3} /> NEW REQUEST
        </motion.button>
      </header>

      {/* Balance Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '24px', 
        marginBottom: '48px' 
      }}>
        {Object.entries(balances).map(([key, val], idx) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-panel"
            style={{ 
              padding: '32px', 
              position: 'relative', 
              overflow: 'hidden',
              border: '1px solid var(--border-glass)',
              background: 'rgba(255,255,255,0.02)'
            }}
          >
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', background: 'var(--primary-glow)', filter: 'blur(40px)', opacity: 0.1 }} />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>{key} Leaves</p>
                <h3 style={{ fontSize: '42px', fontWeight: '900', margin: '8px 0 0', fontFamily: '"JetBrains Mono", monospace' }}>{val}</h3>
              </div>
              <div style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '14px', border: '1px solid var(--border-glass)' }}>
                <Clock size={24} style={{ color: idx % 2 === 0 ? 'var(--primary)' : 'var(--secondary)' }} />
              </div>
            </div>
            
            <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981' }}>
              <TrendingUp size={14} />
              <span style={{ fontSize: '13px', fontWeight: '700' }}>Standard allocation active</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* History Table */}
      <div className="glass-panel" style={{ padding: '32px', border: '1px solid var(--border-glass)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '32px' }}>
          <History size={24} style={{ color: 'var(--primary)' }} />
          <h3 style={{ fontSize: '20px', fontWeight: '900', margin: 0 }}>Request <span className="text-glow">History</span></h3>
        </div>

        {loading ? (
          <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="pulse" style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)' }} />
          </div>
        ) : leaves.length === 0 ? (
          <div style={{ height: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px dashed var(--border-glass)' }}>
            <Info size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
            <p style={{ color: 'var(--text-muted)', fontWeight: '700' }}>No active rest cycles detected in your logs.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 12px' }}>
              <thead>
                <tr style={{ textAlign: 'left', color: 'var(--text-muted)', fontSize: '13px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                  <th style={{ padding: '0 20px 10px' }}>Type</th>
                  <th style={{ padding: '0 20px 10px' }}>Duration</th>
                  <th style={{ padding: '0 20px 10px' }}>Reason</th>
                  <th style={{ padding: '0 20px 10px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map((leave) => (
                  <motion.tr 
                    key={leave._id}
                    whileHover={{ scale: 1.005, background: 'rgba(255,255,255,0.03)' }}
                    style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '16px', transition: 'all 0.3s' }}
                  >
                    <td style={{ padding: '24px 20px', borderRadius: '16px 0 0 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-glass)' }}>
                          <FileText size={18} style={{ color: 'var(--primary)' }} />
                        </div>
                        <span style={{ fontWeight: '800', textTransform: 'capitalize' }}>{leave.type}</span>
                      </div>
                    </td>
                    <td style={{ padding: '24px 20px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontWeight: '800', fontSize: '15px' }}>{new Date(leave.startDate).toLocaleDateString()}</span>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700' }}>to {new Date(leave.endDate).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td style={{ padding: '24px 20px', color: 'var(--text-secondary)', fontWeight: '600', maxWidth: '300px' }}>
                      {leave.reason}
                    </td>
                    <td style={{ padding: '24px 20px', borderRadius: '0 16px 16px 0' }}>
                      <div style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '8px', 
                        padding: '8px 16px', 
                        background: `${getStatusColor(leave.status)}10`, 
                        color: getStatusColor(leave.status),
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '900',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        border: `1px solid ${getStatusColor(leave.status)}30`
                      }}>
                        {leave.status === 'approved' && <CheckCircle size={14} />}
                        {leave.status === 'rejected' && <XCircle size={14} />}
                        {leave.status === 'pending' && <Clock size={14} />}
                        {leave.status}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Request Modal */}
      <AnimatePresence>
        {showModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              style={{ position: 'absolute', inset: 0, background: 'rgba(2,6,23,0.85)', backdropFilter: 'blur(12px)' }} 
            />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 40 }}
              className="glass-panel"
              style={{ 
                width: '100%', 
                maxWidth: '600px', 
                padding: '48px', 
                position: 'relative', 
                zIndex: 2001,
                border: '1px solid var(--border-glass)',
                boxShadow: '0 25px 80px rgba(0,0,0,0.6)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h2 style={{ fontSize: '32px', fontWeight: '900', margin: 0, letterSpacing: '-1px' }}>New Request</h2>
                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  <X size={24} />
                </button>
              </div>
              <p style={{ color: 'var(--text-muted)', marginBottom: '40px', fontWeight: '600' }}>Enter your mission downtime parameters.</p>
              
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div className="input-group">
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '900', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '1px' }}>Start Date</label>
                    <input 
                      type="date" 
                      required
                      value={form.startDate}
                      onChange={(e) => setForm({...form, startDate: e.target.value})}
                      style={{ width: '100%', padding: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', borderRadius: '12px', color: '#fff', fontSize: '15px' }} 
                    />
                  </div>
                  <div className="input-group">
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '900', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '1px' }}>End Date</label>
                    <input 
                      type="date" 
                      required
                      value={form.endDate}
                      onChange={(e) => setForm({...form, endDate: e.target.value})}
                      style={{ width: '100%', padding: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', borderRadius: '12px', color: '#fff', fontSize: '15px' }} 
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '900', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '1px' }}>Leave Category</label>
                  <select 
                    value={form.type}
                    onChange={(e) => setForm({...form, type: e.target.value})}
                    style={{ width: '100%', padding: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', borderRadius: '12px', color: '#fff', fontSize: '15px', appearance: 'none', cursor: 'pointer' }}
                  >
                    <option value="casual">Casual Leave</option>
                    <option value="earned">Earned Leave</option>
                    <option value="sick">Sick Leave</option>
                    <option value="unpaid">Unpaid Leave</option>
                  </select>
                </div>

                <div className="input-group">
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '900', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '1px' }}>Mission Reason</label>
                  <textarea 
                    placeholder="Briefly explain the necessity for this downtime..."
                    required
                    value={form.reason}
                    onChange={(e) => setForm({...form, reason: e.target.value})}
                    style={{ width: '100%', height: '120px', padding: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', borderRadius: '12px', color: '#fff', fontSize: '15px', resize: 'none' }} 
                  />
                </div>

                <div style={{ display: 'flex', gap: '16px', marginTop: '20px' }}>
                  <motion.button 
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{ flex: 1, padding: '18px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '16px', fontWeight: '900', fontSize: '16px', cursor: 'pointer', boxShadow: '0 10px 30px var(--primary-glow)' }}
                  >
                    {loading ? 'Transmitting...' : 'INITIATE UPLINK'}
                  </motion.button>
                  <motion.button 
                    type="button"
                    onClick={() => setShowModal(false)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{ padding: '18px 32px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-glass)', borderRadius: '16px', fontWeight: '900', cursor: 'pointer' }}
                  >
                    ABORT
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default LeaveManagement;
