# CarbonAlpha ML Model Cards

---

## Model 1: `CA-GEI-BENCHMARK-V1` (Industrial GEI Peer Benchmark)
* **Model Type**: Supervised Non-linear Regressor (`HistGradientBoostingRegressor`)
* **Purpose**: Estimates expected peer Greenhouse Gas Emission Intensity (GEI) and evaluates facility percentile ranking ($0 - 100	ext{th}$) against comparable industrial facilities.
* **Training Dataset**: `data/synthetic_training_data/industrial_training_set.json` ($n = 1,840$ calibrated records across 8 sectors).
* **Holdout Validation Dataset**: `data/validation_holdout/holdout_set.json` ($n = 200$ independent records).
* **Features**:
  - `sector_enc`: Encoded industrial sector (Aluminium, Cement, Iron & Steel, etc.)
  - `annual_production`: Annual finished production in tonnes
  - `electricity_intensity_kwh`: Specific electrical consumption ($	ext{kWh/t}$)
  - `renewable_electricity_pct`: Percentage share of renewable power ($0 - 100\%$)
  - `thermal_fuel_tonnes`: Annual thermal fuel consumption
* **Target Label**: `actual_gei` ($	ext{tCO}_2	ext{e/unit}$).
* **Target Leakage Safeguard**: `target_gei` is strictly excluded from feature inputs.
* **Validation Performance**:
  - **MAE**: $0.1828	ext{ tCO}_2	ext{e/t}$
  - **RMSE**: $0.3190	ext{ tCO}_2	ext{e/t}$
  - **$R^2$**: $0.9949$

---

## Model 2: `CA-ANOMALY-ISO-V1` (Operational Anomaly Detector)
* **Model Type**: Unsupervised Multivariate Anomaly Detector (`IsolationForest`)
* **Purpose**: Identifies multi-dimensional thermodynamic or operational outliers that deviate from physical and empirical plant profiles.
* **Contamination Rate**: $0.05$ ($5\%$).
* **Features Evaluated**: Specific electrical intensity ($	ext{kWh/t}$), renewable share ($\%$) and calculated GHG emission intensity ($	ext{tCO}_2	ext{e/t}$).
* **Output Classification**: `NORMAL`, `REVIEW`, `ANOMALY`.
