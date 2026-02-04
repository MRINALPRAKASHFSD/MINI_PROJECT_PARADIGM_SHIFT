import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  CheckSquare, 
  Clock, 
  Camera,
  BarChart3,
  ArrowRight,
  Sparkles,
  Zap,
  Shield,
  TrendingUp,
  Award,
  Rocket
} from 'lucide-react';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: LayoutDashboard,
      title: 'Smart Dashboard',
      description: 'Get real-time insights into your productivity and performance metrics',
      gradient: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)',
      color: '#3B82F6'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Work seamlessly with your team members and track project progress',
      gradient: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
      color: '#8B5CF6'
    },
    {
      icon: CheckSquare,
      title: 'Task Management',
      description: 'Organize, prioritize, and complete tasks with our intuitive system',
      gradient: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
      color: '#10B981'
    },
    {
      icon: Clock,
      title: 'Time Tracking',
      description: 'Monitor work hours and optimize your time management effectively',
      gradient: 'linear-gradient(135deg, #06B6D4 0%, #22D3EE 100%)',
      color: '#06B6D4'
    },
    {
      icon: Camera,
      title: 'Proof Submission',
      description: 'Submit work proofs and screenshots with easy upload functionality',
      gradient: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
      color: '#F59E0B'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Visualize your performance with comprehensive charts and reports',
      gradient: 'linear-gradient(135deg, #EC4899 0%, #F472B6 100%)',
      color: '#EC4899'
    }
  ];

  const stats = [
    { label: 'Active Users', value: '10K+', icon: Users },
    { label: 'Tasks Completed', value: '500K+', icon: CheckSquare },
    { label: 'Hours Tracked', value: '2M+', icon: Clock },
    { label: 'Success Rate', value: '99%', icon: Award }
  ];

  return (
    <div className="landing-page">
      {/* Animated Background */}
      <div className="landing-background">
        <motion.div 
          className="gradient-orb orb-1"
          animate={{ 
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div 
          className="gradient-orb orb-2"
          animate={{ 
            x: [0, -80, 0],
            y: [0, 80, 0],
            scale: [1, 1.3, 1]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        />
        <motion.div 
          className="gradient-orb orb-3"
          animate={{ 
            x: [0, 60, 0],
            y: [0, -60, 0],
            scale: [1, 1.15, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 6 }}
        />
        <div className="grid-pattern"></div>
      </div>

      {/* Navigation */}
      <motion.nav 
        className="landing-nav"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="nav-container">
          <motion.div 
            className="nav-logo"
            whileHover={{ scale: 1.05 }}
          >
            <div className="logo-icon">
              <LayoutDashboard size={28} />
            </div>
            <span className="logo-text">Employee Portal</span>
          </motion.div>

          <div className="nav-links">
            <motion.button
  className="nav-link"
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  onClick={() => navigate('/login')}  // ✅ CORRECT - This goes to login
>
  Login
</motion.button>
            <motion.button
              className="nav-btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/register')}
            >
              Get Started
              <ArrowRight size={20} />
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div 
              className="hero-badge"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Sparkles size={16} />
              <span>Transform Your Workflow</span>
            </motion.div>

            <h1 className="hero-title">
              Empower Your Team with
              <span className="gradient-text"> Smart Employee Management</span>
            </h1>

            <p className="hero-description">
              Experience the future of workforce productivity with our all-in-one platform.
              Track tasks, manage time, collaborate seamlessly, and achieve more together.
            </p>

            <div className="hero-actions">
              <motion.button
                className="btn-primary"
                whileHover={{ scale: 1.05, boxShadow: '0 20px 60px rgba(99, 102, 241, 0.4)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/register')}
              >
                <Rocket size={20} />
                Start Free Trial
              </motion.button>

              <motion.button
                className="btn-secondary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/')}
              >
                Login to Dashboard
                <ArrowRight size={20} />
              </motion.button>
            </div>

            {/* Stats */}
            <div className="hero-stats">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="stat-item"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                >
                  <stat.icon size={20} />
                  <div>
                    <div className="stat-value">{stat.value}</div>
                    <div className="stat-label">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Hero Visual */}
          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="visual-container">
              <motion.div
                className="visual-card"
                animate={{ 
                  y: [0, -20, 0],
                  rotate: [0, 2, 0]
                }}
                transition={{ duration: 5, repeat: Infinity }}
              >
                <div className="card-icon">
                  <TrendingUp size={32} />
                </div>
                <div className="card-content">
                  <div className="card-title">Performance</div>
                  <div className="card-value">+24%</div>
                  <div className="card-chart"></div>
                </div>
              </motion.div>

              <motion.div
                className="visual-card visual-card-2"
                animate={{ 
                  y: [0, 15, 0],
                  rotate: [0, -2, 0]
                }}
                transition={{ duration: 6, repeat: Infinity, delay: 1 }}
              >
                <div className="card-icon green">
                  <CheckSquare size={32} />
                </div>
                <div className="card-content">
                  <div className="card-title">Tasks Done</div>
                  <div className="card-value">156</div>
                </div>
              </motion.div>

              <motion.div
                className="floating-icon"
                animate={{ 
                  y: [0, -30, 0],
                  rotate: [0, 360, 0]
                }}
                transition={{ duration: 8, repeat: Infinity }}
              >
                <Zap size={24} />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="section-badge">
              <Shield size={16} />
              <span>Powerful Features</span>
            </div>
            <h2 className="section-title">
              Everything You Need to <span className="gradient-text">Excel</span>
            </h2>
            <p className="section-description">
              Comprehensive tools designed to boost productivity and streamline your workflow
            </p>
          </motion.div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="feature-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <div 
                  className="feature-icon"
                  style={{ background: feature.gradient }}
                >
                  <feature.icon size={28} />
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
                <motion.div 
                  className="feature-glow"
                  style={{ background: feature.gradient }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <motion.div
          className="cta-container"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="cta-icon">
            <Rocket size={48} />
          </div>
          <h2 className="cta-title">Ready to Transform Your Workflow?</h2>
          <p className="cta-description">
            Join thousands of teams already using our platform to achieve more
          </p>
          <motion.button
            className="cta-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/register')}
          >
            Get Started Now
            <ArrowRight size={20} />
          </motion.button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-container">
          <div className="footer-logo">
            <LayoutDashboard size={24} />
            <span>Employee Portal</span>
          </div>
          <p className="footer-text">
            © 2026 Employee Portal. Empowering teams worldwide.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;