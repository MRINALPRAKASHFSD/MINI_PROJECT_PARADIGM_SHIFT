import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [credentials, setCredentials] = useState({
    email: '',
    password:  ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e. target.name]: e.target. value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (credentials.email === 'admin@paradigmshift.com' && credentials.password === 'admin123') {
      localStorage.setItem('adminToken', 'admin-token-123');
      localStorage. setItem('adminEmail', credentials. email);
      navigate('/dashboard');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1>🔐 Admin Portal</h1>
          <p>Paradigm Shift Management System</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>📧 Email</label>
            <input
              type="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              placeholder="admin@paradigmshift.com"
              required
            />
          </div>

          <div className="form-group">
            <label>🔒 Password</label>
            <input
              type="password"
              name="password"
              value={credentials. password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-btn">
            Login to Dashboard
          </button>
        </form>

        <div className="login-footer">
          <p>Default Credentials: </p>
          <small>Email: admin@paradigmshift.com</small>
          <br />
          <small>Password: admin123</small>
        </div>
      </div>
    </div>
  );
}

export default Login;