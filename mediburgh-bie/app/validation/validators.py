from app.schemas import ValidationStatus

class ValidationManager:
    def validate_item(self, item):
        item["validation_status"] = ValidationStatus.PENDING
        return item