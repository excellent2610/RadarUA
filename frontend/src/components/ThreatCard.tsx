import type { ReactNode } from "react";
import { Compass, Gauge, Radio } from "lucide-react";
import type { ThreatObject } from "../types/threat";
import { useTranslation } from "../i18n";
import { formatCoordinate, formatTime, humanStatus, humanType } from "../utils/format";

interface ThreatCardProps {
  object: ThreatObject;
}

export function ThreatCard({ object }: ThreatCardProps) {
  const { t } = useTranslation();
  const rows = [
    [t("object.type"), humanType(object.type)],
    [t("object.speed"), object.speed_kmh ? `${Math.round(object.speed_kmh)} ${t("object.kmh")}` : t("object.unknown")],
    [t("object.heading"), object.heading_deg ? `${Math.round(object.heading_deg)} ${t("object.degrees")}` : t("object.unknown")],
    [t("object.launchZone"), object.launch_zone || t("object.publicFeed")],
    [t("object.destination"), object.destination_city || object.estimated_destination || t("object.estimated")],
    [t("object.coordinates"), `${formatCoordinate(object.coordinates?.lat)}, ${formatCoordinate(object.coordinates?.lng)}`],
    [t("object.predicted"), `${formatCoordinate(object.predicted_coordinates?.lat)}, ${formatCoordinate(object.predicted_coordinates?.lng)}`],
    [t("object.lastUpdate"), formatTime(object.last_update)],
  ];

  return (
    <div className="pr-10">
      <div className="mb-4">
        <div className="mb-2 flex items-center gap-2 text-radar-green">
          <Radio size={17} />
          <span className="font-display text-[10px] uppercase tracking-[0.22em]">{t("object.details")}</span>
        </div>
        <h2 className="font-display text-xl font-semibold text-white">{object.title}</h2>
        <p className="text-sm uppercase tracking-[0.18em] text-slate-400">{humanStatus(object.status)}</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Metric icon={<Gauge size={16} />} label={t("object.speed")} value={object.speed_kmh ? `${Math.round(object.speed_kmh)}` : t("object.notAvailable")} />
        <Metric icon={<Compass size={16} />} label={t("object.heading")} value={object.heading_deg ? `${Math.round(object.heading_deg)}` : t("object.notAvailable")} />
      </div>
      <dl className="mt-4 grid gap-2 text-sm">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between gap-4 border-b border-white/10 pb-2">
            <dt className="text-slate-400">{label}</dt>
            <dd className="max-w-[60%] text-right font-medium capitalize text-slate-100">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function Metric({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded border border-radar-green/20 bg-black/30 p-3">
      <div className="mb-1 flex items-center gap-2 text-radar-green">
        {icon}
        <span className="text-xs uppercase tracking-[0.16em]">{label}</span>
      </div>
      <p className="font-display text-2xl font-semibold">{value}</p>
    </div>
  );
}
