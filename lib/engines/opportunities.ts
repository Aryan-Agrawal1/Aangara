export interface Opportunity {
  id: string;
  title: string;
  category: string;
  capex_cr: number;
  annual_opex_change_cr: number;
  annual_energy_savings_cr: number;
  annual_reduction_tco2e: number;
  payback_years: number;
  npv_10yr_cr: number;
  cost_per_tco2e: number;
  bee_methodology_code: string;
  timeline_months: number;
  feasibility_tier: string;
  technology_readiness: string;
  description: string;
}

export class OpportunityEngine {
  static identifyOpportunities(params: {
    sector: string;
    annual_production: number;
    current_emissions_tco2e: number;
    actual_gei: number;
    electricity_mwh: number;
    renewable_pct: number;
    whrs_mw: number;
  }): Opportunity[] {
    const { sector, annual_production, current_emissions_tco2e, electricity_mwh, renewable_pct, whrs_mw } = params;
    const sec = sector.toLowerCase();

    const opps: Opportunity[] = [];

    // 1. WHRS
    if (['cement', 'iron_steel', 'refinery'].includes(sec) && whrs_mw < 10) {
      const pot_mw = sec === 'cement' ? Math.max(5.0, (annual_production / 1e6) * 8.0) : 15.0;
      const capex = pot_mw * 8.5;
      const gen_mwh = pot_mw * 7500;
      const savings = (gen_mwh * 6500) / 1e7;
      const red = gen_mwh * 0.716;
      const npv = savings * 6.5 - capex;
      opps.push({
        id: 'OPP-WHRS-01',
        title: `Waste Heat Recovery System (${pot_mw.toFixed(1)} MW)`,
        category: 'ENERGY_EFFICIENCY',
        capex_cr: Number(capex.toFixed(1)),
        annual_opex_change_cr: Number((capex * 0.03).toFixed(2)),
        annual_energy_savings_cr: Number(savings.toFixed(2)),
        annual_reduction_tco2e: Number(red.toFixed(0)),
        payback_years: Number((capex / savings).toFixed(1)),
        npv_10yr_cr: Number(npv.toFixed(1)),
        cost_per_tco2e: Number(((capex * 1e7) / (red * 10)).toFixed(0)),
        bee_methodology_code: 'BEE-CCTS-M-01-EE',
        timeline_months: 18,
        feasibility_tier: 'HIGH',
        technology_readiness: 'TRL-9 Commercial',
        description: 'Captures pre-heater and cooler exhaust gas to generate captive power, displacing grid electricity.'
      });
    }

    // 2. Renewable PPA / Captive Solar-Wind
    if (renewable_pct < 50) {
      const target_ren_pct = 50.0;
      const add_pct = target_ren_pct - renewable_pct;
      const add_mwh = electricity_mwh * (add_pct / 100.0);
      const solar_mw = Math.max(1.0, add_mwh / 1750.0);
      const capex = solar_mw * 3.8;
      // Tariff savings: ₹3.60/kWh differential over industrial grid tariff (1 MWh = 1000 kWh, 1 Cr = 1e7 INR)
      const savings = (add_mwh * 1000 * 3.60) / 1e7;
      const opex = capex * 0.015;
      const net_annual_savings = Math.max(0.5, savings - opex);
      const red = add_mwh * 0.716;
      const npv = net_annual_savings * 6.5 - capex;
      const payback = capex / net_annual_savings;
      opps.push({
        id: 'OPP-RE-02',
        title: `Group Captive Solar-Wind Hybrid (${solar_mw.toFixed(1)} MWp)`,
        category: 'FUEL_SWITCHING',
        capex_cr: Number(capex.toFixed(1)),
        annual_opex_change_cr: Number(opex.toFixed(2)),
        annual_energy_savings_cr: Number(savings.toFixed(2)),
        annual_reduction_tco2e: Number(red.toFixed(0)),
        payback_years: Number(payback.toFixed(1)),
        npv_10yr_cr: Number(npv.toFixed(1)),
        cost_per_tco2e: Number(((capex * 1e7) / (red * 10)).toFixed(0)),
        bee_methodology_code: 'BEE-CCTS-M-02-RE',
        timeline_months: 12,
        feasibility_tier: 'VERY_HIGH',
        technology_readiness: 'TRL-9 Commercial',
        description: 'Open access green tariff and hybrid group captive RE sourcing to achieve Scope 2 decarbonisation.'
      });
    }


    // 3. Sector Specific Process Upgrade
    if (sec === 'cement') {
      const red = annual_production * 0.08 * 0.525;
      opps.push({
        id: 'OPP-CEM-LC3',
        title: 'Low-Clinker LC3 / Composite Cement Transition',
        category: 'PROCESS_UPGRADE',
        capex_cr: 18.5,
        annual_opex_change_cr: -4.2,
        annual_energy_savings_cr: 8.5,
        annual_reduction_tco2e: Number(red.toFixed(0)),
        payback_years: 1.5,
        npv_10yr_cr: 64.2,
        cost_per_tco2e: 420.0,
        bee_methodology_code: 'BEE-CCTS-M-04-PROCESS',
        timeline_months: 9,
        feasibility_tier: 'HIGH',
        technology_readiness: 'TRL-8 Scaled',
        description: 'Blended limestone calcined clay formulation reducing clinker factor from 74% to 58%.'
      });
    } else if (sec === 'iron_steel') {
      opps.push({
        id: 'OPP-STL-DRI',
        title: 'Top Gas Recovery Turbine & Coal Moisture Control',
        category: 'PROCESS_UPGRADE',
        capex_cr: 42.0,
        annual_opex_change_cr: 1.2,
        annual_energy_savings_cr: 14.8,
        annual_reduction_tco2e: 38000,
        payback_years: 3.1,
        npv_10yr_cr: 58.4,
        cost_per_tco2e: 1100.0,
        bee_methodology_code: 'BEE-CCTS-M-03-STEEL',
        timeline_months: 24,
        feasibility_tier: 'MODERATE',
        technology_readiness: 'TRL-9 Commercial',
        description: 'Installation of TRT on Blast Furnace top gas to recover kinetic and pressure energy.'
      });
    } else {
      opps.push({
        id: 'OPP-GEN-VFD',
        title: 'VFD Retrofits & Premium Efficiency IE4 Motor Drives',
        category: 'ENERGY_EFFICIENCY',
        capex_cr: 8.5,
        annual_opex_change_cr: 0.2,
        annual_energy_savings_cr: 3.8,
        annual_reduction_tco2e: 4100,
        payback_years: 2.3,
        npv_10yr_cr: 16.5,
        cost_per_tco2e: 2070.0,
        bee_methodology_code: 'BEE-CCTS-M-01-EE',
        timeline_months: 6,
        feasibility_tier: 'VERY_HIGH',
        technology_readiness: 'TRL-9 Commercial',
        description: 'Replacement of standard motors with IE4 Super Premium Efficiency motors with intelligent VFD controls.'
      });
    }

    return opps;
  }
}
