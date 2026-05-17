import asyncio
from typing import Any

from fastapi import WebSocket
from loguru import logger


class WebSocketHub:
    def __init__(self) -> None:
        self._clients: dict[WebSocket, "asyncio.Queue[Any]"] = {}
        self._send_tasks: dict[WebSocket, asyncio.Task[None]] = {}
        self._lock = asyncio.Lock()
        self._task: asyncio.Task[None] | None = None

    async def connect(self, ws: WebSocket) -> None:
        async with self._lock:
            if ws in self._clients:
                return
            q: asyncio.Queue[Any] = asyncio.Queue(maxsize=8)
            self._clients[ws] = q
            self._send_tasks[ws] = asyncio.create_task(self._sender(ws, q))

    async def disconnect(self, ws: WebSocket) -> None:
        async with self._lock:
            self._clients.pop(ws, None)
            task = self._send_tasks.pop(ws, None)
        if task:
            task.cancel()
            try:
                await task
            except asyncio.CancelledError:
                pass

    async def broadcast_json(self, payload: Any) -> None:
        async with self._lock:
            queues = list(self._clients.values())

        if not queues:
            return

        for q in queues:
            try:
                if q.full():
                    _ = q.get_nowait()
                q.put_nowait(payload)
            except Exception:
                continue

    def start(self, coro: "asyncio.Future[Any] | asyncio.coroutines.Coroutine[Any, Any, Any]") -> None:
        if self._task and not self._task.done():
            return
        self._task = asyncio.create_task(self._runner(coro))

    async def stop(self) -> None:
        if not self._task:
            return
        self._task.cancel()
        try:
            await self._task
        except asyncio.CancelledError:
            pass
        finally:
            self._task = None

    async def _runner(self, coro: Any) -> None:
        try:
            await coro
        except asyncio.CancelledError:
            return
        except Exception:
            logger.exception("ws hub task crashed")

    async def _sender(self, ws: WebSocket, q: "asyncio.Queue[Any]") -> None:
        try:
            while True:
                payload = await q.get()
                await ws.send_json(payload)
        except asyncio.CancelledError:
            return
        except Exception:
            logger.debug("ws sender stopped")
        finally:
            try:
                await self.disconnect(ws)
            except Exception:
                pass


ws_hub = WebSocketHub()
