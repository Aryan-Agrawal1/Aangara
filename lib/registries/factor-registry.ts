/**
 * AANGARA Factor Registry v3.0
 * ─────────────────────────────────────────────────────────
 * Versioned emission factor registry.
 * All emission factors are sourced from this registry — NEVER hardcoded in engine files.
 *
 * Authority classes (per spec §0.2):
 *   STATUTORY_CCTS   — directly required by Indian CCTS rule/procedure
 *   OFFICIAL_METHOD  — defined by official government document
 *   INVENTORY_STANDARD — GHG Protocol / ISO / IPCC convention
 *   ENGINEERING_ANALYTICAL — engineering ratio, not statutory
 *
 * Sources:
 *   CEA CO2 Baseline Database v21.0 (FY2023-24): https://cea.nic.in/cdm-co2-baseline-database/
 *   BEE CCTS Detailed Procedure: https://beeindia.gov.in/sites/default/files/Detailed_Procedure_for_Compliance_Mechnisum_Under_CCTS.pdf
 *   IPCC 2006 Guidelines for National GHG Inventories (AR4 GWP)
 *   MoEFCC G.S.R. 25(E)
 */

export type AuthorityClass =
  | 'STATUTORY_CCTS'
  | 'OFFICIAL_METHOD'
  | 'INVENTORY_STANDARD'
  | 'ENGINEERING_ANALYTICAL'
  | 'FINANCE_STANDARD'
  | 'MODEL_METHOD'
  | 'SCENARIO_METHOD';

export interface EmissionFactor {
  factor_id: string;
  factor_type: 'ELECTRICITY_EMISSION' | 'FUEL_COMBUSTION' | 'PROCESS' | 'GWP' | 'TRANSPORT';
  description: string;
  value: number;
  unit: string;
  /** For biogenic/renewable sources zero fossil CO2 applies */
  is_zero_fossil_co2: boolean;
  /** Oxidation factor default (per BEE CCTS procedure §5.5) */
  default_oxidation_factor?: number;
  /** Net Calorific Value defaults where applicable */
  default_ncv_gj_per_t?: number;
  /** Carbon content fraction where applicable */
  default_carbon_fraction?: number;
  source: string;
  source_url?: string;
  source_version: string;
  reporting_period?: string;
  authority_class: AuthorityClass;
  jurisdiction: 'INDIA' | 'GLOBAL';
  methodology?: string;
  uncertainty_pct?: number;
  effective_from: string;
  effective_to: string | null;
  notes?: string;
}

// ─────────────────────────────────────────────
// 1. ELECTRICITY EMISSION FACTORS
// ─────────────────────────────────────────────

