# CarbonAlpha Decision & Capital Optimization Model

## 1. Decision Hierarchy
The CarbonAlpha Decision Twin answers: **Should an obligated industrial entity BUY CCCs, BUILD an internal decarbonization project, or execute a HYBRID strategy?**

## 2. Core Equations

### Carbon Position
\\text{GEI} = \\frac{\\text{Total GHG (tCO}_2\\text{e)}}{\\text{Output (tonnes)}}
\\text{Shortfall} = \\max(0, \\text{Actual GEI} - \\text{Target GEI}) \\times \\text{Output}

### Strategy Economics
- **BUY**: $\\text{Cost} = \\text{Shortfall} \\times \\text{Scenario CCC Price} \\times (1 + \\text{TxCost})$
- **BUILD**: $\\text{Net Cost} = \\text{CAPEX} + \\text{OPEX} - \\text{Energy Savings} + \\text{Residual Shortfall Cost}$
- **HYBRID**: $\\text{Residual Shortfall} = \\max(0, \\text{Post-Project GEI} - \\text{Target GEI}) \\times \\text{Output}$; $\\text{Total Cost} = \\text{Net Project Cost} + (\\text{Residual Shortfall} \\times \\text{CCC Price})$

### Capital Optimizer Utility Function
\\text{Score} = 0.35 S_{\\text{financial}} + 0.25 S_{\\text{climate}} + 0.20 S_{\\text{compliance}} + 0.10 S_{\\text{mrv}} + 0.10 S_{\\text{timing}}
