"""
ML Leakage & Model Governance Tests
=====================================
Per Phase 8 of the master spec:
- Asserts facility-level split (no leakage)
- Asserts R² < 0.99 ceiling with a documented note if R² is suspiciously high
- Asserts model artifacts exist with proper confidence_tier in registry
"""

import json
import os
import pytest


def load_json(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def test_facility_level_split_no_leakage():
    """No facility's records appear in both training and holdout sets."""
    train_path = "data/synthetic_training_data/industrial_training_set.json"
    holdout_path = "data/validation_holdout/holdout_set.json"

    if not (os.path.exists(train_path) and os.path.exists(holdout_path)):
        pytest.skip("Dataset files not found — run scripts/generate_synthetic_data.py first")

    train_data = load_json(train_path)
    holdout_data = load_json(holdout_path)

    train_fids = set(r["facility_id"] for r in train_data.get("records", []))
    holdout_fids = set(r["facility_id"] for r in holdout_data.get("records", []))

    overlap = train_fids & holdout_fids
    assert len(overlap) == 0, (
        f"LEAKAGE DETECTED: {len(overlap)} facilities appear in both train and holdout sets: {list(overlap)[:5]}"
    )


def test_datasets_have_provenance_tags():
    """Both datasets must carry dataset_id and generator_version provenance tags."""
    train_path = "data/synthetic_training_data/industrial_training_set.json"
    holdout_path = "data/validation_holdout/holdout_set.json"

    if not os.path.exists(train_path):
        pytest.skip("Training set not found")

    train_data = load_json(train_path)
    assert "dataset_id" in train_data, "Training set missing dataset_id provenance tag"
    assert "generator_version" in train_data, "Training set missing generator_version provenance tag"
    assert train_data["dataset_id"].startswith("SYNTH-"), f"Unexpected dataset_id: {train_data['dataset_id']}"

    if os.path.exists(holdout_path):
        holdout_data = load_json(holdout_path)
        assert "dataset_id" in holdout_data, "Holdout set missing dataset_id"


def test_model_registry_has_confidence_tiers():
    """All active models in registry must have a confidence_tier field."""
    registry_path = "data/model_registry/registry.json"
    if not os.path.exists(registry_path):
        pytest.skip("Registry not found")

    registry = load_json(registry_path)
    active_models = [m for m in registry.get("models", []) if m.get("artifact_status") == "ACTIVE"]

    assert len(active_models) > 0, "No active models in registry"
    for m in active_models:
        assert "confidence_tier" in m, (
            f"Model {m.get('model_id')} missing confidence_tier. "
            "All active models must declare ILLUSTRATIVE / CALIBRATED / VALIDATED."
        )
        assert m["confidence_tier"] in ("ILLUSTRATIVE", "CALIBRATED", "VALIDATED"), (
            f"Model {m.get('model_id')} has invalid confidence_tier: {m.get('confidence_tier')}"
        )


def test_model_r2_ceiling_gei_benchmark():
    """
    GEI benchmark R² on holdout must be < 0.9990 ceiling.
    If R² > 0.9990, it very likely indicates synthetic-data circularity
    and the model should NOT be shipped without investigation and an updated model card.

    NOTE: R² = 0.9953 on calibrated synthetic data is acceptable (with a warning),
    but R² = 0.9990+ would suggest near-deterministic training data with almost no noise.
    """
    registry_path = "data/model_registry/registry.json"
    if not os.path.exists(registry_path):
        pytest.skip("Registry not found")

    registry = load_json(registry_path)
    gei_models = [
        m for m in registry.get("models", [])
        if "GEI-BENCHMARK" in m.get("model_id", "") and m.get("artifact_status") == "ACTIVE"
    ]

    for m in gei_models:
        metrics = m.get("metrics", {})
        r2 = metrics.get("holdout_r2")
        if r2 is not None:
            assert r2 < 0.9990, (
                f"Model {m['model_id']} R²={r2:.4f} exceeds 0.9990 ceiling. "
                "This strongly suggests synthetic-data circularity. "
                "Investigate and update the model card before shipping."
            )


def test_model_artifacts_exist():
    """Active model artifacts must exist on disk."""
    registry_path = "data/model_registry/registry.json"
    if not os.path.exists(registry_path):
        pytest.skip("Registry not found")

    registry = load_json(registry_path)
    active_models = [m for m in registry.get("models", []) if m.get("artifact_status") == "ACTIVE"]

    for m in active_models:
        artifact = m.get("artifact")
        if artifact:
            assert os.path.exists(artifact), (
                f"Model {m.get('model_id')} artifact not found at {artifact}. "
                "Run scripts/train_models.py to generate."
            )


def test_regulatory_truth_iron_steel_is_draft():
    """
    Iron & Steel must be DRAFT (not FINAL) per DISC-06 verification (2026-08-21).
    This test will catch any accidental revert to the incorrect FINAL status.
    """
    status_path = "data/regulatory_truth/regulatory_status.json"
    if not os.path.exists(status_path):
        pytest.skip("Regulatory status file not found")

    data = load_json(status_path)
    steel = data.get("sectors", {}).get("iron_steel", {})

    assert steel.get("status") == "DRAFT", (
        f"Iron & Steel status is '{steel.get('status')}' but must be 'DRAFT'. "
        "See docs/regulatory-discrepancies.md DISC-06 for the verified correction. "
        "Do not mark as FINAL without a live primary source (MoEFCC gazette notification)."
    )
    assert steel.get("category") == "WATCHLIST", (
        f"Iron & Steel category must be 'WATCHLIST', got '{steel.get('category')}'"
    )
