# CarbonAlpha India — SIH 2026 MVP

> **CarbonAlpha converts Indian carbon-market complexity into transparent capital-allocation decisions.**

CarbonAlpha is an India-specific carbon-market decision-intelligence MVP for industrial organisations. It connects emissions/intensity data, current Indian CCTS/GEI regulatory context, project and MRV readiness, financial modelling, scenario analysis and risk into a single decision workflow.

The primary MVP question is:

> **Should the organisation BUY, BUILD, or use a HYBRID strategy — and why?**

---

## 1. Project Status

**Target:** SIH 2026 MVP  
**Build environment:** Google Antigravity  
**Starting state:** Empty folder  
**Deployment target:** Local-first  
**Authentication:** None for MVP  
**AI:** Gemini API integrated as an optional explanation layer  
**Primary demo:** Synthetic Cement Unit 01  
**Current monitored sector architecture:** Seven-sector CCTS compliance scope  
**Future/watchlist:** Iron & Steel, Fertiliser and other future sectors

This repository is intentionally a rigorous MVP, not a production-scale Indian carbon-market platform.

---

## 2. Source of Truth

Two supplied project documents define the product and implementation requirements:

- `CARBONALPHA_SIH_MVP_MASTER_KNOWLEDGE_BASE.md`
- `CARBONALPHA_SIH_MVP_BUILD_MASTER.md`

They must be read before making material product, regulatory, calculation or architectural changes.

The first document is the principal domain/regulatory/product knowledge base. The second is the build/implementation master.

When they disagree:

1. preserve the disagreement;
2. identify the source and date;
3. verify the current primary source where appropriate;
4. record the resolution;
5. never silently erase the original project-document position.

See:

```text
docs/regulatory-discrepancies.md
```

---

# 3. Product North Star

CarbonAlpha is:

> An Indian carbon-market decision-intelligence and capital-allocation layer that connects industrial emissions/intensity data, applicable Indian CCTS/GEI requirements, project/MRV readiness, financial scenarios, risk and carbon-market exposure to support capital-allocation decisions.

The central product proposition is:

> **Convert carbon-market complexity into capital-allocation decisions.**

---

# 4. The Complete MVP Decision Loop

The entire product is organized around this sequence:

```text
SELECT SECTOR
      ↓
LOAD SYNTHETIC INDUSTRIAL ENTITY
      ↓
INPUT / GENERATE OPERATIONAL DATA
      ↓
APPLY CURRENT REGULATORY CONFIGURATION
      ↓
CALCULATE GHG EMISSIONS + GEI
      ↓
CALCULATE MODELLED SURPLUS / SHORTFALL
      ↓
EVALUATE A DECARBONISATION PROJECT
      ↓
CHECK MRV / DATA READINESS
      ↓
COMPARE BUY / BUILD / HYBRID
      ↓
STRESS-TEST ASSUMPTIONS
      ↓
SHOW FINANCIAL + CLIMATE + RISK CONSEQUENCES
      ↓
EXPLAIN WHY
      ↓
SHOW SOURCES + ASSUMPTIONS + LIMITATIONS
```

The MVP succeeds when one synthetic industrial entity can complete this loop reliably and reproducibly.

---

# 5. What CarbonAlpha Is Not

CarbonAlpha is not:

- BEE
- CERC
- the Indian Carbon Market registry
- an Accredited Carbon Verification Agency
- a power exchange
- a CCC issuer
- a verification body
- a live CCC broker
- a bank
- a credit-rating agency
- an autonomous lending system
- a legal opinion engine
- a guaranteed carbon-price predictor
- a generic carbon calculator
- a blockchain marketplace

The platform is an **analytics and decision-support layer** around the regulated ecosystem.

---

# 6. Current Sector Scope

The current monitored compliance-sector architecture contains:

```text
Aluminium
Cement
Chlor-Alkali
Pulp & Paper
Petrochemicals
Petroleum Refinery
Textile
```

Future/watchlist:

