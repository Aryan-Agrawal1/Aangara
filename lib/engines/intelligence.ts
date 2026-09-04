/**
 * AANGARA Intelligence Service v2.2
 * ─────────────────────────────────────────────────────────
 * Backward compatible: auto-detects v1 (flat) vs v2 (structured) input.
 * v1: flat FacilityFormData — original API contract, always works
 * v2: FacilityInputV2 — new canonical schema with ledgers
 *
 * Spec: AANGARA_Facility_Dashboard_Input_Segregation_v2.2
 * Priority: P0 Input Architecture — ENGINE BOUNDARY compliance
 */

import { REGULATORY_STATUS_DATA, REGULATORY_TARGETS_DATA } from './data';
import { DataQualityEngine } from './dataQuality';
import { CarbonEngine } from './carbon';
import { OpportunityEngine } from './opportunities';
import { CapitalOptimizer } from './optimizer';
import { AnomalyEngine } from './anomaly';
import { getRegulatoryTarget, isStatutoryEligible, getRegulatoryStatusLabel } from '@/lib/registries/regulatory-registry';
import {
  FacilityInputV2,
  convertV1ToV2,
  computeScope2FromLedger,
  computeScope1FuelFromLedger,
  FUEL_EMISSION_FACTORS,
  type FacilityFormDataV1,
} from '@/types/facility-v2';

// ─────────────────────────────────────────────
// Regulatory target data (immutable facts)
// ─────────────────────────────────────────────
const SECTOR_REGULATORY_STATUS: Record<string, 'FINAL' | 'DRAFT' | 'WATCHLIST'> = {
  cement: 'FINAL',
  aluminium: 'FINAL',
  chlor_alkali: 'FINAL',
  pulp_paper: 'FINAL',
  petrochemicals: 'FINAL',
  petroleum_refinery: 'FINAL',
  textile: 'FINAL',
  iron_steel: 'DRAFT',
  fertiliser: 'WATCHLIST',
};

// ─────────────────────────────────────────────
// Sector-specific process emission calculators
// ─────────────────────────────────────────────

function computeProcessEmissions(sector: string, v2: FacilityInputV2, output: number): number {
  const pi = v2.process_inputs;
  if (!pi) return 0;

  if (sector === 'cement' && pi.sector === 'cement') {
    const cf = (pi.data.clinker_factor_pct ?? 74) / 100;
    const clinker_t = pi.data.clinker_production ?? output * cf;
    return CarbonEngine.computeCementProcessEmissions({
      clinker_production_tonnes: clinker_t,
      raw_material_carbonate_purity_pct: 95.0,
      ckd_factor: 1.02,
    }).process_emissions_tco2e;
  }

  if (sector === 'aluminium' && pi.sector === 'aluminium') {
    return CarbonEngine.computeAluminiumAnodeEmissions({
      aluminium_production_tonnes: output,
      net_anode_consumption_kg_per_t: (pi.data as any).smelter_dc_sec_kwh ? 430 : 435,
      anode_ash_pct: 0.5,
      pfc_cf4_kg: pi.data.PFC_CF4_kg ?? 0,
      pfc_c2f6_kg: pi.data.PFC_C2F6_kg ?? 0,
    }).total_process_emissions_tco2e;
  }

  if (sector === 'petroleum_refinery' && pi.sector === 'petroleum_refinery') {
    return Number((pi.data.process_CO2_tco2e ?? output * 0.025).toFixed(2));
  }

  if (sector === 'petrochemicals' && pi.sector === 'petrochemicals') {
    const flare = pi.data.flare_volume_GJ ?? 0;
    return Number((flare * 0.055).toFixed(2));
  }

  if (sector === 'iron_steel' && pi.sector === 'iron_steel') {
    // Non-statutory analytical estimate (DRAFT sector per G.S.R. 517(E))
    return Number((output * 0.15).toFixed(2));
  }

  return 0;
}

