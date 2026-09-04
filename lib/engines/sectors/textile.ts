/**
 * AANGARA Textile Sector Carbon Engine — v4.0
 * ─────────────────────────────────────────────────────────
 * Spec: §§30, 31, 202, 203
 * Authority: BEE CCTS Detailed Procedure
 *
 * Core Formulas:
 * 1. SEC_total: Total_Energy_GJ / Textile_Output_t (GJ/t)
 * 2. SEC_electric: Electricity_MWh × 1000 / Output_t (kWh/t)
 * 3. SEC_steam: Steam_t / Output_t (t steam / t fabric)
 * 4. Water intensity: Water_Withdrawal_m3 / Output_t (m3/t)
 * 5. Recycled water rate: Recycled_Water / Total_Water_Use (%)
 */

import { TextileProcessInputs } from '@/types/facility-v2';

export interface TextileCarbonResult {
  process_emissions_tco2e: number;
  sec_total_gj_per_t?: number;
  sec_electric_kwh_per_t?: number;
  sec_steam_t_per_t?: number;
  water_intensity_m3_per_t?: number;
  formula_id: string;
  authority_class: 'STATUTORY_CCTS';
  notes: string[];
  metrics: {
    textile_output_t: number;
    mill_route: string;
    water_consumption_m3: number;
    steam_consumption_t: number;
  };
}

export function calculateTextileCarbonEmissions(
  inputs: TextileProcessInputs,
  production_tonnes: number,
  annual_electricity_mwh?: number,
  total_energy_gj?: number
): TextileCarbonResult {
  const output_t = production_tonnes || 1;

  // Textile direct process emissions (apart from combustion/steam):
  // Most emissions in textiles are Scope 2 electricity & Scope 1 boiler steam.
  // Direct chemical/sizing emissions are minimal (~0 tCO2e unless coal gasifier used).
  const process_emissions_tco2e = 0;

  // SEC Total (§30.1)
  const sec_total = total_energy_gj && output_t > 0
    ? total_energy_gj / output_t
    : undefined;

  // SEC Electric (§30.2)
  const sec_electric = annual_electricity_mwh && output_t > 0
    ? (annual_electricity_mwh * 1000) / output_t
    : inputs.specific_electricity_kWh_per_t;

  // SEC Steam (§30.3)
  const sec_steam = inputs.steam_consumption_t && output_t > 0
    ? inputs.steam_consumption_t / output_t
    : undefined;

  // Water intensity (§30.4)
  const water_m3 = inputs.water_consumption_m3 || 0;
  const water_intensity = water_m3 > 0 && output_t > 0
    ? water_m3 / output_t
    : undefined;

  return {
    process_emissions_tco2e,
    sec_total_gj_per_t: sec_total ? Number(sec_total.toFixed(2)) : undefined,
    sec_electric_kwh_per_t: sec_electric ? Number(sec_electric.toFixed(1)) : undefined,
    sec_steam_t_per_t: sec_steam ? Number(sec_steam.toFixed(2)) : undefined,
    water_intensity_m3_per_t: water_intensity ? Number(water_intensity.toFixed(2)) : undefined,
    formula_id: 'CARBON-TEXTILE-BEE-V1',
    authority_class: 'STATUTORY_CCTS',
    notes: [
      `Mill route: ${inputs.mill_route}, Fiber mix: Cotton ${inputs.cotton_pct ?? 0}%, Polyester ${inputs.polyester_pct ?? 0}%`,
      'Water intensity tracked as physical resource metric, separated from energy streams (§30.4)',
      `Specific steam consumption: ${sec_steam ? sec_steam.toFixed(2) : 'N/A'} t/t`,
    ],
    metrics: {
      textile_output_t: output_t,
      mill_route: inputs.mill_route,
      water_consumption_m3: water_m3,
      steam_consumption_t: inputs.steam_consumption_t || 0,
    },
  };
}
