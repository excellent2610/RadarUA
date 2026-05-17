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
  return withWebApp(
    (wa) =>
      new Promise((resolve, reject) => {
        if (!wa.CloudStorage) return resolve(null);
        wa.CloudStorage.getItem(key, (err, value) => {
          if (err) return reject(new Error(err));
          resolve(value ?? null);
        });
      }),
    Promise.resolve(null),
  );
}

export async function cloudSetItem(key: string, value: string): Promise<boolean> {
  return withWebApp(
    (wa) =>
      new Promise((resolve, reject) => {
        if (!wa.CloudStorage) return resolve(false);
        wa.CloudStorage.setItem(key, value, (err, ok) => {
          if (err) return reject(new Error(err));
          resolve(Boolean(ok));
        });
      }),
    Promise.resolve(false),
  );
}

