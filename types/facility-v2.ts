/**
 * AANGARA Facility Dashboard — Canonical Input Schema v2.2
 * ─────────────────────────────────────────────────────────
 * Spec: AANGARA_Facility_Dashboard_Input_Segregation_v2.2_Carbon_vs_Business.md
 * Verification date: 4 September 2026
 *
 * Two analytically distinct input domains:
 *   1. CARBON / REGULATORY / MRV — feeds Carbon, Regulatory, MRV/DQ, Benchmark, Anomaly engines
 *   2. BUSINESS TWIN / OPERATIONS — feeds Finance, Scenario, Opportunity, Capital Optimizer engines
 *
 * Shared inputs have ONE canonical value — never duplicated.
 * Input class tags per spec §1.1:
 *   REAL_FACILITY_INPUT | SCENARIO | ESTIMATE | FACT |
 *   CALCULATION | CURATED_BENCHMARK | REAL_CORPORATE_DISCLOSURE |
 *   SYNTHETIC | DRAFT_REGULATION | WATCHLIST | INFERRED
 */

// ─────────────────────────────────────────────
// ELECTRICITY SOURCE TYPES (spec §8.1)
// ─────────────────────────────────────────────
export const ELECTRICITY_SOURCE_TYPES = [
  'GRID_DISCOM',
  'CAPTIVE_COAL',
  'CAPTIVE_GAS',
  'CAPTIVE_SOLAR',
  'CAPTIVE_WIND',
  'CAPTIVE_HYDRO',
  'CAPTIVE_BIOMASS',
  'ROOFTOP_SOLAR',
  'GROUP_CAPTIVE_SOLAR',
  'GROUP_CAPTIVE_WIND',
  'OPEN_ACCESS_SOLAR',
  'OPEN_ACCESS_WIND',
  'OPEN_ACCESS_HYBRID',
  'LONG_TERM_PPA',
  'MEDIUM_TERM_PPA',
  'SHORT_TERM_PPA',
  'GREEN_TARIFF',
  'POWER_EXCHANGE',
  'BATTERY_DISCHARGE',
  'WHRS_GENERATION',
  'TRT_GENERATION',
  'OTHER',
] as const;

export type ElectricitySourceType = typeof ELECTRICITY_SOURCE_TYPES[number];

// ─────────────────────────────────────────────
// FUEL TYPES (spec §9.1)
// ─────────────────────────────────────────────
export const FUEL_TYPES = [
  'INDIAN_DOMESTIC_COAL',
  'IMPORTED_COAL',
  'WASHED_COAL',
  'COAL_BLEND',
  'PETCOKE',
  'FURNACE_OIL',
  'LDO',
  'DIESEL',
  'NAPHTHA',
  'NATURAL_GAS',
  'LNG',
  'RLNG',
  'LPG',
  'REFINERY_FUEL_GAS',
  'COKE_OVEN_GAS',
  'BLAST_FURNACE_GAS',
  'LD_GAS',
  'PRODUCER_GAS',
  'SYNGAS',
  'BIOMASS',
  'BAGASSE',
  'BIOGAS',
  'BIOMETHANE',
  'RDF',
  'SRF',
  'AFR',
  'WASTE_OIL',
  'HYDROGEN',
  'AMMONIA',
  'OTHER',
] as const;

export type FuelType = typeof FUEL_TYPES[number];

// ─────────────────────────────────────────────
// DATA CLASS TAGS (spec §1.1)
// ─────────────────────────────────────────────
export type DataClass =
  | 'REAL_FACILITY_INPUT'
  | 'REAL_CORPORATE_DISCLOSURE'
  | 'FACT'
  | 'CALCULATION'
  | 'MODEL_PREDICTION'
  | 'CURATED_BENCHMARK'
  | 'SCENARIO'
  | 'ESTIMATE'
  | 'SYNTHETIC'
  | 'DRAFT_REGULATION'
  | 'WATCHLIST'
  | 'INFERRED';

// ─────────────────────────────────────────────
// INPUT SOURCE TYPES (spec §31)
// ─────────────────────────────────────────────
export type InputSourceType =
  | 'ERP_MES'
  | 'SCADA_HISTORIAN'
  | 'SMART_METER'
  | 'UTILITY_BILL'
  | 'FUEL_INVOICE'
  | 'WEIGHBRIDGE'
  | 'PAT_RECORD'
  | 'BRSR'
  | 'ANNUAL_REPORT'
  | 'ENERGY_AUDIT'
  | 'DPR'
  | 'VENDOR_QUOTE'
  | 'ENGINEERING_ESTIMATE'
  | 'MANUAL_MEASUREMENT'
  | 'ANALYST_ESTIMATE'
  | 'SCENARIO_ASSUMPTION'
  | 'SYNTHETIC_DEMO';

// ─────────────────────────────────────────────
// MANAGEMENT OBJECTIVE (spec §25)
// ─────────────────────────────────────────────
export type ManagementObjective =
  | 'LOWEST_CASH_COST'
  | 'MAXIMUM_NPV'
  | 'MAXIMUM_IRR'
  | 'FASTEST_COMPLIANCE'
  | 'MAXIMUM_CO2_REDUCTION'
  | 'MINIMUM_CAPEX'
  | 'MAXIMUM_EBITDA'
  | 'MINIMUM_EXECUTION_RISK'
  | 'BALANCED'
  | 'CUSTOM';

