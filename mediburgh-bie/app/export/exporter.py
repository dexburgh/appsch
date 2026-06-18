import json
import csv
from pathlib import Path

class Exporter:
    @staticmethod
    def to_json(data, output_path: str) -> str:
        Path(output_path).parent.mkdir(parents=True, exist_ok=True)
        with open(output_path, 'w') as f:
            json.dump(data, f, indent=2)
        return output_path

    @staticmethod
    def to_csv(data, output_path: str) -> str:
        Path(output_path).parent.mkdir(parents=True, exist_ok=True)
        if not data:
            return output_path
        
        with open(output_path, 'w', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=data[0].keys())
            writer.writeheader()
            writer.writerows(data)
        
        return output_path