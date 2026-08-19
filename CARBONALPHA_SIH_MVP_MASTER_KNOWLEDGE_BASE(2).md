# CARBONALPHA INDIA — SIH 2026 MVP MASTER KNOWLEDGE BASE

**Purpose:** Single source-of-reference document for designing, building, reviewing, demonstrating and documenting the CarbonAlpha India SIH 2026 MVP.

**Scope:** SIH-level MVP only. This document records the domain rules, regulatory context, laws, methodologies, sector scope, terminology, data-status rules, product boundaries, source hierarchy, MVP decision logic, verification notes, unresolved questions and change-control rules required to build the MVP without inventing regulatory or market facts.

**Knowledge snapshot:** 19 August 2026 (India, IST)

**Primary project source set:** The CarbonAlpha project documents and SIH submission PDF supplied in this conversation.

**External verification rule:** Indian primary sources control legal/regulatory claims. Secondary sources are used for cross-checking, context and competitor mapping only. A secondary source never overrides a primary source.

---

# 0. HOW TO USE THIS FILE

This file is the working reference for the MVP team. It is intentionally broader than the six-slide SIH submission, but narrower than a production enterprise compliance manual.

Use this file before implementing or changing any MVP decision logic.

### Evidence labels used in this document

- **SOURCE FACT** — directly supported by an identified official or supplied source.
- **PROJECT DECISION** — explicitly selected by the CarbonAlpha team/project brief.
- **MVP RULE** — a design/control rule required to keep the SIH prototype accurate.
- **INFERENCE** — logical consequence derived from verified facts; not itself a legal rule.
- **FUTURE** — deliberately outside the current MVP.
- **OPEN / VERIFY** — requires checking an updated primary source before implementation.

Do not silently convert an INFERENCE, PROJECT DECISION or FUTURE item into a SOURCE FACT.

---

# 1. PROJECT NORTH STAR

## 1.1 Current project definition

**CarbonAlpha India is a carbon-market decision-intelligence and capital-optimization platform that connects industrial/emissions data, Indian CCTS/GEI requirements, project/MRV readiness, carbon-market exposure and financial scenarios to support capital-allocation decisions.**

The project is **not** a generic carbon-credit marketplace, generic carbon calculator, blockchain registry, verification agency, regulator, exchange or autonomous lending system.

The core intellectual proposition in the supplied project material is:

> **Convert carbon-market complexity into capital-allocation decisions.**

The supplied project documents repeatedly frame CarbonAlpha as an intelligence layer connecting regulation, MRV/evidence, projects, market information and finance rather than replacing regulated infrastructure.

