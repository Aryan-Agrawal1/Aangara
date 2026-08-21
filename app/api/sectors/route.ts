import { NextResponse } from 'next/server';
import { REGULATORY_STATUS_DATA, REGULATORY_TARGETS_DATA } from '@/lib/engines/data';

export async function GET() {
  const statusDict = REGULATORY_STATUS_DATA.sectors || {};
  const targets = REGULATORY_TARGETS_DATA.targets || [];

  const sectors = Object.entries(statusDict).map(([secId, info]: [string, any]) => {
    const matchingTargets = targets.filter((t: any) => t.sector === secId);
    return {
      ...info,
      targets: matchingTargets
    };
  });

  return NextResponse.json({
    success: true,
    data: {
      total_sectors: sectors.length,
      sectors
    },
    errors: [],
    warnings: [],
    source_status: 'current'
  });
}
