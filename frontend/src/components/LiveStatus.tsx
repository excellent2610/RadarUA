import { Wifi, WifiOff } from "lucide-react";
import { motion } from "framer-motion";
import { useRadarStore } from "../store/radarStore";
import { useTranslation } from "../i18n";

export function LiveStatus() {
  const { t } = useTranslation();
  const connected = useRadarStore((state) => state.connected);

  return (
    <div className="hidden rounded border border-radar-green/20 bg-radar-panel px-3 py-2 shadow-glow backdrop-blur-xl sm:block">
      <div className="flex items-center gap-2 text-xs">
        {connected ? <Wifi size={16} className="text-radar-green" /> : <WifiOff size={16} className="text-radar-amber" />}
        <span className="font-display uppercase tracking-[0.18em]">{connected ? t("status.live") : t("status.reconnecting")}</span>
        <motion.span
          className={`h-2 w-2 rounded-full ${connected ? "bg-radar-green" : "bg-radar-amber"}`}
          animate={{ opacity: [0.35, 1, 0.35] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />
      </div>
    </div>
  );
}
