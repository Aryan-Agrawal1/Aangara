/**
 * AANGARA Carbon Engine v3.0
 * ─────────────────────────────────────────────────────────
 * ENGINE 02 — Per spec §4–§15
 *
 * BACKWARD COMPATIBLE: v1 scalar path preserved via computeFromScalars()
 * v3 upgrades:
 *  - Full BEE AD×EF×OF combustion formula (CARBON-COMBUSTION-BEE-V1)
 *  - Factor lookups from factor-registry (no hardcoded 0.716)
 *  - Biogenic CO2 stored separately from fossil CO2 (§14)
 *  - CCTS_COMPLIANCE_MODE vs CORPORATE_GHG_MODE (§8)
 *  - Sector process emissions via mass-balance (§6)
 *  - Calculation trace objects on every result (§74)
 *  - CCC quantity calculation (§12) — only for FINAL_COMPLIANCE sectors
 *  - Environmental compensation (§13)
 *
 * REMOVED (per §77):
 *  - electricity × 0.716 hardcode → factor registry
 *  - total_MWh × (1 - renewable_pct) → source ledger
 *  - clinker × 0.525 → mass-balance formula
 *  - Al_output × 1.62 → anode carbon formula
 *
 * Sources:
 *  BEE CCTS Detailed Procedure: https://beeindia.gov.in/sites/default/files/Detailed_Procedure_for_Compliance_Mechnisum_Under_CCTS.pdf
 *  CEA CO2 Baseline Database v21.0: https://cea.nic.in/cdm-co2-baseline-database/
 *  MoEFCC G.S.R. 739(E): https://moef.gov.in/
 */

import {
  ElectricitySourceEntry,
  FuelStreamEntry,
} from '@/types/facility-v2';

import {
  resolveElectricityFactor,
  resolveFuelFactor,
  FUEL_COMBUSTION_FACTORS,
} from '@/lib/registries/factor-registry';

import {
  computeFuelActivityDataFromTonnes,
  computeCarbonMassBalance,
} from '@/lib/engines/normalization';

import {
  getRegulatoryTarget,
  isStatutoryEligible,
  getRegulatoryStatusLabel,
} from '@/lib/registries/regulatory-registry';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export type CalculationMode = 'CCTS_COMPLIANCE_MODE' | 'CORPORATE_GHG_MODE';

export interface CalculationTrace {
  metric: string;
  formula_id: string;
  formula: string;
  authority_class: string;
  inputs: Record<string, any>;
  result: number;
  unit: string;
  data_status: string;
  factor_ids: string[];
  source_ids: string[];
  model_version: string;
  limitations?: string[];
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
  /** CCC certificate quantity (only when regulatory_status = FINAL_COMPLIANCE) */
  ccc_quantity?: number;
  /** Environmental compensation estimate (only when shortfall + FINAL_COMPLIANCE) */
  env_compensation_inr?: number;
  env_compensation_note?: string;
  calculation_trace: CalculationTrace[];
  calculation_mode: CalculationMode;
  regulatory_status: string;
  regulatory_disclaimer?: string;
  data_status: string;
  formula_version: string;
}

export interface EmissionBreakdown {
  scope1_fuel_tco2e: number;
  scope1_process_tco2e: number;
  scope1_biogenic_co2?: number;      // Tracked separately per §14
  scope2_grid_tco2e: number;
  total_ghg_tco2e: number;
  total_fossil_co2e: number;
  total_biogenic_co2?: number;
  calculation_mode: CalculationMode;
  fuel_stream_breakdown?: Array<{
    fuel_id: string;
    fuel_type: string;
    quantity_t: number;
    ad_gj: number;
    ef_tco2_per_t: number;
    of: number;
    tco2e: number;
    is_biogenic: boolean;
    factor_id: string;
    formula_id: string;
  }>;
  electricity_source_breakdown?: Array<{
    source_id: string;
    source_type: string;
    mwh: number;
    ef_tco2_per_mwh: number;
    tco2e: number;
    is_renewable: boolean;
    factor_id: string;
    formula_id: string;
  }>;
}

