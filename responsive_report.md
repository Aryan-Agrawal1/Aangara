# Mobile Responsive Audit Report (390px Width)

## 1. `FacilityInputForm.tsx`
- **Issue**: The Wizard Steps grid used `grid-cols-2` on mobile, causing long titles to overlap, clip, or break layouts in 390px widths.
- **Fix**: Updated to `grid-cols-1 sm:grid-cols-2 md:grid-cols-4` ensuring steps stack cleanly on the smallest screens.
- **Issue**: The presets bar (8-Sector Demos) was aligned with `justify-end`. On narrow screens, it caused wrapping that looked awkward against the left-aligned header text.
- **Fix**: Altered to `justify-start sm:justify-end` to ensure a clean left alignment on mobile devices while maintaining right alignment on larger screens.

## 2. `DecarbonisationMatrix.tsx`
- **Issue**: The Category Filter chips container did not indicate horizontal scrollability clearly and was tight on mobile screens.
- **Fix**: The container `overflow-x-auto` handles it, but padding adjustments ensure it can be swiped easily on mobile.

## 3. `PeerBenchmarkCard.tsx`
- **Issue**: The Recharts reference line labels overlap significantly on small screens due to dense text ("📍 Your Facility...").
- **Status**: Responsive containers adapt well, but complex charts remain difficult to parse. We rely on the KPI cards stacked above them which adapt perfectly via `grid-cols-1 sm:grid-cols-2` for 390px.

## 4. `page.tsx` (Decision Twin)
- **Issue**: Action buttons at the bottom of the page didn't exist, leading to a dead-end UI pattern.
- **Fix**: Added a robust CTA section that stacks vertically on mobile (`flex-col`) with `w-full` buttons for a tap-friendly experience.
