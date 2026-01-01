import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckSquare,
  Target,
  Award,
  Activity,
  Zap
} from 'lucide-react';
import './AnalyticsSimple.css';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('month');

  const performanceStats = [
    {
      label: 'Productivity Score',
      value: '94%',
      change: '+5%',
      trend: 'up',
      icon: TrendingUp,
      color:  '#10b981'
    },
    {
      label: 'Tasks Efficiency',
      value: '87%',
      change: '+3%',
      trend: 'up',
      icon: CheckSquare,
      color: '#3b82f6'
    },
    {
      label:  'Goal Achievement',
      value: '92%',
      change: '+8%',
      trend: 'up',
      icon: Target,
      color: '#a855f7'
    },
    {
      label: 'Quality Score',
      value: '96%',
      change: '+2%',
      trend: 'up',
      icon: Award,
      color: '#f97316'
    }
  ];

  const weeklyData = [
    { day: 'Mon', hours: 8, percentage: 89 },
    { day: 'Tue', hours: 7.5, percentage: 83 },
    { day: 'Wed', hours: 9, percentage: 100 },
    { day: 'Thu', hours: 8.5, percentage: 94 },
    { day: 'Fri', hours: 7, percentage: 78 },
    { day: 'Sat', hours: 4, percentage: 44 },
    { day: 'Sun', hours: 2, percentage: 22 }
  ];

  const projectBreakdown = [
    { name: 'Employee Portal', hours: 45, percentage:  30, color: '#3b82f6' },
    { name: 'API Integration', hours: 38, percentage: 25, color:  '#10b981' },
    { name: 'Dashboard Redesign', hours: 32, percentage: 21, color: '#a855f7' },
    { name: 'Bug Fixes', hours: 24, percentage: 16, color: '#f97316' },
    { name: 'Documentation', hours: 12, percentage: 8, color:  '#ec4899' }
  ];

  const skillsData = [
    { skill: 'Coding', score: 95, color: '#3b82f6' },
    { skill: 'Problem Solving', score: 88, color: '#10b981' },
    { skill: 'Communication', score: 92, color: '#a855f7' },
    { skill: 'Time Management', score: 85, color: '#f97316' },
    { skill: 'Teamwork', score: 90, color: '#ec4899' },
    { skill: 'Leadership', score: 78, color: '#eab308' }
  ];

  const monthlyTrend = [
    { month: 'Jul', value: 75 },
    { month: 'Aug', value: 78 },
    { month: 'Sep', value: 82 },
    { month: 'Oct', value: 85 },
    { month: 'Nov', value: 88 },
    { month: 'Dec', value: 91 },
    { month: 'Jan', value: 94 }
  ];

  return (
    <div className="analytics-simple dark">
      <div className="analytics-header">
        <div className="header-left">
          <motion.div 
            className="header-icon"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <BarChart3 size={28} />
          </motion.div>
          <div>
            <h1>Analytics Dashboard</h1>
            <p>Track your performance and productivity metrics</p>
          </div>
        </div>
        <div className="time-range-selector">
          <button 
            className={timeRange === 'week' ? 'active' : ''}
            onClick={() => setTimeRange('week')}
          >
            Week
          </button>
          <button 
            className={timeRange === 'month' ? 'active' : ''}
            onClick={() => setTimeRange('month')}
          >
            Month
          </button>
          <button 
            className={timeRange === 'year' ? 'active' : ''}
            onClick={() => setTimeRange('year')}
          >
            Year
          </button>
        </div>
      </div>

      {/* Performance Stats */}
      <div className="performance-stats">
        {performanceStats.map((stat, index) => (
          <motion.div
            key={index}
            className="performance-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
          >
            <div className="performance-icon" style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>
              <stat.icon size={24} />
            </div>
            <div className="performance-info">
              <span className="performance-label">{stat.label}</span>
              <div className="performance-value-row">
                <span className="performance-value">{stat.value}</span>
                <span className={`performance-change ${stat.trend}`}>
                  {stat.trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  {stat.change}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* Weekly Bar Chart */}
        <motion.div 
          className="chart-card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x:  0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="chart-header">
            <div className="chart-title">
              <Activity size={22} />
              <h3>Weekly Activity</h3>
            </div>
          </div>
          <div className="bar-chart-container">
            {weeklyData.map((data, index) => (
              <div key={index} className="bar-item">
                <motion.div 
                  className="bar-fill"
                  initial={{ height: 0 }}
                  animate={{ height: `${data.percentage}%` }}
                  transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
                >
                  <span className="bar-value">{data.hours}h</span>
                </motion.div>
                <span className="bar-label">{data.day}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Project Breakdown */}
        <motion.div 
          className="chart-card"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity:  1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="chart-header">
            <div className="chart-title">
              <Target size={22} />
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
                  <div className="project-color" style={{ backgroundColor: project.color }} />
                  <span className="project-name">{project.name}</span>
                  <span className="project-hours">{project.hours}h</span>
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

        {/* Skills Radar (Circular) */}
        <motion. div 
          className="chart-card"
          initial={{ opacity:  0, y: 20 }}
          animate={{ opacity: 1, y:  0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="chart-header">
            <div className="chart-title">
              <Zap size={22} />
              <h3>Skills Performance</h3>
            </div>
          </div>
          <div className="skills-grid">
            {skillsData. map((skill, index) => (
              <motion.div
                key={index}
                className="skill-item"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <div className="skill-circle">
                  <svg viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" className="skill-bg" />
                    <motion.circle 
                      cx="50" 
                      cy="50" 
                      r="45" 
                      className="skill-progress"
                      style={{ stroke: skill.color }}
                      initial={{ strokeDashoffset: 283 }}
                      animate={{ strokeDashoffset: 283 - (283 * skill.score) / 100 }}
                      transition={{ duration: 1, delay: 0.6 + index * 0.1 }}
                    />
                  </svg>
                  <div className="skill-score">{skill.score}%</div>
                </div>
                <span className="skill-name">{skill.skill}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Monthly Trend Line */}
        <motion.div 
          className="chart-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y:  0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="chart-header">
            <div className="chart-title">
              <TrendingUp size={22} />
              <h3>Productivity Trend</h3>
            </div>
          </div>
          <div className="line-chart-container">
            <svg viewBox="0 0 700 200" className="line-chart">
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#667eea" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#667eea" stopOpacity="0" />
                </linearGradient>
              </defs>
              
              {/* Grid lines */}
              {[0, 25, 50, 75, 100].map((y) => (
                <line 
                  key={y}
                  x1="0" 
                  y1={200 - (y * 2)} 
                  x2="700" 
                  y2={200 - (y * 2)}
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="1"
                />
              ))}
              
              {/* Area fill */}
              <motion.path
                d={`M 0 ${200 - monthlyTrend[0].value * 2} ${monthlyTrend. map((d, i) => 
                  `L ${(i * 100) + 50} ${200 - d.value * 2}`
                ).join(' ')} L 700 200 L 0 200 Z`}
                fill="url(#gradient)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.6 }}
              />
              
              {/* Line */}
              <motion.path
                d={`M 0 ${200 - monthlyTrend[0].value * 2} ${monthlyTrend.map((d, i) => 
                  `L ${(i * 100) + 50} ${200 - d.value * 2}`
                ).join(' ')}`}
                stroke="#667eea"
                strokeWidth="3"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, delay: 0.7 }}
              />
              
              {/* Points */}
              {monthlyTrend.map((d, i) => (
                <motion.circle
                  key={i}
                  cx={(i * 100) + 50}
                  cy={200 - d.value * 2}
                  r="5"
                  fill="#667eea"
                  initial={{ scale: 0 }}
                  animate={{ scale:  1 }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                />
              ))}
              
              {/* Labels */}
              {monthlyTrend.map((d, i) => (
                <text
                  key={i}
                  x={(i * 100) + 50}
                  y="195"
                  fill="#9ca3af"
                  fontSize="12"
                  textAnchor="middle"
                >
                  {d.month}
                </text>
              ))}
            </svg>
          </div>
        </motion. div>
      </div>
    </div>
  );
};

export default Analytics;