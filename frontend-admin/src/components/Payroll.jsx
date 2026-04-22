import { useState } from 'react';
import { DollarSign, CheckCircle, Clock, Users, Eye, Download, Play } from 'lucide-react';
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
      employeeId: 'EMP002',
      department: 'HR',
      designation: 'HR Manager',
      basicSalary: 65000,
      allowances: 12000,
      deductions: 7000,
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
      basicSalary: 50000,
      allowances: 10000,
      deductions: 5500,
      netSalary: 54500,
      status: 'Pending',
      paymentDate: '2026-01-05'
    },
    {
      id: 4,
      name: 'Mahin Khan',
      employeeId: 'EMP004',
      department: 'Marketing',
      designation: 'Marketing Lead',
      basicSalary: 70000,
      allowances: 14000,
      deductions: 7500,
      netSalary: 76500,
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
      netSalary: 64500,
      status: 'Pending',
      paymentDate: '2026-01-05'
    },
    {
      id: 6,
      name: 'Priya Gupta',
      employeeId: 'EMP006',
      department: 'IT',
      designation: 'Team Lead',
      basicSalary: 80000,
      allowances: 16000,
      deductions: 8500,
      netSalary: 87500,
      status: 'Processed',
      paymentDate: '2026-01-01'
    },
  ]);

  const [filter, setFilter] = useState('All');

  const filteredData = filter === 'All' 
    ? payrollData 
    : payrollData.filter(emp => emp.status === filter);

  const totalPayroll = payrollData.reduce((sum, emp) => sum + emp.netSalary, 0);
  const processedCount = payrollData.filter(emp => emp.status === 'Processed').length;
  const pendingCount = payrollData.filter(emp => emp.status === 'Pending').length;

  return (
    <div className="payroll-container">
      <div className="pay-header">
        <div>
          <h1>Payroll Management</h1>
          <p>Manage employee salaries and payment processing</p>
        </div>
        <button className="btn-primary">
          <Play size={18} /> Process All Pending
        </button>
      </div>

      <div className="pay-stats-row">
        <div className="pay-stat-card">
          <div className="stat-icon-wrapper total">
            <DollarSign size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">₹{(totalPayroll / 100000).toFixed(2)}L</span>
            <span className="stat-label">Total Payroll</span>
          </div>
        </div>
        <div className="pay-stat-card">
          <div className="stat-icon-wrapper processed">
            <CheckCircle size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{processedCount}</span>
            <span className="stat-label">Processed</span>
          </div>
        </div>
        <div className="pay-stat-card">
          <div className="stat-icon-wrapper pending">
            <Clock size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{pendingCount}</span>
            <span className="stat-label">Pending</span>
          </div>
        </div>
        <div className="pay-stat-card">
          <div className="stat-icon-wrapper total">
            <Users size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{payrollData.length}</span>
            <span className="stat-label">Total Employees</span>
          </div>
        </div>
      </div>

      <div className="pay-filters">
        {['All', 'Processed', 'Pending'].map(f => (
          <button 
            key={f}
            className={`pay-filter-tab ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f} {f === 'All' ? `(${payrollData.length})` : f === 'Processed' ? `(${processedCount})` : `(${pendingCount})`}
          </button>
        ))}
      </div>

      <div className="pay-table-wrapper">
        <table className="pay-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>ID</th>
              <th>Department</th>
              <th>Basic</th>
              <th>Allowances</th>
              <th>Deductions</th>
              <th>Net Salary</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((employee) => (
              <tr key={employee.id}>
                <td>
                  <div className="pay-emp-cell">
                    <div className="pay-avatar">{employee.name.charAt(0)}</div>
                    <div>
                      <div className="pay-emp-name">{employee.name}</div>
                      <div className="pay-emp-role">{employee.designation}</div>
                    </div>
                  </div>
                </td>
                <td>{employee.employeeId}</td>
                <td>{employee.department}</td>
                <td className="amount">₹{employee.basicSalary.toLocaleString('en-IN')}</td>
                <td className="amount positive">+₹{employee.allowances.toLocaleString('en-IN')}</td>
                <td className="amount negative">-₹{employee.deductions.toLocaleString('en-IN')}</td>
                <td className="amount net">₹{employee.netSalary.toLocaleString('en-IN')}</td>
                <td>
                  <span className={`pay-status-tag ${employee.status.toLowerCase()}`}>
                    {employee.status}
                  </span>
                </td>
                <td>
                  <div className="pay-actions">
                    <button className="icon-btn" title="View"><Eye size={14} /></button>
                    <button className="icon-btn" title="Download"><Download size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Payroll;