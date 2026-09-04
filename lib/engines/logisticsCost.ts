/**
 * AANGARA Logistics Cost & Transport Carbon Engine — v4.0
 * ─────────────────────────────────────────────────────────
 * ENGINE 11 — Per spec §§56, 57, 158
 * Authority: Indian Railways Freight Tariff / MoRTH / GHG Protocol Scope 3
 *
 * Core Formulas:
 * 1. Contract freight: Tonnage × Contract_Freight_Rate (§56.1)
 * 2. Tonne-km freight: Tonnage × Distance_km × Freight_Rate_per_tkm (§56.2)
 * 3. Multi-leg route: Σ_leg(Tonnage_leg × Distance_leg × Rate_leg) + Terminal_Costs (§56.3)
 * 4. Transport emissions:
 *    - Fuel-based: Fuel_Consumed × EF_fuel
 *    - Distance-based: Mass × Distance × Mode_EF (ROAD, RAIL, SEA, PIPELINE)
 */

export type TransportMode = 'ROAD' | 'RAIL' | 'SEA' | 'PIPELINE' | 'INLAND_WATERWAYS';

export interface TransportLeg {
  leg_id: string;
  mode: TransportMode;
  tonnage: number;
  distance_km: number;
  rate_per_tonne_km?: number;      // INR / t-km
  contract_rate_per_tonne?: number; // Flat INR/tonne for this leg
  terminal_handling_cost?: number;  // Loading/unloading/demurrage INR
  fuel_consumed_litres?: number;
}

export interface LogisticsCalculationResult {
  total_transport_cost_inr: number;
  total_transport_cost_cr: number;
  cost_per_tonne_delivered: number;
  total_tonne_km: number;
  transport_emissions_tco2e: number;
  leg_breakdown: Array<{
    leg_id: string;
    mode: TransportMode;
    tonnage: number;
    distance_km: number;
    freight_cost_inr: number;
    terminal_cost_inr: number;
    total_cost_inr: number;
    emissions_tco2e: number;
  }>;
  formula_id: string;
  authority_class: 'ENGINEERING_ANALYTICAL';
}

/**
 * Standard Indian freight rates (approximate indicative market tariffs)
 * Road: ~₹2.8 to ₹3.5 / t-km
 * Rail (Indian Railways Class 140/150): ~₹1.4 to ₹1.8 / t-km
 * Sea (Coastal shipping): ~₹0.6 to ₹0.9 / t-km
 * Pipeline (Crude / Gas): ~₹0.3 to ₹0.5 / t-km
 */
export const DEFAULT_FREIGHT_RATES_INR_PER_TKM: Record<TransportMode, number> = {
  ROAD: 3.2,
  RAIL: 1.6,
  SEA: 0.75,
  PIPELINE: 0.40,
  INLAND_WATERWAYS: 0.90,
};

/**
 * Emission factors for freight transport (tCO2e per tonne-km)
 * Source: GHG Protocol / India GHG Program Transport Tool
 */
export const TRANSPORT_EMISSION_FACTORS_TCO2_PER_TKM: Record<TransportMode, number> = {
  ROAD: 0.000096,        // ~96 g CO2e / t-km (Heavy duty diesel truck)
  RAIL: 0.000028,        // ~28 g CO2e / t-km (Electric freight / IR average)
  SEA: 0.000015,         // ~15 g CO2e / t-km (Coastal bulk carrier)
  PIPELINE: 0.000008,    // ~8 g CO2e / t-km (Pumping power grid carbon)
  INLAND_WATERWAYS: 0.000032,
};

export class LogisticsCostEngine {
  /**
   * Compute multi-leg logistics cost and emissions per spec §56.3 & §57
   */
  static calculateLogistics(legs: TransportLeg[]): LogisticsCalculationResult {
    let total_cost = 0;
    let total_tonnage_delivered = 0;
    let total_tonne_km = 0;
    let total_emissions = 0;

    const breakdown = legs.map((leg) => {
      const rate_per_tkm = leg.rate_per_tonne_km ?? DEFAULT_FREIGHT_RATES_INR_PER_TKM[leg.mode];
      const terminal = leg.terminal_handling_cost || 0;

      // Freight cost calculation: use flat contract rate if supplied, else distance × rate
      let freight_cost = 0;
      if (leg.contract_rate_per_tonne != null) {
        freight_cost = leg.tonnage * leg.contract_rate_per_tonne;
      } else {
        freight_cost = leg.tonnage * leg.distance_km * rate_per_tkm;
      }

      const leg_total_cost = freight_cost + terminal;
      const leg_tkm = leg.tonnage * leg.distance_km;

      // Transport emissions (§57)
      let leg_emissions = 0;
      if (leg.fuel_consumed_litres != null) {
        // Fuel-based: diesel ~2.68 kg CO2/litre
        leg_emissions = (leg.fuel_consumed_litres * 2.68) / 1000;
      } else {
        // Distance-based
        const ef_tkm = TRANSPORT_EMISSION_FACTORS_TCO2_PER_TKM[leg.mode] || 0.000096;
        leg_emissions = leg_tkm * ef_tkm;
      }

      total_cost += leg_total_cost;
      total_tonne_km += leg_tkm;
      total_emissions += leg_emissions;
      total_tonnage_delivered = Math.max(total_tonnage_delivered, leg.tonnage);

      return {
        leg_id: leg.leg_id,
        mode: leg.mode,
        tonnage: leg.tonnage,
        distance_km: leg.distance_km,
        freight_cost_inr: Number(freight_cost.toFixed(2)),
        terminal_cost_inr: Number(terminal.toFixed(2)),
        total_cost_inr: Number(leg_total_cost.toFixed(2)),
        emissions_tco2e: Number(leg_emissions.toFixed(3)),
      };
    });

    const cost_per_t = total_tonnage_delivered > 0 ? total_cost / total_tonnage_delivered : 0;

    return {
      total_transport_cost_inr: Number(total_cost.toFixed(2)),
      total_transport_cost_cr: Number((total_cost / 1e7).toFixed(3)),
      cost_per_tonne_delivered: Number(cost_per_t.toFixed(2)),
      total_tonne_km: Number(total_tonne_km.toFixed(1)),
      transport_emissions_tco2e: Number(total_emissions.toFixed(2)),
      leg_breakdown: breakdown,
      formula_id: 'LOGISTICS-MULTI-LEG-V1',
      authority_class: 'ENGINEERING_ANALYTICAL',
    };
  }
}
