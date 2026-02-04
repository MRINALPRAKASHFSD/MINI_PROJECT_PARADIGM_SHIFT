import { useState } from 'react';
import { motion } from 'framer-motion';
import './Reports.css';

function Reports() {
  const [selectedPeriod, setSelectedPeriod] = useState('Monthly');

  const reportCards = [
    { 
      id: 1, 
      title: 'Attendance Report', 
      icon: '📊', 
      description: 'Monthly attendance analytics and trends',
      color: '#667eea',
      stats: { present: '89%', absent: '11%' }
    },
    { 
      id: 2, 
      title: 'Leave Report', 
      icon: '📅', 
      description: 'Leave utilization and balance report',
      color: '#f59e0b',
      stats:  { approved: '45', pending: '12' }
    },
    { 
      id: 3, 
      title: 'Payroll Report', 
      icon: '💰', 
      description: 'Salary disbursement and tax summary',
      color: '#10b981',
      stats: { total: '₹45L', processed: '150' }
    },
    { 
      id: 4, 
      title: 'Performance Report', 
      icon: '🎯', 
      description:  'Employee performance metrics',
      color: '#8b5cf6',
      stats: { excellent: '45', good: '89' }
    },
    { 
      id: 5, 
      title: 'Department Report', 
      icon: '🏢', 
      description:  'Department-wise employee distribution',
      color:  '#06b6d4',
      stats: { departments: '8', avgSize: '19' }
    },
    { 
      id: 6, 
      title: 'Recruitment Report', 
      icon: '👥', 
      description: 'Hiring statistics and candidate pipeline',
      color: '#ec4899',
      stats: { hired: '12', pipeline: '28' }
    },
  ];

  const recentReports = [
    { name: 'January Attendance Report', date: '2026-01-01', generatedBy: 'Diya Sharma', format: 'PDF' },
    { name: 'Q4 Payroll Summary', date: '2025-12-28', generatedBy: 'Pratham Verma', format: 'Excel' },
    { name: 'December Leave Report', date: '2025-12-25', generatedBy: 'Aditya Patel', format: 'PDF' },
    { name: 'Annual Performance Review', date: '2025-12-20', generatedBy: 'Mahin Khan', format: 'PDF' },
  ];

  return (
    <div className="reports">
      <motion.div 
        className="reports-header"
        initial={{ opacity: 0, y:  -30 }}
        animate={{ opacity:  1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1>📋 Reports & Analytics</h1>
          <p>Generate and download comprehensive reports</p>
        </div>
        <div className="period-selector">
          {['Weekly', 'Monthly', 'Quarterly', 'Yearly'].map(period => (
            <button
              key={period}
              className={`period-btn ${selectedPeriod === period ? 'active' : ''}`}
              onClick={() => setSelectedPeriod(period)}
            >
              {period}
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div 
        className="reports-grid"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {reportCards.map((report, index) => (
          <motion.div
            key={report. id}
            className="report-card glass"
            style={{ '--report-color': report.color }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity:  1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.05, y: -10 }}
          >
            <div className="report-icon" style={{ background: report.color }}>
              {report.icon}
            </div>
            <h3>{report.title}</h3>
            <p>{report.description}</p>
            <div className="report-stats">
              {Object.entries(report.stats).map(([key, value]) => (
                <div key={key} className="stat-item">
                  <span className="stat-label">{key}: </span>
                  <span className="stat-value">{value}</span>
                </div>
              ))}
            </div>
            <motion.button
              className="generate-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              📥 Generate Report
            </motion.button>
          </motion. div>
        ))}
      </motion.div>

      <motion.div 
        className="recent-reports glass"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y:  0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h2>📄 Recently Generated Reports</h2>
        <div className="reports-list">
          {recentReports.map((report, index) => (
            <motion.div
              key={index}
              className="report-item"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x:  0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ x: 10, backgroundColor: 'rgba(102, 126, 234, 0.05)' }}
            >
              <div className="report-info">
                <div className="report-format-icon">
                  {report. format === 'PDF' ?  '📕' : '📗'}
                </div>
                <div>
                  <h4>{report.name}</h4>
                  <p>Generated by {report.generatedBy} on {new Date(report.date).toLocaleDateString('en-IN')}</p>
                </div>
              </div>
              <motion.button
                className="download-btn"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                ⬇️ Download
              </motion.button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default Reports;