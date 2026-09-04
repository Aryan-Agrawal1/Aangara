'use client';

/**
 * ScenarioDecisionStep — Step 8: Scenario Parameters & Management Objective
 * Covers: CCC price scenarios, management objective selector, pre-flight audit
 * Spec §23–25: Scenario Engine + Decision Objective Inputs
 */

import React from 'react';
import {
  Target, TrendingUp, DollarSign, Zap, Shield, CheckCircle2,
  ShieldCheck, ShieldAlert, AlertTriangle, Sparkles
} from 'lucide-react';
import type {
  ScenarioInputsV2,
  ManagementObjective,
  FacilityInputV2,
} from '@/types/facility-v2';
import { computeScope2FromLedger, computeScope1FuelFromLedger } from '@/types/facility-v2';

// ─────────────────────────────────────────────
// Management Objective options (spec §25)
// ─────────────────────────────────────────────
const OBJECTIVES: Array<{ value: ManagementObjective; label: string; desc: string; icon: React.ReactNode }> = [
  { value: 'BALANCED', label: 'Balanced', desc: 'Equal weight across cost, NPV, compliance & risk', icon: <Target className="w-4 h-4" /> },
  { value: 'LOWEST_CASH_COST', label: 'Lowest Cash Cost', desc: 'Minimise 3-year cash outflow for compliance', icon: <DollarSign className="w-4 h-4" /> },
  { value: 'MAXIMUM_NPV', label: 'Maximum NPV', desc: 'Maximise net present value over project life', icon: <TrendingUp className="w-4 h-4" /> },
  { value: 'MAXIMUM_IRR', label: 'Maximum IRR', desc: 'Maximise internal rate of return', icon: <TrendingUp className="w-4 h-4" /> },
  { value: 'FASTEST_COMPLIANCE', label: 'Fastest Compliance', desc: 'Achieve regulatory compliance in minimum time', icon: <Shield className="w-4 h-4" /> },
  { value: 'MAXIMUM_CO2_REDUCTION', label: 'Maximum CO₂ Reduction', desc: 'Maximise total GHG abatement regardless of cost', icon: <Zap className="w-4 h-4" /> },
  { value: 'MINIMUM_CAPEX', label: 'Minimum CAPEX', desc: 'Minimise upfront capital expenditure', icon: <DollarSign className="w-4 h-4" /> },
  { value: 'MAXIMUM_EBITDA', label: 'Maximum EBITDA', desc: 'Optimise for EBITDA impact of strategy', icon: <TrendingUp className="w-4 h-4" /> },
  { value: 'MINIMUM_EXECUTION_RISK', label: 'Minimum Execution Risk', desc: 'Prefer proven technology with lowest project risk', icon: <Shield className="w-4 h-4" /> },
];