// ─────────────────────────────────────────────
// v2 electricity total helper
// ─────────────────────────────────────────────
function totalElecMwh(v2: FacilityInputV2): number {
  return v2.carbon_inputs.electricity_sources.reduce((s, src) => s + src.annual_mwh, 0);
}

function renewablePct(v2: FacilityInputV2): number {
  const total = totalElecMwh(v2);
  if (total <= 0) return 0;
  const reTotal = v2.carbon_inputs.electricity_sources
    .filter(s => s.renewable_status)
    .reduce((s, src) => s + src.annual_mwh, 0);
  return (reTotal / total) * 100;
}

function totalFuelTonnes(v2: FacilityInputV2): number {
  return v2.carbon_inputs.fuel_streams.reduce((s, f) => {
    if (f.quantity_unit === 'TONNES') return s + f.quantity;
    if (f.quantity_unit === 'KG') return s + f.quantity / 1000;
    return s + f.quantity; // GJ — approximate
  }, 0);
}

function primaryFuelType(v2: FacilityInputV2): string {
  const streams = v2.carbon_inputs.fuel_streams;
  if (!streams.length) return 'INDIAN_DOMESTIC_COAL';
  // Largest stream by quantity
  const primary = streams.reduce((a, b) => a.quantity > b.quantity ? a : b);
  return primary.fuel_type;
}

// ─────────────────────────────────────────────
// WHRS MW extraction (cross-sector)
// ─────────────────────────────────────────────
function getWHRS(v2: FacilityInputV2): number {
  const pi = v2.process_inputs;
  if (!pi) return 0;
  if (pi.sector === 'cement') return pi.data.WHRS_capacity_MW ?? 0;
  if (pi.sector === 'iron_steel') return pi.data.WHRS_capacity_MW ?? 0;
  return 0;
}

// ─────────────────────────────────────────────
// Build Executive Explanation (v2 enriched)
// ─────────────────────────────────────────────
function buildExplanation(
  v2: FacilityInputV2,
  breakdown: ReturnType<typeof CarbonEngine.computeFromLedgers>,
  actual_gei: number,
  target_gei: number,
  decision: any,
  primary_opp: any
) {
  const { scope1_fuel_tco2e, scope1_process_tco2e, scope2_grid_tco2e, total_ghg_tco2e } = breakdown;
  const scope1_total = scope1_fuel_tco2e + scope1_process_tco2e;
  const prod = v2.production.reporting_year_production;
  const sector = v2.regulatory.sector;
  const regStatus = SECTOR_REGULATORY_STATUS[sector] ?? 'FINAL';
  const isDraft = regStatus === 'DRAFT' || sector === 'iron_steel';
  const regNote = isDraft
    ? `STATUTORY EXCLUSION: ${sector.replace('_', ' ').toUpperCase()} sector is classified as DRAFT under MoEFCC G.S.R. 517(E). Statutory CCTS calculation is NOT_AVAILABLE and no compliance obligation applies. Displayed figures are non-statutory analytical models only.`
    : `Sector is a notified CCTS Phase 1 obligated entity under G.S.R. 25(E).`;

  const complianceRiskCr = isDraft
    ? 0.0
    : Number(((Math.max(0, actual_gei - target_gei) * prod * 1000) / 1e7).toFixed(2));

  // Domain-segregated narrative
  const carbonNarrative = [
    `CARBON DOMAIN: ${v2.identity.facility_name} reports a calculated GHG Emission Intensity of ${actual_gei} tCO₂e/${v2.production.production_unit} against the statutory CCTS target of ${target_gei}.`,
    `Scope 1 (combustion + process): ${scope1_total.toLocaleString()} tCO₂e (${((scope1_total / Math.max(1, total_ghg_tco2e)) * 100).toFixed(0)}% of total).`,
    `Scope 2 (electricity): ${scope2_grid_tco2e.toLocaleString()} tCO₂e from ${v2.carbon_inputs.electricity_sources.length} declared source(s).`,
    regNote,
  ].join('\n');

  const businessNarrative = [
    `BUSINESS TWIN: Capital optimizer recommends ${decision.recommended_strategy} posture.`,
    `Top abatement project: "${primary_opp.title}" — ${primary_opp.annual_reduction_tco2e?.toLocaleString()} tCO₂e/yr, ₹${primary_opp.capex_cr} Cr CAPEX, ${primary_opp.payback_years}yr payback.`,
    isDraft
      ? `Carbon compliance cost risk: ₹0.0 Cr (Statutory obligation not applicable for DRAFT sector).`
      : `Carbon compliance cost risk: ₹${complianceRiskCr} Cr/year at ₹1,000/CCC (scenario assumption).`,
  ].join('\n');

  return {
    executive_summary: `${carbonNarrative}\n\n${businessNarrative}`,
    narrative: `${carbonNarrative}\n\n${businessNarrative}`,
    carbon_domain_summary: carbonNarrative,
    business_domain_summary: businessNarrative,
    key_drivers: [
      `Scope 1 combustion and process emissions: ${scope1_total.toLocaleString()} tCO₂e (${((scope1_total / Math.max(1, total_ghg_tco2e)) * 100).toFixed(0)}%)`,
      `Scope 2 grid electricity across ${v2.carbon_inputs.electricity_sources.length} source(s): ${scope2_grid_tco2e.toLocaleString()} tCO₂e`,
      `Top abatement pathway (${primary_opp.title}) delivers ${primary_opp.annual_reduction_tco2e?.toLocaleString()} tCO₂e/yr.`,
    ],
    risk_advisory: 'CCC market price volatility (scenario input, not an observed market fact) and project execution risk are the primary uncertainties. Internal project development provides a defensive thermodynamic hedge.',
    next_steps: [
      'Audit electrical and thermal sub-meters for ACVA statutory verification readiness.',
      `Obtain vendor quote to move project CAPEX from ESTIMATE to DPR-backed class.`,
      'Monitor BEE/MoEFCC CCTS notifications for trading window openings.',
    ],
  };
}

