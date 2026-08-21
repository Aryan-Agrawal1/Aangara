import { NextResponse } from 'next/server';
import { SOURCE_REGISTER_DATA } from '@/lib/engines/data';

export async function GET() {
  const sources = SOURCE_REGISTER_DATA.sources || [];
  return NextResponse.json({
    success: true,
    data: {
      total_sources: sources.length,
      sources
    },
    errors: [],
    warnings: [],
    source_status: 'current'
  });
}
