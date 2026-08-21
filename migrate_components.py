import os
import re

def migrate_component(filepath):
    if not os.path.exists(filepath):
        return
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # Replacements for light mode
    replacements = [
        ("bg-[#0E1524]", "bg-white border border-[#E4E9E6] shadow-lg"),
        ("bg-[#06090E]", "bg-white"),
        ("bg-[#0B101A]", "bg-white"),
        ("bg-[#070B11]", "bg-white"),
        ("bg-[#0F172A]", "bg-[#F6F8F7]"),
        ("bg-slate-950", "bg-white"),
        ("bg-slate-900/90", "bg-white/95"),
        ("bg-slate-900/80", "bg-[#F6F8F7]"),
        ("bg-slate-900/60", "bg-[#F6F8F7]"),
        ("bg-slate-900/50", "bg-[#F6F8F7]"),
        ("bg-slate-900/40", "bg-[#F6F8F7]"),
        ("bg-slate-900/30", "bg-[#F6F8F7]"),
        ("bg-slate-900", "bg-[#F6F8F7]"),
        ("bg-slate-800/80", "bg-[#F6F8F7]"),
        ("bg-slate-800/60", "bg-[#F6F8F7]"),
        ("bg-slate-800/50", "bg-[#F6F8F7]"),
        ("bg-slate-800/40", "bg-[#F6F8F7]"),
        ("bg-slate-800", "bg-white border border-[#E4E9E6]"),
        ("bg-slate-700", "bg-[#E4E9E6]"),
        ("border-slate-800", "border-[#E4E9E6]"),
        ("border-slate-700", "border-[#E4E9E6]"),
        ("border-slate-600", "border-[#CBD5CE]"),
        ("border-white/10", "border-[#E4E9E6]"),
        ("border-white/5", "border-[#E4E9E6]"),
        ("border-white/[0.06]", "border-[#E4E9E6]"),
        ("border-white/[0.08]", "border-[#E4E9E6]"),
        ("border-white/[0.04]", "border-[#E4E9E6]"),
        ("text-slate-100", "text-[#10231C]"),
        ("text-slate-200", "text-[#10231C]"),
        ("text-slate-300", "text-[#4B5A54]"),
        ("text-slate-400", "text-[#4B5A54]"),
        ("text-slate-500", "text-[#6B7A72]"),
        ("text-slate-600", "text-[#6B7A72]"),
        ("text-emerald-400", "text-[#1F8A5F]"),
        ("text-emerald-300", "text-[#1F8A5F]"),
        ("text-sky-400", "text-[#2E6BA8]"),
        ("text-sky-300", "text-[#2E6BA8]"),
        ("text-amber-400", "text-[#C98A1E]"),
        ("text-amber-300", "text-[#C98A1E]"),
        ("text-teal-400", "text-[#0B4A3D]"),
        ("bg-emerald-950/80", "bg-[#E8F5EE]"),
        ("bg-emerald-950/60", "bg-[#E8F5EE]"),
        ("bg-emerald-950/40", "bg-[#E8F5EE]"),
        ("bg-emerald-950/30", "bg-[#E8F5EE]"),
        ("bg-emerald-950", "bg-[#E8F5EE]"),
        ("bg-amber-950/80", "bg-[#FEF7E8]"),
        ("bg-amber-950/60", "bg-[#FEF7E8]"),
        ("bg-amber-950/40", "bg-[#FEF7E8]"),
        ("bg-amber-950", "bg-[#FEF7E8]"),
        ("bg-sky-950/80", "bg-[#EBF3FB]"),
        ("bg-sky-950/60", "bg-[#EBF3FB]"),
        ("bg-sky-950", "bg-[#EBF3FB]"),
        ("bg-rose-950/40", "bg-[#FDECEA]"),
        ("text-rose-400", "text-[#C33B2E]"),
        ("text-rose-300", "text-[#C33B2E]"),
        ("border-rose-800/50", "border-[#C33B2E]/30"),
        ("const CHART_GRID = '#1e293b';", "const CHART_GRID = '#E4E9E6';"),
        ("const CHART_TEXT = '#94a3b8';", "const CHART_TEXT = '#6B7A72';"),
        ("CHART_GRID = '#1e293b'", "CHART_GRID = '#E4E9E6'"),
        ("CHART_TEXT = '#94a3b8'", "CHART_TEXT = '#6B7A72'")
    ]

    for old, new in replacements:
        content = content.replace(old, new)

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Migrated {filepath}")

files = [
    "components/cockpit/CarbonPositionCard.tsx",
    "components/cockpit/DecisionTwinHero.tsx",
    "components/cockpit/ExplainabilityCard.tsx",
    "components/cockpit/MRVReadinessCard.tsx",
    "components/cockpit/ScenarioSliders.tsx",
    "components/drawers/SourceTraceDrawer.tsx",
    "components/drawers/StrategyTraceDrawer.tsx",
    "components/intelligence/DecarbonisationMatrix.tsx",
    "components/intelligence/FacilityInputForm.tsx",
    "components/intelligence/PeerBenchmarkCard.tsx",
    "app/entity/page.tsx",
    "app/overview/page.tsx",
    "app/scenarios/page.tsx",
    "app/not-found.tsx"
]

for fp in files:
    migrate_component(fp)