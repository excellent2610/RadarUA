import hashlib
import hmac
import os
import time
import urllib.parse
from dataclasses import dataclass


@dataclass(frozen=True)
class TelegramInitData:
    raw: str
    user_id: int | None
    auth_date: int | None


def _parse_init_data(init_data: str) -> dict[str, str]:
    # initData is querystring: key=value&key=value
    parsed = urllib.parse.parse_qs(init_data, strict_parsing=False, keep_blank_values=True)
    # Telegram guarantees single values for keys we use.
    return {k: (v[0] if v else "") for k, v in parsed.items()}


def verify_init_data(init_data: str, bot_token: str, max_age_seconds: int = 60 * 60) -> TelegramInitData:
    """
    Verify Telegram Mini App initData signature (hash) and age.
    This is required for production auth trust.
    """
    if not init_data:
        raise ValueError("init_data is empty")
    if not bot_token:
        raise ValueError("bot_token is empty")

    data = _parse_init_data(init_data)
    received_hash = data.pop("hash", None)
    if not received_hash:
        raise ValueError("init_data missing hash")

    auth_date_raw = data.get("auth_date")
    auth_date = int(auth_date_raw) if auth_date_raw and auth_date_raw.isdigit() else None
    if auth_date is None:
        raise ValueError("init_data missing auth_date")
    now = int(time.time())
    if now - auth_date > max_age_seconds:
        raise ValueError("init_data expired")

    # Check string: sorted keys, "key=value" joined by "\n"
    check_string = "\n".join(f"{k}={data[k]}" for k in sorted(data.keys()))

    # Secret key is SHA256(bot_token)
    secret_key = hashlib.sha256(bot_token.encode("utf-8")).digest()
    computed_hash = hmac.new(secret_key, check_string.encode("utf-8"), hashlib.sha256).hexdigest()
    if not hmac.compare_digest(computed_hash, received_hash):
        raise ValueError("init_data signature invalid")

    user_id: int | None = None
    user_json = data.get("user")
    if user_json:
        # Minimal extraction without JSON dependency on a specific format.
        # The "user" value is JSON; we decode defensively.
        try:
            import json

            user_obj = json.loads(user_json)
            if isinstance(user_obj, dict) and isinstance(user_obj.get("id"), int):
                user_id = user_obj["id"]
        except Exception:
            user_id = None

    return TelegramInitData(raw=init_data, user_id=user_id, auth_date=auth_date)


def get_bot_token_from_env() -> str:
    return os.getenv("TELEGRAM_BOT_TOKEN", "").strip()