// ─────────────────────────────────────────────
// CAPITAL STRATEGY (spec §24)
// ─────────────────────────────────────────────
export type CapitalStrategy = 'BUY' | 'BUILD' | 'HYBRID' | 'DEFER';

// ─────────────────────────────────────────────
// REGULATORY STATUS
// ─────────────────────────────────────────────
export type RegulatoryStatus =
  | 'FINAL'        // Phase 1 notified — G.S.R. 25(E)
  | 'DRAFT'        // Draft notification — G.S.R. 517(E)
  | 'WATCHLIST'    // Under consultation, not yet notified
  | 'EXCLUDED';    // Explicitly excluded from current scope

// ─────────────────────────────────────────────
// ─────────────────────────────────────────────
//  SHARED INPUTS (one canonical value, both domains)
// ─────────────────────────────────────────────
// ─────────────────────────────────────────────

export interface FacilityIdentityV2 {
  // Class: IDENTITY
  legal_entity_name: string;
  facility_name: string;
  facility_id?: string;
  parent_company?: string;
  CIN?: string;
  CCTS_entity_id?: string;
  PAT_designated_consumer_id?: string;
  plant_address?: string;
  district?: string;
  state: string;
  latitude?: number;
  longitude?: number;
  SEZ_status?: boolean;
  ownership_type?: 'PUBLIC' | 'PRIVATE' | 'JOINT_VENTURE' | 'COOPERATIVE';
  facility_operating_status?: 'OPERATING' | 'SHUTDOWN' | 'PARTIAL';
}

export interface RegulatoryIdentityV2 {
  // Class: IDENTITY / FACT
  sector: string;
  sub_sector: string;
  process_route: string;
  regulatory_status: RegulatoryStatus;
  CCTS_applicability_status?: string;
  applicable_notification_id?: string;
  methodology_id?: string;
  reporting_boundary?: string;
}

export interface ReportingPeriodV2 {
  // Class: FACT
  financial_year: string;           // e.g. '2025-26'
  reporting_period_start?: string;  // ISO date
  reporting_period_end?: string;    // ISO date
  baseline_year?: string;
  compliance_year?: string;
}

export interface ProductionInputsV2 {
  // Class: REAL_FACILITY_INPUT
  reporting_year_production: number;    // net saleable output
  production_unit: string;             // 'tonnes' | 'kl' | 'MBN' etc.
  installed_capacity?: number;
  practical_capacity?: number;
  capacity_utilisation_pct?: number;
  operating_days?: number;
  operating_hours?: number;
  planned_shutdown_days?: number;
  unplanned_shutdown_days?: number;
  product_mix?: ProductMixEntry[];
  data_source?: InputSourceType;
  data_class: DataClass;
}

export interface ProductMixEntry {
  product_name: string;
  quantity: number;
  unit: string;
  share_pct?: number;
}

// ─────────────────────────────────────────────
// ─────────────────────────────────────────────
//  CARBON / REGULATORY / MRV DOMAIN
// ─────────────────────────────────────────────
// ─────────────────────────────────────────────

/** Single row in the electricity source ledger (spec §6.3, §8) */
export interface ElectricitySourceEntry {
  source_id: string;               // unique row ID (UUID or sequential)
  source_type: ElectricitySourceType;
  annual_mwh: number;
  monthly_mwh?: number[];          // 12-element array, optional
  renewable_status: boolean;       // true = zero-emission for Scope 2
  renewable_attribute_type?: 'REC' | 'GREEN_TARIFF' | 'PPA' | 'CAPTIVE' | 'NONE';
  supplier?: string;
  meter_id?: string;
  metering_method?: InputSourceType;
  factor_override?: number;        // tCO2e/MWh, null = use CEA grid EF
  contract_start?: string;
  contract_end?: string;
  evidence_id?: string;
  data_class: DataClass;
}

/** Single row in the fuel stream ledger (spec §6.4, §9) */
export interface FuelStreamEntry {
  fuel_id: string;                 // unique row ID
  fuel_type: FuelType;
  quantity: number;
  quantity_unit: 'TONNES' | 'KG' | 'NM3' | 'KL' | 'GJ';
  monthly_quantity?: number[];     // 12-element array, optional
  NCV?: number;                    // MJ/kg, used if no EF override
  GCV?: number;                    // MJ/kg
  moisture_pct?: number;
  ash_pct?: number;
  sulphur_pct?: number;
  carbon_content_pct?: number;
  fuel_blend_pct?: number;
  fuel_source?: string;            // origin: domestic, imported etc.
  measurement_method?: InputSourceType;
  weighbridge_id?: string;
  emission_factor_override?: number; // tCO2e/tonne, null = use IPCC/BEE default
  emission_factor_source?: string;
  data_class: DataClass;
}

export interface CarbonInputsV2 {
  // === Electricity Sources (replaces single electricity_mwh) ===
  electricity_sources: ElectricitySourceEntry[];

  // === Fuel Streams (replaces single thermal_fuel_type + qty) ===
  fuel_streams: FuelStreamEntry[];

