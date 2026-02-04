import { useState } from 'react';
import { motion } from 'framer-motion';
import './Departments.css';

function Departments() {
  const [departments] = useState([
    {
      id: 1,
      name: 'Information Technology',
      shortName: 'IT',
      icon: '💻',
      color: '#667eea',
      head: 'Diya Sharma',
      employees: 45,
      budget: '₹50L',
      description: 'Software development, system administration, and IT support',
      projects: 12,
      performance: 92
    },
    {
      id: 2,
      name:  'Human Resources',
      shortName: 'HR',
      icon: '👥',
      color: '#f59e0b',
      head: 'Pratham Verma',
      employees:  15,
      budget: '₹20L',
      description: 'Recruitment, employee relations, and training',
      projects: 8,
      performance: 88
    },
    {
      id: 3,
      name: 'Sales & Marketing',
      shortName: 'Sales',
      icon: '📈',
      color: '#10b981',
      head: 'Aditya Patel',
      employees: 32,
      budget: '₹35L',
      description: 'Business development, client relations, and market research',
      projects: 15,
      performance: 85
    },
    {
      id:  4,
      name: 'Finance & Accounts',
      shortName: 'Finance',
      icon: '💰',
      color: '#8b5cf6',
      head: 'Ishan Singh',
      employees: 18,
      budget: '₹25L',
      description: 'Financial planning, accounting, and budget management',
      projects: 6,
      performance: 90
    },
    {
      id: 5,
      name: 'Operations',
      shortName: 'Operations',
      icon: '⚙️',
      color:  '#06b6d4',
      head: 'Priya Gupta',
      employees: 28,
      budget: '₹30L',
      description: 'Process optimization, logistics, and quality control',
      projects: 10,
      performance: 87
    },
    {
      id: 6,
      name:  'Research & Development',
      shortName:  'R&D',
      icon: '🔬',
      color: '#ec4899',
      head: 'Arjun Reddy',
      employees: 22,
      budget: '₹40L',
      description: 'Innovation, product development, and technology research',
      projects: 9,
      performance: 94
    },
    {
      id: 7,
      name: 'Customer Support',
      shortName: 'Support',
      icon: '🎧',
      color: '#f97316',
      head: 'Sneha Iyer',
      employees: 20,
      budget: '₹18L',
      description: 'Customer service, technical support, and complaint resolution',
      projects: 5,
      performance: 89
    },
    {
      id: 8,
      name: 'Legal & Compliance',
      shortName: 'Legal',
      icon: '⚖️',
      color:  '#64748b',
      head: 'Rohan Kapoor',
      employees: 10,
      budget: '₹22L',
      description: 'Legal matters, compliance, and regulatory affairs',
      projects: 4,
      performance: 91
    },
  ]);

  const totalEmployees = departments.reduce((sum, dept) => sum + dept.employees, 0);
  const totalProjects = departments.reduce((sum, dept) => sum + dept.projects, 0);
  const avgPerformance = Math.round(
    departments.reduce((sum, dept) => sum + dept.performance, 0) / departments.length
  );

  return (
    <div className="departments">
      <motion.div 
        className="departments-header"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity:  1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1>🏢 Departments</h1>
          <p>Manage organizational departments and teams</p>
        </div>
        <motion.button
          className="add-dept-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ➕ Add Department
        </motion.button>
      </motion. div>

      <motion.div 
        className="departments-overview"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y:  0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="overview-card glass">
          <div className="overview-icon" style={{ background: '#667eea' }}>🏢</div>
          <div className="overview-info">
            <h3>{departments.length}</h3>
            <p>Total Departments</p>
          </div>
        </div>
        <div className="overview-card glass">
          <div className="overview-icon" style={{ background:  '#10b981' }}>👥</div>
          <div className="overview-info">
            <h3>{totalEmployees}</h3>
            <p>Total Employees</p>
          </div>
        </div>
        <div className="overview-card glass">
          <div className="overview-icon" style={{ background: '#f59e0b' }}>📊</div>
          <div className="overview-info">
            <h3>{totalProjects}</h3>
            <p>Active Projects</p>
          </div>
        </div>
        <div className="overview-card glass">
          <div className="overview-icon" style={{ background: '#8b5cf6' }}>⭐</div>
          <div className="overview-info">
            <h3>{avgPerformance}%</h3>
            <p>Avg Performance</p>
          </div>
        </div>
      </motion.div>

      <div className="departments-grid">
        {departments.map((dept, index) => (
          <motion.div
            key={dept. id}
            className="department-card glass"
            style={{ '--dept-color': dept.color }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.05, y: -10 }}
          >
            <div className="dept-header">
              <div className="dept-icon" style={{ background: dept.color }}>
                {dept.icon}
              </div>
              <div className="dept-title">
                <h3>{dept.name}</h3>
                <span className="dept-short">{dept.shortName}</span>
              </div>
            </div>

            <p className="dept-description">{dept.description}</p>

            <div className="dept-head">
              <div className="head-avatar">{dept.head. charAt(0)}</div>
              <div>
                <span className="head-label">Department Head</span>
                <span className="head-name">{dept.head}</span>
              </div>
            </div>

            <div className="dept-stats">
              <div className="dept-stat">
                <span className="stat-icon">👥</span>
                <div>
                  <span className="stat-value">{dept.employees}</span>
                  <span className="stat-label">Employees</span>
                </div>
              </div>
              <div className="dept-stat">
                <span className="stat-icon">📊</span>
                <div>
                  <span className="stat-value">{dept.projects}</span>
                  <span className="stat-label">Projects</span>
                </div>
              </div>
              <div className="dept-stat">
                <span className="stat-icon">💰</span>
                <div>
                  <span className="stat-value">{dept.budget}</span>
                  <span className="stat-label">Budget</span>
                </div>
              </div>
            </div>

            <div className="performance-bar">
              <div className="performance-label">
                <span>Performance</span>
                <span className="performance-value">{dept.performance}%</span>
              </div>
              <div className="progress-bar">
                <motion.div 
                  className="progress-fill"
                  style={{ background: dept.color }}
                  initial={{ width:  0 }}
                  animate={{ width: `${dept.performance}%` }}
                  transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
                />
              </div>
            </div>

            <div className="dept-actions">
              <motion.button
                className="action-btn view"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                👁️ View Details
              </motion.button>
              <motion.button
                className="action-btn edit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ✏️ Edit
              </motion.button>
            </div>
          </motion. div>
        ))}
      </div>
    </div>
  );
}

export default Departments;