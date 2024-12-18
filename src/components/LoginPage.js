import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios for making HTTP requests
import './LoginPage.css';

const LoginPage = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        // Basic validation
        if (username === '' || password === '') {
            setErrorMessage('Please enter both username and password.');
            return;
        }

        try {
            // Send a POST request to the backend with the username and password
            const response = await axios.post('http://localhost:5000/api/login', {
                username,
                password,
            });

            const { userId, token, isAdmin } = response.data;
            console.log('Login response:', response.data);


            // If login is successful, call the onLogin function
            onLogin();

            // Store the userId, token, and isAdmin in localStorage
            localStorage.setItem('userId', userId);
            localStorage.setItem('authToken', token);
            localStorage.setItem('isAdmin', isAdmin);


            // Redirect based on whether the user is an admin
            if (isAdmin) {
                navigate('/admin'); // Redirect to AdminPage
            } else {
                navigate('/home'); // Redirect to HomePage
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setErrorMessage('Invalid username or password.');
            } else {
                setErrorMessage('An error occurred. Please try again.');
            }
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Login</h2>
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                    <button type="submit" className="login-button">Login</button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
