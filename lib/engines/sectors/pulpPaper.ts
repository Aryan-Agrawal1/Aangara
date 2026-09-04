/**
 * AANGARA Pulp & Paper Sector Carbon Engine — v4.0
 * ─────────────────────────────────────────────────────────
 * Spec: §§24, 25, 196, 197
 * Authority: BEE CCTS Detailed Procedure
 *
 * Core Formulas:
 * 1. Black liquor biogenic combustion: Captured as BIOGENIC_CO2 (excluded from fossil total per §14)
 * 2. Steam intensity: Steam_Consumed_t / Paper_or_Pulp_Output_t
 * 3. Specific Electricity: Electricity_MWh × 1000 / Output_t (kWh/t)
 * 4. Lime kiln fuel emissions
 */

import { PulpPaperProcessInputs } from '@/types/facility-v2';

export interface PulpPaperCarbonResult {
  process_emissions_tco2e: number;
  biogenic_co2_tco2e: number;
  steam_intensity_t_per_t?: number;
  sec_electric_kwh_per_t?: number;
  formula_id: string;
  authority_class: 'STATUTORY_CCTS';
  notes: string[];
  metrics: {
    total_paper_output_t: number;
    black_liquor_energy_gj: number;
    biogenic_co2_t: number;
    lime_kiln_emissions_tco2e: number;
  };
}

export function calculatePulpPaperCarbonEmissions(
  inputs: PulpPaperProcessInputs,
  annual_electricity_mwh?: number
): PulpPaperCarbonResult {
  const paper_output = (inputs.paper_production_t || 0) +
    (inputs.paperboard_production_t || 0) +
    (inputs.pulp_production_t || 0) || 1;

  // Black liquor biogenic emissions (§24.2)
  // Black liquor solids typically generate ~95.3 kg CO2/GJ biogenic
  const black_liquor_gj = inputs.black_liquor_GJ || 0;
  const biogenic_co2_t = (black_liquor_gj * 0.0953); // tCO2 biogenic

  // Lime kiln emissions: CaCO3 -> CaO + CO2 (calcination in recovery loop)
  // Typically offset by causticizing absorption, but fuel in lime kiln produces fossil CO2
  const lime_kiln_fuel_gj = inputs.lime_kiln_fuel_GJ || 0;
  const lime_kiln_fossil_co2 = lime_kiln_fuel_gj * 0.0561; // gas/oil factor ~56.1 kg CO2/GJ

  // Steam intensity (§24.3)
  const total_steam = (inputs.steam_generation_t || 0) + (inputs.steam_purchase_t || 0) - (inputs.steam_export_t || 0);
  const steam_intensity = total_steam > 0 && paper_output > 0
    ? total_steam / paper_output
    : inputs.specific_steam_consumption_t_per_t;

  // Specific power (§24.4)
  const sec_electric = annual_electricity_mwh && paper_output > 0
    ? (annual_electricity_mwh * 1000) / paper_output
    : inputs.specific_electricity_kWh_per_t;

  return {
    process_emissions_tco2e: Number(lime_kiln_fossil_co2.toFixed(2)),
    biogenic_co2_tco2e: Number(biogenic_co2_t.toFixed(2)),
    steam_intensity_t_per_t: steam_intensity ? Number(steam_intensity.toFixed(2)) : undefined,
    sec_electric_kwh_per_t: sec_electric ? Number(sec_electric.toFixed(1)) : undefined,
    formula_id: 'CARBON-PULPPAPER-BEE-V1',
    authority_class: 'STATUTORY_CCTS',
    notes: [
      'Black liquor recovery emissions classified strictly as BIOGENIC (§24.2, §14)',
      'Lime kiln combustion accounted for fossil process stream',
      `Specific steam consumption: ${steam_intensity ? steam_intensity.toFixed(2) : 'N/A'} t steam / t paper`,
    ],
    metrics: {
      total_paper_output_t: paper_output,
      black_liquor_energy_gj: black_liquor_gj,
      biogenic_co2_t: Number(biogenic_co2_t.toFixed(1)),
      lime_kiln_emissions_tco2e: Number(lime_kiln_fossil_co2.toFixed(2)),
    },
  };
}