export const ELECTRICITY_EMISSION_FACTORS: Record<string, EmissionFactor> = {
  // CEA CO2 Baseline Database Version 21.0 — FY2023-24 national average
  CEA_GRID_EF_V21: {
    factor_id: 'CEA_GRID_EF_V21',
    factor_type: 'ELECTRICITY_EMISSION',
    description: 'India national grid average CO2 emission factor — CEA Baseline Database v21.0',
    value: 0.716,
    unit: 'tCO2e/MWh',
    is_zero_fossil_co2: false,
    source: 'Central Electricity Authority (CEA) CO2 Baseline Database',
    source_url: 'https://cea.nic.in/cdm-co2-baseline-database/?lang=en',
    source_version: '21.0',
    reporting_period: 'FY2023-24',
    authority_class: 'OFFICIAL_METHOD',
    jurisdiction: 'INDIA',
    uncertainty_pct: 5,
    effective_from: '2025-04-01',
    effective_to: null,
    notes: 'Must be updated when CEA publishes Version 22.0. Do not use this as a permanent constant.',
  },

  // Renewable sources — zero fossil CO2 per BEE CCTS methodology
  GRID_SOLAR_EF: {
    factor_id: 'GRID_SOLAR_EF',
    factor_type: 'ELECTRICITY_EMISSION',
    description: 'Grid-connected solar PV — zero fossil CO2 per BEE CCTS methodology',
    value: 0.0,
    unit: 'tCO2e/MWh',
    is_zero_fossil_co2: true,
    source: 'BEE CCTS Detailed Procedure / GHG Protocol',
    source_version: '2024',
    authority_class: 'STATUTORY_CCTS',
    jurisdiction: 'INDIA',
    effective_from: '2025-04-01',
    effective_to: null,
    notes: 'Operational scope 2 zero for solar PV. Lifecycle/embodied emissions excluded per boundary definition.',
  },
  GRID_WIND_EF: {
    factor_id: 'GRID_WIND_EF',
    factor_type: 'ELECTRICITY_EMISSION',
    description: 'Grid-connected wind — zero fossil CO2 per BEE CCTS methodology',
    value: 0.0,
    unit: 'tCO2e/MWh',
    is_zero_fossil_co2: true,
    source: 'BEE CCTS Detailed Procedure / GHG Protocol',
    source_version: '2024',
    authority_class: 'STATUTORY_CCTS',
    jurisdiction: 'INDIA',
    effective_from: '2025-04-01',
    effective_to: null,
  },
  GRID_HYDRO_EF: {
    factor_id: 'GRID_HYDRO_EF',
    factor_type: 'ELECTRICITY_EMISSION',
    description: 'Hydro power — effectively zero fossil CO2 per BEE CCTS (run-of-river / reservoir)',
    value: 0.0,
    unit: 'tCO2e/MWh',
    is_zero_fossil_co2: true,
    source: 'BEE CCTS Detailed Procedure',
    source_version: '2024',
    authority_class: 'STATUTORY_CCTS',
    jurisdiction: 'INDIA',
    effective_from: '2025-04-01',
    effective_to: null,
  },
  CAPTIVE_COAL_EF: {
    factor_id: 'CAPTIVE_COAL_EF',
    factor_type: 'ELECTRICITY_EMISSION',
    description: 'Captive coal power plant — derived from coal combustion EF + plant efficiency',
    value: 1.05,
    unit: 'tCO2e/MWh',
    is_zero_fossil_co2: false,
    source: 'IPCC 2006 Guidelines / BEE PAT benchmark estimates',
    source_version: '2006 AR4',
    authority_class: 'INVENTORY_STANDARD',
    jurisdiction: 'INDIA',
    effective_from: '2025-04-01',
    effective_to: null,
    notes: 'Indicative only. Must be replaced with site-specific fuel quantity × EF / net generation calculation.',
  },
  CAPTIVE_GAS_EF: {
    factor_id: 'CAPTIVE_GAS_EF',
    factor_type: 'ELECTRICITY_EMISSION',
    description: 'Captive gas turbine / CCGT — indicative',
    value: 0.49,
    unit: 'tCO2e/MWh',
    is_zero_fossil_co2: false,
    source: 'IPCC 2006 / IEA estimates',
    source_version: '2006 AR4',
    authority_class: 'INVENTORY_STANDARD',
    jurisdiction: 'INDIA',
    effective_from: '2025-04-01',
    effective_to: null,
    notes: 'Must be replaced with site-specific calculation where fuel data exists.',
  },
  PPA_WIND_SOLAR_EF: {
    factor_id: 'PPA_WIND_SOLAR_EF',
    factor_type: 'ELECTRICITY_EMISSION',
    description: 'Open-access PPA from wind or solar — zero fossil CO2',
    value: 0.0,
    unit: 'tCO2e/MWh',
    is_zero_fossil_co2: true,
    source: 'GHG Protocol Scope 2 Guidance / BEE CCTS',
    source_version: '2015 Scope2 / 2024 CCTS',
    authority_class: 'STATUTORY_CCTS',
    jurisdiction: 'INDIA',
    effective_from: '2025-04-01',
    effective_to: null,
  },
};

// ─────────────────────────────────────────────
// 2. FUEL COMBUSTION EMISSION FACTORS
// ─────────────────────────────────────────────
// Per BEE CCTS Detailed Procedure §5 & IPCC 2006 Tier 2 defaults
// Formula: E_fuel = AD_fuel × EF_fuel × OF_fuel (CARBON-COMBUSTION-BEE-V1)

