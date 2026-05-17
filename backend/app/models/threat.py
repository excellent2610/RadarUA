from __future__ import annotations

from datetime import datetime, timezone
from typing import Literal

from pydantic import BaseModel, Field


ThreatType = Literal["shahed", "cruise_missile", "ballistic", "kab", "jet_uav"]
ThreatStatus = Literal["active", "stale", "expired"]


class ThreatTarget(BaseModel):
    id: str
    type: ThreatType
    lat: float
    lng: float
    heading: float = Field(ge=0, lt=360)
    speedKmh: float = Field(default=0, ge=0)
    altitudeM: int | None = None
    status: ThreatStatus = "active"
    updatedAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    callsign: str | None = None


class ThreatSnapshot(BaseModel):
    targets: list[ThreatTarget]
    serverTime: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
