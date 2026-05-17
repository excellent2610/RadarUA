import { Radar } from "lucide-react";
import { useTranslation } from "../../i18n";

export function EmptyState() {
  const { t } = useTranslation();
  return (
    <div className="pointer-events-none fixed inset-0 z-[460] flex items-center justify-center p-6">
      <div className="rounded border border-radar-green/20 bg-radar-panel p-5 text-center shadow-glow backdrop-blur-xl">
        <Radar className="mx-auto mb-2 text-radar-green" size={28} />
        <p className="font-display text-sm uppercase tracking-[0.18em] text-slate-200">{t("empty.title")}</p>
        <p className="mt-1 text-xs text-slate-400">{t("empty.body")}</p>
      </div>
    </div>
  );
}
