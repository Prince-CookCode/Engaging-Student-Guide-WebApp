import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import for navigation
import './Hero.css'; // Create this CSS file for the hero section

const Hero = () => {
    const navigate = useNavigate(); // Initialize navigation hook

    const handleCardClick = () => {
        navigate('/contentgrid');
    }

    return (
        <div className="hero">
            <div className="hero-content">
                <h1>Science is Tough (But So Are You!)</h1>
                <p>Navigate and thrive through the challenges of a BSc degree at UCT.</p>
                <a className="btn" onClick={() => handleCardClick()}>View Resources</a>
            </div>
        </div>

        

    );
};

export default Hero;