// ─────────────────────────────────────────────
// Pre-flight audit summary
// ─────────────────────────────────────────────
function PreFlightAudit({ facilityInput }: { facilityInput: FacilityInputV2 }) {
  const prod = facilityInput.production.reporting_year_production;
  const elecSources = facilityInput.carbon_inputs.electricity_sources;
  const fuelStreams = facilityInput.carbon_inputs.fuel_streams;
  const totalElec = elecSources.reduce((s, e) => s + e.annual_mwh, 0);
  const totalFuel = fuelStreams.reduce((s, f) => s + (f.quantity_unit === 'TONNES' ? f.quantity : 0), 0);
  const scope2 = computeScope2FromLedger(elecSources, facilityInput.identity.state);
  const scope1 = computeScope1FuelFromLedger(fuelStreams);
  const sector = facilityInput.regulatory.sector;

  const checks: Array<{ label: string; pass: boolean; note: string }> = [
    { label: 'Facility identity', pass: !!facilityInput.identity.facility_name, note: facilityInput.identity.facility_name || 'Not set' },
    { label: 'Sector selected', pass: !!sector, note: sector || 'Not set' },
    { label: 'Reporting year', pass: !!facilityInput.reporting.financial_year, note: facilityInput.reporting.financial_year || 'Not set' },
    { label: 'Production > 0', pass: prod > 0, note: prod > 0 ? `${prod.toLocaleString()} ${facilityInput.production.production_unit}` : 'Required' },
    { label: 'Electricity sources', pass: elecSources.length > 0 && totalElec > 0, note: `${elecSources.length} source(s), ${totalElec.toLocaleString()} MWh` },
    { label: 'Fuel streams', pass: fuelStreams.length > 0 && totalFuel > 0, note: `${fuelStreams.length} stream(s), ${totalFuel.toLocaleString()} t` },
    { label: 'Scope 2 calculable', pass: scope2 >= 0, note: `${scope2.toFixed(0)} tCO₂e` },
    { label: 'Scope 1 calculable', pass: scope1 >= 0, note: `${scope1.toFixed(0)} tCO₂e` },
  ];

  const passCount = checks.filter(c => c.pass).length;
  const allPass = passCount === checks.length;
  const score = Math.round((passCount / checks.length) * 100);

  return (
    <div className={`rounded-xl border p-4 ${allPass ? 'bg-[#E8F5EE] border-[#0B4A3D]/25' : score >= 75 ? 'bg-amber-50 border-amber-200' : 'bg-rose-50 border-rose-200'}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          {allPass
            ? <ShieldCheck className="w-4 h-4 text-[#0B4A3D]" />
            : score >= 75
              ? <AlertTriangle className="w-4 h-4 text-amber-600" />
              : <ShieldAlert className="w-4 h-4 text-rose-500" />
          }
          <span className="text-xs font-bold text-[#10231C]">Pre-Flight Thermodynamic Audit</span>
        </div>
        <div className={`text-xs font-mono font-bold px-2.5 py-1 rounded border ${
          allPass ? 'bg-[#0B4A3D]/10 border-[#0B4A3D]/25 text-[#0B4A3D]' :
          score >= 75 ? 'bg-amber-100 border-amber-300 text-amber-700' :
          'bg-rose-100 border-rose-300 text-rose-600'
        }`}>
          Data Quality: {score}/100
        </div>
      </div>

      {/* Check grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
        {checks.map((c, i) => (
          <div key={i} className="flex items-start space-x-2">
            {c.pass
              ? <CheckCircle2 className="w-3.5 h-3.5 text-[#0B4A3D] flex-shrink-0 mt-0.5" />
              : <ShieldAlert className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
            }
            <div className="text-[11px]">
              <span className={`font-medium ${c.pass ? 'text-[#0B4A3D]' : 'text-amber-700'}`}>{c.label}</span>
              <span className="text-[#6B7A72] ml-1">— {c.note}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Emission summary */}
      <div className="pt-3 border-t border-[#E4E9E6]/60 grid grid-cols-3 gap-3 text-center">
        <div>
          <div className="text-[10px] uppercase text-[#6B7A72] font-mono">Scope 1 Fuel</div>
          <div className="text-[13px] font-bold font-mono text-amber-600">{(scope1 / 1000).toFixed(1)}k tCO₂e</div>
        </div>
        <div>
          <div className="text-[10px] uppercase text-[#6B7A72] font-mono">Scope 2 Grid</div>
          <div className="text-[13px] font-bold font-mono text-sky-600">{(scope2 / 1000).toFixed(1)}k tCO₂e</div>
        </div>
        <div>
          <div className="text-[10px] uppercase text-[#6B7A72] font-mono">Total (est.)</div>
          <div className="text-[13px] font-bold font-mono text-[#10231C]">{((scope1 + scope2) / 1000).toFixed(1)}k tCO₂e</div>
        </div>
      </div>

      <p className="text-[10px] text-[#6B7A72] mt-3 leading-relaxed">
        Note: Process emissions are added by the Carbon Engine using sector-specific parameters. Totals above are pre-submission estimates. Data class: <span className="font-mono font-semibold text-[#4B5A54]">ESTIMATE</span>.
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────
// CCC Price Scenario input
// ─────────────────────────────────────────────
function CCCPriceScenario({ scenario, onChange }: {
  scenario: ScenarioInputsV2;
  onChange: (s: ScenarioInputsV2) => void;
}) {
  const scenarios = scenario.CCC_price_scenarios || [];

  const updateScenario = (idx: number, price: number) => {
    const updated = [...scenarios];
    if (!updated[idx]) {
      updated[idx] = { scenario_id: `s${idx}`, label: ['Low', 'Base', 'High'][idx], CCC_price_inr: price, price_type: 'SCENARIO_ASSUMPTION' };
    } else {
      updated[idx] = { ...updated[idx], CCC_price_inr: price };
    }
    onChange({ ...scenario, CCC_price_scenarios: updated });
  };

  const prices = [
    scenarios[0]?.CCC_price_inr ?? 700,
    scenarios[1]?.CCC_price_inr ?? 1000,
    scenarios[2]?.CCC_price_inr ?? 1500,
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-1.5 text-[11px] text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
        <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
        <span>These are <strong>SCENARIO_ASSUMPTION</strong> inputs — not observed market prices. The engine will not treat them as regulatory facts.</span>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {['Low Price', 'Base Price (default)', 'High Price'].map((label, i) => (
          <div key={i}>
            <label className="text-xs font-medium text-[#10231C] flex items-center gap-1 mb-1">
              CCC — {label}
              <span className="text-[10px] font-mono text-amber-600 bg-amber-50 border border-amber-200 px-1 rounded">[₹/CCC]</span>
            </label>
            <input
              type="number"
              min={0}
              step={50}
              value={prices[i]}
              onChange={e => updateScenario(i, parseFloat(e.target.value) || 0)}
              className="w-full bg-white border border-[#E4E9E6] rounded-lg px-3 py-2 text-xs text-[#10231C] font-mono focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30"
            />
            <p className="text-[10px] text-[#6B7A72] mt-1">
              {i === 0 ? 'Conservative scenario' : i === 1 ? 'Base — used in optimizer' : 'Bull case — stress test'}
            </p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-[#10231C] flex items-center gap-1 mb-1">
            Project Delivery Confidence
            <span className="text-[10px] font-mono text-amber-600 bg-amber-50 border border-amber-200 px-1 rounded">[%]</span>
          </label>
          <input type="number" min={50} max={100} step={5}
            value={scenario.project_output_delivery_pct ?? 100}
            onChange={e => onChange({ ...scenario, project_output_delivery_pct: parseFloat(e.target.value) || 100 })}
            className="w-full bg-white border border-[#E4E9E6] rounded-lg px-3 py-2 text-xs text-[#10231C] font-mono focus:outline-none focus:border-amber-400" />
        </div>
        <div>
          <label className="text-xs font-medium text-[#10231C] flex items-center gap-1 mb-1">
            Project Delay Risk
            <span className="text-[10px] font-mono text-amber-600 bg-amber-50 border border-amber-200 px-1 rounded">[months]</span>
          </label>
          <input type="number" min={0} max={24} step={1}
            value={scenario.project_delay_months ?? 0}
            onChange={e => onChange({ ...scenario, project_delay_months: parseInt(e.target.value) || 0 })}
            className="w-full bg-white border border-[#E4E9E6] rounded-lg px-3 py-2 text-xs text-[#10231C] font-mono focus:outline-none focus:border-amber-400" />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────
interface ScenarioDecisionStepProps {
  facilityInput: FacilityInputV2;
  scenarioInputs: ScenarioInputsV2;
  managementObjective: ManagementObjective;
  onScenarioChange: (s: ScenarioInputsV2) => void;
  onObjectiveChange: (o: ManagementObjective) => void;
  onSubmit: () => void;
  isLoading?: boolean;
}

export function ScenarioDecisionStep({
  facilityInput,
  scenarioInputs,
  managementObjective,
  onScenarioChange,
  onObjectiveChange,
  onSubmit,
  isLoading,
}: ScenarioDecisionStepProps) {
  return (
    <div className="space-y-6">
      {/* Pre-Flight Audit */}
      <div>
        <h4 className="text-xs font-bold text-[#10231C] mb-3 flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-[#0B4A3D]" />
          <span>Step 8A — Pre-Flight Input Audit</span>
        </h4>
        <PreFlightAudit facilityInput={facilityInput} />
      </div>

      {/* CCC Price Scenarios */}
      <div>
        <h4 className="text-xs font-bold text-[#10231C] mb-3 flex items-center space-x-2">
          <TrendingUp className="w-4 h-4 text-amber-500" />
          <span>Step 8B — Carbon Credit Certificate (CCC) Price Scenarios</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-600">SCENARIO_ASSUMPTION</span>
        </h4>
        <CCCPriceScenario scenario={scenarioInputs} onChange={onScenarioChange} />
      </div>

      {/* Management Objective */}
      <div>
        <h4 className="text-xs font-bold text-[#10231C] mb-3 flex items-center space-x-2">
          <Target className="w-4 h-4 text-amber-500" />
          <span>Step 8C — Management Decision Objective</span>
        </h4>
        <p className="text-[11px] text-[#6B7A72] mb-3">
          Select the primary objective for the Capital Optimizer. Stored separately from factual facility data as a business preference.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {OBJECTIVES.map(obj => (
            <button
              key={obj.value}
              type="button"
              onClick={() => onObjectiveChange(obj.value)}
              className={`flex items-start space-x-2 p-3 rounded-xl border text-left transition-all ${
                managementObjective === obj.value
                  ? 'bg-[#E8F5EE] border-[#0B4A3D]/40 ring-1 ring-[#0B4A3D]/20 shadow-sm'
                  : 'bg-white border-[#E4E9E6] hover:border-[#0B4A3D]/20 hover:bg-[#F6F8F7]'
              }`}
            >
              <div className={`mt-0.5 flex-shrink-0 ${managementObjective === obj.value ? 'text-[#0B4A3D]' : 'text-[#6B7A72]'}`}>
                {obj.icon}
              </div>
              <div>
                <div className={`text-[11px] font-bold ${managementObjective === obj.value ? 'text-[#0B4A3D]' : 'text-[#10231C]'}`}>
                  {obj.label}
                </div>
                <div className="text-[10px] text-[#6B7A72] mt-0.5">{obj.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Submit */}
      <div className="pt-4 border-t border-[#E4E9E6]">
        <button
          type="button"
          onClick={onSubmit}
          disabled={isLoading}
          className="w-full py-3.5 px-6 rounded-xl text-sm font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white flex items-center justify-center space-x-2.5 shadow-lg shadow-emerald-950/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Sparkles className="w-5 h-5" />
          <span>{isLoading ? 'Computing Facility Intelligence...' : 'Run AANGARA Decision Intelligence'}</span>
        </button>
        <p className="text-center text-[10px] text-[#6B7A72] mt-2">
          Runs Carbon Engine, Benchmark, Anomaly, Opportunity, Finance, Scenario & Capital Optimizer simultaneously.
        </p>
      </div>
    </div>
  );
}
