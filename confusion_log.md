# User Confusion Log - CarbonAlpha

### 1. Form Navigation Friction
**Symptom:** Users clicking "Continue" without realizing fields were missing, leading to silent validation failures later.
**Root Cause:** The 4-step wizard structure did not enforce field-level validation until step 4 (or skipped it entirely depending on implementation).
**Resolution:** Flattened into a unified form layout. Standard HTML5 `required` constraints now immediately block submission if a field is missing, removing ambiguity.

### 2. "Where is the output?" Syndrome
**Symptom:** When backend services are down, users submit the form and nothing happens.
**Root Cause:** Lack of error state propagation from the `runAnalysis` fetch call to the UI.
**Resolution:** Added `apiError` state. If the fetch fails, a red warning box appears, telling the user exactly what failed (backend connection).

### 3. "What does this software do?"
**Symptom:** The hero text was poetic but slightly ambiguous. 
**Root Cause:** "Turn Industrial Carbon Exposure into Capital Decisions" is a great tagline, but doesn't instantly explain the *category* of the software.
**Resolution:** Changed to "CarbonAlpha: The Industrial Carbon Decision Twin". This immediately anchors the user's mental model to the concept of a digital twin for compliance and capital allocation.
