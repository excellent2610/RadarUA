import { useEffect } from "react";
import { translate } from "../i18n";
import "../types/telegram";

export function useTelegram() {
  useEffect(() => {
    const app = window.Telegram?.WebApp;
    if (!app) return;

    app.ready();
    app.expand();
    app.enableClosingConfirmation?.();
    document.documentElement.dataset.telegramTheme = app.colorScheme || "dark";

    const bg = app.themeParams?.bg_color;
    if (bg) document.documentElement.style.setProperty("--tg-bg", bg);
  }, []);
}

export function triggerHaptic(style: "light" | "medium" | "heavy" = "light") {
window.Telegram?.WebApp?.HapticFeedback?.impactOccurred(style);
}

export function telegramShareText() {
  return translate("telegram.shareText");
}

export function telegramAlertText() {
  return translate("telegram.popupUnavailable");
}
