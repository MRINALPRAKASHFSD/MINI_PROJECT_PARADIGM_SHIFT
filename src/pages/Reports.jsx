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
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import './Reports.css';

const Reports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const reportStats = [
    { 
      label: 'Total Hours', 
      value: '168h', 
      change: '+12%', 
      icon: Clock,
      color: '#3b82f6' 
    },
    { 
      label: 'Tasks Completed', 
      value:  '47', 
      change: '+8%', 
      icon: CheckSquare,
      color: '#10b981' 
    },
    { 
      label:  'Projects', 
      value: '8', 
      change: '+2', 
      icon: Award,
      color: '#a855f7' 
    },
    { 
      label: 'Efficiency', 
      value: '94%', 
      change: '+5%', 
      icon:  TrendingUp,
      color: '#f97316' 
    }
  ];

  const weeklyData = [
    { day: 'Mon', hours: 8, tasks: 6 },
    { day: 'Tue', hours: 7.5, tasks: 5 },
    { day: 'Wed', hours: 9, tasks: 7 },
    { day: 'Thu', hours: 8.5, tasks: 6 },
    { day: 'Fri', hours: 7, tasks: 5 },
    { day: 'Sat', hours: 4, tasks: 3 },
    { day: 'Sun', hours: 2, tasks: 1 }
  ];

  const projectBreakdown = [
    { name: 'Employee Portal', hours: 45, percentage: 30, color: '#3b82f6' },
    { name: 'API Integration', hours: 38, percentage: 25, color:  '#10b981' },
    { name: 'Dashboard Redesign', hours: 32, percentage: 21, color: '#a855f7' },
    { name: 'Bug Fixes', hours: 24, percentage: 16, color: '#f97316' },
    { name: 'Documentation', hours: 12, percentage: 8, color:  '#ec4899' }
  ];

  const recentReports = [
    {
      id: 1,
      title: 'January 2025 - Monthly Report',
      date: '2025-01-31',
      type: 'Monthly',
      size: '2.4 MB',
      status: 'completed'
    },
    {
      id: 2,
      title: 'Q4 2024 - Quarterly Report',
      date: '2024-12-31',
      type: 'Quarterly',
      size: '5.8 MB',
      status: 'completed'
    },
    {
      id: 3,
      title: 'December 2024 - Monthly Report',
      date: '2024-12-31',
      type: 'Monthly',
      size: '2.1 MB',
      status: 'completed'
    },
    {
      id: 4,
      title: 'November 2024 - Monthly Report',
      date: '2024-11-30',
      type: 'Monthly',
      size: '2.3 MB',
      status: 'completed'
    }
  ];

  const maxHours = Math.max(...weeklyData.map(d => d.hours));

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
        >
          <Download size={20} />
          Generate Report
        </motion.button>
      </div>

      {/* Stats */}
      <div className="reports-stats">
        {reportStats.map((stat, index) => (
          <motion.div
            key={index}
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
          >
            <div className="stat-icon" style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>
              <stat.icon size={24} />
            </div>
            <div className="stat-content">
              <span className="stat-label">{stat.label}</span>
              <div className="stat-value-row">
                <span className="stat-value">{stat.value}</span>
                <span className="stat-change positive">{stat.change}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="reports-grid">
        {/* Weekly Activity Chart */}
        <motion.div 
          className="report-card chart-card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay:  0.2 }}
        >
          <div className="card-header">
            <div className="card-title">
              <Activity size={22} />
              <h3>Weekly Activity</h3>
            </div>
            <div className="period-selector">
              <button 
                className={selectedPeriod === 'week' ? 'active' : ''}
                onClick={() => setSelectedPeriod('week')}
              >
                Week
              </button>
              <button 
                className={selectedPeriod === 'month' ? 'active' : ''}
                onClick={() => setSelectedPeriod('month')}
              >
                Month
              </button>
              <button 
                className={selectedPeriod === 'year' ? 'active' : ''}
                onClick={() => setSelectedPeriod('year')}
              >
                Year
              </button>
            </div>
          </div>
          
          <div className="chart-container">
            <div className="bar-chart">
              {weeklyData.map((data, index) => (
                <div key={index} className="bar-group">
                  <motion.div 
                    className="bar"
                    initial={{ height: 0 }}
                    animate={{ height: `${(data.hours / maxHours) * 100}%` }}
                    transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
                  >
                    <span className="bar-value">{data.hours}h</span>
                  </motion. div>
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
          transition={{ delay: 0.3 }}
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
                transition={{ delay:  0.4 + index * 0.1 }}
              >
                <div className="project-info">
                  <div 
                    className="project-color" 
                    style={{ backgroundColor:  project.color }}
                  />
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
                      transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
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
        animate={{ opacity:  1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="section-header">
          <h3>Recent Reports</h3>
          <button className="filter-btn">
            <Filter size={18} />
            Filter
          </button>
        </div>

        <div className="reports-list">
          {recentReports.map((report, index) => (
            <motion.div
              key={report.id}
              className="report-item"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x:  0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
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