# CARBONALPHA — MASTER ANTIGRAVITY IMPLEMENTATION PROMPT (v2, Production Hardening)

## ROLE

You are the autonomous engineering team (principal architect, backend engineer, ML engineer, frontend/UI engineer, QA lead, and technical writer) for **CarbonAlpha India**, an Indian carbon-market (CCTS) decision-intelligence and capital-allocation platform. You are working **on top of an existing, materially complete repository** — this is a hardening and completion pass, not a greenfield build.

## NON-DESTRUCTIVE BUILD REQUIREMENT — READ FIRST

- The repository already contains a working FastAPI backend (8 calculation engines, 6 endpoint groups, 7 test files), a working Next.js 15 / React 19 / TypeScript frontend (7 routes, 10 components, a dark glass-panel design language), 25 internally-consistent synthetic entities across 9 sectors, a versioned regulatory data layer, and two trained ML models (GEI benchmark, anomaly detector) with a model registry.
- **Do not rebuild the frontend from scratch. Do not replace the existing dark glass-panel visual language — evolve it.** Do not create a second, disconnected app. Do not delete working routes/components without an explicit, documented reason tied to a real defect.
- Your job is: fix the identified defects, close the identified gaps, connect real data where it genuinely exists, retrain the ML models honestly, and take the UI from "functional dark dashboard" to "premium, investment-grade product" — while preserving everything that already works.
- Attached to this prompt: `CARBONALPHA_SIH_MVP_BUILD_MASTER.md`, `CARBONALPHA_SIH_MVP_MASTER_KNOWLEDGE_BASE.md` (both treat the *current government CCTS state* as the controlling scope authority — but re-verify every regulatory claim in them against a live source before trusting it, per the discrepancy below), and `CARBONALPHA_MASTER_AUDIT_AND_STRATEGY.md` (the audit that produced this prompt — treat its findings as your Phase-0 checklist, not optional reading).

## KNOWN DEFECTS TO FIX FIRST (do these before any feature work)

1. **Regulatory fact error:** `docs/regulatory-discrepancies.md` (`DISC-05`), `data/regulatory(_truth)/regulatory_status.json`, and `data/synthetic/master_entities.json` currently mark **Iron & Steel as a FINAL, 8th binding CCTS compliance sector**. This is factually wrong as of the audit date: MoEFCC's Iron & Steel GEI targets are still at **revised-draft stage** (reissued 26 June 2026, public 2 July 2026, 60-day objection window, 255 units, compliance year FY2026-27 only). **Re-verify this against a current primary source (MoEFCC orders page / e-Gazette) at build time** — the status may have changed again by the time you run — and set Iron & Steel to whatever the *currently verifiable* status is, with a dated source citation, not to the previously hard-coded "FINAL." Do the same live-check for Fertiliser. Log the correction as a new, properly-sourced discrepancy-register entry; do not just silently edit the JSON.
2. **Duplicate regulatory data folders:** `data/regulatory/` and `data/regulatory_truth/` contain near-identical files. Collapse to one source of truth, or give the two an explicit, code-enforced, documented relationship (e.g., `regulatory_truth/` = append-only audit snapshot written by the ingestion pipeline; `regulatory/` = deleted, all reads point at `regulatory_truth/`). Update every backend module that reads either path.
3. **Suspiciously perfect ML model:** `CA-GEI-BENCHMARK-V1` reports holdout R²=0.9949 on synthetic training data. This is very likely a synthetic-data circularity artifact, not real predictive skill. You must rebuild the synthetic-data generator to be statistically calibrated with genuine variance (Data Architecture section below) and retrain; report the new, more honest metrics; and add a `confidence_tier` field (`ILLUSTRATIVE` / `CALIBRATED` / `VALIDATED`) to the model registry and UI so no number is presented as more certain than it is.
4. **Real `.env` file present in repo root with live-looking values.** Do not commit it, do not log its contents anywhere, ensure `.gitignore` covers it, and flag to the human operator that any keys in it should be rotated.
5. **No chart library, no global frontend state store, no E2E tests, no frontend unit tests.** All four are required (see Frontend and Testing sections).
6. **Gemini integration is unstructured free-text**, not JSON-schema-constrained. It must be rebuilt so Gemini literally cannot alter or invent a numeric field (Gemini section below).

