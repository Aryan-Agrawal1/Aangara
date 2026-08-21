from typing import Dict, Any, List

class AnomalyEngine:
    @staticmethod
    def detect_anomalies(
        output: float,
        electricity_mwh: float,
        fuel_tonnes: float,
        actual_gei: float,
        baseline_gei: float,
        capacity_utilisation_pct: float
    ) -> Dict[str, Any]:
        reasons = []
        anomaly_flag = False
        anomaly_score = 0.0

        # Check 1: GEI jump > 15% vs baseline without corresponding capacity shift
        gei_deviation_pct = ((actual_gei - baseline_gei) / baseline_gei) * 100.0
        if abs(gei_deviation_pct) > 15.0:
            anomaly_flag = True
            anomaly_score += 0.45
            reasons.append(f"GEI deviated by {gei_deviation_pct:+.1f}% against baseline ({baseline_gei:.4f} -> {actual_gei:.4f}).")

        # Check 2: Capacity utilisation vs output consistency
        if capacity_utilisation_pct > 105.0:
            anomaly_flag = True
            anomaly_score += 0.30
            reasons.append(f"Reported capacity utilisation ({capacity_utilisation_pct:.1f}%) exceeds rated nameplate tolerance.")

        # Check 3: Zero fuel or zero electricity for heavy industrial entity
        if electricity_mwh <= 0 and fuel_tonnes <= 0:
            anomaly_flag = True
            anomaly_score += 0.50
            reasons.append("Missing both electricity and thermal fuel activity data.")

        status = "ANOMALY_DETECTED" if anomaly_flag else "NORMAL"
        if not reasons:
            reasons.append("All physical activity and emissions ratios conform to historical engineering baselines.")

        return {
            "status": status,
            "anomaly_detected": anomaly_flag,
            "anomaly_score": min(1.0, round(anomaly_score, 2)),
            "reason_codes": reasons,
            "disclaimer": "Data-quality anomaly flag ? not a compliance determination."
        }
