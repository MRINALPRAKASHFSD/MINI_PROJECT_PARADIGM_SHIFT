import React, { useState, useEffect, useRef } from 'react';
import { Send, User as UserIcon } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useDataStore } from '../../store/dataStore';
import socket from '../../services/socket';

import './PeerChat.css';

const PeerChat = () => {
  const { user } = useAuthStore();
  const messages = useDataStore(state => state.messages);
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const msgPayload = {
      senderId: user._id,
      senderName: user.name,
      senderAvatar: user.avatar || '',
      companyName: user.companyName,
      content: inputText.trim()
    };

    // Emit live 
    socket.emit('chatMessage', msgPayload);
    setInputText('');
  };

  return (
    <div className="peer-chat-container">
      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="empty-chat">
            <p>No messages yet. Be the first to start the conversation!</p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isMe = msg.senderId === user?._id || msg.senderName === user?.name;
            return (
              <div key={msg._id || idx} className={`chat-bubble-wrapper ${isMe ? 'is-me' : ''}`}>
                {!isMe && (
                  <div className="chat-avatar">
                    {msg.senderAvatar ? <img src={msg.senderAvatar} alt={msg.senderName} /> : <UserIcon size={14} />}
                  </div>
                )}
                <div className="chat-bubble">
                  {!isMe && <span className="chat-sender-name">{msg.senderName}</span>}
                  <p className="chat-content">{msg.content}</p>
                </div>
              </div>
            );
          })
        )}
        <div ref={chatEndRef} />
      </div>

      <form className="chat-input-area" onSubmit={handleSend}>
        <input 
          type="text" 
          placeholder="Type your message..." 
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <button type="submit" className="glass-btn primary-btn send-btn" disabled={!inputText.trim()}>
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default PeerChat;
