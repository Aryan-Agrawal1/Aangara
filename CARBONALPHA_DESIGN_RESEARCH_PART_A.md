# PART A — DESIGN & INTERACTION RESEARCH

## A.1 What smartbloom.in actually is (verified by fetching both live pages)

Corrected framing up front, so the translation below is honest: smartbloom.in is a **two-page Bootstrap-template student project site** (an IoT cross-pollination robot project by three students, ITER/Siksha 'O' Anusandhan, Bhubaneswar) — `index.html` (one-page scrolling site) and `achieve.html` (a certificate gallery). It is **not** a government platform. It has no ministry-style navigation, no official color system, no public-sector information architecture. What it *does* have is a set of clean, competent, reusable **template interaction patterns** that are genuinely useful as raw mechanics — that's what we extract below. The "real government website" feel requested is layered on separately in A.3, from actual established Indian government digital-platform conventions, not from SmartBloom.

## A.2 SmartBloom — component & animation inventory (observed, from live fetch)

| Component | What it does | Mechanic worth reusing for CarbonAlpha |
|---|---|---|
| Sticky header nav | Logo left, anchor-link nav center/right, hamburger on mobile, plus a persistent floating chat-bubble icon bottom-corner | Sticky header with scroll-shrink (reduce height/shadow-in on scroll), keep a persistent bottom-corner "Ask CarbonAlpha" assistant bubble as an *optional* affordance (not a gimmick — ties to the Gemini explanation layer) |
| Hero | Large headline with one word in accent-italic, supporting paragraph, single primary CTA button, layered illustration/photo composition (robot + team photo + decorative flower graphics stacked with offset/parallax-style positioning) | Layered hero composition: real industrial photograph as base layer + a light abstract data/graph motif layered on top with slight offset — headline with one word emphasized in the accent color, one clear primary CTA ("Analyze Your Facility") |
| Icon feature cards (4-up) | Icon top, bold short title, 1-sentence description, white card on subtle background, gentle hover lift | Reuse directly for a "How CarbonAlpha Works" 4-up: Position → Benchmark → Opportunities → Decision |
| Animated stat counters | Numbers count up from 0 to target (84%, 88%, 94%, 94%) when scrolled into view, large bold numerals with small % label | Reuse for platform-level trust stats (e.g., "7 monitored sectors," "20+ decarbonisation pathways," "Live regulatory sourcing") — count-up-on-scroll-into-view is a strong, restrained motion pattern |
| Embedded video section | Full-width dark section, centered video player with custom play/skip controls | Reuse pattern for an optional "60-second walkthrough" demo video section on the marketing home page |
| Tech-stack icon row | Grid of small logo+label pairs on plain background, no cards, just icon+caption | Reuse for a "Built On" / "Regulatory Sources" row (BEE, MoEFCC, CERC references) — same restrained icon+caption treatment, not styled as ads |
| Numbered process steps (4-step) | Horizontal step list, bold number, title, one-line description, connected by a subtle line | Reuse directly for the onboarding flow explainer: Select Sector → Enter Facility Data → Get Carbon Position → Compare Decisions |
| "Impact" card carousel | Date badge, emoji/icon, bold headline with an embedded bold-stat mid-sentence, short paragraph, "Discover More" link, thumbnail image | Reuse as a "Regulatory & Market Update" feed pattern — but source it from the real, dated discrepancy-register/source-register data, not fabricated blog posts |
| Contact form | Simple two-column form (name/email + message), single labeled fields, one submit button | Reuse styling only; CarbonAlpha's equivalent is a "Request a Facility Assessment" or "Talk to the team" form |
| Team ("Crew Champion") cards | Square photo, name, role, four social icon links, hover reveal on icons | Structurally reusable for an **Advisory/Sources** section only if CarbonAlpha genuinely has named people to show — do not invent people; if none exist yet, skip this section rather than fabricate |
| Achievements page — filterable certificate grid | Tab filter bar (All / State / National / Year), grid of cards each with image, level+rank badge, title, host, description, month/year | This filter-tab + badge-grid mechanic is the single most useful transferable pattern: reuse it directly for CarbonAlpha's **Methodology/Source Register** (filter by sector, status: Final/Draft/Watchlist, authority) or the **Decarbonisation Opportunity library** (filter by sector, project type, CAPEX band) |

