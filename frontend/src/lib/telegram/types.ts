export type TelegramWebApp = {
  ready: () => void;
  expand: () => void;
  close: () => void;
  enableClosingConfirmation?: () => void;
  disableClosingConfirmation?: () => void;
  isExpanded?: boolean;
  platform?: string;
  colorScheme?: "light" | "dark";
  themeParams?: Record<string, string>;
  viewportHeight?: number;
  viewportStableHeight?: number;
  isClosingConfirmationEnabled?: boolean;
  initData?: string;
  initDataUnsafe?: Record<string, unknown> & { query_id?: string; user?: unknown; auth_date?: number; hash?: string };
  safeAreaInset?: { top: number; right: number; bottom: number; left: number };
  contentSafeAreaInset?: { top: number; right: number; bottom: number; left: number };
  isVersionAtLeast?: (v: string) => boolean;
  requestFullscreen?: () => void;
  exitFullscreen?: () => void;
  HapticFeedback?: {
    impactOccurred: (style: "light" | "medium" | "heavy" | "rigid" | "soft") => void;
    notificationOccurred: (type: "error" | "success" | "warning") => void;
    selectionChanged: () => void;
  };
  BackButton?: {
    show: () => void;
    hide: () => void;
    onClick: (cb: () => void) => void;
    offClick: (cb: () => void) => void;
    isVisible?: boolean;
  };
  MainButton?: {
    setText: (text: string) => void;
    show: () => void;
    hide: () => void;
    enable: () => void;
    disable: () => void;
    onClick: (cb: () => void) => void;
    offClick: (cb: () => void) => void;
    showProgress?: (leaveActive?: boolean) => void;
    hideProgress?: () => void;
  };
  CloudStorage?: {
    setItem: (key: string, value: string, cb?: (err: string | null, ok: boolean) => void) => void;
    getItem: (key: string, cb: (err: string | null, value: string | null) => void) => void;
    removeItem: (key: string, cb?: (err: string | null, ok: boolean) => void) => void;
    getKeys: (cb: (err: string | null, keys: string[]) => void) => void;
  };
  onEvent: (event: string, cb: (...args: any[]) => void) => void;
  offEvent: (event: string, cb: (...args: any[]) => void) => void;
};

declare global {
  interface Window {
    Telegram?: { WebApp?: TelegramWebApp };
  }
}

