from typing import Dict, Any, List, Optional
import numpy as np

class FinanceEngine:
    @staticmethod
    def calculate_npv_irr(
        initial_capex_cr: float,
        annual_net_cash_flow_cr: float,
        discount_rate_pct: float = 9.5,
        horizon_years: int = 10
    ) -> Dict[str, Any]:
        r = discount_rate_pct / 100.0
        
        cash_flows = [-initial_capex_cr] + [annual_net_cash_flow_cr] * horizon_years
        
        # NPV Calculation
        npv = sum(cf / ((1.0 + r) ** t) for t, cf in enumerate(cash_flows))
        npv_cr = round(npv, 2)
        
        # Simple Payback
        if annual_net_cash_flow_cr > 0:
            payback_years = round(initial_capex_cr / annual_net_cash_flow_cr, 2)
        else:
            payback_years = 99.9

        # IRR calculation
        irr_pct = None
        if annual_net_cash_flow_cr > 0 and (annual_net_cash_flow_cr * horizon_years) > initial_capex_cr:
            try:
                # Binary search for IRR
                low_r = -0.5
                high_r = 2.0
                for _ in range(50):
                    mid_r = (low_r + high_r) / 2.0
                    mid_npv = sum(cf / ((1.0 + mid_r) ** t) for t, cf in enumerate(cash_flows))
                    if abs(mid_npv) < 0.001:
                        irr_pct = round(mid_r * 100.0, 1)
                        break
                    if mid_npv > 0:
                        low_r = mid_r
                    else:
                        high_r = mid_r
                if irr_pct is None:
                    irr_pct = round(mid_r * 100.0, 1)
            except Exception:
                irr_pct = None

        return {
            "initial_capex_cr": initial_capex_cr,
            "annual_cash_flow_cr": round(annual_net_cash_flow_cr, 2),
            "npv_cr": npv_cr,
            "irr_pct": irr_pct,
            "payback_years": payback_years,
            "discount_rate_pct": discount_rate_pct,
            "horizon_years": horizon_years
        }

    @staticmethod
    def evaluate_project(
        capex_cr: float,
        annual_opex_change_cr: float,
        annual_energy_savings_cr: float,
        expected_reduction_tco2e: float,
        financing_rate_pct: float = 9.5,
        horizon_years: int = 10,
        mrv_annual_cost_cr: float = 0.35,
        verification_cost_cr: float = 0.20
    ) -> Dict[str, Any]:
        # Net annual operational cash flow before financing
        annual_net_savings = annual_energy_savings_cr - annual_opex_change_cr - mrv_annual_cost_cr - verification_cost_cr
        
        fin_results = FinanceEngine.calculate_npv_irr(
            initial_capex_cr=capex_cr,
            annual_net_cash_flow_cr=annual_net_savings,
            discount_rate_pct=financing_rate_pct,
            horizon_years=horizon_years
        )
        
        # Lifecycle net cost per tonne CO2e
        total_lifecycle_reduction = expected_reduction_tco2e * horizon_years
        net_lifecycle_cost_inr = (capex_cr + (annual_opex_change_cr + mrv_annual_cost_cr + verification_cost_cr - annual_energy_savings_cr) * horizon_years) * 1e7
        cost_per_tco2e = round(net_lifecycle_cost_inr / max(1.0, total_lifecycle_reduction), 1) if total_lifecycle_reduction > 0 else 0.0

        return {
            "financial_metrics": fin_results,
            "annual_net_savings_cr": round(annual_net_savings, 2),
            "cost_per_tco2e_inr": cost_per_tco2e,
            "lifecycle_abatement_tco2e": round(total_lifecycle_reduction, 0)
        }