  // === Process Emissions (sector-specific, fed by SectorProcessInputs) ===
  // These are set by the sector-specific process engineering step
  process_emissions_tco2e?: number;   // computed from sector process data
  process_emission_sources?: string[]; // e.g. ['calcination', 'anode_oxidation']

  // === Carbon Boundary ===
  organizational_boundary?: string;
  operational_boundary?: string;
  reporting_boundary_notes?: string;

  // === GHG Categories ===
  CO2_scope1?: number;
  CH4_scope1?: number;
  N2O_scope1?: number;
  PFC_tco2e?: number;             // aluminium only

  // === Custom Target Override ===
  custom_target_gei?: number;    // tCO2e/production_unit — manual override
  custom_target_source?: string; // notification number if override used
}

export interface MRVInputsV2 {
  // Class: REAL_FACILITY_INPUT / FACT
  meter_id?: string;
  meter_type?: string;
  meter_owner?: string;
  meter_calibration_date?: string;
  measurement_frequency?: 'CONTINUOUS' | 'DAILY' | 'MONTHLY' | 'ANNUAL';
  measurement_method?: InputSourceType;
  manual_entry_pct?: number;
  estimated_data_pct?: number;
  primary_data_pct?: number;
  data_completeness_pct?: number;
  QA_QC_process?: string;
  verification_status?: 'UNVERIFIED' | 'SELF_VERIFIED' | 'THIRD_PARTY_VERIFIED' | 'ACVA_VERIFIED';
  ACVA_status?: string;
  monitoring_plan_status?: 'NONE' | 'DRAFT' | 'APPROVED' | 'ACTIVE';
  historical_evidence_available?: boolean;
}

// ─────────────────────────────────────────────
// ─────────────────────────────────────────────
//  BUSINESS TWIN / OPERATIONS DOMAIN
// ─────────────────────────────────────────────
// ─────────────────────────────────────────────

export interface ElectricityTariffEntry {
  source_type: ElectricitySourceType;
  supplier?: string;
  DISCOM?: string;
  consumer_category?: string;
  voltage_level?: string;
  contract_demand_kva?: number;
  energy_charge_per_kwh?: number;    // INR/kWh
  demand_charge_per_kva?: number;    // INR/kVA/month
  fixed_charge?: number;             // INR/month
  TOD_peak_rate?: number;
  TOD_offpeak_rate?: number;
  FPPCA_per_kwh?: number;
  transmission_charge_per_kwh?: number;
  wheeling_charge_per_kwh?: number;
  CSS_per_kwh?: number;              // Cross-Subsidy Surcharge
  additional_surcharge_per_kwh?: number;
  banking_charge_per_kwh?: number;
  SLDC_charge?: number;
  electricity_duty_pct?: number;
  PPA_price_per_kwh?: number;        // for PPA/OA sources
  captive_generation_cost?: number;  // INR/kWh, for captive
  tariff_order_reference?: string;
  financial_year?: string;
}

export interface FuelEconomicsEntry {
  fuel_id: string;                   // links to FuelStreamEntry.fuel_id
  supplier?: string;
  contract_price_per_tonne?: number;  // INR/tonne
  spot_price_per_tonne?: number;
  transport_mode?: 'ROAD' | 'RAIL' | 'SEA' | 'PIPELINE' | 'MIXED';
  road_distance_km?: number;
  rail_distance_km?: number;
  sea_distance_km?: number;
  freight_cost_per_tonne?: number;
  port_charge_per_tonne?: number;
  handling_cost_per_tonne?: number;
  storage_cost_per_tonne?: number;
  insurance_per_tonne?: number;
  loss_pct?: number;
  landed_cost_per_tonne?: number;   // derived: contract + freight + port + handling - loss
  inventory_days?: number;
  working_capital_days?: number;
  payment_terms?: string;
}

export interface UtilityEconomics {
  steam_cost_per_tonne?: number;
  water_cost_per_m3?: number;
  cooling_cost_per_unit?: number;
  compressed_air_cost_per_nm3?: number;
  oxygen_cost_per_nm3?: number;
  nitrogen_cost_per_nm3?: number;
  hydrogen_cost_per_kg?: number;
  ETP_cost_per_kl?: number;
  ZLD_cost_per_kl?: number;
  waste_disposal_cost?: number;
}

export interface ProductionEconomics {
  selling_price_by_product?: Record<string, number>;  // product -> INR/tonne
  annual_revenue_cr?: number;
  capacity_utilisation_pct?: number;
  product_grade_mix?: string;
  export_share_pct?: number;
}

export interface BusinessTwinInputsV2 {
  electricity_tariffs: ElectricityTariffEntry[];
  fuel_economics: FuelEconomicsEntry[];
  utility_economics?: UtilityEconomics;
  production_economics?: ProductionEconomics;
  // Operating costs
  labour_cost_cr?: number;
  maintenance_cost_cr?: number;
  admin_cost_cr?: number;
  compliance_cost_cr?: number;
  // Business constraints
  available_capex_budget_cr?: number;
  maximum_acceptable_payback_years?: number;
  minimum_required_IRR_pct?: number;
  risk_tolerance?: 'LOW' | 'MEDIUM' | 'HIGH';
  project_deadline?: string;
  management_objective?: ManagementObjective;
  custom_weights?: Record<string, number>;  // for CUSTOM objective
}

