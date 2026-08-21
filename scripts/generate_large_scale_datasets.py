"""
CarbonAlpha — 250,000-Row Calibrated Industrial Dataset Generator (28k per sector)
===================================================================================
Generates 25,000–30,000 completely unique, realistically randomized records per sector
across all 9 Indian CCTS compliance and watchlist sectors:
  1. Cement (Integrated & Grinding)
  2. Iron & Steel (BF-BOF, DRI-EAF, Pellet) — Draft G.S.R. 517(E)
  3. Aluminium (Primary Smelter, Secondary Smelter)
  4. Chlor-Alkali (Membrane Cell, Diaphragm Cell)
  5. Pulp & Paper (Integrated Chemical Pulp, Paper-only)
  6. Petrochemicals (Dual-feed Cracker, Polymer Unit)
  7. Petroleum Refinery (Simple, Complex Coastal)
  8. Textile (Composite Mills, Spinning Units)
  9. Fertiliser (Ammonia-Urea Complex, NPK)

Total scale: ~252,000 records (28,000 per sector).
Facility-level train/holdout split: 225,000 train (25k/sec) vs. 27,000 holdout (3k/sec) with 0% leakage.
Exports to Parquet and CSV for high performance and fast exchange.
"""

import os
import sys
import math
import json
import time
import numpy as np
import pandas as pd

# CEA National Grid Emission Factor (FY2023-24)
CEA_GRID_EF = 0.7160  # tCO2e/MWh

# Fuel emission factors (tCO2e per GJ / per tonne)
FUEL_EMISSION_FACTORS = {
    "petcoke": {"tco2_per_t": 3.24, "gj_per_t": 32.5, "ef_gj": 0.0997},
    "indian_domestic_coal": {"tco2_per_t": 1.95, "gj_per_t": 20.0, "ef_gj": 0.0975},
    "imported_coal_indonesian": {"tco2_per_t": 2.15, "gj_per_t": 23.0, "ef_gj": 0.0935},
    "natural_gas": {"tco2_per_t": 2.68, "gj_per_t": 48.0, "ef_gj": 0.0558},
    "furnace_oil": {"tco2_per_t": 3.12, "gj_per_t": 40.0, "ef_gj": 0.0780},
    "biomass": {"tco2_per_t": 0.00, "gj_per_t": 15.0, "ef_gj": 0.0000},
}

