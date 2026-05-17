export type { TelegramWebApp } from "../lib/telegram/types";

import type { TelegramWebApp } from "../lib/telegram/types";

declare global {
  interface Window {
    Telegram?: { WebApp?: TelegramWebApp };
  }
}

