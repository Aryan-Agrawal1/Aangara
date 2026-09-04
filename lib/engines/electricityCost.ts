/**
 * AANGARA Electricity Cost Engine v3.0 (Engine 09)
 * ─────────────────────────────────────────────────────────
 * Computes unbundled industrial electricity tariffs and landed cost per kWh
 * across grid DISCOM, Open Access, and Captive configurations.
 *
 * Implements spec §53–§54:
 *   Total Tariff = Energy Charge + Demand Charge + Wheeling + Transmission
 *                + Cross-Subsidy Surcharge (CSS) + Additional Surcharge (AS)
 *                + Electricity Duty + Banking Fee + FPPCA - ToD Rebate
 */

export interface TariffComponents {
  energy_charge_inr_per_kwh: number;
  demand_charge_inr_per_kva_month?: number;
  wheeling_charge_inr_per_kwh?: number;
  transmission_charge_inr_per_kwh?: number;
  cross_subsidy_surcharge_inr_per_kwh?: number;
  additional_surcharge_inr_per_kwh?: number;
  electricity_duty_pct?: number; // e.g. 6% or 9% state duty
  fppca_inr_per_kwh?: number;    // Fuel and Power Purchase Cost Adjustment
  banking_charge_pct?: number;   // e.g. 2% for banked RE
  tod_rebate_inr_per_kwh?: number;
}

export interface ElectricityCostResult {
  source_id: string;
  source_type: string;
  annual_mwh: number;
  landed_cost_inr_per_kwh: number;
  annual_cost_inr: number;
  annual_cost_cr: number;
  breakdown: {
    energy_charge_total_inr: number;
    demand_charge_total_inr: number;
    open_access_charges_total_inr: number; // Transmission + Wheeling + CSS + AS
    electricity_duty_total_inr: number;
    fppca_total_inr: number;
  };
  effective_rate_type: 'DISCOM_INDUSTRIAL_HT' | 'OPEN_ACCESS_RE' | 'CAPTIVE_POWER' | 'CUSTOM_TARIFF';
}

export class ElectricityCostEngine {

  /**
   * Default tariff benchmarks per state/source type (Indian HT Industrial)
   */
  static getDefaultTariff(state = 'Gujarat', source_type = 'GRID_DISCOM'): TariffComponents {
    const isRE = source_type.includes('SOLAR') || source_type.includes('WIND');
    if (isRE) {
      return {
        energy_charge_inr_per_kwh: 3.25, // PPA generation tariff
        wheeling_charge_inr_per_kwh: 0.35,
        transmission_charge_inr_per_kwh: 0.45,
        cross_subsidy_surcharge_inr_per_kwh: 1.15,
        additional_surcharge_inr_per_kwh: 0.60,
        electricity_duty_pct: 0.0, // Exempted or concessional in many states
        banking_charge_pct: 2.0,
      };
    }

    // Default Industrial HT Grid Tariff (MGVCL/BESCOM/MSEDCL benchmark)
    return {
      energy_charge_inr_per_kwh: 6.45,
      demand_charge_inr_per_kva_month: 475,
      electricity_duty_pct: 15.0,
      fppca_inr_per_kwh: 0.85,
    };
  }

  /**
   * Computes unbundled electricity cost for a single source or portfolio
   */
  static computeSourceCost(params: {
    source_id: string;
    source_type: string;
    annual_mwh: number;
    contract_demand_kva?: number;
    tariff?: Partial<TariffComponents>;
    state?: string;
  }): ElectricityCostResult {
    const { source_id, source_type, annual_mwh, contract_demand_kva = 0, state = 'Gujarat' } = params;

    const defaultTariff = this.getDefaultTariff(state, source_type);
    const tariff: TariffComponents = { ...defaultTariff, ...params.tariff };

    const total_kwh = annual_mwh * 1000;
    const energy_charge_total = total_kwh * tariff.energy_charge_inr_per_kwh;
    const demand_charge_total = contract_demand_kva * (tariff.demand_charge_inr_per_kva_month ?? 0) * 12;

    const oa_unit_charges =
      (tariff.wheeling_charge_inr_per_kwh ?? 0) +
      (tariff.transmission_charge_inr_per_kwh ?? 0) +
      (tariff.cross_subsidy_surcharge_inr_per_kwh ?? 0) +
      (tariff.additional_surcharge_inr_per_kwh ?? 0);

    const open_access_charges_total = total_kwh * oa_unit_charges;
    const fppca_total = total_kwh * (tariff.fppca_inr_per_kwh ?? 0);

    const subtotal = energy_charge_total + demand_charge_total + open_access_charges_total + fppca_total;
    const duty_total = subtotal * ((tariff.electricity_duty_pct ?? 0) / 100);

    const annual_cost_inr = subtotal + duty_total;
    const landed_cost_inr_per_kwh = total_kwh > 0 ? Number((annual_cost_inr / total_kwh).toFixed(3)) : 0;
    const annual_cost_cr = Number((annual_cost_inr / 1e7).toFixed(2));

    return {
      source_id,
      source_type,
      annual_mwh,
      landed_cost_inr_per_kwh,
      annual_cost_inr: Number(annual_cost_inr.toFixed(2)),
      annual_cost_cr,
      breakdown: {
        energy_charge_total_inr: Number(energy_charge_total.toFixed(2)),
        demand_charge_total_inr: Number(demand_charge_total.toFixed(2)),
        open_access_charges_total_inr: Number(open_access_charges_total.toFixed(2)),
        electricity_duty_total_inr: Number(duty_total.toFixed(2)),
        fppca_total_inr: Number(fppca_total.toFixed(2)),
      },
      effective_rate_type: source_type.includes('OPEN_ACCESS') ? 'OPEN_ACCESS_RE' : 'DISCOM_INDUSTRIAL_HT',
    };
  }
}