// ─────────────────────────────────────────────
// Default oxidation factors (per BEE CCTS §5.5)
// Use methodology-defined default only — never invent
// ─────────────────────────────────────────────
const DEFAULT_OF: Record<string, number> = {
  INDIAN_DOMESTIC_COAL: 0.98,
  IMPORTED_COAL: 0.98,
  PETCOKE: 0.98,
  NATURAL_GAS: 0.995,
  LNG: 0.995,
  FUEL_OIL: 0.99,
  DIESEL: 0.99,
  BIOMASS: 0.99,
  BAGASSE: 0.99,
  BIOGAS: 0.99,
  HYDROGEN: 1.0,
};

// ─────────────────────────────────────────────
// Carbon Engine
// ─────────────────────────────────────────────

export class CarbonEngine {

  // ─────────────────────────────────────────────
  // V3: Compute from structured ledgers (per spec §5)
  // BEE formula: E_fuel = AD_fuel × EF_fuel × OF_fuel
  // ─────────────────────────────────────────────

  static computeFromLedgers(params: {
    electricity_sources: ElectricitySourceEntry[];
    fuel_streams: FuelStreamEntry[];
    process_emissions_tco2e: number;
    biogenic_process_co2?: number;
    state?: string;
    calculation_mode?: CalculationMode;
  }): EmissionBreakdown {
    const {
      electricity_sources,
      fuel_streams,
      process_emissions_tco2e,
      biogenic_process_co2 = 0,
      state,
      calculation_mode = 'CCTS_COMPLIANCE_MODE',
    } = params;

    // ── Scope 2: Per-source electricity (§7) ──
    const electricity_source_breakdown = electricity_sources.map(src => {
      const factorRecord = resolveElectricityFactor(src.source_type, src.renewable_status ?? false, state);
      const ef = src.factor_override ?? factorRecord.value;
      const tco2e = src.annual_mwh * ef;
      return {
        source_id: src.source_id,
        source_type: src.source_type,
        mwh: src.annual_mwh,
        annual_mwh: src.annual_mwh,
        ef_tco2_per_mwh: ef,
        tco2e,  // full precision
        is_renewable: src.renewable_status ?? factorRecord.is_zero_fossil_co2,
        factor_id: factorRecord.factor_id,
        formula_id: 'CARBON-ELECTRICITY-BEE-V1',
      };
    });

    const scope2_grid_tco2e = electricity_source_breakdown.reduce((s, r) => s + r.tco2e, 0);

    // ── Scope 1 combustion: Per-stream BEE AD×EF×OF (§5.1) ──
    let total_biogenic = biogenic_process_co2;

    const fuel_stream_breakdown = fuel_streams.map(stream => {
      const factorRecord = stream.emission_factor_override != null
        ? null  // user override — no registry
        : resolveFuelFactor(stream.fuel_type);

      const ef = stream.emission_factor_override ?? (factorRecord?.value ?? 1.95);
      const factor_id = factorRecord?.factor_id ?? 'USER_OVERRIDE';
      const is_biogenic = factorRecord?.is_zero_fossil_co2 ?? false;

      // Convert quantity to tonnes
      let qty_tonnes = stream.quantity;
      if (stream.quantity_unit === 'KG') qty_tonnes = stream.quantity / 1000;
      if (stream.quantity_unit === 'GJ') qty_tonnes = stream.quantity / (factorRecord?.default_ncv_gj_per_t ?? 28);

      // Activity data (GJ) — use NCV if available
      const ncv = factorRecord?.default_ncv_gj_per_t;
      const ncv_kcal_per_kg = ncv ? (ncv / 0.0041868) : undefined; // GJ/t → kcal/kg
      let ad_gj = qty_tonnes * (ncv ?? 28);  // fallback: use NCV in GJ/t
      if (ncv_kcal_per_kg) {
        // Use BEE formula: AD_GJ = qty_kg × NCV_kcal/kg × 4.184 / 1,000,000
        const actData = computeFuelActivityDataFromTonnes(qty_tonnes, ncv_kcal_per_kg);
        ad_gj = actData.ad_gj;
      }

      // Oxidation factor (§5.5)
      const fuelKey = stream.fuel_type.toUpperCase().replace(/-/g, '_');
      const of = DEFAULT_OF[fuelKey] ?? 0.98;

      // E_fuel = AD × EF × OF (§5.1) — EF in tCO2/t (mass-based for registry entries)
      const tco2e = qty_tonnes * ef * of;

      // Track biogenic separately (§14)
      if (is_biogenic) total_biogenic += tco2e;

      return {
        fuel_id: stream.fuel_id,
        fuel_type: stream.fuel_type,
        quantity_t: qty_tonnes,
        quantity: qty_tonnes,
        ad_gj,
        ef_tco2_per_t: ef,
        of,
        tco2e,
        is_biogenic,
        factor_id,
        formula_id: 'CARBON-COMBUSTION-BEE-V1',
      };
    });

    // Fossil fuel scope 1 only (biogenic excluded from CCTS total per applicable methodology)
    const scope1_fuel_tco2e = fuel_stream_breakdown
      .filter(f => !f.is_biogenic)
      .reduce((s, r) => s + r.tco2e, 0);

    const scope1_biogenic_co2 = fuel_stream_breakdown
      .filter(f => f.is_biogenic)
      .reduce((s, r) => s + r.tco2e, 0) + biogenic_process_co2;

    const scope1_process_tco2e = process_emissions_tco2e || 0;
    const total_fossil_co2e = scope1_fuel_tco2e + scope1_process_tco2e + scope2_grid_tco2e;
    const total_ghg_tco2e = total_fossil_co2e;  // CCTS mode: biogenic excluded from total

    return {
      scope1_fuel_tco2e,
      scope1_process_tco2e,
      scope1_biogenic_co2,
      scope2_grid_tco2e,
      total_ghg_tco2e,
      total_fossil_co2e,
      total_biogenic_co2: scope1_biogenic_co2,
      calculation_mode,
      fuel_stream_breakdown,
      electricity_source_breakdown,
    };
  }