export const FUEL_COMBUSTION_FACTORS: Record<string, EmissionFactor> = {
  INDIAN_DOMESTIC_COAL: {
    factor_id: 'FUEL-COAL-IND-DOM-V1',
    factor_type: 'FUEL_COMBUSTION',
    description: 'Indian domestic coal (sub-bituminous / lignite) — CO2 emission factor',
    value: 1.65,
    unit: 'tCO2/t_fuel',
    is_zero_fossil_co2: false,
    default_oxidation_factor: 0.98,
    default_ncv_gj_per_t: 14.5,
    default_carbon_fraction: 0.42,
    source: 'IPCC 2006 Guidelines Vol.2 Table 2.2 / BEE CCTS Procedure Annexure III',
    source_url: 'https://beeindia.gov.in/sites/default/files/Detailed_Procedure_for_Compliance_Mechnisum_Under_CCTS.pdf',
    source_version: 'IPCC2006-AR4',
    authority_class: 'STATUTORY_CCTS',
    jurisdiction: 'INDIA',
    uncertainty_pct: 10,
    effective_from: '2025-04-01',
    effective_to: null,
    notes: 'Site-specific NCV and carbon content should override these defaults when lab data is available.',
  },
  IMPORTED_COAL: {
    factor_id: 'FUEL-COAL-IMP-V1',
    factor_type: 'FUEL_COMBUSTION',
    description: 'Imported steam/coking coal (bituminous) — CO2 emission factor',
    value: 2.35,
    unit: 'tCO2/t_fuel',
    is_zero_fossil_co2: false,
    default_oxidation_factor: 0.98,
    default_ncv_gj_per_t: 26.0,
    default_carbon_fraction: 0.71,
    source: 'IPCC 2006 Guidelines Vol.2 Table 2.2',
    source_version: 'IPCC2006-AR4',
    authority_class: 'INVENTORY_STANDARD',
    jurisdiction: 'GLOBAL',
    uncertainty_pct: 8,
    effective_from: '2025-04-01',
    effective_to: null,
    notes: 'Site-specific analysis strongly recommended for imported coal blends.',
  },
  PETCOKE: {
    factor_id: 'FUEL-PETCOKE-V1',
    factor_type: 'FUEL_COMBUSTION',
    description: 'Petroleum coke — high carbon, high sulphur',
    value: 3.36,
    unit: 'tCO2/t_fuel',
    is_zero_fossil_co2: false,
    default_oxidation_factor: 0.98,
    default_ncv_gj_per_t: 32.0,
    default_carbon_fraction: 0.88,
    source: 'IPCC 2006 Guidelines Vol.2 Table 2.2',
    source_version: 'IPCC2006-AR4',
    authority_class: 'INVENTORY_STANDARD',
    jurisdiction: 'GLOBAL',
    uncertainty_pct: 5,
    effective_from: '2025-04-01',
    effective_to: null,
    notes: 'Cement sector primary kiln fuel. NCV varies by supplier — update from invoice/lab report.',
  },
  NATURAL_GAS: {
    factor_id: 'FUEL-GAS-NG-V1',
    factor_type: 'FUEL_COMBUSTION',
    description: 'Natural gas / pipeline gas — CO2 emission factor',
    value: 1.89,
    unit: 'tCO2/tonne_fuel',
    is_zero_fossil_co2: false,
    default_oxidation_factor: 0.995,
    default_ncv_gj_per_t: 48.0,
    default_carbon_fraction: 0.75,
    source: 'IPCC 2006 Guidelines Vol.2 Table 2.2',
    source_version: 'IPCC2006-AR4',
    authority_class: 'INVENTORY_STANDARD',
    jurisdiction: 'GLOBAL',
    uncertainty_pct: 3,
    effective_from: '2025-04-01',
    effective_to: null,
    notes: 'Gas must not assume universal density — require pressure/temperature/reference condition per spec §3.5.',
  },
  LNG: {
    factor_id: 'FUEL-LNG-V1',
    factor_type: 'FUEL_COMBUSTION',
    description: 'Liquefied Natural Gas — same molecular composition as NG',
    value: 1.89,
    unit: 'tCO2/t_fuel',
    is_zero_fossil_co2: false,
    default_oxidation_factor: 0.995,
    default_ncv_gj_per_t: 48.5,
    default_carbon_fraction: 0.75,
    source: 'IPCC 2006 Guidelines Vol.2',
    source_version: 'IPCC2006-AR4',
    authority_class: 'INVENTORY_STANDARD',
    jurisdiction: 'GLOBAL',
    uncertainty_pct: 3,
    effective_from: '2025-04-01',
    effective_to: null,
  },
  FUEL_OIL: {
    factor_id: 'FUEL-OIL-HFO-V1',
    factor_type: 'FUEL_COMBUSTION',
    description: 'Heavy fuel oil / residual fuel oil',
    value: 3.07,
    unit: 'tCO2/t_fuel',
    is_zero_fossil_co2: false,
    default_oxidation_factor: 0.99,
    default_ncv_gj_per_t: 40.4,
    default_carbon_fraction: 0.84,
    source: 'IPCC 2006 Guidelines Vol.2 Table 2.2',
    source_version: 'IPCC2006-AR4',
    authority_class: 'INVENTORY_STANDARD',
    jurisdiction: 'GLOBAL',
    uncertainty_pct: 5,
    effective_from: '2025-04-01',
    effective_to: null,
  },
  DIESEL: {
    factor_id: 'FUEL-DIESEL-V1',
    factor_type: 'FUEL_COMBUSTION',
    description: 'High-speed diesel / gas oil',
    value: 2.68,
    unit: 'tCO2/t_fuel',
    is_zero_fossil_co2: false,
    default_oxidation_factor: 0.99,
    default_ncv_gj_per_t: 43.0,
    default_carbon_fraction: 0.736,
    source: 'IPCC 2006 Guidelines Vol.2 Table 2.2',
    source_version: 'IPCC2006-AR4',
    authority_class: 'INVENTORY_STANDARD',
    jurisdiction: 'GLOBAL',
    uncertainty_pct: 3,
    effective_from: '2025-04-01',
    effective_to: null,
  },
  // Biogenic / renewable fuels — zero fossil CO2 per BEE CCTS and IPCC
  BIOMASS: {
    factor_id: 'FUEL-BIOMASS-V1',
    factor_type: 'FUEL_COMBUSTION',
    description: 'Agricultural / wood biomass — zero fossil CO2 per IPCC/BEE. Store biogenic_CO2 separately.',
    value: 0.0,
    unit: 'tCO2_fossil/t_fuel',
    is_zero_fossil_co2: true,
    default_ncv_gj_per_t: 12.0,
    source: 'IPCC 2006 Vol.2 / BEE CCTS Detailed Procedure §14',
    source_version: 'IPCC2006',
    authority_class: 'STATUTORY_CCTS',
    jurisdiction: 'GLOBAL',
    effective_from: '2025-04-01',
    effective_to: null,
    notes: 'Biogenic CO2 must be tracked separately per spec §14. Not silently zeroed.',
  },
  BAGASSE: {
    factor_id: 'FUEL-BAGASSE-V1',
    factor_type: 'FUEL_COMBUSTION',
    description: 'Sugarcane bagasse — biogenic, zero fossil CO2',
    value: 0.0,
    unit: 'tCO2_fossil/t_fuel',
    is_zero_fossil_co2: true,
    default_ncv_gj_per_t: 7.5,
    source: 'IPCC 2006 / BEE CCTS',
    source_version: 'IPCC2006',
    authority_class: 'STATUTORY_CCTS',
    jurisdiction: 'INDIA',
    effective_from: '2025-04-01',
    effective_to: null,
  },
  BIOGAS: {
    factor_id: 'FUEL-BIOGAS-V1',
    factor_type: 'FUEL_COMBUSTION',
    description: 'Biogas / biomethane — biogenic, zero fossil CO2 (per applicable methodology)',
    value: 0.0,
    unit: 'tCO2_fossil/t_fuel',
    is_zero_fossil_co2: true,
    default_ncv_gj_per_t: 20.0,
    source: 'IPCC 2006 / GHG Protocol',
    source_version: 'IPCC2006',
    authority_class: 'INVENTORY_STANDARD',
    jurisdiction: 'GLOBAL',
    effective_from: '2025-04-01',
    effective_to: null,
  },
  HYDROGEN: {
    factor_id: 'FUEL-H2-V1',
    factor_type: 'FUEL_COMBUSTION',
    description: 'Hydrogen — zero combustion CO2 regardless of production method',
    value: 0.0,
    unit: 'tCO2/t_fuel',
    is_zero_fossil_co2: true,
    default_ncv_gj_per_t: 120.0,
    source: 'IPCC 2006 / GHG Protocol',
    source_version: 'IPCC2006',
    authority_class: 'INVENTORY_STANDARD',
    jurisdiction: 'GLOBAL',
    effective_from: '2025-04-01',
    effective_to: null,
    notes: 'Upstream H2 production emissions must be tracked separately as Scope 3 if relevant.',
  },
};

