import { CheckCheck, MessageCircle } from "lucide-react";
import { formatMessageTime } from "../utils/messages";

export default function MessageList({ messages, endRef }) {
  return (
    <div className="message-area">
      {messages.length === 0 ? (
        <div className="chat-empty">
          <div className="chat-empty-icon">
            <MessageCircle size={22} />
          </div>
          <strong>Это начало вашего диалога</strong>
          <span>Отправьте сообщение, чтобы начать общение</span>
          <div className="day-separator">
            <span>СЕГОДНЯ</span>
          </div>
        </div>
      ) : (
        <>
          <div className="day-separator">
            <span>СЕГОДНЯ</span>
          </div>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message-row ${message.direction}`}
            >
              <div className="message-bubble">
                {message.text}
                <div className="message-meta">
                  <time>{formatMessageTime(message.timestamp)}</time>
                  {message.direction === "outgoing" && <CheckCheck size={14} />}
                </div>
              </div>
            </div>
          ))}
        </>
      )}
      <div ref={endRef} />
    </div>
  );
}
