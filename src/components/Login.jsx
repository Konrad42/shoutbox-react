import { useState } from 'react';

function Login({ onZaloguj }) {
  const [nick, setNick] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nick.trim() === '') return;

    // Zapisujemy nick w pamięci przeglądarki
    localStorage.setItem('shoutboxNick', nick);

    // Informujemy App.jsx o zalogowaniu
    onZaloguj(nick);
  };

  return (
    <div style={{ textAlign: 'center', padding: '50px 20px' }}>
      <h2 style={{ color: '#8e44ad' }}>Wpisz swój nick, aby dołączyć</h2>

      <form
        onSubmit={handleSubmit}
        className="chat-form"
        style={{ justifyContent: 'center', borderTop: 'none' }}
      >
        <input
          type="text"
          placeholder="Twój nick..."
          value={nick}
          onChange={(e) => setNick(e.target.value)}
          style={{ maxWidth: '300px' }}
        />
        <button type="submit">Wejdź</button>
      </form>
    </div>
  );
}

export default Login;