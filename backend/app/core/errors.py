import logging

from fastapi import FastAPI, Request
from fastapi.responses import ORJSONResponse

logger = logging.getLogger(__name__)


class UpstreamDataError(RuntimeError):
    """Помилка відкритого джерела даних."""


def register_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(UpstreamDataError)
    async def upstream_error(_: Request, exc: UpstreamDataError) -> ORJSONResponse:
        logger.warning("джерело_даних_недоступне", extra={"помилка": str(exc)})
        return ORJSONResponse(status_code=502, content={"detail": "Публічне джерело даних тимчасово недоступне."})

    @app.exception_handler(Exception)
    async def unhandled_error(_: Request, exc: Exception) -> ORJSONResponse:
        logger.exception("внутрішня_помилка", extra={"помилка": str(exc)})
        return ORJSONResponse(status_code=500, content={"detail": "Внутрішня помилка сервера."})
