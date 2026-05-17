export type ThreatType = "shahed" | "cruise_missile" | "ballistic" | "kab" | "jet_uav";

export type ThreatStatus = "active" | "stale" | "expired";

export interface ThreatTarget {
  id: string;
  type: ThreatType;
  lat: number;
  lng: number;
  heading: number;
  speedKmh: number;
  altitudeM?: number;
  status?: ThreatStatus;
  updatedAt: string;
  callsign?: string;
}

export interface ThreatStyle {
  label: string;
  shortLabel: string;
  color: string;
  glow: string;
  cone: string;
  size: number;
  dash?: string;
  marker: "diamond" | "triangle" | "bolt" | "chevron" | "hex";
}

export const THREAT_STYLE: Record<ThreatType, ThreatStyle> = {
  shahed: {
    label: "Шахеди",
    shortLabel: "SHD",
    color: "#37f5a5",
    glow: "rgba(55, 245, 165, 0.55)",
    cone: "rgba(55, 245, 165, 0.16)",
    size: 30,
    marker: "diamond"
  },
  cruise_missile: {
    label: "Крилаті ракети",
    shortLabel: "CRM",
    color: "#58d7ff",
    glow: "rgba(88, 215, 255, 0.58)",
    cone: "rgba(88, 215, 255, 0.15)",
    size: 34,
    marker: "triangle"
  },
  ballistic: {
    label: "Балістика",
    shortLabel: "BAL",
    color: "#ff4f6d",
    glow: "rgba(255, 79, 109, 0.62)",
    cone: "rgba(255, 79, 109, 0.18)",
    size: 40,
    marker: "bolt"
  },
  kab: {
    label: "КАБи",
    shortLabel: "KAB",
    color: "#ffd166",
    glow: "rgba(255, 209, 102, 0.52)",
    cone: "rgba(255, 209, 102, 0.15)",
    size: 32,
    marker: "hex"
  },
  jet_uav: {
    label: "Реактивні БПЛА",
    shortLabel: "J-UAV",
    color: "#b692ff",
    glow: "rgba(182, 146, 255, 0.58)",
    cone: "rgba(182, 146, 255, 0.15)",
    size: 36,
    marker: "chevron"
  }
};

export const LIVE_UPDATE_MS = 6000;
export const MAX_TRAIL_POINTS = 22;
