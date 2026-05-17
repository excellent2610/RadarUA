import { Bomb, Crosshair, Plane, RadioTower, ShieldAlert, ShieldX } from "lucide-react";
import { useTranslation } from "../i18n";
import { useRadarStore } from "../store/radarStore";
import type { Filters } from "../types/threat";

const items: Array<{ key: keyof Filters; labelKey: string; icon: typeof RadioTower }> = [
  { key: "drones", labelKey: "filters.drones", icon: RadioTower },
  { key: "missiles", labelKey: "filters.missiles", icon: Crosshair },
  { key: "ballistic", labelKey: "filters.ballistic", icon: Plane },
  { key: "bombs", labelKey: "filters.bombs", icon: Bomb },
  { key: "activeOnly", labelKey: "filters.activeOnly", icon: ShieldAlert },
  { key: "eliminated", labelKey: "filters.eliminated", icon: ShieldX },
  { key: "lost", labelKey: "filters.lost", icon: ShieldX },
];

export function FilterPanel() {
  const { t } = useTranslation();
  const filters = useRadarStore((state) => state.filters);
  const toggleFilter = useRadarStore((state) => state.toggleFilter);

  return (
    <div className="flex gap-2 overflow-x-auto rounded border border-radar-green/20 bg-radar-panel p-2 shadow-glow backdrop-blur-xl">
      {items.map(({ key, labelKey, icon: Icon }) => (
        <button
          key={key}
          type="button"
          onClick={() => toggleFilter(key)}
          className={`flex min-w-fit items-center gap-2 rounded border px-3 py-2 text-xs transition ${
            filters[key]
              ? "border-radar-green/50 bg-radar-green/12 text-radar-green"
              : "border-white/10 bg-black/30 text-slate-400"
          }`}
          aria-pressed={filters[key]}
        >
          <Icon size={15} />
          {t(labelKey)}
        </button>
      ))}
    </div>
  );
}
