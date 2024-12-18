import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import './BarChart.css';
import { fetchUserProgress } from './progressTracker';

// Register the required components
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const BarChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{
      label: 'Quiz Scores',
      data: [],
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    }]
  });

  useEffect(() => {
    const loadProgressData = async () => {
      try {
        const quizScores = await fetchUserProgress(); // No need to pass userId

        // Handle quizScores as before
        const resourceNames = Object.keys(quizScores);
        const scores = Object.values(quizScores);

        setChartData({
          labels: resourceNames,
          datasets: [{
            label: 'Quiz Scores',
            data: scores,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          }]
        });
      } catch (error) {
        console.error('Error fetching user progress:', error);
      }
    };

    loadProgressData();
  }, []);

  const options = {
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw}`,
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Modules',
        },
      },
      y: {
        beginAtZero: true,
        min: 0,  // Set the minimum value to 0
        max: 100,  // Set the maximum value to 100
        ticks: {
          stepSize: 20,  // Set the interval for the ticks
        },
        title: {
          display: true,
          text: 'Scores',
        },
      },
    },
  };

  return (
    <div className="bar-chart">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default BarChart;
