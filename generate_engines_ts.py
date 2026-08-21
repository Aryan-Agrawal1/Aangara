import os

carbon_ts = """export interface CalculationTrace {
  metric: string;
  formula: string;
  inputs: Record<string, any>;
  result: number;
  data_status: string;
  model_version: string;
}

export interface CarbonPosition {
  entity_id: string;
  reporting_year: string;
  output: number;
  output_unit: string;
  total_ghg_tco2e: number;
  actual_gei: number;
  target_gei: number;
  gei_delta: number;
  status: 'POTENTIAL_SURPLUS' | 'POTENTIAL_SHORTFALL';
  potential_surplus_tco2e: number;
  potential_shortfall_tco2e: number;
  calculation_trace: CalculationTrace[];
  data_status: string;
}

export class CarbonEngine {
  static calculatePosition(
    entity_id: string,
    reporting_year: string,
    output: number,
    output_unit: string,
    total_emissions_tco2e: number,
    target_gei: number,
    model_version = 'CA-MVP-1.0'
  ): CarbonPosition {
    if (output <= 0) output = 1.0;
    if (total_emissions_tco2e < 0) total_emissions_tco2e = 0.0;
    if (target_gei <= 0) target_gei = 0.72;

    const actual_gei = Number((total_emissions_tco2e / output).toFixed(4));
    const gei_delta = Number((actual_gei - target_gei).toFixed(4));

    const potential_surplus = Number((Math.max(0.0, target_gei - actual_gei) * output).toFixed(2));
    const potential_shortfall = Number((Math.max(0.0, actual_gei - target_gei) * output).toFixed(2));
    const status = gei_delta <= 0 ? 'POTENTIAL_SURPLUS' : 'POTENTIAL_SHORTFALL';

    const traces: CalculationTrace[] = [
      {
        metric: 'actual_gei',
        formula: 'total_ghg_tco2e / output',
        inputs: { total_ghg_tco2e: total_emissions_tco2e, output },
        result: actual_gei,
        data_status: 'CALCULATION',
        model_version
      },
      {
        metric: 'gei_delta',
        formula: 'actual_gei - target_gei',
        inputs: { actual_gei, target_gei },
        result: gei_delta,
        data_status: 'CALCULATION',
        model_version
      },
      {
        metric: gei_delta > 0 ? 'potential_shortfall_tco2e' : 'potential_surplus_tco2e',
        formula: gei_delta > 0 ? 'max(0, actual_gei - target_gei) * output' : 'max(0, target_gei - actual_gei) * output',
        inputs: { actual_gei, target_gei, output },
        result: gei_delta > 0 ? potential_shortfall : potential_surplus,
        data_status: 'CALCULATION',
        model_version
      }
    ];

    return {
      entity_id,
      reporting_year,
      output,
      output_unit,
      total_ghg_tco2e: total_emissions_tco2e,
      actual_gei,
      target_gei,
      gei_delta,
      status,
      potential_surplus_tco2e: potential_surplus,
      potential_shortfall_tco2e: potential_shortfall,
      calculation_trace: traces,
      data_status: 'CALCULATION'
    };
  }
}
"""

finance_ts = """export class FinanceEngine {
  static evaluateProject(
    capex_cr: number,
    annual_opex_change_cr: number,
    annual_energy_savings_cr: number,
    expected_reduction_tco2e: number,
    financing_rate_pct = 9.5,
    project_lifetime_years = 10
  ) {
    const net_annual_cashflow_cr = annual_energy_savings_cr - annual_opex_change_cr;
    const r = financing_rate_pct / 100.0;

    let npv_cr = -capex_cr;
    for (let yr = 1; yr <= project_lifetime_years; yr++) {
      npv_cr += net_annual_cashflow_cr / Math.pow(1.0 + r, yr);
    }

    const simple_payback_years = net_annual_cashflow_cr > 0 ? capex_cr / net_annual_cashflow_cr : 99.0;
    const total_abatement_10yr_tco2e = expected_reduction_tco2e * project_lifetime_years;
    const total_net_cost_cr = capex_cr + (annual_opex_change_cr - annual_energy_savings_cr) * project_lifetime_years;
    const mac_inr_per_tco2e = total_abatement_10yr_tco2e > 0 ? (total_net_cost_cr * 1e7) / total_abatement_10yr_tco2e : 0.0;

    return {
      net_annual_savings_cr: Number(net_annual_cashflow_cr.toFixed(2)),
      npv_cr: Number(npv_cr.toFixed(2)),
      simple_payback_years: Number(simple_payback_years.toFixed(1)),
      mac_inr_per_tco2e: Number(mac_inr_per_tco2e.toFixed(1)),
      total_abatement_10yr_tco2e: Number(total_abatement_10yr_tco2e.toFixed(0)),
      is_economically_viable: npv_cr > 0
    };
  }
}
"""

