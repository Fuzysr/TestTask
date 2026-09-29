# Telegram Chat на React и GREEN-API

Полноэкранный интерфейс текстового чата через GREEN-API Telegram. Компоновка чата и список диалогов сделаны по мотивам [веб-чата MAX](https://web.max.ru/), как указано в исходном тестовом задании.

Приложение проверяет состояние инстанса, ищет получателя по международному номеру через `CheckAccount`, отправляет сообщения методом `SendMessage` и получает их через HTTP API (`ReceiveNotification` с подтверждением `DeleteNotification`).

## Локальный запуск

Требуется Node.js 18 или новее.

```bash
npm install
npm run dev
```

Откройте адрес Vite из терминала (обычно `http://localhost:5173`). Для production-сборки выполните `npm run build`; результат появится в `dist/`.

## Структура проекта

```text
src/
├── App.jsx                 # состояние приложения и сборка экранов
├── main.jsx                # точка входа React
├── components/             # Sidebar, Conversation, формы и элементы чата
├── constants/              # ключи и начальные настройки
├── hooks/                  # состояние сессии, статус инстанса и входящий polling
├── services/greenApi.js    # HTTP-вызовы GREEN-API
├── styles/                 # базовые стили, чат, панель, модальное окно и адаптивность
└── utils/                  # форматирование и разбор сообщений
```

## Подключение Telegram

1. В личном кабинете GREEN-API создайте или выберите именно Telegram-инстанс. MAX-инстанс и его учётные данные для Telegram не подходят.
2. Авторизуйте Telegram-инстанс способом, предложенным личным кабинетом GREEN-API, и убедитесь, что его состояние — `authorized`.
3. При первом открытии приложения введите `apiUrl`, `idInstance` и `apiTokenInstance` из настроек Telegram-инстанса.
4. Укажите международный номер телефона получателя. GREEN-API проверит наличие Telegram-аккаунта и вернёт `chatId`; если номер скрыт настройками приватности или аккаунт не найден, начните чат по номеру не получится.
5. Отправляйте и получайте текстовые сообщения в созданном чате.

Параметры подключения и история текущей вкладки хранятся в `sessionStorage` и удаляются после закрытия вкладки. Входящие события берутся из очереди инстанса и подтверждаются после обработки. Очередь общая для Telegram-инстанса: не запускайте одновременно несколько клиентов, которые её опрашивают.

## Ссылки

- [GREEN-API для Telegram](https://green-api.com/telegram/)
- [SendMessage для Telegram](https://green-api.com/telegram/docs/api/sending/SendMessage/)
- [HTTP API приёма уведомлений Telegram](https://green-api.com/telegram/docs/api/receiving/technology-http-api/)
- [CheckAccount для поиска по номеру](https://green-api.com/telegram/docs/api/service/CheckAccount/)
- [Прототип интерфейса из задания — MAX Web](https://web.max.ru/)
