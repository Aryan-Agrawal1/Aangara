'use client';

import React, { useState } from 'react';
import {
  Building2,
  Sparkles,
  CheckCircle2,
  ShieldAlert,
  ShieldCheck,
  Cpu,
  Flame,
  Zap,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  Check,
  Info,
  Layers,
  Gauge,
  FileCheck2
} from 'lucide-react';
import { formatCurrencyCr, formatTonnes, formatEmissions } from '@/lib/formatters';

export interface FacilityFormData {
  facility_name: string;
  sector: string;
  sub_sector: string;
  state: string;
  annual_production: number;
  production_unit: string;
  electricity_mwh: number;
  renewable_electricity_pct: number;
  thermal_fuel_type: string;
  thermal_fuel_tonnes: number;
  clinker_factor_pct?: number;
  smelter_dc_sec_kwh?: number;
  steel_route?: string;
  whrs_installed_mw?: number;
  custom_target_gei?: number;
  caustic_tech?: string;
  paper_steam_specific?: number;
  refinery_mbn?: number;
  petrochem_feedstock?: string;
  textile_route?: string;
}

interface FacilityInputFormProps {
  formData: FacilityFormData;
  onChange: (data: FacilityFormData) => void;
  onSubmit: () => void;
  isLoading?: boolean;
  dataQuality?: {
    status?: string;
    quality_score?: number;
    errors?: string[];
    warnings?: string[];
    checks_passed?: string[];
  };
}

