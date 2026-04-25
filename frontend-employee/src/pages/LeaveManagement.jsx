import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDataStore } from '../store/dataStore';
import { useAuthStore } from '../store/authStore';
import { formatDistanceToNow } from 'date-fns';
import { Calendar, Plus, X, Clock, CheckCircle, XCircle, AlertCircle, Briefcase, Sun, Thermometer, Home, ChevronDown } from 'lucide-react';

const LEAVE_TYPES = [
  { key: 'Casual Leave', icon: Sun, color: '#3b82f6', desc: 'Personal work, family events' },
  { key: 'Sick Leave', icon: Thermometer, color: '#ef4444', desc: 'Illness, medical appointments' },
  { key: 'Vacation', icon: Calendar, color: '#10b981', desc: 'Planned vacation, travel' },
  { key: 'Work From Home', icon: Home, color: '#f59e0b', desc: 'Remote work day' },
];

const STATUS_BADGE = {
  approved: { bg: 'rgba(16,185,129,0.15)', color: '#10b981', icon: CheckCircle, label: 'Approved' },
  pending: { bg: 'rgba(245,158,11,0.15)', color: '#f59e0b', icon: Clock, label: 'Pending' },
  rejected: { bg: 'rgba(239,68,68,0.15)', color: '#ef4444', icon: XCircle, label: 'Rejected' },
};

