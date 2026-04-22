import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserCheck, Building2, BarChart3, Search, Plus, Eye, Edit2, Trash2, Phone, Mail, Calendar, Briefcase, IndianRupee } from 'lucide-react';
import { useDataStore } from '../store/dataStore';
import './Employees.css';

function Employees() {
  const navigate = useNavigate();
  const { employees, deleteEmployee } = useDataStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('All');
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const departments = ['All', 'IT', 'HR', 'Sales', 'Marketing', 'Finance', 'R&D', 'Support', 'Legal', 'Operations'];

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await deleteEmployee(id);
      } catch (err) {
        console.error('Failed to delete employee:', err);
      }
    }
  };

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
    <div className="employees-container">
      <div className="emp-header">
        <div>
          <h1>Employee Management</h1>
          <p>Manage your workforce efficiently</p>
        </div>
        <button
          className="btn-primary"
          onClick={() => navigate('/employees/add')}
        >
          <Plus size={18} /> Add Employee
        </button>
      </div>

      <div className="emp-stats-row">
        <div className="emp-stat-card">
          <div className="stat-icon-wrapper" style={{ background: 'rgba(79, 70, 229, 0.1)', color: '#4f46e5' }}>
            <Users size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{employees.length}</span>
            <span className="stat-label">Total Employees</span>
          </div>
        </div>
        <div className="emp-stat-card">
          <div className="stat-icon-wrapper" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
            <UserCheck size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{employees.filter(e => e.status === 'Active').length}</span>
            <span className="stat-label">Active</span>
          </div>
        </div>
        <div className="emp-stat-card">
          <div className="stat-icon-wrapper" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
            <Building2 size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{new Set(employees.map(e => e.department)).size}</span>
            <span className="stat-label">Departments</span>
          </div>
        </div>
        <div className="emp-stat-card">
          <div className="stat-icon-wrapper" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>
            <BarChart3 size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">₹{(employees.reduce((sum, e) => sum + e.salary, 0) / 100000).toFixed(1)}L</span>
            <span className="stat-label">Total Payroll</span>
          </div>
        </div>
      </div>

      <div className="emp-controls">
        <div className="emp-search">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search by name, ID, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="emp-tabs">
          {departments.map(dept => (
            <button
              key={dept}
              className={`emp-tab ${filterDepartment === dept ? 'active' : ''}`}
              onClick={() => setFilterDepartment(dept)}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      <div className="emp-grid">
        {filteredEmployees.map((employee) => (
          <div key={employee.id} className="emp-card">
            <div className="emp-card-header">
              <div className="emp-avatar">
                {employee.avatar && employee.avatar.startsWith('http') ? (
                  <img src={employee.avatar} alt={employee.name} />
                ) : (
                  employee.name ? employee.name.charAt(0).toUpperCase() : '?'
                )}
              </div>
              <div className="emp-basic">
                <h3>{employee.name}</h3>
                <p>{employee.employeeId || 'EMP'}</p>
                <span className={`status-tag ${employee.status?.toLowerCase() || 'active'}`}>
                  {employee.status || 'Active'}
                </span>
              </div>
            </div>

            <div className="emp-details-list">
              <div className="emp-detail">
                <Briefcase size={14} />
                <span>{employee.designation || employee.role || 'Employee'}</span>
              </div>
              <div className="emp-detail">
                <Building2 size={14} />
                <span>{employee.department}</span>
              </div>
              <div className="emp-detail">
                <Mail size={14} />
                <span>{employee.email || 'N/A'}</span>
              </div>
              <div className="emp-detail">
                <Phone size={14} />
                <span>{employee.phone}</span>
              </div>
              <div className="emp-detail">
                <IndianRupee size={14} />
                <span>₹{(employee.salary || 0).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="emp-card-actions">
              <button className="icon-btn" onClick={() => navigate(`/employees/edit/${employee.id}`)} title="Edit">
                <Edit2 size={14} />
              </button>
              <button className="icon-btn delete" onClick={() => handleDelete(employee.id, employee.name)} title="Delete">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredEmployees.length === 0 && (
        <div className="empty-state">
          <Search size={40} />
          <h3>No employees found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}

export default Employees;