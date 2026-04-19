import { useState } from 'react';

function Login({ setMojNick }) {
  const [nick, setNick] = useState('');

  const handleLogin = () => {
    if (!nick.trim()) return;

    localStorage.setItem('shoutboxNick', nick);
    setMojNick(nick);
  };

  return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <h1>💬 Shoutbox PRO</h1>

      <input
        placeholder="Twój nick"
        value={nick}
        onChange={(e) => setNick(e.target.value)}
      />

      <button onClick={handleLogin} style={{ marginLeft: 10 }}>
        Wejdź
      </button>
    </div>
  );
}

export default Login;