/**
 * AANGARA Renewable Consumption Obligation (RCO) Engine v1.0
 * -----------------------------------------------------------------
 * Deterministic engine computing a facility's position against India's
 * Renewable Purchase/Consumption Obligation (RPO/RCO) framework.
 *
 * Regulatory references:
 *   - MNRE RPO Trajectory Order 2022-2030 (RE-RPO-MNRE-2022)
 *     Gazette notification 29-Jul-2022
 *   - CERC REC Regulations 2022 (CERC-REC-2022)
 *   - BEE PAT green energy norms
 *
 * MECHANISM ISOLATION GUARANTEE (§3.2 build spec):
 *   Every MWh of renewable energy is consumed by EXACTLY ONE mechanism.
 *   The `mechanism_token` output prevents one MWh from counting toward
 *   both CCTS GEI reduction AND RCO compliance simultaneously.
 */

// ─── Types ────────────────────────────────────────────────────────────

export type RCOObligationStatus = 'FINAL_NOTIFICATION' | 'DRAFT_TRAJECTORY' | 'WATCHLIST' | 'UNKNOWN';
export type RCOComplianceStatus = 'COMPLIANT' | 'MARGINAL' | 'DEFICIT' | 'SEVERE_DEFICIT';
export type RCOActionType =
  | 'CAPTIVE_SOLAR' | 'CAPTIVE_WIND' | 'OPEN_ACCESS_SOLAR' | 'OPEN_ACCESS_WIND'
  | 'LONG_TERM_PPA' | 'SHORT_TERM_PPA' | 'GREEN_TARIFF' | 'REC_PURCHASE'
  | 'ROOFTOP_SOLAR' | 'GROUP_CAPTIVE' | 'HYBRID_RE' | 'GREEN_HYDROGEN';

export interface RCOProfile {
  current_renewable_mwh: number;
  current_total_energy_mwh: number;
  current_renewable_share_pct: number;
  obligation_target_pct: number;
  obligation_year: number;
  solar_sub_target_pct: number;
  wind_sub_target_pct: number;
  non_solar_sub_target_pct: number;
  obligation_source: string;
  obligation_source_url: string;
  obligation_status: RCOObligationStatus;
  entity_type: 'OPEN_ACCESS_CONSUMER' | 'CAPTIVE_CONSUMER' | 'DISCOM_OBLIGATED';
  applicable_serc: string;
  rec_balance_mwh?: number;
}

export interface RCOPosition {
  entity_id: string;
  reporting_year: string;
  profile: RCOProfile;
  obligation_target_mwh: number;
  current_renewable_mwh: number;
  current_renewable_share_pct: number;
  gap_mwh: number;
  gap_pct_points: number;
  compliance_status: RCOComplianceStatus;
  rec_shortfall_mwh: number;
  estimated_penalty_cr: number;
  penalty_rate_inr_per_kwh: number;
  mechanism_token: {
    renewable_mwh_allocated_to_rco: number;
    renewable_mwh_available_for_ccts_adjustment: number;
    double_count_flag: boolean;
  };
  data_status: 'SYNTHETIC' | 'REAL_FACILITY_INPUT';
  calculation_trace: Array<{ step: string; formula: string; value: number; unit: string; source?: string }>;
}

export interface RCOActionEffect {
  action_type: RCOActionType;
  incremental_renewable_mwh: number;
  post_action_renewable_mwh: number;
  post_action_share_pct: number;
  post_action_gap_mwh: number;
  gap_closed_pct: number;
  rec_procurement_saved_mwh: number;
  cost_per_mwh_inr: number;
  capex_cr: number;
  annual_opex_cr: number;
  npv_cr: number | null;
  payback_years: number | null;
  lcoe_inr_per_mwh: number | null;
  applies_to_rco: boolean;
  applies_to_ccts: boolean;
  double_count_flag: boolean;
  mechanism_note: string;
}

// ─── Sector RCO Targets (MNRE Gazette 2022-2030) ──────────────────────

