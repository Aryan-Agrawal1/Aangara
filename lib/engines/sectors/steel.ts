/**
 * AANGARA Iron & Steel Sector Carbon Engine — v4.0
 * ─────────────────────────────────────────────────────────
 * Spec: §§18, 19, 190, 191
 * Authority: BEE CCTS Detailed Procedure (DRAFT) / Technical GHG Protocol
 *
 * NON-NEGOTIABLE STATUS GATE (§18, §33.3):
 * Iron & Steel is currently DRAFT/WATCHLIST in CCTS.
 * Statutory compliance result is NOT_AVAILABLE.
 * Outputs are strictly classified as ENGINEERING_KPI / CORPORATE_GHG_OUTPUT.
 *
 * Core Formulas:
 * 1. Process mass balance: E_CO2 = (Carbon_in - Carbon_out) × 44/12
 * 2. Gas streams: CO2_mass = Gas_Mass × CO2_Mass_Fraction
 * 3. Intensity Ratios:
 *    - SEC_power = Electricity_MWh × 1000 / Crude_Steel_t (kWh/t)
 *    - Coke_Rate = Coke_t / Hot_Metal_t (kg coke / t HM)
 *    - Scrap_Rate = Scrap_t / Steel_Input_t (%)
 */

import { computeCarbonMassBalance } from '@/lib/engines/normalization';
import { IronSteelProcessInputs } from '@/types/facility-v2';

export interface IronSteelCarbonResult {
  process_emissions_tco2e: number;
  statutory_compliance_result: 'NOT_AVAILABLE';
  regulatory_status: 'DRAFT';
  steel_route: string;
  sec_power_kwh_per_t?: number;
  coke_rate_kg_per_t?: number;
  scrap_rate_pct?: number;
  authority_class: 'OFFICIAL_METHOD' | 'ENGINEERING_ANALYTICAL';
  formula_id: string;
  notes: string[];
  metrics: {
    crude_steel_production_t: number;
    hot_metal_production_t: number;
    dri_production_t: number;
    process_gas_co2_t: number;
  };
}

export function calculateIronSteelCarbonEmissions(
  inputs: IronSteelProcessInputs,
  annual_electricity_mwh?: number
): IronSteelCarbonResult {
  const crude_steel = inputs.crude_steel_production || 1;
  const hot_metal = inputs.hot_metal_production || (crude_steel * 0.85);
  const dri_output = inputs.DRI_production || 0;

  // Material carbon mass balance (§18.3)
  // Carbon inputs: Coke, Coal, PCI, Natural Gas, Electrodes
  const coke_t = inputs.coke_quantity ?? (hot_metal * ((inputs.coke_rate || 450) / 1000));
  const pci_t = inputs.PCI_coal_quantity ?? 0;
  const gas_nm3 = inputs.natural_gas_quantity ?? 0;
  const gas_c_t = (gas_nm3 * 0.717 * 0.75) / 1000; // ~0.717 kg/Nm3 density, 75% C

  const carbon_inputs = [
    { mass_t: coke_t, carbon_fraction: 0.85 },          // Coke ~85% C
    { mass_t: pci_t, carbon_fraction: 0.80 },           // PCI coal ~80% C
    { mass_t: gas_c_t, carbon_fraction: 1.0 },
    { mass_t: inputs.scrap_rate_pct ? (crude_steel * inputs.scrap_rate_pct / 100) : 0, carbon_fraction: 0.002 },
  ];

  // Carbon outputs: Carbon dissolved in liquid steel (~0.2% C), slag, dust, captured gas
  const carbon_outputs = [
    { mass_t: crude_steel, carbon_fraction: 0.002 },    // Finished steel ~0.2% C
  ];

  const massBalance = computeCarbonMassBalance(carbon_inputs, carbon_outputs);
  const process_emissions_tco2e = Number(massBalance.co2_t.toFixed(2));

  // Intensity Ratios (§18.5)
  const sec_power = annual_electricity_mwh && crude_steel > 0
    ? (annual_electricity_mwh * 1000) / crude_steel
    : inputs.specific_power_kWh_per_t;

  const coke_rate = hot_metal > 0
    ? (coke_t / hot_metal) * 1000
    : inputs.coke_rate;

  const scrap_rate = inputs.scrap_rate_pct;

  return {
    process_emissions_tco2e,
    statutory_compliance_result: 'NOT_AVAILABLE',
    regulatory_status: 'DRAFT',
    steel_route: inputs.steel_route,
    sec_power_kwh_per_t: sec_power ? Number(sec_power.toFixed(2)) : undefined,
    coke_rate_kg_per_t: coke_rate ? Number(coke_rate.toFixed(1)) : undefined,
    scrap_rate_pct: scrap_rate ? Number(scrap_rate.toFixed(2)) : undefined,
    authority_class: 'ENGINEERING_ANALYTICAL',
    formula_id: 'CARBON-STEEL-MASBAL-DRAFT-V1',
    notes: [
      'Iron & Steel is under DRAFT consultation — NOT a notified CCTS sector (§18)',
      'Statutory compliance obligations are NOT_AVAILABLE (§33.3)',
      'Calculations represent technical/analytical gate-to-gate inventory only',
      `Route: ${inputs.steel_route}, Coke rate: ${coke_rate ? coke_rate.toFixed(1) : 'N/A'} kg/t HM`,
    ],
    metrics: {
      crude_steel_production_t: crude_steel,
      hot_metal_production_t: hot_metal,
      dri_production_t: dri_output,
      process_gas_co2_t: process_emissions_tco2e,
    },
  };
}
