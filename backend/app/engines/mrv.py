from typing import Dict, Any

class MRVEngine:
    @staticmethod
    def assess_readiness(
        measurement_completeness: float,
        activity_data_completeness: float,
        factor_traceability: float,
        methodology_mapping: float,
        verification_readiness: float
    ) -> Dict[str, Any]:
        # Bound each metric to 0-100
        m1 = max(0.0, min(100.0, measurement_completeness))
        m2 = max(0.0, min(100.0, activity_data_completeness))
        m3 = max(0.0, min(100.0, factor_traceability))
        m4 = max(0.0, min(100.0, methodology_mapping))
        m5 = max(0.0, min(100.0, verification_readiness))

        composite_score = round(0.20 * m1 + 0.20 * m2 + 0.20 * m3 + 0.20 * m4 + 0.20 * m5, 1)

        if composite_score >= 85.0:
            status = "HIGH_READINESS"
            advisory = "Robust telemetry, factor provenance, and formal methodology mapping verified."
        elif composite_score >= 70.0:
            status = "GOOD"
            advisory = "Adequate for compliance baseline; external third-party verification preparation recommended."
        elif composite_score >= 50.0:
            status = "MODERATE_RISK"
            advisory = "Data gaps detected in direct metering or secondary source emission factors."
        else:
            status = "HIGH_RISK"
            advisory = "Critical MRV deficiency. Significant audit reconciliation risk."

        return {
            "measurement_completeness": m1,
            "activity_data_completeness": m2,
            "factor_traceability": m3,
            "methodology_mapping": m4,
            "verification_readiness": m5,
            "composite_score": composite_score,
            "status": status,
            "advisory": advisory,
            "disclaimer": "CarbonAlpha proprietary analytical readiness score ? not an official regulatory verification rating."
        }
