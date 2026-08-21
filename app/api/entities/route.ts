import { NextRequest, NextResponse } from 'next/server';
import { MASTER_ENTITIES_DATA } from '@/lib/engines/data';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sector = searchParams.get('sector');

  let entities = MASTER_ENTITIES_DATA.entities || [];
  if (sector) {
    entities = entities.filter((e: any) => e.sector === sector);
  }

  return NextResponse.json({
    success: true,
    data: {
      total_entities: entities.length,
      entities
    },
    errors: [],
    warnings: [],
    source_status: 'current'
  });
}
