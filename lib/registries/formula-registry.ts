/**
 * AANGARA Formula Registry v3.0
 * ─────────────────────────────────────────────────────────
 * Machine-readable registry of every formula used across all engines.
 * Per spec §111 — every material result must carry a formula_id + version.
 *
 * Never present ENGINEERING_ANALYTICAL or SCENARIO_METHOD results as STATUTORY_CCTS.
 */

export type AuthorityClass =
  | 'STATUTORY_CCTS'
  | 'OFFICIAL_METHOD'
  | 'INVENTORY_STANDARD'
  | 'ENGINEERING_ANALYTICAL'
  | 'FINANCE_STANDARD'
  | 'MODEL_METHOD'
  | 'SCENARIO_METHOD';

export type FormulaId = string;

export interface FormulaRecord {
  formula_id: string;
  formula_name: string;
  domain: 'CARBON' | 'REGULATORY' | 'DATA_QUALITY' | 'BENCHMARK' | 'ANOMALY' | 'OPPORTUNITY' | 'FINANCE' | 'SCENARIO' | 'OPTIMIZER' | 'BUSINESS_TWIN';
  authority_class: AuthorityClass;
  version: string;
  equation: string;
  variables: string[];
  units: string;
  source_ids: string[];
  effective_from: string;
  effective_to: string | null;
  implementation_notes?: string;
  description?: string;
  source_document?: string;
  gazette_reference?: string;
}

