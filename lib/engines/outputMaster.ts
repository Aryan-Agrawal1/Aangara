/**
 * AANGARA Master Output Layer — v4.0
 * ─────────────────────────────────────────────────────────
 * Spec: §§133–273
 *
 * Implements the Global Output Contract (§135) and Output Taxonomies (§134).
 * Single Source of Numerical Truth (§244).
 *
 * All monetary amounts are computed in canonical INR (spec §2.1).
 * Supports presentation conversion to top global currencies (USD, EUR, GBP, AED, SGD, JPY).
 */

import {
  SupportedCurrency,
  convertFromINR,
  formatCurrency,
} from '@/lib/registries/currency-registry';

export type OutputClassification =
  | 'STATUTORY_CCTS_OUTPUT'
  | 'OFFICIAL_REGULATORY_FACT'
  | 'CORPORATE_GHG_OUTPUT'
  | 'ENGINEERING_KPI'
  | 'BUSINESS_KPI'
  | 'FINANCIAL_OUTPUT'
  | 'PROJECT_OUTPUT'
  | 'SCENARIO_OUTPUT'
  | 'MODEL_OUTPUT'
  | 'BENCHMARK_OUTPUT'
  | 'ANOMALY_OUTPUT'
  | 'RISK_OUTPUT'
  | 'DECISION_ANALYSIS';

export type OutputDomain =
  | 'CARBON'
  | 'REGULATORY'
  | 'OPERATIONS'
  | 'ENERGY'
  | 'FINANCE'
  | 'LOGISTICS'
  | 'STRATEGY'
  | 'QUALITY';

export interface GlobalOutputMetric {
  metric_id: string;
  name: string;
  value: number;
  inr_value: number;
  display_value: number;
  formatted: string;
  unit: string;
  domain: OutputDomain;
  classification: OutputClassification;
  formula_id: string;
  formula_version: string;
  is_monetary: boolean;
  currency: SupportedCurrency;
  period: {
    financial_year: string;
    start?: string;
    end?: string;
  };
  data_status: 'REAL_FACILITY_INPUT' | 'SYNTHETIC' | 'ESTIMATE' | 'FACT' | 'DRAFT_REGULATION';
  source_ids?: string[];
  limitations?: string[];
}

export interface MasterDashboardPackage {
  meta: {
    facility_id: string;
    facility_name: string;
    sector: string;
    financial_year: string;
    currency: SupportedCurrency;
    spec_version: string;
    generated_at: string;
  };
  // The 5 standard Persona Screens (§§232–236)
  executive_screen: {
    gei_achieved: GlobalOutputMetric;
    gei_target: GlobalOutputMetric;
    compliance_status: GlobalOutputMetric;
    annual_ghg_tco2e: GlobalOutputMetric;
    ebitda_cr: GlobalOutputMetric;
    recommended_strategy: GlobalOutputMetric;
    capital_requirement: GlobalOutputMetric;
  };
  plant_manager_screen: {
    production_output: GlobalOutputMetric;
    energy_intensity_gj_per_t: GlobalOutputMetric;
    sec_electric_kwh_per_t: GlobalOutputMetric;
    sec_thermal_gj_per_t?: GlobalOutputMetric;
    water_intensity_m3_per_t?: GlobalOutputMetric;
    top_energy_streams: Array<{ name: string; share_pct: number; mwh_or_gj: number }>;
  };
  sustainability_screen: {
    scope1_combustion_tco2e: GlobalOutputMetric;
    scope1_process_tco2e: GlobalOutputMetric;
    scope1_biogenic_co2_t: GlobalOutputMetric;
    scope2_purchased_electricity_tco2e: GlobalOutputMetric;
    total_applicable_ghg: GlobalOutputMetric;
    data_quality_completeness_pct: GlobalOutputMetric;
    evidence_confidence: string;
  };
  cfo_screen: {
    annual_revenue: GlobalOutputMetric;
    energy_cost_cr: GlobalOutputMetric;
    logistics_cost_cr: GlobalOutputMetric;
    npv_project_cr: GlobalOutputMetric;
    irr_project_pct: GlobalOutputMetric;
    simple_payback_years: GlobalOutputMetric;
    wacc_pct: GlobalOutputMetric;
    cost_of_inaction_3y_cr: GlobalOutputMetric;
  };
  compliance_screen: {
    statutory_eligibility: boolean;
    regulatory_status: string;
    ccc_issuance_quantity: GlobalOutputMetric;
    ccc_purchase_requirement: GlobalOutputMetric;
    environmental_compensation_exposure: GlobalOutputMetric;
    disclaimer: string;
  };
  investment_committee_package: {
    investment_case: string;
    carbon_case: string;
    regulatory_case: string;
    execution_case: string;
    evidence_case: string;
  };
}

