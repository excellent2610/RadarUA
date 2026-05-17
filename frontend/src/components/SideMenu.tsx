import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { Bell, Database, Map, Radio, Settings, ShieldCheck, X } from "lucide-react";
import { useTranslation } from "../i18n";
import { useRadarStore } from "../store/radarStore";
import { formatTime } from "../utils/format";

export function SideMenu({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();
  const stats = useRadarStore((state) => state.stats);
  const updatedAt = useRadarStore((state) => state.updatedAt);
  const connected = useRadarStore((state) => state.connected);

  return (
    <motion.aside
      className="fixed inset-y-0 left-0 z-[720] w-[min(88vw,360px)] border-r border-radar-green/20 bg-[#050a08]/95 p-4 pt-[max(1rem,env(safe-area-inset-top))] shadow-glow backdrop-blur-2xl"
      initial={{ x: -380, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -380, opacity: 0 }}
      transition={{ type: "spring", stiffness: 280, damping: 28 }}
    >
      <div className="mb-6 flex items-start justify-between">
        <div>
          <p className="font-display text-[10px] uppercase tracking-[0.24em] text-radar-green">RadarUA</p>
          <h2 className="font-display text-xl font-semibold text-white">{t("app.operations")}</h2>
        </div>
        <button className="hud-icon-btn" onClick={onClose} aria-label={t("actions.closeMenu")}>
          <X size={17} />
        </button>
      </div>

      <nav className="grid gap-2">
        <MenuItem icon={<Map size={17} />} label={t("actions.liveMap")} active />
        <MenuItem icon={<Radio size={17} />} label={connected ? t("menu.websocketLive") : t("menu.reconnectPending")} />
        <MenuItem icon={<Database size={17} />} label={`${t("menu.activeObjects")}: ${stats?.active_count ?? 0}`} />
        <MenuItem icon={<Bell size={17} />} label={t("menu.alertsReady")} />
        <MenuItem icon={<Settings size={17} />} label={t("menu.productionMode")} />
      </nav>

      <div className="mt-6 rounded border border-radar-green/20 bg-black/30 p-3 text-sm text-slate-300">
        <div className="mb-2 flex items-center gap-2 text-radar-green">
          <ShieldCheck size={16} />
          <span className="font-display text-[10px] uppercase tracking-[0.18em]">{t("app.safetyMode")}</span>
        </div>
        <p>{t("app.safetyText")}</p>
        <p className="mt-2 text-xs text-slate-500">{t("menu.lastUpdate")}: {formatTime(updatedAt)}</p>
      </div>
    </motion.aside>
  );
}

function MenuItem({ icon, label, active }: { icon: ReactNode; label: string; active?: boolean }) {
  return (
    <button
      type="button"
      className={`flex items-center gap-3 rounded border px-3 py-3 text-left text-sm transition ${
        active ? "border-radar-green/45 bg-radar-green/12 text-radar-green" : "border-white/10 bg-white/5 text-slate-300"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
