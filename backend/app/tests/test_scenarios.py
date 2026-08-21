import pytest
from app.engines.scenarios import ScenarioEngine

def test_scenario_sensitivity_high_ccc_price():
    sens = ScenarioEngine.run_sensitivity(
        entity_output=1000000.0,
        baseline_emissions_tco2e=745000.0,
        actual_gei=0.7450,
        target_gei=0.7200,
        project_capex_cr=85.0,
        project_opex_change_cr=2.2,
        project_energy_savings_cr=21.5,
        project_reduction_tco2e=55000.0,
        ccc_price_inr=2500.0, # High price shock
        project_output_pct=100.0,
        project_delay_months=0,
        financing_rate_pct=9.5
    )

    assert "strategies" in sens
    assert sens["delta_vs_base"]["buy_cost_delta_cr"] > 0
    assert any("High CCC price" in insight for insight in sens["sensitivity_insights"])
