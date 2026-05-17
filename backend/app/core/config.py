from __future__ import annotations

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    mapa_api_url: str | None = None
    cache_refresh_seconds: int = 6
    cors_origins: list[str] = ["http://localhost:5173", "http://127.0.0.1:5173"]


settings = Settings()
