# PART B — CARBONALPHA: FINAL ANTIGRAVITY MASTER UI/UX REDESIGN PROMPT
### (Copy-paste this whole document as your message to Antigravity, with the CarbonAlpha repo attached)

---

## ROLE

You are the design and engineering team redesigning CarbonAlpha India's presentation layer and reorganizing its information architecture and backend data organization. CarbonAlpha is an Indian industrial carbon-market (CCTS) decision-intelligence platform. This is a **redesign pass on an existing, working application** — inspect the current repository fully before changing anything. Do not destroy working calculation logic, API contracts, or data. You are changing how it looks, how it's organized, and how it feels — not what it calculates.

## NON-NEGOTIABLE DIRECTION

1. **Light mode, premium, institutional.** Move away from the current dark glass-panel theme entirely. The new baseline is a **light, high-contrast, credible, government-adjacent institutional look** — white/off-white surfaces, near-black text, a calm institutional primary color, restrained accenting. Not a SaaS dark dashboard. Not neon. Not glassmorphism-as-decoration.
2. **The interaction/motion mechanics come from SmartBloom.in's actual patterns** (verified, listed below) — reused as *mechanics*, not as SmartBloom's content, wording, or people.
3. **The credibility/formality layer comes from real Indian government digital-platform conventions** (GIGW-influenced): utility bar, breadcrumbs, visible source/version dates, restrained tricolor-adjacent accent, tabular density, formal header lockup. Do not use any actual Indian government emblem, seal, or Ashoka Chakra — evoke formality structurally, never by borrowing official government marks.
4. **Everything must be organized, not dense-and-messy.** Every screen must use **progressive disclosure**: a compact summary layer first, full data available on demand (expand/drill-in), never a wall of numbers. This applies to the frontend AND to the backend/data folder organization (see Backend Reorganization section).
5. **Real, purposeful imagery**, sourced properly (see Imagery section) — not fabricated, not random stock filler.

---

## 1. SMARTBLOOM-DERIVED MOTION SYSTEM (apply project-wide)

Implement these as reusable, named motion tokens/utilities — do not hand-roll animation per component.

| Token | Behavior | Where used |
|---|---|---|
| `reveal-on-scroll` | Fade + 12px upward slide, 450ms ease-out, staggered 60-80ms per sibling | Every section entrance on marketing pages and dashboard panel groups |
| `count-up` | Numeric value animates from 0 (or previous value) to target over ~1s ease-out when it first enters viewport, or immediately when a scenario slider changes it | All headline metrics: GEI, target, surplus/shortfall, NPV, IRR, peer percentile — this is the single most important motion pattern to carry over, and it doubles as a "this number just changed because of your input" cue on the scenario/decision pages |
| `card-hover-lift` | 2-4px translateY + shadow deepen + 150-200ms ease-out; on cards that carry a glass surface, add a very subtle 4-6% brightness/tint shift on hover (the "glassy highlight" the user asked for) — light mode glass means a soft frosted-white surface with a 1px hairline border and a subtle backdrop-blur, not a dark tinted panel | Feature cards, opportunity cards, source cards, sector-selector cards |
| `filter-tab-switch` | Active-tab underline/pill slides to new position (~200ms), grid content cross-fades (~250ms) rather than hard-cutting | Sector filters, methodology/status filters, opportunity-library filters — directly modeled on SmartBloom's achievements-page filter mechanic |
| `nav-link-hover` | Underline or color-shift, ~150ms | Header nav, breadcrumbs |
| `sticky-header-shrink` | Header height/shadow reduces slightly after ~40px scroll | Global header |
| `step-reveal` | Numbered step list reveals left-to-right or top-to-bottom on scroll, connected by a thin animated line that "draws" between steps | Onboarding flow explainer, "How CarbonAlpha Works" |
| `modal/drawer-transition` | Slide-in + fade, 250-300ms, backdrop fades in behind it | Source Trace Drawer, any modal |

All motion must respect `prefers-reduced-motion`: fall back to instant state changes (no count-up ramp, no slide, opacity-only or nothing) when set.

---

## 2. DESIGN SYSTEM / TOKENS

### Color (light mode)

```
--surface-base:      #FFFFFF
--surface-subtle:     #F6F8F7   (section backgrounds, alternating with white)
--surface-glass:       rgba(255,255,255,0.65)  with backdrop-blur(12px), border 1px rgba(15,23,20,0.08)
--text-primary:        #10231C   (near-black, slight green-black tint, not pure #000)
--text-secondary:      #4B5A54
--border-hairline:     #E4E9E6

--brand-primary:       #0B4A3D   (deep institutional green — climate/industrial credibility, government-adjacent)
--brand-primary-hover: #0E5C4C
--brand-accent:        #C9622A   (restrained saffron-adjacent burnt-amber — used ONLY for CTAs, active-state, and small accent moments, never as a background wash)
--tricolor-hint:        a 3px top utility-bar gradient or divider only, never a full section wash

--status-good:          #1F8A5F
--status-warning:       #C98A1E
--status-critical:      #C33B2E
--status-neutral-info:  #2E6BA8
```

