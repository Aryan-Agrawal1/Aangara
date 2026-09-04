/**
 * AANGARA Finance Engine v3.0
 * ─────────────────────────────────────────────────────────
 * Financial decision models for industrial decarbonisation projects.
 * Canonical currency is INR per spec §2.1.
 * Multi-currency conversions are strictly PRESENTATION-ONLY.
 *
 * Implements:
 *   §40: Free Cash Flow to Firm (FCFF) — FIN-FCFF-V1
 *   §41: Net Present Value (NPV) — FIN-NPV-V1
 *   §42: Weighted Average Cost of Capital (WACC) — FIN-WACC-V1
 *   §42.1: Cost of Equity (CAPM) — FIN-CAPM-V1
 *   §42.2: Levered Beta (Hamada formula) — FIN-BETA-HAMADA-V1
 *   §43: Internal Rate of Return (IRR) — FIN-IRR-V1
 *   §44: Simple Payback Period (Exact linear interpolation) — FIN-PAYBACK-SIMPLE-V1
 *   §45: Discounted Payback Period — FIN-PAYBACK-DISCOUNTED-V1
 *   §46: Profitability Index (PI) — FIN-PI-V1
 *   §47.1: Marginal Abatement Cost (Lifecycle) — FIN-MAC-LIFECYCLE-V1
 *   §47.2: Marginal Abatement Cost (Discounted) — FIN-MAC-DISCOUNTED-V1
 *   §48: Levelized Cost of Energy (LCOE) — FIN-LCOE-NREL-V1
 *   §49: Debt Amortization Schedule (equal_principal / annuity / sculpted)
 *   §50: Debt Service Coverage Ratio (DSCR) — FIN-DSCR-V1
 *   §51: Indian Corporate Tax Model (Section 115BAA 25.168% / Standard 34.944% / MAT)
 *   §52: Inflation & Cost Escalation — FIN-INFLATION-V1
 */

import { convertFromINR, SupportedCurrency } from '@/lib/registries/currency-registry';
import { FORMULA_REGISTRY } from '@/lib/registries/formula-registry';

// ─────────────────────────────────────────────
// Interfaces & Types
// ─────────────────────────────────────────────

export interface TaxRegimeInput {
  regime: 'SECTION_115BAA' | 'STANDARD_CORPORATE' | 'MAT';
  effective_rate_pct?: number; // e.g. 25.168 for 115BAA
  surcharge_pct?: number;
  cess_pct?: number;
  mat_credit_available_inr?: number;
}

export interface CAPMParams {
  risk_free_rate_pct: number;     // Rf, e.g. 7.15% (10-yr Indian G-Sec)
  levered_beta: number;           // βL
  equity_risk_premium_pct: number;// ERP, e.g. 6.5% for Indian equities
  country_risk_premium_pct?: number; // CRP, default 0 for domestic projects
}

export interface HamadaBetaParams {
  unlevered_beta: number;         // βU
  effective_tax_rate_pct: number; // T
  debt_to_equity_ratio: number;   // D/E
}

export interface WACCParams {
  cost_of_equity_pct: number;     // Ke
  cost_of_debt_pre_tax_pct: number; // Kd
  effective_tax_rate_pct: number; // T
  debt_weight_pct: number;        // D/V
  equity_weight_pct: number;      // E/V
}

export interface FCFFParams {
  ebit: number;                   // Earnings Before Interest and Taxes
  effective_tax_rate_pct: number; // T
  depreciation_amortization: number; // D&A
  capex: number;                  // Capital Expenditure
  change_in_nwc: number;          // ΔNWC (Net Working Capital)
}

export interface DebtScheduleParams {
  principal_inr: number;
  annual_interest_rate_pct: number;
  tenure_years: number;
  moratorium_years?: number;
  method: 'EQUAL_PRINCIPAL' | 'ANNUITY' | 'SCULPTED';
  cfads_vector?: number[]; // Required for sculpted method
  target_dscr?: number;    // Target DSCR for sculpted method (default: 1.25)
}

export interface DebtPeriodRecord {
  year: number;
  opening_balance: number;
  principal_repayment: number;
  interest_payment: number;
  total_debt_service: number;
  closing_balance: number;
  dscr?: number;
}

