/**
 * AANGARA Regulatory Registry v3.0
 * ─────────────────────────────────────────────────────────
 * Statutory GEI target records per sector and compliance year.
 * Per spec §33.2 — all target lookups must come from this registry.
 *
 * Status gate (spec §33.3):
 *   Only FINAL_COMPLIANCE → statutory CCTS result
 *   DRAFT / WATCHLIST / UNKNOWN → analytical estimate only, explicitly labeled
 *
 * Sources:
 *   MoEFCC G.S.R. 25(E) / G.S.R. 739(E) — GEI Target Rules 2025
 *   https://moef.gov.in/
 *   BEE sector benchmark / notification data
 *   Gazette of India
 */

export type RegulatoryStatus =
  | 'FINAL_COMPLIANCE'   // Full statutory CCTS obligation
  | 'DRAFT'              // Published but objection window / not finalized
  | 'WATCHLIST'          // Under consideration, no obligation yet
  | 'SUPERSEDED'         // Old version replaced by newer
  | 'UNKNOWN';           // No authoritative record found

export interface RegulatoryTarget {
  target_id: string;
  sector: string;
  sector_display: string;
  subsector?: string;
  /** Number of obligated entities (approximate, from March 2026 MoP/BEE sources) */
  approx_obligated_entities?: number;
  compliance_year: string;        // e.g. '2025-26'
  baseline_period: string;        // e.g. '2023-24'
  /** GEI target value */
  target_gei: number;
  /** GEI baseline (reference year intensity) */
  baseline_gei?: number;
  unit: string;                   // e.g. 'tCO2e/t_cement'
  equivalent_output_definition: string;
  status: RegulatoryStatus;
  /** Statutory calculation is only valid when status = FINAL_COMPLIANCE */
  statutory_calculation_valid: boolean;
  source_id: string;
  notification_number: string;
  gazette_date?: string;
  effective_date: string;
  page_reference?: string;
  notes?: string;
}

// ─────────────────────────────────────────────
// CCTS GEI Targets — FY 2025-26
// Sources: MoEFCC G.S.R. 25(E), BEE sector notifications
// Verified: September 2026
// ─────────────────────────────────────────────