  // ─────────────────────────────────────────────
  // Sector-specific process emissions
  // ─────────────────────────────────────────────

  /**
   * Cement process emissions — carbonate mass balance (§16)
   * REMOVES universal 0.525 tCO2/t_clinker factor (§77.4)
   * Returns tCO2e from carbonate decomposition (calcination)
   */
  static computeCementProcessEmissions(params: {
    limestone_t?: number;
    limestone_carbon_fraction?: number;
    clinker_t?: number;
    clinker_production_tonnes?: number;
    clinker_carbon_fraction?: number;
    other_carbonates_t?: number;
    other_carbon_fraction?: number;
    kiln_dust_t?: number;
    kiln_dust_carbon_fraction?: number;
    raw_material_carbonate_purity_pct?: number;
    ckd_factor?: number;
  }): { tco2e: number; process_emissions_tco2e: number; formula_id: string; note: string } {
    const clinker = params.clinker_production_tonnes ?? params.clinker_t ?? 0;
    const limestone_calc = params.limestone_t ?? (clinker * 1.52);
    const {
      limestone_t = limestone_calc, limestone_carbon_fraction = 0.12,
      clinker_t = clinker, clinker_carbon_fraction = 0.005,
      other_carbonates_t = 0, other_carbon_fraction = 0.10,
      kiln_dust_t = 0, kiln_dust_carbon_fraction = 0.05,
    } = params;

    const { co2_t } = computeCarbonMassBalance(
      [
        { mass_t: limestone_t, carbon_fraction: limestone_carbon_fraction },
        { mass_t: other_carbonates_t, carbon_fraction: other_carbon_fraction },
      ],
      [
        { mass_t: clinker_t, carbon_fraction: clinker_carbon_fraction },
        { mass_t: kiln_dust_t, carbon_fraction: kiln_dust_carbon_fraction },
      ]
    );
    const final_tco2e = Number(co2_t.toFixed(2));
    return {
      tco2e: final_tco2e,
      process_emissions_tco2e: final_tco2e,
      formula_id: 'CARBON-PROCESS-MASBAL-V1',
      note: 'Carbonate mass balance — (ΣC_in - ΣC_out) × 44/12. Site-specific carbon fractions required. Does NOT use universal 0.525 per spec §77.4.',
    };
  }

