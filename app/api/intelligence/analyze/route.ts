import { NextRequest, NextResponse } from 'next/server';
import { IntelligenceService } from '@/lib/engines/intelligence';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const res = IntelligenceService.analyzeFacility(body);
    return NextResponse.json({
      success: true,
      data: res,
      errors: res.data_quality?.errors || [],
      warnings: res.data_quality?.warnings || [],
      source_status: 'current'
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
