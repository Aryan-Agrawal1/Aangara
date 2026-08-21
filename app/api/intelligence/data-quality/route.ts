import { NextRequest, NextResponse } from 'next/server';
import { DataQualityEngine } from '@/lib/engines/dataQuality';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const dq = DataQualityEngine.auditFacilityInput(body);
    return NextResponse.json({
      success: true,
      data: dq,
      errors: dq.errors,
      warnings: dq.warnings,
      source_status: 'current'
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
