import L from "leaflet";
import { Marker, Tooltip } from "react-leaflet";
import type { ThreatObject } from "../../types/threat";
import { triggerHaptic } from "../../hooks/useTelegram";
import { humanType } from "../../utils/format";

const toneByType: Record<string, string> = {
  drone: "#42ff9e",
  shahed: "#42ff9e",
  jet_drone: "#4de6ff",
  cruise_missile: "#ffbf47",
  ballistic_missile: "#ff4f5e",
  bomb: "#4de6ff",
  air_threat: "#b7ff4a",
  unknown: "#cbd5e1",
};

function iconFor(object: ThreatObject, selected: boolean) {
  const tone = toneByType[object.type] || toneByType.unknown;
  const heading = object.heading_deg ?? 0;
  return L.divIcon({
    className: "",
    iconSize: selected ? [44, 44] : [34, 34],
    iconAnchor: selected ? [22, 22] : [17, 17],
    html: `
      <div class="threat-marker ${selected ? "selected" : ""}" style="--tone:${tone};">
        <span class="marker-pulse"></span>
        <span class="marker-core" style="transform: rotate(${heading}deg);"></span>
      </div>
    `,
  });
}

interface ThreatMarkerProps {
  object: ThreatObject;
  selected: boolean;
  onSelect: (object: ThreatObject) => void;
}

export function ThreatMarker({ object, selected, onSelect }: ThreatMarkerProps) {
  if (!object.coordinates) return null;

  return (
    <Marker
      position={[object.coordinates.lat, object.coordinates.lng]}
      icon={iconFor(object, selected)}
      eventHandlers={{
        click: () => {
          triggerHaptic("light");
          onSelect(object);
        },
      }}
    >
      <Tooltip direction="top" offset={[0, -14]} opacity={0.95}>
        <span className="font-display text-xs uppercase">{humanType(object.type)}</span>
      </Tooltip>
    </Marker>
  );
}