```text
Iron & Steel
Fertiliser
Other future sectors
```

Sector status must be versioned.

Do not hard-code legal status in application logic.

The system must distinguish:

```text
FINAL
DRAFT
WATCHLIST
NOT_APPLICABLE
UNKNOWN
```

The primary demo uses:

> **Synthetic Cement Unit 01**

All seven monitored sectors should work through the shared engine, while Cement receives the deepest demonstration treatment.

---

# 7. Regulatory Principles

CarbonAlpha is India-specific.

Primary regulatory sources control regulatory claims.

Preferred hierarchy:

### Tier 1 — Primary

- India Code
- e-Gazette
- Ministry of Power
- Bureau of Energy Efficiency
- MoEFCC
- CERC
- MeitY where relevant
- RBI where relevant
- SEBI where relevant
- Income Tax Department where relevant

### Tier 2 — Official institutional

- PIB
- Parliament documents
- official government portals

### Tier 3 — Institutional cross-check

- World Bank
- ICAP
- recognized technical institutions

### Tier 4 — Market/professional

- consultants
- law firms
- industry publications
- news
- market participants

Tier 4 cannot override Tier 1.

---

# 8. Regulatory Data Must Be Versioned

Every material regulatory calculation should carry:

```text
regulatory_version
methodology_version
factor_version
model_version
data_version
```

Reference data belongs in structured files/database records, not scattered throughout code.

Important metadata:

```text
source_id
authority
document_title
document_date
version
publication_url
effective_date
retrieved_at
status
notes
```

---

# 9. Important Regulatory Boundary

The CCTS/GEI framework is evolving.

The application must not assume:

```text
sector name → automatic current obligation
```

The correct model is:

```text
SECTOR
  ↓
ENTITY
  ↓
FACILITY
  ↓
CURRENT REGULATORY RECORD
  ↓
APPLICABILITY
  ↓
TARGET
```

Similarly:

```text
potential modelled carbon quantity
    ≠
official issued CCC
```

and:

```text
CarbonAlpha MRV readiness
    ≠
formal verification
```

and:

```text
scenario CCC price
    ≠
official/current market price
```

---

# 10. Official Source Register

Maintain a living source registry.

Core sources include:

- India Code — Energy Conservation Act
- BEE — Indian Carbon Market / CCTS
- BEE — Detailed Compliance Procedure
- BEE — Offset Mechanism
- BEE — Methodologies and Tools
- MoEFCC — GEI rules and amendments
- e-Gazette — applicable notifications
- Ministry of Power — current CCTS status
- CERC — CCC trading regulations
- BEE — ACVA information
- MeitY — DPDP where relevant
- RBI — green-finance references where relevant
- Income Tax Department — tax references where relevant

Exact source URLs and metadata belong in:

```text
docs/source-register.md
data/regulatory/source_register.json
```

Do not invent URLs.

---

# 11. Regulatory Discrepancy Register

The project knowledge documents deliberately contain evolving-status and dated-source discrepancies.

Examples:

- differing dated BEE methodology lists/counts
- Iron & Steel status evolving through amendment activity
- Fertiliser broader transition architecture versus current final-target scope
- uncertain future trading timelines
- absence of authoritative live CCC price data for the MVP

Preserve these in:

```text
docs/regulatory-discrepancies.md
```

Each entry should contain:

```text
ID
Date
Source A
Source B
Conflict
Verification
MVP Decision
Reason
Next Review
```

---

# 12. Tech Stack

Preferred architecture:

### Frontend

- Next.js
- React
- TypeScript
- App Router
- Tailwind CSS
- Framer Motion or equivalent
- accessible UI primitives
- React-compatible charting library

### Backend

- Python
- FastAPI
- Pydantic

### Database

- PostgreSQL

### Analytics

- pandas
- NumPy
- scikit-learn
- scipy only when necessary

### Testing

- pytest
- frontend tests
- Playwright/browser E2E or equivalent

### AI

