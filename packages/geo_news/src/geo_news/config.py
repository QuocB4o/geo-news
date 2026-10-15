from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_env: str = "local"
    app_version: str = "0.1.0"
    database_url: str = "postgresql+psycopg://geonews:change-me@localhost:5432/geonews"
    app_secret_key: str = "change-me"
    cors_origins: str = "http://localhost:5173"
    geocoder_base_url: str = "https://nominatim.openstreetmap.org"
    geocoder_user_agent: str = ""
    model_cache_dir: str = "./models"


@lru_cache
def get_settings() -> Settings:
    return Settings()
