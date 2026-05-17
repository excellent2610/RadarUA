import os
from dataclasses import dataclass

from telegram import InlineKeyboardButton, InlineKeyboardMarkup, Update
from telegram.ext import Application, CommandHandler, ContextTypes


@dataclass(frozen=True)
class TelegramBotConfig:
    token: str
    mini_app_url: str


def load_bot_config() -> TelegramBotConfig:
    token = os.getenv("TELEGRAM_BOT_TOKEN", "").strip()
    mini_app_url = os.getenv("TELEGRAM_MINI_APP_URL", "").strip()
    if not token:
        raise RuntimeError("TELEGRAM_BOT_TOKEN is not set")
    if not mini_app_url:
        raise RuntimeError("TELEGRAM_MINI_APP_URL is not set")
    return TelegramBotConfig(token=token, mini_app_url=mini_app_url)


async def _start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    cfg: TelegramBotConfig = context.bot_data["cfg"]
    keyboard = InlineKeyboardMarkup(
        [[InlineKeyboardButton(text="Відкрити RadarUA", url=cfg.mini_app_url)]]
    )
    if update.message:
        await update.message.reply_text(
            "RadarUA — Telegram Mini App з живою картою загроз (публічні дані).",
            reply_markup=keyboard,
            disable_web_page_preview=True,
        )


def build_application(cfg: TelegramBotConfig) -> Application:
    app = Application.builder().token(cfg.token).build()
    app.bot_data["cfg"] = cfg
    app.add_handler(CommandHandler("start", _start))
    return app

