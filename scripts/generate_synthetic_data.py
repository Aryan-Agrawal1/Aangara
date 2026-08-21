"""
CarbonAlpha — Calibrated Synthetic Data Generator v2
=====================================================
Dataset ID: SYNTH-2026-08-v2
Generator version: scripts/generate_synthetic_data.py v2

Architecture (per master spec Phase 6):
  1. Draws production/energy/fuel parameters from calibrated distributions
     BOUNDED by real sector-level ranges from ASI/CEA/BRSR public aggregates.
  2. Derives GEI and emissions from the SAME deterministic equations in carbon.py
     — never invents a final answer independently.
  3. Adds genuine, documented sector-specific noise/variance (log-normal σ per parameter)
     so ML cannot trivially memorize the closed-form relationship.
  4. Validates output against domain constraints.
  5. Enforces FACILITY-LEVEL train/holdout split (no facility's records in both).
  6. Writes SYNTH-2026-08-v2 provenance tag.

Real calibration sources (used for distribution bounds):
  - ASI (Annual Survey of Industries) energy intensity aggregates
  - CEA Grid Emission Factor database (national, FY2023-24)
  - BEE Detailed Compliance Procedure v1.0 (Jul 2024) — formula reference
  - BRSR Core sector-level disclosures (large obligated entities, public)
  - MoEFCC CCTS GEI notification target ranges (G.S.R. 25(E))
"""

import json
import os
import random
import math
import sys
from typing import Dict, List, Tuple, Any

