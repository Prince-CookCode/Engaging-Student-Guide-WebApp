import React from 'react';
import './ProgressBar.css';

const ProgressBar = ({ progress = 70, label = 'Progress' }) => {
    return (
        <div className="progress-bar-container">
            <span className="label">{label}</span>
            <div className="progress-bar">
                <div className="progress" style={{ width: `${progress}%` }}></div>
            </div>
        </div>
    );
};

export default ProgressBar;