// ─────────────────────────────────────────────
// SECTOR-SPECIFIC PROCESS INPUTS (spec §12)
// ─────────────────────────────────────────────

export interface CementProcessInputs {
  // CARBON side
  plant_type?: 'INTEGRATED' | 'GRINDING_ONLY' | 'CLINKER_ONLY';
  clinker_production?: number;          // tonnes/year
  cement_production?: number;           // tonnes/year
  OPC_quantity?: number;
  PPC_quantity?: number;
  PSC_quantity?: number;
  composite_quantity?: number;
  clinker_factor_pct: number;           // % clinker in cement
  limestone_quantity?: number;
  calcination_data?: number;            // process CO2 source
  TSR_pct?: number;                     // Thermal Substitution Rate from AFR
  AFR_quantity?: number;
  biomass_quantity?: number;
  thermal_energy_GJ?: number;
  specific_thermal_energy?: number;     // GJ/tonne clinker
  // Recovery systems
  WHRS_capacity_MW?: number;
  WHRS_generation_MWh?: number;
  WHRS_availability_pct?: number;
  preheater_configuration?: string;     // 4-stage, 5-stage, 6-stage
  precalciner_status?: boolean;
  kiln_configuration?: string;          // dry, semi-dry, wet
  specific_electricity_kWh_per_t?: number;
  // BUSINESS side
  annual_capacity?: number;
  kiln_shutdown_window?: number;        // days/year
  WHRS_space_available?: boolean;
  clinker_substitution_capacity_pct?: number;
  coal_landed_cost?: number;
  petcoke_landed_cost?: number;
  AFR_handling_cost?: number;
  coal_origin?: string;
  cement_realisation_per_t?: number;    // INR/tonne
}

export interface IronSteelProcessInputs {
  // CARBON side — regulatory status: DRAFT
  steel_route: 'BF_BOF' | 'DRI_EAF' | 'DRI_IF' | 'EAF' | 'OTHER';
  crude_steel_production?: number;
  hot_metal_production?: number;
  DRI_production?: number;
  pig_iron_production?: number;
  product_mix?: ProductMixEntry[];
  coke_quantity?: number;
  PCI_coal_quantity?: number;
  natural_gas_quantity?: number;
  hydrogen_quantity?: number;
  coke_rate?: number;                   // kg coke/tonne hot metal
  coal_rate?: number;
  gas_rate?: number;
  specific_power_kWh_per_t?: number;
  scrap_rate_pct?: number;
  DRI_rate?: number;
  // Recovery systems
  TRT_capacity_MW?: number;
  TRT_generation_MWh?: number;
  CDQ_capacity_MW?: number;
  CDQ_generation_MWh?: number;
  WHRS_capacity_MW?: number;
  // BUSINESS side
  blast_furnace_campaign_life_years?: number;
  TRT_space_available?: boolean;
  CDQ_feasibility?: boolean;
  coke_landed_cost?: number;
  coal_landed_cost?: number;
  iron_ore_cost?: number;
  scrap_cost?: number;
  hydrogen_cost_per_kg?: number;
  steel_realisation_per_t?: number;
}

export interface AluminiumProcessInputs {
  // CARBON side
  primary_aluminium_production?: number;
  alumina_production?: number;
  smelter_technology?: string;          // e.g. 'Prebake VSS', 'Prebake HSS'
  potline_age_years?: number;
  DC_SEC_kWh_per_t_Al: number;         // Direct Current Specific Energy Consumption
  current_efficiency_pct?: number;
  cell_voltage?: number;
  anode_consumption_kg_per_t?: number;
  anode_type?: 'PREBAKED' | 'SODERBERG';
  petroleum_coke_quantity?: number;
  pitch_quantity?: number;
  anode_CO2_tco2e?: number;
  PFC_sources?: 'ANODE_EFFECT_CF4_C2F6' | 'NONE';
  PFC_CF4_kg?: number;
  PFC_C2F6_kg?: number;
  refining_fuel_GJ?: number;
  // BUSINESS side
  alumina_cost_per_t?: number;
  petroleum_coke_cost_per_t?: number;
  anode_cost_per_t?: number;
  aluminium_realisation_per_t?: number;
  alumina_origin?: string;
  coke_origin?: string;
  LME_linked_pricing?: boolean;
  DC_energy_reduction_target_pct?: number;
}

export interface ChlorAlkaliProcessInputs {
  // CARBON side
  NaOH_production_t?: number;
  NaOH_concentration_pct?: number;
  Cl2_production_t?: number;
  H2_production_t?: number;
  cell_technology: 'BIPOLAR_MEMBRANE' | 'STANDARD_MEMBRANE' | 'DIAPHRAGM';
  cell_voltage?: number;
  current_efficiency_pct?: number;
  specific_electricity_kWh_per_t?: number;
  steam_consumption_t?: number;
  brine_quantity_t?: number;
  // BUSINESS side
  caustic_soda_realisation_per_t?: number;
  chlorine_realisation_per_t?: number;
  hydrogen_value_per_kg?: number;
  salt_cost_per_t?: number;
  water_cost_per_m3?: number;
  chlorine_storage_limit_t?: number;
  membrane_life_years?: number;
  cell_replacement_schedule?: string;
}

