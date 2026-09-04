/**
 * AANGARA Chlor-Alkali Sector Carbon Engine — v4.0
 * ─────────────────────────────────────────────────────────
 * Spec: §§22, 23, 194, 195
 * Authority: BEE CCTS Detailed Procedure
 *
 * Core Formulas:
 * 1. Specific Power: Electricity_MWh × 1000 / NaOH_Output_t (kWh/t NaOH)
 * 2. Multi-product co-production ledger: NaOH, Cl2, H2 retained separately (§22.2)
 * 3. Steam intensity: Steam_t / NaOH_Output_t
 */

import { ChlorAlkaliProcessInputs } from '@/types/facility-v2';

export interface ChlorAlkaliCarbonResult {
  process_emissions_tco2e: number;
  sec_power_kwh_per_t?: number;
  steam_intensity_t_per_t?: number;
  formula_id: string;
  authority_class: 'STATUTORY_CCTS';
  notes: string[];
  co_products: {
    naoh_production_t: number;
    naoh_concentration_pct: number;
    cl2_production_t: number;
    h2_production_t: number;
    equivalent_naoh_basis_t: number;
  };
}

export function calculateChlorAlkaliCarbonEmissions(
  inputs: ChlorAlkaliProcessInputs,
  annual_electricity_mwh?: number
): ChlorAlkaliCarbonResult {
  const naoh_production = inputs.NaOH_production_t || 1;
  const naoh_conc = inputs.NaOH_concentration_pct || 100;
  // Normalized to 100% NaOH basis
  const naoh_100_pct_basis = naoh_production * (naoh_conc / 100);

  // Theoretical electrochemical stoichometry:
  // 2 NaCl + 2 H2O -> 2 NaOH (80) + Cl2 (71) + H2 (2)
  // ~0.8875 t Cl2 per t NaOH (100%), ~0.025 t H2 per t NaOH
  const cl2_production = inputs.Cl2_production_t ?? (naoh_100_pct_basis * 0.8875);
  const h2_production = inputs.H2_production_t ?? (naoh_100_pct_basis * 0.025);

  // In Chlor-Alkali, process emissions are minimal; 98%+ emissions are from electricity & steam
  // Any direct process emissions (e.g. from acid neutralization/carbonate treatment)
  const process_emissions_tco2e = 0; // standard membrane process has 0 direct calcination/process carbon

  // Specific power (§22.1)
  const sec_power = annual_electricity_mwh && naoh_100_pct_basis > 0
    ? (annual_electricity_mwh * 1000) / naoh_100_pct_basis
    : inputs.specific_electricity_kWh_per_t;

  const steam_intensity = inputs.steam_consumption_t && naoh_100_pct_basis > 0
    ? inputs.steam_consumption_t / naoh_100_pct_basis
    : undefined;

  return {
    process_emissions_tco2e,
    sec_power_kwh_per_t: sec_power ? Number(sec_power.toFixed(1)) : undefined,
    steam_intensity_t_per_t: steam_intensity ? Number(steam_intensity.toFixed(2)) : undefined,
    formula_id: 'CARBON-CHLORALKALI-BEE-V1',
    authority_class: 'STATUTORY_CCTS',
    notes: [
      'Multi-product output tracking (NaOH, Cl2, H2) maintained separately (§22.2)',
      'Specific power normalized to 100% NaOH dry substance basis per BEE methodology',
      `Cell technology: ${inputs.cell_technology}`,
    ],
    co_products: {
      naoh_production_t: naoh_production,
      naoh_concentration_pct: naoh_conc,
      cl2_production_t: Number(cl2_production.toFixed(1)),
      h2_production_t: Number(h2_production.toFixed(2)),
      equivalent_naoh_basis_t: Number(naoh_100_pct_basis.toFixed(1)),
    },
  };
}
