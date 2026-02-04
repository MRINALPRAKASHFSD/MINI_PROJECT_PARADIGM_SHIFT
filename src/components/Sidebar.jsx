import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  Clock,
  Camera,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  Sparkles,
  Zap
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const menuItems = [
    { 
      path: '/dashboard', 
      icon: LayoutDashboard, 
      label: 'Dashboard', 
      color: '#3B82F6',
      gradient: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)',
      particles: '✨'
    },
    { 
      path: '/teams', 
      icon: Users, 
      label: 'Teams', 
      color: '#8B5CF6',
      gradient: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
      particles: '👥'
    },
    { 
      path: '/tasks', 
      icon: CheckSquare, 
      label: 'Tasks', 
      color:  '#10B981',
      gradient: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
      particles: '✓'
    },
    { 
      path: '/time-tracker', 
      icon: Clock, 
      label: 'Time Tracker', 
      color:  '#06B6D4',
      gradient: 'linear-gradient(135deg, #06B6D4 0%, #22D3EE 100%)',
      particles: '⏱'
    },
    { 
      path: '/submit-proof', 
      icon: Camera, 
      label: 'Submit Proof', 
      color: '#F59E0B',
      gradient: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
      particles: '📸'
    },
    { 
      path: '/reports', 
      icon: FileText, 
      label: 'Reports', 
      color: '#EC4899',
      gradient: 'linear-gradient(135deg, #EC4899 0%, #F472B6 100%)',
      particles: '📄'
    },
    { 
      path: '/analytics', 
      icon: BarChart3, 
      label:  'Analytics', 
      color: '#6366F1',
      gradient: 'linear-gradient(135deg, #6366F1 0%, #818CF8 100%)',
      particles: '📊'
    },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Enhanced Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion. div
            className="sidebar-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity:  0 }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Grand Sidebar */}
      <motion.aside
        className="professional-sidebar glass-sidebar"
        initial={{ x: -320, opacity: 0 }}
        animate={{ 
          x: isOpen ? 0 : -320,
          opacity: isOpen ?  1 : 0
        }}
        transition={{ 
          type: 'spring', 
          stiffness: 200, 
          damping: 25,
          mass: 0.8
        }}
      >
        {/* Animated Background Layers */}
        <div className="sidebar-gradient-bg">
          <motion.div 
            className="gradient-blob blob-1"
            animate={{ 
              x: [0, 30, 0],
              y: [0, -40, 0],
              scale:  [1, 1.2, 1]
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
          <motion.div 
            className="gradient-blob blob-2"
            animate={{ 
              x: [0, -40, 0],
              y:  [0, 30, 0],
              scale: [1, 1.15, 1]
            }}
            transition={{ 
              duration:  10,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 2
            }}
          />
          <motion.div 
            className="gradient-blob blob-3"
            animate={{ 
              x: [0, 20, 0],
              y:  [0, -20, 0],
              scale:  [1, 1.1, 1]
            }}
            transition={{ 
              duration: 12,
              repeat: Infinity,
              ease: 'easeInOut',
              delay:  4
            }}
          />
        </div>

        {/* Floating Particles */}
        <div className="floating-particles">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${10 + Math.random() * 10}s`
              }}
              initial={{ y: 0, opacity: 0 }}
              animate={{ 
                y: -500,
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 10 + Math.random() * 10,
                repeat: Infinity,
                delay: Math.random() * 5
              }}
            >
              ✨
            </motion.div>
          ))}
        </div>

        {/* Grand Header */}
        <motion.div 
          className="sidebar-header"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
        >
          <motion.div 
            className="sidebar-brand"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div 
              className="brand-icon"
              animate={{ 
                rotateY: [0, 360],
                boxShadow: [
                  '0 8px 24px rgba(59, 130, 246, 0.4)',
                  '0 12px 32px rgba(139, 92, 246, 0.6)',
                  '0 8px 24px rgba(59, 130, 246, 0.4)'
                ]
              }}
              transition={{ 
                rotateY: {
                  duration: 4,
                  repeat: Infinity,
                  repeatDelay: 3,
                  ease: 'easeInOut'
                },
                boxShadow: {
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }
              }}
            >
              <LayoutDashboard size={24} strokeWidth={2.5} />
              <motion.div 
                className="icon-glow"
                animate={{ 
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity
                }}
              />
            </motion.div>
            <div className="brand-text">
              <motion.h1
                initial={{ x: -20, opacity: 0 }}
                animate={{ x:  0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Employee Portal
              </motion.h1>
              <motion.p
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity:  1 }}
                transition={{ delay: 0.4 }}
              >
                Productivity Hub
              </motion.p>
            </div>
          </motion.div>

          <motion.button
            className="sidebar-close glass-button"
            onClick={() => setIsOpen(false)}
            whileHover={{ 
              scale: 1.15, 
              rotate: 90,
              backgroundColor: 'rgba(239, 68, 68, 0.2)'
            }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft size={20} />
          </motion.button>
        </motion.div>

        {/* Animated Divider */}
        <motion.div 
          className="sidebar-divider"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <motion.span 
            className="divider-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <Sparkles size={12} className="divider-icon" />
            NAVIGATION
          </motion.span>
        </motion.div>

        {/* Grand Navigation */}
        <nav className="sidebar-nav">
          {menuItems.map((item, index) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {({ isActive }) => (
                <motion.div
                  className="nav-item-wrapper"
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ 
                    delay: 0.1 * index,
                    type: 'spring',
                    stiffness: 200,
                    damping: 20
                  }}
                  whileHover={{ 
                    x: 12,
                    scale: 1.03,
                    transition: { type: 'spring', stiffness: 400, damping: 15 }
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="nav-item-content">
                    {/* Animated Icon */}
                    <motion.div
                      className="nav-icon-wrapper"
                      style={{ 
                        background: isActive ? item.gradient : 'transparent',
                        border: isActive ? 'none' : `2px solid ${item.color}40`,
                        boxShadow: isActive ? `0 8px 24px ${item.color}60` : 'none'
                      }}
                      animate={isActive ? {
                        rotate: [0, -10, 10, -10, 0],
                        scale: [1, 1.1, 1.1, 1.1, 1]
                      } : {}}
                      transition={{
                        duration: 0.6,
                        repeat: isActive ? Infinity : 0,
                        repeatDelay: 3
                      }}
                      whileHover={{ 
                        rotate: 360,
                        scale: 1.15,
                        background: item.gradient,
                        boxShadow:  `0 12px 32px ${item.color}80`,
                        transition: { duration:  0.6 }
                      }}
                    >
                      <item.icon size={20} strokeWidth={2.5} />
                      
                      {/* Icon Particles */}
                      <AnimatePresence>
                        {(hoveredIndex === index || isActive) && (
                          <motion. div
                            className="icon-particle"
                            initial={{ scale:  0, opacity: 0 }}
                            animate={{ 
                              scale: [0, 1.5, 0],
                              opacity: [0, 1, 0]
                            }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ 
                              duration: 1,
                              repeat: Infinity,
                              repeatDelay: 1
                            }}
                          >
                            {item.particles}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>

                    {/* Label with Character Animation */}
                    <div className="nav-label-wrapper">
                      <motion.span className="nav-label">
                        {item.label. split('').map((char, i) => (
                          <motion.span
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * index + 0.02 * i }}
                            whileHover={{ 
                              y: -2,
                              transition: { type: 'spring', stiffness: 500 }
                            }}
                            style={{ display: 'inline-block' }}
                          >
                            {char === ' ' ? '\u00A0' : char}
                          </motion.span>
                        ))}
                      </motion.span>
                    </div>
                  </div>

                  {/* Active Indicator with Ripple */}
                  {isActive && (
                    <>
                      <motion.div
                        className="active-indicator"
                        layoutId="activeTab"
                        style={{ background: item.gradient }}
                        initial={{ scaleY: 0, opacity: 0 }}
                        animate={{ scaleY: 1, opacity: 1 }}
                        transition={{ 
                          type: 'spring',
                          stiffness: 300,
                          damping:  25
                        }}
                      >
                        <motion.div
                          className="indicator-pulse"
                          animate={{ 
                            scale: [1, 1.5, 1],
                            opacity: [0.8, 0, 0.8]
                          }}
                          transition={{ 
                            duration: 2,
                            repeat: Infinity
                          }}
                        />
                      </motion.div>

                      {/* Energy Lines */}
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="energy-line"
                          style={{ background: item.gradient }}
                          initial={{ x: -100, opacity: 0 }}
                          animate={{ 
                            x: 300,
                            opacity: [0, 1, 0]
                          }}
                          transition={{
                            duration: 2,
                            delay: i * 0.3,
                            repeat: Infinity,
                            repeatDelay:  2
                          }}
                        />
                      ))}
                    </>
                  )}

                  {/* Hover Glow with Pulse */}
                  <motion.div 
                    className="nav-glow" 
                    style={{ background: item.gradient }}
                    animate={{ 
                      opacity: isActive ? 0.2 : (hoveredIndex === index ? 0.15 : 0)
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </motion. div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Grand Bottom Section */}
        <motion.div 
          className="sidebar-bottom"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <motion.div 
            className="sidebar-divider"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay:  0.9 }}
          >
            <span className="divider-text">
              <Zap size={12} className="divider-icon" />
              SYSTEM
            </span>
          </motion.div>

          {/* Settings Button */}
          <motion.button
            className="bottom-item glass-button"
            onClick={() => navigate('/settings')}
            whileHover={{ 
              x: 12, 
              scale: 1.03,
              backgroundColor: 'rgba(99, 102, 241, 0.1)'
            }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div 
              className="bottom-icon"
              whileHover={{ 
                rotate: 180,
                scale: 1.1,
                background: 'linear-gradient(135deg, #6366F1 0%, #818CF8 100%)',
                boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)'
              }}
              transition={{ duration: 0.6 }}
            >
              <Settings size={20} strokeWidth={2.5} />
            </motion.div>
            <span>Settings</span>
            <motion.div
              className="button-shine"
              animate={{ x: [-100, 300] }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                repeatDelay: 2
              }}
            />
          </motion. button>

          {/* Logout Button */}
          <motion.button
            className="bottom-item logout-item glass-button"
            onClick={handleLogout}
            whileHover={{ 
              x:  12, 
              scale:  1.03,
              backgroundColor: 'rgba(239, 68, 68, 0.2)'
            }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div 
              className="bottom-icon logout-icon"
              whileHover={{ 
                x: 8,
                scale: 1.1,
                boxShadow: '0 12px 32px rgba(220, 38, 38, 0.6)'
              }}
            >
              <LogOut size={20} strokeWidth={2.5} />
            </motion.div>
            <span>Logout</span>
            <motion.div
              className="button-shine"
              animate={{ x: [-100, 300] }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                repeatDelay: 2,
                delay: 1
              }}
            />
          </motion.button>

          {/* Status Bar with Pulse */}
          <motion.div 
            className="status-bar glass-light"
            whileHover={{ scale: 1.02 }}
          >
            <motion.div 
              className="status-dot"
              animate={{ 
                scale: [1, 1.3, 1],
                opacity:  [1, 0.6, 1],
                boxShadow: [
                  '0 0 12px #10B981',
                  '0 0 24px #10B981',
                  '0 0 12px #10B981'
                ]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity
              }}
            />
            <span className="status-text">System Online</span>
            <motion.div
              className="status-wave"
              animate={{ 
                scaleX: [0, 1, 0],
                opacity: [0, 0.5, 0]
              }}
              transition={{ 
                duration:  2,
                repeat: Infinity
              }}
            />
          </motion.div>
        </motion.div>
      </motion. aside>
    </>
  );
};

export default Sidebar;