# ─────────────────────────────────────────────────────────────────────────────
# CALIBRATED SECTOR PARAMETERS
# All ranges are calibrated against real-world sector benchmarks.
# Sources documented inline. Units: production (kt/yr), electricity (kWh/t),
# heat (GJ/t), renewable_pct (0-100), GEI (tCO2e/t output)
# ─────────────────────────────────────────────────────────────────────────────
SECTOR_PARAMS = {
    "cement": {
        "display_name": "Cement",
        "subsectors": ["integrated_plant", "grinding_unit"],
        "production_kt": (200, 5000),          # Real: Indian cement plants 0.3–6 Mt/yr (CMA 2024)
        "electricity_kwh_t": (70, 130),         # Real: BEE PAT cycle data 80–120 kWh/t clinker
        "thermal_gj_t": (3.0, 4.5),            # Real: BEE 3.1–4.2 GJ/t clinker (BEE DCP v1.0)
        "renewable_pct": (5, 35),               # Real: BRSR large cement cos 8–32%
        "clinker_factor": (0.68, 0.90),         # Real: Indian average ~0.75 (CII cement report)
        "gei_target_range": (0.58, 0.80),       # Real: G.S.R. 25(E) target GEI band
        "noise_sigma": 0.08,                    # Calibrated: genuine plant-to-plant variance
        "gei_unit": "tCO2e/t-cement",
        "calibration_source": "BEE DCP v1.0, CMA 2024, BEE PAT Cycle data, G.S.R. 25(E)"
    },
    "aluminium": {
        "display_name": "Aluminium",
        "subsectors": ["primary_smelter", "secondary_smelter"],
        "production_kt": (50, 800),             # Real: Hindalco/Vedanta ~500–800 kt/yr
        "electricity_kwh_t": (13000, 16500),    # Real: Hall-Héroult process 13,500–16,000 kWh/t (BRSR)
        "thermal_gj_t": (1.5, 4.0),
        "renewable_pct": (3, 25),
        "noise_sigma": 0.07,
        "gei_target_range": (5.5, 8.5),        # Real: G.S.R. 25(E) aluminium GEI range
        "gei_unit": "tCO2e/t-aluminium",
        "calibration_source": "IEA Aluminium 2024, G.S.R. 25(E), BRSR disclosures Hindalco/Vedanta"
    },
    "chlor_alkali": {
        "display_name": "Chlor-Alkali",
        "subsectors": ["membrane_cell", "diaphragm_cell"],
        "production_kt": (30, 400),             # Real: Indian chlor-alkali market ~3 Mt NaOH/yr total
        "electricity_kwh_t": (1900, 3200),      # Real: membrane 2,200 / diaphragm 2,900 kWh/t NaOH
        "thermal_gj_t": (1.0, 2.5),
        "renewable_pct": (2, 20),
        "noise_sigma": 0.09,
        "gei_target_range": (0.8, 1.8),
        "gei_unit": "tCO2e/t-NaOH",
        "calibration_source": "BEE DCP v1.0, Euro Chlor benchmarks adapted for India, G.S.R. 25(E)"
    },
    "pulp_paper": {
        "display_name": "Pulp & Paper",
        "subsectors": ["integrated_pulp_paper", "paper_only"],
        "production_kt": (20, 500),
        "electricity_kwh_t": (600, 1400),       # Real: BEE PAT paper sector data
        "thermal_gj_t": (8.0, 18.0),           # Real: high steam demand in pulping
        "renewable_pct": (10, 60),              # Real: biomass/bagasse use is high
        "noise_sigma": 0.10,
        "gei_target_range": (0.8, 2.0),
        "gei_unit": "tCO2e/t-paper",
        "calibration_source": "BEE PAT Cycle paper sector, IPPC Reference Document, G.S.R. 25(E)"
    },
    "petrochemicals": {
        "display_name": "Petrochemicals",
        "subsectors": ["cracker_complex", "polymer_plant"],
        "production_kt": (100, 2000),
        "electricity_kwh_t": (400, 900),
        "thermal_gj_t": (5.0, 12.0),
        "renewable_pct": (1, 15),
        "noise_sigma": 0.09,
        "gei_target_range": (0.5, 1.5),
        "gei_unit": "tCO2e/t-output",
        "calibration_source": "BEE DCP v1.0, IEA Petrochemicals 2024, G.S.R. 25(E)"
    },
    "petroleum_refinery": {
        "display_name": "Petroleum Refinery",
        "subsectors": ["simple_refinery", "complex_refinery"],
        "production_kt": (500, 10000),          # Real: Indian refineries 5–20 MT/yr
        "electricity_kwh_t": (30, 80),
        "thermal_gj_t": (2.0, 4.5),
        "renewable_pct": (1, 10),
        "noise_sigma": 0.07,
        "gei_target_range": (0.12, 0.30),       # Real: GEI per tonne crude processed
        "gei_unit": "tCO2e/t-crude",
        "calibration_source": "BEE DCP v1.0, IOCL/BPCL BRSR disclosures, G.S.R. 25(E)"
    },
    "textile": {
        "display_name": "Textile",
        "subsectors": ["composite_mill", "spinning_unit"],
        "production_kt": (5, 150),
        "electricity_kwh_t": (3500, 8000),      # Real: spinning very electricity-intensive
        "thermal_gj_t": (15.0, 35.0),
        "renewable_pct": (5, 40),
        "noise_sigma": 0.12,
        "gei_target_range": (2.5, 6.0),
        "gei_unit": "tCO2e/t-textile",
        "calibration_source": "BEE DCP v1.0, TUFS data, G.S.R. 25(E)"
    },
    "iron_steel": {
        "display_name": "Iron & Steel",
        "subsectors": ["bf_bof", "dri_eaf", "pellet_plant"],
        "production_kt": (200, 8000),           # Real: SAIL/JSW/Tata 5–25 Mt/yr
        "electricity_kwh_t": (300, 900),
        "thermal_gj_t": (10.0, 22.0),          # Real: BF-BOF ~18-20 GJ/t, DRI-EAF ~10-15 GJ/t
        "renewable_pct": (1, 15),
        "noise_sigma": 0.08,
        "gei_target_range": (1.8, 3.2),        # Real: draft G.S.R. 517(E) GEI bands
        "gei_unit": "tCO2e/t-steel",
        "regulatory_status": "DRAFT",          # DISC-06: still DRAFT as of 2026-08-21
        "calibration_source": "Draft G.S.R. 517(E), BRSR Tata Steel/JSW Steel, worldsteel 2023"
    }
}

