import json
import os

TARGETS_FILE = os.path.join('data', 'regulatory_truth', 'regulatory_targets.json')

def ingest_targets():
    with open(TARGETS_FILE, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    for target in data.get('targets', []):
        target['dataset_provenance'] = 'MoEFCC_Gazette'
        target['real_or_synthetic'] = 'REAL_OFFICIAL'
        target['parse_confidence'] = 'HIGH'
        
        if target['sector'] == 'iron_steel':
            target['status'] = 'DRAFT'
            target['source_id'] = 'REG-MOEFCC-2026-STEEL-DRAFT'
            target['source_url'] = 'https://moef.gov.in/en/notifications/'
            target['parse_confidence'] = 'MEDIUM'
        elif target['sector'] == 'fertiliser':
            target['status'] = 'WATCHLIST'
            target['parse_confidence'] = 'MEDIUM'

    with open(TARGETS_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)
    
    print(f'Ingested targets and updated {TARGETS_FILE} successfully.')

if __name__ == '__main__':
    ingest_targets()
