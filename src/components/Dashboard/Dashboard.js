import React from 'react';
import ProgressBar from './ProgressBar/ProgressBar';
import BarChart from './BarChart/BarChart';

const Dashboard = () => {
  const userId = localStorage.getItem('userId'); // Retrieve userId from localStorage

  return (
    <div className="dashboard" style={{ marginTop: '100px', alignItems: 'center', cursor: 'pointer' }}>
      <h1>User Progress Dashboard</h1>
      
      <div className="dashboard-section">
        <h2>Progress Overview</h2>
        <ProgressBar label="Quiz Completion" /> {/* Uses default progress */}
        <ProgressBar label="Resources Read" progress={60} /> {/* Custom progress */}
      </div>

      <div className="dashboard-section">
        <h2>Quiz Scores by Module</h2>
        {userId ? (  // Check if userId is available
          <BarChart userId={userId} /> // Pass userId to BarChart
        ) : (
          <p>Please log in to see your quiz scores.</p> // Message if userId is not available
        )}
      </div>
    </div>
  );
};

export default Dashboard;
