import pytest
from app.engines.optimizer import CapitalOptimizer

def test_optimizer_ranks_hybrid_and_exposes_scores():
    res = CapitalOptimizer.compare_strategies(
        entity_output=1000000.0,
        baseline_emissions_tco2e=745000.0,
        actual_gei=0.7450,
        target_gei=0.7200,
        project_capex_cr=85.0,
        project_opex_change_cr=2.2,
        project_energy_savings_cr=21.5,
        project_reduction_tco2e=55000.0,
        ccc_price_inr=1000.0,
        mrv_score=85.0
    )

    assert "BUY" in res["strategies"]
    assert "BUILD" in res["strategies"]
    assert "HYBRID" in res["strategies"]
    
    # Check ranks 1, 2, 3 assigned
    ranks = [s["rank"] for s in res["strategies"].values()]
    assert set(ranks) == {1, 2, 3}
    
    # Check subscores structure
    for s in res["strategies"].values():
        assert "financial" in s["sub_scores"]
        assert "climate" in s["sub_scores"]
        assert "compliance" in s["sub_scores"]
        assert "mrv" in s["sub_scores"]
        assert "timing" in s["sub_scores"]
        assert s["utility_score"] > 0
