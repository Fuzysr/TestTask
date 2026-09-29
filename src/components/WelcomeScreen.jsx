import { ArrowLeft, MessageCircle, Send, Sparkles } from "lucide-react";

export default function WelcomeScreen({
  phoneNumber,
  onPhoneChange,
  onSubmit,
  error,
  busy,
}) {
  return (
    <div className="welcome-wrap">
      <div className="welcome-card">
        <div className="welcome-art">
          <div className="art-orbit orbit-one" />
          <div className="art-orbit orbit-two" />
          <div className="art-glow" />
          <div className="welcome-bubble bubble-back">
            <span>✓✓</span>
          </div>
          <div className="welcome-bubble bubble-front">
            <MessageCircle size={27} fill="currentColor" />
          </div>
          <div className="sparkle sparkle-a">✦</div>
          <div className="sparkle sparkle-b">✧</div>
        </div>
        <div className="welcome-chip">
          <Sparkles size={13} /> ПРОСТОЕ ОБЩЕНИЕ
        </div>
        <h1>
          Всё начинается
          <br />с сообщения
        </h1>
        <p>
          Напишите первым. Ответ появится здесь,
          <br />
          как только собеседник ответит в Telegram.
        </p>
        <form className="start-form" onSubmit={onSubmit}>
          <div className="phone-field">
            <span className="phone-prefix">+</span>
            <input
              value={phoneNumber}
              onChange={(event) => onPhoneChange(event.target.value)}
              placeholder="7 999 123-45-67"
              aria-label="Номер телефона получателя"
              inputMode="tel"
              autoComplete="tel"
            />
            <Send className="country-flag" size={14} />
          </div>
          <button className="primary-button" type="submit" disabled={busy}>
            {busy ? "Проверяем…" : "Начать чат"}{" "}
            <ArrowLeft className="button-arrow" size={17} />
          </button>
        </form>
        {error && (
          <p className="inline-error" role="alert">
            {error}
          </p>
        )}
        <div className="welcome-footnote">
          <span className="secure-icon">✓</span> Чат работает через GREEN-API
        </div>
      </div>
    </div>
  );
}
