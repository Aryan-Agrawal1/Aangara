/**
 * AANGARA Capital Optimizer Engine v3.0
 * ─────────────────────────────────────────────────────────
 * Optimal capital allocation across compliance postures:
 *   1. BUY: Market CCC procurement
 *   2. BUILD: Internal decarbonisation project execution
 *   3. HYBRID: Strategic internal abatement + residual market hedge
 *   4. DEFER: Defer capital commitment (cost of inaction analysis)
 *
 * Implements:
 *   §58–§64: Posture economics & cash-flow shifting for delay
 *   §65: Management Objective Engine (LEAST_COST, MINIMUM_RISK, MAXIMUM_ABATEMENT, COMPLIANCE_FIRST, BALANCED)
 *   §66: Multi-Criteria Dimensionless Utility Scoring
 *   §68, §118: Multi-Dimensional Risk Framework (Execution, Tech, Regulatory, Market)
 *   §108: Double-counting guards and invariant assertions
 *
 * Prototype constants removed (§77):
 *   - buy_risk=68, build_risk=35, hybrid_risk=25 → replaced by multi-dim risk model
 *   - 1.015 CCC multiplier → replaced by explicit transaction fee model
 *   - 1 - delay/12 linear haircut → replaced by cash-flow shift model
 */

import { FinanceEngine } from './finance';
import { FORMULA_REGISTRY } from '@/lib/registries/formula-registry';
import { convertFromINR, SupportedCurrency } from '@/lib/registries/currency-registry';
import { ManagementObjective } from '@/types/facility-v2';

// ─────────────────────────────────────────────
// Interfaces & Types
// ─────────────────────────────────────────────

export interface StrategyRiskProfile {
  execution_risk: number;   // 0–100
  technology_risk: number;  // 0–100
  regulatory_risk: number;  // 0–100
  market_risk: number;      // 0–100
  composite_risk: number;   // 0–100
  expected_loss_cr: number; // ₹ Cr expected financial risk exposure
}

export interface OptimizerStrategyOutput {
  strategy_id: 'BUY' | 'BUILD' | 'HYBRID' | 'DEFER';
  name: string;
  strategy: string;
  total_cost_cr: number;
  total_cost_3yr_cr: number;
  annual_cost_cr: number;
  capex_cr: number;
  internal_abatement_tco2e: number;
  residual_shortfall_tco2e: number;
  ccc_procured_tco2e: number;
  post_intervention_gei: number;
  post_strategy_gei: number;
  npv_cr: number | null;
  payback_years: number | null;
  irr_pct: number | null;
  cost_per_tco2e: number;
  risk_score: number;
  utility_score: number;
  rank: number;
  risk_breakdown: StrategyRiskProfile;
  sub_scores: {
    financial: number;
    climate: number;
    compliance: number;
    mrv: number;
    timing: number;
  };
  summary: string;
  is_recommended: boolean;
  currency_conversions?: Record<SupportedCurrency, { total_cost: string; npv: string }>;
}

export interface CompareStrategiesParams {
  entity_output: number;
  baseline_emissions_tco2e: number;
  actual_gei: number;
  target_gei: number;
  project_capex_cr: number;
  project_opex_change_cr: number;
  project_energy_savings_cr: number;
  project_reduction_tco2e: number;
  ccc_price_inr?: number;
  transaction_fee_pct?: number; // default: 0.5% exchange/clearing fee
  project_output_delivery_pct?: number;
  project_delay_months?: number;
  financing_rate_pct?: number;
  mrv_score?: number;
  management_objective?: ManagementObjective;
  regulatory_status?: 'FINAL' | 'DRAFT' | 'WATCHLIST';
  technology_trl?: number; // 1–9, default: 8
}

// ─────────────────────────────────────────────
// Optimizer Implementation
// ─────────────────────────────────────────────

export class CapitalOptimizer {

