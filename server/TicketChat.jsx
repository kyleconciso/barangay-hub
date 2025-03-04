const { useState } = React;

const TicketChat = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [isEmployee, setIsEmployee] = useState(false);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      setChat([...chat, { sender: isEmployee ? "Employee" : "User", message }]);
      setMessage("");
    }
  };

  return (
    <div className="ticket-chat-container">
      <h3>Chat</h3>
      <div className="ticket-chat-messages">
        {chat.map((chatMessage, index) => (
          <div
            key={index}
            className={`ticket-message ${
              chatMessage.sender === "User" ? "user-message" : "employee-message"
            }`}
          >
            <strong>{chatMessage.sender}:</strong>
            <p>{chatMessage.message}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage}>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="ticket-input"
        />
        <button type="submit" className="ticket-button">
          Send
        </button>
      </form>
    </div>
  );
};

export default TicketChat;
