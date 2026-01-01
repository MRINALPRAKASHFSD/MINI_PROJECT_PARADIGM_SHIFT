import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  LogIn, 
  ArrowRight,
  Briefcase,
  Shield,
  Zap,
  CheckCircle2
} from 'lucide-react';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (email && password) {
        login({ 
          name: email.split('@')[0], 
          email: email,
          profileComplete: false
        });
        navigate('/profile-setup');
      } else {
        setError('Please enter valid credentials');
      }
      setIsLoading(false);
    }, 1000);
  };

  const features = [
    { icon:  Briefcase, text: 'Manage your tasks efficiently' },
    { icon:  Shield, text: 'Secure and encrypted' },
    { icon:  Zap, text: 'Real-time collaboration' }
  ];

  return (
    <div className="auth-container dark">
      {/* Animated Background */}
      <div className="auth-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
        <div className="grid-pattern"></div>
        
        {/* Floating Elements */}
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
        {/* Left Side - Branding */}
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
            Employee Portal
          </motion.h1>

          <motion.p 
            className="brand-subtitle"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity:  1 }}
            transition={{ delay: 0.3 }}
          >
            Streamline your workflow and boost productivity
          </motion.p>

          <motion.div 
            className="features-list"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y:  0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {features.map((feature, index) => (
              <motion. div
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

          <motion.div 
            className="stats-grid"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y:  0, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            {[
              { value: '10K+', label: 'Active Users' },
              { value:  '50K+', label: 'Tasks Completed' },
              { value: '99.9%', label: 'Uptime' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="stat-card"
                whileHover={{ y: -5, scale: 1.05 }}
              >
                <h3>{stat.value}</h3>
                <p>{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right Side - Login Form */}
        <motion. div 
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
                <LogIn size={32} />
              </div>
              <h2>Welcome Back! </h2>
              <p>Sign in to access your dashboard</p>
            </motion.div>

            <form onSubmit={handleSubmit}>
              <motion.div 
                className="form-group"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <label>
                  <Mail size={18} />
                  Email Address
                </label>
                <div className="input-wrapper">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    required
                  />
                  {email && (
                    <motion. div
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
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity:  1 }}
                transition={{ delay: 0.5 }}
              >
                <label>
                  <Lock size={18} />
                  Password
                </label>
                <div className="input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
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
              </motion.div>

              <motion.div 
                className="form-options"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <label className="checkbox-label">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <a href="#" className="forgot-link">Forgot password?</a>
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
                initial={{ y: 20, opacity:  0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                {isLoading ? (
                  <motion.div
                    className="loading-spinner"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={20} />
                  </>
                )}
              </motion.button>
            </form>

            <motion.div 
              className="form-footer"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y:  0, opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <p>
                Don't have an account? {' '}
                <Link to="/register" className="link-primary">
                  Register here
                </Link>
              </p>
            </motion.div>

            <motion.div 
              className="divider"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.9 }}
            >
              <span>OR</span>
            </motion. div>

            <motion.div 
              className="social-login"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <motion.button 
                className="social-btn google"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-. 26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </motion.button>
              <motion.button 
                className="social-btn microsoft"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path fill="#f25022" d="M1 1h10v10H1z"/>
                  <path fill="#00a4ef" d="M13 1h10v10H13z"/>
                  <path fill="#7fba00" d="M1 13h10v10H1z"/>
                  <path fill="#ffb900" d="M13 13h10v10H13z"/>
                </svg>
                Continue with Microsoft
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;