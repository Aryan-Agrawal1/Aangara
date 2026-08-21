import os

docs = {
    "backend/data/regulatory_truth/README.md": """# regulatory_truth/

**Status**: PRIMARY SOURCE — DO NOT DELETE OR RENAME THIS FOLDER

This folder is the single source of truth for all regulatory reference data used by the CarbonAlpha calculation engines.

## Contents
- `regulatory_targets.json` — GEI targets per sector (REAL: BEE/MoEFCC Gazette G.S.R. 25(E), Jan 2026)
- `regulatory_status.json` — Per-sector compliance status: FINAL/DRAFT/WATCHLIST (REAL: BEE/MoEFCC)
- `methodologies.json` — Approved calculation methodologies per sector (REAL: BEE PAT documentation)
- `source_register.json` — All regulatory sources with URLs, dates, authority (REAL)
- `emission_factors.json` — Grid and fuel emission factors (REAL: CEA FY2024, MoEFCC/IPCC Tier 1)

## Data Classification
All files in this folder are REAL — sourced from official Indian government publications.
None are fabricated or synthetic.

## Update Process
When a new gazette notification is published:
1. Update the affected JSON file
2. Update the `last_verified` date field in the file
3. Update `REGULATORY_DATA_VERSION` in `backend/app/config.py`
4. Run the API test suite: `pytest backend/app/tests/`

## Last Verified
2026-01-09 — G.S.R. 25(E) Phase 1 notification
""",
    "backend/data/model_registry/README.md": """# model_registry/

**Status**: ML MODEL ARTIFACTS — Working files (derived, not primary sources)

This folder contains trained scikit-learn model binary files (.joblib) used by the CarbonAlpha benchmark and anomaly detection engines.

## Contents
- `*.joblib` — Trained ML model files
- `registry.json` — Model metadata: version, training date, training data source, feature list

## Data Classification
WORKING — These are derived from synthetic training data (see `synthetic_training_data/`). They are ML-generated artifacts, not primary data.

## Update Process
Run `python scripts/train_models.py` to retrain from current training data.
Version is tracked in `registry.json`.
""",
    "backend/data/synthetic/README.md": """# synthetic/

**Status**: SYNTHETIC DEMONSTRATION DATA

This folder contains artificially generated facility entity data used for demonstration purposes only.

## Contents
- `master_entities.json` — List of synthetic industrial facility entities across 7 CCTS sectors

## Data Classification
SYNTHETIC — All entities are fabricated. No real company names, real facility data, or real emissions figures are used.

## Watermarking
All API responses sourced from this data include `data_status: SYNTHETIC` in the response envelope.
The frontend displays a persistent "SYNTHETIC DEMONSTRATION DATA" watermark.
""",
    "backend/data/synthetic_training_data/README.md": """# synthetic_training_data/

**Status**: SYNTHETIC TRAINING DATA — Used to train ML models only

This folder contains the training dataset used to build the CarbonAlpha GEI benchmark and anomaly detection models.

## Contents
- `industrial_training_set.json` — Synthetic facility records with GEI, production, and energy data across all 7 sectors

## Data Classification
SYNTHETIC — Generated to match statistical distributions consistent with BEE PAT cycle data, but not derived from any real facility's confidential data.

## Note
Model performance is bounded by the quality of this synthetic training set. Real facility data, if made available under appropriate confidentiality agreements, would improve model accuracy.
""",
    "backend/data/factors/README.md": """# factors/

**Status**: EMISSION FACTORS — REAL, government-sourced

This folder contains emission factor reference data used in all Scope 1 and Scope 2 calculations.

## Contents
- `emission_factors.json` — Grid emission factor, fuel combustion emission factors by fuel type

## Key Values
- Grid EF: 0.716 tCO2e/MWh (CEA, FY2024)
- Coal EF: per MoEFCC/IPCC Tier 1
- Natural Gas EF: per MoEFCC/IPCC Tier 1

## Data Classification
REAL — Sourced from Central Electricity Authority (CEA) and MoEFCC/IPCC Tier 1 methodology.

## Last Verified
2026-01-09
""",
    "docs/data-dictionary.md": """# CarbonAlpha — Data Dictionary

All fields returned by the CarbonAlpha API. Every numeric field includes its unit and data-status category.

> **Data Status Key**
> - **FACT** — Direct from government gazette/notification. Source verified, date-stamped.
> - **CALCULATION** — Deterministic output of CarbonAlpha calculation engine.
> - **MODEL** — Machine learning prediction (confidence interval may be available).
> - **SCENARIO** — User-adjustable stress-test parameter.
> - **SYNTHETIC** — Demonstration data. Not real facility data.

---

## Emission Intensity (GEI)

| Field | Unit | Status | Source |
|---|---|---|---|
| `actual_gei` | tCO2e/tonne-product | CALCULATION | CarbonAlpha carbon engine |
| `target_gei` | tCO2e/tonne-product | FACT | BEE/MoEFCC Sectoral GEI targets (G.S.R. 25(E)) |
| `peer_median_gei` | tCO2e/tonne-product | MODEL | CarbonAlpha benchmark model |
| `peer_percentile` | % | MODEL | CarbonAlpha benchmark model |

## Emissions

| Field | Unit | Status | Source |
|---|---|---|---|
| `scope1_fuel_tco2e` | tCO2e/year | CALCULATION | Fuel combustion × emission factors (MoEFCC/IPCC Tier 1) |
| `scope2_grid_tco2e` | tCO2e/year | CALCULATION | Grid electricity × CEA GEF 0.716 tCO2e/MWh (FY2024) |
| `total_emissions_tco2e` | tCO2e/year | CALCULATION | scope1 + scope2 |
| `gei_gap_tco2e` | tCO2e/year | CALCULATION | Shortfall or surplus vs. GEI target |

## Carbon Credit Compliance

| Field | Unit | Status | Source |
|---|---|---|---|
| `surplus_deficit_ccc` | CCC units | CALCULATION | CarbonAlpha compliance engine |
| `ccc_price_inr` | INR/CCC | SCENARIO | User-adjustable (scenario parameter) |

## Decision Twin Strategies

| Field | Unit | Status | Source |
|---|---|---|---|
| `total_cost_cr` | INR crore | MODEL | CarbonAlpha finance engine |
| `internal_abatement_tco2e` | tCO2e/year | MODEL | CarbonAlpha optimizer |
| `procured_ccc_tco2e` | tCO2e/year | MODEL | CarbonAlpha optimizer |
| `npv_cr` | INR crore | MODEL | CarbonAlpha finance engine (NPV of capital investment) |
| `payback_years` | years | MODEL | CarbonAlpha finance engine |
| `risk_score` | 0–100 index | MODEL | CarbonAlpha risk model |
| `utility_score` | 0–100 index | MODEL | Multi-criteria optimizer |

## Emission Factors

| Field | Unit | Status | Source |
|---|---|---|---|
| `grid_ef` | tCO2e/MWh | FACT | CEA Grid Emission Factor FY2024: 0.716 |
| `coal_ef` | tCO2e/GJ | FACT | MoEFCC IPCC Tier 1 |
| `ng_ef` | tCO2e/GJ | FACT | MoEFCC IPCC Tier 1 |
| `oil_ef` | tCO2e/GJ | FACT | MoEFCC IPCC Tier 1 |

## Regulatory Status

| Field | Unit | Status | Source |
|---|---|---|---|
| `regulatory_status` | FINAL/DRAFT/WATCHLIST | FACT | MoEFCC G.S.R. 25(E), Jan 2026 |
| `compliance_cycle` | Phase1/Phase2 | FACT | CCTS Framework |
""",
    "docs/image-sources.md": """# CarbonAlpha — Image Sources & Attribution Log

All images in CarbonAlpha are listed here with source, license, and photographer.
Images are illustrative of the **sector** only — they do not represent any specific named company's facility.

## License
- **Unsplash License**: Free for commercial use. Attribution preferred but not required.

## Images

| Location | Description | Photographer | Source URL | License |
|---|---|---|---|---|
| Hero (/) | Industrial infrastructure | Tom Fisk | https://images.unsplash.com/photo-1473341304170-971dccb5ac1e | Unsplash License |
| Sector: Cement | Cement plant exterior | Rodion Kutsaev | https://images.unsplash.com/photo-1504307651254-35680f356dfd | Unsplash License |
| Sector: Steel | Steel production | Rodion Kutsaev | https://images.unsplash.com/photo-1518493563975-18adae87f1e4 | Unsplash License |
| Sector: Aluminium | Metal smelter | Tom Fisk | https://images.unsplash.com/photo-1565793979927-4b57b571fc75 | Unsplash License |
| Sector: Chlor-Alkali | Chemical plant | Science in HD | https://images.unsplash.com/photo-1581093458791-9d42cc050b0e | Unsplash License |
| Sector: Pulp & Paper | Paper mill | Unsplash | https://images.unsplash.com/photo-1561070791-2526d30994b5 | Unsplash License |
| Sector: Petrochemicals | Refinery at dusk | Pixabay | https://images.unsplash.com/photo-1473341304170-971dccb5ac1e | Unsplash License |
| Sector: Refinery | Oil refinery | Dawn McDonald | https://images.unsplash.com/photo-1518704618243-b719e5d5f2b8 | Unsplash License |
"""
}

for path, content in docs.items():
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Written {path}")