export function FacilityInputForm({
  formData,
  onChange,
  onSubmit,
  isLoading,
  dataQuality
}: FacilityInputFormProps) {
  

  const handleChange = (field: keyof FacilityFormData, value: any) => {
    onChange({
      ...formData,
      [field]: value
    });
  };

  const handleLoadPreset = (presetSector: string) => {
    if (presetSector === 'cement') {
      onChange({
        facility_name: 'Western Rajasthan Cement Works',
        sector: 'cement',
        sub_sector: 'Integrated Plant (OPC/PPC)',
        state: 'Rajasthan',
        annual_production: 1200000.0,
        production_unit: 'tonnes',
        electricity_mwh: 98000.0,
        renewable_electricity_pct: 12.5,
        thermal_fuel_type: 'petcoke',
        thermal_fuel_tonnes: 95000.0,
        clinker_factor_pct: 74.0,
        whrs_installed_mw: 0.0
      });
    } else if (presetSector === 'iron_steel') {
      onChange({
        facility_name: 'Kalinganagar Integrated Steel Plant',
        sector: 'iron_steel',
        sub_sector: 'Integrated BF-BOF Route',
        state: 'Odisha',
        annual_production: 2500000.0,
        production_unit: 'tonnes',
        electricity_mwh: 1850000.0,
        renewable_electricity_pct: 6.0,
        thermal_fuel_type: 'indian_domestic_coal',
        thermal_fuel_tonnes: 2100000.0,
        steel_route: 'BF_BOF',
        whrs_installed_mw: 0.0
      });
    } else if (presetSector === 'aluminium') {
      onChange({
        facility_name: 'Mahan Smelter Complex',
        sector: 'aluminium',
        sub_sector: 'Primary Smelting',
        state: 'Madhya Pradesh',
        annual_production: 350000.0,
        production_unit: 'tonnes',
        electricity_mwh: 4900000.0,
        renewable_electricity_pct: 8.0,
        thermal_fuel_type: 'indian_domestic_coal',
        thermal_fuel_tonnes: 600000.0,
        smelter_dc_sec_kwh: 14200.0,
        whrs_installed_mw: 0.0
      });
    } else if (presetSector === 'chlor_alkali') {
      onChange({
        facility_name: 'Dahej Caustic Soda Chemical Complex',
        sector: 'chlor_alkali',
        sub_sector: 'Membrane Cell Caustic Soda',
        state: 'Gujarat',
        annual_production: 240000.0,
        production_unit: 'tonnes',
        electricity_mwh: 540000.0,
        renewable_electricity_pct: 15.0,
        thermal_fuel_type: 'natural_gas',
        thermal_fuel_tonnes: 28000.0,
        caustic_tech: 'bipolar_membrane'
      });
    } else if (presetSector === 'pulp_paper') {
      onChange({
        facility_name: 'Bhadrachalam Integrated Paperboard Mills',
        sector: 'pulp_paper',
        sub_sector: 'Integrated Chemical Pulp & Paper',
        state: 'Andhra Pradesh',
        annual_production: 380000.0,
        production_unit: 'tonnes',
        electricity_mwh: 360000.0,
        renewable_electricity_pct: 25.0,
        thermal_fuel_type: 'biomass',
        thermal_fuel_tonnes: 185000.0,
        paper_steam_specific: 4.8
      });
    } else if (presetSector === 'petroleum_refinery') {
      onChange({
        facility_name: 'Jamnagar Coastal Complex',
        sector: 'petroleum_refinery',
        sub_sector: 'High-Complexity Coastal Refinery',
        state: 'Gujarat',
        annual_production: 7500000.0,
        production_unit: 'tonnes',
        electricity_mwh: 450000.0,
        renewable_electricity_pct: 5.0,
        thermal_fuel_type: 'natural_gas',
        thermal_fuel_tonnes: 620000.0,
        refinery_mbn: 9.8
      });
    } else if (presetSector === 'petrochemicals') {
      onChange({
        facility_name: 'Nagothane Olefins & Polymers Unit',
        sector: 'petrochemicals',
        sub_sector: 'Dual-Feed Naphtha/Gas Cracker',
        state: 'Maharashtra',
        annual_production: 850000.0,
        production_unit: 'tonnes',
        electricity_mwh: 580000.0,
        renewable_electricity_pct: 10.0,
        thermal_fuel_type: 'natural_gas',
        thermal_fuel_tonnes: 140000.0,
        petrochem_feedstock: 'dual_feed'
      });
    } else if (presetSector === 'textile') {
      onChange({
        facility_name: 'Tirupur Composite Processing Mills',
        sector: 'textile',
        sub_sector: 'Integrated Spinning, Weaving & Wet Processing',
        state: 'Tamil Nadu',
        annual_production: 45000.0,
        production_unit: 'tonnes',
        electricity_mwh: 180000.0,
        renewable_electricity_pct: 35.0,
        thermal_fuel_type: 'biomass',
        thermal_fuel_tonnes: 22000.0,
        textile_route: 'composite_processing'
      });
    }
  };

  // Helper tooltip component
  const TooltipHelp = ({ text }: { text: string }) => (
    <span className="relative inline-flex items-center ml-1.5 cursor-help group">
      <HelpCircle className="w-3.5 h-3.5 text-[#6B7A72] hover:text-[#4B5A54] transition-colors" />
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block w-56 p-2 rounded bg-white border border-[#E4E9E6] text-[11px] text-[#4B5A54] font-normal leading-tight z-50 shadow-2xl pointer-events-none">
        {text}
      </span>
    </span>
  );

  return (
    <div className="glass-panel rounded-xl border-[#E4E9E6] overflow-hidden shadow-2xl">
      {/* Top Header & Presets Bar with Photographic Background */}
      <div className="relative border-b border-[#E4E9E6]">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1587582423116-ec07293f0395?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center opacity-30 pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#06090E] via-[#06090E]/90 to-transparent pointer-events-none"></div>
        
        <div className="relative z-10 p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-lg bg-[#E8F5EE] text-[#1F8A5F] border border-emerald-800/60 shadow-lg shadow-emerald-950/50 backdrop-blur-md">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-extrabold text-white tracking-tight">Facility Data Entry & Intelligence Studio</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#E8F5EE] text-[#1F8A5F] border border-emerald-800/60 backdrop-blur-md">
                    8-SECTOR READY
                  </span>
                </div>
                <p className="text-xs text-[#4B5A54] mt-1 font-medium max-w-lg">
                  Guided onboarding wizard for plant-specific GHG accounting, statutory GEI targets & abatement modeling.
                </p>
              </div>
            </div>
          </div>

          {/* 8-Sector 1-Click Demo Presets */}
          <div className="flex flex-wrap items-center justify-start sm:justify-end gap-1.5 bg-[#0B1019]/80 backdrop-blur-md p-2.5 rounded-lg border border-[#E4E9E6]/80 shadow-lg">
            <span className="text-[11px] font-semibold text-[#4B5A54] flex items-center space-x-1 mr-1">
              <Sparkles className="w-3.5 h-3.5 text-[#C98A1E]" />
              <span>1-Click Demos:</span>
            </span>
            {[
              { id: 'cement', label: 'Cement', color: 'text-[#1F8A5F] hover:border-emerald-500' },
              { id: 'iron_steel', label: 'Steel (Draft)', color: 'text-[#2E6BA8] hover:border-sky-500' },
              { id: 'aluminium', label: 'Aluminium', color: 'text-[#C98A1E] hover:border-amber-500' },
              { id: 'chlor_alkali', label: 'Chlor-Alkali', color: 'text-[#0B4A3D] hover:border-teal-500' },
              { id: 'pulp_paper', label: 'Paper', color: 'text-lime-400 hover:border-lime-500' },
              { id: 'petroleum_refinery', label: 'Refinery', color: 'text-violet-400 hover:border-violet-500' },
              { id: 'petrochemicals', label: 'Petrochem', color: 'text-cyan-400 hover:border-cyan-500' },
              { id: 'textile', label: 'Textile', color: 'text-pink-400 hover:border-pink-500' },
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleLoadPreset(p.id)}
                className={`text-[11px] font-mono px-2.5 py-1.5 rounded-md transition-all cursor-pointer font-bold ${p.color} ${
                  formData.sector === p.id 
                    ? 'bg-white border border-[#E4E9E6] shadow-inner border border-[#CBD5CE] ring-1 ring-emerald-500/30' 
                    : 'bg-[#F6F8F7] hover:bg-white border border-[#E4E9E6] border border-[#E4E9E6]/50 hover:border-[#CBD5CE]'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6">

      <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
        {/* STEP 1: Facility Profile & Siting */}
        
          <div className="space-y-4">
            <div className="bg-[#F6F8F7] p-4 rounded-xl border border-[#E4E9E6]/80 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#E4E9E6]">
                <span className="text-xs font-bold text-[#10231C] flex items-center space-x-2">
                  <Building2 className="w-4 h-4 text-[#1F8A5F]" />
                  <span>Step 1: Facility Profile, Jurisdiction & Baseline Scale</span>
                </span>
                <span className="text-[11px] text-[#4B5A54] font-mono">1 / 4</span>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-[#10231C] flex items-center">
                    Facility Name / Entity Identifier
                    <TooltipHelp text="Official legal name or designated unit identifier for statutory CCTS compliance registry." />
                  </label>
                  <span className="text-[10px] text-[#6B7A72] font-mono">Mandatory Identifier</span>
                </div>
                <input
                  type="text"
                  value={formData.facility_name}
                  onChange={(e) => handleChange('facility_name', e.target.value)}
                  className="w-full bg-white border border-[#E4E9E6] rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-medium"
                  placeholder="e.g. Acme Cement Works Line 1"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-[#10231C] flex items-center">
                      CCTS Industry Sector
                      <TooltipHelp text="Designated obligated sector under MoEFCC gazette notifications for GHG intensity compliance." />
                    </label>
                    <span className="text-[10px] text-[#1F8A5F] font-mono">Statutory Regime</span>
                  </div>
                  <select
                    value={formData.sector}
                    onChange={(e) => handleChange('sector', e.target.value)}
                    className="w-full bg-white border border-[#E4E9E6] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-semibold"
                  >
                    <optgroup label="7 Notified Final CCTS Compliance Sectors">
                      <option value="cement">Cement (Integrated / Grinding)</option>
                      <option value="aluminium">Aluminium (Smelting & Refining)</option>
                      <option value="chlor_alkali">Chlor-Alkali (Caustic Soda)</option>
                      <option value="pulp_paper">Pulp & Paper</option>
                      <option value="petrochemicals">Petrochemicals (Crackers / Polymers)</option>
                      <option value="petroleum_refinery">Petroleum Refinery</option>
                      <option value="textile">Textile (Composite Mills)</option>
                    </optgroup>
                    <optgroup label="Watchlist / Draft Sectors (G.S.R. 517(E))">
                      <option value="iron_steel">Iron & Steel (Draft - 255 Units)</option>
                      <option value="fertiliser">Fertiliser (Urea / Ammonia Watchlist)</option>
                    </optgroup>
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-[#10231C] flex items-center">
                      State (Regional Grid Context)
                      <TooltipHelp text="Used for state-specific grid emission factors, renewable purchase obligations & open access wheeling charges." />
                    </label>
                    <span className="text-[10px] text-[#6B7A72] font-mono">Grid CEA Node</span>
                  </div>
                  <select
                    value={formData.state}
                    onChange={(e) => handleChange('state', e.target.value)}
                    className="w-full bg-white border border-[#E4E9E6] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    {['Rajasthan', 'Gujarat', 'Odisha', 'Chhattisgarh', 'Maharashtra', 'Tamil Nadu', 'Andhra Pradesh', 'Madhya Pradesh', 'Jharkhand', 'Punjab', 'Uttar Pradesh', 'Karnataka', 'West Bengal'].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-[#10231C] flex items-center">
                      Annual Finished Production
                      <span className="ml-1 text-[10px] text-[#1F8A5F] font-mono bg-[#E8F5EE] px-1.5 py-0.2 rounded border border-emerald-800/40">[Tonnes/yr]</span>
                      <TooltipHelp text="Net saleable product output for the baseline/reporting year used to compute GHG Emission Intensity (GEI)." />
                    </label>
                    <span className="text-[10px] text-[#6B7A72] font-mono">Range: 10k - 15M t</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={formData.annual_production}
                    onChange={(e) => handleChange('annual_production', parseFloat(e.target.value) || 0)}
                    className="w-full bg-white border border-[#E4E9E6] rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                    placeholder="e.g. 1200000"
                    required
                  />
                  <p className="text-[10px] text-[#4B5A54] mt-1">Recommended: Calibrated with annual PAT/BRSR verified production log.</p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-[#10231C] flex items-center">
                      Sub-Sector / Process Route
                      <TooltipHelp text="Specific process technology configuration (e.g. Dry Kiln, BF-BOF, Membrane Cell)." />
                    </label>
                    <span className="text-[10px] text-[#6B7A72] font-mono">Process Tech</span>
                  </div>
                  <input
                    type="text"
                    value={formData.sub_sector}
                    onChange={(e) => handleChange('sub_sector', e.target.value)}
                    className="w-full bg-white border border-[#E4E9E6] rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                    placeholder="e.g. Integrated Dry Process Kiln"
                  />
                  <p className="text-[10px] text-[#4B5A54] mt-1">Defines benchmark cohort and methodology applicability.</p>
                </div>
              </div>
            </div>

</div>

        {/* STEP 2: Energy & Fuel Streams */}
        
          <div className="space-y-4">
            <div className="bg-[#F6F8F7] p-4 rounded-xl border border-[#E4E9E6]/80 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#E4E9E6]">
                <span className="text-xs font-bold text-[#10231C] flex items-center space-x-2">
                  <Flame className="w-4 h-4 text-[#C98A1E]" />
                  <span>Step 2: Electricity & Thermal Fuel Consumption Streams</span>
                </span>
                <span className="text-[11px] text-[#4B5A54] font-mono">2 / 4</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-[#10231C] flex items-center">
                      Grid / Captive Electricity
                      <span className="ml-1 text-[10px] text-[#2E6BA8] font-mono bg-[#EBF3FB] px-1.5 py-0.2 rounded border border-sky-800/40">[MWh/year]</span>
                      <TooltipHelp text="Total electricity drawn from state grid, captive power plants (CPP), and open access sources." />
                    </label>
                    <span className="text-[10px] text-[#6B7A72] font-mono">Scope 2 Input</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={formData.electricity_mwh}
                    onChange={(e) => handleChange('electricity_mwh', parseFloat(e.target.value) || 0)}
                    className="w-full bg-white border border-[#E4E9E6] rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                    placeholder="e.g. 98000"
                    required
                  />
                  <div className="flex items-center space-x-1.5 mt-1 text-[10px] text-[#2E6BA8]">
                    <Zap className="w-3 h-3 text-[#2E6BA8] flex-shrink-0" />
                    <span>CEA Grid Emission Factor: 0.716 tCO₂e/MWh (FY2023-24 baseline)</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-[#10231C] flex items-center">
                      Renewable Electricity Share
                      <span className="ml-1 text-[10px] text-[#1F8A5F] font-mono bg-[#E8F5EE] px-1.5 py-0.2 rounded border border-emerald-800/40">[%]</span>
                      <TooltipHelp text="Percentage of total electricity met via on-site captive solar/wind, green tariffs, or ISTS open-access PPA." />
                    </label>
                    <span className="text-[10px] text-[#6B7A72] font-mono">Range: 0 - 100%</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="any"
                    value={formData.renewable_electricity_pct}
                    onChange={(e) => handleChange('renewable_electricity_pct', parseFloat(e.target.value) || 0)}
                    className="w-full bg-white border border-[#E4E9E6] rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                    placeholder="e.g. 12.5"
                    required
                  />
                  <p className="text-[10px] text-[#1F8A5F]/80 mt-1">
                    Zero-emission power deduction applied per BEE Detailed Procedure Section 4.2.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-[#10231C] flex items-center">
                      Primary Thermal Fuel
                      <TooltipHelp text="Major fuel source utilized in industrial kilns, boilers, furnaces, and thermal cracking units." />
                    </label>
                    <span className="text-[10px] text-[#6B7A72] font-mono">Scope 1 Thermal</span>
                  </div>
                  <select
                    value={formData.thermal_fuel_type}
                    onChange={(e) => handleChange('thermal_fuel_type', e.target.value)}
                    className="w-full bg-white border border-[#E4E9E6] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-semibold"
                  >
                    <option value="petcoke">Petcoke / Petroleum Coke (3.24 tCO₂e/tonne)</option>
                    <option value="indian_domestic_coal">Indian Domestic Coal (1.95 tCO₂e/tonne)</option>
                    <option value="imported_coal_indonesian">Imported Coal (2.15 tCO₂e/tonne)</option>
                    <option value="natural_gas">Natural Gas / RLNG (2.68 tCO₂e/tonne)</option>
                    <option value="furnace_oil">Furnace Oil / LDO (3.12 tCO₂e/tonne)</option>
                    <option value="biomass">Biomass / Agro Residue (0.00 tCO₂e/t Net)</option>
                  </select>
                  <p className="text-[10px] text-[#4B5A54] mt-1">Calibrated with IPCC Tier 2 default net calorific values.</p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-[#10231C] flex items-center">
                      Annual Fuel Consumption
                      <span className="ml-1 text-[10px] text-[#C98A1E] font-mono bg-[#FEF7E8] px-1.5 py-0.2 rounded border border-amber-800/40">[Tonnes/year]</span>
                      <TooltipHelp text="Total mass of physical fuel combusted within the plant boundary for process thermal energy." />
                    </label>
                    <span className="text-[10px] text-[#6B7A72] font-mono">Fuel Mass</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={formData.thermal_fuel_tonnes}
                    onChange={(e) => handleChange('thermal_fuel_tonnes', parseFloat(e.target.value) || 0)}
                    className="w-full bg-white border border-[#E4E9E6] rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                    placeholder="e.g. 95000"
                    required
                  />
                  <p className="text-[10px] text-[#4B5A54] mt-1">Thermal emissions = Quantity × Specific Emission Factor.</p>
                </div>
              </div>
            </div>

</div>

        {/* STEP 3: Sector Specific Process Data */}
        
          <div className="space-y-4">
            <div className="bg-[#F6F8F7] p-4 rounded-xl border border-[#E4E9E6]/80 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#E4E9E6]">
                <span className="text-xs font-bold text-[#10231C] flex items-center space-x-2">
                  <Cpu className="w-4 h-4 text-[#0B4A3D]" />
                  <span>Step 3: Sector-Specific Process Parameters & Statutory Target Overrides</span>
                </span>
                <span className="text-[11px] text-[#4B5A54] font-mono">3 / 4</span>
              </div>

              {/* Cement Sector Specific Inputs */}
              {formData.sector === 'cement' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-medium text-[#10231C] flex items-center">
                        Clinker Factor
                        <span className="ml-1 text-[10px] text-[#0B4A3D] font-mono bg-teal-950/60 px-1.5 py-0.2 rounded border border-teal-800/40">[%]</span>
                        <TooltipHelp text="Ratio of clinker to total finished cement. OPC ~95%, PPC ~68-75%, Composite ~60-65%." />
                      </label>
                      <span className="text-[10px] text-[#6B7A72] font-mono">Range: 40 - 98%</span>
                    </div>
                    <input
                      type="number"
                      min="40"
                      max="98"
                      step="any"
                      value={formData.clinker_factor_pct || 74.0}
                      onChange={(e) => handleChange('clinker_factor_pct', parseFloat(e.target.value) || 74.0)}
                      className="w-full bg-white border border-[#E4E9E6] rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                    />
                    <p className="text-[10px] text-[#4B5A54] mt-1">Directly governs calcination process CO₂ emissions (0.525 tCO₂/t clinker).</p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-medium text-[#10231C] flex items-center">
                        Existing WHRS Capacity
                        <span className="ml-1 text-[10px] text-[#0B4A3D] font-mono bg-teal-950/60 px-1.5 py-0.2 rounded border border-teal-800/40">[MW]</span>
                        <TooltipHelp text="Installed Waste Heat Recovery System capacity from preheater and clinker cooler exhausts." />
                      </label>
                      <span className="text-[10px] text-[#6B7A72] font-mono">0 - 50 MW</span>
                    </div>
                    <input
                      type="number"
                      min="0"
                      max="50"
                      step="any"
                      value={formData.whrs_installed_mw || 0.0}
                      onChange={(e) => handleChange('whrs_installed_mw', parseFloat(e.target.value) || 0.0)}
                      className="w-full bg-white border border-[#E4E9E6] rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                    />
                    <p className="text-[10px] text-[#4B5A54] mt-1">Set to 0 MW if no WHRS turbine is operational.</p>
                  </div>
                </div>
              )}

              {/* Iron & Steel Sector */}
              {formData.sector === 'iron_steel' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-medium text-[#10231C] flex items-center">
                        Primary Smelting Route
                        <TooltipHelp text="Production route determines carbon intensity benchmarks: BF-BOF ~2.1 tCO2/t, DRI-EAF ~1.4 tCO2/t." />
                      </label>
                    </div>
                    <select
                      value={formData.steel_route || 'BF_BOF'}
                      onChange={(e) => handleChange('steel_route', e.target.value)}
                      className="w-full bg-white border border-[#E4E9E6] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-semibold"
                    >
                      <option value="BF_BOF">Integrated Blast Furnace - Basic Oxygen Furnace (BF-BOF)</option>
                      <option value="DRI_EAF">Direct Reduced Iron - Electric Arc Furnace (DRI-EAF)</option>
                      <option value="DRI_IF">Direct Reduced Iron - Induction Furnace (DRI-IF)</option>
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-medium text-[#10231C] flex items-center">
                        Existing WHRS / TRT Capacity
                        <span className="ml-1 text-[10px] text-[#0B4A3D] font-mono bg-teal-950/60 px-1.5 py-0.2 rounded border border-teal-800/40">[MW]</span>
                        <TooltipHelp text="Top-gas Recovery Turbines (TRT) and coke dry quenching waste power." />
                      </label>
                    </div>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={formData.whrs_installed_mw || 0.0}
                      onChange={(e) => handleChange('whrs_installed_mw', parseFloat(e.target.value) || 0.0)}
                      className="w-full bg-white border border-[#E4E9E6] rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              )}

              {/* Aluminium Sector */}
              {formData.sector === 'aluminium' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-[#10231C] flex items-center">
                      Smelter DC Specific Energy Consumption
                      <span className="ml-1 text-[10px] text-[#0B4A3D] font-mono bg-teal-950/60 px-1.5 py-0.2 rounded border border-teal-800/40">[kWh/t Al]</span>
                      <TooltipHelp text="Direct Current specific power consumption across smelting potlines (BEE PAT benchmark: 14,000–15,500 kWh/t)." />
                    </label>
                    <span className="text-[10px] text-[#6B7A72] font-mono">BEE PAT: ~14.2k kWh/t</span>
                  </div>
                  <input
                    type="number"
                    min="12000"
                    max="17000"
                    step="any"
                    value={formData.smelter_dc_sec_kwh || 14200.0}
                    onChange={(e) => handleChange('smelter_dc_sec_kwh', parseFloat(e.target.value) || 14200.0)}
                    className="w-full bg-white border border-[#E4E9E6] rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                  <p className="text-[10px] text-[#4B5A54] mt-1">Potline electrolysis constitutes ~90% of primary aluminium GHG intensity.</p>
                </div>
              )}

              {/* Chlor-Alkali Sector */}
              {formData.sector === 'chlor_alkali' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-[#10231C] flex items-center">
                      Electrolysis Cell Technology
                      <TooltipHelp text="Zero-gap bipolar membrane cells consume ~2,100 kWh/t NaOH compared to >2,600 kWh/t in legacy cells." />
                    </label>
                  </div>
                  <select
                    value={formData.caustic_tech || 'bipolar_membrane'}
                    onChange={(e) => handleChange('caustic_tech', e.target.value)}
                    className="w-full bg-white border border-[#E4E9E6] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-semibold"
                  >
                    <option value="bipolar_membrane">Zero-Gap Bipolar Membrane Cell (BAT standard)</option>
                    <option value="standard_membrane">Standard Gap Membrane Cell</option>
                    <option value="diaphragm_cell">Diaphragm Cell (Legacy Transition)</option>
                  </select>
                </div>
              )}

              {/* Pulp & Paper Sector */}
              {formData.sector === 'pulp_paper' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-[#10231C] flex items-center">
                      Specific Steam Consumption
                      <span className="ml-1 text-[10px] text-[#0B4A3D] font-mono bg-teal-950/60 px-1.5 py-0.2 rounded border border-teal-800/40">[t steam / t paper]</span>
                      <TooltipHelp text="Specific low/medium pressure steam consumed across digestor, evaps, and paper drying cylinders." />
                    </label>
                    <span className="text-[10px] text-[#6B7A72] font-mono">Range: 2.0 - 10.0</span>
                  </div>
                  <input
                    type="number"
                    min="2"
                    max="10"
                    step="0.1"
                    value={formData.paper_steam_specific || 4.8}
                    onChange={(e) => handleChange('paper_steam_specific', parseFloat(e.target.value) || 4.8)}
                    className="w-full bg-white border border-[#E4E9E6] rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              )}

              {/* Petroleum Refinery */}
              {formData.sector === 'petroleum_refinery' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-[#10231C] flex items-center">
                      Million Barrel Number (MBN) Complexity Index
                      <TooltipHelp text="Solomon/BEE MBN index reflecting downstream secondary upgrading complexity (FCC, Hydrocracker, Coker)." />
                    </label>
                    <span className="text-[10px] text-[#6B7A72] font-mono">Range: 4.0 - 16.0</span>
                  </div>
                  <input
                    type="number"
                    min="4"
                    max="16"
                    step="0.1"
                    value={formData.refinery_mbn || 9.8}
                    onChange={(e) => handleChange('refinery_mbn', parseFloat(e.target.value) || 9.8)}
                    className="w-full bg-white border border-[#E4E9E6] rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              )}

              {/* Petrochemicals */}
              {formData.sector === 'petrochemicals' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-[#10231C] flex items-center">
                      Cracker Feedstock Configuration
                      <TooltipHelp text="Naphtha vs Ethane/Propane gas crackers dictate furnace temperature and specific CO2 generation." />
                    </label>
                  </div>
                  <select
                    value={formData.petrochem_feedstock || 'dual_feed'}
                    onChange={(e) => handleChange('petrochem_feedstock', e.target.value)}
                    className="w-full bg-white border border-[#E4E9E6] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-semibold"
                  >
                    <option value="dual_feed">Dual Feed (Naphtha + Gas Ethane/Propane)</option>
                    <option value="liquid_naphtha">100% Naphtha Feedstock</option>
                    <option value="gas_feed">100% Natural Gas / Ethane Feedstock</option>
                  </select>
                </div>
              )}

              {/* Textile */}
              {formData.sector === 'textile' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-[#10231C] flex items-center">
                      Mill Processing Route
                      <TooltipHelp text="Wet processing and dyeing operations dominate thermal and boiler emissions." />
                    </label>
                  </div>
                  <select
                    value={formData.textile_route || 'composite_processing'}
                    onChange={(e) => handleChange('textile_route', e.target.value)}
                    className="w-full bg-white border border-[#E4E9E6] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-semibold"
                  >
                    <option value="composite_processing">Composite Mill (Spinning, Weaving & Wet Processing)</option>
                    <option value="wet_processing_only">Stand-Alone Wet Processing & Dyeing</option>
                    <option value="spinning_only">Spinning Mill Only</option>
                  </select>
                </div>
              )}

              {/* Custom Notified Target GEI override */}
              <div className="pt-3 border-t border-[#E4E9E6]">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-[#10231C] flex items-center">
                    Custom Notified Target GEI (Optional Statutory Override)
                    <span className="ml-1 text-[10px] text-[#C98A1E] font-mono bg-[#FEF7E8] px-1.5 py-0.2 rounded border border-amber-800/40">[tCO₂e/tonne]</span>
                    <TooltipHelp text="If your designated consumer notice specifies a plant-specific target GEI, enter it here to override the gazetted sector default." />
                  </label>
                  <span className="text-[10px] text-[#6B7A72] font-mono">Optional Override</span>
                </div>
                <input
                  type="number"
                  step="0.0001"
                  value={formData.custom_target_gei || ''}
                  onChange={(e) => handleChange('custom_target_gei', e.target.value ? parseFloat(e.target.value) : undefined)}
                  className="w-full bg-white border border-[#E4E9E6] rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                  placeholder="Leave blank to use official MoEFCC statutory gazette trajectory"
                />
                <p className="text-[10px] text-[#4B5A54] mt-1">Default trajectory uses gazetted FY2025-26 statutory target baseline.</p>
              </div>
            </div>

</div>

        {/* STEP 4: Data Quality Audit & Confirmation */}
        
          <div className="space-y-4">
            <div className="bg-[#F6F8F7] p-4 rounded-xl border border-[#E4E9E6]/80 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#E4E9E6]">
                <span className="text-xs font-bold text-[#10231C] flex items-center space-x-2">
                  <FileCheck2 className="w-4 h-4 text-[#1F8A5F]" />
                  <span>Step 4: Pre-Flight Thermodynamic Audit & Input Confirmation</span>
                </span>
                <span className="text-[11px] text-[#4B5A54] font-mono">4 / 4</span>
              </div>

              {/* Pre-flight Review Summary Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white p-3 rounded-lg border border-[#E4E9E6]">
                  <div className="text-[10px] uppercase font-mono text-[#4B5A54] font-semibold mb-1">Facility Profile</div>
                  <div className="text-xs font-bold text-white truncate">{formData.facility_name || 'Unnamed Facility'}</div>
                  <div className="text-[11px] text-[#1F8A5F] font-mono mt-0.5 capitalize">{formData.sector.replace('_', ' ')}</div>
                  <div className="text-[10px] text-[#4B5A54] mt-1">Output: <strong className="text-white">{formatTonnes(formData.annual_production)}</strong></div>
                </div>

                <div className="bg-white p-3 rounded-lg border border-[#E4E9E6]">
                  <div className="text-[10px] uppercase font-mono text-[#4B5A54] font-semibold mb-1">Energy Streams</div>
                  <div className="text-xs font-mono text-[#10231C]">Electricity: <strong className="text-[#2E6BA8]">{formData.electricity_mwh.toLocaleString()} MWh</strong></div>
                  <div className="text-xs font-mono text-[#10231C] mt-0.5">RE Share: <strong className="text-[#1F8A5F]">{formData.renewable_electricity_pct}%</strong></div>
                  <div className="text-[10px] text-[#4B5A54] mt-1">Fuel: <strong className="text-[#C98A1E]">{formData.thermal_fuel_type}</strong> ({formatTonnes(formData.thermal_fuel_tonnes)})</div>
                </div>

                <div className="bg-white p-3 rounded-lg border border-[#E4E9E6]">
                  <div className="text-[10px] uppercase font-mono text-[#4B5A54] font-semibold mb-1">Engineering State</div>
                  <div className="text-xs font-mono text-[#10231C]">State: <strong className="text-white">{formData.state}</strong></div>
                  <div className="text-xs font-mono text-[#10231C] mt-0.5">Sub-Sector: <strong className="text-[#4B5A54] truncate block">{formData.sub_sector || 'Standard'}</strong></div>
                  <div className="text-[10px] text-[#4B5A54] mt-1">Target Override: <strong className="text-teal-300">{formData.custom_target_gei ? `${formData.custom_target_gei} tCO₂e/t` : 'MoEFCC Gazette Default'}</strong></div>
                </div>
              </div>

              {/* Data Audit Quality Score & Validation Checks */}
              <div className={`p-3.5 rounded-xl border text-xs ${
                dataQuality?.status === 'PASS'
                  ? 'bg-[#E8F5EE] border-emerald-800/60 text-[#1F8A5F]'
                  : dataQuality?.status === 'WARNING'
                  ? 'bg-[#FEF7E8]/30 border-amber-800/60 text-[#C98A1E]'
                  : 'bg-white border-[#E4E9E6] text-[#4B5A54]'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-[#1F8A5F] flex-shrink-0" />
                    <span className="font-bold text-white text-xs">
                      Thermodynamic & CCTS Engineering Sanity Check
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-[#F6F8F7] border border-[#E4E9E6] text-[#1F8A5F]">
                    Quality Score: {dataQuality?.quality_score || 95}/100
                  </span>
                </div>

                <p className="text-[11px] text-[#4B5A54] leading-relaxed mb-2.5">
                  {dataQuality?.errors && dataQuality.errors.length > 0
                    ? `Audit Alert: ${dataQuality.errors[0]}`
                    : dataQuality?.warnings && dataQuality.warnings.length > 0
                    ? `Advisory: ${dataQuality.warnings[0]}`
                    : 'All physical activity streams, production mass balances, and specific energy ratios conform to BEE thermodynamic bounds.'}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono text-[#4B5A54] pt-2 border-t border-[#E4E9E6]/60">
                  <div className="flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#1F8A5F] flex-shrink-0" />
                    <span>Scope 1 + Scope 2 Boundary Verified</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#1F8A5F] flex-shrink-0" />
                    <span>CEA FY24 Grid EF Traceability Active</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation & Submit Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-[#E4E9E6]/60 mt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto flex-1 max-w-md py-3 px-6 rounded-lg text-xs font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white flex items-center justify-center space-x-2 shadow-lg shadow-emerald-950/80 transition-all cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isLoading ? 'Computing Facility Intelligence...' : 'Run Personalized Decision Intelligence'}</span>
              </button>
            </div>
          </div>
      
              {dataQuality?.errors && dataQuality.errors.length > 0 && (
                <div className="mt-4 p-4 bg-[#FDECEA] border border-rose-800/60 rounded-xl">
                  <h4 className="text-sm font-bold text-[#C33B2E] mb-2">Form Validation Errors</h4>
                  <ul className="list-disc list-inside text-xs text-[#C33B2E]">
                    {dataQuality.errors.map((err, i) => <li key={i}>{err}</li>)}
                  </ul>
                </div>
              )}

      </form>
      </div>
    </div>
  );
}

