import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDataStore } from '../store/dataStore';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Bell, Check, CheckCheck, Trash2, BellOff, ArrowRight, Sparkles, Zap, ShieldCheck, Heart } from 'lucide-react';

const TYPE_META = {
  task: { emoji: '📋', color: 'var(--primary)', label: 'Task' },
  system: { emoji: '⚙️', color: 'var(--secondary)', label: 'System' },
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

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div style={{ padding: '24px', minHeight: '100vh', position: 'relative' }}>
      {/* Background Glows */}
      <div className="ambient-glow" style={{ top: '10%', right: '10%', background: 'var(--primary-glow)', width: '400px', height: '400px' }} />
      <div className="ambient-glow" style={{ bottom: '20%', left: '5%', background: 'var(--secondary-glow)', width: '350px', height: '350px' }} />

      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '20px', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} style={{ width: '64px', height: '64px', borderRadius: '20px', background: 'linear-gradient(135deg, #f59e0b, #f97316)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 12px 25px rgba(249,115,22,0.3)' }}>
            <Bell size={32} color="#fff" />
          </motion.div>
          <div>
            <h1 style={{ margin: 0, fontSize: '34px', fontWeight: '800', letterSpacing: '-1px' }}>Notification Center</h1>
            <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontSize: '15px', fontWeight: '500' }}>
              Stay updated with your latest task assignments and achievements
            </p>
          </div>
        </div>
        
        {unreadCount > 0 && (
          <motion.button 
            whileHover={{ scale: 1.05, boxShadow: '0 8px 25px rgba(16,185,129,0.2)' }}
            whileTap={{ scale: 0.95 }}
            onClick={markAllRead}
            style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '16px', padding: '12px 24px', color: '#10b981', fontSize: '14px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
          >
            <CheckCheck size={18} strokeWidth={3} /> Mark all as read
          </motion.button>
        )}
      </div>

      {/* Filters Bar */}
      <div className="glass-panel" style={{ display: 'flex', gap: '8px', padding: '8px', borderRadius: '20px', marginBottom: '32px', border: '1px solid var(--border-glass)', background: 'rgba(255,255,255,0.02)', flexWrap: 'wrap', position: 'relative', zIndex: 10 }}>
        {[
          { key: 'all', label: `All Alerts`, count: notifications.length, icon: Sparkles },
          { key: 'unread', label: `Unread`, count: unreadCount, icon: Zap },
          { key: 'task', label: 'Tasks', icon: ShieldCheck },
          { key: 'team', label: 'Team', icon: Heart },
          { key: 'system', label: 'System', icon: Zap },
        ].map(f => {
          const Icon = f.icon;
          const active = filter === f.key;
          return (
            <button key={f.key} onClick={() => setFilter(f.key)}
              style={{
                padding: '10px 20px', borderRadius: '14px', fontSize: '13px', fontWeight: '800', cursor: 'pointer', border: 'none',
                background: active ? 'var(--primary)' : 'transparent',
                color: active ? '#fff' : 'var(--text-muted)',
                display: 'flex', alignItems: 'center', gap: '8px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}>
              <Icon size={14} strokeWidth={3} />
              {f.label}
              {f.count !== undefined && <span style={{ opacity: 0.6, fontSize: '11px' }}>{f.count}</span>}
            </button>
          );
        })}
      </div>

      {/* Notification List Content */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', zIndex: 10 }}>
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="glass-panel" 
              style={{ padding: '100px 40px', borderRadius: '32px', textAlign: 'center', border: '1px solid var(--border-glass)' }}
            >
              <div style={{ width: '80px', height: '80px', borderRadius: '30px', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <BellOff size={40} style={{ color: 'var(--text-muted)', opacity: 0.3 }} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 8px' }}>Void Detected</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '15px', fontWeight: '500', maxWidth: '300px', margin: '0 auto' }}>You've cleared your notification deck. Enjoy the peace.</p>
            </motion.div>
          ) : (
            filtered.map((notif) => {
              const meta = TYPE_META[notif.type] || TYPE_META.system;
              return (
                <motion.div 
                  key={notif.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, scale: 0.95 }}
                  className="glass-panel"
                  onClick={() => { markRead(notif.id); if (notif.link) navigate(notif.link); }}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: '24px', padding: '24px', borderRadius: '24px', cursor: 'pointer',
                    border: '1px solid var(--border-glass)',
                    background: notif.read ? 'rgba(255,255,255,0.01)' : 'linear-gradient(90deg, rgba(79,70,229,0.08), transparent)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                  whileHover={{ x: 10, borderColor: `${meta.color}40` }}
                >
                  {/* Emoji/Icon Container */}
                  <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: `${meta.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0, border: `1px solid ${meta.color}20` }}>
                    {meta.emoji}
                  </div>

                  {/* Body Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: notif.read ? 'var(--text-secondary)' : 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                          {notif.title}
                          {!notif.read && <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', boxShadow: '0 0 10px var(--primary)' }} />}
                        </h4>
                        <div style={{ fontSize: '12px', fontWeight: '800', color: meta.color, textTransform: 'uppercase', letterSpacing: '1px', marginTop: '2px' }}>{meta.label}</div>
                      </div>
                      <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>{formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}</span>
                    </div>
                    
                    <p style={{ margin: '0 0 16px', color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6', fontWeight: '500' }}>{notif.message}</p>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        {!notif.read && (
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            onClick={e => { e.stopPropagation(); markRead(notif.id); }}
                            style={{ background: 'rgba(16,185,129,0.1)', border: 'none', color: '#10b981', cursor: 'pointer', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}
                          >
                            <Check size={14} strokeWidth={3} /> Mark Read
                          </motion.button>
                        )}
                        <motion.button 
                          whileHover={{ scale: 1.1, color: '#f43f5e' }}
                          onClick={e => { e.stopPropagation(); clearNotification(notif.id); }}
                          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '6px', borderRadius: '8px', display: 'flex', alignItems: 'center' }}
                        >
                          <Trash2 size={16} strokeWidth={2} />
                        </motion.button>
                      </div>
                      
                      {notif.link && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', fontWeight: '800', fontSize: '13px' }}>
                          View Details <ArrowRight size={14} />
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Footer Info */}
      <div style={{ marginTop: '48px', textAlign: 'center', padding: '40px', color: 'var(--text-muted)', fontSize: '14px', fontWeight: '500' }}>
        Looking for older alerts? Check the <span style={{ color: 'var(--primary)', fontWeight: '800', cursor: 'pointer' }}>Alert Archive</span>
      </div>
    </div>
  );
};

export default Notifications;
