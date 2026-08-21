# Product Weakness Register

## High Priority Issues

| Area | Weakness | Impact | Remediation Status |
|---|---|---|---|
| **E2E Testing** | Test relied on non-visible DOM states (clicking hidden wizard steps and unclickable `<option>` tags). | Failed pipeline, false negatives in CI/CD. | **FIXED** (Updated locator, flattened DOM). |
| **Resilience** | Frontend failed silently when the intelligence backend was unreachable. | User confusion, degraded trust. | **FIXED** (Implemented API error boundary & UI alert). |
| **Data Quality** | Multi-step form masked required fields and allowed progression without completing thermodynamic inputs. | Bad data sent to backend, cognitive load for users jumping between steps. | **FIXED** (Unified scrollable layout enforces HTML5 validation linearly). |

## Medium Priority Opportunities

| Area | Weakness | Observation | Recommendation |
|---|---|---|---|
| **Onboarding** | Tooltips are helpful but small and only appear on hover. | On mobile/touch devices, users cannot hover to see the tooltips explaining complex engineering terms (MBN, Clinker Factor). | Convert tooltips to tap-to-reveal on mobile, or include an inline info toggle. |
| **Data Persistence** | Form resets on reload. | If a user spends 5 minutes entering thermodynamic data and accidentally refreshes, everything is lost. | Implement `localStorage` caching or URL query param syncing for the form state. |
| **Responsive Design** | Tables and benchmark charts. | Financial optimization matrix may be cramped on narrow screens. | Add horizontal scrolling containers with shadow indicators for data tables. |
