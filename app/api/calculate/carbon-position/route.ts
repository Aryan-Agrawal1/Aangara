import { NextRequest, NextResponse } from 'next/server';
import { MASTER_ENTITIES_DATA } from '@/lib/engines/data';
import { CarbonEngine } from '@/lib/engines/carbon';

export async function POST(request: NextRequest) {
  try {
    const req = await request.json();
    const entity = (MASTER_ENTITIES_DATA.entities || []).find((e: any) => e.entity_id === req.entity_id);
    if (!entity) {
      return NextResponse.json({ success: false, error: `Entity '${req.entity_id}' not found` }, { status: 404 });
    }

    const periods = (entity.reporting_periods || {}) as Record<string, any>;
    const rp = periods[req.reporting_year || '2025-26'];
    if (!rp) {
      return NextResponse.json({ success: false, error: `Reporting period not found` }, { status: 404 });
    }

    const output = req.custom_output !== undefined ? Number(req.custom_output) : rp.actual_output;
    const emissions = req.custom_emissions !== undefined ? Number(req.custom_emissions) : rp.total_ghg_tco2e;
    const target_gei = req.custom_target_gei !== undefined ? Number(req.custom_target_gei) : rp.target_gei;

    const pos = CarbonEngine.calculatePosition(
      req.entity_id,
      req.reporting_year || '2025-26',
      output,
      rp.output_unit || 'tonnes',
      emissions,
      target_gei
    );

    return NextResponse.json({
      success: true,
      data: pos,
      errors: [],
      warnings: [],
      source_status: 'current'
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
