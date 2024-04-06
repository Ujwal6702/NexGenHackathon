import React, { useState, useEffect } from 'react';
import './Dashboard.css'; // Import the corresponding CSS file
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [chats, setChats] = useState([[]]); // State to hold chat messages (array of chats)
  const [currentChatIndex, setCurrentChatIndex] = useState(0); // State to track the current chat index
  const [newMessage, setNewMessage] = useState(''); // State to track new message input
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setNewMessage(e.target.value); // Update new message input state
  };

  const handleSend = () => {
    if (newMessage.trim() !== '') {
      const updatedChats = [...chats];
      updatedChats[currentChatIndex] = [
        ...updatedChats[currentChatIndex],
        {
          content: newMessage,
          sentByUser: true // Assume message is sent by the user
        }
      ];
      setChats(updatedChats);

      // Clear the new message input
      setNewMessage('');
    }
  };

  useEffect(() => {
    // Check if auth_key is present in localStorage
    const authKey = localStorage.getItem("auth_key");
    if (!authKey) {
      // If auth_key is not set, redirect to login
      navigate("/");
    }
  }, []);

  // If auth_key is not set, return null to prevent rendering
  if (!localStorage.getItem("auth_key")) {
    return null;
  }
  const handleNewChat = () => {
    const newChat = [];
    setChats([...chats, newChat]);
    setCurrentChatIndex(chats.length); // Switch to the new chat index
    setNewMessage(''); // Clear the message input for the new chat
  };

  return (
    <div className="dashboard-container">
      {/* Chat History */}
      <div className="chat-history">
        {/* Render chat tabs for each chat */}
        {chats.map((chat, index) => (
          <button
            key={index}
            className={`chat-tab ${index === currentChatIndex ? 'active-chat' : ''}`}
            onClick={() => setCurrentChatIndex(index)}
          >
            Chat {index + 1}
          </button>
        ))}
        {/* Button to create a new chat */}
        <button className="new-chat-button" onClick={handleNewChat}>
          + New Chat
        </button>
      </div>

      {/* Chat Space */}
      <div className="chat-space">
        {/* Display messages of the current active chat */}
        <div className="chat-area">
          {chats[currentChatIndex].map((message, idx) => (
            <div key={idx} className={`chat-message ${message.sentByUser ? 'sent' : 'received'}`}>
              {message.content}
            </div>
          ))}
        </div>

        {/* Chat input */}
        <input
          type="text"
          className="chat-input"
          placeholder="Type your message here..."
          value={newMessage}
          onChange={handleInputChange}
        />
        <button className="send-button" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Dashboard;