optimizer_ts = """import { FinanceEngine } from './finance';

export class CapitalOptimizer {
  static compareStrategies(params: {
    entity_output: number;
    baseline_emissions_tco2e: number;
    actual_gei: number;
    target_gei: number;
    project_capex_cr: number;
    project_opex_change_cr: number;
    project_energy_savings_cr: number;
    project_reduction_tco2e: number;
    ccc_price_inr?: number;
    project_output_delivery_pct?: number;
    project_delay_months?: number;
    financing_rate_pct?: number;
    mrv_score?: number;
  }) {
    const {
      entity_output,
      baseline_emissions_tco2e,
      actual_gei,
      target_gei,
      project_capex_cr,
      project_opex_change_cr,
      project_energy_savings_cr,
      project_reduction_tco2e,
      ccc_price_inr = 1000.0,
      project_output_delivery_pct = 100.0,
      project_delay_months = 0,
      financing_rate_pct = 9.5,
      mrv_score = 85.0
    } = params;

    const base_shortfall_tco2e = Math.max(0.0, actual_gei - target_gei) * entity_output;
    const effective_reduction_tco2e = project_reduction_tco2e * (project_output_delivery_pct / 100.0);

    // 1. BUY Strategy
    const buy_cost_annual_cr = (base_shortfall_tco2e * ccc_price_inr * 1.015) / 1e7;
    const buy_cost_3yr_cr = buy_cost_annual_cr * 3.0;
    const buy_risk = 68.0;

    // 2. BUILD Strategy
    const build_emissions = baseline_emissions_tco2e - effective_reduction_tco2e;
    const build_post_gei = Number((build_emissions / Math.max(1, entity_output)).toFixed(4));
    const build_residual_shortfall = Math.max(0.0, build_post_gei - target_gei) * entity_output;
    const delay_factor = Math.max(0.0, 1.0 - project_delay_months / 12.0);
    const year1_savings = project_energy_savings_cr * delay_factor;
    const effective_annual_savings = (year1_savings + project_energy_savings_cr * 2) / 3.0;

    const build_eval = FinanceEngine.evaluateProject(
      project_capex_cr,
      project_opex_change_cr,
      effective_annual_savings,
      effective_reduction_tco2e,
      financing_rate_pct
    );
    const uncovered_cost_3yr = (build_residual_shortfall * ccc_price_inr * 3.0) / 1e7;
    const build_cost_3yr_cr = project_capex_cr + (project_opex_change_cr - effective_annual_savings) * 3.0 + uncovered_cost_3yr;
    const build_risk = 35.0 + project_delay_months * 2.5;

    // 3. HYBRID Strategy
    const residual_ccc_procured = build_residual_shortfall;
    const residual_ccc_cost_3yr_cr = (residual_ccc_procured * ccc_price_inr * 1.015 * 3.0) / 1e7;
    const hybrid_cost_3yr_cr = project_capex_cr + (project_opex_change_cr - effective_annual_savings) * 3.0 + residual_ccc_cost_3yr_cr;
    const hybrid_risk = 25.0 + project_delay_months * 1.5;

    // Scoring
    const max_cost = Math.max(buy_cost_3yr_cr, build_cost_3yr_cr, hybrid_cost_3yr_cr, 1.0);
    const min_cost = Math.min(buy_cost_3yr_cr, build_cost_3yr_cr, hybrid_cost_3yr_cr);
    const calc_fin = (c: number) => Math.max(10.0, 100.0 - ((c - min_cost) / (max_cost - min_cost + 0.01)) * 80.0);

    const buy_fin = calc_fin(buy_cost_3yr_cr);
    const build_fin = calc_fin(build_cost_3yr_cr);
    const hybrid_fin = calc_fin(hybrid_cost_3yr_cr);

    const buy_clim = 10.0;
    const build_clim = Math.min(100.0, (effective_reduction_tco2e / Math.max(1.0, base_shortfall_tco2e)) * 85.0 + 15.0);
    const hybrid_clim = build_clim;

    const buy_comp = 85.0;
    const build_comp = build_residual_shortfall > 0 ? 60.0 : 95.0;
    const hybrid_comp = 95.0;

    const buy_score = Number((0.35 * buy_fin + 0.25 * buy_clim + 0.20 * buy_comp + 0.10 * 70.0 + 0.10 * 90.0).toFixed(1));
    const build_score = Number((0.35 * build_fin + 0.25 * build_clim + 0.20 * build_comp + 0.10 * mrv_score + 0.10 * Math.max(20, 80 - project_delay_months * 4)).toFixed(1));
    const hybrid_score = Number((0.35 * hybrid_fin + 0.25 * hybrid_clim + 0.20 * hybrid_comp + 0.10 * mrv_score + 0.10 * Math.max(30, 85 - project_delay_months * 3)).toFixed(1));

    let recommended = 'HYBRID';
    let maxScore = hybrid_score;
    if (build_score > maxScore && build_residual_shortfall === 0) {
      recommended = 'BUILD';
      maxScore = build_score;
    } else if (buy_score > maxScore) {
      recommended = 'BUY';
      maxScore = buy_score;
    }

    const strategies = {
      BUY: {
        strategy_id: 'BUY',
        name: 'Market CCC Procurement Only',
        total_cost_3yr_cr: Number(buy_cost_3yr_cr.toFixed(2)),
        annual_cost_cr: Number(buy_cost_annual_cr.toFixed(2)),
        capex_cr: 0.0,
        internal_abatement_tco2e: 0.0,
        ccc_procured_tco2e: Number(base_shortfall_tco2e.toFixed(0)),
        post_intervention_gei: actual_gei,
        npv_cr: Number((-buy_cost_3yr_cr).toFixed(2)),
        risk_score: buy_risk,
        utility_score: buy_score,
        is_recommended: recommended === 'BUY'
      },
      BUILD: {
        strategy_id: 'BUILD',
        name: 'Internal Decarbonisation Project',
        total_cost_3yr_cr: Number(build_cost_3yr_cr.toFixed(2)),
        annual_cost_cr: Number(((build_cost_3yr_cr - project_capex_cr) / 3.0).toFixed(2)),
        capex_cr: project_capex_cr,
        internal_abatement_tco2e: Number(effective_reduction_tco2e.toFixed(0)),
        ccc_procured_tco2e: 0.0,
        post_intervention_gei: build_post_gei,
        npv_cr: build_eval.npv_cr,
        payback_years: build_eval.simple_payback_years,
        risk_score: Number(build_risk.toFixed(1)),
        utility_score: build_score,
        is_recommended: recommended === 'BUILD'
      },
      HYBRID: {
        strategy_id: 'HYBRID',
        name: 'Hybrid: Project Execution + Residual CCC Hedge',
        total_cost_3yr_cr: Number(hybrid_cost_3yr_cr.toFixed(2)),
        annual_cost_cr: Number(((hybrid_cost_3yr_cr - project_capex_cr) / 3.0).toFixed(2)),
        capex_cr: project_capex_cr,
        internal_abatement_tco2e: Number(effective_reduction_tco2e.toFixed(0)),
        ccc_procured_tco2e: Number(residual_ccc_procured.toFixed(0)),
        post_intervention_gei: build_post_gei,
        npv_cr: build_eval.npv_cr,
        payback_years: build_eval.simple_payback_years,
        risk_score: Number(hybrid_risk.toFixed(1)),
        utility_score: hybrid_score,
        is_recommended: recommended === 'HYBRID'
      }
    };

    return {
      strategies,
      recommended_strategy: recommended,
      recommendation_reason: recommended === 'HYBRID' 
        ? 'Optimal risk-adjusted posture combining internal energy savings with targeted compliance hedge.' 
        : (recommended === 'BUILD' ? 'Full internal abatement eliminates long-term compliance liabilities with positive NPV.' : 'Least upfront capital requirement for immediate compliance cycle.'),
      assumptions_applied: {
        ccc_price_inr,
        project_output_delivery_pct,
        project_delay_months,
        financing_rate_pct,
        mrv_score
      }
    };
  }
}
"""

