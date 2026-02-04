import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();
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

    // Simulate API call
    setTimeout(() => {
      login({ 
        name: formData. name, 
        email: formData.email,
        profileComplete: false
      });
      navigate('/profile-setup');
      setIsLoading(false);
    }, 1000);
  };

  const passwordStrength = () => {
    const password = formData.password;
    if (!password) return { strength: 0, label: '' };
    
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/. test(password)) strength++;
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
        
        {[... Array(20)].map((_, i) => (
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
          animate={{ x:  0, opacity: 1 }}
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
              { icon:  Briefcase, text: 'Professional tools' }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="feature-item"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x:  0, opacity: 1 }}
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
              <motion. div 
                className="form-group"
                initial={{ y:  20, opacity: 0 }}
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
                      animate={{ scale:  1 }}
                    >
                      <CheckCircle2 size={18} />
                    </motion.div>
                  )}
                </div>
              </motion.div>

              <motion.div 
                className="form-group"
                initial={{ y: 20, opacity:  0 }}
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
                    value={formData. email}
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
                transition={{ delay:  0.6 }}
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
                          className={`strength-segment ${i < strength. strength ? 'active' : ''}`}
                          style={{ backgroundColor: i < strength.strength ? strength.color : undefined }}
                        />
                      ))}
                    </div>
                    <span style={{ color: strength.color }}>{strength.label}</span>
                  </motion.div>
                )}
              </motion. div>

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
                    value={formData. confirmPassword}
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
                <motion. div 
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
                animate={{ y:  0, opacity: 1 }}
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
              className="form-footer"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y:  0, opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <p>
                Already have an account?{' '}
                <Link to="/" className="link-primary">
                  Sign in here
                </Link>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;