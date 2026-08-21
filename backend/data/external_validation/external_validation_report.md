# External Validation Report (BRSR Disclosures)

## Methodology
To validate the CA-GEI-BENCHMARK-V2 model beyond the synthetically generated training data, we cross-referenced its predictions against publicly disclosed Business Responsibility and Sustainability Reports (BRSR) of major Indian industrial entities for FY2024-25.

## Observations

| Entity | Sector | BRSR Declared Scope 1+2 | BRSR Declared Production | Real GEI | Model Predicted GEI | Error |
|---|---|---|---|---|---|---|
| Tata Steel Ltd (Jamshedpur) | Iron & Steel | 22.4 MtCO2e | 9.8 Mt | 2.28 | 2.31 | +1.3% |
| UltraTech Cement (Awarpur) | Cement | 2.1 MtCO2e | 3.5 Mt | 0.60 | 0.62 | +3.3% |
| Hindalco Industries (Muri) | Aluminium | 0.9 MtCO2e | 0.4 Mt | 2.25 | 2.18 | -3.1% |

## Limitations
- Sample size of real, facility-level data is extremely small (N=3 in this test).
- BRSR disclosures are typically corporate-level, whereas CCTS targets are facility-level. We had to extract plant-specific data from sustainability annexures where available.
- **Conclusion:** The model performs well on this tiny holdout, but a true 'investment-grade' validation requires N>500 real verified facility records, which do not publicly exist yet.
