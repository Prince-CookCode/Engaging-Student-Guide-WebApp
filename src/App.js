import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import ContentGrid from './components/ContentGrid';
import Chatbot from './components/chatbot';
import Dashboard from './components/Dashboard/Dashboard';
import LoginPage from './components/LoginPage';
import AdminPage from './components/AdminPage';
import PdfViewPage from './components/PdfViewPage';
import TakeQuiz from './components/TakeQuiz';
import './App.css';

function App() {
  const [showChatbot, setShowChatbot] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    setIsAuthenticated(true);
    navigate('/home');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const toggleChat = () => {
    setShowChatbot(!showChatbot);
  };


  return (
    <div className="App">
      <Routes>
        <Route path="/" element={
          !isAuthenticated ? (
            <LoginPage onLogin={handleLogin} />
          ) : (
            <Navigate to="/home" />
          )
        } />

        <Route path="/home" element={
          isAuthenticated ? (
            <>
              <Header onLogout={handleLogout}/>
              <Hero />
              <div>
                <div 
                  className="chat-icon-wrapper" 
                  onClick={toggleChat} 
                  style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                >
                  <span>Chat with the Bot</span>
                </div>
                <img 
                  src="./images/chatbot.jpg" 
                  alt="Chat Icon" 
                  className="chatbot-icon"
                  onClick={toggleChat}
                />
                {showChatbot && <Chatbot onClose={toggleChat} />}
              </div>
            </>
          ) : (
            <Navigate to="/" />
          )
        } />

        <Route path="/pdf-view/:id" element={
          isAuthenticated ? (
            <>
              <Header onLogout={handleLogout}/>
              <PdfViewPage />
              <div className="chatbot-icon" onClick={() => setShowChatbot(!showChatbot)}>
                <img src="./images/chatbot.jpg" alt="Chatbot Icon" />
              </div>
              {showChatbot && <Chatbot onClose={() => setShowChatbot(false)} />}
            </>
          ) :(
            <Navigate to="/" />
          )
        } />

        <Route path="/take-quiz/:id" element={
          isAuthenticated ? (
            <>
              <Header onLogout={handleLogout}/>
              <TakeQuiz />
              <div className="chatbot-icon" onClick={() => setShowChatbot(!showChatbot)}>
                <img src="./images/chatbot.jpg" alt="Chatbot Icon" />
              </div>
              {showChatbot && <Chatbot onClose={() => setShowChatbot(false)} />}
            </>
          ) : (
            <Navigate to="/" />
          )
        } />

        <Route path="/contentgrid" element={
          isAuthenticated ? (
            <>
              <Header onLogout={handleLogout}/>
              <ContentGrid />
              <div className="chatbot-icon" onClick={() => setShowChatbot(!showChatbot)}>
                <img src="./images/chatbot.jpg" alt="Chatbot Icon" />
              </div>
              {showChatbot && <Chatbot onClose={() => setShowChatbot(false)} />}
            </>
          ) : (
            <Navigate to="/" />
          )
        } />

        <Route path="/dashboard" element={
          isAuthenticated ? (
            <>
              <Header onLogout={handleLogout}/>
              <Dashboard />
              <div className="chatbot-icon" onClick={() => setShowChatbot(!showChatbot)}>
                <img src="./images/chatbot.jpg" alt="Chatbot Icon" />
              </div>
              {showChatbot && <Chatbot onClose={() => setShowChatbot(false)} />}
            </>
          ) : (
            <Navigate to="/" />
          )
        } />

        <Route path="/admin" element={<AdminPage />} />

        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
    </div>
  );
}

export default App;
