'use client';

/**
 * FacilityInputForm v2.2 — 8-Step Dual-Domain Wizard
 * ─────────────────────────────────────────────────────────
 * Implements AANGARA_Facility_Dashboard_Input_Segregation_v2.2 spec §29
 *
 * STEP 1 — Facility & Legal Identity          [SHARED]
 * STEP 2 — Regulatory Applicability           [SHARED]
 * STEP 3 — Production & Product Mix           [SHARED]
 * STEP 4 — Carbon Data                        [CARBON 🔵]
 * STEP 5 — Business Twin                      [BUSINESS 🟡]
 * STEP 6 — Sector Process Engineering         [BOTH]
 * STEP 7 — Project / CAPEX / Finance          [BUSINESS 🟡]
 * STEP 8 — Scenario & Decision Preferences    [BUSINESS 🟡]
 *
 * Backward compatible: v1 preset data auto-converted to v2 on load.
 */

import React, { useState, useCallback } from 'react';
import {
  Building2, Sparkles, Cpu, Flame, Zap, ArrowRight, ArrowLeft,
  CheckCircle2, HelpCircle, FileCheck2, Layers, ShieldCheck,
  ShieldAlert, Factory, BarChart2, DollarSign, Settings, Target,
  ChevronRight,
} from 'lucide-react';

// v2 types & utilities
import {
  FacilityInputV2,
  SectorProcessInputsV2,
  ScenarioInputsV2,
  ManagementObjective,
  BusinessTwinInputsV2,
  convertV1ToV2,
  createBlankFacilityV2,
  type FacilityFormDataV1,
} from '@/types/facility-v2';

// New sub-components
import { ElectricityLedger } from './ElectricityLedger';
import { FuelStreamLedger } from './FuelStreamLedger';
import { SectorProcessFields } from './SectorProcessFields';
import { BusinessTwinPanel } from './BusinessTwinPanel';
import { ScenarioDecisionStep } from './ScenarioDecisionStep';

// ─── Keep v1 export for backward compat with existing page.tsx ───
export type { FacilityFormDataV1 as FacilityFormData };

// ─────────────────────────────────────────────
// Shared helpers
// ─────────────────────────────────────────────