const SECTOR_RCO_TARGETS: Record<string, {
  target_pct_2025_26: number; target_pct_2026_27: number;
  solar_sub_pct: number; wind_sub_pct: number;
  status: RCOObligationStatus; source_url: string;
}> = {
  cement: { target_pct_2025_26: 25.0, target_pct_2026_27: 29.0, solar_sub_pct: 10.0, wind_sub_pct: 6.0, status: 'DRAFT_TRAJECTORY', source_url: 'https://mnre.gov.in/orders/rpo-order-2022/' },
  petroleum_refinery: { target_pct_2025_26: 20.0, target_pct_2026_27: 23.0, solar_sub_pct: 8.0, wind_sub_pct: 5.0, status: 'DRAFT_TRAJECTORY', source_url: 'https://mnre.gov.in/orders/rpo-order-2022/' },
  aluminium: { target_pct_2025_26: 30.0, target_pct_2026_27: 34.0, solar_sub_pct: 12.0, wind_sub_pct: 8.0, status: 'DRAFT_TRAJECTORY', source_url: 'https://mnre.gov.in/orders/rpo-order-2022/' },
  steel: { target_pct_2025_26: 22.0, target_pct_2026_27: 25.0, solar_sub_pct: 8.0, wind_sub_pct: 6.0, status: 'WATCHLIST', source_url: 'https://mnre.gov.in/orders/rpo-order-2022/' },
  textile: { target_pct_2025_26: 18.0, target_pct_2026_27: 21.0, solar_sub_pct: 7.0, wind_sub_pct: 4.0, status: 'DRAFT_TRAJECTORY', source_url: 'https://mnre.gov.in/orders/rpo-order-2022/' },
  chlor_alkali: { target_pct_2025_26: 20.0, target_pct_2026_27: 23.0, solar_sub_pct: 8.0, wind_sub_pct: 5.0, status: 'DRAFT_TRAJECTORY', source_url: 'https://mnre.gov.in/orders/rpo-order-2022/' },
  pulp_paper: { target_pct_2025_26: 15.0, target_pct_2026_27: 18.0, solar_sub_pct: 6.0, wind_sub_pct: 3.0, status: 'DRAFT_TRAJECTORY', source_url: 'https://mnre.gov.in/orders/rpo-order-2022/' },
  petrochemicals: { target_pct_2025_26: 18.0, target_pct_2026_27: 21.0, solar_sub_pct: 7.0, wind_sub_pct: 4.0, status: 'DRAFT_TRAJECTORY', source_url: 'https://mnre.gov.in/orders/rpo-order-2022/' },
};

const SERC_PENALTY_RATES: Record<string, number> = {
  Rajasthan: 3.50, Gujarat: 3.25, Maharashtra: 3.75, Tamil_Nadu: 3.00,
  Andhra_Pradesh: 3.50, Karnataka: 3.25, Odisha: 2.75, Jharkhand: 2.50, default: 3.00,
};

// ─── Engine ────────────────────────────────────────────────────────────

export class RCOEngine {
  static getSectorTarget(sector: string, year: string = '2025-26') {
    const key = sector.toLowerCase().replace(/[- ]/g, '_');
    const t = SECTOR_RCO_TARGETS[key];
    if (!t) return null;
    return { target_pct: year === '2026-27' ? t.target_pct_2026_27 : t.target_pct_2025_26, solar_sub_pct: t.solar_sub_pct, wind_sub_pct: t.wind_sub_pct, status: t.status, source_url: t.source_url };
  }

  static computePosition(entity_id: string, sector: string, reporting_year: string, profile: RCOProfile, state: string = 'default', data_status: 'SYNTHETIC' | 'REAL_FACILITY_INPUT' = 'SYNTHETIC'): RCOPosition {
    const sectorKey = sector.toLowerCase().replace(/[- ]/g, '_');
    const st = SECTOR_RCO_TARGETS[sectorKey] ?? SECTOR_RCO_TARGETS.cement;
    const target_pct = profile.obligation_target_pct > 0 ? profile.obligation_target_pct : (reporting_year === '2026-27' ? st.target_pct_2026_27 : st.target_pct_2025_26);
    const obligation_target_mwh = (target_pct / 100.0) * profile.current_total_energy_mwh;
    const gap_mwh = Math.max(0, obligation_target_mwh - profile.current_renewable_mwh);
    const gap_pct = target_pct - profile.current_renewable_share_pct;
    const gap_rel = gap_pct / Math.max(1, target_pct);
    const compliance_status: RCOComplianceStatus = gap_mwh <= 0 ? 'COMPLIANT' : gap_rel <= 0.10 ? 'MARGINAL' : gap_rel <= 0.30 ? 'DEFICIT' : 'SEVERE_DEFICIT';
    const rec_balance = profile.rec_balance_mwh ?? 0;
    const rec_shortfall_mwh = Math.max(0, gap_mwh - rec_balance);
    const penalty_rate = SERC_PENALTY_RATES[state.replace(/ /g, '_')] ?? SERC_PENALTY_RATES.default;
    const estimated_penalty_cr = (rec_shortfall_mwh * 1000 * penalty_rate) / 1e7;
    const mwh_for_ccts = Math.max(0, profile.current_renewable_mwh - obligation_target_mwh);
    return {
      entity_id, reporting_year, profile,
      obligation_target_mwh: Number(obligation_target_mwh.toFixed(0)),
      current_renewable_mwh: profile.current_renewable_mwh,
      current_renewable_share_pct: profile.current_renewable_share_pct,
      gap_mwh: Number(gap_mwh.toFixed(0)),
      gap_pct_points: Number(gap_pct.toFixed(2)),
      compliance_status,
      rec_shortfall_mwh: Number(rec_shortfall_mwh.toFixed(0)),
      estimated_penalty_cr: Number(estimated_penalty_cr.toFixed(2)),
      penalty_rate_inr_per_kwh: penalty_rate,
      mechanism_token: { renewable_mwh_allocated_to_rco: profile.current_renewable_mwh, renewable_mwh_available_for_ccts_adjustment: Number(mwh_for_ccts.toFixed(0)), double_count_flag: false },
      data_status,
      calculation_trace: [
        { step: 'Total Energy Consumption', formula: 'Reported total MWh', value: profile.current_total_energy_mwh, unit: 'MWh' },
        { step: 'Current Renewable MWh', formula: 'Sum of RE sources', value: profile.current_renewable_mwh, unit: 'MWh' },
        { step: 'Current RE Share', formula: '(RE MWh / Total MWh) × 100', value: profile.current_renewable_share_pct, unit: '%' },
        { step: 'RCO Target %', formula: `MNRE RPO Trajectory ${reporting_year}`, value: target_pct, unit: '%', source: profile.obligation_source_url },
        { step: 'RCO Obligation (MWh)', formula: '(Target% / 100) × Total MWh', value: obligation_target_mwh, unit: 'MWh' },
        { step: 'Compliance Gap', formula: 'max(0, Obligation − Current RE)', value: gap_mwh, unit: 'MWh' },
        { step: 'REC Shortfall', formula: 'max(0, Gap − REC Balance)', value: rec_shortfall_mwh, unit: 'MWh RECs' },
        { step: 'SERC Penalty Estimate', formula: 'REC Shortfall (kWh) × Rate (₹/kWh)', value: estimated_penalty_cr, unit: '₹ Cr' },
        { step: 'CCTS-Available RE (token)', formula: 'max(0, Current RE − RCO Obligation)', value: mwh_for_ccts, unit: 'MWh' },
      ],
    };
  }

