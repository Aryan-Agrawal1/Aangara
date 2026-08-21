# CARBONALPHA — MASTER AUDIT & IMPLEMENTATION STRATEGY
### (Sections A–W, pre-work for the Antigravity Master Prompt)
**Audit date:** 21 August 2026 · **Repo audited:** `carbon alpha 2.0/` (uploaded zip, incl. `.git` history)

---

## A. COMPLETE CURRENT STATE AUDIT

The uploaded repo is **not** a Phase-1 MVP in the sense the two knowledge-base docs describe — it is already a materially more advanced Phase-1.5/2.0 build. Treat it as the real baseline, not the SIH docs, whenever they disagree (see Section D).

### A.1 Backend (`backend/app`, FastAPI, ~2,300 LOC)

| Module | Status | Notes |
|---|---|---|
| `main.py`, `config.py`, `api/router.py` | **IMPLEMENTED** | Clean FastAPI bootstrap, CORS, `/api/health` reports model/regulatory version + `gemini_active` flag. No DB wiring visible in `main.py` despite `DATABASE_URL` in `.env.example` — **PARTIALLY_IMPLEMENTED**, likely file/JSON-backed, not an actual ORM/DB. |
| `api/endpoints_sectors.py`, `endpoints_entities.py`, `endpoints_calculation.py`, `endpoints_scenarios.py`, `endpoints_sources.py`, `endpoints_intelligence.py` | **IMPLEMENTED** (surface) | Six endpoint groups exist matching most of the documented API map. Needs contract-by-contract diff against Section 32/33 of the Build Master (response envelope `{success, data, errors, warnings, source_status}` must be verified field-by-field, not assumed). |
| `engines/carbon.py`, `regulatory.py`, `mrv.py`, `finance.py`, `optimizer.py`, `scenarios.py`, `anomaly.py`, `explanation.py` | **IMPLEMENTED** | All eight documented engines exist as separate modules — matches the "modular monolith" instruction. This is good bones. Needs unit-test coverage audit (only 6 test files exist — see A.5) and a check that engines are pure functions with no hidden global state (required for reproducibility, Section 36 of Build Master). |
| `intelligence/opportunity_engine.py`, `data_quality.py`, `service.py`, `schemas.py` | **IMPLEMENTED** | This is the "Decarbonisation Engine" + "Industrial Intelligence" backend called for in Sections 16 & 21 of the master prompt. Needs a rubric check: are opportunity CAPEX/OPEX/reduction figures backed by real project benchmarks, or are they hand-picked constants? **NEEDS_RESEARCH** to verify against real engineering benchmarks. |
| `services/gemini_service.py` | **IMPLEMENTED, but WEAK** | Calls Gemini REST directly (not the SDK the architecture doc claims), uses `gemini-2.5-flash`, has a deterministic fallback (`ExplanationEngine`) when no API key — correct fail-open behaviour. **Model name is stale** (`gemini-2.5-flash` — verify current Gemini model family before Antigravity build; do not hardcode without checking `product-self-knowledge`/Gemini docs equivalent). No structured-output schema (JSON mode) enforced — it free-texts a narrative and manually re-wraps a few fields; this is a **NEEDS_REFACTOR**: move to strict JSON-schema-constrained generation so Gemini truly cannot invent numeric fields. |
| Tests (`backend/app/tests/*`) | **PARTIALLY_IMPLEMENTED** | 7 test files (`test_api`, `test_carbon_engine`, `test_financial_engine`, `test_intelligence`, `test_mrv`, `test_optimizer`, `test_scenarios`) exist — good coverage breadth, unknown depth/pass status (not executed in this audit; Antigravity's Phase 0 must run `pytest` and record baseline pass/fail before touching anything). |

### A.2 Frontend (`frontend/`, Next.js 15 + React 19 + TS + Tailwind)

| Item | Status | Notes |
|---|---|---|
| Routes: `/`, `/overview`, `/entity`, `/decision`, `/scenarios`, `/sources`, `/industrial-intelligence` | **IMPLEMENTED** | 7 routes exist — this already exceeds the 5-route nav plan in the Build Master (adds Industrial Intelligence). Good. |
| Components: `cockpit/CarbonPositionCard`, `DecisionTwinHero`, `ExplainabilityCard`, `MRVReadinessCard`, `ScenarioSliders`, `drawers/SourceTraceDrawer`, `intelligence/DecarbonisationMatrix`, `FacilityInputForm`, `PeerBenchmarkCard`, `navigation/Header` | **IMPLEMENTED** | Matches almost every "must never be cut" UI element from Section 66 of the Build Master (Decision Twin, Scenario sliders, Source drawer, MRV card). |
| Charting | **MISSING** | `package.json` has **no chart/visualization library** (no recharts/visx/d3/chart.js) and no `framer-motion` despite `docs/architecture.md` claiming Framer Motion is used. Any "chart" currently on screen is either custom SVG or absent. This is a real gap for a "premium" UI — trend lines, scenario sensitivity curves, and the Decision Twin comparison bars need a proper chart layer. |
| Design system | **PARTIALLY_IMPLEMENTED** | Dark glass-panel theme exists (`globals.css`, custom scrollbars, `.glass-panel`, carbon-green accent palette in `tailwind.config.js`) — a credible premium dark fintech aesthetic is already started. No component library (shadcn/radix), no motion library, no icon system beyond `lucide-react`, no typography scale/spacing tokens defined beyond Tailwind defaults, no accessible focus states audited, no responsive/mobile pass evident from file count (7 pages, ~10 components is thin for "dense but understandable" cockpit + intelligence + scenarios + sources). |
| State management | **NEEDS_RESEARCH** | `lib/api.ts`, `lib/types.ts`, `lib/formatters.ts` exist but no visible global store (no Zustand/Redux/Context file found) — Section 60 of the Build Master calls for one `AppState` object; likely each page fetches independently today, causing duplicate calls and state-sync risk between `/decision` and `/scenarios`. |
| Loading/error/empty states, accessibility | **NEEDS_RESEARCH** | Not verifiable from file listing alone; Antigravity Phase 0 must screenshot-audit every route in both loading and error conditions (kill backend, reload each page). |

### A.3 Data (`data/`)

| Folder | Status | Notes |
|---|---|---|
| `data/synthetic/master_entities.json` | **IMPLEMENTED** | 25 synthetic entities across **9** sector folders: cement, aluminium, chlor_alkali, pulp_paper, petrochemicals, petroleum_refinery, textile (3 each = 21) + iron_steel (2) + fertiliser (2) = 25. Records are internally consistent (GEI = emissions/output checks out on the sampled record), correctly labelled `data_status: SYNTHETIC`, and carry `source_id`/`source_url` on the regulatory profile — this is good discipline, matching Section 15.3 of the Build Master ("generated from equations, not randomly invented"). |
| `data/regulatory/` **and** `data/regulatory_truth/` (duplicate folders: `emission_factors.json`, `methodologies.json`, `regulatory_status.json`, `regulatory_targets.json`, `source_register.json`) | **INCORRECT / NEEDS_REFACTOR** | Two parallel, near-identical regulatory folders is exactly the "manually edited numbers for different screens" anti-pattern the Build Master explicitly forbids (Section 8). This is a real, fixable defect: there must be **one** regulatory source-of-truth folder, not two, or the two must be given clearly distinct, documented purposes (e.g., `regulatory/` = working config, `regulatory_truth/` = frozen audit snapshot) with an explicit sync process. Right now it is ambiguous which one the backend actually reads (`endpoints_sources.py`/`regulatory.py` must be checked). |
| `docs/regulatory-discrepancies.md` → `DISC-05` | **INCORRECT (factually, as of Aug 2026)** | The repo's own discrepancy log claims Iron & Steel was **"reconciled as the 8th binding compliance sector"** with **FINAL** status and cites "G.S.R. 88(E)". Fresh verification (see Section D below) shows this is **wrong as of 21 Aug 2026**: MoEFCC re-issued a *revised draft* for Iron & Steel on 26 June 2026 (public 2 July 2026) with a 60-day objection window, and multiple independent trackers (CEEW, ICAP, LKS Attorneys, DownToEarth) confirm Iron & Steel targets are **still DRAFT**, not final, at the time of this audit. **The `master_entities.json` and `regulatory_status.json` therefore currently mis-state Iron & Steel as `CCTS_MONITORED`/`FINAL` when it should be `WATCHLIST`/`DRAFT`.** This is the single most important correction Antigravity must make before any further build work, because it is exactly the kind of fabricated-regulatory-fact failure mode Section 34/74 of the master prompt is designed to prevent. Fertiliser status (also draft/未final) must be checked the same way and is very likely still correctly on watchlist in the repo — verify, don't assume. |
| `data/factors/emission_factors.json` | **IMPLEMENTED**, needs source audit | Must confirm every factor traces to the BEE compliance-procedure factor tables or another cited primary source, not a plausible-looking placeholder. |
| `data/model_registry/` (`gei_benchmark_v1.joblib`, `anomaly_detector_v1.joblib`, `sector_encoder_v1.joblib`, `registry.json`) | **IMPLEMENTED — real trained models exist** | `registry.json` shows a `HistGradientBoostingRegressor` GEI benchmark model (1,840 train / 200 holdout rows, holdout R²=0.9949, MAE=0.18) and an `IsolationForest` anomaly model. This is a genuinely good sign — this is *not* a stub. **But R²=0.9949 on a 5-feature model over what is very likely 100%-synthetic, equation-generated training data is a major red flag for false precision**: if the training data was itself generated from a near-deterministic formula (GEI = f(production, electricity, fuel...)), a gradient-boosted model will trivially "solve" it, and the R² says nothing about real-world predictive power. This must be explicitly flagged to Antigravity as **NEEDS_RESEARCH / do not present as a genuine benchmark model until it is retrained (or at minimum validated) against real or realistically-noised data.** |
| `data/synthetic_training_data/industrial_training_set.json` (1.2 MB) + `data/validation_holdout/holdout_set.json` (140 KB) | **IMPLEMENTED**, provenance unclear | Confirms the above: this is the training set behind the ML models. Must audit whether it was built via the same equation-driven generator as `master_entities.json` (good) or via an LLM "write realistic-looking rows" approach (bad, and would explain the too-good R²). |
| `data/real_reference_data/`, `data/user_submitted_data/`, `data/provenance/`, `data/model_predictions/`, `data/data_quality/` | **MISSING / EMPTY (near-0 bytes)** | Folders exist as scaffolding but contain effectively nothing. This is the clearest gap versus the "real data" ambition in the task brief: there is currently **no real external dataset ingested anywhere in this repo.** Everything numeric in the system today is synthetic or regulatory-reference JSON. |

### A.4 Documentation (`docs/`)

`architecture.md`, `decision-model.md`, `ml-model-card.md`, `regulatory-discrepancies.md`, `source-register.md`, plus 9 screenshots. **PARTIALLY_IMPLEMENTED**: good scaffolding, real content, but contains at least one factual error (DISC-05, above) and claims a frontend motion library (Framer Motion) that is not in `package.json` — docs are drifting from code already. Antigravity must treat existing docs as **claims to verify**, not ground truth.

### A.5 Testing

Unit tests exist for every backend engine (7 files) but there is **no evidence of any E2E/browser test** (no Playwright/Cypress config found), **no ML model test** (no test asserting model metrics stay within bounds / no leakage check script), and **no frontend test** (no Jest/Vitest/RTL config in `package.json`). **MISSING.**

### A.6 Root-level scripts & infra

`scripts/generate_synthetic_data.py`, `scripts/validate_dataset.py`, `docker-compose.yml`, `.env.example`, `pytest.ini` — **IMPLEMENTED**, consistent with the Build Master's recommended repo layout almost exactly. `.env` (real, not `.env.example`) is present in the zip root — **flag for removal/rotation before sharing anything with Antigravity or any external agent** (see Section T/U).

---

## B. REQUIREMENTS MATRIX (condensed — full 50-item list from the brief cross-checked)

Legend: ✅ built · 🟡 partial/needs verification · ❌ missing

| # | Capability | Status |
|---|---|---|
| 1–4 | Sector select, entity/facility select, onboarding, data input | ✅ (`FacilityInputForm.tsx`, `entity/page.tsx`) |
| 5 | Sector-specific input forms | 🟡 one generic `FacilityInputForm` — needs per-sector field sets (Section 13 of Build Master defines 7 distinct schemas; unclear if the one form branches per sector) |
| 6–13 | Data quality → GEI → carbon position → surplus/shortfall | ✅ engines exist, ⚠️ Iron & Steel status bug (A.3) contaminates this for that sector |
| 14 | MRV readiness | ✅ `mrv.py`, `MRVReadinessCard.tsx` |
| 15 | Methodology mapping | 🟡 `regulatory.py`/`methodologies.json` exist; unclear if opportunity engine actually links project→methodology code |
| 16–24 | Project eval, BUY/BUILD/HYBRID, optimizer, NPV/IRR/payback/cost-per-tonne | ✅ `finance.py`, `optimizer.py` |
| 25–29 | Scenario variables (price/output/delay/financing) | ✅ `scenarios.py`, `ScenarioSliders.tsx` |
| 30 | Peer benchmarking | ✅ `PeerBenchmarkCard.tsx` + GEI benchmark model — 🟡 pending real-data validation (A.3) |
| 31 | Anomaly intelligence | ✅ `anomaly.py` + IsolationForest model |
| 32 | Decarbonisation opportunity discovery | ✅ `opportunity_engine.py`, `DecarbonisationMatrix.tsx` — 🟡 benchmark realism unverified |
| 33–34 | Recommendation engine + explainability | ✅ `optimizer.py` + `explanation.py` + `ExplainabilityCard.tsx` |
| 35–41 | Source/calc traceability, assumptions, uncertainty, versioning | ✅ `SourceTraceDrawer.tsx`, `endpoints_sources.py`, `source-register.md` — 🟡 uncertainty bands not evidenced anywhere (no CI/prediction interval fields seen) |
| 42–43 | Gemini explanation + fallback | ✅ but weak structuring (A.1) |
| 44 | Synthetic-data handling/labelling | ✅ good discipline (`data_status: SYNTHETIC`) |
| 45 | Regulatory discrepancy register | ✅ exists — 🔴 contains an error (Iron & Steel) that must be fixed, not just "exists" |
| 46–50 | Portfolio view, personalized facility view, exec summary, decision cockpit | ✅ `/overview`, `/industrial-intelligence`, `/decision` |

**Overall: this is roughly 70–75% structurally complete against the full documented product**, with the two biggest real gaps being (1) **no real external data anywhere**, and (2) **frontend visual/interaction polish and charting**, not missing backend logic.

---

## C. PRODUCT GAP ANALYSIS — TOP 10, RANKED BY IMPACT

1. **Zero real data ingested.** `real_reference_data/` is empty. Every number in the app is synthetic or hand-entered regulatory config. Highest-priority gap relative to the brief's "real data" mandate.
2. **Regulatory status bug (Iron & Steel marked FINAL when it is DRAFT).** Actively wrong, ships a false regulatory claim — must fix before anything else, this is a trust-destroying bug for a compliance product.
3. **Duplicate regulatory data folders** (`regulatory/` vs `regulatory_truth/`) — ambiguous source of truth, violates the project's own "one config" rule.
4. **ML model validity unproven.** Suspiciously perfect R² strongly suggests the model is fitting a synthetic formula, not learning a real relationship. Needs honest re-evaluation and a "confidence: low, trained on synthetic data" label until real data exists.
5. **No charting library / limited visual language.** "Premium UI" ambition is not achievable with hand-rolled SVG panels alone at this scope — Decision Twin bars, scenario sensitivity curves, GEI-vs-target trend lines all need a real chart layer.
6. **No global frontend state store**, likely causing redundant fetches and state drift between `/decision`, `/scenarios`, `/industrial-intelligence`.
7. **No E2E/browser tests, no frontend unit tests, no ML validation tests.** Testing pyramid is backend-only.
8. **Sector-specific input forms not evidently differentiated** — one generic form vs. the seven distinct sector schemas the domain docs specify.
9. **Gemini integration not structured-output-safe** — free text narrative, not JSON-schema constrained; numeric hallucination risk not fully closed even though the intent (fallback, no-override) is correct.
10. **Documentation drift** — docs already claim things (Framer Motion, model certainty) not supported by code; must be re-synced, and a doc-vs-code CI check would prevent recurrence.

---

## D. CURRENT REGULATORY UPDATE (verified 21 Aug 2026, web-sourced)

- **Finalised (FINAL status) CCTS compliance sectors as of Aug 2026:** Cement, Aluminium (primary — Apr 2025 notification — and secondary — Jan 2026), Chlor-Alkali, Pulp & Paper, Petroleum Refinery, Petrochemicals, Textile. This is **7 named sectors, 8 counting primary/secondary Aluminium separately**, ~490+ obligated entities in the original four, growing with the Jan-2026 additions. This matches the knowledge-base docs' "seven current monitored sectors" framing.
- **Iron & Steel:** **Still DRAFT**, not final, as of this audit. MoEFCC issued a *revised* draft on 26 June 2026 (public 2 July 2026) covering 255 units (JSW Steel, Tata Steel, SAIL, ArcelorMittal Nippon Steel, sponge-iron/ferro-alloy producers), baseline FY2023-24, compliance target FY2026-27 only (FY2025-26 left blank), 60-day objection window from ~2 July 2026 (i.e. objection window closes ~early September 2026 — final notification could plausibly land shortly after the audit date, so this status needs a re-check at Antigravity build time, not assumed frozen).
- **Fertiliser:** No evidence found of a finalised notification; remains part of the broader nine-sector transition architecture per BEE, consistent with the KB docs' "future/watchlist" treatment.
- **Repo correction required:** `docs/regulatory-discrepancies.md` DISC-05, `data/regulatory(_truth)/regulatory_status.json`, and `data/synthetic/master_entities.json` all currently over-state Iron & Steel's status. Antigravity must downgrade Iron & Steel back to `DRAFT`/`WATCHLIST` with the corrected source citations above, **and add a scheduled re-verification task** (not a one-time fix) since this sector is genuinely close to finalisation and could flip during the build window.
- **General regulatory rule for Antigravity:** treat every sector-status field as **live-checked, not hard-coded** — this is already the documented intent (Section 58 of the Build Master) but the Iron & Steel bug shows the *implementation* violated the *intent*. The fix is process (a dated, sourced discrepancy-log entry that is actually re-verified before merge), not just a schema.

---

## E. DATASET RESEARCH REPORT (real data candidates)

| Dataset | Owner | What it gives CarbonAlpha | Access | Caveats |
|---|---|---|---|---|
| **CCTS GEI Target notifications & Gazette PDFs** (Jan 2026 G.S.R. 25(E), June 2026 Iron & Steel draft, original 2023 notifications) | MoEFCC / e-Gazette | Real, entity-level baseline output, baseline GEI, 2025-26 & 2026-27 target GEI for every obligated entity in finalised sectors | Public PDF, parse with `pdfplumber`/`camelot` | Entity identity is real — CarbonAlpha must **not** silently expose real company names as "demo" data (Section 14/36 of Build Master); use for *regulatory reference data* (targets/baselines), not as the visible "demo entity," or clearly separate "real regulatory target lookup" from "synthetic demo facility" |
| **BEE Detailed Compliance Procedure (v1.0, Jul 2024)** | BEE | Real emission-factor structure, source-stream/mass-balance formulas, activity-data definitions | Public PDF | Static reference document — version it, don't scrape repeatedly |
| **BEE Offset Mechanism methodology list** | BEE | Real, current methodology codes/titles (currently in flux — 8 vs 12 vs other counts across BEE pages, per the KB's own discrepancy log) | Public HTML | Must be scraped with a date-stamped snapshot each time, never hard-coded as a fixed count |
| **BRSR / BRSR Core disclosures** (NSE/BSE listed-company ESG filings) | SEBI-mandated, filed via exchanges | Real corporate-level Scope 1/2 emissions, energy mix, renewable %, for exactly the kind of large obligated entities (Tata Steel, JSW, UltraTech, etc.) CarbonAlpha targets | BSE/NSE filing portals, some aggregated on company IR pages; no single clean bulk API — requires per-company PDF/XBRL parsing | Heavy lift, license/attribution: this is public disclosure, safe to reference with attribution; **do not fabricate values for companies that haven't disclosed** |
| **CEA (Central Electricity Authority) grid emission factor database** | CEA | Real, official electricity emission factor (tCO2/MWh) by year — needed for any purchased-electricity emissions calc | Public PDF/XLS, annual | Must version by publication year; do not reuse a stale factor |
| **Ministry of Power Annual Report, Lok Sabha answers, PIB releases** | GoI | Real obligated-entity counts, sector coverage, policy timeline facts (already partially used in the KB docs) | Public PDF | Good for narrative/regulatory-context fields, not facility-level data |
| **ICAP / World Bank Carbon Pricing Dashboard** | Institutional secondary sources | Independent cross-checks on sector counts, notification dates, scheme design | Public | Tier-3 cross-check only, never overrides Tier-1 (BEE/Gazette/MoEFCC) per the KB's own hierarchy |
| **NITI Aayog / MoSPI industrial statistics, ASI (Annual Survey of Industries)** | MoSPI | Sector-level real production/energy-intensity distributions — useful to *calibrate* the synthetic-data generator's ranges even where facility-level data can't be obtained | Public (ASI unit-level microdata requires registration/approval) | Sector/aggregate level only — good for calibration, not for facility-level synthetic seeding of a *specific* demo company |
| **CMIE Prowess / company financial databases** | CMIE (commercial) | Real CAPEX/OPEX/financial baselines for the financial engine's calibration | **Paid, licensed** | Do not access without a license; flag as optional/deferred |
| **Company sustainability reports (self-published PDFs)** | Individual companies | Real project case studies (e.g. actual waste-heat-recovery CAPEX/reduction figures) to calibrate the Decarbonisation Opportunity Engine's assumption ranges | Public PDF per company | Use only to *calibrate ranges*, cite the source per figure, never claim a project is a specific real company's project inside the demo |

**Bottom line:** genuinely facility-level, machine-readable, freely-licensed real operating data (production/energy/emissions row-by-row) does **not** exist in one clean public dataset for Indian industrial CCTS entities. The two realistic real-data wins are: (1) **real regulatory target/baseline tables** from the Gazette (entity-level, but only usable as *reference data*, not as the visible demo entity's live operating numbers), and (2) **real BRSR/company-disclosure figures** for a small number of large obligated entities, usable as calibration/cross-check reference points, cited by source, clearly separate from the synthetic demo entity's numbers.

---

## F. REAL VS SYNTHETIC DATA STRATEGY

```
REAL OFFICIAL REGULATORY DATA   → target_record, baseline_record, source_register (from Gazette/BEE)
REAL CORPORATE DISCLOSURE       → optional calibration/cross-check layer (BRSR excerpts, cited, not fabricated)
REAL SECONDARY / INSTITUTIONAL  → narrative context only (ICAP, World Bank, Lok Sabha answers)
CALIBRATED SYNTHETIC            → all facility operating data (production, energy, fuel, process emissions)
SCENARIO DATA                   → CCC price, delay, financing rate — always user/demo-entered, always labelled
```

Concrete rule for Antigravity: **the demo entity's operating numbers stay synthetic and clearly labelled** (as they already correctly are in `master_entities.json`), but the *regulatory target it is measured against* should be upgraded from a hand-typed value to a **generator that ingests the real, parsed Gazette target table** and maps one real target row to one synthetic entity configuration (this is literally what Section 19 of the Build Master already specifies — it's just not wired to a real ingestion pipeline yet). The synthetic operating-data generator itself must move from "equation-consistent but presumably hand-tuned constants" (current state, which is good but opaque) to a **documented, versioned, statistically-calibrated generator**: real sector-level distributions (from ASI/CEA/BRSR aggregates) parameterize the ranges; Monte Carlo draws within those ranges feed the same deterministic equations already in use. This closes the "too-perfect R²" problem in Section A.3/C.4 because the training data will then contain genuine real-world-calibrated noise and variance instead of a clean formula the model can memorize.

---

## G. COMPLETE DATA MODEL (delta on top of existing schema — see Build Master §9–11, 34 for base)

Add/extend:
- `regulatory_targets`: add `source_document_id`, `source_page_ref`, `parse_confidence`, `ingested_at`, `real_or_synthetic_target = REAL` (targets should now be flagged as real, since they come from an actual Gazette table — this is a new distinction not present in the current schema, which only labels *entities* as synthetic, not *targets* as real).
- `dataset_provenance` (new table, backs the empty `data/provenance/` folder): `dataset_id, source_url, retrieved_at, license_note, real_or_synthetic, calibration_basis`.
- `model_registry`: add `training_data_provenance_ids[]`, `known_limitations` (free text — e.g. "trained on 100% synthetic data; treat predictions as illustrative until real-facility data is incorporated"), `confidence_tier` enum (`ILLUSTRATIVE` / `CALIBRATED` / `VALIDATED`).
- `peer_groups`: sector, subsector, sample_size, data_provenance_mix (e.g. "18 synthetic + 3 BRSR-derived reference points").

---

## H. ML ARCHITECTURE

Keep the existing specialization pattern (good instinct already in the repo — separate GEI benchmark model and anomaly model rather than one blob):

1. **GEI Peer Benchmark** (exists — `HistGradientBoostingRegressor`) — **re-scope**: retrain on the recalibrated synthetic data (F above), report metrics honestly, add a naive baseline (sector-median GEI) comparator so the "lift" over doing nothing is visible and credible, add prediction intervals.
2. **Anomaly Detector** (exists — `IsolationForest`) — keep; add reason-code generation from deterministic feature deltas (already specified in Build Master §57) rather than raw anomaly score alone.
3. **Energy Benchmark model** — **NEW**, same architecture pattern as #1, target = energy intensity instead of GEI.
4. **Decarbonisation Opportunity Estimator** — only implement the parts backed by cited real project benchmarks (F above); everywhere else, keep it rule-based/deterministic with an explicit "MODELLED" label rather than inventing an ML model with no real labels (this matches Section 13 of the master prompt's own instruction not to fabricate model accuracy).
5. **Project performance / price forecasting** — **do not build** (matches Build Master §48/§27 — explicitly out of scope; insufficient real CCC trading history exists).

---

## I. MODEL TRAINING PLAN

1. Freeze/version the current model artifacts as `*_v1` (already done — good).
2. Rebuild the synthetic training generator per Section F (calibrated ranges, not hand constants) → produces `*_v2` training/holdout sets, versioned and provenance-tagged.
3. Retrain GEI benchmark + energy benchmark models on `v2` data; retrain anomaly detector; keep facility-level split (no facility's records span train and holdout) — this must be explicitly checked, not assumed, in the current `v1` (1,840/200 split, provenance of the split unclear).
4. Compare `v2` metrics against `v1` and against a naive baseline; **expect and report a lower, more honest R²** — this is a feature of the fix, not a regression, and must be explained as such in the model card, not hidden.
5. Re-run anomaly model with the same recalibrated data; validate reason-codes against a small hand-built set of "obviously anomalous" synthetic rows (edge cases from Build Master §52) to confirm sane behaviour.

## J. MODEL VALIDATION PLAN

- Facility-level and time-based split enforcement (assert no leakage in a test).
- Baseline comparison (sector-median / linear regression) mandatory in the model card for every model.
- Confidence intervals or at minimum a stated error band on every prediction surfaced in the UI.
- A standing `NEEDS_RESEARCH` flag on any model until it has been checked against at least a handful of real reference points (BRSR-derived), even if the volume is small — "small real signal + honest caveat" beats "large synthetic signal + false confidence."

---

## K. PERSONALIZED USER FLOW

Existing `/industrial-intelligence` + `FacilityInputForm.tsx` + `PeerBenchmarkCard.tsx` + `DecarbonisationMatrix.tsx` already implement most of Section 21 of the master prompt. Delta needed: (1) make the form genuinely sector-branching (C.8 gap), (2) add explicit uncertainty/confidence display next to every model-derived number, (3) add the "review" step before "analyze" called for in the onboarding flow (Section 8 of the master prompt) if not already present — verify in Antigravity Phase 0.

## L. BACKEND ARCHITECTURE

Keep the modular monolith. Priority backend work: (1) fix regulatory data duplication (C.3), (2) wire a real ingestion module for Gazette target tables (E/F), (3) harden Gemini to strict JSON-schema output, (4) add a `dataset_provenance` service, (5) close the DB question — decide and document whether SQLite/Postgres is actually used or whether the system is intentionally file-backed JSON (if the latter, say so explicitly rather than leaving a misleading `DATABASE_URL` in `.env.example`).

## M. FRONTEND ARCHITECTURE

Add a chart library (recharts is the lightest fit for this stack and is already an approved library elsewhere in this environment), add a lightweight global store (Zustand is a good fit — small, no boilerplate, works cleanly with Next.js App Router client components) so `/decision`, `/scenarios`, and `/industrial-intelligence` share one `AppState` instead of re-fetching, add `framer-motion` for the purposeful micro-interactions the docs already (prematurely) claim, and run a full design pass per Section S (premium UI spec) below.

## N. API PLAN

No new services; extend existing six endpoint groups; add `GET /api/data/provenance/{dataset_id}` and `GET /api/models/{model_id}/card` to expose H/I/J transparently in the UI's source drawer.

## O. DATABASE PLAN

Resolve the SQLite/Postgres ambiguity (L) first; then extend schema per G. Do not introduce a new DB technology.

## P. SOURCE/PROVENANCE PLAN

`SourceTraceDrawer.tsx` + `endpoints_sources.py` already exist — extend to surface `dataset_provenance` and `model_registry.confidence_tier` alongside the existing regulatory source fields, so a user can see "this GEI target is REAL (Gazette G.S.R. 25(E))" vs. "this facility's energy figure is SYNTHETIC (calibrated generator v2)" vs. "this benchmark is a MODEL prediction (illustrative confidence)" in one consistent panel.

## Q. SECURITY PLAN

Rotate/remove the real `.env` found in the zip root before any further sharing (see U). Otherwise the existing minimal posture (env vars, CORS restriction, no secrets in frontend) is appropriate for this stage — do not overbuild auth for a judged/demo system.

## R. TESTING PLAN

Add: frontend component tests (Vitest + React Testing Library), one Playwright E2E happy-path script (sector → entity → calculation → decision → scenario slider → source drawer, matching the Build Master's 90-second judge script in §62), an ML leakage/regression test that fails CI if holdout R² on GEI benchmark exceeds a suspiciously-high ceiling without a corresponding real-data justification, and a `pytest` run recorded as the Phase-0 baseline before any other change.

## S. PRODUCTION IMPLEMENTATION ROADMAP

Directly mirrors the 18-phase plan in the source document (Section 41 of the uploaded starter prompt) — reused as-is in the final Antigravity prompt below, since it is already correctly sequenced (audit → regulatory verification → data architecture → real ingestion → cleaning → EDA → synthetic calibration → ML → governance → backend intelligence → frontend → opportunity engine → BUY/BUILD/HYBRID → Gemini → traceability → testing → browser QA → security/perf → final audit).

## T. FILES TO GIVE ANTIGRAVITY

**REQUIRED:** entire repo minus excluded items below; both knowledge-base docs; the Build Master doc; this audit document; the final Antigravity master prompt (next artifact).
**RECOMMENDED:** `docs/screenshots/*` (visual baseline for "don't destroy existing design"), `data/model_registry/registry.json` (so it knows what already exists before retraining).
**OPTIONAL:** `.git` history (useful for understanding build order but not required).

## U. FILES NOT TO GIVE ANTIGRAVITY

`.env` (contains real values — **found present in the zip root; rotate any keys it contains and strip it before handoff**), `frontend/node_modules/`, `frontend/.next/`, `.pytest_cache/`, any `__pycache__`. Regenerate `node_modules`/`.next` via install/build instead of shipping them.

## V. RISKS / LIMITATIONS / DATA GAPS

1. No clean bulk real facility-level operating dataset exists publicly for Indian CCTS entities — the real-data ambition has a hard ceiling; set expectations accordingly.
2. Iron & Steel regulatory status is moving in real time (objection window closes ~early Sept 2026) — whatever status Antigravity ships may be stale within weeks; the fix is a re-verification process, not a one-time patch.
3. Current ML "success" (R²=0.99) is very likely an artifact of synthetic-data circularity, not genuine predictive skill — must be corrected and honestly re-reported, not preserved because the number looks good.
4. BEE's own methodology-count pages disagree with each other by date (documented already in the KB) — expect this kind of source drift to recur and design for it (versioned scrape snapshots), not treat any one number as permanently fixed.
5. Gemini model naming/availability should be re-verified against current documentation at build time rather than trusting the `.env.example` default.

## W. DEFINITION OF DONE

A facility can be created (sector → real-target-backed regulatory profile → synthetic-but-calibrated operating data), see a correct carbon position, a peer benchmark with an honestly-reported confidence level, at least one anomaly check, a decarbonisation opportunity list with cited assumption ranges, a working BUY/BUILD/HYBRID comparison that responds live to the four scenario sliders, a Gemini (or deterministic-fallback) explanation that is schema-constrained against inventing numbers, and a source drawer that correctly distinguishes REAL / SYNTHETIC / CALCULATION / MODEL / SCENARIO for every material number on screen — with the Iron & Steel status bug fixed and the regulatory-data-folder duplication resolved, all existing routes/components preserved and visually upgraded (not replaced), and a passing test suite (backend unit + at least one E2E) recorded.
