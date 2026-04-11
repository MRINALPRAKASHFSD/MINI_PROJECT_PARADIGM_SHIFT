import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, Calendar as CalendarIcon, Clock, Link as LinkIcon, Plus, X, Users } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const Meetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [isScheduling, setIsScheduling] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '', date: '', time: '', duration: 60, link: ''
  });

  const fetchMeetings = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get('/meetings');
      setMeetings(data.meetings || []);
    } catch {
      toast.error('Failed to load meetings');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const handleSchedule = async (e) => {
    e.preventDefault();
    try {
      await api.post('/meetings', formData);
      toast.success('Meeting Scheduled!');
      setIsScheduling(false);
      setFormData({ title: '', date: '', time: '', duration: 60, link: '' });
      fetchMeetings();
    } catch {
      toast.error('Failed to schedule meeting');
    }
  };

  const handleCancel = async (id) => {
    try {
      await api.delete(`/meetings/${id}`);
      toast.success('Meeting canceled');
      fetchMeetings();
    } catch {
      toast.error('Could not cancel meeting');
    }
  };

  return (
    <div style={{ padding: '24px', color: '#f1f5f9' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800' }}>Company Meetings</h1>
          <p style={{ color: '#94a3b8' }}>Schedule and manage your team synced events.</p>
        </div>
        <button 
          onClick={() => setIsScheduling(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#3b82f6', border: 'none', color: '#fff', padding: '12px 20px', borderRadius: '12px', fontWeight: '600', cursor: 'pointer' }}
        >
          <Plus size={18} /> Schedule Meeting
        </button>
      </div>

      <AnimatePresence>
        {isScheduling && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden', marginBottom: '24px' }}>
            <div style={{ background: 'rgba(15,23,42,0.6)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h3 style={{ margin: 0 }}>New Meeting</h3>
                <button onClick={() => setIsScheduling(false)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSchedule} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Meeting Title</label>
                  <input style={inputStyle} required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Weekly Standup" />
                </div>
                <div>
                  <label style={labelStyle}>Date</label>
                  <input type="date" style={inputStyle} required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                </div>
                <div>
                  <label style={labelStyle}>Time</label>
                  <input type="time" style={inputStyle} required value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
                </div>
                <div>
                  <label style={labelStyle}>Duration (mins)</label>
                  <input type="number" style={inputStyle} required value={formData.duration} onChange={e => setFormData({...formData, duration: Number(e.target.value)})} />
                </div>
                <div>
                  <label style={labelStyle}>Meeting Link</label>
                  <input style={inputStyle} value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} placeholder="https://zoom.us/j/..." />
                </div>
                <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end' }}>
                  <button type="submit" style={{ background: '#10b981', color: '#fff', padding: '12px 24px', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                    Save Event
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {meetings.length === 0 && !isLoading ? (
          <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: '#64748b', background: 'rgba(255,255,255,0.02)', borderRadius: '16px' }}>
            <Video size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
            <p>No upcoming meetings found for your workspace.</p>
          </div>
        ) : (
          meetings.map(m => (
            <motion.div key={m._id} initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="stat-card-smooth"
              style={{ background: 'rgba(15,23,42,0.5)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ margin: '0 0 12px', fontSize: '18px' }}>{m.title}</h3>
                <button onClick={() => handleCancel(m._id)} style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'none', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>
                  Cancel
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: '#94a3b8', fontSize: '14px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CalendarIcon size={16} color="#3b82f6" /> {new Date(m.date).toLocaleDateString()}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Clock size={16} color="#10b981" /> {m.time} ({m.duration} mins)</span>
                {m.link && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <LinkIcon size={16} color="#8b5cf6" /> 
                    <a href={m.link} target="_blank" rel="noreferrer" style={{ color: '#818cf8', textDecoration: 'none' }}>Join Video Call</a>
                  </span>
                )}
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', fontSize: '12px' }}>
                  <Users size={16} /> Organized by {m.organizer?.name || 'Unknown'}
                </span>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

const labelStyle = { display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '6px' };
const inputStyle = { width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 14px', borderRadius: '8px', color: '#fff', boxSizing: 'border-box' };

export default Meetings;
