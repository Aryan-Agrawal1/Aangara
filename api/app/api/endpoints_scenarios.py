from fastapi import APIRouter, HTTPException
from typing import Dict, Any
from app.services.data_service import data_service
from app.engines.scenarios import ScenarioEngine
from app.schemas.scenarios import ScenarioSimulationRequest

router = APIRouter(prefix="/scenarios", tags=["Scenario Simulation Engine"])

@router.post("/run", response_model=Dict[str, Any])
def run_scenario(req: ScenarioSimulationRequest):
    entity = data_service.get_entity_by_id(req.entity_id)
    if not entity:
        raise HTTPException(status_code=404, detail=f"Entity '{req.entity_id}' not found.")

    rp = entity.get("reporting_periods", {}).get(req.reporting_year)
    if not rp:
        raise HTTPException(status_code=404, detail=f"Reporting period '{req.reporting_year}' not found.")

    prj = entity.get("primary_project", {})
    mrv_score = entity.get("mrv_readiness", {}).get("composite_score", 85.0)

    output = rp["actual_output"]
    emissions = rp["total_ghg_tco2e"]
    actual_gei = round(emissions / output, 4)
    target_gei = rp["target_gei"]

    result = ScenarioEngine.run_sensitivity(
        entity_output=output,
        baseline_emissions_tco2e=emissions,
        actual_gei=actual_gei,
        target_gei=target_gei,
        project_capex_cr=prj.get("capex_cr", 50.0),
        project_opex_change_cr=prj.get("annual_opex_change_cr", 1.5),
        project_energy_savings_cr=prj.get("annual_energy_savings_cr", 12.0),
        project_reduction_tco2e=prj.get("expected_reduction_tco2e", 25000.0),
        ccc_price_inr=req.parameters.ccc_price_inr,
        project_output_pct=req.parameters.project_output_pct,
        project_delay_months=req.parameters.project_delay_months,
        financing_rate_pct=req.parameters.financing_rate_pct,
        mrv_score=mrv_score
    )

    return {
        "success": True,
        "data": {
            "entity_id": req.entity_id,
            "reporting_year": req.reporting_year,
            "parameters": req.parameters.model_dump(),
            "strategies": result["strategies"],
            "winner_strategy": result["winner_strategy"],
            "winner_summary": result["winner_summary"],
            "sensitivity_insights": result["sensitivity_insights"],
            "delta_vs_base": result["delta_vs_base"]
        },
        "errors": [],
        "warnings": [],
        "source_status": "current"
    }
