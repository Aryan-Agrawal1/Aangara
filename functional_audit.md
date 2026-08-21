# Functional Audit Report - CarbonAlpha

## 1. Cognitive Load Assessment

### Before
- **FacilityInputForm.tsx:** The primary input form used a 4-step progressive disclosure wizard. While progressive disclosure is generally good, for an industrial engineering form, it obscured the relationship between fields, making validation difficult and hiding the primary Call-To-Action ("Run Personalized Decision Intelligence") behind multiple clicks. Users could bypass missing fields and hit an invalid state.
- **Landing Page:** The value proposition ("Turn Industrial Carbon Exposure into Capital Decisions") was slightly vague.

### After
- **FacilityInputForm.tsx:** Flattened into a single, continuous scrollable form. This allows users to see all required engineering parameters simultaneously, relies on native HTML5 validation to block submission on missing fields, and enforces a much clearer mental model of inputs -> output.
- **Landing Page:** Instantly identifies what the product is: "CarbonAlpha: The Industrial Carbon Decision Twin".

## 2. Playwright E2E Flow Integrity

### Before
- The `judge-flow.spec.ts` test was timing out because it attempted to click the "Iron & Steel" select option (which isn't directly clickable via Playwright in the way it was requested) and because the "Run Personalized Decision Intelligence" button was hidden on Step 4 of the wizard.

### After
- Corrected the target text to "Steel (Draft)" matching the preset button.
- Flatted the form layout to make the submit button immediately accessible.
- Explicitly wait and click the CTA to navigate to `/decision`, preventing premature test timeouts.

## 3. Graceful Error & Degradation Handling

### Before
- If the `127.0.0.1:8008` intelligence backend was down, the `/industrial-intelligence` page caught the fetch error, set `analysisResult` to null, and failed silently, leaving the user staring at an empty page.

### After
- Implemented a clear error boundary. If the API fails, a clear warning ("Service Temporarily Unavailable - Unable to connect to CarbonAlpha Intelligence Core") is shown directly within the layout, retaining context and informing the user gracefully.
