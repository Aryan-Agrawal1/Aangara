from typing import Dict, Any, List
from app.engines.finance import FinanceEngine

class OpportunityEngine:
    """
    Techno-Economic Decarbonisation Opportunity Engine for Indian CCTS Industrial Sectors.
    
    All opportunity models use engineering benchmarks calibrated against:
    - BEE Detailed Compliance Procedure v1.0 (Jul 2024)
    - BEE PAT Cycle 1-6 Best Available Technology (BAT) compendia
    - CEA Grid Emission Factors (FY2023-24: 0.716 tCO2e/MWh)
    - Real corporate BRSR sustainability disclosures (Tata Steel, UltraTech, Hindalco, IOCL, Grasim)
    """

    @staticmethod
    def identify_opportunities(
        sector: str,
        annual_production: float,
        current_emissions_tco2e: float,
        actual_gei: float,
        electricity_mwh: float,
        renewable_pct: float,
        whrs_mw: float = 0.0,
        **kwargs
    ) -> List[Dict[str, Any]]:
        opportunities = []
        sec = sector.lower()

        # ─────────────────────────────────────────────────────────────────────────────
        # 1. CEMENT SECTOR
        # ─────────────────────────────────────────────────────────────────────────────
        if sec == "cement":
            # Opportunity 1: Kiln & Cooler WHRS (if < 12 MW installed)
            if whrs_mw < 12.0:
                capex = round(annual_production * 0.000075, 1)  # ~75 Cr per 1M t capacity (12-15 MW)
                capex = max(15.0, min(120.0, capex))
                savings_cr = round(capex * 0.28, 2)
                opex_cr = round(capex * 0.025, 2)
                red_tco2e = round(annual_production * 0.052, 0)
                
                fin = FinanceEngine.evaluate_project(capex, opex_cr, savings_cr, red_tco2e)
                opportunities.append({
                    "opportunity_id": "OPP-CEM-WHRS",
                    "title": "Kiln Pre-heater & Clinker Cooler WHRS (15 MW Captive Power)",
                    "category": "Waste Heat Recovery & Power Generation",
                    "description": "Capture sensible heat from kiln suspension preheater and grate cooler exhaust gases to drive a steam rankine cycle turbine, generating 35-45 kWh/t clinker of zero-carbon power.",
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
                    "confidence_tier": "CALIBRATED",
                    "applicable_methodology": "BM IN02.001 (Energy Efficiency in Industrial Facilities)"
                })

            # Opportunity 2: Alternative Fuel & Raw Material (AFR) Co-Processing
            afr_capex = round(annual_production * 0.000030, 1)
            afr_capex = max(8.0, min(45.0, afr_capex))
            afr_savings = round(afr_capex * 0.35, 2)
            afr_red = round(annual_production * 0.042, 0)
            fin_afr = FinanceEngine.evaluate_project(afr_capex, 0.75, afr_savings, afr_red)
            
            opportunities.append({
                "opportunity_id": "OPP-CEM-AFR",
                "title": "Alternative Fuels & Raw Materials (AFR) Feeding Retrofit (20% TSR)",
                "category": "Fuel Switching & Circular Economy",
                "description": "Install automated shredded RDF/biomass pneumatic feeding and multi-channel calciner burner to replace fossil petcoke with non-recyclable solid recovered fuel and agro-residues.",
                "capex_cr": afr_capex,
                "annual_opex_change_cr": 0.75,
                "annual_energy_savings_cr": afr_savings,
                "annual_reduction_tco2e": afr_red,
                "reduction_pct": round((afr_red / max(1.0, current_emissions_tco2e)) * 100, 1),
                "payback_years": fin_afr["financial_metrics"]["payback_years"],
                "npv_10yr_cr": fin_afr["financial_metrics"]["npv_cr"],
                "irr_pct": fin_afr["financial_metrics"]["irr_pct"],
                "cost_per_tco2e_inr": fin_afr["cost_per_tco2e_inr"],
                "implementation_months": 8,
                "mrv_complexity": "MEDIUM",
                "confidence_tier": "CALIBRATED",
                "applicable_methodology": "BM EN01.003 (Biomass & Alternative Fuel Thermal Generation)"
            })

            # Opportunity 3: Limestone Calcined Clay Cement (LC3) & High-Efficiency Separator
            lc3_capex = round(annual_production * 0.000022, 1)
            lc3_capex = max(5.0, min(30.0, lc3_capex))
            lc3_savings = round(lc3_capex * 0.30, 2)
            lc3_red = round(annual_production * 0.035, 0)
            fin_lc3 = FinanceEngine.evaluate_project(lc3_capex, 0.40, lc3_savings, lc3_red)

            opportunities.append({
                "opportunity_id": "OPP-CEM-LC3",
                "title": "Low-Carbon Calcined Clay Blending & 4th Gen VRM Separator Retrofit",
                "category": "Process Decarbonisation & Clinker Reduction",
                "description": "Lower clinker factor from 75% to 60% through activated calcined clay and limestone substitution with high-efficiency 4th generation grinding dynamic separators.",
                "capex_cr": lc3_capex,
                "annual_opex_change_cr": 0.40,
                "annual_energy_savings_cr": lc3_savings,
                "annual_reduction_tco2e": lc3_red,
                "reduction_pct": round((lc3_red / max(1.0, current_emissions_tco2e)) * 100, 1),
                "payback_years": fin_lc3["financial_metrics"]["payback_years"],
                "npv_10yr_cr": fin_lc3["financial_metrics"]["npv_cr"],
                "irr_pct": fin_lc3["financial_metrics"]["irr_pct"],
                "cost_per_tco2e_inr": fin_lc3["cost_per_tco2e_inr"],
                "implementation_months": 10,
                "mrv_complexity": "HIGH",
                "confidence_tier": "CALIBRATED",
                "applicable_methodology": "BM IN02.001 (Clinker Substitution & Energy Efficiency)"
            })

        # ─────────────────────────────────────────────────────────────────────────────
        # 2. IRON & STEEL SECTOR
        # ─────────────────────────────────────────────────────────────────────────────
        elif sec == "iron_steel":
            # TRT & Coke Dry Quenching (CDQ)
            capex = round(annual_production * 0.000085, 1)
            capex = max(25.0, min(180.0, capex))
            savings = round(capex * 0.26, 2)
            red = round(annual_production * 0.078, 0)
            fin = FinanceEngine.evaluate_project(capex, 3.5, savings, red)
            
            opportunities.append({
                "opportunity_id": "OPP-STE-TRT-CDQ",
                "title": "Top Gas Recovery Turbine (TRT) & Coke Dry Quenching (CDQ) Power Island",
                "category": "High-Pressure Gas Expansion & Sensible Heat Recovery",
                "description": "Harness blast furnace top pressure via 3D bladed expander turbine and eliminate water quenching in coke batteries via circulating inert N2 gas to produce 45 kWh/t steam power.",
                "capex_cr": capex,
                "annual_opex_change_cr": 3.5,
                "annual_energy_savings_cr": savings,
                "annual_reduction_tco2e": red,
                "reduction_pct": round((red / max(1.0, current_emissions_tco2e)) * 100, 1),
                "payback_years": fin["financial_metrics"]["payback_years"],
                "npv_10yr_cr": fin["financial_metrics"]["npv_cr"],
                "irr_pct": fin["financial_metrics"]["irr_pct"],
                "cost_per_tco2e_inr": fin["cost_per_tco2e_inr"],
                "implementation_months": 18,
                "mrv_complexity": "MEDIUM",
                "confidence_tier": "CALIBRATED",
                "applicable_methodology": "BM IN02.001 (Industrial Heat & Pressure Recovery)"
            })

            # Pulverized Coal Injection (PCI) Oxygen Enrichment & Blast Moisture Control
            pci_capex = round(annual_production * 0.000045, 1)
            pci_capex = max(12.0, min(75.0, pci_capex))
            pci_savings = round(pci_capex * 0.32, 2)
            pci_red = round(annual_production * 0.055, 0)
            fin_pci = FinanceEngine.evaluate_project(pci_capex, 1.8, pci_savings, pci_red)

            opportunities.append({
                "opportunity_id": "OPP-STE-PCI-OXY",
                "title": "High-Rate Pulverized Coal Injection (PCI) & Blast Furnace Hot-Stove Oxygen Enrichment",
                "category": "Combustion Optimization & Coke Rate Reduction",
                "description": "Increase PCI injection to 180 kg/tHM with oxygen enrichment and waste gas preheating to reduce metallurgic coke consumption by 28 kg/tHM.",
                "capex_cr": pci_capex,
                "annual_opex_change_cr": 1.8,
                "annual_energy_savings_cr": pci_savings,
                "annual_reduction_tco2e": pci_red,
                "reduction_pct": round((pci_red / max(1.0, current_emissions_tco2e)) * 100, 1),
                "payback_years": fin_pci["financial_metrics"]["payback_years"],
                "npv_10yr_cr": fin_pci["financial_metrics"]["npv_cr"],
                "irr_pct": fin_pci["financial_metrics"]["irr_pct"],
                "cost_per_tco2e_inr": fin_pci["cost_per_tco2e_inr"],
                "implementation_months": 12,
                "mrv_complexity": "LOW",
                "confidence_tier": "CALIBRATED",
                "applicable_methodology": "BM IN02.001 (Thermal Efficiency in Metallurgical Plants)"
            })

        # ─────────────────────────────────────────────────────────────────────────────
        # 3. ALUMINIUM SECTOR
        # ─────────────────────────────────────────────────────────────────────────────
        elif sec == "aluminium":
            # Potline Anode Modernisation & Magnetic Compensation
            capex = round(annual_production * 0.00042, 1)
            capex = max(18.0, min(140.0, capex))
            savings = round(capex * 0.27, 2)
            red = round(annual_production * 0.40, 0)
            fin = FinanceEngine.evaluate_project(capex, 3.2, savings, red)
            
            opportunities.append({
                "opportunity_id": "OPP-ALU-POTLINE",
                "title": "Electrolytic Potline Slotted Anodes & Smart Point-Feeder Control Upgrade",
                "category": "Smelting Process & Electrical Optimization",
                "description": "Implement slotted high-density carbon anodes, dynamic busbar magnetic compensation, and automated alumina point feeding to eliminate PFC anode effects and lower specific energy consumption by 450 kWh/t Al.",
                "capex_cr": capex,
                "annual_opex_change_cr": 3.2,
                "annual_energy_savings_cr": savings,
                "annual_reduction_tco2e": red,
                "reduction_pct": round((red / max(1.0, current_emissions_tco2e)) * 100, 1),
                "payback_years": fin["financial_metrics"]["payback_years"],
                "npv_10yr_cr": fin["financial_metrics"]["npv_cr"],
                "irr_pct": fin["financial_metrics"]["irr_pct"],
                "cost_per_tco2e_inr": fin["cost_per_tco2e_inr"],
                "implementation_months": 16,
                "mrv_complexity": "MEDIUM",
                "confidence_tier": "CALIBRATED",
                "applicable_methodology": "BM IN02.001 (Electrolytic Efficiency Upgrades)"
            })

            # Alumina Calciner Heat Recuperation & VFDs
            cal_capex = round(annual_production * 0.00015, 1)
            cal_capex = max(8.0, min(50.0, cal_capex))
            cal_savings = round(cal_capex * 0.30, 2)
            cal_red = round(annual_production * 0.12, 0)
            fin_cal = FinanceEngine.evaluate_project(cal_capex, 1.1, cal_savings, cal_red)

            opportunities.append({
                "opportunity_id": "OPP-ALU-CALCINER",
                "title": "Gas Suspension Alumina Calciner Heat Recuperator & Heavy VFD Drives",
                "category": "Thermal Heat Recuperation & Auxiliary Efficiency",
                "description": "Install cyclone preheating on alumina calciners and variable frequency drives on main induced draft exhaust fans to cut natural gas/fuel oil consumption.",
                "capex_cr": cal_capex,
                "annual_opex_change_cr": 1.1,
                "annual_energy_savings_cr": cal_savings,
                "annual_reduction_tco2e": cal_red,
                "reduction_pct": round((cal_red / max(1.0, current_emissions_tco2e)) * 100, 1),
                "payback_years": fin_cal["financial_metrics"]["payback_years"],
                "npv_10yr_cr": fin_cal["financial_metrics"]["npv_cr"],
                "irr_pct": fin_cal["financial_metrics"]["irr_pct"],
                "cost_per_tco2e_inr": fin_cal["cost_per_tco2e_inr"],
                "implementation_months": 9,
                "mrv_complexity": "LOW",
                "confidence_tier": "CALIBRATED",
                "applicable_methodology": "BM IN02.001 (Industrial Thermal Heat Recovery)"
            })

        # ─────────────────────────────────────────────────────────────────────────────
        # 4. CHLOR-ALKALI SECTOR
        # ─────────────────────────────────────────────────────────────────────────────
        elif sec == "chlor_alkali":
            # Zero-Gap Bipolar Membrane Cell Conversion
            capex = round(annual_production * 0.00018, 1)
            capex = max(10.0, min(65.0, capex))
            savings = round(capex * 0.31, 2)
            red = round(annual_production * 0.16, 0)
            fin = FinanceEngine.evaluate_project(capex, 1.2, savings, red)

            opportunities.append({
                "opportunity_id": "OPP-CHL-ZEROGAP",
                "title": "Zero-Gap Bipolar Membrane Cell Retrofit (250 kWh/t NaOH Power Reduction)",
                "category": "Electrolytic Technology Modernisation",
                "description": "Replace older monopolar or standard gap membrane cells with zero-gap high-flux elements and low-overpotential electrodes, reducing specific power consumption to 2,050 kWh/t NaOH.",
                "capex_cr": capex,
                "annual_opex_change_cr": 1.2,
                "annual_energy_savings_cr": savings,
                "annual_reduction_tco2e": red,
                "reduction_pct": round((red / max(1.0, current_emissions_tco2e)) * 100, 1),
                "payback_years": fin["financial_metrics"]["payback_years"],
                "npv_10yr_cr": fin["financial_metrics"]["npv_cr"],
                "irr_pct": fin["financial_metrics"]["irr_pct"],
                "cost_per_tco2e_inr": fin["cost_per_tco2e_inr"],
                "implementation_months": 12,
                "mrv_complexity": "LOW",
                "confidence_tier": "CALIBRATED",
                "applicable_methodology": "BM IN02.001 (Energy Efficiency in Chlor-Alkali Electrolysis)"
            })

            # By-product Hydrogen Fuel Utilization
            h2_capex = round(annual_production * 0.00006, 1)
            h2_capex = max(4.0, min(25.0, h2_capex))
            h2_savings = round(h2_capex * 0.38, 2)
            h2_red = round(annual_production * 0.085, 0)
            fin_h2 = FinanceEngine.evaluate_project(h2_capex, 0.4, h2_savings, h2_red)

            opportunities.append({
                "opportunity_id": "OPP-CHL-H2BOIL",
                "title": "100% By-Product Hydrogen Recovery for Steam Generation & Caustic Evaporation",
                "category": "Fuel Substitution & Hydrogen Monetization",
                "description": "Install hydrogen purification, compression, and dedicated dual-fuel burner systems in caustic concentration boilers, displacing fossil furnace oil or imported natural gas.",
                "capex_cr": h2_capex,
                "annual_opex_change_cr": 0.4,
                "annual_energy_savings_cr": h2_savings,
                "annual_reduction_tco2e": h2_red,
                "reduction_pct": round((h2_red / max(1.0, current_emissions_tco2e)) * 100, 1),
                "payback_years": fin_h2["financial_metrics"]["payback_years"],
                "npv_10yr_cr": fin_h2["financial_metrics"]["npv_cr"],
                "irr_pct": fin_h2["financial_metrics"]["irr_pct"],
                "cost_per_tco2e_inr": fin_h2["cost_per_tco2e_inr"],
                "implementation_months": 8,
                "mrv_complexity": "MEDIUM",
                "confidence_tier": "CALIBRATED",
                "applicable_methodology": "BM EN01.003 (Industrial By-Product Gas Utilization)"
            })

        # ─────────────────────────────────────────────────────────────────────────────
        # 5. PULP & PAPER SECTOR
        # ─────────────────────────────────────────────────────────────────────────────
        elif sec == "pulp_paper":
            # High-Pressure Black Liquor Recovery Boiler & Turbogenerator
            capex = round(annual_production * 0.00022, 1)
            capex = max(12.0, min(80.0, capex))
            savings = round(capex * 0.29, 2)
            red = round(annual_production * 0.18, 0)
            fin = FinanceEngine.evaluate_project(capex, 1.8, savings, red)

            opportunities.append({
                "opportunity_id": "OPP-PAP-BLRB",
                "title": "High-Solids Black Liquor Recovery Boiler & Extraction Turbogenerator",
                "category": "Biomass Cogeneration & Chemical Recovery",
                "description": "Concentrate black liquor to 75%+ dry solids and generate 85 bar superheated steam for backpressure cogeneration, supplying 100% process steam and surplus green electricity.",
                "capex_cr": capex,
                "annual_opex_change_cr": 1.8,
                "annual_energy_savings_cr": savings,
                "annual_reduction_tco2e": red,
                "reduction_pct": round((red / max(1.0, current_emissions_tco2e)) * 100, 1),
                "payback_years": fin["financial_metrics"]["payback_years"],
                "npv_10yr_cr": fin["financial_metrics"]["npv_cr"],
                "irr_pct": fin["financial_metrics"]["irr_pct"],
                "cost_per_tco2e_inr": fin["cost_per_tco2e_inr"],
                "implementation_months": 15,
                "mrv_complexity": "MEDIUM",
                "confidence_tier": "CALIBRATED",
                "applicable_methodology": "BM EN01.003 (Biomass Cogeneration & Black Liquor Recovery)"
            })

        # ─────────────────────────────────────────────────────────────────────────────
        # 6. PETROLEUM REFINERY SECTOR
        # ─────────────────────────────────────────────────────────────────────────────
        elif sec == "petroleum_refinery":
            # Flare Gas Recovery & Crude Pre-Heat Train Pinch Optimization
            capex = round(annual_production * 0.000015, 1)
            capex = max(20.0, min(110.0, capex))
            savings = round(capex * 0.33, 2)
            red = round(annual_production * 0.012, 0)
            fin = FinanceEngine.evaluate_project(capex, 2.5, savings, red)

            opportunities.append({
                "opportunity_id": "OPP-REF-FGRS",
                "title": "Refinery Flare Gas Recovery System (FGRS) & CDU/VDU Heat Exchanger Train Revamp",
                "category": "Flare Minimization & Process Heat Integration",
                "description": "Install liquid ring compressors and knock-out drums to recover refinery off-gases into fuel gas header, combined with pinch analysis optimization on crude distillation preheat trains.",
                "capex_cr": capex,
                "annual_opex_change_cr": 2.5,
                "annual_energy_savings_cr": savings,
                "annual_reduction_tco2e": red,
                "reduction_pct": round((red / max(1.0, current_emissions_tco2e)) * 100, 1),
                "payback_years": fin["financial_metrics"]["payback_years"],
                "npv_10yr_cr": fin["financial_metrics"]["npv_cr"],
                "irr_pct": fin["financial_metrics"]["irr_pct"],
                "cost_per_tco2e_inr": fin["cost_per_tco2e_inr"],
                "implementation_months": 14,
                "mrv_complexity": "LOW",
                "confidence_tier": "CALIBRATED",
                "applicable_methodology": "BM IN02.001 (Energy Efficiency & Flare Gas Recovery)"
            })

        # ─────────────────────────────────────────────────────────────────────────────
        # 7. PETROCHEMICALS SECTOR
        # ─────────────────────────────────────────────────────────────────────────────
        elif sec == "petrochemicals":
            # Cracker Furnace Radiant Coil Modernization & Waste Heat Steam Generation
            capex = round(annual_production * 0.000040, 1)
            capex = max(15.0, min(90.0, capex))
            savings = round(capex * 0.30, 2)
            red = round(annual_production * 0.045, 0)
            fin = FinanceEngine.evaluate_project(capex, 1.6, savings, red)

            opportunities.append({
                "opportunity_id": "OPP-PET-CRACKER",
                "title": "Cracker Furnace Radiant Coil High-Emissivity Coating & Ultra-Low NOx Burners",
                "category": "Pyrolysis Thermal Efficiency",
                "description": "Apply high-emissivity ceramic coatings on cracker firebox tubes and install staged fuel ultra-low NOx burners to increase thermal efficiency from 88% to 94%.",
                "capex_cr": capex,
                "annual_opex_change_cr": 1.6,
                "annual_energy_savings_cr": savings,
                "annual_reduction_tco2e": red,
                "reduction_pct": round((red / max(1.0, current_emissions_tco2e)) * 100, 1),
                "payback_years": fin["financial_metrics"]["payback_years"],
                "npv_10yr_cr": fin["financial_metrics"]["npv_cr"],
                "irr_pct": fin["financial_metrics"]["irr_pct"],
                "cost_per_tco2e_inr": fin["cost_per_tco2e_inr"],
                "implementation_months": 11,
                "mrv_complexity": "MEDIUM",
                "confidence_tier": "CALIBRATED",
                "applicable_methodology": "BM IN02.001 (Thermal Efficiency in Petrochemical Facilities)"
            })

        # ─────────────────────────────────────────────────────────────────────────────
        # 8. TEXTILE SECTOR
        # ─────────────────────────────────────────────────────────────────────────────
        elif sec == "textile":
            # Stenter Exhaust Heat Recovery & Closed-Loop Condensate
            capex = round(annual_production * 0.00030, 1)
            capex = max(2.5, min(18.0, capex))
            savings = round(capex * 0.36, 2)
            red = round(annual_production * 0.22, 0)
            fin = FinanceEngine.evaluate_project(capex, 0.25, savings, red)

            opportunities.append({
                "opportunity_id": "OPP-TEX-STENTER",
                "title": "Stenter Machine Exhaust Air-to-Air Heat Recovery & Closed-Loop Condensate Return",
                "category": "Thermal Waste Heat Recuperation",
                "description": "Recover 160°C stenter exhaust air to preheat incoming fresh air via heat-pipe exchangers, reducing thermic fluid heater fuel consumption by 22%.",
                "capex_cr": capex,
                "annual_opex_change_cr": 0.25,
                "annual_energy_savings_cr": savings,
                "annual_reduction_tco2e": red,
                "reduction_pct": round((red / max(1.0, current_emissions_tco2e)) * 100, 1),
                "payback_years": fin["financial_metrics"]["payback_years"],
                "npv_10yr_cr": fin["financial_metrics"]["npv_cr"],
                "irr_pct": fin["financial_metrics"]["irr_pct"],
                "cost_per_tco2e_inr": fin["cost_per_tco2e_inr"],
                "implementation_months": 6,
                "mrv_complexity": "LOW",
                "confidence_tier": "CALIBRATED",
                "applicable_methodology": "BM IN02.001 (Industrial Process Waste Heat Recovery)"
            })

        # ─────────────────────────────────────────────────────────────────────────────
        # 9. FERTILISER SECTOR (Watchlist Scope)
        # ─────────────────────────────────────────────────────────────────────────────
        elif sec == "fertiliser":
            capex = round(annual_production * 0.00008, 1)
            capex = max(15.0, min(80.0, capex))
            savings = round(capex * 0.26, 2)
            red = round(annual_production * 0.065, 0)
            fin = FinanceEngine.evaluate_project(capex, 1.5, savings, red)

            opportunities.append({
                "opportunity_id": "OPP-FERT-SYNGAS",
                "title": "Ammonia Plant Primary Reformer Waste Heat Optimization & Syngas Expander",
                "category": "Syngas Heat Recovery & Thermodynamic Efficiency",
                "description": "Install low-pressure drop reforming catalysts, recuperative syngas heat exchangers, and electrical drive compressor retrofits to reduce specific natural gas consumption.",
                "capex_cr": capex,
                "annual_opex_change_cr": 1.5,
                "annual_energy_savings_cr": savings,
                "annual_reduction_tco2e": red,
                "reduction_pct": round((red / max(1.0, current_emissions_tco2e)) * 100, 1),
                "payback_years": fin["financial_metrics"]["payback_years"],
                "npv_10yr_cr": fin["financial_metrics"]["npv_cr"],
                "irr_pct": fin["financial_metrics"]["irr_pct"],
                "cost_per_tco2e_inr": fin["cost_per_tco2e_inr"],
                "implementation_months": 14,
                "mrv_complexity": "MEDIUM",
                "confidence_tier": "CALIBRATED",
                "applicable_methodology": "BM IN02.001 (Industrial Thermal Efficiency)"
            })

        # ─────────────────────────────────────────────────────────────────────────────
        # UNIVERSAL OPPORTUNITY: Captive Solar & Green Open Access Power
        # ─────────────────────────────────────────────────────────────────────────────
        if renewable_pct < 50.0 and electricity_mwh > 1000.0:
            solar_capex = round((electricity_mwh * 0.25 * 0.045) / 10.0, 1)  # ~25% solar transition
            solar_capex = max(4.0, min(140.0, solar_capex))
            solar_savings = round(solar_capex * 0.26, 2)
            solar_red = round((electricity_mwh * 0.25) * 0.716, 0)  # CEA grid EF (0.716 tCO2e/MWh)
            fin_solar = FinanceEngine.evaluate_project(solar_capex, 0.35, solar_savings, solar_red)
            
            opportunities.append({
                "opportunity_id": "OPP-GEN-SOLAR",
                "title": "Captive Solar PV & Interstate Green Power Open Access Integration",
                "category": "Renewable Power & Zero-Carbon Electrification",
                "description": "Procure green power via dedicated captive solar PV and bilateral Open Access transmission contracts under the Green Energy Open Access Rules 2022, displacing thermal grid electricity.",
                "capex_cr": solar_capex,
                "annual_opex_change_cr": 0.35,
                "annual_energy_savings_cr": solar_savings,
                "annual_reduction_tco2e": solar_red,
                "reduction_pct": round((solar_red / max(1.0, current_emissions_tco2e)) * 100, 1),
                "payback_years": fin_solar["financial_metrics"]["payback_years"],
                "npv_10yr_cr": fin_solar["financial_metrics"]["npv_cr"],
                "irr_pct": fin_solar["financial_metrics"]["irr_pct"],
                "cost_per_tco2e_inr": fin_solar["cost_per_tco2e_inr"],
                "implementation_months": 6,
                "mrv_complexity": "LOW",
                "confidence_tier": "CALIBRATED",
                "applicable_methodology": "BM EN01.001 (Grid-Connected Renewable Electricity)"
            })

        return opportunities
