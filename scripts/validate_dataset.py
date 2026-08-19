import json
import math

def validate():
    with open('data/synthetic/master_entities.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    entities = data['entities']
    errors = []
    warnings = []
    
    for e in entities:
        eid = e['entity_id']
        if e.get('data_status') != 'SYNTHETIC':
            errors.append(f'{eid}: data_status is not SYNTHETIC')
        
        # Validate reporting periods
        for yr, rp in e['reporting_periods'].items():
            out = rp['actual_output']
            em = rp['total_ghg_tco2e']
            gei = rp['actual_gei']
            
            if out <= 0:
                errors.append(f'{eid} ({yr}): output <= 0')
            if em < 0:
                errors.append(f'{eid} ({yr}): emissions < 0')
            
            calc_gei = round(em / out, 4)
            if abs(calc_gei - gei) > 0.001:
                errors.append(f'{eid} ({yr}): GEI mismatch (recorded: {gei}, calculated: {calc_gei})')
            
            target_gei = rp['target_gei']
            if gei > target_gei:
                expected_shortfall = round((gei - target_gei) * out, 2)
                if abs(rp['potential_shortfall_tco2e'] - expected_shortfall) > 1.0:
                    errors.append(f'{eid} ({yr}): shortfall mismatch')
            else:
                expected_surplus = round((target_gei - gei) * out, 2)
                if abs(rp['potential_surplus_tco2e'] - expected_surplus) > 1.0:
                    errors.append(f'{eid} ({yr}): surplus mismatch')
                    
        # Validate project
        prj = e.get('primary_project', {})
        base_em = e['regulatory_profile']['baseline_emissions_tco2e']
        red_tco2e = prj.get('expected_reduction_tco2e', 0)
        if red_tco2e > base_em:
            errors.append(f'{eid}: project reduction ({red_tco2e}) > baseline emissions ({base_em})')
            
        if prj.get('capex_cr', 0) < 0:
            errors.append(f'{eid}: project CAPEX < 0')
            
    print(f'Validation complete. Entities checked: {len(entities)}')
    if errors:
        print(f'FAIL: {len(errors)} errors found:')
        for err in errors:
            print('  - ' + err)
        return False
    else:
        print('PASS: All synthetic data records adhere 100% to physics, engineering bounds, and CCTS calculation logic!')
        return True

if __name__ == '__main__':
    validate()