# CEA national grid emission factor (CEA, FY2023-24)
CEA_GRID_EF = 0.716  # tCO2e/MWh → 0.000716 tCO2e/kWh

# Coal emission factor (Indian thermal coal, BEE DCP v1.0)
COAL_EF_TCO2_PER_GJ = 0.0904  # tCO2e/GJ

# Fuel oil / natural gas blend factor
FUEL_OIL_EF = 0.0789  # tCO2e/GJ (fuel oil, BEE)


def _clamp(value: float, lo: float, hi: float) -> float:
    return max(lo, min(hi, value))


def _log_normal_sample(rng: random.Random, mean: float, sigma_frac: float) -> float:
    """Sample from a log-normal distribution with given mean and fractional sigma."""
    # Convert to log-space parameters
    sigma = sigma_frac
    mu = math.log(mean) - 0.5 * sigma ** 2
    # Box-Muller transform
    u1 = rng.random()
    u2 = rng.random()
    z = math.sqrt(-2 * math.log(max(u1, 1e-10))) * math.cos(2 * math.pi * u2)
    return math.exp(mu + sigma * z)


def _uniform_in(rng: random.Random, lo: float, hi: float) -> float:
    return rng.uniform(lo, hi)


def _generate_facility_record(
    rng: random.Random,
    sector_id: str,
    facility_idx: int,
    params: Dict
) -> Dict[str, Any]:
    """
    Generate ONE facility operating record using calibrated distributions
    and the same deterministic GEI equations as carbon.py.
    """
    prod_lo, prod_hi = params["production_kt"]
    # Production: log-normal centred on geometric mean of range
    prod_mean = math.sqrt(prod_lo * prod_hi)
    production_kt = _clamp(
        _log_normal_sample(rng, prod_mean, params["noise_sigma"]),
        prod_lo * 0.7, prod_hi * 1.3
    )

    # Electricity intensity: uniform + log-normal noise
    elec_lo, elec_hi = params["electricity_kwh_t"]
    elec_base = _uniform_in(rng, elec_lo, elec_hi)
    electricity_kwh_t = _clamp(
        elec_base * _log_normal_sample(rng, 1.0, params["noise_sigma"] * 0.5),
        elec_lo * 0.85, elec_hi * 1.15
    )

    # Thermal / heat intensity
    heat_lo, heat_hi = params["thermal_gj_t"]
    heat_base = _uniform_in(rng, heat_lo, heat_hi)
    thermal_gj_t = _clamp(
        heat_base * _log_normal_sample(rng, 1.0, params["noise_sigma"] * 0.5),
        heat_lo * 0.85, heat_hi * 1.15
    )

    # Renewable share
    ren_lo, ren_hi = params["renewable_pct"]
    renewable_pct = _clamp(_uniform_in(rng, ren_lo, ren_hi) + rng.gauss(0, 3), ren_lo, ren_hi)

    # Subsector
    subsector = rng.choice(params["subsectors"])

    # ── Deterministic GEI calculation (mirrors carbon.py) ──
    grid_ef = CEA_GRID_EF  # tCO2e/MWh
    thermal_ef = COAL_EF_TCO2_PER_GJ

    # Scope 2 (purchased electricity): kWh/t → MWh/t → tCO2e/t
    scope2_tco2_t = (electricity_kwh_t / 1000.0) * grid_ef * (1 - renewable_pct / 100.0)

    # Scope 1 (on-site combustion): GJ/t → tCO2e/t
    scope1_tco2_t = thermal_gj_t * thermal_ef

    # Total GEI (tCO2e per tonne of output)
    gei_raw = scope1_tco2_t + scope2_tco2_t

    # Add genuine measurement/reporting noise (±noise_sigma of GEI value)
    gei_noise = rng.gauss(0, params["noise_sigma"] * 0.4)
    actual_gei = max(0.01, gei_raw * (1.0 + gei_noise))

    # Clamp to plausible sector range (not a hard limit — just prevents extreme outliers)
    gei_lo, gei_hi = params["gei_target_range"]
    # Allow 30% above the "typical" target range — outliers are real
    actual_gei = _clamp(actual_gei, gei_lo * 0.5, gei_hi * 2.5)

    # Absolute emissions (tCO2e/yr)
    total_scope1 = scope1_tco2_t * production_kt * 1000  # production_kt → tonnes
    total_scope2 = scope2_tco2_t * production_kt * 1000
    total_emissions = total_scope1 + total_scope2

    # Target GEI (from target range, with noise — represents the regulatory trajectory)
    target_gei = _clamp(
        _uniform_in(rng, gei_lo, gei_hi) * _log_normal_sample(rng, 1.0, 0.03),
        gei_lo * 0.9, gei_hi * 1.05
    )

    surplus_shortfall = (target_gei - actual_gei) * production_kt * 1000  # tCO2e/yr (+ = surplus)

    facility_id = f"SYN-{sector_id[:3].upper()}-F{facility_idx:03d}"

    record = {
        "facility_id": facility_id,
        "sector": sector_id,
        "subsector": subsector,
        "data_status": "SYNTHETIC",
        "dataset_provenance_id": "SYNTH-2026-08-v2",
        "generator_version": "scripts/generate_synthetic_data.py v2",
        "annual_production_kt": round(production_kt, 2),
        "electricity_intensity_kwh_t": round(electricity_kwh_t, 1),
        "thermal_intensity_gj_t": round(thermal_gj_t, 3),
        "renewable_electricity_pct": round(renewable_pct, 1),
        "scope1_emissions_tco2e": round(total_scope1, 0),
        "scope2_emissions_tco2e": round(total_scope2, 0),
        "total_emissions_tco2e": round(total_emissions, 0),
        "actual_gei": round(actual_gei, 4),
        "target_gei": round(target_gei, 4),
        "gei_unit": params.get("gei_unit", "tCO2e/t-output"),
        "surplus_shortfall_tco2e": round(surplus_shortfall, 0),
        "gei_trajectory_status": "SURPLUS" if surplus_shortfall > 0 else "SHORTFALL",
        "calculation_note": "GEI derived from deterministic scope1+scope2 equations (mirrors carbon.py) with log-normal noise. Not independently invented."
    }
    return record


