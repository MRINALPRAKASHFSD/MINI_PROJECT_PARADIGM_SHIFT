import { useState } from 'react';
import { Megaphone, Plus, Calendar, Eye, Share2, Edit2, Trash2, X, Filter } from 'lucide-react';
import './Announcements.css';

function Announcements() {
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: 'Republic Day Holiday Notice',
      content: 'The office will remain closed on 26th January 2026 for Republic Day celebrations. Regular operations will resume on 27th January.',
      type: 'Holiday',
      priority: 'High',
      postedBy: 'Pratham Verma',
      department: 'HR',
      date: '2026-01-20',
      icon: <Calendar size={18} />,
      color: '#f59e0b',
      views: 145
    },
    {
      id: 2,
      title: 'New Security Protocols',
      content: 'Updated security protocols are now in effect. All employees must use their access cards for entry and follow the new visitor registration process.',
      type: 'Security',
      priority: 'High',
      postedBy: 'Rohan Kapoor',
      department: 'Admin',
      date: '2026-01-18',
      icon: <Megaphone size={18} />,
      color: '#ef4444',
      views: 203
    },
    {
      id: 3,
      title: 'Employee of the Month - December',
      content: 'Congratulations to Ishan Singh for being selected as Employee of the Month! His outstanding contribution to the Finance department has been exceptional.',
      type: 'Recognition',
      priority: 'Medium',
      postedBy: 'Pratham Verma',
      department: 'HR',
      date: '2026-01-15',
      icon: <Megaphone size={18} />,
      color: '#10b981',
      views: 187
    },
    {
      id: 4,
      title: 'Quarterly Town Hall Meeting',
      content: 'Join us for the Q4 Town Hall meeting on January 30th at 3 PM in the main conference hall. CEO will share company updates and Q&A session.',
      type: 'Meeting',
      priority: 'High',
      postedBy: 'Diya Sharma',
      department: 'Management',
      date: '2026-01-12',
      icon: <Calendar size={18} />,
      color: '#8b5cf6',
      views: 156
    }
  ]);

  const [filter, setFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);

  const filteredAnnouncements = filter === 'All' 
    ? announcements 
    : announcements.filter(ann => ann.priority === filter || ann.type === filter);

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return '#ef4444';
      case 'Medium': return '#f59e0b';
      case 'Low': return '#10b981';
      default: return '#64748b';
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
              <div className="ann-category" style={{ color: ann.color, background: `${ann.color}10` }}>
                {ann.icon}
                <span>{ann.type}</span>
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
                <div className="author-img">{ann.postedBy.charAt(0)}</div>
                <div className="author-data">
                  <div className="author-name">{ann.postedBy}</div>
                  <div className="author-dept">{ann.department}</div>
                </div>
              </div>
              <div className="ann-metrics">
                <span><Eye size={12} /> {ann.views}</span>
                <span><Calendar size={12} /> {new Date(ann.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
              </div>
            </div>

            <div className="ann-card-actions">
              <button className="icon-btn"><Share2 size={16} /></button>
              <button className="icon-btn"><Edit2 size={16} /></button>
              <button className="icon-btn delete-btn"><Trash2 size={16} /></button>
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
            <form className="ann-form">
              <div className="form-item">
                <label>Headline</label>
                <input type="text" placeholder="e.g. System Maintenance Window" />
              </div>
              <div className="form-item">
                <label>Message Content</label>
                <textarea placeholder="Provide detailed information..." rows="4" />
              </div>
              <div className="form-grid">
                <div className="form-item">
                  <label>Category</label>
                  <select>
                    <option>Holiday</option>
                    <option>Meeting</option>
                    <option>Training</option>
                    <option>Security</option>
                    <option>Recognition</option>
                  </select>
                </div>
                <div className="form-item">
                  <label>Urgency Level</label>
                  <select>
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
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