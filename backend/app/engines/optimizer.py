from typing import Dict, Any, Optional
from app.engines.finance import FinanceEngine

class CapitalOptimizer:
    @staticmethod
    def compare_strategies(
        entity_output: float,
        baseline_emissions_tco2e: float,
        actual_gei: float,
        target_gei: float,
        project_capex_cr: float,
        project_opex_change_cr: float,
        project_energy_savings_cr: float,
        project_reduction_tco2e: float,
        ccc_price_inr: float = 1000.0,
        project_output_delivery_pct: float = 100.0,
        project_delay_months: int = 0,
        financing_rate_pct: float = 9.5,
        mrv_score: float = 85.0
    ) -> Dict[str, Any]:
        # 1. Baseline Position
        base_shortfall_tco2e = max(0.0, actual_gei - target_gei) * entity_output
        effective_reduction_tco2e = project_reduction_tco2e * (project_output_delivery_pct / 100.0)
        
        # --- BUY Strategy Mechanics ---
        # Purchases all shortfall CCCs from market
        buy_cost_annual_cr = (base_shortfall_tco2e * ccc_price_inr * 1.015) / 1e7  # 1.5% transaction cost
        buy_cost_3yr_cr = buy_cost_annual_cr * 3.0
        buy_abatement_tco2e = 0.0
        buy_residual_shortfall = 0.0 # Covered by CCCs
        buy_post_gei = actual_gei
        buy_cost_per_tco2e = ccc_price_inr * 1.015
        buy_risk = 68.0  # High market price volatility risk

        # --- BUILD Strategy Mechanics ---
        # Executes internal project
        build_emissions = baseline_emissions_tco2e - effective_reduction_tco2e
        build_post_gei = round(build_emissions / entity_output, 4)
        build_residual_shortfall = max(0.0, build_post_gei - target_gei) * entity_output
        
        # Delay penalty on annual savings in year 1
        delay_factor = max(0.0, 1.0 - (project_delay_months / 12.0))
        year1_savings = project_energy_savings_cr * delay_factor
        effective_annual_savings = (year1_savings + project_energy_savings_cr * 2) / 3.0
        
        build_eval = FinanceEngine.evaluate_project(
            capex_cr=project_capex_cr,
            annual_opex_change_cr=project_opex_change_cr,
            annual_energy_savings_cr=effective_annual_savings,
            expected_reduction_tco2e=effective_reduction_tco2e,
            financing_rate_pct=financing_rate_pct
        )
        
        # 3-year net cost for BUILD (CAPEX + 3yr Net OPEX + Uncovered Shortfall Penalty)
        uncovered_cost_3yr = (build_residual_shortfall * ccc_price_inr * 3.0) / 1e7
        build_cost_3yr_cr = project_capex_cr + ((project_opex_change_cr - effective_annual_savings) * 3.0) + uncovered_cost_3yr
        build_risk = 35.0 + (project_delay_months * 2.5)  # Execution & delay risk

        # --- HYBRID Strategy Mechanics ---
        # Builds project + Buys residual shortfall CCCs under scenario
        residual_ccc_procured = build_residual_shortfall
        residual_ccc_cost_3yr_cr = (residual_ccc_procured * ccc_price_inr * 1.015 * 3.0) / 1e7
        hybrid_cost_3yr_cr = project_capex_cr + ((project_opex_change_cr - effective_annual_savings) * 3.0) + residual_ccc_cost_3yr_cr
        hybrid_risk = 25.0 + (project_delay_months * 1.5)

        # --- Weighted Utility Model Scoring ---
        # Normalize costs (lower is better, 0-100)
        max_cost = max(buy_cost_3yr_cr, build_cost_3yr_cr, hybrid_cost_3yr_cr, 1.0)
        min_cost = min(buy_cost_3yr_cr, build_cost_3yr_cr, hybrid_cost_3yr_cr)
        
        def calc_fin_score(cost):
            return max(10.0, 100.0 - ((cost - min_cost) / (max_cost - min_cost + 0.01) * 80.0))
        
        buy_fin = calc_fin_score(buy_cost_3yr_cr)
        build_fin = calc_fin_score(build_cost_3yr_cr)
        hybrid_fin = calc_fin_score(hybrid_cost_3yr_cr)

        # Climate Scores (higher internal abatement is better)
        buy_climate = 10.0
        build_climate = min(100.0, (effective_reduction_tco2e / max(1.0, base_shortfall_tco2e)) * 85.0 + 15.0)
        hybrid_climate = build_climate

        # Compliance Scores (0 residual shortfall covered is best)
        buy_compliance = 85.0
        build_compliance = 60.0 if build_residual_shortfall > 0 else 95.0
        hybrid_compliance = 95.0 # Complete compliance via blend

        # MRV Scores
        buy_mrv = 70.0
        build_mrv = mrv_score
        hybrid_mrv = mrv_score

        # Timing Scores (delay impact)
        buy_timing = 90.0 # Instant market procurement
        build_timing = max(20.0, 80.0 - (project_delay_months * 4.0))
        hybrid_timing = max(30.0, 85.0 - (project_delay_months * 3.0))

        # Composite Utility
        def calc_total_score(fin, clim, comp, mrv, tim):
            return round(0.35 * fin + 0.25 * clim + 0.20 * comp + 0.10 * mrv + 0.10 * tim, 1)

        buy_utility = calc_total_score(buy_fin, buy_climate, buy_compliance, buy_mrv, buy_timing)
        build_utility = calc_total_score(build_fin, build_climate, build_compliance, build_mrv, build_timing)
        hybrid_utility = calc_total_score(hybrid_fin, hybrid_climate, hybrid_compliance, hybrid_mrv, hybrid_timing)

        strategies = {
            "BUY": {
                "strategy": "BUY",
                "total_cost_cr": round(buy_cost_3yr_cr, 2),
                "internal_abatement_tco2e": 0.0,
                "residual_shortfall_tco2e": 0.0,
                "procured_ccc_tco2e": round(base_shortfall_tco2e, 1),
                "post_strategy_gei": actual_gei,
                "payback_years": None,
                "npv_cr": None,
                "irr_pct": None,
                "cost_per_tco2e": round(buy_cost_per_tco2e, 1),
                "risk_score": buy_risk,
                "utility_score": buy_utility,
                "rank": 0,
                "sub_scores": {
                    "financial": round(buy_fin, 1),
                    "climate": round(buy_climate, 1),
                    "compliance": round(buy_compliance, 1),
                    "mrv": round(buy_mrv, 1),
                    "timing": round(buy_timing, 1)
                },
                "summary": f"Procure {base_shortfall_tco2e:,.0f} CCCs annually at ?{ccc_price_inr:,.0f}/tCO2e. Zero internal structural decarbonisation."
            },
            "BUILD": {
                "strategy": "BUILD",
                "total_cost_cr": round(build_cost_3yr_cr, 2),
                "internal_abatement_tco2e": round(effective_reduction_tco2e, 1),
                "residual_shortfall_tco2e": round(build_residual_shortfall, 1),
                "procured_ccc_tco2e": 0.0,
                "post_strategy_gei": build_post_gei,
                "payback_years": build_eval["financial_metrics"]["payback_years"],
                "npv_cr": build_eval["financial_metrics"]["npv_cr"],
                "irr_pct": build_eval["financial_metrics"]["irr_pct"],
                "cost_per_tco2e": build_eval["cost_per_tco2e_inr"],
                "risk_score": build_risk,
                "utility_score": build_utility,
                "rank": 0,
                "sub_scores": {
                    "financial": round(build_fin, 1),
                    "climate": round(build_climate, 1),
                    "compliance": round(build_compliance, 1),
                    "mrv": round(build_mrv, 1),
                    "timing": round(build_timing, 1)
                },
                "summary": f"Deploy capital project to abate {effective_reduction_tco2e:,.0f} tCO2e. Leaves {build_residual_shortfall:,.0f} tCO2e residual compliance gap."
            },
            "HYBRID": {
                "strategy": "HYBRID",
                "total_cost_cr": round(hybrid_cost_3yr_cr, 2),
                "internal_abatement_tco2e": round(effective_reduction_tco2e, 1),
                "residual_shortfall_tco2e": 0.0,
                "procured_ccc_tco2e": round(residual_ccc_procured, 1),
                "post_strategy_gei": build_post_gei,
                "payback_years": build_eval["financial_metrics"]["payback_years"],
                "npv_cr": build_eval["financial_metrics"]["npv_cr"],
                "irr_pct": build_eval["financial_metrics"]["irr_pct"],
                "cost_per_tco2e": build_eval["cost_per_tco2e_inr"],
                "risk_score": hybrid_risk,
                "utility_score": hybrid_utility,
                "rank": 0,
                "sub_scores": {
                    "financial": round(hybrid_fin, 1),
                    "climate": round(hybrid_climate, 1),
                    "compliance": round(hybrid_compliance, 1),
                    "mrv": round(hybrid_mrv, 1),
                    "timing": round(hybrid_timing, 1)
                },
                "summary": f"Execute internal abatement ({effective_reduction_tco2e:,.0f} tCO2e) and purchase residual {residual_ccc_procured:,.0f} CCCs under scenario pricing."
            }
        }

        # Rank strategies
        ranked_keys = sorted(strategies.keys(), key=lambda k: strategies[k]["utility_score"], reverse=True)
        for rank_idx, k in enumerate(ranked_keys, 1):
            strategies[k]["rank"] = rank_idx

        winner = ranked_keys[0]

        reason = (
            f"{winner} ranked #1 with composite utility score of {strategies[winner]['utility_score']:.1f}/100. "
            f"Balances financial lifecycle cost (?{strategies[winner]['total_cost_cr']:.2f} Cr), "
            f"internal abatement ({strategies[winner]['internal_abatement_tco2e']:,.0f} tCO2e), and 100% compliance guarantee."
        )

        return {
            "strategies": strategies,
            "recommended_strategy": winner,
            "recommendation_reason": reason,
            "assumptions_applied": {
                "ccc_price_inr": ccc_price_inr,
                "project_output_delivery_pct": project_output_delivery_pct,
                "project_delay_months": project_delay_months,
                "financing_rate_pct": financing_rate_pct
            }
        }
