export interface CalculationTrace {
  metric: string;
  formula: string;
  inputs: Record<string, any>;
  result: number;
  data_status: string;
  model_version: string;
}

export interface CarbonPosition {
  entity_id: string;
  reporting_year: string;
  output: number;
  output_unit: string;
  total_ghg_tco2e: number;
  actual_gei: number;
  target_gei: number;
  gei_delta: number;
  status: 'POTENTIAL_SURPLUS' | 'POTENTIAL_SHORTFALL';
  potential_surplus_tco2e: number;
  potential_shortfall_tco2e: number;
  calculation_trace: CalculationTrace[];
  data_status: string;
}

export class CarbonEngine {
  static calculatePosition(
    entity_id: string,
    reporting_year: string,
    output: number,
    output_unit: string,
    total_emissions_tco2e: number,
    target_gei: number,
    model_version = 'CA-MVP-1.0'
  ): CarbonPosition {
    if (output <= 0) output = 1.0;
    if (total_emissions_tco2e < 0) total_emissions_tco2e = 0.0;
    if (target_gei <= 0) target_gei = 0.72;

    const actual_gei = Number((total_emissions_tco2e / output).toFixed(4));
    const gei_delta = Number((actual_gei - target_gei).toFixed(4));

    const potential_surplus = Number((Math.max(0.0, target_gei - actual_gei) * output).toFixed(2));
    const potential_shortfall = Number((Math.max(0.0, actual_gei - target_gei) * output).toFixed(2));
    const status = gei_delta <= 0 ? 'POTENTIAL_SURPLUS' : 'POTENTIAL_SHORTFALL';

    const traces: CalculationTrace[] = [
      {
        metric: 'actual_gei',
        formula: 'total_ghg_tco2e / output',
        inputs: { total_ghg_tco2e: total_emissions_tco2e, output },
        result: actual_gei,
        data_status: 'CALCULATION',
        model_version
      },
      {
        metric: 'gei_delta',
        formula: 'actual_gei - target_gei',
        inputs: { actual_gei, target_gei },
        result: gei_delta,
        data_status: 'CALCULATION',
        model_version
      },
      {
        metric: gei_delta > 0 ? 'potential_shortfall_tco2e' : 'potential_surplus_tco2e',
        formula: gei_delta > 0 ? 'max(0, actual_gei - target_gei) * output' : 'max(0, target_gei - actual_gei) * output',
        inputs: { actual_gei, target_gei, output },
        result: gei_delta > 0 ? potential_shortfall : potential_surplus,
        data_status: 'CALCULATION',
        model_version
      }
    ];

    return {
      entity_id,
      reporting_year,
      output,
      output_unit,
      total_ghg_tco2e: total_emissions_tco2e,
      actual_gei,
      target_gei,
      gei_delta,
      status,
      potential_surplus_tco2e: potential_surplus,
      potential_shortfall_tco2e: potential_shortfall,
      calculation_trace: traces,
      data_status: 'CALCULATION'
    };
  }
}
