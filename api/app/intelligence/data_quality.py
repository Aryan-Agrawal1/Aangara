from typing import Dict, Any, List

class DataQualityEngine:
    SECTOR_RANGES = {
        "cement": {"gei": (0.45, 1.20), "elec_kwh_per_t": (50, 140), "clinker_factor": (45.0, 98.0)},
        "aluminium": {"gei": (10.0, 20.0), "elec_kwh_per_t": (12000, 17000)},
        "chlor_alkali": {"gei": (1.20, 2.50), "elec_kwh_per_t": (2000, 3200)},
        "pulp_paper": {"gei": (1.20, 3.20), "elec_kwh_per_t": (600, 1400)},
        "petrochemicals": {"gei": (0.70, 2.20), "elec_kwh_per_t": (400, 1100)},
        "petroleum_refinery": {"gei": (0.15, 0.50), "elec_kwh_per_t": (40, 120)},
        "iron_steel": {"gei": (1.60, 3.40), "elec_kwh_per_t": (400, 1200)},
        "textile": {"gei": (2.50, 7.50), "elec_kwh_per_t": (1000, 3500)},
        "fertiliser": {"gei": (0.35, 0.95), "elec_kwh_per_t": (80, 250)},
    }

    @staticmethod
    def audit_facility_input(data: Dict[str, Any]) -> Dict[str, Any]:
        errors = []
        warnings = []
        info = []
        score = 100.0

        sector = data.get("sector", "").lower()
        output = data.get("annual_production", 0.0)
        elec_mwh = data.get("electricity_mwh", 0.0)
        renewable_pct = data.get("renewable_electricity_pct", 0.0)
        fuel_qty = data.get("thermal_fuel_tonnes", 0.0)
        fuel_type = data.get("thermal_fuel_type", "coal")

        # 1. Mandatory & Non-Negative Checks
        if not sector:
            errors.append("Sector is required.")
            score -= 40.0
        if output <= 0:
            errors.append("Annual production output must be greater than zero.")
            score -= 40.0

        if elec_mwh < 0:
            errors.append("Electricity consumption cannot be negative.")
            score -= 20.0
        if fuel_qty < 0:
            errors.append("Fuel quantity cannot be negative.")
            score -= 20.0
        if renewable_pct < 0 or renewable_pct > 100:
            errors.append("Renewable electricity percentage must be between 0% and 100%.")
            score -= 15.0

        # 2. Activity Consistency Checks
        if output > 0 and elec_mwh == 0 and fuel_qty == 0:
            errors.append("Both electricity and thermal fuel quantities are zero for operational facility.")
            score -= 35.0

        # 3. Sector Thermodynamic Sanity Ranges
        if sector in DataQualityEngine.SECTOR_RANGES and output > 0:
            ranges = DataQualityEngine.SECTOR_RANGES[sector]
            elec_intensity_kwh = (elec_mwh * 1000.0) / output if output > 0 else 0

            if "elec_kwh_per_t" in ranges:
                min_e, max_e = ranges["elec_kwh_per_t"]
                if elec_intensity_kwh < min_e * 0.5:
                    warnings.append(f"Electricity intensity ({elec_intensity_kwh:.1f} kWh/unit) is unusually low for {sector.capitalize()} (typical: {min_e}-{max_e} kWh/unit).")
                    score -= 10.0
                elif elec_intensity_kwh > max_e * 2.0:
                    warnings.append(f"Electricity intensity ({elec_intensity_kwh:.1f} kWh/unit) is significantly higher than industry benchmark (typical: {min_e}-{max_e} kWh/unit).")
                    score -= 10.0

        # 4. Sector-Specific Process Checks
        if sector == "cement":
            cf = data.get("clinker_factor_pct", 72.0)
            if cf < 40.0 or cf > 98.0:
                warnings.append(f"Reported clinker factor ({cf:.1f}%) is outside typical industrial range (45% - 98%).")
                score -= 8.0

        status = "PASS" if not errors and score >= 80.0 else ("WARNING" if not errors else "BLOCKING_ERROR")
        final_score = max(0.0, min(100.0, round(score, 1)))

        return {
            "status": status,
            "quality_score": final_score,
            "errors": errors,
            "warnings": warnings,
            "info": info,
            "is_valid": len(errors) == 0,
            "data_category": "USER_SUBMITTED_VALIDATED"
        }
