import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Download, 
  Filter,
  Calendar,
  TrendingUp,
  Clock,
  CheckSquare,
  Award,
  PieChart,
  Activity
} from 'lucide-react';
import './Reports.css';

// ============================================================
// Static data
// ============================================================
const STATIC_STATS = {
  totalHours: 168,
  hoursChange: '+12%',
  tasksCompleted: 47,
  tasksChange: '+8%',
  projects: 6,
  projectsChange: '+2',
  efficiency: 94,
  efficiencyChange: '+5%',
};

const STATIC_WEEKLY_DATA = [
  { day: 'Mon', hours: 8.5 },
  { day: 'Tue', hours: 7.0 },
  { day: 'Wed', hours: 9.0 },
  { day: 'Thu', hours: 8.0 },
  { day: 'Fri', hours: 7.5 },
  { day: 'Sat', hours: 4.0 },
  { day: 'Sun', hours: 2.0 },
];

const STATIC_PROJECT_BREAKDOWN = [
  { name: 'Karmachari Portal', hours: 45, percentage: 30, color: '#3b82f6' },
  { name: 'Razorpay Integration', hours: 38, percentage: 25, color: '#10b981' },
  { name: 'Dashboard Redesign', hours: 32, percentage: 21, color: '#a855f7' },
  { name: 'Aadhaar KYC Module', hours: 24, percentage: 16, color: '#f97316' },
  { name: 'Technical Docs', hours: 12, percentage: 8, color: '#ec4899' },
];

const STATIC_REPORTS = [
  { id: 1, title: 'January 2025 - Monthly Report', date: '2025-01-31', type: 'Monthly', size: '3.2 MB', status: 'completed' },
  { id: 2, title: 'December 2024 - Monthly Report', date: '2024-12-31', type: 'Monthly', size: '2.8 MB', status: 'completed' },
  { id: 3, title: 'Q4 2024 - Quarterly Report', date: '2024-12-31', type: 'Quarterly', size: '5.1 MB', status: 'completed' },
  { id: 4, title: 'November 2024 - Monthly Report', date: '2024-11-30', type: 'Monthly', size: '2.5 MB', status: 'completed' },
];

