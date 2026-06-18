import re

class CPTNormalizer:
    @staticmethod
    def normalize(code: str) -> str:
        return str(code).strip().upper().replace("-", "")

class ICD10Normalizer:
    @staticmethod
    def normalize(code: str) -> str:
        code = str(code).strip().upper()
        return code

class NormalizationPipeline:
    def __init__(self):
        self.cpt = CPTNormalizer()
        self.icd10 = ICD10Normalizer()

    def normalize_record(self, raw_record: dict):
        return {
            "claim_id": raw_record.get("claim_id", ""),
            "patient_id": raw_record.get("patient_id", ""),
            "service_date": str(raw_record.get("service_date", "")),
            "cpt_code": raw_record.get("cpt_code", ""),
            "cpt_code_normalized": self.cpt.normalize(raw_record.get("cpt_code", "")),
            "icd10_primary": raw_record.get("icd10_primary", ""),
            "icd10_primary_normalized": self.icd10.normalize(raw_record.get("icd10_primary", "")),
            "charge_amount": float(raw_record.get("charge_amount", 0)),
        }

    def normalize_batch(self, records: list) -> tuple:
        normalized = []
        errors = []
        
        for idx, record in enumerate(records):
            try:
                normalized.append(self.normalize_record(record))
            except Exception as e:
                errors.append(f"Row {idx + 1}: {str(e)}")
        
        return normalized, errors