export interface LCOEParams {
  capex_inr: number;
  fixed_om_inr_per_year: number;
  variable_om_inr_per_kwh?: number;
  fuel_cost_inr_per_kwh?: number;
  capacity_mw: number;
  capacity_factor_pct: number;     // e.g. 21% solar, 75% WHRS
  economic_life_years: number;
  wacc_pct: number;
}

export interface ProjectEvaluationResult {
  // Backward compatibility fields (v1 contract)
  net_annual_savings_cr: number;
  npv_cr: number;
  simple_payback_years: number;
  mac_inr_per_tco2e: number;
  total_abatement_10yr_tco2e: number;
  is_economically_viable: boolean;

  // v3.0 Enriched Metrics
  discounted_payback_years: number | null;
  profitability_index: number;
  irr_pct: number | null;
  irr_status: 'UNIQUE_ROOT' | 'MULTIPLE_ROOTS' | 'NO_SOLUTION';
  mac_lifecycle_inr_per_tco2e: number;
  mac_discounted_inr_per_tco2e: number;
  wacc_used_pct: number;
  annual_cashflows_cr: number[];
  cumulative_cashflows_cr: number[];
  discounted_cashflows_cr: number[];

  // Currency conversions (presentation-only)
  currency_conversions: Record<
    SupportedCurrency,
    { npv: string; annual_savings: string }
  >;

  // Source traces
  traces: {
    npv_trace: Record<string, any>;
    mac_trace: Record<string, any>;
    wacc_trace?: Record<string, any>;
  };
}

// ─────────────────────────────────────────────
// Engine Implementation
// ─────────────────────────────────────────────

export class FinanceEngine {

  /**
   * §42.1: Cost of Equity using CAPM
   * Ke = Rf + βL × ERP + CRP
   */
  static computeCostOfEquity(params: CAPMParams): number {
    const {
      risk_free_rate_pct,
      levered_beta,
      equity_risk_premium_pct,
      country_risk_premium_pct = 0,
    } = params;
    return risk_free_rate_pct + levered_beta * equity_risk_premium_pct + country_risk_premium_pct;
  }

  /**
   * §42.2: Hamada formula for levered beta
   * βL = βU × [1 + (1 - T) × (D/E)]
   */
  static computeLeveredBeta(params: HamadaBetaParams): number {
    const { unlevered_beta, effective_tax_rate_pct, debt_to_equity_ratio } = params;
    const tax_shield = 1 - effective_tax_rate_pct / 100;
    return unlevered_beta * (1 + tax_shield * debt_to_equity_ratio);
  }

  /**
   * §42: Weighted Average Cost of Capital (WACC)
   * WACC = Ke × (E/V) + Kd × (1 - T) × (D/V)
   */
  static computeWACC(params: WACCParams): number {
    const {
      cost_of_equity_pct,
      cost_of_debt_pre_tax_pct,
      effective_tax_rate_pct,
      debt_weight_pct,
      equity_weight_pct,
    } = params;

    const E_V = equity_weight_pct / 100;
    const D_V = debt_weight_pct / 100;
    const tax_shield = 1 - effective_tax_rate_pct / 100;
    const after_tax_kd = cost_of_debt_pre_tax_pct * tax_shield;

    return (cost_of_equity_pct * E_V) + (after_tax_kd * D_V);
  }

  /**
   * §40: Free Cash Flow to Firm (FCFF)
   * FCFF = EBIT × (1 - T) + D&A - CAPEX - ΔNWC
   */
  static computeFCFF(params: FCFFParams): number {
    const { ebit, effective_tax_rate_pct, depreciation_amortization, capex, change_in_nwc } = params;
    const nopat = ebit * (1 - effective_tax_rate_pct / 100);
    return nopat + depreciation_amortization - capex - change_in_nwc;
  }

  /**
   * §41: Net Present Value (NPV)
   * NPV = Σ [ CF_t / (1 + r)^t ] for t = 0 to n
   * cashflows[0] is typically negative initial investment
   */
  static computeNPV(cashflows: number[], discount_rate_pct: number): number {
    const r = discount_rate_pct / 100;
    return cashflows.reduce((acc, cf, t) => {
      return acc + cf / Math.pow(1 + r, t);
    }, 0);
  }