def generate_dataset(
    n_facilities: int = 120,
    records_per_facility: int = 16,
    holdout_facilities: int = 20,
    seed: int = 2026
) -> Tuple[List[Dict], List[Dict]]:
    """
    Generate a calibrated synthetic dataset with facility-level train/holdout split.
    Returns (train_records, holdout_records).
    """
    rng = random.Random(seed)
    sectors = list(SECTOR_PARAMS.keys())

    # Assign facilities to sectors (roughly equal distribution)
    facilities = []
    per_sector = n_facilities // len(sectors)
    extra = n_facilities % len(sectors)

    facility_idx = 1
    for i, sector_id in enumerate(sectors):
        count = per_sector + (1 if i < extra else 0)
        for _ in range(count):
            facilities.append((facility_idx, sector_id))
            facility_idx += 1

    rng.shuffle(facilities)

    # Facility-level split — no facility's records appear in both splits
    holdout_fac_ids = set(fac[0] for fac in facilities[:holdout_facilities])
    train_facilities = [f for f in facilities if f[0] not in holdout_fac_ids]
    holdout_facilities_list = [f for f in facilities if f[0] in holdout_fac_ids]

    train_records = []
    for fac_idx, sector_id in train_facilities:
        params = SECTOR_PARAMS[sector_id]
        fac_rng = random.Random(seed + fac_idx * 1000)
        for year in range(records_per_facility):
            rec = _generate_facility_record(fac_rng, sector_id, fac_idx, params)
            rec["year_offset"] = year  # 0=earliest, up to records_per_facility-1
            train_records.append(rec)

    holdout_records = []
    for fac_idx, sector_id in holdout_facilities_list:
        params = SECTOR_PARAMS[sector_id]
        fac_rng = random.Random(seed + fac_idx * 1000)
        for year in range(records_per_facility):
            rec = _generate_facility_record(fac_rng, sector_id, fac_idx, params)
            rec["year_offset"] = year
            holdout_records.append(rec)

    return train_records, holdout_records


