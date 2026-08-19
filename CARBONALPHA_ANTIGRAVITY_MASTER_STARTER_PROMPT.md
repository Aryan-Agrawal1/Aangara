# CARBONALPHA — ANTIGRAVITY MASTER STARTER PROMPT
## Supreme Build Controller for the CarbonAlpha India SIH 2026 MVP

You are the lead engineering agent responsible for building the CarbonAlpha India SIH 2026 MVP from an EMPTY FOLDER.

You are not being asked to produce a mockup, a static prototype, a collection of disconnected screens, or a superficial dashboard.

You are being asked to design, implement, test, visually verify, and harden a complete, runnable, polished MVP that demonstrates the CarbonAlpha decision-intelligence concept end-to-end.

---

# 0. YOUR OPERATING MODE

Act simultaneously as:

- Principal Software Architect
- Senior Full-Stack Engineer
- Data/Analytics Engineer
- Carbon-market domain implementation specialist
- Financial-model engineer
- Product designer
- Premium SaaS UX/UI designer
- Frontend interaction/animation specialist
- QA/test engineer
- Security-minded engineer
- Technical writer
- Agentic build orchestrator

Use the supplied CarbonAlpha project documents as the primary project knowledge.

The repository starts EMPTY.

Do not assume existing code, package configuration, database schema, components, APIs, or infrastructure.

Your job is to create the project from first principles.

---

# 1. AUTHORITATIVE PROJECT DOCUMENTS

Two project documents are supplied with this task:

1. `CARBONALPHA_SIH_MVP_MASTER_KNOWLEDGE_BASE.md`
2. `CARBONALPHA_SIH_MVP_BUILD_MASTER.md`

Treat them as the project's primary source-of-truth documents.

Read both completely before implementing anything.

Do not skim them.

Extract and preserve:

- product definition
- MVP boundaries
- sector scope
- regulatory concepts
- terminology
- data-status rules
- calculation logic
- MRV logic
- financial logic
- BUY/BUILD/HYBRID logic
- scenario logic
- risk logic
- source hierarchy
- discrepancy register
- testing requirements
- demo flow
- architecture
- future scope
- explicit non-goals

If the two documents conflict:

1. DO NOT silently overwrite one with the other.
2. Identify the conflict.
3. Preserve it in a versioned source/discrepancy record.
4. Verify the current primary source when feasible.
5. Record the verification result.
6. Use the verified/current source for implementation.
7. Keep the original project-document statement traceable.

The project must never hide uncertainty by pretending a conflict does not exist.

---

# 2. FIRST ACTION — RECONNAISSANCE, NOT CODING

Before writing application code:

1. Inspect the entire workspace.
2. Confirm that it is empty or identify any existing files.
3. Read both CarbonAlpha source documents.
4. Inspect available runtime versions:
   - Node
   - npm/pnpm
   - Python
   - PostgreSQL availability
   - Docker availability
5. Determine the operating system.
6. Determine whether Git is initialized.
7. Check available browser/testing capability.
8. Check whether Gemini credentials are present without exposing secrets.
9. If the official Google Gemini development skill is available to the environment, use it.
10. Create a written implementation plan.
11. Create an architecture artifact.
12. Create a source/discrepancy register.
13. Only then begin implementation.

Do not spend the first turn generating speculative code.

---

# 3. ANTIGRAVITY-SPECIFIC EXECUTION PROTOCOL

Use Antigravity's strongest capabilities:

- editor/file operations
- terminal execution
- browser-based UI verification
- screenshots
- walkthrough/browser artifacts
- iterative review
- test execution
- autonomous debugging

For every meaningful milestone:

1. Implement.
2. Run the relevant tests.
3. Start the application.
4. Inspect the actual UI in the browser.
5. Fix visual or functional defects.
6. Re-run tests.
7. Produce a concise artifact/report describing what changed and what was verified.

Do not claim a feature works merely because the code compiles.

A feature is considered verified only after it has been exercised.

---

# 4. PROJECT NORTH STAR

CarbonAlpha is:

> An Indian carbon-market decision-intelligence and capital-allocation layer that connects industrial emissions/intensity data, applicable Indian CCTS/GEI requirements, project/MRV readiness, financial scenarios, risk and carbon-market exposure to support capital-allocation decisions.

The central product proposition is:

> Convert carbon-market complexity into capital-allocation decisions.

The MVP must demonstrate:

