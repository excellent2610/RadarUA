import { useEffect, useState } from "react";
import { createLiveRadarSocket } from "../services/liveSocket";
import { ThreatTarget } from "../types/threat";

export function useLiveRadar() {
  const [targets, setTargets] = useState<ThreatTarget[]>([]);
  const [connected, setConnected] = useState(false);
  const [reconnecting, setReconnecting] = useState(true);
  const [lastSync, setLastSync] = useState<string | null>(null);

  useEffect(() => {
    return createLiveRadarSocket({
      onTargets(nextTargets, serverTime) {
        setTargets(nextTargets);
        setLastSync(serverTime ?? new Date().toISOString());
      },
      onState(isConnected, isReconnecting) {
        setConnected(isConnected);
        setReconnecting(isReconnecting);
      }
    });
  }, []);

  return { targets, connected, reconnecting, lastSync };
}