def validate_dataset(records: List[Dict]) -> List[str]:
    """Validate all records against domain constraints. Returns list of error strings."""
    errors = []
    for rec in records:
        fid = rec.get("facility_id", "?")
        if rec.get("annual_production_kt", 0) <= 0:
            errors.append(f"{fid}: production <= 0")
        if rec.get("actual_gei", -1) < 0:
            errors.append(f"{fid}: actual_gei < 0")
        if rec.get("total_emissions_tco2e", -1) < 0:
            errors.append(f"{fid}: total_emissions < 0")
        if not (0 <= rec.get("renewable_electricity_pct", -1) <= 100):
            errors.append(f"{fid}: renewable_pct out of range")
    return errors


if __name__ == "__main__":
    print("CarbonAlpha Synthetic Data Generator v2 (Calibrated)")
    print("=" * 60)

    train_records, holdout_records = generate_dataset(
        n_facilities=120,
        records_per_facility=16,
        holdout_facilities=20,
        seed=2026
    )

    # Validate
    all_errors = validate_dataset(train_records) + validate_dataset(holdout_records)
    if all_errors:
        print(f"VALIDATION ERRORS: {len(all_errors)}")
        for e in all_errors[:10]:
            print(f"  {e}")
        sys.exit(1)
    else:
        print(f"Validation passed: 0 errors")

    print(f"Train records  : {len(train_records)}")
    print(f"Holdout records: {len(holdout_records)}")

    # Write output
    os.makedirs("data/synthetic_training_data", exist_ok=True)
    os.makedirs("data/validation_holdout", exist_ok=True)

    with open("data/synthetic_training_data/industrial_training_set.json", "w", encoding="utf-8") as f:
        json.dump({
            "dataset_id": "SYNTH-2026-08-v2",
            "generated_at": "2026-08-21",
            "generator_version": "scripts/generate_synthetic_data.py v2",
            "seed": 2026,
            "n_facilities": 120,
            "records_per_facility": 16,
            "total_records": len(train_records),
            "holdout_facility_count": 20,
            "split_method": "FACILITY_LEVEL",
            "calibration_sources": [
                "BEE DCP v1.0 (Jul 2024)",
                "CEA Grid Emission Factor FY2023-24 (0.716 tCO2e/MWh)",
                "MoEFCC G.S.R. 25(E) sector GEI target ranges",
                "ASI energy intensity aggregates",
                "BRSR Core public disclosures"
            ],
            "records": train_records
        }, f, indent=2, ensure_ascii=False)

    with open("data/validation_holdout/holdout_set.json", "w", encoding="utf-8") as f:
        json.dump({
            "dataset_id": "HOLDOUT-2026-08-v2",
            "generated_at": "2026-08-21",
            "generator_version": "scripts/generate_synthetic_data.py v2",
            "seed": 2026,
            "total_records": len(holdout_records),
            "split_method": "FACILITY_LEVEL",
            "note": "No facilities from this set appear in training set (facility-level split enforced)",
            "records": holdout_records
        }, f, indent=2, ensure_ascii=False)

    print("Datasets written to data/synthetic_training_data/ and data/validation_holdout/")
    print("Next step: run scripts/train_models.py to retrain CA-GEI-BENCHMARK-V2")
