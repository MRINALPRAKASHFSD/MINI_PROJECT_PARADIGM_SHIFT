import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import './AnimatedBackground.css';

function AnimatedBackground() {
  const { isDarkMode } = useTheme();

  return (
    <div className={`animated-background ${isDarkMode ? 'dark' : 'light'}`}>
      {/* Gradient Orbs */}
      <motion.div
        className="orb orb-1"
        animate={{
          x: [0, 100, -50, 0],
          y:  [0, -100, 50, 0],
          scale: [1, 1.2, 0.8, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="orb orb-2"
        animate={{
          x: [0, -120, 80, 0],
          y:  [0, 80, -120, 0],
          scale:  [1, 0.8, 1.3, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="orb orb-3"
        animate={{
          x: [0, 150, -100, 0],
          y: [0, -80, 100, 0],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{
          duration: 30,
          repeat:  Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Floating Particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="particle"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            scale: Math.random() * 0.5 + 0.5,
          }}
          animate={{
            y: [null, Math.random() * -200, Math.random() * 200],
            x: [null, Math.random() * -100, Math.random() * 100],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat:  Infinity,
            ease: "easeInOut",
            delay: Math.random() * 5,
          }}
        />
      ))}

      {/* Grid Pattern */}
      <div className="grid-pattern">
        <svg width="100%" height="100%">
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <motion.path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke={isDarkMode ? "rgba(102, 126, 234, 0.1)" : "rgba(102, 126, 234, 0.05)"}
                strokeWidth="1"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Gradient Waves */}
      <div className="gradient-waves">
        <motion. div
          className="wave wave-1"
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 15,
            repeat:  Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="wave wave-2"
          animate={{
            x: ['100%', '-100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease:  "linear"
          }}
        />
        <motion.div
          className="wave wave-3"
          animate={{
            x:  ['-100%', '100%'],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Geometric Shapes */}
      <div className="geometric-shapes">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className={`shape shape-${(i % 3) + 1}`}
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              rotate: Math.random() * 360,
            }}
            animate={{
              rotate: [null, 360],
              y: [null, Math.random() * -300],
            }}
            transition={{
              duration: Math.random() * 20 + 15,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Spotlight Effect */}
      <motion.div
        className="spotlight"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Noise Overlay */}
      <div className="noise-overlay" />
    </div>
  );
}

export default AnimatedBackground;