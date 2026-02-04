import { useState } from 'react';
import { motion } from 'framer-motion';
import './LeaveManagement.css';

function LeaveManagement() {
  const [leaveRequests, setLeaveRequests] = useState([
    {
      id: 1,
      name: 'Diya Sharma',
      type: 'Sick Leave',
      from: '2026-01-05',
      to: '2026-01-07',
      days: 3,
      reason: 'Medical checkup and recovery',
      status: 'Pending',
      appliedOn: '2026-01-02'
    },
    {
      id: 2,
      name: 'Pratham Verma',
      type: 'Casual Leave',
      from: '2026-01-10',
      to: '2026-01-12',
      days: 3,
      reason: 'Family function',
      status: 'Pending',
      appliedOn: '2026-01-02'
    },
    {
      id: 3,
      name: 'Aditya Patel',
      type:  'Vacation',
      from: '2026-01-15',
      to: '2026-01-20',
      days: 6,
      reason: 'Family vacation to Goa',
      status: 'Approved',
      appliedOn: '2025-12-28'
    },
    {
      id: 4,
      name: 'Mahin Khan',
      type: 'Sick Leave',
      from: '2026-01-03',
      to: '2026-01-04',
      days: 2,
      reason: 'Fever and cold',
      status: 'Approved',
      appliedOn: '2026-01-01'
    },
    {
      id: 5,
      name: 'Ishan Singh',
      type: 'Personal Leave',
      from: '2026-01-08',
      to: '2026-01-09',
      days: 2,
      reason: 'Personal work',
      status: 'Pending',
      appliedOn: '2026-01-02'
    },
    {
      id: 6,
      name: 'Priya Gupta',
      type: 'Maternity Leave',
      from: '2026-02-01',
      to: '2026-05-01',
      days: 90,
      reason: 'Maternity leave',
      status:  'Approved',
      appliedOn: '2025-12-15'
    },
    {
      id: 7,
      name: 'Arjun Reddy',
      type:  'Casual Leave',
      from: '2026-01-06',
      to: '2026-01-06',
      days: 1,
      reason: 'Wedding to attend',
      status: 'Rejected',
      appliedOn: '2026-01-01'
    },
  ]);

  const [filter, setFilter] = useState('All');

  const handleApprove = (id) => {
    setLeaveRequests(leaveRequests.map(req =>
      req.id === id ?  { ...req, status: 'Approved' } : req
    ));
  };

  const handleReject = (id) => {
    setLeaveRequests(leaveRequests.map(req =>
      req.id === id ? { ...req, status: 'Rejected' } : req
    ));
  };

  const filteredRequests = filter === 'All' 
    ? leaveRequests 
    : leaveRequests.filter(req => req.status === filter);

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
                {request.status}
              </span>
            </div>

            <div className="leave-details">
              <div className="detail-row">
                <span className="detail-icon">{getLeaveTypeIcon(request.type)}</span>
                <div className="detail-info">
                  <span className="detail-label">Leave Type</span>
                  <span className="detail-value">{request. type}</span>
                </div>
              </div>

              <div className="detail-row">
                <span className="detail-icon">📆</span>
                <div className="detail-info">
                  <span className="detail-label">Duration</span>
                  <span className="detail-value">
                    {new Date(request.from).toLocaleDateString('en-IN')} - {new Date(request.to).toLocaleDateString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="detail-row">
                <span className="detail-icon">⏰</span>
                <div className="detail-info">
                  <span className="detail-label">Total Days</span>
                  <span className="detail-value">{request.days} {request.days === 1 ?  'day' : 'days'}</span>
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

            {request.status === 'Pending' && (
              <div className="leave-actions">
                <motion.button
                  className="approve-btn"
                  onClick={() => handleApprove(request. id)}
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