const Tip = ({ text }: { text: string }) => (
  <span className="relative inline-flex items-center ml-1 cursor-help group">
    <HelpCircle className="w-3.5 h-3.5 text-[#6B7A72] hover:text-[#4B5A54] transition-colors" />
    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block w-56 p-2 rounded bg-white border border-[#E4E9E6] text-[11px] text-[#4B5A54] font-normal leading-tight z-50 shadow-2xl pointer-events-none">
      {text}
    </span>
  </span>
);

const inputCls = "w-full bg-white border border-[#E4E9E6] rounded-lg px-3 py-2 text-xs text-[#10231C] placeholder-[#6B7A72] focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-medium";
const selectCls = "w-full bg-white border border-[#E4E9E6] rounded-lg px-3 py-2 text-xs text-[#10231C] focus:outline-none focus:border-emerald-500 font-semibold";

// Domain pill badge
const DomainBadge = ({ domain }: { domain: 'CARBON' | 'BUSINESS' | 'SHARED' }) => {
  const styles = {
    CARBON: { cls: 'bg-[#E8F5EE] text-[#0B4A3D] border border-[#0B4A3D]/25', label: '🔵 CARBON / REGULATORY' },
    BUSINESS: { cls: 'bg-amber-50 text-amber-700 border border-amber-200', label: '🟡 BUSINESS TWIN' },
    SHARED: { cls: 'bg-[#F6F8F7] text-[#4B5A54] border border-[#E4E9E6]', label: '⚪ SHARED' },
  };
  const s = styles[domain];
  return (
    <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg ${s.cls}`}>{s.label}</span>
  );
};

// Presets (v1 flat data — auto-converted on preset load)
const PRESETS: FacilityFormDataV1[] = [
  { facility_name: 'Western Rajasthan Cement Works', sector: 'cement', sub_sector: 'Integrated Plant (OPC/PPC)', state: 'Rajasthan', annual_production: 1200000, production_unit: 'tonnes', electricity_mwh: 98000, renewable_electricity_pct: 12.5, thermal_fuel_type: 'petcoke', thermal_fuel_tonnes: 95000, clinker_factor_pct: 74, whrs_installed_mw: 0 },
  { facility_name: 'Kalinganagar Integrated Steel Plant', sector: 'iron_steel', sub_sector: 'Integrated BF-BOF Route', state: 'Odisha', annual_production: 2500000, production_unit: 'tonnes', electricity_mwh: 1850000, renewable_electricity_pct: 6, thermal_fuel_type: 'indian_domestic_coal', thermal_fuel_tonnes: 2100000, steel_route: 'BF_BOF', whrs_installed_mw: 0 },
  { facility_name: 'Mahan Smelter Complex', sector: 'aluminium', sub_sector: 'Primary Smelting', state: 'Madhya Pradesh', annual_production: 350000, production_unit: 'tonnes', electricity_mwh: 4900000, renewable_electricity_pct: 8, thermal_fuel_type: 'indian_domestic_coal', thermal_fuel_tonnes: 600000, smelter_dc_sec_kwh: 14200, whrs_installed_mw: 0 },
  { facility_name: 'Dahej Caustic Soda Chemical Complex', sector: 'chlor_alkali', sub_sector: 'Membrane Cell Caustic Soda', state: 'Gujarat', annual_production: 240000, production_unit: 'tonnes', electricity_mwh: 540000, renewable_electricity_pct: 15, thermal_fuel_type: 'natural_gas', thermal_fuel_tonnes: 28000, caustic_tech: 'bipolar_membrane' },
  { facility_name: 'Bhadrachalam Integrated Paperboard Mills', sector: 'pulp_paper', sub_sector: 'Integrated Chemical Pulp & Paper', state: 'Andhra Pradesh', annual_production: 380000, production_unit: 'tonnes', electricity_mwh: 360000, renewable_electricity_pct: 25, thermal_fuel_type: 'biomass', thermal_fuel_tonnes: 185000, paper_steam_specific: 4.8 },
  { facility_name: 'Jamnagar Coastal Complex', sector: 'petroleum_refinery', sub_sector: 'High-Complexity Coastal Refinery', state: 'Gujarat', annual_production: 7500000, production_unit: 'tonnes', electricity_mwh: 450000, renewable_electricity_pct: 5, thermal_fuel_type: 'natural_gas', thermal_fuel_tonnes: 620000, refinery_mbn: 9.8 },
  { facility_name: 'Nagothane Olefins & Polymers Unit', sector: 'petrochemicals', sub_sector: 'Dual-Feed Naphtha/Gas Cracker', state: 'Maharashtra', annual_production: 850000, production_unit: 'tonnes', electricity_mwh: 580000, renewable_electricity_pct: 10, thermal_fuel_type: 'natural_gas', thermal_fuel_tonnes: 140000, petrochem_feedstock: 'dual_feed' },
  { facility_name: 'Tirupur Composite Processing Mills', sector: 'textile', sub_sector: 'Integrated Spinning, Weaving & Wet Processing', state: 'Tamil Nadu', annual_production: 45000, production_unit: 'tonnes', electricity_mwh: 180000, renewable_electricity_pct: 35, thermal_fuel_type: 'biomass', thermal_fuel_tonnes: 22000, textile_route: 'composite_processing' },
];

const PRESET_META = [
  { id: 'cement', label: 'Cement', draft: false },
  { id: 'iron_steel', label: 'Steel', draft: true },
  { id: 'aluminium', label: 'Aluminium', draft: false },
  { id: 'chlor_alkali', label: 'Chlor-Alkali', draft: false },
  { id: 'pulp_paper', label: 'Paper', draft: false },
  { id: 'petroleum_refinery', label: 'Refinery', draft: false },
  { id: 'petrochemicals', label: 'Petrochem', draft: false },
  { id: 'textile', label: 'Textile', draft: false },
];

const STEPS = [
  { num: 1, label: 'Identity',    icon: <Building2 className="w-3.5 h-3.5" />,  domain: 'SHARED' as const },
  { num: 2, label: 'Regulatory',  icon: <ShieldCheck className="w-3.5 h-3.5" />, domain: 'SHARED' as const },
  { num: 3, label: 'Production',  icon: <Factory className="w-3.5 h-3.5" />,    domain: 'SHARED' as const },
  { num: 4, label: 'Carbon',      icon: <Zap className="w-3.5 h-3.5" />,        domain: 'CARBON' as const },
  { num: 5, label: 'Business',    icon: <DollarSign className="w-3.5 h-3.5" />, domain: 'BUSINESS' as const },
  { num: 6, label: 'Process',     icon: <Cpu className="w-3.5 h-3.5" />,        domain: 'SHARED' as const },
  { num: 7, label: 'Finance',     icon: <BarChart2 className="w-3.5 h-3.5" />,  domain: 'BUSINESS' as const },
  { num: 8, label: 'Scenario',    icon: <Target className="w-3.5 h-3.5" />,     domain: 'BUSINESS' as const },
];

// ─────────────────────────────────────────────
// Props — backward compat with old page.tsx
// ─────────────────────────────────────────────
interface FacilityInputFormProps {
  // v1 backward compat props (used by existing page.tsx)
  formData: FacilityFormDataV1;
  onChange: (data: FacilityFormDataV1) => void;
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

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
export function FacilityInputForm({
  formData,
  onChange,
  onSubmit,
  isLoading,
  dataQuality,
}: FacilityInputFormProps) {
  // Internal v2 state
  const [v2Data, setV2Data] = useState<FacilityInputV2>(() => convertV1ToV2(formData));
  const [step, setStep] = useState(1);

  // Sync v2 → v1 whenever changes happen (bridge for existing page.tsx)
  const updateV2 = useCallback((updater: (prev: FacilityInputV2) => FacilityInputV2) => {
    setV2Data(prev => {
      const next = updater(prev);
      // Build minimal v1 equivalent for page.tsx compatibility
      const elecSrc = next.carbon_inputs.electricity_sources;
      const totalMwh = elecSrc.reduce((s, e) => s + e.annual_mwh, 0);
      const reMwh = elecSrc.filter(e => e.renewable_status).reduce((s, e) => s + e.annual_mwh, 0);
      const fuelStreams = next.carbon_inputs.fuel_streams;
      const primaryFuel = fuelStreams[0];
      const pi = next.process_inputs;

      const v1: FacilityFormDataV1 = {
        facility_name: next.identity.facility_name,
        sector: next.regulatory.sector,
        sub_sector: next.regulatory.sub_sector,
        state: next.identity.state,
        annual_production: next.production.reporting_year_production,
        production_unit: next.production.production_unit,
        electricity_mwh: totalMwh,
        renewable_electricity_pct: totalMwh > 0 ? (reMwh / totalMwh) * 100 : 0,
        thermal_fuel_type: primaryFuel?.fuel_type?.toLowerCase().replace(/_/g, '_') || 'indian_domestic_coal',
        thermal_fuel_tonnes: primaryFuel?.quantity || 0,
        custom_target_gei: next.carbon_inputs.custom_target_gei,
        // Sector-specific fields
        ...(pi?.sector === 'cement' ? { clinker_factor_pct: pi.data.clinker_factor_pct, whrs_installed_mw: pi.data.WHRS_capacity_MW } : {}),
        ...(pi?.sector === 'iron_steel' ? { steel_route: pi.data.steel_route, whrs_installed_mw: pi.data.WHRS_capacity_MW } : {}),
        ...(pi?.sector === 'aluminium' ? { smelter_dc_sec_kwh: pi.data.DC_SEC_kWh_per_t_Al } : {}),
        ...(pi?.sector === 'chlor_alkali' ? { caustic_tech: pi.data.cell_technology?.toLowerCase().replace('_membrane', '_membrane') } : {}),
        ...(pi?.sector === 'pulp_paper' ? { paper_steam_specific: pi.data.specific_steam_consumption_t_per_t } : {}),
        ...(pi?.sector === 'petroleum_refinery' ? { refinery_mbn: pi.data.MBN } : {}),
        ...(pi?.sector === 'petrochemicals' ? { petrochem_feedstock: pi.data.feedstock_type?.toLowerCase() } : {}),
        ...(pi?.sector === 'textile' ? { textile_route: pi.data.mill_route?.toLowerCase() } : {}),
      };
      onChange(v1);
      return next;
    });
  }, [onChange]);

  // Preset loader
  const loadPreset = (sectorId: string) => {
    const preset = PRESETS.find(p => p.sector === sectorId);
    if (!preset) return;
    const v2 = convertV1ToV2(preset);
    setV2Data(v2);
    onChange(preset);
    setStep(1);
  };

  const goNext = () => setStep(s => Math.min(8, s + 1));
  const goPrev = () => setStep(s => Math.max(1, s - 1));

  const currentStep = STEPS[step - 1];

  return (
    <div className="glass-panel rounded-xl border-[#E4E9E6] overflow-hidden shadow-2xl">
      {/* ── TOP HEADER ── */}
      <div className="relative border-b border-[#E4E9E6] bg-[#0B4A3D]">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1587582423116-ec07293f0395?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center opacity-10 pointer-events-none" />
        <div className="relative z-10 p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-lg bg-[#E8F5EE] text-[#0B4A3D] border border-[#0B4A3D]/30 shadow-lg">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-extrabold text-white tracking-tight">Facility Data Entry & Intelligence Studio</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#E8F5EE] text-[#0B4A3D] border border-[#0B4A3D]/30">v2.2</span>
                </div>
                <p className="text-xs text-white/70 mt-0.5 max-w-lg">
                  8-step dual-domain wizard — Carbon & Business Twin segregated per AANGARA spec §29
                </p>
              </div>
            </div>
          </div>

          {/* Sector Presets */}
          <div className="flex flex-wrap items-center justify-start sm:justify-end gap-1.5 bg-[#F6F8F7] p-2.5 rounded-lg border border-[#E4E9E6]">
            <span className="text-[11px] font-semibold text-[#4B5A54] flex items-center space-x-1 mr-1">
              <Sparkles className="w-3.5 h-3.5 text-[#C98A1E]" />
              <span>Sector Presets:</span>
            </span>
            {PRESET_META.map(p => (
              <button
                key={p.id}
                type="button"
                onClick={() => loadPreset(p.id)}
                className={`text-[11px] font-mono px-2.5 py-1.5 rounded-md transition-all cursor-pointer font-semibold border ${
                  v2Data.regulatory.sector === p.id
                    ? p.draft
                      ? 'bg-amber-50 border-amber-300 text-[#C98A1E] shadow-sm ring-1 ring-amber-300/40'
                      : 'bg-[#E8F5F2] border-[#0B4A3D]/30 text-[#0B4A3D] shadow-sm ring-1 ring-[#0B4A3D]/20'
                    : p.draft
                      ? 'bg-white border-amber-200 text-[#C98A1E] hover:bg-amber-50'
                      : 'bg-white border-[#E4E9E6] text-[#4B5A54] hover:bg-[#F6F8F7] hover:text-[#10231C]'
                }`}
              >
                {p.label}{p.draft ? ' †' : ''}
              </button>
            ))}
            <span className="text-[9px] text-[#6B7A72] ml-1">† Draft</span>
          </div>
        </div>
      </div>

      {/* ── STEP PROGRESS BAR ── */}
      <div className="border-b border-[#E4E9E6] bg-[#F6F8F7] px-5 py-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-bold text-[#10231C]">
              Step {step} of 8: {currentStep.label}
            </span>
            <DomainBadge domain={currentStep.domain} />
          </div>
          <span className="text-[11px] font-mono text-[#6B7A72]">{step}/8</span>
        </div>
        {/* Step dots */}
        <div className="flex items-center space-x-1.5">
          {STEPS.map(s => {
            const isActive = s.num === step;
            const isDone = s.num < step;
            const domainColor = {
              CARBON: isDone ? 'bg-[#0B4A3D]' : isActive ? 'bg-[#0B4A3D]' : 'bg-[#E4E9E6]',
              BUSINESS: isDone ? 'bg-amber-500' : isActive ? 'bg-amber-500' : 'bg-[#E4E9E6]',
              SHARED: isDone ? 'bg-[#4B5A54]' : isActive ? 'bg-[#4B5A54]' : 'bg-[#E4E9E6]',
            };
            return (
              <button
                key={s.num}
                type="button"
                onClick={() => setStep(s.num)}
                title={`Step ${s.num}: ${s.label}`}
                className={`flex-1 h-1.5 rounded-full transition-all ${domainColor[s.domain]} ${isActive ? 'ring-2 ring-offset-1 ring-current' : ''}`}
              />
            );
          })}
        </div>
        {/* Step labels */}
        <div className="flex items-center mt-1.5 space-x-1">
          {STEPS.map(s => (
            <button
              key={s.num}
              type="button"
              onClick={() => setStep(s.num)}
              className={`flex-1 text-center text-[9px] font-mono transition-colors truncate ${
                s.num === step ? 'text-[#10231C] font-bold' : 'text-[#6B7A72] hover:text-[#4B5A54]'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── STEP CONTENT ── */}
      <div className="p-5 sm:p-6">
        <form onSubmit={e => { e.preventDefault(); onSubmit(); }}>

          {/* ════ STEP 1: Facility & Legal Identity ════ */}
          {step === 1 && (
            <div className="space-y-4">
              <SectionHeader icon={<Building2 className="w-4 h-4 text-[#0B4A3D]" />} title="Facility & Legal Identity" subtitle="Canonical identity — shared by both Carbon and Business domains. One record, no duplication." />
              <div className="bg-[#F6F8F7] p-4 rounded-xl border border-[#E4E9E6]/80 space-y-4">
                <div>
                  <FieldLabel label="Facility Name / Entity Identifier" tag="Mandatory Identifier"
                    tip="Official legal name or designated unit identifier for statutory CCTS compliance registry." />
                  <input type="text" value={v2Data.identity.facility_name}
                    onChange={e => updateV2(p => ({ ...p, identity: { ...p.identity, facility_name: e.target.value, legal_entity_name: e.target.value } }))}
                    className={inputCls} placeholder="e.g. Acme Cement Works Line 1" required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <FieldLabel label="Legal Entity Name" tag="Regulatory"
                      tip="Parent company or legal entity as registered in CCTS / MCA." />
                    <input type="text" value={v2Data.identity.legal_entity_name}
                      onChange={e => updateV2(p => ({ ...p, identity: { ...p.identity, legal_entity_name: e.target.value } }))}
                      className={inputCls} placeholder="e.g. Acme Industries Pvt. Ltd." />
                  </div>
                  <div>
                    <FieldLabel label="CCTS Entity ID" tag="Optional"
                      tip="BEE-assigned Designated Consumer ID if already registered." />
                    <input type="text" value={v2Data.identity.CCTS_entity_id ?? ''}
                      onChange={e => updateV2(p => ({ ...p, identity: { ...p.identity, CCTS_entity_id: e.target.value } }))}
                      className={inputCls} placeholder="e.g. DC-CEM-001" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <FieldLabel label="State (Regional Grid Context)" tag="Grid CEA Node"
                      tip="Used for state-specific grid emission factors, RPO & open access wheeling charges." />
                    <select value={v2Data.identity.state}
                      onChange={e => updateV2(p => ({ ...p, identity: { ...p.identity, state: e.target.value } }))}
                      className={selectCls}>
                      {['Rajasthan','Gujarat','Odisha','Chhattisgarh','Maharashtra','Tamil Nadu','Andhra Pradesh','Madhya Pradesh','Jharkhand','Punjab','Uttar Pradesh','Karnataka','West Bengal','Telangana','Goa','Kerala','Haryana'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <FieldLabel label="Facility Operating Status" tag="Context"
                      tip="Indicates whether facility is fully operational, in partial shutdown, or fully shut during reporting period." />
                    <select value={v2Data.identity.facility_operating_status ?? 'OPERATING'}
                      onChange={e => updateV2(p => ({ ...p, identity: { ...p.identity, facility_operating_status: e.target.value as any } }))}
                      className={selectCls}>
                      <option value="OPERATING">Fully Operational</option>
                      <option value="PARTIAL">Partial Operations / Partial Shutdown</option>
                      <option value="SHUTDOWN">Full Shutdown (no production)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ════ STEP 2: Regulatory Applicability ════ */}
          {step === 2 && (
            <div className="space-y-4">
              <SectionHeader icon={<ShieldCheck className="w-4 h-4 text-[#0B4A3D]" />} title="Regulatory Applicability" subtitle="Sector classification, CCTS applicability status, and reporting period — foundational for both Carbon and Business engines." />
              <div className="bg-[#F6F8F7] p-4 rounded-xl border border-[#E4E9E6]/80 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <FieldLabel label="CCTS Industry Sector" tag="Statutory Regime"
                      tip="Designated obligated sector under MoEFCC gazette notifications for GHG intensity compliance." />
                    <select value={v2Data.regulatory.sector}
                      onChange={e => updateV2(p => ({ ...p, regulatory: { ...p.regulatory, sector: e.target.value, regulatory_status: e.target.value === 'iron_steel' ? 'DRAFT' : 'FINAL' } }))}
                      className={selectCls}>
                      <optgroup label="7 Notified Final CCTS Compliance Sectors">
                        <option value="cement">Cement (Integrated / Grinding)</option>
                        <option value="aluminium">Aluminium (Smelting & Refining)</option>
                        <option value="chlor_alkali">Chlor-Alkali (Caustic Soda)</option>
                        <option value="pulp_paper">Pulp & Paper</option>
                        <option value="petrochemicals">Petrochemicals (Crackers / Polymers)</option>
                        <option value="petroleum_refinery">Petroleum Refinery</option>
                        <option value="textile">Textile (Composite Mills)</option>
                      </optgroup>
                      <optgroup label="Watchlist / Draft Sectors">
                        <option value="iron_steel">Iron & Steel (Draft — G.S.R. 517(E))</option>
                        <option value="fertiliser">Fertiliser (Watchlist)</option>
                      </optgroup>
                    </select>
                  </div>
                  <div>
                    <FieldLabel label="Regulatory Status" tag="Auto-resolved" tip="Auto-set based on sector. Iron & Steel and Fertiliser are DRAFT/WATCHLIST." />
                    <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg border text-xs font-semibold ${
                      v2Data.regulatory.regulatory_status === 'FINAL' ? 'bg-[#E8F5EE] border-[#0B4A3D]/25 text-[#0B4A3D]' :
                      v2Data.regulatory.regulatory_status === 'DRAFT' ? 'bg-amber-50 border-amber-200 text-amber-700' :
                      'bg-[#F6F8F7] border-[#E4E9E6] text-[#6B7A72]'
                    }`}>
                      {v2Data.regulatory.regulatory_status === 'FINAL' ? <ShieldCheck className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />}
                      <span>{v2Data.regulatory.regulatory_status}</span>
                      <span className="text-[10px] font-normal opacity-70">— auto-resolved from sector</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <FieldLabel label="Sub-Sector / Process Route" tag="Process Tech"
                      tip="Specific process technology configuration (e.g. Dry Kiln, BF-BOF, Membrane Cell)." />
                    <input type="text" value={v2Data.regulatory.sub_sector}
                      onChange={e => updateV2(p => ({ ...p, regulatory: { ...p.regulatory, sub_sector: e.target.value, process_route: e.target.value } }))}
                      className={inputCls} placeholder="e.g. Integrated Dry Process Kiln" />
                  </div>
                  <div>
                    <FieldLabel label="Reporting Financial Year" tag="Compliance Period"
                      tip="The financial year for which CCTS GEI is being calculated and reported." />
                    <select value={v2Data.reporting.financial_year}
                      onChange={e => updateV2(p => ({ ...p, reporting: { ...p.reporting, financial_year: e.target.value } }))}
                      className={selectCls}>
                      <option value="2025-26">FY 2025-26 (Compliance Year 1)</option>
                      <option value="2024-25">FY 2024-25 (Baseline)</option>
                      <option value="2026-27">FY 2026-27 (Compliance Year 2)</option>
                    </select>
                  </div>
                </div>
                <div>
                  <FieldLabel label="Custom Notified Target GEI (Optional Override)" tag="Advanced Override"
                    tip="If your designated consumer notice specifies a plant-specific target GEI, enter it here to override the gazetted sector default." />
                  <input type="number" step="0.0001"
                    value={v2Data.carbon_inputs.custom_target_gei ?? ''}
                    onChange={e => updateV2(p => ({ ...p, carbon_inputs: { ...p.carbon_inputs, custom_target_gei: e.target.value ? parseFloat(e.target.value) : undefined } }))}
                    className={inputCls} placeholder="Leave blank to use official MoEFCC gazette trajectory" />
                  <p className="text-[10px] text-[#4B5A54] mt-1">Default uses gazetted FY2025-26 statutory target. Override requires notification number in the source field.</p>
                </div>
              </div>
            </div>
          )}

          {/* ════ STEP 3: Production & Product Mix ════ */}
          {step === 3 && (
            <div className="space-y-4">
              <SectionHeader icon={<Factory className="w-4 h-4 text-[#0B4A3D]" />} title="Production & Product Mix" subtitle="Net saleable output — denominator for GEI calculation and shared by both Carbon and Business Twin domains." />
              <div className="bg-[#F6F8F7] p-4 rounded-xl border border-[#E4E9E6]/80 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <FieldLabel label="Annual Finished Production" tag="Primary Denominator"
                      tip="Net saleable product output for the reporting year. Used to compute GHG Emission Intensity (GEI = tCO₂e / output_unit)." />
                    <input type="number" min={0} step="any"
                      value={v2Data.production.reporting_year_production || ''}
                      onChange={e => updateV2(p => ({ ...p, production: { ...p.production, reporting_year_production: parseFloat(e.target.value) || 0 } }))}
                      className={inputCls} placeholder="e.g. 1200000" required />
                    <p className="text-[10px] text-[#4B5A54] mt-1">Calibrate with annual PAT/BRSR verified production log.</p>
                  </div>
                  <div>
                    <FieldLabel label="Production Unit" tag="Denominator Unit"
                      tip="Physical unit for production — tonnes for most sectors. MBN for refineries." />
                    <select value={v2Data.production.production_unit}
                      onChange={e => updateV2(p => ({ ...p, production: { ...p.production, production_unit: e.target.value } }))}
                      className={selectCls}>
                      <option value="tonnes">Tonnes (most sectors)</option>
                      <option value="kl">Kilolitres (liquid products)</option>
                      <option value="MBN">MBN (petroleum refinery)</option>
                      <option value="nos">Number of units</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <FieldLabel label="Installed Capacity" tag="Nameplate" tip="Nameplate/licensed capacity of the facility." />
                    <input type="number" min={0} step="any"
                      value={v2Data.production.installed_capacity ?? ''}
                      onChange={e => updateV2(p => ({ ...p, production: { ...p.production, installed_capacity: parseFloat(e.target.value) || undefined } }))}
                      className={inputCls} placeholder="e.g. 1500000" />
                  </div>
                  <div>
                    <FieldLabel label="Operating Days" tag="Uptime" tip="Number of actual operating days in the reporting year." />
                    <input type="number" min={0} max={366} step={1}
                      value={v2Data.production.operating_days ?? ''}
                      onChange={e => updateV2(p => ({ ...p, production: { ...p.production, operating_days: parseInt(e.target.value) || undefined } }))}
                      className={inputCls} placeholder="e.g. 340" />
                  </div>
                  <div>
                    <FieldLabel label="Capacity Utilisation" tag="%" tip="Actual production ÷ practical capacity × 100. Used in benchmarking cohort matching." />
                    <input type="number" min={0} max={110} step="any"
                      value={v2Data.production.capacity_utilisation_pct ?? ''}
                      onChange={e => updateV2(p => ({ ...p, production: { ...p.production, capacity_utilisation_pct: parseFloat(e.target.value) || undefined } }))}
                      className={inputCls} placeholder="e.g. 82" />
                  </div>
                </div>
                <div>
                  <FieldLabel label="Data Source" tag="Evidence Class"
                    tip="Evidence source for production data — determines data class (REAL_FACILITY_INPUT vs ESTIMATE)." />
                  <select value={v2Data.production.data_source ?? 'ERP_MES'}
                    onChange={e => updateV2(p => ({ ...p, production: { ...p.production, data_source: e.target.value as any } }))}
                    className={selectCls}>
                    <option value="ERP_MES">ERP / MES (plant system)</option>
                    <option value="WEIGHBRIDGE">Weighbridge / Dispatch system</option>
                    <option value="PAT_RECORD">PAT / BEE Record</option>
                    <option value="BRSR">BRSR Annual Disclosure</option>
                    <option value="ANNUAL_REPORT">Annual Report</option>
                    <option value="ANALYST_ESTIMATE">Analyst Estimate</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* ════ STEP 4: Carbon Data ════ */}
          {step === 4 && (
            <div className="space-y-6">
              <SectionHeader
                icon={<Zap className="w-4 h-4 text-sky-500" />}
                title="Carbon Data — Electricity & Fuel Sources"
                subtitle="Carbon domain only. Business tariff and fuel economics are in Step 5. No duplicate data."
                domain="CARBON"
              />
              <div className="bg-[#F6F8F7] p-4 rounded-xl border border-[#E4E9E6]/80 space-y-6">
                {/* Electricity Ledger */}
                <ElectricityLedger
                  sources={v2Data.carbon_inputs.electricity_sources}
                  onChange={sources => updateV2(p => ({ ...p, carbon_inputs: { ...p.carbon_inputs, electricity_sources: sources } }))}
                  state={v2Data.identity.state}
                />
                <div className="border-t border-[#E4E9E6] pt-6">
                  {/* Fuel Ledger */}
                  <FuelStreamLedger
                    streams={v2Data.carbon_inputs.fuel_streams}
                    onChange={streams => updateV2(p => ({ ...p, carbon_inputs: { ...p.carbon_inputs, fuel_streams: streams } }))}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ════ STEP 5: Business Twin ════ */}
          {step === 5 && (
            <div className="space-y-4">
              <SectionHeader
                icon={<DollarSign className="w-4 h-4 text-amber-500" />}
                title="Business Twin — Energy & Operating Economics"
                subtitle="Business domain only. These economics feed Finance, Scenario, and Capital Optimizer — never the Carbon GEI calculation."
                domain="BUSINESS"
              />
              <BusinessTwinPanel
                inputs={v2Data.business_inputs}
                onChange={bi => updateV2(p => ({ ...p, business_inputs: bi }))}
              />
            </div>
          )}

          {/* ════ STEP 6: Sector Process Engineering ════ */}
          {step === 6 && (
            <div className="space-y-4">
              <SectionHeader
                icon={<Cpu className="w-4 h-4 text-[#0B4A3D]" />}
                title={`Sector Process Engineering — ${v2Data.regulatory.sector.replace('_', ' ').toUpperCase()}`}
                subtitle="Sector-specific parameters that feed both Carbon Engine (process emissions) and Business Twin (process economics)."
              />
              <div className="bg-[#F6F8F7] p-4 rounded-xl border border-[#E4E9E6]/80">
                <SectorProcessFields
                  sector={v2Data.regulatory.sector}
                  processInputs={v2Data.process_inputs}
                  onChange={pi => updateV2(p => ({ ...p, process_inputs: pi }))}
                />
              </div>
            </div>
          )}

          {/* ════ STEP 7: Project / CAPEX / Finance ════ */}
          {step === 7 && (
            <div className="space-y-4">
              <SectionHeader
                icon={<BarChart2 className="w-4 h-4 text-amber-500" />}
                title="Project Economics & Financing"
                subtitle="Business Twin domain. CAPEX and financing inputs for the Capital Optimizer engine."
                domain="BUSINESS"
              />
              <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    ['Total CAPEX Budget', 'total_capex_cr', v2Data.project_inputs?.total_capex_cr ?? '', '₹ Cr', 'e.g. 150'],
                    ['Annual OPEX', 'annual_opex_cr', v2Data.project_inputs?.annual_opex_cr ?? '', '₹ Cr/yr', 'e.g. 8'],
                    ['Project Life', 'project_life_years', v2Data.project_inputs?.project_life_years ?? '', 'years', 'e.g. 15'],
                    ['Debt Ratio', 'debt_pct', v2Data.finance_inputs?.debt_pct ?? '', '%', 'e.g. 70'],
                    ['Interest Rate', 'interest_rate_pct', v2Data.finance_inputs?.interest_rate_pct ?? '', '%/yr', 'e.g. 9.5'],
                    ['WACC', 'WACC_pct', v2Data.finance_inputs?.WACC_pct ?? '', '%', 'e.g. 11.5'],
                    ['Tax Rate', 'tax_rate_pct', v2Data.finance_inputs?.tax_rate_pct ?? '', '%', 'e.g. 25.17'],
                    ['Inflation', 'inflation_pct', v2Data.finance_inputs?.inflation_pct ?? '', '%/yr', 'e.g. 5.5'],
                    ['Energy Escalation', 'energy_price_escalation_pct', v2Data.finance_inputs?.energy_price_escalation_pct ?? '', '%/yr', 'e.g. 4'],
                  ].map(([label, field, value, unit, placeholder]: any) => (
                    <div key={field as string}>
                      <div className="flex items-center gap-1 mb-1">
                        <label className="text-xs font-medium text-[#10231C]">{label as string}</label>
                        <span className="text-[10px] font-mono text-amber-600 bg-amber-50 border border-amber-200 px-1 rounded">[{unit}]</span>
                      </div>
                      <input
                        type="number" step="any"
                        value={value as any}
                        onChange={e => {
                          const v = parseFloat(e.target.value) || undefined;
                          if (['total_capex_cr','annual_opex_cr','project_life_years'].includes(field as string)) {
                            updateV2(p => ({ ...p, project_inputs: { ...p.project_inputs, [field as string]: v } }));
                          } else {
                            updateV2(p => ({ ...p, finance_inputs: { ...p.finance_inputs, [field as string]: v } }));
                          }
                        }}
                        placeholder={placeholder as string}
                        className="w-full bg-white border border-[#E4E9E6] rounded-lg px-3 py-2 text-xs text-[#10231C] font-mono focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30"
                      />
                    </div>
                  ))}
                </div>
                <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] text-amber-700">
                  CAPEX source: <span className="font-semibold">ESTIMATE</span> — upgrade to DPR-backed data class by uploading vendor quote or approved DPR.
                </div>
              </div>
            </div>
          )}

          {/* ════ STEP 8: Scenario & Decision ════ */}
          {step === 8 && (
            <div className="space-y-4">
              <SectionHeader
                icon={<Target className="w-4 h-4 text-amber-500" />}
                title="Scenario Parameters & Decision Preferences"
                subtitle="Business domain scenario assumptions and management objective. Stored separately from factual facility data."
                domain="BUSINESS"
              />
              <ScenarioDecisionStep
                facilityInput={v2Data}
                scenarioInputs={v2Data.scenario_inputs ?? { CCC_price_scenarios: [] }}
                managementObjective={(v2Data.business_inputs.management_objective ?? 'BALANCED') as ManagementObjective}
                onScenarioChange={si => updateV2(p => ({ ...p, scenario_inputs: si }))}
                onObjectiveChange={obj => updateV2(p => ({ ...p, business_inputs: { ...p.business_inputs, management_objective: obj } }))}
                onSubmit={onSubmit}
                isLoading={isLoading}
              />
            </div>
          )}

          {/* ── Navigation Footer (Steps 1–7) ── */}
          {step < 8 && (
            <div className="flex items-center justify-between pt-5 mt-5 border-t border-[#E4E9E6]/60">
              <button
                type="button"
                onClick={goPrev}
                disabled={step === 1}
                className="flex items-center space-x-2 text-xs font-semibold text-[#4B5A54] hover:text-[#10231C] disabled:opacity-30 disabled:cursor-not-allowed transition-colors px-4 py-2.5 rounded-lg border border-[#E4E9E6] hover:border-[#4B5A54] bg-white"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              {/* Quick-submit available any time */}
              {step >= 4 && (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center space-x-2 text-xs font-semibold text-[#0B4A3D] hover:text-white border border-[#0B4A3D]/30 hover:bg-[#0B4A3D] bg-[#E8F5EE] px-4 py-2.5 rounded-lg transition-all disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isLoading ? 'Computing...' : 'Run Analysis Now'}</span>
                </button>
              )}

              <button
                type="button"
                onClick={goNext}
                className="flex items-center space-x-2 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 px-5 py-2.5 rounded-lg shadow-md shadow-emerald-950/30 transition-all"
              >
                <span>Next: {STEPS[step]?.label}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Data Quality from backend (shown at bottom of any step) */}
          {dataQuality?.errors && dataQuality.errors.length > 0 && (
            <div className="mt-4 p-4 bg-rose-50 border border-rose-200 rounded-xl">
              <h4 className="text-sm font-bold text-rose-700 mb-2">Validation Errors</h4>
              <ul className="list-disc list-inside text-xs text-rose-600 space-y-0.5">
                {dataQuality.errors.map((err, i) => <li key={i}>{err}</li>)}
              </ul>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Sub-helpers
// ─────────────────────────────────────────────
function SectionHeader({ icon, title, subtitle, domain }: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  domain?: 'CARBON' | 'BUSINESS' | 'SHARED';
}) {
  return (
    <div className="flex items-start space-x-3 mb-2">
      <div className={`p-2 rounded-lg mt-0.5 flex-shrink-0 ${
        domain === 'CARBON' ? 'bg-sky-50 border border-sky-200' :
        domain === 'BUSINESS' ? 'bg-amber-50 border border-amber-200' :
        'bg-[#F6F8F7] border border-[#E4E9E6]'
      }`}>{icon}</div>
      <div>
        <h4 className="text-xs font-bold text-[#10231C]">{title}</h4>
        {subtitle && <p className="text-[11px] text-[#6B7A72] mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

function FieldLabel({ label, tag, tip }: { label: string; tag?: string; tip?: string }) {
  return (
    <div className="flex items-center justify-between mb-1">
      <label className="text-xs font-medium text-[#10231C] flex items-center">
        {label}
        {tip && <Tip text={tip} />}
      </label>
      {tag && <span className="text-[10px] text-[#6B7A72] font-mono">{tag}</span>}
    </div>
  );
}