- official Google GenAI SDK
- Gemini API

The application is local-first for the SIH MVP.

---

# 13. Gemini Integration

Gemini is integrated from the beginning but is not the source of truth.

Gemini is allowed to:

- explain calculated results
- summarize structured decision objects
- generate management-friendly narratives
- assist with non-authoritative document interpretation

Gemini must not:

- determine regulatory truth
- invent target values
- invent emission factors
- calculate authoritative emissions
- calculate official CCC quantities
- override financial arithmetic
- decide legal eligibility
- claim verification
- claim issuance
- invent market prices

Architecture:

```text
DETERMINISTIC ENGINES
        ↓
STRUCTURED DECISION OBJECT
        ↓
GEMINI EXPLANATION
        ↓
HUMAN-FACING NARRATIVE
```

If Gemini is unavailable, the application must continue with deterministic explanation templates.

Use:

```text
GEMINI_API_KEY
GEMINI_MODEL
```

Never expose the API key to the frontend.

Never commit `.env`.

Maintain `.env.example`.

Use the current official Google GenAI SDK rather than legacy Gemini libraries.

---

# 14. Architecture

The MVP is a modular monolith.

```text
                         USER
                          |
                          v
                    NEXT.JS / REACT
                          |
                          v
                     FASTAPI API
                          |
       +------------------+------------------+
       |                  |                  |
       v                  v                  v
 REGULATORY           CARBON             FINANCE
  ENGINE              ENGINE              ENGINE
       |                  |                  |
       +------------------+------------------+
                          |
                          v
                     MRV ENGINE
                          |
                          v
                   SCENARIO ENGINE
                          |
                          v
                    OPTIMIZER
                          |
             +------------+------------+
             |            |            |
             v            v            v
            BUY         BUILD       HYBRID
             |            |            |
             +------------+------------+
                          |
                          v
                  EXPLAINABILITY
                          |
             +------------+------------+
             |                         |
             v                         v
         GEMINI                    SOURCE TRACE
             |                         |
             +------------+------------+
                          |
                          v
                    DECISION TWIN
```

Optional ML and AI components must never make the deterministic core unavailable.

---

# 15. Repository Structure

Recommended:

```text
carbonalpha/
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── types/
│   └── styles/
│
├── backend/
│   └── app/
│       ├── main.py
│       ├── api/
│       ├── schemas/
│       ├── services/
│       ├── engines/
│       │   ├── carbon.py
│       │   ├── regulatory.py
│       │   ├── mrv.py
│       │   ├── finance.py
│       │   ├── scenarios.py
│       │   ├── optimizer.py
│       │   ├── anomaly.py
│       │   └── explanation.py
│       ├── sectors/
│       ├── data/
│       └── tests/
│
├── data/
│   ├── synthetic/
│   ├── regulatory/
│   └── factors/
│
├── docs/
│   ├── architecture.md
│   ├── source-register.md
│   ├── regulatory-discrepancies.md
│   ├── decision-model.md
│   └── verification-report.md
│
├── scripts/
│   ├── generate_synthetic_data.py
│   └── validate_dataset.py
│
├── tests/
├── README.md
├── .env.example
├── .gitignore
└── docker-compose.yml
```

---

# 16. Domain Engines

Implement as isolated services/pure functions:

```text
carbon_engine
regulatory_engine
mrv_engine
finance_engine
scenario_engine
optimizer
anomaly_engine
explanation_engine
```

Contracts:

```text
carbon_engine.calculate(record)
    → CarbonResult

regulatory_engine.resolve(entity)
    → RegulatoryContext

mrv_engine.assess(record)
    → MRVResult

finance_engine.evaluate(project, assumptions)
    → FinancialResult

scenario_engine.run(base, scenarios)
    → ScenarioResult[]

optimizer.rank(results)
    → StrategyRanking

anomaly_engine.flag(data)
    → AnomalyResult

explanation_engine.explain(decision)
    → ExplanationResult
```

---

# 17. Carbon Engine

