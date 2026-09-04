/**
 * AANGARA Aluminium Sector Carbon Engine — v4.0
 * ─────────────────────────────────────────────────────────
 * Spec: §§20, 21, 192, 193
 * Authority: BEE CCTS Detailed Procedure / IPCC Tier 2 / AR4 GWP
 *
 * CRITICAL (§77.5): REMOVE universal 1.62 tCO2/t Al factor.
 *
 * Core Formulas:
 * 1. Smelter electricity SEC: Electricity_MWh × 1000 / Primary_Aluminium_t (kWh/t)
 * 2. Anode carbon: Anode_Carbon × Carbon_Mass_Fraction × 44/12 × Oxidized_Fraction
 * 3. PFC emissions: (CF4_kg × 6500 + C2F6_kg × 9200) / 1000 (tCO2e, AR4 GWP)
 */

import { AluminiumProcessInputs } from '@/types/facility-v2';

export interface AluminiumCarbonResult {
  process_emissions_tco2e: number;
  anode_co2_tco2e: number;
  pfc_emissions_tco2e: number;
  sec_smelter_kwh_per_t?: number;
  formula_id: string;
  authority_class: 'STATUTORY_CCTS';
  notes: string[];
  metrics: {
    primary_aluminium_production_t: number;
    anode_consumed_t: number;
    cf4_kg: number;
    c2f6_kg: number;
  };
}

export function calculateAluminiumCarbonEmissions(
  inputs: AluminiumProcessInputs,
  annual_electricity_mwh?: number
): AluminiumCarbonResult {
  const al_production = inputs.primary_aluminium_production || 1;

  // Anode consumption calculation (§20.2)
  let anode_consumed_t = 0;
  if (inputs.anode_consumption_kg_per_t) {
    anode_consumed_t = (al_production * inputs.anode_consumption_kg_per_t) / 1000;
  } else if (inputs.petroleum_coke_quantity) {
    anode_consumed_t = inputs.petroleum_coke_quantity + (inputs.pitch_quantity || 0);
  } else {
    // Typical Indian prebake benchmark: ~435 kg anode per t Al
    anode_consumed_t = (al_production * 435) / 1000;
  }

  // Carbon mass fraction: typically ~98% in prebaked carbon anodes, ~97% oxidation
  const carbon_mass_fraction = 0.98;
  const oxidized_fraction = 0.97;
  const anode_co2 = anode_consumed_t * carbon_mass_fraction * (44 / 12) * oxidized_fraction;

  // PFC emissions (§20.3) — AR4 GWP: CF4 = 6500, C2F6 = 9200
  const cf4_kg = inputs.PFC_CF4_kg ?? 0;
  const c2f6_kg = inputs.PFC_C2F6_kg ?? 0;
  const pfc_co2e = ((cf4_kg * 6500) + (c2f6_kg * 9200)) / 1000;

  const total_process = inputs.anode_CO2_tco2e ?? Number((anode_co2 + pfc_co2e).toFixed(2));

  // Smelter electricity SEC (§20.1)
  const sec_smelter = annual_electricity_mwh && al_production > 0
    ? (annual_electricity_mwh * 1000) / al_production
    : inputs.DC_SEC_kWh_per_t_Al;

  return {
    process_emissions_tco2e: total_process,
    anode_co2_tco2e: Number(anode_co2.toFixed(2)),
    pfc_emissions_tco2e: Number(pfc_co2e.toFixed(2)),
    sec_smelter_kwh_per_t: sec_smelter ? Number(sec_smelter.toFixed(1)) : undefined,
    formula_id: 'CARBON-ALUMINIUM-ANODE-PFC-V1',
    authority_class: 'STATUTORY_CCTS',
    notes: [
      'Site-specific anode consumption formula applied per BEE CCTS procedure',
      'Universal 1.62 tCO2/t Al factor strictly excluded (§77.5)',
      'PFC emissions calculated using IPCC AR4 100-year GWPs (CF4=6500, C2F6=9200)',
    ],
    metrics: {
      primary_aluminium_production_t: al_production,
      anode_consumed_t: Number(anode_consumed_t.toFixed(1)),
      cf4_kg,
      c2f6_kg,
    },
  };
}
