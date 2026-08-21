import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    status: 'healthy',
    service: 'CarbonAlpha India API',
    model_version: 'CA-MVP-1.0',
    regulatory_version: 'REG-2026-08',
    gemini_active: Boolean(process.env.GEMINI_API_KEY)
  });
}
