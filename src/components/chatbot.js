import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './chatbot.css'; // Create this CSS file for styling

function Chatbot({ onClose }) {

  const [messages, setMessages] = useState([
    { text: 'Hello! How can I help you today?', sender: 'bot', ID: '' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const navigate = useNavigate();

  const keywordMap = {
    "metacognition": [
      { id: "66e722529767457287c121e1", title: "Metacognition: Your key to success" }
    ],
    "learning": [
      { id: "66e722529767457287c121e1", title: "Metacognition: Your key to success" }
    ],
    "success": [
      { id: "66e722529767457287c121e1", title: "Metacognition: Your key to success" }
    ],
    "vac": [
      { id: "66e72358bd2116c1d3750231", title: "Make the most of your vac" }
    ],
    "vacation": [
      { id: "66e72358bd2116c1d3750231", title: "Make the most of your vac" }
    ],
    "bsc": [
      { id: "66e724f154ca9d0b3ac54173", title: "How to succeed in your first BSc tests" }
    ],
    "test": [
      { id: "66e724f154ca9d0b3ac54173", title: "How to succeed in your first BSc tests" }
    ],
    "tests": [
      { id: "66e724f154ca9d0b3ac54173", title: "How to succeed in your first BSc tests" }
    ],
    "study": [
      { id: "66e724f154ca9d0b3ac54173", title: "How to succeed in your first BSc tests" }
    ],
    "culture": [
      { id: "66e7043042f6b3fe06f5f520", title: "Culture Shock" }
    ],
    "experience": [
      { id: "66e7043042f6b3fe06f5f520", title: "Culture Shock" }
    ],
    "people": [
      { id: "66e7043042f6b3fe06f5f520", title: "Culture Shock" }
    ],
    "brain": [
      { id: "66e7186f5fe243f4e7e06169", title: "So, how does your brain work?" }
    ],
    "mental": [
      { id: "66e7186f5fe243f4e7e06169", title: "So, how does your brain work?" }
    ],
    "lazy": [
      { id: "66e7186f5fe243f4e7e06169", title: "So, how does your brain work?" }
    ],
    "stress": [
      { id: "66e7186f5fe243f4e7e06169", title: "So, how does your brain work?" }
    ],
    "exam": [
      { id: "66e725c98c3712933eaef2ba", title: "Acing exam season" }
    ],
    "performance": [
      { id: "66e725c98c3712933eaef2ba", title: "Acing exam season" }
    ],
    "exams": [
      { id: "66e725c98c3712933eaef2ba", title: "Acing exam season" }
    ],
    "time": [
      { id: "66e71b53e6e5b8129f108d66", title: "Next-level time management for succeeding at UCT" }
    ],
    "succeed": [
      { id: "66e71b53e6e5b8129f108d66", title: "Next-level time management for succeeding at UCT" }
    ],
    "uct": [
      { id: "66e71b53e6e5b8129f108d66", title: "Next-level time management for succeeding at UCT" }
    ],
    "management": [
      { id: "66e71b53e6e5b8129f108d66", title: "Next-level time management for succeeding at UCT" }
    ],
    "well-being": [
      { id: "66e71fe9e779c53f953d4542", title: "The shape of your well-being" }
    ],
    "well being": [
      { id: "66e71fe9e779c53f953d4542", title: "The shape of your well-being" }
    ],
    "body": [
      { id: "66e71fe9e779c53f953d4542", title: "The shape of your well-being" }
    ],
    "health": [
      { id: "66e71fe9e779c53f953d4542", title: "The shape of your well-being" }
    ]
  };

  const extractKeywords = (text) => {
    const cleanText = text.toLowerCase().replace(/[.,]/g, '');
    return Array.from(new Set(cleanText.split(' ')));
  };

  const simulateTypingEffect = (fullText, sender, ID) => {
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < fullText.length) {
        setMessages(prevMessages => [
          ...prevMessages.slice(0, -1),
          { text: fullText.slice(0, i + 1), sender, ID }
        ]);
        i++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
      }
    }, 50); // Speed of typing effect (50ms per letter)
  };

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: 'user' }]);
      setInput('');
      setIsTyping(true);

      const keywords = extractKeywords(input);
      const resourceSuggestions = new Set();

      keywords.forEach(keyword => {
        if (keywordMap[keyword]) {
          keywordMap[keyword].forEach(resource => resourceSuggestions.add(resource));
        }
      });

      const typingMessage = { text: '', sender: 'bot', ID: '' }; // Temporary message while typing

      if (resourceSuggestions.size > 0) {
        const suggestions = Array.from(resourceSuggestions).map(resource => ({
          text: `I understand that finding the right resources can be overwhelming at times, but don't worry, I've got your back! Here a suggested resource (${resource.title}) that might be just what you're looking for to help with your current challenges. Just click on the button below to explore more details, and remember, if you need any further assistance, I'm here to guide you. Take it one step at a time—you've got this!`,
          sender: 'bot',
          resourceId: resource.id
        }));
        
        setMessages(prevMessages => [...prevMessages, typingMessage]); // Add temporary message
        simulateTypingEffect(suggestions[0].text, 'bot', suggestions[0].resourceId);
      } else {
        const notFoundMessage = "Sorry, I couldn't find any resources related to that.";
        setMessages(prevMessages => [...prevMessages, typingMessage]); // Add temporary message
        simulateTypingEffect(notFoundMessage, 'bot', '');
      }
    }
  };
  
  const handleResourceClick = (resourceId) => {
    // Navigate to the PDFView page with the resource ID
    navigate(`/pdf-view/${resourceId}`);
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <h4>Chat with Us</h4>
        <button onClick={onClose}>&times;</button>
      </div>
      <div className="chat-body">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.sender}`}>
            {msg.text}
            {/* Render the button only if resourceId exists */}
            {msg.ID && (
              <div className="resource-button-container">
                <button 
                  onClick={() => handleResourceClick(msg.ID)}
                  className="resource-button"
                >
                  View Resource
                </button>
              </div>
            )}
          </div>
        ))}
        {isTyping && <div className="typing-indicator">Typing...</div>}
      </div>
      <div className="chat-footer">
        <input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type your message..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Chatbot;