  /**
   * §43: Internal Rate of Return (IRR)
   * Numerical root finder combining Newton-Raphson with bisection fallback.
   * Checks for multiple sign changes (Descartes' rule of signs).
   */
  static computeIRR(
    cashflows: number[],
    guess_pct = 10,
    max_iterations = 100,
    tolerance = 1e-6
  ): { irr_pct: number | null; status: 'UNIQUE_ROOT' | 'MULTIPLE_ROOTS' | 'NO_SOLUTION' } {
    // Check sign changes
    let sign_changes = 0;
    for (let i = 1; i < cashflows.length; i++) {
      if ((cashflows[i - 1] < 0 && cashflows[i] > 0) || (cashflows[i - 1] > 0 && cashflows[i] < 0)) {
        sign_changes++;
      }
    }

    if (sign_changes === 0) {
      return { irr_pct: null, status: 'NO_SOLUTION' };
    }

    const status: 'UNIQUE_ROOT' | 'MULTIPLE_ROOTS' = sign_changes > 1 ? 'MULTIPLE_ROOTS' : 'UNIQUE_ROOT';

    // Newton-Raphson iteration
    let r = guess_pct / 100;
    for (let iter = 0; iter < max_iterations; iter++) {
      if (r <= -0.999) r = -0.999; // guard against singularity

      let npv = 0;
      let d_npv = 0;

      for (let t = 0; t < cashflows.length; t++) {
        const factor = Math.pow(1 + r, t);
        npv += cashflows[t] / factor;
        if (t > 0) {
          d_npv -= (t * cashflows[t]) / Math.pow(1 + r, t + 1);
        }
      }

      if (Math.abs(npv) < tolerance) {
        return { irr_pct: Number((r * 100).toFixed(2)), status };
      }

      if (Math.abs(d_npv) < 1e-12) {
        break; // derivative near zero, fall through to bisection
      }

      const next_r = r - npv / d_npv;
      if (Math.abs(next_r - r) < tolerance) {
        return { irr_pct: Number((next_r * 100).toFixed(2)), status };
      }
      r = next_r;
    }

    // Bisection Fallback in range [-50%, 500%]
    let low = -0.50;
    let high = 5.00;
    let npv_low = this.computeNPV(cashflows, low * 100);
    let npv_high = this.computeNPV(cashflows, high * 100);

    if (npv_low * npv_high > 0) {
      return { irr_pct: null, status: 'NO_SOLUTION' };
    }

    for (let i = 0; i < 60; i++) {
      const mid = (low + high) / 2;
      const npv_mid = this.computeNPV(cashflows, mid * 100);

      if (Math.abs(npv_mid) < tolerance || (high - low) / 2 < tolerance) {
        return { irr_pct: Number((mid * 100).toFixed(2)), status };
      }

      if (npv_mid * npv_low < 0) {
        high = mid;
        npv_high = npv_mid;
      } else {
        low = mid;
        npv_low = npv_mid;
      }
    }

    return { irr_pct: Number(((low + high) / 2 * 100).toFixed(2)), status };
  }

  /**
   * §44: Simple Payback Period with exact linear interpolation
   * Payback = t* + |CumCF_t*| / CF_{t*+1}
   */
  static computeSimplePayback(cashflows: number[]): number {
    let cum = cashflows[0];
    if (cum >= 0) return 0;

    for (let t = 1; t < cashflows.length; t++) {
      const prev = cum;
      cum += cashflows[t];
      if (cum >= 0) {
        // Linear interpolation fraction
        const needed = Math.abs(prev);
        const fraction = cashflows[t] > 0 ? needed / cashflows[t] : 0;
        return Number(((t - 1) + fraction).toFixed(2));
      }
    }

    return 99.0; // Exceeds evaluation window
  }

  /**
   * §45: Discounted Payback Period
   * Cumulative discounted cash flows with linear interpolation
   */
  static computeDiscountedPayback(cashflows: number[], discount_rate_pct: number): number | null {
    const r = discount_rate_pct / 100;
    let cum = cashflows[0];
    if (cum >= 0) return 0;

    for (let t = 1; t < cashflows.length; t++) {
      const dcf = cashflows[t] / Math.pow(1 + r, t);
      const prev = cum;
      cum += dcf;
      if (cum >= 0) {
        const needed = Math.abs(prev);
        const fraction = dcf > 0 ? needed / dcf : 0;
        return Number(((t - 1) + fraction).toFixed(2));
      }
    }

    return null; // Not recovered within period
  }

