import { LIVE_UPDATE_MS, ThreatTarget } from "../types/threat";

type RadarMessage = {
  targets: ThreatTarget[];
  serverTime?: string;
};

type LiveSocketHandlers = {
  onTargets: (targets: ThreatTarget[], serverTime?: string) => void;
  onState: (connected: boolean, reconnecting: boolean) => void;
};

export function createLiveRadarSocket(handlers: LiveSocketHandlers) {
  let socket: WebSocket | null = null;
  let reconnectTimer = 0;
  let pollTimer = 0;
  let closedByClient = false;

  const protocol = window.location.protocol === "https:" ? "wss" : "ws";
  const url = `${protocol}://${window.location.host}/ws/radar`;

  const pollSnapshot = async () => {
    try {
      const response = await fetch("/api/threats", { cache: "no-store" });
      if (!response.ok) return;
      const data = (await response.json()) as RadarMessage;
      handlers.onTargets(data.targets, data.serverTime);
    } catch {
      // Websocket reconnect owns visible state; polling is a quiet fallback.
    }
  };

  const startPolling = () => {
    window.clearInterval(pollTimer);
    pollTimer = window.setInterval(pollSnapshot, LIVE_UPDATE_MS);
  };

  const connect = () => {
    window.clearTimeout(reconnectTimer);
    socket = new WebSocket(url);
    handlers.onState(false, true);

    socket.addEventListener("open", () => {
      handlers.onState(true, false);
      socket?.send(JSON.stringify({ type: "sync", intervalMs: LIVE_UPDATE_MS }));
    });

    socket.addEventListener("message", (event) => {
      const data = JSON.parse(event.data) as RadarMessage;
      handlers.onTargets(data.targets, data.serverTime);
    });

    socket.addEventListener("close", () => {
      handlers.onState(false, !closedByClient);
      if (!closedByClient) {
        reconnectTimer = window.setTimeout(connect, 1500);
      }
    });

    socket.addEventListener("error", () => {
      socket?.close();
    });
  };

  connect();
  startPolling();

  return () => {
    closedByClient = true;
    window.clearTimeout(reconnectTimer);
    window.clearInterval(pollTimer);
    socket?.close();
  };
}
