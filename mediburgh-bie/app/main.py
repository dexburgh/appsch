import logging
import time
from datetime import datetime
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.ingestion.file_handler import FileHandler
from app.parsing.parser_factory import ParserFactory
from app.normalization.normalizers import NormalizationPipeline
from app.validation.validators import ValidationManager
from app.schemas import BillingClaimResponse, HealthCheckResponse, ValidationStatus

logging.basicConfig(level=settings.LOG_LEVEL)
logger = logging.getLogger(__name__)

app = FastAPI(title="MediBurgh BIE", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

pipeline = NormalizationPipeline()
validator = ValidationManager()

@app.get("/")
async def root():
    return {"name": "MediBurgh BIE", "status": "operational"}

@app.get("/health")
async def health_check():
    return HealthCheckResponse(
        status="healthy",
        version="1.0.0",
        timestamp=datetime.utcnow().isoformat()
    )

@app.post("/api/v1/billing/upload")
async def upload_billing_file(file: UploadFile = File(...)):
    start = time.time()
    
    try:
        FileHandler.validate_file(file)
        file_path = await FileHandler.save_file(file, settings.UPLOAD_DIR)
        file_type = FileHandler.get_file_type(file_path)
        
        raw_data = ParserFactory.parse(file_path, file_type)
        if not raw_data:
            raise ValueError("No data found")
        
        normalized, errors = pipeline.normalize_batch(raw_data)
        
        total = sum(item.get("charge_amount", 0) for item in normalized)
        
        return BillingClaimResponse(
            file_name=file.filename,
            file_type=file_type,
            rows_processed=len(raw_data),
            normalized_data=normalized,
            total_charges=total,
            processing_time_seconds=round(time.time() - start, 3),
            errors=errors
        )
    
    except Exception as e:
        logger.error(f"Error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))