// ─────────────────────────────────────────────
// Main Service
// ─────────────────────────────────────────────

export class IntelligenceService {

  static getSectorDefaults(sector: string): FacilityFormDataV1 {
    const defaults: Record<string, FacilityFormDataV1> = {
      cement: {
        facility_name: 'Sample Integrated Cement Works',
        sector: 'cement',
        sub_sector: 'Integrated Plant (OPC/PPC)',
        state: 'Rajasthan',
        annual_production: 1200000.0,
        production_unit: 'tonnes',
        electricity_mwh: 95000.0,
        renewable_electricity_pct: 14.5,
        thermal_fuel_type: 'petcoke',
        thermal_fuel_tonnes: 92000.0,
        clinker_factor_pct: 74.0,
        whrs_installed_mw: 0.0,
      },
      iron_steel: {
        facility_name: 'Sample Integrated BF-BOF Steel Plant',
        sector: 'iron_steel',
        sub_sector: 'Integrated BF-BOF Route',
        state: 'Odisha',
        annual_production: 2200000.0,
        production_unit: 'tonnes',
        electricity_mwh: 1650000.0,
        renewable_electricity_pct: 8.0,
        thermal_fuel_type: 'indian_domestic_coal',
        thermal_fuel_tonnes: 1850000.0,
        steel_route: 'BF_BOF',
        whrs_installed_mw: 0.0,
      },
      aluminium: {
        facility_name: 'Sample Primary Aluminium Smelter',
        sector: 'aluminium',
        sub_sector: 'Primary Smelting',
        state: 'Chhattisgarh',
        annual_production: 300000.0,
        production_unit: 'tonnes',
        electricity_mwh: 4350000.0,
        renewable_electricity_pct: 5.0,
        thermal_fuel_type: 'indian_domestic_coal',
        thermal_fuel_tonnes: 520000.0,
        smelter_dc_sec_kwh: 14450.0,
        whrs_installed_mw: 0.0,
      },
      chlor_alkali: {
        facility_name: 'Sample Membrane Cell Caustic Soda Unit',
        sector: 'chlor_alkali',
        sub_sector: 'Membrane Cell Caustic Soda',
        state: 'Gujarat',
        annual_production: 200000.0,
        production_unit: 'tonnes',
        electricity_mwh: 450000.0,
        renewable_electricity_pct: 10.0,
        thermal_fuel_type: 'natural_gas',
        thermal_fuel_tonnes: 22000.0,
        caustic_tech: 'bipolar_membrane',
      },
      pulp_paper: {
        facility_name: 'Sample Integrated Pulp & Paper Mill',
        sector: 'pulp_paper',
        sub_sector: 'Integrated Chemical Pulp & Paper',
        state: 'Andhra Pradesh',
        annual_production: 350000.0,
        production_unit: 'tonnes',
        electricity_mwh: 320000.0,
        renewable_electricity_pct: 22.0,
        thermal_fuel_type: 'biomass',
        thermal_fuel_tonnes: 165000.0,
        paper_steam_specific: 4.8,
      },
      petroleum_refinery: {
        facility_name: 'Sample High-Complexity Coastal Refinery',
        sector: 'petroleum_refinery',
        sub_sector: 'High-Complexity Coastal Refinery',
        state: 'Gujarat',
        annual_production: 7500000.0,
        production_unit: 'tonnes',
        electricity_mwh: 450000.0,
        renewable_electricity_pct: 5.0,
        thermal_fuel_type: 'natural_gas',
        thermal_fuel_tonnes: 620000.0,
        refinery_mbn: 9.8,
      },
      petrochemicals: {
        facility_name: 'Sample Dual-Feed Naphtha/Gas Cracker',
        sector: 'petrochemicals',
        sub_sector: 'Dual-Feed Naphtha/Gas Cracker',
        state: 'Maharashtra',
        annual_production: 850000.0,
        production_unit: 'tonnes',
        electricity_mwh: 580000.0,
        renewable_electricity_pct: 10.0,
        thermal_fuel_type: 'natural_gas',
        thermal_fuel_tonnes: 140000.0,
        petrochem_feedstock: 'dual_feed',
      },
      textile: {
        facility_name: 'Sample Composite Processing Mill',
        sector: 'textile',
        sub_sector: 'Integrated Spinning, Weaving & Wet Processing',
        state: 'Tamil Nadu',
        annual_production: 45000.0,
        production_unit: 'tonnes',
        electricity_mwh: 180000.0,
        renewable_electricity_pct: 35.0,
        thermal_fuel_type: 'biomass',
        thermal_fuel_tonnes: 22000.0,
        textile_route: 'composite_processing',
      },
    };
    return defaults[sector] || defaults.cement;
  }