  /**
   * §46: Profitability Index (PI)
   * PI = PV(future CFs) / Initial Investment
   */
  static computeProfitabilityIndex(cashflows: number[], discount_rate_pct: number): number {
    const initial_outlay = Math.abs(cashflows[0]);
    if (initial_outlay === 0) return 1.0;

    const r = discount_rate_pct / 100;
    let pv_future = 0;
    for (let t = 1; t < cashflows.length; t++) {
      pv_future += cashflows[t] / Math.pow(1 + r, t);
    }

    return Number((pv_future / initial_outlay).toFixed(3));
  }

  /**
   * §47.1: Marginal Abatement Cost (Lifecycle)
   * MAC_lifecycle = Net Lifecycle Cost (INR) / Cumulative Abatement (tCO2e)
   */
  static computeMACLifecycle(
    net_lifecycle_cost_inr: number,
    cumulative_abatement_tco2e: number
  ): number {
    if (cumulative_abatement_tco2e <= 0) return 0;
    return Number((net_lifecycle_cost_inr / cumulative_abatement_tco2e).toFixed(2));
  }

  /**
   * §47.2: Marginal Abatement Cost (Discounted)
   * MAC_discounted = PV(Incremental Costs) / PV(Annual Abatement)
   */
  static computeMACDiscounted(
    discounted_costs_inr: number,
    discounted_abatement_tco2e: number
  ): number {
    if (discounted_abatement_tco2e <= 0) return 0;
    return Number((discounted_costs_inr / discounted_abatement_tco2e).toFixed(2));
  }

