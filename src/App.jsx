import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

import Header from './components/Header';
import MessageForm from './components/MessageForm';
import Login from './components/Login';
import Message from './components/Message';

const SOCKET_URL = 'https://apichat.m89.pl';
const API_URL = 'https://apichat.m89.pl/api/messages';

const socket = io(SOCKET_URL);

function App() {
  const [wiadomosci, setWiadomosci] = useState([]);

  const [mojNick, setMojNick] = useState(
    localStorage.getItem('shoutboxNick') || ''
  );

  const [ktoPisze, setKtoPisze] = useState(null);

  // 🔥 SYNCHRONIZACJA localStorage (ważne)
  useEffect(() => {
    if (mojNick) {
      localStorage.setItem('shoutboxNick', mojNick);
    }
  }, [mojNick]);

  useEffect(() => {
    socket.on('chat_update', (noweWiadomosci) => {
      setWiadomosci(noweWiadomosci);
    });

    let typingTimer;

    socket.on('is_typing', (nick) => {
      setKtoPisze(nick);

      clearTimeout(typingTimer);
      typingTimer = setTimeout(() => {
        setKtoPisze(null);
      }, 2000);
    });

    return () => {
      socket.off('chat_update');
      socket.off('is_typing');
    };
  }, []);

  const handleTyping = () => {
    if (!mojNick) return;
    socket.emit('typing', mojNick);
  };

  const handleDodajWiadomosc = async (nowyTekst) => {
    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author: mojNick, text: nowyTekst })
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleLajkuj = async (id) => {
    try {
      await fetch(`${API_URL}/${id}/like`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author: mojNick })
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleUsun = async (id) => {
    if (!window.confirm("Czy na pewno chcesz usunąć tę wiadomość?")) return;

    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error(error);
    }
  };

  // 🔥 PEWNE WYLOGOWANIE
  const handleWyloguj = () => {
    socket.disconnect(); // opcjonalnie, ale dobre UX
    localStorage.removeItem('shoutboxNick');
    setMojNick('');
  };

  if (!mojNick) {
    return (
      <div className="app-container">
        <Header />
        <Login onZaloguj={setMojNick} />
      </div>
    );
  }

  return (
    <div className="app-container">
      <Header />

      {/* WYLOGOWANIE */}
      <button
        onClick={handleWyloguj}
        style={{
          margin: '10px 20px',
          padding: '6px 12px',
          cursor: 'pointer'
        }}
      >
        Wyloguj
      </button>

      <div className="chat-window">
        {wiadomosci.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#999' }}>
            Ładowanie wiadomości...
          </p>
        ) : (
          wiadomosci.map((msg) => (
            <Message
              key={msg.id}
              msg={msg}
              mojNick={mojNick}
              onLike={handleLajkuj}
              onDelete={handleUsun}
            />
          ))
        )}
      </div>

      {/* INFO: kto pisze */}
      {ktoPisze && (
        <div
          style={{
            padding: '0 20px',
            fontSize: '0.85em',
            color: '#7f8c8d',
            fontStyle: 'italic',
            marginBottom: '5px'
          }}
        >
          ✏️ {ktoPisze} pisze wiadomość...
        </div>
      )}

      <MessageForm
        onWyslij={handleDodajWiadomosc}
        onTyping={handleTyping}
      />
    </div>
  );
}

export default App;