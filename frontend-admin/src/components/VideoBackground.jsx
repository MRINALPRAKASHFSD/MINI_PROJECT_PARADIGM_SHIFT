import { useTheme } from '../context/ThemeContext';
import './VideoBackground.css';

function VideoBackground() {
  const { isDarkMode } = useTheme();

  return (
    <div className={`video-background-container ${isDarkMode ? 'dark' : 'light'}`}>
      {/* Animated Gradient Layers */}
      <div className="gradient-mesh">
        <div className="gradient-blob blob-1"></div>
        <div className="gradient-blob blob-2"></div>
        <div className="gradient-blob blob-3"></div>
        <div className="gradient-blob blob-4"></div>
      </div>

      {/* Animated Grid */}
      <div className="animated-grid">
        <div className="grid-line horizontal" style={{ top: '20%' }}></div>
        <div className="grid-line horizontal" style={{ top: '40%' }}></div>
        <div className="grid-line horizontal" style={{ top: '60%' }}></div>
        <div className="grid-line horizontal" style={{ top: '80%' }}></div>
        <div className="grid-line vertical" style={{ left: '20%' }}></div>
        <div className="grid-line vertical" style={{ left: '40%' }}></div>
        <div className="grid-line vertical" style={{ left: '60%' }}></div>
        <div className="grid-line vertical" style={{ left: '80%' }}></div>
      </div>

      {/* Floating Particles */}
      <div className="particles-layer">
        {[...Array(40)].map((_, i) => (
          <div 
            key={i}
            className="floating-particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${15 + Math.random() * 10}s`,
              width: `${2 + Math.random() * 3}px`,
              height: `${2 + Math.random() * 3}px`,
            }}
          />
        ))}
      </div>

      {/* Overlay */}
      <div className="background-overlay"></div>
    </div>
  );
}

export default VideoBackground;