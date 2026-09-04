/**
 * AANGARA Sector-Specific Business Twin Engines — v4.0
 * ─────────────────────────────────────────────────────────
 * Spec: §§17, 19, 21, 23, 25, 27, 29, 31, 152–161
 * Authority: Standard Corporate Finance / Engineering Economics (Damodaran, BEE)
 *
 * Provides specialized Industrial Business Twin economics for all 8 Indian sectors.
 * All monetary amounts are canonical in INR (spec §2.1).
 */

import {
  CementProcessInputs,
  IronSteelProcessInputs,
  AluminiumProcessInputs,
  ChlorAlkaliProcessInputs,
  PulpPaperProcessInputs,
  PetroleumRefineryProcessInputs,
  PetrochemicalsProcessInputs,
  TextileProcessInputs,
} from '@/types/facility-v2';

// ─────────────────────────────────────────────
// 1. CEMENT BUSINESS TWIN (§17)
// ─────────────────────────────────────────────
export interface CementBusinessTwinResult {
  sector: 'cement';
  annual_revenue_inr: number;
  revenue_cr: number;
  whrs_generation_mwh: number;
  whrs_avoided_electricity_cost_inr: number;
  whrs_avoided_cost_cr: number;
  raw_material_landed_cost_per_t: number;
  clinker_factor_economic_impact_cr: number;
  authority_class: 'ENGINEERING_ANALYTICAL';
  formula_id: 'CEMENT-BUSINESS-TWIN-V1';
}

export function computeCementBusinessTwin(params: {
  inputs: CementProcessInputs;
  landed_electricity_price_per_mwh: number;
}): CementBusinessTwinResult {
  const { inputs, landed_electricity_price_per_mwh } = params;
  const cement_tonnes = inputs.cement_production || 1;
  const cement_price = inputs.cement_realisation_per_t || 5200; // INR/tonne Indian average
  const revenue_inr = cement_tonnes * cement_price;

  // WHRS project economics (§17.4)
  // Annual_Gen_MWh = MW × Availability × Operating_Hours
  const mw = inputs.WHRS_capacity_MW || 0;
  const availability = (inputs.WHRS_availability_pct || 90) / 100;
  const operating_hours = (365 - (inputs.kiln_shutdown_window || 25)) * 24;
  const whrs_mwh = inputs.WHRS_generation_MWh ?? (mw * availability * operating_hours);
  const whrs_savings_inr = whrs_mwh * landed_electricity_price_per_mwh;

  // Landed cost of raw materials (Limestone, Gypsum, Fly ash, Slag)
  const limestone_cost = 450; // INR/tonne quarry + transport
  const landed_raw_mat = limestone_cost * 1.52;

  // Clinker factor reduction saving: 1% clinker reduction saves ~₹40/t cement in fuel
  const baseline_cf = 75;
  const current_cf = inputs.clinker_factor_pct || 72;
  const cf_saving_inr = Math.max(0, (baseline_cf - current_cf) * 40 * cement_tonnes);

  return {
    sector: 'cement',
    annual_revenue_inr: revenue_inr,
    revenue_cr: Number((revenue_inr / 1e7).toFixed(2)),
    whrs_generation_mwh: Number(whrs_mwh.toFixed(1)),
    whrs_avoided_electricity_cost_inr: whrs_savings_inr,
    whrs_avoided_cost_cr: Number((whrs_savings_inr / 1e7).toFixed(2)),
    raw_material_landed_cost_per_t: landed_raw_mat,
    clinker_factor_economic_impact_cr: Number((cf_saving_inr / 1e7).toFixed(2)),
    authority_class: 'ENGINEERING_ANALYTICAL',
    formula_id: 'CEMENT-BUSINESS-TWIN-V1',
  };
}

// ─────────────────────────────────────────────
// 2. IRON & STEEL BUSINESS TWIN (§19)
// ─────────────────────────────────────────────
export interface SteelBusinessTwinResult {
  sector: 'iron_steel';
  annual_revenue_inr: number;
  revenue_cr: number;
  landed_iron_ore_cost_per_t: number;
  coke_thermal_cost_inr_per_gj: number;
  product_contribution_inr: number;
  product_contribution_cr: number;
  trt_cdq_generation_value_cr: number;
  authority_class: 'ENGINEERING_ANALYTICAL';
  formula_id: 'STEEL-BUSINESS-TWIN-V1';
}