export interface PulpPaperProcessInputs {
  // CARBON side
  pulp_production_t?: number;
  paper_production_t?: number;
  paperboard_production_t?: number;
  wood_input_t?: number;
  recycled_fibre_input_t?: number;
  black_liquor_GJ?: number;
  recovery_boiler_present?: boolean;
  lime_kiln_fuel_GJ?: number;
  steam_generation_t?: number;
  steam_purchase_t?: number;
  steam_export_t?: number;
  specific_steam_consumption_t_per_t?: number;
  specific_electricity_kWh_per_t?: number;
  biomass_fuel_GJ?: number;
  // BUSINESS side
  wood_cost_per_t?: number;
  recycled_fibre_cost_per_t?: number;
  biomass_cost_per_t?: number;
  ETP_cost_cr?: number;
  ZLD_cost_cr?: number;
  paper_realisation_per_t?: number;
  paper_grade_mix?: string;
  export_share_pct?: number;
}

export interface PetroleumRefineryProcessInputs {
  // CARBON side
  crude_throughput_t?: number;
  refinery_capacity_t?: number;
  refinery_utilisation_pct?: number;
  API_gravity?: number;
  sulphur_pct?: number;
  MBN: number;                          // Million Barrel Number complexity index
  FCC_present?: boolean;
  hydrocracker_present?: boolean;
  coker_present?: boolean;
  hydrogen_production_t?: number;
  hydrogen_consumption_t?: number;
  SMR_present?: boolean;
  flare_volume_GJ?: number;
  process_CO2_tco2e?: number;
  refinery_fuel_gas_GJ?: number;
  // BUSINESS side
  crude_price_per_bbl?: number;
  natural_gas_price_per_mmbtu?: number;
  turnaround_date?: string;
  turnaround_duration_days?: number;
  petrol_realisation_per_kl?: number;
  diesel_realisation_per_kl?: number;
  export_share_pct?: number;
}

export interface PetrochemicalsProcessInputs {
  // CARBON side
  feedstock_type: 'LIQUID_NAPHTHA' | 'GAS_FEED' | 'DUAL_FEED';
  naphtha_quantity_t?: number;
  ethane_quantity_t?: number;
  propane_quantity_t?: number;
  cracker_throughput_t?: number;
  ethylene_output_t?: number;
  propylene_output_t?: number;
  polymer_output_t?: number;
  furnace_fuel_GJ?: number;
  process_gas_GJ?: number;
  flare_volume_GJ?: number;
  hydrogen_t?: number;
  // BUSINESS side
  naphtha_price_per_t?: number;
  ethane_price_per_t?: number;
  ethylene_price_per_t?: number;
  propylene_price_per_t?: number;
  polymer_price_per_t?: number;
  cracker_age_years?: number;
  turnaround_months?: number;
  feedstock_contracts?: string;
}

export interface TextileProcessInputs {
  // CARBON side
  fiber_type?: 'COTTON' | 'POLYESTER' | 'BLENDED' | 'SYNTHETIC';
  cotton_pct?: number;
  polyester_pct?: number;
  processing_stages?: string[];          // ['SPINNING', 'WEAVING', 'DYEING', 'FINISHING']
  steam_consumption_t?: number;
  specific_electricity_kWh_per_t?: number;
  water_consumption_m3?: number;
  ETP_present?: boolean;
  ZLD_present?: boolean;
  biomass_fuel_GJ?: number;
  mill_route: 'COMPOSITE_PROCESSING' | 'WET_PROCESSING_ONLY' | 'SPINNING_ONLY';
  // BUSINESS side
  cotton_cost_per_t?: number;
  polyester_cost_per_t?: number;
  dye_chemical_cost_per_t?: number;
  water_cost_per_m3?: number;
  ETP_cost_cr?: number;
  ZLD_cost_cr?: number;
  product_realisation_per_t?: number;
  product_grade?: string;
  export_share_pct?: number;
}

export type SectorProcessInputsV2 =
  | { sector: 'cement'; data: CementProcessInputs }
  | { sector: 'iron_steel'; data: IronSteelProcessInputs }
  | { sector: 'aluminium'; data: AluminiumProcessInputs }
  | { sector: 'chlor_alkali'; data: ChlorAlkaliProcessInputs }
  | { sector: 'pulp_paper'; data: PulpPaperProcessInputs }
  | { sector: 'petroleum_refinery'; data: PetroleumRefineryProcessInputs }
  | { sector: 'petrochemicals'; data: PetrochemicalsProcessInputs }
  | { sector: 'textile'; data: TextileProcessInputs };

// ─────────────────────────────────────────────
// PROJECT / FINANCE / SCENARIO INPUTS (spec §16–18, §23)
// ─────────────────────────────────────────────

