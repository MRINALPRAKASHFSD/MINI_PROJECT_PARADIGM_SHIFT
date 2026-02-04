import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './EmployeeList.css';

function EmployeeList() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Simulate fetching employees (replace with actual API call)
    const dummyEmployees = [
      { id: 1, name:  'John Doe', email: 'john@company.com', department: 'IT', position: 'Developer', status: 'Active' },
      { id: 2, name: 'Jane Smith', email: 'jane@company. com', department: 'HR', position: 'Manager', status:  'Active' },
      { id: 3, name: 'Mike Johnson', email: 'mike@company.com', department: 'Sales', position: 'Sales Executive', status: 'Active' },
      { id: 4, name: 'Sarah Williams', email: 'sarah@company.com', department: 'Marketing', position: 'Marketing Head', status: 'Active' },
      { id: 5, name: 'Tom Brown', email: 'tom@company.com', department: 'Finance', position: 'Accountant', status: 'On Leave' },
      { id:  6, name: 'Emily Davis', email: 'emily@company.com', department: 'IT', position: 'Designer', status: 'Active' },
    ];
    setEmployees(dummyEmployees);
  }, []);

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      setEmployees(employees.filter(emp => emp.id !== id));
    }
  };

  const handleEdit = (id) => {
    navigate(`/employees/edit/${id}`);
  };

  return (
    <div className="employee-list">
      <div className="employee-header">
        <div className="header-left">
          <h1>👥 Employee Management</h1>
          <p>Manage your team members</p>
        </div>
        <button className="add-employee-btn" onClick={() => navigate('/employees/add')}>
          ➕ Add New Employee
        </button>
      </div>

      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search by name, email, or department..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="employee-table-container">
        <table className="employee-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Position</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees. map(employee => (
              <tr key={employee.id}>
                <td>{employee.id}</td>
                <td>
                  <div className="employee-name">
                    <div className="avatar">{employee.name.charAt(0)}</div>
                    {employee.name}
                  </div>
                </td>
                <td>{employee.email}</td>
                <td>
                  <span className="department-badge">{employee.department}</span>
                </td>
                <td>{employee.position}</td>
                <td>
                  <span className={`status-badge ${employee.status === 'Active' ? 'status-active' : 'status-leave'}`}>
                    {employee.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-edit" onClick={() => handleEdit(employee.id)}>
                      ✏️ Edit
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(employee.id)}>
                      🗑️ Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredEmployees.length === 0 && (
        <div className="no-results">
          <p>😕 No employees found</p>
        </div>
      )}
    </div>
  );
}

export default EmployeeList;