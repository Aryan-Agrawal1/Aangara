import json
import os
import random

os.makedirs('data/synthetic', exist_ok=True)
random.seed(2026)

with open('data/regulatory/regulatory_targets.json', 'r', encoding='utf-8') as f:
    target_catalog = json.load(f)['targets']

targets_by_sector = {t['sector']: t for t in target_catalog}

sector_configs = [
    {
        'sector': 'cement',
        'sub_sector': 'Integrated Cement Plant (OPC/PPC)',
        'states': ['Rajasthan', 'Andhra Pradesh', 'Madhya Pradesh'],
        'unit_names': ['Synthetic Cement Unit 01 (Hero Demo)', 'Synthetic Cement Unit 02 (Western Clinker)', 'Synthetic Cement Unit 03 (Southern Grinding & Kiln)'],
        'base_output': 1000000.0,
        'output_unit': 'tonnes',
        'product_name': 'Ordinary Portland / Pozzolana Cement',
        'solid_fuel_type': 'petcoke',
        'solid_fuel_qty': 85000.0,
        'electricity_mwh': 85000.0,
        'process_type': 'cement_calcination_raw_meal',
        'process_activity': 750000.0,
        'project_name': '15 MW Kiln Waste Heat Recovery System (WHRS)',
        'project_type': 'Waste Heat Recovery & Thermal Efficiency',
        'project_capex_cr': 85.0,
        'project_opex_change_cr': 2.2,
        'project_energy_savings_cr': 21.5,
        'expected_reduction_tco2e': 55000.0,
        'implementation_months': 12,
        'methodology_code': 'BM IN02.001',
        'methodology_title': 'Energy efficiency and fuel switching measures for industrial facilities'
    },
    {
        'sector': 'aluminium',
        'sub_sector': 'Aluminium Smelting',
        'states': ['Odisha', 'Chhattisgarh', 'Madhya Pradesh'],
        'unit_names': ['Synthetic Aluminium Unit 01 (Smelter East)', 'Synthetic Aluminium Unit 02 (Smelter Central)', 'Synthetic Aluminium Unit 03 (Smelter West)'],
        'base_output': 250000.0,
        'output_unit': 'tonnes',
        'product_name': 'Primary Aluminium Ingot',
        'solid_fuel_type': 'indian_domestic_coal',
        'solid_fuel_qty': 450000.0,
        'electricity_mwh': 3500000.0,
        'process_type': 'aluminium_anode_consumption',
        'process_activity': 250000.0,
        'project_name': 'Potline Energy Optimization & Anode Quality Upgrade',
        'project_type': 'Electrical & Smelting Process Efficiency',
        'project_capex_cr': 140.0,
        'project_opex_change_cr': 4.5,
        'project_energy_savings_cr': 38.0,
        'expected_reduction_tco2e': 110000.0,
        'implementation_months': 18,
        'methodology_code': 'BM IN02.001',
        'methodology_title': 'Energy efficiency and fuel switching measures for industrial facilities'
    },
    {
        'sector': 'chlor_alkali',
        'sub_sector': 'Membrane Cell Caustic Soda',
        'states': ['Gujarat', 'Tamil Nadu', 'Maharashtra'],
        'unit_names': ['Synthetic Chlor-Alkali Unit 01', 'Synthetic Chlor-Alkali Unit 02', 'Synthetic Chlor-Alkali Unit 03'],
        'base_output': 180000.0,
        'output_unit': 'tonnes',
        'product_name': 'Caustic Soda (100% NaOH Equivalent)',
        'solid_fuel_type': 'imported_coal_indonesian',
        'solid_fuel_qty': 45000.0,
        'electricity_mwh': 420000.0,
        'process_type': None,
        'process_activity': 0.0,
        'project_name': 'Zero-Gap Membrane Electrolyser Retrofit',
        'project_type': 'Electrolysis Technology Modernisation',
        'project_capex_cr': 52.0,
        'project_opex_change_cr': 1.1,
        'project_energy_savings_cr': 14.5,
        'expected_reduction_tco2e': 22000.0,
        'implementation_months': 10,
        'methodology_code': 'BM IN02.001',
        'methodology_title': 'Energy efficiency and fuel switching measures for industrial facilities'
    },
    {
        'sector': 'pulp_paper',
        'sub_sector': 'Wood-based Integrated Pulp & Paper',
        'states': ['Andhra Pradesh', 'Telangana', 'Punjab'],
        'unit_names': ['Synthetic Pulp & Paper Unit 01', 'Synthetic Pulp & Paper Unit 02', 'Synthetic Pulp & Paper Unit 03'],
        'base_output': 150000.0,
        'output_unit': 'tonnes',
        'product_name': 'Writing & Printing Paper',
        'solid_fuel_type': 'indian_domestic_coal',
        'solid_fuel_qty': 120000.0,
        'electricity_mwh': 110000.0,
        'process_type': None,
        'process_activity': 0.0,
        'project_name': 'High-Efficiency Recovery Boiler & Biomass Co-firing Upgrade',
        'project_type': 'Biomass Fuel Switching & Boiler Optimization',
        'project_capex_cr': 48.0,
        'project_opex_change_cr': 1.8,
        'project_energy_savings_cr': 12.0,
        'expected_reduction_tco2e': 18500.0,
        'implementation_months': 12,
        'methodology_code': 'BM EN01.003',
        'methodology_title': 'Electricity and Heat Generation from Biomass'
    },
    {
        'sector': 'petrochemicals',
        'sub_sector': 'Naphtha / Gas Naphtha Cracker',
        'states': ['Gujarat', 'Maharashtra', 'Assam'],
        'unit_names': ['Synthetic Petrochemical Complex 01', 'Synthetic Petrochemical Complex 02', 'Synthetic Petrochemical Complex 03'],
        'base_output': 800000.0,
        'output_unit': 'tonnes',
        'product_name': 'HDPE / LLDPE Polymer Resins',
        'solid_fuel_type': None,
        'solid_fuel_qty': 0.0,
        'electricity_mwh': 550000.0,
        'process_type': None,
        'process_activity': 0.0,
        'project_name': 'Cracker Furnace Heat Integration & Electrification of Auxiliary Drives',
        'project_type': 'Process Integration & Electrification',
        'project_capex_cr': 115.0,
        'project_opex_change_cr': 3.2,
        'project_energy_savings_cr': 28.0,
        'expected_reduction_tco2e': 42000.0,
        'implementation_months': 16,
        'methodology_code': 'BM IN02.001',
        'methodology_title': 'Energy efficiency and fuel switching measures for industrial facilities'
    },
    {
        'sector': 'petroleum_refinery',
        'sub_sector': 'High Complexity Coastal Refinery',
        'states': ['Gujarat', 'Maharashtra', 'Odisha'],
        'unit_names': ['Synthetic Coastal Refinery Unit 01', 'Synthetic Inland Refinery Unit 02', 'Synthetic Coastal Refinery Unit 03'],
        'base_output': 12000000.0,
        'output_unit': 'tonnes',
        'product_name': 'Composite Refined Petroleum Products (MBN Basis)',
        'solid_fuel_type': None,
        'solid_fuel_qty': 0.0,
        'electricity_mwh': 850000.0,
        'process_type': None,
        'process_activity': 0.0,
        'project_name': 'Atmospheric-Vacuum Distillation Pinch Heat Exchanger Network Revamp',
        'project_type': 'Crude Pre-heat Train Optimization',
        'project_capex_cr': 175.0,
        'project_opex_change_cr': 4.0,
        'project_energy_savings_cr': 45.0,
        'expected_reduction_tco2e': 125000.0,
        'implementation_months': 18,
        'methodology_code': 'BM IN02.001',
        'methodology_title': 'Energy efficiency and fuel switching measures for industrial facilities'
    },
    {
        'sector': 'textile',
        'sub_sector': 'Composite Fabric & Processing Mill',
        'states': ['Tamil Nadu', 'Gujarat', 'Punjab'],
        'unit_names': ['Synthetic Composite Textile Mill 01', 'Synthetic Composite Textile Mill 02', 'Synthetic Composite Textile Mill 03'],
        'base_output': 40000.0,
        'output_unit': 'tonnes',
        'product_name': 'Finished Dyed Woven Fabric',
        'solid_fuel_type': 'indian_domestic_coal',
        'solid_fuel_qty': 65000.0,
        'electricity_mwh': 85000.0,
        'process_type': None,
        'process_activity': 0.0,
        'project_name': 'Steam Condensate Recovery & Rooftop Solar Hybrid',
        'project_type': 'Thermal Heat Recovery & Solar Rooftop',
        'project_capex_cr': 24.0,
        'project_opex_change_cr': 0.6,
        'project_energy_savings_cr': 6.2,
        'expected_reduction_tco2e': 9200.0,
        'implementation_months': 8,
        'methodology_code': 'BM EN01.001',
        'methodology_title': 'Grid-connected electricity generation from renewable sources'
    },
    {
        'sector': 'iron_steel',
        'sub_sector': 'Integrated BF-BOF Steel Plant',
        'states': ['Jharkhand', 'Odisha'],
        'unit_names': ['Synthetic Integrated Steel Unit 01 (Watchlist Demo)', 'Synthetic Integrated Steel Unit 02'],
        'base_output': 2500000.0,
        'output_unit': 'tonnes',
        'product_name': 'Crude Steel (BF-BOF Route)',
        'solid_fuel_type': 'indian_domestic_coal',
        'solid_fuel_qty': 2100000.0,
        'electricity_mwh': 1800000.0,
        'process_type': None,
        'process_activity': 0.0,
        'project_name': 'Top Gas Recovery Turbine (TRT) & Coke Dry Quenching (CDQ)',
        'project_type': 'Blast Furnace Gas & Sensible Heat Recovery',
        'project_capex_cr': 220.0,
        'project_opex_change_cr': 6.0,
        'project_energy_savings_cr': 58.0,
        'expected_reduction_tco2e': 210000.0,
        'implementation_months': 24,
        'methodology_code': 'BM IN02.001',
        'methodology_title': 'Energy efficiency and fuel switching measures for industrial facilities'
    },
    {
        'sector': 'fertiliser',
        'sub_sector': 'Natural Gas Ammonia-Urea Complex',
        'states': ['Uttar Pradesh', 'Gujarat'],
        'unit_names': ['Synthetic Ammonia-Urea Complex 01 (Watchlist Demo)', 'Synthetic Ammonia-Urea Complex 02'],
        'base_output': 1300000.0,
        'output_unit': 'tonnes',
        'product_name': 'Prilled Urea',
        'solid_fuel_type': None,
        'solid_fuel_qty': 0.0,
        'electricity_mwh': 140000.0,
        'process_type': None,
        'process_activity': 0.0,
        'project_name': 'Ammonia Synthesis Loop Catalyst Upgrade & Variable Frequency Drives',
        'project_type': 'Synthesis Efficiency & Compressor Optimization',
        'project_capex_cr': 65.0,
        'project_opex_change_cr': 1.5,
        'project_energy_savings_cr': 16.0,
        'expected_reduction_tco2e': 32000.0,
        'implementation_months': 14,
        'methodology_code': 'BM IN02.001',
        'methodology_title': 'Energy efficiency and fuel switching measures for industrial facilities'
    }
]