// ─────────────────────────────────────────────
// 3. GWP VALUES
// ─────────────────────────────────────────────

export const GWP_REGISTRY: Record<string, { gwp_version: string; gas: string; value: number; source: string }> = {
  CH4_AR4: { gwp_version: 'AR4', gas: 'CH4', value: 25, source: 'IPCC AR4 (2007)' },
  N2O_AR4: { gwp_version: 'AR4', gas: 'N2O', value: 298, source: 'IPCC AR4 (2007)' },
  CF4_AR4: { gwp_version: 'AR4', gas: 'CF4', value: 7390, source: 'IPCC AR4 (2007)' },
  C2F6_AR4: { gwp_version: 'AR4', gas: 'C2F6', value: 12200, source: 'IPCC AR4 (2007)' },
  CH4_AR6: { gwp_version: 'AR6', gas: 'CH4', value: 27.9, source: 'IPCC AR6 (2021)' },
  N2O_AR6: { gwp_version: 'AR6', gas: 'N2O', value: 273, source: 'IPCC AR6 (2021)' },
  CF4_AR6: { gwp_version: 'AR6', gas: 'CF4', value: 7380, source: 'IPCC AR6 (2021)' },
  C2F6_AR6: { gwp_version: 'AR6', gas: 'C2F6', value: 11100, source: 'IPCC AR6 (2021)' },
};

