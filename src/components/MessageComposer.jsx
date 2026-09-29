import { Paperclip, Send, Smile, X } from "lucide-react";

export default function MessageComposer({
  draft,
  onDraftChange,
  onSubmit,
  busy,
  error,
  onDismissError,
}) {
  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSubmit(event);
    }
  };

  return (
    <div className="composer-wrap">
      {error && (
        <div className="chat-error" role="alert">
          <span>{error}</span>
          <button onClick={onDismissError} aria-label="Скрыть">
            <X size={15} />
          </button>
        </div>
      )}
      <form className="composer" onSubmit={onSubmit}>
        <button
          type="button"
          className="icon-button composer-tool"
          aria-label="Прикрепить файл"
          title="Поддерживаются только текстовые сообщения"
        >
          <Paperclip size={19} />
        </button>
        <textarea
          value={draft}
          onChange={(event) => onDraftChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Написать сообщение…"
          aria-label="Текст сообщения"
          rows={1}
          maxLength={4096}
        />
        <button
          type="button"
          className="icon-button composer-tool emoji-button"
          aria-label="Добавить эмодзи"
          onClick={() => onDraftChange((text) => `${text} 😊`)}
        >
          <Smile size={19} />
        </button>
        <button
          type="submit"
          className="send-button"
          disabled={!draft.trim() || busy}
          aria-label="Отправить сообщение"
        >
          <Send size={18} fill="currentColor" />
        </button>
      </form>
      <div className="composer-hint">
        <span>
          Enter — отправить <b>·</b> Shift + Enter — новая строка
        </span>
        <span>{draft.length}/4096</span>
      </div>
    </div>
  );
}
