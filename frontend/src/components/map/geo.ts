import L from "leaflet";

const EARTH_RADIUS_M = 6371000;

export function normalizeHeading(heading: number) {
  return ((heading % 360) + 360) % 360;
}

export function lerp(current: number, target: number, alpha: number) {
  return current + (target - current) * alpha;
}

export function lerpAngle(current: number, target: number, alpha: number) {
  const delta = ((((target - current) % 360) + 540) % 360) - 180;
  return normalizeHeading(current + delta * alpha);
}

export function projectPosition(lat: number, lng: number, heading: number, distanceM: number): L.LatLngExpression {
  const bearing = (normalizeHeading(heading) * Math.PI) / 180;
  const latRad = (lat * Math.PI) / 180;
  const lngRad = (lng * Math.PI) / 180;
  const angularDistance = distanceM / EARTH_RADIUS_M;

  const projectedLat = Math.asin(
    Math.sin(latRad) * Math.cos(angularDistance) +
      Math.cos(latRad) * Math.sin(angularDistance) * Math.cos(bearing)
  );
  const projectedLng =
    lngRad +
    Math.atan2(
      Math.sin(bearing) * Math.sin(angularDistance) * Math.cos(latRad),
      Math.cos(angularDistance) - Math.sin(latRad) * Math.sin(projectedLat)
    );

  return [(projectedLat * 180) / Math.PI, (projectedLng * 180) / Math.PI];
}

export function speedToMetersPerSecond(speedKmh: number) {
  return Math.max(0, speedKmh) / 3.6;
}

export function asLatLng(latlng: L.LatLngExpression) {
  const [lat, lng] = latlng as [number, number];
  return { lat, lng };
}