export interface ProjectInputsV2 {
  project_id?: string;
  technology?: string;
  // Technical
  technical_potential?: number;         // abatement potential tCO2e/yr
  site_requirement?: string;
  utility_requirement?: string;
  // Financial (spec §16.2)
  equipment_capex_cr?: number;
  EPC_cost_cr?: number;
  civil_cost_cr?: number;
  electrical_cost_cr?: number;
  instrumentation_cost_cr?: number;
  land_cost_cr?: number;
  grid_connection_cost_cr?: number;
  engineering_cost_cr?: number;
  contingency_pct?: number;
  IDC_cr?: number;
  working_capital_cr?: number;
  total_capex_cr?: number;              // sum of above or direct entry
  annual_opex_cr?: number;
  maintenance_cr?: number;
  project_life_years?: number;
  commissioning_date?: string;
  implementation_months?: number;
  // Operational
  shutdown_required?: boolean;
  shutdown_days?: number;
  ramp_up_months?: number;
  // Carbon / MRV
  expected_abatement_tco2e?: number;
  MRV_method?: string;
  MRV_cost_cr?: number;
  verification_cost_cr?: number;
  capex_source?: InputSourceType;
}

export interface FinanceInputsV2 {
  debt_pct?: number;
  equity_pct?: number;
  interest_rate_pct?: number;
  debt_tenor_years?: number;
  moratorium_months?: number;
  financing_fee_pct?: number;
  WACC_pct?: number;
  tax_rate_pct?: number;
  depreciation_pct?: number;
  inflation_pct?: number;
  energy_price_escalation_pct?: number;
  fuel_price_escalation_pct?: number;
  carbon_price_escalation_pct?: number;
  salvage_value_pct?: number;
}

export interface CarbonPriceScenario {
  scenario_id: string;
  label: string;                         // 'Low', 'Base', 'High'
  CCC_price_inr: number;
  price_date?: string;
  market_reference?: string;
  price_type: 'OBSERVED_MARKET' | 'PUBLISHED_REFERENCE' | 'FORECAST' | 'SCENARIO_ASSUMPTION' | 'USER_INPUT';
}

export interface ScenarioInputsV2 {
  CCC_price_scenarios: CarbonPriceScenario[];
  project_output_delivery_pct?: number;
  project_delay_months?: number;
  electricity_price_escalation_pct?: number;
  fuel_price_escalation_pct?: number;
  CAPEX_uncertainty_pct?: number;
  production_growth_pct?: number;
}

export interface ProvenanceRecordV2 {
  schema_version: 'v2';
  data_submission_timestamp?: string;
  submitted_by?: string;
  data_class_summary?: Record<string, number>;  // counts per DataClass
  evidence_status?: 'VERIFIED' | 'SELF_DECLARED' | 'ESTIMATE' | 'SYNTHETIC_DEMO';
}

// ─────────────────────────────────────────────
// ─────────────────────────────────────────────
//  TOP-LEVEL CANONICAL FACILITY RECORD (spec §37)
// ─────────────────────────────────────────────
// ─────────────────────────────────────────────

export interface FacilityInputV2 {
  schema_version: 'v2';

  // ── SHARED (single canonical value, both domains) ──
  identity: FacilityIdentityV2;
  regulatory: RegulatoryIdentityV2;
  reporting: ReportingPeriodV2;
  production: ProductionInputsV2;

  // ── CARBON DOMAIN ──
  carbon_inputs: CarbonInputsV2;
  mrv_inputs?: MRVInputsV2;

  // ── BUSINESS TWIN DOMAIN ──
  business_inputs: BusinessTwinInputsV2;

  // ── SECTOR-SPECIFIC (process_inputs.<sector>) ──
  process_inputs?: SectorProcessInputsV2;

  // ── CROSS-DOMAIN ──
  project_inputs?: ProjectInputsV2;
  finance_inputs?: FinanceInputsV2;
  scenario_inputs?: ScenarioInputsV2;
  provenance?: ProvenanceRecordV2;
}

// ─────────────────────────────────────────────
// V1 BACKWARD-COMPAT FLAT FORM DATA (kept for existing form)
// ─────────────────────────────────────────────

export interface FacilityFormDataV1 {
  facility_name: string;
  sector: string;
  sub_sector: string;
  state: string;
  annual_production: number;
  production_unit: string;
  electricity_mwh: number;
  renewable_electricity_pct: number;
  thermal_fuel_type: string;
  thermal_fuel_tonnes: number;
  clinker_factor_pct?: number;
  smelter_dc_sec_kwh?: number;
  steel_route?: string;
  whrs_installed_mw?: number;
  custom_target_gei?: number;
  caustic_tech?: string;
  paper_steam_specific?: number;
  refinery_mbn?: number;
  petrochem_feedstock?: string;
  textile_route?: string;
}

// ─────────────────────────────────────────────
// V2 FORM STATE (for the new 8-step wizard)
// ─────────────────────────────────────────────

export interface FacilityFormStateV2 {
  currentStep: number;                  // 1–8
  activeTab: 'carbon' | 'business';    // within Steps 4–6
  completedSteps: number[];
  facilityInput: FacilityInputV2;
  v1Fallback?: FacilityFormDataV1;     // kept for backward compat presets
}

// ─────────────────────────────────────────────
// HELPER UTILITIES
// ─────────────────────────────────────────────

/**
 * Default emission factors for electricity sources.
 * Grid EF: CEA CO2 Baseline Database Version 21.0 — FY2023-24
 * Renewable: 0.0 tCO2e/MWh
 */
