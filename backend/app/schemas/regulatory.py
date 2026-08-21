from typing import List, Optional, Dict, Any
from pydantic import BaseModel

class RegulatoryTargetSchema(BaseModel):
    target_id: str
    sector: str
    sub_sector: str
    major_product: str
    output_unit: str
    baseline_year: str
    baseline_gei_default: float
    target_gei_2025_26: float
    target_gei_2026_27: float
    gei_unit: str
    status: str
    source_id: str
    source_url: str

class SectorInfoSchema(BaseModel):
    sector_id: str
    name: str
    status: str
    category: str
    source_id: str
    source_document: str
    effective_date: Optional[str]
    baseline_period: str
    target_period: str
    notes: str
    targets: Optional[List[RegulatoryTargetSchema]] = None

class MethodologySchema(BaseModel):
    code: str
    sector: str
    title: str
    type: str
    applicable_technologies: List[str]
    status: str

class SourceRegisterItemSchema(BaseModel):
    source_id: str
    tier: int
    authority: str
    title: str
    date: str
    version: str
    url: str
    status: str
    notes: str