export function computeSteelBusinessTwin(params: {
  inputs: IronSteelProcessInputs;
  avoided_marginal_electricity_cost_per_mwh: number;
}): SteelBusinessTwinResult {
  const { inputs, avoided_marginal_electricity_cost_per_mwh } = params;
  const crude_steel = inputs.crude_steel_production || 1;
  const steel_price = inputs.steel_realisation_per_t || 54000; // INR/tonne Indian finished/crude
  const revenue_inr = crude_steel * steel_price;

  // Landed Iron Ore Cost (§19.1)
  const ore_cost = inputs.iron_ore_cost || 4500; // INR/t FOB + freight + handling + port
  const landed_ore = ore_cost * 1.05; // 5% transit/moisture loss

  // Coke thermal cost (§19.2): Landed_Fuel_Cost / NCV (GJ)
  const coke_price = inputs.coke_landed_cost || 28000; // INR/t
  const coke_ncv_gj = 28.5; // GJ/t
  const coke_thermal_cost_per_gj = coke_price / coke_ncv_gj;

  // TRT/CDQ project generation value (§19.4)
  const trt_gen = inputs.TRT_generation_MWh || 0;
  const cdq_gen = inputs.CDQ_generation_MWh || 0;
  const trt_cdq_val_inr = (trt_gen + cdq_gen) * avoided_marginal_electricity_cost_per_mwh;

  // Product contribution (§19.3): Revenue - Variable costs (ore, coke, power)
  const variable_cost_per_t = (landed_ore * 1.6) + (coke_price * (inputs.coke_rate || 450) / 1000) + 6000;
  const contribution_inr = Math.max(0, revenue_inr - (variable_cost_per_t * crude_steel));

  return {
    sector: 'iron_steel',
    annual_revenue_inr: revenue_inr,
    revenue_cr: Number((revenue_inr / 1e7).toFixed(2)),
    landed_iron_ore_cost_per_t: Number(landed_ore.toFixed(1)),
    coke_thermal_cost_inr_per_gj: Number(coke_thermal_cost_per_gj.toFixed(2)),
    product_contribution_inr: contribution_inr,
    product_contribution_cr: Number((contribution_inr / 1e7).toFixed(2)),
    trt_cdq_generation_value_cr: Number((trt_cdq_val_inr / 1e7).toFixed(2)),
    authority_class: 'ENGINEERING_ANALYTICAL',
    formula_id: 'STEEL-BUSINESS-TWIN-V1',
  };
}

// ─────────────────────────────────────────────
// 3. ALUMINIUM BUSINESS TWIN (§21)
// ─────────────────────────────────────────────
export interface AluminiumBusinessTwinResult {
  sector: 'aluminium';
  annual_revenue_inr: number;
  revenue_cr: number;
  delivered_power_cost_per_mwh: number;
  power_cost_per_tonne_al: number;
  power_cost_share_of_revenue_pct: number;
  authority_class: 'ENGINEERING_ANALYTICAL';
  formula_id: 'ALUMINIUM-BUSINESS-TWIN-V1';
}

export function computeAluminiumBusinessTwin(params: {
  inputs: AluminiumProcessInputs;
  annual_electricity_mwh: number;
  total_electricity_cost_inr: number;
}): AluminiumBusinessTwinResult {
  const { inputs, annual_electricity_mwh, total_electricity_cost_inr } = params;
  const al_production = inputs.primary_aluminium_production || 1;
  const al_price = inputs.aluminium_realisation_per_t || 215000; // INR/tonne (LME ~$2400 + duty)
  const revenue_inr = al_production * al_price;

  // Delivered power cost (§21.1)
  const delivered_power_cost_mwh = annual_electricity_mwh > 0
    ? total_electricity_cost_inr / annual_electricity_mwh
    : 4200; // INR/MWh default

  // Power cost per tonne Al (§21.2)
  const power_cost_per_tonne = total_electricity_cost_inr / al_production;
  const power_share_pct = (power_cost_per_tonne / al_price) * 100;

  return {
    sector: 'aluminium',
    annual_revenue_inr: revenue_inr,
    revenue_cr: Number((revenue_inr / 1e7).toFixed(2)),
    delivered_power_cost_per_mwh: Number(delivered_power_cost_mwh.toFixed(2)),
    power_cost_per_tonne_al: Number(power_cost_per_tonne.toFixed(2)),
    power_cost_share_of_revenue_pct: Number(power_share_pct.toFixed(1)),
    authority_class: 'ENGINEERING_ANALYTICAL',
    formula_id: 'ALUMINIUM-BUSINESS-TWIN-V1',
  };
}

