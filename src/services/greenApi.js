function getBaseUrl(settings) {
  return settings.apiUrl.trim().replace(/\/+$/, "");
}

function getEndpoint(settings, method) {
  const instanceId = encodeURIComponent(settings.idInstance.trim());
  const token = encodeURIComponent(settings.apiTokenInstance.trim());
  return `${getBaseUrl(settings)}/waInstance${instanceId}/${method}/${token}`;
}

async function request(settings, method, options = {}) {
  const response = await fetch(getEndpoint(settings, method), options);
  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      result.message ||
        result.error ||
        result.reason ||
        `GREEN-API ответил с кодом ${response.status}`,
    );
  }

  return result;
}

export function getInstanceState(settings) {
  return request(settings, "getStateInstance");
}

export function checkTelegramAccount(settings, phoneNumber) {
  return request(settings, "checkAccount", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phoneNumber: Number(phoneNumber) }),
  });
}

export function sendTextMessage(settings, chatId, message) {
  return request(settings, "sendMessage", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chatId, message }),
  });
}

export function receiveNotification(settings) {
  return fetch(
    `${getEndpoint(settings, "receiveNotification")}?receiveTimeout=5`,
  ).then(async (response) => {
    if (!response.ok) {
      throw new Error(
        (await response.text()) ||
          `Ошибка получения сообщений (${response.status})`,
      );
    }
    return response.json();
  });
}

export function deleteNotification(settings, receiptId) {
  return request(
    settings,
    `deleteNotification/${encodeURIComponent(receiptId)}`,
    { method: "DELETE" },
  );
}
