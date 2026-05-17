import { useEffect, useMemo } from "react";

type Options = {
  text: string;
  enabled?: boolean;
  visible?: boolean;
  onClick: () => void;
};

export function useTelegramMainButton(options: Options) {
  const { text, enabled = true, visible = true, onClick } = options;
  const stableHandler = useMemo(() => onClick, [onClick]);

  useEffect(() => {
    const webApp = window.Telegram?.WebApp;
    const btn = webApp?.MainButton;
    if (!webApp || !btn) return;

    try {
      btn.setText(text);
      if (visible) btn.show();
      else btn.hide();
      if (enabled) btn.enable();
      else btn.disable();
      btn.onClick(stableHandler);
    } catch {
      // ignore
    }

    return () => {
      try {
        btn.offClick(stableHandler);
        btn.hide();
      } catch {
        // ignore
      }
    };
  }, [text, enabled, visible, stableHandler]);
}

