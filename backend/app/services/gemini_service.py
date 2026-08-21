import os
import json
import requests
from typing import Dict, Any
from app.config import settings
from app.engines.explanation import ExplanationEngine

# ─────────────────────────────────────────────────────────────────────────────
# GEMINI OUTPUT SCHEMA
# Text-only fields — Gemini CANNOT populate numeric fields.
# All numbers displayed in the UI come from the deterministic decision_data payload.
# ─────────────────────────────────────────────────────────────────────────────
GEMINI_OUTPUT_SCHEMA = {
    "type": "object",
    "properties": {
        "executive_summary": {"type": "string"},
        "key_drivers": {"type": "array", "items": {"type": "string"}, "maxItems": 5},
        "risk_advisory": {"type": "string"},
        "sensitivity_note": {"type": "string"},
        "next_steps": {"type": "array", "items": {"type": "string"}, "maxItems": 4}
    },
    "required": ["executive_summary", "key_drivers", "risk_advisory", "sensitivity_note", "next_steps"],
    "additionalProperties": False
}

_REQUIRED_KEYS = {"executive_summary", "key_drivers", "risk_advisory", "sensitivity_note", "next_steps"}


def _validate_schema(data: Any) -> bool:
    """Validate Gemini response against schema. Returns True if valid."""
    if not isinstance(data, dict):
        return False
    if not _REQUIRED_KEYS.issubset(data.keys()):
        return False
    if not isinstance(data.get("executive_summary"), str):
        return False
    if not isinstance(data.get("key_drivers"), list):
        return False
    if not isinstance(data.get("risk_advisory"), str):
        return False
    if not isinstance(data.get("sensitivity_note"), str):
        return False
    if not isinstance(data.get("next_steps"), list):
        return False
    # Critically: no numeric values allowed (would mean Gemini invented numbers)
    for key in _REQUIRED_KEYS:
        val = data[key]
        if isinstance(val, (int, float)):
            return False
    return True


class GeminiService:
    """
    Structured-output-safe Gemini integration.

    Design contract:
    - Gemini produces TEXT ONLY (executive_summary, key_drivers, risk_advisory,
      sensitivity_note, next_steps). It CANNOT alter or populate any numeric field.
    - All numbers displayed in the UI come from the deterministic decision_data
      payload, never from this service.
    - On any schema validation failure, timeout, or missing API key, the
      deterministic ExplanationEngine fallback is used seamlessly.
    - This class is a CLOSED system: if Gemini is unavailable, callers cannot tell
      the difference in terms of data integrity.
    """

    # System instruction that constrains Gemini strictly to text analysis
    _SYSTEM_INSTRUCTION = (
        "You are a carbon-market policy analyst for India's CCTS (Carbon Credit Trading Scheme). "
        "Your ONLY job is to write concise, professional, audit-ready text analysis of the decision data provided. "
        "CRITICAL RULES: "
        "1. You MUST NOT invent, modify, or reference any specific number — the numbers are in the data and you must NOT repeat or alter them in your output. "
        "2. You MUST NOT claim any CCC issuance, methodology approval, or regulatory status — use 'potentially aligned' / 'requires review' language always. "
        "3. You MUST output ONLY valid JSON matching the schema provided, with no markdown, no code fences, no extra keys. "
        "4. Keep each field under 200 words. Be professional and direct."
    )

    @staticmethod
    def explain_decision(
        entity_name: str,
        sector: str,
        reporting_year: str,
        decision_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        api_key = settings.GEMINI_API_KEY
        if not api_key:
            # Deterministic fallback — fully functional without AI
            return GeminiService._deterministic_fallback(entity_name, sector, reporting_year, decision_data)

        try:
            prompt = (
                f"Analyze this carbon-market decision result for {entity_name} "
                f"(sector: {sector}, reporting year: FY{reporting_year}).\n\n"
                f"Decision summary (all numbers are pre-calculated — do NOT repeat or invent any): "
                f"recommended strategy = {decision_data.get('recommended_strategy', 'N/A')}.\n\n"
                f"Output a JSON object with exactly these text-only fields: "
                f"executive_summary (why the recommended strategy won — describe drivers, not numbers), "
                f"key_drivers (array of up to 5 short strings — qualitative factors only), "
                f"risk_advisory (compliance and implementation risks to watch), "
                f"sensitivity_note (which scenario variables most affect this recommendation), "
                f"next_steps (array of up to 4 actionable strings — implementation sequence)."
            )

            # Use responseMimeType for structured JSON output (Gemini 1.5+ / 2.x)
            url = (
                f"https://generativelanguage.googleapis.com/v1beta/models/"
                f"{settings.GEMINI_MODEL}:generateContent?key={api_key}"
            )
            headers = {"Content-Type": "application/json"}
            payload = {
                "system_instruction": {"parts": [{"text": GeminiService._SYSTEM_INSTRUCTION}]},
                "contents": [{"parts": [{"text": prompt}]}],
                "generationConfig": {
                    "temperature": 0.15,
                    "maxOutputTokens": 700,
                    "responseMimeType": "application/json",
                    "responseSchema": GEMINI_OUTPUT_SCHEMA
                }
            }

            response = requests.post(url, headers=headers, json=payload, timeout=8)

            if response.status_code == 200:
                data = response.json()
                raw_text = data["candidates"][0]["content"]["parts"][0]["text"].strip()

                # Parse and validate schema
                try:
                    parsed = json.loads(raw_text)
                except json.JSONDecodeError:
                    # Gemini output is not valid JSON — use fallback
                    return GeminiService._deterministic_fallback(
                        entity_name, sector, reporting_year, decision_data, reason="JSON_PARSE_FAILURE"
                    )

                if not _validate_schema(parsed):
                    # Schema validation failed — use fallback
                    return GeminiService._deterministic_fallback(
                        entity_name, sector, reporting_year, decision_data, reason="SCHEMA_VALIDATION_FAILURE"
                    )

                # Valid response — merge with service metadata
                return {
                    "executive_summary": parsed["executive_summary"],
                    "key_drivers": parsed["key_drivers"],
                    "risk_advisory": parsed["risk_advisory"],
                    "sensitivity_note": parsed["sensitivity_note"],
                    "next_steps": parsed["next_steps"],
                    "service_status": "GEMINI_ACTIVE",
                    "model_used": settings.GEMINI_MODEL,
                    "schema_validated": True,
                    # Reminder: all numeric data comes from decision_data, NOT from this response
                    "numeric_data_source": "DETERMINISTIC_ENGINE"
                }
            else:
                return GeminiService._deterministic_fallback(
                    entity_name, sector, reporting_year, decision_data, reason=f"HTTP_{response.status_code}"
                )

        except Exception as exc:
            return GeminiService._deterministic_fallback(
                entity_name, sector, reporting_year, decision_data, reason=f"EXCEPTION_{type(exc).__name__}"
            )

    @staticmethod
    def _deterministic_fallback(
        entity_name: str,
        sector: str,
        reporting_year: str,
        decision_data: Dict[str, Any],
        reason: str = "NO_API_KEY"
    ) -> Dict[str, Any]:
        """Fully deterministic fallback. Zero AI dependency. Always structurally identical to Gemini path."""
        base = ExplanationEngine.generate_deterministic_explanation(
            entity_name=entity_name,
            sector=sector,
            reporting_year=reporting_year,
            decision_data=decision_data
        )
        return {
            **base,
            "service_status": "DETERMINISTIC_FALLBACK",
            "fallback_reason": reason,
            "schema_validated": True,
            "numeric_data_source": "DETERMINISTIC_ENGINE"
        }


gemini_service = GeminiService()
