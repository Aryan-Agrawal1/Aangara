from fastapi import APIRouter
from typing import Dict, Any
from app.engines.regulatory import RegulatoryEngine

router = APIRouter(prefix="", tags=["Regulatory Sources & Methodologies"])
regulatory_engine = RegulatoryEngine()

@router.get("/sources", response_model=Dict[str, Any])
def list_sources():
    sources = regulatory_engine.get_sources()
    return {
        "success": True,
        "data": {
            "total_sources": len(sources),
            "sources": sources
        },
        "errors": [],
        "warnings": [],
        "source_status": "current"
    }

@router.get("/methodologies", response_model=Dict[str, Any])
def list_methodologies():
    methods = regulatory_engine.get_methodologies()
    return {
        "success": True,
        "data": {
            "total_methodologies": len(methods),
            "methodologies": methods
        },
        "errors": [],
        "warnings": [],
        "source_status": "current"
    }

@router.get("/regulatory/targets", response_model=Dict[str, Any])
def list_targets():
    targets = regulatory_engine.targets
    return {
        "success": True,
        "data": {
            "total_targets": len(targets),
            "targets": targets
        },
        "errors": [],
        "warnings": [],
        "source_status": "current"
    }
