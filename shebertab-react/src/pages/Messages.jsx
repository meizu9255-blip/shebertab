import React, { useState, useEffect, useRef } from 'react';
import API_URL from '../config';
import { useNavigate, useSearchParams } from 'react-router-dom';
import io from 'socket.io-client';

const Messages = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/auth');
      return;
    }

    // Get current user
    fetch(`${API_URL}/api/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(r => r.json())
    .then(data => {
      if (data.user) {
        setCurrentUser(data.user);
        socketRef.current = io(API_URL);
        socketRef.current.emit('join', data.user.id);
        
        socketRef.current.on('new_message', (msg) => {
          setMessages(prev => [...prev, msg]);
        });
      }
    });

    // Fetch contacts
    fetch(`${API_URL}/api/messages/contacts`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(r => r.json())
    .then(data => {
      if (Array.isArray(data)) {
        setContacts(data);
        
        // Auto-select user from query params if passed
        const targetUserId = searchParams.get('userId');
        const targetUserName = searchParams.get('name');
        if (targetUserId && targetUserName) {
          const uId = parseInt(targetUserId, 10);
          const existing = data.find(c => c.id === uId);
          if (existing) {
            setSelectedUser(existing);
          } else {
            const newUser = { id: uId, name: targetUserName, email: 'Жаңа чат' };
            setContacts(prev => [newUser, ...prev]);
            setSelectedUser(newUser);
          }
        }
      }
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [navigate]);

  useEffect(() => {
    if (selectedUser) {
      const token = localStorage.getItem('token');
      fetch(`${API_URL}/api/messages/${selectedUser.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setMessages(data);
        scrollToBottom();
      });
    }
  }, [selectedUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ receiver_id: selectedUser.id, message_text: newMessage })
      });
      const data = await res.json();
      if (res.ok) {
        setMessages(prev => [...prev, data]);
        setNewMessage('');
      } else {
        alert(data.error || 'Қате орын алды');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 70px)', background: 'var(--bg)' }}>
      {/* Sidebar - Contacts */}
      <div style={{ width: '300px', background: 'var(--surface)', borderRight: '1px solid var(--border)', overflowY: 'auto' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', fontWeight: 'bold', fontSize: '18px' }}>
          Чаттар
        </div>
        {contacts.length === 0 ? (
          <div style={{ padding: '20px', color: 'var(--text-muted)' }}>Контактілер жоқ</div>
        ) : (
          contacts.map(contact => (
            <div 
              key={contact.id} 
              onClick={() => setSelectedUser(contact)}
              style={{ 
                padding: '15px 20px', 
                borderBottom: '1px solid var(--border)', 
                cursor: 'pointer',
                background: selectedUser?.id === contact.id ? 'var(--surface2)' : 'transparent',
                transition: 'background 0.2s'
              }}
            >
              <div style={{ fontWeight: '600' }}>{contact.name}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{contact.email}</div>
            </div>
          ))
        )}
      </div>

      {/* Main Chat Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div style={{ padding: '20px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', fontWeight: 'bold', fontSize: '18px' }}>
              {selectedUser.name}
            </div>

            {/* Messages */}
            <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {messages.map(msg => {
                const isMine = msg.sender_id === currentUser?.id;
                return (
                  <div key={msg.id} style={{ display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start' }}>
                    <div style={{ 
                      background: isMine ? 'var(--accent)' : 'var(--surface)', 
                      color: isMine ? 'white' : 'var(--text)',
                      padding: '10px 15px', 
                      borderRadius: '12px', 
                      maxWidth: '70%',
                      boxShadow: 'var(--shadow-sm)',
                      border: isMine ? 'none' : '1px solid var(--border)'
                    }}>
                      <div style={{ wordBreak: 'break-word' }}>{msg.message_text}</div>
                      <div style={{ fontSize: '10px', textAlign: 'right', marginTop: '5px', opacity: 0.7 }}>
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form onSubmit={sendMessage} style={{ padding: '20px', background: 'var(--surface)', borderTop: '1px solid var(--border)', display: 'flex', gap: '10px' }}>
              <input 
                type="text" 
                placeholder="Хабарлама жазыңыз..." 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', outline: 'none' }}
              />
              <button type="submit" style={{ padding: '12px 25px', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                Жіберу
              </button>
            </form>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            Хабарлама жазу үшін контактіні таңдаңыз
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;