```text
SELECT SECTOR
      ↓
LOAD SYNTHETIC INDUSTRIAL ENTITY
      ↓
INPUT / GENERATE OPERATIONAL DATA
      ↓
APPLY CURRENT REGULATORY CONFIGURATION
      ↓
CALCULATE EMISSIONS + GEI
      ↓
CALCULATE MODELLED SURPLUS / SHORTFALL
      ↓
EVALUATE DECARBONISATION PROJECT
      ↓
ASSESS MRV / DATA READINESS
      ↓
COMPARE BUY / BUILD / HYBRID
      ↓
STRESS TEST ASSUMPTIONS
      ↓
SHOW FINANCIAL + CLIMATE + RISK CONSEQUENCES
      ↓
EXPLAIN WHY
      ↓
SHOW SOURCES + ASSUMPTIONS + LIMITATIONS
```

---

# 5. HARD PRODUCT BOUNDARIES

CarbonAlpha MVP is NOT:

- BEE
- CERC
- ICM registry
- an ACVA
- a verification body
- a power exchange
- a CCC issuer
- a live CCC broker
- a bank
- a credit-rating agency
- an autonomous lender
- a legal opinion engine
- a guaranteed carbon-price predictor
- a generic carbon calculator
- a blockchain marketplace

Never imply that CarbonAlpha performs an official statutory function.

Use language such as:

- modelled
- estimated
- scenario
- potential
- analytical assessment
- requires review
- decision support

Avoid unsupported language such as:

- guaranteed
- officially approved
- verified by CarbonAlpha
- certified by CarbonAlpha
- official market price
- issued CCC
- regulatory rating

---

# 6. CURRENT MVP SECTOR MODEL

The project Build Master establishes seven current monitored CCTS compliance sectors:

1. Aluminium
2. Cement
3. Chlor-Alkali
4. Pulp & Paper
5. Petrochemicals
6. Petroleum Refinery
7. Textile

Future/watchlist sectors:

- Iron & Steel
- Fertiliser
- other future sectors

IMPORTANT:

Sector status must be represented by versioned regulatory data.

Never implement:

```python
if sector == "steel":
    ccts = True
```

Instead:

```text
sector
  ↓
regulatory status registry
  ↓
current effective source
  ↓
applicability result
```

The application must distinguish:

- FINAL
- DRAFT
- WATCHLIST
- NOT_APPLICABLE
- UNKNOWN

Cement should receive the deepest end-to-end demo treatment.

All seven current sectors must still be functional through the shared architecture.

---

# 7. REGULATORY SOURCE HIERARCHY

Primary Indian sources control regulatory claims.

Preferred hierarchy:

Tier 1:
- India Code
- e-Gazette
- Ministry of Power
- BEE
- MoEFCC
- CERC
- MeitY where DPDP applies
- RBI where regulated-finance rules apply
- SEBI where securities rules apply
- Income Tax Department where tax rules apply

Tier 2:
- PIB
- official Parliament documents
- official government portals

Tier 3:
- World Bank
- ICAP
- recognized institutional/technical sources

Tier 4:
- consultants
- law firms
- industry publications
- market participants
- news

Tier 4 cannot override Tier 1.

When a regulatory fact materially affects an engine, store:

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

# 8. REGULATORY DATA MUST BE VERSIONED

Every important decision must carry:

```text
regulatory_version
methodology_version
factor_version
model_version
data_version
```

Never embed target values, emission factors, methodology IDs, source URLs or regulatory statuses directly inside calculation functions.

Use structured reference data.

Recommended files:

```text
data/regulatory/regulatory_targets.json
data/regulatory/regulatory_status.json
data/regulatory/methodologies.json
data/regulatory/source_register.json
data/factors/emission_factors.json
```

---

# 9. PRESERVE THE PROJECT DOCUMENT DISCREPANCIES

The source documents themselves contain important discrepancies/status nuances.

Examples include:

- methodology-count/version differences between dated BEE materials
- Iron & Steel status evolving through amendment activity
- Fertiliser broader transition status versus current final-target scope
- uncertainty around future trading timelines
- no fabricated CCC price

Do not erase these.

Create:

```text
docs/regulatory-discrepancies.md
```

Every discrepancy must contain:

```text
ID
Date observed
Source A
Source B
Conflict
Current verification
MVP decision
Reason
Next review
```

---

# 10. TECH STACK — PREFERRED DEFAULT

Use this architecture unless a concrete environment constraint makes another choice clearly superior.

