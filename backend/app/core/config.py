from __future__ import annotations

from functools import lru_cache
from pathlib import Path

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_name: str = "Portfolio API"
    api_v1_prefix: str = "/api/v1"
    database_url: str = "sqlite+aiosqlite:///./portfolio.sqlite3"
    jwt_secret_key: str = Field(default="change-this-secret-before-deploying")
    jwt_algorithm: str = "HS256"
    jwt_expires_minutes: int = 60 * 24
    media_root: Path = Path("./media")
    cors_origins: str = "http://localhost:3000,http://localhost:5173"
    admin_email: str = "admin@example.com"
    admin_password: str = "change-me-now"

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()

