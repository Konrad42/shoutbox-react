import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

import Login from './Login';
import MessageForm from './MessageForm';
import Message from './Message';

const BASE_URL = 'https://apichat.m89.pl';
const API_URL = `${BASE_URL}/api/messages`;

const socket = io(BASE_URL);

function App() {
  const [mojNick, setMojNick] = useState(
    localStorage.getItem('shoutboxNick') || ''
  );

  const [wiadomosci, setWiadomosci] = useState([]);
  const [ktoPisze, setKtoPisze] = useState(null);

  const typingTimerRef = useRef(null);

  // =========================
  // SOCKET SYNC
  // =========================
  useEffect(() => {
    socket.on('chat_update', (data) => {
      setWiadomosci(data);
    });

    socket.on('is_typing', (nick) => {
      setKtoPisze(nick);

      clearTimeout(typingTimerRef.current);

      typingTimerRef.current = setTimeout(() => {
        setKtoPisze(null);
      }, 2000);
    });

    return () => {
      socket.off('chat_update');
      socket.off('is_typing');
      clearTimeout(typingTimerRef.current);
    };
  }, []);

  // =========================
  // TYPING EVENT
  // =========================
  const handleTyping = () => {
    if (!mojNick) return;
    socket.emit('typing', mojNick);
  };

  // =========================
  // SEND MESSAGE
  // =========================
  const handleSend = async (text) => {
    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author: mojNick, text })
      });
    } catch (err) {
      console.error(err);
    }
  };

  // =========================
  // LIKE (FIXED)
  // =========================
  const handleLike = async (id) => {
    try {
      await fetch(`${API_URL}/${id}/like`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author: mojNick })
      });
    } catch (err) {
      console.error(err);
    }
  };

  // =========================
  // DELETE
  // =========================
  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });
    } catch (err) {
      console.error(err);
    }
  };

  // =========================
  // LOGIN GUARD
  // =========================
  if (!mojNick) {
    return <Login setMojNick={setMojNick} />;
  }

  return (
    <div className="app-container">

      <h2>💬 Shoutbox PRO</h2>

      {/* TYPING INDICATOR */}
      {ktoPisze && ktoPisze !== mojNick && (
        <div style={{ fontSize: '0.8em', color: '#777', marginBottom: 10 }}>
          ✏️ {ktoPisze} pisze...
        </div>
      )}

      {/* CHAT */}
      <div className="chat-window">
        {wiadomosci.map((msg) => (
          <Message
            key={msg.id}
            msg={msg}
            mojNick={mojNick}
            onLike={handleLike}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* FORM */}
      <MessageForm
        onSend={handleSend}
        onTyping={handleTyping}
      />
    </div>
  );
}

export default App;