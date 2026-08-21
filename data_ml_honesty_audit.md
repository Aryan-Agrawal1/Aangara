# Trust, Data Honesty, and Business Audit

## Findings
1. **Provenance of Data Not Clearly Labeled**: Certain terms like "CALIBRATED" confidence and "P50 Median" are shown without explaining what they mean, making them appear like absolute truths rather than statistical benchmarks or ML inferences. 
2. **Missing Business Context ("So What?")**: Metrics like "Your Facility GEI", "NPV", "Modelled Shortfall" are displayed as standalone numbers without articulating the direct business risks (e.g. non-compliance penalties) or opportunities (e.g. CCC trading revenue).
3. **Regulatory Ambiguity**: The term "Modelled" is used but doesn't strictly differentiate between synthetic calculations and legally binding statutory positions.

## Actions (Before -> After)
- **Before**: `Confidence: HIGH` (in `PeerBenchmarkCard`) and `CALIBRATED` (in `DecarbonisationMatrix`) shown without tooltips.
- **After**: Added informative tooltips using `title="..."` attributes and `?` icons explaining that "CALIBRATED" means the model was tuned with limited historical data, and "P50 Median" indicates the 50th percentile of the audited benchmark distribution.
- **Before**: "Modelled Shortfall" and "10-Yr NPV" lacked context.
- **After**: Added tooltips explaining that NPV includes WACC assumptions and "Modelled Shortfall" implies a "Potential compliance penalty risk".
