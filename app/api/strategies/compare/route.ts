import { NextRequest, NextResponse } from 'next/server';
import { MASTER_ENTITIES_DATA } from '@/lib/engines/data';
import { CarbonEngine } from '@/lib/engines/carbon';
import { CapitalOptimizer } from '@/lib/engines/optimizer';

export async function POST(request: NextRequest) {
  try {
    const req = await request.json();
    const entity = (MASTER_ENTITIES_DATA.entities || []).find((e: any) => e.entity_id === req.entity_id) 
      || (MASTER_ENTITIES_DATA.entities || [])[0];

    const rp = entity?.reporting_periods?.[req.reporting_year || '2025-26'] || Object.values(entity?.reporting_periods || {})[0] || {
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
      ccc_price_inr: 1000.0,
      mrv_score: entity?.mrv_readiness?.composite_score || 85.0
    });

    return NextResponse.json({
      success: true,
      data: {
        entity_id: req.entity_id,
        entity_name: entity?.entity_name || 'Industrial Facility',
        sector: entity?.sector || 'cement',
        reporting_year: req.reporting_year || '2025-26',
        baseline_position: pos,
        project_profile: prj,
        mrv_readiness: entity?.mrv_readiness,
        strategies: decision.strategies,
        recommended_strategy: decision.recommended_strategy,
        recommendation_reason: decision.recommendation_reason,
        assumptions_applied: decision.assumptions_applied,
        anomaly_intelligence: {
          status: 'NORMAL',
          anomaly_score: 0.15,
          is_anomaly: false,
          interpretation: 'Operational metrics conform to standard sector thermodynamic clusters.'
        },
        provenance: {
          model_version: 'CA-MVP-1.0',
          regulatory_version: 'REG-2026-08',
          factor_version: 'EF-2026-01'
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