export function getElectricityEmissionFactor(
  sourceType: ElectricitySourceType,
  renewableStatus: boolean,
  _state?: string
): number {
  if (renewableStatus) return 0.0;
  if (sourceType === 'GRID_DISCOM') return 0.716; // CEA v21.0 national average
  if (sourceType === 'POWER_EXCHANGE') return 0.716;
  if (sourceType.startsWith('CAPTIVE_COAL')) return 1.02;
  if (sourceType.startsWith('CAPTIVE_GAS')) return 0.45;
  if (sourceType.startsWith('GROUP_CAPTIVE') || sourceType.startsWith('OPEN_ACCESS') || sourceType.startsWith('PPA') || sourceType === 'LONG_TERM_PPA' || sourceType === 'MEDIUM_TERM_PPA' || sourceType === 'SHORT_TERM_PPA' || sourceType === 'GREEN_TARIFF') return 0.0;
  if (sourceType === 'BATTERY_DISCHARGE') return 0.0; // depends on charging source — conservative: 0
  if (sourceType === 'WHRS_GENERATION' || sourceType === 'TRT_GENERATION') return 0.0;
  return 0.716; // default fallback
}

/**
 * Default fuel emission factors (tCO2e/tonne) — IPCC Tier 2 defaults.
 * Used when no per-stream override is provided.
 */
export const FUEL_EMISSION_FACTORS: Record<string, number> = {
  PETCOKE: 3.24,
  INDIAN_DOMESTIC_COAL: 1.95,
  IMPORTED_COAL: 2.15,
  WASHED_COAL: 2.10,
  COAL_BLEND: 2.05,
  NATURAL_GAS: 2.68,
  LNG: 2.75,
  RLNG: 2.68,
  LPG: 2.98,
  FURNACE_OIL: 3.12,
  LDO: 3.10,
  DIESEL: 2.68,
  NAPHTHA: 2.95,
  REFINERY_FUEL_GAS: 1.80,
  COKE_OVEN_GAS: 0.95,
  BLAST_FURNACE_GAS: 0.26,
  LD_GAS: 1.10,
  PRODUCER_GAS: 0.60,
  SYNGAS: 0.50,
  BIOMASS: 0.0,    // biogenic — zero for CCTS purpose
  BAGASSE: 0.0,
  BIOGAS: 0.0,
  BIOMETHANE: 0.0,
  RDF: 0.80,
  SRF: 0.80,
  AFR: 0.40,       // lower due to biogenic share
  WASTE_OIL: 2.80,
  HYDROGEN: 0.0,   // green hydrogen assumed
  AMMONIA: 0.0,
  OTHER: 1.95,     // conservative fallback
};

/**
 * Compute total Scope 2 emissions from an electricity source ledger.
 * Applies per-source emission factors.
 */
export function computeScope2FromLedger(
  sources: ElectricitySourceEntry[],
  state?: string
): number {
  return sources.reduce((sum, src) => {
    const ef = src.factor_override ??
      getElectricityEmissionFactor(src.source_type, src.renewable_status, state);
    return sum + src.annual_mwh * ef;
  }, 0);
}

/**
 * Compute total Scope 1 combustion emissions from a fuel stream ledger.
 */
export function computeScope1FuelFromLedger(streams: FuelStreamEntry[]): number {
  return streams.reduce((sum, stream) => {
    // Normalize quantity to tonnes for EF lookup (simple case)
    let qty_tonnes = stream.quantity;
    if (stream.quantity_unit === 'KG') qty_tonnes = stream.quantity / 1000;
    if (stream.quantity_unit === 'GJ') qty_tonnes = stream.quantity / 28; // approximate

    const ef = stream.emission_factor_override ??
      FUEL_EMISSION_FACTORS[stream.fuel_type] ?? 1.95;
    return sum + qty_tonnes * ef;
  }, 0);
}

/**
 * Convert a v1 flat form data to a v2 FacilityInputV2 structure.
 * Used for backward compat with existing presets and demo data.
 */
