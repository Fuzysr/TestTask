export function getMessageText(body) {
  return (
    body?.messageData?.textMessageData?.textMessage ||
    body?.messageData?.extendedTextMessageData?.text ||
    ""
  );
}

export function normalizePhoneNumber(phone) {
  return phone.replace(/\D/g, "");
}

export function formatMessageTime(timestamp) {
  const date = new Date(timestamp > 1e12 ? timestamp : timestamp * 1000);
  return new Intl.DateTimeFormat("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
