from enum import Enum
from typing import Optional, List
from pydantic import BaseModel, Field

class ValidationStatus(str, Enum):
    PENDING = "pending"
    VALID = "valid"
    WARNING = "warning"
    ERROR = "error"

class BillingLineItem(BaseModel):
    claim_id: str
    patient_id: str
    service_date: str
    cpt_code: str
    cpt_code_normalized: Optional[str] = None
    icd10_primary: str
    icd10_primary_normalized: Optional[str] = None
    charge_amount: float
    validation_status: ValidationStatus = ValidationStatus.PENDING

class BillingClaimResponse(BaseModel):
    file_name: str
    file_type: str
    rows_processed: int
    normalized_data: List[BillingLineItem] = []
    total_charges: float = 0.0
    processing_time_seconds: float
    errors: List[str] = []