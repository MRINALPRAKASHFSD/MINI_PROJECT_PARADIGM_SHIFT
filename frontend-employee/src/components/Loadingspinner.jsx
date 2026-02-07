import React from 'react';
import './LoadingSpinner.css';

function LoadingSpinner({ size = 'md', fullScreen = false }) {
  const sizeClass = {
    sm: 'spinner-sm',
    md: 'spinner-md',
    lg: 'spinner-lg'
  }[size];

  const spinner = (
    <div className={`spinner ${sizeClass}`}>
      <div className="spinner-circle"></div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="spinner-fullscreen">
        {spinner}
      </div>
    );
  }

  return spinner;
}

export default LoadingSpinner;