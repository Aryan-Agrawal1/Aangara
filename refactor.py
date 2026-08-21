import os
import re

files_to_update = [
    ('app/overview/page.tsx', 'Portfolio Overview'),
    ('app/industrial-intelligence/page.tsx', 'Facility Analysis'),
    ('app/decision/page.tsx', 'Decision Twin'),
    ('app/scenarios/page.tsx', 'Stress Scenarios'),
    ('app/sources/page.tsx', 'Evidence Center'),
    ('app/entity/page.tsx', 'Facility Input')
]

for filepath, breadcrumb_label in files_to_update:
    if not os.path.exists(filepath):
        print(f"{filepath} not found")
        continue
        
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    imports = ''
    if 'UtilityBar' not in content:
        imports += 'import { UtilityBar } from "@/components/ui/UtilityBar";\n'
    if 'Breadcrumb' not in content:
        imports += 'import { Breadcrumb } from "@/components/ui/Breadcrumb";\n'
    if 'ProvenanceFooter' not in content:
        imports += 'import { ProvenanceFooter } from "@/components/ui/ProvenanceFooter";\n'
        
    if imports:
        if 'import ' in content:
            content = content.replace('import ', imports + 'import ', 1)
        else:
            content = imports + content

    if '<UtilityBar />' not in content:
        content = re.sub(r'(<div[^>]*min-h-screen[^>]*>)', r'\1\n      <UtilityBar />', content, count=1)
        
    if '<Breadcrumb' not in content:
        content = re.sub(r'(<main[^>]*>)', f'\\1\n        <Breadcrumb items={{{{ label: "{breadcrumb_label}" }}}} />', content, count=1)

    if '<ProvenanceFooter' not in content:
        content = re.sub(r'(</main>)', r'  <ProvenanceFooter verifiedDate="2026-01-09" />\n      \1', content, count=1)

    replacements = [
        (r'bg-\[\#06090E\]', 'bg-white'),
        (r'bg-\[\#04060A\]', 'bg-white'),
        (r'bg-\[\#070B11\]', 'bg-white'),
        (r'bg-slate-950', 'bg-white'),
        (r'bg-\[\#0B1019\]', 'bg-[#F6F8F7]'),
        (r'bg-\[\#111827\]', 'bg-[#F6F8F7]'),
        (r'bg-slate-900/60', 'bg-[#F6F8F7]'),
        (r'bg-slate-900/80', 'bg-[#F6F8F7]'),
        (r'bg-slate-900', 'bg-[#F6F8F7]'),
        (r'bg-slate-800/60', 'bg-[#F6F8F7]'),
        (r'bg-slate-800', 'bg-white border border-[#E4E9E6]'),
        (r'bg-white/\[0\.04\]', 'bg-[#F6F8F7]'),
        (r'bg-white/\[0\.06\]', 'bg-[#F6F8F7]'),
        (r'text-white', 'text-[#10231C]'),
        (r'text-slate-100', 'text-[#10231C]'),
        (r'text-slate-200', 'text-[#4B5A54]'),
        (r'text-slate-300', 'text-[#4B5A54]'),
        (r'text-slate-400', 'text-[#4B5A54]'),
        (r'text-slate-500', 'text-[#6B7A72]'),
        (r'text-slate-600', 'text-[#6B7A72]'),
        (r'border-white/\[0\.04\]', 'border-[#E4E9E6]'),
        (r'border-white/\[0\.06\]', 'border-[#E4E9E6]'),
        (r'border-white/\[0\.07\]', 'border-[#E4E9E6]'),
        (r'border-white/\[0\.08\]', 'border-[#E4E9E6]'),
        (r'border-slate-700', 'border-[#E4E9E6]'),
        (r'border-slate-800', 'border-[#E4E9E6]'),
        (r'text-emerald-400', 'text-[#1F8A5F]'),
        (r'text-emerald-300', 'text-[#1F8A5F]'),
        (r'bg-emerald-600', 'bg-[#0B4A3D]'),
        (r'bg-emerald-500', 'bg-[#0B4A3D]')
    ]
    
    for old, new in replacements:
        content = re.sub(old, new, content)

    content = content.replace("const CHART_GRID = '#1e293b';", "const CHART_GRID = '#E4E9E6';")
    content = content.replace("const CHART_TEXT = '#94a3b8';", "const CHART_TEXT = '#6B7A72';")
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print(f'Updated {filepath}')