function Message({ msg, mojNick, onLike, onDelete }) {
  return (
    <div
      className="message"
      style={{
        padding: '10px',
        margin: '10px 20px',
        borderRadius: '8px',
        background: '#f5f6f7',
        wordBreak: 'break-word'
      }}
    >
      {/* 👤 AUTOR */}
      <div
        style={{
          fontWeight: 'bold',
          marginBottom: '5px',
          fontSize: '0.95em'
        }}
      >
        {msg.author}
      </div>

      {/* 💬 TREŚĆ */}
      <div style={{ marginBottom: '10px' }}>
        {msg.text}
      </div>

      {/* ⚡ AKCJE */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {/* ❤️ LIKE */}
        <button
          onClick={() => onLike(msg.id)}
          style={{
            cursor: 'pointer',
            marginRight: '12px',
            border: 'none',
            background: 'transparent',
            fontSize: '16px'
          }}
        >
          ❤️ {msg.likes || 0}
        </button>

        {/* 🗑 USUŃ (tylko autor wiadomości) */}
        {msg.author === mojNick && (
          <button
            onClick={() => onDelete(msg.id)}
            style={{
              cursor: 'pointer',
              border: 'none',
              background: 'transparent',
              color: 'red',
              fontSize: '14px'
            }}
          >
            Usuń
          </button>
        )}
      </div>
    </div>
  );
}

export default Message;