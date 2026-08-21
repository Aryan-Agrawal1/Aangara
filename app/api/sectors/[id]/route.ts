import { NextRequest, NextResponse } from 'next/server';
import { REGULATORY_STATUS_DATA, REGULATORY_TARGETS_DATA } from '@/lib/engines/data';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const statusDict = REGULATORY_STATUS_DATA.sectors || {};
  const sec = statusDict[id];
  if (!sec) {
    return NextResponse.json({ success: false, error: `Sector '${id}' not found` }, { status: 404 });
  }

  const targets = (REGULATORY_TARGETS_DATA.targets || []).filter((t: any) => t.sector === id);
  return NextResponse.json({
    success: true,
    data: {
      ...sec,
      targets
    },
    errors: [],
    warnings: [],
    source_status: 'current'
  });
}
