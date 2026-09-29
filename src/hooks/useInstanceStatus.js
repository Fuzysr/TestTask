import { useEffect, useState } from "react";
import { getInstanceState } from "../services/greenApi";

const INITIAL_STATUS = { status: "disconnected", message: "" };

export function useInstanceStatus(settings) {
  const [instance, setInstance] = useState(INITIAL_STATUS);

  useEffect(() => {
    if (!settings.idInstance || !settings.apiTokenInstance) {
      setInstance(INITIAL_STATUS);
      return undefined;
    }

    let cancelled = false;
    let isChecking = false;
    let firstCheck = true;

    const check = async () => {
      if (isChecking) return;
      isChecking = true;
      if (firstCheck) {
        setInstance({
          status: "connecting",
          message: "Проверяем учётные данные GREEN-API…",
        });
        firstCheck = false;
      }

      try {
        const result = await getInstanceState(settings);
        if (!result.stateInstance)
          throw new Error(
            "GREEN-API не вернул состояние инстанса. Проверьте URL, ID и токен.",
          );
        if (cancelled) return;

        const states = {
          authorized: {
            status: "connected",
            message: "Инстанс Telegram авторизован и готов к работе.",
          },
          notAuthorized: {
            status: "notAuthorized",
            message:
              "Данные GREEN-API верны, но инстанс Telegram не авторизован.",
          },
          starting: {
            status: "connecting",
            message:
              "Инстанс запускается. GREEN-API может готовить его несколько минут.",
          },
        };
        setInstance(
          states[result.stateInstance] || {
            status: "error",
            message: `Состояние инстанса: ${result.stateInstance}. Проверьте его в личном кабинете GREEN-API.`,
          },
        );
      } catch (error) {
        if (!cancelled)
          setInstance({
            status: "error",
            message: error.message || "Не удалось связаться с GREEN-API.",
          });
      } finally {
        isChecking = false;
      }
    };

    check();
    const timer = window.setInterval(check, 30000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [settings]);

  return instance;
}
