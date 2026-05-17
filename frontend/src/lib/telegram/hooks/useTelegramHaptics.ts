type Haptics = {
  impact: (style?: "light" | "medium" | "heavy" | "rigid" | "soft") => void;
  notification: (type: "error" | "success" | "warning") => void;
  selectionChanged: () => void;
};

const noop = () => {};

export function useTelegramHaptics(): Haptics {
  const h = window.Telegram?.WebApp?.HapticFeedback;
  if (!h) {
    return { impact: noop, notification: noop, selectionChanged: noop };
  }

  return {
    impact: (style = "light") => {
      try {
        h.impactOccurred(style);
      } catch {
        // ignore
      }
    },
    notification: (type) => {
      try {
        h.notificationOccurred(type);
      } catch {
        // ignore
      }
    },
    selectionChanged: () => {
      try {
        h.selectionChanged();
      } catch {
        // ignore
      }
    },
  };
}

