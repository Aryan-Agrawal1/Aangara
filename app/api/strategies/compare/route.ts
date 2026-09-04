import { NextRequest, NextResponse } from 'next/server';
import { MASTER_ENTITIES_DATA } from '@/lib/engines/data';
import { CarbonEngine } from '@/lib/engines/carbon';
import { CapitalOptimizer } from '@/lib/engines/optimizer';
import { AnomalyEngine } from '@/lib/engines/anomaly';

export async function POST(request: NextRequest) {
  try {
    const req = await request.json();
    const entity = (MASTER_ENTITIES_DATA.entities || []).find((e: any) => e.entity_id === req.entity_id)
      || (MASTER_ENTITIES_DATA.entities || [])[0];

    const periods = (entity?.reporting_periods || {}) as Record<string, any>;
    const rp = periods[req.reporting_year || '2025-26'] || Object.values(periods)[0] || {
      actual_output: 1000000,
      total_ghg_tco2e: 760000,
      target_gei: 0.72,
      output_unit: 'tonnes'
    };

    const output = req.custom_output !== undefined ? Number(req.custom_output) : rp.actual_output;
    const emissions = req.custom_emissions !== undefined ? Number(req.custom_emissions) : rp.total_ghg_tco2e;
    const target_gei = req.custom_target_gei !== undefined ? Number(req.custom_target_gei) : rp.target_gei;
    const actual_gei = Number((emissions / Math.max(1, output)).toFixed(4));

    const prj = entity?.primary_project || {
      capex_cr: 50.0,
      annual_opex_change_cr: 1.5,
      annual_energy_savings_cr: 12.0,
      expected_reduction_tco2e: 25000.0
    };

    // ── Live inputs from request body (fixes hardcode bugs) ──
    const ccc_price_inr = Number(req.ccc_price_inr ?? req.parameters?.ccc_price_inr ?? 1000.0);
    const transaction_fee_pct = Number(req.transaction_fee_pct ?? 0.5);
    const project_output_delivery_pct = Number(req.project_output_delivery_pct ?? req.parameters?.project_output_delivery_pct ?? 100.0);
    const project_delay_months = Number(req.project_delay_months ?? req.parameters?.project_delay_months ?? 0);
    const financing_rate_pct = Number(req.financing_rate_pct ?? req.parameters?.financing_rate_pct ?? 9.5);
    const management_objective = req.management_objective ?? req.parameters?.management_objective ?? 'BALANCED';
    const technology_trl = Number(req.technology_trl ?? 8);

    // ── MRV score from entity data (not hardcoded 85) ──
    const mrv_score = Number(entity?.mrv_readiness?.composite_score ?? 85.0);

    // ── Regulatory status ──
    const sector = entity?.sector || 'cement';
    const FINAL_SECTORS = ['cement', 'aluminium', 'chlor_alkali', 'pulp_paper', 'petrochemicals', 'petroleum_refinery', 'textile'];
    const regulatory_status: 'FINAL' | 'DRAFT' | 'WATCHLIST' =
      FINAL_SECTORS.includes(sector) ? 'FINAL' : sector === 'iron_steel' ? 'DRAFT' : 'WATCHLIST';

    const pos = CarbonEngine.calculatePosition(
      req.entity_id,
      req.reporting_year || '2025-26',
      output,
      rp.output_unit || 'tonnes',
      emissions,
      target_gei
    );

    const decision = CapitalOptimizer.compareStrategies({
      entity_output: output,
      baseline_emissions_tco2e: emissions,
      actual_gei,
      target_gei,
      project_capex_cr: prj.capex_cr || 50.0,
      project_opex_change_cr: prj.annual_opex_change_cr || 1.5,
      project_energy_savings_cr: prj.annual_energy_savings_cr || 12.0,
      project_reduction_tco2e: prj.expected_reduction_tco2e || 25000.0,
      ccc_price_inr,
      transaction_fee_pct,
      project_output_delivery_pct,
      project_delay_months,
      financing_rate_pct,
      mrv_score,
      management_objective,
      regulatory_status,
      technology_trl,
    });

    // ── Real anomaly detection (replaces hardcoded static object) ──
    const anomalyResult = AnomalyEngine.detectOperationalAnomaly({
      actual_gei,
      target_gei,
      sector,
      annual_production_tonnes: output,
      electricity_mwh: rp.source_streams?.electricity_mwh ?? (output * 0.085),
      thermal_fuel_tonnes: rp.source_streams?.fuel_quantity_tonnes ?? (output * 0.08),
      state: entity?.state,
    });

    return NextResponse.json({
      success: true,
      data: {
        entity_id: req.entity_id || entity?.entity_id,
        entity_name: entity?.entity_name || 'Industrial Facility',
        sector,
        reporting_year: req.reporting_year || '2025-26',
        baseline_position: pos,
        project_profile: prj,
        mrv_readiness: entity?.mrv_readiness,
        strategies: decision.strategies,
        recommended_strategy: decision.recommended_strategy,
        recommendation_reason: decision.recommendation_reason,
        assumptions_applied: {
          ...decision.assumptions_applied,
          ccc_price_inr,
          management_objective,
        },
        anomaly_intelligence: {
          status: anomalyResult.status,
          anomaly_score: anomalyResult.anomaly_score,
          anomaly_detected: anomalyResult.anomaly_detected,
          reason_codes: anomalyResult.reason_codes,
          contributing_factors: anomalyResult.contributing_factors,
          interpretation: anomalyResult.interpretation,
          disclaimer: 'This is a data-quality intelligence signal only. It is not a regulatory or compliance determination.',
          metrics_analyzed: anomalyResult.metrics_analyzed,
        },
        provenance: {
          model_version: 'CA-MVP-3.0',
          regulatory_version: 'REG-2026-08-REV3',
          factor_version: 'EF-CEA-V21',
        }
      },
      errors: [],
      warnings: [],
      source_status: 'current'
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
