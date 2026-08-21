import { NextRequest, NextResponse } from 'next/server';
import { MASTER_ENTITIES_DATA } from '@/lib/engines/data';
import { CapitalOptimizer } from '@/lib/engines/optimizer';

export async function POST(request: NextRequest) {
  try {
    const req = await request.json();
    const entity = (MASTER_ENTITIES_DATA.entities || []).find((e: any) => e.entity_id === req.entity_id) 
      || (MASTER_ENTITIES_DATA.entities || [])[0];

    const rp = entity?.reporting_periods?.[req.reporting_year || '2025-26'] || {
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

    const params = req.parameters || {};
    const ccc_price_inr = Number(params.ccc_price_inr ?? 1000.0);
    const project_output_delivery_pct = Number(params.project_output_delivery_pct ?? 100.0);
    const project_delay_months = Number(params.project_delay_months ?? 0);
    const financing_rate_pct = Number(params.financing_rate_pct ?? 9.5);

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
      financing_rate_pct
    });

    return NextResponse.json({
      success: true,
      data: {
        entity_id: req.entity_id,
        scenario_parameters: params,
        strategies: decision.strategies,
        recommended_strategy: decision.recommended_strategy,
        delta_vs_baseline: {
          buy_cost_delta_cr: Number((decision.strategies.BUY.total_cost_3yr_cr - (output * Math.max(0, actual_gei - target_gei) * 1000 * 3 / 1e7)).toFixed(2)),
          build_cost_delta_cr: Number((decision.strategies.BUILD.total_cost_3yr_cr - 50.0).toFixed(2)),
          recommendation_changed: false
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
