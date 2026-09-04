'use client';

/**
 * SectorProcessFields — renders structured process-engineering inputs
 * for all 8 AANGARA sectors (spec §12, §35).
 * Segregated: each field tagged CARBON or BUSINESS.
 */

import React from 'react';
import { HelpCircle } from 'lucide-react';
import type {
  CementProcessInputs,
  IronSteelProcessInputs,
  AluminiumProcessInputs,
  ChlorAlkaliProcessInputs,
  PulpPaperProcessInputs,
  PetroleumRefineryProcessInputs,
  PetrochemicalsProcessInputs,
  TextileProcessInputs,
  SectorProcessInputsV2,
} from '@/types/facility-v2';

// ── Tooltip helper ──
const Tip = ({ text }: { text: string }) => (
  <span className="relative inline-flex items-center ml-1 cursor-help group">
    <HelpCircle className="w-3 h-3 text-[#6B7A72]" />
    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block w-52 p-2 rounded bg-white border border-[#E4E9E6] text-[10px] text-[#4B5A54] leading-tight z-50 shadow-xl pointer-events-none">
      {text}
    </span>
  </span>
);

// ── Domain pill ──
const DomainPill = ({ domain }: { domain: 'CARBON' | 'BUSINESS' | 'BOTH' }) => {
  const styles = {
    CARBON: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    BUSINESS: 'bg-amber-50 text-amber-700 border border-amber-200',
    BOTH: 'bg-sky-50 text-sky-700 border border-sky-200',
  };
  return (
    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ml-1 ${styles[domain]}`}>
      {domain}
    </span>
  );
};

// ── Field wrapper ──
const Field = ({
  label,
  domain,
  tip,
  unit,
  badge,
  children,
}: {
  label: string;
  domain: 'CARBON' | 'BUSINESS' | 'BOTH';
  tip?: string;
  unit?: string;
  badge?: string;
  children: React.ReactNode;
}) => (
  <div>
    <div className="flex items-center justify-between mb-1">
      <label className="text-xs font-medium text-[#10231C] flex items-center flex-wrap gap-1">
        {label}
        {unit && (
          <span className="text-[10px] font-mono text-[#0B4A3D] bg-[#E8F5EE] px-1.5 py-0.5 rounded border border-[#0B4A3D]/20">
            [{unit}]
          </span>
        )}
        <DomainPill domain={domain} />
        {tip && <Tip text={tip} />}
      </label>
      {badge && <span className="text-[10px] text-[#6B7A72] font-mono">{badge}</span>}
    </div>
    {children}
  </div>
);

const inputCls = "w-full bg-white border border-[#E4E9E6] rounded-lg px-3 py-2 text-xs text-[#10231C] font-mono focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30";
const selectCls = "w-full bg-white border border-[#E4E9E6] rounded-lg px-3 py-2 text-xs text-[#10231C] font-semibold focus:outline-none focus:border-emerald-500";

// ─────────────────────────────────────────────
// CEMENT
// ─────────────────────────────────────────────
function CementFields({ data, onChange }: { data: Partial<CementProcessInputs>; onChange: (d: Partial<CementProcessInputs>) => void }) {
  const u = (field: keyof CementProcessInputs, val: any) => onChange({ ...data, [field]: val });
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Plant Type" domain="CARBON" tip="Integrated = kiln + mill; Grinding = import clinker; Clinker = export clinker">
          <select value={data.plant_type ?? 'INTEGRATED'} onChange={e => u('plant_type', e.target.value)} className={selectCls}>
            <option value="INTEGRATED">Integrated (Kiln + Mill)</option>
            <option value="GRINDING_ONLY">Grinding Station Only</option>
            <option value="CLINKER_ONLY">Clinker Producer Only</option>
          </select>
        </Field>
        <Field label="Clinker Factor" domain="CARBON" unit="%" tip="Clinker-to-cement ratio. OPC ~95%, PPC ~68–75%, LC3 ~45–60%." badge="Range: 40–98%">
          <input type="number" min={40} max={98} step="any" value={data.clinker_factor_pct ?? 74} onChange={e => u('clinker_factor_pct', parseFloat(e.target.value) || 74)} className={inputCls} />
          <p className="text-[10px] text-[#4B5A54] mt-1">Governs calcination CO₂ (0.525 tCO₂/t clinker) — direct GEI driver.</p>
        </Field>
        <Field label="Clinker Production" domain="CARBON" unit="t/yr" tip="Net clinker produced. Used for precise calcination CO₂ instead of output × factor.">
          <input type="number" min={0} step="any" value={data.clinker_production ?? ''} onChange={e => u('clinker_production', parseFloat(e.target.value) || undefined)} placeholder="Leave blank to derive from output × clinker factor" className={inputCls} />
        </Field>
        <Field label="Thermal Substitution Rate (TSR)" domain="CARBON" unit="%" tip="% of thermal energy from AFR/biomass substituting fossil fuel." badge="0–30%">
          <input type="number" min={0} max={30} step="any" value={data.TSR_pct ?? 0} onChange={e => u('TSR_pct', parseFloat(e.target.value) || 0)} className={inputCls} />
        </Field>
        <Field label="Kiln Configuration" domain="CARBON" tip="Dry process with multi-stage preheater is lowest thermal energy intensity.">
          <select value={data.kiln_configuration ?? 'dry'} onChange={e => u('kiln_configuration', e.target.value)} className={selectCls}>
            <option value="dry">Dry Process (Preheater Kiln)</option>
            <option value="dry_precalciner">Dry Process + Precalciner</option>
            <option value="semi_dry">Semi-Dry</option>
            <option value="wet">Wet Process</option>
          </select>
        </Field>
        <Field label="Preheater Configuration" domain="CARBON" tip="Higher stage preheaters reduce thermal energy and clinker CO₂.">
          <select value={data.preheater_configuration ?? '5-stage'} onChange={e => u('preheater_configuration', e.target.value)} className={selectCls}>
            <option value="4-stage">4-Stage Cyclone</option>
            <option value="5-stage">5-Stage Cyclone</option>
            <option value="6-stage">6-Stage Cyclone</option>
          </select>
        </Field>
        <Field label="WHRS Installed Capacity" domain="BOTH" unit="MW" tip="Waste Heat Recovery from preheater and cooler exhausts. Set 0 if not installed." badge="0–50 MW">
          <input type="number" min={0} max={50} step="any" value={data.WHRS_capacity_MW ?? 0} onChange={e => u('WHRS_capacity_MW', parseFloat(e.target.value) || 0)} className={inputCls} />
        </Field>
        <Field label="WHRS Annual Generation" domain="BOTH" unit="MWh/yr" tip="Actual electricity generated by WHRS turbines — reduces grid drawl and Scope 2.">
          <input type="number" min={0} step="any" value={data.WHRS_generation_MWh ?? ''} onChange={e => u('WHRS_generation_MWh', parseFloat(e.target.value) || undefined)} placeholder="Auto-estimated if blank" className={inputCls} />
        </Field>
        <Field label="Specific Electricity Consumption" domain="CARBON" unit="kWh/t cement" tip="Overall SEC — benchmark: 90–110 kWh/t for integrated dry plants." badge="BEE PAT range">
          <input type="number" min={50} max={180} step="any" value={data.specific_electricity_kWh_per_t ?? ''} onChange={e => u('specific_electricity_kWh_per_t', parseFloat(e.target.value) || undefined)} placeholder="e.g. 95" className={inputCls} />
        </Field>
        <Field label="Cement Realisation" domain="BUSINESS" unit="₹/tonne" tip="Net selling price per tonne — used in Business Twin NPV calculations.">
          <input type="number" min={0} step="any" value={data.cement_realisation_per_t ?? ''} onChange={e => u('cement_realisation_per_t', parseFloat(e.target.value) || undefined)} placeholder="e.g. 5200" className={inputCls} />
        </Field>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// IRON & STEEL (DRAFT)
// ─────────────────────────────────────────────
function IronSteelFields({ data, onChange }: { data: Partial<IronSteelProcessInputs>; onChange: (d: Partial<IronSteelProcessInputs>) => void }) {
  const u = (f: keyof IronSteelProcessInputs, v: any) => onChange({ ...data, [f]: v });
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] text-amber-700 font-medium mb-2">
        ⚠ DRAFT Regulatory Status — G.S.R. 517(E). Targets subject to finalisation.
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Primary Smelting Route" domain="CARBON" tip="Route determines benchmark cohort and Scope 1 emission intensity.">
          <select value={data.steel_route ?? 'BF_BOF'} onChange={e => u('steel_route', e.target.value as IronSteelProcessInputs['steel_route'])} className={selectCls}>
            <option value="BF_BOF">BF-BOF — Integrated Blast Furnace + Basic Oxygen Furnace</option>
            <option value="DRI_EAF">DRI-EAF — Direct Reduced Iron + Electric Arc Furnace</option>
            <option value="DRI_IF">DRI-IF — Direct Reduced Iron + Induction Furnace</option>
            <option value="EAF">EAF — Electric Arc Furnace (scrap-based)</option>
            <option value="OTHER">Other / Combined Routes</option>
          </select>
        </Field>
        <Field label="Coke Rate" domain="CARBON" unit="kg/t hot metal" tip="BF coke consumption rate — key BF-BOF carbon intensity driver." badge="~350–420 kg/t">
          <input type="number" min={200} max={600} step="any" value={data.coke_rate ?? ''} onChange={e => u('coke_rate', parseFloat(e.target.value) || undefined)} placeholder="e.g. 380" className={inputCls} />
        </Field>
        <Field label="TRT Installed Capacity" domain="BOTH" unit="MW" tip="Top Gas Recovery Turbine — recovers kinetic energy from BF top gas." badge="0–50 MW">
          <input type="number" min={0} step="any" value={data.TRT_capacity_MW ?? 0} onChange={e => u('TRT_capacity_MW', parseFloat(e.target.value) || 0)} className={inputCls} />
        </Field>
        <Field label="CDQ Installed Capacity" domain="BOTH" unit="MW" tip="Coke Dry Quenching — recovers coke oven heat instead of wet quenching." badge="0–50 MW">
          <input type="number" min={0} step="any" value={data.CDQ_capacity_MW ?? 0} onChange={e => u('CDQ_capacity_MW', parseFloat(e.target.value) || 0)} className={inputCls} />
        </Field>
        <Field label="Scrap Charge Rate" domain="CARBON" unit="%" tip="Higher scrap rate in BOF reduces hot metal requirement and process CO₂." badge="5–30%">
          <input type="number" min={0} max={100} step="any" value={data.scrap_rate_pct ?? ''} onChange={e => u('scrap_rate_pct', parseFloat(e.target.value) || undefined)} placeholder="e.g. 10" className={inputCls} />
        </Field>
        <Field label="Steel Realisation" domain="BUSINESS" unit="₹/tonne" tip="Net selling price per tonne crude steel — used in Business Twin NPV.">
          <input type="number" min={0} step="any" value={data.steel_realisation_per_t ?? ''} onChange={e => u('steel_realisation_per_t', parseFloat(e.target.value) || undefined)} placeholder="e.g. 55000" className={inputCls} />
        </Field>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// ALUMINIUM
// ─────────────────────────────────────────────
function AluminiumFields({ data, onChange }: { data: Partial<AluminiumProcessInputs>; onChange: (d: Partial<AluminiumProcessInputs>) => void }) {
  const u = (f: keyof AluminiumProcessInputs, v: any) => onChange({ ...data, [f]: v });
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="DC Specific Energy Consumption" domain="CARBON" unit="kWh/t Al" tip="Potline DC power consumed per tonne of aluminium. BEE PAT benchmark: 14,000–15,500 kWh/t." badge="BEE PAT: ~14.2k">
          <input type="number" min={12000} max={17000} step="any" value={data.DC_SEC_kWh_per_t_Al ?? 14200} onChange={e => u('DC_SEC_kWh_per_t_Al', parseFloat(e.target.value) || 14200)} className={inputCls} />
          <p className="text-[10px] text-[#4B5A54] mt-1">Potline electrolysis constitutes ~90% of primary aluminium GHG intensity.</p>
        </Field>
        <Field label="Anode Type" domain="CARBON" tip="Prebaked anodes are standard. Söderberg anodes have higher PAH and carbon.">
          <select value={data.anode_type ?? 'PREBAKED'} onChange={e => u('anode_type', e.target.value as 'PREBAKED' | 'SODERBERG')} className={selectCls}>
            <option value="PREBAKED">Prebaked Carbon Anodes</option>
            <option value="SODERBERG">Söderberg In-Situ Anodes (legacy)</option>
          </select>
        </Field>
        <Field label="Current Efficiency" domain="CARBON" unit="%" tip="Faradaic current efficiency in potline cells. Typically 92–96%." badge="92–96%">
          <input type="number" min={85} max={98} step="0.1" value={data.current_efficiency_pct ?? ''} onChange={e => u('current_efficiency_pct', parseFloat(e.target.value) || undefined)} placeholder="e.g. 94" className={inputCls} />
        </Field>
        <Field label="Anode Consumption" domain="CARBON" unit="kg/t Al" tip="Carbon anode consumption rate — standard range: 400–450 kg/t Al." badge="400–450 kg/t">
          <input type="number" min={350} max={550} step="any" value={data.anode_consumption_kg_per_t ?? ''} onChange={e => u('anode_consumption_kg_per_t', parseFloat(e.target.value) || undefined)} placeholder="e.g. 420" className={inputCls} />
        </Field>
        <Field label="PFC Emission Source" domain="CARBON" tip="Anode effects cause CF4 and C2F6 emissions (high GWP PFCs). Must be reported under CCTS.">
          <select value={data.PFC_sources ?? 'ANODE_EFFECT_CF4_C2F6'} onChange={e => u('PFC_sources', e.target.value as AluminiumProcessInputs['PFC_sources'])} className={selectCls}>
            <option value="ANODE_EFFECT_CF4_C2F6">Anode Effect — CF₄ and C₂F₆ (standard)</option>
            <option value="NONE">None / Negligible</option>
          </select>
        </Field>
        <Field label="Aluminium Realisation" domain="BUSINESS" unit="₹/tonne" tip="LME-linked or domestic selling price — Business Twin NPV driver.">
          <input type="number" min={0} step="any" value={data.aluminium_realisation_per_t ?? ''} onChange={e => u('aluminium_realisation_per_t', parseFloat(e.target.value) || undefined)} placeholder="e.g. 215000" className={inputCls} />
        </Field>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// CHLOR-ALKALI
// ─────────────────────────────────────────────
function ChlorAlkaliFields({ data, onChange }: { data: Partial<ChlorAlkaliProcessInputs>; onChange: (d: Partial<ChlorAlkaliProcessInputs>) => void }) {
  const u = (f: keyof ChlorAlkaliProcessInputs, v: any) => onChange({ ...data, [f]: v });
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Electrolysis Cell Technology" domain="CARBON" tip="Zero-gap bipolar membrane cells: ~2,100 kWh/t NaOH. Diaphragm: >2,600 kWh/t.">
          <select value={data.cell_technology ?? 'BIPOLAR_MEMBRANE'} onChange={e => u('cell_technology', e.target.value as ChlorAlkaliProcessInputs['cell_technology'])} className={selectCls}>
            <option value="BIPOLAR_MEMBRANE">Zero-Gap Bipolar Membrane Cell (BAT)</option>
            <option value="STANDARD_MEMBRANE">Standard Gap Membrane Cell</option>
            <option value="DIAPHRAGM">Diaphragm Cell (Legacy)</option>
          </select>
        </Field>
        <Field label="Specific Electricity" domain="CARBON" unit="kWh/t NaOH" tip="Total SEC including rectifier losses. BAT membrane target: 2,050–2,150 kWh/t." badge="BAT: ~2,100">
          <input type="number" min={1800} max={3200} step="any" value={data.specific_electricity_kWh_per_t ?? ''} onChange={e => u('specific_electricity_kWh_per_t', parseFloat(e.target.value) || undefined)} placeholder="e.g. 2100" className={inputCls} />
        </Field>
        <Field label="NaOH Production" domain="CARBON" unit="t/yr" tip="Net caustic soda (100% NaOH equivalent) production — primary product denominator.">
          <input type="number" min={0} step="any" value={data.NaOH_production_t ?? ''} onChange={e => u('NaOH_production_t', parseFloat(e.target.value) || undefined)} className={inputCls} />
        </Field>
        <Field label="Caustic Soda Realisation" domain="BUSINESS" unit="₹/tonne" tip="Net selling price per tonne 100% NaOH equivalent.">
          <input type="number" min={0} step="any" value={data.caustic_soda_realisation_per_t ?? ''} onChange={e => u('caustic_soda_realisation_per_t', parseFloat(e.target.value) || undefined)} placeholder="e.g. 28000" className={inputCls} />
        </Field>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// PULP & PAPER
// ─────────────────────────────────────────────
function PulpPaperFields({ data, onChange }: { data: Partial<PulpPaperProcessInputs>; onChange: (d: Partial<PulpPaperProcessInputs>) => void }) {
  const u = (f: keyof PulpPaperProcessInputs, v: any) => onChange({ ...data, [f]: v });
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Specific Steam Consumption" domain="CARBON" unit="t steam / t paper" tip="Low/medium pressure steam in digestor, evaps, drying. Chemical pulp: 4–6 t/t." badge="Range: 2.0–10.0">
          <input type="number" min={2} max={10} step="0.1" value={data.specific_steam_consumption_t_per_t ?? 4.8} onChange={e => u('specific_steam_consumption_t_per_t', parseFloat(e.target.value) || 4.8)} className={inputCls} />
        </Field>
        <Field label="Recovery Boiler Present" domain="CARBON" tip="Black liquor recovery boiler recycles pulping chemicals and generates steam from biogenic source.">
          <select value={data.recovery_boiler_present ? 'yes' : 'no'} onChange={e => u('recovery_boiler_present', e.target.value === 'yes')} className={selectCls}>
            <option value="yes">Yes — Black Liquor Recovery Boiler</option>
            <option value="no">No</option>
          </select>
        </Field>
        <Field label="Recycled Fibre Input" domain="CARBON" unit="t/yr" tip="Waste paper / OCC input. Higher recycled content = lower virgin wood and steam.">
          <input type="number" min={0} step="any" value={data.recycled_fibre_input_t ?? ''} onChange={e => u('recycled_fibre_input_t', parseFloat(e.target.value) || undefined)} placeholder="0 if all virgin pulp" className={inputCls} />
        </Field>
        <Field label="Paper Realisation" domain="BUSINESS" unit="₹/tonne" tip="Net selling price per tonne of finished paper/paperboard.">
          <input type="number" min={0} step="any" value={data.paper_realisation_per_t ?? ''} onChange={e => u('paper_realisation_per_t', parseFloat(e.target.value) || undefined)} placeholder="e.g. 62000" className={inputCls} />
        </Field>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// PETROLEUM REFINERY
// ─────────────────────────────────────────────
function RefineryFields({ data, onChange }: { data: Partial<PetroleumRefineryProcessInputs>; onChange: (d: Partial<PetroleumRefineryProcessInputs>) => void }) {
  const u = (f: keyof PetroleumRefineryProcessInputs, v: any) => onChange({ ...data, [f]: v });
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="MBN Complexity Index" domain="CARBON" tip="Solomon/BEE Million Barrel Number — reflects secondary upgrading complexity (FCC, HCU, Coker)." badge="Range: 4.0–16.0">
          <input type="number" min={4} max={16} step="0.1" value={data.MBN ?? 9.8} onChange={e => u('MBN', parseFloat(e.target.value) || 9.8)} className={inputCls} />
          <p className="text-[10px] text-[#4B5A54] mt-1">Higher MBN = more complex = higher energy and GHG intensity per tonne throughput.</p>
        </Field>
        <Field label="Crude Throughput" domain="CARBON" unit="t/yr" tip="Annual crude processed at the refinery gate — primary production denominator.">
          <input type="number" min={0} step="any" value={data.crude_throughput_t ?? ''} onChange={e => u('crude_throughput_t', parseFloat(e.target.value) || undefined)} className={inputCls} />
        </Field>
        <Field label="Hydrogen Production" domain="CARBON" unit="t/yr" tip="On-site hydrogen produced via Steam Methane Reforming (SMR) — significant Scope 1 source.">
          <input type="number" min={0} step="any" value={data.hydrogen_production_t ?? ''} onChange={e => u('hydrogen_production_t', parseFloat(e.target.value) || undefined)} className={inputCls} />
        </Field>
        <Field label="FCC Present" domain="CARBON" tip="Fluid Catalytic Cracker adds significant process CO₂ from catalyst regeneration.">
          <select value={data.FCC_present ? 'yes' : 'no'} onChange={e => u('FCC_present', e.target.value === 'yes')} className={selectCls}>
            <option value="no">No FCC</option>
            <option value="yes">Yes — FCC Operational</option>
          </select>
        </Field>
        <Field label="Turnaround Duration" domain="BUSINESS" unit="days" tip="Annual turnaround/shutdown duration — affects Business Twin downtime cost.">
          <input type="number" min={0} max={120} step="1" value={data.turnaround_duration_days ?? ''} onChange={e => u('turnaround_duration_days', parseInt(e.target.value) || undefined)} placeholder="e.g. 30" className={inputCls} />
        </Field>
        <Field label="Crude Price (scenario)" domain="BUSINESS" unit="₹/bbl" tip="Feedstock cost — scenario assumption for Business Twin economics. Mark as SCENARIO.">
          <input type="number" min={0} step="any" value={data.crude_price_per_bbl ?? ''} onChange={e => u('crude_price_per_bbl', parseFloat(e.target.value) || undefined)} placeholder="e.g. 6800" className={inputCls} />
        </Field>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// PETROCHEMICALS
// ─────────────────────────────────────────────
function PetrochemFields({ data, onChange }: { data: Partial<PetrochemicalsProcessInputs>; onChange: (d: Partial<PetrochemicalsProcessInputs>) => void }) {
  const u = (f: keyof PetrochemicalsProcessInputs, v: any) => onChange({ ...data, [f]: v });
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Cracker Feedstock Configuration" domain="CARBON" tip="Naphtha vs gas crackers dictate furnace temperature, yield pattern, and CO₂ per tonne ethylene.">
          <select value={data.feedstock_type ?? 'DUAL_FEED'} onChange={e => u('feedstock_type', e.target.value as PetrochemicalsProcessInputs['feedstock_type'])} className={selectCls}>
            <option value="DUAL_FEED">Dual Feed (Naphtha + Gas Ethane/Propane)</option>
            <option value="LIQUID_NAPHTHA">100% Liquid Naphtha</option>
            <option value="GAS_FEED">100% Gas / Ethane Feed</option>
          </select>
        </Field>
        <Field label="Ethylene Output" domain="CARBON" unit="t/yr" tip="Primary cracker product — denominator for ethylene-basis intensity benchmarking.">
          <input type="number" min={0} step="any" value={data.ethylene_output_t ?? ''} onChange={e => u('ethylene_output_t', parseFloat(e.target.value) || undefined)} className={inputCls} />
        </Field>
        <Field label="Naphtha Cost (scenario)" domain="BUSINESS" unit="₹/tonne" tip="Key feedstock cost — scenario assumption. Mark as SCENARIO_ASSUMPTION.">
          <input type="number" min={0} step="any" value={data.naphtha_price_per_t ?? ''} onChange={e => u('naphtha_price_per_t', parseFloat(e.target.value) || undefined)} placeholder="e.g. 55000" className={inputCls} />
        </Field>
        <Field label="Cracker Age" domain="BUSINESS" unit="years" tip="Asset age affects turnaround frequency, efficiency, and capital planning horizon.">
          <input type="number" min={0} max={50} step="1" value={data.cracker_age_years ?? ''} onChange={e => u('cracker_age_years', parseInt(e.target.value) || undefined)} className={inputCls} />
        </Field>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// TEXTILE
// ─────────────────────────────────────────────
function TextileFields({ data, onChange }: { data: Partial<TextileProcessInputs>; onChange: (d: Partial<TextileProcessInputs>) => void }) {
  const u = (f: keyof TextileProcessInputs, v: any) => onChange({ ...data, [f]: v });
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Mill Processing Route" domain="CARBON" tip="Wet processing and dyeing operations dominate thermal and boiler emissions.">
          <select value={data.mill_route ?? 'COMPOSITE_PROCESSING'} onChange={e => u('mill_route', e.target.value as TextileProcessInputs['mill_route'])} className={selectCls}>
            <option value="COMPOSITE_PROCESSING">Composite Mill (Spinning, Weaving & Wet Processing)</option>
            <option value="WET_PROCESSING_ONLY">Stand-Alone Wet Processing & Dyeing</option>
            <option value="SPINNING_ONLY">Spinning Mill Only</option>
          </select>
        </Field>
        <Field label="Fibre Type" domain="CARBON" tip="Cotton = natural; polyester = synthetic petrochemical feedstock. Mix determines process energy.">
          <select value={data.fiber_type ?? 'COTTON'} onChange={e => u('fiber_type', e.target.value as TextileProcessInputs['fiber_type'])} className={selectCls}>
            <option value="COTTON">Cotton (100% natural)</option>
            <option value="POLYESTER">Polyester (100% synthetic)</option>
            <option value="BLENDED">Blended Cotton-Polyester</option>
            <option value="SYNTHETIC">Other Synthetic (Nylon, Viscose)</option>
          </select>
        </Field>
        <Field label="Specific Steam Consumption" domain="CARBON" unit="kg steam/kg fabric" tip="Steam required for dyeing and finishing — major thermal energy intensity driver.">
          <input type="number" min={0} max={30} step="0.1" value={data.steam_consumption_t ?? ''} onChange={e => u('steam_consumption_t', parseFloat(e.target.value) || undefined)} placeholder="e.g. 8" className={inputCls} />
        </Field>
        <Field label="ZLD System Present" domain="BOTH" tip="Zero Liquid Discharge system increases thermal energy demand but enables water recycling.">
          <select value={data.ZLD_present ? 'yes' : 'no'} onChange={e => u('ZLD_present', e.target.value === 'yes')} className={selectCls}>
            <option value="no">No ZLD</option>
            <option value="yes">Yes — ZLD Installed</option>
          </select>
        </Field>
        <Field label="Product Realisation" domain="BUSINESS" unit="₹/kg" tip="Net selling price per kg of finished fabric/garment — Business Twin revenue driver.">
          <input type="number" min={0} step="any" value={data.product_realisation_per_t ?? ''} onChange={e => u('product_realisation_per_t', parseFloat(e.target.value) || undefined)} placeholder="e.g. 350" className={inputCls} />
        </Field>
        <Field label="Export Share" domain="BUSINESS" unit="%" tip="% of output exported — affects realisation and forex exposure.">
          <input type="number" min={0} max={100} step="any" value={data.export_share_pct ?? ''} onChange={e => u('export_share_pct', parseFloat(e.target.value) || undefined)} placeholder="e.g. 45" className={inputCls} />
        </Field>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN DISPATCHER
// ─────────────────────────────────────────────

interface SectorProcessFieldsProps {
  sector: string;
  processInputs?: SectorProcessInputsV2;
  onChange: (updated: SectorProcessInputsV2) => void;
}

export function SectorProcessFields({ sector, processInputs, onChange }: SectorProcessFieldsProps) {
  const getData = <T,>(defaultVal: T): T => {
    if (!processInputs || processInputs.sector !== sector) return defaultVal;
    return (processInputs.data as unknown as T) || defaultVal;
  };

  const wrap = <T,>(data: T): SectorProcessInputsV2 =>
    ({ sector, data } as unknown as SectorProcessInputsV2);

  const sectorTitles: Record<string, string> = {
    cement: 'Cement — Process Engineering Inputs',
    iron_steel: 'Iron & Steel — Process Engineering Inputs (DRAFT)',
    aluminium: 'Aluminium — Process Engineering Inputs',
    chlor_alkali: 'Chlor-Alkali — Process Engineering Inputs',
    pulp_paper: 'Pulp & Paper — Process Engineering Inputs',
    petroleum_refinery: 'Petroleum Refinery — Process Engineering Inputs',
    petrochemicals: 'Petrochemicals — Process Engineering Inputs',
    textile: 'Textile — Process Engineering Inputs',
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2 pb-2 border-b border-[#E4E9E6]">
        <h4 className="text-xs font-bold text-[#10231C]">
          {sectorTitles[sector] ?? `${sector} — Process Engineering Inputs`}
        </h4>
      </div>

      {sector === 'cement' && (
        <CementFields
          data={getData<Partial<CementProcessInputs>>({ clinker_factor_pct: 74 })}
          onChange={d => onChange(wrap(d))}
        />
      )}
      {sector === 'iron_steel' && (
        <IronSteelFields
          data={getData<Partial<IronSteelProcessInputs>>({ steel_route: 'BF_BOF' })}
          onChange={d => onChange(wrap(d))}
        />
      )}
      {sector === 'aluminium' && (
        <AluminiumFields
          data={getData<Partial<AluminiumProcessInputs>>({ DC_SEC_kWh_per_t_Al: 14200 })}
          onChange={d => onChange(wrap(d))}
        />
      )}
      {sector === 'chlor_alkali' && (
        <ChlorAlkaliFields
          data={getData<Partial<ChlorAlkaliProcessInputs>>({ cell_technology: 'BIPOLAR_MEMBRANE' })}
          onChange={d => onChange(wrap(d))}
        />
      )}
      {sector === 'pulp_paper' && (
        <PulpPaperFields
          data={getData<Partial<PulpPaperProcessInputs>>({ specific_steam_consumption_t_per_t: 4.8 })}
          onChange={d => onChange(wrap(d))}
        />
      )}
      {sector === 'petroleum_refinery' && (
        <RefineryFields
          data={getData<Partial<PetroleumRefineryProcessInputs>>({ MBN: 9.8 })}
          onChange={d => onChange(wrap(d))}
        />
      )}
      {sector === 'petrochemicals' && (
        <PetrochemFields
          data={getData<Partial<PetrochemicalsProcessInputs>>({ feedstock_type: 'DUAL_FEED' })}
          onChange={d => onChange(wrap(d))}
        />
      )}
      {sector === 'textile' && (
        <TextileFields
          data={getData<Partial<TextileProcessInputs>>({ mill_route: 'COMPOSITE_PROCESSING' })}
          onChange={d => onChange(wrap(d))}
        />
      )}

      {!['cement', 'iron_steel', 'aluminium', 'chlor_alkali', 'pulp_paper', 'petroleum_refinery', 'petrochemicals', 'textile'].includes(sector) && (
        <div className="text-[11px] text-[#6B7A72] py-4 text-center">
          Sector-specific process fields not yet configured for "{sector}". Select one of the 8 AANGARA sectors.
        </div>
      )}
    </div>
  );
}
