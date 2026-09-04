/**
 * AANGARA Data Normalization Engine v3.0
 * ─────────────────────────────────────────────────────────
 * ENGINE 01 — Per spec §3
 *
 * Converts all heterogeneous facility inputs to canonical backend units
 * BEFORE any carbon or business calculation.
 *
 * Rules:
 * - Never repeatedly convert already-normalized values (§2.2)
 * - Store original_value, original_unit, normalized_value, normalized_unit, rule_id
 * - Never round intermediate calculations (§2.3)
 * - Gas: never assume universal density — require P/T/reference_condition (§3.5)
 */

export interface NormalizedValue {
  original_value: number;
  original_unit: string;
  normalized_value: number;
  normalized_unit: string;
  conversion_rule_id: string;
}

// ─────────────────────────────────────────────
// Conversion constants
// ─────────────────────────────────────────────

const CONVERSIONS = {
  // Energy
  KCAL_TO_KJ: 4.184,           // 1 kcal = 4.184 kJ (IPCC/BEE reference)
  GJ_TO_KWH: 277.778,          // 1 GJ = 277.778 kWh
  KWH_TO_GJ: 0.0036,           // 1 kWh = 0.0036 GJ
  MWH_TO_KWH: 1000.0,          // 1 MWh = 1000 kWh
  MWH_TO_GJ: 3.6,              // 1 MWh = 3.6 GJ

  // Mass
  KG_TO_T: 0.001,              // 1 kg = 0.001 t
  T_TO_KG: 1000.0,             // 1 t = 1000 kg
  G_TO_KG: 0.001,

  // Carbon molecular weight ratio
  CO2_TO_C: 44.0 / 12.0,      // 44/12 — molecular weight conversion CO2/C (spec §5.4)
} as const;

// ─────────────────────────────────────────────
// Generic quantity normalizer
// ─────────────────────────────────────────────

export function normalizeQuantity(
  value: number,
  from_unit: string,
  to_unit: string
): NormalizedValue {
  const from = from_unit.toUpperCase().trim();
  const to = to_unit.toUpperCase().trim();

  if (from === to) {
    return { original_value: value, original_unit: from_unit, normalized_value: value, normalized_unit: to_unit, conversion_rule_id: 'IDENTITY' };
  }

  // Mass conversions
  if (from === 'KG' && to === 'T') {
    return { original_value: value, original_unit: 'KG', normalized_value: value * CONVERSIONS.KG_TO_T, normalized_unit: 't', conversion_rule_id: 'MASS-KG-TO-T' };
  }
  if (from === 'T' && to === 'KG') {
    return { original_value: value, original_unit: 't', normalized_value: value * CONVERSIONS.T_TO_KG, normalized_unit: 'KG', conversion_rule_id: 'MASS-T-TO-KG' };
  }

  // Energy conversions
  if (from === 'MWH' && to === 'KWH') {
    return { original_value: value, original_unit: 'MWh', normalized_value: value * CONVERSIONS.MWH_TO_KWH, normalized_unit: 'kWh', conversion_rule_id: 'ENERGY-MWH-TO-KWH' };
  }
  if (from === 'KWH' && to === 'MWH') {
    return { original_value: value, original_unit: 'kWh', normalized_value: value / CONVERSIONS.MWH_TO_KWH, normalized_unit: 'MWh', conversion_rule_id: 'ENERGY-KWH-TO-MWH' };
  }
  if (from === 'MWH' && to === 'GJ') {
    return { original_value: value, original_unit: 'MWh', normalized_value: value * CONVERSIONS.MWH_TO_GJ, normalized_unit: 'GJ', conversion_rule_id: 'ENERGY-MWH-TO-GJ' };
  }
  if (from === 'GJ' && to === 'KWH') {
    return { original_value: value, original_unit: 'GJ', normalized_value: value * CONVERSIONS.GJ_TO_KWH, normalized_unit: 'kWh', conversion_rule_id: 'ENERGY-GJ-TO-KWH' };
  }
  if (from === 'KWH' && to === 'GJ') {
    return { original_value: value, original_unit: 'kWh', normalized_value: value * CONVERSIONS.KWH_TO_GJ, normalized_unit: 'GJ', conversion_rule_id: 'ENERGY-KWH-TO-GJ' };
  }

  throw new Error(`Unsupported unit conversion: ${from} → ${to}. Add conversion rule to normalization engine.`);
}

// ─────────────────────────────────────────────
// BEE Fuel Activity Data (NCV method)
// Formula: AD_GJ = Fuel_kg × NCV_kcal_per_kg × 4.184 ÷ 1,000,000
// Source: BEE CCTS Detailed Procedure §5.2 / formula_id: CARBON-AD-BEE-V1
// ─────────────────────────────────────────────

export interface FuelActivityData {
  fuel_quantity_kg: number;
  ncv_kcal_per_kg: number;
  ad_gj: number;
  activity_data_gj: number;
  formula_id: 'CARBON-AD-BEE-V1';
  note: string;
}

/**
 * Compute fuel activity data (GJ) from quantity and NCV.
 * Per BEE CCTS Detailed Procedure §5.2.
 * Returns FULL PRECISION — never round intermediate values (spec §2.3).
 */