SECTOR_CONFIGS = {
    "cement": {
        "display_name": "Cement",
        "subsectors": ["integrated_dry_process", "grinding_unit", "blended_cement_plant"],
        "fuels": ["petcoke", "imported_coal_indonesian", "indian_domestic_coal", "biomass"],
        "fuel_weights": [0.45, 0.30, 0.15, 0.10],
        "prod_range_kt": (300, 4500),
        "elec_kwh_range": (68, 125),
        "thermal_gj_range": (2.9, 4.4),
        "renewable_pct_range": (4, 38),
        "clinker_factor_range": (0.65, 0.88),
        "process_ef": 0.525,  # tCO2/t clinker calcination
        "target_gei_range": (0.5800, 0.7800),
        "noise_sigma": 0.075,
        "gei_unit": "tCO2e/t-cement"
    },
    "iron_steel": {
        "display_name": "Iron & Steel",
        "subsectors": ["bf_bof_integrated", "dri_eaf", "dri_if", "pellet_plant"],
        "fuels": ["indian_domestic_coal", "imported_coal_indonesian", "natural_gas"],
        "fuel_weights": [0.60, 0.25, 0.15],
        "prod_range_kt": (400, 7500),
        "elec_kwh_range": (350, 950),
        "thermal_gj_range": (11.0, 23.0),
        "renewable_pct_range": (2, 18),
        "process_ef": 0.0,
        "target_gei_range": (1.8000, 3.1000),
        "noise_sigma": 0.080,
        "gei_unit": "tCO2e/t-steel"
    },
    "aluminium": {
        "display_name": "Aluminium",
        "subsectors": ["primary_smelter", "alumina_refinery", "integrated_smelter_refinery"],
        "fuels": ["indian_domestic_coal", "imported_coal_indonesian", "natural_gas"],
        "fuel_weights": [0.70, 0.20, 0.10],
        "prod_range_kt": (80, 850),
        "elec_kwh_range": (13200, 16200),
        "thermal_gj_range": (1.5, 4.2),
        "renewable_pct_range": (3, 22),
        "process_ef": 1.62,  # Anode consumption & PFC
        "target_gei_range": (5.6000, 8.4000),
        "noise_sigma": 0.065,
        "gei_unit": "tCO2e/t-aluminium"
    },
    "chlor_alkali": {
        "display_name": "Chlor-Alkali",
        "subsectors": ["bipolar_membrane_cell", "monopolar_membrane", "diaphragm_cell"],
        "fuels": ["natural_gas", "furnace_oil", "indian_domestic_coal"],
        "fuel_weights": [0.55, 0.25, 0.20],
        "prod_range_kt": (40, 380),
        "elec_kwh_range": (2050, 3150),
        "thermal_gj_range": (1.0, 2.8),
        "renewable_pct_range": (4, 25),
        "process_ef": 0.0,
        "target_gei_range": (0.8500, 1.7500),
        "noise_sigma": 0.085,
        "gei_unit": "tCO2e/t-NaOH"
    },
    "pulp_paper": {
        "display_name": "Pulp & Paper",
        "subsectors": ["integrated_chemical_pulp", "recycled_fiber_paper", "specialty_paperboard"],
        "fuels": ["biomass", "indian_domestic_coal", "imported_coal_indonesian"],
        "fuel_weights": [0.50, 0.35, 0.15],
        "prod_range_kt": (30, 480),
        "elec_kwh_range": (580, 1380),
        "thermal_gj_range": (8.5, 17.5),
        "renewable_pct_range": (12, 65),
        "process_ef": 0.0,
        "target_gei_range": (0.8200, 1.9500),
        "noise_sigma": 0.095,
        "gei_unit": "tCO2e/t-paper"
    },
    "petrochemicals": {
        "display_name": "Petrochemicals",
        "subsectors": ["dual_feed_cracker", "naphtha_cracker", "gas_cracker_polymers"],
        "fuels": ["natural_gas", "furnace_oil", "imported_coal_indonesian"],
        "fuel_weights": [0.70, 0.20, 0.10],
        "prod_range_kt": (150, 1900),
        "elec_kwh_range": (420, 880),
        "thermal_gj_range": (5.2, 11.8),
        "renewable_pct_range": (2, 16),
        "process_ef": 0.0,
        "target_gei_range": (0.5200, 1.4500),
        "noise_sigma": 0.085,
        "gei_unit": "tCO2e/t-output"
    },
    "petroleum_refinery": {
        "display_name": "Petroleum Refinery",
        "subsectors": ["high_complexity_coastal", "inland_refinery", "lube_specialty_refinery"],
        "fuels": ["natural_gas", "furnace_oil", "imported_coal_indonesian"],
        "fuel_weights": [0.65, 0.25, 0.10],
        "prod_range_kt": (800, 9500),
        "elec_kwh_range": (32, 78),
        "thermal_gj_range": (2.1, 4.4),
        "renewable_pct_range": (1, 12),
        "process_ef": 0.0,
        "target_gei_range": (0.1300, 0.2900),
        "noise_sigma": 0.070,
        "gei_unit": "tCO2e/t-crude"
    },
    "textile": {
        "display_name": "Textile",
        "subsectors": ["composite_wet_processing", "spinning_only", "weaving_dyeing"],
        "fuels": ["biomass", "indian_domestic_coal", "natural_gas"],
        "fuel_weights": [0.45, 0.40, 0.15],
        "prod_range_kt": (8, 140),
        "elec_kwh_range": (3600, 7800),
        "thermal_gj_range": (14.0, 34.0),
        "renewable_pct_range": (8, 45),
        "process_ef": 0.0,
        "target_gei_range": (2.4000, 5.8000),
        "noise_sigma": 0.110,
        "gei_unit": "tCO2e/t-textile"
    },
    "fertiliser": {
        "display_name": "Fertiliser",
        "subsectors": ["ammonia_urea_integrated", "complex_npk_fertiliser"],
        "fuels": ["natural_gas", "imported_coal_indonesian", "furnace_oil"],
        "fuel_weights": [0.80, 0.15, 0.05],
        "prod_range_kt": (200, 2200),
        "elec_kwh_range": (150, 420),
        "thermal_gj_range": (22.0, 32.0),
        "renewable_pct_range": (2, 15),
        "process_ef": 0.0,
        "target_gei_range": (1.7500, 2.6500),
        "noise_sigma": 0.075,
        "gei_unit": "tCO2e/t-ammonia"
    }
}