Core equation:

```text
GEI = Total GHG Emissions / Equivalent Product Output
```

Simplified prototype position:

```text
potential_surplus_tco2e =
    max(0, target_gei - actual_gei) * actual_output

potential_shortfall_tco2e =
    max(0, actual_gei - target_gei) * actual_output
```

Output:

```text
total_ghg_tco2e
actual_gei
target_gei
gei_delta
potential_surplus_tco2e
potential_shortfall_tco2e
status
calculation_trace
```

These are modelled/potential values unless backed by an official issued/registry status.

---

# 18. Emissions Engine

Support:

```text
solid fuel
liquid fuel
gaseous fuel
purchased electricity
purchased heat where applicable
process emissions
other applicable source streams
```

Basic structure:

```text
GHG emissions =
activity data × emission factor × conversion factor
```

Support mass-balance logic where applicable.

Emission factors must be versioned and source-backed.

Never invent an official factor.

---

# 19. Synthetic Data Policy

The MVP uses synthetic data.

Examples:

```text
Synthetic Cement Unit 01
Synthetic Aluminium Unit 01
Synthetic Refinery Unit 01
```

Every synthetic record:

```text
data_status = SYNTHETIC
```

Never combine real company identities with fabricated operating data.

Synthetic data should be generated from relationships rather than independent random values:

```text
output
  ↓
activity data
  ↓
emissions
  ↓
GEI
  ↓
target comparison
  ↓
carbon position
```

Use a deterministic random seed.

Recommended MVP data volume:

```text
7 sectors
× 3 entities
= 21 synthetic entities
```

Each entity can have:

- two reporting years
- one baseline
- one primary project
- several scenario records

---

# 20. Sector Configuration

Sector modules should describe:

```text
sector_id
sector_name
monitoring_status
current_regulatory_status
status_source
status_effective_date
status_review_date
subsector_rules
target_source
methodology_candidates
project_types
emission_sources
activity_data
output_unit
financial_levers
scenario_variables
```

The shared calculation engine should remain reusable across all sectors.

---

# 21. Main Demo Sector — Cement

Cement is the recommended deepest demo because it clearly illustrates:

```text
operating activity
    ↓
emissions
    ↓
GEI
    ↓
target
    ↓
project
    ↓
MRV
    ↓
financial impact
    ↓
BUY / BUILD / HYBRID
```

A suitable synthetic project is an energy-efficiency/waste-heat-recovery intervention.

This is a demo/project-model choice, not a statement that the project automatically qualifies for CCC issuance.

---

# 22. Other Sector Models

The shared engine must support:

### Aluminium

Operational drivers such as:

- aluminium output
- electricity
- fuels
- process-carbon inputs
- purchased electricity

### Chlor-Alkali

- chlorine output
- caustic soda output
- electricity
- steam
- fuels

### Pulp & Paper

- pulp/paper output
- fibre inputs
- biomass
- fossil fuels
- electricity
- steam

### Petrochemicals

- product output
- feedstock
- fuel gas
- liquid fuels
- electricity
- steam
- process emissions

### Petroleum Refinery

- crude throughput
- throughput unit
- fuel gas
- liquid fuels
- natural gas
- electricity
- steam
- process emissions

### Textile

- textile output
- yarn/fabric output
- electricity
- steam
- coal
- gas
- biomass
- process emissions

These modules should remain configuration-driven rather than duplicating the entire carbon engine.

---

# 23. MRV Readiness

Five equal dimensions:

```text
measurement completeness      20%
activity data completeness    20%
factor traceability            20%
methodology mapping            20%
verification readiness         20%
```

Score:

```text
0.20*M1 +
0.20*M2 +
0.20*M3 +
0.20*M4 +
0.20*M5
```

This is a CarbonAlpha analytical score.

It is not an official verification/accreditation rating.

---

# 24. Financial Engine

Inputs:

```text
capex
annual_opex_change
annual_energy_savings
carbon_value_scenario
financing_rate
analysis_horizon_years
mrv_cost
verification_cost
implementation_delay
```

