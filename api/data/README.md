# CarbonAlpha Data Platform ? Directory Layout & Provenance

```
data/
??? regulatory_truth/         # Tier-1 statutory targets, Gazette rules, methodology registers
??? real_reference_data/      # PAT energy records, corporate BRSR disclosures, OGD series
??? synthetic_training_data/  # Monte Carlo calibrated training sets (deterministic seed 2026)
??? validation_holdout/       # Independent holdout partition (strictly isolated from training)
??? user_submitted_data/      # Local facility inputs submitted via /industrial-intelligence
??? model_predictions/        # Generated benchmarks, anomaly scores, project evaluations
??? model_registry/           # Serialized models, version cards, feature schemas
??? data_quality/             # Automated validation reports, anomaly logs, data dictionaries
```

## Strict Provenance & Status Tags
Every single data record in CarbonAlpha carries an explicit `data_status`:
- `REAL_OFFICIAL`: Gazette notifications, statutory BEE targets.
- `REAL_CORPORATE_DISCLOSURE`: Audited BRSR / annual reports.
- `REAL_SECONDARY`: GHG Platform India, OGD aggregate statistics.
- `SYNTHETIC`: Deterministic Monte Carlo calibrated data.
- `USER_SUBMITTED_VALIDATED`: Entered by user via `/industrial-intelligence` and audited by DataQualityEngine.
- `CALCULATED`: Deterministic engineering calculation.
- `MODEL_PREDICTION`: Machine learning benchmark / anomaly score.
