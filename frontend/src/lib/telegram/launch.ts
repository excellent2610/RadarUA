export type LaunchParams = {
  startParam?: string;
  version?: string;
  platform?: string;
  initData?: string;
};

export function getLaunchParams(): LaunchParams {
  const webApp = window.Telegram?.WebApp;
  const startParam = new URLSearchParams(window.location.search).get("startapp") ?? undefined;
  return {
    startParam,
    version: (webApp as any)?.version,
    platform: webApp?.platform,
    initData: webApp?.initData,
  };
}