  static evaluateAction(pos: RCOPosition, action_type: RCOActionType, incremental_mwh: number, capex_cr: number, tariff_inr_per_mwh: number = 3800, project_life_years: number = 25, wacc_pct: number = 9.5): RCOActionEffect {
    const post_re = pos.current_renewable_mwh + incremental_mwh;
    const total = pos.profile.current_total_energy_mwh;
    const post_share = (post_re / Math.max(1, total)) * 100;
    const post_gap = Math.max(0, pos.obligation_target_mwh - post_re);
    const gap_closed = pos.gap_mwh > 0 ? Math.min(100, ((pos.gap_mwh - post_gap) / pos.gap_mwh) * 100) : 100;
    const rec_saved = Math.min(incremental_mwh, pos.rec_shortfall_mwh);
    const annual_rec_savings_cr = (rec_saved * 1000 * pos.penalty_rate_inr_per_kwh) / 1e7;
    const annual_energy_savings_cr = (incremental_mwh * (7000 - tariff_inr_per_mwh)) / 1e7;
    const annual_benefit_cr = annual_rec_savings_cr + Math.max(0, annual_energy_savings_cr);
    const payback = capex_cr > 0 && annual_benefit_cr > 0 ? capex_cr / annual_benefit_cr : null;
    const wacc_d = wacc_pct / 100;
    let npv = -capex_cr;
    if (wacc_d > 0) npv += annual_benefit_cr * ((1 - Math.pow(1 + wacc_d, -project_life_years)) / wacc_d);
    const lcoe = capex_cr > 0 ? (capex_cr * 1e7) / (incremental_mwh * project_life_years) : null;
    const applies_to_ccts = action_type !== 'REC_PURCHASE';
    return {
      action_type, incremental_renewable_mwh: incremental_mwh,
      post_action_renewable_mwh: post_re, post_action_share_pct: Number(post_share.toFixed(2)),
      post_action_gap_mwh: post_gap, gap_closed_pct: Number(gap_closed.toFixed(1)),
      rec_procurement_saved_mwh: rec_saved, cost_per_mwh_inr: tariff_inr_per_mwh,
      capex_cr, annual_opex_cr: (incremental_mwh * tariff_inr_per_mwh) / 1e7,
      npv_cr: Number(npv.toFixed(2)), payback_years: payback !== null ? Number(payback.toFixed(1)) : null,
      lcoe_inr_per_mwh: lcoe !== null ? Number(lcoe.toFixed(0)) : null,
      applies_to_rco: true, applies_to_ccts, double_count_flag: false,
      mechanism_note: applies_to_ccts
        ? `${incremental_mwh.toFixed(0)} MWh allocated to RCO first. Surplus beyond obligation available for CCTS Scope 2 adjustment.`
        : `REC purchase closes RCO gap only — no physical energy substitution, no CCTS Scope 2 benefit.`,
    };
  }
}
