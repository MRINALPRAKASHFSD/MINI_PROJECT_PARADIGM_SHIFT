import { motion } from 'framer-motion';

const BackgroundPattern = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50" />
      
      {/* Animated Blobs */}
      <motion. div
        className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70"
        animate={{
          x: [0, 100, 0],
          y:  [0, 50, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat:  Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70"
        animate={{
          x: [0, -100, 0],
          y:  [0, 100, 0],
          scale:  [1, 1.2, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70"
        animate={{
          x: [0, 50, 0],
          y: [0, -50, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.div
        className="absolute bottom-20 right-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70"
        animate={{
          x: [0, -50, 0],
          y:  [0, 50, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Grid Pattern */}
      <div className="absolute inset-0" style={{
        backgroundImage: `
          linear-gradient(to right, rgba(99, 102, 241, 0.05) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(99, 102, 241, 0.05) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px'
      }} />

      {/* Floating Particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-blue-400 rounded-full opacity-20"
          style={{
            left:  `${Math.random() * 100}%`,
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
  );
};

export default BackgroundPattern;