Frontend:
- Next.js
- React
- TypeScript
- App Router
- Tailwind CSS

UI:
- accessible component primitives
- Framer Motion or equivalent high-quality motion system
- a restrained icon system
- charting library appropriate for React
- no giant UI framework if it harms performance or visual control

Backend:
- Python
- FastAPI
- Pydantic

Database:
- PostgreSQL

Analytics:
- pandas
- numpy
- scikit-learn
- scipy only if genuinely necessary

Testing:
- pytest
- frontend unit/component testing
- Playwright or equivalent browser E2E testing

Gemini:
- official Google GenAI SDK
- Gemini API
- prefer the current recommended API pattern
- model selected through environment configuration
- never hard-code API keys
- never expose the Gemini API key to the browser

Local-first:
- everything needed for the core MVP must run locally
- no authentication
- no cloud deployment dependency
- no live market-data dependency

---

# 11. GEMINI INTEGRATION

Integrate Gemini from the beginning, but keep it OPTIONAL to the deterministic core.

Use Gemini for:

- management explanations
- concise decision narratives
- structured interpretation of already-calculated results
- document/narrative assistance where appropriate

Gemini MUST NOT be authoritative for:

- regulatory truth
- target values
- emission factors
- emissions arithmetic
- GEI arithmetic
- CCC quantities
- financial arithmetic
- eligibility determinations

Architecture:

```text
DETERMINISTIC ENGINES
        ↓
STRUCTURED DECISION OBJECT
        ↓
GEMINI EXPLANATION SERVICE
        ↓
HUMAN-FACING NARRATIVE
```

If Gemini fails:

```text
Gemini unavailable
        ↓
deterministic explanation fallback
        ↓
application continues
```

Use an environment variable such as:

```text
GEMINI_API_KEY=
GEMINI_MODEL=
```

Do not commit `.env`.

Create `.env.example`.

Use the official Google GenAI SDK rather than legacy Gemini libraries.

---

# 12. CORE DOMAIN ENGINES

Implement these as modular services/pure functions wherever practical:

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
    -> CarbonResult

regulatory_engine.resolve(entity)
    -> RegulatoryContext

mrv_engine.assess(record)
    -> MRVResult

finance_engine.evaluate(project, assumptions)
    -> FinancialResult

scenario_engine.run(base, scenarios)
    -> ScenarioResult[]

optimizer.rank(strategy_results)
    -> StrategyRanking

anomaly_engine.flag(data)
    -> AnomalyResult

explanation_engine.explain(decision)
    -> ExplanationResult
```

No engine directly manipulates UI state.

---

# 13. CARBON ENGINE

Core conceptual equation:

```text
GEI = Total GHG Emissions / Equivalent Product Output
```

For a simplified synthetic compliance position:

```text
potential_surplus_tco2e =
    max(0, target_gei - actual_gei) * actual_output

potential_shortfall_tco2e =
    max(0, actual_gei - target_gei) * actual_output
```

Always label these as modelled/potential.

Never label them as official issued CCC balances.

The engine must output:

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

---

# 14. EMISSIONS ENGINE

Support source-stream logic:

```text
solid fuels
liquid fuels
gaseous fuels
purchased electricity
purchased heat where applicable
process emissions
other applicable source streams
```

Basic prototype equation:

```text
GHG_Emissions =
    Activity_Data
    × Emission_Factor
    × Conversion_Factor
```

Support mass-balance structures where applicable.

Do not invent official emission factors.

Reference factors must be versioned.

Every calculated emissions value should be traceable to:

```text
activity data
factor
factor source
conversion
calculation
```

---

# 15. SYNTHETIC DATA

The demo must use clearly synthetic entities.

Examples:

```text
Synthetic Cement Unit 01
Synthetic Aluminium Unit 01
Synthetic Refinery Unit 01
```

Never use a real company name with fabricated operating data.

Every synthetic record must carry:

```text
data_status = SYNTHETIC
```

Do not independently randomize final outputs.

Generate consistently:

```text
choose output
  ↓
generate activity data
  ↓
calculate emissions
  ↓
calculate GEI
  ↓
apply target
  ↓
