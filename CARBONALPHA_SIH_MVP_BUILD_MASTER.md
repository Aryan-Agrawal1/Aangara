# CARBONALPHA INDIA — SIH 2026 MVP BUILD MASTER

**Purpose:** Single source-of-reference for building, testing, reviewing and recording the CarbonAlpha SIH/SOA MVP in a two-day build window.

**Knowledge snapshot:** 19 August 2026 (India, IST)

**Scope:** Strict SIH-level MVP. This document intentionally excludes production-scale infrastructure, full regulatory filing automation, live trading, formal verification, autonomous lending, and enterprise-grade deployment work.

**Primary project sources:**
- CarbonAlpha project concept and strategic discussion documents supplied in this conversation.
- CarbonAlpha SIH 2026 submission PDF supplied in this conversation.
- Separate project instruction defining the monitored-sector scope as the current government CCTS compliance sectors.

**Primary external source rule:** Indian government / Gazette / regulator / BEE primary sources control regulatory claims. Secondary sources are cross-checks only. When sources conflict, preserve the conflict and version the data rather than silently choosing a convenient value.

---

# 0. NON-NEGOTIABLE MVP TARGET

The MVP is successful when, from one synthetic industrial entity, a judge can see this complete chain working:

```text
SELECT SECTOR
     |
     v
LOAD SYNTHETIC ENTITY
     |
     v
INPUT / GENERATE OPERATIONAL DATA
     |
     v
APPLY CURRENT CCTS / GEI CONFIGURATION
     |
     v
CALCULATE GHG EMISSIONS + GEI
     |
     v
CALCULATE PROJECTED SURPLUS / SHORTFALL
     |
     v
EVALUATE A DECARBONISATION PROJECT
     |
     v
CHECK MRV / DATA READINESS
     |
     v
COMPARE BUY / BUILD / HYBRID
     |
     v
STRESS-TEST ASSUMPTIONS
     |
     v
SHOW FINANCIAL + CLIMATE + RISK CONSEQUENCES
     |
     v
EXPLAIN WHY THE RESULT OCCURRED
```

The SIH submission itself defines Carbon Position Analysis, Build vs Buy vs Hybrid, Scenario Simulation and Risk & Consequence Analysis as the core solution functions. The submission also states that the prototype can use synthetic company/project data and predefined methodologies without depending on live market data.

**SIH source:** supplied CarbonAlpha SIH PDF, Slide 2 and Slide 4.

---

# 1. PRODUCT DEFINITION — FREEZE THIS FOR THE MVP

## 1.1 What CarbonAlpha is

> A decision-support platform that connects industrial emissions/intensity data, applicable Indian carbon-market requirements, project/MRV readiness and financial scenarios to compare decarbonisation and CCC strategies.

## 1.2 What CarbonAlpha is not

```text
NOT BEE
NOT CERC
NOT THE ICM REGISTRY
NOT AN ACCREDITED CARBON VERIFICATION AGENCY
NOT A POWER EXCHANGE
NOT A BANK
NOT A CREDIT RATING AGENCY
NOT AN ISSUER OF CCCs
NOT A VERIFICATION BODY
NOT A LIVE CCC BROKER
NOT A GUARANTEED CARBON-PRICE PREDICTOR
NOT A LEGAL OPINION ENGINE
```

Official issuance, verification and regulated trading remain within the applicable Indian framework.

