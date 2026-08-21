# CarbonAlpha - Final SIH Pitch & Scorecard

## 1. The 60-Second Pitch
'Indian heavy industry is entering the carbon market blind. In 2026, the Carbon Credit Trading Scheme (CCTS) imposes binding emission targets on steel, cement, and aluminium. Miss the target, and you pay millions. Beat it, and you earn tradable credits. But CFOs and plant managers don't know whether it's cheaper to BUY credits in the market, BUILD new green technology, or do a HYBRID of both. CarbonAlpha is an enterprise decision twin that ingests facility telemetry, compares it against 250,000 statistical benchmarks, and deterministically models the exact 3-year lifecycle cost of BUY vs BUILD vs HYBRID. We turn climate compliance from a spreadsheet guessing game into a deterministic capital allocation strategy.'

## 2. Final Product Scorecard
- **Problem clarity:** 10/10 (Clear, existential regulatory threat to heavy industry)
- **Innovation:** 9/10 (First tool to combine engineering marginal abatement with financial WACC stress-testing)
- **Technical complexity:** 9/10 (Full FastAPI + NextJS stack, 3-model ML pipeline, 252k synthetic rows, global state)
- **Data credibility:** 8/10 (Synthetic dataset is heavily documented, regulatory claims traced to Gazettes)
- **ML credibility:** 8/10 (Leakage acknowledged; confidence tooltips implemented)
- **Business usefulness:** 10/10 (Directly answers 'What should we do?')
- **UX:** 9/10 (Premium dark-glass boardroom aesthetic, instant hot-reloading scenarios)
- **Scalability:** 8/10 (Easily extends to all 9 CCTS sectors)

## 3. Top 3 Remaining Risks (Red Team)
1. **ACVA Verification API:** We don't have real integration with verifiers yet.
2. **True Market Liquidity:** We assume \u20B91000/CCC, but the market doesn't exist yet, so liquidity risk is unmodeled.
3. **Real Enterprise Data:** We need a pilot with a real steel/cement plant to replace our synthetic baselines.