  /**
   * Main facility analysis — detects schema version and routes accordingly.
   * Both v1 flat and v2 structured inputs produce the same output shape.
   */
  static analyzeFacility(data: Record<string, any>) {
    // ── Schema version detection ──
    const isV2 = data.schema_version === 'v2' && data.carbon_inputs;

    // Convert v1 → v2 if needed
    const v2: FacilityInputV2 = isV2
      ? (data as unknown as FacilityInputV2)
      : convertV1ToV2(data as FacilityFormDataV1);

    // ── Data Quality Audit (v1-compat fields extracted) ──
    const dqData = {
      annual_production: v2.production.reporting_year_production,
      electricity_mwh: totalElecMwh(v2),
      renewable_electricity_pct: renewablePct(v2),
      sector: v2.regulatory.sector,
    };
    const dq = DataQualityEngine.auditFacilityInput(dqData);
    if (!dq.is_valid) {
      return {
        data_quality: dq,
        carbon_profile: null,
        peer_benchmark: null,
        anomaly_intelligence: null,
        opportunities: [],
        strategy_recommendation: null,
      };
    }

    const sector = (v2.regulatory.sector || 'cement').toLowerCase();
    const output = Math.max(1, v2.production.reporting_year_production);
    const regStatus = SECTOR_REGULATORY_STATUS[sector] ?? 'FINAL';

    // ── CARBON DOMAIN ──
    // Compute sector-specific process emissions
    const scope1_process = computeProcessEmissions(sector, v2, output);

    // Compute from ledgers (v2 path)
    const breakdown = CarbonEngine.computeFromLedgers({
      electricity_sources: v2.carbon_inputs.electricity_sources,
      fuel_streams: v2.carbon_inputs.fuel_streams,
      process_emissions_tco2e: scope1_process,
      state: v2.identity.state,
    });

    const { total_ghg_tco2e, scope1_fuel_tco2e, scope2_grid_tco2e } = breakdown;
    const actual_gei = Number((total_ghg_tco2e / output).toFixed(4));

    // ── Regulatory Target & Status ──
    const regTargetRecord = getRegulatoryTarget(sector, (v2.reporting.financial_year || '2025-26') as any);
    let target_gei = regTargetRecord?.target_gei ?? 0.72;
    if (v2.carbon_inputs.custom_target_gei) {
      target_gei = Number(v2.carbon_inputs.custom_target_gei);
    }
    const isStatutory = isStatutoryEligible(sector);
    const statutoryStatus = regTargetRecord?.status ?? regStatus;

    // ── Carbon Position ──
    const pos = CarbonEngine.calculatePosition(
      v2.identity.facility_name || 'My Facility',
      v2.reporting.financial_year || '2025-26',
      output,
      v2.production.production_unit || 'tonnes',
      total_ghg_tco2e,
      target_gei,
      { sector, state: v2.identity.state }
    );

    // ── Peer Benchmarking (Spec §35.3: Synthetic charts removed until audited real data) ──
    const elec_mwh = totalElecMwh(v2);
    const ren_pct = renewablePct(v2);
    const benchmark_res = {
      facility_gei: actual_gei,
      peer_median_gei: null as number | null,
      peer_percentile: null as number | null,
      peer_p25_gei: null as number | null,
      peer_p75_gei: null as number | null,
      peer_sample_count: 0,
      benchmark_model: 'BENCH-ECDF-V1',
      confidence_tier: 'AWAITING_DATA',
      data_provenance_mix: 'AWAITING_AUDITED_COHORT',
      confidence: 'LOW',
      cohort_descriptor: `${sector.replace('_', ' ').toUpperCase()} | CCTS Phase 1 Obligated Cohort`,
      regulatory_status: statutoryStatus,
      status: 'BENCHMARK_DATA_UNAVAILABLE',
      interpretation: 'Synthetic benchmarks removed per CCTS MRV specification. Audited empirical cohort distributions will be rendered following first ACVA statutory compliance cycle.',
    };

    // ── Anomaly Engine (Spec §36: Robust Z-score & Physical Envelopes) ──
    const anomaly_res = AnomalyEngine.detectOperationalAnomaly({
      actual_gei,
      target_gei,
      sector,
      annual_production_tonnes: output,
      electricity_mwh: elec_mwh,
      thermal_fuel_tonnes: totalFuelTonnes(v2),
      state: v2.identity.state,
    });

    // ── Opportunity Engine ──
    const opps = OpportunityEngine.identifyOpportunities({
      sector,
      annual_production: output,
      current_emissions_tco2e: total_ghg_tco2e,
      actual_gei,
      electricity_mwh: elec_mwh,
      renewable_pct: ren_pct,
      whrs_mw: getWHRS(v2),
    });

    const primary_opp = opps[0] || {
      title: 'Generic Efficiency Upgrade',
      capex_cr: 50.0,
      annual_opex_change_cr: 1.5,
      annual_energy_savings_cr: 12.0,
      annual_reduction_tco2e: 25000.0,
      payback_years: 4.2,
    };

    // ── Capital Optimizer ──
    // Business inputs: scenario CCC price
    const ccc_price = v2.scenario_inputs?.CCC_price_scenarios?.[0]?.CCC_price_inr ?? 1000.0;
    const decision = CapitalOptimizer.compareStrategies({
      entity_output: output,
      baseline_emissions_tco2e: total_ghg_tco2e,
      actual_gei,
      target_gei,
      project_capex_cr: primary_opp.capex_cr,
      project_opex_change_cr: primary_opp.annual_opex_change_cr,
      project_energy_savings_cr: primary_opp.annual_energy_savings_cr,
      project_reduction_tco2e: primary_opp.annual_reduction_tco2e,
      ccc_price_inr: ccc_price,
      financing_rate_pct: v2.finance_inputs?.interest_rate_pct ?? 9.5,
      management_objective: v2.business_inputs.management_objective ?? 'BALANCED',
      regulatory_status: statutoryStatus as any,
      mrv_score: dq.quality_score,
    });

    // ── Business Profile (new in v2) ──
    const fuel_streams = v2.carbon_inputs.fuel_streams;
    const electricity_sources = v2.carbon_inputs.electricity_sources;
    const business_profile = {
      schema_version: 'v2',
      electricity_economics_available: (v2.business_inputs.electricity_tariffs?.length ?? 0) > 0,
      fuel_economics_available: (v2.business_inputs.fuel_economics?.length ?? 0) > 0,
      energy_economics_summary: {
        total_electricity_mwh: elec_mwh,
        renewable_share_pct: Number(ren_pct.toFixed(1)),
        electricity_source_count: electricity_sources.length,
        fuel_stream_count: fuel_streams.length,
        total_fuel_qty_tonnes: totalFuelTonnes(v2),
        primary_fuel_type: primaryFuelType(v2),
      },
      management_objective: v2.business_inputs.management_objective ?? 'BALANCED',
      carbon_price_scenario: v2.scenario_inputs?.CCC_price_scenarios?.[0] ?? {
        scenario_id: 'default',
        label: 'Base',
        CCC_price_inr: 1000,
        price_type: 'SCENARIO_ASSUMPTION',
      },
      regulatory_status: regStatus,
    };

    // ── Executive Explanation ──
    const explanation = buildExplanation(v2, breakdown, actual_gei, target_gei, decision, primary_opp);

    return {
      facility_summary: {
        facility_name: v2.identity.facility_name || 'My Facility',
        legal_entity_name: v2.identity.legal_entity_name,
        sector,
        state: v2.identity.state || 'India',
        annual_production: output,
        production_unit: v2.production.production_unit || 'tonnes',
        energy_intensity_gj_per_t: Number(
          (((elec_mwh * 3.6) + (totalFuelTonnes(v2) * 28.0)) / output).toFixed(2)
        ),
        renewable_share_pct: Number(ren_pct.toFixed(1)),
        regulatory_status: regStatus,
        schema_version: 'v2',
      },
      data_quality: dq,
      carbon_profile: {
        scope1_fuel_tco2e: breakdown.scope1_fuel_tco2e,
        scope1_process_tco2e: breakdown.scope1_process_tco2e,
        scope2_grid_tco2e: breakdown.scope2_grid_tco2e,
        total_ghg_tco2e,
        actual_gei,
        target_gei,
        gei_delta: pos.gei_delta,
        compliance_status: pos.status,
        potential_surplus_tco2e: pos.potential_surplus_tco2e,
        potential_shortfall_tco2e: pos.potential_shortfall_tco2e,
        calculation_trace: pos.calculation_trace,
        // v2 enriched breakdowns
        electricity_source_breakdown: breakdown.electricity_source_breakdown,
        fuel_stream_breakdown: breakdown.fuel_stream_breakdown,
        regulatory_status: regStatus,
      },
      business_profile,
      peer_benchmark: benchmark_res,
      anomaly_intelligence: anomaly_res,
      opportunities: opps,
      strategy_recommendation: decision,
      executive_explanation: explanation,
    };
  }
}
