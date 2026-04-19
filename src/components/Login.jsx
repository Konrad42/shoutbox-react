import { useState } from 'react';

function Login({ onZaloguj }) {
  const [nick, setNick] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (nick.trim() === '') return;

    // tylko przekazujemy do App.jsx
    onZaloguj(nick.trim());
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Wejdź na czat</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Wpisz nick..."
          value={nick}
          onChange={(e) => setNick(e.target.value)}
          style={{
            padding: '10px',
            fontSize: '16px',
            marginRight: '10px'
          }}
        />

        <button
          type="submit"
          style={{
            padding: '10px 15px',
            cursor: 'pointer'
          }}
        >
          Wejdź
        </button>
      </form>
    </div>
  );
}

export default Login;