export const FORMULA_REGISTRY: Record<string, FormulaRecord> = {

  // ─── CARBON ENGINE ───────────────────────────────────────
  'CARBON-COMBUSTION-BEE-V1': {
    formula_id: 'CARBON-COMBUSTION-BEE-V1',
    formula_name: 'BEE CCTS Combustion Emission Formula',
    domain: 'CARBON',
    authority_class: 'STATUTORY_CCTS',
    version: '1.0',
    equation: 'E_fuel = AD_fuel × EF_fuel × OF_fuel',
    variables: ['AD_fuel (GJ)', 'EF_fuel (tCO2/GJ)', 'OF_fuel (dimensionless)'],
    units: 'tCO2',
    source_ids: ['BEE-CCTS-PROC-2024'],
    effective_from: '2025-04-01',
    effective_to: null,
    implementation_notes: 'AD_fuel = Fuel_Quantity × NCV. OF defaults from IPCC if site-specific unavailable.',
  },
  'CARBON-AD-BEE-V1': {
    formula_id: 'CARBON-AD-BEE-V1',
    formula_name: 'BEE Fuel Activity Data (NCV method)',
    domain: 'CARBON',
    authority_class: 'STATUTORY_CCTS',
    version: '1.0',
    equation: 'AD_GJ = Fuel_kg × NCV_kcal_per_kg × 4.184 ÷ 1,000,000',
    variables: ['Fuel_kg', 'NCV_kcal_per_kg'],
    units: 'GJ',
    source_ids: ['BEE-CCTS-PROC-2024'],
    effective_from: '2025-04-01',
    effective_to: null,
  },
  'CARBON-ELECTRICITY-BEE-V1': {
    formula_id: 'CARBON-ELECTRICITY-BEE-V1',
    formula_name: 'BEE CCTS Purchased Electricity Emission',
    domain: 'CARBON',
    authority_class: 'STATUTORY_CCTS',
    version: '1.0',
    equation: 'E_electricity = MWh_imported × EF_tCO2_per_MWh',
    variables: ['MWh_imported', 'EF_tCO2_per_MWh (from CEA/registry)'],
    units: 'tCO2',
    source_ids: ['BEE-CCTS-PROC-2024', 'CEA-BASELINE-V21'],
    effective_from: '2025-04-01',
    effective_to: null,
    implementation_notes: 'EF must come from factor registry — never hardcoded 0.716.',
  },
  'CARBON-PROCESS-MASBAL-V1': {
    formula_id: 'CARBON-PROCESS-MASBAL-V1',
    formula_name: 'Carbon Mass Balance — Process Emissions',
    domain: 'CARBON',
    authority_class: 'OFFICIAL_METHOD',
    version: '1.0',
    equation: 'E_CO2 = (ΣCarbon_in - ΣCarbon_out) × 44/12',
    variables: ['Carbon_in (t)', 'Carbon_out (t)'],
    units: 'tCO2',
    source_ids: ['BEE-CCTS-PROC-2024', 'IPCC2006-V2'],
    effective_from: '2025-04-01',
    effective_to: null,
    implementation_notes: 'Used for cement calcination, steel carbon balance, petrochemical feedstock balance.',
  },
  'CARBON-GEI-BEE-V1': {
    formula_id: 'CARBON-GEI-BEE-V1',
    formula_name: 'GHG Emission Intensity (GEI)',
    domain: 'CARBON',
    authority_class: 'STATUTORY_CCTS',
    version: '1.0',
    equation: 'GEI = Total_Applicable_GHG_Emissions / Total_Equivalent_Output',
    variables: ['Total_Applicable_GHG_Emissions (tCO2e)', 'Total_Equivalent_Output (t or MWh)'],
    units: 'tCO2e/t_output',
    source_ids: ['BEE-CCTS-PROC-2024', 'MOEFCC-GSR25E'],
    effective_from: '2025-04-01',
    effective_to: null,
  },
  'CCTS-CCC-GAP-MOEFCC-2025': {
    formula_id: 'CCTS-CCC-GAP-MOEFCC-2025',
    formula_name: 'CCTS CCC Surplus/Shortfall Quantity',
    domain: 'REGULATORY',
    authority_class: 'STATUTORY_CCTS',
    version: '1.0',
    equation: 'CCC_qty = max(0, GEI_target - GEI_achieved) × Equivalent_Output  [for surplus]\nCCC_procurement = max(0, GEI_achieved - GEI_target) × Equivalent_Output  [for shortfall]',
    variables: ['GEI_target', 'GEI_achieved', 'Equivalent_Output'],
    units: 'tCO2e (certificates)',
    source_ids: ['MOEFCC-GSR739E-2025'],
    effective_from: '2025-04-01',
    effective_to: null,
    implementation_notes: 'Only applicable when regulatory_status = FINAL_COMPLIANCE. AANGARA calculates quantity only — does not issue certificates.',
  },
  'CCTS-ENV-COMP-MOEFCC-2025': {
    formula_id: 'CCTS-ENV-COMP-MOEFCC-2025',
    formula_name: 'CCTS Environmental Compensation',
    domain: 'REGULATORY',
    authority_class: 'STATUTORY_CCTS',
    version: '1.0',
    equation: 'Environmental_Compensation = 2 × Shortfall_Quantity × Average_Traded_CCC_Price',
    variables: ['Shortfall_Quantity (tCO2e)', 'Average_Traded_CCC_Price (₹/CCC)'],
    units: '₹',
    source_ids: ['MOEFCC-GSR739E-2025'],
    effective_from: '2025-04-01',
    effective_to: null,
    implementation_notes: 'CCC price must be OFFICIAL_REGULATORY_VALUE or SCENARIO_ASSUMPTION — not hardcoded.',
  },
  'CARBON-ANODE-V1': {
    formula_id: 'CARBON-ANODE-V1',
    formula_name: 'Aluminium Anode Carbon Combustion',
    domain: 'CARBON',
    authority_class: 'OFFICIAL_METHOD',
    version: '1.0',
    equation: 'CO2_from_Anode = Anode_Carbon_Consumed × C_mass_fraction × (44/12) × Oxidized_Fraction',
    variables: ['Anode_Carbon_Consumed (t)', 'C_mass_fraction', 'Oxidized_Fraction'],
    units: 'tCO2',
    source_ids: ['IPCC2006-V3', 'BEE-CCTS-PROC-2024'],
    effective_from: '2025-04-01',
    effective_to: null,
    implementation_notes: 'Replaces universal 1.62 tCO2/t_Al factor. Requires measured anode carbon consumption.',
  },

  // ─── DATA QUALITY ENGINE ─────────────────────────────────
  'DQ-COMPLETENESS-V1': {
    formula_id: 'DQ-COMPLETENESS-V1',
    formula_name: 'Weighted Completeness Score',
    domain: 'DATA_QUALITY',
    authority_class: 'ENGINEERING_ANALYTICAL',
    version: '1.0',
    equation: 'Completeness = Σ(w_i × availability_i) / Σ(w_i)',
    variables: ['w_i (field weight)', 'availability_i (0..1)'],
    units: '%',
    source_ids: ['AANGARA-SPEC-V3'],
    effective_from: '2025-04-01',
    effective_to: null,
  },
  'DQ-RECONCILIATION-V1': {
    formula_id: 'DQ-RECONCILIATION-V1',
    formula_name: 'Ledger Reconciliation Error',
    domain: 'DATA_QUALITY',
    authority_class: 'ENGINEERING_ANALYTICAL',
    version: '1.0',
    equation: 'Reconciliation_Error = |Reported_Total - ΣComponent_i| / max(|Reported_Total|, ε)',
    variables: ['Reported_Total', 'ΣComponent_i', 'ε (small positive constant)'],
    units: 'fraction (0..1)',
    source_ids: ['AANGARA-SPEC-V3'],
    effective_from: '2025-04-01',
    effective_to: null,
  },

  // ─── BENCHMARK ENGINE ────────────────────────────────────
  'BENCH-ECDF-V1': {
    formula_id: 'BENCH-ECDF-V1',
    formula_name: 'Empirical CDF Efficiency Percentile',
    domain: 'BENCHMARK',
    authority_class: 'MODEL_METHOD',
    version: '1.0',
    equation: 'F(x) = (1/n) × Σ I(x_i ≤ x)\nEfficiency_Percentile = 100 × (1 - F(x))',
    variables: ['x (facility value)', 'x_i (peer observations)', 'n (cohort size)'],
    units: 'percentile (0..100)',
    source_ids: ['AANGARA-SPEC-V3'],
    effective_from: '2025-04-01',
    effective_to: null,
    implementation_notes: 'Lower-is-better metric. Higher percentile = better efficiency relative to peers.',
  },

  // ─── ANOMALY ENGINE ──────────────────────────────────────
  'ANOMALY-ROBUST-Z-V1': {
    formula_id: 'ANOMALY-ROBUST-Z-V1',
    formula_name: 'Robust Modified Z-Score (MAD)',
    domain: 'ANOMALY',
    authority_class: 'MODEL_METHOD',
    version: '1.0',
    equation: 'Robust_Z = 0.6745 × (x - median) / MAD',
    variables: ['x (observation)', 'median (sample median)', 'MAD (median absolute deviation)'],
    units: 'z-score',
    source_ids: ['IGLEWICZ-HOAGLIN-1993'],
    effective_from: '2025-04-01',
    effective_to: null,
    implementation_notes: 'Preferred over standard z-score for industrial data with outliers.',
  },
  'ANOMALY-IQR-V1': {
    formula_id: 'ANOMALY-IQR-V1',
    formula_name: 'IQR Fence Screening Rule',
    domain: 'ANOMALY',
    authority_class: 'MODEL_METHOD',
    version: '1.0',
    equation: 'Lower_Fence = Q1 - 1.5×IQR; Upper_Fence = Q3 + 1.5×IQR',
    variables: ['Q1 (25th percentile)', 'Q3 (75th percentile)', 'IQR = Q3 - Q1'],
    units: 'same as input',
    source_ids: ['TUKEY-1977'],
    effective_from: '2025-04-01',
    effective_to: null,
    implementation_notes: 'Screening rule only — not proof of equipment failure.',
  },

  // ─── FINANCE ENGINE ──────────────────────────────────────
  'FIN-FCFF-V1': {
    formula_id: 'FIN-FCFF-V1',
    formula_name: 'Free Cash Flow to Firm (Unlevered)',
    domain: 'FINANCE',
    authority_class: 'FINANCE_STANDARD',
    version: '1.0',
    equation: 'FCFF_t = EBIT_t × (1 - Tax_t) + D&A_t - CAPEX_t - ΔNWC_t',
    variables: ['EBIT_t', 'Tax_t', 'D&A_t', 'CAPEX_t', 'ΔNWC_t'],
    units: '₹',
    source_ids: ['DAMODARAN-FCFF'],
    effective_from: '2025-04-01',
    effective_to: null,
  },
  'FIN-NPV-V1': {
    formula_id: 'FIN-NPV-V1',
    formula_name: 'Net Present Value',
    domain: 'FINANCE',
    authority_class: 'FINANCE_STANDARD',
    version: '1.0',
    equation: 'NPV = Σ_(t=0..N) FCF_t / (1+r)^t',
    variables: ['FCF_t (₹)', 'r (discount rate — WACC for FCFF, Ke for FCFE)', 'N (project life, years)'],
    units: '₹',
    source_ids: ['DAMODARAN-FCFF'],
    effective_from: '2025-04-01',
    effective_to: null,
    implementation_notes: 'Discount rate must match cash-flow type. Never mix FCFF with cost of equity.',
  },
  'FIN-WACC-V1': {
    formula_id: 'FIN-WACC-V1',
    formula_name: 'Weighted Average Cost of Capital',
    domain: 'FINANCE',
    authority_class: 'FINANCE_STANDARD',
    version: '1.0',
    equation: 'WACC = Ke × E/V + Kd × (1-T) × D/V  where V = E + D',
    variables: ['Ke (cost of equity)', 'Kd (cost of debt)', 'E/V (equity ratio)', 'D/V (debt ratio)', 'T (tax rate)'],
    units: '%',
    source_ids: ['DAMODARAN-WACC'],
    effective_from: '2025-04-01',
    effective_to: null,
  },
  'FIN-CAPM-V1': {
    formula_id: 'FIN-CAPM-V1',
    formula_name: 'CAPM Cost of Equity',
    domain: 'FINANCE',
    authority_class: 'FINANCE_STANDARD',
    version: '1.0',
    equation: 'Ke = Rf + βL × ERP + CRP',
    variables: ['Rf (risk-free rate)', 'βL (levered beta)', 'ERP (equity risk premium)', 'CRP (country risk premium)'],
    units: '%',
    source_ids: ['DAMODARAN-CAPM'],
    effective_from: '2025-04-01',
    effective_to: null,
  },
  'FIN-MAC-LIFECYCLE-V1': {
    formula_id: 'FIN-MAC-LIFECYCLE-V1',
    formula_name: 'Marginal Abatement Cost — Lifecycle (Undiscounted)',
    domain: 'FINANCE',
    authority_class: 'ENGINEERING_ANALYTICAL',
    version: '1.0',
    equation: 'Lifecycle_MAC = Net_Lifecycle_Cost / Cumulative_Abatement',
    variables: ['Net_Lifecycle_Cost (₹)', 'Cumulative_Abatement (tCO2e)'],
    units: '₹/tCO2e',
    source_ids: ['AANGARA-SPEC-V3'],
    effective_from: '2025-04-01',
    effective_to: null,
  },
  'FIN-MAC-DISCOUNTED-V1': {
    formula_id: 'FIN-MAC-DISCOUNTED-V1',
    formula_name: 'Marginal Abatement Cost — Discounted',
    domain: 'FINANCE',
    authority_class: 'ENGINEERING_ANALYTICAL',
    version: '1.0',
    equation: 'Discounted_MAC = PV(Incremental_Project_Costs) / PV(Abatement_t)',
    variables: ['PV costs (₹)', 'PV abatement (tCO2e)', 'discount rate'],
    units: '₹/tCO2e',
    source_ids: ['AANGARA-SPEC-V3'],
    effective_from: '2025-04-01',
    effective_to: null,
    implementation_notes: 'Always display which MAC definition is used — lifecycle vs discounted.',
  },
  'FIN-LCOE-NREL-V1': {
    formula_id: 'FIN-LCOE-NREL-V1',
    formula_name: 'Levelized Cost of Energy (NREL ATB Method)',
    domain: 'FINANCE',
    authority_class: 'FINANCE_STANDARD',
    version: '1.0',
    equation: 'LCOE = (FCR × CAPEX + FOM) / (CF × 8760) + VOM + Fuel',
    variables: ['FCR (fixed charge rate)', 'CAPEX (₹/kW)', 'FOM (₹/kW/yr)', 'CF (capacity factor)', 'VOM (₹/kWh)', 'Fuel (₹/kWh)'],
    units: '₹/kWh',
    source_ids: ['NREL-ATB-2024'],
    effective_from: '2025-04-01',
    effective_to: null,
  },

  // ─── SCENARIO ENGINE ─────────────────────────────────────
  'SCENARIO-ESCALATION-V1': {
    formula_id: 'SCENARIO-ESCALATION-V1',
    formula_name: 'Price/Cost Escalation Formula',
    domain: 'SCENARIO',
    authority_class: 'SCENARIO_METHOD',
    version: '1.0',
    equation: 'P_t = P_0 × (1 + g)^t',
    variables: ['P_0 (base price, ₹)', 'g (annual growth rate)', 't (years)'],
    units: '₹',
    source_ids: ['AANGARA-SPEC-V3'],
    effective_from: '2025-04-01',
    effective_to: null,
    implementation_notes: 'Use consistent real or nominal framework throughout. Never mix.',
  },

  // ─── OPTIMIZER ENGINE ────────────────────────────────────
  'OPT-RISK-EXPECTED-LOSS-V1': {
    formula_id: 'OPT-RISK-EXPECTED-LOSS-V1',
    formula_name: 'Risk Expected Loss Model',
    domain: 'OPTIMIZER',
    authority_class: 'ENGINEERING_ANALYTICAL',
    version: '1.0',
    equation: 'Expected_Loss = Σ(Probability_i × Financial_Impact_i)',
    variables: ['Probability_i', 'Financial_Impact_i (₹)'],
    units: '₹',
    source_ids: ['AANGARA-SPEC-V3'],
    effective_from: '2025-04-01',
    effective_to: null,
    implementation_notes: 'Use scenario ranges where evidence for probabilities is insufficient.',
  },
  'OPT-NORMALIZATION-MINMAX-V1': {
    formula_id: 'OPT-NORMALIZATION-MINMAX-V1',
    formula_name: 'Min-Max Normalization for Multi-Objective Scoring',
    domain: 'OPTIMIZER',
    authority_class: 'ENGINEERING_ANALYTICAL',
    version: '1.0',
    equation: 'score_i = 100 × (x_i - min) / (max - min)\nscore_lower_better = 100 - score_i',
    variables: ['x_i (metric value)', 'min', 'max'],
    units: 'score (0..100)',
    source_ids: ['AANGARA-SPEC-V3'],
    effective_from: '2025-04-01',
    effective_to: null,
  },
};

/** Look up a formula record by ID */
export function getFormula(formula_id: string): FormulaRecord | undefined {
  return FORMULA_REGISTRY[formula_id];
}

/** Get all formula IDs for a given domain */
export function getFormulasByDomain(domain: FormulaRecord['domain']): FormulaRecord[] {
  return Object.values(FORMULA_REGISTRY).filter(f => f.domain === domain);
}
