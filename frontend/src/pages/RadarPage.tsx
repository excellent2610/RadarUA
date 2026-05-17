import { AnimatePresence } from "framer-motion";
import { AlertTriangle, Menu, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { BottomSheet } from "../components/BottomSheet";
import { FilterPanel } from "../components/FilterPanel";
import { HUDPanel } from "../components/HUDPanel";
import { LiveStatus } from "../components/LiveStatus";
import { RadarMap } from "../components/map/RadarMap";
import { ThreatCard } from "../components/ThreatCard";
import { LoadingSkeleton } from "../components/system/LoadingSkeleton";
import { EmptyState } from "../components/system/EmptyState";
import { SideMenu } from "../components/SideMenu";
import { useLiveRadar } from "../hooks/useLiveRadar";
import { useTranslation } from "../i18n";
import { useRadarStore } from "../store/radarStore";
import type { ThreatObject } from "../types/threat";

function isVisible(object: ThreatObject, filters: ReturnType<typeof useRadarStore.getState>["filters"]) {
  if (filters.activeOnly && object.status !== "active") return false;
  if (!filters.eliminated && object.status === "eliminated") return false;
  if (!filters.lost && object.status === "lost") return false;
  if (!filters.drones && ["drone", "shahed", "jet_drone"].includes(object.type)) return false;
  if (!filters.ballistic && object.type === "ballistic_missile") return false;
  if (!filters.bombs && object.type === "bomb") return false;
  if (!filters.missiles && object.type === "cruise_missile") return false;
  return true;
}

export function RadarPage() {
  useLiveRadar();
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const { objects, filters, selected, disclaimer, loading, error, setSelected } = useRadarStore();
  const visibleObjects = useMemo(() => objects.filter((object) => isVisible(object, filters)), [filters, objects]);

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden">
<RadarMap targets={visibleObjects} selectedId={selected?.id} onSelect={setSelected} />

      <div className="pointer-events-none absolute inset-0 z-[450] bg-[radial-gradient(circle_at_center,rgba(66,255,158,0.08),transparent_38%),linear-gradient(180deg,rgba(3,5,4,0.34),transparent_34%,rgba(3,5,4,0.72))]" />
      <div className="pointer-events-none absolute inset-0 z-[451] radar-grid" />

      <section className="pointer-events-none absolute inset-x-0 top-0 z-[500] p-3 pt-[max(0.75rem,env(safe-area-inset-top))] md:p-5">
        <div className="pointer-events-auto mx-auto flex max-w-7xl items-start gap-3">
          <button className="hud-icon-btn shrink-0" aria-label={t("actions.openMenu")} onClick={() => setMenuOpen(true)}>
            <Menu size={18} />
          </button>
          <HUDPanel />
          <LiveStatus />
        </div>
      </section>

      <section className="pointer-events-none absolute inset-x-0 bottom-0 z-[500] p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:p-5">
        <div className="pointer-events-auto mx-auto flex max-w-7xl flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-2 rounded border border-radar-green/20 bg-radar-panel px-3 py-2 text-xs text-slate-300 shadow-glow backdrop-blur-xl">
            <span className="flex items-center gap-2">
              <ShieldCheck size={15} className="text-radar-green" />
              {disclaimer}
            </span>
            {error ? (
              <span className="flex items-center gap-1 text-radar-amber">
                <AlertTriangle size={14} />
                {error}
              </span>
            ) : null}
          </div>
          <FilterPanel />
        </div>
      </section>

      <AnimatePresence>
        {menuOpen ? <SideMenu onClose={() => setMenuOpen(false)} /> : null}
        {selected ? (
          <BottomSheet onClose={() => setSelected(undefined)}>
            <ThreatCard object={selected} />
          </BottomSheet>
        ) : null}
      </AnimatePresence>
      {loading ? <LoadingSkeleton /> : null}
      {!loading && visibleObjects.length === 0 ? <EmptyState /> : null}
    </div>
  );
}
