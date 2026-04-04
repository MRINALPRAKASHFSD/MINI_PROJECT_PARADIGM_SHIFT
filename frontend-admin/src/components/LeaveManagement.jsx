import { useState } from 'react';
import { motion } from 'framer-motion';
import { useDataStore } from '../store/dataStore';
import './LeaveManagement.css';

function LeaveManagement() {
  const { leaves, approveLeave, rejectLeave } = useDataStore();
  const [filter, setFilter] = useState('All');

  const leaveRequests = leaves || [];

  const handleApprove = async (id) => {
    try {
      await approveLeave(id);
    } catch(e) { console.error(e); }
  };

  const handleReject = async (id) => {
    try {
      await rejectLeave(id);
    } catch(e) { console.error(e); }
  };

  const filteredRequests = filter === 'All' 
    ? leaveRequests 
    : leaveRequests.filter(req => (req.status || '').toLowerCase() === filter.toLowerCase());


  const getStatusColor = (status) => {
    switch(status) {
      case 'Approved': return '#4ade80';
      case 'Rejected': return '#f87171';
      case 'Pending': return '#fbbf24';
      default:  return '#64748b';
    }
  };

  const getLeaveTypeIcon = (type) => {
    switch(type) {
      case 'Sick Leave': return '🏥';
      case 'Casual Leave': return '🌴';
      case 'Vacation': return '✈️';
      case 'Personal Leave': return '👤';
      case 'Maternity Leave': return '👶';
      default: return '📅';
    }
  };

  return (
    <div className="leave-management">
      <motion.div 
        className="leave-header"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1>📅 Leave Management</h1>
          <p>Manage and approve employee leave requests</p>
        </div>
        <div className="leave-stats">
          <div className="stat-badge pending">
            <span className="badge-value">{leaveRequests.filter(r => r.status === 'Pending').length}</span>
            <span className="badge-label">Pending</span>
          </div>
          <div className="stat-badge approved">
            <span className="badge-value">{leaveRequests.filter(r => r.status === 'Approved').length}</span>
            <span className="badge-label">Approved</span>
          </div>
          <div className="stat-badge rejected">
            <span className="badge-value">{leaveRequests.filter(r => r.status === 'Rejected').length}</span>
            <span className="badge-label">Rejected</span>
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="filter-section glass"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity:  1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <button 
          className={`filter-btn ${filter === 'All' ? 'active' : ''}`}
          onClick={() => setFilter('All')}
        >
          All ({leaveRequests.length})
        </button>
        <button 
          className={`filter-btn ${filter === 'Pending' ? 'active' : ''}`}
          onClick={() => setFilter('Pending')}
        >
          Pending ({leaveRequests.filter(r => r.status === 'Pending').length})
        </button>
        <button 
          className={`filter-btn ${filter === 'Approved' ? 'active' : ''}`}
          onClick={() => setFilter('Approved')}
        >
          Approved ({leaveRequests.filter(r => r.status === 'Approved').length})
        </button>
        <button 
          className={`filter-btn ${filter === 'Rejected' ?  'active' : ''}`}
          onClick={() => setFilter('Rejected')}
        >
          Rejected ({leaveRequests.filter(r => r.status === 'Rejected').length})
        </button>
      </motion.div>

      <div className="leave-requests-grid">
        {filteredRequests.map((request, index) => (
          <motion.div
            key={request. id}
            className="leave-card glass"
            initial={{ opacity:  0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.02, boxShadow: '0 15px 40px rgba(0, 0, 0, 0.15)' }}
          >
            <div className="leave-card-header">
              <div className="employee-info">
                <div className="employee-avatar">{request.name.charAt(0)}</div>
                <div>
                  <h3>{request.name}</h3>
                  <p className="applied-date">Applied on {new Date(request.appliedOn).toLocaleDateString('en-IN')}</p>
                </div>
              </div>
              <span 
                className="status-badge"
                style={{ background: getStatusColor(request.status) }}
              >
                <span style={{textTransform:'capitalize'}}>{request.status || 'Pending'}</span>
              </span>
            </div>

            <div className="leave-details">
              <div className="detail-row">
                <span className="detail-icon">{getLeaveTypeIcon(request.type)}</span>
                <div className="detail-info">
                  <span className="detail-label">Leave Type</span>
                  <span className="detail-value">{request.type}</span>
                </div>
              </div>

              <div className="detail-row">
                <span className="detail-icon">📆</span>
                <div className="detail-info">
                  <span className="detail-label">Duration</span>
                  <span className="detail-value">
                    {request.from ? new Date(request.from).toLocaleDateString('en-IN') : 'N/A'} - {request.to ? new Date(request.to).toLocaleDateString('en-IN') : 'N/A'}
                  </span>
                </div>
              </div>

              <div className="detail-row">
                <span className="detail-icon">⏰</span>
                <div className="detail-info">
                  <span className="detail-label">Total Days</span>
                  <span className="detail-value">{request.days} {request.days === 1 ? 'day' : 'days'}</span>
                </div>
              </div>

              <div className="detail-row reason-row">
                <span className="detail-icon">📝</span>
                <div className="detail-info">
                  <span className="detail-label">Reason</span>
                  <span className="detail-value">{request.reason}</span>
                </div>
              </div>
            </div>

            {(request.status || '').toLowerCase() === 'pending' && (
              <div className="leave-actions">
                <motion.button
                  className="approve-btn"
                  onClick={() => handleApprove(request.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ✅ Approve
                </motion.button>
                <motion.button
                  className="reject-btn"
                  onClick={() => handleReject(request.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ❌ Reject
                </motion.button>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default LeaveManagement;