Cash flow:

```text
NET_CASH_FLOW_t =
    ENERGY_SAVINGS_t
    + CARBON_VALUE_SCENARIO_t
    - OPEX_CHANGE_t
    - FINANCING_COST_t
    - MRV_COST_t
    - VERIFICATION_COST_t
```

NPV:

```text
NPV = Σ[CF_t/(1+r)^t] - Initial_CAPEX
```

IRR:

discount rate where NPV = 0.

Cost per tCO2e:

```text
NET_PROJECT_COST / MODELLED_TCO2E_REDUCTION
```

---

# 25. BUY

BUY is a scenario model.

Inputs:

```text
modelled_ccc_requirement
assumed_ccc_price
transaction_cost
availability_factor
```

Outputs:

```text
buy_cost
buy_tco2e_effect
buy_timing
buy_risk
```

Price status:

```text
OBSERVED
SCENARIO
MODELLED
```

Default MVP uses SCENARIO.

Do not fabricate market prices.

---

# 26. BUILD

Outputs:

```text
build_npv
build_irr
build_payback
build_tco2e_reduction
build_gei_improvement
build_risk
```

---

# 27. HYBRID

Logic:

```text
base compliance gap
      ↓
build reduction
      ↓
residual gap
      ↓
scenario purchase requirement
      ↓
hybrid cost
```

This is the central differentiator of the MVP.

---

# 28. Strategy Optimizer

Primary score:

```text
strategy_score =
  0.35 financial
+ 0.25 climate
+ 0.20 compliance
+ 0.10 mrv
+ 0.10 timing
```

Hard constraints can mark a strategy:

```text
INELIGIBLE
VALID_BUT_PARTIAL
UNCERTAINTY_FLAGGED
```

The recommendation must be explainable.

Example:

```text
HYBRID ranked first because:

• lowest modelled total cost
• meaningful emissions reduction
• residual gap covered under scenario assumptions
• acceptable MRV readiness
• lower timing risk under delay scenario
```

---

# 29. Scenario Engine

Primary controls:

```text
CCC PRICE
PROJECT OUTPUT
PROJECT DELAY
FINANCING RATE
```

Changing a control must update:

```text
BUY COST
BUILD NPV
HYBRID COST
COMPLIANCE GAP
RECOMMENDED STRATEGY
```

No fake animation-only changes. All displayed values must be recalculated.

---

# 30. AI / ML

### ML

Optional anomaly detection using IsolationForest.

Possible features:

```text
production
energy_mwh
fuel_quantity
emissions_tco2e
actual_gei
utilisation_pct
```

Output:

```text
NORMAL
REVIEW
ANOMALY
```

Label:

> Data-quality anomaly flag — not a compliance determination.

### Gemini

Gemini receives only structured calculated facts.

It may produce:

- concise explanation
- management summary
- sensitivity explanation

It may not alter numerical or regulatory truth.

---

# 31. Data Status Model

Every important value should be identifiable as:

```text
FACT
INPUT
CALCULATION
MODEL
SCENARIO
RECOMMENDATION
SYNTHETIC
```

Example:

```text
Target GEI
FACT • SOURCE VERIFIED

CCC Price
SCENARIO • USER ASSUMPTION

Potential Shortfall
CALCULATION • CA-MVP-1.0

Recommendation
RECOMMENDATION • MODELLED
```

---

# 32. Premium UI/UX Direction

The UI should feel like:

> Bloomberg-level information density + premium fintech clarity + modern climate-tech visual language.

It should NOT look like:

- generic admin dashboard
- Bootstrap template
- CRUD app
- AI wrapper
- overdecorated landing page

Design priorities:

- excellent typography
- strong hierarchy
- restrained palette
- dense but readable information
- precise spacing
- premium charts
- smooth interaction
- high-quality hover states
- clear source provenance
- excellent empty/loading/error states
- responsive behavior
- accessibility