// ─────────────────────────────────────────────
// 4. LOOKUP HELPERS
// ─────────────────────────────────────────────

export type FuelFactorKey = keyof typeof FUEL_COMBUSTION_FACTORS;
export type ElecFactorKey = keyof typeof ELECTRICITY_EMISSION_FACTORS;

/**
 * Resolve electricity emission factor for a given source type.
 * Returns the full EmissionFactor record — never a bare number.
 */
export function resolveElectricityFactor(
  source_type: string,
  is_renewable: boolean,
  _state?: string
): EmissionFactor {
  if (is_renewable) {
    const key = source_type.includes('SOLAR') ? 'GRID_SOLAR_EF'
      : source_type.includes('WIND') ? 'GRID_WIND_EF'
      : source_type.includes('HYDRO') ? 'GRID_HYDRO_EF'
      : source_type.includes('BIOMASS') ? 'GRID_SOLAR_EF' // biogenic — use zero fossil
      : source_type.includes('PPA') ? 'PPA_WIND_SOLAR_EF'
      : 'GRID_SOLAR_EF';
    return ELECTRICITY_EMISSION_FACTORS[key];
  }
  if (source_type.includes('CAPTIVE') && source_type.includes('GAS')) {
    return ELECTRICITY_EMISSION_FACTORS.CAPTIVE_GAS_EF;
  }
  if (source_type.includes('CAPTIVE')) {
    return ELECTRICITY_EMISSION_FACTORS.CAPTIVE_COAL_EF;
  }
  // Default: CEA national grid v21.0
  // TODO: When CEA publishes state-disaggregated factors, add state lookup here
  return ELECTRICITY_EMISSION_FACTORS.CEA_GRID_EF_V21;
}

/**
 * Resolve fuel combustion factor for a given fuel type key.
 * Falls back to Indian domestic coal if unknown.
 */
export function resolveFuelFactor(fuel_type: string): EmissionFactor {
  const key = fuel_type.toUpperCase().replace(/ /g, '_');
  return FUEL_COMBUSTION_FACTORS[key]
    ?? FUEL_COMBUSTION_FACTORS.INDIAN_DOMESTIC_COAL;
}

/**
 * All factor IDs currently in registry — for audit/display.
 */
export const ALL_FACTOR_IDS = [
  ...Object.keys(ELECTRICITY_EMISSION_FACTORS),
  ...Object.keys(FUEL_COMBUSTION_FACTORS),
];