opportunities_ts = """export interface Opportunity {
  id: string;
  title: string;
  category: string;
  capex_cr: number;
  annual_opex_change_cr: number;
  annual_energy_savings_cr: number;
  annual_reduction_tco2e: number;
  payback_years: number;
  npv_10yr_cr: number;
  cost_per_tco2e: number;
  bee_methodology_code: string;
  timeline_months: number;
  feasibility_tier: string;
  technology_readiness: string;
  description: string;
}

export class OpportunityEngine {
  static identifyOpportunities(params: {
    sector: string;
    annual_production: number;
    current_emissions_tco2e: number;
    actual_gei: number;
    electricity_mwh: number;
    renewable_pct: number;
    whrs_mw: number;
  }): Opportunity[] {
    const { sector, annual_production, current_emissions_tco2e, electricity_mwh, renewable_pct, whrs_mw } = params;
    const sec = sector.toLowerCase();

    const opps: Opportunity[] = [];

    // 1. WHRS
    if (['cement', 'iron_steel', 'refinery'].includes(sec) && whrs_mw < 10) {
      const pot_mw = sec === 'cement' ? Math.max(5.0, (annual_production / 1e6) * 8.0) : 15.0;
      const capex = pot_mw * 8.5;
      const gen_mwh = pot_mw * 7500;
      const savings = (gen_mwh * 6500) / 1e7;
      const red = gen_mwh * 0.716;
      const npv = savings * 6.5 - capex;
      opps.push({
        id: 'OPP-WHRS-01',
        title: `Waste Heat Recovery System (${pot_mw.toFixed(1)} MW)`,
        category: 'ENERGY_EFFICIENCY',
        capex_cr: Number(capex.toFixed(1)),
        annual_opex_change_cr: Number((capex * 0.03).toFixed(2)),
        annual_energy_savings_cr: Number(savings.toFixed(2)),
        annual_reduction_tco2e: Number(red.toFixed(0)),
        payback_years: Number((capex / savings).toFixed(1)),
        npv_10yr_cr: Number(npv.toFixed(1)),
        cost_per_tco2e: Number(((capex * 1e7) / (red * 10)).toFixed(0)),
        bee_methodology_code: 'BEE-CCTS-M-01-EE',
        timeline_months: 18,
        feasibility_tier: 'HIGH',
        technology_readiness: 'TRL-9 Commercial',
        description: 'Captures pre-heater and cooler exhaust gas to generate captive power, displacing grid electricity.'
      });
    }

    // 2. Renewable PPA / Captive Solar-Wind
    if (renewable_pct < 50) {
      const target_ren_pct = 50.0;
      const add_pct = target_ren_pct - renewable_pct;
      const add_mwh = electricity_mwh * (add_pct / 100.0);
      const solar_mw = add_mwh / 1750.0;
      const capex = solar_mw * 3.8;
      const savings = (add_mwh * 2.2) / 1e7;
      const red = add_mwh * 0.716;
      const npv = savings * 7.0 - capex;
      opps.push({
        id: 'OPP-RE-02',
        title: `Group Captive Solar-Wind Hybrid (${solar_mw.toFixed(1)} MWp)`,
        category: 'FUEL_SWITCHING',
        capex_cr: Number(capex.toFixed(1)),
        annual_opex_change_cr: Number((capex * 0.015).toFixed(2)),
        annual_energy_savings_cr: Number(savings.toFixed(2)),
        annual_reduction_tco2e: Number(red.toFixed(0)),
        payback_years: Number((capex / savings).toFixed(1)),
        npv_10yr_cr: Number(npv.toFixed(1)),
        cost_per_tco2e: Number(((capex * 1e7) / (red * 10)).toFixed(0)),
        bee_methodology_code: 'BEE-CCTS-M-02-RE',
        timeline_months: 12,
        feasibility_tier: 'VERY_HIGH',
        technology_readiness: 'TRL-9 Commercial',
        description: 'Open access green tariff and hybrid group captive RE sourcing to achieve Scope 2 decarbonisation.'
      });
    }

    // 3. Sector Specific Process Upgrade
    if (sec === 'cement') {
      const red = annual_production * 0.08 * 0.525;
      opps.push({
        id: 'OPP-CEM-LC3',
        title: 'Low-Clinker LC3 / Composite Cement Transition',
        category: 'PROCESS_UPGRADE',
        capex_cr: 18.5,
        annual_opex_change_cr: -4.2,
        annual_energy_savings_cr: 8.5,
        annual_reduction_tco2e: Number(red.toFixed(0)),
        payback_years: 1.5,
        npv_10yr_cr: 64.2,
        cost_per_tco2e: 420.0,
        bee_methodology_code: 'BEE-CCTS-M-04-PROCESS',
        timeline_months: 9,
        feasibility_tier: 'HIGH',
        technology_readiness: 'TRL-8 Scaled',
        description: 'Blended limestone calcined clay formulation reducing clinker factor from 74% to 58%.'
      });
    } else if (sec === 'iron_steel') {
      opps.push({
        id: 'OPP-STL-DRI',
        title: 'Top Gas Recovery Turbine & Coal Moisture Control',
        category: 'PROCESS_UPGRADE',
        capex_cr: 42.0,
        annual_opex_change_cr: 1.2,
        annual_energy_savings_cr: 14.8,
        annual_reduction_tco2e: 38000,
        payback_years: 3.1,
        npv_10yr_cr: 58.4,
        cost_per_tco2e: 1100.0,
        bee_methodology_code: 'BEE-CCTS-M-03-STEEL',
        timeline_months: 24,
        feasibility_tier: 'MODERATE',
        technology_readiness: 'TRL-9 Commercial',
        description: 'Installation of TRT on Blast Furnace top gas to recover kinetic and pressure energy.'
      });
    } else {
      opps.push({
        id: 'OPP-GEN-VFD',
        title: 'VFD Retrofits & Premium Efficiency IE4 Motor Drives',
        category: 'ENERGY_EFFICIENCY',
        capex_cr: 8.5,
        annual_opex_change_cr: 0.2,
        annual_energy_savings_cr: 3.8,
        annual_reduction_tco2e: 4100,
        payback_years: 2.3,
        npv_10yr_cr: 16.5,
        cost_per_tco2e: 2070.0,
        bee_methodology_code: 'BEE-CCTS-M-01-EE',
        timeline_months: 6,
        feasibility_tier: 'VERY_HIGH',
        technology_readiness: 'TRL-9 Commercial',
        description: 'Replacement of standard motors with IE4 Super Premium Efficiency motors with intelligent VFD controls.'
      });
    }

    return opps;
  }
}
"""

with open("lib/engines/carbon.ts", "w", encoding="utf-8") as f:
    f.write(carbon_ts)
with open("lib/engines/finance.ts", "w", encoding="utf-8") as f:
    f.write(finance_ts)
with open("lib/engines/optimizer.ts", "w", encoding="utf-8") as f:
    f.write(optimizer_ts)
with open("lib/engines/opportunities.ts", "w", encoding="utf-8") as f:
    f.write(opportunities_ts)

print("Engine files written successfully!")