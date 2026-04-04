import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDataStore } from '../store/dataStore';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Bell, Check, CheckCheck, Trash2, X, Filter, BellOff, ChevronRight, Inbox } from 'lucide-react';

const TYPE_META = {
  task: { emoji: '📋', color: '#3b82f6', label: 'Task' },
  system: { emoji: '⚙️', color: '#6366f1', label: 'System' },
  team: { emoji: '👥', color: '#8b5cf6', label: 'Team' },
  achievement: { emoji: '🏆', color: '#f59e0b', label: 'Achievement' },
  leave: { emoji: '🏖️', color: '#10b981', label: 'Leave' },
};

const Notifications = () => {
  const navigate = useNavigate();
  const { notifications, markRead, markAllRead, clearNotification } = useDataStore();
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? notifications
    : filter === 'unread' ? notifications.filter(n => !n.read)
    : notifications.filter(n => n.type === filter);

  const unread = notifications.filter(n => !n.read).length;

  const cardStyle = { background: 'var(--surface-panel)', borderRadius: '20px', padding: '28px', border: '1px solid var(--border-soft)' };
  const filterBtnStyle = (active) => ({
    padding: '8px 18px', borderRadius: '12px', border: 'none', fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s',
    background: active ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : 'var(--btn-ghost-bg)',
    color: active ? '#fff' : 'var(--text-secondary)',
  });

  return (
    <div style={{ padding: '24px', color: 'var(--text-primary)', minHeight: '100vh' }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: 'linear-gradient(135deg, #f59e0b, #f97316)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bell size={28} color="#fff" />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '700' }}>Notifications</h1>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '14px' }}>{unread} unread notification{unread !== 1 ? 's' : ''}</p>
          </div>
        </div>
        {unread > 0 && (
          <button onClick={markAllRead}
            style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '12px', padding: '10px 20px', color: '#10b981', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s' }}>
            <CheckCheck size={16} /> Mark all read
          </button>
        )}
      </motion.div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {[
          { key: 'all', label: `All (${notifications.length})` },
          { key: 'unread', label: `Unread (${unread})` },
          { key: 'task', label: '📋 Tasks' },
          { key: 'team', label: '👥 Team' },
          { key: 'system', label: '⚙️ System' },
          { key: 'leave', label: '🏖️ Leave' },
          { key: 'achievement', label: '🏆 Achievements' },
        ].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)} style={filterBtnStyle(filter === f.key)}>{f.label}</button>
        ))}
      </div>

      {/* Notification List */}
      <div style={{ ...cardStyle, padding: '16px' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <BellOff size={48} style={{ color: '#334155', marginBottom: '16px' }} />
            <h3 style={{ color: 'var(--text-muted)', margin: '0 0 8px' }}>No notifications</h3>
            <p style={{ color: 'var(--text-faint)', fontSize: '14px', margin: 0 }}>You're all caught up!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {filtered.map((notif, i) => {
              const meta = TYPE_META[notif.type] || TYPE_META.system;
              return (
                <div key={notif.id}
                  onClick={() => { markRead(notif.id); if (notif.link) navigate(notif.link); }}
                  className="stat-card-smooth"
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '18px 16px', cursor: 'pointer',
                    borderBottom: i < filtered.length - 1 ? '1px solid var(--surface-inset)' : 'none',
                    background: notif.read ? 'transparent' : 'rgba(59,130,246,0.04)',
                    transition: 'background 0.2s',
                  }}>
                  {/* Icon */}
                  <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: `${meta.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
                    {meta.emoji}
                  </div>
                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontWeight: notif.read ? '500' : '700', fontSize: '15px' }}>{notif.title}</span>
                      {!notif.read && <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6', flexShrink: 0 }} />}
                    </div>
                    <p style={{ margin: '0 0 6px', color: 'var(--text-secondary)', fontSize: '13px', lineHeight: '1.5' }}>{notif.message}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}</span>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {!notif.read && (
                          <button onClick={e => { e.stopPropagation(); markRead(notif.id); }}
                            style={{ background: 'none', border: 'none', color: '#10b981', cursor: 'pointer', padding: '4px' }} title="Mark read">
                            <Check size={14} />
                          </button>
                        )}
                        <button onClick={e => { e.stopPropagation(); clearNotification(notif.id); }}
                          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }} title="Dismiss">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