// ─────────────────────────────────────────────
// 4. CHLOR-ALKALI BUSINESS TWIN (§23)
// ─────────────────────────────────────────────
export interface ChlorAlkaliBusinessTwinResult {
  sector: 'chlor_alkali';
  annual_revenue_inr: number;
  revenue_cr: number;
  naoh_revenue_cr: number;
  cl2_revenue_cr: number;
  h2_internal_value_cr: number;
  salt_cost_cr: number;
  authority_class: 'ENGINEERING_ANALYTICAL';
  formula_id: 'CHLORALKALI-BUSINESS-TWIN-V1';
}

export function computeChlorAlkaliBusinessTwin(params: {
  inputs: ChlorAlkaliProcessInputs;
}): ChlorAlkaliBusinessTwinResult {
  const { inputs } = params;
  const naoh_production = inputs.NaOH_production_t || 1;
  const naoh_price = inputs.caustic_soda_realisation_per_t || 36000; // INR/tonne dry basis
  const naoh_rev = naoh_production * naoh_price;

  const cl2_production = inputs.Cl2_production_t || (naoh_production * 0.8875);
  const cl2_price = inputs.chlorine_realisation_per_t || 5500;
  const cl2_rev = cl2_production * cl2_price;

  // H2 internal opportunity value (§23.2)
  const h2_production_kg = (inputs.H2_production_t || (naoh_production * 0.025)) * 1000;
  const h2_value_per_kg = inputs.hydrogen_value_per_kg || 280; // Avoided purchased hydrogen cost
  const h2_rev = h2_production_kg * h2_value_per_kg;

  // Salt cost
  const salt_t = inputs.brine_quantity_t || (naoh_production * 1.75);
  const salt_cost = salt_t * (inputs.salt_cost_per_t || 2200);

  const total_revenue_inr = naoh_rev + cl2_rev + h2_rev;

  return {
    sector: 'chlor_alkali',
    annual_revenue_inr: total_revenue_inr,
    revenue_cr: Number((total_revenue_inr / 1e7).toFixed(2)),
    naoh_revenue_cr: Number((naoh_rev / 1e7).toFixed(2)),
    cl2_revenue_cr: Number((cl2_rev / 1e7).toFixed(2)),
    h2_internal_value_cr: Number((h2_rev / 1e7).toFixed(2)),
    salt_cost_cr: Number((salt_cost / 1e7).toFixed(2)),
    authority_class: 'ENGINEERING_ANALYTICAL',
    formula_id: 'CHLORALKALI-BUSINESS-TWIN-V1',
  };
}

// ─────────────────────────────────────────────
// 5. PULP & PAPER BUSINESS TWIN (§25)
// ─────────────────────────────────────────────
export interface PulpPaperBusinessTwinResult {
  sector: 'pulp_paper';
  annual_revenue_inr: number;
  revenue_cr: number;
  fibre_landed_cost_cr: number;
  steam_cost_cr: number;
  water_processing_cost_cr: number;
  authority_class: 'ENGINEERING_ANALYTICAL';
  formula_id: 'PULPPAPER-BUSINESS-TWIN-V1';
}

