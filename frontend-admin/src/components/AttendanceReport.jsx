import { useState } from 'react';
import { motion } from 'framer-motion';
import './AttendanceReport.css';

function AttendanceReport() {
  const [attendanceData] = useState([
    { id: 1, name: 'Diya Sharma', department: 'IT', checkIn: '09:00 AM', checkOut: '06:00 PM', status: 'Present', hours: 9 },
    { id: 2, name: 'Pratham Verma', department: 'HR', checkIn: '09:15 AM', checkOut: '06:15 PM', status: 'Present', hours: 9 },
    { id: 3, name: 'Aditya Patel', department:  'Sales', checkIn: '--', checkOut: '--', status:  'On Leave', hours: 0 },
    { id: 4, name: 'Mahin Khan', department: 'Marketing', checkIn: '09:05 AM', checkOut: '06:10 PM', status: 'Present', hours: 9 },
    { id: 5, name: 'Ishan Singh', department: 'Finance', checkIn: '09:30 AM', checkOut: '06:30 PM', status: 'Late', hours: 9 },
    { id: 6, name: 'Priya Gupta', department: 'IT', checkIn: '08:55 AM', checkOut: '06:05 PM', status: 'Present', hours: 9 },
    { id: 7, name: 'Arjun Reddy', department: 'Sales', checkIn: '09:00 AM', checkOut: '06:00 PM', status: 'Present', hours: 9 },
    { id: 8, name:  'Ananya Desai', department: 'HR', checkIn: '--', checkOut: '--', status:  'Absent', hours: 0 },
    { id: 9, name: 'Rohan Kapoor', department: 'IT', checkIn: '09:10 AM', checkOut: '06:15 PM', status: 'Present', hours: 9 },
    { id: 10, name: 'Sneha Iyer', department: 'Marketing', checkIn: '08:50 AM', checkOut: '05:50 PM', status: 'Present', hours: 9 },
  ]);

  const [filter, setFilter] = useState('All');

  const filteredData = filter === 'All' 
    ? attendanceData 
    : attendanceData. filter(emp => emp.status === filter);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Present': return '#4ade80';
      case 'Absent': return '#f87171';
      case 'Late': return '#fbbf24';
      case 'On Leave': return '#60a5fa';
      default:  return '#64748b';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Present': return '✅';
      case 'Absent': return '❌';
      case 'Late':  return '⏰';
      case 'On Leave': return '🏖️';
      default: return '❓';
    }
  };

  return (
    <div className="attendance-report">
      <motion.div 
        className="attendance-header"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity:  1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1>📈 Attendance Report</h1>
          <p>Today's attendance overview - {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month:  'long', day: 'numeric' })}</p>
        </div>
      </motion.div>

      <motion.div 
        className="attendance-stats"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="stat-card glass" style={{ borderLeft: '4px solid #4ade80' }}>
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>{attendanceData.filter(e => e.status === 'Present' || e.status === 'Late').length}</h3>
            <p>Present Today</p>
          </div>
        </div>
        <div className="stat-card glass" style={{ borderLeft: '4px solid #f87171' }}>
          <div className="stat-icon">❌</div>
          <div className="stat-info">
            <h3>{attendanceData.filter(e => e.status === 'Absent').length}</h3>
            <p>Absent</p>
          </div>
        </div>
        <div className="stat-card glass" style={{ borderLeft: '4px solid #fbbf24' }}>
          <div className="stat-icon">⏰</div>
          <div className="stat-info">
            <h3>{attendanceData.filter(e => e. status === 'Late').length}</h3>
            <p>Late Arrivals</p>
          </div>
        </div>
        <div className="stat-card glass" style={{ borderLeft: '4px solid #60a5fa' }}>
          <div className="stat-icon">🏖️</div>
          <div className="stat-info">
            <h3>{attendanceData.filter(e => e.status === 'On Leave').length}</h3>
            <p>On Leave</p>
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="filter-section glass"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration:  0.5, delay: 0.2 }}
      >
        <button 
          className={`filter-btn ${filter === 'All' ? 'active' : ''}`}
          onClick={() => setFilter('All')}
        >
          All ({attendanceData.length})
        </button>
        <button 
          className={`filter-btn ${filter === 'Present' ? 'active' : ''}`}
          onClick={() => setFilter('Present')}
        >
          Present ({attendanceData.filter(e => e.status === 'Present').length})
        </button>
        <button 
          className={`filter-btn ${filter === 'Late' ? 'active' : ''}`}
          onClick={() => setFilter('Late')}
        >
          Late ({attendanceData. filter(e => e.status === 'Late').length})
        </button>
        <button 
          className={`filter-btn ${filter === 'Absent' ? 'active' : ''}`}
          onClick={() => setFilter('Absent')}
        >
          Absent ({attendanceData.filter(e => e.status === 'Absent').length})
        </button>
        <button 
          className={`filter-btn ${filter === 'On Leave' ? 'active' : ''}`}
          onClick={() => setFilter('On Leave')}
        >
          On Leave ({attendanceData.filter(e => e.status === 'On Leave').length})
        </button>
      </motion.div>

      <motion.div 
        className="attendance-table glass"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration:  0.5, delay: 0.3 }}
      >
        <table>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Department</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Hours</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((employee, index) => (
              <motion.tr
                key={employee. id}
                initial={{ opacity:  0, x: -20 }}
                animate={{ opacity: 1, x:  0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <td>
                  <div className="employee-cell">
                    <div className="employee-avatar">{employee.name.charAt(0)}</div>
                    <span className="employee-name">{employee.name}</span>
                  </div>
                </td>
                <td>{employee.department}</td>
                <td>{employee.checkIn}</td>
                <td>{employee.checkOut}</td>
                <td>{employee.hours}h</td>
                <td>
                  <span 
                    className="status-badge"
                    style={{ background: getStatusColor(employee.status) }}
                  >
                    {getStatusIcon(employee.status)} {employee.status}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}

export default AttendanceReport;