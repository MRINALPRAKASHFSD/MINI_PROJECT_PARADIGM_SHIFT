import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Coffee, Brain } from 'lucide-react';
import './Widgets.css';

const FocusTimer = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Auto-switch mode on completion
      if (isBreak) {
        setIsBreak(false);
        setTimeLeft(25 * 60);
      } else {
        setIsBreak(true);
        setTimeLeft(5 * 60);
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, isBreak]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(isBreak ? 5 * 60 : 25 * 60);
  };
  
  const switchMode = (breakMode) => {
    setIsBreak(breakMode);
    setIsActive(false);
    setTimeLeft(breakMode ? 5 * 60 : 25 * 60);
  };

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  
  // Calculate progress circle stroke dasharray
  const totalTime = isBreak ? 5 * 60 : 25 * 60;
  const percentage = ((totalTime - timeLeft) / totalTime) * 100;

  return (
    <div className={`workspace-widget timer-widget ${isBreak ? 'break-mode' : ''}`}>
      <div className="widget-header">
        <div className="timer-mode-toggles">
          <button className={!isBreak ? 'active' : ''} onClick={() => switchMode(false)}>
            <Brain size={14}/> Focus
          </button>
          <button className={isBreak ? 'active' : ''} onClick={() => switchMode(true)}>
            <Coffee size={14}/> Break
          </button>
        </div>
      </div>

      <div className="timer-display-container">
        <svg className="timer-ring" viewBox="0 0 100 100">
          <circle className="timer-bg" cx="50" cy="50" r="45" />
          <circle 
            className="timer-progress" 
            cx="50" cy="50" r="45" 
            strokeDasharray={`${(percentage * 283) / 100} 283`}
          />
        </svg>
        <div className="timer-text">
          <h1>{String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}</h1>
          <p>{isBreak ? 'Relax.' : 'Deep Work.'}</p>
        </div>
      </div>

      <div className="timer-controls">
        <button className="play-btn" onClick={toggleTimer}>
          {isActive ? <Pause size={20} /> : <Play size={20} className="play-icon" />}
        </button>
        <button className="reset-btn" onClick={resetTimer}>
          <RotateCcw size={18} />
        </button>
      </div>
    </div>
  );
};

export default FocusTimer;
