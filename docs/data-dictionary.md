# CarbonAlpha — Data Dictionary

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
