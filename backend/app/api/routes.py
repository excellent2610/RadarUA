from fastapi import APIRouter, Depends

from app.api.dependencies import get_threat_service
from app.models.threat import ThreatObject
from app.schemas.responses import CurrentResponse, ThreatStats
from app.services.threat_service import ThreatService

router = APIRouter(prefix="/api", tags=["Радар"])


@router.get("/current", response_model=CurrentResponse, summary="Поточна повітряна обстановка")
async def current(service: ThreatService = Depends(get_threat_service)) -> CurrentResponse:
    return await service.current()


@router.get("/objects", response_model=list[ThreatObject], summary="Повітряні цілі")
async def objects(service: ThreatService = Depends(get_threat_service)) -> list[ThreatObject]:
    return (await service.current()).objects


@router.get("/stats", response_model=ThreatStats, summary="Статистика загроз")
async def stats(service: ThreatService = Depends(get_threat_service)) -> ThreatStats:
    return await service.stats()