STATES = [
    "Rajasthan", "Gujarat", "Odisha", "Chhattisgarh", "Maharashtra",
    "Tamil Nadu", "Andhra Pradesh", "Madhya Pradesh", "Jharkhand", "Punjab",
    "Uttar Pradesh", "Karnataka", "West Bengal", "Haryana"
]


def generate_sector_partition(
    sector: str,
    cfg: Dict,
    n_facilities: int = 1400,
    records_per_facility: int = 20,
    seed: int = 2026
) -> pd.DataFrame:
    """
    Vectorized, randomized generator for ONE sector producing 28,000 unique records.
    """
    rng = np.random.default_rng(seed)
    total_records = n_facilities * records_per_facility

    # Generate facility base parameters
    fac_prod_mean = rng.uniform(cfg["prod_range_kt"][0], cfg["prod_range_kt"][1], size=n_facilities)
    fac_elec_mean = rng.uniform(cfg["elec_kwh_range"][0], cfg["elec_kwh_range"][1], size=n_facilities)
    fac_thermal_mean = rng.uniform(cfg["thermal_gj_range"][0], cfg["thermal_gj_range"][1], size=n_facilities)
    fac_ren_mean = rng.uniform(cfg["renewable_pct_range"][0], cfg["renewable_pct_range"][1], size=n_facilities)
    fac_subsector = rng.choice(cfg["subsectors"], size=n_facilities)
    fac_fuel = rng.choice(cfg["fuels"], p=cfg["fuel_weights"], size=n_facilities)
    fac_state = rng.choice(STATES, size=n_facilities)
    fac_target = rng.uniform(cfg["target_gei_range"][0], cfg["target_gei_range"][1], size=n_facilities)

    # Repeat facility attributes across operational records
    rep_fac_idx = np.repeat(np.arange(1, n_facilities + 1), records_per_facility)
    rep_prod_mean = np.repeat(fac_prod_mean, records_per_facility)
    rep_elec_mean = np.repeat(fac_elec_mean, records_per_facility)
    rep_thermal_mean = np.repeat(fac_thermal_mean, records_per_facility)
    rep_ren_mean = np.repeat(fac_ren_mean, records_per_facility)
    rep_subsector = np.repeat(fac_subsector, records_per_facility)
    rep_fuel = np.repeat(fac_fuel, records_per_facility)
    rep_state = np.repeat(fac_state, records_per_facility)
    rep_target = np.repeat(fac_target, records_per_facility)
    rep_year_offset = np.tile(np.arange(records_per_facility), n_facilities)

    # Add realistic operational variance (log-normal noise) per record
    sigma = cfg["noise_sigma"]
    noise_prod = np.exp(rng.normal(-0.5 * (sigma**2), sigma, size=total_records))
    noise_elec = np.exp(rng.normal(-0.5 * (0.04**2), 0.04, size=total_records))
    noise_thermal = np.exp(rng.normal(-0.5 * (0.04**2), 0.04, size=total_records))
    noise_ren = rng.normal(0, 1.5, size=total_records)

    # Physical activity values
    prod_kt = np.clip(rep_prod_mean * noise_prod, cfg["prod_range_kt"][0] * 0.7, cfg["prod_range_kt"][1] * 1.3)
    elec_kwh_t = np.clip(rep_elec_mean * noise_elec, cfg["elec_kwh_range"][0] * 0.8, cfg["elec_kwh_range"][1] * 1.2)
    thermal_gj_t = np.clip(rep_thermal_mean * noise_thermal, cfg["thermal_gj_range"][0] * 0.8, cfg["thermal_gj_range"][1] * 1.2)
    ren_pct = np.clip(rep_ren_mean + noise_ren, 0.0, 95.0)

    # Clinker factor for cement
    if sector == "cement":
        clinker_factor = rng.uniform(cfg["clinker_factor_range"][0], cfg["clinker_factor_range"][1], size=total_records)
    else:
        clinker_factor = np.zeros(total_records)

    # Scope 2 calculation (Grid electricity): (kWh/t / 1000) * Grid EF * (1 - ren_pct/100)
    scope2_tco2_t = (elec_kwh_t / 1000.0) * CEA_GRID_EF * (1.0 - (ren_pct / 100.0))

    # Scope 1 calculation (Fuel combustion): thermal_gj_t * ef_gj
    # Map fuels to EF
    fuel_ef_vector = np.array([FUEL_EMISSION_FACTORS[f]["ef_gj"] for f in rep_fuel])
    scope1_fuel_tco2_t = thermal_gj_t * fuel_ef_vector

    # Scope 1 calculation (Process emissions)
    if sector == "cement":
        scope1_proc_tco2_t = clinker_factor * cfg["process_ef"]
    elif sector == "aluminium":
        scope1_proc_tco2_t = np.full(total_records, cfg["process_ef"])
    else:
        scope1_proc_tco2_t = np.zeros(total_records)

    # Total GEI (tCO2e per tonne) with genuine measurement delta
    gei_raw = scope1_fuel_tco2_t + scope1_proc_tco2_t + scope2_tco2_t
    gei_meas_noise = rng.normal(0, sigma * 0.3, size=total_records)
    actual_gei = np.maximum(0.01, gei_raw * (1.0 + gei_meas_noise))

    # Absolute emissions (tCO2e/year)
    prod_tonnes = prod_kt * 1000.0
    scope1_emissions = (scope1_fuel_tco2_t + scope1_proc_tco2_t) * prod_tonnes
    scope2_emissions = scope2_tco2_t * prod_tonnes
    total_emissions = scope1_emissions + scope2_emissions

    # Target GEI & Position
    target_gei = np.round(rep_target, 4)
    surplus_shortfall = (target_gei - actual_gei) * prod_tonnes

    # Construct Facility IDs
    sector_prefix = sector[:3].upper()
    facility_ids = [f"SYN-{sector_prefix}-F{idx:04d}" for idx in rep_fac_idx]

    df = pd.DataFrame({
        "facility_id": facility_ids,
        "facility_num": rep_fac_idx,
        "sector": sector,
        "subsector": rep_subsector,
        "state": rep_state,
        "primary_fuel": rep_fuel,
        "data_status": "CALIBRATED_SYNTHETIC",
        "dataset_provenance_id": "SYNTH-2026-08-v2-250K",
        "annual_production_kt": np.round(prod_kt, 2),
        "production_tonnes": np.round(prod_tonnes, 1),
        "electricity_intensity_kwh_t": np.round(elec_kwh_t, 1),
        "thermal_intensity_gj_t": np.round(thermal_gj_t, 3),
        "renewable_electricity_pct": np.round(ren_pct, 1),
        "clinker_factor_pct": np.round(clinker_factor * 100.0, 1),
        "scope1_emissions_tco2e": np.round(scope1_emissions, 0),
        "scope2_emissions_tco2e": np.round(scope2_emissions, 0),
        "total_emissions_tco2e": np.round(total_emissions, 0),
        "actual_gei": np.round(actual_gei, 4),
        "target_gei": target_gei,
        "gei_unit": cfg["gei_unit"],
        "surplus_shortfall_tco2e": np.round(surplus_shortfall, 0),
        "compliance_status": np.where(surplus_shortfall >= 0, "POTENTIAL_SURPLUS", "POTENTIAL_SHORTFALL"),
        "year_offset": rep_year_offset
    })

    return df


