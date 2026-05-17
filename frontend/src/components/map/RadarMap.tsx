import L from "leaflet";
import { useEffect, useMemo, useRef } from "react";
import { MAX_TRAIL_POINTS, ThreatTarget, THREAT_STYLE } from "../../types/threat";
import { asLatLng, lerp, lerpAngle, projectPosition, speedToMetersPerSecond } from "./geo";
import { buildTargetHtml } from "./targetHtml";

type RadarMapProps = {
  targets: ThreatTarget[];
};

type TrailPoint = {
  lat: number;
  lng: number;
  ts: number;
};

type RenderTarget = {
  source: ThreatTarget;
  lat: number;
  lng: number;
  heading: number;
  marker: L.Marker;
  predictionLine: L.Polyline;
  predictionMarker: L.CircleMarker;
  trailSegments: L.Polyline[];
  trail: TrailPoint[];
  lastFrameAt: number;
};

const UKRAINE_CENTER: L.LatLngExpression = [49.03, 31.48];
const PREDICTION_SECONDS = 90;
const STALE_TARGET_MS = 90000;

function zoomScale(zoom: number) {
  return Math.min(1.55, Math.max(0.72, 0.74 + (zoom - 5) * 0.12));
}

function makeIcon(target: ThreatTarget, scale: number) {
  const style = THREAT_STYLE[target.type];
  const size = Math.round((style.size + 80) * scale);

  return L.divIcon({
    html: buildTargetHtml(target, scale),
    className: "leaflet-target-icon",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2]
  });
}

function updateTrail(renderTarget: RenderTarget, pane: L.LayerGroup, color: string) {
  renderTarget.trailSegments.forEach((segment) => pane.removeLayer(segment));
  renderTarget.trailSegments = [];

  const points = renderTarget.trail.slice(-MAX_TRAIL_POINTS);
  for (let index = 1; index < points.length; index += 1) {
    const age = index / Math.max(1, points.length - 1);
    const segment = L.polyline(
      [
        [points[index - 1].lat, points[index - 1].lng],
        [points[index].lat, points[index].lng]
      ],
      {
        color,
        opacity: 0.08 + age * 0.48,
        weight: 1 + age * 2.2,
        interactive: false,
        pane: "shadowPane"
      }
    );
    renderTarget.trailSegments.push(segment);
    segment.addTo(pane);
  }
}

