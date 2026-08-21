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

    # Find the malformed breadcrumb and fix it
    pattern = r'<Breadcrumb items=\{\{\s*label:\s*"([^"]+)"\s*\}\}\s*/>'
    
    if re.search(pattern, content):
        content = re.sub(pattern, r'<Breadcrumb items={[{ label: "\1" }]} />', content)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Fixed Breadcrumb in {filepath}')