export const REGULATORY_TARGETS: RegulatoryTarget[] = [
  // ── CEMENT ───────────────────────────────────
  {
    target_id: 'CCTS-CEM-FY2526',
    sector: 'cement',
    sector_display: 'Cement',
    approx_obligated_entities: 167,
    compliance_year: '2025-26',
    baseline_period: '2023-24',
    target_gei: 0.738,
    baseline_gei: 0.760,
    unit: 'tCO2e/t_cementitious_product',
    equivalent_output_definition: 'Total cementitious product output (OPC + PPC + PSC + blended cements) in tonnes',
    status: 'FINAL_COMPLIANCE',
    statutory_calculation_valid: true,
    source_id: 'MOEFCC-GSR25E',
    notification_number: 'G.S.R. 25(E)',
    effective_date: '2025-04-01',
    notes: 'Gate-to-gate boundary. Kiln output basis. Mixed cement uses cementitious equivalent.',
  },
  {
    target_id: 'CCTS-CEM-FY2627',
    sector: 'cement',
    sector_display: 'Cement',
    compliance_year: '2026-27',
    baseline_period: '2023-24',
    target_gei: 0.729,
    unit: 'tCO2e/t_cementitious_product',
    equivalent_output_definition: 'Total cementitious product output in tonnes',
    status: 'FINAL_COMPLIANCE',
    statutory_calculation_valid: true,
    source_id: 'MOEFCC-GSR25E',
    notification_number: 'G.S.R. 25(E)',
    effective_date: '2026-04-01',
    notes: 'Trajectory year 2. Subject to amendment.',
  },

  // ── ALUMINIUM ────────────────────────────────
  {
    target_id: 'CCTS-ALU-FY2526',
    sector: 'aluminium',
    sector_display: 'Aluminium',
    approx_obligated_entities: 12,
    compliance_year: '2025-26',
    baseline_period: '2023-24',
    target_gei: 12.8,
    unit: 'tCO2e/t_primary_aluminium',
    equivalent_output_definition: 'Primary aluminium ingot production in tonnes',
    status: 'FINAL_COMPLIANCE',
    statutory_calculation_valid: true,
    source_id: 'MOEFCC-GSR25E',
    notification_number: 'G.S.R. 25(E)',
    effective_date: '2025-04-01',
    notes: 'Includes Scope 2 from grid electricity and Scope 1 from anode combustion and PFC emissions.',
  },

  // ── CHLOR-ALKALI ──────────────────────────────
  {
    target_id: 'CCTS-CHLOR-FY2526',
    sector: 'chlor_alkali',
    sector_display: 'Chlor-Alkali',
    approx_obligated_entities: 31,
    compliance_year: '2025-26',
    baseline_period: '2023-24',
    target_gei: 0.98,
    unit: 'tCO2e/t_NaOH_equivalent',
    equivalent_output_definition: 'NaOH equivalent output (100% basis) in tonnes — co-products Cl2 and H2 normalised to NaOH equivalent per BEE methodology',
    status: 'FINAL_COMPLIANCE',
    statutory_calculation_valid: true,
    source_id: 'MOEFCC-GSR25E',
    notification_number: 'G.S.R. 25(E)',
    effective_date: '2025-04-01',
    notes: 'Membrane cell technology benchmark. Co-product allocation per BEE CCTS Chlor-Alkali methodology.',
  },

  // ── PULP & PAPER ─────────────────────────────
  {
    target_id: 'CCTS-PAP-FY2526',
    sector: 'pulp_paper',
    sector_display: 'Pulp & Paper',
    approx_obligated_entities: 75,
    compliance_year: '2025-26',
    baseline_period: '2023-24',
    target_gei: 1.95,
    unit: 'tCO2e/t_paper_or_paperboard',
    equivalent_output_definition: 'Net saleable paper and paperboard output in tonnes',
    status: 'FINAL_COMPLIANCE',
    statutory_calculation_valid: true,
    source_id: 'MOEFCC-GSR25E',
    notification_number: 'G.S.R. 25(E)',
    effective_date: '2025-04-01',
    notes: 'Biogenic biomass CO2 treated per applicable BEE methodology for the sector.',
  },

  // ── PETROCHEMICALS ────────────────────────────
  {
    target_id: 'CCTS-PETCHEM-FY2526',
    sector: 'petrochemicals',
    sector_display: 'Petrochemicals',
    approx_obligated_entities: 24,
    compliance_year: '2025-26',
    baseline_period: '2023-24',
    target_gei: 1.28,
    unit: 'tCO2e/t_high_value_chemicals',
    equivalent_output_definition: 'High-value chemicals (HVC) output — ethylene, propylene, butadiene, benzene — in tonnes, combined per BEE methodology',
    status: 'FINAL_COMPLIANCE',
    statutory_calculation_valid: true,
    source_id: 'MOEFCC-GSR25E',
    notification_number: 'G.S.R. 25(E)',
    effective_date: '2025-04-01',
    notes: 'Cracker-specific HVC allocation per BEE Petrochemicals procedure.',
  },

  // ── PETROLEUM REFINERY ────────────────────────
  {
    target_id: 'CCTS-REF-FY2526',
    sector: 'petroleum_refinery',
    sector_display: 'Petroleum Refinery',
    approx_obligated_entities: 18,
    compliance_year: '2025-26',
    baseline_period: '2023-24',
    target_gei: 0.165,
    unit: 'tCO2e/MBN',
    equivalent_output_definition: 'Crude throughput in MBN (Macro Benchmark Number per BEE refinery methodology)',
    status: 'FINAL_COMPLIANCE',
    statutory_calculation_valid: true,
    source_id: 'MOEFCC-GSR25E',
    notification_number: 'G.S.R. 25(E)',
    effective_date: '2025-04-01',
    notes: 'MBN is complexity-adjusted throughput descriptor. Not a simple volume unit.',
  },

  // ── TEXTILE ───────────────────────────────────
  {
    target_id: 'CCTS-TEX-FY2526',
    sector: 'textile',
    sector_display: 'Textile',
    approx_obligated_entities: 163,
    compliance_year: '2025-26',
    baseline_period: '2023-24',
    target_gei: 4.80,
    unit: 'tCO2e/t_processed_textile',
    equivalent_output_definition: 'Processed textile output in tonnes (spinning, weaving, processing — sector definition per BEE CCTS Textile procedure)',
    status: 'FINAL_COMPLIANCE',
    statutory_calculation_valid: true,
    source_id: 'MOEFCC-GSR25E',
    notification_number: 'G.S.R. 25(E)',
    effective_date: '2025-04-01',
  },

  // ── IRON & STEEL — DRAFT ─────────────────────
  {
    target_id: 'CCTS-STEEL-FY2526-DRAFT',
    sector: 'iron_steel',
    sector_display: 'Iron & Steel',
    approx_obligated_entities: 0, // Not yet obligated
    compliance_year: '2025-26',
    baseline_period: '2023-24',
    target_gei: 2.50,  // INDICATIVE ONLY — not final regulatory value
    unit: 'tCO2e/t_crude_steel',
    equivalent_output_definition: 'Crude steel output in tonnes (route-specific — BF-BOF / EAF / DRI)',
    status: 'DRAFT',
    statutory_calculation_valid: false,  // ← HARD BLOCK: never show as statutory
    source_id: 'MOEFCC-GSR517E-DRAFT',
    notification_number: 'G.S.R. 517(E) [Draft]',
    effective_date: '2025-04-01',
    notes: 'DRAFT — G.S.R. 517(E) objection window open as of early Sep 2026. Target value is indicative only. statutory_calculation_valid = FALSE. Only analytical carbon inventory may be calculated. Never display as CCTS obligation.',
  },

  // ── FERTILIZER — WATCHLIST ─────────────────────
  {
    target_id: 'CCTS-FERT-WATCHLIST',
    sector: 'fertiliser',
    sector_display: 'Fertiliser',
    approx_obligated_entities: 0,
    compliance_year: '2025-26',
    baseline_period: '2023-24',
    target_gei: 0,  // Not set — watchlist only
    unit: 'tCO2e/t_urea',
    equivalent_output_definition: 'Not yet defined by MoEFCC — WATCHLIST only',
    status: 'WATCHLIST',
    statutory_calculation_valid: false,
    source_id: 'BEE-WATCHLIST-2025',
    notification_number: 'No notification — Watchlist',
    effective_date: '2025-04-01',
    notes: 'Fertiliser sector not identified among the 7 sectors transitioned to CCTS per March 2026 MoP record. No fabricated CCTS target must be created.',
  },
];

