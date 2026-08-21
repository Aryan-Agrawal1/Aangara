import pytest
from app.api.endpoints_sectors import list_sectors, get_sector
from app.api.endpoints_entities import list_entities, get_entity
from app.api.endpoints_calculation import calculate_carbon_position, compare_strategies, explain_decision
from app.api.endpoints_scenarios import run_scenario
from app.api.endpoints_sources import list_sources, list_methodologies, list_targets
from app.schemas.calculation import CarbonCalculationRequest
from app.schemas.scenarios import ScenarioSimulationRequest, ScenarioParameters, AIExplanationRequest

def test_sectors_endpoints():
    res = list_sectors()
    assert res["success"] is True
    assert res["data"]["total_sectors"] >= 7

    cement_res = get_sector("cement")
    assert cement_res["success"] is True
    assert cement_res["data"]["name"] == "Cement"

def test_entities_endpoints():
    res = list_entities(sector=None)
    assert res["success"] is True
    assert res["data"]["total_entities"] >= 20

    ent_res = get_entity("SYN-CEM-001")
    assert ent_res["success"] is True
    assert ent_res["data"]["sector"] == "cement"

def test_carbon_position_calculation_endpoint():
    req = CarbonCalculationRequest(
        entity_id="SYN-CEM-001",
        reporting_year="2025-26"
    )
    res = calculate_carbon_position(req)
    assert res["success"] is True
    assert res["data"]["actual_gei"] == 0.7450
    assert res["data"]["potential_shortfall_tco2e"] == 25000.0

def test_decision_twin_strategies_endpoint():
    req = CarbonCalculationRequest(
        entity_id="SYN-CEM-001",
        reporting_year="2025-26"
    )
    res = compare_strategies(req)
    assert res["success"] is True
    assert "strategies" in res["data"]
    assert "BUY" in res["data"]["strategies"]
    assert "BUILD" in res["data"]["strategies"]
    assert "HYBRID" in res["data"]["strategies"]
    assert "recommended_strategy" in res["data"]

def test_scenarios_run_endpoint():
    req = ScenarioSimulationRequest(
        entity_id="SYN-CEM-001",
        reporting_year="2025-26",
        parameters=ScenarioParameters(
            ccc_price_inr=1800.0,
            project_output_pct=90.0,
            project_delay_months=3,
            financing_rate_pct=10.5
        )
    )
    res = run_scenario(req)
    assert res["success"] is True
    assert res["data"]["parameters"]["ccc_price_inr"] == 1800.0

def test_sources_and_methodologies_endpoints():
    sources_res = list_sources()
    assert sources_res["success"] is True
    assert sources_res["data"]["total_sources"] >= 5

    methods_res = list_methodologies()
    assert methods_res["success"] is True
    assert methods_res["data"]["total_methodologies"] == 12

    targets_res = list_targets()
    assert targets_res["success"] is True
    assert targets_res["data"]["total_targets"] >= 7
