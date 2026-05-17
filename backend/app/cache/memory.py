from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from typing import Generic, TypeVar

T = TypeVar("T")


@dataclass
class CacheEntry(Generic[T]):
    value: T
    expires_at: datetime


class TTLMemoryCache(Generic[T]):
    def __init__(self, ttl_seconds: int) -> None:
        self.ttl = timedelta(seconds=ttl_seconds)
        self._entry: CacheEntry[T] | None = None

    def get(self) -> T | None:
        if self._entry is None:
            return None
        if self._entry.expires_at <= datetime.now(timezone.utc):
            self._entry = None
            return None
        return self._entry.value

    def set(self, value: T) -> None:
        self._entry = CacheEntry(value=value, expires_at=datetime.now(timezone.utc) + self.ttl)