// ─────────────────────────────────────────────
// Lookup Helpers
// ─────────────────────────────────────────────

/**
 * Get regulatory target for a sector + compliance year.
 * Returns null if no record found.
 */
export function getRegulatoryTarget(
  sector: string,
  compliance_year: string
): RegulatoryTarget | null {
  return REGULATORY_TARGETS.find(
    t => t.sector === sector && t.compliance_year === compliance_year
  ) ?? null;
}

/**
 * Check if a sector is eligible for statutory CCTS calculation.
 * Only FINAL_COMPLIANCE passes this gate.
 */
export function isStatutoryEligible(sector: string, compliance_year: string = '2025-26'): boolean {
  const target = getRegulatoryTarget(sector, compliance_year);
  return target?.status === 'FINAL_COMPLIANCE' && target?.statutory_calculation_valid === true;
}

/**
 * Get the regulatory status label for UI display.
 */
export function getRegulatoryStatusLabel(status: RegulatoryStatus): {
  label: string;
  color: 'green' | 'amber' | 'red' | 'gray';
  disclaimer?: string;
} {
  switch (status) {
    case 'FINAL_COMPLIANCE':
      return { label: 'FINAL — CCTS Statutory', color: 'green' };
    case 'DRAFT':
      return {
        label: 'DRAFT — Not Statutory',
        color: 'amber',
        disclaimer: 'ANALYTICAL ESTIMATE ONLY — This sector is under draft/objection. No statutory CCTS obligation applies. Results show analytical carbon inventory, not a compliance calculation.',
      };
    case 'WATCHLIST':
      return {
        label: 'WATCHLIST — No Obligation',
        color: 'amber',
        disclaimer: 'WATCHLIST — No notification issued. Analytical estimate only.',
      };
    default:
      return { label: 'UNKNOWN STATUS', color: 'gray', disclaimer: 'Regulatory status unknown. Do not use for compliance purposes.' };
  }
}

/** All sectors with their current status */
export const SECTOR_REGULATORY_SUMMARY = REGULATORY_TARGETS
  .filter(t => t.compliance_year === '2025-26')
  .map(t => ({
    sector: t.sector,
    display: t.sector_display,
    status: t.status,
    statutory_valid: t.statutory_calculation_valid,
    target_gei: t.target_gei,
    unit: t.unit,
    entities: t.approx_obligated_entities,
  }));
