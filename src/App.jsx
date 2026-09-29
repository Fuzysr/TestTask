import { useCallback, useEffect, useRef, useState } from "react";
import { checkTelegramAccount, sendTextMessage } from "./services/greenApi";
import {
  API_STORAGE_KEY,
  CHAT_STORAGE_KEY,
  DEFAULT_API_SETTINGS,
} from "./constants/storage";
import { useInstanceStatus } from "./hooks/useInstanceStatus";
import { useIncomingMessages } from "./hooks/useIncomingMessages";
import { useSessionStorage } from "./hooks/useSessionStorage";
import { normalizePhoneNumber } from "./utils/messages";
import ConnectionModal from "./components/ConnectionModal";
import Sidebar from "./components/Sidebar";
import WelcomeScreen from "./components/WelcomeScreen";
import Conversation from "./components/Conversation";

export default function App() {
  const [settings, setSettings] = useSessionStorage(
    API_STORAGE_KEY,
    DEFAULT_API_SETTINGS,
  );
  const [messages, setMessages] = useSessionStorage(CHAT_STORAGE_KEY, []);
  const [showSettings, setShowSettings] = useState(
    () => !settings.idInstance || !settings.apiTokenInstance,
  );
  const [phoneDraft, setPhoneDraft] = useState("");
  const [activePhone, setActivePhone] = useState("");
  const [activeChatId, setActiveChatId] = useState("");
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [mobileChat, setMobileChat] = useState(false);
  const endRef = useRef(null);
  const instance = useInstanceStatus(settings);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  const handleIncomingMessage = useCallback(
    (message) => {
      setMessages((current) =>
        current.some((item) => item.id === message.id)
          ? current
          : [...current, message],
      );
      setError("");
    },
    [setMessages],
  );

  const handleReceiveError = useCallback((receiveError) => {
    setError(receiveError.message || "Не удалось связаться с GREEN-API.");
  }, []);

  useIncomingMessages({
    settings,
    chatId: activeChatId,
    phoneNumber: activePhone,
    onMessage: handleIncomingMessage,
    onError: handleReceiveError,
  });

  const saveSettings = (nextSettings) => {
    setSettings(nextSettings);
    setShowSettings(false);
    setError("");
  };

  const startChat = async (event) => {
    event.preventDefault();
    const phoneNumber = normalizePhoneNumber(phoneDraft);
    if (phoneNumber.length < 7 || phoneNumber.length > 15) {
      setError("Введите номер телефона в международном формате.");
      return;
    }
    if (!settings.idInstance || !settings.apiTokenInstance) {
      setShowSettings(true);
      return;
    }

    setBusy(true);
    setError("");
    try {
      const result = await checkTelegramAccount(settings, phoneNumber);
      if (result.status === false) {
        throw new Error(
          result.reason ||
            result.data?.reason ||
            "GREEN-API не смог проверить номер. Повторите попытку позже.",
        );
      }
      if (result.exist !== true || !result.chatId) {
        throw new Error(
          "Telegram по этому номеру не найден или номер скрыт настройками приватности. Проверьте номер и доступность профиля.",
        );
      }

      setPhoneDraft(phoneNumber);
      setActivePhone(phoneNumber);
      setActiveChatId(String(result.chatId));
      setMobileChat(true);
    } catch (requestError) {
      setError(requestError.message || "Не удалось создать Telegram-чат.");
    } finally {
      setBusy(false);
    }
  };

  const sendMessage = async (event) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text || busy || !activeChatId) return;
    if (text.length > 4096) {
      setError("Сообщение не должно превышать 4096 символов.");
      return;
    }

    setBusy(true);
    setError("");
    try {
      const result = await sendTextMessage(settings, activeChatId, text);
      const message = {
        id: result.idMessage || crypto.randomUUID(),
        text,
        direction: "outgoing",
        timestamp: Date.now() / 1000,
        phoneNumber: activePhone,
      };
      setMessages((current) => [...current, message]);
      setDraft("");
    } catch (requestError) {
      setError(
        requestError.message ||
          "Не удалось отправить сообщение. Проверьте подключение Telegram-инстанса.",
      );
    } finally {
      setBusy(false);
    }
  };

  const visibleMessages = messages.filter(
    (message) => !message.phoneNumber || message.phoneNumber === activePhone,
  );
  const lastMessage = visibleMessages.at(-1)?.text || "";

  return (
    <main className="app-shell">
      <div
        className={`messenger ${mobileChat || !activePhone ? "show-chat" : ""}`}
      >
        <Sidebar
          phoneNumber={activePhone}
          lastMessage={lastMessage}
          search={search}
          onSearchChange={setSearch}
          status={instance.status}
          connectionMessage={instance.message}
          onOpenSettings={() => setShowSettings(true)}
          onOpenChat={() => setMobileChat(true)}
        />
        {activePhone ? (
          <Conversation
            phoneNumber={activePhone}
            status={instance.status}
            messages={visibleMessages}
            endRef={endRef}
            draft={draft}
            onDraftChange={setDraft}
            onSend={sendMessage}
            busy={busy}
            error={error}
            onDismissError={() => setError("")}
            onBack={() => setMobileChat(false)}
          />
        ) : (
          <section className="conversation welcome-conversation">
            <WelcomeScreen
              phoneNumber={phoneDraft}
              onPhoneChange={setPhoneDraft}
              onSubmit={startChat}
              error={error}
              busy={busy}
            />
          </section>
        )}
      </div>
      {showSettings && (
        <ConnectionModal
          settings={settings}
          onClose={() => setShowSettings(false)}
          onSave={saveSettings}
        />
      )}
      <div className="build-tag">
        TELEGRAM <span>·</span> GREEN-API
      </div>
    </main>
  );
}