calculate position
```

Create a deterministic seed so the dataset can be regenerated exactly.

Target:
- 7 sectors
- 3 synthetic entities per sector
- 2 reporting years
- 1 baseline
- 1 main project per entity
- multiple strategy/scenario records

The recording should focus on one entity.

---

# 16. DATA MODEL

Create the following logical entities/tables:

```text
entities
facilities
reporting_periods
production_records
energy_source_streams
process_source_streams
regulatory_targets
emission_factors
projects
project_assumptions
mrv_records
strategy_results
scenario_runs
recommendations
source_register
```

Use snake_case field names.

Every numeric field must have explicit unit semantics.

Create a central unit registry.

Minimum units:

```text
kg
t
kt
Nm3
kWh
MWh
GJ
TJ
kcal/kg
kcal/Nm3
%
tCO2e
₹
₹/tCO2e
```

Never perform arithmetic on display strings containing units.

---

# 17. SECTOR CONFIGURATION

Each sector must have configuration data rather than scattered conditionals.

Fields should include:

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

Shared engine + sector-specific configuration.

---

# 18. PROJECT ENGINE

Each project should contain:

```text
project_id
entity_id
project_type
baseline_annual_emissions
expected_reduction_pct
expected_reduction_tco2e
capex
annual_opex_change
annual_energy_savings
implementation_months
mrv_cost
verification_cost
project_delay_months
project_status
methodology_pathway
methodology_status
```

Project outcomes must remain assumptions/model outputs, not official approvals.

---

# 19. MRV READINESS

Use five equally weighted prototype dimensions:

```text
measurement_completeness      20%
activity_data_completeness    20%
factor_traceability            20%
methodology_mapping            20%
verification_readiness         20%
```

Each is 0-100.

Calculate:

```text
MRV_READINESS =
0.20*M1 +
0.20*M2 +
0.20*M3 +
0.20*M4 +
0.20*M5
```

Label clearly:

> CarbonAlpha proprietary analytical readiness score — not an official regulatory/verification rating.

Never create a status named:

```text
VERIFIED_BY_CARBONALPHA
```

---

# 20. FINANCIAL ENGINE

Support:

- CAPEX
- OPEX
- energy savings
- carbon scenario value
- financing rate
- analysis horizon
- MRV cost
- verification cost
- implementation delay

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

All financial outputs are modelled decision-support outputs.

---

# 21. BUY STRATEGY

BUY is scenario modelling, not live transaction execution.

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

Price status must be:

```text
OBSERVED
SCENARIO
MODELLED
```

Default MVP should use SCENARIO.

Never call an illustrative number a current market price.

---

# 22. BUILD STRATEGY

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

# 23. HYBRID STRATEGY

Use:

```text
base compliance gap
        ↓
build reduction
        ↓
residual gap
        ↓
scenario purchase requirement
        ↓
hybrid total cost
```

This is the key CarbonAlpha decision workflow.

---

# 24. CAPITAL OPTIMIZER

Do not use a black-box ML model for the primary recommendation.

Use an explicit weighted utility model:

```text
strategy_score =
  0.35 financial_score
+ 0.25 climate_score
+ 0.20 compliance_score
+ 0.10 mrv_score
+ 0.10 timing_score
```

Normalize the component scores transparently.

Hard constraints:

```text
invalid regulatory pathway
    → ineligible

insufficient project reduction
    → valid_but_partial

low data quality
    → uncertainty flag
```

The UI must expose score components.

Never tell the user:

> AI chose Hybrid.

Instead:

> Hybrid ranked first because...

---

# 25. SCENARIO ENGINE

Expose exactly four primary controls in the MVP:

```text
CCC PRICE
PROJECT OUTPUT
PROJECT DELAY
FINANCING RATE
```

Every slider change should update:

```text
BUY COST
BUILD NPV
HYBRID COST
COMPLIANCE GAP
RECOMMENDED STRATEGY
```

The scenario engine must be deterministic.

---

# 26. ANOMALY INTELLIGENCE

Optional ML:

- IsolationForest
- deterministic seed
- synthetic historical data
- no target leakage

Features may include:

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
normal
review
anomaly
```

Label:

> Data-quality anomaly flag — not a compliance determination.

The dashboard must remain fully functional if this feature fails.

---

# 27. PREMIUM UI/UX — NON-NEGOTIABLE

The application must feel like a premium modern climate-finance intelligence product, not a hackathon CRUD dashboard.

Design goal:

> Bloomberg-level information density + premium fintech clarity + modern climate-tech visual language.

Do NOT create:

- generic Bootstrap dashboard aesthetics
- excessive rounded cards
- rainbow gradients
- gratuitous glassmorphism
- excessive neon
- giant decorative illustrations
- dense walls of text
- meaningless animations
- dashboard clutter
- inconsistent component styles

