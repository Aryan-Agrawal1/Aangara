import pytest
from app.intelligence.data_quality import DataQualityEngine
from app.intelligence.service import intelligence_service
from app.intelligence.schemas import FacilityInputSchema
from app.api.endpoints_intelligence import analyze_facility, get_sector_defaults, check_data_quality

def test_data_quality_valid_input():
    data = {
        "sector": "cement",
        "annual_production": 1000000.0,
        "electricity_mwh": 85000.0,
        "renewable_electricity_pct": 15.0,
        "thermal_fuel_type": "petcoke",
        "thermal_fuel_tonnes": 85000.0,
        "clinker_factor_pct": 72.0
    }
    res = DataQualityEngine.audit_facility_input(data)
    assert res["status"] == "PASS"
    assert res["quality_score"] >= 80.0
    assert len(res["errors"]) == 0

def test_data_quality_blocking_error_negative_production():
    data = {
        "sector": "cement",
        "annual_production": -5000.0,
        "electricity_mwh": 85000.0
    }
    res = DataQualityEngine.audit_facility_input(data)
    assert res["status"] == "BLOCKING_ERROR"
    assert not res["is_valid"]
    assert any("production output must be greater than zero" in err for err in res["errors"])

def test_intelligence_service_full_analysis():
    data = {
        "facility_name": "Test Cement Plant",
        "sector": "cement",
        "sub_sector": "Integrated Plant",
        "state": "Rajasthan",
        "annual_production": 1000000.0,
        "production_unit": "tonnes",
        "electricity_mwh": 85000.0,
        "renewable_electricity_pct": 10.0,
        "thermal_fuel_type": "petcoke",
        "thermal_fuel_tonnes": 85000.0,
        "clinker_factor_pct": 72.0,
        "whrs_installed_mw": 0.0
    }
    analysis = intelligence_service.analyze_facility(data)
    assert "carbon_profile" in analysis
    assert analysis["carbon_profile"]["actual_gei"] > 0
    assert "peer_benchmark" in analysis
    assert 0 <= analysis["peer_benchmark"]["peer_percentile"] <= 100
    assert "anomaly_intelligence" in analysis
    assert len(analysis["opportunities"]) > 0
    assert "strategy_recommendation" in analysis
    assert "executive_explanation" in analysis

def test_intelligence_endpoint_analyze():
    payload = FacilityInputSchema(
        facility_name="Endpoint Test Unit",
        sector="cement",
        annual_production=1000000.0,
        electricity_mwh=85000.0,
        renewable_electricity_pct=12.0,
        thermal_fuel_type="petcoke",
        thermal_fuel_tonnes=85000.0
    )
    res = analyze_facility(payload)
    assert res["success"] is True
    assert "data" in res
    assert "peer_benchmark" in res["data"]

def test_intelligence_endpoint_defaults():
    res = get_sector_defaults("cement")
    assert res["success"] is True
    assert res["data"]["sector"] == "cement"
    assert res["data"]["annual_production"] > 0
