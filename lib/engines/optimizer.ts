import { FinanceEngine } from './finance';

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
