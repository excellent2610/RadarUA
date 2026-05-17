import { Activity, Clock, Radar } from "lucide-react";
import { RadarMap } from "./components/map/RadarMap";
import { useLiveRadar } from "./hooks/useLiveRadar";
import { THREAT_STYLE } from "./types/threat";
import { useTranslation } from "react-i18next";
import { useTelegramBackButton } from "./lib/telegram/hooks/useTelegramBackButton";
import { useTelegramHaptics } from "./lib/telegram/hooks/useTelegramHaptics";
import { useEffect, useMemo, useState } from "react";

export function App() {
  const { t } = useTranslation();
  const { targets, connected, lastSync, reconnecting } = useLiveRadar();
  const activeTargets = targets.filter((target) => target.status !== "expired");
  const haptics = useTelegramHaptics();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const clockMs = useMemo(() => (lastSync ? new Date(lastSync).getTime() : now), [lastSync, now]);
  const clockLabel = useMemo(() => new Date(clockMs).toLocaleTimeString("uk-UA"), [clockMs]);
  const hideConnectionStatus = useMemo(() => {
    const host = window.location.hostname;
    const isGithubPages = host.endsWith("github.io");
    const isSmallScreen = window.matchMedia?.("(max-width: 520px)")?.matches ?? false;
    return isGithubPages && isSmallScreen;
  }, []);

  useTelegramBackButton({
    enabled: true,
    onClick: () => {
      haptics.selectionChanged();
      // Telegram WebApp стандартно закривається BackButton’ом; якщо не в Telegram — просто ігноруємо.
      window.Telegram?.WebApp?.close?.();
    },
  });

  return (
    <main className="radar-shell">
      <section className="radar-topbar">
        <div className="brand-block">
          <Radar size={22} />
          <div>
            <h1>RadarUA</h1>
            <span>{t("app.subtitle")}</span>
          </div>
        </div>
        <div className="status-strip" aria-label={t("status.aria")}>
          {!hideConnectionStatus && (
            <div className={`status-pill ${connected ? "online" : "offline"}`}>
              <Activity size={16} />
              {connected
                ? t("status.live")
                : reconnecting
                  ? t("status.reconnect")
                  : t("status.offline")}
            </div>
          )}
          <div className="status-pill">
            <Clock size={16} />
            {clockLabel}
          </div>
          <div className="status-pill">{t("status.targets", { count: activeTargets.length })}</div>
        </div>
      </section>

      <section className="radar-stage">
        <RadarMap targets={activeTargets} />
        <aside className="legend-panel">
          {Object.entries(THREAT_STYLE).map(([type, style]) => (
            <div className="legend-row" key={type}>
              <span className="legend-swatch" style={{ background: style.color, boxShadow: `0 0 18px ${style.glow}` }} />
              <span>{t(`threat.${type}`, { defaultValue: String(style.label) })}</span>
            </div>
          ))}
        </aside>
      </section>
    </main>
  );
}
