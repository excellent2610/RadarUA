import { Polyline } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import type { ThreatObject } from "../../types/threat";

export function TrailRoute({ object }: { object: ThreatObject }) {
  const trail = object.trail?.length ? object.trail : object.coordinates ? [object.coordinates] : [];
  if (trail.length < 2) return null;

  const positions = trail.map((point) => [point.lat, point.lng]) as LatLngExpression[];
  return (
    <>
      <Polyline positions={positions} pathOptions={{ color: "#42ff9e", opacity: 0.18, weight: 8 }} />
      <Polyline positions={positions} pathOptions={{ color: "#42ff9e", opacity: 0.85, weight: 2, dashArray: "8 10" }} />
    </>
  );
}

