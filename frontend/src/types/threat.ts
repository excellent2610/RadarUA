export type ThreatType =
  | "shahed"
  | "drone"
  | "jet_drone"
  | "cruise_missile"
  | "ballistic_missile"
  | "bomb"
  | "kab"
  | "unknown";

export type ThreatStatus = "active" | "eliminated" | "lost" | "expired" | "stale";

export type ThreatCoordinate = { lat: number; lng: number; ts?: number };

export type ThreatObject = {
  id: string;
  type: ThreatType;
  status: ThreatStatus;
  lat: number;
  lng: number;
  heading?: number;
  speedKmh?: number;
  updatedAt: string; // ISO string
  trail?: ThreatCoordinate[];
  coordinates?: ThreatCoordinate;
  meta?: Record<string, unknown>;
};

export type ThreatTarget = ThreatObject;

export const MAX_TRAIL_POINTS = 22;

export type CurrentResponse = {
  updated_at: string;
  objects: ThreatObject[];
};

export type ThreatStats = {
  targets_total: number;
  cache_refresh_seconds: number;
};

export type Filters = {
  drones: boolean;
  missiles: boolean;
  ballistic: boolean;
  bombs: boolean;
  activeOnly: boolean;
  eliminated: boolean;
  lost: boolean;
};

export const THREAT_STYLE: Record<
  ThreatType,
  {
    label: string;
    color: string;
    glow: string;
    size: number;
    pulse: "soft" | "medium" | "hard";
  }
> = {
  shahed: { label: "Шахеди", color: "#20f7b1", glow: "rgba(32,247,177,0.65)", size: 46, pulse: "soft" },
  drone: { label: "БПЛА", color: "#20f7b1", glow: "rgba(32,247,177,0.55)", size: 44, pulse: "soft" },
  jet_drone: { label: "Реактивні БПЛА", color: "#b79cff", glow: "rgba(183,156,255,0.65)", size: 50, pulse: "medium" },
  cruise_missile: { label: "Крилаті ракети", color: "#59c7ff", glow: "rgba(89,199,255,0.65)", size: 54, pulse: "medium" },
  ballistic_missile: { label: "Балістика", color: "#ff4a6e", glow: "rgba(255,74,110,0.65)", size: 62, pulse: "hard" },
  bomb: { label: "КАБ", color: "#ffd166", glow: "rgba(255,209,102,0.65)", size: 46, pulse: "soft" },
  kab: { label: "КАБ", color: "#ffd166", glow: "rgba(255,209,102,0.65)", size: 46, pulse: "soft" },
  unknown: { label: "Невідомо", color: "#8aa0aa", glow: "rgba(138,160,170,0.55)", size: 42, pulse: "soft" },
};