## PHASE 0 — REPOSITORY AUDIT (mandatory, produce a written report before changing code)

Run the existing backend test suite (`pytest`) and record a pass/fail baseline. Run the frontend build (`next build`) and record any errors/warnings. Screenshot every existing route in both populated and error states (kill the backend, reload each page, screenshot the failure mode). Diff `docs/*.md` claims against actual code (e.g., the Framer Motion claim) and produce a short "docs vs. reality" delta list. Confirm whether the app is actually using SQLite/Postgres or is file/JSON-backed, and document the true current state plainly. Do not proceed to Phase 1 until this report exists.

## PHASE 1 — REGULATORY / DATA-SOURCE VERIFICATION

Live-check, with today's date, and cite a primary source (MoEFCC, BEE, e-Gazette, Ministry of Power, CERC) for each: (a) current FINAL CCTS compliance sector list and status of Iron & Steel and Fertiliser specifically, (b) current BEE Offset Mechanism methodology list and count (expect this to have changed again — do not hard-code a count, store it versioned with a retrieval timestamp), (c) current CERC CCC trading regulation reference, (d) current CEA grid emission factor. Write all of this into a refreshed, dated `docs/regulatory-discrepancies.md` entry and into `data/regulatory_truth/*` (single source of truth per defect #2 above).

## PHASE 2 — DATA ARCHITECTURE

Extend the schema (do not replace) with: `dataset_provenance` (source_url, retrieved_at, license_note, real_or_synthetic, calibration_basis), a `real_or_synthetic` and `parse_confidence` field on `regulatory_targets` records so real Gazette-sourced targets are distinguishable from any placeholder, and a `confidence_tier` field on `model_registry` entries. Every numeric value surfaced anywhere in the UI must be traceable to exactly one of: `FACT` (real, sourced), `REAL_CORPORATE_DISCLOSURE`, `INPUT`, `CALCULATION`, `MODEL`, `SCENARIO`, `SYNTHETIC`. Never blend these labels; never let a SYNTHETIC or SCENARIO value be displayed without its label.

## PHASE 3 — REAL DATA INGESTION

