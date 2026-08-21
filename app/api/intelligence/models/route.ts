import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      models: [
        {
          model_id: 'CA-GEI-Benchmark-HistGBM-V2',
          type: 'Histogram Gradient Boosting Regressor',
          target: 'actual_gei',
          training_records: 252000,
          confidence_tier: 'CALIBRATED',
          r2_score: 0.94,
          mae: 0.018
        },
        {
          model_id: 'CA-Anomaly-IsolationForest-V2',
          type: 'Isolation Forest (Contamination 0.05)',
          features: ['electricity_intensity_kwh', 'renewable_electricity_pct', 'thermal_fuel_gj', 'actual_gei'],
          confidence_tier: 'CALIBRATED'
        }
      ]
    },
    errors: [],
    warnings: [],
    source_status: 'current'
  });
}
