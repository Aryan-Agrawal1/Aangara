from typing import List, Optional, Dict, Any
from pydantic import BaseModel

class CarbonCalculationRequest(BaseModel):
    entity_id: str
    reporting_year: str = "2025-26"
    custom_output: Optional[float] = None
    custom_emissions: Optional[float] = None
    custom_target_gei: Optional[float] = None

class CalculationTraceSchema(BaseModel):
    metric: str
    formula: str
    inputs: Dict[str, Any]
    result: float
    data_status: str = "CALCULATION"
    model_version: str = "CA-MVP-1.0"

class CarbonPositionResponse(BaseModel):
    entity_id: str
    reporting_year: str
    output: float
    output_unit: str
    total_ghg_tco2e: float
    actual_gei: float
    target_gei: float
    gei_delta: float
    status: str
    potential_surplus_tco2e: float
    potential_shortfall_tco2e: float
    calculation_trace: List[CalculationTraceSchema]
    data_status: str = "CALCULATION"

class StrategyResultSchema(BaseModel):
    strategy: str  # BUY, BUILD, HYBRID
    total_cost_cr: float
    internal_abatement_tco2e: float
    residual_shortfall_tco2e: float
    procured_ccc_tco2e: float
    post_strategy_gei: float
    payback_years: Optional[float] = None
    npv_cr: Optional[float] = None
    irr_pct: Optional[float] = None
    cost_per_tco2e: float
    risk_score: float
    utility_score: float
    rank: int
    sub_scores: Dict[str, float]
    summary: str

class DecisionTwinResponse(BaseModel):
    entity_id: str
    reporting_year: str
    baseline_position: CarbonPositionResponse
    strategies: Dict[str, StrategyResultSchema]
    recommended_strategy: str
    recommendation_reason: str
    assumptions_applied: Dict[str, Any]
    provenance: Dict[str, str]
