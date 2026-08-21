"""
CarbonAlpha — Central Unit Registry
====================================
Standardizes all physical and financial units across engine boundaries.
Defines canonical symbols, conversion factors, dimensional groups, and validation.
"""

from typing import Dict, Any, Optional

class UnitRegistry:
    # ── Unit Definitions & Canonical Representations ──
    MASS_UNITS = {
        "kg": {"name": "Kilogram", "to_tonnes": 0.001, "canonical": "kg"},
        "t": {"name": "Metric Tonne", "to_tonnes": 1.0, "canonical": "tonnes"},
        "tonnes": {"name": "Metric Tonne", "to_tonnes": 1.0, "canonical": "tonnes"},
        "kt": {"name": "Kilo Tonne (1,000 tonnes)", "to_tonnes": 1000.0, "canonical": "kt"},
        "mt": {"name": "Million Tonnes", "to_tonnes": 1000000.0, "canonical": "Mt"},
    }

    ENERGY_ELECTRICAL_UNITS = {
        "kwh": {"name": "Kilowatt Hour", "to_mwh": 0.001, "canonical": "kWh"},
        "mwh": {"name": "Megawatt Hour", "to_mwh": 1.0, "canonical": "MWh"},
        "gwh": {"name": "Gigawatt Hour", "to_mwh": 1000.0, "canonical": "GWh"},
    }

    ENERGY_THERMAL_UNITS = {
        "kcal": {"name": "Kilocalorie", "to_gj": 4.184e-6, "canonical": "kcal"},
        "gj": {"name": "Gigajoule", "to_gj": 1.0, "canonical": "GJ"},
        "tj": {"name": "Terajoule", "to_gj": 1000.0, "canonical": "TJ"},
    }

    EMISSION_UNITS = {
        "tco2e": {"name": "Tonnes of CO2 Equivalent", "canonical": "tCO2e"},
        "ktco2e": {"name": "Kilo Tonnes CO2 Equivalent", "canonical": "ktCO2e"},
        "mtco2e": {"name": "Million Tonnes CO2 Equivalent", "canonical": "MtCO2e"},
    }

    GEI_INTENSITY_UNITS = {
        "tco2e/t": "tCO2e/t",
        "tco2e/t-cement": "tCO2e/t-cement",
        "tco2e/t-aluminium": "tCO2e/t-aluminium",
        "tco2e/t-steel": "tCO2e/t-steel",
        "tco2e/t-naoh": "tCO2e/t-NaOH",
        "tco2e/t-paper": "tCO2e/t-paper",
        "tco2e/t-crude": "tCO2e/t-crude",
        "tco2e/t-textile": "tCO2e/t-textile",
    }

    CURRENCY_UNITS = {
        "inr": {"symbol": "\u20b9", "name": "Indian Rupee", "canonical": "INR"},
        "inr_cr": {"symbol": "\u20b9 Cr", "name": "Crore INR (10 Million)", "canonical": "\u20b9 Crore"},
        "inr_lakh": {"symbol": "\u20b9 Lakh", "name": "Lakh INR (100,000)", "canonical": "\u20b9 Lakh"},
        "inr_per_tco2e": {"symbol": "\u20b9/tCO2e", "name": "INR per Tonne CO2e", "canonical": "\u20b9/tCO2e"},
    }

    @classmethod
    def convert_mass(cls, value: float, from_unit: str, to_unit: str = "tonnes") -> float:
        """Convert any mass value to target unit (default: tonnes)."""
        f = from_unit.lower()
        t = to_unit.lower()
        if f not in cls.MASS_UNITS or t not in cls.MASS_UNITS:
            return value
        val_in_tonnes = value * cls.MASS_UNITS[f]["to_tonnes"]
        return val_in_tonnes / cls.MASS_UNITS[t]["to_tonnes"]

    @classmethod
    def convert_electricity(cls, value: float, from_unit: str, to_unit: str = "mwh") -> float:
        """Convert electricity value to target unit (default: MWh)."""
        f = from_unit.lower()
        t = to_unit.lower()
        if f not in cls.ENERGY_ELECTRICAL_UNITS or t not in cls.ENERGY_ELECTRICAL_UNITS:
            return value
        val_in_mwh = value * cls.ENERGY_ELECTRICAL_UNITS[f]["to_mwh"]
        return val_in_mwh / cls.ENERGY_ELECTRICAL_UNITS[t]["to_mwh"]

    @classmethod
    def format_gei_unit(cls, sector: str) -> str:
        """Return canonical GEI unit for a given CCTS sector."""
        sector_map = {
            "cement": "tCO2e/t-cement",
            "aluminium": "tCO2e/t-aluminium",
            "iron_steel": "tCO2e/t-steel",
            "chlor_alkali": "tCO2e/t-NaOH",
            "pulp_paper": "tCO2e/t-paper",
            "petroleum_refinery": "tCO2e/t-crude",
            "petrochemicals": "tCO2e/t-output",
            "textile": "tCO2e/t-textile",
            "fertiliser": "tCO2e/t-ammonia",
        }
        return sector_map.get(sector.lower(), "tCO2e/t-output")


unit_registry = UnitRegistry()
