import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  User, 
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Shield,
  Zap
} from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { registerWithEmail, signInWithGooglePlatform } from '../config/firebase';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: ''
  });
  const [isCompany, setIsCompany] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const setUser = useAuthStore((state) => state.setUser);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    const result = await registerWithEmail(formData.email, formData.password, formData.name, isCompany, formData.companyName);

    if (result.success) {
      setUser(result.user, result.token);
      navigate('/dashboard');
    } else {
      // If it looks like a network error (no response)
      if (result.error === 'Network Error' || result.error.includes('Error: Network Error')) {
        setError('Cannot connect to the server. Please ensure the backend is running on port 5050.');
      } else {
        setError(result.error);
      }
    }
    setIsLoading(false);
  };

  const handleGoogleLogin = async () => {
    setError('');
    setIsLoading(true);

    const result = await signInWithGooglePlatform();

    if (result.success) {
      if (result.user) {
        setUser(result.user, result.token);
        navigate('/dashboard');
      }
    } else {
      setError(result.error);
    }
    setIsLoading(false);
  };

  const passwordStrength = () => {
    const password = formData.password;
    if (!password) return { strength: 0, label: '' };
    
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;

    const labels = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
    const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#10b981'];
    
    return { strength, label: labels[strength - 1] || '', color: colors[strength - 1] || '#ef4444' };
  };

  const strength = passwordStrength();

  return (
    <div className="auth-container dark">
      <div className="auth-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
        <div className="grid-pattern"></div>
        
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="floating-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="auth-content">
        <motion.div 
          className="auth-branding"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="brand-logo"
            whileHover={{ scale: 1.05, rotate: 5 }}
          >
            <motion.div
              className="logo-icon"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              <Briefcase size={48} />
            </motion.div>
          </motion.div>

          <motion.h1 
            className="brand-title"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Join Our Team
          </motion.h1>

          <motion.p 
            className="brand-subtitle"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Create your account and start your journey
          </motion.p>

          <motion.div 
            className="features-list"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {[
              { icon: Shield, text: 'Enterprise-grade security' },
              { icon: Zap, text: 'Lightning-fast performance' },
              { icon: Briefcase, text: 'Professional tools' }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="feature-item"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ x: 10 }}
              >
                <div className="feature-icon">
                  <feature.icon size={20} />
                </div>
                <span>{feature.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div 
          className="auth-form-container"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="auth-form-card">
            <motion.div 
              className="form-header"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="header-icon">
                <User size={32} />
              </div>
              <h2>Create Account</h2>
              <p>Fill in your details to get started</p>
            </motion.div>

            <form onSubmit={handleSubmit}>
              <motion.div
                className="form-group mode-toggle"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.35 }}
                style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}
              >
                <div 
                  onClick={() => setIsCompany(!isCompany)}
                  style={{
                    width: '46px',
                    height: '24px',
                    borderRadius: '12px',
                    backgroundColor: isCompany ? '#3b82f6' : 'rgba(255,255,255,0.1)',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s'
                  }}
                >
                  <motion.div
                    animate={{ x: isCompany ? 22 : 2 }}
                    style={{
                      width: '20px',
                      height: '20px',
                      backgroundColor: 'white',
                      borderRadius: '50%',
                      position: 'absolute',
                      top: '2px',
                    }}
                  />
                </div>
                <span style={{ fontSize: '14px', color: '#e2e8f0', fontWeight: '500' }}>
                  {isCompany ? 'Registering a Company' : 'Registering as Employee'}
                </span>
              </motion.div>

              <AnimatePresence>
                {isCompany && (
                  <motion.div
                    className="form-group"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <label>
                      <Briefcase size={18} />
                      Company Name
                    </label>
                    <div className="input-wrapper">
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        placeholder="Paradigm Shift Inc."
                        required={isCompany}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div 
                className="form-group"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <label>
                  <User size={18} />
                  Full Name
                </label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                  />
                  {formData.name && (
                    <motion.div
                      className="input-check"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      <CheckCircle2 size={18} />
                    </motion.div>
                  )}
                </div>
              </motion.div>

              <motion.div 
                className="form-group"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <label>
                  <Mail size={18} />
                  Email Address
                </label>
                <div className="input-wrapper">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@company.com"
                    required
                  />
                  {formData.email && (
                    <motion.div
                      className="input-check"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      <CheckCircle2 size={18} />
                    </motion.div>
                  )}
                </div>
              </motion.div>

              <motion.div 
                className="form-group"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <label>
                  <Lock size={18} />
                  Password
                </label>
                <div className="input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a strong password"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {formData.password && (
                  <motion.div 
                    className="password-strength"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="strength-bar">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`strength-segment ${i < strength.strength ? 'active' : ''}`}
                          style={{ backgroundColor: i < strength.strength ? strength.color : undefined }}
                        />
                      ))}
                    </div>
                    <span style={{ color: strength.color }}>{strength.label}</span>
                  </motion.div>
                )}
              </motion.div>

              <motion.div 
                className="form-group"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <label>
                  <Lock size={18} />
                  Confirm Password
                </label>
                <div className="input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    required
                  />
                  {formData.confirmPassword && formData.password === formData.confirmPassword && (
                    <motion.div
                      className="input-check"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      <CheckCircle2 size={18} />
                    </motion.div>
                  )}
                </div>
              </motion.div>

              {error && (
                <motion.div 
                  className="error-message"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  {error}
                </motion.div>
              )}

              <motion.button
                type="submit"
                className="submit-btn"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                {isLoading ? (
                  <motion.div
                    className="loading-spinner"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                ) : (
                  <>
                    Create Account
                    <ArrowRight size={20} />
                  </>
                )}
              </motion.button>
            </form>

            <motion.div 
              className="social-login"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.85 }}
            >
              <div className="divider">
                <span>Or register with</span>
              </div>
              <div className="social-buttons">
                <button 
                  type="button" 
                  className="social-btn google"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                >
                  <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                    <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                      <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                      <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                      <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                      <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
                    </g>
                  </svg>
                  Continue with Google
                </button>
              </div>
            </motion.div>

            <motion.div 
              className="form-footer"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <p>
                Already have an account?{' '}
                <span
                  className="link-primary"
                  style={{ color: "#3b82f6", cursor: "pointer", fontWeight: "600" }}
                  onClick={() => navigate('/login')}
                >
                  Sign in here
                </span>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;