**Animation summary table** (trigger / effect / duration-feel / easing-feel / purpose):

| Element | Trigger | Animation | Feel | Purpose |
|---|---|---|---|---|
| Stat counters | Scroll into view | Count up 0→target | ~1.2s, ease-out | Draws attention to credibility numbers without being flashy |
| Feature/team cards | Hover | Slight lift + shadow deepen | ~150-200ms, ease-out | Signals interactivity, standard card affordance |
| Nav links | Hover | Underline/color shift | ~150ms | Standard wayfinding feedback |
| Section entrance | Scroll into view | Fade + slight upward slide | ~400-600ms, ease-out, staggered per element | Sequences content reveal down the page without being a "gimmick" |
| Filter tabs (achievements) | Click | Grid re-filters, likely with a fade/re-layout | fast, <300ms | Lets users narrow a dense grid without a page reload |

## A.3 The "real government website" layer — established Indian public-sector digital design conventions (general knowledge, not tied to one unseen site)

Since you want the *government-credible* feel specifically, the honest source for that isn't SmartBloom — it's the actual conventions most Indian government/PSU digital platforms converge on, largely shaped by **GIGW (Guidelines for Indian Government Websites)**, the STQC/NIC accessibility and design standard most ministries and PSU sites are built to:

- **Light, high-contrast base** — white/off-white surfaces, near-black text, restrained use of the national tricolor as *accent*, never as a loud background wash.
- **A calm institutional primary color** — most credible Indian gov/PSU sites lean into a **navy-to-deep-blue** or a **deep green** (ministry-of-environment-adjacent sites skew green) as the primary brand color, with saffron/orange reserved for small accent moments (a top utility bar, a divider, a CTA highlight) rather than dominating.
- **A visible utility bar above the main header** — skip-to-content link, font-size toggle (A- / A / A+), high-contrast mode toggle, language switch — a strong "this is official" signal even at small scale.
- **Breadcrumbs everywhere** below the header, and a persistent "last updated" / version date near regulatory content — both are strong credibility cues directly usable in CarbonAlpha's source panels.
- **Dense but tabular, not dense-and-cluttered** — content is information-rich but heavily organized into cards, tables, and accordions rather than long paragraphs; whitespace is used to separate *sections*, not to pad every element.
- **Restrained, functional iconography** — line icons, not illustrations, used sparingly next to labels, not as decoration.
- **Serif or semi-formal sans for headings** in many ministry sites (a nod to gazette/print heritage), a clean neutral sans (Noto Sans / system sans) for body copy — legible at small sizes, no display/script fonts.
- **Emblem/seal-style header lockup** — logo + full institutional name lockup in the header, not just a wordmark, reinforcing formality.

CarbonAlpha should borrow the **credibility mechanics** (utility bar cues, breadcrumbs, visible source/version dates, restrained tricolor-adjacent accenting, tabular density) without literally becoming a ministry site — it's a private analytics platform that wants to *feel* as trustworthy as one.

## A.4 Do-not-copy list

Do not copy: SmartBloom's exact copy/wording, its team member names/photos/certificates, its logo, its specific illustrations (robot/flower graphics), its exact page structure (it's a single-page pitch site; CarbonAlpha is a multi-page application), or any specific unseen government website's pixel layout, seal/emblem, or official branding. Government "emblem/seal" visual conventions should be evoked structurally (a formal header lockup, a utility bar) — never by using an actual official Indian government emblem, seal, or Ashoka Chakra, which CarbonAlpha has no right to use.
