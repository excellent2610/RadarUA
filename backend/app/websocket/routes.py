import asyncio

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.api.dependencies import get_threat_service
from app.websocket.manager import manager

router = APIRouter(tags=["Живий канал"])


@router.websocket("/ws/live")
async def live(websocket: WebSocket) -> None:
    await manager.connect(websocket)
    service = get_threat_service(websocket)
    try:
        while True:
            current = await service.current()
            await manager.send_json(websocket, current.model_dump(mode="json"))
            await asyncio.sleep(5)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
