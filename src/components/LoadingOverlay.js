// components/LoadingOverlay.js
import React from 'react';

const LoadingOverlay = ({ progress }) => {
  return (
    <div className="loading-overlay">
      <div className="loading-content">
        <div className="spinner"></div>
        {progress > 0 && (
          <div className="loading-progress">
            <div className="progress-text">{Math.round(progress)}%</div>
            <div className="progress-bar">
              <div 
                className="progress" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingOverlay;