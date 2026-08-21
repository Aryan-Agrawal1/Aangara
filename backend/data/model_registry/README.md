# model_registry/

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
