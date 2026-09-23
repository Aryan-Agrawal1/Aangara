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

// ─── RCO Profile (Renewable Consumption Obligation) ───────────────────────────
export interface RCOProfile {
  current_renewable_mwh: number;
  current_total_energy_mwh: number;
  current_renewable_share_pct: number;
  obligation_target_pct: number;
  obligation_year: number;
  solar_sub_target_pct: number;
  wind_sub_target_pct: number;
  non_solar_sub_target_pct: number;
  obligation_source: string;
  obligation_source_url: string;
  obligation_status: 'FINAL_NOTIFICATION' | 'DRAFT_TRAJECTORY' | 'WATCHLIST' | 'UNKNOWN';
  entity_type: 'OPEN_ACCESS_CONSUMER' | 'CAPTIVE_CONSUMER' | 'DISCOM_OBLIGATED';
  applicable_serc: string;
  rec_balance_mwh?: number;
}

export interface RCOPosition {
  entity_id: string;
  reporting_year: string;
  profile: RCOProfile;
  obligation_target_mwh: number;
  current_renewable_mwh: number;
  current_renewable_share_pct: number;
  gap_mwh: number;
  gap_pct_points: number;
  compliance_status: 'COMPLIANT' | 'MARGINAL' | 'DEFICIT' | 'SEVERE_DEFICIT';
  rec_shortfall_mwh: number;
  estimated_penalty_cr: number;
  penalty_rate_inr_per_kwh: number;
  mechanism_token: {
    renewable_mwh_allocated_to_rco: number;
    renewable_mwh_available_for_ccts_adjustment: number;
    double_count_flag: boolean;
  };
  data_status: string;
  calculation_trace: Array<{ step: string; formula: string; value: number; unit: string; source?: string }>;
}

// ─── Mechanism Applicability (§3.2 double-count guard) ───────────────────────
export interface MechanismApplicability {
  ccts_compliance: { eligible: boolean; basis: string; delta_gei?: number; delta_shortfall_tco2e?: number };
  rco_obligation: { eligible: boolean; basis: string; delta_share_pct?: number; gap_closed_pct?: number };
  offset_mechanism: { eligible: boolean; basis: string };
  double_count_flag: boolean;
  notes: string;
}

// ─── Compliance Value Score (§3.3 Transition Engine output) ──────────────────
export interface ComplianceValueScore {
  composite: number;
  sub_scores: {
    financial: number;
    ccts_impact: number;
    rco_impact: number;
    risk: number;
    timing: number;
  };
  weights: { financial: number; ccts_impact: number; rco_impact: number; risk: number; timing: number };
  rank?: number;
}

// ─── Transition Action (generalises "project" to cover CCTS+RCO+market) ──────
export interface TransitionAction {
  action_id: string;
  action_type: 'efficiency' | 'renewable_capex' | 'ppa' | 'ccc_purchase' | 'ccc_sale' | 'hybrid';
  name: string;
  description: string;
  mechanism_applicability: MechanismApplicability;
  ccts_effect: { delta_gei: number; compliance_gap_closed_pct: number; post_action_shortfall_tco2e: number };
  rco_effect: { delta_share_pct: number; gap_closed_pct: number; post_action_share_pct: number };
  financial_effect: { capex_cr: number; npv_cr: number | null; payback_years: number | null; irr_pct?: number | null };
  compliance_value_score: ComplianceValueScore;
  trust_pack_ref: string;
  data_status: 'SYNTHETIC' | 'REAL_FACILITY_INPUT' | 'MODEL_ESTIMATE' | 'ILLUSTRATIVE_VALUE';
}

// ─── Marketplace Item ────────────────────────────────────────────────────────
export type MarketplaceDataStatus = 'OBSERVED_MARKET_DATA' | 'USER_DEFINED_SCENARIO' | 'MODEL_ESTIMATE' | 'ILLUSTRATIVE_VALUE';
export type MarketplaceItemType = 'DECARBONISATION_PROJECT' | 'CCC_LISTING' | 'RENEWABLE_PPA';

export interface MarketplaceItem {
  item_id: string;
  item_type: MarketplaceItemType;
  title: string;
  sector: string;
  sub_sector?: string;
  action_type: string;
  expected_reduction_tco2e_yr?: number;
  renewable_capacity_mw?: number;
  ppa_term_years?: number;
  capex_band_low_cr?: number;
  capex_band_high_cr?: number;
  tariff_inr_per_mwh?: number;
  mrv_readiness_score?: number;
  mechanism_tags: { ccts: boolean; rco: boolean; offset: boolean };
  compliance_value_score?: number;
  state: string;
  developer?: string;
  status: 'AVAILABLE' | 'UNDER_NEGOTIATION' | 'INDICATIVE';
  data_status: MarketplaceDataStatus;
  illustrative_price_inr?: number;
  price_unit?: string;
  trust_pack_ref: string;
  description: string;
  technology_trl?: number;
}

// ─── Terminal Panel Types ─────────────────────────────────────────────────────
export interface WatchlistEntry {
  entity_id: string;
  entity_name: string;
  sector: string;
  actual_gei: number;
  target_gei: number;
  gei_delta: number;
  compliance_status: 'SURPLUS' | 'COMPLIANT' | 'SHORTFALL' | 'SEVERE_SHORTFALL';
  rco_share_pct: number;
  rco_target_pct: number;
  compliance_value_score: number;
  shortfall_tco2e: number;
  data_status: string;
}

export interface CCCScenarioPoint {
  year: string;
  scenario_label: string;
  price_bear_inr: number;
  price_base_inr: number;
  price_bull_inr: number;
  data_status: 'MODEL_ESTIMATE';
}

export interface OrderBlotterEntry {
  entry_id: string;
  entity_id: string;
  entity_name: string;
  direction: 'BUY' | 'SELL';
  quantity_tco2e: number;
  scenario_price_inr: number;
  scenario_value_cr: number;
  strategy: string;
  status: 'SCENARIO_INTENT';
  timestamp: string;
  data_status: 'USER_DEFINED_SCENARIO';
}
