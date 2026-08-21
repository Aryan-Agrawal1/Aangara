export class FinanceEngine {
  static evaluateProject(
    capex_cr: number,
    annual_opex_change_cr: number,
    annual_energy_savings_cr: number,
    expected_reduction_tco2e: number,
    financing_rate_pct = 9.5,
    project_lifetime_years = 10
  ) {
    const net_annual_cashflow_cr = annual_energy_savings_cr - annual_opex_change_cr;
    const r = financing_rate_pct / 100.0;

    let npv_cr = -capex_cr;
    for (let yr = 1; yr <= project_lifetime_years; yr++) {
      npv_cr += net_annual_cashflow_cr / Math.pow(1.0 + r, yr);
    }

    const simple_payback_years = net_annual_cashflow_cr > 0 ? capex_cr / net_annual_cashflow_cr : 99.0;
    const total_abatement_10yr_tco2e = expected_reduction_tco2e * project_lifetime_years;
    const total_net_cost_cr = capex_cr + (annual_opex_change_cr - annual_energy_savings_cr) * project_lifetime_years;
    const mac_inr_per_tco2e = total_abatement_10yr_tco2e > 0 ? (total_net_cost_cr * 1e7) / total_abatement_10yr_tco2e : 0.0;

    return {
      net_annual_savings_cr: Number(net_annual_cashflow_cr.toFixed(2)),
      npv_cr: Number(npv_cr.toFixed(2)),
      simple_payback_years: Number(simple_payback_years.toFixed(1)),
      mac_inr_per_tco2e: Number(mac_inr_per_tco2e.toFixed(1)),
      total_abatement_10yr_tco2e: Number(total_abatement_10yr_tco2e.toFixed(0)),
      is_economically_viable: npv_cr > 0
    };
  }
}
