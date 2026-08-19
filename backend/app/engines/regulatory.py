from typing import Dict, Any, Optional, List
import json
import os

class RegulatoryEngine:
    def __init__(self, data_dir: str = "data"):
        self.data_dir = data_dir
        self.targets_file = os.path.join(data_dir, "regulatory", "regulatory_targets.json")
        self.status_file = os.path.join(data_dir, "regulatory", "regulatory_status.json")
        self.sources_file = os.path.join(data_dir, "regulatory", "source_register.json")
        self.methods_file = os.path.join(data_dir, "regulatory", "methodologies.json")
        self._load_catalogs()

    def _load_catalogs(self):
        with open(self.targets_file, "r", encoding="utf-8") as f:
            self.targets = json.load(f).get("targets", [])
        with open(self.status_file, "r", encoding="utf-8") as f:
            self.status_data = json.load(f).get("sectors", {})
        with open(self.sources_file, "r", encoding="utf-8") as f:
            self.sources = json.load(f).get("sources", [])
        with open(self.methods_file, "r", encoding="utf-8") as f:
            self.methodologies = json.load(f).get("methodologies", [])

    def get_all_sectors(self) -> List[Dict[str, Any]]:
        result = []
        for sec_id, info in self.status_data.items():
            item = dict(info)
            item["targets"] = [t for t in self.targets if t["sector"] == sec_id]
            result.append(item)
        return result

    def get_sector_info(self, sector_id: str) -> Optional[Dict[str, Any]]:
        info = self.status_data.get(sector_id)
        if not info:
            return None
        res = dict(info)
        res["targets"] = [t for t in self.targets if t["sector"] == sector_id]
        return res

    def resolve_target(self, sector_id: str, year: str = "2025-26") -> Optional[Dict[str, Any]]:
        matching = [t for t in self.targets if t["sector"] == sector_id]
        if not matching:
            return None
        target = matching[0]
        tgt_val = target.get("target_gei_2025_26") if year == "2025-26" else target.get("target_gei_2026_27")
        return {
            "target_id": target["target_id"],
            "sector": sector_id,
            "target_year": year,
            "target_gei": tgt_val,
            "baseline_gei": target.get("baseline_gei_default"),
            "gei_unit": target.get("gei_unit"),
            "status": target.get("status"),
            "source_id": target.get("source_id"),
            "source_url": target.get("source_url")
        }

    def get_sources(self) -> List[Dict[str, Any]]:
        return self.sources

    def get_methodologies(self) -> List[Dict[str, Any]]:
        return self.methodologies
