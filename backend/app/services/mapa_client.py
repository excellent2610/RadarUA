from __future__ import annotations

from datetime import datetime, timezone
import math
import time

import httpx

from backend.app.core.config import settings
from backend.app.models.threat import ThreatTarget


TYPE_ALIASES = {
    "shahed": "shahed",
    "шахед": "shahed",
    "uav": "shahed",
    "cruise": "cruise_missile",
    "крил": "cruise_missile",
    "ballistic": "ballistic",
    "баліст": "ballistic",
    "kab": "kab",
    "каб": "kab",
    "jet": "jet_uav",
    "реактив": "jet_uav",
}


def _normalize_type(raw_type: str | None) -> str:
    lowered = (raw_type or "").lower()
    for token, target_type in TYPE_ALIASES.items():
        if token in lowered:
            return target_type
    return "shahed"


def _normalize_item(item: dict) -> ThreatTarget | None:
    lat = item.get("lat") or item.get("latitude")
    lng = item.get("lng") or item.get("lon") or item.get("longitude")
    if lat is None or lng is None:
        return None

    updated = item.get("updatedAt") or item.get("updated_at") or item.get("timestamp")
    updated_at = datetime.now(timezone.utc)
    if isinstance(updated, str):
        try:
            updated_at = datetime.fromisoformat(updated.replace("Z", "+00:00"))
        except ValueError:
            updated_at = datetime.now(timezone.utc)

    return ThreatTarget(
        id=str(item.get("id") or item.get("uuid") or f"{lat}:{lng}:{item.get('type')}"),
        type=_normalize_type(str(item.get("type") or item.get("name") or "")),
        lat=float(lat),
        lng=float(lng),
        heading=float(item.get("heading") or item.get("course") or 0) % 360,
        speedKmh=float(item.get("speedKmh") or item.get("speed_kmh") or item.get("speed") or 0),
        altitudeM=item.get("altitudeM") or item.get("altitude_m"),
        status=item.get("status") or "active",
        updatedAt=updated_at,
        callsign=item.get("callsign") or item.get("label"),
    )


async def fetch_mapa_targets() -> list[ThreatTarget]:
    if not settings.mapa_api_url:
        return _demo_targets()

    async with httpx.AsyncClient(timeout=4.5) as client:
        response = await client.get(settings.mapa_api_url)
        response.raise_for_status()
        payload = response.json()

    raw_targets = payload.get("targets", payload if isinstance(payload, list) else [])
    targets = [_normalize_item(item) for item in raw_targets if isinstance(item, dict)]
    return [target for target in targets if target is not None]


def _demo_targets() -> list[ThreatTarget]:
    now = time.time()
    center_lat = 49.0
    center_lng = 31.2
    specs = [
        ("shd-01", "shahed", 42, 172, 155),
        ("crm-07", "cruise_missile", 118, 264, 680),
        ("bal-02", "ballistic", 224, 42, 2100),
        ("kab-11", "kab", 302, 198, 760),
        ("juav-04", "jet_uav", 16, 305, 920),
    ]
    targets: list[ThreatTarget] = []
    for idx, (target_id, target_type, phase, heading, speed) in enumerate(specs):
        drift = now / (42 + idx * 7) + phase
        targets.append(
            ThreatTarget(
                id=target_id,
                type=target_type,  # type: ignore[arg-type]
                lat=center_lat + math.sin(drift) * (1.5 + idx * 0.18),
                lng=center_lng + math.cos(drift * 0.82) * (2.7 + idx * 0.24),
                heading=(heading + math.sin(drift) * 18) % 360,
                speedKmh=speed,
                updatedAt=datetime.now(timezone.utc),
                callsign=target_id.upper(),
            )
        )
    return targets
