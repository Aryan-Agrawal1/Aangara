/**
 * AANGARA Opportunity Engine v3.0
 * ─────────────────────────────────────────────────────────
 * Generates engineering decarbonisation opportunities across industrial sectors.
 *
 * Implements:
 *   §37: Industrial Energy Efficiency & WHRS Models
 *   §38: Renewable Power Integration (Solar, Wind, Battery Storage)
 *   §47: Marginal Abatement Cost (Lifecycle & Discounted)
 *
 * Prototype constants removed (§77):
 *   - Universal 7500 operating hours → replaced by (8760 × Availability)
 *   - 0.716 grid factor → replaced by factor registry lookup
 *   - Fixed NPV multipliers → replaced by FinanceEngine DCF evaluation
 */

import { resolveElectricityFactor } from '@/lib/registries/factor-registry';
import { FinanceEngine } from './finance';

export interface Opportunity {
  id: string;
  title: string;
  category: 'ENERGY_EFFICIENCY' | 'RENEWABLE_POWER' | 'FUEL_SWITCH' | 'PROCESS_OPTIMIZATION' | 'CIRCULAR_ECONOMY';
  capex_cr: number;
  annual_opex_change_cr: number;
  annual_energy_savings_cr: number;
  annual_reduction_tco2e: number;
  payback_years: number;
  npv_10yr_cr: number;
  cost_per_tco2e: number; // Marginal Abatement Cost (₹/tCO2e)
  profitability_index?: number;
  bee_methodology_code: string;
  timeline_months: number;
  feasibility_tier: 'HIGH' | 'MEDIUM' | 'COMPLEX';
  technology_readiness: string;
  description: string;
  key_assumptions?: {
    capacity_mw?: number;
    annual_generation_mwh?: number;
    availability_pct?: number;
    grid_ef_used?: number;
  };
}

export class OpportunityEngine {

