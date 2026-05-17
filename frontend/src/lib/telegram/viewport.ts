import type { TelegramWebApp } from "./types";

function setNumberVar(name: string, value: number | undefined) {
  if (typeof value !== "number" || Number.isNaN(value)) return;
  document.documentElement.style.setProperty(name, `${Math.max(0, Math.round(value))}px`);
}

export function applyTelegramViewport(webApp: TelegramWebApp) {
  setNumberVar("--tg-viewport-height", webApp.viewportHeight);
  setNumberVar("--tg-viewport-stable-height", webApp.viewportStableHeight);
}

export function applyTelegramSafeArea(webApp: TelegramWebApp) {
  const inset = webApp.safeAreaInset ?? { top: 0, right: 0, bottom: 0, left: 0 };
  const contentInset = webApp.contentSafeAreaInset ?? { top: 0, right: 0, bottom: 0, left: 0 };

  setNumberVar("--tg-safe-top", inset.top);
  setNumberVar("--tg-safe-right", inset.right);
  setNumberVar("--tg-safe-bottom", inset.bottom);
  setNumberVar("--tg-safe-left", inset.left);

  setNumberVar("--tg-content-safe-top", contentInset.top);
  setNumberVar("--tg-content-safe-right", contentInset.right);
  setNumberVar("--tg-content-safe-bottom", contentInset.bottom);
  setNumberVar("--tg-content-safe-left", contentInset.left);
}

