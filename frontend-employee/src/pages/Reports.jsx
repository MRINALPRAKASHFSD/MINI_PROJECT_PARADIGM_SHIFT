import { useEffect, useState } from 'react';
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
import { auth, realtimeDb } from '../config/firebase';
import { ref, onValue, push } from 'firebase/database';
import './Reports.css';

const Reports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [stats, setStats] = useState({});
  const [weeklyData, setWeeklyData] = useState([]);
  const [projectBreakdown, setProjectBreakdown] = useState([]);
  const [recentReports, setRecentReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get current user UID
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (!currentUser) return;

    const userRef = ref(realtimeDb, `users/${currentUser.uid}`);

    // Stats (hours, tasks, projects, efficiency)
    onValue(ref(realtimeDb, `users/${currentUser.uid}/stats`), snap => {
      setStats(snap.val() || {});
    });

    // Weekly Activity
    onValue(ref(realtimeDb, `users/${currentUser.uid}/weeklyActivity`), snap => {
      setWeeklyData(snap.val() || []);
    });

    // Project Breakdown
    onValue(ref(realtimeDb, `users/${currentUser.uid}/projectBreakdown`), snap => {
      setProjectBreakdown(snap.val() || []);
    });

    // Recent Reports
    onValue(ref(realtimeDb, `users/${currentUser.uid}/reports`), snap => {
      const arr = snap.val() ? Object.values(snap.val()) : [];
      setRecentReports(arr.reverse());
      setLoading(false);
    });
  }, [currentUser]);

  // If user not loaded yet
  if (!currentUser) return <div>Loading user...</div>;

  // Helper for maxHeight in bar
  const maxHours = weeklyData.length ? Math.max(...weeklyData.map(d => d.hours)) : 0;

  // Handle "Generate Report" (creates a new report in DB)
  const handleGenerateReport = () => {
    const newReport = {
      id: Date.now(),
      title: `${new Date().toLocaleString('en-us', { month: 'long' })} ${new Date().getFullYear()} - Monthly Report`,
      date: new Date().toISOString().split('T')[0],
      type: selectedPeriod === 'month' ? 'Monthly' : selectedPeriod === 'week' ? 'Weekly' : 'Yearly',
      size: `${(Math.random()*3+2).toFixed(1)} MB`,
      status: 'completed'
    };
    push(ref(realtimeDb, `users/${currentUser.uid}/reports`), newReport);
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
        <motion.div
          className="stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="stat-icon" style={{ backgroundColor: "#3b82f620", color: "#3b82f6" }}>
            <Clock size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Total Hours</span>
            <div className="stat-value-row">
              <span className="stat-value">{stats.totalHours || 0}h</span>
              <span className="stat-change positive">{stats.hoursChange || '+0%'}</span>
            </div>
          </div>
        </motion.div>
        <motion.div
          className="stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="stat-icon" style={{ backgroundColor: "#10b98120", color: "#10b981" }}>
            <CheckSquare size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Tasks Completed</span>
            <div className="stat-value-row">
              <span className="stat-value">{stats.tasksCompleted || 0}</span>
              <span className="stat-change positive">{stats.tasksChange || '+0%'}</span>
            </div>
          </div>
        </motion.div>
        <motion.div
          className="stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="stat-icon" style={{ backgroundColor: "#a855f720", color: "#a855f7" }}>
            <Award size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Projects</span>
            <div className="stat-value-row">
              <span className="stat-value">{stats.projects || 0}</span>
              <span className="stat-change positive">{stats.projectsChange || '+0'}</span>
            </div>
          </div>
        </motion.div>
        <motion.div
          className="stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="stat-icon" style={{ backgroundColor: "#f9731620", color: "#f97316" }}>
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Efficiency</span>
            <div className="stat-value-row">
              <span className="stat-value">{stats.efficiency || 0}%</span>
              <span className="stat-change positive">{stats.efficiencyChange || '+0%'}</span>
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
      >
        <div className="section-header">
          <h3>Recent Reports</h3>
          <button className="filter-btn">
            <Filter size={18} />
            Filter
          </button>
        </div>
        <div className="reports-list">
          {loading ? (
            <div>Loading reports...</div>
          ) : (
            recentReports.map((report, index) => (
              <motion.div
                key={report.id}
                className="report-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x:  0 }}
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
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Reports;