# CarbonAlpha Data Provenance & Honesty Disclosure

## 1. 252,000-Row ML Dataset
- **Status:** **SYNTHETIC & CALIBRATED**
- **Generation Method:** The dataset was generated using programmatic distributions (SciPy/pandas) bounded by real macro-level constraints (e.g., MoEFCC sector averages, BEE PAT Scheme boundaries).
- **Purpose:** Used strictly to pre-train the CA-GEI-BENCHMARK-V2 and Anomaly Detection models.
- **Limitation:** Does not represent actual disclosed facility data. The high R² (0.97+) achieved by the model is partially a result of learning the deterministic thermodynamic rules built into the synthetic generator. This is mathematical leakage and must be disclosed to enterprise buyers.

## 2. Regulatory Targets
- **Status:** **REAL REFERENCE DATA**
- **Source:** MoEFCC e-Gazette Notifications (e.g., G.S.R. 25(E) for Cement/Aluminium).
- **Note:** Iron & Steel targets are currently mapped to the June 2026 Revised Draft (G.S.R. 517(E)) and are legally non-binding until finalized.

## 3. Financial Assumptions
- **CCC Price:** Modeled dynamically via user scenarios. Default is an assumed \u20B91,000/CCC. This is NOT a live market feed.
- **WACC:** Assumed 9.5% default.
- **CAPEX:** Engineering estimates based on public sustainability reports; strictly labeled as MODELLED/ESTIMATED.