export function convertV1ToV2(v1: FacilityFormDataV1): FacilityInputV2 {
  const gridMwh = v1.electricity_mwh * (1 - (v1.renewable_electricity_pct || 0) / 100);
  const reMwh = v1.electricity_mwh * ((v1.renewable_electricity_pct || 0) / 100);

  const electricitySources: ElectricitySourceEntry[] = [
    {
      source_id: 'src-grid-01',
      source_type: 'GRID_DISCOM',
      annual_mwh: gridMwh,
      renewable_status: false,
      data_class: 'ESTIMATE',
    },
  ];

  if (reMwh > 0) {
    electricitySources.push({
      source_id: 'src-re-01',
      source_type: 'OPEN_ACCESS_SOLAR',
      annual_mwh: reMwh,
      renewable_status: true,
      renewable_attribute_type: 'PPA',
      data_class: 'ESTIMATE',
    });
  }

  const fuelStreams: FuelStreamEntry[] = [
    {
      fuel_id: 'fuel-01',
      fuel_type: (v1.thermal_fuel_type?.toUpperCase().replace(/-/g, '_') as FuelType) || 'INDIAN_DOMESTIC_COAL',
      quantity: v1.thermal_fuel_tonnes,
      quantity_unit: 'TONNES',
      data_class: 'ESTIMATE',
    },
  ];

  // Build sector process inputs
  let processInputs: SectorProcessInputsV2 | undefined;
  const s = v1.sector;
  if (s === 'cement') {
    processInputs = {
      sector: 'cement',
      data: {
        clinker_factor_pct: v1.clinker_factor_pct ?? 74,
        WHRS_capacity_MW: v1.whrs_installed_mw ?? 0,
      },
    };
  } else if (s === 'iron_steel') {
    processInputs = {
      sector: 'iron_steel',
      data: {
        steel_route: (v1.steel_route as IronSteelProcessInputs['steel_route']) ?? 'BF_BOF',
        WHRS_capacity_MW: v1.whrs_installed_mw ?? 0,
      },
    };
  } else if (s === 'aluminium') {
    processInputs = {
      sector: 'aluminium',
      data: {
        DC_SEC_kWh_per_t_Al: v1.smelter_dc_sec_kwh ?? 14200,
      },
    };
  } else if (s === 'chlor_alkali') {
    const techMap: Record<string, ChlorAlkaliProcessInputs['cell_technology']> = {
      bipolar_membrane: 'BIPOLAR_MEMBRANE',
      standard_membrane: 'STANDARD_MEMBRANE',
      diaphragm_cell: 'DIAPHRAGM',
    };
    processInputs = {
      sector: 'chlor_alkali',
      data: { cell_technology: techMap[v1.caustic_tech ?? ''] ?? 'BIPOLAR_MEMBRANE' },
    };
  } else if (s === 'pulp_paper') {
    processInputs = {
      sector: 'pulp_paper',
      data: { specific_steam_consumption_t_per_t: v1.paper_steam_specific ?? 4.8 },
    };
  } else if (s === 'petroleum_refinery') {
    processInputs = {
      sector: 'petroleum_refinery',
      data: { MBN: v1.refinery_mbn ?? 9.8 },
    };
  } else if (s === 'petrochemicals') {
    const feedMap: Record<string, PetrochemicalsProcessInputs['feedstock_type']> = {
      dual_feed: 'DUAL_FEED',
      liquid_naphtha: 'LIQUID_NAPHTHA',
      gas_feed: 'GAS_FEED',
    };
    processInputs = {
      sector: 'petrochemicals',
      data: { feedstock_type: feedMap[v1.petrochem_feedstock ?? ''] ?? 'DUAL_FEED' },
    };
  } else if (s === 'textile') {
    const routeMap: Record<string, TextileProcessInputs['mill_route']> = {
      composite_processing: 'COMPOSITE_PROCESSING',
      wet_processing_only: 'WET_PROCESSING_ONLY',
      spinning_only: 'SPINNING_ONLY',
    };
    processInputs = {
      sector: 'textile',
      data: { mill_route: routeMap[v1.textile_route ?? ''] ?? 'COMPOSITE_PROCESSING' },
    };
  }

  return {
    schema_version: 'v2',
    identity: {
      legal_entity_name: v1.facility_name,
      facility_name: v1.facility_name,
      state: v1.state,
    },
    regulatory: {
      sector: v1.sector,
      sub_sector: v1.sub_sector,
      process_route: v1.sub_sector,
      regulatory_status: v1.sector === 'iron_steel' ? 'DRAFT' : 'FINAL',
    },
    reporting: {
      financial_year: '2025-26',
    },
    production: {
      reporting_year_production: v1.annual_production,
      production_unit: v1.production_unit,
      data_class: 'ESTIMATE',
    },
    carbon_inputs: {
      electricity_sources: electricitySources,
      fuel_streams: fuelStreams,
      custom_target_gei: v1.custom_target_gei,
    },
    business_inputs: {
      electricity_tariffs: [],
      fuel_economics: [],
    },
    process_inputs: processInputs,
    provenance: {
      schema_version: 'v2',
      evidence_status: 'SYNTHETIC_DEMO',
    },
  };
}

/**
 * Build a blank v2 facility record for a given sector.
 */
export function createBlankFacilityV2(sector: string, state: string): FacilityInputV2 {
  return {
    schema_version: 'v2',
    identity: {
      legal_entity_name: '',
      facility_name: '',
      state,
    },
    regulatory: {
      sector,
      sub_sector: '',
      process_route: '',
      regulatory_status: sector === 'iron_steel' ? 'DRAFT' : 'FINAL',
    },
    reporting: { financial_year: '2025-26' },
    production: {
      reporting_year_production: 0,
      production_unit: 'tonnes',
      data_class: 'REAL_FACILITY_INPUT',
    },
    carbon_inputs: {
      electricity_sources: [
        {
          source_id: 'src-1',
          source_type: 'GRID_DISCOM',
          annual_mwh: 0,
          renewable_status: false,
          data_class: 'REAL_FACILITY_INPUT',
        },
      ],
      fuel_streams: [
        {
          fuel_id: 'fuel-1',
          fuel_type: 'INDIAN_DOMESTIC_COAL',
          quantity: 0,
          quantity_unit: 'TONNES',
          data_class: 'REAL_FACILITY_INPUT',
        },
      ],
    },
    business_inputs: {
      electricity_tariffs: [],
      fuel_economics: [],
    },
    provenance: {
      schema_version: 'v2',
      evidence_status: 'ESTIMATE',
    },
  };
}
