import asyncio
from typing import Any

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger

from backend.app.core.config import settings
from backend.app.services.threat_service import threat_service
from backend.app.integrations.telegram.webhook import telegram_webhook_router
from backend.app.realtime.ws_hub import ws_hub

app = FastAPI(title="RadarUA API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _round_coords(obj: Any, digits: int = 3) -> Any:
    """
    Safety: slightly reduce coordinate precision in every outgoing payload.
    Applies recursively and rounds common coordinate keys.
    """
    if isinstance(obj, dict):
        out: dict[str, Any] = {}
        for k, v in obj.items():
            lk = str(k).lower()
            if lk in {"lat", "latitude", "lon", "lng", "long", "longitude"} and isinstance(v, (int, float)):
                out[k] = round(float(v), digits)
            else:
                out[k] = _round_coords(v, digits=digits)
        return out
    if isinstance(obj, list):
        return [_round_coords(v, digits=digits) for v in obj]
    return obj


@app.get("/api/threats")
async def get_threats():
    snapshot = await threat_service.get_snapshot()
    return _round_coords(snapshot.model_dump(mode="json"))


@app.get("/api/current")
async def get_current():
    snapshot = await threat_service.get_snapshot()
    return _round_coords(snapshot.model_dump(mode="json"))


@app.get("/api/stats")
async def get_stats():
    snapshot = await threat_service.get_snapshot()
    payload = snapshot.model_dump(mode="json")
    targets = payload.get("targets") if isinstance(payload, dict) else None
    return {
        "targets_total": len(targets) if isinstance(targets, list) else 0,
        "cache_refresh_seconds": settings.cache_refresh_seconds,
    }


@app.get("/health")
async def health():
    return {"status": "ok"}


async def _radar_broadcast_loop() -> None:
    """
    Single producer for all WS clients:
      - polls snapshot on a fixed cadence (settings.cache_refresh_seconds)
      - broadcasts to all active websocket clients
    """
    while True:
        snapshot = await threat_service.get_snapshot()
        payload = _round_coords(snapshot.model_dump(mode="json"))
        await ws_hub.broadcast_json(payload)
        await asyncio.sleep(settings.cache_refresh_seconds)


@app.on_event("startup")
async def _startup() -> None:
    logger.info("starting RadarUA WS broadcast loop refresh_seconds={s}", s=settings.cache_refresh_seconds)
    ws_hub.start(_radar_broadcast_loop())


@app.on_event("shutdown")
async def _shutdown() -> None:
    await ws_hub.stop()


@app.websocket("/ws/radar")
async def radar_socket(websocket: WebSocket):
    await websocket.accept()
    try:
        await ws_hub.connect(websocket)
        # Push initial snapshot immediately (helps UI show time/online without waiting a full cycle).
        snapshot = await threat_service.get_snapshot()
        await websocket.send_json(_round_coords(snapshot.model_dump(mode="json")))

        # Keep connection open; also listen for disconnect frames.
        while True:
            await websocket.receive()
    except WebSocketDisconnect:
        await ws_hub.disconnect(websocket)
        return
    except Exception:
        await ws_hub.disconnect(websocket)
        raise


# Telegram bot webhook + auth endpoints
app.include_router(telegram_webhook_router)
