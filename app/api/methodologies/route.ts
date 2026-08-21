import { NextResponse } from 'next/server';
import { METHODOLOGIES_DATA } from '@/lib/engines/data';

export async function GET() {
  const methodologies = METHODOLOGIES_DATA.methodologies || [];
  return NextResponse.json({
    success: true,
    data: {
      total_methodologies: methodologies.length,
      methodologies
    },
    errors: [],
    warnings: [],
    source_status: 'current'
  });
}
