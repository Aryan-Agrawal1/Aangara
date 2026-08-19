# CarbonAlpha Architecture Documentation

## 1. System Overview
CarbonAlpha India is an analytical decision-intelligence platform built on a Modular Monolith architecture. It connects deterministic engineering/emissions calculations, versioned Indian CCTS regulations, MRV readiness scoring, capital budgeting financial models, and multi-variable scenario simulation into a unified decision workflow.

## 2. Core Architectural Layers
1. **Presentation Layer (Frontend)**: Next.js 15 App Router, React 19, TypeScript, Tailwind CSS, Framer Motion for purposeful interaction polish.
2. **API & Orchestration Layer (Backend)**: FastAPI, Pydantic v2 schemas, REST endpoints with full JSON envelopes and strict error isolation.
3. **Calculation Engines (Deterministic Core)**:
   - carbon_engine.py: Emissions, GEI, potential surplus/shortfall.
   - 
egulatory_engine.py: Sector status, target trajectory mapping, source provenance.
   - mrv_engine.py: 5-dimension MRV analytical readiness (0-100).
   - inance_engine.py: Cash flows, CAPEX, OPEX, energy savings, NPV, IRR, Payback.
   - optimizer.py: BUY vs BUILD vs HYBRID transparent weighted utility ranking.
   - scenarios.py: 4-variable sensitivity recalculation.
   - nomaly.py: IsolationForest / Z-score operational data-quality flags.
   - explanation.py: Deterministic causality narrative + optional Google GenAI SDK synthesis.
4. **Data Layer**:
   - data/regulatory/: Version-controlled JSON reference catalogs.
   - data/factors/: Versioned emission factor databases.
   - data/synthetic/: Master deterministic synthetic industrial entities.
   - SQLite / PostgreSQL database support.

## 3. Resilience & Failure Isolation
All optional services (Gemini AI, ML Anomaly engine) are wrapped with fault isolation. If Gemini or ML is unavailable, the deterministic core remains 100% operational with rule-based narrative templates.
