import { useEffect } from "react";
import { deleteNotification, receiveNotification } from "../services/greenApi";
import { getMessageText } from "../utils/messages";

export function useIncomingMessages({
  settings,
  chatId,
  phoneNumber,
  onMessage,
  onError,
}) {
  useEffect(() => {
    if (
      !settings.idInstance ||
      !settings.apiTokenInstance ||
      !chatId ||
      !phoneNumber
    )
      return undefined;

    let stopped = false;
    let timer;

    const poll = async () => {
      try {
        const notification = await receiveNotification(settings);
        if (notification && !stopped) {
          const body = notification.body;
          const incomingChatId = String(body?.senderData?.chatId || "");
          const incomingPhone = String(
            body?.senderData?.senderPhoneNumber || "",
          ).replace(/\D/g, "");
          const text = getMessageText(body);

          if (
            body?.typeWebhook === "incomingMessageReceived" &&
            text &&
            (incomingChatId === String(chatId) || incomingPhone === phoneNumber)
          ) {
            onMessage({
              id: body.idMessage || crypto.randomUUID(),
              text,
              direction: "incoming",
              timestamp: body.timestamp || Date.now() / 1000,
              phoneNumber,
            });
          }

          if (notification.receiptId != null)
            await deleteNotification(settings, notification.receiptId);
        }
        if (!stopped) timer = window.setTimeout(poll, 250);
      } catch (error) {
        if (!stopped) {
          onError(error);
          timer = window.setTimeout(poll, 2500);
        }
      }
    };

    poll();
    return () => {
      stopped = true;
      window.clearTimeout(timer);
    };
  }, [settings, chatId, phoneNumber, onMessage, onError]);
}
