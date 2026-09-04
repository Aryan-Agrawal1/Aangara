import { NextRequest, NextResponse } from 'next/server';
import { MASTER_ENTITIES_DATA } from '@/lib/engines/data';
import { CapitalOptimizer } from '@/lib/engines/optimizer';

export async function POST(request: NextRequest) {
  try {
    const req = await request.json();
    const entity = (MASTER_ENTITIES_DATA.entities || []).find((e: any) => e.entity_id === req.entity_id)
      || (MASTER_ENTITIES_DATA.entities || [])[0];

    const periods = (entity?.reporting_periods || {}) as Record<string, any>;
    const rp = periods[req.reporting_year || '2025-26'] || {
      actual_output: 1000000,
      total_ghg_tco2e: 760000,
      target_gei: 0.72
    };

    const output = rp.actual_output;
    const emissions = rp.total_ghg_tco2e;
    const target_gei = rp.target_gei;
    const actual_gei = Number((emissions / Math.max(1, output)).toFixed(4));
    const prj = entity?.primary_project || {
      capex_cr: 50.0,
      annual_opex_change_cr: 1.5,
      annual_energy_savings_cr: 12.0,
      expected_reduction_tco2e: 25000.0
    };

    // ── Live scenario parameters from request body ──
    const params = req.parameters || {};
    const ccc_price_inr = Number(params.ccc_price_inr ?? 1000.0);
    const project_output_delivery_pct = Number(params.project_output_delivery_pct ?? params.project_output_pct ?? 100.0);
    const project_delay_months = Number(params.project_delay_months ?? 0);
    const financing_rate_pct = Number(params.financing_rate_pct ?? 9.5);
    const management_objective = params.management_objective ?? 'BALANCED';
    const technology_trl = Number(params.technology_trl ?? 8);

    // ── MRV score from actual entity data ──
    const mrv_score = Number(entity?.mrv_readiness?.composite_score ?? 85.0);

    // ── Regulatory status ──
    const sector = entity?.sector || 'cement';
    const FINAL_SECTORS = ['cement', 'aluminium', 'chlor_alkali', 'pulp_paper', 'petrochemicals', 'petroleum_refinery', 'textile'];
    const regulatory_status: 'FINAL' | 'DRAFT' | 'WATCHLIST' =
      FINAL_SECTORS.includes(sector) ? 'FINAL' : sector === 'iron_steel' ? 'DRAFT' : 'WATCHLIST';

    // ── Compute baseline (default params) to produce a correct delta ──
    const baselineDecision = CapitalOptimizer.compareStrategies({
      entity_output: output,
      baseline_emissions_tco2e: emissions,
      actual_gei,
      target_gei,
      project_capex_cr: prj.capex_cr || 50.0,
      project_opex_change_cr: prj.annual_opex_change_cr || 1.5,
      project_energy_savings_cr: prj.annual_energy_savings_cr || 12.0,
      project_reduction_tco2e: prj.expected_reduction_tco2e || 25000.0,
      ccc_price_inr: 1000.0,      // baseline price always 1000 for delta comparison
      project_output_delivery_pct: 100.0,
      project_delay_months: 0,
      financing_rate_pct: 9.5,
      mrv_score,
      management_objective: 'BALANCED',
      regulatory_status,
    });

    // ── Compute simulated scenario ──
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
      project_output_delivery_pct,
      project_delay_months,
      financing_rate_pct,
      mrv_score,
      management_objective,
      regulatory_status,
      technology_trl,
    });

    // ── Correct delta: simulated - baseline (no more hardcoded 50.0 subtraction) ──
    const delta_vs_baseline = {
      buy_cost_delta_cr: Number((decision.strategies.BUY.total_cost_cr - baselineDecision.strategies.BUY.total_cost_cr).toFixed(2)),
      build_cost_delta_cr: Number((decision.strategies.BUILD.total_cost_cr - baselineDecision.strategies.BUILD.total_cost_cr).toFixed(2)),
      hybrid_cost_delta_cr: Number(((decision.strategies.HYBRID?.total_cost_cr ?? 0) - (baselineDecision.strategies.HYBRID?.total_cost_cr ?? 0)).toFixed(2)),
      recommendation_changed: decision.recommended_strategy !== baselineDecision.recommended_strategy,
      baseline_winner: baselineDecision.recommended_strategy,
      simulated_winner: decision.recommended_strategy,
    };

    // ── Build sensitivity insights ──
    const sensitivity_insights: string[] = [];
    if (Math.abs(delta_vs_baseline.buy_cost_delta_cr) > 0.5) {
      const dir = delta_vs_baseline.buy_cost_delta_cr > 0 ? 'increased' : 'decreased';
      sensitivity_insights.push(`BUY strategy cost ${dir} by ₹${Math.abs(delta_vs_baseline.buy_cost_delta_cr).toFixed(1)} Cr vs base scenario due to CCC price change.`);
    }
    if (project_delay_months > 6) {
      sensitivity_insights.push(`Implementation delay of ${project_delay_months} months increases BUILD risk and defers energy savings, reducing NPV.`);
    }
    if (financing_rate_pct > 12) {
      sensitivity_insights.push(`High financing rate (${financing_rate_pct}%) materially reduces BUILD NPV and favours BUY for near-term shortfalls.`);
    }
    if (delta_vs_baseline.recommendation_changed) {
      sensitivity_insights.push(`Scenario change shifted optimal strategy from ${delta_vs_baseline.baseline_winner} to ${delta_vs_baseline.simulated_winner}.`);
    }

    return NextResponse.json({
      success: true,
      data: {
        entity_id: req.entity_id,
        reporting_year: req.reporting_year || '2025-26',
        scenario_parameters: {
          ccc_price_inr,
          project_output_delivery_pct,
          project_delay_months,
          financing_rate_pct,
          management_objective,
        },
        strategies: decision.strategies,
        recommended_strategy: decision.recommended_strategy,
        recommendation_reason: decision.recommendation_reason,
        winner_strategy: decision.recommended_strategy,
        winner_summary: decision.recommendation_reason,
        delta_vs_baseline,
        delta_vs_base: delta_vs_baseline, // backward compat alias
        sensitivity_insights,
      },
      errors: [],
      warnings: [],
      source_status: 'current'
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
