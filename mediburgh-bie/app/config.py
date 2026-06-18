import os
from pathlib import Path
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    HOST: str = os.getenv("HOST", "127.0.0.1")
    PORT: int = int(os.getenv("PORT", 8000))
    MAX_FILE_SIZE_MB: int = int(os.getenv("MAX_FILE_SIZE_MB", 50))
    UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", "./uploads")
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")

settings = Settings()
Path(settings.UPLOAD_DIR).mkdir(parents=True, exist_ok=True)