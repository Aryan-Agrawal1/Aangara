import pytest
from app.engines.mrv import MRVEngine

def test_mrv_readiness_scoring():
    res = MRVEngine.assess_readiness(
        measurement_completeness=90.0,
        activity_data_completeness=85.0,
        factor_traceability=80.0,
        methodology_mapping=95.0,
        verification_readiness=80.0
    )

    assert res["composite_score"] == 86.0
    assert res["status"] == "HIGH_READINESS"
    assert "disclaimer" in res