  /**
   * Identifies prioritized techno-economic decarbonisation opportunities
   */
  static identifyOpportunities(params: {
    sector: string;
    annual_production: number;
    current_emissions_tco2e: number;
    actual_gei: number;
    electricity_mwh: number;
    renewable_pct: number;
    whrs_mw?: number;
    state?: string;
  }): Opportunity[] {
    const {
      sector,
      annual_production,
      current_emissions_tco2e,
      electricity_mwh,
      renewable_pct,
      whrs_mw = 0,
      state,
    } = params;

    const sec = sector.toLowerCase();
    const opps: Opportunity[] = [];

    // Dynamically resolve grid emission factor from factor registry (§77.1)
    const grid_ef = resolveElectricityFactor('GRID_DISCOM', false, state).value;

    // ── 1. Waste Heat Recovery System (WFRS / WHRS) ──
    // Spec §37.4, §77.3: Replace 7500h with (8760 × Availability)
    if (['cement', 'iron_steel', 'petroleum_refinery'].includes(sec) && whrs_mw < 8) {
      const pot_mw = sec === 'cement'
        ? Math.max(4.0, (annual_production / 1e6) * 7.5)
        : (sec === 'iron_steel' ? 14.0 : 8.0);

      const capex = pot_mw * 8.5; // ₹8.5 Cr / MW for boiler + steam turbine generator
      const availability = 0.85;  // 85% availability factor (7,446 annual operating hours)
      const annual_gen_mwh = pot_mw * 8760 * availability;
      const power_cost_inr_per_kwh = 6.80; // ₹6.80/kWh grid displaced
      const energy_savings_cr = (annual_gen_mwh * 1000 * power_cost_inr_per_kwh) / 1e7;
      const opex_cr = capex * 0.035; // 3.5% of CAPEX annual O&M
      const annual_abatement_tco2e = annual_gen_mwh * grid_ef;

      // Evaluate cashflows using DCF Finance Engine
      const fin = FinanceEngine.evaluateProject(
        capex,
        opex_cr,
        energy_savings_cr,
        annual_abatement_tco2e,
        9.5,
        15
      );

      opps.push({
        id: 'OPP-WHRS-01',
        title: `Waste Heat Recovery System (${pot_mw.toFixed(1)} MW)`,
        category: 'ENERGY_EFFICIENCY',
        capex_cr: Number(capex.toFixed(1)),
        annual_opex_change_cr: Number(opex_cr.toFixed(2)),
        annual_energy_savings_cr: Number(energy_savings_cr.toFixed(2)),
        annual_reduction_tco2e: Number(annual_abatement_tco2e.toFixed(0)),
        payback_years: fin.simple_payback_years,
        npv_10yr_cr: fin.npv_cr,
        cost_per_tco2e: fin.mac_inr_per_tco2e,
        profitability_index: fin.profitability_index,
        bee_methodology_code: 'BEE-CCTS-M-01-EE',
        timeline_months: 18,
        feasibility_tier: 'HIGH',
        technology_readiness: 'TRL-9 Commercial',
        description: 'Recovers high-enthalpy flue gas from preheater and clinker cooler to generate captive power, displacing grid electricity.',
        key_assumptions: {
          capacity_mw: Number(pot_mw.toFixed(1)),
          annual_generation_mwh: Number(annual_gen_mwh.toFixed(0)),
          availability_pct: 85,
          grid_ef_used: grid_ef,
        },
      });
    }

    // ── 2. Captive / Group Captive Solar PV ──
    // Spec §38: Solar capacity factor ~ 21% (1,840 annual generation hours)
    if (renewable_pct < 60 && electricity_mwh > 20000) {
      const target_re_mwh = Math.min(electricity_mwh * 0.35, 150000);
      const solar_cf = 0.21; // 21% AC Capacity Utilization Factor
      const solar_mw = target_re_mwh / (8760 * solar_cf);
      const capex = solar_mw * 3.8; // ₹3.8 Cr / MWp ground-mounted solar
      const annual_gen_mwh = solar_mw * 8760 * solar_cf;
      const grid_tariff_inr = 7.00;
      const solar_lcoe_inr = 3.20;
      const net_unit_saving = grid_tariff_inr - solar_lcoe_inr;
      const energy_savings_cr = (annual_gen_mwh * 1000 * net_unit_saving) / 1e7;
      const opex_cr = capex * 0.018; // 1.8% O&M
      const annual_abatement_tco2e = annual_gen_mwh * grid_ef;

      const fin = FinanceEngine.evaluateProject(
        capex,
        opex_cr,
        energy_savings_cr,
        annual_abatement_tco2e,
        9.0,
        20
      );

      opps.push({
        id: 'OPP-SOLAR-01',
        title: `Captive Group Solar PV (${solar_mw.toFixed(1)} MWp)`,
        category: 'RENEWABLE_POWER',
        capex_cr: Number(capex.toFixed(1)),
        annual_opex_change_cr: Number(opex_cr.toFixed(2)),
        annual_energy_savings_cr: Number(energy_savings_cr.toFixed(2)),
        annual_reduction_tco2e: Number(annual_abatement_tco2e.toFixed(0)),
        payback_years: fin.simple_payback_years,
        npv_10yr_cr: fin.npv_cr,
        cost_per_tco2e: fin.mac_inr_per_tco2e,
        profitability_index: fin.profitability_index,
        bee_methodology_code: 'BEE-CCTS-M-04-RE',
        timeline_months: 12,
        feasibility_tier: 'HIGH',
        technology_readiness: 'TRL-9 Commercial',
        description: 'Utility-scale off-site group captive solar power wheeled through state Open Access framework.',
        key_assumptions: {
          capacity_mw: Number(solar_mw.toFixed(1)),
          annual_generation_mwh: Number(annual_gen_mwh.toFixed(0)),
          availability_pct: 98,
          grid_ef_used: grid_ef,
        },
      });
    }

    // ── 3. Thermal Biomass / Alternate Fuel Substitution (TSR) ──
    if (['cement', 'pulp_paper', 'textile'].includes(sec)) {
      const sub_tonnes_fuel = Math.min(25000, annual_production * 0.02);
      const capex = 18.0; // Pre-processing, shredding & burner modification
      const coal_landed_inr_per_tonne = 7800;
      const biomass_landed_inr_per_tonne = 4800;
      // Net landed fuel cost savings (scaled by calorific ratio ~0.70)
      const annual_savings_cr = (sub_tonnes_fuel * (coal_landed_inr_per_tonne - biomass_landed_inr_per_tonne / 0.70)) / 1e7;
      const annual_opex_cr = 1.20;
      const annual_abatement_tco2e = sub_tonnes_fuel * 1.82; // Displaced coal fossil emissions

      const fin = FinanceEngine.evaluateProject(
        capex,
        annual_opex_cr,
        Math.max(2.5, annual_savings_cr),
        annual_abatement_tco2e,
        9.5,
        10
      );

      opps.push({
        id: 'OPP-AFR-01',
        title: 'Alternate Fuel / Biomass Co-Processing System',
        category: 'FUEL_SWITCH',
        capex_cr: capex,
        annual_opex_change_cr: annual_opex_cr,
        annual_energy_savings_cr: Number(Math.max(2.5, annual_savings_cr).toFixed(2)),
        annual_reduction_tco2e: Number(annual_abatement_tco2e.toFixed(0)),
        payback_years: fin.simple_payback_years,
        npv_10yr_cr: fin.npv_cr,
        cost_per_tco2e: fin.mac_inr_per_tco2e,
        profitability_index: fin.profitability_index,
        bee_methodology_code: 'BEE-CCTS-M-02-FS',
        timeline_months: 14,
        feasibility_tier: 'MEDIUM',
        technology_readiness: 'TRL-9 Commercial',
        description: 'Replaces fossil coal with agricultural residue briquettes & RDF to achieve 15% Thermal Substitution Rate (TSR).',
      });
    }

    // Sort by NPV and Profitability Index
    return opps.sort((a, b) => b.npv_10yr_cr - a.npv_10yr_cr);
  }
}
