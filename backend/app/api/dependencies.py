from fastapi import Request

from app.services.threat_service import ThreatService


def get_threat_service(request: Request) -> ThreatService:
    if not hasattr(request.app.state, "threat_service"):
        request.app.state.threat_service = ThreatService(request.app.state.mapa_client)
    return request.app.state.threat_service