---

# 33. Motion Design

Motion should communicate:

- hierarchy
- change
- causality
- feedback
- state

Recommended:

- 150–350ms micro-interactions
- subtle page transitions
- KPI count-up
- chart reveal
- strategy comparison transitions
- smooth scenario updates
- source drawer animation
- hover elevation
- skeleton loading
- meaningful status transitions

Avoid:

- animation everywhere
- slow navigation
- distracting parallax
- gratuitous 3D
- motion that hides information

Respect:

```text
prefers-reduced-motion
```

---

# 34. Core Routes

```text
/overview
/entity
/decision
/scenarios
/sources
```

### Overview

Portfolio/sector snapshot.

### Entity

Synthetic data and validation.

### Decision

Carbon Position + Decision Twin.

### Scenarios

Interactive sensitivity.

### Sources

Regulatory sources, assumptions, calculation traces, discrepancies.

---

# 35. Decision Twin

The strongest visual is:

```text
              CARBONALPHA DECISION TWIN

       BUY             BUILD             HYBRID

      ₹ X              ₹ Y               ₹ Z
      CO2              CO2               CO2
      Risk             Risk              Risk
      Time             Time              Time

                    ↓

              RECOMMENDED PATH
```

Switching strategies should animate values smoothly.

The winning strategy should be visually emphasized without becoming visually dominant to the point of hiding alternatives.

---

# 36. Dashboard

Header:

```text
CarbonAlpha
Sector
Entity
Reporting Year
Data Status
```

Primary:

```text
CARBON POSITION
GEI
TARGET
GAP / SURPLUS
TOTAL EMISSIONS
```

Secondary:

```text
MRV READINESS
FINANCIAL STATUS
```

Hero:

```text
BUY / BUILD / HYBRID
```

Controls:

```text
CCC Price
Project Output
Delay
Financing Rate
```

Consequences:

```text
Cost
CO2e
GEI
Compliance Gap
Risk
```

Explainability:

```text
WHY?
SOURCE
ASSUMPTION
CALCULATION
RISK
LIMITATIONS
```

---

# 37. Source Traceability

Every important result must be traceable to:

```text
source
version
input
formula
calculation
assumption
model version
```

A calculation trace should be machine-readable.

Example:

```json
{
  "metric": "potential_shortfall_tco2e",
  "formula": "max(0, actual_gei-target_gei)*output",
  "inputs": {
    "actual_gei": 0.81,
    "target_gei": 0.72,
    "output": 1000000
  },
  "result": 90000,
  "data_status": "CALCULATION",
  "model_version": "CA-MVP-1.0"
}
```

---

# 38. API

Required endpoints:

```text
GET  /api/health
GET  /api/sectors
GET  /api/sectors/{sector}
GET  /api/regulatory/targets
POST /api/entities
POST /api/calculate/carbon-position
POST /api/projects/evaluate
POST /api/strategies/compare
POST /api/scenarios/run
GET  /api/entities/{id}/explain
GET  /api/sources
POST /api/ai/explain
```

Use Pydantic schemas and OpenAPI.

---

# 39. API Response Contract

```json
{
  "success": true,
  "data": {},
  "errors": [],
  "warnings": [],
  "source_status": "current"
}
```

Optional service failure:

```json
{
  "success": true,
  "data": {},
  "errors": [
    {
      "module": "gemini",
      "code": "OPTIONAL_SERVICE_UNAVAILABLE",
      "message": "AI explanation unavailable; deterministic explanation remains available."
    }
  ],
  "warnings": [],
  "source_status": "current"
}
```

---

# 40. Failure Isolation

Core path survives:

```text
Gemini unavailable
→ deterministic explanation

ML unavailable
→ dashboard continues

market data unavailable
→ scenario price

one sector broken
→ sector-specific error

one project broken
→ carbon position remains available
```

---

# 41. Testing

Required:

- unit tests
- integration tests
- API tests
- calculation tests
- data validation tests
- scenario tests
- optimizer tests
- frontend tests
- browser E2E tests

