'use client';

import React, { useState } from 'react';
import { Building2, Sparkles, AlertCircle, CheckCircle2, ShieldAlert, Cpu, Flame, Zap, RotateCcw } from 'lucide-react';
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
}

interface FacilityInputFormProps {
  formData: FacilityFormData;
  onChange: (data: FacilityFormData) => void;
  onSubmit: () => void;
  isLoading?: boolean;
  dataQuality?: any;
}

export function FacilityInputForm({
  formData,
  onChange,
  onSubmit,
  isLoading,
  dataQuality
}: FacilityInputFormProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'energy' | 'process'>('profile');

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
    }
  };

  return (
    <div className="glass-panel rounded-xl p-5 border-slate-800">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800/60">
              <Building2 className="w-4 h-4" />
            </span>
            <h3 className="text-base font-bold text-white tracking-tight">Facility Data Entry Panel</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Enter your plant operational data for personalized carbon & financial intelligence</p>
        </div>

        {/* Quick Sample Load Buttons */}
        <div className="flex items-center space-x-1.5">
          <span className="text-[11px] text-slate-500 font-medium mr-1">Load Demo:</span>
          <button
            type="button"
            onClick={() => handleLoadPreset('cement')}
            className="text-[11px] font-mono px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-slate-700 transition-colors"
          >
            Cement
          </button>
          <button
            type="button"
            onClick={() => handleLoadPreset('iron_steel')}
            className="text-[11px] font-mono px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-sky-400 border border-slate-700 transition-colors"
          >
            Steel (8th)
          </button>
          <button
            type="button"
            onClick={() => handleLoadPreset('aluminium')}
            className="text-[11px] font-mono px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-700 transition-colors"
          >
            Aluminium
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-4">
        {[
          { id: 'profile', label: '1. Plant Profile & Production', icon: Building2 },
          { id: 'energy', label: '2. Electricity & Fuel Streams', icon: Flame },
          { id: 'process', label: '3. Sector Process Data', icon: Cpu },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveTab(t.id as any)}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all ${
              activeTab === t.id
                ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 bg-slate-950/60'
            }`}
          >
            <t.icon className="w-3.5 h-3.5" />
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
        {/* Tab 1: Profile & Production */}
        {activeTab === 'profile' && (
          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Facility Name / Entity Identifier</label>
              <input
                type="text"
                value={formData.facility_name}
                onChange={(e) => handleChange('facility_name', e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                placeholder="e.g. Acme Cement Works Line 1"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">CCTS Industry Sector</label>
                <select
                  value={formData.sector}
                  onChange={(e) => handleChange('sector', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-semibold"
                >
                  <optgroup label="8 Notified CCTS Compliance Sectors">
                    <option value="cement">Cement (Integrated / Grinding)</option>
                    <option value="iron_steel">Iron & Steel (BF-BOF / DRI-EAF)</option>
                    <option value="aluminium">Aluminium (Smelting & Refining)</option>
                    <option value="chlor_alkali">Chlor-Alkali (Caustic Soda)</option>
                    <option value="pulp_paper">Pulp & Paper</option>
                    <option value="petrochemicals">Petrochemicals (Crackers / Polymers)</option>
                    <option value="petroleum_refinery">Petroleum Refinery</option>
                    <option value="textile">Textile (Composite Mills)</option>
                  </optgroup>
                  <optgroup label="Watchlist Scope">
                    <option value="fertiliser">Fertiliser (Urea / Ammonia)</option>
                  </optgroup>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">State (Regional Grid Context)</label>
                <select
                  value={formData.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  {['Rajasthan', 'Gujarat', 'Odisha', 'Chhattisgarh', 'Maharashtra', 'Tamil Nadu', 'Andhra Pradesh', 'Madhya Pradesh', 'Jharkhand', 'Punjab', 'Uttar Pradesh'].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Annual Finished Production (Tonnes)</label>
                <input
                  type="number"
                  min="1"
                  step="any"
                  value={formData.annual_production}
                  onChange={(e) => handleChange('annual_production', parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Sub-Sector / Route</label>
                <input
                  type="text"
                  value={formData.sub_sector}
                  onChange={(e) => handleChange('sub_sector', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  placeholder="e.g. Integrated Dry Process Kiln"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Energy Streams */}
        {activeTab === 'energy' && (
          <div className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Grid / Captive Electricity (MWh/year)</label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={formData.electricity_mwh}
                  onChange={(e) => handleChange('electricity_mwh', parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Renewable Electricity Share (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="any"
                  value={formData.renewable_electricity_pct}
                  onChange={(e) => handleChange('renewable_electricity_pct', parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Primary Thermal Fuel</label>
                <select
                  value={formData.thermal_fuel_type}
                  onChange={(e) => handleChange('thermal_fuel_type', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-semibold"
                >
                  <option value="petcoke">Petcoke (Petroleum Coke)</option>
                  <option value="indian_domestic_coal">Indian Domestic Coal</option>
                  <option value="imported_coal_indonesian">Imported Coal (Indonesian/South African)</option>
                  <option value="natural_gas">Natural Gas / RLNG</option>
                  <option value="furnace_oil">Furnace Oil / LDO</option>
                  <option value="biomass">Biomass / Agricultural Residue</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Annual Fuel Consumption (Tonnes)</label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={formData.thermal_fuel_tonnes}
                  onChange={(e) => handleChange('thermal_fuel_tonnes', parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Sector Process Data */}
        {activeTab === 'process' && (
          <div className="space-y-3.5">
            {formData.sector === 'cement' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Clinker Factor (%)</label>
                  <input
                    type="number"
                    min="40"
                    max="98"
                    step="any"
                    value={formData.clinker_factor_pct || 74.0}
                    onChange={(e) => handleChange('clinker_factor_pct', parseFloat(e.target.value) || 74.0)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                  <p className="text-[10px] text-slate-500 mt-0.5">Ratio of clinker to total cement produced (OPC ~95%, PPC ~70%)</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Existing WHRS Capacity (MW)</label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    step="any"
                    value={formData.whrs_installed_mw || 0.0}
                    onChange={(e) => handleChange('whrs_installed_mw', parseFloat(e.target.value) || 0.0)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                  <p className="text-[10px] text-slate-500 mt-0.5">0 MW if no Waste Heat Recovery is currently installed</p>
                </div>
              </div>
            )}

            {formData.sector === 'aluminium' && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Smelter DC Specific Power Consumption (kWh/t Al)</label>
                <input
                  type="number"
                  min="12000"
                  max="17000"
                  step="any"
                  value={formData.smelter_dc_sec_kwh || 14200.0}
                  onChange={(e) => handleChange('smelter_dc_sec_kwh', parseFloat(e.target.value) || 14200.0)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
            )}

            {formData.sector === 'iron_steel' && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Primary Smelting Route</label>
                <select
                  value={formData.steel_route || 'BF_BOF'}
                  onChange={(e) => handleChange('steel_route', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-semibold"
                >
                  <option value="BF_BOF">Integrated Blast Furnace - Basic Oxygen Furnace (BF-BOF)</option>
                  <option value="DRI_EAF">Direct Reduced Iron - Electric Arc Furnace (DRI-EAF)</option>
                  <option value="DRI_IF">Direct Reduced Iron - Induction Furnace (DRI-IF)</option>
                </select>
              </div>
            )}

            {/* Custom target override */}
            <div className="pt-2 border-t border-slate-800">
              <label className="block text-xs font-medium text-slate-300 mb-1">Custom Notified Target GEI (Optional Override)</label>
              <input
                type="number"
                step="0.001"
                value={formData.custom_target_gei || ''}
                onChange={(e) => handleChange('custom_target_gei', e.target.value ? parseFloat(e.target.value) : undefined)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                placeholder="Leave blank to use official MoEFCC statutory default"
              />
            </div>
          </div>
        )}

        {/* Data Quality Feedback Banner */}
        {dataQuality && (
          <div className={`mt-4 p-3 rounded-lg border text-xs flex items-center justify-between ${
            dataQuality.status === 'PASS'
              ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
              : dataQuality.status === 'WARNING'
              ? 'bg-amber-950/40 border-amber-800/60 text-amber-300'
              : 'bg-rose-950/40 border-rose-800/60 text-rose-300'
          }`}>
            <div className="flex items-center space-x-2">
              {dataQuality.status === 'PASS' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              ) : (
                <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0" />
              )}
              <span>
                <strong>Data Audit:</strong> {dataQuality.errors.length > 0 ? dataQuality.errors[0] : (dataQuality.warnings.length > 0 ? dataQuality.warnings[0] : 'All physical activity inputs conform to engineering bounds.')}
              </span>
            </div>
            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-slate-900">
              Score: {dataQuality.quality_score}/100
            </span>
          </div>
        )}

        {/* Submit & Calculate Button */}
        <div className="mt-5">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-lg text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white flex items-center justify-center space-x-2 shadow-lg shadow-emerald-950/60 transition-all cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isLoading ? 'Analyzing Facility Intelligence...' : 'Run Personalized Decision Intelligence'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
