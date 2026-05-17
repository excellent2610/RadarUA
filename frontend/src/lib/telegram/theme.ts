import type { TelegramWebApp } from "./types";

function setCssVar(name: string, value: string | undefined) {
  if (!value) return;
  document.documentElement.style.setProperty(name, value);
}

export function applyTelegramTheme(webApp: TelegramWebApp) {
  const scheme = webApp.colorScheme ?? "dark";
  document.documentElement.dataset.tgScheme = scheme;

  const params = webApp.themeParams ?? {};
  // Telegram theme params keys use names like "bg_color", "text_color", etc.
  setCssVar("--tg-bg-color", params.bg_color);
  setCssVar("--tg-text-color", params.text_color);
  setCssVar("--tg-hint-color", params.hint_color);
  setCssVar("--tg-link-color", params.link_color);
  setCssVar("--tg-button-color", params.button_color);
  setCssVar("--tg-button-text-color", params.button_text_color);
  setCssVar("--tg-secondary-bg-color", params.secondary_bg_color);
}

