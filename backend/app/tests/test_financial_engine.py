import pytest
from app.engines.finance import FinanceEngine

def test_financial_engine_npv_and_payback():
    res = FinanceEngine.calculate_npv_irr(
        initial_capex_cr=85.0,
        annual_net_cash_flow_cr=20.0,
        discount_rate_pct=9.5,
        horizon_years=10
    )

    assert res["initial_capex_cr"] == 85.0
    assert res["annual_cash_flow_cr"] == 20.0
    assert res["npv_cr"] > 0
    assert res["payback_years"] == 4.25
    assert res["irr_pct"] is not None
    assert res["irr_pct"] > 15.0

def test_project_lifecycle_evaluation():
    eval_res = FinanceEngine.evaluate_project(
        capex_cr=85.0,
        annual_opex_change_cr=2.2,
        annual_energy_savings_cr=21.5,
        expected_reduction_tco2e=55000.0,
        financing_rate_pct=9.5,
        horizon_years=10
    )

    assert eval_res["annual_net_savings_cr"] > 15.0
    assert eval_res["financial_metrics"]["npv_cr"] > 0
    assert eval_res["lifecycle_abatement_tco2e"] == 550000.0
    assert eval_res["cost_per_tco2e_inr"] < 0  # Net savings exceed CAPEX over lifecycle