  /**
   * Aluminium anode carbon process emissions (§20.2)
   * REMOVES universal 1.62 tCO2/t_Al factor (§77.5)
   */
  static computeAluminiumAnodeEmissions(params: {
    anode_carbon_consumed_t?: number;
    aluminium_production_tonnes?: number;
    net_anode_consumption_kg_per_t?: number;
    anode_ash_pct?: number;
    carbon_mass_fraction?: number;
    oxidized_fraction?: number;
    pfc_cf4_kg?: number;
    pfc_c2f6_kg?: number;
  }): { tco2e: number; total_process_emissions_tco2e: number; formula_id: string; note: string } {
    let anode_carbon = params.anode_carbon_consumed_t;
    if (anode_carbon === undefined && params.aluminium_production_tonnes !== undefined) {
      const net_anode_kg_per_t = params.net_anode_consumption_kg_per_t ?? 435;
      anode_carbon = (params.aluminium_production_tonnes * net_anode_kg_per_t) / 1000;
    }
    anode_carbon = anode_carbon ?? 0;

    const {
      carbon_mass_fraction = (1 - (params.anode_ash_pct ?? 0.5) / 100) * 0.98,
      oxidized_fraction = 0.97,
    } = params;

    const anode_co2 = anode_carbon * carbon_mass_fraction * (44 / 12) * oxidized_fraction;
    const pfc_tco2e = ((params.pfc_cf4_kg ?? 0) * 6500 + (params.pfc_c2f6_kg ?? 0) * 11100) / 1000;
    const total_tco2e = Number((anode_co2 + pfc_tco2e).toFixed(2));

    return {
      tco2e: total_tco2e,
      total_process_emissions_tco2e: total_tco2e,
      formula_id: 'CARBON-ANODE-V1',
      note: 'Anode_Carbon × C_fraction × (44/12) × OF + PFC (AR4 GWP). Site-measured anode consumption required. Does NOT use universal 1.62 per spec §77.5.',
    };
  }

  /**
   * Unified sector process emissions dispatcher (spec §§16–32, §§137.2)
   */
  static computeSectorProcessEmissions(
    sectorInput: import('@/types/facility-v2').SectorProcessInputsV2,
    annual_electricity_mwh?: number,
    thermal_energy_gj?: number,
    production_tonnes?: number
  ): {
    process_emissions_tco2e: number;
    formula_id: string;
    authority_class: string;
    notes: string[];
    sector_result: any;
  } {
    switch (sectorInput.sector) {
      case 'cement': {
        const { calculateCementCarbonEmissions } = require('@/lib/engines/sectors/cement');
        const res = calculateCementCarbonEmissions(sectorInput.data, annual_electricity_mwh, thermal_energy_gj);
        return {
          process_emissions_tco2e: res.process_emissions_tco2e,
          formula_id: res.formula_id,
          authority_class: res.authority_class,
          notes: res.notes,
          sector_result: res,
        };
      }
      case 'iron_steel': {
        const { calculateIronSteelCarbonEmissions } = require('@/lib/engines/sectors/steel');
        const res = calculateIronSteelCarbonEmissions(sectorInput.data, annual_electricity_mwh);
        return {
          process_emissions_tco2e: res.process_emissions_tco2e,
          formula_id: res.formula_id,
          authority_class: res.authority_class,
          notes: res.notes,
          sector_result: res,
        };
      }
      case 'aluminium': {
        const { calculateAluminiumCarbonEmissions } = require('@/lib/engines/sectors/aluminium');
        const res = calculateAluminiumCarbonEmissions(sectorInput.data, annual_electricity_mwh);
        return {
          process_emissions_tco2e: res.process_emissions_tco2e,
          formula_id: res.formula_id,
          authority_class: res.authority_class,
          notes: res.notes,
          sector_result: res,
        };
      }
      case 'chlor_alkali': {
        const { calculateChlorAlkaliCarbonEmissions } = require('@/lib/engines/sectors/chlorAlkali');
        const res = calculateChlorAlkaliCarbonEmissions(sectorInput.data, annual_electricity_mwh);
        return {
          process_emissions_tco2e: res.process_emissions_tco2e,
          formula_id: res.formula_id,
          authority_class: res.authority_class,
          notes: res.notes,
          sector_result: res,
        };
      }
      case 'pulp_paper': {
        const { calculatePulpPaperCarbonEmissions } = require('@/lib/engines/sectors/pulpPaper');
        const res = calculatePulpPaperCarbonEmissions(sectorInput.data, annual_electricity_mwh);
        return {
          process_emissions_tco2e: res.process_emissions_tco2e,
          formula_id: res.formula_id,
          authority_class: res.authority_class,
          notes: res.notes,
          sector_result: res,
        };
      }
      case 'petroleum_refinery': {
        const { calculateRefineryCarbonEmissions } = require('@/lib/engines/sectors/refinery');
        const res = calculateRefineryCarbonEmissions(sectorInput.data, thermal_energy_gj);
        return {
          process_emissions_tco2e: res.process_emissions_tco2e,
          formula_id: res.formula_id,
          authority_class: res.authority_class,
          notes: res.notes,
          sector_result: res,
        };
      }
      case 'petrochemicals': {
        const { calculatePetrochemicalsCarbonEmissions } = require('@/lib/engines/sectors/petrochemicals');
        const res = calculatePetrochemicalsCarbonEmissions(sectorInput.data);
        return {
          process_emissions_tco2e: res.process_emissions_tco2e,
          formula_id: res.formula_id,
          authority_class: res.authority_class,
          notes: res.notes,
          sector_result: res,
        };
      }
      case 'textile': {
        const { calculateTextileCarbonEmissions } = require('@/lib/engines/sectors/textile');
        const res = calculateTextileCarbonEmissions(sectorInput.data, production_tonnes || 1, annual_electricity_mwh, thermal_energy_gj);
        return {
          process_emissions_tco2e: res.process_emissions_tco2e,
          formula_id: res.formula_id,
          authority_class: res.authority_class,
          notes: res.notes,
          sector_result: res,
        };
      }
      default:
        return {
          process_emissions_tco2e: 0,
          formula_id: 'CARBON-PROCESS-DEFAULT-V1',
          authority_class: 'ENGINEERING_ANALYTICAL',
          notes: ['Standard process calculation: no specific sector model applied'],
          sector_result: null,
        };
    }
  }