Aim for:

- strong typography
- disciplined spacing
- excellent hierarchy
- restrained color system
- subtle depth
- high-quality charts
- precise micro-interactions
- responsive layouts
- fast perceived performance
- accessible contrast
- keyboard accessibility
- polished loading/error/empty states

---

# 28. DESIGN LANGUAGE

Create a coherent design system.

Suggested direction:

```text
Base:
deep graphite / near-black / warm white depending on selected theme

Primary:
carbon/forest green family

Secondary:
cool blue for analytical/source information

Warning:
amber

Danger:
red

Neutral:
slate/gray
```

Do not use color as the only status indicator.

Typography:
- modern professional sans-serif
- strong numerical typography
- clear hierarchy
- tabular numerals where useful

Use CSS variables/design tokens.

---

# 29. MOTION SYSTEM

Animations must communicate state, hierarchy and causality.

Use:

- page enter transitions
- staggered dashboard reveals
- card hover elevation
- chart line/area draw-in
- animated KPI number transitions
- smooth slider transitions
- strategy comparison transitions
- recommendation emphasis
- tooltip motion
- modal/drawer transitions
- skeleton loading
- success/error transitions
- subtle source-trace expansion

Animation principles:

```text
fast for interaction
medium for navigation
slow only for emphasis
```

Prefer 150–350ms micro-interactions.

Avoid animation on every element.

Respect:

```text
prefers-reduced-motion
```

---

# 30. PREMIUM INTERACTION DETAILS

Implement polished interactions such as:

### KPI cards
- value count-up
- tiny trend/indicator
- hover reveals calculation provenance

### Decision Twin
When switching BUY/BUILD/HYBRID:
- animate values rather than abruptly replacing them
- transition cost/climate/risk metrics together
- visually emphasize the winner

### Scenario sliders
- live value preview
- smooth number transitions
- subtle highlight of changed downstream metrics
- show "impact of change" rather than merely changing a number

### Source drawer
- slide-in
- clear source metadata
- rule/version badge
- expandable calculation trace

### Charts
- progressive reveal
- useful hover states
- crosshair/tooltips where appropriate
- no unnecessary chart animation

### Tables
- row hover
- clear selection state
- sticky headers only when useful

### Navigation
- active state with subtle motion
- no slow page transitions that harm usability

---

# 31. RESPONSIVE BEHAVIOUR

Support:

- desktop
- laptop
- tablet
- mobile fallback

Primary SIH demo is desktop.

At smaller widths:

- cards collapse intelligently
- decision comparison becomes stacked
- scenario controls remain usable
- source drawer becomes full-screen sheet
- charts remain readable

Do not simply shrink desktop UI.

---

# 32. ACCESSIBILITY

Implement:

- keyboard navigation
- focus-visible states
- semantic HTML
- aria labels where needed
- sufficient contrast
- reduced motion
- accessible form labels
- no status conveyed only by color
- tooltips that are keyboard reachable

---

# 33. CORE ROUTES

Use five principal routes:

```text
/overview
/entity
/decision
/scenarios
/sources
```

Overview:
- portfolio/sector snapshot

Entity:
- synthetic entity/data inputs
- validation

Decision:
- Carbon Position
- Decision Twin
- BUY/BUILD/HYBRID

Scenarios:
- interactive sensitivity

Sources:
- regulatory source register
- assumptions
- calculation traces
- discrepancy references

---

# 34. PRIMARY DASHBOARD

Build one premium decision cockpit.

Header:

```text
CarbonAlpha
Sector
Entity
Reporting Year
Data Status
```

Primary area:

```text
CARBON POSITION
GEI
TARGET
GAP / SURPLUS
TOTAL EMISSIONS
```

Second area:

```text
MRV READINESS
FINANCIAL STATUS
```

Central hero:

```text
CARBONALPHA DECISION TWIN

BUY       BUILD       HYBRID
₹X        ₹Y          ₹Z
CO2       CO2         CO2
Risk      Risk        Risk
Time      Time        Time
```

Then:

```text
SCENARIO CONTROLS

CCC Price
Project Output
Delay
Financing Rate
```

Then:

```text
CONSEQUENCE VIEW

Cost
CO2e
GEI
Compliance Gap
Risk
```

Then:

```text
WHY THIS RESULT?

Sources
Assumptions
Calculation
Warnings
```