Test categories:

```text
VALID_CASES
EDGE_CASES
FAILURE_CASES
```

---

# 42. Core Numerical Test

Given:

```text
Output = 1,000,000 t
Emissions = 700,000 tCO2e
Target GEI = 0.72
```

Expected:

```text
Actual GEI = 0.70
Potential surplus = 20,000 tCO2e-equivalent
```

Display:

> Modelled potential surplus — not an issued CCC balance.

---

# 43. Project Propagation Test

If project reduction is:

```text
50,000 tCO2e
```

Then:

```text
New emissions = 650,000 tCO2e
New GEI = 0.65
```

This must propagate into:

```text
Carbon Position
↓
Financial Model
↓
BUY/BUILD/HYBRID
↓
Scenario Result
↓
Recommendation
```

---

# 44. Scenario Tests

Minimum:

```text
BASE
CHEAP CCC
EXPENSIVE CCC
PROJECT UNDERPERFORMANCE
PROJECT DELAY
HIGH FINANCING
```

---

# 45. Security

For MVP:

- no auth
- synthetic data
- secrets in environment variables
- no frontend API keys
- server-side Gemini
- validation
- restricted CORS
- no secrets in Git
- no personal data

---

# 46. Local Development

The repository must provide a simple local startup path.

Document:

1. prerequisites
2. environment setup
3. dependency installation
4. database startup
5. migrations/setup
6. seed data
7. backend startup
8. frontend startup
9. tests
10. browser URL

Prefer a simple Docker Compose workflow if practical.

---

# 47. Definition of Done

The MVP is complete only when:

```text
[ ] Seven current monitored sectors appear.
[ ] Sector status is versioned.
[ ] Synthetic data regenerates deterministically.
[ ] Regulatory targets have source metadata.
[ ] GEI works.
[ ] Surplus/shortfall works.
[ ] Project economics works.
[ ] BUY works.
[ ] BUILD works.
[ ] HYBRID works.
[ ] Scenario controls update calculations.
[ ] MRV readiness works.
[ ] Optional anomaly intelligence works/fails gracefully.
[ ] Gemini works/fails gracefully.
[ ] Recommendation is explainable.
[ ] Regulatory results are source-traceable.
[ ] Scenario values are clearly labelled.
[ ] No fake CCC issuance is shown.
[ ] No fabricated market price is shown as fact.
[ ] Core workflow works without live market data.
[ ] Browser E2E passes.
[ ] No critical console errors.
[ ] Responsive layout works.
[ ] Reduced-motion mode works.
[ ] README is complete.
[ ] Source register is complete.
[ ] Discrepancy register exists.
[ ] Verification report exists.
[ ] Clean-start demo works.
```

---

# 48. 90-Second Demo

```text
0–10 sec
Select Cement + Synthetic Cement Unit 01

10–25 sec
Show emissions, GEI, target and position

25–45 sec
Open project → CAPEX, reduction, MRV

45–65 sec
Compare BUY / BUILD / HYBRID

65–80 sec
Change CCC price or project delay

80–90 sec
Show recommendation + WHY + SOURCE + ASSUMPTION
```

---

# 49. What to Cut If Time Runs Out

Cut first:

1. LLM prose polish
2. advanced anomaly explanations
3. multi-year charts
4. detailed secondary project variants
5. live market integration
6. Offset workflow
7. bank mode
8. government mode

Never cut:

- carbon calculation
- regulatory target mapping
- BUY/BUILD/HYBRID
- scenarios
- explainability
- source traceability
- synthetic data consistency
- premium Decision Twin

---

# 50. Future Scope

Future architecture may support:

```text
more sectors
more methodologies
real enterprise data
government deployments
bank/NBFC APIs
market intelligence
longitudinal Carbon Decision Graph
Carbon Finance Readiness
Carbon Treasury
```

These are not reasons to overbuild the SIH MVP.

---

