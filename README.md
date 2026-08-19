# CarbonAlpha India — SIH 2026 MVP

> **CarbonAlpha converts Indian carbon-market complexity into transparent capital-allocation decisions.**

CarbonAlpha is an India-specific carbon-market decision-intelligence platform designed for industrial organisations. It connects emissions and intensity data, current Indian CCTS/GEI regulatory context, project and MRV readiness, financial modelling, scenario analysis, and risk into a unified decision workflow.

## 1. Monitored Sector Scope
- **7 Current Monitored CCTS Compliance Sectors**: Aluminium, Cement (*Deep Demo*), Chlor-Alkali, Pulp & Paper, Petrochemicals, Petroleum Refinery, Textile.
- **Watchlist Sectors**: Iron & Steel (DRAFT), Fertiliser (WATCHLIST).

## 2. Running Locally

### Prerequisites
- Python 3.10+ (Tested on Python 3.14.0)
- Node.js 18+ (Tested on Node.js v24.12.0)

### Quick Start

1. **Setup & Run Backend**:
   `ash
   cd backend
   python -m pip install -r requirements.txt
   python run.py
   `
   Backend runs at: http://127.0.0.1:8000 (API Docs: http://127.0.0.1:8000/docs)

2. **Run Tests**:
   `ash
   pytest backend/app/tests
   `

3. **Setup & Run Frontend**:
   `ash
   cd frontend
   npm install
   npm run dev
   `
   Frontend runs at: http://localhost:3000

## 3. Key Differentiators
- **100% Deterministic Core**: Verified emissions, GEI, surplus/shortfall, NPV, IRR, and utility algorithms.
- **Decision Twin**: Direct side-by-side comparison of BUY vs BUILD vs HYBRID.
- **Source Traceability**: Every number links back to Tier-1 Indian Gazette and BEE procedures.
- **AI Explanation Guardrail**: Gemini provides executive briefings without ever modifying regulatory truth.
