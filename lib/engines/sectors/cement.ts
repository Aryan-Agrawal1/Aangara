/**
 * AANGARA Cement Sector Carbon Engine — v4.0
 * ─────────────────────────────────────────────────────────
 * Spec: §§16, 17, 188, 189
 * Authority: BEE CCTS Detailed Procedure / MoEFCC G.S.R. 739(E)
 *
 * Core Formulas:
 * 1. Carbonate mass balance: E_process = (Σ C_in - Σ C_out) × 44/12
 * 2. Clinker Factor: Clinker_Used_in_Cement / Cement_Output
 * 3. SEC_electric: Electricity_MWh × 1000 / Cement_Output_t (kWh/t)
 * 4. SEC_thermal: Thermal_Energy_GJ / Clinker_Output_t (GJ/t)
 * 5. Clinker reduction project: ΔClinker = Baseline_CF - Project_CF; ΔClinker_mass = ΔClinker × Cement_Output
 *
 * CRITICAL (§77.4): REMOVE universal 0.525 tCO2/t clinker factor.
 */

import { computeCarbonMassBalance } from '@/lib/engines/normalization';
import { CementProcessInputs } from '@/types/facility-v2';

export interface CementCarbonResult {
  process_emissions_tco2e: number;
  clinker_factor: number;
  clinker_factor_pct: number;
  sec_electric_kwh_per_t?: number;
  sec_thermal_gj_per_t?: number;
  formula_id: string;
  authority_class: 'STATUTORY_CCTS' | 'OFFICIAL_METHOD' | 'ENGINEERING_ANALYTICAL';
  notes: string[];
  metrics: {
    clinker_production_t: number;
    cement_production_t: number;
    limestone_consumed_t: number;
    calcination_co2_t: number;
  };
}

export function calculateCementCarbonEmissions(
  inputs: CementProcessInputs,
  annual_electricity_mwh?: number,
  thermal_energy_gj?: number
): CementCarbonResult {
  const opc = inputs.OPC_quantity ?? 0;
  const ppc = inputs.PPC_quantity ?? 0;
  const psc = inputs.PSC_quantity ?? 0;
  const composite = inputs.composite_quantity ?? 0;
  const sum_products = opc + ppc + psc + composite;
  const cement_production = inputs.cement_production ?? (sum_products > 0 ? sum_products : 1);

  const clinker_production = inputs.clinker_production ?? (
    cement_production * ((inputs.clinker_factor_pct || 72) / 100)
  );

  const clinker_factor = cement_production > 0 ? clinker_production / cement_production : 0.72;
  const clinker_factor_pct = Number((clinker_factor * 100).toFixed(2));

  // Carbonate mass balance (§16.1)
  // Default limestone: ~1.52 t limestone per t clinker if not explicitly metered
  const limestone_t = inputs.limestone_quantity ?? (clinker_production * 1.52);
  const limestone_c_fraction = 0.12; // ~12% C in CaCO3 (MW C=12, CaCO3=100)
  const clinker_c_fraction = 0.005;  // residual unburned carbon/lime in clinker

  const massBalance = computeCarbonMassBalance(
    [{ mass_t: limestone_t, carbon_fraction: limestone_c_fraction }],
    [{ mass_t: clinker_production, carbon_fraction: clinker_c_fraction }]
  );

  // If explicit calcination_data was supplied, use site-measured
  const process_emissions_tco2e = inputs.calcination_data ?? Number(massBalance.co2_t.toFixed(2));

  // Engineering metrics (§16.1):
  // SEC_electric = Electricity_MWh × 1000 / Cement_Output_t
  const sec_electric = annual_electricity_mwh && cement_production > 0
    ? (annual_electricity_mwh * 1000) / cement_production
    : inputs.specific_electricity_kWh_per_t;

  // SEC_thermal = Thermal_Energy_GJ / Clinker_Output_t
  const thermal_gj = thermal_energy_gj ?? inputs.thermal_energy_GJ;
  const sec_thermal = thermal_gj && clinker_production > 0
    ? thermal_gj / clinker_production
    : inputs.specific_thermal_energy;

  return {
    process_emissions_tco2e,
    clinker_factor,
    clinker_factor_pct,
    sec_electric_kwh_per_t: sec_electric ? Number(sec_electric.toFixed(2)) : undefined,
    sec_thermal_gj_per_t: sec_thermal ? Number(sec_thermal.toFixed(3)) : undefined,
    formula_id: 'CARBON-CEMENT-MASBAL-V1',
    authority_class: 'STATUTORY_CCTS',
    notes: [
      'Carbonate mass balance applied per BEE CCTS Detailed Procedure',
      'Universal 0.525 tCO2/t clinker factor strictly excluded (§77.4)',
      `Clinker factor: ${clinker_factor_pct}% based on gate-to-gate clinker/cement ratio`,
    ],
    metrics: {
      clinker_production_t: clinker_production,
      cement_production_t: cement_production,
      limestone_consumed_t: limestone_t,
      calcination_co2_t: process_emissions_tco2e,
    },
  };
}
