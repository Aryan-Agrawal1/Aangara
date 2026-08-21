export class DataQualityEngine {
  static auditFacilityInput(data: Record<string, any>) {
    const errors: { field: string; message: string }[] = [];
    const warnings: { field: string; message: string }[] = [];

    const prod = Number(data.annual_production || 0);
    if (prod <= 0) {
      errors.push({ field: 'annual_production', message: 'Annual production must be greater than 0.' });
    }

    const elec = Number(data.electricity_mwh || 0);
    if (elec < 0) {
      errors.push({ field: 'electricity_mwh', message: 'Electricity consumption cannot be negative.' });
    }

    const ren_pct = Number(data.renewable_electricity_pct || 0);
    if (ren_pct < 0 || ren_pct > 100) {
      errors.push({ field: 'renewable_electricity_pct', message: 'Renewable electricity percentage must be between 0 and 100%.' });
    }

    const sec = (data.sector || '').toLowerCase();
    if (sec === 'cement') {
      const elec_int = prod > 0 ? (elec * 1000) / prod : 0;
      if (elec_int < 50 || elec_int > 150) {
        warnings.push({ field: 'electricity_mwh', message: `Specific electrical consumption (${elec_int.toFixed(1)} kWh/t) outside typical Indian cement range (65-110 kWh/t).` });
      }
    }

    let score = 100.0;
    score -= errors.length * 30.0;
    score -= warnings.length * 10.0;
    score = Math.max(0.0, Math.min(100.0, score));

    return {
      is_valid: errors.length === 0,
      quality_score: score,
      quality_tier: score >= 85 ? 'HIGH_CONFIDENCE' : (score >= 60 ? 'PROVISIONAL' : 'ACTION_REQUIRED'),
      errors,
      warnings
    };
  }
}
