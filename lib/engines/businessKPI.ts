/**
 * AANGARA Industrial Business KPI Engine v3.0 (Engine 22)
 * ─────────────────────────────────────────────────────────
 * Computes core industrial intensity KPIs and business unit metrics per spec §78.
 * All metrics are tagged ENGINEERING_ANALYTICAL or STATUTORY_CCTS.
 */

export interface IndustrialKPIResult {
  production_tonnes: number;
  energy_intensity_gj_per_t: number;
  electricity_intensity_kwh_per_t: number;
  thermal_intensity_gj_per_t: number;
  carbon_intensity_tco2e_per_t: number;
  energy_cost_intensity_inr_per_t: number;
  carbon_compliance_cost_intensity_inr_per_t: number;
  total_variable_energy_cost_cr: number;
  ebitda_margin_estimated_pct?: number;
  provenance: {
    authority_class: 'ENGINEERING_ANALYTICAL' | 'STATUTORY_CCTS';
    formula_ids: string[];
  };
}

export class BusinessKPIEngine {

  static computeIndustrialKPIs(params: {
    production_tonnes: number;
    total_electricity_mwh: number;
    total_fuel_gj: number;
    total_ghg_tco2e: number;
    annual_electricity_cost_cr?: number;
    annual_fuel_cost_cr?: number;
    target_gei?: number;
    ccc_price_inr?: number;
  }): IndustrialKPIResult {
    const {
      production_tonnes,
      total_electricity_mwh,
      total_fuel_gj,
      total_ghg_tco2e,
      annual_electricity_cost_cr = 0,
      annual_fuel_cost_cr = 0,
      target_gei,
      ccc_price_inr = 1000,
    } = params;

    const prod = Math.max(1, production_tonnes);

    // 1. Electricity intensity (kWh / t)
    const elec_kwh = total_electricity_mwh * 1000;
    const electricity_intensity_kwh_per_t = Number((elec_kwh / prod).toFixed(1));

    // 2. Thermal intensity (GJ / t)
    const thermal_intensity_gj_per_t = Number((total_fuel_gj / prod).toFixed(2));

    // 3. Total Energy Intensity (GJ / t) — 1 MWh = 3.6 GJ
    const elec_gj = total_electricity_mwh * 3.6;
    const total_energy_gj = elec_gj + total_fuel_gj;
    const energy_intensity_gj_per_t = Number((total_energy_gj / prod).toFixed(2));

    // 4. Carbon Intensity (tCO2e / t)
    const carbon_intensity_tco2e_per_t = Number((total_ghg_tco2e / prod).toFixed(4));

    // 5. Energy Cost Intensity (₹ / t)
    const total_energy_cost_inr = (annual_electricity_cost_cr + annual_fuel_cost_cr) * 1e7;
    const energy_cost_intensity_inr_per_t = Number((total_energy_cost_inr / prod).toFixed(1));

    // 6. Carbon Compliance Cost Intensity (₹ / t)
    const shortfall_tco2e = target_gei ? Math.max(0, carbon_intensity_tco2e_per_t - target_gei) * prod : 0;
    const carbon_cost_inr = shortfall_tco2e * ccc_price_inr;
    const carbon_compliance_cost_intensity_inr_per_t = Number((carbon_cost_inr / prod).toFixed(2));

    return {
      production_tonnes: prod,
      energy_intensity_gj_per_t,
      electricity_intensity_kwh_per_t,
      thermal_intensity_gj_per_t,
      carbon_intensity_tco2e_per_t,
      energy_cost_intensity_inr_per_t,
      carbon_compliance_cost_intensity_inr_per_t,
      total_variable_energy_cost_cr: Number((annual_electricity_cost_cr + annual_fuel_cost_cr).toFixed(2)),
      provenance: {
        authority_class: 'ENGINEERING_ANALYTICAL',
        formula_ids: ['CARBON-GEI-BEE-V1', 'CARBON-COMBUSTION-BEE-V1'],
      },
    };
  }
}
