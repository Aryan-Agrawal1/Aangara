from typing import Dict, Any, List
from app.intelligence.schemas import DecarbonisationOpportunity
from app.engines.finance import FinanceEngine

class OpportunityEngine:
    @staticmethod
    def identify_opportunities(
        sector: str,
        annual_production: float,
        current_emissions_tco2e: float,
        actual_gei: float,
        electricity_mwh: float,
        renewable_pct: float,
        whrs_mw: float = 0.0
    ) -> List[Dict[str, Any]]:
        opportunities = []
        
        # Sector Opportunity Catalog
        if sector == "cement":
            # Opportunity 1: WHRS if not installed or small
            if whrs_mw < 10.0:
                capex = round(annual_production * 0.000075, 1)  # ~75 Cr per 1M t
                savings_cr = round(capex * 0.26, 2)
                opex_cr = round(capex * 0.025, 2)
                red_tco2e = round(annual_production * 0.052, 0)
                
                fin = FinanceEngine.evaluate_project(
                    capex_cr=capex,
                    annual_opex_change_cr=opex_cr,
                    annual_energy_savings_cr=savings_cr,
                    expected_reduction_tco2e=red_tco2e
                )
                
                opportunities.append({
                    "opportunity_id": "OPP-CEM-WHRS",
                    "title": "Kiln Pre-heater & Cooler Waste Heat Recovery System (15 MW WHRS)",
                    "category": "Waste Heat Recovery & Thermal Efficiency",
                    "description": "Capture sensible heat from kiln exhaust gas and clinker cooler to generate captive power, displacing grid electricity.",
                    "capex_cr": capex,
                    "annual_opex_change_cr": opex_cr,
                    "annual_energy_savings_cr": savings_cr,
                    "annual_reduction_tco2e": red_tco2e,
                    "reduction_pct": round((red_tco2e / max(1.0, current_emissions_tco2e)) * 100, 1),
                    "payback_years": fin["financial_metrics"]["payback_years"],
                    "npv_10yr_cr": fin["financial_metrics"]["npv_cr"],
                    "irr_pct": fin["financial_metrics"]["irr_pct"],
                    "cost_per_tco2e_inr": fin["cost_per_tco2e_inr"],
                    "implementation_months": 14,
                    "mrv_complexity": "LOW",
                    "confidence": "HIGH",
                    "applicable_methodology": "BM IN02.001 (Energy Efficiency in Industrial Facilities)"
                })

            # Opportunity 2: Alternative Fuel & Raw Material (AFR) / Biomass Thermal Substitution
            afr_capex = round(annual_production * 0.000028, 1)
            afr_savings = round(afr_capex * 0.32, 2)
            afr_red = round(annual_production * 0.038, 0)
            fin_afr = FinanceEngine.evaluate_project(afr_capex, 0.6, afr_savings, afr_red)
            
            opportunities.append({
                "opportunity_id": "OPP-CEM-AFR",
                "title": "Alternative Fuels & Raw Materials (AFR) Co-Processing Upgrade (18% TSR)",
                "category": "Fuel Switching & Circular Economy",
                "description": "Upgrade feeding and burning systems to replace fossil petcoke with non-recyclable refuse-derived fuel (RDF) and agricultural biomass.",
                "capex_cr": afr_capex,
                "annual_opex_change_cr": 0.6,
                "annual_energy_savings_cr": afr_savings,
                "annual_reduction_tco2e": afr_red,
                "reduction_pct": round((afr_red / max(1.0, current_emissions_tco2e)) * 100, 1),
                "payback_years": fin_afr["financial_metrics"]["payback_years"],
                "npv_10yr_cr": fin_afr["financial_metrics"]["npv_cr"],
                "irr_pct": fin_afr["financial_metrics"]["irr_pct"],
                "cost_per_tco2e_inr": fin_afr["cost_per_tco2e_inr"],
                "implementation_months": 8,
                "mrv_complexity": "MEDIUM",
                "confidence": "HIGH",
                "applicable_methodology": "BM EN01.003 (Biomass & Alternative Fuel Thermal Generation)"
            })

        elif sector == "iron_steel":
            # Top Gas Recovery & CDQ
            capex = round(annual_production * 0.000095, 1)
            savings = round(capex * 0.28, 2)
            red = round(annual_production * 0.085, 0)
            fin = FinanceEngine.evaluate_project(capex, 4.0, savings, red)
            
            opportunities.append({
                "opportunity_id": "OPP-STE-TRT-CDQ",
                "title": "Blast Furnace Top Gas Recovery Turbine (TRT) & Coke Dry Quenching (CDQ)",
                "category": "Sensible Heat & Pressure Energy Recovery",
                "description": "Recover high-pressure blast furnace top gas through expansion turbines to generate power and substitute wet quenching with dry inert gas quenching.",
                "capex_cr": capex,
                "annual_opex_change_cr": 4.0,
                "annual_energy_savings_cr": savings,
                "annual_reduction_tco2e": red,
                "reduction_pct": round((red / max(1.0, current_emissions_tco2e)) * 100, 1),
                "payback_years": fin["financial_metrics"]["payback_years"],
                "npv_10yr_cr": fin["financial_metrics"]["npv_cr"],
                "irr_pct": fin["financial_metrics"]["irr_pct"],
                "cost_per_tco2e_inr": fin["cost_per_tco2e_inr"],
                "implementation_months": 20,
                "mrv_complexity": "MEDIUM",
                "confidence": "HIGH",
                "applicable_methodology": "BM IN02.001 (Industrial Heat & Pressure Recovery)"
            })

        elif sector == "aluminium":
            # Potline Anode Modernisation & VFDs
            capex = round(annual_production * 0.00045, 1)
            savings = round(capex * 0.25, 2)
            red = round(annual_production * 0.42, 0)
            fin = FinanceEngine.evaluate_project(capex, 3.5, savings, red)
            
            opportunities.append({
                "opportunity_id": "OPP-ALU-POTLINE",
                "title": "Smelter Potline Point Feeder Optimization & High-Density Anode Retrofit",
                "category": "Smelting Process & Electrical Optimization",
                "description": "Upgrade alumina point-feeding algorithms and install slotted high-density anodes to suppress PFC anode effects and lower cell voltage.",
                "capex_cr": capex,
                "annual_opex_change_cr": 3.5,
                "annual_energy_savings_cr": savings,
                "annual_reduction_tco2e": red,
                "reduction_pct": round((red / max(1.0, current_emissions_tco2e)) * 100, 1),
                "payback_years": fin["financial_metrics"]["payback_years"],
                "npv_10yr_cr": fin["financial_metrics"]["npv_cr"],
                "irr_pct": fin["financial_metrics"]["irr_pct"],
                "cost_per_tco2e_inr": fin["cost_per_tco2e_inr"],
                "implementation_months": 16,
                "mrv_complexity": "MEDIUM",
                "confidence": "HIGH",
                "applicable_methodology": "BM IN02.001 (Electrolytic Efficiency Upgrades)"
            })

        # Universal Opportunity: Captive Solar & Green Open Access Power
        if renewable_pct < 40.0:
            solar_capex = round((electricity_mwh * 0.25 * 0.045) / 10.0, 1) # ~25% solar transition
            solar_capex = max(8.0, min(120.0, solar_capex))
            solar_savings = round(solar_capex * 0.24, 2)
            solar_red = round((electricity_mwh * 0.25) * 0.716, 0) # CEA grid EF
            fin_solar = FinanceEngine.evaluate_project(solar_capex, 0.4, solar_savings, solar_red)
            
            opportunities.append({
                "opportunity_id": "OPP-GEN-SOLAR",
                "title": f"Captive Solar PV & Green Power Open Access Integration",
                "category": "Renewable Power & Zero-Carbon Electrification",
                "description": "Procure green power via captive solar and inter-state open access contracts, displacing thermal grid electricity.",
                "capex_cr": solar_capex,
                "annual_opex_change_cr": 0.4,
                "annual_energy_savings_cr": solar_savings,
                "annual_reduction_tco2e": solar_red,
                "reduction_pct": round((solar_red / max(1.0, current_emissions_tco2e)) * 100, 1),
                "payback_years": fin_solar["financial_metrics"]["payback_years"],
                "npv_10yr_cr": fin_solar["financial_metrics"]["npv_cr"],
                "irr_pct": fin_solar["financial_metrics"]["irr_pct"],
                "cost_per_tco2e_inr": fin_solar["cost_per_tco2e_inr"],
                "implementation_months": 6,
                "mrv_complexity": "LOW",
                "confidence": "HIGH",
                "applicable_methodology": "BM EN01.001 (Grid-Connected Renewable Electricity)"
            })

        return opportunities