const LeaveManagement = () => {
  const { user } = useAuthStore();
  const { leaves, applyLeave, cancelLeave } = useDataStore();
  const leaveBalances = user?.leaveBalances || { casual: 0, earned: 0, sick: 0, total: 0 };
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ type: 'Casual Leave', from: '', to: '', reason: '' });
  const [tab, setTab] = useState('overview');

  const usedLeaves = { casual: 0, sick: 0, vacation: 0, wfh: 0 };
  leaves.forEach(l => {
    if (l.status !== 'rejected') {
      if (l.type === 'Casual Leave') usedLeaves.casual += l.days;
      if (l.type === 'Sick Leave') usedLeaves.sick += l.days;
      if (l.type === 'Vacation') usedLeaves.vacation += l.days;
      if (l.type === 'Work From Home') usedLeaves.wfh += l.days;
    }
  });

  const balances = [
    { label: 'Casual Leave', total: leaveBalances.casual, used: usedLeaves.casual, color: '#3b82f6', icon: Sun },
    { label: 'Sick Leave', total: leaveBalances.sick, used: usedLeaves.sick, color: '#ef4444', icon: Thermometer },
    { label: 'Vacation', total: leaveBalances.earned, used: usedLeaves.vacation, color: '#10b981', icon: Calendar },
    { label: 'Work From Home', total: leaveBalances.wfh, used: usedLeaves.wfh, color: '#f59e0b', icon: Home },
  ];

  const handleSubmit = () => {
    if (!form.from || !form.to || !form.reason.trim()) return;
    const days = Math.max(1, Math.ceil((new Date(form.to) - new Date(form.from)) / 86400000) + 1);
    applyLeave({ ...form, days });
    setShowModal(false);
    setForm({ type: 'Casual Leave', from: '', to: '', reason: '' });
  };

  const cardStyle = { background: 'var(--surface-panel)', borderRadius: '20px', padding: '28px', border: '1px solid var(--border-soft)' };
  const tabStyle = (active) => ({
    padding: '10px 24px', borderRadius: '12px', border: 'none', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s',
    background: active ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : 'var(--btn-ghost-bg)', color: active ? '#fff' : 'var(--text-secondary)',
  });

  return (
    <div style={{ padding: '24px', color: 'var(--text-primary)', minHeight: '100vh' }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: 'linear-gradient(135deg, #10b981, #34d399)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Calendar size={28} color="#fff" />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '700' }}>Leave Management</h1>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '14px' }}>Apply and track your leaves</p>
          </div>
        </div>
        <button onClick={() => setShowModal(true)}
          style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', border: 'none', borderRadius: '14px', padding: '12px 28px', color: '#fff', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'transform 0.2s' }}>
          <Plus size={18} /> Apply Leave
        </button>
      </motion.div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {[{ key: 'overview', label: 'Overview' }, { key: 'history', label: `History (${leaves.length})` }, { key: 'calendar', label: 'Calendar View' }].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={tabStyle(tab === t.key)}>{t.label}</button>
        ))}
      </div>

      {/* Leave Balance Cards */}
      {(tab === 'overview' || tab === 'calendar') && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
          {balances.map((b, i) => {
            const remaining = b.total - b.used;
            const pct = b.total > 0 ? (b.used / b.total) * 100 : 0;
            return (
              <div key={i} className="stat-card-smooth" style={{ ...cardStyle, padding: '24px', transition: 'transform 0.2s, box-shadow 0.2s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${b.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: b.color }}>
                    <b.icon size={22} />
                  </div>
                  <span style={{ fontSize: '28px', fontWeight: '700', color: b.color }}>{remaining}</span>
                </div>
                <div style={{ fontWeight: '600', fontSize: '15px', marginBottom: '8px' }}>{b.label}</div>
                <div style={{ height: '6px', borderRadius: '3px', background: 'var(--border-soft)', overflow: 'hidden', marginBottom: '8px' }}>
                  <div style={{ height: '100%', borderRadius: '3px', background: b.color, width: `${pct}%`, transition: 'width 0.8s ease' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)' }}>
                  <span>{b.used} used</span>
                  <span>{b.total} total</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Overview Stats */}
      {tab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div style={cardStyle}>
            <h3 style={{ margin: '0 0 20px', fontSize: '18px', fontWeight: '600' }}>Recent Applications</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {leaves.slice(0, 5).map((leave, i) => {
                const badge = STATUS_BADGE[leave.status];
                return (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderRadius: '14px', background: 'var(--surface-inset)', border: '1px solid var(--btn-ghost-bg)' }}>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '14px' }}>{leave.type}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{leave.from}{leave.from !== leave.to ? ` → ${leave.to}` : ''} · {leave.days} day{leave.days > 1 ? 's' : ''}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-faint)', marginTop: '4px' }}>{leave.reason}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '600', padding: '6px 12px', borderRadius: '10px', background: badge.bg, color: badge.color }}>
                        <badge.icon size={14} /> {badge.label}
                      </span>
                      {leave.status === 'pending' && (
                        <button onClick={() => cancelLeave(leave.id)} title="Cancel"
                          style={{ background: 'rgba(239,68,68,0.1)', border: 'none', borderRadius: '8px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#ef4444' }}>
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
              {leaves.length === 0 && <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>No leave applications yet</p>}
            </div>
          </div>
          <div style={cardStyle}>
            <h3 style={{ margin: '0 0 20px', fontSize: '18px', fontWeight: '600' }}>Leave Policy</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {LEAVE_TYPES.map((lt, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px', borderRadius: '14px', background: 'var(--surface-inset)', border: '1px solid var(--btn-ghost-bg)' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: `${lt.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: lt.color }}>
                    <lt.icon size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '14px' }}>{lt.key}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{lt.desc}</div>
                  </div>
                </div>
              ))}
              <div style={{ padding: '16px', borderRadius: '14px', background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.15)', marginTop: '8px' }}>
                <h4 style={{ margin: '0 0 8px', fontSize: '14px', color: '#3b82f6' }}>📝 Important Notes</h4>
                <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                  <li>Casual leaves cannot be carried forward</li>
                  <li>Sick leave beyond 3 days requires medical certificate</li>
                  <li>Earned leaves can be encashed at year-end</li>
                  <li>WFH requires manager approval 24h in advance</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History Tab */}
      {tab === 'history' && (
        <div style={cardStyle}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {leaves.length === 0 && <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>No leave history</p>}
            {leaves.map((leave, i) => {
              const badge = STATUS_BADGE[leave.status];
              return (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 20px', borderRadius: '14px', background: 'var(--surface-inset)', border: '1px solid var(--btn-ghost-bg)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${badge.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: badge.color }}>
                      <badge.icon size={22} />
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '15px' }}>{leave.type}</div>
                      <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>{leave.from}{leave.from !== leave.to ? ` → ${leave.to}` : ''}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-faint)', marginTop: '4px' }}>{leave.reason}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '600', padding: '6px 14px', borderRadius: '10px', background: badge.bg, color: badge.color }}>
                      <badge.icon size={14} /> {badge.label}
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{leave.days} day{leave.days > 1 ? 's' : ''} · {formatDistanceToNow(new Date(leave.appliedAt), { addSuffix: true })}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Calendar View */}
      {tab === 'calendar' && (
        <div style={cardStyle}>
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '40px' }}>
            <Calendar size={48} style={{ color: '#334155', marginBottom: '16px', display: 'block', margin: '0 auto 16px' }} />
            Leave calendar view shows your approved leaves and holidays for the current year.
            <br /><br />
            <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
              You have <strong style={{ color: '#10b981' }}>{leaves.filter(l => l.status === 'approved').length}</strong> approved leaves
              and <strong style={{ color: '#f59e0b' }}>{leaves.filter(l => l.status === 'pending').length}</strong> pending applications.
            </span>
          </p>
        </div>
      )}

      {/* Apply Leave Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <motion.div onClick={e => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              style={cardStyle}>
              <div style={{ minWidth: '400px', maxWidth: '500px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h2 style={{ margin: 0, fontSize: '22px' }}>Apply for Leave</h2>
                  <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
                </div>

                {/* Leave Type Selector */}
                <label style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600', display: 'block', marginBottom: '8px' }}>Leave Type</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '20px' }}>
                  {LEAVE_TYPES.map(lt => (
                    <button key={lt.key} onClick={() => setForm({ ...form, type: lt.key })}
                      style={{
                        padding: '14px', borderRadius: '12px', border: form.type === lt.key ? `2px solid ${lt.color}` : '1px solid var(--btn-ghost-border)',
                        background: form.type === lt.key ? `${lt.color}10` : 'var(--surface-inset)', cursor: 'pointer', color: 'var(--text-primary)',
                        display: 'flex', alignItems: 'center', gap: '10px', transition: 'all 0.2s',
                      }}>
                      <lt.icon size={18} style={{ color: lt.color }} />
                      <span style={{ fontSize: '13px', fontWeight: '500' }}>{lt.key}</span>
                    </button>
                  ))}
                </div>

                {/* Date Fields */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600', display: 'block', marginBottom: '6px' }}>From</label>
                    <input type="date" value={form.from} onChange={e => setForm({ ...form, from: e.target.value })}
                      style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--btn-ghost-border)', background: 'var(--btn-ghost-bg)', color: 'var(--text-primary)', fontSize: '14px', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600', display: 'block', marginBottom: '6px' }}>To</label>
                    <input type="date" value={form.to} onChange={e => setForm({ ...form, to: e.target.value })}
                      style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--btn-ghost-border)', background: 'var(--btn-ghost-bg)', color: 'var(--text-primary)', fontSize: '14px', boxSizing: 'border-box' }} />
                  </div>
                </div>

                {/* Reason */}
                <label style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Reason</label>
                <textarea value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} rows={3} placeholder="Describe your reason..."
                  style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--btn-ghost-border)', background: 'var(--btn-ghost-bg)', color: 'var(--text-primary)', fontSize: '14px', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }} />

                {/* Days Preview */}
                {form.from && form.to && (
                  <div style={{ marginTop: '12px', padding: '12px', borderRadius: '10px', background: 'rgba(59,130,246,0.1)', fontSize: '13px', color: '#93c5fd' }}>
                    📅 {Math.max(1, Math.ceil((new Date(form.to) - new Date(form.from)) / 86400000) + 1)} day(s) leave requested
                  </div>
                )}

                <button onClick={handleSubmit}
                  style={{ marginTop: '20px', width: '100%', padding: '14px', borderRadius: '14px', border: 'none', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', color: '#fff', fontSize: '15px', fontWeight: '600', cursor: 'pointer', transition: 'transform 0.2s' }}>
                  Submit Application
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LeaveManagement;
