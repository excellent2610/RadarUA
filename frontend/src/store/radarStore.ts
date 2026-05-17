import { create } from "zustand";
import { translate } from "../i18n";
import type { CurrentResponse, Filters, ThreatObject, ThreatStats } from "../types/threat";

interface RadarState {
  objects: ThreatObject[];
  stats?: ThreatStats;
  selected?: ThreatObject;
  updatedAt?: string;
  disclaimer: string;
  connected: boolean;
  loading: boolean;
  error?: string;
  filters: Filters;
  setCurrent: (current: CurrentResponse) => void;
  setStats: (stats: ThreatStats) => void;
  setSelected: (object?: ThreatObject) => void;
  setConnected: (connected: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error?: string) => void;
  toggleFilter: (key: keyof Filters) => void;
}

export const useRadarStore = create<RadarState>((set) => ({
  objects: [],
  disclaimer: translate("app.disclaimer"),
  connected: false,
  loading: true,
  filters: {
    drones: true,
    missiles: true,
    ballistic: true,
    bombs: true,
    activeOnly: false,
    eliminated: true,
    lost: true,
  },
  setCurrent: (current) =>
    set({
      objects: current.objects,
      updatedAt: current.updated_at,
      disclaimer: current.safety.disclaimer || translate("app.disclaimer"),
      loading: false,
      error: undefined,
    }),
  setStats: (stats) => set({ stats }),
  setSelected: (selected) => set({ selected }),
  setConnected: (connected) => set({ connected }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error, loading: false }),
  toggleFilter: (key) => set((state) => ({ filters: { ...state.filters, [key]: !state.filters[key] } })),
}));
