import os
from typing import Any

from fastapi import APIRouter, Header, HTTPException, Request
from loguru import logger

from backend.app.integrations.telegram.auth import get_bot_token_from_env, verify_init_data


telegram_webhook_router = APIRouter(prefix="/telegram", tags=["telegram"])


def _get_webhook_secret() -> str:
    return os.getenv("TELEGRAM_WEBHOOK_SECRET", "").strip()


@telegram_webhook_router.post("/webhook")
async def telegram_webhook(
    request: Request,
    x_telegram_bot_api_secret_token: str | None = Header(default=None),
) -> dict[str, Any]:
    """
    Telegram webhook endpoint.
    Security:
      - validates X-Telegram-Bot-Api-Secret-Token if TELEGRAM_WEBHOOK_SECRET is configured
    """
    secret = _get_webhook_secret()
    if secret:
        if not x_telegram_bot_api_secret_token or x_telegram_bot_api_secret_token != secret:
            raise HTTPException(status_code=401, detail="invalid webhook secret")

    update = await request.json()
    # We keep webhook processing minimal in API process; production deployments can offload
    # heavy processing to a queue/worker.
    logger.info("telegram_webhook received update keys={keys}", keys=list(update.keys()) if isinstance(update, dict) else [])
    return {"ok": True}


@telegram_webhook_router.post("/auth/verify")
async def telegram_verify_init_data(payload: dict[str, Any]) -> dict[str, Any]:
    """
    Verifies Mini App initData and returns minimal user info.
    Frontend should call this to establish trusted session on the backend.
    """
    init_data = str(payload.get("initData") or "").strip()
    bot_token = get_bot_token_from_env()
    info = verify_init_data(init_data, bot_token=bot_token)
    return {"ok": True, "user_id": info.user_id, "auth_date": info.auth_date}