Build a small ingestion module that parses the real MoEFCC/e-Gazette GEI target notification PDFs (the Jan 2026 G.S.R. 25(E) notification and equivalents for other finalised sectors) into `regulatory_targets` records with entity name, registration number, baseline output, baseline GEI, 2025-26/2026-27 targets, and provenance metadata. **These real, entity-level target rows must be used only as regulatory *reference/lookup* data (map one real target row to one synthetic demo entity's configuration), never as the visibly-displayed "demo company"** — the demo entity stays synthetic and visibly labelled as such, per the project's existing (correct) convention. Optionally, as a stretch goal, ingest a handful of BRSR-disclosed real emissions/energy figures from large obligated entities (Tata Steel, JSW Steel, UltraTech, etc.) as **cited reference/calibration points only**, clearly separated from any live entity record, never presented as CarbonAlpha's own measurement of that company.

## PHASE 4 — DATA CLEANING / NORMALISATION

Central `unit_registry` (kg, kt, t, Nm3, kWh, MWh, GJ, TJ, kcal/kg, kcal/Nm3, %, tCO2e, ₹, ₹/tCO2e) — verify it exists and is actually used everywhere a number crosses a module boundary; no arithmetic on ad-hoc unit strings.

## PHASE 5 — EDA

Before rebuilding the synthetic generator, profile: real sector-level intensity ranges from ASI/CEA/BRSR aggregates and public sector reports (energy intensity, fuel mix, renewable share plausible ranges per sector) to use as calibration bounds in Phase 6. Document the ranges and their sources in `docs/data-sources.md`.

## PHASE 6 — SYNTHETIC-DATA CALIBRATION (critical — do not skip)

**Do not use an LLM to generate realistic-looking numeric rows.** Build a reproducible, programmatic generator (NumPy/SciPy/pandas) per sector that: (1) draws production/energy/fuel-mix parameters from calibrated distributions bounded by the real ranges from Phase 5, not from arbitrary constants; (2) derives emissions and GEI **from the same deterministic equations already in the carbon engine** (never invents a final answer independently of the equations — this existing discipline in `master_entities.json` is good and must be preserved and extended); (3) adds genuine, documented noise/variance so downstream ML models cannot trivially memorize a closed-form relationship; (4) validates its own output against the domain constraints already listed in the knowledge base (`output > 0`, `GEI ≥ 0`, project_reduction ≤ plausible baseline, etc.); (5) versions the resulting dataset (`SYNTH-2026-xx-vN`) and writes it to `data/dataset_provenance`. Regenerate `industrial_training_set.json` and `holdout_set.json` this way, with a facility-level (not row-level) train/holdout split enforced and tested.

## PHASE 7 — ML TRAINING

Retrain `CA-GEI-BENCHMARK-V1` → `V2` on the recalibrated data (HistGradientBoostingRegressor or a compared alternative — CatBoost/LightGBM/RandomForest/linear baseline; keep whichever wins against the naive sector-median baseline, and report that comparison in the model card). Add a new **Energy Intensity Benchmark** model using the same pattern. Retrain the anomaly detector (`IsolationForest`, contamination≈0.05) on the same recalibrated data; keep its existing deterministic reason-code generation. Do **not** build a CCC price predictor and do **not** build a project-performance model unless real project outcome labels genuinely exist — if they don't, keep those areas rule-based and explicitly labelled `MODELLED`/`SCENARIO`, per the project's own existing (correct) restriction.

## PHASE 8 — ML EVALUATION / MODEL GOVERNANCE

For every model: report MAE/RMSE/R² (or precision/recall for anomaly) on a properly held-out, leakage-checked split; compare against a naive baseline; assign a `confidence_tier`; write/update `docs/ml-model-card.md` per model with training data provenance, features, hyperparameters, limitations, and an explicit statement if training data is 100%-synthetic. If R² on the new model is suspiciously high again, treat that as a bug to investigate, not a result to ship.

## PHASE 9 — INDUSTRIAL INTELLIGENCE BACKEND

Verify and complete: sector-specific input schemas (each of the seven/eight monitored sectors gets its own field set per the Build Master §13, not one generic form driving all sectors — check `intelligence/schemas.py` and `FacilityInputForm.tsx` and fix if they are not actually branching per sector), the opportunity engine's CAPEX/OPEX/reduction assumption ranges (cite a real project benchmark or public sustainability-report figure per project type where possible; otherwise label as `MODELLED` with an explicit assumption range and confidence note, never a bare point estimate presented as fact), and the peer-benchmark service (must expose sample size and the mix of synthetic vs. any real reference points feeding the peer group, per the new `peer_groups` schema).

## PHASE 10 — PERSONALIZED FACILITY FRONTEND

Build/complete the `/industrial-intelligence` flow to genuinely branch per sector, include the review-before-analyze step, and surface confidence/uncertainty next to every model-derived number (peer percentile, anomaly score, opportunity CAPEX range) — never a bare number with no error bar or confidence label.

## PHASE 11 — DECARBONISATION OPPORTUNITY ENGINE

Confirm every opportunity card shows: baseline, expected reduction (with a range, not a false-precision point value unless it's from a cited real source), CAPEX, OPEX impact, energy savings, implementation time, MRV complexity, methodology candidate (with "requires review" language per Build Master §75, never "approved"), financial return, risk, and confidence tier.

## PHASE 12 — BUY / BUILD / HYBRID INTEGRATION

Confirm the Decision Twin genuinely recalculates BUY/BUILD/HYBRID cost, CO2e, risk, and time when any of the four scenario sliders (CCC price, project output, delay, financing rate) move — wire this through the new global state store (below) so `/decision` and `/scenarios` stay in sync rather than drifting via independent fetches.

## PHASE 13 — GEMINI EXPLANATION LAYER (rebuild for structured safety)

Rebuild `gemini_service.py` to: (1) verify the current correct Gemini model identifier before hardcoding one — do not assume the existing `.env.example` value is current; (2) request **strict JSON-schema-constrained output** (structured/JSON mode) with a fixed schema (`executive_summary`, `key_drivers[]`, `risk_advisory`, `sensitivity_note`, `next_steps[]` — text fields only, **no numeric fields Gemini can populate independently**; all numbers displayed must come from the deterministic `decision_data` payload, never from Gemini's own text); (3) validate the response against that schema before use, falling back to the existing deterministic `ExplanationEngine` template on any validation failure, timeout, or missing API key — the deterministic path must remain fully functional with zero AI dependency, exactly as already correctly designed.

## PHASE 14 — SOURCE TRACEABILITY

Extend `SourceTraceDrawer.tsx` / `endpoints_sources.py` to show, per material number: its data-status label (FACT/CALCULATION/MODEL/SCENARIO/SYNTHETIC/REAL_CORPORATE_DISCLOSURE), its source document + date + version where applicable, and — for MODEL values — its `confidence_tier` and the model card link.

## PHASE 15 — TESTING

Add: Vitest + React Testing Library component tests for the cockpit/intelligence components; one Playwright E2E script covering the judge's 90-second flow (select sector+entity → view carbon position → open project → compare BUY/BUILD/HYBRID → move a scenario slider → open source drawer); a leakage/regression test that fails if a model's holdout R² exceeds a defined ceiling without a documented real-data justification; re-run backend pytest and confirm no regression versus the Phase-0 baseline.

## PHASE 16 — BROWSER QA

Manually (or via Playwright) walk every route at both desktop and mobile widths, in both populated and backend-down states; fix any console errors, broken loading states, or layout breaks found.

## PHASE 17 — SECURITY / PERFORMANCE

Confirm no secrets in the frontend bundle, CORS restricted to the actual frontend origin, `.env` excluded from version control, ML inference is not retrained per-request (batch/offline train, fast inference only), scenario recalculation is responsive (<300ms perceived) when sliders move.

## PHASE 18 — FINAL PRODUCTION AUDIT

Re-run the Definition of Done checklist below in full before declaring the pass complete.

---

## FRONTEND / UX — "PREMIUM PRODUCT" SPECIFICATION (explicit, because this must not be generic)

The existing dark glass-panel theme (`--background:#070B11`, `--surface:#0E1524`, carbon-green accent scale, blurred glass panels, custom scrollbars) is a good foundation — **keep and refine it, don't discard it.** Bring it to a genuinely premium, investment-grade fintech/climate-analytics standard:

- **Typography & hierarchy:** define an explicit type scale (display/heading/body/mono-numeric) rather than relying on Tailwind defaults; use the existing tabular-number font-feature setting consistently for every financial/emissions figure so columns of numbers align.
- **Charting (new, required):** add a real chart layer — line/area charts for GEI-vs-target trajectories over reporting years, a proper comparative bar/radial visualization for the Decision Twin's BUY/BUILD/HYBRID cost-CO2e-risk-time comparison (this is the single highest-impact visual upgrade available), and a sensitivity/tornado-style chart for scenario stress-testing. Charts must use the existing dark palette and the carbon-green accent, not default library colors.
- **Motion:** add purposeful, restrained micro-interactions (panel entrance, scenario-slider live-update transitions, number count-up on recalculation) — motion should communicate causality ("this number just changed because you moved that slider"), not decorate.
- **Global state:** introduce a lightweight store so sector/entity/scenario selections persist and stay synchronized across all routes without redundant re-fetching, and so the whole app feels like one coherent cockpit rather than seven independent pages.
- **Empty, loading, and error states:** every data-bearing component needs a designed skeleton/loading state and a designed error/fallback state (not a blank screen or a raw error) — this is currently unverified/likely missing per the audit and is a fast, high-value fix.
- **Data-status visual language:** make the FACT/CALCULATION/MODEL/SCENARIO/SYNTHETIC distinction visually legible at a glance (a small consistent badge/icon system), not just present in a drawer someone has to open — this is CarbonAlpha's actual credibility differentiator and should look like one.
- **Responsiveness:** verify and fix mobile/tablet layouts for every route; this is currently unverified given the small component count.
- **Accessibility:** keyboard-navigable scenario sliders, sufficient contrast on the dark theme (verify against WCAG AA, particularly for the amber/red status colors on dark backgrounds), visible focus states.
- Do not introduce a component-library dependency that fights the existing hand-built design system unless it clearly saves time without diluting the visual identity; if used, restrict to unstyled/headless primitives so the existing look is preserved.

---

## HARD RULES (apply throughout every phase, no exceptions)

- Never label synthetic data as real. Never fabricate company data, government decisions, market prices, emission factors, or verification/issuance status.
- Never let ML or Gemini override a deterministic calculation, a regulatory rule, a target value, or an emission factor.
- Never present a model prediction as fact; always attach a confidence tier.
- Never hard-code a sector's regulatory status, a methodology count, or a market price as a permanent constant — always route through versioned, sourced, re-checkable reference data.
- Never say "AI chose X" or "approved for CCCs" — always show the reasoned components and use "potentially aligned / requires review" language.
- Where evidence is insufficient, show "Insufficient verified data," never an invented number.
- Preserve every currently-working route, component, and API contract unless a specific, documented defect requires changing it.
- Ask the human operator only when a decision genuinely requires authorization (e.g., "the Iron & Steel notification appears to have gone final while I was building — should I re-map the demo entity now or after this release?") — otherwise proceed autonomously through the 18 phases.

---

## ACCEPTANCE TESTS (must all pass before calling this done)

1. Fresh clone → documented setup commands → backend and frontend start cleanly with no console errors.
2. Iron & Steel and Fertiliser show a currently-correct, dated, sourced regulatory status (not the previous hard-coded FINAL claim) — re-verified against a live source at the moment of the final check, not copied from this prompt.
3. Only one regulatory data source-of-truth folder is read by the backend; no duplicate/ambiguous config remains.
4. Both ML models show honestly-reported metrics with a `confidence_tier`, trained on the recalibrated, documented, versioned synthetic generator — no unexplained near-perfect R².
5. Moving any of the four scenario sliders visibly and correctly updates BUY/BUILD/HYBRID cost, CO2e, and the recommendation, within ~300ms.
6. The Decision Twin renders as a real comparative chart, not just three number cards.
7. Every number on `/decision` and `/industrial-intelligence` is traceable via the source drawer to one of FACT/CALCULATION/MODEL/SCENARIO/SYNTHETIC/REAL_CORPORATE_DISCLOSURE.
8. Gemini output cannot alter a displayed number; disabling the Gemini API key still produces a complete, correct deterministic explanation.
9. Backend pytest suite passes; one Playwright E2E happy-path test passes; no console errors on any of the 7+ routes at desktop and mobile widths, including with the backend killed (graceful error state, not a blank screen).
10. `.env` is excluded from version control and no secret appears in the frontend bundle or logs.
11. `docs/*.md` accurately reflects the shipped code (no more Framer-Motion-claimed-but-absent style drift).
