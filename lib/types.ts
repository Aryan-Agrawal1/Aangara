export interface Facility {
  facility_id: string;
  name: string;
  capacity: number;
  capacity_unit: string;
  operating_days: number;
}

export interface SourceStreams {
  electricity_mwh: number;
  fuel_quantity_tonnes: number;
  fuel_type: string;
  process_emissions_tco2e: number;
}

export interface ReportingPeriod {
  year: string;
  actual_output: number;
  output_unit: string;
  operating_days: number;
  utilisation_pct: number;
  total_ghg_tco2e: number;
  actual_gei: number;
  target_gei: number;
  potential_shortfall_tco2e: number;
  potential_surplus_tco2e: number;
  source_streams: SourceStreams;
}

export interface Project {
  project_id: string;
  name: string;
  project_type: string;
  capex_cr: number;
  annual_opex_change_cr: number;
  annual_energy_savings_cr: number;
  expected_reduction_tco2e: number;
  expected_reduction_pct: number;
  implementation_months: number;
  mrv_annual_cost_cr: number;
  verification_cost_cr: number;
  methodology_code: string;
  methodology_title: string;
  methodology_status: string;
}

export interface MRVReadiness {
  measurement_completeness: number;
  activity_data_completeness: number;
  factor_traceability: number;
  methodology_mapping: number;
  verification_readiness: number;
  composite_score: number;
  status: string;
  notes?: string;
  metering_coverage_pct?: number;
  calibration_status?: string;
}

export interface RegulatoryProfile {
  target_id: string;
  baseline_year: string;
  baseline_output: number;
  baseline_emissions_tco2e: number;
  baseline_gei: number;
  target_gei_2025_26: number;
  target_gei_2026_27: number;
  gei_unit: string;
  status: string;
  source_id: string;
  source_url: string;
}

export interface Entity {
  entity_id: string;
  entity_name: string;
  sector: string;
  sub_sector: string;
  category: string;
  state: string;
  data_status: string;
  facility: Facility;
  regulatory_profile: RegulatoryProfile;
  reporting_periods: Record<string, ReportingPeriod>;
  primary_project: Project;
  mrv_readiness: MRVReadiness;
}

export interface CalculationTrace {
  metric: string;
  formula: string;
  inputs: Record<string, any>;
  result: number;
  data_status: string;
  model_version: string;
}

export interface CarbonPosition {
  entity_id: string;
  reporting_year: string;
  output: number;
  output_unit: string;
  total_ghg_tco2e: number;
  actual_gei: number;
  target_gei: number;
  gei_delta: number;
  status: string;
  potential_surplus_tco2e: number;
  potential_shortfall_tco2e: number;
  calculation_trace: CalculationTrace[];
  data_status: string;
  // Compatibility fields
  production_volume?: number;
  production_unit?: string;
  ccc_liability?: number;
  shortfall_tco2e?: number;
  scope1_fuel_tco2e?: number;
  scope1_process_tco2e?: number;
  scope2_electricity_tco2e?: number;
}

export interface StrategyResult {
  strategy: string;
  name?: string;
  strategy_id?: string;
  total_cost_cr: number;
  total_cost_3yr_cr?: number;
  annual_cost_cr?: number;
  capex_cr?: number;
  internal_abatement_tco2e: number;
  residual_shortfall_tco2e?: number;
  ccc_procured_tco2e: number;
  post_strategy_gei: number;
  post_intervention_gei?: number;
  payback_years?: number | null;
  npv_cr: number | null;
  irr_pct?: number | null;
  cost_per_tco2e?: number;
  risk_score: number;
  utility_score: number;
  rank?: number;
  sub_scores?: {
    financial: number;
    climate: number;
    compliance: number;
    mrv: number;
    timing: number;
  };
  summary?: string;
  is_recommended?: boolean;
  risk_breakdown?: {
    execution_risk: number;
    technology_risk: number;
    regulatory_risk: number;
    market_risk: number;
    composite_risk: number;
    expected_loss_cr: number;
  };
}

export interface AnomalyIntelligence {
  status: string;
  anomaly_detected: boolean;
  anomaly_score: number;
  reason_codes: string[];
  disclaimer: string;
}

export interface DecisionTwinData {
  entity_id: string;
  entity_name: string;
  sector: string;
  reporting_year: string;
  baseline_position: CarbonPosition;
  project_profile: Project;
  mrv_readiness: MRVReadiness;
  strategies: Record<string, StrategyResult>;
  recommended_strategy: string;
  recommendation_reason: string;
  assumptions_applied: {
    ccc_price_inr: number;
    project_output_delivery_pct: number;
    project_delay_months: number;
    financing_rate_pct: number;
  };
  anomaly_intelligence: AnomalyIntelligence;
  provenance: {
    model_version: string;
    regulatory_version: string;
    factor_version: string;
  };
}

export interface ScenarioParams {
  ccc_price_inr: number;
  project_output_pct: number;
  project_delay_months: number;
  financing_rate_pct: number;
}

export interface ScenarioSimulationResult {
  entity_id: string;
  reporting_year: string;
  parameters: ScenarioParams;
  strategies: Record<string, StrategyResult>;
  winner_strategy: string;
  winner_summary: string;
  // Aliases for backward compatibility
  recommended_strategy?: string;
  recommendation_reason?: string;
  sensitivity_insights: string[];
  delta_vs_base: {
    buy_cost_delta_cr: number;
    build_cost_delta_cr: number;
    hybrid_cost_delta_cr: number;
    recommendation_changed?: boolean;
    baseline_winner?: string;
    simulated_winner?: string;
  };
  delta_vs_baseline?: {
    buy_cost_delta_cr: number;
    build_cost_delta_cr: number;
    hybrid_cost_delta_cr: number;
    recommendation_changed?: boolean;
    baseline_winner?: string;
    simulated_winner?: string;
  };
}

export interface RegulatorySourceItem {
  source_id: string;
  tier: number;
  authority: string;
  title: string;
  date: string;
  version: string;
  url: string;
  status: string;
  notes: string;
}

export interface MethodologyItem {
  code: string;
  sector: string;
  title: string;
  type: string;
  applicable_technologies: string[];
  status: string;
}

export interface PeerBenchmarkResult {
  facility_gei: number;
  peer_median_gei: number;
  peer_percentile: number;
  peer_p25_gei: number;
  peer_p75_gei: number;
  peer_sample_count: number;
  benchmark_model: string;
  confidence: string;
  interpretation: string;
}
