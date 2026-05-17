import type { TelegramWebApp } from "./types";
import { applyTelegramTheme } from "./theme";
import { applyTelegramSafeArea, applyTelegramViewport } from "./viewport";

const TG_EVENTS = {
  themeChanged: "themeChanged",
  viewportChanged: "viewportChanged",
  safeAreaChanged: "safeAreaChanged",
  contentSafeAreaChanged: "contentSafeAreaChanged",
} as const;

function getWebApp(): TelegramWebApp | null {
  return window.Telegram?.WebApp ?? null;
}

export function initTelegramWebApp() {
  const webApp = getWebApp();
  if (!webApp) return;

  // Production-safe init sequence.
  try {
    webApp.ready();
  } catch {
    // ignore
  }

  try {
    webApp.expand();
  } catch {
    // ignore
  }

  try {
    webApp.enableClosingConfirmation?.();
  } catch {
    // ignore
  }

  // Initial sync
  applyTelegramTheme(webApp);
  applyTelegramViewport(webApp);
  applyTelegramSafeArea(webApp);

  // Subscribe for changes
  const onTheme = () => applyTelegramTheme(webApp);
  const onViewport = () => applyTelegramViewport(webApp);
  const onSafeArea = () => applyTelegramSafeArea(webApp);

  webApp.onEvent(TG_EVENTS.themeChanged, onTheme);
  webApp.onEvent(TG_EVENTS.viewportChanged, onViewport);
  webApp.onEvent(TG_EVENTS.safeAreaChanged, onSafeArea);
  webApp.onEvent(TG_EVENTS.contentSafeAreaChanged, onSafeArea);
}

export function getTelegramWebApp(): TelegramWebApp | null {
  return getWebApp();
}