def main():
    print("=" * 70)
    print("CarbonAlpha — Large-Scale Calibrated Industrial Generator (250k+ Rows)")
    print("=" * 70)
    start_time = time.time()

    all_sector_dfs = []
    per_sector_counts = {}

    # Target: 28,000 records per sector = 1,400 facilities * 20 records
    # Train: 1,250 facilities * 20 = 25,000 records
    # Holdout: 150 facilities * 20 = 3,000 records
    N_FACILITIES = 1400
    RECORDS_PER_FAC = 20
    TRAIN_FAC_COUNT = 1250

    train_dfs = []
    holdout_dfs = []

    os.makedirs("data/synthetic", exist_ok=True)
    os.makedirs("data/training", exist_ok=True)
    os.makedirs("data/validation_holdout", exist_ok=True)

    for idx, (sec_id, sec_cfg) in enumerate(SECTOR_CONFIGS.items(), start=1):
        sec_seed = 2026 + (idx * 777)
        print(f"[{idx}/9] Generating {sec_cfg['display_name']} (28,000 unique records)...")
        df_sec = generate_sector_partition(sec_id, sec_cfg, N_FACILITIES, RECORDS_PER_FAC, sec_seed)

        # Split at facility level (0% leakage)
        train_mask = df_sec["facility_num"] <= TRAIN_FAC_COUNT
        df_train_sec = df_sec[train_mask].drop(columns=["facility_num"])
        df_holdout_sec = df_sec[~train_mask].drop(columns=["facility_num"])
        df_full_sec = df_sec.drop(columns=["facility_num"])

        train_dfs.append(df_train_sec)
        holdout_dfs.append(df_holdout_sec)
        all_sector_dfs.append(df_full_sec)

        # Save per-sector partition
        sec_dir = f"data/synthetic/{sec_id}"
        os.makedirs(sec_dir, exist_ok=True)
        parquet_path = f"{sec_dir}/{sec_id}_dataset_28k.parquet"
        csv_path = f"{sec_dir}/{sec_id}_dataset_28k.csv"
        df_full_sec.to_parquet(parquet_path, index=False)
        df_full_sec.to_csv(csv_path, index=False)

        per_sector_counts[sec_id] = len(df_full_sec)
        print(f"      -> Saved {len(df_full_sec):,} rows to {parquet_path} & .csv")

    full_train_df = pd.concat(train_dfs, ignore_index=True)
    full_holdout_df = pd.concat(holdout_dfs, ignore_index=True)
    full_dataset_df = pd.concat(all_sector_dfs, ignore_index=True)

    print("\n" + "=" * 70)
    print(f"TOTAL DATASET GENERATED: {len(full_dataset_df):,} rows across {len(SECTOR_CONFIGS)} sectors")
    print(f"  Training Split : {len(full_train_df):,} rows (25,000 per sector)")
    print(f"  Holdout Split  : {len(full_holdout_df):,} rows (3,000 per sector, 0% leakage)")
    print("=" * 70)

    # Save aggregated training & holdout datasets
    print("Exporting master Parquet and CSV files...")
    full_train_df.to_parquet("data/training/industrial_training_set.parquet", index=False)
    full_train_df.to_csv("data/training/industrial_training_set.csv", index=False)

    full_holdout_df.to_parquet("data/validation_holdout/holdout_set.parquet", index=False)
    full_holdout_df.to_csv("data/validation_holdout/holdout_set.csv", index=False)

    # Save lightweight JSON samples for fast web runtime
    sample_train = full_train_df.sample(n=2500, random_state=2026).to_dict(orient="records")
    sample_holdout = full_holdout_df.sample(n=500, random_state=2026).to_dict(orient="records")

    with open("data/synthetic_training_data/industrial_training_set.json", "w", encoding="utf-8") as f:
        json.dump({
            "dataset_id": "SYNTH-2026-08-v2-250K",
            "generator_version": "scripts/generate_large_scale_datasets.py v2",
            "total_records_in_db": len(full_train_df),
            "sample_records": len(sample_train),
            "per_sector_rows": 25000,
            "generated_at": "2026-08-21",
            "split_method": "FACILITY_LEVEL",
            "records": sample_train
        }, f, indent=2, ensure_ascii=False)

    with open("data/validation_holdout/holdout_set.json", "w", encoding="utf-8") as f:
        json.dump({
            "dataset_id": "HOLDOUT-2026-08-v2-250K",
            "generator_version": "scripts/generate_large_scale_datasets.py v2",
            "total_records_in_db": len(full_holdout_df),
            "sample_records": len(sample_holdout),
            "generated_at": "2026-08-21",
            "split_method": "FACILITY_LEVEL",
            "records": sample_holdout
        }, f, indent=2, ensure_ascii=False)

    elapsed = time.time() - start_time
    print(f"\n[DONE] Successfully created and exported 252,000 dataset rows in {elapsed:.2f} seconds!")


if __name__ == "__main__":
    main()
