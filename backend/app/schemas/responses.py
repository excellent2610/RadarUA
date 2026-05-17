from datetime import datetime

from pydantic import BaseModel

from app.models.threat import ThreatObject


class SafetyMetadata(BaseModel):
    approximate: bool = True
    public_sources_only: bool = True
    data_delay_seconds: int
    precision: str = "reduced"
    disclaimer: str = "Дані орієнтовні та базуються на відкритих джерелах."


class CurrentResponse(BaseModel):
    event_label: str = "Оновлення повітряної обстановки"
    updated_at: datetime
    objects: list[ThreatObject]
    safety: SafetyMetadata


class ThreatStats(BaseModel):
    active_count: int
    drones_count: int
    missiles_count: int
    ballistic_count: int
    bombs_count: int
    eliminated_count: int
    lost_count: int
    attack_status: str
    last_update: datetime


class HealthResponse(BaseModel):
    status: str
    service: str
    version: str
