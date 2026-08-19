from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class ScenarioParameters(BaseModel):
    ccc_price_inr: float = Field(default=1000.0, description="Assumed CCC market price in ?/tCO2e")
    project_output_pct: float = Field(default=100.0, description="Project output/efficiency delivery percentage (50% - 150%)")
    project_delay_months: int = Field(default=0, description="Implementation delay in months (0 - 24)")
    financing_rate_pct: float = Field(default=9.5, description="Annual cost of capital / financing rate % (5% - 20%)")

class ScenarioSimulationRequest(BaseModel):
    entity_id: str
    reporting_year: str = "2025-26"
    parameters: ScenarioParameters

class ScenarioSimulationResult(BaseModel):
    entity_id: str
    reporting_year: str
    parameters: ScenarioParameters
    strategies: Dict[str, Any]
    winner_strategy: str
    winner_summary: str
    sensitivity_insights: List[str]
    delta_vs_base: Dict[str, float]

class AIExplanationRequest(BaseModel):
    entity_id: str
    reporting_year: str = "2025-26"
    decision_twin_data: Dict[str, Any]
    scenario_params: Optional[ScenarioParameters] = None

class AIExplanationResponse(BaseModel):
    narrative: str
    executive_summary: str
    key_drivers: List[str]
    risk_advisory: str
    service_status: str  # "GEMINI_ACTIVE" | "DETERMINISTIC_FALLBACK"
    model_used: str
