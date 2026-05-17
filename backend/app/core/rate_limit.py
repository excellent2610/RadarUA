from collections import defaultdict, deque
from time import monotonic

from fastapi import Request
from fastapi.responses import ORJSONResponse
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.responses import Response

from app.core.config import settings


class InMemoryRateLimitMiddleware(BaseHTTPMiddleware):
    """Локальний ліміт запитів; для кількох реплік варто замінити сховище на Redis."""

    def __init__(self, app) -> None:
        super().__init__(app)
        self.window_seconds = 60
        self.limit = settings.rate_limit_per_minute
        self.requests: dict[str, deque[float]] = defaultdict(deque)

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        if request.url.path.startswith("/ws"):
            return await call_next(request)

        client = request.client.host if request.client else "unknown"
        now = monotonic()
        bucket = self.requests[client]
        while bucket and bucket[0] <= now - self.window_seconds:
            bucket.popleft()
        if len(bucket) >= self.limit:
            return ORJSONResponse(status_code=429, content={"detail": "Перевищено ліміт запитів."})
        bucket.append(now)
        return await call_next(request)
