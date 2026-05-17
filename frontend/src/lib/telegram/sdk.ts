import type { TelegramWebApp } from "./types";

export function withWebApp<T>(fn: (wa: TelegramWebApp) => T, fallback: T): T {
  const wa = window.Telegram?.WebApp;
  if (!wa) return fallback;
  try {
    return fn(wa);
  } catch {
    return fallback;
  }
}

export function requestFullscreen(): boolean {
  return withWebApp(
    (wa) => {
      wa.requestFullscreen?.();
      return true;
    },
    false,
  );
}

export function exitFullscreen(): boolean {
  return withWebApp(
    (wa) => {
      wa.exitFullscreen?.();
      return true;
    },
    false,
  );
}

export async function cloudGetItem(key: string): Promise<string | null> {
  const wa = window.Telegram?.WebApp;
  if (!wa?.CloudStorage) return null;
  return new Promise((resolve, reject) => {
    wa.CloudStorage!.getItem(key, (err: string | null, value: string | null) => {
      if (err) return reject(new Error(err));
      resolve(value ?? null);
    });
  });
}

export async function cloudSetItem(key: string, value: string): Promise<boolean> {
  const wa = window.Telegram?.WebApp;
  if (!wa?.CloudStorage) return false;
  return new Promise((resolve, reject) => {
    wa.CloudStorage!.setItem(key, value, (err: string | null, ok: boolean) => {
      if (err) return reject(new Error(err));
      resolve(Boolean(ok));
    });
  });
}