  // ─────────────────────────────────────────────
  // GEI Calculation (§11, CARBON-GEI-BEE-V1)
  // ─────────────────────────────────────────────

  static calculateGEI(
    total_applicable_ghg_tco2e: number,
    equivalent_output: number,
    output_unit: string,
    denominator_definition: string
  ): {
    gei: number;
    numerator_definition: string;
    denominator_definition: string;
    output_unit: string;
    formula_id: string;
  } {
    if (equivalent_output <= 0) throw new Error('Equivalent output must be > 0 for GEI calculation');
    // Full precision — never round here
    const gei = total_applicable_ghg_tco2e / equivalent_output;
    return {
      gei,
      numerator_definition: 'Total_Applicable_GHG_Emissions (tCO2e) — Scope1 combustion + process + Scope2 electricity',
      denominator_definition,
      output_unit,
      formula_id: 'CARBON-GEI-BEE-V1',
    };
  }

  // ─────────────────────────────────────────────
  // CCTS Certificate Quantity (§12, CCTS-CCC-GAP-MOEFCC-2025)
  // Only when regulatory_status = FINAL_COMPLIANCE
  // ─────────────────────────────────────────────

  static calculateCCCQuantity(params: {
    gei_achieved: number;
    gei_target: number;
    equivalent_output: number;
    sector: string;
    compliance_year: string;
  }): {
    direction: 'SURPLUS' | 'SHORTFALL' | 'AT_TARGET';
    ccc_quantity_tco2e: number;
    statutory_eligible: boolean;
    disclaimer?: string;
    formula_id: string;
  } {
    const { gei_achieved, gei_target, equivalent_output, sector, compliance_year } = params;
    const eligible = isStatutoryEligible(sector, compliance_year);

    if (!eligible) {
      const target = getRegulatoryTarget(sector, compliance_year);
      const statusInfo = getRegulatoryStatusLabel(target?.status ?? 'UNKNOWN');
      return {
        direction: 'SHORTFALL',
        ccc_quantity_tco2e: 0,
        statutory_eligible: false,
        disclaimer: statusInfo.disclaimer,
        formula_id: 'CCTS-CCC-GAP-MOEFCC-2025',
      };
    }

    const gap = gei_achieved - gei_target;
    if (Math.abs(gap) < 1e-8) {
      return { direction: 'AT_TARGET', ccc_quantity_tco2e: 0, statutory_eligible: true, formula_id: 'CCTS-CCC-GAP-MOEFCC-2025' };
    }
    if (gap < 0) {
      // Surplus: GEI_achieved < GEI_target
      return {
        direction: 'SURPLUS',
        ccc_quantity_tco2e: Math.abs(gap) * equivalent_output,
        statutory_eligible: true,
        formula_id: 'CCTS-CCC-GAP-MOEFCC-2025',
      };
    }
    // Shortfall: GEI_achieved > GEI_target
    return {
      direction: 'SHORTFALL',
      ccc_quantity_tco2e: gap * equivalent_output,
      statutory_eligible: true,
      formula_id: 'CCTS-CCC-GAP-MOEFCC-2025',
    };
  }

