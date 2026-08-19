from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from app.engines.regulatory import RegulatoryEngine

router = APIRouter(prefix="/sectors", tags=["Sectors & Regulatory Status"])
regulatory_engine = RegulatoryEngine()

@router.get("", response_model=Dict[str, Any])
def list_sectors():
    sectors = regulatory_engine.get_all_sectors()
    return {
        "success": True,
        "data": {
            "total_sectors": len(sectors),
            "sectors": sectors
        },
        "errors": [],
        "warnings": [],
        "source_status": "current"
    }

@router.get("/{sector_id}", response_model=Dict[str, Any])
def get_sector(sector_id: str):
    sec = regulatory_engine.get_sector_info(sector_id)
    if not sec:
        raise HTTPException(status_code=404, detail=f"Sector '{sector_id}' not found in registry.")
    return {
        "success": True,
        "data": sec,
        "errors": [],
        "warnings": [],
        "source_status": "current"
    }
