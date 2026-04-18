import { useState, useEffect } from 'react';
import Header from './components/Header';
import MessageForm from './components/MessageForm';
import Login from './components/Login';
import Message from './components/Message';

const API_URL = 'https://apichat.m89.pl/api/messages';

function App() {
  const [wiadomosci, setWiadomosci] = useState([]);
  const [mojNick, setMojNick] = useState(
    localStorage.getItem('shoutboxNick') || ''
  );

  useEffect(() => {
    const pobierzDane = async () => {
      try {
        const odpowiedz = await fetch(API_URL);
        const dane = await odpowiedz.json();
        setWiadomosci(dane);
      } catch (error) {
        console.error('Błąd pobierania wiadomości:', error);
      }
    };

    pobierzDane();

    const interval = setInterval(pobierzDane, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleDodajWiadomosc = async (nowyTekst) => {
    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          author: mojNick,
          text: nowyTekst,
        }),
      });
    } catch (error) {
      console.error('Błąd wysyłania wiadomości:', error);
    }
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

      <div className="chat-window">
        {wiadomosci.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#999' }}>
            Ładowanie wiadomości...
          </p>
        ) : (
          wiadomosci.map((msg) => (
            <Message key={msg.id} msg={msg} />
          ))
        )}
      </div>

      <MessageForm onWyslij={handleDodajWiadomosc} />
    </div>
  );
}

export default App;