from fastapi import APIRouter, HTTPException, Query
from typing import List, Dict, Any, Optional
from app.services.data_service import data_service

router = APIRouter(prefix="/entities", tags=["Synthetic Industrial Entities"])

@router.get("", response_model=Dict[str, Any])
def list_entities(sector: Optional[str] = Query(None, description="Filter by sector")):
    entities = data_service.get_all_entities(sector=sector)
    return {
        "success": True,
        "data": {
            "total_entities": len(entities),
            "entities": entities
        },
        "errors": [],
        "warnings": [],
        "source_status": "current"
    }

@router.get("/{entity_id}", response_model=Dict[str, Any])
def get_entity(entity_id: str):
    e = data_service.get_entity_by_id(entity_id)
    if not e:
        raise HTTPException(status_code=404, detail=f"Entity '{entity_id}' not found.")
    return {
        "success": True,
        "data": e,
        "errors": [],
        "warnings": [],
        "source_status": "current"
    }
