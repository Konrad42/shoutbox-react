function Message({ msg, mojNick, onLike, onDelete }) {
  return (
    <div className="msg-box">

      <div className="msg-content">

        <div className="msg-header">
          <strong>{msg.author}</strong>
        </div>

        <div className="msg-text">
          {msg.text}
        </div>

        <div className="msg-actions">

          <button onClick={() => onLike(msg.id)}>
            ❤️ {msg.likes || 0}
          </button>

          {msg.author === mojNick && (
            <button onClick={() => onDelete(msg.id)}>
              🗑 Usuń
            </button>
          )}

        </div>

      </div>
    </div>
  );
}

export default Message;