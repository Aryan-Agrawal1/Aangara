# CarbonAlpha — Regulatory Discrepancies & Evolution Log

This register documents all regulatory updates, discrepancies, and reconciliation events across the Indian Carbon Market (CCTS) statutory framework.

**Source hierarchy:** Tier 1 = MoEFCC Gazette / BEE official notifications · Tier 2 = BEE/Ministry of Power press releases · Tier 3 = institutional cross-checks (CEEW, ICAP, World Bank). Tier 1 always overrides.

---

## Record ID: `DISC-05` — SUPERSEDED — Previous Iron & Steel FINAL claim
* **Date recorded:** 2026-08-19
* **Status:** SUPERSEDED by DISC-06 (correction below)
* **Prior (incorrect) claim:** Iron & Steel elevated to 8th binding CCTS compliance sector (FINAL), citing G.S.R. 88(E).
* **Correction:** G.S.R. 88(E) does not correspond to a final Iron & Steel GEI notification; the actual June 2026 notification (G.S.R. 517(E)) is a *revised draft*, not a final gazette. DISC-05 was therefore factually incorrect. **See DISC-06 for the corrected entry.**

---

## Record ID: `DISC-06` — Iron & Steel GEI Status Corrected to DRAFT
* **Date:** 2026-08-21
* **Authority:** MoEFCC
* **Statutory Source:** Draft Notification G.S.R. 517(E), issued 26 June 2026, public from 2 July 2026
* **Tier:** 1 (Gazette / MoEFCC primary source), cross-checked against CEEW, DownToEarth, SteelOrbis, Hindustan Times
* **Verification timestamp:** 2026-08-21 (live web check)
* **Prior (incorrect) state:** `iron_steel.status = "FINAL"`, `iron_steel.category = "CCTS_MONITORED"` in `data/regulatory_truth/regulatory_status.json`
* **Corrected state:** `iron_steel.status = "DRAFT"`, `iron_steel.category = "WATCHLIST"`
* **Facts verified:**
  - MoEFCC issued *revised draft* G.S.R. 517(E) on **26 June 2026**
  - Covers **255 iron and steel industrial units** (JSW Steel, Tata Steel, SAIL, ArcelorMittal Nippon Steel, sponge-iron / ferro-alloy producers)
  - Baseline year: FY2023-24; proposed compliance-year target: FY2026-27
  - **60-day public objection/comment window from ~2 July 2026 → closes ~1 September 2026**
  - Final gazette notification **has not been published** as of 21 August 2026
  - 7 other sectors (Cement, Aluminium, Chlor-Alkali, Pulp & Paper, Petroleum Refinery, Petrochemicals, Textile) are FINAL under G.S.R. 25(E) and earlier notifications — Iron & Steel is NOT among them
* **Action taken:**
  - `data/regulatory_truth/regulatory_status.json` updated: iron_steel → DRAFT / WATCHLIST
  - `data/regulatory/regulatory_status.json` deleted (duplicate folder collapsed — see DISC-07)
  - `docs/regulatory-discrepancies.md` updated with DISC-06 and DISC-07
* **Next re-verification due:** 2026-09-15 (after objection window closes)
* **Risk:** Final notification may be published between now and September 2026. Any CarbonAlpha release must re-verify this field before shipping.

---

## Record ID: `DISC-07` — Duplicate Regulatory Folder Collapsed
* **Date:** 2026-08-21
* **Issue:** `data/regulatory/` and `data/regulatory_truth/` contained near-identical files, creating an ambiguous source of truth. Backend modules were reading from `data/regulatory_truth/` (the authoritative folder).
* **Resolution:** `data/regulatory/` is no longer used as a read source. All backend engines and endpoints read exclusively from `data/regulatory_truth/`. The `data/regulatory/` folder is kept as a frozen historical snapshot but clearly marked with a `_DO_NOT_READ.txt` marker. All documentation updated to reflect `data/regulatory_truth/` as the single source of truth.
* **Files updated:** `backend/app/engines/regulatory.py`, `backend/app/api/endpoints_sources.py`

---

## Record ID: `DISC-08` — ML Model Confidence Tier Added
* **Date:** 2026-08-21
* **Issue:** `data/model_registry/registry.json` reported `holdout_r2 = 0.9949` for CA-GEI-BENCHMARK-V1 with no confidence qualifier. This suspiciously-high R² is a synthetic-data circularity artifact (training data generated from the same equations the model learns to invert), not genuine real-world predictive power.
* **Resolution:** Added `confidence_tier: "ILLUSTRATIVE"` and `known_limitations` to all model entries. ML models must be retrained on recalibrated, properly-noised data (Phase 6–7) before upgrading to "CALIBRATED".
* **Regulatory impact:** None. The ML models are advisory benchmarks; all regulatory calculations remain deterministic.
