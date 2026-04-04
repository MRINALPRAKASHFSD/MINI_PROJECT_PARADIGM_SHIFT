import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDataStore } from '../store/dataStore';
import './Employees.css';

function Employees() {
  const { employees } = useDataStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('All');
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const departments = ['All', 'IT', 'HR', 'Sales', 'Marketing', 'Finance', 'R&D', 'Support', 'Legal', 'Operations'];

  const filteredEmployees = employees.filter(emp => {
    const term = searchTerm.toLowerCase();
    const nameMatch = emp.name?.toLowerCase().includes(term) || false;
    const idMatch = emp.employeeId?.toLowerCase().includes(term) || false;
    const emailMatch = emp.email?.toLowerCase().includes(term) || false;
    const matchesSearch = nameMatch || idMatch || emailMatch;
    const matchesDepartment = filterDepartment === 'All' || emp.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  return (
    <div className="employees">
      <motion.div 
        className="employees-header"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity:  1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1>👥 Employee Management</h1>
          <p>Manage your workforce efficiently</p>
        </div>
        <motion.button
          className="add-employee-btn"
          whileHover={{ scale:  1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ➕ Add Employee
        </motion.button>
      </motion.div>

      <motion.div 
        className="employees-stats"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity:  1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="stat-card glass">
          <div className="stat-icon" style={{ background: '#667eea' }}>👥</div>
          <div className="stat-info">
            <h3>{employees.length}</h3>
            <p>Total Employees</p>
          </div>
        </div>
        <div className="stat-card glass">
          <div className="stat-icon" style={{ background:  '#10b981' }}>✅</div>
          <div className="stat-info">
            <h3>{employees.filter(e => e.status === 'Active').length}</h3>
            <p>Active</p>
          </div>
        </div>
        <div className="stat-card glass">
          <div className="stat-icon" style={{ background: '#f59e0b' }}>🏢</div>
          <div className="stat-info">
            <h3>{new Set(employees.map(e => e.department)).size}</h3>
            <p>Departments</p>
          </div>
        </div>
        <div className="stat-card glass">
          <div className="stat-icon" style={{ background: '#8b5cf6' }}>📊</div>
          <div className="stat-info">
            <h3>₹{(employees.reduce((sum, e) => sum + e.salary, 0) / 100000).toFixed(1)}L</h3>
            <p>Total Payroll</p>
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="employees-filters glass"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y:  0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by name, ID, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="department-filters">
          {departments.map(dept => (
            <button
              key={dept}
              className={`filter-btn ${filterDepartment === dept ? 'active' : ''}`}
              onClick={() => setFilterDepartment(dept)}
            >
              {dept}
            </button>
          ))}
        </div>
      </motion.div>

      <div className="employees-grid">
        {filteredEmployees.map((employee, index) => (
          <motion.div
            key={employee. id}
            className="employee-card glass"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity:  1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileHover={{ scale: 1.03, y: -5 }}
          >
            <div className="employee-header">
              <div className="employee-avatar-large">{employee.avatar || (employee.name ? employee.name.charAt(0).toUpperCase() : '?')}</div>
              <div className="employee-basic-info">
                <h3>{employee.name}</h3>
                <p className="employee-id">{employee.employeeId || 'EMP'}</p>
                <span className="status-badge active">{employee.status || 'Active'}</span>
              </div>
            </div>

            <div className="employee-details">
              <div className="detail-row">
                <span className="detail-icon">💼</span>
                <div>
                  <span className="detail-label">Designation</span>
                  <span className="detail-value">{employee.designation || employee.role || 'Employee'}</span>
                </div>
              </div>

              <div className="detail-row">
                <span className="detail-icon">🏢</span>
                <div>
                  <span className="detail-label">Department</span>
                  <span className="detail-value">{employee.department}</span>
                </div>
              </div>

              <div className="detail-row">
                <span className="detail-icon">📧</span>
                <div>
                  <span className="detail-label">Email</span>
                  <span className="detail-value">{employee.email || 'N/A'}</span>
                </div>
              </div>

              <div className="detail-row">
                <span className="detail-icon">📞</span>
                <div>
                  <span className="detail-label">Phone</span>
                  <span className="detail-value">{employee.phone}</span>
                </div>
              </div>

              <div className="detail-row">
                <span className="detail-icon">📅</span>
                <div>
                  <span className="detail-label">Joining Date</span>
                  <span className="detail-value">{employee.joiningDate ? new Date(employee.joiningDate).toLocaleDateString('en-IN') : 'N/A'}</span>
                </div>
              </div>

              <div className="detail-row">
                <span className="detail-icon">💰</span>
                <div>
                  <span className="detail-label">Salary</span>
                  <span className="detail-value">₹{(employee.salary || 0).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div className="employee-actions">
              <motion.button
                className="action-btn view"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                👁️ View
              </motion.button>
              <motion.button
                className="action-btn edit"
                whileHover={{ scale:  1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ✏️ Edit
              </motion.button>
              <motion.button
                className="action-btn delete"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🗑️ Delete
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredEmployees.length === 0 && (
        <div className="no-results glass">
          <span className="no-results-icon">🔍</span>
          <h3>No employees found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}

export default Employees;