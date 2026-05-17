import { useTranslation } from "../../i18n";

export function LoadingSkeleton() {
  const { t } = useTranslation();
  return (
    <div className="pointer-events-none fixed inset-0 z-[650] flex items-center justify-center bg-radar-black/55 backdrop-blur-sm">
      <div className="hud-panel w-[min(92vw,420px)]">
        <div className="mb-4 font-display text-xs uppercase tracking-[0.18em] text-radar-green">{t("loading.radar")}</div>
        <div className="space-y-3">
          <div className="h-8 animate-pulse rounded bg-white/10" />
          <div className="h-8 animate-pulse rounded bg-white/10" />
          <div className="h-8 animate-pulse rounded bg-white/10" />
        </div>
      </div>
    </div>
  );
}
