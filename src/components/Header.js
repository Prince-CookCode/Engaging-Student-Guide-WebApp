import React from 'react';
import { Link} from 'react-router-dom';
import './Header.css'; // Make sure you update your CSS too

const Header = ({onLogout}) => {

    
    // Function to handle the logout confirmation
    const handleLogoutClick = () => {
        const userConfirmed = window.confirm('Are you sure you want to log out?');

        if (userConfirmed) {
            // If the user clicks "OK", perform the logout and other logic
            onLogout();
            console.log('User confirmed logout. Performing logout and additional logic.');
            // You can add any other logic here, such as clearing additional session data, etc.
        } else {
            // If the user clicks "Cancel", don't log out and just return
            console.log('User cancelled the logout action.');
        }
    };


    return (
        <div className="header">
            <div className="nav">
                <h1 className="site-title">SCIENCE IS TOUGH (BUT SO ARE YOU!)</h1>
                <Link to="/" className="nav-link">Home</Link>
                <Link to="/contentgrid" className="nav-link">Resources</Link>
                <Link to="/dashboard" className="nav-link">Dashboard</Link>

                <button onClick={handleLogoutClick } className="nav-link contact-btn">
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Header;