  /**
   * §48: Levelized Cost of Energy (LCOE) per NREL/IRENA standard
   * LCOE = (FCR × CAPEX + FOM) / (CF × 8760 × P_MW × 1000) + VOM + Fuel
   * Output in ₹/kWh
   */
  static computeLCOE(params: LCOEParams): number {
    const {
      capex_inr,
      fixed_om_inr_per_year,
      variable_om_inr_per_kwh = 0,
      fuel_cost_inr_per_kwh = 0,
      capacity_mw,
      capacity_factor_pct,
      economic_life_years,
      wacc_pct,
    } = params;

    const r = wacc_pct / 100;
    const n = economic_life_years;
    // Capital Recovery Factor (FCR) = r(1+r)^n / ((1+r)^n - 1)
    const fcr = r > 0 ? (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : 1 / n;

    const annual_gen_kwh = capacity_mw * 1000 * 8760 * (capacity_factor_pct / 100);
    if (annual_gen_kwh <= 0) return 0;

    const annualized_capex = capex_inr * fcr;
    const fixed_per_kwh = (annualized_capex + fixed_om_inr_per_year) / annual_gen_kwh;

    return Number((fixed_per_kwh + variable_om_inr_per_kwh + fuel_cost_inr_per_kwh).toFixed(3));
  }

  /**
   * §49: Debt Amortization Schedule
   */
  static computeDebtSchedule(params: DebtScheduleParams): DebtPeriodRecord[] {
    const { principal_inr, annual_interest_rate_pct, tenure_years, moratorium_years = 0, method, cfads_vector } = params;
    const r = annual_interest_rate_pct / 100;
    const active_years = tenure_years - moratorium_years;
    const schedule: DebtPeriodRecord[] = [];

    let balance = principal_inr;

    // Annuity calculation for active years
    const emi = (r > 0 && active_years > 0)
      ? (balance * r * Math.pow(1 + r, active_years)) / (Math.pow(1 + r, active_years) - 1)
      : (active_years > 0 ? balance / active_years : 0);

    for (let yr = 1; yr <= tenure_years; yr++) {
      const is_moratorium = yr <= moratorium_years;
      const interest = balance * r;
      let principal_repayment = 0;

      if (!is_moratorium) {
        if (method === 'EQUAL_PRINCIPAL') {
          principal_repayment = principal_inr / active_years;
        } else if (method === 'ANNUITY') {
          principal_repayment = emi - interest;
        } else if (method === 'SCULPTED') {
          const cfads = cfads_vector?.[yr - 1] ?? 0;
          const target_dscr = params.target_dscr ?? 1.25;
          const max_debt_service = cfads > 0 ? cfads / target_dscr : 0;
          principal_repayment = Math.max(0, max_debt_service - interest);
        }
      }

      // Cap principal repayment to balance
      principal_repayment = Math.min(balance, principal_repayment);
      const total_service = principal_repayment + interest;
      const closing = Math.max(0, balance - principal_repayment);

      const cfads_current = cfads_vector?.[yr - 1];
      const dscr = (cfads_current !== undefined && total_service > 0)
        ? Number((cfads_current / total_service).toFixed(2))
        : undefined;

      schedule.push({
        year: yr,
        opening_balance: Number(balance.toFixed(2)),
        principal_repayment: Number(principal_repayment.toFixed(2)),
        interest_payment: Number(interest.toFixed(2)),
        total_debt_service: Number(total_service.toFixed(2)),
        closing_balance: Number(closing.toFixed(2)),
        dscr,
      });

      balance = closing;
    }

    return schedule;
  }

  /**
   * §50: Debt Service Coverage Ratio (DSCR)
   * DSCR = CFADS / Debt Service
   */
  static computeDSCR(cfads: number, debt_service: number): number {
    if (debt_service <= 0) return 99.0;
    return Number((cfads / debt_service).toFixed(2));
  }

  /**
   * §51: Indian Corporate Tax Model
   * Section 115BAA: 22% base + 10% surcharge + 4% cess = 25.168%
   * Standard corporate: 30% base + surcharge + cess ≈ 34.944%
   */
  static computeTax(
    pbt_inr: number,
    regime: TaxRegimeInput = { regime: 'SECTION_115BAA' }
  ): { tax_payable_inr: number; effective_rate_pct: number } {
    if (pbt_inr <= 0) return { tax_payable_inr: 0, effective_rate_pct: 0 };

    let effective_rate = 25.168; // Default Section 115BAA
    if (regime.regime === 'SECTION_115BAA') {
      effective_rate = 22 * 1.10 * 1.04; // 25.168%
    } else if (regime.regime === 'STANDARD_CORPORATE') {
      const surcharge = regime.surcharge_pct ?? 12;
      effective_rate = 30 * (1 + surcharge / 100) * 1.04;
    } else if (regime.regime === 'MAT') {
      effective_rate = 15 * 1.10 * 1.04; // 17.16%
    }

    if (regime.effective_rate_pct !== undefined) {
      effective_rate = regime.effective_rate_pct;
    }

    let tax = pbt_inr * (effective_rate / 100);
    if (regime.mat_credit_available_inr && regime.mat_credit_available_inr > 0) {
      const credit_used = Math.min(tax * 0.5, regime.mat_credit_available_inr);
      tax -= credit_used;
    }

    return {
      tax_payable_inr: Number(tax.toFixed(2)),
      effective_rate_pct: Number(effective_rate.toFixed(3)),
    };
  }

  /**
   * §52: Inflation & Cost Escalation
   * P_t = P_0 × (1 + g)^t
   */
  static inflatePrice(base_price: number, annual_inflation_pct: number, years: number): number {
    return Number((base_price * Math.pow(1 + annual_inflation_pct / 100, years)).toFixed(4));
  }

  /**
   * Main project evaluation method.
   * Full backward compatibility with existing codebase contract while
   * adding all v3.0 analytical metrics, multi-currency presentation, and trace metadata.
   */
  static evaluateProject(
    capex_cr: number,
    annual_opex_change_cr: number,
    annual_energy_savings_cr: number,
    expected_reduction_tco2e: number,
    financing_rate_pct = 9.5,
    project_lifetime_years = 10,
    options?: {
      effective_tax_rate_pct?: number;
      debt_equity_ratio?: number;
      cost_of_equity_pct?: number;
      carbon_benefit_annual_cr?: number;
      annual_degradation_pct?: number;
    }
  ): ProjectEvaluationResult {
    const net_annual_cashflow_cr = annual_energy_savings_cr - annual_opex_change_cr + (options?.carbon_benefit_annual_cr ?? 0);
    const wacc = options?.cost_of_equity_pct !== undefined
      ? this.computeWACC({
          cost_of_equity_pct: options.cost_of_equity_pct,
          cost_of_debt_pre_tax_pct: financing_rate_pct,
          effective_tax_rate_pct: options.effective_tax_rate_pct ?? 25.168,
          debt_weight_pct: 70,
          equity_weight_pct: 30,
        })
      : financing_rate_pct;

    const r = wacc / 100;

    // Construct cash flow vector [Year 0, Year 1, ..., Year N]
    const cashflows: number[] = [-capex_cr];
    const discounted_cfs: number[] = [-capex_cr];
    const cum_cfs: number[] = [-capex_cr];

    let cum = -capex_cr;
    let npv_cr = -capex_cr;
    let pv_costs = capex_cr * 1e7;
    let pv_abatement = 0;

    const degradation = (options?.annual_degradation_pct ?? 0) / 100;

    for (let yr = 1; yr <= project_lifetime_years; yr++) {
      const degraded_flow = net_annual_cashflow_cr * Math.pow(1 - degradation, yr - 1);
      const degraded_abatement = expected_reduction_tco2e * Math.pow(1 - degradation, yr - 1);

      cashflows.push(Number(degraded_flow.toFixed(4)));

      const disc = degraded_flow / Math.pow(1 + r, yr);
      discounted_cfs.push(Number(disc.toFixed(4)));
      npv_cr += disc;

      cum += degraded_flow;
      cum_cfs.push(Number(cum.toFixed(4)));

      // For discounted MAC
      const annual_opex_inr = annual_opex_change_cr * 1e7;
      pv_costs += annual_opex_inr / Math.pow(1 + r, yr);
      pv_abatement += degraded_abatement / Math.pow(1 + r, yr);
    }

    // Paybacks & PI
    const simple_payback_years = this.computeSimplePayback(cashflows);
    const discounted_payback_years = this.computeDiscountedPayback(cashflows, wacc);
    const profitability_index = this.computeProfitabilityIndex(cashflows, wacc);

    // IRR
    const irr_result = this.computeIRR(cashflows);

    // Abatement & MAC
    const total_abatement_10yr_tco2e = expected_reduction_tco2e * project_lifetime_years;
    const total_net_cost_cr = capex_cr + (annual_opex_change_cr - annual_energy_savings_cr) * project_lifetime_years;
    const mac_lifecycle_inr_per_tco2e = this.computeMACLifecycle(total_net_cost_cr * 1e7, total_abatement_10yr_tco2e);
    const mac_discounted_inr_per_tco2e = this.computeMACDiscounted(pv_costs, pv_abatement);

    // Multi-currency presentation conversions (NPV & Annual savings)
    const currencies: SupportedCurrency[] = ['USD', 'EUR', 'GBP', 'SGD', 'JPY', 'AED', 'SAR', 'CNY'];
    const currency_conversions: Record<SupportedCurrency, { npv: string; annual_savings: string }> = {} as any;

    currencies.forEach((curr) => {
      const npv_conv = convertFromINR(npv_cr * 1e7, curr);
      const savings_conv = convertFromINR(net_annual_cashflow_cr * 1e7, curr);
      currency_conversions[curr] = {
        npv: npv_conv.formatted,
        annual_savings: savings_conv.formatted,
      };
    });

    return {
      net_annual_savings_cr: Number(net_annual_cashflow_cr.toFixed(2)),
      npv_cr: Number(npv_cr.toFixed(2)),
      simple_payback_years: Number(simple_payback_years.toFixed(1)),
      mac_inr_per_tco2e: Number(mac_lifecycle_inr_per_tco2e.toFixed(1)),
      total_abatement_10yr_tco2e: Number(total_abatement_10yr_tco2e.toFixed(0)),
      is_economically_viable: npv_cr > 0,

      // v3 enriched
      discounted_payback_years,
      profitability_index,
      irr_pct: irr_result.irr_pct,
      irr_status: irr_result.status,
      mac_lifecycle_inr_per_tco2e,
      mac_discounted_inr_per_tco2e,
      wacc_used_pct: Number(wacc.toFixed(2)),
      annual_cashflows_cr: cashflows,
      cumulative_cashflows_cr: cum_cfs,
      discounted_cashflows_cr: discounted_cfs,
      currency_conversions,

      traces: {
        npv_trace: {
          formula_id: FORMULA_REGISTRY['FIN-NPV-V1'].formula_id,
          formula_version: FORMULA_REGISTRY['FIN-NPV-V1'].version,
          discount_rate_used_pct: Number(wacc.toFixed(2)),
          initial_capex_cr: capex_cr,
          tenure_years: project_lifetime_years,
          npv_cr: Number(npv_cr.toFixed(2)),
        },
        mac_trace: {
          lifecycle_formula_id: FORMULA_REGISTRY['FIN-MAC-LIFECYCLE-V1'].formula_id,
          discounted_formula_id: FORMULA_REGISTRY['FIN-MAC-DISCOUNTED-V1'].formula_id,
          lifecycle_mac_inr: mac_lifecycle_inr_per_tco2e,
          discounted_mac_inr: mac_discounted_inr_per_tco2e,
        },
      },
    };
  }
}
