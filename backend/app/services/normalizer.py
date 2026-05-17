from datetime import datetime, timezone
from hashlib import sha256
from typing import Any

from app.models.threat import Coordinate, ThreatObject, ThreatStatus, ThreatType
from app.utils.localization import place_label, status_label, type_label


TYPE_ALIASES = {
    "shahed": ThreatType.shahed,
    "jet": ThreatType.jet_drone,
    "reactive": ThreatType.jet_drone,
    "uav": ThreatType.drone,
    "drone": ThreatType.drone,
    "missile": ThreatType.cruise_missile,
    "cruise": ThreatType.cruise_missile,
    "ballistic": ThreatType.ballistic_missile,
    "bomb": ThreatType.bomb,
    "kab": ThreatType.bomb,
}

STATUS_ALIASES = {
    "active": ThreatStatus.active,
    "flying": ThreatStatus.active,
    "detected": ThreatStatus.active,
    "eliminated": ThreatStatus.eliminated,
    "destroyed": ThreatStatus.eliminated,
    "lost": ThreatStatus.lost,
    "hit": ThreatStatus.hit_target,
    "impact": ThreatStatus.hit_target,
}


def _first(raw: dict[str, Any], *keys: str) -> Any:
    for key in keys:
        if key in raw and raw[key] not in (None, ""):
            return raw[key]
    return None


def _as_float(value: Any) -> float | None:
    try:
        return float(value)
    except (TypeError, ValueError):
        return None


def _coordinate(raw: Any) -> Coordinate | None:
    if not isinstance(raw, dict):
        return None
    lat = _as_float(_first(raw, "lat", "latitude", "y"))
    lng = _as_float(_first(raw, "lng", "lon", "longitude", "x"))
    if lat is None or lng is None:
        return None
    # Reduce precision to avoid presenting targeting-grade coordinates.
    return Coordinate(lat=round(lat, 2), lng=round(lng, 2))


def _infer_type(raw: dict[str, Any]) -> ThreatType:
    source = " ".join(str(_first(raw, "type", "kind", "name", "title", "class") or "").lower().split())
    for token, threat_type in TYPE_ALIASES.items():
        if token in source:
            return threat_type
    return ThreatType.air_threat if source else ThreatType.unknown


def _infer_status(raw: dict[str, Any]) -> ThreatStatus:
    source = str(_first(raw, "status", "state", "phase") or "").lower()
    for token, status in STATUS_ALIASES.items():
        if token in source:
            return status
    return ThreatStatus.unknown


def _normalize_trail(raw: Any) -> list[Coordinate]:
    if not isinstance(raw, list):
        return []
    return [coord for item in raw if (coord := _coordinate(item)) is not None]


def _iter_candidates(payload: Any) -> list[dict[str, Any]]:
    if isinstance(payload, list):
        return [item for item in payload if isinstance(item, dict)]
    if not isinstance(payload, dict):
        return []
    for key in ("objects", "threats", "features", "markers", "items", "data"):
        value = payload.get(key)
        if isinstance(value, list):
            return [item for item in value if isinstance(item, dict)]
    return [payload]


def normalize_payload(payload: Any) -> list[ThreatObject]:
    objects: list[ThreatObject] = []
    now = datetime.now(timezone.utc)

    for raw in _iter_candidates(payload):
        properties = raw.get("properties") if isinstance(raw.get("properties"), dict) else {}
        geometry = raw.get("geometry") if isinstance(raw.get("geometry"), dict) else {}
        merged = {**raw, **properties}

        point = _coordinate(merged)
        if point is None and isinstance(geometry.get("coordinates"), list) and len(geometry["coordinates"]) >= 2:
            point = _coordinate({"lng": geometry["coordinates"][0], "lat": geometry["coordinates"][1]})

        raw_id = _first(merged, "id", "uuid", "object_id", "uid")
        fallback = sha256(repr(merged).encode("utf-8")).hexdigest()[:16]
        threat_id = str(raw_id or fallback)
        threat_type = _infer_type(merged)
        status = _infer_status(merged)
        title = str(_first(merged, "title", "name", "label") or type_label(threat_type))
        heading = _as_float(_first(merged, "heading", "course", "azimuth", "bearing"))
        if heading is not None:
            heading = heading % 360

        objects.append(
            ThreatObject(
                id=threat_id,
                title=title,
                type=threat_type,
                type_label=type_label(threat_type),
                status=status,
                status_label=status_label(status),
                speed_kmh=_as_float(_first(merged, "speed", "speed_kmh", "velocity")),
                heading_deg=heading,
                launch_zone=place_label(_first(merged, "launch_zone", "from", "origin")),
                destination_city=place_label(_first(merged, "destination_city", "destination", "target_city")),
                estimated_destination=place_label(_first(merged, "estimated_destination", "eta_target", "target")),
                coordinates=point,
                predicted_coordinates=_coordinate(_first(merged, "predicted", "prediction", "forecast") or {}),
                trail=_normalize_trail(_first(merged, "trail", "track", "path")),
                last_update=now,
                raw={k: v for k, v in merged.items() if k not in {"geometry", "properties"}},
            )
        )

    return [item for item in objects if item.coordinates is not None]
