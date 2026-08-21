import pytest
from app.engines.carbon import CarbonEngine

def test_carbon_engine_core_anchor_case():
    # Prompt specification: Output = 1,000,000 t, Total emissions = 700,000 tCO2e, Target GEI = 0.72 tCO2e/t
    pos = CarbonEngine.calculate_position(
        entity_id="SYN-CEM-ANCHOR",
        reporting_year="2025-26",
        output=1000000.0,
        output_unit="tonnes",
        total_emissions_tco2e=700000.0,
        target_gei=0.72
    )

    assert pos.actual_gei == 0.7000
    assert pos.gei_delta == -0.0200
    assert pos.potential_surplus_tco2e == 20000.0
    assert pos.potential_shortfall_tco2e == 0.0
    assert pos.status == "POTENTIAL_SURPLUS"
    assert len(pos.calculation_trace) == 3

def test_carbon_engine_shortfall_case():
    pos = CarbonEngine.calculate_position(
        entity_id="SYN-CEM-001",
        reporting_year="2025-26",
        output=1000000.0,
        output_unit="tonnes",
        total_emissions_tco2e=745000.0,
        target_gei=0.72
    )

    assert pos.actual_gei == 0.7450
    assert pos.gei_delta == 0.0250
    assert pos.potential_shortfall_tco2e == 25000.0
    assert pos.potential_surplus_tco2e == 0.0
    assert pos.status == "POTENTIAL_SHORTFALL"

def test_carbon_engine_validation_errors():
    with pytest.raises(ValueError):
        CarbonEngine.calculate_position("E1", "2025-26", output=0, output_unit="t", total_emissions_tco2e=100, target_gei=0.5)
    with pytest.raises(ValueError):
        CarbonEngine.calculate_position("E1", "2025-26", output=100, output_unit="t", total_emissions_tco2e=-10, target_gei=0.5)
