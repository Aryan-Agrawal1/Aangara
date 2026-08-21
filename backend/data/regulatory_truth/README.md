# regulatory_truth/

**Status**: PRIMARY SOURCE — DO NOT DELETE OR RENAME THIS FOLDER

This folder is the single source of truth for all regulatory reference data used by the CarbonAlpha calculation engines.

## Contents
- `regulatory_targets.json` — GEI targets per sector (REAL: BEE/MoEFCC Gazette G.S.R. 25(E), Jan 2026)
- `regulatory_status.json` — Per-sector compliance status: FINAL/DRAFT/WATCHLIST (REAL: BEE/MoEFCC)
- `methodologies.json` — Approved calculation methodologies per sector (REAL: BEE PAT documentation)
- `source_register.json` — All regulatory sources with URLs, dates, authority (REAL)
- `emission_factors.json` — Grid and fuel emission factors (REAL: CEA FY2024, MoEFCC/IPCC Tier 1)

## Data Classification
All files in this folder are REAL — sourced from official Indian government publications.
None are fabricated or synthetic.

## Update Process
When a new gazette notification is published:
1. Update the affected JSON file
2. Update the `last_verified` date field in the file
3. Update `REGULATORY_DATA_VERSION` in `backend/app/config.py`
4. Run the API test suite: `pytest backend/app/tests/`

## Last Verified
2026-01-09 — G.S.R. 25(E) Phase 1 notification
