import {
  ChevronDown,
  Menu,
  MessageCircle,
  Phone,
  Search,
  Send,
  Settings,
  UsersRound,
} from "lucide-react";
import Avatar from "./Avatar";

export default function Sidebar({
  phoneNumber,
  lastMessage,
  search,
  onSearchChange,
  status,
  connectionMessage,
  onOpenSettings,
  onOpenChat,
}) {
  const statusLabel = {
    connected: "Инстанс авторизован",
    connecting: "Проверяем инстанс…",
    notAuthorized: "Telegram не авторизован",
    error: "Ошибка подключения",
    disconnected: "Не подключён",
  }[status];

  return (
    <>
      <nav className="app-nav" aria-label="Навигация">
        <div className="app-nav-brand" aria-label="Telegram">
          <Send size={19} fill="currentColor" />
        </div>
        <button className="app-nav-item active" aria-label="Чаты" title="Чаты">
          <MessageCircle size={19} />
        </button>
        <button className="app-nav-item" aria-label="Контакты" title="Контакты">
          <UsersRound size={19} />
        </button>
        <button className="app-nav-item" aria-label="Звонки" title="Звонки">
          <Phone size={19} />
        </button>
        <div className="app-nav-spacer" />
        <button
          className="app-nav-item"
          aria-label="Настройки"
          title="Настройки"
          onClick={onOpenSettings}
        >
          <Settings size={19} />
        </button>
      </nav>

      <aside className="sidebar">
        <header className="sidebar-header">
          <div className="brand">
            <div className="brand-mark">
              <Send size={18} fill="currentColor" />
            </div>
            <span>Telegram</span>
          </div>
          <button className="icon-button" aria-label="Меню">
            <Menu size={20} />
          </button>
        </header>
        <div className="sidebar-tabs">
          <button className="tab active">
            Все чаты <span>{phoneNumber ? 1 : 0}</span>
          </button>
          <button className="tab">Непрочитанные</button>
        </div>
        <div className="search-box">
          <Search size={17} />
          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Поиск"
            aria-label="Поиск чатов"
          />
          <kbd>⌘ K</kbd>
        </div>
        {phoneNumber ? (
          <button className="chat-preview selected" onClick={onOpenChat}>
            <Avatar small />
            <span className="preview-copy">
              <strong>{phoneNumber}</strong>
              <small>{lastMessage || "Новый чат"}</small>
            </span>
            <span className="preview-meta">
              <span>сейчас</span>
            </span>
          </button>
        ) : (
          <div className="empty-list">
            <div className="empty-list-icon">
              <MessageCircle size={20} />
            </div>
            <strong>Здесь будут ваши чаты</strong>
            <span>Начните переписку по номеру телефона</span>
          </div>
        )}
        <footer className="sidebar-footer">
          <div className="connected-account" title={connectionMessage}>
            <span className={`status-dot ${status}`} />
            <div>
              <strong>GREEN-API · Telegram</strong>
              <small>{statusLabel}</small>
            </div>
            <button
              className="icon-button"
              onClick={onOpenSettings}
              aria-label="Настройки подключения"
            >
              <Settings size={18} />
            </button>
          </div>
          <div className="profile">
            <div className="profile-avatar">Я</div>
            <span>
              <strong>Мой аккаунт</strong>
              <small>личный профиль</small>
            </span>
            <ChevronDown size={16} />
          </div>
        </footer>
      </aside>
    </>
  );
}