**Primary regulatory source:**
[BEE — Indian Carbon Market / CCTS](https://beeindia.gov.in/show_content.php?lang=1&level=1&lid=294&ls_id=116)

---

# 2. THE ACTUAL CURRENT CCTS COMPLIANCE SECTOR SCOPE

For the SIH MVP sector master, replace the earlier five-sector structure with the **seven sectors for which the Government states GEI targets have been assigned to obligated entities**:

```text
sectors/
|
+-- aluminium/
+-- cement/
+-- chlor_alkali/
+-- pulp_paper/
+-- petrochemicals/
+-- petroleum_refinery/
+-- textile/
```

The Ministry of Power's parliamentary answer states that seven energy-intensive sectors — Aluminium, Cement, Chlor-Alkali, Pulp and Paper, Petrochemicals, Petroleum Refinery and Textile — had been transitioned from PAT to CCTS and that **490 obligated entities** had been assigned GEI targets.

**Primary source:**
[Ministry of Power — Lok Sabha answer, 12 March 2026](https://powermin.gov.in/sites/default/files/uploads/LS12032026_Eng_0.pdf)

BEE's institutional CCTS page also states the broader nine-sector gradual-transition architecture, which includes Fertiliser and Iron & Steel; this is **not equivalent to saying all nine are presently in the same final notified compliance state**. The MVP therefore uses the seven sectors confirmed in the Government's 2026 statement as the current monitored compliance scope.

**Primary source:**
[BEE — Indian Carbon Market](https://beeindia.gov.in/show_content.php?lang=1&level=1&lid=294&ls_id=116)

## 2.1 Sector status model

```text
CURRENT MONITORED COMPLIANCE SCOPE

Aluminium
Cement
Chlor-Alkali
Pulp & Paper
Petrochemicals
Petroleum Refinery
Textile

FUTURE / WATCHLIST

Iron & Steel
Fertiliser
Other future sectors
```

**Important:** A future/watchlist sector may be represented in the data model, but it must not be displayed as a current obligated CCTS sector unless the current primary-source record says so.

---

# 3. WHY THE MVP USES THE COMPLIANCE MECHANISM FIRST

The seven monitored sectors above are the current obligated/compliance side of CCTS. The compliance mechanism is the most natural MVP because it has:

- a defined obligated-entity concept;
- annual GEI targets;
- baseline output and baseline GEI;
- target trajectories;
- monitoring/reporting/verification;
- CCC issuance/surrender logic;
- a direct capital-allocation decision problem.

The Offset Mechanism is retained in the architecture as a future/project module, but it is **not necessary for the first complete SIH decision loop**.

**Primary source:**
[BEE — CCTS framework](https://beeindia.gov.in/show_content.php?lang=1&level=1&lid=294&ls_id=116)

---

# 4. LEGAL / REGULATORY SOURCE STACK

Use this hierarchy whenever implementing or checking a rule.

## Tier 1 — Binding / primary

1. [India Code — Energy Conservation Act, 2001](https://www.indiacode.nic.in/handle/123456789/14657)
2. [India Code — Energy Conservation Act PDF, including Section 14AA](https://www.indiacode.nic.in/bitstream/123456789/2003/1/A2001-52.pdf)
3. [BEE — Carbon Credit Trading Scheme / Indian Carbon Market](https://beeindia.gov.in/show_content.php?lang=1&level=1&lid=294&ls_id=116)
4. [BEE — Detailed Compliance Procedure under CCTS](https://beeindia.gov.in/sites/default/files/2024-07/Detailed%20Procedure%20for%20Compliance%20Procedure%20under%20CCTS.pdf)
5. [MoEFCC — Greenhouse Gases Emission Intensity Target Rules, 2025 / subsequent notifications](https://www.moef.gov.in/orders/update)
6. [MoEFCC / e-Gazette — G.S.R. 25(E), 13 January 2026](https://egazette.gov.in/WriteReadData/2026/269375.pdf)
7. [CERC — Current Regulations](https://cercind.gov.in/current_reg.html)
8. [CERC — CCC trading stakeholder record](https://cercind.gov.in/comments-CCC2024.html)
9. [BEE — Accredited Carbon Verification Agency information](https://beeindia.gov.in/show_content.php?lang=1&level=1&lid=294&ls_id=116)
10. [BEE — Offset Mechanism and methodologies](https://beeindia.gov.in/view_content.php?lang=1&lid=571)
11. [PIB — Indian Carbon Market Portal / Prakriti 2026](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2243377&lang=1&reg=1)

## Tier 2 — official market / implementation information

- [Indian Energy Exchange](https://www.iexindia.com/)
- [Power Exchange India Limited](https://www.powerexindia.com/)
- [Indian Carbon Market Portal / Government information](https://beeindia.gov.in/)

## Tier 3 — external analytical cross-checks

Use only to understand market context or test interpretation. Never let these override Tier 1 sources.

---

# 5. CORE LEGAL FACTS REQUIRED BY THE MVP

## 5.1 Energy Conservation Act

Section 14AA provides for issuance of carbon credit certificates to registered entities complying with the carbon-credit trading scheme and permits registered entities to purchase/sell certificates in accordance with the scheme.

**Source:**
[India Code — Energy Conservation Act](https://www.indiacode.nic.in/handle/123456789/14657)

## 5.2 CCTS 2023

CCTS was notified on 28 June 2023. The scheme establishes:

```text
COMPLIANCE MECHANISM
        |
        +-- obligated entities
        +-- GEI targets
        +-- annual compliance
        +-- CCC issuance / surrender

OFFSET MECHANISM
        |
        +-- non-obligated entities
        +-- project-based baseline-and-credit
        +-- registration / validation / verification / issuance
```

**Source:**
[BEE — Indian Carbon Market](https://beeindia.gov.in/show_content.php?lang=1&level=1&lid=294&ls_id=116)

## 5.3 Current institutional map

```text
                  CENTRAL GOVERNMENT
                         |
                         v
                 POLICY / LEGAL FRAMEWORK
                         |
              +----------+----------+
              |                     |
              v                     v
             BEE                  CERC
        Administrator            Regulator
              |                     |
              |                     v
              |              POWER EXCHANGES
              |                     |
              v                     |
        ICM INFORMATION             |
              |                     |
              v                     v
      GRID CONTROLLER          MARKET TRANSACTIONS
        REGISTRY
              |
              v
        CCC ACCOUNTS

ACV / VERIFICATION LAYER:
Accredited Carbon Verification Agencies
```

BEE identifies BEE as administrator, Grid Controller as registry operator and CERC as trading regulator; it also states that validation/verification is to be conducted by accredited agencies.

**Source:**
[BEE — Indian Carbon Market institutional framework](https://beeindia.gov.in/show_content.php?lang=1&level=1&lid=294&ls_id=116)

---

# 6. CCTS COMPLIANCE LOGIC — MVP FORM

The compliance mechanism is intensity-based.

## 6.1 Core equation

```text
GEI = Total GHG Emissions / Equivalent Product Output
```

The BEE compliance procedure defines GHG emission intensity as tonnes of CO2e per unit of equivalent product/output.

**Primary source:**
[BEE — Detailed Procedure for Compliance Mechanism under CCTS, July 2024](https://beeindia.gov.in/sites/default/files/2024-07/Detailed%20Procedure%20for%20Compliance%20Procedure%20under%20CCTS.pdf)

## 6.2 MVP compliance position

```text
Actual GEI < Target GEI
        |
        v
Potential compliance surplus
        |
        v
Potential CCC issuance quantity

Actual GEI > Target GEI
        |
        v
Potential compliance shortfall
        |
        v
CCC requirement / surrender / purchase
```

The detailed compliance procedure states that CCC issuance/surrender is based on the difference between achieved and target GHG emission intensity multiplied by relevant production quantity.

**Important MVP wording:** "potential" or "modelled" unless the system is using an official issued/registry status.

## 6.3 Quantity calculation for the prototype

For a simplified annual synthetic demonstration:

```text
COMPLIANCE_SURPLUS_CO2E
= max(0, TARGET_GEI - ACTUAL_GEI) * ACTUAL_OUTPUT

COMPLIANCE_SHORTFALL_CO2E
= max(0, ACTUAL_GEI - TARGET_GEI) * ACTUAL_OUTPUT
```

Treat these as **model calculations derived from the published compliance logic**, not as an autonomous issuance decision.

**Source for underlying rule:**
[BEE — Detailed Procedure for Compliance Mechanism under CCTS](https://beeindia.gov.in/sites/default/files/2024-07/Detailed%20Procedure%20for%20Compliance%20Procedure%20under%20CCTS.pdf)

---

# 7. EMISSIONS ENGINE — MVP VERSION

The BEE compliance procedure uses source-stream/activity-data/emission-factor logic and requires consideration of relevant energy and process sources within the applicable monitoring boundary.

A simplified prototype architecture is:

```text
ENERGY SOURCE STREAMS
  |
  +-- Solid fuel
  +-- Liquid fuel
  +-- Gaseous fuel
  +-- Purchased electricity
  +-- Purchased heat (where applicable)
  |
  v
ENERGY EMISSIONS

PROCESS SOURCE STREAMS
  |
  +-- chemical/process reactions
  +-- relevant raw material reactions
  +-- electrode / process-carbon sources where applicable
  |
  v
PROCESS EMISSIONS

ENERGY EMISSIONS + PROCESS EMISSIONS
                 |
                 v
           TOTAL tCO2e
                 |
                 v
           ACTUAL GEI
```

## 7.1 Basic combustion equation

For a synthetic MVP source stream:

```text
GHG_Emissions = Activity_Data * Emission_Factor * Conversion_Factor
```

The BEE procedure explicitly defines activity data, emission factor and conversion factor and provides source-stream equations. Use the current official procedure/version for the actual factor values.

**Source:**
[BEE — Detailed Procedure for Compliance Mechanism under CCTS](https://beeindia.gov.in/sites/default/files/2024-07/Detailed%20Procedure%20for%20Compliance%20Procedure%20under%20CCTS.pdf)

## 7.2 Mass-balance equation where applicable

The BEE procedure includes a mass-balance formulation of the form:

```text
GHG emissions =
(Material_in * Carbon_Content_in
 - Material_out * Carbon_Content_out)
 * 44/12
```

Use this only where the selected source stream/process model requires it.

**Source:**
[BEE compliance procedure — mass balance section](https://beeindia.gov.in/sites/default/files/Detailed%20Procedure%20for%20Compliance%20Procedure%20under%20CCTS.pdf)

## 7.3 GWP / conversion factors

Do not hard-code arbitrary IPCC GWP factors for the MVP unless they are the factors required by the current applicable official monitoring procedure.

Store them as versioned reference data:

```text
factor_id
factor_type
value
unit
source
source_version
effective_date
```

---

# 8. SYNTHETIC DATASET — SINGLE SOURCE OF TRUTH

The dataset must be generated from a **structured relational-like master record**, then exported to JSON/CSV for the application.

Use the same master data for:

- dashboards;
- calculations;
- scenario engine;
- tests;
- demo recording;
- exported decision report.

Never maintain separate manually edited numbers for different screens.

## 8.1 Entity model

```text
ENTITY
 |
 +-- FACILITY
       |
       +-- REPORTING PERIOD
       |      |
       |      +-- PRODUCTION
       |      +-- ENERGY
       |      +-- EMISSION SOURCES
       |      +-- GHG TOTAL
       |      +-- GEI
       |
       +-- REGULATORY PROFILE
       |
       +-- PROJECT PIPELINE
              |
              +-- PROJECT ECONOMICS
              +-- MRV READINESS
              +-- SCENARIOS
```

---

# 9. MASTER DATASET SCHEMA

Use snake_case field names throughout the application.

## 9.1 `entity_profile`

| Field | Type | Required | Meaning |
|---|---|---:|---|
| `entity_id` | string | yes | synthetic unique identifier |
| `entity_name` | string | yes | e.g. `Synthetic Cement Unit 01` |
| `sector` | enum | yes | one of seven monitored sectors |
| `sub_sector` | string/null | yes | sector-specific subtype where applicable |
| `facility_id` | string | yes | synthetic facility identifier |
| `state` | string | yes | Indian state, synthetic or generic |
| `reporting_year` | integer | yes | reporting year represented in dataset |
| `obligated_status` | enum | yes | `obligated`, `not_obligated`, `unknown` |
| `regulation_record_id` | string | yes | rule/target lookup key |
| `data_status` | enum | yes | `synthetic` |

## 9.2 `production_record`

| Field | Type | Required | Meaning |
|---|---|---:|---|
| `equivalent_output_tonnes` | float | yes | denominator for GEI |
| `major_product_unit` | string | yes | unit definition |
| `operating_days` | integer | yes | synthetic operational parameter |
| `capacity_tpa` | float | optional | annual capacity |
| `utilisation_pct` | float | derived | output / capacity |

## 9.3 `baseline_record`

| Field | Meaning |
|---|---|
| `baseline_year` | e.g. 2023-24 |
| `baseline_output` | official-target-table basis / synthetic mapped equivalent output |
| `baseline_gei` | tCO2e per equivalent output |
| `baseline_target_source` | URL + document/version |

## 9.4 `target_record`

| Field | Meaning |
|---|---|
| `target_gei_2025_26` | official target lookup |
| `target_gei_2026_27` | official target lookup |
| `trajectory_id` | target table/version identifier |
| `target_source_url` | official source |
| `target_status` | `final`, `draft`, `watch`, `unknown` |

The target must be treated as configuration/reference data, not as a random user input.

---

# 10. ENERGY DATASET FIELDS

For every source stream:

| Field | Meaning |
|---|---|
| `source_stream_id` | unique source stream |
| `source_type` | solid/liquid/gas/electricity/heat/other |
| `fuel_or_material_name` | synthetic source name |
| `quantity` | activity data |
| `quantity_unit` | t, Nm3, MWh, etc. |
| `net_calorific_value` | where applicable |
| `ncv_unit` | kCal/kg, kCal/Nm3, etc. |
| `emission_factor` | versioned factor |
| `emission_factor_unit` | factor unit |
| `conversion_factor` | where applicable |
| `factor_source` | official/source record |
| `calculated_tco2e` | derived |
| `data_quality_flag` | green/yellow/red |

---

# 11. PROCESS EMISSIONS DATASET FIELDS

Use one record per process source.

| Field | Meaning |
|---|---|
| `process_source_id` | unique source |
| `process_name` | synthetic process label |
| `activity_data` | quantity |
| `activity_unit` | t/Nm3/etc. |
| `carbon_content` | where applicable |
| `material_in` | mass-balance input |
| `material_out` | mass-balance output |
| `process_emission_factor` | where applicable |
| `method` | factor/mass_balance/sector_rule |
| `calculated_tco2e` | derived |
| `source_reference` | rule/method source |

The BEE compliance procedure explicitly includes process-related emissions and gives a mass-balance approach for applicable sources.

---

# 12. OUTPUTS OF THE CARBON ENGINE

For every entity/year calculate:

```text
TOTAL_GHG_TCO2E
ACTUAL_GEI
TARGET_GEI
GEI_DELTA
POTENTIAL_SURPLUS_TCO2E
POTENTIAL_SHORTFALL_TCO2E
```

Definitions:

```text
GEI_DELTA = ACTUAL_GEI - TARGET_GEI

if GEI_DELTA < 0:
    status = "potential_surplus"
else:
    status = "potential_shortfall"
```

Do not describe `potential_surplus_tco2e` as "issued CCCs".

---

# 13. SECTOR-SPECIFIC DATA SCHEMAS

All seven sectors share the common emissions/GEI framework. The sector module adds operational drivers required to make the synthetic demo believable and to support future methodology/rule expansion.

## 13.1 Aluminium

### Inputs

```text
aluminium_output_tonnes
electricity_mwh
fuel_quantity
anode_or_electrode_material_tonnes
raw_material_tonnes
process_emission_inputs
purchased_electricity_mwh
other_relevant_source_streams
```

### Useful derived values

```text
energy_intensity
emissions_per_tonne_output
actual_gei
projected_gei_after_project
```

### Project examples for synthetic demo

- electricity-efficiency improvement;
- process optimisation;
- renewable electricity scenario;
- process-carbon reduction.

Do not claim that every project automatically qualifies for CCC issuance. Applicability must be tied to the applicable regulatory/methodological route.

---

## 13.2 Cement

### Inputs

```text
cement_output_tonnes
clinker_output_tonnes
fuel_quantity_by_type
electricity_mwh
alternative_fuel_quantity
raw_material_quantity
process_emission_inputs
purchased_electricity_mwh
```

### Derived

```text
clinker_ratio
energy_intensity
actual_gei
projected_gei
potential_compliance_position
```

### Best SIH demo project

**Waste-heat recovery / energy-efficiency intervention**

Reason: the MVP can demonstrate:

```text
CAPEX
↓
Energy saving
↓
Lower emissions
↓
Lower GEI
↓
Changed carbon position
↓
BUY vs BUILD vs HYBRID
```

This is a prototype design choice, not an assertion that the project automatically earns CCCs.

---

## 13.3 Chlor-Alkali

### Inputs

```text
chlorine_output_tonnes
caustic_soda_output_tonnes
electricity_mwh
fuel_quantity
steam_consumption
process_emission_inputs
purchased_electricity_mwh
```

### Derived

```text
production_equivalent
energy_intensity
actual_gei
potential_shortfall_or_surplus
```

### Demo project

**Electrical efficiency improvement / technology upgrade**

---

## 13.4 Pulp & Paper

### Inputs

```text
pulp_output_tonnes
paper_output_tonnes
wood_or_fibre_input_tonnes
black_liquor_or_process_fuel_proxy
biomass_quantity
fossil_fuel_quantity
electricity_mwh
steam_or_heat_consumption
process_emission_inputs
```

### Derived

```text
energy_intensity
fossil_share
actual_gei
projected_gei
```

### Demo project

**Boiler / steam / energy-efficiency intervention**

---

## 13.5 Petrochemicals

### Inputs

```text
major_product_output_tonnes
feedstock_quantity_tonnes
fuel_gas_quantity
liquid_fuel_quantity
electricity_mwh
steam_imported
process_emission_inputs
```

### Derived

```text
production_mix
energy_intensity
actual_gei
projected_gei
```

### Demo project

**Energy-efficiency / process-optimisation intervention**

---

## 13.6 Petroleum Refinery

The 2026 target table uses refinery-specific units including crude throughput and an energy/intensity representation. For MVP data, retain the official unit metadata in the target lookup rather than normalising all refineries to an invented generic output unit.

### Inputs

```text
crude_throughput
throughput_unit
fuel_gas_quantity
liquid_fuel_quantity
natural_gas_quantity
electricity_mwh
steam_imported
process_emission_inputs
```

### Derived

```text
energy_intensity
actual_gei
projected_gei
potential_shortfall_or_surplus
```

### Demo project

**Energy-efficiency / heat-integration intervention**

The official 13 January 2026 amendment contains refinery-specific baseline throughput and GHG-intensity targets.

**Primary source:**
[MoEFCC — G.S.R. 25(E), 13 January 2026](https://egazette.gov.in/WriteReadData/2026/269375.pdf)

---

## 13.7 Textile

### Inputs

```text
textile_output_tonnes
product_type
yarn_or_fabric_output
electricity_mwh
steam_consumption
coal_quantity
gas_quantity
biomass_quantity
process_emission_inputs
```

### Derived

```text
energy_intensity
actual_gei
projected_gei
```

### Demo project

**Efficient boiler / electric efficiency / fuel-switching intervention**

The official target table contains entity-specific textile output and GEI values; the MVP should use synthetic entities but pull the applicable rule structure from the official target reference data.

**Primary source:**
[MoEFCC — G.S.R. 25(E), 13 January 2026](https://egazette.gov.in/WriteReadData/2026/269375.pdf)

---

# 14. DO NOT HARD-CODE REAL COMPANY DATA INTO THE SYNTHETIC DATASET

The demo entity must be visibly synthetic:

```text
Synthetic Cement Unit 01
Synthetic Refinery Unit 01
Synthetic Aluminium Unit 01
```

Use official public target structure to make the values realistic, but do not present copied real-company data as if it were a real customer.

The SIH source material explicitly recommends a synthetic company/project for the demo.

---

# 15. HOW TO GENERATE A GOOD SYNTHETIC DATASET

## 15.1 Dataset layers

Generate in this order:

```text
1. ENTITY
2. SECTOR
3. REGULATORY PROFILE
4. OUTPUT / PRODUCTION
5. ENERGY SOURCE STREAMS
6. PROCESS SOURCE STREAMS
7. BASELINE
8. TARGET
9. ACTUAL REPORTING YEAR
10. PROJECT
11. MRV STATE
12. FINANCIAL ASSUMPTIONS
13. SCENARIOS
14. EXPECTED OUTPUTS
```

## 15.2 Synthetic-data constraints

Every generated row must obey:

```text
output > 0
energy > 0
fuel >= 0
emissions >= 0
GEI >= 0
CAPEX >= 0
OPEX >= 0
project_reduction >= 0
project_reduction <= plausible baseline emissions
```

## 15.3 Do not use independent random fields

Bad:

```text
random_output
random_emissions
random_GEI
```

This creates internally inconsistent data.

Good:

```text
choose output
      ↓
choose activity data
      ↓
calculate emissions
      ↓
calculate GEI
      ↓
apply target
      ↓
calculate surplus/shortfall
```

The dataset should be **generated from equations**, not by randomly inventing the final answer.

---

# 16. SYNTHETIC DATASET: MINIMUM NUMBER OF ROWS FOR THE MVP

For two-day delivery:

```text
7 sectors
x
3 synthetic entities per sector
=
21 entities
```

For each entity:

```text
2 reporting years
1 baseline
1 main project
3 strategies
6-10 scenario combinations
```

This produces enough data for the dashboard to look substantive without building an industrial-scale data warehouse.

The recording should focus on **one entity**.

---

# 17. RECOMMENDED DEMO ENTITY

Use **Synthetic Cement Unit 01** for the main recording because the shared engine is easy to explain visually.

The other six sectors prove breadth through the sector selector and comparison views.

This is a product/demo choice, not a claim that cement is legally more important than the other current sectors.

---

# 18. TARGET REFERENCE DATA

Create a small immutable file:

```text
regulatory_targets.json
```

Structure:

```json
{
  "sector": "cement",
  "sub_sector": "<official applicable subtype>",
  "target_period": "2025-26",
  "baseline_year": "2023-24",
  "baseline_gei": "OFFICIAL_LOOKUP",
  "target_gei": "OFFICIAL_LOOKUP",
  "target_status": "final",
  "source_url": "https://...",
  "source_document": "...",
  "source_date": "..."
}
```

The production application reads this file; it does not embed target values inside business logic.

---

# 19. OFFICIAL TARGET DATA — HOW TO USE IT SAFELY

The January 2026 amendment Gazette contains entity-level baseline output, baseline GEI and target GEI for the additional sectors it notified, including Petroleum Refinery, Petrochemical and Textile, and the second Aluminium category.

Example fields from the official table include:

```text
entity name/address
registration number
baseline equivalent major product output
baseline GHG emission intensity
2025-26 target
2026-27 target
```

**Primary source:**
[MoEFCC / e-Gazette — G.S.R. 25(E), 13 January 2026](https://egazette.gov.in/WriteReadData/2026/269375.pdf)

For the MVP, map one official rule/target record to one synthetic entity configuration; do not copy the real entity identity into the visible application.

---

# 20. PROJECT DATASET

Each synthetic project should contain:

| Field | Meaning |
|---|---|
| `project_id` | synthetic project id |
| `entity_id` | parent entity |
| `project_type` | energy efficiency / fuel switching / process optimisation / etc. |
| `baseline_annual_emissions` | model input |
| `expected_reduction_pct` | engineering assumption |
| `expected_reduction_tco2e` | derived |
| `capex` | user/demo assumption |
| `annual_opex_change` | user/demo assumption |
| `annual_energy_savings` | model input |
| `implementation_months` | model input |
| `mr_v_cost` | model assumption |
| `verification_cost` | model assumption |
| `project_delay_months` | scenario input |
| `project_status` | proposed / implemented / synthetic |
| `methodology_pathway` | compliance / offset / none / review |
| `methodology_status` | mapped / unknown / not_applicable |

---

# 21. MRV READINESS MODEL

Keep the MVP score simple and auditable.

Use five components:

```text
Measurement completeness      20%
Activity-data completeness    20%
Emission-factor traceability  20%
Methodology mapping           20%
Verification readiness        20%
```

Example:

```text
MRV_READINESS =
0.20*M1 +
0.20*M2 +
0.20*M3 +
0.20*M4 +
0.20*M5
```

Each component is 0-100.

### Important

This is a **CarbonAlpha prototype analytical score**.

It is not:

- BEE accreditation;
- ACV verification;
- a CERC/BEE rating;
- official compliance status.

---

# 22. FINANCIAL ENGINE

## 22.1 Common inputs

```text
capex
annual_opex_change
annual_energy_savings
annual_carbon_value_scenario
financing_rate
analysis_horizon_years
tax_assumption_if_used
implementation_delay
mrv_cost
verification_cost
```

## 22.2 Cash-flow equation

```text
NET_CASH_FLOW_t
=
ENERGY_SAVINGS_t
+
CARBON_VALUE_SCENARIO_t
-
OPEX_CHANGE_t
-
FINANCING_COST_t
-
MRV_COST_t
-
VERIFICATION_COST_t
```

## 22.3 NPV

```text
NPV = Σ [CF_t / (1+r)^t] - Initial_CAPEX
```

## 22.4 IRR

IRR is the rate `r` where:

```text
0 = Σ [CF_t / (1+r)^t] - Initial_CAPEX
```

## 22.5 Cost per tonne

```text
COST_PER_TCO2E
=
NET_PROJECT_COST / MODELLED_TCO2E_REDUCTION
```

Do not present these financial values as guaranteed outcomes.

---

# 23. BUY STRATEGY

The BUY strategy is a scenario model, not live execution.

Inputs:

```text
modelled_ccc_requirement
assumed_ccc_price
transaction_cost
availability_factor
```

Output:

```text
BUY_COST
BUY_TCO2E_EFFECT
BUY_TIMING
BUY_RISK
```

For the SIH prototype, the CCC price is an **explicit scenario assumption** unless a current authoritative market observation is available and properly sourced.

Never call a synthetic scenario price the "market price".

---

# 24. BUILD STRATEGY

Inputs:

```text
capex
annual_opex_change
energy_savings
modelled_emission_reduction
implementation_time
mr_v_cost
verification_cost
```

Outputs:

```text
BUILD_NPV
BUILD_IRR
BUILD_PAYBACK
BUILD_TCO2E_REDUCTION
BUILD_GEI_IMPROVEMENT
BUILD_RISK
```

---

# 25. HYBRID STRATEGY

Use the build project first, then calculate the residual compliance position.

```text
BASELINE_COMPLIANCE_GAP
       |
       v
BUILD_REDUCTION
       |
       v
RESIDUAL_COMPLIANCE_GAP
       |
       v
BUY_RESIDUAL_CCC_SCENARIO
       |
       v
HYBRID_TOTAL_COST
```

This is the most powerful MVP screen because it makes the product's central decision visible.

---

# 26. CAPITAL OPTIMIZER — MVP ALGORITHM

Do **not** use a black-box ML model to decide the final strategy.

Use an explicit weighted utility model so the judge can audit it in seconds.

```text
STRATEGY_SCORE =
  0.35 * NORMALISED_FINANCIAL_SCORE
+ 0.25 * NORMALISED_CLIMATE_SCORE
+ 0.20 * NORMALISED_COMPLIANCE_SCORE
+ 0.10 * NORMALISED_MRV_SCORE
+ 0.10 * NORMALISED_TIMING_SCORE
```

Then apply hard constraints:

```text
if regulatory_pathway_invalid:
    strategy = INELIGIBLE

if project_reduction < required_minimum:
    strategy = VALID_BUT_PARTIAL

if data_quality < threshold:
    add_uncertainty_flag
```

### Why this method

- deterministic;
- easy to test;
- explainable;
- no training instability;
- works with synthetic data;
- can be replaced later by a more advanced optimiser.

The user sees the components behind the score.

---

# 27. AI / ML — MVP-APPROPRIATE USE ONLY

## 27.1 Do not use ML for regulatory truth

Rules, target values, methodologies and legal status must come from structured source data.

## 27.2 Do not use ML as the primary numerical carbon calculator

Carbon calculations should be deterministic.

## 27.3 Recommended ML feature: anomaly detection

Use `IsolationForest` from scikit-learn on synthetic historical operational data to flag unusual combinations such as:

```text
very high energy + very low output
very low energy + very high output
sudden emissions spike
missing source stream
unexpected GEI jump
```

Output:

```text
NORMAL
REVIEW
ANOMALY
```

It should be explicitly labelled:

> **Data-quality anomaly flag — not a compliance determination.**

## 27.4 Optional LLM role

Use a language model only for:

- turning structured results into a short management explanation;
- extracting non-authoritative narrative information from uploaded documents;
- generating a natural-language "why" summary from already-calculated facts.

The LLM must not be allowed to overwrite:

```text
regulatory rules
numerical calculations
target values
emission factors
CCC quantities
financial outputs
```

---

# 28. MODEL PIPELINE

```text
RAW DATA
   |
   v
VALIDATION
   |
   +---- invalid ---> ERROR PANEL
   |
   v
NORMALISATION
   |
   v
DETERMINISTIC CARBON ENGINE
   |
   v
REGULATORY ENGINE
   |
   v
MRV ENGINE
   |
   v
FINANCIAL ENGINE
   |
   v
SCENARIO ENGINE
   |
   v
CAPITAL OPTIMIZER
   |
   +----> ML ANOMALY FLAG
   |
   +----> EXPLANATION GENERATOR
   |
   v
DASHBOARD
```

The deterministic path must remain functional even if the AI/ML component fails.

---

# 29. FAULT ISOLATION — MANDATORY

Each feature must fail independently.

```text
                   API / ORCHESTRATOR
                           |
        +------------------+------------------+
        |                  |                  |
        v                  v                  v
 CARBON ENGINE         MRV ENGINE       FINANCE ENGINE
        |                  |                  |
        v                  v                  v
 SCENARIO ENGINE     ML ANOMALY       EXPLANATION ENGINE
        |                  |                  |
        +------------------+------------------+
                           |
                           v
                       DASHBOARD
```

Failure rules:

```text
ML unavailable
-> show dashboard without anomaly flag

LLM unavailable
-> show deterministic explanation template

market-data unavailable
-> show scenario price input

one sector config broken
-> show sector error; keep other sectors accessible

one project model broken
-> keep base carbon position available
```

Never make the UI depend on one fragile optional service.

---

# 30. RECOMMENDED TECH STACK — LOCK FOR THE TWO-DAY BUILD

## Frontend

**Next.js + React + TypeScript**

Use:

- App Router;
- TypeScript strict mode;
- Tailwind CSS;
- lightweight chart library;
- component library only where it saves time.

## Backend

**Python + FastAPI**

Use:

- Pydantic models;
- service modules;
- deterministic calculation functions;
- REST JSON APIs.

## Database

**PostgreSQL** for the structured MVP.

Use SQLite only for a fallback/local-only build if PostgreSQL setup becomes a blocker.

## Analytics / ML

**Python**

- pandas;
- numpy;
- scikit-learn;
- scipy only if needed.

## Validation

- Pydantic;
- pytest.

## API contract

OpenAPI generated automatically by FastAPI.

## Package management

Use one Python environment / lock file and one JavaScript lock file.

## Deployment

The MVP should be deployable as:

```text
Frontend -> static/Node web app
Backend  -> FastAPI service
Database -> PostgreSQL
```

The exact hosting provider is not part of the product definition. Local demonstration must work before deployment.

---

# 31. RECOMMENDED REPOSITORY STRUCTURE

```text
carbonalpha/
|
+-- frontend/
|   +-- app/
|   +-- components/
|   +-- lib/
|   +-- types/
|   +-- styles/
|
+-- backend/
|   +-- app/
|       +-- main.py
|       +-- api/
|       +-- schemas/
|       +-- services/
|       +-- engines/
|       |   +-- carbon.py
|       |   +-- regulatory.py
|       |   +-- mrv.py
|       |   +-- finance.py
|       |   +-- scenarios.py
|       |   +-- optimizer.py
|       |   +-- anomaly.py
|       +-- sectors/
|       +-- data/
|       +-- tests/
|
+-- data/
|   +-- synthetic/
|   +-- regulatory/
|   +-- factors/
|
+-- docs/
|   +-- source_register.md
|
+-- scripts/
|   +-- generate_synthetic_data.py
|   +-- validate_dataset.py
|
+-- tests/
|
+-- README.md
+-- docker-compose.yml
```

---

# 32. API MAP

## `GET /api/sectors`

Returns seven current monitored sectors.

## `GET /api/sectors/{sector}`

Returns sector configuration and supported inputs.

## `GET /api/regulatory/targets?sector=cement&year=2026-27`

Returns the selected target configuration with source metadata.

## `POST /api/entities`

Creates synthetic or user-input entity.

## `POST /api/calculate/carbon-position`

Input:

```json
{
  "entity_id": "SYN-CEM-001",
  "reporting_year": "2026-27"
}
```

Output:

```json
{
  "total_ghg_tco2e": 0,
  "actual_gei": 0,
  "target_gei": 0,
  "potential_surplus_tco2e": 0,
  "potential_shortfall_tco2e": 0
}
```

## `POST /api/projects/evaluate`

Runs project economics.

## `POST /api/strategies/compare`

Runs BUY / BUILD / HYBRID.

## `POST /api/scenarios/run`

Runs a scenario set.

## `GET /api/entities/{id}/explain`

Returns the decision explanation object.

## `GET /api/health`

Returns service health.

---

# 33. API FAILURE CONTRACT

Every endpoint returns:

```json
{
  "success": true,
  "data": {},
  "errors": [],
  "warnings": [],
  "source_status": "current"
}
```

On partial failure:

```json
{
  "success": true,
  "data": {},
  "errors": [
    {
      "module": "anomaly_engine",
      "code": "OPTIONAL_SERVICE_UNAVAILABLE",
      "message": "Anomaly analysis unavailable; deterministic analysis remains available."
    }
  ]
}
```

Do not return HTTP 500 for an optional feature failure if the core decision path remains valid.

---

# 34. DATABASE TABLES — MVP ONLY

Use these tables:

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

Keep the database normalized enough to avoid duplicate rule values.

---

# 35. SOURCE REGISTER TABLE

This table is mandatory.

Fields:

```text
source_id
source_type
authority
document_title
document_date
version
publication_url
effective_date
retrieved_at
applicability
status
notes
```

Example:

```text
source_id: REG-CERC-2026-CCC
source_type: regulation
authority: CERC
document_title: Terms and Conditions for Purchase and Sale of Carbon Credit Certificates Regulations, 2026
publication_url: https://cercind.gov.in/current_reg.html
status: current
```

---

# 36. REGULATORY VERSIONING

Every calculation must carry:

```text
regulatory_version
methodology_version
factor_version
model_version
data_version
```

Example:

```text
Decision ID: CA-DEC-0001
Regulation: REG-2026-08
Methodology: N/A-COMPLIANCE
Factor Set: EF-2026-01
Model: CA-MVP-1.0
Dataset: SYNTH-2026-08-01
```

This allows a judge or team member to reproduce the result.

---

# 37. DASHBOARD — DESIGN PRINCIPLE

The UI should be minimalist, dense enough for an expert, but immediately understandable to a judge.

Do not build ten dashboards.

Build **one decision cockpit**.

---

# 38. DASHBOARD SCREEN MAP

```text
HEADER
CarbonAlpha | Sector | Entity | Reporting Year | Data Status

-------------------------------------------------------------
CARBON POSITION        MRV READINESS       FINANCIAL STATUS
GEI                    84%                 NPV / Payback
Target                 Good                Scenario
Gap / Surplus

-------------------------------------------------------------
                DECISION TWIN

           BUY       BUILD       HYBRID
          ₹XXX       ₹XXX        ₹XXX
          Risk       Risk        Risk
          tCO2e      tCO2e       tCO2e

-------------------------------------------------------------
SCENARIO CONTROLS
CCC Price | Project Output | Delay | Financing Rate

-------------------------------------------------------------
CONSEQUENCE VIEW
Cost | CO2e | GEI | Compliance Gap | Risk

-------------------------------------------------------------
WHY THIS RESULT?
Sources | Assumptions | Calculation | Warnings
```

---

# 39. THE WOW FEATURE — DECISION TWIN

The strongest visual should be the central comparison:

```text
             CARBONALPHA DECISION TWIN

       BUY             BUILD             HYBRID
        |                |                  |
     ₹  X             ₹  Y               ₹  Z
     CO2 X            CO2 Y              CO2 Z
     Risk X           Risk Y             Risk Z
     Time X           Time Y             Time Z
        \                |                 /
         \_______________|________________/
                         |
                         v
                RECOMMENDED PATH
```

Every number must be clickable or traceable to its input/assumption.

---

# 40. SCENARIO PANEL

Only expose four variables in the MVP:

```text
CCC PRICE
PROJECT OUTPUT
PROJECT DELAY
FINANCING RATE
```

Example:

```text
CCC Price:        ₹ 1,000 / tCO2e
Project Output:   100%
Delay:            0 months
Financing Rate:   10%
```

Moving one slider should instantly update:

```text
BUY COST
BUILD NPV
HYBRID COST
COMPLIANCE GAP
RECOMMENDED STRATEGY
```

---

# 41. EXPLAINABILITY PANEL

Always show:

```text
RESULT
↓
INPUTS
↓
RULE
↓
CALCULATION
↓
ASSUMPTION
↓
RISK
↓
SOURCE
```

Example:

```text
WHY HYBRID?

1. Build reduces GEI by X%.
2. Residual shortfall remains Y tCO2e.
3. Buying the residual amount costs ₹Z under the selected scenario.
4. Hybrid has lower modelled three-year cost than pure BUY or BUILD.
5. Result is sensitive to CCC price and project delay.

STATUS:
Modelled decision support — not regulatory advice or issuance confirmation.
```

---

# 42. DASHBOARD STATUS COLORS

Use only a restrained semantic palette.

```text
NEUTRAL   = baseline / information
GREEN     = positive / complete / below target
AMBER     = review / uncertainty / scenario sensitivity
RED       = shortfall / invalid / high-risk condition
BLUE      = source / analytical information
```

Do not use red to imply legal non-compliance unless the underlying rule calculation actually establishes the condition and the interface labels it as modelled.

---

# 43. SECTOR SELECTOR

The selector should show:

```text
CURRENT CCTS MONITORED

Aluminium
Cement
Chlor-Alkali
Pulp & Paper
Petrochemicals
Petroleum Refinery
Textile

--------------------------------

FUTURE / WATCHLIST

Iron & Steel
Fertiliser
```

However, the **CURRENT** list must remain tied to the current source register. Do not hard-code the status permanently.

**Government current-sector source:**
[Ministry of Power, 12 March 2026](https://powermin.gov.in/sites/default/files/uploads/LS12032026_Eng_0.pdf)

---

# 44. OFFSET MECHANISM — KEEP AS A CONSTRAINED FUTURE MODULE

Do not let the offset mechanism dominate the MVP.

Current BEE material describes the Offset Mechanism as a voluntary project-based baseline-and-credit mechanism for non-obligated entities.

BEE's detailed procedure says project activities may fall across sectors such as energy, industries, waste handling/disposal, agriculture, forestry, transport, construction, fugitive emissions, solvents and CCUS, subject to Central Government inclusion/exclusion over time.

**Sources:**
- [BEE — Offset Mechanism](https://beeindia.gov.in/sites/default/files/Detailed%20Procedure%20for%20Offset%20Mechanism_CCTS.pdf)
- [BEE — Offset Mechanism and methodologies](https://beeindia.gov.in/view_content.php?lang=1&lid=571)

For the SIH build, maintain the data structure but do not implement a full project-registration lifecycle.

---

# 45. CURRENT BEE OFFSET METHODOLOGY PAGE — VERSION CONTROL

The BEE page updated 7 July 2026 currently lists eight approved methodologies:

```text
BM EN01.001 — Grid-connected renewable electricity
BM EN01.002 — Hydrogen production from electrolysis of water
BM IN02.001 — Energy efficiency / fuel switching for industrial facilities
BM IN02.002 — Hydrogen production using methane from biogas
BM WA03.001 — Landfill methane recovery
BM WA03.002 — Flaring/use of landfill gas
BM AG04.001 — Methane recovery from livestock/manure
BM FR05.001 — Afforestation/reforestation of degraded mangrove habitats
```

**Current BEE source:**
[Methodologies and Tools under Offset Mechanism — updated 7 July 2026](https://beeindia.gov.in/view_content.php?lang=1&lid=571)

A March 2026 PIB release referred to nine notified methodologies. Because the current BEE page and earlier Government communication are not identical in count, the MVP must **not hard-code a methodology count as an invariant**. Store methodology records with version/status/source.

---

# 46. COMPLIANCE VS OFFSET — UI TERMINOLOGY

Use:

```text
Compliance Pathway
Offset Pathway
No Applicable Pathway
Requires Review
```

Do not use:

```text
Guaranteed Credit
Automatic Credit
Certified by AI
```

---

# 47. MARKET PRICE HANDLING

The MVP must have three classes of price data:

```text
OBSERVED
SCENARIO
MODELLED
```

### OBSERVED

Only if sourced from a trustworthy current source with date/time and provenance.

### SCENARIO

User-entered or demo-entered assumption.

### MODELLED

Output of a statistical model.

For the two-day MVP, use **SCENARIO** price as the default so the demo does not depend on live CCC market availability.

The SIH PDF itself states that the prototype can function without live market data.

---

# 48. NO PRICE-PREDICTION MODEL IN MVP

Do not spend build time training a CCC price predictor.

Reasons:

- limited historical domestic CCC trading data at this stage;
- thin/early market history;
- high risk of presenting spurious precision;
- unnecessary for the core SIH decision.

Use scenario sensitivity instead.

This is both more robust and closer to the project's stated SIH functionality.

---

# 49. DATA-QUALITY ENGINE

Implement deterministic validation before calculations.

Checks:

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

Output:

```text
PASS
WARNING
BLOCKING ERROR
```

---

# 50. UNIT NORMALISATION

Create a central `unit_registry`.

Minimum:

```text
kg
kt
t
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

Never perform arithmetic on strings carrying units.

Every numeric field should have an explicit unit metadata field.

---

# 51. DATA VALIDATION RULES

Examples:

```text
output_tonnes > 0

energy_mwh >= 0

emissions_tco2e >= 0

0 <= utilisation_pct <= 100

0 <= expected_reduction_pct <= 100

capex >= 0

financing_rate >= 0

analysis_horizon_years >= 1
```

GEI check:

```text
ABS(
  supplied_gei - emissions/output
) <= tolerance
```

If not, reject the record instead of silently changing it.

---

# 52. TEST DATA DESIGN

Create three categories:

```text
VALID_CASES
EDGE_CASES
FAILURE_CASES
```

## Valid

- normal production;
- normal emissions;
- target exists;
- complete data.

## Edge

- very low output;
- very high output;
- zero project reduction;
- 100% project reduction assumption;
- zero CAPEX;
- large delay;
- high CCC scenario price.

## Failure

- missing output;
- missing target;
- negative fuel;
- unsupported methodology;
- invalid sector.

---

# 53. EXPECTED TEST CASE — CORE CALCULATION

Input:

```text
Output = 1,000,000 t
Total emissions = 700,000 tCO2e
Target GEI = 0.72 tCO2e/t
```

Actual GEI:

```text
700,000 / 1,000,000 = 0.70
```

Target:

```text
0.72
```

Position:

```text
0.70 < 0.72
```

Potential surplus:

```text
(0.72 - 0.70) * 1,000,000
= 20,000 tCO2e-equivalent
```

Label:

> **Modelled potential surplus — not an issued CCC balance.**

---

# 54. PROJECT EFFECT TEST

If a project reduces emissions by 50,000 tCO2e:

```text
New emissions
= 700,000 - 50,000
= 650,000

New GEI
= 650,000 / 1,000,000
= 0.65
```

This should flow automatically through:

```text
EMISSIONS
↓
GEI
↓
CARBON POSITION
↓
FINANCIAL MODEL
↓
STRATEGY SCORE
```

---

# 55. SCENARIO TEST MATRIX

At minimum test:

| Scenario | CCC Price | Project Output | Delay | Financing Rate |
|---|---:|---:|---:|---:|
| Base | 100% | 100% | 0 | base |
| Cheap CCC | low | 100% | 0 | base |
| Expensive CCC | high | 100% | 0 | base |
| Project underperformance | base | 70% | 0 | base |
| Project delay | base | 100% | 6 months | base |
| High financing | base | 100% | 0 | high |

The dashboard should update the strategy ranking after each scenario.

---

# 56. DECISION OPTIMIZER — EXPLANATION RULE

Never display:

> "AI chose Hybrid."

Display:

```text
HYBRID ranked first because:

Financial: lowest modelled total cost
Climate: meaningful emissions reduction
Compliance: residual gap covered in scenario
MRV: acceptable readiness
Timing: lower risk than BUILD-only under delay scenario
```

The underlying score components must be visible.

---

# 57. ML ANOMALY MODEL — EXACT MVP USE

Dataset features:

```text
production
energy_mwh
fuel_tonnes
emissions_tco2e
actual_gei
utilisation_pct
```

Model:

```text
IsolationForest(
    contamination=0.05,
    random_state=42
)
```

Do not train on the target or strategy result.

Output:

```text
anomaly_flag
anomaly_score
reason_codes
```

Reason codes are generated from deterministic feature checks, not invented by the model.

Example:

```text
anomaly_score = -0.31
reason = "GEI changed 22% while output changed only 2%."
```

For the recording, show this as **Data Quality Intelligence** rather than pretending it is a regulatory detector.

---

# 58. AI EXPLANATION LAYER

The safest implementation is a deterministic explanation template.

Template:

```text
Under the selected scenario, {strategy} ranks first because:

1. It produces {carbon_result}.
2. Its modelled three-year cost is {cost}.
3. Its compliance position is {gap_or_surplus}.
4. Its MRV readiness is {mrv_score}.
5. The result is most sensitive to {sensitivity_variable}.

This is analytical decision support based on the displayed assumptions.
```

A language model may polish this sentence, but the facts must come from structured calculated fields.

---

# 59. BACKEND ENGINE CONTRACTS

Every engine should be a pure service wherever possible.

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

optimizer.rank(results)
    -> StrategyRanking

anomaly_engine.flag(data)
    -> AnomalyResult
```

No engine should directly manipulate UI state.

---

# 60. FRONTEND STATE MODEL

Use one top-level state object:

```text
AppState
|
+-- entity
+-- sector
+-- regulatoryContext
+-- carbonPosition
+-- project
+-- mrv
+-- finance
+-- scenarios
+-- strategyRanking
+-- anomaly
+-- explanation
+-- sourceRegister
```

The dashboard reads from this state only.

---

# 61. NAVIGATION

Keep the UI to five main routes:

```text
/overview
/entity
/decision
/scenarios
/sources
```

## `/overview`

Portfolio/sector snapshot.

## `/entity`

Input and data validation.

## `/decision`

Carbon Financial Twin + BUY/BUILD/HYBRID.

## `/scenarios`

Interactive scenario analysis.

## `/sources`

Regulatory source and assumption register.

---

# 62. WHAT THE JUDGE SHOULD SEE IN 90 SECONDS

```text
0-10 sec
Select Cement + Synthetic Cement Unit 01

10-25 sec
Show emissions, GEI, target and carbon position

25-45 sec
Open project -> show CAPEX, reduction, MRV

45-65 sec
Compare BUY / BUILD / HYBRID

65-80 sec
Move CCC-price / project-delay slider

80-90 sec
Show recommendation + WHY + SOURCE + ASSUMPTION
```

The MVP should be recordable end-to-end without external web services.

---

# 63. TWO-DAY BUILD PLAN

## DAY 1 — FOUNDATION + CORE CALCULATION

### Block A

- repository;
- database;
- sector configs;
- regulatory target registry;
- synthetic dataset generator.

### Block B

- carbon engine;
- GEI calculation;
- surplus/shortfall calculation;
- project model;
- unit validation.

### Block C

- FastAPI endpoints;
- test suite;
- seed data;
- health endpoint.

### End-of-day requirement

The API must already be able to calculate one complete entity.

---

## DAY 2 — DECISION UI + WOW + HARDENING

### Block A

- dashboard shell;
- Carbon Position card;
- Decision Twin;
- strategy comparison.

### Block B

- scenario sliders;
- MRV readiness;
- anomaly indicator;
- explanation panel;
- source drawer.

### Block C

- error states;
- test pass;
- demo seed reset;
- final polish;
- local/offline demo verification.

### End-of-day requirement

A complete deterministic demo must run from clean startup with one command sequence.

---

# 64. THIRD DAY — RECORDING ONLY

Do not plan major code changes on the recording day.

Recording checklist:

```text
[ ] database seeded
[ ] backend health green
[ ] frontend loads
[ ] synthetic demo entity loads
[ ] calculation result reproducible
[ ] scenario sliders work
[ ] source drawer works
[ ] no console-breaking error
[ ] no network dependency required for core flow
[ ] browser zoom 100%
[ ] recording data reset
```

---

# 65. WHAT TO CUT FIRST IF TIME FAILS

Cut in this order:

```text
1. LLM natural-language polishing
2. advanced anomaly explanations
3. multi-year charts
4. secondary sectors' detailed project types
5. live market integration
6. Offset Mechanism workflow
7. bank mode
8. government mode
```

Never cut:

```text
Carbon calculation
Target mapping
BUY / BUILD / HYBRID
Scenario simulation
Explainability
Synthetic data consistency
```

---

# 66. WHAT MUST NEVER BE CUT

The following are the minimum judging differentiators:

```text
1. Current CCTS-sector selector
2. Carbon Position
3. Decision Twin
4. Scenario slider
5. Environmental + financial output
6. Source / assumption / calculation panel
```

Without these, CarbonAlpha becomes too close to a generic carbon dashboard.

---

# 67. SOURCE PANEL CONTENT

For every regulatory result display:

```text
Authority
Document
Publication date
Effective status
Rule version
URL
```

Example:

```text
Authority: Ministry of Environment, Forest and Climate Change
Document: Greenhouse Gases Emission Intensity Target (Amendment) Rules, 2025
Date: 13 Jan 2026
Status: official notification
Source:
https://egazette.gov.in/WriteReadData/2026/269375.pdf
```

---

# 68. CURRENT OFFICIAL SOURCES — MASTER REGISTER

## Indian Carbon Market / CCTS

[BEE — Indian Carbon Market](https://beeindia.gov.in/show_content.php?lang=1&level=1&lid=294&ls_id=116)

## Detailed Compliance Procedure

[BEE — Detailed Procedure for Compliance Mechanism under CCTS](https://beeindia.gov.in/sites/default/files/2024-07/Detailed%20Procedure%20for%20Compliance%20Procedure%20under%20CCTS.pdf)

## Offset Mechanism

[BEE — Detailed Procedure for Offset Mechanism](https://beeindia.gov.in/sites/default/files/Detailed%20Procedure%20for%20Offset%20Mechanism_CCTS.pdf)

## Current BEE methodologies

[BEE — Methodologies and Tools under Offset Mechanism](https://beeindia.gov.in/view_content.php?lang=1&lid=571)

## Energy Conservation Act

[India Code — Energy Conservation Act, 2001](https://www.indiacode.nic.in/handle/123456789/14657)

## Energy Conservation Act PDF / Section 14AA

[India Code PDF](https://www.indiacode.nic.in/bitstream/123456789/2003/1/A2001-52.pdf)

## GEI rules / amendments

[MoEFCC — Orders / Rules update](https://www.moef.gov.in/orders/update)

[13 Jan 2026 G.S.R. 25(E) Gazette](https://egazette.gov.in/WriteReadData/2026/269375.pdf)

## Current CCTS scale

[Ministry of Power — Lok Sabha answer, 12 Mar 2026](https://powermin.gov.in/sites/default/files/uploads/LS12032026_Eng_0.pdf)

## Indian Carbon Market Portal launch

[PIB — Prakriti 2026 / ICM Portal](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2243377&lang=1&reg=1)

## CERC CCC trading rules

[CERC — Current Regulations](https://cercind.gov.in/current_reg.html)

## CERC CCC consultation

[CERC — CCC stakeholder comments](https://cercind.gov.in/comments-CCC2024.html)

## DPDP Rules 2025

[MeitY — DPDP Rules 2025](https://www.meity.gov.in/documents/act-and-policies/digital-personal-data-protection-rules-2025-gDOxUjMtQWa)

---

# 69. CURRENT REGULATORY STATE — 19 AUGUST 2026

The following statements are safe for the MVP knowledge base:

### 1. The CCTS framework exists and is being operationalised.

Supported by BEE / Ministry of Power / Government communications.

### 2. Seven sectors have current notified GEI targets associated with 490 obligated entities.

Supported by the Ministry of Power's March 2026 parliamentary answer.

### 3. The current compliance mechanism is intensity-based.

Supported by BEE's CCTS framework and detailed procedure.

### 4. GEI targets are entity/sector-specific rather than a single universal percentage.

Supported by the target tables and framework.

### 5. CERC has a 2026 CCC purchase/sale regulation framework.

Supported by CERC.

### 6. Formal verification is separate from CarbonAlpha.

Supported by the CCTS MRV/ACV framework.

### 7. Regulatory data must be versioned.

Required as a design consequence of the evolving CCTS/GEI framework and current amendments/drafts.

---

# 70. STATUS OF IRON & STEEL FOR THE MVP

Do not add Iron & Steel to the seven current monitored sectors unless the current primary-source status used by the product is updated and verified.

There is an official June 2026 draft amendment covering Iron & Steel, and BEE's current CCTS page contains a stakeholder-comments item for an Iron & Steel amendment. This demonstrates active regulatory development, not by itself a blanket statement that Iron & Steel had identical final operative status to the seven-sector group.

**Sources:**
- [MoEFCC — June 2026 draft amendment](https://moef.gov.in/storage/tender/1783408897.pdf)
- [BEE — CCTS updates](https://beeindia.gov.in/show_content.php?lang=1&level=1&lid=294&ls_id=116)

For MVP:

```text
IRON_STEEL = WATCHLIST / FUTURE
```

---

# 71. STATUS OF FERTILISER FOR THE MVP

Fertiliser appears in BEE's broader nine-sector gradual-transition architecture. It should therefore be retained as a future/watchlist sector, not represented as a current identical seven-sector compliance member without a current final entity-specific target record.

**Source:**
[BEE — Indian Carbon Market](https://beeindia.gov.in/show_content.php?lang=1&level=1&lid=294&ls_id=116)

---

# 72. NO GENERIC GLOBAL CARBON-MARKET FORMULA

Do not import:

```text
EU ETS rules
Verra rules
Gold Standard rules
California ETS formulas
voluntary offset accounting rules
```

into the Indian CCTS engine unless explicitly used as a separate comparison module.

CarbonAlpha's MVP is India-specific.

---

# 73. NO FABRICATED MARKET DATA

Never seed:

```text
"CCC market price = ₹X"
```

unless it is clearly labelled:

```text
scenario assumption
```

The dataset should instead use:

```text
scenario_price = 1000
scenario_label = "Illustrative user assumption"
```

---

# 74. NO FABRICATED REGULATORY STATUS

Every regulatory state must be one of:

```text
FINAL
DRAFT
WATCHLIST
NOT_APPLICABLE
UNKNOWN
```

The application must not turn a draft notification into a final rule automatically.

---

# 75. NO FAKE METHODOLOGY MATCH

The system may say:

```text
Potentially relevant methodology:
BM IN02.001

Reason:
Industrial energy-efficiency / fuel-switching project.

Status:
Analytical mapping; formal eligibility not determined.
```

It must not say:

> "This project is approved for CCCs."

---

# 76. SECURITY — TWO-DAY MVP

Do not overbuild.

Minimum:

```text
environment variables for secrets
no API keys in frontend
server-side calculation endpoints
CORS restricted to frontend URL
input validation
basic error logging
no sensitive personal data in demo
synthetic demo data only
```

---

# 77. DATA PRIVACY — MVP

Use only synthetic data for the recording.

The DPDP framework should be acknowledged in project documentation where personal data could later be processed; the MVP should avoid personal data entirely.

**Primary source:**
[MeitY — DPDP Rules 2025](https://www.meity.gov.in/documents/act-and-policies/digital-personal-data-protection-rules-2025-gDOxUjMtQWa)

---

# 78. OBSERVABILITY

Every API response should be traceable with:

```text
request_id
entity_id
calculation_id
model_version
data_version
```

If a judge changes one value, the team should be able to reproduce the output.

---

# 79. LOGGING

Log:

```text
startup
API request
calculation
validation failure
scenario run
engine failure
source lookup failure
```

Do not log secrets or unnecessary personal data.

---

# 80. VERSION CONTROL

Use:

```text
main
feature/*
```

Commit after each stable milestone:

```text
chore: bootstrap project
feat: sector dataset
feat: carbon engine
feat: finance engine
feat: decision twin
feat: scenarios
feat: explainability
fix: validation
release: sih-mvp-v1
```

Tag the exact recording version:

```text
sih-mvp-v1.0.0-recording
```

---

# 81. CONFIGURATION MANAGEMENT

Never place these inside calculation functions:

```text
sector names
GEI target values
emission factors
source URLs
methodology IDs
scenario defaults
```

Put them in configuration/reference data.

---

# 82. RECOMMENDED CONFIGURATION OBJECT

```json
{
  "sector": "cement",
  "status": "current_monitored",
  "regulation": {
    "target_source": "https://...",
    "target_version": "2026-08",
    "baseline_year": "2023-24"
  },
  "units": {
    "output": "tonnes",
    "emissions": "tCO2e"
  },
  "features": {
    "buy": true,
    "build": true,
    "hybrid": true,
    "offset": false
  }
}
```

---

# 83. WHY THE MVP SHOULD NOT BE MICRO-SERVICE HEAVY

Two days is too short for unnecessary distributed complexity.

Use a **modular monolith**:

```text
FastAPI
 |
 +-- carbon module
 +-- regulatory module
 +-- finance module
 +-- scenario module
 +-- mrv module
 +-- ml module
```

Deploy as one backend service.

The modules remain isolated in code, allowing future separation if needed.

---

# 84. WHY THE FRONTEND SHOULD NOT DEPEND ON AI

The dashboard should work if:

```text
LLM = unavailable
ML = unavailable
external market API = unavailable
```

because the deterministic engines are the actual product.

The AI/ML features enhance the experience but do not determine the regulatory truth or financial arithmetic.

---

# 85. MVP BUILD ORDER — EXACT

```text
1. Seed current seven sector list
2. Build target/source registry
3. Build synthetic dataset generator
4. Build validation
5. Build emissions engine
6. Build GEI engine
7. Build surplus/shortfall engine
8. Build project financial engine
9. Build BUY model
10. Build BUILD model
11. Build HYBRID model
12. Build strategy ranking
13. Build MRV readiness
14. Build anomaly flag
15. Build dashboard
16. Build scenario sliders
17. Build explanation/source drawer
18. Test end-to-end
19. Freeze dataset
20. Record
```

---

# 86. MVP DEFINITION OF DONE

The MVP is DONE only when all statements below are true:

```text
[ ] Seven current monitored sectors appear correctly.
[ ] Synthetic data can be regenerated deterministically.
[ ] Regulatory target data has source metadata.
[ ] GEI calculation works.
[ ] Surplus/shortfall calculation works.
[ ] Project economics works.
[ ] BUY works.
[ ] BUILD works.
[ ] HYBRID works.
[ ] Scenario sliders update results.
[ ] MRV readiness is shown.
[ ] Optional anomaly flag is shown.
[ ] Every recommendation has an explanation.
[ ] Every regulatory result has a source.
[ ] Every scenario value is labelled as scenario data.
[ ] No fake CCC issuance is shown.
[ ] No live-market dependency exists for the core flow.
[ ] One full demo can be completed from clean startup.
[ ] A broken optional module does not break the core dashboard.
```

---

# 87. SIH PRESENTATION ALIGNMENT

The SIH template requires a maximum of six slides including the title slide and recommends points, diagrams, infographics and concise explanations.

**Source:** supplied SIH PDF, Slide 7.

The technical build should therefore produce visuals that can be extracted directly into the submission:

```text
SLIDE 1
Problem + CarbonAlpha title

SLIDE 2
Why + four core capabilities

SLIDE 3
Technical approach flowchart

SLIDE 4
Feasibility / challenges / safeguards

SLIDE 5
Impact / benefits

SLIDE 6
Research / references
```

The application should produce no UI element that cannot be explained in the SIH submission.

---

# 88. TECHNICAL APPROACH DIAGRAM FOR SIH

Use this as the final architecture graphic:

```text
              SYNTHETIC INDUSTRIAL DATA
                         |
                         v
                DATA VALIDATION LAYER
                         |
                         v
                 REGULATORY ENGINE
                         |
                         v
                 CARBON ENGINE
                         |
             +-----------+-----------+
             |                       |
             v                       v
         MRV ENGINE             FINANCE ENGINE
             |                       |
             +-----------+-----------+
                         |
                         v
                 SCENARIO ENGINE
                         |
                         v
                CAPITAL OPTIMIZER
                         |
              +----------+----------+
              |          |          |
              v          v          v
             BUY       BUILD      HYBRID
              |          |          |
              +----------+----------+
                         |
                         v
                EXPLAINABLE RESULT
                         |
                         v
             FINANCIAL + CLIMATE + RISK
```

---

# 89. DECISION LOGIC DIAGRAM

```text
                     COMPANY / FACILITY
                            |
                            v
                    PRODUCTION + EMISSIONS
                            |
                            v
                          GEI
                            |
                    +-------+-------+
                    |               |
                    v               v
              BELOW TARGET      ABOVE TARGET
                    |               |
                    v               v
            POTENTIAL SURPLUS   POTENTIAL GAP
                    |               |
                    +-------+-------+
                            |
                            v
                       PROJECT OPTIONS
                            |
                    +-------+-------+
                    |       |       |
                    v       v       v
                   BUY    BUILD   HYBRID
                    |       |       |
                    +-------+-------+
                            |
                            v
                    SCENARIO ANALYSIS
                            |
                            v
                    CAPITAL DECISION
```

---

# 90. FINAL SOURCE-OF-TRUTH RULES FOR THE TEAM

1. **Use the official current seven-sector government list for the MVP.**
2. **Keep target values in versioned reference data.**
3. **Use the official BEE compliance procedure for emission-data architecture.**
4. **Calculate carbon deterministically.**
5. **Use ML only for optional data-quality intelligence.**
6. **Use scenario analysis rather than unsupported CCC-price prediction.**
7. **Keep the core workflow operational without external APIs.**
8. **Keep official facts separate from synthetic/demo values.**
9. **Keep draft rules separate from final rules.**
10. **Keep potential CCC quantities separate from official issuance.**
11. **Keep CarbonAlpha outside formal regulatory authority.**
12. **Make every important result reproducible from input + rule version + model version.**

---

# 91. THE FINAL MVP ARCHITECTURE IN ONE PAGE

```text
                         CARBONALPHA SIH MVP

                              USER
                               |
                               v
                    +----------------------+
                    | SECTOR / ENTITY      |
                    | SELECTOR             |
                    +----------+-----------+
                               |
                               v
                    +----------------------+
                    | SYNTHETIC DATA       |
                    | / USER INPUT         |
                    +----------+-----------+
                               |
                               v
                    +----------------------+
                    | VALIDATION            |
                    +----------+-----------+
                               |
                               v
                    +----------------------+
                    | REGULATORY CONFIG     |
                    | TARGET + SOURCE       |
                    +----------+-----------+
                               |
                               v
                    +----------------------+
                    | CARBON ENGINE         |
                    | EMISSIONS -> GEI      |
                    +----------+-----------+
                               |
                               v
                    +----------------------+
                    | CARBON POSITION       |
                    | SURPLUS / SHORTFALL   |
                    +----------+-----------+
                               |
               +---------------+---------------+
               |                               |
               v                               v
     +-------------------+            +-------------------+
     | PROJECT / MRV     |            | FINANCIAL ENGINE  |
     | READINESS         |            | NPV / IRR / COST  |
     +---------+---------+            +---------+---------+
               |                                |
               +---------------+----------------+
                               |
                               v
                    +----------------------+
                    | SCENARIO ENGINE      |
                    | PRICE / OUTPUT /     |
                    | DELAY / RATE         |
                    +----------+-----------+
                               |
                               v
                    +----------------------+
                    | CAPITAL OPTIMIZER    |
                    +----------+-----------+
                               |
                 +-------------+-------------+
                 |             |             |
                 v             v             v
                BUY          BUILD         HYBRID
                 |             |             |
                 +-------------+-------------+
                               |
                               v
                    +----------------------+
                    | DECISION TWIN        |
                    +----------+-----------+
                               |
                   +-----------+-----------+
                   |           |           |
                   v           v           v
               FINANCIAL   CLIMATE      RISK
                   |           |           |
                   +-----------+-----------+
                               |
                               v
                    +----------------------+
                    | WHY / SOURCE /       |
                    | ASSUMPTION / RISK    |
                    +----------------------+
```

---

# 92. FINAL BUILD DECISION

For the two-day SIH prototype, **do not try to build a national carbon-market platform**.

Build a polished, internally consistent **Carbon Decision Twin** around one complete entity, while the architecture contains all seven current CCTS monitored sectors and the regulatory/source system is versioned.

The product should look broad because:

```text
7 sectors
1 shared engine
1 regulatory layer
1 financial layer
1 MRV layer
1 scenario engine
1 decision twin
```

It should be technically narrow because:

```text
1 synthetic demo entity
1 primary project
1 deterministic carbon calculation path
3 strategy choices
4 scenario variables
1 complete recommendation
```

That is the correct SIH-level trade-off between **breadth, credibility and finish quality**.

---

# 93. FINAL NORTH STAR

> **CarbonAlpha converts the current Indian carbon-market rules and industrial emissions data into a transparent decision model that lets an organisation test BUY, BUILD and HYBRID strategies and see their financial, environmental and risk consequences before committing capital.**

The SIH MVP should prove only that statement — completely, reproducibly and visibly.

---

# 94. REGULATORY / TECHNICAL DISCLAIMER

This document is a project-development reference for an SIH prototype. It is not legal advice, regulatory approval, verification, investment advice or a substitute for the current official notifications, procedures, methodologies, target tables and regulator instructions.

Whenever a current rule, target, methodology, market arrangement, factor or legal interpretation materially affects the MVP, check the linked primary source before freezing the release dataset.

**Last knowledge review:** 19 August 2026.
