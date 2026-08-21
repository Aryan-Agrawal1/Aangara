from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class FacilitySchema(BaseModel):
    facility_id: str
    name: str
    capacity: float
    capacity_unit: str
    operating_days: int = 330

class SourceStreamsSchema(BaseModel):
    electricity_mwh: float = 0.0
    fuel_quantity_tonnes: float = 0.0
    fuel_type: str = "petcoke"
    process_emissions_tco2e: float = 0.0

class ReportingPeriodSchema(BaseModel):
    year: str
    actual_output: float
    output_unit: str
    operating_days: int = 330
    utilisation_pct: float = 0.0
    total_ghg_tco2e: float
    actual_gei: float
    target_gei: float
    potential_shortfall_tco2e: float = 0.0
    potential_surplus_tco2e: float = 0.0
    source_streams: SourceStreamsSchema

class ProjectSchema(BaseModel):
    project_id: str
    name: str
    project_type: str
    capex_cr: float
    annual_opex_change_cr: float
    annual_energy_savings_cr: float
    expected_reduction_tco2e: float
    expected_reduction_pct: float
    implementation_months: int
    mrv_annual_cost_cr: float = 0.35
    verification_cost_cr: float = 0.20
    methodology_code: str
    methodology_title: str
    methodology_status: str = "APPROVED"

class MRVReadinessSchema(BaseModel):
    measurement_completeness: float
    activity_data_completeness: float
    factor_traceability: float
    methodology_mapping: float
    verification_readiness: float
    composite_score: float
    status: str
    notes: Optional[str] = None

class RegulatoryProfileSchema(BaseModel):
    target_id: str
    baseline_year: str
    baseline_output: float
    baseline_emissions_tco2e: float
    baseline_gei: float
    target_gei_2025_26: float
    target_gei_2026_27: float
    gei_unit: str
    status: str
    source_id: str
    source_url: str

class EntitySchema(BaseModel):
    entity_id: str
    entity_name: str
    sector: str
    sub_sector: str
    category: str
    state: str
    data_status: str = "SYNTHETIC"
    facility: FacilitySchema
    regulatory_profile: RegulatoryProfileSchema
    reporting_periods: Dict[str, ReportingPeriodSchema]
    primary_project: ProjectSchema
    mrv_readiness: MRVReadinessSchema