Distinguish **OBSERVED vs. brand-new**: none of the above are copied from SmartBloom or any government site — they are original CarbonAlpha tokens designed to *feel* like the institutional class of site described in Part A, built from scratch.

### Typography

- Headings: a semi-formal, slightly geometric serif or slab (e.g. a Source Serif / Newsreader-class face) for the largest display headings only (hero, section titles) — nods to the "gazette/official document" heritage noted in Part A.
- Body/UI/data: a clean neutral sans (Inter or equivalent system sans) for everything else — labels, body copy, table data, forms.
- Numeric/metric display: tabular-figures enabled everywhere a number appears, so columns of financial/emissions data align.
- Scale: define explicit `display / h1 / h2 / h3 / body-lg / body / caption / metric-lg / metric-sm` sizes — no ad hoc font-sizing in components.

### Spacing, radius, shadow

- 8px base spacing scale (8/16/24/32/48/64/96).
- Radius: 12px for cards, 8px for buttons/inputs, 999px for pills/tags/filter-tabs.
- Shadow: two tiers only — `shadow-resting` (very soft, 1-2px blur, near-invisible) and `shadow-hover` (slightly deeper, used only on hover/focus) — no heavy drop shadows anywhere, this is a light institutional product, not a glossy SaaS.

### Breakpoints

1440 / 1280 / 1024 / 768 / 430 / 390 — design each major page's layout intentionally at each, don't just let a 3-column grid collapse to 1 column and call it responsive. Recompose: e.g. the Decision Twin's 3-way comparison becomes a swipeable/stacked card set on mobile, not a squeezed 3-column table.

### Accessibility

WCAG AA contrast minimum on every text/background pairing (check the amber/red status colors specifically against the white/off-white surfaces). Full keyboard navigation including scenario sliders (arrow-key adjustable, visible focus ring using `--brand-accent`). Semantic HTML landmarks, ARIA labels on icon-only buttons, form labels always visible (no placeholder-as-label), chart data available as an accessible table alternative, skip-to-content link in the header per the government-convention utility bar.

---

## 3. IMAGERY STRATEGY

**Do not fill the site with generic or fabricated stock photos, and do not fabricate "AI-generated industrial photos" and present them as real facilities.** Source real, properly licensed photography:

