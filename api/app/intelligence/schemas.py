from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field

class FacilityInputSchema(BaseModel):
    facility_name: str = Field(default="My Industrial Facility", description="Name of the manufacturing unit")
    sector: str = Field(default="cement", description="Industry sector (e.g. cement, aluminium, iron_steel)")
    sub_sector: Optional[str] = Field(default="Integrated Plant", description="Sub-sector or production route")
    state: str = Field(default="Rajasthan", description="Indian state for regional grid factor context")
    annual_production: float = Field(default=1000000.0, description="Annual production output in tonnes")
    production_unit: str = Field(default="tonnes", description="Production unit")
    
    # Energy streams
    electricity_mwh: float = Field(default=85000.0, description="Annual grid/captive electricity consumption in MWh")
    renewable_electricity_pct: float = Field(default=12.0, description="Percentage of electricity from renewable sources (0 - 100%)")
    thermal_fuel_type: str = Field(default="petcoke", description="Primary thermal fuel (coal, petcoke, gas, etc.)")
    thermal_fuel_tonnes: float = Field(default=85000.0, description="Annual thermal fuel consumption in tonnes")
    
    # Sector-specific parameters
    clinker_factor_pct: Optional[float] = Field(default=72.0, description="Cement: Clinker factor % (clinker/cement ratio)")
    smelter_dc_sec_kwh: Optional[float] = Field(default=None, description="Aluminium: Specific DC power consumption kWh/t")
    steel_route: Optional[str] = Field(default=None, description="Iron & Steel: BF_BOF, DRI_EAF, Corex")
    whrs_installed_mw: Optional[float] = Field(default=0.0, description="Waste Heat Recovery System capacity in MW")
    
    # Baseline/Target overrides (optional)
    custom_baseline_gei: Optional[float] = Field(default=None, description="Known statutory baseline GEI")
    custom_target_gei: Optional[float] = Field(default=None, description="Known statutory target GEI")

class DecarbonisationOpportunity(BaseModel):
    opportunity_id: str
    title: str
    category: str
    description: str
    capex_cr: float
    annual_opex_change_cr: float
    annual_energy_savings_cr: float
    annual_reduction_tco2e: float
    reduction_pct: float
    payback_years: float
    npv_10yr_cr: float
    irr_pct: Optional[float]
    cost_per_tco2e_inr: float
    implementation_months: int
    mrv_complexity: str  # LOW | MEDIUM | HIGH
    confidence: str      # HIGH | MEDIUM
    applicable_methodology: str

class PeerBenchmarkResult(BaseModel):
    facility_gei: float
    peer_median_gei: float
    peer_percentile: float
    peer_p25_gei: float
    peer_p75_gei: float
    peer_sample_count: int
    benchmark_model: str
    confidence: str
    interpretation: str

class AnomalyResult(BaseModel):
    status: str  # NORMAL | REVIEW | ANOMALY
    anomaly_score: float
    is_anomaly: bool
    interpretation: str
    contributing_factors: List[str]

class FullIntelligenceResponse(BaseModel):
    success: bool
    data: Dict[str, Any]
    errors: List[str] = []
    warnings: List[str] = []
    source_status: str = "current"
