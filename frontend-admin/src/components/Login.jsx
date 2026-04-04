import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { loginWithEmail, loginWithGoogle } from '../config/firebase';
import {
  Mail, Lock, Eye, EyeOff, LogIn, ArrowRight, Shield,
  Building2, Users, BarChart3, CheckCircle2, AlertCircle
} from 'lucide-react';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const setUser = useAuthStore((state) => state.setUser);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await loginWithEmail(email, password);
    if (result.success) {
      setUser(result.user, result.token);
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    setIsLoading(false);
  };

  const handleGoogleLogin = async () => {
    setError('');
    setIsLoading(true);
    const result = await loginWithGoogle();
    if (result.success && result.user) {
      setUser(result.user);
      navigate('/dashboard');
    } else if (!result.success) {
      setError(result.error);
    }
    setIsLoading(false);
  };

  return (
    <div className="admin-login-page">
      {/* Background effects */}
      <div className="login-bg">
        <div className="login-orb login-orb-1" />
        <div className="login-orb login-orb-2" />
        <div className="login-orb login-orb-3" />
        <div className="login-grid-pattern" />
      </div>

      <div className="login-split">
        {/* Left — branding panel */}
        <div className="login-brand-panel">
          <div className="brand-content">
            <div className="brand-logo-wrap">
              <div className="brand-logo-icon">
                <Building2 size={36} />
              </div>
            </div>

            <h1 className="brand-heading">Paradigm Shift</h1>
            <p className="brand-tagline">Admin Control Center</p>
            <p className="brand-desc">
              Manage employees, departments, payroll, and more — all from one powerful dashboard.
            </p>

            <div className="brand-features">
              {[
                { icon: Users, text: 'Employee Management' },
                { icon: Shield, text: 'Role-Based Access Control' },
                { icon: BarChart3, text: 'Real-Time Analytics' },
              ].map((f, i) => (
                <div key={i} className="brand-feature-item">
                  <div className="brand-feature-icon">
                    <f.icon size={18} />
                  </div>
                  <span>{f.text}</span>
                </div>
              ))}
            </div>

            <div className="brand-stats-row">
              {[
                { val: '156', label: 'Employees' },
                { val: '12', label: 'Departments' },
                { val: '99.9%', label: 'Uptime' },
              ].map((s, i) => (
                <div key={i} className="brand-stat">
                  <div className="brand-stat-val">{s.val}</div>
                  <div className="brand-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — login form */}
        <div className="login-form-panel">
          <div className="login-form-card">
            <div className="form-header">
              <div className="header-icon-wrap">
                <LogIn size={28} />
              </div>
              <h2>Welcome Back</h2>
              <p>Sign in to the admin dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-field">
                <label>
                  <Mail size={16} />
                  Email Address
                </label>
                <div className="input-wrap">
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="admin@paradigmshift.com"
                    required
                    autoComplete="username"
                  />
                  {email && (
                    <span className="input-valid-icon">
                      <CheckCircle2 size={16} />
                    </span>
                  )}
                </div>
              </div>

              <div className="form-field">
                <label>
                  <Lock size={16} />
                  Password
                </label>
                <div className="input-wrap">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                  />
                  <button type="button" className="pw-toggle" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="login-error">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              <button type="submit" className="login-submit-btn" disabled={isLoading}>
                {isLoading ? (
                  <span className="login-spinner" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="login-divider">
              <span>OR</span>
            </div>

            {/* Google */}
            <button className="google-login-btn" onClick={handleGoogleLogin} disabled={isLoading}>
              <svg viewBox="0 0 24 24" width="18" height="18">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            {/* Credentials hint */}
            <div className="creds-hint">
              <p>Demo Credentials</p>
              <code>admin@paradigmshift.com / admin123</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;