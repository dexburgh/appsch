import os
import logging
from pathlib import Path
from fastapi import UploadFile

logger = logging.getLogger(__name__)

class FileHandler:
    ALLOWED_FORMATS = ["csv", "xlsx"]
    MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024

    @staticmethod
    def validate_file(file: UploadFile):
        if not file.filename:
            raise ValueError("No file provided")
        
        ext = Path(file.filename).suffix.lower().lstrip(".")
        if ext not in FileHandler.ALLOWED_FORMATS:
            raise ValueError(f"Invalid format. Use CSV or XLSX")

    @staticmethod
    async def save_file(file: UploadFile, upload_dir: str) -> str:
        Path(upload_dir).mkdir(parents=True, exist_ok=True)
        file_path = os.path.join(upload_dir, file.filename)
        
        content = await file.read()
        if len(content) > FileHandler.MAX_FILE_SIZE_BYTES:
            raise ValueError("File too large")
        
        with open(file_path, "wb") as f:
            f.write(content)
        
        return file_path

    @staticmethod
    def get_file_type(file_path: str) -> str:
        return Path(file_path).suffix.lower().lstrip(".")