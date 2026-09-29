import { useState } from "react";
import { ArrowLeft, CircleHelp, Settings, X } from "lucide-react";

export default function ConnectionModal({ settings, onClose, onSave }) {
  const [form, setForm] = useState(settings);
  const [showToken, setShowToken] = useState(false);
  const [error, setError] = useState("");

  const update = (field) => (event) =>
    setForm((current) => ({ ...current, [field]: event.target.value }));
  const submit = (event) => {
    event.preventDefault();
    if (
      !form.apiUrl.trim() ||
      !form.idInstance.trim() ||
      !form.apiTokenInstance.trim()
    ) {
      setError("Заполните все поля подключения.");
      return;
    }
    onSave({
      apiUrl: form.apiUrl.trim(),
      idInstance: form.idInstance.trim(),
      apiTokenInstance: form.apiTokenInstance.trim(),
    });
  };

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
      >
        <button
          className="icon-button modal-close"
          onClick={onClose}
          aria-label="Закрыть"
        >
          <X size={18} />
        </button>
        <div className="modal-icon">
          <Settings size={21} />
        </div>
        <p className="eyebrow">ПОДКЛЮЧЕНИЕ</p>
        <h2 id="settings-title">Telegram через GREEN-API</h2>
        <p className="modal-description">
          Укажите параметры вашего Telegram-инстанса из личного кабинета
          GREEN-API.
        </p>
        <form onSubmit={submit} className="credentials-form">
          <label>
            URL API
            <input
              value={form.apiUrl}
              onChange={update("apiUrl")}
              placeholder="https://api.green-api.com"
              autoComplete="url"
            />
          </label>
          <label>
            ID инстанса
            <input
              value={form.idInstance}
              onChange={update("idInstance")}
              placeholder="1101000000"
              autoComplete="off"
            />
          </label>
          <label>
            Токен инстанса
            <div className="token-input">
              <input
                type={showToken ? "text" : "password"}
                value={form.apiTokenInstance}
                onChange={update("apiTokenInstance")}
                placeholder="Токен из личного кабинета"
                autoComplete="new-password"
              />
              <button type="button" onClick={() => setShowToken(!showToken)}>
                {showToken ? "Скрыть" : "Показать"}
              </button>
            </div>
          </label>
          {error && <p className="form-error">{error}</p>}
          <div className="privacy-note">
            <CircleHelp size={16} />
            <span>
              Данные хранятся только в сессии этой вкладки и удаляются после её
              закрытия.
            </span>
          </div>
          <button className="primary-button full-button" type="submit">
            Сохранить и продолжить{" "}
            <ArrowLeft className="button-arrow" size={17} />
          </button>
        </form>
        <a
          className="docs-link"
          href="https://console.green-api.com/"
          target="_blank"
          rel="noreferrer"
        >
          Открыть личный кабинет GREEN-API ↗
        </a>
      </section>
    </div>
  );
}
