# CarbonAlpha Architecture Documentation

> **Last updated:** 2026-08-21 | **Status:** Reflects shipped code (verified against package.json and codebase)

---

## 1. System Overview

CarbonAlpha India is an analytical decision-intelligence platform built on a Modular Monolith architecture. It connects deterministic engineering/emissions calculations, versioned Indian CCTS regulations, MRV readiness scoring, capital budgeting financial models, and multi-variable scenario simulation into a unified decision workflow.

---

## 2. Core Architectural Layers

### Presentation Layer (Frontend)
- **Framework:** Next.js 15 App Router, React 19, TypeScript
- **Styling:** Tailwind CSS 3.4 with custom design tokens (`--background:#070B11`, `--surface:#0E1524`, carbon-green accent scale)
- **Charts:** Recharts (BarChart, RadarChart for Decision Twin; trade-off comparisons; scenario sensitivity)
- **State:** Zustand global store (`lib/store.ts`) — sector/entity/year/scenario selections shared across all routes
- **Icons:** Lucide-React
- **Motion:** Currently uses CSS animations only (`.winner-card-glow`, `animate-spin`). Framer Motion is **not** installed.
- **Type safety:** TypeScript strict mode, shared types in `lib/types.ts`

> **Note:** A previous version of this document incorrectly claimed Framer Motion was used. It is not in `package.json` and has never been installed. See `docs/regulatory-discrepancies.md` Phase-0 docs-vs-reality delta.

### API & Orchestration Layer (Backend)
- **Framework:** FastAPI with Pydantic v2 schemas
- **REST endpoints:** 6 endpoint groups (`/api/sectors`, `/api/entities`, `/api/calculate`, `/api/scenarios`, `/api/sources`, `/api/intelligence`) + health check
- **Response envelope:** `{success, data, errors, warnings, source_status}` on all endpoints
- **Port:** 8008 (configured via `BACKEND_PORT` env var)

### Calculation Engines (Deterministic Core)
All eight engines are pure functions with no hidden global state, designed for reproducibility:

| Engine | File | Purpose |
|--------|------|---------|
| Carbon Engine | `engines/carbon.py` | Scope 1+2 emissions, GEI, surplus/shortfall |
| Regulatory Engine | `engines/regulatory.py` | Sector status, GEI target trajectory, source provenance |
| MRV Engine | `engines/mrv.py` | 5-dimension MRV analytical readiness (0–100) |
| Finance Engine | `engines/finance.py` | Cash flows, CAPEX, OPEX, energy savings, NPV, IRR, Payback |
| Capital Optimizer | `engines/optimizer.py` | BUY vs BUILD vs HYBRID transparent weighted utility ranking |
| Scenario Engine | `engines/scenarios.py` | 4-variable sensitivity recalculation |
| Anomaly Engine | `engines/anomaly.py` | IsolationForest / Z-score operational data-quality flags |
| Explanation Engine | `engines/explanation.py` | Deterministic causality narrative + optional Gemini synthesis |

### AI / Explanation Layer
- `services/gemini_service.py` — Strict JSON-schema-constrained Gemini integration
  - Output schema: `{executive_summary, key_drivers[], risk_advisory, sensitivity_note, next_steps[]}` — **text fields only**
  - Gemini cannot populate or alter any numeric field
  - Schema-validated before use; falls back to `ExplanationEngine` on any failure
  - Deterministic fallback is always fully functional with zero AI dependency

### Data Layer

```
data/regulatory_truth/     → SINGLE SOURCE OF TRUTH for regulatory data (Gazette-sourced)
data/regulatory/           → DEPRECATED SNAPSHOT — do not read (see DISC-07)
data/factors/              → Versioned emission factor databases (BEE DCP v1.0)
data/synthetic/            → Master synthetic industrial entities (25 entities, 9 sectors)
data/synthetic_training_data/ → ML training set v2 (1,600 records, SYNTH-2026-08-v2)
data/validation_holdout/   → ML holdout set v2 (320 records, HOLDOUT-2026-08-v2)
data/model_registry/       → Trained model artifacts + registry.json
data/provenance/           → Dataset provenance records (dataset_provenance.json)
data/user_submitted_data/  → User-submitted facility data (validated)
data/real_reference_data/  → Reserved for real BRSR/disclosure reference points
data/model_predictions/    → Model prediction outputs (for audit trail)
```

**Database:** The application is **intentionally file-backed JSON** (no database is used). `DATABASE_URL` in `.env.example` is a placeholder for future migration if needed — no ORM is wired and no database is created at runtime.

### ML Models

| Model | Algorithm | Confidence Tier | Notes |
|-------|-----------|-----------------|-------|
| CA-GEI-BENCHMARK-V2 | HistGradientBoostingRegressor | CALIBRATED | MAE=0.1430, R²=0.9953 vs baseline R²=0.9558 |
| CA-ENERGY-BENCHMARK-V1 | HistGradientBoostingRegressor | CALIBRATED | MAE=38.27 kWh/t |
| CA-ANOMALY-ISO-V2 | IsolationForest (contamination=0.05) | CALIBRATED | Advisory anomaly flags |

All models trained on SYNTH-2026-08-v2 (calibrated synthetic data with genuine noise). Facility-level split verified (0 leakage). Treat as CALIBRATED until retrained on real facility data.

---

## 3. Data Status Labels

Every number surfaced in the UI is traceable to one of:

| Label | Meaning |
|-------|---------|
| `FACT` | Real, Gazette-sourced regulatory target or factor |
| `REAL_CORPORATE_DISCLOSURE` | BRSR/company-disclosed reference point (cited, attributed) |
| `INPUT` | User-entered facility data |
| `CALCULATION` | Deterministic engine output from FACT or INPUT |
| `MODEL` | ML model prediction (always shows confidence tier) |
| `SCENARIO` | User-moved slider value (explicitly labelled) |
| `SYNTHETIC` | Demo data from calibrated synthetic generator |

---

## 4. Resilience & Failure Isolation

All optional services (Gemini AI, ML Anomaly engine) are wrapped with fault isolation. If Gemini or ML is unavailable, the deterministic core remains 100% operational with rule-based narrative templates. Every page shows a designed error/fallback state (not a blank screen) when the backend is unreachable.

---

## 5. Regulatory Data Architecture

Single source of truth: `data/regulatory_truth/`. All backend engines read from this folder exclusively. See `docs/regulatory-discrepancies.md` for the full discrepancy and correction log.

**Iron & Steel status as of 2026-08-21:** DRAFT (not FINAL). Draft G.S.R. 517(E) issued 26 June 2026, public consultation window closes ~1 September 2026. Re-verify before next release.
