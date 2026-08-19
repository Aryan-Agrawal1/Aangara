from fastapi import APIRouter, HTTPException, Query
from typing import Dict, Any, Optional
from app.intelligence.schemas import FacilityInputSchema
from app.intelligence.service import intelligence_service
from app.intelligence.data_quality import DataQualityEngine

router = APIRouter(prefix="/intelligence", tags=["Industrial Intelligence & Personalization"])

@router.post("/analyze", response_model=Dict[str, Any])
def analyze_facility(payload: FacilityInputSchema):
    data = payload.model_dump()
    res = intelligence_service.analyze_facility(data)
    return {
        "success": True,
        "data": res,
        "errors": res.get("data_quality", {}).get("errors", []),
        "warnings": res.get("data_quality", {}).get("warnings", []),
        "source_status": "current"
    }

@router.get("/defaults/{sector}", response_model=Dict[str, Any])
def get_sector_defaults(sector: str):
    defaults = intelligence_service.get_sector_defaults(sector)
    return {
        "success": True,
        "data": defaults,
        "errors": [],
        "warnings": [],
        "source_status": "current"
    }

@router.post("/data-quality", response_model=Dict[str, Any])
def check_data_quality(payload: FacilityInputSchema):
    data = payload.model_dump()
    dq = DataQualityEngine.audit_facility_input(data)
    return {
        "success": True,
        "data": dq,
        "errors": dq.get("errors", []),
        "warnings": dq.get("warnings", []),
        "source_status": "current"
    }

@router.get("/models", response_model=Dict[str, Any])
def get_model_registry():
    registry_path = "data/model_registry/registry.json"
    if os.path.exists(registry_path):
        import json
        with open(registry_path, "r", encoding="utf-8") as f:
            reg = json.load(f)
    else:
        reg = {"models": []}
    return {
        "success": True,
        "data": reg,
        "errors": [],
        "warnings": [],
        "source_status": "current"
    }
