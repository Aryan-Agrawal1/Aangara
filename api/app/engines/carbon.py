from typing import Dict, Any, List
from app.schemas.calculation import CarbonPositionResponse, CalculationTraceSchema

class CarbonEngine:
    @staticmethod
    def calculate_position(
        entity_id: str,
        reporting_year: str,
        output: float,
        output_unit: str,
        total_emissions_tco2e: float,
        target_gei: float,
        model_version: str = "CA-MVP-1.0"
    ) -> CarbonPositionResponse:
        if output <= 0:
            raise ValueError(f"Output must be greater than zero. Received: {output}")
        if total_emissions_tco2e < 0:
            raise ValueError(f"Emissions cannot be negative. Received: {total_emissions_tco2e}")
        if target_gei <= 0:
            raise ValueError(f"Target GEI must be greater than zero. Received: {target_gei}")

        actual_gei = round(total_emissions_tco2e / output, 4)
        gei_delta = round(actual_gei - target_gei, 4)
        
        potential_surplus = round(max(0.0, target_gei - actual_gei) * output, 2)
        potential_shortfall = round(max(0.0, actual_gei - target_gei) * output, 2)
        
        status = "POTENTIAL_SURPLUS" if gei_delta <= 0 else "POTENTIAL_SHORTFALL"

        traces = [
            CalculationTraceSchema(
                metric="actual_gei",
                formula="total_ghg_tco2e / output",
                inputs={"total_ghg_tco2e": total_emissions_tco2e, "output": output},
                result=actual_gei,
                data_status="CALCULATION",
                model_version=model_version
            ),
            CalculationTraceSchema(
                metric="gei_delta",
                formula="actual_gei - target_gei",
                inputs={"actual_gei": actual_gei, "target_gei": target_gei},
                result=gei_delta,
                data_status="CALCULATION",
                model_version=model_version
            ),
            CalculationTraceSchema(
                metric="potential_shortfall_tco2e" if gei_delta > 0 else "potential_surplus_tco2e",
                formula="max(0, actual_gei - target_gei) * output" if gei_delta > 0 else "max(0, target_gei - actual_gei) * output",
                inputs={"actual_gei": actual_gei, "target_gei": target_gei, "output": output},
                result=potential_shortfall if gei_delta > 0 else potential_surplus,
                data_status="CALCULATION",
                model_version=model_version
            )
        ]

        return CarbonPositionResponse(
            entity_id=entity_id,
            reporting_year=reporting_year,
            output=output,
            output_unit=output_unit,
            total_ghg_tco2e=total_emissions_tco2e,
            actual_gei=actual_gei,
            target_gei=target_gei,
            gei_delta=gei_delta,
            status=status,
            potential_surplus_tco2e=potential_surplus,
            potential_shortfall_tco2e=potential_shortfall,
            calculation_trace=traces,
            data_status="CALCULATION"
        )