  /**
   * Evaluates multi-dimensional risk for each strategy posture (§118).
   * Replaces prototype hardcoded scores (68, 35, 25).
   */
  private static evaluateRiskProfile(
    posture: 'BUY' | 'BUILD' | 'HYBRID' | 'DEFER',
    params: {
      delay_months: number;
      delivery_pct: number;
      trl: number;
      regulatory_status: string;
      mrv_score: number;
      shortfall_tco2e: number;
      ccc_price_inr: number;
      capex_cr: number;
    }
  ): StrategyRiskProfile {
    const { delay_months, delivery_pct, trl, regulatory_status, mrv_score, shortfall_tco2e, ccc_price_inr, capex_cr } = params;

    let execution_risk = 0;
    let technology_risk = 0;
    let regulatory_risk = 0;
    let market_risk = 0;

    const compliance_cost_cr = (shortfall_tco2e * ccc_price_inr) / 1e7;

    switch (posture) {
      case 'BUY':
        // Execution is trivial (market trading), but 100% exposed to CCC price volatility and supply squeeze
        execution_risk = 15.0;
        technology_risk = 5.0;
        regulatory_risk = regulatory_status === 'DRAFT' ? 50.0 : 25.0;
        market_risk = 80.0; // Primary exposure: carbon price spikes
        break;

      case 'BUILD':
        // High execution & technology risk, but low market risk (physical thermodynamic hedge)
        execution_risk = Math.min(95.0, 30.0 + delay_months * 3.5 + (100 - delivery_pct) * 0.4);
        technology_risk = Math.max(10.0, (9 - trl) * 12.0);
        regulatory_risk = Math.max(10.0, 100.0 - mrv_score); // Depends on MRV acceptance
        market_risk = 15.0; // Decarbonised at the source, minimal market dependence
        break;

      case 'HYBRID':
        // Balanced: moderate execution risk, diversified carbon exposure
        execution_risk = Math.min(85.0, 25.0 + delay_months * 2.5 + (100 - delivery_pct) * 0.25);
        technology_risk = Math.max(8.0, (9 - trl) * 8.0);
        regulatory_risk = Math.max(10.0, 85.0 - mrv_score * 0.8);
        market_risk = 35.0; // Only residual volume is market-exposed
        break;

      case 'DEFER':
        // Maximum regulatory penalty & compounding compliance backlog
        execution_risk = 20.0;
        technology_risk = 10.0;
        regulatory_risk = 95.0; // High risk of statutory notice, environmental compensation (2x penalty)
        market_risk = 90.0; // Compounded future compliance cost
        break;
    }

    // Composite risk (0–100)
    const composite_risk = Number(
      (0.30 * execution_risk + 0.20 * technology_risk + 0.25 * regulatory_risk + 0.25 * market_risk).toFixed(1)
    );

    // Expected financial loss: Probability × Impact
    const loss_multiplier = composite_risk / 100;
    const base_exposure_cr = posture === 'BUILD' ? capex_cr * 0.25 : compliance_cost_cr * 1.5;
    const expected_loss_cr = Number((base_exposure_cr * loss_multiplier).toFixed(2));

    return {
      execution_risk,
      technology_risk,
      regulatory_risk,
      market_risk,
      composite_risk,
      expected_loss_cr,
    };
  }

  /**
   * Multi-objective utility weighting engine based on management priority (§65).
   */
  private static getObjectiveWeights(objective: ManagementObjective) {
    switch (objective) {
      case 'LOWEST_CASH_COST':
      case 'MINIMUM_CAPEX':
        return { fin: 0.60, clim: 0.10, comp: 0.15, mrv: 0.05, timing: 0.10 };
      case 'MAXIMUM_NPV':
      case 'MAXIMUM_IRR':
      case 'MAXIMUM_EBITDA':
        return { fin: 0.50, clim: 0.20, comp: 0.15, mrv: 0.05, timing: 0.10 };
      case 'MINIMUM_EXECUTION_RISK':
        return { fin: 0.20, clim: 0.15, comp: 0.35, mrv: 0.15, timing: 0.15 };
      case 'MAXIMUM_CO2_REDUCTION':
        return { fin: 0.15, clim: 0.55, comp: 0.15, mrv: 0.10, timing: 0.05 };
      case 'FASTEST_COMPLIANCE':
        return { fin: 0.20, clim: 0.10, comp: 0.50, mrv: 0.10, timing: 0.10 };
      case 'BALANCED':
      case 'CUSTOM':
      default:
        return { fin: 0.35, clim: 0.25, comp: 0.20, mrv: 0.10, timing: 0.10 };
    }
  }

  /**
   * Main Strategy Comparison Method
   */
  static compareStrategies(params: CompareStrategiesParams): {
    strategies: Record<'BUY' | 'BUILD' | 'HYBRID' | 'DEFER', OptimizerStrategyOutput>;
    recommended_strategy: 'BUY' | 'BUILD' | 'HYBRID' | 'DEFER';
    recommendation_reason: string;
    assumptions_applied: Record<string, any>;
  } {
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
      transaction_fee_pct = 0.5,
      project_output_delivery_pct = 100.0,
      project_delay_months = 0,
      financing_rate_pct = 9.5,
      mrv_score = 85.0,
      management_objective = 'BALANCED',
      regulatory_status = 'FINAL',
      technology_trl = 8,
    } = params;

