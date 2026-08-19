import os
import json
import requests
from typing import Dict, Any
from app.config import settings
from app.engines.explanation import ExplanationEngine

class GeminiService:
    @staticmethod
    def explain_decision(
        entity_name: str,
        sector: str,
        reporting_year: str,
        decision_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        api_key = settings.GEMINI_API_KEY
        if not api_key:
            # Clean deterministic fallback
            return ExplanationEngine.generate_deterministic_explanation(
                entity_name=entity_name,
                sector=sector,
                reporting_year=reporting_year,
                decision_data=decision_data
            )

        # Call Gemini API with structured prompt
        try:
            prompt = f"""You are an authoritative climate-finance intelligence specialist for the Indian Carbon Market (CCTS).
Analyze this deterministic decision result for {entity_name} ({sector}, FY{reporting_year}) and generate an executive summary.

Decision Data:
{json.dumps(decision_data, indent=2)}

Rules:
1. Do NOT invent new numbers or alter calculations.
2. Strictly explain why the recommended strategy ({decision_data.get('recommended_strategy')}) won based on cost, emissions, and risk.
3. Explicitly state all outputs are modelled decision support, not official statutory issuance.
4. Keep the summary punchy, professional, and audit-ready.
"""
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{settings.GEMINI_MODEL}:generateContent?key={api_key}"
            headers = {"Content-Type": "application/json"}
            payload = {
                "contents": [{"parts": [{"text": prompt}]}],
                "generationConfig": {"temperature": 0.2, "maxOutputTokens": 800}
            }
            
            response = requests.post(url, headers=headers, json=payload, timeout=8)
            if response.status_code == 200:
                data = response.json()
                text = data["candidates"][0]["content"]["parts"][0]["text"]
                return {
                    "narrative": text,
                    "executive_summary": f"AI Synthesis: Recommended Strategy {decision_data.get('recommended_strategy')} validated across financial & compliance criteria.",
                    "key_drivers": [
                        "Structural emission intensity reduction under CCTS trajectory.",
                        "Optimized blended lifecycle cost vs market procurement.",
                        "Mitigated regulatory compliance gap."
                    ],
                    "risk_advisory": "Ensure verification evidence bundle is aligned with Accredited Carbon Verification Agency requirements.",
                    "service_status": "GEMINI_ACTIVE",
                    "model_used": settings.GEMINI_MODEL
                }
            else:
                # Fallback on non-200
                return ExplanationEngine.generate_deterministic_explanation(
                    entity_name=entity_name,
                    sector=sector,
                    reporting_year=reporting_year,
                    decision_data=decision_data
                )
        except Exception:
            # Fallback on network timeout or failure
            return ExplanationEngine.generate_deterministic_explanation(
                entity_name=entity_name,
                sector=sector,
                reporting_year=reporting_year,
                decision_data=decision_data
            )

gemini_service = GeminiService()
