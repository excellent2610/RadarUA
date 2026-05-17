import type { ReactNode } from "react";

interface ThreatStatsProps {
  icon: ReactNode;
  label: string;
  value: number | string;
  tone?: "green" | "amber" | "danger";
  compact?: boolean;
}

export function ThreatStats({ icon, label, value, tone = "green", compact }: ThreatStatsProps) {
  const toneClass = tone === "danger" ? "text-radar-red" : tone === "amber" ? "text-radar-amber" : "text-radar-green";

  return (
    <div className="rounded border border-white/10 bg-black/30 px-3 py-2 backdrop-blur">
      <div className={`mb-1 flex items-center gap-1.5 ${toneClass}`}>
        {icon}
        <span className="text-[10px] uppercase tracking-[0.18em]">{label}</span>
      </div>
      <div className={`font-display font-semibold uppercase ${compact ? "text-base" : "text-xl"}`}>{value}</div>
    </div>
  );
}

