"""
CarbonAlpha — 90-Second Judge Flow & End-to-End Verification Test
==================================================================
Covers the entire judge evaluation workflow:
1. System Health Check (/api/health)
2. Sectors & Entities Discovery (/api/sectors, /api/entities)
3. Carbon Compliance Position Calculation (/api/calculate/carbon-position)
4. Capital Optimizer Decision Twin (/api/strategies/compare)
5. Multi-Variable Scenario Simulation (/api/scenarios/run)
6. Personalized Industrial Intelligence Analysis (/api/intelligence/analyze)
7. Regulatory Source & Methodology Traceability (/api/sources, /api/methodologies)
"""

import requests
import pytest

BASE_URL = "http://127.0.0.1:8008"
FRONTEND_URL = "http://127.0.0.1:3000"


def test_01_backend_health():
    res = requests.get(f"{BASE_URL}/api/health", timeout=5)
    assert res.status_code == 200
    data = res.json()
    assert data["status"].lower() == "healthy"
    assert data["regulatory_version"] is not None


def test_02_frontend_routes_responding():
    routes = ["/", "/decision", "/industrial-intelligence", "/overview", "/scenarios", "/sources", "/entity"]
    for r in routes:
        res = requests.get(f"{FRONTEND_URL}{r}", timeout=5)
        assert res.status_code == 200, f"Frontend route {r} failed with status {res.status_code}"


def test_03_sectors_and_gazette_targets():
    res = requests.get(f"{BASE_URL}/api/sectors", timeout=5)
    assert res.status_code == 200
    json_data = res.json()
    assert json_data["success"] is True
    sectors = json_data["data"]["sectors"]
    assert len(sectors) >= 8

    # Verify Cement is FINAL
    cement = next((s for s in sectors if s["sector_id"] == "cement"), None)
    assert cement is not None
    assert cement["status"] == "FINAL"

    # Verify Iron & Steel is DRAFT per DISC-06
    steel = next((s for s in sectors if s["sector_id"] == "iron_steel"), None)
    assert steel is not None
    assert steel["status"] == "DRAFT"


def test_04_deterministic_carbon_calculation():
    payload = {
        "entity_id": "SYN-CEM-001",
        "reporting_year": "2025-26"
    }
    res = requests.post(f"{BASE_URL}/api/calculate/carbon-position", json=payload, timeout=5)
    assert res.status_code == 200
    data = res.json()["data"]
    assert data["actual_gei"] == 0.7450
    assert data["status"] in ("POTENTIAL_SHORTFALL", "POTENTIAL_SURPLUS")
    assert len(data["calculation_trace"]) > 0


def test_05_decision_twin_buy_build_hybrid():
    payload = {
        "entity_id": "SYN-CEM-001",
        "reporting_year": "2025-26"
    }
    res = requests.post(f"{BASE_URL}/api/strategies/compare", json=payload, timeout=5)
    assert res.status_code == 200
    data = res.json()["data"]
    assert "BUY" in data["strategies"]
    assert "BUILD" in data["strategies"]
    assert "HYBRID" in data["strategies"]
    assert data["recommended_strategy"] in ("BUY", "BUILD", "HYBRID")


def test_06_scenario_sensitivity_slider_response():
    payload = {
        "entity_id": "SYN-CEM-001",
        "reporting_year": "2025-26",
        "parameters": {
            "ccc_price_inr": 2200.0,
            "project_output_pct": 80.0,
            "project_delay_months": 6,
            "financing_rate_pct": 12.0
        }
    }
    res = requests.post(f"{BASE_URL}/api/scenarios/run", json=payload, timeout=5)
    assert res.status_code == 200
    data = res.json()["data"]
    assert data["winner_strategy"] in ("BUY", "BUILD", "HYBRID")
    assert data["strategies"]["BUY"]["total_cost_cr"] > 0


def test_07_industrial_intelligence_facility_analysis_cement():
    payload = {
        "facility_name": "Demo Super Cement Unit",
        "sector": "cement",
        "sub_sector": "Integrated Dry Process",
        "state": "Rajasthan",
        "annual_production": 1500000.0,
        "production_unit": "tonnes",
        "electricity_mwh": 120000.0,
        "renewable_electricity_pct": 20.0,
        "thermal_fuel_type": "petcoke",
        "thermal_fuel_tonnes": 110000.0,
        "clinker_factor_pct": 72.0,
        "whrs_installed_mw": 0.0
    }
    res = requests.post(f"{BASE_URL}/api/intelligence/analyze", json=payload, timeout=8)
    assert res.status_code == 200
    json_data = res.json()
    assert json_data["success"] is True
    data = json_data["data"]

    assert data["data_quality"]["status"] == "PASS"
    assert data["carbon_profile"]["actual_gei"] > 0
    assert data["peer_benchmark"]["confidence_tier"] in ("CALIBRATED", "ILLUSTRATIVE")
    assert len(data["opportunities"]) >= 3
    assert data["strategy_recommendation"] is not None


def test_08_sources_and_bee_methodologies():
    s_res = requests.get(f"{BASE_URL}/api/sources", timeout=5)
    assert s_res.status_code == 200
    assert s_res.json()["data"]["total_sources"] >= 5

    m_res = requests.get(f"{BASE_URL}/api/methodologies", timeout=5)
    assert m_res.status_code == 200
    assert m_res.json()["data"]["total_methodologies"] >= 12
