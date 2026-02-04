import { useState } from 'react';
import { motion } from 'framer-motion';
import './Payroll.css';

function Payroll() {
  const [payrollData] = useState([
    {
      id: 1,
      name: 'Diya Sharma',
      employeeId: 'EMP001',
      department: 'IT',
      designation: 'Senior Developer',
      basicSalary: 75000,
      allowances: 15000,
      deductions: 8000,
      netSalary: 82000,
      status: 'Processed',
      paymentDate: '2026-01-01'
    },
    {
      id: 2,
      name: 'Pratham Verma',
      employeeId:  'EMP002',
      department: 'HR',
      designation: 'HR Manager',
      basicSalary:  65000,
      allowances: 12000,
      deductions:  7000,
      netSalary: 70000,
      status: 'Processed',
      paymentDate: '2026-01-01'
    },
    {
      id: 3,
      name: 'Aditya Patel',
      employeeId: 'EMP003',
      department: 'Sales',
      designation: 'Sales Executive',
      basicSalary:  50000,
      allowances: 10000,
      deductions: 5500,
      netSalary:  54500,
      status: 'Pending',
      paymentDate: '2026-01-05'
    },
    {
      id: 4,
      name: 'Mahin Khan',
      employeeId:  'EMP004',
      department: 'Marketing',
      designation: 'Marketing Lead',
      basicSalary:  70000,
      allowances: 14000,
      deductions: 7500,
      netSalary:  76500,
      status: 'Processed',
      paymentDate: '2026-01-01'
    },
    {
      id: 5,
      name: 'Ishan Singh',
      employeeId: 'EMP005',
      department: 'Finance',
      designation: 'Financial Analyst',
      basicSalary: 60000,
      allowances: 11000,
      deductions: 6500,
      netSalary:  64500,
      status: 'Pending',
      paymentDate: '2026-01-05'
    },
    {
      id: 6,
      name: 'Priya Gupta',
      employeeId:  'EMP006',
      department: 'IT',
      designation: 'Team Lead',
      basicSalary:  80000,
      allowances: 16000,
      deductions: 8500,
      netSalary:  87500,
      status: 'Processed',
      paymentDate: '2026-01-01'
    },
  ]);

  const [filter, setFilter] = useState('All');

  const filteredData = filter === 'All' 
    ? payrollData 
    :  payrollData.filter(emp => emp.status === filter);

  const totalPayroll = payrollData.reduce((sum, emp) => sum + emp.netSalary, 0);
  const processedCount = payrollData.filter(emp => emp.status === 'Processed').length;
  const pendingCount = payrollData.filter(emp => emp.status === 'Pending').length;

  return (
    <div className="payroll">
      <motion.div 
        className="payroll-header"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity:  1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1>💰 Payroll Management</h1>
          <p>Manage employee salaries and payment processing</p>
        </div>
        <motion.button
          className="process-all-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ⚡ Process All Pending
        </motion.button>
      </motion.div>

      <motion.div 
        className="payroll-stats"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity:  1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="stat-card glass">
          <div className="stat-icon" style={{ background: '#10b981' }}>💵</div>
          <div className="stat-info">
            <h3>₹{(totalPayroll / 100000).toFixed(2)}L</h3>
            <p>Total Payroll</p>
          </div>
        </div>
        <div className="stat-card glass">
          <div className="stat-icon" style={{ background:  '#667eea' }}>✅</div>
          <div className="stat-info">
            <h3>{processedCount}</h3>
            <p>Processed</p>
          </div>
        </div>
        <div className="stat-card glass">
          <div className="stat-icon" style={{ background: '#f59e0b' }}>⏳</div>
          <div className="stat-info">
            <h3>{pendingCount}</h3>
            <p>Pending</p>
          </div>
        </div>
        <div className="stat-card glass">
          <div className="stat-icon" style={{ background: '#06b6d4' }}>👥</div>
          <div className="stat-info">
            <h3>{payrollData.length}</h3>
            <p>Total Employees</p>
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="filter-section glass"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <button 
          className={`filter-btn ${filter === 'All' ? 'active' : ''}`}
          onClick={() => setFilter('All')}
        >
          All ({payrollData.length})
        </button>
        <button 
          className={`filter-btn ${filter === 'Processed' ? 'active' : ''}`}
          onClick={() => setFilter('Processed')}
        >
          Processed ({processedCount})
        </button>
        <button 
          className={`filter-btn ${filter === 'Pending' ? 'active' : ''}`}
          onClick={() => setFilter('Pending')}
        >
          Pending ({pendingCount})
        </button>
      </motion.div>

      <motion.div 
        className="payroll-table-container glass"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y:  0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="table-wrapper">
          <table className="payroll-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>ID</th>
                <th>Department</th>
                <th>Basic Salary</th>
                <th>Allowances</th>
                <th>Deductions</th>
                <th>Net Salary</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((employee, index) => (
                <motion.tr
                  key={employee.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <td>
                    <div className="employee-cell">
                      <div className="employee-avatar">{employee.name.charAt(0)}</div>
                      <div>
                        <div className="employee-name">{employee.name}</div>
                        <div className="employee-designation">{employee.designation}</div>
                      </div>
                    </div>
                  </td>
                  <td>{employee.employeeId}</td>
                  <td>{employee. department}</td>
                  <td className="amount">₹{employee.basicSalary.toLocaleString('en-IN')}</td>
                  <td className="amount positive">+₹{employee.allowances. toLocaleString('en-IN')}</td>
                  <td className="amount negative">-₹{employee.deductions.toLocaleString('en-IN')}</td>
                  <td className="amount net-salary">₹{employee.netSalary.toLocaleString('en-IN')}</td>
                  <td>
                    <span 
                      className={`status-badge ${employee.status. toLowerCase()}`}
                    >
                      {employee.status === 'Processed' ? '✅' : '⏳'} {employee.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <motion.button
                        className="view-btn"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title="View Details"
                      >
                        👁️
                      </motion. button>
                      <motion. button
                        className="download-btn"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title="Download Slip"
                      >
                        📥
                      </motion. button>
                      {employee.status === 'Pending' && (
                        <motion.button
                          className="process-btn"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title="Process Payment"
                        >
                          ✓
                        </motion.button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}

export default Payroll;