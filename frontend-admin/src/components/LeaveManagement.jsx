import { useState } from 'react';
import { useDataStore } from '../store/dataStore';
import { Calendar, Clock, FileText, Check, X, Plane, TreePalm, Stethoscope, User, Baby } from 'lucide-react';
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
    switch((status || '').toLowerCase()) {
      case 'approved': return '#10b981';
      case 'rejected': return '#ef4444';
      case 'pending': return '#f59e0b';
      default: return '#64748b';
    }
  };

  const getLeaveTypeIcon = (type) => {
    switch(type) {
      case 'Sick Leave': return <Stethoscope size={18} />;
      case 'Casual Leave': return <TreePalm size={18} />;
      case 'Vacation': return <Plane size={18} />;
      case 'Personal Leave': return <User size={18} />;
      case 'Maternity Leave': return <Baby size={18} />;
      default: return <Calendar size={18} />;
    }
  };

  return (
    <div className="leave-management-container">
      <div className="lm-header">
        <div>
          <h1>Leave Management</h1>
          <p>Manage and approve employee leave requests</p>
        </div>
        <div className="lm-stats">
          <div className="stat-pill pending">
            <span className="pill-val">{leaveRequests.filter(r => (r.status || '').toLowerCase() === 'pending').length}</span>
            <span className="pill-lab">Pending</span>
          </div>
          <div className="stat-pill approved">
            <span className="pill-val">{leaveRequests.filter(r => (r.status || '').toLowerCase() === 'approved').length}</span>
            <span className="pill-lab">Approved</span>
          </div>
          <div className="stat-pill rejected">
            <span className="pill-val">{leaveRequests.filter(r => (r.status || '').toLowerCase() === 'rejected').length}</span>
            <span className="pill-lab">Rejected</span>
          </div>
        </div>
      </div>

      <div className="lm-filters">
        {['All', 'Pending', 'Approved', 'Rejected'].map(f => (
          <button 
            key={f}
            className={`lm-filter-tab ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f} {f === 'All' ? `(${leaveRequests.length})` : `(${leaveRequests.filter(r => (r.status || '').toLowerCase() === f.toLowerCase()).length})`}
          </button>
        ))}
      </div>

      <div className="lm-grid">
        {filteredRequests.map((request) => (
          <div key={request.id} className="lm-card">
            <div className="lm-card-top">
              <div className="lm-requester">
                <div className="lm-avatar">{request.name.charAt(0)}</div>
                <div>
                  <h3>{request.name}</h3>
                  <p>Applied {new Date(request.appliedOn).toLocaleDateString('en-IN')}</p>
                </div>
              </div>
              <span className="lm-status" style={{ background: `${getStatusColor(request.status)}20`, color: getStatusColor(request.status) }}>
                {request.status || 'Pending'}
              </span>
            </div>

            <div className="lm-details">
              <div className="lm-detail">
                <span className="lm-icon">{getLeaveTypeIcon(request.type)}</span>
                <div className="lm-info">
                  <label>Type</label>
                  <span>{request.type}</span>
                </div>
              </div>
              <div className="lm-detail">
                <span className="lm-icon"><Calendar size={18} /></span>
                <div className="lm-info">
                  <label>Period</label>
                  <span>
                    {request.from ? new Date(request.from).toLocaleDateString('en-IN') : 'N/A'} - {request.to ? new Date(request.to).toLocaleDateString('en-IN') : 'N/A'}
                  </span>
                </div>
              </div>
              <div className="lm-detail">
                <span className="lm-icon"><Clock size={18} /></span>
                <div className="lm-info">
                  <label>Days</label>
                  <span>{request.days} {request.days === 1 ? 'day' : 'days'}</span>
                </div>
              </div>
              <div className="lm-detail full">
                <span className="lm-icon"><FileText size={18} /></span>
                <div className="lm-info">
                  <label>Reason</label>
                  <span>{request.reason}</span>
                </div>
              </div>
            </div>

            {(request.status || '').toLowerCase() === 'pending' && (
              <div className="lm-actions">
                <button className="btn-approve" onClick={() => handleApprove(request.id)}>
                  <Check size={16} /> Approve
                </button>
                <button className="btn-reject" onClick={() => handleReject(request.id)}>
                  <X size={16} /> Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default LeaveManagement;