// ============================================================
// Reports Component
// ============================================================
const Reports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [stats] = useState(STATIC_STATS);
  const [weeklyData] = useState(STATIC_WEEKLY_DATA);
  const [projectBreakdown] = useState(STATIC_PROJECT_BREAKDOWN);
  const [recentReports, setRecentReports] = useState(STATIC_REPORTS);

  const maxHours = weeklyData.length ? Math.max(...weeklyData.map(d => d.hours)) : 0;

  const handleGenerateReport = () => {
    const newReport = {
      id: Date.now(),
      title: `${new Date().toLocaleString('en-us', { month: 'long' })} ${new Date().getFullYear()} - ${selectedPeriod === 'month' ? 'Monthly' : selectedPeriod === 'week' ? 'Weekly' : 'Yearly'} Report`,
      date: new Date().toISOString().split('T')[0],
      type: selectedPeriod === 'month' ? 'Monthly' : selectedPeriod === 'week' ? 'Weekly' : 'Yearly',
      size: `${(Math.random() * 3 + 2).toFixed(1)} MB`,
      status: 'completed'
    };
    setRecentReports(prev => [newReport, ...prev]);
  };

  return (
    <div className="reports-container dark">
      <div className="reports-header">
        <div className="header-left">
          <motion.div 
            className="header-icon"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <FileText size={28} />
          </motion.div>
          <div>
            <h1>Reports</h1>
            <p>View and download your performance reports</p>
          </div>
        </div>
        <motion.button 
          className="btn-primary"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleGenerateReport}
        >
          <Download size={20} />
          Generate Report
        </motion.button>
      </div>

      {/* Stats */}
      <div className="reports-stats">
        <motion.div className="stat-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="stat-icon" style={{ backgroundColor: "#3b82f620", color: "#3b82f6" }}>
            <Clock size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Total Hours</span>
            <div className="stat-value-row">
              <span className="stat-value">{stats.totalHours}h</span>
              <span className="stat-change positive">{stats.hoursChange}</span>
            </div>
          </div>
        </motion.div>
        <motion.div className="stat-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="stat-icon" style={{ backgroundColor: "#10b98120", color: "#10b981" }}>
            <CheckSquare size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Tasks Completed</span>
            <div className="stat-value-row">
              <span className="stat-value">{stats.tasksCompleted}</span>
              <span className="stat-change positive">{stats.tasksChange}</span>
            </div>
          </div>
        </motion.div>
        <motion.div className="stat-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="stat-icon" style={{ backgroundColor: "#a855f720", color: "#a855f7" }}>
            <Award size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Projects</span>
            <div className="stat-value-row">
              <span className="stat-value">{stats.projects}</span>
              <span className="stat-change positive">{stats.projectsChange}</span>
            </div>
          </div>
        </motion.div>
        <motion.div className="stat-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="stat-icon" style={{ backgroundColor: "#f9731620", color: "#f97316" }}>
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Efficiency</span>
            <div className="stat-value-row">
              <span className="stat-value">{stats.efficiency}%</span>
              <span className="stat-change positive">{stats.efficiencyChange}</span>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="reports-grid">
        {/* Weekly Activity Chart */}
        <motion.div 
          className="report-card chart-card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="card-header">
            <div className="card-title">
              <Activity size={22} />
              <h3>Weekly Activity</h3>
            </div>
            <div className="period-selector">
              <button className={selectedPeriod === 'week' ? 'active' : ''} onClick={() => setSelectedPeriod('week')}>Week</button>
              <button className={selectedPeriod === 'month' ? 'active' : ''} onClick={() => setSelectedPeriod('month')}>Month</button>
              <button className={selectedPeriod === 'year' ? 'active' : ''} onClick={() => setSelectedPeriod('year')}>Year</button>
            </div>
          </div>
          <div className="chart-container">
            <div className="bar-chart">
              {weeklyData.map((data, index) => (
                <div key={index} className="bar-group">
                  <motion.div 
                    className="bar"
                    initial={{ height: 0 }}
                    animate={{ height: `${maxHours !== 0 ? (data.hours / maxHours) * 100 : 0}%` }}
                    transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
                  >
                    <span className="bar-value">{data.hours}h</span>
                  </motion.div>
                  <span className="bar-label">{data.day}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Project Breakdown */}
        <motion.div 
          className="report-card"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="card-header">
            <div className="card-title">
              <PieChart size={22} />
              <h3>Project Breakdown</h3>
            </div>
          </div>
          <div className="project-list">
            {projectBreakdown.map((project, index) => (
              <motion.div
                key={index}
                className="project-item"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
              >
                <div className="project-info">
                  <div className="project-color" style={{ backgroundColor: project.color }} />
                  <div className="project-details">
                    <span className="project-name">{project.name}</span>
                    <span className="project-hours">{project.hours}h</span>
                  </div>
                </div>
                <div className="project-progress">
                  <div className="progress-bar">
                    <motion.div
                      className="progress-fill"
                      style={{ backgroundColor: project.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${project.percentage}%` }}
                      transition={{ duration: 1, delay: 0.2 + index * 0.1 }}
                    />
                  </div>
                  <span className="progress-percentage">{project.percentage}%</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Reports */}
      <motion.div 
        className="recent-reports"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="section-header">
          <h3>Recent Reports</h3>
          <button className="filter-btn">
            <Filter size={18} />
            Filter
          </button>
        </div>
        <div className="reports-list">
          {recentReports.map((report) => (
            <motion.div
              key={report.id}
              className="report-item"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ x: 5 }}
            >
              <div className="report-icon">
                <FileText size={24} />
              </div>
              <div className="report-details">
                <h4>{report.title}</h4>
                <div className="report-meta">
                  <span>
                    <Calendar size={14} />
                    {report.date}
                  </span>
                  <span className="report-type">{report.type}</span>
                  <span>{report.size}</span>
                </div>
              </div>
              <motion.button
                className="download-btn"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Download size={20} />
              </motion.button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Reports;