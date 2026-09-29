import { ArrowLeft, MoreVertical, Search } from "lucide-react";
import Avatar from "./Avatar";
import MessageList from "./MessageList";
import MessageComposer from "./MessageComposer";

export default function Conversation({
  phoneNumber,
  status,
  messages,
  endRef,
  draft,
  onDraftChange,
  onSend,
  busy,
  error,
  onDismissError,
  onBack,
}) {
  const connectionLabel = {
    connected: "Telegram через GREEN-API",
    connecting: "подключение",
    notAuthorized: "Telegram не авторизован",
    error: "нет соединения",
    disconnected: "Telegram",
  }[status];

  return (
    <section className="conversation">
      <header className="conversation-header">
        <button
          className="icon-button back-button"
          onClick={onBack}
          aria-label="Назад"
        >
          <ArrowLeft size={20} />
        </button>
        <Avatar small />
        <div className="contact-heading">
          <strong>{phoneNumber}</strong>
          <span>
            <i className={`status-dot ${status}`} />
            {connectionLabel}
          </span>
        </div>
        <div className="header-actions">
          <button className="icon-button" aria-label="Поиск в чате">
            <Search size={19} />
          </button>
          <button className="icon-button" aria-label="Дополнительно">
            <MoreVertical size={19} />
          </button>
        </div>
      </header>
      <MessageList messages={messages} endRef={endRef} />
      <MessageComposer
        draft={draft}
        onDraftChange={onDraftChange}
        onSubmit={onSend}
        busy={busy}
        error={error}
        onDismissError={onDismissError}
      />
    </section>
  );
}
