import { useCallback, useState } from "react";

export function useSessionStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = sessionStorage.getItem(key);
      return saved === null ? initialValue : JSON.parse(saved);
    } catch {
      return initialValue;
    }
  });

  const updateValue = useCallback(
    (nextValue) => {
      setValue((currentValue) => {
        const resolvedValue =
          typeof nextValue === "function" ? nextValue(currentValue) : nextValue;
        try {
          sessionStorage.setItem(key, JSON.stringify(resolvedValue));
        } catch {
          // The UI can still work when browser storage is unavailable.
        }
        return resolvedValue;
      });
    },
    [key],
  );

  return [value, updateValue];
}