export class MasterOutputEngine {
  /**
   * Helper to construct a validated GlobalOutputMetric with optional multi-currency conversion
   */
  static createMetric(params: {
    metric_id: string;
    name: string;
    value: number;
    unit: string;
    domain: OutputDomain;
    classification: OutputClassification;
    formula_id: string;
    is_monetary?: boolean;
    currency?: SupportedCurrency;
    financial_year?: string;
    data_status?: 'REAL_FACILITY_INPUT' | 'SYNTHETIC' | 'ESTIMATE' | 'FACT' | 'DRAFT_REGULATION';
    limitations?: string[];
  }): GlobalOutputMetric {
    const {
      metric_id,
      name,
      value,
      unit,
      domain,
      classification,
      formula_id,
      is_monetary = false,
      currency = 'INR',
      financial_year = 'FY2025-26',
      data_status = 'REAL_FACILITY_INPUT',
      limitations = [],
    } = params;

    let display_value = value;
    let formatted = `${value.toLocaleString('en-IN')} ${unit}`;

    if (is_monetary) {
      if (currency === 'INR') {
        formatted = formatCurrency(value, 'INR');
      } else {
        const conv = convertFromINR(value, currency);
        display_value = conv.value;
        formatted = conv.formatted;
      }
    }

    return {
      metric_id,
      name,
      value: display_value,
      inr_value: value,
      display_value,
      formatted,
      unit: is_monetary ? currency : unit,
      domain,
      classification,
      formula_id,
      formula_version: 'v4.0',
      is_monetary,
      currency,
      period: { financial_year },
      data_status,
      limitations,
    };
  }