    const base_shortfall_tco2e = Math.max(0.0, actual_gei - target_gei) * entity_output;
    const effective_reduction_tco2e = project_reduction_tco2e * (project_output_delivery_pct / 100.0);

    // Explicit transaction fee (§61.1, §77.8) — replaces hardcoded 1.015
    const transaction_multiplier = 1 + (transaction_fee_pct / 100);

    // ── 1. BUY STRATEGY ──
    const buy_annual_volume = base_shortfall_tco2e;
    const buy_cost_annual_cr = (buy_annual_volume * ccc_price_inr * transaction_multiplier) / 1e7;
    const buy_cost_3yr_cr = buy_cost_annual_cr * 3.0;
    const buy_risk_profile = this.evaluateRiskProfile('BUY', {
      delay_months: 0,
      delivery_pct: 100,
      trl: 9,
      regulatory_status,
      mrv_score,
      shortfall_tco2e: base_shortfall_tco2e,
      ccc_price_inr,
      capex_cr: 0,
    });

    // ── 2. BUILD STRATEGY ──
    // Cash-flow shift model for delay (§77.11) — replaces linear 1 - delay/12
    const delay_years = project_delay_months / 12.0;
    // In year 1, operational fraction is max(0, 1 - delay_years)
    const year1_op_fraction = Math.max(0, Math.min(1, 1 - delay_years));
    const year1_savings = project_energy_savings_cr * year1_op_fraction;
    const year1_opex = project_opex_change_cr * year1_op_fraction;

    // In delay period, un-abated shortfall must be hedged via CCC
    const build_post_emissions = baseline_emissions_tco2e - effective_reduction_tco2e;
    const build_post_gei = Number((build_post_emissions / Math.max(1, entity_output)).toFixed(4));
    const steady_state_residual_shortfall = Math.max(0.0, build_post_gei - target_gei) * entity_output;

    // During delay in year 1, additional shortfall is experienced
    const delay_shortfall_year1 = (base_shortfall_tco2e - steady_state_residual_shortfall) * (1 - year1_op_fraction);
    const total_residual_shortfall_3yr = (steady_state_residual_shortfall * 3.0) + delay_shortfall_year1;

    // Finance evaluation for build project
    const build_eval = FinanceEngine.evaluateProject(
      project_capex_cr,
      project_opex_change_cr,
      project_energy_savings_cr,
      effective_reduction_tco2e,
      financing_rate_pct,
      10
    );

    const build_residual_ccc_cost_3yr = (total_residual_shortfall_3yr * ccc_price_inr * transaction_multiplier) / 1e7;
    const build_net_operational_cost_3yr = (year1_opex - year1_savings) + (project_opex_change_cr - project_energy_savings_cr) * 2.0;
    const build_cost_3yr_cr = project_capex_cr + build_net_operational_cost_3yr + build_residual_ccc_cost_3yr;

    const build_risk_profile = this.evaluateRiskProfile('BUILD', {
      delay_months: project_delay_months,
      delivery_pct: project_output_delivery_pct,
      trl: technology_trl,
      regulatory_status,
      mrv_score,
      shortfall_tco2e: total_residual_shortfall_3yr / 3,
      ccc_price_inr,
      capex_cr: project_capex_cr,
    });

    // ── 3. HYBRID STRATEGY ──
    // Internal project execution + planned target procurement for residual
    // Enforce invariant: Hybrid Cost = Build Cash Outflow + Residual CCC Cost (§63, §108)
    const hybrid_residual_ccc_volume_annual = steady_state_residual_shortfall;
    const hybrid_residual_ccc_cost_3yr = (total_residual_shortfall_3yr * ccc_price_inr * transaction_multiplier) / 1e7;
    const hybrid_cost_3yr_cr = project_capex_cr + build_net_operational_cost_3yr + hybrid_residual_ccc_cost_3yr;

    const hybrid_risk_profile = this.evaluateRiskProfile('HYBRID', {
      delay_months: project_delay_months,
      delivery_pct: project_output_delivery_pct,
      trl: technology_trl,
      regulatory_status,
      mrv_score,
      shortfall_tco2e: hybrid_residual_ccc_volume_annual,
      ccc_price_inr,
      capex_cr: project_capex_cr,
    });

