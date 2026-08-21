from fastapi import APIRouter, HTTPException
from typing import Dict, Any
from app.services.data_service import data_service
from app.engines.carbon import CarbonEngine
from app.engines.optimizer import CapitalOptimizer
from app.engines.finance import FinanceEngine
from app.engines.anomaly import AnomalyEngine
from app.services.gemini_service import gemini_service
from app.schemas.calculation import CarbonCalculationRequest
from app.schemas.scenarios import AIExplanationRequest

router = APIRouter(prefix="", tags=["Calculation & Decision Engines"])

@router.post("/calculate/carbon-position", response_model=Dict[str, Any])
def calculate_carbon_position(req: CarbonCalculationRequest):
    entity = data_service.get_entity_by_id(req.entity_id)
    if not entity:
        raise HTTPException(status_code=404, detail=f"Entity '{req.entity_id}' not found.")
    
    rp = entity.get("reporting_periods", {}).get(req.reporting_year)
    if not rp:
        raise HTTPException(status_code=404, detail=f"Reporting period '{req.reporting_year}' not found for entity.")

    output = req.custom_output if req.custom_output is not None else rp["actual_output"]
    emissions = req.custom_emissions if req.custom_emissions is not None else rp["total_ghg_tco2e"]
    target_gei = req.custom_target_gei if req.custom_target_gei is not None else rp["target_gei"]

    pos = CarbonEngine.calculate_position(
        entity_id=req.entity_id,
        reporting_year=req.reporting_year,
        output=output,
        output_unit=rp["output_unit"],
        total_emissions_tco2e=emissions,
        target_gei=target_gei
    )

    return {
        "success": True,
        "data": pos.model_dump(),
        "errors": [],
        "warnings": [],
        "source_status": "current"
    }

@router.post("/strategies/compare", response_model=Dict[str, Any])
def compare_strategies(req: CarbonCalculationRequest):
    entity = data_service.get_entity_by_id(req.entity_id)
    if not entity:
        raise HTTPException(status_code=404, detail=f"Entity '{req.entity_id}' not found.")
    
    rp = entity.get("reporting_periods", {}).get(req.reporting_year)
    if not rp:
        raise HTTPException(status_code=404, detail=f"Reporting period '{req.reporting_year}' not found.")

    output = req.custom_output if req.custom_output is not None else rp["actual_output"]
    emissions = req.custom_emissions if req.custom_emissions is not None else rp["total_ghg_tco2e"]
    target_gei = req.custom_target_gei if req.custom_target_gei is not None else rp["target_gei"]
    actual_gei = round(emissions / output, 4)

    prj = entity.get("primary_project", {})
    mrv_score = entity.get("mrv_readiness", {}).get("composite_score", 85.0)

    # Deterministic Base Position
    pos = CarbonEngine.calculate_position(
        entity_id=req.entity_id,
        reporting_year=req.reporting_year,
        output=output,
        output_unit=rp["output_unit"],
        total_emissions_tco2e=emissions,
        target_gei=target_gei
    )

    # Strategy comparison
    decision = CapitalOptimizer.compare_strategies(
        entity_output=output,
        baseline_emissions_tco2e=emissions,
        actual_gei=actual_gei,
        target_gei=target_gei,
        project_capex_cr=prj.get("capex_cr", 50.0),
        project_opex_change_cr=prj.get("annual_opex_change_cr", 1.5),
        project_energy_savings_cr=prj.get("annual_energy_savings_cr", 12.0),
        project_reduction_tco2e=prj.get("expected_reduction_tco2e", 25000.0),
        ccc_price_inr=1000.0,
        mrv_score=mrv_score
    )

    # Data Quality Anomaly Check
    streams = rp.get("source_streams", {})
    anomaly_res = AnomalyEngine.detect_anomalies(
        output=output,
        electricity_mwh=streams.get("electricity_mwh", 1000.0),
        fuel_tonnes=streams.get("fuel_quantity_tonnes", 1000.0),
        actual_gei=actual_gei,
        baseline_gei=entity.get("regulatory_profile", {}).get("baseline_gei", actual_gei),
        capacity_utilisation_pct=rp.get("utilisation_pct", 85.0)
    )

    return {
        "success": True,
        "data": {
            "entity_id": req.entity_id,
            "entity_name": entity.get("entity_name"),
            "sector": entity.get("sector"),
            "reporting_year": req.reporting_year,
            "baseline_position": pos.model_dump(),
            "project_profile": prj,
            "mrv_readiness": entity.get("mrv_readiness"),
            "strategies": decision["strategies"],
            "recommended_strategy": decision["recommended_strategy"],
            "recommendation_reason": decision["recommendation_reason"],
            "assumptions_applied": decision["assumptions_applied"],
            "anomaly_intelligence": anomaly_res,
            "provenance": {
                "model_version": "CA-MVP-1.0",
                "regulatory_version": "REG-2026-08",
                "factor_version": "EF-2026-01"
            }
        },
        "errors": [],
        "warnings": [],
        "source_status": "current"
    }

@router.post("/ai/explain", response_model=Dict[str, Any])
def explain_decision(req: AIExplanationRequest):
    entity = data_service.get_entity_by_id(req.entity_id)
    entity_name = entity.get("entity_name", req.entity_id) if entity else req.entity_id
    sector = entity.get("sector", "general") if entity else "industrial"

    explanation = gemini_service.explain_decision(
        entity_name=entity_name,
        sector=sector,
        reporting_year=req.reporting_year,
        decision_data=req.decision_twin_data
    )

    return {
        "success": True,
        "data": explanation,
        "errors": [],
        "warnings": [],
        "source_status": "current"
    }
