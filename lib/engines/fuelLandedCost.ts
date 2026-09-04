/**
 * AANGARA Fuel Landed Cost Engine v3.0 (Engine 10)
 * ─────────────────────────────────────────────────────────
 * Computes complete delivered fuel landed cost per tonne, per GJ, and per kWh_thermal.
 *
 * Implements spec §55:
 *   Landed Cost = Base Price + Freight + GST (5%) + GST Compensation Cess (₹400/t)
 *                + Clean Energy Cess + Sizing/Crushing + Handling + Transit Loss Adjustment
 *
 * Transit Loss Formula:
 *   Net Usable Qty = Received Qty × (1 - Transit Loss Pct / 100)
 *   Effective Landed Cost = Total Invoice Payment / Net Usable Qty
 */

import { convertNCVToGJPerTonne } from './normalization';

export interface FuelCostComponents {
  base_price_inr_per_tonne: number;
  railway_freight_inr_per_tonne?: number;
  road_freight_inr_per_tonne?: number;
  gst_rate_pct?: number; // 5% for industrial coal/petcoke
  gst_compensation_cess_inr_per_tonne?: number; // ₹400/t statutory for coal
  customs_duty_inr_per_tonne?: number;          // For imported coal / petcoke
  handling_loading_inr_per_tonne?: number;
  crushing_sizing_inr_per_tonne?: number;
  transit_loss_pct?: number;                    // Typically 1.5% - 2.5% for bulk rail rakes
}

export interface FuelLandedCostResult {
  fuel_id: string;
  fuel_type: string;
  annual_quantity_tonnes: number;
  net_usable_quantity_tonnes: number;
  transit_loss_tonnes: number;
  landed_cost_inr_per_tonne: number;
  landed_cost_inr_per_gj: number;
  landed_cost_inr_per_kwh_thermal: number;
  annual_landed_expenditure_inr: number;
  annual_landed_expenditure_cr: number;
  cost_breakdown_per_tonne: {
    base_price: number;
    total_freight: number;
    taxes_and_cess: number;
    handling_and_sizing: number;
    transit_loss_cost: number;
  };
}

export class FuelLandedCostEngine {

  /**
   * Typical fuel benchmark costs in India (FY 2025-26)
   */
  static getDefaultCostComponents(fuel_type: string): FuelCostComponents {
    const f = fuel_type.toUpperCase();
    if (f.includes('IMPORT') || f.includes('SOUTH_AFRICAN') || f.includes('INDONESIAN')) {
      return {
        base_price_inr_per_tonne: 8500,
        railway_freight_inr_per_tonne: 1800,
        customs_duty_inr_per_tonne: 215,
        gst_rate_pct: 5.0,
        gst_compensation_cess_inr_per_tonne: 400,
        handling_loading_inr_per_tonne: 250,
        transit_loss_pct: 1.5,
      };
    } else if (f.includes('PETCOKE')) {
      return {
        base_price_inr_per_tonne: 13500,
        railway_freight_inr_per_tonne: 1200,
        gst_rate_pct: 18.0,
        gst_compensation_cess_inr_per_tonne: 0,
        handling_loading_inr_per_tonne: 200,
        transit_loss_pct: 1.0,
      };
    } else if (f.includes('BIOMASS') || f.includes('BAGASSE')) {
      return {
        base_price_inr_per_tonne: 3800,
        road_freight_inr_per_tonne: 800,
        gst_rate_pct: 5.0,
        gst_compensation_cess_inr_per_tonne: 0,
        handling_loading_inr_per_tonne: 200,
        transit_loss_pct: 2.0,
      };
    }

    // Default Indian Domestic Coal (CIL G11-G13 Grade)
    return {
      base_price_inr_per_tonne: 3200,
      railway_freight_inr_per_tonne: 2100, // Indian Railways telescopic tariff
      gst_rate_pct: 5.0,
      gst_compensation_cess_inr_per_tonne: 400,
      handling_loading_inr_per_tonne: 350,
      crushing_sizing_inr_per_tonne: 150,
      transit_loss_pct: 2.5,
    };
  }

  /**
   * Computes landed fuel cost chain with transit loss adjustment (§55)
   */
  static computeLandedCost(params: {
    fuel_id: string;
    fuel_type: string;
    quantity_tonnes: number;
    ncv_kcal_per_kg?: number;
    components?: Partial<FuelCostComponents>;
  }): FuelLandedCostResult {
    const { fuel_id, fuel_type, quantity_tonnes, ncv_kcal_per_kg } = params;

    const defaults = this.getDefaultCostComponents(fuel_type);
    const c: FuelCostComponents = { ...defaults, ...params.components };

    const freight = (c.railway_freight_inr_per_tonne ?? 0) + (c.road_freight_inr_per_tonne ?? 0);
    const assessable_val = c.base_price_inr_per_tonne + (c.customs_duty_inr_per_tonne ?? 0);
    const gst_amount = assessable_val * ((c.gst_rate_pct ?? 5) / 100);
    const taxes_and_cess = gst_amount + (c.gst_compensation_cess_inr_per_tonne ?? 0);
    const handling = (c.handling_loading_inr_per_tonne ?? 0) + (c.crushing_sizing_inr_per_tonne ?? 0);

    const nominal_landed_per_tonne = c.base_price_inr_per_tonne + freight + taxes_and_cess + handling;

    // Transit loss adjustment (§55.2)
    const loss_pct = c.transit_loss_pct ?? 0;
    const net_usable_qty = quantity_tonnes * (1 - loss_pct / 100);
    const transit_loss_tonnes = quantity_tonnes - net_usable_qty;

    const total_invoice_paid = nominal_landed_per_tonne * quantity_tonnes;
    const effective_landed_cost_per_tonne = net_usable_qty > 0
      ? total_invoice_paid / net_usable_qty
      : nominal_landed_per_tonne;

    const transit_loss_cost_per_tonne = effective_landed_cost_per_tonne - nominal_landed_per_tonne;

    // Energy normalization
    const ncv_gj_per_t = ncv_kcal_per_kg
      ? convertNCVToGJPerTonne(ncv_kcal_per_kg)
      : (fuel_type.includes('PETCOKE') ? 31.0 : (fuel_type.includes('IMPORT') ? 23.0 : 16.5));

    const landed_cost_inr_per_gj = Number((effective_landed_cost_per_tonne / ncv_gj_per_t).toFixed(2));
    // 1 GJ = 277.778 kWh thermal
    const landed_cost_inr_per_kwh_th = Number((landed_cost_inr_per_gj / 277.778).toFixed(3));

    return {
      fuel_id,
      fuel_type,
      annual_quantity_tonnes: quantity_tonnes,
      net_usable_quantity_tonnes: Number(net_usable_qty.toFixed(1)),
      transit_loss_tonnes: Number(transit_loss_tonnes.toFixed(1)),
      landed_cost_inr_per_tonne: Number(effective_landed_cost_per_tonne.toFixed(2)),
      landed_cost_inr_per_gj,
      landed_cost_inr_per_kwh_thermal: landed_cost_inr_per_kwh_th,
      annual_landed_expenditure_inr: Number(total_invoice_paid.toFixed(2)),
      annual_landed_expenditure_cr: Number((total_invoice_paid / 1e7).toFixed(2)),
      cost_breakdown_per_tonne: {
        base_price: c.base_price_inr_per_tonne,
        total_freight: freight,
        taxes_and_cess: Number(taxes_and_cess.toFixed(2)),
        handling_and_sizing: handling,
        transit_loss_cost: Number(transit_loss_cost_per_tonne.toFixed(2)),
      },
    };
  }
}