- Use royalty-free sources with clear commercial-use licenses (Unsplash, Pexels, Pixabay, or Google's licensed/Creative-Commons image search filtered to reusable images) for: Indian industrial facility exteriors, cement/steel/aluminium plant imagery, refinery infrastructure, renewable energy installations (solar/wind), industrial workers/control rooms, and clean data-center/analytics-adjacent imagery for the platform-feature sections.
- Attribute per the source license where required; keep a `docs/image-sources.md` provenance log (photographer/source/license/URL) exactly parallel to the data-provenance discipline already required for numeric data — images need traceability too.
- **Where to use imagery**: hero background (one strong, real, well-cropped industrial photograph, subtly overlaid — not filling the whole hero with unreadable-behind-text imagery), 2-3 supporting photos in the "why CarbonAlpha" / sector-overview sections, and small representative thumbnails on sector-selector cards (one per sector: aluminium, cement, chlor-alkali, pulp & paper, petrochemicals, refinery, textile). **Do not use imagery inside the dashboard/analysis screens** — those stay data-and-chart-only; photography belongs on the marketing/informational layer, not layered behind working numbers.
- Never depict a real, identifiable company's actual facility and label it as that company's data — imagery is illustrative of the *sector*, and must say so if there's any ambiguity.

---

## 4. INFORMATION ARCHITECTURE — REORGANIZED, NOT DENSE

Two layers, clearly separated in navigation:

**Public/informational layer** (light, marketing-credible): Home · Platform (how it works) · Sectors · Regulatory Sources · Contact.

**Application/workspace layer** (the actual tool, entered via a clear "Launch Platform" CTA): Overview (portfolio) · Facility Analysis (the onboarding + industrial-intelligence flow) · Carbon Position · Benchmarking · Opportunities · Decision Twin · Scenarios · Evidence Center (renamed, organized version of the current Sources page).

Apply progressive disclosure everywhere in the application layer:
- Every analysis screen leads with a **compact summary card** (3-5 headline numbers max, each following the WHAT / WHY / SO WHAT / WHAT NEXT structure from the earlier product spec), with a clear "View full breakdown" expand — the full source-stream-by-source-stream, factor-by-factor data lives behind that expand, not on the first screen.
- Tables replace walls of cards wherever data is naturally tabular (source streams, emission factors, project comparisons) — sortable, filterable (using the `filter-tab-switch` mechanic from SmartBloom), never an unstructured grid of 20 loose numbers.
- Use accordions for secondary detail (assumptions, methodology notes, calculation steps) rather than showing everything expanded by default.

---

## 5. BACKEND / DATA ORGANIZATION (this must also be decluttered, not just the UI)

Before restyling anything, Antigravity must:

1. **Resolve the duplicate `data/regulatory/` vs `data/regulatory_truth/` folders** — one source of truth only, with the other removed or given an explicit, code-enforced, documented role (see the earlier audit for detail).
2. **Reorganize `data/` into clearly named, single-purpose folders** with a short `README.md` in each explaining exactly what it contains, its update process, and whether its contents are REAL, SYNTHETIC, or SCENARIO — a newcomer should be able to open `data/` and understand the whole data model from the folder names and READMEs alone, without opening every JSON file.
3. **Consolidate the API response shape** so every endpoint returns the same predictable envelope (`success/data/errors/warnings/source_status`) and every numeric field is accompanied by its data-status label — this is what makes the frontend's "organized, not messy" requirement actually possible; a clean frontend cannot be built on an inconsistent API.
4. **Add a single `docs/data-dictionary.md`** listing every field, its unit, its data-status category, and its source — this becomes the reference the Evidence Center page renders from, so the UI's source panel is generated from one documented dictionary rather than hand-written per screen.

---

## 6. PAGE-BY-PAGE INSTRUCTIONS (apply the system above; keep this concise per page — reuse the tokens, don't reinvent per page)

- **Home**: utility bar (skip-link, contrast toggle) → formal header lockup with sticky-shrink → hero (real industrial photo + headline with one accent-colored word + one primary CTA, SmartBloom-style layered composition) → animated trust-stat counters (sectors covered, methodologies tracked, live-sourced regulatory records) → 4-up icon feature cards ("How It Works") → numbered step-reveal onboarding explainer → sector cards with representative imagery and hover-lift → Evidence/credibility strip (regulatory source icons+captions, SmartBloom tech-stack-row style) → footer.
- **Platform**: explains the engine (carbon/regulatory/MRV/finance/optimizer/scenario) as a step-reveal diagram, light and readable, no jargon walls.
- **Sectors**: filterable grid (current/watchlist tabs, SmartBloom achievements-page mechanic) of the 7 monitored + watchlist sectors, each card with sector imagery, current status badge (Final/Draft/Watchlist, sourced+dated), click-through to sector detail.
- **Evidence Center** (was Sources): tabbed/filterable register (by authority, status, sector) generated from the new data dictionary; every entry shows authority, document, date, version, status, link — table-first, not card-clutter.
- **Overview / Facility Analysis / Carbon Position / Benchmarking / Opportunities / Decision Twin / Scenarios**: apply the summary-card-first + expand-for-detail pattern throughout; Decision Twin gets a real comparative chart (not just three cards) using the light institutional palette; scenario sliders trigger `count-up` on every dependent number so the causality is visually obvious.

Every page needs designed empty, loading, and error states in this same light system (skeleton shimmer using `--surface-subtle`, not a blank white flash) — verify by loading each route with the backend killed.

---

## 7. FINAL QA (Antigravity must execute, not just claim)

Open every route at 1440/1024/768/390. Click every button, submit every form, trigger every filter tab, move every scenario slider, open every drawer/modal, test keyboard-only navigation end to end, test with `prefers-reduced-motion` on, test with backend down. Search the repo for `mock|dummy|placeholder|hardcoded|TODO|FIXME|fake|sample` and resolve or explicitly justify each hit. Confirm no dark-mode remnants leak through (stale CSS variables, unstyled components). Confirm every image has a provenance entry in `docs/image-sources.md`. Confirm the site does not use any official government emblem, seal, or Ashoka Chakra anywhere.

## 8. SELF-CRITIQUE BEFORE DONE

Does this look like a credible Indian institutional platform without impersonating one? Is every screen organized — summary first, detail on demand — with nothing dumped as a wall of numbers? Does the motion feel purposeful (SmartBloom-derived but restrained), not decorative? Would a CFO, a plant manager, and an SIH judge each immediately understand what they're looking at? Is imagery real, licensed, and used only where it adds credibility (never behind working data)? Is the backend as organized as the frontend now looks?
