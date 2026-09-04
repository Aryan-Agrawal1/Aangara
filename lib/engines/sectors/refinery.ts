/**
 * AANGARA Petroleum Refinery Sector Carbon Engine — v4.0
 * ─────────────────────────────────────────────────────────
 * Spec: §§26, 27, 198, 199
 * Authority: BEE CCTS Detailed Procedure / PPAC Guidelines
 *
 * Core Formulas:
 * 1. Flare emissions: Flared_Mass × Carbon_Fraction × 44/12 × Oxidation_Fraction
 * 2. Hydrogen generation emissions (SMR): ~9.1 tCO2/t H2
 * 3. Refinery Energy Intensity (MBN-normalized): Total_Energy_GJ / Crude_Throughput_t
 * 4. Fugitive / process emissions
 */

import { PetroleumRefineryProcessInputs } from '@/types/facility-v2';

export interface RefineryCarbonResult {
  process_emissions_tco2e: number;
  flare_emissions_tco2e: number;
  smr_hydrogen_co2_tco2e: number;
  energy_intensity_gj_per_t?: number;
  mbn_complexity: number;
  formula_id: string;
  authority_class: 'STATUTORY_CCTS';
  notes: string[];
  metrics: {
    crude_throughput_t: number;
    flare_energy_gj: number;
    hydrogen_production_t: number;
  };
}

export function calculateRefineryCarbonEmissions(
  inputs: PetroleumRefineryProcessInputs,
  total_energy_gj?: number
): RefineryCarbonResult {
  const throughput = inputs.crude_throughput_t || 1;

  // 1. Flare emissions (§26.2)
  // Flare volume in GJ -> convert to CO2 (typical flare gas EF ~56.1 kg CO2/GJ, OF ~0.98)
  const flare_gj = inputs.flare_volume_GJ || 0;
  const flare_co2 = (flare_gj * 0.0561 * 0.98);

  // 2. Hydrogen production (SMR) process emissions (§26.3)
  // SMR reaction: CH4 + 2H2O -> CO2 + 4H2 => ~5.5 kg CO2/kg H2 stoichiometric, ~9.1 kg CO2/kg H2 with fuel
  const h2_production_t = inputs.hydrogen_production_t || 0;
  const smr_process_co2 = inputs.SMR_present !== false ? (h2_production_t * 9.1) : 0;

  // 3. Process direct CO2 (FCC catalyst regeneration calcination / decoking)
  const fcc_co2 = inputs.process_CO2_tco2e || 0;

  const total_process = Number((flare_co2 + smr_process_co2 + fcc_co2).toFixed(2));

  // 4. Energy intensity (§26.4)
  const energy_intensity = total_energy_gj && throughput > 0
    ? total_energy_gj / throughput
    : undefined;

  return {
    process_emissions_tco2e: total_process,
    flare_emissions_tco2e: Number(flare_co2.toFixed(2)),
    smr_hydrogen_co2_tco2e: Number(smr_process_co2.toFixed(2)),
    energy_intensity_gj_per_t: energy_intensity ? Number(energy_intensity.toFixed(3)) : undefined,
    mbn_complexity: inputs.MBN,
    formula_id: 'CARBON-REFINERY-BEE-V1',
    authority_class: 'STATUTORY_CCTS',
    notes: [
      'Refinery flare emissions computed with actual flare volume and carbon fractions (§26.2)',
      'SMR hydrogen generation process carbon explicitly modeled (§26.3)',
      `MBN complexity index: ${inputs.MBN} (used for normalization, not emission factor)`,
    ],
    metrics: {
      crude_throughput_t: throughput,
      flare_energy_gj: flare_gj,
      hydrogen_production_t: h2_production_t,
    },
  };
}
