import axios from "axios";
import type { CurrentResponse, ThreatObject, ThreatStats } from "../types/threat";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";

export const api = axios.create({
  baseURL: apiBaseUrl,
  timeout: 9000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(undefined, async (error) => {
  const config = error.config;
  if (!config || config.__retryCount >= 2) {
    return Promise.reject(error);
  }
  config.__retryCount = (config.__retryCount || 0) + 1;
  await new Promise((resolve) => setTimeout(resolve, 500 * config.__retryCount));
  return api(config);
});

export const radarApi = {
  current: async () => (await api.get<CurrentResponse>("/api/current")).data,
  objects: async () => (await api.get<ThreatObject[]>("/api/objects")).data,
  stats: async () => (await api.get<ThreatStats>("/api/stats")).data,
};