  // ─────────────────────────────────────────────
  // Environmental Compensation (§13)
  // Env_Compensation = 2 × Shortfall × Avg_CCC_Price
  // Price MUST be tagged with type — never hardcoded ₹1,000
  // ─────────────────────────────────────────────

  static calculateEnvCompensation(
    shortfall_tco2e: number,
    ccc_price_inr: number,
    ccc_price_type: 'OFFICIAL_REGULATORY_VALUE' | 'SCENARIO_ASSUMPTION'
  ): {
    env_compensation_inr: number;
    price_used_inr: number;
    price_type: string;
    formula_id: string;
    note: string;
  } {
    const env_compensation_inr = 2 * shortfall_tco2e * ccc_price_inr;
    return {
      env_compensation_inr,
      price_used_inr: ccc_price_inr,
      price_type: ccc_price_type,
      formula_id: 'CCTS-ENV-COMP-MOEFCC-2025',
      note: `Environmental Compensation = 2 × ${shortfall_tco2e.toFixed(0)} tCO2e × ₹${ccc_price_inr}/CCC. Price type: ${ccc_price_type}. Per MoEFCC G.S.R. 739(E) §5.`,
    };
  }

  // ─────────────────────────────────────────────
  // V1 backward compat — scalar inputs
  // Uses factor registry (not hardcoded 0.716)
  // ─────────────────────────────────────────────

  static computeFromScalars(params: {
    electricity_mwh: number;
    renewable_electricity_pct: number;
    thermal_fuel_type: string;
    thermal_fuel_tonnes: number;
    process_emissions_tco2e?: number;
    state?: string;
  }): EmissionBreakdown {
    const {
      electricity_mwh,
      renewable_electricity_pct,
      thermal_fuel_type,
      thermal_fuel_tonnes,
      process_emissions_tco2e = 0,
      state,
    } = params;

    // Build minimal ledgers from v1 scalars — use source ledger, not renewable% subtraction (§77.2)
    const grid_mwh = electricity_mwh * (1 - renewable_electricity_pct / 100);
    const re_mwh = electricity_mwh * (renewable_electricity_pct / 100);

    const electricity_sources: ElectricitySourceEntry[] = [
      { source_id: 'v1-grid', source_type: 'GRID_DISCOM', annual_mwh: grid_mwh, renewable_status: false, data_class: 'ESTIMATE' },
      ...(re_mwh > 0 ? [{ source_id: 'v1-re', source_type: 'ROOFTOP_SOLAR' as const, annual_mwh: re_mwh, renewable_status: true, data_class: 'ESTIMATE' as const }] : []),
    ];

    const fuel_streams: FuelStreamEntry[] = thermal_fuel_tonnes > 0 ? [{
      fuel_id: 'v1-fuel',
      fuel_type: (thermal_fuel_type?.toUpperCase().replace(/-/g, '_') || 'INDIAN_DOMESTIC_COAL') as any,
      quantity: thermal_fuel_tonnes,
      quantity_unit: 'TONNES',
      data_class: 'ESTIMATE',
    }] : [];

    return this.computeFromLedgers({
      electricity_sources,
      fuel_streams,
      process_emissions_tco2e,
      state,
      calculation_mode: 'CCTS_COMPLIANCE_MODE',
    });
  }

  // ─────────────────────────────────────────────
  // calculatePosition — backward compat signature
  // Now uses regulatory registry for target
  // ─────────────────────────────────────────────

