import { NextRequest, NextResponse } from 'next/server';
import { IntelligenceService } from '@/lib/engines/intelligence';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const schema_version = body.schema_version === 'v2' ? 'v2' : 'v1';
    const res = IntelligenceService.analyzeFacility(body);
    return NextResponse.json({
      success: true,
      data: res,
      schema_version,
      errors: res.data_quality?.errors || [],
      warnings: res.data_quality?.warnings || [],
      source_status: 'current',
      // v2-enriched response
      business_profile: res.business_profile ?? null,
      regulatory_status: res.facility_summary?.regulatory_status ?? 'FINAL',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