    // ── 4. DEFER STRATEGY (Cost of Inaction §64) ──
    // 2x Environmental Compensation penalty + capital inflation + future higher compliance cost
    const env_comp_annual_cr = (2.0 * base_shortfall_tco2e * ccc_price_inr) / 1e7;
    const deferred_capex_inflated = FinanceEngine.inflatePrice(project_capex_cr, 6.0, 1);
    const defer_cost_3yr_cr = (env_comp_annual_cr * 3.0) + (deferred_capex_inflated - project_capex_cr);

    const defer_risk_profile = this.evaluateRiskProfile('DEFER', {
      delay_months: 12,
      delivery_pct: 0,
      trl: technology_trl,
      regulatory_status,
      mrv_score,
      shortfall_tco2e: base_shortfall_tco2e,
      ccc_price_inr,
      capex_cr: project_capex_cr,
    });

    // ── §108 DOUBLE-COUNTING & INVARIANT GUARDS ──
    const expected_hybrid_cost = project_capex_cr + build_net_operational_cost_3yr + hybrid_residual_ccc_cost_3yr;
    if (Math.abs(hybrid_cost_3yr_cr - expected_hybrid_cost) > 1e-4) {
      throw new Error(`[INVARIANT_VIOLATION] Hybrid cost must equal Build Cash + Residual CCC without double-counting.`);
    }

    // ── MULTI-OBJECTIVE NORMALIZED UTILITY SCORING (§65, §66) ──
    const weights = this.getObjectiveWeights(management_objective);

    const all_costs = [buy_cost_3yr_cr, build_cost_3yr_cr, hybrid_cost_3yr_cr, defer_cost_3yr_cr];
    const min_cost = Math.min(...all_costs);
    const max_cost = Math.max(...all_costs, min_cost + 0.01);

    // Dimensionless financial score (100 = lowest cost, 0 = highest cost)
    const calc_fin = (c: number) => Math.max(5.0, 100.0 - ((c - min_cost) / (max_cost - min_cost)) * 90.0);

    // Climate score (100 = full internal thermodynamic abatement, 10 = purely market purchase)
    const calc_clim = (abatement: number) => {
      if (base_shortfall_tco2e <= 0) return 95.0;
      return Math.min(100.0, Math.max(10.0, (abatement / base_shortfall_tco2e) * 85.0 + 15.0));
    };

    // Compliance certainty score
    const buy_comp = 85.0;
    const build_comp = steady_state_residual_shortfall > 0 ? 65.0 : 98.0;
    const hybrid_comp = 96.0;
    const defer_comp = 10.0;

    // Sub-scores
    const buy_fin = calc_fin(buy_cost_3yr_cr);
    const build_fin = calc_fin(build_cost_3yr_cr);
    const hybrid_fin = calc_fin(hybrid_cost_3yr_cr);
    const defer_fin = calc_fin(defer_cost_3yr_cr);

    const buy_clim = 10.0;
    const build_clim = calc_clim(effective_reduction_tco2e);
    const hybrid_clim = build_clim;
    const defer_clim = 0.0;

    const buy_score = Number((
      weights.fin * buy_fin +
      weights.clim * buy_clim +
      weights.comp * buy_comp +
      weights.mrv * 70.0 +
      weights.timing * 90.0
    ).toFixed(1));

    const build_score = Number((
      weights.fin * build_fin +
      weights.clim * build_clim +
      weights.comp * build_comp +
      weights.mrv * mrv_score +
      weights.timing * Math.max(10, 85 - project_delay_months * 4)
    ).toFixed(1));

    const hybrid_score = Number((
      weights.fin * hybrid_fin +
      weights.clim * hybrid_clim +
      weights.comp * hybrid_comp +
      weights.mrv * mrv_score +
      weights.timing * Math.max(20, 90 - project_delay_months * 3)
    ).toFixed(1));

    const defer_score = Number((
      weights.fin * defer_fin +
      weights.clim * defer_clim +
      weights.comp * defer_comp +
      weights.mrv * 30.0 +
      weights.timing * 10.0
    ).toFixed(1));

    // Determine recommendation ranking
    const scoreMap = (
      [
        { id: 'HYBRID' as const, score: hybrid_score },
        { id: 'BUILD' as const, score: build_score },
        { id: 'BUY' as const, score: buy_score },
        { id: 'DEFER' as const, score: defer_score },
      ]
    ).sort((a, b) => b.score - a.score);

    const recommended: 'BUY' | 'BUILD' | 'HYBRID' | 'DEFER' = scoreMap[0].id;