export function RadarMap({ targets }: RadarMapProps) {
  const mapNodeRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);
  const trailLayerRef = useRef<L.LayerGroup | null>(null);
  const rafRef = useRef(0);
  const renderedRef = useRef(new Map<string, RenderTarget>());
  const latestTargets = useMemo(() => new Map(targets.map((target) => [target.id, target])), [targets]);

  useEffect(() => {
    if (!mapNodeRef.current || mapRef.current) return;

    const map = L.map(mapNodeRef.current, {
      center: UKRAINE_CENTER,
      zoom: 6,
      minZoom: 5,
      maxZoom: 12,
      preferCanvas: true,
      zoomControl: false,
      attributionControl: false
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
      updateWhenIdle: true,
      keepBuffer: 2
    }).addTo(map);

    L.control.zoom({ position: "bottomright" }).addTo(map);
    map.createPane("predictionPane");
    map.getPane("predictionPane")!.style.zIndex = "460";
    const trails = L.layerGroup().addTo(map);
    const targetsLayer = L.layerGroup().addTo(map);

    mapRef.current = map;
    layerRef.current = targetsLayer;
    trailLayerRef.current = trails;

    return () => {
      window.cancelAnimationFrame(rafRef.current);
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
      trailLayerRef.current = null;
      renderedRef.current.clear();
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const targetLayer = layerRef.current;
    const trailLayer = trailLayerRef.current;
    if (!map || !targetLayer || !trailLayer) return;

    const scale = zoomScale(map.getZoom());
    const seenIds = new Set<string>();
    const now = Date.now();

    latestTargets.forEach((target, id) => {
      seenIds.add(id);
      const existing = renderedRef.current.get(id);
      const style = THREAT_STYLE[target.type];
      const prediction = projectPosition(
        target.lat,
        target.lng,
        target.heading,
        speedToMetersPerSecond(target.speedKmh) * PREDICTION_SECONDS
      );

      if (existing) {
        existing.source = target;
        existing.marker.setIcon(makeIcon(target, scale));
        existing.predictionLine.setLatLngs([[existing.lat, existing.lng], prediction]);
        existing.predictionMarker.setLatLng(prediction);
        existing.trail.push({ lat: target.lat, lng: target.lng, ts: now });
        existing.trail = existing.trail.slice(-MAX_TRAIL_POINTS);
        updateTrail(existing, trailLayer, style.color);
        return;
      }

      const marker = L.marker([target.lat, target.lng], {
        icon: makeIcon(target, scale),
        interactive: false,
        keyboard: false
      }).addTo(targetLayer);

      const predictionLine = L.polyline([[target.lat, target.lng], prediction], {
        color: style.color,
        opacity: 0.46,
        dashArray: "3 9",
        weight: 2,
        interactive: false,
        pane: "predictionPane"
      }).addTo(targetLayer);

      const predictionMarker = L.circleMarker(prediction, {
        radius: 4.5,
        color: style.color,
        fillColor: style.color,
        fillOpacity: 0.24,
        opacity: 0.8,
        weight: 1,
        interactive: false,
        pane: "predictionPane"
      }).addTo(targetLayer);

      renderedRef.current.set(id, {
        source: target,
        lat: target.lat,
        lng: target.lng,
        heading: target.heading,
        marker,
        predictionLine,
        predictionMarker,
        trailSegments: [],
        trail: [{ lat: target.lat, lng: target.lng, ts: now }],
        lastFrameAt: performance.now()
      });
    });

    renderedRef.current.forEach((renderTarget, id) => {
      const stale = now - new Date(renderTarget.source.updatedAt).getTime() > STALE_TARGET_MS;
      if (seenIds.has(id) && !stale) return;
      targetLayer.removeLayer(renderTarget.marker);
      targetLayer.removeLayer(renderTarget.predictionLine);
      targetLayer.removeLayer(renderTarget.predictionMarker);
      renderTarget.trailSegments.forEach((segment) => trailLayer.removeLayer(segment));
      renderedRef.current.delete(id);
    });
  }, [latestTargets]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const refreshZoomScale = () => {
      const scale = zoomScale(map.getZoom());
      renderedRef.current.forEach((renderTarget) => {
        renderTarget.marker.setIcon(makeIcon(renderTarget.source, scale));
      });
    };

    map.on("zoomend", refreshZoomScale);
    return () => {
      map.off("zoomend", refreshZoomScale);
    };
  }, []);

  useEffect(() => {
    const animate = (frameAt: number) => {
      const map = mapRef.current;
      const visibleBounds = map?.getBounds().pad(0.28);

      renderedRef.current.forEach((renderTarget) => {
        const deltaS = Math.min(0.08, Math.max(0, (frameAt - renderTarget.lastFrameAt) / 1000));
        renderTarget.lastFrameAt = frameAt;

        const sourceAgeS = Math.min(
          12,
          Math.max(0, (Date.now() - new Date(renderTarget.source.updatedAt).getTime()) / 1000)
        );
        const extrapolated = asLatLng(
          projectPosition(
            renderTarget.source.lat,
            renderTarget.source.lng,
            renderTarget.source.heading,
            speedToMetersPerSecond(renderTarget.source.speedKmh) * sourceAgeS
          )
        );

        renderTarget.lat = lerp(renderTarget.lat, extrapolated.lat, 0.08);
        renderTarget.lng = lerp(renderTarget.lng, extrapolated.lng, 0.08);
        renderTarget.heading = lerpAngle(renderTarget.heading, renderTarget.source.heading, 0.12);

        const current: L.LatLngExpression = [renderTarget.lat, renderTarget.lng];
        const element = renderTarget.marker.getElement();
        if (visibleBounds && !visibleBounds.contains(current)) {
          if (element) element.style.display = "none";
          renderTarget.predictionLine.setStyle({ opacity: 0 });
          renderTarget.predictionMarker.setStyle({ opacity: 0, fillOpacity: 0 });
          return;
        }
        if (element) element.style.display = "";
        renderTarget.predictionLine.setStyle({ opacity: 0.46 });
        renderTarget.predictionMarker.setStyle({ opacity: 0.8, fillOpacity: 0.24 });

        const future = projectPosition(
          renderTarget.lat,
          renderTarget.lng,
          renderTarget.heading,
          speedToMetersPerSecond(renderTarget.source.speedKmh) * PREDICTION_SECONDS
        );

        renderTarget.marker.setLatLng(current);
        renderTarget.predictionLine.setLatLngs([current, future]);
        renderTarget.predictionMarker.setLatLng(future);
      });

      rafRef.current = window.requestAnimationFrame(animate);
    };

    rafRef.current = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div className="map-wrap">
      <div className="radar-grid" />
      <div className="radar-sweep" />
      <div className="map-root" ref={mapNodeRef} />
      <div className="map-vignette" />
    </div>
  );
}
