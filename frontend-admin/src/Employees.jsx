import { useState } from 'react';
import { motion } from 'framer-motion';
import './Employees.css';

function Employees() {
  const [employees] = useState([
    {
      id: 1,
      name: 'Diya Sharma',
      employeeId: 'EMP001',
      email: 'diya.sharma@paradigmshift.com',
      phone: '+91 98765 43210',
      department: 'IT',
      designation: 'Senior Developer',
      joiningDate: '2023-03-15',
      salary: 75000,
      status: 'Active',
      avatar: 'D'
    },
    {
      id: 2,
      name: 'Pratham Verma',
      employeeId:  'EMP002',
      email: 'pratham.verma@paradigmshift.com',
      phone: '+91 98765 43211',
      department: 'HR',
      designation: 'HR Manager',
      joiningDate: '2022-06-20',
      salary: 65000,
      status: 'Active',
      avatar: 'P'
    },
    {
      id: 3,
      name: 'Aditya Patel',
      employeeId: 'EMP003',
      email: 'aditya.patel@paradigmshift.com',
      phone: '+91 98765 43212',
      department: 'Sales',
      designation: 'Sales Executive',
      joiningDate: '2023-01-10',
      salary: 50000,
      status: 'Active',
      avatar: 'A'
    },
    {
      id: 4,
      name: 'Mahin Khan',
      employeeId: 'EMP004',
      email: 'mahin.khan@paradigmshift.com',
      phone: '+91 98765 43213',
      department: 'Marketing',
      designation: 'Marketing Lead',
      joiningDate: '2022-09-05',
      salary: 70000,
      status: 'Active',
      avatar: 'M'
    },
    {
      id: 5,
      name: 'Ishan Singh',
      employeeId: 'EMP005',
      email: 'ishan.singh@paradigmshift.com',
      phone: '+91 98765 43214',
      department: 'Finance',
      designation: 'Financial Analyst',
      joiningDate:  '2023-02-18',
      salary: 60000,
      status: 'Active',
      avatar: 'I'
    },
    {
      id: 6,
      name: 'Priya Gupta',
      employeeId: 'EMP006',
      email: 'priya.gupta@paradigmshift.com',
      phone: '+91 98765 43215',
      department: 'IT',
      designation: 'Team Lead',
      joiningDate:  '2021-11-12',
      salary: 80000,
      status: 'Active',
      avatar: 'P'
    },
    {
      id: 7,
      name: 'Arjun Reddy',
      employeeId:  'EMP007',
      email: 'arjun. reddy@paradigmshift.com',
      phone: '+91 98765 43216',
      department: 'R&D',
      designation: 'Research Analyst',
      joiningDate: '2023-04-22',
      salary: 55000,
      status: 'Active',
      avatar: 'A'
    },
    {
      id: 8,
      name: 'Sneha Iyer',
      employeeId:  'EMP008',
      email: 'sneha.iyer@paradigmshift.com',
      phone: '+91 98765 43217',
      department: 'Support',
      designation: 'Support Executive',
      joiningDate: '2023-05-30',
      salary: 45000,
      status: 'Active',
      avatar: 'S'
    },
    {
      id: 9,
      name: 'Rohan Kapoor',
      employeeId:  'EMP009',
      email: 'rohan.kapoor@paradigmshift.com',
      phone: '+91 98765 43218',
      department: 'Legal',
      designation: 'Legal Advisor',
      joiningDate: '2022-08-14',
      salary: 72000,
      status: 'Active',
      avatar: 'R'
    },
    {
      id: 10,
      name: 'Ananya Desai',
      employeeId: 'EMP010',
      email: 'ananya.desai@paradigmshift.com',
      phone: '+91 98765 43219',
      department: 'Operations',
      designation: 'Operations Manager',
      joiningDate: '2022-07-25',
      salary: 68000,
      status: 'Active',
      avatar: 'A'
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('All');

  const departments = ['All', 'IT', 'HR', 'Sales', 'Marketing', 'Finance', 'R&D', 'Support', 'Legal', 'Operations'];

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.email. toLowerCase().includes(searchTerm. toLowerCase());
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
              <div className="employee-avatar-large">{employee.avatar}</div>
              <div className="employee-basic-info">
                <h3>{employee.name}</h3>
                <p className="employee-id">{employee.employeeId}</p>
                <span className="status-badge active">{employee.status}</span>
              </div>
            </div>

            <div className="employee-details">
              <div className="detail-row">
                <span className="detail-icon">💼</span>
                <div>
                  <span className="detail-label">Designation</span>
                  <span className="detail-value">{employee. designation}</span>
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
                  <span className="detail-value">{employee.email}</span>
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
                  <span className="detail-value">{new Date(employee.joiningDate).toLocaleDateString('en-IN')}</span>
                </div>
              </div>

              <div className="detail-row">
                <span className="detail-icon">💰</span>
                <div>
                  <span className="detail-label">Salary</span>
                  <span className="detail-value">₹{employee.salary. toLocaleString('en-IN')}</span>
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