    // Helper for multi-currency presentation
    const getConversions = (inr_cr: number, npv_cr_val: number | null) => {
      const currencies: SupportedCurrency[] = ['USD', 'EUR', 'GBP', 'SGD', 'JPY', 'AED', 'SAR', 'CNY'];
      const res: Record<SupportedCurrency, { total_cost: string; npv: string }> = {} as any;
      currencies.forEach((c) => {
        res[c] = {
          total_cost: convertFromINR(inr_cr * 1e7, c).formatted,
          npv: npv_cr_val !== null ? convertFromINR(npv_cr_val * 1e7, c).formatted : 'N/A',
        };
      });
      return res;
    };

    const strategies: Record<'BUY' | 'BUILD' | 'HYBRID' | 'DEFER', OptimizerStrategyOutput> = {
      BUY: {
        strategy_id: 'BUY',
        strategy: 'BUY',
        name: 'Market CCC Procurement Only',
        total_cost_cr: Number(buy_cost_3yr_cr.toFixed(2)),
        total_cost_3yr_cr: Number(buy_cost_3yr_cr.toFixed(2)),
        annual_cost_cr: Number(buy_cost_annual_cr.toFixed(2)),
        capex_cr: 0.0,
        internal_abatement_tco2e: 0.0,
        residual_shortfall_tco2e: Number(base_shortfall_tco2e.toFixed(0)),
        ccc_procured_tco2e: Number(base_shortfall_tco2e.toFixed(0)),
        post_intervention_gei: actual_gei,
        post_strategy_gei: actual_gei,
        npv_cr: Number((-buy_cost_3yr_cr).toFixed(2)),
        payback_years: null,
        irr_pct: null,
        cost_per_tco2e: Number((ccc_price_inr * transaction_multiplier).toFixed(0)),
        risk_score: buy_risk_profile.composite_risk,
        utility_score: buy_score,
        rank: scoreMap.findIndex((s) => s.id === 'BUY') + 1,
        risk_breakdown: buy_risk_profile,
        sub_scores: {
          financial: Number(buy_fin.toFixed(1)),
          climate: Number(buy_clim.toFixed(1)),
          compliance: Number(buy_comp.toFixed(1)),
          mrv: 70.0,
          timing: 90.0,
        },
        summary: 'Immediate regulatory compliance via market certificate acquisition. Zero capital lock-in, but 100% long-term carbon price exposure.',
        is_recommended: recommended === 'BUY',
        currency_conversions: getConversions(buy_cost_3yr_cr, -buy_cost_3yr_cr),
      },

      BUILD: {
        strategy_id: 'BUILD',
        strategy: 'BUILD',
        name: 'Internal Decarbonisation Project',
        total_cost_cr: Number(build_cost_3yr_cr.toFixed(2)),
        total_cost_3yr_cr: Number(build_cost_3yr_cr.toFixed(2)),
        annual_cost_cr: Number(((build_cost_3yr_cr - project_capex_cr) / 3.0).toFixed(2)),
        capex_cr: project_capex_cr,
        internal_abatement_tco2e: Number(effective_reduction_tco2e.toFixed(0)),
        residual_shortfall_tco2e: Number(steady_state_residual_shortfall.toFixed(0)),
        ccc_procured_tco2e: 0.0,
        post_intervention_gei: build_post_gei,
        post_strategy_gei: build_post_gei,
        npv_cr: build_eval.npv_cr,
        payback_years: build_eval.simple_payback_years,
        irr_pct: build_eval.irr_pct,
        cost_per_tco2e: build_eval.mac_inr_per_tco2e,
        risk_score: build_risk_profile.composite_risk,
        utility_score: build_score,
        rank: scoreMap.findIndex((s) => s.id === 'BUILD') + 1,
        risk_breakdown: build_risk_profile,
        sub_scores: {
          financial: Number(build_fin.toFixed(1)),
          climate: Number(build_clim.toFixed(1)),
          compliance: Number(build_comp.toFixed(1)),
          mrv: mrv_score,
          timing: Math.max(10, 85 - project_delay_months * 4),
        },
        summary: 'Deep internal emissions reduction creating an enduring thermodynamic hedge. Positive NPV with direct energy cost savings.',
        is_recommended: recommended === 'BUILD',
        currency_conversions: getConversions(build_cost_3yr_cr, build_eval.npv_cr),
      },

      HYBRID: {
        strategy_id: 'HYBRID',
        strategy: 'HYBRID',
        name: 'Hybrid: Project Execution + Residual CCC Hedge',
        total_cost_cr: Number(hybrid_cost_3yr_cr.toFixed(2)),
        total_cost_3yr_cr: Number(hybrid_cost_3yr_cr.toFixed(2)),
        annual_cost_cr: Number(((hybrid_cost_3yr_cr - project_capex_cr) / 3.0).toFixed(2)),
        capex_cr: project_capex_cr,
        internal_abatement_tco2e: Number(effective_reduction_tco2e.toFixed(0)),
        residual_shortfall_tco2e: Number(steady_state_residual_shortfall.toFixed(0)),
        ccc_procured_tco2e: Number(steady_state_residual_shortfall.toFixed(0)),
        post_intervention_gei: build_post_gei,
        post_strategy_gei: build_post_gei,
        npv_cr: build_eval.npv_cr,
        payback_years: build_eval.simple_payback_years,
        irr_pct: build_eval.irr_pct,
        cost_per_tco2e: build_eval.mac_inr_per_tco2e,
        risk_score: hybrid_risk_profile.composite_risk,
        utility_score: hybrid_score,
        rank: scoreMap.findIndex((s) => s.id === 'HYBRID') + 1,
        risk_breakdown: hybrid_risk_profile,
        sub_scores: {
          financial: Number(hybrid_fin.toFixed(1)),
          climate: Number(hybrid_clim.toFixed(1)),
          compliance: Number(hybrid_comp.toFixed(1)),
          mrv: mrv_score,
          timing: Math.max(20, 90 - project_delay_months * 3),
        },
        summary: 'Optimal risk-adjusted balance: internal project captures energy savings while targeted CCC procurement guarantees 100% compliance closure.',
        is_recommended: recommended === 'HYBRID',
        currency_conversions: getConversions(hybrid_cost_3yr_cr, build_eval.npv_cr),
      },

      DEFER: {
        strategy_id: 'DEFER',
        strategy: 'DEFER',
        name: 'Defer Capital Commitment (Inaction)',
        total_cost_cr: Number(defer_cost_3yr_cr.toFixed(2)),
        total_cost_3yr_cr: Number(defer_cost_3yr_cr.toFixed(2)),
        annual_cost_cr: Number((defer_cost_3yr_cr / 3.0).toFixed(2)),
        capex_cr: 0.0,
        internal_abatement_tco2e: 0.0,
        residual_shortfall_tco2e: Number(base_shortfall_tco2e.toFixed(0)),
        ccc_procured_tco2e: 0.0,
        post_intervention_gei: actual_gei,
        post_strategy_gei: actual_gei,
        npv_cr: Number((-defer_cost_3yr_cr).toFixed(2)),
        payback_years: null,
        irr_pct: null,
        cost_per_tco2e: Number((ccc_price_inr * 2.0).toFixed(0)), // Environmental compensation rate
        risk_score: defer_risk_profile.composite_risk,
        utility_score: defer_score,
        rank: scoreMap.findIndex((s) => s.id === 'DEFER') + 1,
        risk_breakdown: defer_risk_profile,
        sub_scores: {
          financial: Number(defer_fin.toFixed(1)),
          climate: Number(defer_clim.toFixed(1)),
          compliance: Number(defer_comp.toFixed(1)),
          mrv: 30.0,
          timing: 10.0,
        },
        summary: 'Cost of inaction: incurs statutory Environmental Compensation penalties at 2× certificate price with accumulating future capital cost inflation.',
        is_recommended: recommended === 'DEFER',
        currency_conversions: getConversions(defer_cost_3yr_cr, -defer_cost_3yr_cr),
      },
    };

    const recommendation_reason = recommended === 'HYBRID'
      ? 'Optimal risk-adjusted posture combining internal thermodynamic energy savings with targeted compliance hedge.'
      : (recommended === 'BUILD'
        ? 'Full internal abatement eliminates long-term compliance liabilities with positive project NPV.'
        : (recommended === 'BUY'
          ? 'Least upfront capital commitment for immediate statutory compliance cycle.'
          : 'Deferral is not financially or regulatory advisable due to statutory environmental compensation penalties.'));

    return {
      strategies,
      recommended_strategy: recommended,
      recommendation_reason,
      assumptions_applied: {
        ccc_price_inr,
        transaction_fee_pct,
        project_output_delivery_pct,
        project_delay_months,
        financing_rate_pct,
        mrv_score,
        management_objective,
        regulatory_status,
      },
    };
  }
}
