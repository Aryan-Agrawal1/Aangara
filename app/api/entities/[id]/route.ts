import { NextRequest, NextResponse } from 'next/server';
import { MASTER_ENTITIES_DATA } from '@/lib/engines/data';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const entities = MASTER_ENTITIES_DATA.entities || [];
  const entity = entities.find((e: any) => e.entity_id === id);

  if (!entity) {
    return NextResponse.json({ success: false, error: `Entity '${id}' not found` }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    data: entity,
    errors: [],
    warnings: [],
    source_status: 'current'
  });
}