Source: [CarbonAlpha project concept — supplied document](https://beeindia.gov.in/) — project wording is from the supplied conversation material, not an official regulatory classification.

---

# 2. SIH MVP BOUNDARY

The supplied SIH PDF is the controlling source for the hackathon prototype scope.

The SIH PDF describes four visible MVP functions:

1. **Carbon Position Analysis** — emissions, carbon exposure and projected carbon gap.
2. **Build vs Buy vs Hybrid** — compare internal emission-reduction projects, carbon-credit purchase and hybrid strategy on cost, CO₂ impact, time and risk.
3. **Scenario Simulation** — vary carbon-credit price, project output, delays and similar assumptions.
4. **Risk & Consequence Analysis** — show financial and environmental consequences of each path.

Source: supplied SIH PDF, Slide 2. The PDF explicitly presents these as the proposed solution. The provided PDF also states that a prototype can use synthetic company/project data and predefined methodologies without depending on live market data.

### MVP principle

> **One complete, explainable decision loop is more important than breadth.**

Do not attempt to build the entire Indian Carbon Market for SIH.

---

# 3. MVP SECTOR SCOPE — PROJECT DECISION

The separate sector instruction supplied by the team specifies five sector folders:

```text
sectors/
│
├── cement/
│   ├── config.py
│   └── generator.py
│
├── steel/
│   ├── config.py
│   └── generator.py
│
├── refinery/
│   ├── config.py
│   └── generator.py
│
├── fertilizer/
│   ├── config.py
│   └── generator.py
│
└── ethanol/
    ├── config.py
    └── generator.py
```

### Current MVP monitoring status — PROJECT DECISION

| Sector | MVP status | Regulatory treatment inside the MVP |
|---|---|---|
| **Cement** | **Core monitored sector** | Model as current CCTS-relevant compliance sector; entity/facility applicability must still be checked against the current target source. |
| **Steel** | **Core monitored sector** | Core CarbonAlpha analytical sector, but do **not** assume the same final notified status as the seven currently notified CCTS sectors; maintain regulatory-watch/draft-status handling. |
| **Refinery** | **Core monitored sector** | Model as current CCTS-relevant compliance sector; entity/facility applicability must still be checked against the current target source. |
| **Fertilizer** | **Future prospect** | Do not present as current core CCTS compliance coverage unless a current final notification establishes that for the applicable entity. |
| **Ethanol** | **Future prospect** | Future project/sector extension; do not imply current CCTS compliance coverage or a dedicated current methodology without primary-source support. |

**Important:** The three-sector/two-future split is a **CarbonAlpha project decision** supplied separately by the team. The SIH PDF itself says CarbonAlpha analyses emissions across sectors but does not establish this ranking.

---

# 4. VERIFIED CURRENT CCTS SECTOR STATUS

As of the current verified source set, the first compliance-market group with final GEI targets consists of seven sectors:

1. Aluminium
2. Cement
3. Chlor-Alkali
4. Pulp & Paper
5. Petrochemicals
6. Petroleum Refinery
7. Textiles

Government sources and the World Bank/ICAP cross-check confirm approximately **490 obligated entities** across these seven sectors for the first compliance period, with targets using FY2023-24 as the baseline for FY2025-26 and FY2026-27.

### Primary / high-authority sources

- [Ministry of Power — Annual Report 2025-26](https://powermin.gov.in/sites/default/files/uploads/MOP_Annual_Report_Eng_2025_26.pdf)
- [Lok Sabha / Government of India — 2026 answer referencing seven sectors and 490 obligated entities](https://sansad.in/getFile/loksabhaquestions/annex/187/AU336_ZtyMhT.pdf?source=pqals)
- [ICAP — Indian Carbon Credit Trading Scheme](https://icapcarbonaction.com/en/ets/indian-carbon-credit-trading-scheme) — secondary/institutional cross-check
- [World Bank — India Compliance Mechanism Factsheet](https://carbonpricingdashboard.worldbank.org/compliance-factsheet/ETS_IN) — secondary/institutional cross-check

### MVP consequence

The system must never infer “current CCTS compliance” from sector name alone.

The correct chain is:

```text
SECTOR
  ↓
ENTITY
  ↓
FACILITY / INSTALLATION
  ↓
CURRENT TARGET / NOTIFICATION
  ↓
APPLICABILITY
  ↓
GEI TARGET
```

---

# 5. STEEL AND FERTILIZER — DO NOT OVERSTATE STATUS

## 5.1 Steel

MoEFCC/BEE records show movement toward adding Iron & Steel into the GEI-target architecture, but the 2026 material includes a **draft amendment** for Iron & Steel rather than evidence that it had already become identical in status to the seven-sector final-target group.

MoEFCC's current orders page (checked 19 August 2026) lists the **Greenhouse Gas Emission Intensity Target (Amendment) Rules, 2025** as an active stakeholder-comment item with the 26 June 2026 date. BEE separately lists a page item titled **Green House Gas Emission Intensity Target (Amendment) Rules, 2025 for Iron and Steel Sector**.

Sources:

- [MoEFCC — current orders / stakeholder consultation page](https://www.moef.gov.in/orders/update)
- [BEE — CCTS / Carbon Market information page](https://beeindia.gov.in/show_content.php?lang=1&level=1&lid=294&ls_id=116)

### MVP rule

Steel may be a core CarbonAlpha analytical sector because the team selected it, but any UI field describing its legal CCTS status must be driven by a versioned regulatory record.

Use labels such as:

- `CURRENT_FINAL_TARGET`
- `DRAFT_TARGET`
- `WATCHLIST`
- `ENTITY_SPECIFIC_VERIFY`

Do not use a simple permanent `CCTS = TRUE` flag for Steel.

## 5.2 Fertilizer

BEE describes fertilizer as part of the wider nine-sector gradual-transition architecture, but it must not be treated as having the same final operative status as the seven sectors with notified GEI targets unless the applicable final notification establishes that status.

### MVP rule

Fertilizer is **future prospect / regulatory watch**, not core compliance logic.

---

# 6. ENERGY CONSERVATION ACT, 2001

## Relevance to MVP

The Energy Conservation Act is the statutory foundation behind the Indian carbon-credit framework.

India Code lists **Section 14AA — Issuance of carbon credit certificate**.

Source: [India Code — Energy Conservation Act, 2001](https://www.indiacode.nic.in/handle/123456789/14657)

### Important project meaning

CarbonAlpha may analyse and support decisions around CCC-related exposure, but it is not the statutory issuer.

### MVP legal boundary

```text
LAW / AUTHORITY
      ↓
  OFFICIAL PROCESS
      ↓
CCC STATUS / ISSUANCE

CarbonAlpha
      ↓
ANALYTICS / DECISION SUPPORT
```

CarbonAlpha's internal calculations must never be visually or semantically presented as statutory issuance.

---

# 7. ENERGY CONSERVATION (AMENDMENT) ACT, 2022

The 2022 amendment introduced the legislative architecture needed for carbon-credit certificates and the Carbon Credit Trading Scheme.

### MVP use

Treat the amendment as the statutory basis for:

- carbon-credit certificate concept;
- carbon-credit trading scheme framework;
- related powers/functions of the Central Government/BEE.

### Source

- [BEE — Energy Conservation Amendment Act, 2022](https://beeindia.gov.in/sites/default/files/Energy2022.pdf)
- [India Code — Energy Conservation Act](https://www.indiacode.nic.in/handle/123456789/14657)

---

# 8. CARBON CREDIT TRADING SCHEME, 2023 — CCTS

## 8.1 Original notification

The Ministry of Power notified the **Carbon Credit Trading Scheme, 2023** through **S.O. 2825(E), 28 June 2023**.

Primary source:

- [Official Gazette — S.O. 2825(E), CCTS 2023](https://egazette.gov.in/WriteReadData/2023/246859.pdf)
- [BEE — CCTS / Carbon Market page](https://beeindia.gov.in/show_content.php?lang=1&level=1&lid=294&ls_id=116)

## 8.2 What the CCTS establishes

At a high level, the scheme establishes:

- Indian Carbon Market institutional architecture;
- National Steering Committee role;
- BEE administrator role;
- Registry role;
- CERC market-regulatory role;
- Accredited Carbon Verification Agency framework;
- CCC trading architecture;
- Compliance Mechanism;
- detailed-procedure mechanism.

Do not interpret these as saying CarbonAlpha performs any of these statutory functions.

---

# 9. CCTS AMENDMENT — OFFSET MECHANISM

The CCTS was amended by **S.O. 5369(E), 19 December 2023**.

The amendment introduced the **Offset Mechanism** for non-obligated entities.

Primary source:

- [Government of India / Ministry of Power — S.O. 5369(E)](https://powermin.gov.in/sites/default/files/uploads/Including_Offset_mechanism_under_CCTS_notification.pdf)

BEE's current Offset Procedure states that the CCTS has two mechanisms:

1. **Compliance Mechanism** — obligated entities meet notified GHG-emission-intensity targets.
2. **Offset Mechanism** — eligible non-obligated entities may register eligible activities for GHG emission reduction, avoidance or removal, subject to the applicable procedures and requirements.

Source:

- [BEE — Detailed Procedure for Offset Mechanism](https://beeindia.gov.in/sites/default/files/Detailed%20Procedure%20for%20Offset%20Mechanism_CCTS.pdf)

### MVP rule

Do not build a generic `carbon_credit_generator()` that assumes every project produces CCCs.

Instead the domain model must distinguish:

```text
COMPLIANCE PATHWAY
OFFSET PATHWAY
NO CURRENT CCC PATHWAY IDENTIFIED
REQUIRES HUMAN / REGULATORY REVIEW
```

---

# 10. COMPLIANCE MECHANISM — MVP REFERENCE

BEE published the **Detailed Procedure for Compliance Mechanism under CCTS**, Version 1.0, July 2024.

Source:

- [BEE — Detailed Procedure for Compliance Mechanism under CCTS, Version 1.0 July 2024](https://beeindia.gov.in/sites/default/files/2024-07/Detailed%20Procedure%20for%20Compliance%20Procedure%20under%20CCTS.pdf)

The procedure is the main operational reference for compliance-side MVP logic.

### MVP should use it for

- understanding target/obligation workflow;
- understanding entity/facility data requirements;
- understanding reporting/verification sequence;
- understanding where CarbonAlpha's analytics ends and official process begins.

### MVP should NOT attempt to reproduce

- full statutory compliance administration;
- official registry functions;
- official verification;
- official certificate issuance;
- exchange settlement.

---

# 11. GHG EMISSION INTENSITY — CORE CONCEPT

The CCTS compliance model is **intensity-based**, not a simple absolute-emissions cap.

A useful conceptual representation is:

```text
GHG EMISSIONS
      ÷
EQUIVALENT OUTPUT / PRODUCT
      =
GHG EMISSION INTENSITY (GEI)
```

The applicable target is an emissions-intensity target.

Primary/official framework sources:

- [MoEFCC / GEI Target Rules 2025](https://www.moef.gov.in/index.php/orders/update?archive=1)
- [BEE — Greenhouse Gases Emission Intensity Target Rules 2025](https://beeindia.gov.in/show_content.php?lang=1&level=1&lid=294&ls_id=116)
- [World Bank — India CCTS factsheet](https://carbonpricingdashboard.worldbank.org/compliance-factsheet/ETS_IN) — independent cross-check

### MVP consequence

The Carbon Position Engine should track at minimum:

- baseline period;
- output/product;
- GHG emissions;
- resulting GEI;
- applicable target;
- compliance year;
- direction of performance against target;
- resulting modelled carbon position.

### Do not use

```text
TOTAL EMISSIONS = REGULATORY ALLOWANCE
```

as the generic Indian CCTS model.

---

# 12. GEI TARGET RULES — 2025 + 2026 STATUS

The **Greenhouse Gases Emission Intensity Target Rules, 2025** were notified under the Environment (Protection) Act framework.

BEE's carbon-market page currently maintains the rules and related amendment materials.

Sources:

- [BEE — CCTS / GEI Target Rules](https://beeindia.gov.in/show_content.php?lang=1&level=1&lid=294&ls_id=116)
- [MoEFCC — current orders / GEI Target Rules and amendments](https://www.moef.gov.in/orders/update)
- [MoEFCC — archived orders / GEI Target Rules](https://moef.gov.in/index.php/orders/update?archive=1)

### Important 2026 change-control rule

The team must assume the GEI framework is **versioned and evolving**.

The MVP should store:

```text
RULE_ID
TARGET_VERSION
PUBLICATION_DATE
EFFECTIVE_DATE
ENTITY / SECTOR
BASELINE_PERIOD
COMPLIANCE_YEAR
TARGET_VALUE
SOURCE
STATUS
```

A rule update must not require rewriting core application logic.

---

# 13. CURRENT SECTOR/ENTITY TARGET PRINCIPLE

The current compliance targets are not simply “one target per corporate group”. They operate at the applicable regulated entity/facility/sub-sector level.

### MVP rule

Always maintain this distinction:

```text
CORPORATE GROUP
      ≠
LEGAL ENTITY
      ≠
FACILITY / INSTALLATION
      ≠
NOTIFIED OBLIGATED ENTITY
```

The system must not automatically infer a group-wide CCTS obligation because a company owns a facility in a covered sector.

---

# 14. CCTS INSTITUTIONAL MAP

```text
                    CENTRAL GOVERNMENT
                           │
                           ▼
                     CCTS / ICM POLICY
                           │
              ┌────────────┴────────────┐
              ▼                         ▼
      MINISTRY OF POWER              MoEFCC
              │                         │
              │                         └── GEI target rules
              ▼
             BEE
        CCTS Administrator
              │
       ┌──────┼─────────────┐
       │      │             │
       ▼      ▼             ▼
   PROCEDURE METHODOLOGY   ACVA FRAMEWORK
       │                    │
       │                    ▼
       │              VERIFICATION
       │
       ▼
GRID CONTROLLER / REGISTRY
       │
       ▼
       CCC STATUS / RECORD
       │
       ▼
      CERC
       │
       ▼
CCC TRADING REGULATION
       │
       ▼
POWER EXCHANGE INFRASTRUCTURE
```

### CarbonAlpha position

```text
                 REGULATED ECOSYSTEM
                         │
                         ▼
                 ┌───────────────┐
                 │  CARBONALPHA  │
                 │  INTELLIGENCE │
                 └───────────────┘
                         │
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
       CORPORATE       FINANCE       GOVERNMENT
```

CarbonAlpha is the analytical layer around the ecosystem, not the statutory ecosystem itself.

---

# 15. BEE — ROLE RELEVANT TO MVP

BEE is the central administrative body relevant to the CCTS implementation framework.

For the MVP, BEE is the primary source authority for:

- CCTS procedures;
- methodology publications;
- ACVA information;
- market framework information;
- relevant compliance/offset documentation.

Primary source:

- [BEE — Carbon Market / CCTS page](https://beeindia.gov.in/show_content.php?lang=1&level=1&lid=294&ls_id=116)

### MVP rule

When an internal model conflicts with a BEE-published current procedure, stop and review the rule/model mapping.

Do not “fix” the regulatory source to make the model work.

---

# 16. CERC — 2026 CCC TRADING REGULATIONS

CERC's current regulations register lists:

**Central Electricity Regulatory Commission (Terms and Conditions for Purchase and Sale of Carbon Credit Certificates) Regulations, 2026**

as Regulation No. 205, Gazette No. 292, with the current CERC register showing **27 April 2026** as the Gazette date in its current-regulations index.

Primary source:

- [CERC — Current Regulations](https://cercind.gov.in/current_reg.html)

The official CERC register is the canonical place to obtain the current gazette/notification associated with this regulation.

### High-level relevance

The 2026 regulations create the trading-side framework for CCCs and operate alongside the CCTS.

Secondary cross-checks also describe:

- compliance and offset market segments;
- Grid Controller of India as Registry;
- Power Exchange trading infrastructure;
- CERC oversight;
- price/market-surveillance mechanisms.

Use the CERC regulation itself as the legal source for any exact trading rule.

Do **not** hard-code a market price, trading frequency or exchange mechanism into the SIH MVP unless the exact current official source has been verified.

---

# 17. CARBON CREDIT CERTIFICATE (CCC) — TERMINOLOGY

The CCTS defines “carbon credit” as a value assigned to a GHG emission reduction, removal or avoidance and equivalent to one tonne of CO₂e in the scheme's defined framework.

Source:

- [Official Gazette — CCTS 2023, S.O. 2825(E)](https://egazette.gov.in/WriteReadData/2023/246859.pdf)

### MVP terminology rules

Use:

- **Carbon Credit Certificate (CCC)** when referring to the regulated certificate.
- **modelled carbon quantity / potential CCC quantity** for prototype calculations.
- **scenario carbon value** for user assumptions.

Do not use:

- “guaranteed carbon revenue”;
- “guaranteed future CCC”;
- “CarbonAlpha-issued CCC”;
- “verified by AI”.

---

# 18. OFFSET MECHANISM — INTEGRITY PRINCIPLES

BEE's Offset Mechanism procedure is built around integrity requirements including:

- robust governance;
- validation/verification;
- additionality;
- permanence;
- robust quantification;
- no double counting;
- methodology compliance;
- relevant documentation.

Primary source:

- [BEE — Detailed Procedure for Offset Mechanism](https://beeindia.gov.in/sites/default/files/Detailed%20Procedure%20for%20Offset%20Mechanism_CCTS.pdf)

### MVP consequence

CarbonAlpha should flag:

```text
MISSING BASELINE DATA
MISSING MONITORING DATA
METHODOLOGY MISMATCH
ADDITIONALITY REVIEW REQUIRED
DOUBLE-COUNTING RISK
VERIFICATION READINESS GAP
```

It should not certify that the requirement has been legally satisfied.

---

# 19. CURRENT BEE OFFSET METHODOLOGIES — VERIFIED LIST

**Important source discrepancy:** BEE has more than one web page displaying methodology information at different update dates. The page titled **“Methodologies and Tools under Offset Mechanism”**, last updated **07 July 2026**, currently lists **12 approved methodologies**. An older BEE page last updated 22 May 2026 lists the earlier eight-item set. For the MVP knowledge base, the later-dated BEE page is treated as the current methodology list, while the older page is retained in the discrepancy log.

Current source:

- [BEE — Methodologies and Tools under Offset Mechanism, updated 07 July 2026](https://beeindia.gov.in/view_content.php?lang=1&lid=571)

### Current 12 listed methodologies on the later-dated BEE page

| Code | Sector | Methodology |
|---|---|---|
| **BM EN01.001** | Energy | Grid-connected electricity generation from renewable sources |
| **BM EN01.002** | Energy | Hydrogen production from electrolysis of water |
| **BM IN02.001** | Industries | Energy efficiency and fuel switching measures for industrial facilities |
| **BM IN02.002** | Industries | Hydrogen production using methane extracted from biogas |
| **BM WA03.001** | Waste Handling and Disposal | Landfill methane recovery |
| **BM WA03.002** | Waste Handling and Disposal | Flaring or use of landfill gas |
| **BM AG04.001** | Agriculture | Methane recovery from livestock and manure management at households and small farms |
| **BM FR05.001** | Forestry | Afforestation and reforestation of degraded mangrove habitats |
| **BM FR05.002** | Forestry | Afforestation and reforestation of lands except wetlands |
| **BM AG04.002** | Agriculture | Emission reduction through improved management practices in rice cultivation |
| **BM WA03.003** | Waste Handling and Disposal | Production of Compressed Bio-gas (CBG) |
| **BM EN01.003** | Energy | Electricity and Heat Generation from Biomass |

Source: [BEE methodology page — 07 July 2026](https://beeindia.gov.in/view_content.php?lang=1&lid=571)

### Why this matters

The project must not permanently state “India has exactly 8 methodologies” or “India has exactly 12 methodologies” without a date/source qualifier.

Correct wording for the MVP documentation:

> **“BEE's later-dated methodology page, updated 07 July 2026, lists 12 approved Offset Mechanism methodologies. Earlier BEE pages displayed a smaller set. CarbonAlpha therefore treats methodology coverage as a version-controlled dataset rather than a hard-coded count.”**

---

# 20. CURRENT BEE APPROVED TOOLS

The same BEE methodology page lists approved tools, including tools for:

- baseline scenario/additionality;
- fossil fuel combustion emissions;
- electricity consumption/generation;
- flaring;
- gaseous mass flow;
- thermal/electric efficiency;
- anaerobic digesters;
- biomass;
- solid waste disposal;
- composting;
- allocation between main/co-products;
- remaining equipment lifetime;
- forestry-specific carbon-stock and non-CO₂ estimation.

Source:

- [BEE — Methodologies and Tools under Offset Mechanism](https://beeindia.gov.in/view_content.php?lang=1&lid=571)

### MVP rule

Do not implement every BEE tool.

The MVP should implement only the methodology/tool path actually selected for the chosen demonstration sector/project.

---

# 21. METHODOLOGY-DRIVEN PROJECT LOGIC

The correct project pipeline is:

```text
PROJECT
  ↓
ACTIVITY DESCRIPTION
  ↓
PROJECT TYPE
  ↓
METHODOLOGY SEARCH
  ↓
POTENTIAL METHODOLOGY MATCH
  ↓
ELIGIBILITY / EXCLUSION REVIEW
  ↓
BASELINE REQUIREMENTS
  ↓
MONITORING REQUIREMENTS
  ↓
MRV READINESS
  ↓
MODELLED EMISSION IMPACT
  ↓
POTENTIAL CARBON-MARKET OUTCOME
```

The output must say **“potentially aligned”**, **“requires review”**, etc., rather than “approved”.

---

# 22. ACCREDITED CARBON VERIFICATION AGENCIES (ACVAs)

BEE maintains a current list of Accredited Carbon Verification Agencies and stakeholder-comment processes for provisionally eligible agencies.

Primary source:

- [BEE — Carbon Market / ACVA information](https://beeindia.gov.in/view_content.php?lang=1&lid=568)

### MVP role

CarbonAlpha can model:

- verification readiness;
- required evidence;
- verification risk;
- possible verifier workflow.

CarbonAlpha must not state that its own analysis constitutes formal validation or verification.

---

# 23. MRV — MVP DEFINITION

**MRV = Measurement, Reporting and Verification.**

For CarbonAlpha MVP purposes:

### Measurement

Capture or model relevant activity/emissions variables.

### Reporting

Create structured evidence and reporting records.

### Verification

Treat external accredited verification as an outside authority/process.

### Recommended internal status states

```text
NOT STARTED
↓
DATA COLLECTED
↓
EVIDENCE PARTIAL
↓
EVIDENCE COMPLETE
↓
METHODOLOGY MAPPED
↓
READINESS ASSESSED
↓
FORMAL VERIFICATION EXTERNAL
```

Do not create a status called `VERIFIED_BY_CARBONALPHA`.

---

# 24. CARBON POSITION ENGINE

## Inputs

- production/output;
- GHG emissions;
- energy/fuel activity;
- applicable GEI target;
- baseline period;
- compliance year;
- expected project impact;
- project timing;
- user-defined scenario assumptions.

## Outputs

- GEI;
- target comparison;
- modelled surplus/shortfall;
- potential carbon exposure;
- scenario sensitivity.

### Important distinction

```text
OFFICIAL TARGET
       ≠
CARBONALPHA CALCULATION
       ≠
MODELLED FUTURE POSITION
       ≠
OFFICIAL CCC ISSUANCE
```

---

# 25. BUY VS BUILD VS HYBRID — MVP DECISION ENGINE

## BUY

Model the economic consequence of acquiring required CCCs **under a user-defined or verified market-data scenario**.

Do not imply current live market liquidity if no official market data is available.

## BUILD

Model an internal decarbonisation investment:

- CAPEX;
- OPEX;
- financing cost;
- energy savings;
- emissions effect;
- time to implementation;
- MRV/verification costs where relevant;
- scenario carbon value.

## HYBRID

Combine internal reduction and CCC procurement under the modelled scenario.

### Decision formula — conceptual

```text
STRATEGY COST
+
ENVIRONMENTAL OUTCOME
+
TIME
+
MRV / VERIFICATION RISK
+
REGULATORY EXPOSURE
+
SCENARIO SENSITIVITY
        ↓
RISK-ADJUSTED DECISION SUPPORT
```

This is an analytical framework, not an official CCTS decision rule.

---

# 26. CARBON FINANCIAL TWIN

**Project concept — not a regulatory term.**

The Carbon Financial Twin connects:

```text
PHYSICAL ACTIVITY
      ↓
OUTPUT / PRODUCTION
      ↓
EMISSIONS
      ↓
GEI / CARBON POSITION
      ↓
PROJECTS / ABATEMENT
      ↓
MRV READINESS
      ↓
CARBON-MARKET PATHWAY
      ↓
FINANCIAL CONSEQUENCE
```

This is the central shared object connecting CarbonAlpha's climate and FinTech layers.

---

# 27. CARBON VALUE LEAKAGE

**Project concept — not an official Indian regulatory term.**

Definition for CarbonAlpha:

> Potential environmental or financial value that may not be realised because of inadequate data, MRV gaps, methodology mismatch, project design, timing, regulatory uncertainty, market exposure or inefficient capital allocation.

### Examples

```text
DATA GAP
  ↓
EVIDENCE WEAK
  ↓
MRV READINESS FALLS
  ↓
PROJECT DELAY / REWORK RISK
  ↓
ECONOMIC VALUE AT RISK
```

The UI must call this a **CarbonAlpha analytical concept**.

---

# 28. CARBON DECISION GRAPH

**Project architecture / long-term moat — not a government system.**

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
PROJECT TYPE
 ↓
DATA REQUIREMENT
 ↓
MRV REQUIREMENT
 ↓
MODELLED OUTPUT
 ↓
CARBON POSITION
 ↓
FINANCIAL CONSEQUENCE
 ↓
DECISION
 ↓
ACTUAL OUTCOME
```

The purpose is to make the system explainable and progressively more useful as legitimate longitudinal data accumulates.

---

# 29. FINANCIAL MODELLING — MVP DOCUMENTATION

The financial engine is a decision-support model, not a valuation authority.

## Standard metrics

### NPV

```text
NPV = Σ [Cash Flow(t) / (1 + r)^t] − Initial Investment
```

### IRR

Discount rate at which NPV equals zero.

### Payback

Time required for cumulative net cash impact to recover the relevant initial investment under the selected assumptions.

### Carbon-adjusted project economics

Conceptually:

```text
Operational Cash Flow
+
Energy / Operating Savings
+
Eligible / Scenario Carbon Value
−
CAPEX / OPEX / Financing / Carbon-related Costs
=
Carbon-adjusted Project Cash Flow
```

### Critical rule

Carbon value must be marked as:

- official/observed market data, if actually obtained from a valid source; or
- user-defined scenario; or
- model estimate.

Never label scenario value as guaranteed revenue.

---

# 30. MARKET PRICE DATA — NO FABRICATION RULE

At the current MVP stage, the project must not fabricate historical CCC market prices, volumes or spreads.

The SIH prototype can use user-defined scenario inputs precisely because the supplied feasibility slide states that the complete workflow can be demonstrated without dependence on live market data.

### Allowed labels

```text
OBSERVED MARKET DATA
SOURCE-VERIFIED MARKET DATA
USER-DEFINED SCENARIO
MODEL ESTIMATE
ILLUSTRATIVE VALUE
```

### Forbidden labels for invented values

```text
CURRENT MARKET PRICE
OFFICIAL CCC PRICE
LIVE MARKET VALUE
GUARANTEED FUTURE PRICE
```

unless the underlying source actually supports that statement.

---

# 31. SCENARIO ENGINE

The SIH MVP should support scenario variation at minimum for:

- CCC price assumption;
- project output;
- project implementation delay;
- energy savings;
- project CAPEX/OPEX;
- expected reduction;
- relevant financial assumption.

Example:

```text
BASE CASE
   ↓
PROJECT OUTPUT = 100%

STRESS CASE
   ↓
PROJECT OUTPUT = 85%

COMPARE
   ↓
EMISSIONS
CCC POSITION
PROJECT CASH FLOW
NPV
IRR
STRATEGY RANKING
```

A scenario is not a forecast unless the model and evidence justify that description.

---

# 32. RISK ENGINE

The MVP can expose a simple decomposed risk profile.

### Risk categories

| Risk | MVP meaning |
|---|---|
| Regulatory risk | Applicability/rule uncertainty or change |
| Methodology risk | Project assumptions may not align with methodology |
| MRV risk | Evidence/data insufficiency |
| Verification risk | External verification delay/adverse finding risk |
| Project execution risk | Project may not deliver as assumed |
| Carbon-volume risk | Actual eligible/realised carbon outcome may differ |
| Market-price risk | Scenario value may change |
| Timing risk | Project/verification/availability timing mismatch |
| Data-quality risk | Input reliability/completeness |
| Model risk | Outcome sensitive to assumptions/model limitations |

### Score label

If the MVP shows a composite score, use:

> **“CarbonAlpha proprietary analytical score — not an official CCTS, CERC, BEE, credit or investment rating.”**

---

# 33. TRUST PACK — REQUIRED FOR EVERY IMPORTANT RECOMMENDATION

Every material recommendation should contain:

```text
RECOMMENDATION

WHY
SOURCE
CALCULATION
ASSUMPTION
RISK
DATA STATUS
RULE VERSION
METHODOLOGY VERSION
REVIEW OWNER
```

Example:

```text
Recommendation: HYBRID

Why:
Lowest modelled three-year cost under the selected scenario while meeting
                 the modelled environmental objective.

Source:
Applicable official rule/procedure references.

Calculation:
Project economics + scenario CCC procurement.

Assumption:
CCC price = user-entered scenario.

Risk:
Project delay materially changes the result.

Status:
MODEL OUTPUT — NOT REGULATORY DETERMINATION.
```

---

# 34. DATA STATUS MODEL

Every important value in the MVP should have one status:

```text
FACT
INPUT
CALCULATION
MODEL
SCENARIO
RECOMMENDATION
```

### FACT

Source-backed information from an authoritative source.

### INPUT

User/synthetic/company-provided value.

### CALCULATION

Deterministic output from known inputs.

### MODEL

AI/statistical/modelled output.

### SCENARIO

Assumption chosen for sensitivity analysis.

### RECOMMENDATION

Decision-support result based on the above.

Never blend these labels.

---

# 35. SYNTHETIC DATA POLICY

The SIH MVP should use **synthetic company/project data** unless actual data is legally available and appropriate.

The supplied SIH document explicitly recommends a synthetic company scenario so the team does not imply possession of confidential corporate information.

### Synthetic data label

Every synthetic record should carry:

```text
DATA_STATUS = SYNTHETIC
```

Example company:

```text
Company: ABC Industrial Ltd. — Synthetic
Sector: Cement / Steel / Refinery
Facility: Synthetic Facility 01
```

Do not use the public name of a real company and then silently fill missing values with invented numbers.

---

# 36. PUBLIC COMPANY EXAMPLES — HOW TO USE THEM

Real company names may be used as:

- market/industry examples;
- publicly documented case references;
- sector examples;
- competitor/customer research.

They must not be used as the source of invented operating data.

For the demo, use a synthetic company.

---

# 37. GOVERNMENT MODE — MVP DEFINITION

Government/public-sector use is a future-facing deployment mode, but its conceptual logic is part of the project vision.

Potential outputs:

- project pipeline;
- project readiness;
- environmental impact;
- capital requirement;
- MRV gap;
- climate-finance prioritisation.

Flow:

```text
PUBLIC PROGRAMME
       ↓
PROJECT PIPELINE
       ↓
IMPACT + READINESS
       ↓
CAPITAL REQUIREMENT
       ↓
RISK / MRV
       ↓
PRIORITISATION
```

The platform provides analytics; the government remains the decision-maker.

---

# 38. PRIVATE ENTERPRISE MODE — MVP CORE

The strongest MVP persona is a corporate/sustainability/finance user.

### Questions CarbonAlpha must answer

1. What is my modelled carbon position?
2. What is my projected gap/surplus under the selected target scenario?
3. What decarbonisation project could change it?
4. What evidence/MRV gaps exist?
5. What is the project economics?
6. What is the Buy vs Build vs Hybrid result?
7. How does the result change under stress scenarios?
8. Why did the engine recommend the selected strategy?

---

# 39. BANK / NBFC MODE — FUTURE EXTENSION

CarbonAlpha can provide analytical project intelligence to a bank/NBFC.

Possible output:

**Carbon Finance Readiness — Analytical Assessment**

Dimensions:

- technology;
- CAPEX;
- energy savings;
- emissions effect;
- methodology pathway;
- MRV readiness;
- verification risk;
- carbon-value sensitivity;
- projected cash flow;
- debt-service sensitivity.

### Hard boundary

CarbonAlpha does not approve/reject a loan in the SIH MVP.

The bank remains the credit decision-maker.

---

# 40. GREEN FINANCE / RBI — FUTURE REFERENCE

RBI's Green Deposit framework is relevant to financial institutions' green-finance processes, but it is **not a core SIH CCTS function**.

Source:

- [RBI — Green Deposits FAQs](https://rbi.org.in/Scripts/FAQView.aspx?Id=161)

### MVP treatment

Reference only. No green-deposit compliance workflow in the SIH MVP.

---

# 41. PERSONAL DATA / DPDP — MVP REFERENCE

The Digital Personal Data Protection Act, 2023 and the Digital Personal Data Protection Rules, 2025 are relevant where CarbonAlpha processes digital personal data.

Official sources:

- [MeitY — DPDP Act / documents](https://www.meity.gov.in/documents/act-and-policies/digital-personal-data-protection-act-2023)
- [MeitY — DPDP Rules 2025](https://www.meity.gov.in/documents/act-and-policies/digital-personal-data-protection-rules-2025-gDOxUjMtQWa?pageTitle=Digital-Personal-Data-Protection-Rules-2025.pdf)

### MVP treatment

Prefer synthetic/non-personal industrial data.

Implement basic privacy controls in the architecture, but do not claim enterprise DPDP compliance on the basis of an SIH prototype.

---

# 42. GREEN CREDIT PROGRAMME — DO NOT CONFLATE WITH CCC

Green Credit under the Green Credit Programme is a separate environmental-credit mechanism.

### MVP rule

```text
CARBON CREDIT CERTIFICATE (CCC)
        ≠
GREEN CREDIT
```

Do not mix the two in the same asset field.

Official reference:

- [MoEFCC — Green Credit / Environment-related documents](https://www.moef.gov.in/)

---

# 43. TAX — OUT OF SCOPE FOR SIH MVP

Section 115BBG of the Income-tax Act contains a special tax provision for income from transfer of carbon credits as defined under that section.

Official source:

- [Income Tax Department — Section 115BBG](https://www.incometaxindia.gov.in/w/section-115bbg-11)

### MVP rule

Do not build tax calculations into the MVP.

If mentioned, label as:

> **Future transaction/tax analysis — requires instrument- and transaction-specific tax review.**

Do not assume that every future CCC-related transaction automatically has identical tax treatment.

---

# 44. COMPETITIVE LANDSCAPE — WHAT WE CAN CLAIM SAFELY

The project materials identify existing categories including:

- BEE / government infrastructure;
- Grid Controller of India / registry;
- CERC;
- power exchanges;
- MRV / carbon-accounting companies;
- project developers;
- carbon-finance businesses;
- consulting/professional services;
- ERP/enterprise software.

Examples researched in the project material include Hertzwave TerraCAP, TerraFirst, EKI Energy, Sylithe, EcoNidhi and CarbonKhet.

### Safe competitive statement

> **Existing participants already cover meaningful parts of the carbon-market value chain. CarbonAlpha's proposed differentiation is to connect those outputs into a decision and capital-allocation layer.**

### Unsafe statement

> “No one else does this.”

The latter cannot be supported.

---

# 45. COMPETITOR SOURCE INDEX

Use competitor websites only for their own publicly stated capabilities; do not treat them as regulatory sources.

- [Hertzwave / TerraCAP](https://hertzwave.in/)
- [TerraFirst](https://www.terrafirst.io/)
- [EKI Energy](https://enkingint.org/)
- [Sylithe](https://sylithe.com/)
- [EcoNidhi](https://econidhi.com/)
- [CarbonKhet](https://www.carbonkhet.com/)

### Competitive interpretation

| Category | What it generally provides | CarbonAlpha MVP response |
|---|---|---|
| Regulatory infrastructure | rules / registry / market architecture | use and map authoritative data |
| Carbon accounting | emissions/accounting | do not become a generic calculator |
| dMRV | evidence and project monitoring | use MRV as an input to decision analysis |
| Project development | build/supply projects | compare project economics neutrally |
| Carbon finance | financing / offtake | provide pre-deployment decision intelligence |
| Exchange | trading infrastructure | no exchange duplication |
| Consulting | advice | automate repeatable analytical workflows |

---

# 46. CARBONALPHA MVP = DECISION ENGINE, NOT MARKETPLACE

### Existing transaction model

```text
BUYER  ↔  SELLER
```

### CarbonAlpha model

```text
REGULATION
    +
PROJECT
    +
MRV
    +
CARBON POSITION
    +
FINANCE
    +
RISK
    +
SCENARIO
    ↓
DECISION
```

The MVP should therefore be judged on the quality of the decision workflow, not on how many marketplace functions it can imitate.

---

# 47. SIH DEMONSTRATION — RECOMMENDED FINAL FLOW

```text
┌──────────────────────────┐
│ 1. SELECT SECTOR         │
│ Cement / Steel / Refinery│
└────────────┬─────────────┘
             ↓
┌──────────────────────────┐
│ 2. LOAD SYNTHETIC ENTITY │
│ Facility + output        │
└────────────┬─────────────┘
             ↓
┌──────────────────────────┐
│ 3. CARBON POSITION       │
│ Emissions + GEI + target │
└────────────┬─────────────┘
             ↓
┌──────────────────────────┐
│ 4. PROJECT PIPELINE      │
│ Efficiency / fuel switch │
│ / selected intervention  │
└────────────┬─────────────┘
             ↓
┌──────────────────────────┐
│ 5. MRV READINESS         │
│ Evidence + methodology   │
└────────────┬─────────────┘
             ↓
┌──────────────────────────┐
│ 6. PROJECT ECONOMICS     │
│ CAPEX / OPEX / NPV / IRR│
└────────────┬─────────────┘
             ↓
      ┌──────┼──────┐
      ↓      ↓      ↓
     BUY   BUILD  HYBRID
      └──────┼──────┘
             ↓
┌──────────────────────────┐
│ 7. SCENARIO STRESS TEST  │
│ price / output / delay   │
└────────────┬─────────────┘
             ↓
┌──────────────────────────┐
│ 8. EXPLAINABLE RESULT    │
│ cost + climate + risk    │
│ + sources + assumptions  │
└──────────────────────────┘
```

---

# 48. SIH MVP DEMO DATA RULES

### Use

- synthetic industrial data;
- published methodology structures;
- official public regulatory information;
- clearly labelled user assumptions;
- deterministic calculations;
- scenario values.

### Do not use as facts

- fabricated CCC market prices;
- fabricated company performance;
- fabricated government decisions;
- fabricated issuance records;
- fabricated verification status;
- invented legal interpretations.

---

# 49. MVP OUTPUT LANGUAGE RULES

### Use

- “modelled”;
- “estimated”;
- “potential”; 
- “scenario”; 
- “appears aligned”; 
- “requires review”; 
- “analytical assessment”; 
- “decision support”.

### Avoid

- “approved” unless the source truly says approved;
- “verified” unless an external official verification record supports it;
- “guaranteed”;
- “certified by CarbonAlpha”;
- “official carbon price” for an internally entered value;
- “regulatory rating”.

---

# 50. REQUIRED EXPLAINABILITY OUTPUT

For every recommendation:

```text
DECISION
  ↓
WHY
  ↓
INPUTS
  ↓
ASSUMPTIONS
  ↓
CALCULATION
  ↓
REGULATORY SOURCE
  ↓
METHODOLOGY SOURCE
  ↓
RISK
  ↓
LIMITATIONS
```

The prototype should allow a reviewer to reproduce the decision from the displayed assumptions.

---

# 51. CORE MVP METRICS

The SIH submission asks for measurable outcomes. The project material identifies four categories.

## Environmental

- modelled tCO₂e reduction;
- modelled GEI/intensity improvement;
- project-level climate impact;
- evidence completeness.

## Technical

- regulatory-document extraction accuracy;
- methodology mapping accuracy;
- anomaly-detection precision/recall where implemented;
- data validation error rate;
- scenario/model error where measurable.

## Financial

- CAPEX;
- modelled carbon exposure;
- NPV;
- IRR;
- Buy-vs-Build cost difference;
- cost per tCO₂e.

## Governance

- evidence completeness;
- traceability;
- recommendation explainability;
- manual override rate.

Source: supplied SIH/MVP documentation.

---

# 52. MVP SUCCESS CRITERION

The most important MVP question is:

> **Can CarbonAlpha take a synthetic industrial case from raw operating/emissions information to an auditable BUY vs BUILD vs HYBRID decision without inventing facts?**

A prototype that does this reliably is stronger than a much larger system containing unverified regulatory or market claims.

---

# 53. CURRENT PROJECT ARCHITECTURE — NON-TECHNICAL MAP

```text
                    CARBONALPHA INDIA
                           │
                           ▼
                INDUSTRIAL / PROJECT FACTS
                           │
                           ▼
                REGULATORY APPLICABILITY
                           │
                           ▼
                    CARBON POSITION
                           │
                  ┌────────┴────────┐
                  ▼                 ▼
              PROJECT            MARKET
              OPTION             EXPOSURE
                  │                 │
                  ▼                 ▼
                 MRV             SCENARIO
                  │                 │
                  └────────┬────────┘
                           ▼
                  FINANCIAL MODEL
                           │
                           ▼
                  BUY / BUILD / HYBRID
                           │
                           ▼
                 RISK + CONSEQUENCES
                           │
                           ▼
                EXPLAINABLE DECISION
```

---

# 54. PRODUCT TERMINOLOGY — OFFICIAL VS PROPOSED

| Term | Status |
|---|---|
| CCTS | Official Indian regulatory term |
| Indian Carbon Market / ICM | Official policy/framework terminology |
| Carbon Credit Certificate / CCC | Official regulatory term |
| GEI | Official regulatory term |
| MRV | Established industry/regulatory concept |
| ACVA | Official CCTS verification terminology |
| Compliance Mechanism | Official CCTS mechanism |
| Offset Mechanism | Official CCTS mechanism |
| Carbon Financial Twin | CarbonAlpha proposed product concept |
| Carbon Value Leakage | CarbonAlpha proposed analytical concept |
| Carbon Decision Graph | CarbonAlpha proposed architectural concept |
| Carbon Treasury | Product positioning / financial-function concept |
| Carbon Finance Readiness | CarbonAlpha proposed analytical output |
| CarbonAlpha Risk Score | CarbonAlpha proposed model output; not a regulatory rating |

---

# 55. WHAT IS OUTSIDE THE SIH MVP

The following should remain future or non-core unless explicitly needed for the final demo:

- live exchange execution;
- official registry integration;
- official CCC issuance;
- independent verification;
- bank loan approval;
- securities/investment rating;
- insurance underwriting;
- automated trading;
- tax automation;
- consumer carbon-credit marketplace;
- NFT/tokenised carbon assets;
- national-scale market infrastructure;
- all possible CCTS methodologies;
- complete government workflow automation;
- live proprietary industrial data acquisition from confidential companies.

---

# 56. FIVE-SECTOR ROADMAP

```text
             CARBONALPHA SECTOR ROADMAP

          CURRENT MVP MONITORING
          ┌────────┬────────┬─────────┐
          │        │        │
        CEMENT    STEEL   REFINERY
          │        │        │
          └────────┴────────┘
                   │
                   ▼
             SHARED DECISION
                 ENGINE
                   │
          ┌────────┴────────┐
          ▼                 ▼
      FUTURE PROSPECTS   FUTURE PROSPECTS
          │                 │
      FERTILIZER          ETHANOL
```

### Critical interpretation

“Future prospect” means **not part of the first three-sector monitoring scope**, not “irrelevant forever”.

---

# 57. SECTOR CONFIGURATION RULE

Each sector must have a separate configuration, but legal applicability must be versioned.

Conceptual fields:

```text
sector_id
sector_name
monitoring_status
current_ccts_status
current_status_source
status_effective_date
status_review_date
applicable_subsector_rules
applicable_target_source
methodology_candidates
project_types
emission_sources
activity_data
output_unit
financial_levers
scenario_variables
```

This lets the team keep the project scope fixed while updating regulatory status independently.

---

# 58. FUTURE-PROOFING RULE

The MVP must never hard-code:

```text
IF sector == steel:
    ccts = true
```

Instead:

```text
sector
  ↓
regulatory registry
  ↓
current effective source
  ↓
applicability result
```

The same applies to:

- fertilizer;
- methodologies;
- target values;
- market parameters;
- ACVA status;
- reporting deadlines.

---

# 59. REGULATORY SOURCE HIERARCHY

Use this order when sources conflict.

## Tier 1 — Primary legal/regulatory

1. [India Code](https://www.indiacode.nic.in/)
2. [e-Gazette of India](https://egazette.gov.in/)
3. [Ministry of Power](https://powermin.gov.in/)
4. [Bureau of Energy Efficiency](https://beeindia.gov.in/)
5. [MoEFCC](https://moef.gov.in/)
6. [CERC](https://cercind.gov.in/)
7. [MeitY](https://www.meity.gov.in/) where digital-data rules are involved
8. [RBI](https://www.rbi.org.in/) where regulated-finance rules are involved
9. [SEBI](https://www.sebi.gov.in/) where securities/listed-company rules are involved
10. [Income Tax Department](https://www.incometax.gov.in/) where tax rules are involved

## Tier 2 — Official institutional explanation

- PIB
- Lok Sabha/Rajya Sabha official documents
- official government portals

## Tier 3 — Institutional/technical cross-check

- World Bank
- ICAP
- IEA / recognised technical institutions where relevant

## Tier 4 — Professional/market sources

- law firms;
- consultants;
- industry associations;
- market participants;
- news.

### Rule

Tier 4 may explain a rule but cannot replace the primary source for the legal statement.

---

# 60. CURRENT OFFICIAL SOURCE REGISTER

## Core legal/regulatory sources

### Energy Conservation Act

[India Code — Energy Conservation Act, 2001](https://www.indiacode.nic.in/handle/123456789/14657)

### Energy Conservation Amendment Act, 2022

[BEE — Energy Conservation Amendment Act 2022](https://beeindia.gov.in/sites/default/files/Energy2022.pdf)

### CCTS 2023

[Official Gazette — S.O. 2825(E)](https://egazette.gov.in/WriteReadData/2023/246859.pdf)

### CCTS Amendment / Offset Mechanism

[Ministry of Power — S.O. 5369(E)](https://powermin.gov.in/sites/default/files/uploads/Including_Offset_mechanism_under_CCTS_notification.pdf)

### CCTS administration / carbon market page

[BEE — Carbon Market / CCTS](https://beeindia.gov.in/show_content.php?lang=1&level=1&lid=294&ls_id=116)

### Compliance procedure

[BEE — Detailed Procedure for Compliance Mechanism under CCTS](https://beeindia.gov.in/sites/default/files/2024-07/Detailed%20Procedure%20for%20Compliance%20Procedure%20under%20CCTS.pdf)

### Offset procedure

[BEE — Detailed Procedure for Offset Mechanism](https://beeindia.gov.in/sites/default/files/Detailed%20Procedure%20for%20Offset%20Mechanism_CCTS.pdf)

### Current Offset methodologies and tools

[BEE — Methodologies and Tools under Offset Mechanism — updated 07 July 2026](https://beeindia.gov.in/view_content.php?lang=1&lid=571)

### ACVAs

[BEE — Accredited Carbon Verification Agency information](https://beeindia.gov.in/view_content.php?lang=1&lid=568)

### GEI Target Rules

[BEE — CCTS / GEI Target Rules](https://beeindia.gov.in/show_content.php?lang=1&level=1&lid=294&ls_id=116)

[MoEFCC — current orders](https://www.moef.gov.in/orders/update)

### CERC CCC trading regulations

[CERC — Current Regulations](https://cercind.gov.in/current_reg.html)

### Current government market information

[Ministry of Power](https://powermin.gov.in/)

[PIB — Government releases](https://www.pib.gov.in/)

### DPDP

[MeitY — Digital Personal Data Protection Act / documents](https://www.meity.gov.in/documents/act-and-policies/digital-personal-data-protection-act-2023)

[MeitY — DPDP Rules 2025](https://www.meity.gov.in/documents/act-and-policies/digital-personal-data-protection-rules-2025-gDOxUjMtQWa?pageTitle=Digital-Personal-Data-Protection-Rules-2025.pdf)

### RBI green-finance reference

[RBI — Green Deposits FAQ](https://rbi.org.in/Scripts/FAQView.aspx?Id=161)

### Income tax reference

[Income Tax Department — Section 115BBG](https://www.incometaxindia.gov.in/w/section-115bbg-11)

---

# 61. PROJECT-SUPPLIED SOURCES

The following are part of the CarbonAlpha project evidence set and should remain in the project repository:

- `Pasted text.txt` — broad CarbonAlpha concept / strategic analysis
- `Pasted markdown(5).md` — SH10 master project discussion document
- `Pasted markdown (2)(1).md` — SWOT / multi-perspective / strategic analysis
- `carbonalpha.pdf` / `carbonalpha(1).pdf` / `carbonalpha(2).pdf` — SIH idea submission template populated with CarbonAlpha content
- `sector's needed.jpeg` — five-sector folder structure and team-specified sector scope

The uploaded SIH PDF itself requires a maximum of six slides including the title slide, concise presentation, points/diagrams/infographics, use of the provided template, and PDF submission. It also says the technical approach slide should cover technology plus methodology/process/flowcharts/images/prototype. 

---

# 62. SIH SUBMISSION CONSTRAINTS — DO NOT CONFUSE WITH MVP REFERENCE DOCUMENT

The final submission PDF must stay within the SIH template constraints.

The SIH PDF states:

1. Maximum six slides including title slide.
2. Prefer points, diagrams, infographics and pictures over paragraphs.
3. Keep the explanation precise and easy to understand.
4. Idea should be unique and novel.
5. Use the provided template without changing the required idea-detail pointers.
6. Save and upload as PDF.

These constraints apply to the **submission**, not to this internal MVP knowledge base.

---

# 63. SIH PRESENTATION POSITIONING

### Do not say

> “We are building a carbon-credit platform.”

### Say

> **“We are building an Indian carbon-market decision-intelligence and capital-allocation layer.”**

### Strongest concise explanation

> **CarbonAlpha connects regulatory requirements, emissions/project information, MRV readiness and financial scenarios to show whether the company should reduce internally, buy CCCs, or use a hybrid strategy — and explains why.**

---

# 64. FINAL MVP ONE-LINER

> **CarbonAlpha helps an industrial organisation understand its modelled carbon position, evaluate decarbonisation options and compare BUY vs BUILD vs HYBRID under transparent financial, environmental, regulatory and risk assumptions.**

---

# 65. KNOWLEDGE / CLAIM CONTROL MATRIX

| Claim | What must be cited/verified |
|---|---|
| CCTS exists | CCTS Gazette / BEE |
| CCTS has Compliance + Offset mechanisms | CCTS 2023 + 2023 amendment / BEE Offset Procedure |
| BEE administrator role | CCTS / BEE |
| GEI target framework | MoEFCC/BEE rules |
| Current seven final compliance sectors | Government/target notifications |
| 490 obligated entities | Government source / annual report |
| Steel current final status | Must be checked against current final notification; do not infer from draft |
| Fertilizer current final status | Must be checked against current final notification |
| Current methodology list | Latest BEE methodology page |
| ACVA status | Current BEE ACVA register |
| CCC trading rules | Current CERC regulation |
| Market price | Actual market-data source or explicit scenario |
| Project eligibility | Applicable official methodology/procedure + external review where required |
| Verification | ACVA / official process |
| Tax | Income Tax primary source + transaction-specific review |
| DPDP | MeitY primary source |
| Green Credit | MoEFCC / separate programme |

---

# 66. DISCREPANCY REGISTER — KEEP THIS SECTION

## D1 — Methodology count discrepancy

### Older BEE page

BEE page updated 22 May 2026 lists an earlier eight-methodology set.

### Later BEE page

BEE methodology page updated 07 July 2026 lists **12** approved methodologies.

### MVP resolution

Use the later-dated BEE methodology page as the current working list, but keep methodology data versioned.

Sources:

- [BEE — current methodology/tools page, updated 07 July 2026](https://beeindia.gov.in/view_content.php?lang=1&lid=571)
- [BEE — older methodology page, updated 22 May 2026](https://beeindia.gov.in/show_content.php?lang=1&level=2&lid=640&ls_id=737)

## D2 — Steel status

### Evidence

Current seven-sector government coverage does not include Iron & Steel in the final-target list; MoEFCC/BEE show 2026 amendment activity for Iron & Steel.

### MVP resolution

Steel is a **team-selected core monitoring sector**, but legal status must be shown through a versioned regulatory-status record.

## D3 — Fertilizer status

### Evidence

Fertilizer appears in broader transition architecture, but the current final-target list for the first seven-sector compliance group does not include it.

### MVP resolution

Fertilizer = future prospect / regulatory watch.

## D4 — “October 2026” trading timeline

### Rule

Do not build the MVP around a guaranteed first-trading date. Use current CERC/BEE/official market-status information and scenario assumptions.

## D5 — Carbon price

No fabricated CCC price.

Use observed source data or scenario inputs.

---

# 67. CHANGE-CONTROL PROTOCOL FOR REGULATORY UPDATES

Every regulatory-data change should be recorded as:

```text
CHANGE ID
DATE CHECKED
SOURCE AUTHORITY
DOCUMENT TITLE
NOTIFICATION / REGULATION NUMBER
PUBLICATION DATE
EFFECTIVE DATE
WHAT CHANGED
SECTORS AFFECTED
MVP COMPONENT AFFECTED
ACTION REQUIRED
REVIEWER
NEXT REVIEW DATE
```

### Example

```text
CHANGE ID: REG-2026-08-01
SOURCE: BEE
TYPE: Methodology update
AFFECTED: Offset methodology registry
MVP ACTION: Update methodology metadata
MODEL ACTION: None unless methodology used by MVP
```

---

# 68. WEEKLY RESEARCH CHECKLIST DURING MVP BUILD

Before each major MVP release/checkpoint:

```text
[ ] BEE CCTS page checked
[ ] BEE methodology page checked
[ ] BEE ACVA page checked
[ ] MoEFCC GEI-rule page checked
[ ] CERC current regulations checked
[ ] Ministry of Power / PIB current CCTS update checked
[ ] Methodology count/version checked
[ ] Target-sector status checked
[ ] Steel/fertilizer status checked
[ ] No fabricated market price present
[ ] No invented regulatory approval present
[ ] All model assumptions labelled
[ ] All synthetic data labelled
[ ] Recommendation traceable to source + calculation
```

---

# 69. FINAL MVP REVIEW CHECKLIST

## Regulatory correctness

```text
[ ] No rule copied from an unofficial blog as primary authority
[ ] No draft treated as final
[ ] No old rule treated as current without checking version
[ ] Entity/facility status not inferred solely from sector
[ ] Methodology status has source + date
[ ] ACVA/verification not simulated as official
```

## Product correctness

```text
[ ] CarbonAlpha is positioned as decision intelligence
[ ] BUY/BUILD/HYBRID is functional
[ ] Scenario analysis changes outputs
[ ] Financial model is transparent
[ ] Environmental effect is visible
[ ] Regulatory context is visible
[ ] Risk is decomposed
[ ] Recommendation is explainable
```

## Data correctness

```text
[ ] Synthetic data clearly marked
[ ] User assumptions clearly marked
[ ] Market values source-labelled
[ ] No fake company data
[ ] No fake CCC price
[ ] No fake issuance
```

---

# 70. WHAT THE SIH MVP SHOULD DEMONSTRATE IN FRONT OF JUDGES

The ideal demonstration is not:

> “Look how many technologies we used.”

It is:

```text
INDUSTRIAL COMPANY
      ↓
WHAT IS ITS POSITION?
      ↓
WHAT CAN IT CHANGE?
      ↓
WHAT EVIDENCE IS REQUIRED?
      ↓
WHAT DOES IT COST?
      ↓
WHAT IF ASSUMPTIONS CHANGE?
      ↓
BUY / BUILD / HYBRID
      ↓
WHY?
```

That directly demonstrates the SIH problem, solution and measurable decision outcome.

---

# 71. FINAL BOUNDARY BETWEEN MVP AND FUTURE VISION

## SIH MVP

```text
Cement / Steel / Refinery
        ↓
Synthetic industrial data
        ↓
Carbon position
        ↓
One selected project path
        ↓
MRV readiness
        ↓
Financial model
        ↓
BUY / BUILD / HYBRID
        ↓
Scenario stress test
        ↓
Explainable result
```

## Future CarbonAlpha

```text
More sectors
        ↓
More methodologies
        ↓
Real enterprise data
        ↓
Government deployments
        ↓
Bank/NBFC APIs
        ↓
Market intelligence
        ↓
Longitudinal Carbon Decision Graph
```

Do not let the future roadmap contaminate the MVP with unverified or unnecessary capabilities.

---

# 72. FINAL PROJECT MAP

```text
                         CARBONALPHA INDIA
                               │
                               ▼
                  CLEAN & GREEN PROBLEM
                               │
                               ▼
             CARBON-MARKET DECISION PROBLEM
                               │
                               ▼
       ┌────────────────────────────────────────────┐
       │                                            │
       ▼                                            ▼
INDUSTRIAL DATA                              PROJECT DATA
       │                                            │
       └───────────────────┬────────────────────────┘
                           ▼
                 REGULATORY INTELLIGENCE
                           │
                           ▼
                  CARBON POSITION / GEI
                           │
                           ▼
                      MRV READINESS
                           │
                           ▼
                   PROJECT ECONOMICS
                           │
                           ▼
                    SCENARIO + RISK
                           │
                           ▼
                  BUY / BUILD / HYBRID
                           │
                           ▼
              FINANCIAL + CLIMATE RESULT
                           │
                           ▼
                  EXPLAINABLE DECISION
                           │
                           ▼
                CARBON DECISION GRAPH
```

---

# 73. FINAL STATEMENT OF INTENT

CarbonAlpha's SIH MVP should be built as a **small, rigorous decision system** sitting above the Indian carbon-market framework.

It should use the **current official regulatory state**, not assumptions about where the market will be.

It should use **synthetic data where real industrial data is unavailable**.

It should use **published methodologies where a methodology is required**.

It should distinguish **compliance, offset and ordinary project economics**.

It should distinguish **official facts, user inputs, calculations, model outputs and scenarios**.

It should treat **Cement, Steel and Refinery as the project's three monitored sectors**, with **Fertilizer and Ethanol as future prospects**, while independently tracking the legal status of each sector.

It should make the final recommendation **explainable, auditable and explicitly non-statutory**.

Most importantly:

> **The MVP is successful when it demonstrates that carbon-market complexity can be converted into a transparent capital-allocation decision without fabricating regulatory facts, market data or official outcomes.**

---

# 74. SOURCE INDEX — PRIMARY AND VERIFICATION LINKS

## Indian legal / regulatory primary

1. [India Code — Energy Conservation Act, 2001](https://www.indiacode.nic.in/handle/123456789/14657)
2. [e-Gazette — CCTS 2023, S.O. 2825(E)](https://egazette.gov.in/WriteReadData/2023/246859.pdf)
3. [Ministry of Power — CCTS Amendment / Offset Mechanism, S.O. 5369(E)](https://powermin.gov.in/sites/default/files/uploads/Including_Offset_mechanism_under_CCTS_notification.pdf)
4. [BEE — CCTS / Carbon Market](https://beeindia.gov.in/show_content.php?lang=1&level=1&lid=294&ls_id=116)
5. [BEE — Compliance Procedure, Version 1.0 July 2024](https://beeindia.gov.in/sites/default/files/2024-07/Detailed%20Procedure%20for%20Compliance%20Procedure%20under%20CCTS.pdf)
6. [BEE — Offset Procedure](https://beeindia.gov.in/sites/default/files/Detailed%20Procedure%20for%20Offset%20Mechanism_CCTS.pdf)
7. [BEE — Current Methodologies and Tools, updated 07 July 2026](https://beeindia.gov.in/view_content.php?lang=1&lid=571)
8. [BEE — ACVA information](https://beeindia.gov.in/view_content.php?lang=1&lid=568)
9. [CERC — Current Regulations](https://cercind.gov.in/current_reg.html)
10. [MoEFCC — Current orders / consultations](https://www.moef.gov.in/orders/update)
11. [MoEFCC — Archived orders](https://moef.gov.in/index.php/orders/update?archive=1)
12. [BEE — Carbon Market / GEI information](https://beeindia.gov.in/show_content.php?lang=1&level=1&lid=294&ls_id=116)
13. [Ministry of Power — Annual Report 2025-26](https://powermin.gov.in/sites/default/files/uploads/MOP_Annual_Report_Eng_2025_26.pdf)
14. [Lok Sabha / Government of India — CCTS seven-sector/490-entity answer](https://sansad.in/getFile/loksabhaquestions/annex/187/AU336_ZtyMhT.pdf?source=pqals)
15. [PIB — Government releases](https://www.pib.gov.in/)

## Other official sources relevant only when the MVP touches those subjects

16. [MeitY — DPDP Act / documents](https://www.meity.gov.in/documents/act-and-policies/digital-personal-data-protection-act-2023)
17. [MeitY — DPDP Rules 2025](https://www.meity.gov.in/documents/act-and-policies/digital-personal-data-protection-rules-2025-gDOxUjMtQWa?pageTitle=Digital-Personal-Data-Protection-Rules-2025.pdf)
18. [RBI — Green Deposits FAQ](https://rbi.org.in/Scripts/FAQView.aspx?Id=161)
19. [SEBI](https://www.sebi.gov.in/)
20. [Income Tax Department — Section 115BBG](https://www.incometaxindia.gov.in/w/section-115bbg-11)
21. [MoEFCC](https://moef.gov.in/)

## Independent institutional cross-checks

22. [World Bank — India CCTS factsheet](https://carbonpricingdashboard.worldbank.org/compliance-factsheet/ETS_IN)
23. [World Bank — State and Trends of Carbon Pricing 2026](https://documents1.worldbank.org/curated/en/099051826185087983/pdf/P502283-3ee8b1dc-6f1a-46dd-8141-e6534fd34af9.pdf)
24. [ICAP — Indian Carbon Credit Trading Scheme](https://icapcarbonaction.com/en/ets/indian-carbon-credit-trading-scheme)

## Competitor public sources

25. [Hertzwave / TerraCAP](https://hertzwave.in/)
26. [TerraFirst](https://www.terrafirst.io/)
27. [EKI Energy](https://enkingint.org/)
28. [Sylithe](https://sylithe.com/)
29. [EcoNidhi](https://econidhi.com/)
30. [CarbonKhet](https://www.carbonkhet.com/)

---

# 75. FINAL VERSION CONTROL

**Document name:** `CARBONALPHA_SIH_MVP_MASTER_KNOWLEDGE_BASE.md`

**Knowledge snapshot:** 19 August 2026

**Purpose:** SIH 2026 MVP development/reference only

**Regulatory-source policy:** Always re-check current primary source before changing legal/regulatory logic.

**Current critical watch items:**

1. BEE methodology page changes.
2. GEI target amendments.
3. Steel/fertilizer final notification status.
4. CERC CCC regulation amendments.
5. Current registry/market operational status.
6. Current ACVA accreditation status.
7. Official market-price availability.

**Do not delete the discrepancy register.**

**Do not hard-code dates, market prices, methodology counts or target values without source/version metadata.**

---

# END OF CARBONALPHA INDIA — SIH MVP MASTER KNOWLEDGE BASE
