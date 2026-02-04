import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
      icon: '🎉',
      color: '#f59e0b',
      views: 145
    },
    {
      id: 2,
      title:  'New Security Protocols',
      content: 'Updated security protocols are now in effect. All employees must use their access cards for entry and follow the new visitor registration process.',
      type: 'Security',
      priority: 'High',
      postedBy: 'Rohan Kapoor',
      department: 'Admin',
      date: '2026-01-18',
      icon: '🔒',
      color: '#ef4444',
      views: 203
    },
    {
      id: 3,
      title: 'Employee of the Month - December',
      content: 'Congratulations to Ishan Singh for being selected as Employee of the Month!  His outstanding contribution to the Finance department has been exceptional.',
      type: 'Recognition',
      priority: 'Medium',
      postedBy: 'Pratham Verma',
      department: 'HR',
      date: '2026-01-15',
      icon: '🏆',
      color: '#10b981',
      views: 187
    },
    {
      id: 4,
      title: 'Quarterly Town Hall Meeting',
      content: 'Join us for the Q4 Town Hall meeting on January 30th at 3 PM in the main conference hall. CEO will share company updates and Q&A session.',
      type: 'Meeting',
      priority:  'High',
      postedBy: 'Diya Sharma',
      department: 'Management',
      date: '2026-01-12',
      icon: '🎤',
      color: '#8b5cf6',
      views: 156
    },
    {
      id: 5,
      title: 'New Health Insurance Benefits',
      content: 'Enhanced health insurance coverage is now available for all employees. Please check your email for detailed benefits and enrollment process.',
      type: 'Benefits',
      priority: 'Medium',
      postedBy: 'Pratham Verma',
      department: 'HR',
      date: '2026-01-10',
      icon: '🏥',
      color: '#06b6d4',
      views: 198
    },
    {
      id: 6,
      title: 'Office Renovation Update',
      content: 'The 3rd floor renovation will begin next week.  Temporary workstations have been arranged on the 2nd floor. Please coordinate with your team leads.',
      type: 'Facility',
      priority: 'Medium',
      postedBy: 'Priya Gupta',
      department: 'Operations',
      date: '2026-01-08',
      icon: '🏗️',
      color: '#f97316',
      views: 132
    },
    {
      id: 7,
      title: 'Training:  Advanced Excel Workshop',
      content: 'Register for the Advanced Excel workshop scheduled for February 5-6.  Limited seats available. Contact HR for registration.',
      type: 'Training',
      priority: 'Low',
      postedBy: 'Mahin Khan',
      department: 'Training',
      date: '2026-01-05',
      icon: '📚',
      color: '#667eea',
      views: 98
    },
    {
      id: 8,
      title: 'Parking Lot Maintenance',
      content: 'Parking lot maintenance will be conducted on January 25th.  Please use alternative parking arrangements for that day.',
      type: 'Facility',
      priority: 'Low',
      postedBy: 'Arjun Reddy',
      department: 'Admin',
      date: '2026-01-03',
      icon: '🚗',
      color: '#64748b',
      views: 76
    },
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
    <div className="announcements">
      <motion.div 
        className="announcements-header"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity:  1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1>📢 Announcements</h1>
          <p>Company-wide notifications and updates</p>
        </div>
        <motion.button
          className="create-announcement-btn"
          onClick={() => setShowModal(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale:  0.95 }}
        >
          ➕ Create Announcement
        </motion.button>
      </motion. div>

      <motion.div 
        className="announcements-stats"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity:  1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="stat-card glass">
          <div className="stat-icon" style={{ background: '#667eea' }}>📢</div>
          <div className="stat-info">
            <h3>{announcements.length}</h3>
            <p>Total Announcements</p>
          </div>
        </div>
        <div className="stat-card glass">
          <div className="stat-icon" style={{ background:  '#ef4444' }}>🔥</div>
          <div className="stat-info">
            <h3>{announcements.filter(a => a.priority === 'High').length}</h3>
            <p>High Priority</p>
          </div>
        </div>
        <div className="stat-card glass">
          <div className="stat-icon" style={{ background: '#10b981' }}>👁️</div>
          <div className="stat-info">
            <h3>{announcements.reduce((sum, a) => sum + a.views, 0)}</h3>
            <p>Total Views</p>
          </div>
        </div>
        <div className="stat-card glass">
          <div className="stat-icon" style={{ background: '#f59e0b' }}>📅</div>
          <div className="stat-info">
            <h3>{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</h3>
            <p>Today</p>
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="filter-section glass"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {['All', 'High', 'Medium', 'Low', 'Holiday', 'Meeting', 'Training']. map(filterType => (
          <button
            key={filterType}
            className={`filter-btn ${filter === filterType ? 'active' :  ''}`}
            onClick={() => setFilter(filterType)}
          >
            {filterType}
          </button>
        ))}
      </motion.div>

      <div className="announcements-grid">
        <AnimatePresence>
          {filteredAnnouncements.map((announcement, index) => (
            <motion.div
              key={announcement. id}
              className="announcement-card glass"
              style={{ '--announcement-color': announcement.color }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity:  1, scale: 1 }}
              exit={{ opacity: 0, scale:  0.9 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <div className="announcement-header">
                <div className="announcement-icon" style={{ background: announcement.color }}>
                  {announcement.icon}
                </div>
                <div className="announcement-meta">
                  <div className="announcement-badges">
                    <span className="type-badge" style={{ background: announcement.color }}>
                      {announcement.type}
                    </span>
                    <span 
                      className="priority-badge" 
                      style={{ background: getPriorityColor(announcement.priority) }}
                    >
                      {announcement.priority}
                    </span>
                  </div>
                </div>
              </div>

              <h3 className="announcement-title">{announcement.title}</h3>
              <p className="announcement-content">{announcement.content}</p>

              <div className="announcement-footer">
                <div className="posted-by">
                  <div className="poster-avatar">{announcement.postedBy. charAt(0)}</div>
                  <div className="poster-info">
                    <span className="poster-name">{announcement.postedBy}</span>
                    <span className="poster-dept">{announcement.department}</span>
                  </div>
                </div>
                <div className="announcement-stats-footer">
                  <span className="views">👁️ {announcement.views}</span>
                  <span className="date">📅 {new Date(announcement.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                </div>
              </div>

              <div className="announcement-actions">
                <motion.button
                  className="action-btn share"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Share"
                >
                  🔗
                </motion.button>
                <motion.button
                  className="action-btn edit"
                  whileHover={{ scale:  1.1 }}
                  whileTap={{ scale:  0.9 }}
                  title="Edit"
                >
                  ✏️
                </motion.button>
                <motion.button
                  className="action-btn delete"
                  whileHover={{ scale:  1.1 }}
                  whileTap={{ scale:  0.9 }}
                  title="Delete"
                >
                  🗑️
                </motion.button>
              </div>
            </motion. div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion. div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity:  1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion. div 
              className="modal-content glass"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y:  0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2>📢 Create New Announcement</h2>
              <form className="announcement-form">
                <input type="text" placeholder="Announcement Title" className="form-input" />
                <textarea placeholder="Announcement Content" className="form-textarea" rows="5" />
                <select className="form-select">
                  <option>Select Type</option>
                  <option>Holiday</option>
                  <option>Meeting</option>
                  <option>Training</option>
                  <option>Security</option>
                  <option>Benefits</option>
                  <option>Facility</option>
                  <option>Recognition</option>
                </select>
                <select className="form-select">
                  <option>Select Priority</option>
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
                <div className="form-actions">
                  <motion.button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setShowModal(false)}
                    whileHover={{ scale:  1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Cancel
                  </motion. button>
                  <motion. button
                    type="submit"
                    className="submit-btn"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Post Announcement
                  </motion. button>
                </div>
              </form>
            </motion.div>
          </motion. div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Announcements;