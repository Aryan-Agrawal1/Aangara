import { NextRequest, NextResponse } from 'next/server';
import { IntelligenceService } from '@/lib/engines/intelligence';

export async function GET(request: NextRequest, { params }: { params: Promise<{ sector: string }> }) {
  const { sector } = await params;
  const defaults = IntelligenceService.getSectorDefaults(sector);
  return NextResponse.json({
    success: true,
    data: defaults,
    errors: [],
    warnings: [],
    source_status: 'current'
  });
}
