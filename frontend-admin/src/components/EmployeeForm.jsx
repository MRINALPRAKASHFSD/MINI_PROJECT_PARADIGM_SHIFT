import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './EmployeeForm.css';

function EmployeeForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name:  '',
    email: '',
    phone: '',
    department: '',
    position: '',
    salary: '',
    joinDate: '',
    address: '',
    status: 'Active'
  });

  const [errors, setErrors] = useState({});

  const departments = ['IT', 'HR', 'Sales', 'Marketing', 'Finance', 'Operations'];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target. name]: e.target.value
    });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target. name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name. trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData. position. trim()) newErrors.position = 'Position is required';
    if (!formData.salary. trim()) newErrors.salary = 'Salary is required';
    if (!formData.joinDate) newErrors.joinDate = 'Join date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      console.log('Form submitted:', formData);
      alert(isEditMode ? 'Employee updated successfully!' : 'Employee added successfully!');
      navigate('/employees');
    }
  };

  const handleCancel = () => {
    navigate('/employees');
  };

  return (
    <div className="employee-form-container">
      <div className="form-header">
        <h1>{isEditMode ? '✏️ Edit Employee' :  '➕ Add New Employee'}</h1>
        <p>{isEditMode ? 'Update employee information' : 'Fill in the details to add a new employee'}</p>
      </div>

      <form onSubmit={handleSubmit} className="employee-form">
        <div className="form-row">
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter full name"
              className={errors.name ? 'error' :  ''}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label>Email Address *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="employee@company.com"
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Phone Number *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 234 567 8900"
              className={errors. phone ? 'error' : ''}
            />
            {errors.phone && <span className="error-text">{errors.phone}</span>}
          </div>

          <div className="form-group">
            <label>Department *</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className={errors.department ? 'error' : ''}
            >
              <option value="">Select Department</option>
              {departments. map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            {errors.department && <span className="error-text">{errors.department}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Position *</label>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              placeholder="e.g., Senior Developer"
              className={errors.position ?  'error' : ''}
            />
            {errors.position && <span className="error-text">{errors.position}</span>}
          </div>

          <div className="form-group">
            <label>Salary *</label>
            <input
              type="number"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              placeholder="50000"
              className={errors. salary ? 'error' : ''}
            />
            {errors.salary && <span className="error-text">{errors.salary}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Join Date *</label>
            <input
              type="date"
              name="joinDate"
              value={formData.joinDate}
              onChange={handleChange}
              className={errors.joinDate ? 'error' : ''}
            />
            {errors.joinDate && <span className="error-text">{errors.joinDate}</span>}
          </div>

          <div className="form-group">
            <label>Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="form-group full-width">
          <label>Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter full address"
            rows="3"
          />
        </div>

        <div className="form-actions">
          <button type="button" onClick={handleCancel} className="btn-cancel">
            ❌ Cancel
          </button>
          <button type="submit" className="btn-submit">
            {isEditMode ? '💾 Update Employee' : '➕ Add Employee'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EmployeeForm;