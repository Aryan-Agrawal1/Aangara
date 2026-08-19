from typing import Dict, Any, List
from app.engines.optimizer import CapitalOptimizer

class ScenarioEngine:
    @staticmethod
    def run_sensitivity(
        entity_output: float,
        baseline_emissions_tco2e: float,
        actual_gei: float,
        target_gei: float,
        project_capex_cr: float,
        project_opex_change_cr: float,
        project_energy_savings_cr: float,
        project_reduction_tco2e: float,
        ccc_price_inr: float = 1000.0,
        project_output_pct: float = 100.0,
        project_delay_months: int = 0,
        financing_rate_pct: float = 9.5,
        mrv_score: float = 85.0
    ) -> Dict[str, Any]:
        # Run base scenario
        base_res = CapitalOptimizer.compare_strategies(
            entity_output=entity_output,
            baseline_emissions_tco2e=baseline_emissions_tco2e,
            actual_gei=actual_gei,
            target_gei=target_gei,
            project_capex_cr=project_capex_cr,
            project_opex_change_cr=project_opex_change_cr,
            project_energy_savings_cr=project_energy_savings_cr,
            project_reduction_tco2e=project_reduction_tco2e,
            ccc_price_inr=1000.0,
            project_output_delivery_pct=100.0,
            project_delay_months=0,
            financing_rate_pct=9.5,
            mrv_score=mrv_score
        )

        # Run current scenario
        curr_res = CapitalOptimizer.compare_strategies(
            entity_output=entity_output,
            baseline_emissions_tco2e=baseline_emissions_tco2e,
            actual_gei=actual_gei,
            target_gei=target_gei,
            project_capex_cr=project_capex_cr,
            project_opex_change_cr=project_opex_change_cr,
            project_energy_savings_cr=project_energy_savings_cr,
            project_reduction_tco2e=project_reduction_tco2e,
            ccc_price_inr=ccc_price_inr,
            project_output_delivery_pct=project_output_pct,
            project_delay_months=project_delay_months,
            financing_rate_pct=financing_rate_pct,
            mrv_score=mrv_score
        )

        winner = curr_res["recommended_strategy"]
        base_winner = base_res["recommended_strategy"]

        insights = []
        if ccc_price_inr > 1500.0:
            insights.append(f"High CCC price (?{ccc_price_inr:,.0f}) severely penalizes pure BUY strategy (+{((ccc_price_inr/1000.0)-1)*100:.0f}% cost increase).")
        elif ccc_price_inr < 600.0:
            insights.append(f"Low CCC price (?{ccc_price_inr:,.0f}) enhances short-term viability of market procurement.")

        if project_delay_months > 6:
            insights.append(f"Project delay of {project_delay_months} months increases compliance exposure by delaying emission intensity reductions.")

        if project_output_pct < 85.0:
            insights.append(f"Project derating ({project_output_pct}%) widens residual compliance shortfall, necessitating higher scenario CCC purchases.")

        if winner != base_winner:
            insights.append(f"Strategy ranking shifted from {base_winner} to {winner} due to applied sensitivity parameters.")

        return {
            "strategies": curr_res["strategies"],
            "winner_strategy": winner,
            "winner_summary": curr_res["recommendation_reason"],
            "sensitivity_insights": insights,
            "delta_vs_base": {
                "buy_cost_delta_cr": round(curr_res["strategies"]["BUY"]["total_cost_cr"] - base_res["strategies"]["BUY"]["total_cost_cr"], 2),
                "build_cost_delta_cr": round(curr_res["strategies"]["BUILD"]["total_cost_cr"] - base_res["strategies"]["BUILD"]["total_cost_cr"], 2),
                "hybrid_cost_delta_cr": round(curr_res["strategies"]["HYBRID"]["total_cost_cr"] - base_res["strategies"]["HYBRID"]["total_cost_cr"], 2)
            }
        }