export function computePulpPaperBusinessTwin(params: {
  inputs: PulpPaperProcessInputs;
}): PulpPaperBusinessTwinResult {
  const { inputs } = params;
  const paper_output = (inputs.paper_production_t || 0) +
    (inputs.paperboard_production_t || 0) +
    (inputs.pulp_production_t || 0) || 1;

  const paper_price = inputs.paper_realisation_per_t || 58000;
  const revenue_inr = paper_output * paper_price;

  // Fibre landed cost (§25.1)
  const wood_t = inputs.wood_input_t || (paper_output * 2.2);
  const wood_cost = wood_t * (inputs.wood_cost_per_t || 6500);
  const recycled_cost = (inputs.recycled_fibre_input_t || 0) * (inputs.recycled_fibre_cost_per_t || 18000);
  const fibre_cost_cr = (wood_cost + recycled_cost) / 1e7;

  // Steam cost (§25.2)
  const steam_t = (inputs.steam_generation_t || 0) + (inputs.steam_purchase_t || 0);
  const steam_cost_inr = steam_t * 1800; // INR/tonne average steam cost in India
  const steam_cost_cr = steam_cost_inr / 1e7;

  const water_cost_cr = (inputs.ETP_cost_cr || 0) + (inputs.ZLD_cost_cr || 0);

  return {
    sector: 'pulp_paper',
    annual_revenue_inr: revenue_inr,
    revenue_cr: Number((revenue_inr / 1e7).toFixed(2)),
    fibre_landed_cost_cr: Number(fibre_cost_cr.toFixed(2)),
    steam_cost_cr: Number(steam_cost_cr.toFixed(2)),
    water_processing_cost_cr: Number(water_cost_cr.toFixed(2)),
    authority_class: 'ENGINEERING_ANALYTICAL',
    formula_id: 'PULPPAPER-BUSINESS-TWIN-V1',
  };
}

// ─────────────────────────────────────────────
// 6. PETROLEUM REFINERY BUSINESS TWIN (§27)
// ─────────────────────────────────────────────
export interface RefineryBusinessTwinResult {
  sector: 'petroleum_refinery';
  crude_throughput_bbl: number;
  crude_landed_cost_inr: number;
  crude_landed_cost_cr: number;
  average_inventory_value_cr: number;
  annual_inventory_carrying_cost_cr: number;
  refinery_contribution_cr: number;
  authority_class: 'ENGINEERING_ANALYTICAL';
  formula_id: 'REFINERY-BUSINESS-TWIN-V1';
}

export function computeRefineryBusinessTwin(params: {
  inputs: PetroleumRefineryProcessInputs;
  usd_inr_fx_rate?: number;
}): RefineryBusinessTwinResult {
  const { inputs, usd_inr_fx_rate = 83.6 } = params;
  const crude_tonnes = inputs.crude_throughput_t || 1;
  const barrels = crude_tonnes * 7.33; // ~7.33 bbl per tonne crude

  // Crude landed cost (§27.1)
  const crude_fob_usd_per_bbl = inputs.crude_price_per_bbl || 80.0;
  const freight_insurance_usd = 3.5; // Ocean freight + insurance + port
  const total_crude_usd_per_bbl = crude_fob_usd_per_bbl + freight_insurance_usd;
  const landed_crude_inr_per_bbl = total_crude_usd_per_bbl * usd_inr_fx_rate;
  const total_crude_cost_inr = barrels * landed_crude_inr_per_bbl;

  // Inventory carrying cost (§27.2)
  // Typically 15 days crude + 10 days products = 25 days inventory
  const inventory_days = 25;
  const average_inventory_value_inr = (total_crude_cost_inr / 365) * inventory_days;
  const inventory_carrying_rate = 0.10; // 10% p.a. (working capital interest + storage + insurance)
  const annual_carrying_cost_inr = average_inventory_value_inr * inventory_carrying_rate;

  // Gross Refining Margin / Contribution (§27.3)
  // Typical Indian complex refinery GRM: ~$8 to $12 / bbl
  const grm_usd_per_bbl = 9.5;
  const contribution_inr = barrels * (grm_usd_per_bbl * usd_inr_fx_rate);

  return {
    sector: 'petroleum_refinery',
    crude_throughput_bbl: Number(barrels.toFixed(0)),
    crude_landed_cost_inr: total_crude_cost_inr,
    crude_landed_cost_cr: Number((total_crude_cost_inr / 1e7).toFixed(2)),
    average_inventory_value_cr: Number((average_inventory_value_inr / 1e7).toFixed(2)),
    annual_inventory_carrying_cost_cr: Number((annual_carrying_cost_inr / 1e7).toFixed(2)),
    refinery_contribution_cr: Number((contribution_inr / 1e7).toFixed(2)),
    authority_class: 'ENGINEERING_ANALYTICAL',
    formula_id: 'REFINERY-BUSINESS-TWIN-V1',
  };
}

// ─────────────────────────────────────────────
// 7. PETROCHEMICALS BUSINESS TWIN (§29)
// ─────────────────────────────────────────────
export interface PetrochemicalsBusinessTwinResult {
  sector: 'petrochemicals';
  feedstock_cost_cr: number;
  cracker_product_revenue_cr: number;
  gross_margin_cr: number;
  authority_class: 'ENGINEERING_ANALYTICAL';
  formula_id: 'PETROCHEM-BUSINESS-TWIN-V1';
}

