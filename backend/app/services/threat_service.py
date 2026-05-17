from __future__ import annotations

from asyncio import Lock
from datetime import datetime, timezone

from backend.app.core.config import settings
from backend.app.models.threat import ThreatSnapshot
from backend.app.services.mapa_client import fetch_mapa_targets


class ThreatService:
    def __init__(self) -> None:
        self._snapshot = ThreatSnapshot(targets=[])
        self._last_refresh = 0.0
        self._lock = Lock()

    async def get_snapshot(self, force: bool = False) -> ThreatSnapshot:
        now = datetime.now(timezone.utc).timestamp()
        if not force and now - self._last_refresh < settings.cache_refresh_seconds:
            return self._snapshot

        async with self._lock:
            now = datetime.now(timezone.utc).timestamp()
            if not force and now - self._last_refresh < settings.cache_refresh_seconds:
                return self._snapshot
            targets = await fetch_mapa_targets()
            self._snapshot = ThreatSnapshot(targets=targets)
            self._last_refresh = now
            return self._snapshot


threat_service = ThreatService()
