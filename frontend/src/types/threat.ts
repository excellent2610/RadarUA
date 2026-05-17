export const LIVE_UPDATE_MS = 6000;

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

  // Map rendering expects numeric coords for Leaflet.
  lat: number;
  lng: number;

  // Optional “public feed” fields used by UI cards.
  title?: string;
  callsign?: string;
  launch_zone?: string;
  destination_city?: string;
  estimated_destination?: string;

  // Mixed naming variants (normalize layer may output camelCase; UI uses snake_case in places).
  speed_kmh?: number;
  speedKmh?: number;
  heading_deg?: number;
  heading?: number;

  // Timestamps
  updatedAt: string; // ISO
  last_update?: string; // ISO

  // Positions / trails (UI + map)
  coordinates?: ThreatCoordinate;
  predicted_coordinates?: ThreatCoordinate;
  trail?: ThreatCoordinate[];

  meta?: Record<string, unknown>;
};

export type ThreatTarget = ThreatObject;

export const MAX_TRAIL_POINTS = 22;

export type CurrentResponse = {
  updated_at: string;
  objects: ThreatObject[];
  safety: { disclaimer: string };
};

export type ThreatStats = {
  targets_total: number;
  cache_refresh_seconds: number;
  active_count?: number;
  drones_count?: number;
  missiles_count?: number;
  attack_status?: string;
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
    shortLabel: string;
    color: string;
    glow: string;
    size: number;
    marker: "diamond" | "triangle" | "bolt" | "chevron" | "hex";
    pulse: "soft" | "medium" | "hard";
  }
> = {
  shahed: {
    label: "Шахеди",
    shortLabel: "SHAHED",
    color: "#20f7b1",
    glow: "rgba(32,247,177,0.65)",
    size: 46,
    marker: "diamond",
    pulse: "soft",
  },
  drone: {
    label: "БПЛА",
    shortLabel: "UAV",
    color: "#20f7b1",
    glow: "rgba(32,247,177,0.55)",
    size: 44,
    marker: "diamond",
    pulse: "soft",
  },
  jet_drone: {
    label: "Реактивні БПЛА",
    shortLabel: "JET",
    color: "#b79cff",
    glow: "rgba(183,156,255,0.65)",
    size: 50,
    marker: "chevron",
    pulse: "medium",
  },
  cruise_missile: {
    label: "Крилаті ракети",
    shortLabel: "CM",
    color: "#59c7ff",
    glow: "rgba(89,199,255,0.65)",
    size: 54,
    marker: "triangle",
    pulse: "medium",
  },
  ballistic_missile: {
    label: "Балістика",
    shortLabel: "BM",
    color: "#ff4a6e",
    glow: "rgba(255,74,110,0.65)",
    size: 62,
    marker: "hex",
    pulse: "hard",
  },
  bomb: {
    label: "КАБ",
    shortLabel: "KAB",
    color: "#ffd166",
    glow: "rgba(255,209,102,0.65)",
    size: 46,
    marker: "bolt",
    pulse: "soft",
  },
  kab: {
    label: "КАБ",
    shortLabel: "KAB",
    color: "#ffd166",
    glow: "rgba(255,209,102,0.65)",
    size: 46,
    marker: "bolt",
    pulse: "soft",
  },
  unknown: {
    label: "Невідомо",
    shortLabel: "UNK",
    color: "#8aa0aa",
    glow: "rgba(138,160,170,0.55)",
    size: 42,
    marker: "diamond",
    pulse: "soft",
  },
};
