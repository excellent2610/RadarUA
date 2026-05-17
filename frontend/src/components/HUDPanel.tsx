import { Activity, Crosshair, RadioTower, TriangleAlert } from "lucide-react";
import { useRadarStore } from "../store/radarStore";
import { formatTime } from "../utils/format";
import { ThreatStats } from "./ThreatStats";
import { useTranslation } from "../i18n";

export function HUDPanel() {
  const { t } = useTranslation();
  const stats = useRadarStore((state) => state.stats);
  const updatedAt = useRadarStore((state) => state.updatedAt);

  return (
    <div className="hud-panel flex-1">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="font-display text-[10px] uppercase tracking-[0.22em] text-radar-green/80">{t("app.section")}</p>
          <h1 className="font-display text-lg font-semibold leading-tight text-white md:text-2xl">{t("app.title")}</h1>
        </div>
        <div className="hidden items-center gap-2 rounded border border-radar-green/20 px-2 py-1 text-[11px] text-slate-300 sm:flex">
          <Activity size={14} className="text-radar-green" />
          {t("dashboard.updated")} {formatTime(updatedAt)}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        <ThreatStats icon={<TriangleAlert size={16} />} label={t("dashboard.active")} value={stats?.active_count ?? 0} tone="danger" />
        <ThreatStats icon={<RadioTower size={16} />} label={t("dashboard.drones")} value={stats?.drones_count ?? 0} />
        <ThreatStats icon={<Crosshair size={16} />} label={t("dashboard.missiles")} value={stats?.missiles_count ?? 0} tone="amber" />
        <ThreatStats icon={<Activity size={16} />} label={t("dashboard.status")} value={stats?.attack_status ?? t("dashboard.sync")} compact />
      </div>
    </div>
  );
}