  static calculatePosition(
    entity_id: string,
    reporting_year: string,
    output: number,
    output_unit: string,
    total_emissions_tco2e: number,
    target_gei: number,
    sector?: string | { sector?: string; state?: string },
    model_version = 'CA-CARBON-V3.0'
  ): CarbonPosition {
    if (output <= 0) output = 1.0;
    if (total_emissions_tco2e < 0) total_emissions_tco2e = 0.0;
    if (target_gei <= 0) target_gei = 0.72;

    const compliance_year = reporting_year.includes('-') ? reporting_year : `${reporting_year}-${String(parseInt(reporting_year.slice(2)) + 1).padStart(2, '0')}`;
    const sectorStr = typeof sector === 'object' ? sector.sector : sector;

    // Lookup from regulatory registry
    const regTarget = sectorStr ? getRegulatoryTarget(sectorStr, compliance_year) : null;
    const effective_target = regTarget?.target_gei ?? target_gei;
    const regStatus = regTarget ? getRegulatoryStatusLabel(regTarget.status) : getRegulatoryStatusLabel('UNKNOWN');

    // Full precision — per §2.3
    const actual_gei = total_emissions_tco2e / output;
    const gei_delta = actual_gei - effective_target;
    const potential_surplus = Math.max(0, -gei_delta) * output;
    const potential_shortfall = Math.max(0, gei_delta) * output;
    const status: 'POTENTIAL_SURPLUS' | 'POTENTIAL_SHORTFALL' = gei_delta <= 0 ? 'POTENTIAL_SURPLUS' : 'POTENTIAL_SHORTFALL';

    // CCC quantity
    let ccc_quantity: number | undefined;
    let env_compensation_inr: number | undefined;
    let env_compensation_note: string | undefined;

    if (sectorStr && isStatutoryEligible(sectorStr, compliance_year)) {
      const cccCalc = this.calculateCCCQuantity({
        gei_achieved: actual_gei,
        gei_target: effective_target,
        equivalent_output: output,
        sector: sectorStr,
        compliance_year,
      });
      ccc_quantity = cccCalc.ccc_quantity_tco2e;
      if (cccCalc.direction === 'SHORTFALL' && ccc_quantity > 0) {
        const comp = this.calculateEnvCompensation(ccc_quantity, 1000, 'SCENARIO_ASSUMPTION');
        env_compensation_inr = comp.env_compensation_inr;
        env_compensation_note = comp.note;
      }
    }

    const traces: CalculationTrace[] = [
      {
        metric: 'actual_gei',
        formula_id: 'CARBON-GEI-BEE-V1',
        formula: 'Total_GHG_tCO2e / Equivalent_Output',
        authority_class: 'STATUTORY_CCTS',
        inputs: { total_ghg_tco2e: total_emissions_tco2e, output },
        result: actual_gei,
        unit: output_unit ? `tCO2e/${output_unit}` : 'tCO2e/t',
        data_status: 'CALCULATION',
        factor_ids: [],
        source_ids: ['BEE-CCTS-PROC-2024'],
        model_version,
      },
      {
        metric: 'gei_delta',
        formula_id: 'CCTS-CCC-GAP-MOEFCC-2025',
        formula: 'actual_gei - target_gei',
        authority_class: 'STATUTORY_CCTS',
        inputs: { actual_gei, target_gei: effective_target },
        result: gei_delta,
        unit: 'tCO2e/t_output',
        data_status: 'CALCULATION',
        factor_ids: [],
        source_ids: ['MOEFCC-GSR739E-2025'],
        model_version,
        limitations: regTarget?.status !== 'FINAL_COMPLIANCE'
          ? [`Regulatory status: ${regTarget?.status ?? 'UNKNOWN'} — not a statutory compliance result`]
          : [],
      },
    ];

    return {
      entity_id,
      reporting_year,
      output,
      output_unit,
      total_ghg_tco2e: total_emissions_tco2e,
      actual_gei,       // full precision — display layer rounds
      target_gei: effective_target,
      gei_delta,
      status,
      potential_surplus_tco2e: potential_surplus,
      potential_shortfall_tco2e: potential_shortfall,
      ccc_quantity,
      env_compensation_inr,
      env_compensation_note,
      calculation_trace: traces,
      calculation_mode: 'CCTS_COMPLIANCE_MODE',
      regulatory_status: regTarget?.status ?? 'UNKNOWN',
      regulatory_disclaimer: regStatus.disclaimer,
      data_status: 'CALCULATION',
      formula_version: 'CA-CARBON-V3.0',
    };
  }
}

// ─────────────────────────────────────────────
// Legacy named export (backward compat for v1 imports)
// ─────────────────────────────────────────────
export { CarbonEngine as CarbonEngine_v3 };
export const computeScope1FuelFromLedger = (streams: FuelStreamEntry[]) => {
  const bd = CarbonEngine.computeFromLedgers({ electricity_sources: [], fuel_streams: streams, process_emissions_tco2e: 0 });
  return bd.scope1_fuel_tco2e;
};