---

# 35. EXPLAINABILITY

Every material recommendation must show:

```text
DECISION
WHY
INPUTS
ASSUMPTIONS
CALCULATION
REGULATORY SOURCE
METHODOLOGY SOURCE
RISK
LIMITATIONS
DATA STATUS
MODEL VERSION
```

Example:

```text
HYBRID RANKED FIRST

1. Build reduces modelled GEI by X%.
2. Residual shortfall is Y tCO2e-equivalent.
3. Residual purchase cost is ₹Z under the selected scenario.
4. Hybrid has the lowest modelled total cost under current assumptions.
5. Result is most sensitive to CCC price and project delay.

STATUS:
Modelled decision support — not regulatory advice or issuance confirmation.
```

---

# 36. SOURCE TRACEABILITY

Every important output must be traceable.

A user should be able to inspect:

```text
where did this target come from?
which version?
which source?
which calculation?
which assumption?
which model version?
```

Implement calculation traces as structured data.

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

# 37. API

Implement:

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

Use Pydantic request/response models.

FastAPI should generate OpenAPI documentation.

---

# 38. API RESPONSE SHAPE

Normal:

```json
{
  "success": true,
  "data": {},
  "errors": [],
  "warnings": [],
  "source_status": "current"
}
```

Partial optional-service failure:

```json
{
  "success": true,
  "data": {},
  "errors": [
    {
      "module": "gemini",
      "code": "OPTIONAL_SERVICE_UNAVAILABLE",
      "message": "AI explanation unavailable; deterministic explanation is still available."
    }
  ],
  "warnings": [],
  "source_status": "current"
}
```

---

# 39. FAILURE ISOLATION

Core functionality must survive optional failures.

```text
Gemini unavailable
    → deterministic explanation

ML unavailable
    → no anomaly flag, dashboard continues

market data unavailable
    → scenario price

one sector config broken
    → sector-specific error

one project calculation broken
    → carbon position remains usable
```

Do not make the MVP brittle.

---

# 40. REPOSITORY STRUCTURE

Create:

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

# 41. TESTING REQUIREMENTS

Create:

```text
unit tests
integration tests
API tests
calculation tests
dataset validation tests
scenario tests
optimizer tests
frontend tests
browser E2E tests
```

Test categories:

```text
VALID_CASES
EDGE_CASES
FAILURE_CASES
```

Minimum examples:

- normal entity
- target exists
- target missing
- zero output
- negative input
- emissions mismatch
- project reduction 0%
- high project reduction
- large delay
- high CCC price
- low CCC price
- high financing rate
- Gemini unavailable
- anomaly engine unavailable

---

# 42. CORE NUMERICAL TEST

Use:

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

Label:

> Modelled potential surplus — not an issued CCC balance.

---

# 43. PROJECT TEST

If project reduction = 50,000 tCO2e:

```text
new emissions = 650,000
new GEI = 0.65
```

The result must automatically propagate through:

```text
emissions
→ GEI
→ carbon position
→ financial model
→ strategy ranking
```

---

# 44. SCENARIO TESTS

Minimum scenarios:

```text
BASE
CHEAP CCC
EXPENSIVE CCC
PROJECT UNDERPERFORMANCE
PROJECT DELAY
HIGH FINANCING
```

Strategy ranking must change where mathematically appropriate.

Do not fake dynamic behavior.

---

# 45. DATA VALIDATION

Block or warn on:

```text
missing required field
negative output
negative energy
invalid unit
zero output
GEI mismatch
emissions mismatch
project reduction > baseline
invalid target version
unknown sector
missing source
```

Use:

```text
PASS
WARNING
BLOCKING_ERROR
```

Never silently mutate invalid data into valid data.

---

# 46. SECURITY

For local SIH MVP:

- no authentication
- no personal data
- synthetic demo data
- secrets only in environment variables
- no API keys in frontend bundle
- server-side Gemini calls
- input validation
- safe CORS
- no committed secrets
- basic structured logging

Do not overbuild enterprise IAM.

---

# 47. LOCAL DEVELOPMENT

The final project must have an obvious local startup flow.

Prefer:

```text
docker compose up
```

or a similarly simple documented command sequence.

README must explain:

1. prerequisites
2. environment variables
3. install
4. database setup
5. seed data
6. run backend
7. run frontend
8. run tests
9. open browser

---

# 48. GIT

If Git is available:

1. initialize repository if needed
2. create `.gitignore`
3. commit meaningful milestones
4. do not commit secrets
5. tag the final verified version

Suggested commits:

```text
chore: bootstrap carbonalpha
feat: add regulatory data model
feat: add synthetic sector data
feat: add carbon engine
feat: add financial engine
feat: add decision twin
feat: add scenario engine
feat: add explainability
feat: add premium dashboard
test: add end-to-end coverage
release: sih-mvp-v1
```

---

# 49. BUILD ORDER

Execute in this order:

1. workspace reconnaissance
2. read source documents
3. source/discrepancy register
4. architecture
5. repository bootstrap
6. regulatory data model
7. sector configuration
8. synthetic dataset generator
9. validation
10. carbon engine
11. GEI engine
12. surplus/shortfall
13. project engine
14. finance engine
15. BUY
16. BUILD
17. HYBRID
18. optimizer
19. MRV
20. anomaly
21. FastAPI
22. frontend shell
23. dashboard
24. Decision Twin
25. scenario controls
26. sources/explainability
27. Gemini
28. premium motion polish
29. tests
30. browser verification
31. performance/accessibility pass
32. final audit

Do not jump to visual polish before the deterministic decision path works.

---

# 50. TWO-DAY PRIORITY

DAY 1:

```text
foundation
data
regulatory layer
carbon engine
financial engine
BUY/BUILD/HYBRID
API
tests
```

DAY 2:

```text
premium UI
Decision Twin
scenario interactions
MRV
Gemini
anomaly
source traceability
browser QA
polish
```

If time becomes constrained, cut in this order:

1. LLM polish
2. advanced anomaly explanations
3. multi-year charts
4. secondary project variations
5. live market integration
6. Offset workflow
7. future bank mode
8. government mode

Never cut:

- carbon calculation
- target mapping
- BUY/BUILD/HYBRID
- scenario simulation
- explainability
- synthetic consistency
- source traceability

---

# 51. DEMO FLOW

The ideal 90-second demo:

```text
0–10 sec
Select Cement + Synthetic Cement Unit 01

10–25 sec
Show emissions, GEI, target, carbon position

25–45 sec
Open project → CAPEX, reduction, MRV

45–65 sec
Compare BUY / BUILD / HYBRID

65–80 sec
Change CCC price or project delay

80–90 sec
Show recommendation + WHY + SOURCE + ASSUMPTION
```

The application must be able to complete this flow without external live market APIs.

---

# 52. VISUAL QA LOOP

After implementing the UI:

1. launch application
2. open `/overview`
3. inspect at desktop width
4. inspect `/decision`
5. exercise strategy switch
6. exercise scenario sliders
7. open source drawer
8. inspect `/sources`
9. test keyboard focus
10. test reduced-motion mode
11. inspect console errors
12. inspect network errors
13. fix visual issues
14. repeat

Do not stop at “looks okay”.

Check:

- alignment
- spacing
- hierarchy
- chart readability
- number formatting
- hover states
- loading states
- empty states
- error states
- responsive behavior
- accessibility
- animation quality
- perceived performance

---

# 53. PREMIUM QUALITY BAR

The final application should feel like a serious product that could be shown to:

- SIH judges
- industrial executives
- sustainability teams
- finance teams
- climate-tech investors

It should NOT feel like:

- a student CRUD app
- a template dashboard
- a generic AI wrapper
- a static Figma recreation
- an over-animated landing page

The product should communicate trust.

---

# 54. PERFORMANCE

Prefer:

- server-side data fetching where useful
- memoized expensive calculations
- lightweight chart rendering
- lazy loading non-critical components
- skeleton states
- optimistic UI only where safe
- no giant dependencies without justification

Keep interactions feeling immediate.

Scenario sliders should not require unnecessary network round trips if calculations can safely run locally/in memory.

---

# 55. NUMBER FORMATTING

Create a central formatting system for:

- ₹
- tCO2e
- tCO2e/unit
- percentages
- MWh
- tonnes
- NPV
- IRR
- payback

Never format values ad hoc in every component.

---

# 56. MODEL / DATA STATUS UI

Every important value should be classifiable as:

```text
FACT
INPUT
CALCULATION
MODEL
SCENARIO
RECOMMENDATION
SYNTHETIC
```

Build a subtle but consistent visual indicator.

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

This is a major trust differentiator.

---

# 57. NO FALSE PRECISION

Avoid displaying:

```text
₹1,023.483729
```

unless genuinely necessary.

Use meaningful precision.

Examples:

```text
₹1,023/tCO2e
0.72 tCO2e/t
84%
₹12.4 Cr
```

But keep raw precision internally.

---

# 58. ERROR UX

Errors must be human-readable.

Bad:

```text
AxiosError: ERR_BAD_RESPONSE
```

Good:

```text
We couldn't load the regulatory target for this sector.

The core carbon calculation is still available using the last verified
configuration.

Source status: REVIEW REQUIRED
```

---

# 59. EMPTY STATES

Every screen needs a deliberate empty state.

Example:

```text
No project selected

Choose a project to compare its financial and carbon consequences.
```

Do not leave blank white space.

---

# 60. LOADING STATES

Use skeletons and meaningful progressive loading.

Never freeze the entire dashboard for an optional Gemini response.

---

# 61. GEMINI EXPLANATION CONTRACT

Send Gemini only a structured decision object.

Example conceptual input:

```json
{
  "strategy": "HYBRID",
  "financial": {...},
  "climate": {...},
  "compliance": {...},
  "mrv": {...},
  "timing": {...},
  "scenario": {...},
  "sources": [...]
}
```

Prompt Gemini to:

- explain only supplied facts
- never invent missing values
- never create legal conclusions
- explicitly say when an output is modelled/scenario
- be concise
- preserve numeric values exactly
- never change the recommendation

If the response violates the schema, discard it and use deterministic fallback text.

---

# 62. AI SAFETY BOUNDARY

Gemini must not:

- determine official CCTS applicability
- invent methodology eligibility
- create official target values
- calculate emissions independently of the deterministic engine
- override the optimizer
- invent market prices
- claim verification
- claim issuance
- claim regulatory approval

The AI is an explanation layer, not the system of record.

---

# 63. FINAL ACCEPTANCE AUDIT

Before declaring the project complete, independently audit:

## Product
- Does the full decision loop work?

## Regulatory
- Are sources versioned?
- Are drafts distinguished from finals?
- Are discrepancies preserved?

## Data
- Is all demo data synthetic?
- Are calculations reproducible?

## Math
- Do tests validate emissions, GEI, surplus/shortfall, NPV, IRR and strategies?

## UI
- Is the interface premium?
- Are animations purposeful?
- Does hover feel polished?
- Is accessibility acceptable?

## AI
- Does Gemini enhance rather than control?
- Does the app work if Gemini fails?

## QA
- Does browser E2E pass?
- Are there console errors?
- Are there broken states?

## Demo
- Can the 90-second flow be performed from a clean startup?

## Documentation
- Does README explain how to run everything?
- Are source and discrepancy documents present?
- Is the final architecture documented?

Do not say "complete" until this audit passes.

---

# 64. FINAL ARTIFACTS YOU MUST PRODUCE

At minimum:

```text
README.md
docs/architecture.md
docs/source-register.md
docs/regulatory-discrepancies.md
docs/decision-model.md
docs/verification-report.md
.env.example
```

Also produce Antigravity artifacts for:

- initial implementation plan
- architecture
- browser walkthrough
- verification/test report
- final acceptance audit

---

# 65. FINAL RESPONSE PROTOCOL

When reporting progress, do not dump huge amounts of raw implementation detail.

Report:

```text
STATUS
WHAT CHANGED
WHAT WAS VERIFIED
TEST RESULTS
KNOWN ISSUES
NEXT ACTION
```

When the project is finished, report:

```text
FINAL STATUS: VERIFIED

Core workflow:
PASS

Regulatory/source traceability:
PASS / REVIEW

BUY:
PASS

BUILD:
PASS

HYBRID:
PASS

Scenarios:
PASS

Gemini:
PASS / FALLBACK VERIFIED

Browser QA:
PASS

Accessibility:
PASS

Known limitations:
...

Run commands:
...
```

---

# 66. ABSOLUTE RULE

Do not optimize for the number of files, number of features, or amount of code.

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

The strongest CarbonAlpha MVP is not the largest one.

It is the one that makes the core decision feel inevitable:

```text
I understand my carbon position.
        ↓
I understand my options.
        ↓
I understand the economics.
        ↓
I understand the risks.
        ↓
I can change assumptions.
        ↓
I understand why the recommendation changed.
        ↓
I can trace the result back to sources and assumptions.
```

BUILD CARBONALPHA TO THAT STANDARD.