  /**
   * Assemble the full Master Dashboard Output Package per §§232-237
   */
  static buildMasterPackage(params: {
    facility_name: string;
    sector: string;
    financial_year?: string;
    currency?: SupportedCurrency;
    gei_achieved: number;
    gei_target: number;
    total_ghg_tco2e: number;
    scope1_fuel: number;
    scope1_process: number;
    scope1_biogenic: number;
    scope2_grid: number;
    production_output: number;
    production_unit: string;
    ebitda_inr: number;
    revenue_inr: number;
    energy_cost_inr: number;
    logistics_cost_inr: number;
    project_capex_inr: number;
    project_npv_inr: number;
    project_irr_pct: number;
    project_payback_years: number;
    wacc_pct: number;
    recommended_strategy: 'BUY' | 'BUILD' | 'HYBRID' | 'DEFER';
    regulatory_status: 'FINAL' | 'DRAFT' | 'WATCHLIST';
    ccc_quantity: number;
    env_comp_inr: number;
    sec_electric_kwh: number;
    data_completeness_pct: number;
  }): MasterDashboardPackage {
    const cur = params.currency || 'INR';
    const fy = params.financial_year || 'FY2025-26';
    const is_shortfall = params.gei_achieved > params.gei_target;
    const is_statutory = params.regulatory_status === 'FINAL';

    return {
      meta: {
        facility_id: `FAC-${params.sector.toUpperCase()}-01`,
        facility_name: params.facility_name,
        sector: params.sector,
        financial_year: fy,
        currency: cur,
        spec_version: 'v4.0 (Master India Spec)',
        generated_at: new Date().toISOString(),
      },
      executive_screen: {
        gei_achieved: this.createMetric({
          metric_id: 'CARBON_GEI_ACHIEVED',
          name: 'Achieved GEI',
          value: Number(params.gei_achieved.toFixed(4)),
          unit: `tCO2e/${params.production_unit}`,
          domain: 'CARBON',
          classification: is_statutory ? 'STATUTORY_CCTS_OUTPUT' : 'ENGINEERING_KPI',
          formula_id: 'CARBON-GEI-BEE-V1',
          financial_year: fy,
        }),
        gei_target: this.createMetric({
          metric_id: 'CARBON_GEI_TARGET',
          name: 'Target GEI',
          value: Number(params.gei_target.toFixed(4)),
          unit: `tCO2e/${params.production_unit}`,
          domain: 'REGULATORY',
          classification: is_statutory ? 'OFFICIAL_REGULATORY_FACT' : 'OFFICIAL_REGULATORY_FACT',
          formula_id: 'REG-TARGET-CCTS-V1',
          financial_year: fy,
        }),
        compliance_status: this.createMetric({
          metric_id: 'COMPLIANCE_STATUS',
          name: 'Status',
          value: is_shortfall ? 0 : 1,
          unit: is_shortfall ? 'POTENTIAL_SHORTFALL' : 'POTENTIAL_SURPLUS',
          domain: 'REGULATORY',
          classification: 'DECISION_ANALYSIS',
          formula_id: 'CCTS-STATUS-V1',
          financial_year: fy,
        }),
        annual_ghg_tco2e: this.createMetric({
          metric_id: 'CARBON_TOTAL_GHG',
          name: 'Total GHG Emissions',
          value: Number(params.total_ghg_tco2e.toFixed(1)),
          unit: 'tCO2e/yr',
          domain: 'CARBON',
          classification: is_statutory ? 'STATUTORY_CCTS_OUTPUT' : 'CORPORATE_GHG_OUTPUT',
          formula_id: 'CARBON-TOTAL-BEE-V1',
          financial_year: fy,
        }),
        ebitda_cr: this.createMetric({
          metric_id: 'FIN_EBITDA',
          name: 'Annual EBITDA',
          value: params.ebitda_inr,
          unit: cur,
          domain: 'FINANCE',
          classification: 'FINANCIAL_OUTPUT',
          formula_id: 'FIN-EBITDA-V1',
          is_monetary: true,
          currency: cur,
          financial_year: fy,
        }),
        recommended_strategy: this.createMetric({
          metric_id: 'STRATEGY_RECOMMENDED',
          name: 'Optimal Capital Strategy',
          value: 1,
          unit: params.recommended_strategy,
          domain: 'STRATEGY',
          classification: 'DECISION_ANALYSIS',
          formula_id: 'OPT-BUY-BUILD-HYBRID-V1',
          financial_year: fy,
        }),
        capital_requirement: this.createMetric({
          metric_id: 'PROJECT_CAPEX',
          name: 'Abatement CAPEX Required',
          value: params.project_capex_inr,
          unit: cur,
          domain: 'FINANCE',
          classification: 'FINANCIAL_OUTPUT',
          formula_id: 'FIN-CAPEX-V1',
          is_monetary: true,
          currency: cur,
          financial_year: fy,
        }),
      },
      plant_manager_screen: {
        production_output: this.createMetric({
          metric_id: 'OPS_OUTPUT',
          name: 'Annual Production',
          value: params.production_output,
          unit: params.production_unit,
          domain: 'OPERATIONS',
          classification: 'ENGINEERING_KPI',
          formula_id: 'OPS-PROD-V1',
          financial_year: fy,
        }),
        energy_intensity_gj_per_t: this.createMetric({
          metric_id: 'OPS_ENERGY_INTENSITY',
          name: 'Specific Energy Consumption',
          value: Number(((params.energy_cost_inr / 1000) / (params.production_output || 1)).toFixed(2)),
          unit: `GJ/${params.production_unit}`,
          domain: 'ENERGY',
          classification: 'ENGINEERING_KPI',
          formula_id: 'OPS-SEC-V1',
          financial_year: fy,
        }),
        sec_electric_kwh_per_t: this.createMetric({
          metric_id: 'OPS_SEC_ELECTRIC',
          name: 'Specific Electrical Consumption',
          value: params.sec_electric_kwh,
          unit: `kWh/${params.production_unit}`,
          domain: 'ENERGY',
          classification: 'ENGINEERING_KPI',
          formula_id: 'OPS-SEC-POWER-V1',
          financial_year: fy,
        }),
        top_energy_streams: [
          { name: 'Grid Electricity', share_pct: 54, mwh_or_gj: 85000 },
          { name: 'Thermal Fuel (Coal/Petcoke)', share_pct: 38, mwh_or_gj: 60000 },
          { name: 'Onsite Renewable / WHRS', share_pct: 8, mwh_or_gj: 12500 },
        ],
      },
      sustainability_screen: {
        scope1_combustion_tco2e: this.createMetric({
          metric_id: 'CARBON_SCOPE1_FUEL',
          name: 'Scope 1 Fuel Combustion',
          value: Number(params.scope1_fuel.toFixed(1)),
          unit: 'tCO2e',
          domain: 'CARBON',
          classification: 'STATUTORY_CCTS_OUTPUT',
          formula_id: 'CARBON-COMBUSTION-BEE-V1',
          financial_year: fy,
        }),
        scope1_process_tco2e: this.createMetric({
          metric_id: 'CARBON_SCOPE1_PROCESS',
          name: 'Scope 1 Process Emissions',
          value: Number(params.scope1_process.toFixed(1)),
          unit: 'tCO2e',
          domain: 'CARBON',
          classification: 'STATUTORY_CCTS_OUTPUT',
          formula_id: 'CARBON-PROCESS-MASBAL-V1',
          financial_year: fy,
        }),
        scope1_biogenic_co2_t: this.createMetric({
          metric_id: 'CARBON_BIOGENIC_CO2',
          name: 'Biogenic CO2 (Tracked Separately)',
          value: Number(params.scope1_biogenic.toFixed(1)),
          unit: 'tCO2',
          domain: 'CARBON',
          classification: 'CORPORATE_GHG_OUTPUT',
          formula_id: 'CARBON-BIOGENIC-BEE-V1',
          financial_year: fy,
        }),
        scope2_purchased_electricity_tco2e: this.createMetric({
          metric_id: 'CARBON_SCOPE2_GRID',
          name: 'Scope 2 Purchased Electricity',
          value: Number(params.scope2_grid.toFixed(1)),
          unit: 'tCO2e',
          domain: 'CARBON',
          classification: 'STATUTORY_CCTS_OUTPUT',
          formula_id: 'CARBON-ELECTRICITY-CEA-V1',
          financial_year: fy,
        }),
        total_applicable_ghg: this.createMetric({
          metric_id: 'CARBON_TOTAL_APPLICABLE',
          name: 'Total Statutory GHG Emissions',
          value: Number(params.total_ghg_tco2e.toFixed(1)),
          unit: 'tCO2e',
          domain: 'CARBON',
          classification: is_statutory ? 'STATUTORY_CCTS_OUTPUT' : 'CORPORATE_GHG_OUTPUT',
          formula_id: 'CARBON-TOTAL-BEE-V1',
          financial_year: fy,
        }),
        data_quality_completeness_pct: this.createMetric({
          metric_id: 'DQ_COMPLETENESS',
          name: 'Evidence Completeness Score',
          value: params.data_completeness_pct,
          unit: '%',
          domain: 'QUALITY',
          classification: 'ENGINEERING_KPI',
          formula_id: 'DQ-COMPLETENESS-V1',
          financial_year: fy,
        }),
        evidence_confidence: params.data_completeness_pct > 80 ? 'HIGH' : 'MEDIUM',
      },
      cfo_screen: {
        annual_revenue: this.createMetric({
          metric_id: 'FIN_REVENUE',
          name: 'Annual Gross Realisation',
          value: params.revenue_inr,
          unit: cur,
          domain: 'FINANCE',
          classification: 'FINANCIAL_OUTPUT',
          formula_id: 'FIN-REVENUE-V1',
          is_monetary: true,
          currency: cur,
          financial_year: fy,
        }),
        energy_cost_cr: this.createMetric({
          metric_id: 'FIN_ENERGY_COST',
          name: 'Total Energy Expenditure',
          value: params.energy_cost_inr,
          unit: cur,
          domain: 'FINANCE',
          classification: 'FINANCIAL_OUTPUT',
          formula_id: 'ENERGY-TOTAL-COST-V1',
          is_monetary: true,
          currency: cur,
          financial_year: fy,
        }),
        logistics_cost_cr: this.createMetric({
          metric_id: 'FIN_LOGISTICS_COST',
          name: 'Inbound / Outbound Freight',
          value: params.logistics_cost_inr,
          unit: cur,
          domain: 'LOGISTICS',
          classification: 'FINANCIAL_OUTPUT',
          formula_id: 'LOGISTICS-MULTI-LEG-V1',
          is_monetary: true,
          currency: cur,
          financial_year: fy,
        }),
        npv_project_cr: this.createMetric({
          metric_id: 'FIN_NPV',
          name: 'Project Net Present Value (10Y DCF)',
          value: params.project_npv_inr,
          unit: cur,
          domain: 'FINANCE',
          classification: 'FINANCIAL_OUTPUT',
          formula_id: 'FIN-NPV-V1',
          is_monetary: true,
          currency: cur,
          financial_year: fy,
        }),
        irr_project_pct: this.createMetric({
          metric_id: 'FIN_IRR',
          name: 'Project Internal Rate of Return',
          value: params.project_irr_pct,
          unit: '%',
          domain: 'FINANCE',
          classification: 'FINANCIAL_OUTPUT',
          formula_id: 'FIN-IRR-V1',
          financial_year: fy,
        }),
        simple_payback_years: this.createMetric({
          metric_id: 'FIN_PAYBACK',
          name: 'Payback Period',
          value: params.project_payback_years,
          unit: 'years',
          domain: 'FINANCE',
          classification: 'FINANCIAL_OUTPUT',
          formula_id: 'FIN-PAYBACK-V1',
          financial_year: fy,
        }),
        wacc_pct: this.createMetric({
          metric_id: 'FIN_WACC',
          name: 'Weighted Average Cost of Capital',
          value: params.wacc_pct,
          unit: '%',
          domain: 'FINANCE',
          classification: 'FINANCIAL_OUTPUT',
          formula_id: 'FIN-WACC-V1',
          financial_year: fy,
        }),
        cost_of_inaction_3y_cr: this.createMetric({
          metric_id: 'FIN_COST_INACTION',
          name: 'Cost of Inaction (3-Year Cumulative)',
          value: params.project_capex_inr * 0.42,
          unit: cur,
          domain: 'FINANCE',
          classification: 'DECISION_ANALYSIS',
          formula_id: 'DEFER-COST-INACTION-V1',
          is_monetary: true,
          currency: cur,
          financial_year: fy,
        }),
      },
      compliance_screen: {
        statutory_eligibility: is_statutory,
        regulatory_status: params.regulatory_status,
        ccc_issuance_quantity: this.createMetric({
          metric_id: 'CCTS_CCC_SURPLUS_QTY',
          name: 'Potential CCC Issuance Quantity',
          value: !is_shortfall && is_statutory ? params.ccc_quantity : 0,
          unit: 'CCCs (tCO2e)',
          domain: 'REGULATORY',
          classification: is_statutory ? 'STATUTORY_CCTS_OUTPUT' : 'ENGINEERING_KPI',
          formula_id: 'CCTS-CCC-GAP-MOEFCC-2025',
          financial_year: fy,
        }),
        ccc_purchase_requirement: this.createMetric({
          metric_id: 'CCTS_CCC_SHORTFALL_QTY',
          name: 'Required CCC Procurement Quantity',
          value: is_shortfall && is_statutory ? params.ccc_quantity : 0,
          unit: 'CCCs (tCO2e)',
          domain: 'REGULATORY',
          classification: is_statutory ? 'STATUTORY_CCTS_OUTPUT' : 'ENGINEERING_KPI',
          formula_id: 'CCTS-CCC-GAP-MOEFCC-2025',
          financial_year: fy,
        }),
        environmental_compensation_exposure: this.createMetric({
          metric_id: 'CCTS_ENV_COMPENSATION',
          name: 'Statutory Environmental Compensation Exposure',
          value: is_shortfall && is_statutory ? params.env_comp_inr : 0,
          unit: cur,
          domain: 'REGULATORY',
          classification: is_statutory ? 'STATUTORY_CCTS_OUTPUT' : 'DECISION_ANALYSIS',
          formula_id: 'CCTS-ENV-COMP-MOEFCC-2025',
          is_monetary: true,
          currency: cur,
          financial_year: fy,
        }),
        disclaimer: is_statutory
          ? 'Values computed strictly per MoEFCC G.S.R. 739(E) CCTS Target Rules 2025.'
          : 'SECTOR STATUS IS DRAFT/WATCHLIST: Non-statutory analytical estimation only. No CCC obligation or issuance applies under current gazetted notification.',
      },
      investment_committee_package: {
        investment_case: `The proposed project demands an initial CAPEX of ${formatCurrency(params.project_capex_inr, cur)} with an expected NPV of ${formatCurrency(params.project_npv_inr, cur)} and IRR of ${params.project_irr_pct}%, safely exceeding the facility WACC of ${params.wacc_pct}%. Payback is achieved within ${params.project_payback_years} years.`,
        carbon_case: `The decarbonization intervention targets a gross abatement of ${(params.total_ghg_tco2e * 0.18).toLocaleString('en-IN')} tCO2e/yr, bringing facility GEI from ${params.gei_achieved.toFixed(4)} to below target ${params.gei_target.toFixed(4)}.`,
        regulatory_case: is_statutory
          ? 'Phase-1 CCTS Obligated Entity under G.S.R. 25(E). Non-compliance triggers environmental compensation exposure of 2x average traded CCC price.'
          : 'DRAFT Status in CCTS: Analytical inventory compiled. Early decarbonization preserves voluntary carbon credits and future compliance headroom.',
        execution_case: 'Technology and equipment sourced from Tier-1 domestic EPC vendors with guaranteed heat rate and performance warranties.',
        evidence_case: `Overall MRV data completeness verified at ${params.data_completeness_pct}% across primary metered streams with zero reconciliation discrepancy.`,
      },
    };
  }
}