export function computeFuelActivityDataGJ(
  fuel_quantity_kg: number,
  ncv_kcal_per_kg: number
): FuelActivityData {
  // AD_GJ = Fuel_kg × NCV_kcal/kg × 4.184 kJ/kcal ÷ 1,000,000
  const ad_gj = fuel_quantity_kg * ncv_kcal_per_kg * CONVERSIONS.KCAL_TO_KJ / 1_000_000;
  return {
    fuel_quantity_kg,
    ncv_kcal_per_kg,
    ad_gj,  // full precision — caller rounds for display only
    activity_data_gj: ad_gj,
    formula_id: 'CARBON-AD-BEE-V1',
    note: 'AD_GJ = Fuel_kg × NCV_kcal_per_kg × 4.184 ÷ 1,000,000 (BEE CCTS Detailed Procedure §5)',
  };
}

/**
 * Convenience: compute fuel activity data from tonnes.
 */
export function computeFuelActivityDataFromTonnes(
  fuel_quantity_tonnes: number,
  ncv_kcal_per_kg: number
): FuelActivityData {
  return computeFuelActivityDataGJ(fuel_quantity_tonnes * CONVERSIONS.T_TO_KG, ncv_kcal_per_kg);
}

/**
 * Converts fuel NCV (kcal/kg) to Energy density (GJ/tonne).
 * 1 kcal/kg = 4.184 kJ/kg = 4.184 MJ/t = 0.004184 GJ/t
 */
export function convertNCVToGJPerTonne(ncv_kcal_per_kg: number): number {
  return (ncv_kcal_per_kg * CONVERSIONS.KCAL_TO_KJ) / 1000;
}

// ─────────────────────────────────────────────
// BEE Total Carbon EF formula (§5.3)
// EF_(gCO2/kcal) = (% Total Carbon Content / (NCV_kcal/kg × 100)) × (44/12) × 100
// ─────────────────────────────────────────────

export interface DerivedEmissionFactor {
  carbon_content_pct: number;
  ncv_kcal_per_kg: number;
  ef_gco2_per_kcal: number;
  ef_tco2_per_gj: number;
  formula_id: 'CARBON-EF-BEE-TOTALCARBON-V1';
}

/**
 * Derive emission factor from fuel carbon content and NCV.
 * Per BEE CCTS Detailed Procedure §5.3.
 * Use when site fuel-quality data are available (overrides registry defaults).
 */
export function deriveEmissionFactorFromCarbonContent(
  carbon_content_pct: number,
  ncv_kcal_per_kg: number
): DerivedEmissionFactor {
  // EF_(gCO2/kcal) = (C_pct / (NCV × 100)) × (44/12) × 100
  const ef_gco2_per_kcal = (carbon_content_pct / (ncv_kcal_per_kg * 100)) * CONVERSIONS.CO2_TO_C * 100;
  // Convert to tCO2/GJ: 1 gCO2/kcal × 4.184 kcal/kJ × 1000 kJ/MJ × 1000 MJ/GJ × 1t/1e6g = 4.184 tCO2/GJ × factor
  const ef_tco2_per_gj = ef_gco2_per_kcal * CONVERSIONS.KCAL_TO_KJ;  // g/kJ = g/kJ; ×1e6/1e6 for t/GJ
  return {
    carbon_content_pct,
    ncv_kcal_per_kg,
    ef_gco2_per_kcal,
    ef_tco2_per_gj,
    formula_id: 'CARBON-EF-BEE-TOTALCARBON-V1',
  };
}

// ─────────────────────────────────────────────
// Carbon mass balance helper (§5.4, §6.2)
// E_CO2 = (M_in × C_in - M_out × C_out) × 44/12
// ─────────────────────────────────────────────

export interface CarbonMassBalance {
  carbon_in_t: number;
  carbon_out_t: number;
  co2_t: number;
  formula_id: 'CARBON-PROCESS-MASBAL-V1';
}

/**
 * Carbon mass balance for process emissions.
 * E_CO2 = (ΣCarbon_in - ΣCarbon_out) × 44/12
 * Per spec §5.4 and §6.2.
 */
export function computeCarbonMassBalance(
  streams_in: Array<{ mass_t: number; carbon_fraction: number }>,
  streams_out: Array<{ mass_t: number; carbon_fraction: number }>
): CarbonMassBalance {
  const carbon_in_t = streams_in.reduce((s, x) => s + x.mass_t * x.carbon_fraction, 0);
  const carbon_out_t = streams_out.reduce((s, x) => s + x.mass_t * x.carbon_fraction, 0);
  const co2_t = Math.max(0, carbon_in_t - carbon_out_t) * CONVERSIONS.CO2_TO_C;
  return { carbon_in_t, carbon_out_t, co2_t, formula_id: 'CARBON-PROCESS-MASBAL-V1' };
}

// ─────────────────────────────────────────────
// Molecular weight helper
// ─────────────────────────────────────────────

export const MOLECULAR_WEIGHT_RATIO_CO2_C = CONVERSIONS.CO2_TO_C;
