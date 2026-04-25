import { useState } from 'react';
import { Megaphone, Plus, Calendar, Eye, Share2, Edit2, Trash2, X, Filter } from 'lucide-react';
import { useDataStore } from '../store/dataStore';
import './Announcements.css';

function Announcements() {
  const { announcements, addAnnouncement, deleteAnnouncement } = useDataStore();
  const [filter, setFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [newAnn, setNewAnn] = useState({ title: '', content: '', category: 'General', priority: 'medium' });

  const filteredAnnouncements = filter === 'All' 
    ? announcements 
    : announcements.filter(ann => ann.priority === filter.toLowerCase() || ann.category === filter);

  const getPriorityColor = (priority) => {
    switch(priority?.toLowerCase()) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#64748b';
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newAnn.title || !newAnn.content) return;
    try {
      await addAnnouncement(newAnn);
      setShowModal(false);
      setNewAnn({ title: '', content: '', category: 'General', priority: 'medium' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteAnnouncement(id);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="announcements-container">
      <div className="ann-header">
        <div>
          <h1>Corporate Announcements</h1>
          <p>Official broadcasts and operational updates for the entire organization.</p>
        </div>
        <button
          className="btn-primary"
          onClick={() => setShowModal(true)}
        >
          <Plus size={18} /> New Announcement
        </button>
      </div>

      <div className="ann-stats-row">
        <div className="ann-stat-item">
          <div className="stat-circle" style={{ color: '#6366f1' }}><Megaphone size={20} /></div>
          <div className="stat-text">
            <span className="stat-count">{announcements.length}</span>
            <span className="stat-name">Active Posts</span>
          </div>
        </div>
        <div className="ann-stat-item">
          <div className="stat-circle" style={{ color: '#ef4444' }}><Filter size={20} /></div>
          <div className="stat-text">
            <span className="stat-count">{announcements.filter(a => a.priority === 'High').length}</span>
            <span className="stat-name">Critical Alerts</span>
          </div>
        </div>
        <div className="ann-stat-item">
          <div className="stat-circle" style={{ color: '#10b981' }}><Eye size={20} /></div>
          <div className="stat-text">
            <span className="stat-count">{announcements.reduce((sum, a) => sum + a.views, 0)}</span>
            <span className="stat-name">Total Engagement</span>
          </div>
        </div>
      </div>

      <div className="ann-filters">
        {['All', 'High', 'Medium', 'Low', 'Holiday', 'Meeting', 'Training'].map(type => (
          <button
            key={type}
            className={`ann-filter-tab ${filter === type ? 'active' : ''}`}
            onClick={() => setFilter(type)}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="ann-grid">
        {filteredAnnouncements.map((ann) => (
          <div key={ann.id} className="ann-card">
            <div className="ann-card-header">
              <div className="ann-category" style={{ color: '#10b981', background: '#10b98110' }}>
                <Megaphone size={16} />
                <span>{ann.category || 'General'}</span>
              </div>
              <span 
                className="ann-priority" 
                style={{ background: `${getPriorityColor(ann.priority)}10`, color: getPriorityColor(ann.priority) }}
              >
                {ann.priority}
              </span>
            </div>

            <h3 className="ann-title">{ann.title}</h3>
            <p className="ann-body">{ann.content}</p>

            <div className="ann-meta-footer">
              <div className="ann-author">
                <div className="author-img">{ann.authorName?.charAt(0) || 'U'}</div>
                <div className="author-data">
                  <div className="author-name">{ann.authorName || 'Unknown'}</div>
                  <div className="author-dept">Admin</div>
                </div>
              </div>
              <div className="ann-metrics">
                <span><Eye size={12} /> {ann.views || 0}</span>
                <span><Calendar size={12} /> {new Date(ann.createdAt || Date.now()).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
              </div>
            </div>

            <div className="ann-card-actions">
              <button className="icon-btn"><Share2 size={16} /></button>
              <button className="icon-btn"><Edit2 size={16} /></button>
              <button className="icon-btn delete-btn" onClick={() => handleDelete(ann.id)}><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-top">
              <h2>New Announcement</h2>
              <button className="btn-close" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <form className="ann-form" onSubmit={handleCreate}>
              <div className="form-item">
                <label>Headline</label>
                <input 
                  type="text" 
                  placeholder="e.g. System Maintenance Window" 
                  value={newAnn.title}
                  onChange={(e) => setNewAnn({ ...newAnn, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-item">
                <label>Message Content</label>
                <textarea 
                  placeholder="Provide detailed information..." 
                  rows="4"
                  value={newAnn.content}
                  onChange={(e) => setNewAnn({ ...newAnn, content: e.target.value })}
                  required
                />
              </div>
              <div className="form-grid">
                <div className="form-item">
                  <label>Category</label>
                  <select
                    value={newAnn.category}
                    onChange={(e) => setNewAnn({ ...newAnn, category: e.target.value })}
                  >
                    <option value="General">General</option>
                    <option value="HR">HR</option>
                    <option value="IT">IT</option>
                    <option value="Event">Event</option>
                    <option value="Policy">Policy</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
                <div className="form-item">
                  <label>Urgency Level</label>
                  <select
                    value={newAnn.priority}
                    onChange={(e) => setNewAnn({ ...newAnn, priority: e.target.value })}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-ghost" onClick={() => setShowModal(false)}>Discard</button>
                <button type="submit" className="btn-primary">Broadcast Update</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Announcements;