entities = []
for sc in sector_configs:
    target_info = targets_by_sector.get(sc['sector'])
    num_units = len(sc['unit_names'])
    
    for i in range(num_units):
        code_prefix = sc['sector'][:3].upper()
        if sc['sector'] == 'chlor_alkali':
            code_prefix = 'CLA'
        elif sc['sector'] == 'petroleum_refinery':
            code_prefix = 'REF'
        elif sc['sector'] == 'iron_steel':
            code_prefix = 'STE'
        elif sc['sector'] == 'fertiliser':
            code_prefix = 'FER'

        entity_id = f'SYN-{code_prefix}-{i+1:03d}'
        unit_name = sc['unit_names'][i]
        state = sc['states'][i % len(sc['states'])]
        output_var = 1.0 + (i * 0.08) - 0.04
        actual_output_base = round(sc['base_output'] * output_var, 0)
        capacity = round(actual_output_base * 1.15, 0)
        
        base_gei_def = target_info['baseline_gei_default'] if target_info else 0.7380
        tgt_2526 = target_info['target_gei_2025_26'] if target_info else 0.7200
        tgt_2627 = target_info['target_gei_2026_27'] if target_info else 0.7020
        
        baseline_output = actual_output_base
        baseline_gei = base_gei_def
        baseline_emissions = round(baseline_output * baseline_gei, 2)
        
        # 2025-26 Reporting Period
        out_2526 = actual_output_base
        gei_2526 = round(base_gei_def * 1.0100, 4) # exactly 4 decimals
        em_2526 = round(out_2526 * gei_2526, 2)
        shortfall_2526 = round(max(0.0, gei_2526 - tgt_2526) * out_2526, 2)
        surplus_2526 = round(max(0.0, tgt_2526 - gei_2526) * out_2526, 2)
        
        # 2026-27 Reporting Period
        out_2627 = round(actual_output_base * 1.02, 0)
        gei_2627 = round(base_gei_def * 1.0030, 4) # exactly 4 decimals
        em_2627 = round(out_2627 * gei_2627, 2)
        shortfall_2627 = round(max(0.0, gei_2627 - tgt_2627) * out_2627, 2)
        surplus_2627 = round(max(0.0, tgt_2627 - gei_2627) * out_2627, 2)

        # Concrete Hero Anchor values for Synthetic Cement Unit 01
        if sc['sector'] == 'cement' and i == 0:
            baseline_output = 1000000.0
            baseline_gei = 0.7380
            baseline_emissions = 738000.0
            capacity = 1200000.0
            
            out_2526 = 1000000.0
            gei_2526 = 0.7450
            em_2526 = 745000.0
            shortfall_2526 = 25000.0 # (0.7450 - 0.7200) * 1,000,000
            surplus_2526 = 0.0
            
            out_2627 = 1020000.0
            gei_2627 = 0.7400
            em_2627 = 754800.0
            shortfall_2627 = 38760.0 # (0.7400 - 0.7020) * 1,020,000
            surplus_2627 = 0.0

        entity = {
            'entity_id': entity_id,
            'entity_name': unit_name,
            'sector': sc['sector'],
            'sub_sector': sc['sub_sector'],
            'category': 'CCTS_MONITORED' if sc['sector'] not in ['iron_steel', 'fertiliser'] else 'WATCHLIST',
            'state': state,
            'data_status': 'SYNTHETIC',
            'facility': {
                'facility_id': f'FAC-{entity_id}',
                'name': f'{unit_name} Works',
                'capacity': capacity,
                'capacity_unit': sc['output_unit'],
                'operating_days': 330
            },
            'regulatory_profile': {
                'target_id': target_info['target_id'] if target_info else 'TGT-DEFAULT',
                'baseline_year': '2023-24',
                'baseline_output': baseline_output,
                'baseline_emissions_tco2e': baseline_emissions,
                'baseline_gei': baseline_gei,
                'target_gei_2025_26': tgt_2526,
                'target_gei_2026_27': tgt_2627,
                'gei_unit': target_info['gei_unit'] if target_info else 'tCO2e/unit',
                'status': target_info['status'] if target_info else 'FINAL',
                'source_id': target_info['source_id'] if target_info else 'REG-DEFAULT',
                'source_url': target_info['source_url'] if target_info else 'https://beeindia.gov.in/'
            },
            'reporting_periods': {
                '2025-26': {
                    'year': '2025-26',
                    'actual_output': out_2526,
                    'output_unit': sc['output_unit'],
                    'operating_days': 330,
                    'utilisation_pct': round((out_2526 / capacity) * 100, 1),
                    'total_ghg_tco2e': em_2526,
                    'actual_gei': gei_2526,
                    'target_gei': tgt_2526,
                    'potential_shortfall_tco2e': shortfall_2526,
                    'potential_surplus_tco2e': surplus_2526,
                    'source_streams': {
                        'electricity_mwh': round(sc['electricity_mwh'] * output_var, 1),
                        'fuel_quantity_tonnes': round(sc['solid_fuel_qty'] * output_var, 1),
                        'fuel_type': sc['solid_fuel_type'] or 'natural_gas',
                        'process_emissions_tco2e': round((out_2526 * 0.525) if sc['sector'] == 'cement' else ((out_2526 * 1.62) if sc['sector'] == 'aluminium' else 0.0), 2)
                    }
                },
                '2026-27': {
                    'year': '2026-27',
                    'actual_output': out_2627,
                    'output_unit': sc['output_unit'],
                    'operating_days': 335,
                    'utilisation_pct': round((out_2627 / capacity) * 100, 1),
                    'total_ghg_tco2e': em_2627,
                    'actual_gei': gei_2627,
                    'target_gei': tgt_2627,
                    'potential_shortfall_tco2e': shortfall_2627,
                    'potential_surplus_tco2e': surplus_2627,
                    'source_streams': {
                        'electricity_mwh': round(sc['electricity_mwh'] * output_var * 1.01, 1),
                        'fuel_quantity_tonnes': round(sc['solid_fuel_qty'] * output_var * 1.01, 1),
                        'fuel_type': sc['solid_fuel_type'] or 'natural_gas',
                        'process_emissions_tco2e': round((out_2627 * 0.525) if sc['sector'] == 'cement' else ((out_2627 * 1.62) if sc['sector'] == 'aluminium' else 0.0), 2)
                    }
                }
            },
            'primary_project': {
                'project_id': f'PRJ-{entity_id}-01',
                'name': sc['project_name'],
                'project_type': sc['project_type'],
                'capex_cr': sc['project_capex_cr'],
                'annual_opex_change_cr': sc['project_opex_change_cr'],
                'annual_energy_savings_cr': sc['project_energy_savings_cr'],
                'expected_reduction_tco2e': sc['expected_reduction_tco2e'],
                'expected_reduction_pct': round((sc['expected_reduction_tco2e'] / baseline_emissions) * 100, 1),
                'implementation_months': sc['implementation_months'],
                'mrv_annual_cost_cr': 0.35,
                'verification_cost_cr': 0.20,
                'methodology_code': sc['methodology_code'],
                'methodology_title': sc['methodology_title'],
                'methodology_status': 'APPROVED'
            },
            'mrv_readiness': {
                'measurement_completeness': 88.0 if i == 0 else 82.0,
                'activity_data_completeness': 90.0 if i == 0 else 85.0,
                'factor_traceability': 85.0 if i == 0 else 80.0,
                'methodology_mapping': 92.0 if i == 0 else 84.0,
                'verification_readiness': 80.0 if i == 0 else 75.0,
                'composite_score': 87.0 if i == 0 else 81.2,
                'status': 'HIGH_READINESS' if i == 0 else 'GOOD',
                'notes': 'High direct metering coverage on solid fuels and grid meters; automated daily logs.'
            }
        }
        entities.append(entity)

with open('data/synthetic/master_entities.json', 'w', encoding='utf-8') as f:
    json.dump({'total_entities': len(entities), 'entities': entities}, f, indent=2)

print(f'Generated {len(entities)} entities.')
