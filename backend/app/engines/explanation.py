from typing import Dict, Any, List

class ExplanationEngine:
    @staticmethod
    def generate_deterministic_explanation(
        entity_name: str,
        sector: str,
        reporting_year: str,
        decision_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        winner = decision_data.get("recommended_strategy", "HYBRID")
        strategies = decision_data.get("strategies", {})
        winner_data = strategies.get(winner, {})
        assumptions = decision_data.get("assumptions_applied", {})
        
        ccc_price = assumptions.get("ccc_price_inr", 1000.0)
        delay = assumptions.get("project_delay_months", 0)
        
        narrative = (
            f"For {entity_name} ({sector.capitalize()}, {reporting_year}), the CarbonAlpha Capital Optimizer "
            f"recommends the **{winner} Strategy** with a composite utility score of {winner_data.get('utility_score', 0):.1f}/100.\n\n"
            f"1. **Economic Efficiency**: Modelled 3-year lifecycle cost is Rs. {winner_data.get('total_cost_cr', 0):.2f} Cr, "
            f"providing the most robust capital allocation against pure BUY (Rs. {strategies.get('BUY', {}).get('total_cost_cr', 0):.2f} Cr).\n"
            f"2. **Decarbonisation Delivery**: Secures {winner_data.get('internal_abatement_tco2e', 0):,.0f} tCO2e of structural internal abatement, "
            f"permanently reducing emissions intensity towards CCTS regulatory targets.\n"
            f"3. **Compliance Coverage**: Any residual shortfall ({winner_data.get('procured_ccc_tco2e', 0):,.0f} tCO2e) is fully bridged "
            f"under the assumed scenario CCC price of Rs. {ccc_price:,.0f}/tCO2e.\n"
            f"4. **Risk Sensitivity**: Strategy performance remains resilient across implementation timelines (assumed delay: {delay} months)."
        )

        exec_summary = (
            f"Recommended Strategy: {winner} | 3-Year Lifecycle Cost: Rs. {winner_data.get('total_cost_cr', 0):.2f} Cr | "
            f"Internal Abatement: {winner_data.get('internal_abatement_tco2e', 0):,.0f} tCO2e | Compliance Status: 100% Covered."
        )

        drivers = [
            "Internal project delivers structural GEI reduction with attractive payback.",
            "Residual compliance shortfall risk is mitigated via scenario CCC buffer.",
            "Weighted multi-criteria optimization balances cost (35%), climate impact (25%), compliance (20%), MRV (10%), and timing (10%)."
        ]

        risk_adv = (
            f"Key sensitivity factors: Project delay exceeding 6 months or CCC market price shifting beyond Rs. {ccc_price*1.4:.0f}/tCO2e. "
            f"Review third-party ACVA verification readiness prior to capital disbursement."
        )

        return {
            "narrative": narrative,
            "executive_summary": exec_summary,
            "key_drivers": drivers,
            "risk_advisory": risk_adv,
            "service_status": "DETERMINISTIC_FALLBACK",
            "model_used": "Deterministic Rule-Based Explanation Engine"
        }
