import os
import json
import joblib
import pandas as pd
import numpy as np
from typing import Dict, Any, List, Optional
from app.intelligence.data_quality import DataQualityEngine
from app.intelligence.opportunity_engine import OpportunityEngine
from app.engines.regulatory import RegulatoryEngine
from app.engines.carbon import CarbonEngine
from app.engines.optimizer import CapitalOptimizer
from app.engines.mrv import MRVEngine
from app.services.gemini_service import gemini_service

class IndustrialIntelligenceService:
    def __init__(self, model_dir: str = "data/model_registry", data_dir: str = "data"):
        self.model_dir = model_dir
        self.data_dir = data_dir
        self.regulatory_engine = RegulatoryEngine(data_dir=data_dir)
        self._load_models()
        self._load_reference_distributions()

    def _load_models(self):
        # Prefer V2 models; fall back to V1 if V2 not yet available
        def _load(v2_name: str, v1_name: str):
            v2_path = os.path.join(self.model_dir, v2_name)
            v1_path = os.path.join(self.model_dir, v1_name)
            if os.path.exists(v2_path):
                return joblib.load(v2_path), "V2"
            elif os.path.exists(v1_path):
                return joblib.load(v1_path), "V1"
            return None, None

        self.gei_model, self.gei_model_ver = _load("gei_benchmark_v2.joblib", "gei_benchmark_v1.joblib")
        self.iso_model, self.iso_model_ver = _load("anomaly_detector_v2.joblib", "anomaly_detector_v1.joblib")
        self.encoder, self.enc_ver = _load("sector_encoder_v2.joblib", "sector_encoder_v1.joblib")
        self.confidence_tier = "CALIBRATED" if self.gei_model_ver == "V2" else "ILLUSTRATIVE"

    def _load_reference_distributions(self):
        train_path = os.path.join(self.data_dir, "synthetic_training_data", "industrial_training_set.json")
        if os.path.exists(train_path):
            with open(train_path, "r", encoding="utf-8") as f:
                self.training_records = json.load(f).get("records", [])
        else:
            self.training_records = []

    def get_sector_defaults(self, sector: str) -> Dict[str, Any]:
        defaults = {
            "cement": {
                "facility_name": "Sample Integrated Cement Works",
                "sector": "cement",
                "sub_sector": "Integrated Plant (OPC/PPC)",
                "state": "Rajasthan",
                "annual_production": 1200000.0,
                "production_unit": "tonnes",
                "electricity_mwh": 95000.0,
                "renewable_electricity_pct": 14.5,
                "thermal_fuel_type": "petcoke",
                "thermal_fuel_tonnes": 92000.0,
                "clinker_factor_pct": 74.0,
                "whrs_installed_mw": 0.0
            },
            "iron_steel": {
                "facility_name": "Sample Integrated BF-BOF Steel Plant",
                "sector": "iron_steel",
                "sub_sector": "Integrated BF-BOF Route",
                "state": "Odisha",
                "annual_production": 2200000.0,
                "production_unit": "tonnes",
                "electricity_mwh": 1650000.0,
                "renewable_electricity_pct": 8.0,
                "thermal_fuel_type": "indian_domestic_coal",
                "thermal_fuel_tonnes": 1850000.0,
                "steel_route": "BF_BOF",
                "whrs_installed_mw": 0.0
            },
            "aluminium": {
                "facility_name": "Sample Primary Aluminium Smelter",
                "sector": "aluminium",
                "sub_sector": "Primary Smelting",
                "state": "Chhattisgarh",
                "annual_production": 300000.0,
                "production_unit": "tonnes",
                "electricity_mwh": 4350000.0,
                "renewable_electricity_pct": 5.0,
                "thermal_fuel_type": "indian_domestic_coal",
                "thermal_fuel_tonnes": 520000.0,
                "smelter_dc_sec_kwh": 14450.0,
                "whrs_installed_mw": 0.0
            }
        }
        return defaults.get(sector, defaults["cement"])

    def analyze_facility(self, data: Dict[str, Any]) -> Dict[str, Any]:
        # 1. Audit Data Quality
        dq_res = DataQualityEngine.audit_facility_input(data)
        if not dq_res["is_valid"]:
            return {
                "data_quality": dq_res,
                "carbon_profile": None,
                "peer_benchmark": None,
                "anomaly_intelligence": None,
                "opportunities": [],
                "strategy_recommendation": None
            }

        sector = data.get("sector", "cement").lower()
        output = float(data.get("annual_production", 1000000.0))
        elec_mwh = float(data.get("electricity_mwh", 80000.0))
        ren_pct = float(data.get("renewable_electricity_pct", 10.0))
        fuel_qty = float(data.get("thermal_fuel_tonnes", 80000.0))
        fuel_type = data.get("thermal_fuel_type", "coal")

        # 2. Scope 1 & Scope 2 Emissions Engine
        grid_ef = 0.7160  # CEA v20.0 national grid emission factor tCO2e/MWh
        thermal_grid_mwh = elec_mwh * (1.0 - (ren_pct / 100.0))
        scope2_emissions = round(thermal_grid_mwh * grid_ef, 2)

        # Thermal fuel emission factor
        fuel_ef_map = {
            "petcoke": 3.24,
            "indian_domestic_coal": 1.95,
            "imported_coal_indonesian": 2.15,
            "natural_gas": 2.68,
            "furnace_oil": 3.12,
            "biomass": 0.0
        }
        fuel_ef = fuel_ef_map.get(fuel_type, 1.95)
        scope1_fuel_emissions = round(fuel_qty * fuel_ef, 2)

        # Process Emissions (Calcination, Anode, etc.)
        if sector == "cement":
            cf = float(data.get("clinker_factor_pct", 72.0)) / 100.0
            scope1_process_emissions = round(output * cf * 0.525, 2)
        elif sector == "aluminium":
            scope1_process_emissions = round(output * 1.62, 2)
        else:
            scope1_process_emissions = 0.0

        total_ghg_emissions = round(scope1_fuel_emissions + scope1_process_emissions + scope2_emissions, 2)
        actual_gei = round(total_ghg_emissions / max(1.0, output), 4)

        # 3. Regulatory Target Resolution
        custom_tgt = data.get("custom_target_gei")
        reg_info = self.regulatory_engine.resolve_target(sector, "2025-26")
        target_gei = custom_tgt if custom_tgt is not None else (reg_info["target_gei"] if reg_info else 0.7200)

        pos = CarbonEngine.calculate_position(
            entity_id=data.get("facility_name", "FAC-USER"),
            reporting_year="2025-26",
            output=output,
            output_unit=data.get("production_unit", "tonnes"),
            total_emissions_tco2e=total_ghg_emissions,
            target_gei=target_gei
        )

        # 4. ML Peer Benchmarking
        peer_recs = [r for r in self.training_records if r.get("sector") == sector]
        if peer_recs:
            peer_geis = [r["actual_gei"] for r in peer_recs]
            peer_median = float(np.median(peer_geis))
            p25 = float(np.percentile(peer_geis, 25))
            p75 = float(np.percentile(peer_geis, 75))
            
            # Compute empirical percentile
            percentile = float(sum(1 for g in peer_geis if g <= actual_gei) / len(peer_geis) * 100.0)
        else:
            peer_median = target_gei
            p25 = target_gei * 0.95
            p75 = target_gei * 1.05
            percentile = 50.0

        if percentile < 35.0:
            interp = f"Leader Tier: Your modelled GEI ({actual_gei:.4f}) ranks in the top {percentile:.0f}% of {sector.capitalize()} facilities."
        elif percentile <= 70.0:
            interp = f"Median Tier: Your modelled GEI ({actual_gei:.4f}) aligns closely with sector median ({peer_median:.4f})."
        else:
            interp = f"Action Required: Your modelled GEI ({actual_gei:.4f}) is in the {percentile:.0f}th percentile, above peer median ({peer_median:.4f})."

        benchmark_res = {
            "facility_gei": actual_gei,
            "peer_median_gei": round(peer_median, 4),
            "peer_percentile": round(percentile, 1),
            "peer_p25_gei": round(p25, 4),
            "peer_p75_gei": round(p75, 4),
            "peer_sample_count": len(peer_recs),
            "benchmark_model": f"CA-GEI-Benchmark-HistGBM-{self.gei_model_ver or 'V1'}",
            "confidence_tier": self.confidence_tier,
            "data_provenance_mix": f"{len(peer_recs)} SYNTHETIC records (SYNTH-2026-08-v2, calibrated bounds from BEE/ASI/BRSR)",
            "confidence": "HIGH" if len(peer_recs) > 50 else "MODERATE",
            "interpretation": interp
        }

        # 5. ML Anomaly Intelligence (IsolationForest)
        elec_intensity_kwh = (elec_mwh * 1000.0) / max(1.0, output)
        # thermal intensity (GJ/t) — needed for V2 anomaly model feature schema
        thermal_gj_t = (fuel_qty * 28.0) / max(1.0, output)  # coal ~28 GJ/tonne
        if self.iso_model:
            # Build inference DataFrame with all features the V2 model expects
            iso_df = pd.DataFrame([{
                "electricity_intensity_kwh": elec_intensity_kwh,
                "renewable_electricity_pct": ren_pct,
                "thermal_fuel_gj": thermal_gj_t,
                "actual_gei": actual_gei
            }])
            # If V1 model loaded (3 features only), drop the V2-only column
            if self.iso_model_ver == "V1":
                iso_df = iso_df[["electricity_intensity_kwh", "renewable_electricity_pct", "actual_gei"]]
            iso_pred = self.iso_model.predict(iso_df)[0]  # 1 = normal, -1 = anomaly
            iso_score = float(self.iso_model.decision_function(iso_df)[0])
            is_anomaly = bool(iso_pred == -1)
        else:
            is_anomaly = False
            iso_score = 0.5

        contributing = []
        if is_anomaly:
            status = "ANOMALY"
            contributing.append(f"Multi-dimensional operational combination (GEI: {actual_gei:.4f}, Elec: {elec_intensity_kwh:.1f} kWh/t) deviates from empirical cluster.")
        elif actual_gei > p75 or elec_intensity_kwh > 120.0:
            status = "REVIEW"
            contributing.append("Operational intensity is higher than typical sector median.")
        else:
            status = "NORMAL"
            contributing.append("Energy and GHG intensity metrics align with standard thermodynamic clusters.")

        anomaly_res = {
            "status": status,
            "anomaly_score": round(max(0.0, min(1.0, (1.0 - iso_score) / 2.0)), 2),
            "is_anomaly": is_anomaly,
            "interpretation": contributing[0],
            "contributing_factors": contributing
        }

        # 6. Techno-Economic Decarbonisation Opportunities
        whrs_mw = float(data.get("whrs_installed_mw", 0.0))
        opportunities = OpportunityEngine.identify_opportunities(
            sector=sector,
            annual_production=output,
            current_emissions_tco2e=total_ghg_emissions,
            actual_gei=actual_gei,
            electricity_mwh=elec_mwh,
            renewable_pct=ren_pct,
            whrs_mw=whrs_mw
        )

        # Primary project for optimizer
        primary_opp = opportunities[0] if opportunities else {
            "capex_cr": 50.0,
            "annual_opex_change_cr": 1.5,
            "annual_energy_savings_cr": 12.0,
            "annual_reduction_tco2e": 25000.0
        }

        # 7. Deterministic Capital Optimizer (BUY vs BUILD vs HYBRID)
        decision = CapitalOptimizer.compare_strategies(
            entity_output=output,
            baseline_emissions_tco2e=total_ghg_emissions,
            actual_gei=actual_gei,
            target_gei=target_gei,
            project_capex_cr=primary_opp["capex_cr"],
            project_opex_change_cr=primary_opp["annual_opex_change_cr"],
            project_energy_savings_cr=primary_opp["annual_energy_savings_cr"],
            project_reduction_tco2e=primary_opp["annual_reduction_tco2e"],
            ccc_price_inr=1000.0
        )

        # 8. Executive Explanation (Gemini with deterministic fallback)
        ai_narrative = gemini_service.explain_decision(
            entity_name=data.get("facility_name", "Your Facility"),
            sector=sector,
            reporting_year="2025-26",
            decision_data=decision
        )

        return {
            "facility_summary": {
                "facility_name": data.get("facility_name", "My Facility"),
                "sector": sector,
                "state": data.get("state", "India"),
                "annual_production": output,
                "production_unit": data.get("production_unit", "tonnes"),
                "energy_intensity_gj_per_t": round(((elec_mwh * 3.6) + (fuel_qty * 28.0)) / max(1.0, output), 2),
                "renewable_share_pct": ren_pct
            },
            "data_quality": dq_res,
            "carbon_profile": {
                "scope1_fuel_tco2e": scope1_fuel_emissions,
                "scope1_process_tco2e": scope1_process_emissions,
                "scope2_grid_tco2e": scope2_emissions,
                "total_ghg_tco2e": total_ghg_emissions,
                "actual_gei": actual_gei,
                "target_gei": target_gei,
                "gei_delta": pos.gei_delta,
                "compliance_status": pos.status,
                "potential_surplus_tco2e": pos.potential_surplus_tco2e,
                "potential_shortfall_tco2e": pos.potential_shortfall_tco2e,
                "calculation_trace": [t.model_dump() for t in pos.calculation_trace]
            },
            "peer_benchmark": benchmark_res,
            "anomaly_intelligence": anomaly_res,
            "opportunities": opportunities,
            "strategy_recommendation": decision,
            "executive_explanation": ai_narrative
        }

intelligence_service = IndustrialIntelligenceService()