export function computePetrochemicalsBusinessTwin(params: {
  inputs: PetrochemicalsProcessInputs;
}): PetrochemicalsBusinessTwinResult {
  const { inputs } = params;
  const throughput = inputs.cracker_throughput_t || (
    (inputs.naphtha_quantity_t || 0) +
    (inputs.ethane_quantity_t || 0) +
    (inputs.propane_quantity_t || 0)
  ) || 1;

  // Feedstock landed cost (§29.1)
  const naphtha_price = inputs.naphtha_price_per_t || 58000;
  const feed_cost_inr = throughput * naphtha_price;

  // Cracker product revenue (§29.3)
  const ethylene_rev = (inputs.ethylene_output_t || 0) * (inputs.ethylene_price_per_t || 78000);
  const propylene_rev = (inputs.propylene_output_t || 0) * (inputs.propylene_price_per_t || 72000);
  const polymer_rev = (inputs.polymer_output_t || 0) * (inputs.polymer_price_per_t || 94000);
  const total_revenue_inr = ethylene_rev + propylene_rev + polymer_rev;

  const gross_margin_inr = total_revenue_inr - feed_cost_inr;

  return {
    sector: 'petrochemicals',
    feedstock_cost_cr: Number((feed_cost_inr / 1e7).toFixed(2)),
    cracker_product_revenue_cr: Number((total_revenue_inr / 1e7).toFixed(2)),
    gross_margin_cr: Number((gross_margin_inr / 1e7).toFixed(2)),
    authority_class: 'ENGINEERING_ANALYTICAL',
    formula_id: 'PETROCHEM-BUSINESS-TWIN-V1',
  };
}

// ─────────────────────────────────────────────
// 8. TEXTILE BUSINESS TWIN (§31)
// ─────────────────────────────────────────────
export interface TextileBusinessTwinResult {
  sector: 'textile';
  annual_revenue_cr: number;
  fibre_cost_cr: number;
  chemical_cost_cr: number;
  water_system_cost_cr: number;
  contribution_margin_cr: number;
  authority_class: 'ENGINEERING_ANALYTICAL';
  formula_id: 'TEXTILE-BUSINESS-TWIN-V1';
}

export function computeTextileBusinessTwin(params: {
  inputs: TextileProcessInputs;
  production_tonnes: number;
}): TextileBusinessTwinResult {
  const { inputs, production_tonnes } = params;
  const output = production_tonnes || 1;
  const price = inputs.product_realisation_per_t || 280000;
  const revenue_inr = output * price;

  // Fibre cost (§31.1)
  const cotton_cost = output * ((inputs.cotton_pct || 70) / 100) * (inputs.cotton_cost_per_t || 165000);
  const poly_cost = output * ((inputs.polyester_pct || 30) / 100) * (inputs.polyester_cost_per_t || 105000);
  const total_fibre_cr = (cotton_cost + poly_cost) / 1e7;

  // Chemical cost (§31.2)
  const chem_cost = output * 0.15 * (inputs.dye_chemical_cost_per_t || 120000);
  const chem_cost_cr = chem_cost / 1e7;

  // Water system cost (§31.3)
  const water_cr = (inputs.ETP_cost_cr || 0) + (inputs.ZLD_cost_cr || 0) + (
    ((inputs.water_consumption_m3 || 0) * (inputs.water_cost_per_m3 || 45)) / 1e7
  );

  const total_var_cr = total_fibre_cr + chem_cost_cr + water_cr;
  const revenue_cr = revenue_inr / 1e7;
  const contribution_cr = Math.max(0, revenue_cr - total_var_cr);

  return {
    sector: 'textile',
    annual_revenue_cr: Number(revenue_cr.toFixed(2)),
    fibre_cost_cr: Number(total_fibre_cr.toFixed(2)),
    chemical_cost_cr: Number(chem_cost_cr.toFixed(2)),
    water_system_cost_cr: Number(water_cr.toFixed(2)),
    contribution_margin_cr: Number(contribution_cr.toFixed(2)),
    authority_class: 'ENGINEERING_ANALYTICAL',
    formula_id: 'TEXTILE-BUSINESS-TWIN-V1',
  };
}
