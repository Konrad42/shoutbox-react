import { useState } from 'react';

function MessageForm({ onSend, onTyping }) {
  const [text, setText] = useState('');

  const handleChange = (e) => {
    setText(e.target.value);
    onTyping();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    onSend(text);
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="chat-form">

      <input
        value={text}
        onChange={handleChange}
        placeholder="Napisz wiadomość..."
      />

      <button type="submit">
        Wyślij 🚀
      </button>

    </form>
  );
}

export default MessageForm;