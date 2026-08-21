import json
import os
from typing import List, Dict, Any, Optional
from app.config import settings

class DataService:
    def __init__(self, data_dir: Optional[str] = None):
        self.data_dir = data_dir or settings.DATA_DIR
        self.entities_path = os.path.join(self.data_dir, "synthetic", "master_entities.json")
        self._load_entities()

    def _load_entities(self):
        if os.path.exists(self.entities_path):
            with open(self.entities_path, "r", encoding="utf-8") as f:
                self.entities = json.load(f).get("entities", [])
        else:
            self.entities = []

    def get_all_entities(self, sector: Optional[str] = None) -> List[Dict[str, Any]]:
        if sector:
            return [e for e in self.entities if e.get("sector") == sector]
        return self.entities

    def get_entity_by_id(self, entity_id: str) -> Optional[Dict[str, Any]]:
        for e in self.entities:
            if e.get("entity_id") == entity_id:
                return e
        return None

data_service = DataService()
