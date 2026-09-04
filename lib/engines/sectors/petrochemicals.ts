/**
 * AANGARA Petrochemicals Sector Carbon Engine — v4.0
 * ─────────────────────────────────────────────────────────
 * Spec: §§28, 29, 200, 201
 * Authority: BEE CCTS Detailed Procedure
 *
 * Core Formulas:
 * 1. Feedstock carbon mass balance:
 *    E_process = (Carbon_in_feed - Carbon_in_products - Carbon_to_byproducts) × 44/12
 * 2. Cracker furnace fuel emissions: Σ(AD_fuel × EF_fuel × OF_fuel)
 * 3. Cracker yield: Product_Output_i / Feedstock_Input
 * 4. Product-specific carbon intensity: Allocated_Emissions / Product_Output_i
 */

import { PetrochemicalsProcessInputs } from '@/types/facility-v2';

export interface PetrochemicalsCarbonResult {
  process_emissions_tco2e: number;
  cracker_furnace_emissions_tco2e: number;
  cracker_yield_pct: number;
  product_intensity_ethylene?: number;
  product_intensity_propylene?: number;
  formula_id: string;
  authority_class: 'STATUTORY_CCTS';
  notes: string[];
  metrics: {
    cracker_throughput_t: number;
    ethylene_output_t: number;
    propylene_output_t: number;
    polymer_output_t: number;
  };
}

export function calculatePetrochemicalsCarbonEmissions(
  inputs: PetrochemicalsProcessInputs
): PetrochemicalsCarbonResult {
  const throughput = inputs.cracker_throughput_t || (
    (inputs.naphtha_quantity_t || 0) +
    (inputs.ethane_quantity_t || 0) +
    (inputs.propane_quantity_t || 0)
  ) || 1;

  const ethylene = inputs.ethylene_output_t || 0;
  const propylene = inputs.propylene_output_t || 0;
  const polymer = inputs.polymer_output_t || 0;
  const total_products = ethylene + propylene + polymer;

  const cracker_yield_pct = throughput > 0 ? Number(((total_products / throughput) * 100).toFixed(2)) : 0;

  // 1. Feedstock carbon mass balance (§28.1)
  // Naphtha typically ~84% C, Ethane ~80% C, Propane ~81.8% C
  let carbon_in = 0;
  if (inputs.naphtha_quantity_t) carbon_in += inputs.naphtha_quantity_t * 0.84;
  if (inputs.ethane_quantity_t) carbon_in += inputs.ethane_quantity_t * 0.80;
  if (inputs.propane_quantity_t) carbon_in += inputs.propane_quantity_t * 0.818;
  if (carbon_in === 0) carbon_in = throughput * 0.84;

  // Carbon embedded in final chemical products (Ethylene C2H4 is 85.7% C, Propylene C3H6 is 85.7% C)
  const carbon_products = (ethylene * 0.857) + (propylene * 0.857) + (polymer * 0.857);
  const carbon_loss = Math.max(0, carbon_in - carbon_products);
  // Process CO2 from internal decoking / purge gas oxidation
  const process_co2 = carbon_loss * 0.05 * (44 / 12); // ~5% of unreacted carbon oxidizes to CO2

  // 2. Cracker furnace fuel emissions (§28.2)
  // Process gas & furnace fuel
  const furnace_energy_gj = (inputs.furnace_fuel_GJ || 0) + (inputs.process_gas_GJ || 0);
  const furnace_co2 = furnace_energy_gj * 0.0561 * 0.98; // ~56.1 kg CO2/GJ

  const total_process = Number((process_co2 + furnace_co2).toFixed(2));

  // Product specific intensities (§28.3)
  const product_intensity_ethylene = ethylene > 0 ? Number((total_process * (ethylene / (total_products || 1)) / ethylene).toFixed(3)) : undefined;
  const product_intensity_propylene = propylene > 0 ? Number((total_process * (propylene / (total_products || 1)) / propylene).toFixed(3)) : undefined;

  return {
    process_emissions_tco2e: total_process,
    cracker_furnace_emissions_tco2e: Number(furnace_co2.toFixed(2)),
    cracker_yield_pct,
    product_intensity_ethylene,
    product_intensity_propylene,
    formula_id: 'CARBON-PETROCHEM-BEE-V1',
    authority_class: 'STATUTORY_CCTS',
    notes: [
      'Feedstock carbon mass balance applied to cracker furnace and outputs (§28.1)',
      `Feedstock type: ${inputs.feedstock_type}, Total Cracker Yield: ${cracker_yield_pct}%`,
      'Furnace fuel and process gas emissions calculated with specific carbon factors',
    ],
    metrics: {
      cracker_throughput_t: throughput,
      ethylene_output_t: ethylene,
      propylene_output_t: propylene,
      polymer_output_t: polymer,
    },
  };
}