# 51. Key Product Concepts

### Carbon Financial Twin

A product concept connecting:

```text
physical activity
↓
production
↓
emissions
↓
GEI/carbon position
↓
projects
↓
MRV
↓
carbon-market pathway
↓
financial consequence
```

### Carbon Value Leakage

A CarbonAlpha analytical concept describing potential environmental/financial value lost through:

- poor data
- MRV gaps
- methodology mismatch
- timing
- execution risk
- regulatory uncertainty
- inefficient capital allocation

### Carbon Decision Graph

Long-term architecture:

```text
RULE
↓
SECTOR
↓
ENTITY
↓
FACILITY
↓
METHODOLOGY
↓
PROJECT
↓
DATA
↓
MRV
↓
MODEL OUTPUT
↓
CARBON POSITION
↓
FINANCIAL CONSEQUENCE
↓
DECISION
↓
OUTCOME
```

These are CarbonAlpha product concepts, not official regulatory terms.

---

# 52. Product Terminology

Official/established:

```text
CCTS
Indian Carbon Market / ICM
Carbon Credit Certificate / CCC
GEI
MRV
ACVA
Compliance Mechanism
Offset Mechanism
```

CarbonAlpha concepts:

```text
Carbon Financial Twin
Carbon Value Leakage
Carbon Decision Graph
Carbon Treasury
Carbon Finance Readiness
CarbonAlpha Risk Score
```

Do not present CarbonAlpha concepts as government-defined terminology.

---

# 53. Project Success Criterion

The MVP is successful when a judge can see:

```text
I understand my carbon position.
        ↓
I understand the project.
        ↓
I understand MRV readiness.
        ↓
I understand the economics.
        ↓
I can change assumptions.
        ↓
I can compare BUY / BUILD / HYBRID.
        ↓
I understand the recommendation.
        ↓
I can trace it back to source + calculation + assumption.
```

That is the product.

---

# 54. Final Architecture Principle

Do not optimize for:

- number of screens
- number of APIs
- number of ML models
- number of animations
- amount of code

Optimize for:

```text
CORRECTNESS
+
EXPLAINABILITY
+
SOURCE TRACEABILITY
+
DECISION QUALITY
+
VISUAL POLISH
+
RELIABILITY
+
DEMO IMPACT
```

---

# 55. Regulatory Disclaimer

CarbonAlpha is an SIH prototype and decision-support system.

It is not:

- legal advice
- regulatory approval
- formal verification
- official CCC issuance
- investment advice
- a substitute for current government/regulator documents

Whenever a current rule, target, methodology, market arrangement, factor or legal interpretation materially affects the MVP, verify the applicable primary source before freezing the release data.

---

# 56. Recommended Verification Artifacts

During development, maintain:

```text
docs/architecture.md
docs/source-register.md
docs/regulatory-discrepancies.md
docs/decision-model.md
docs/verification-report.md
```

Antigravity should also generate artifacts for:

- implementation plan
- architecture
- browser walkthrough
- test/verification report
- final acceptance audit

---

# 57. Release Checklist

Before tagging a release:

```text
[ ] source register reviewed
[ ] discrepancy register reviewed
[ ] regulatory status checked
[ ] synthetic dataset validated
[ ] calculation tests pass
[ ] API tests pass
[ ] frontend tests pass
[ ] E2E tests pass
[ ] browser QA pass
[ ] no critical console errors
[ ] Gemini fallback tested
[ ] ML fallback tested
[ ] responsive QA pass
[ ] accessibility pass
[ ] reduced-motion pass
[ ] README updated
[ ] demo reset verified
```

Suggested final tag:

```text
sih-mvp-v1.0.0-recording
```

---

# 58. Final North Star

> **CarbonAlpha helps an industrial organisation understand its modelled carbon position, evaluate decarbonisation options, compare BUY vs BUILD vs HYBRID under transparent financial/environmental/regulatory assumptions, and understand exactly why the recommended strategy changes when assumptions change.**
