import { useEffect, useMemo } from "react";

type Options = {
  enabled: boolean;
  onClick: () => void;
};

export function useTelegramBackButton(options: Options) {
  const { enabled, onClick } = options;
  const stableHandler = useMemo(() => onClick, [onClick]);

  useEffect(() => {
    const webApp = window.Telegram?.WebApp;
    const back = webApp?.BackButton;
    if (!webApp || !back) return;

    if (enabled) {
      back.show();
      back.onClick(stableHandler);
      return () => {
        back.offClick(stableHandler);
        back.hide();
      };
    }

    back.hide();
    return;
  }, [enabled, stableHandler]);
}

