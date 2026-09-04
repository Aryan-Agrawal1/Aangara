'use client';

/**
 * BusinessTwinPanel — Step 5 & 7 Business Twin inputs
 * Covers: Electricity economics, Fuel landed cost, Utilities, Production economics
 * All fields tagged BUSINESS_TWIN domain (amber accent)
 */

import React, { useState } from 'react';
import { DollarSign, Zap, Flame, ChevronDown, ChevronUp } from 'lucide-react';
import type {
  BusinessTwinInputsV2,
  ElectricityTariffEntry,
  FuelEconomicsEntry,
  ManagementObjective,
} from '@/types/facility-v2';

const inputCls = "w-full bg-white border border-[#E4E9E6] rounded-lg px-3 py-2 text-xs text-[#10231C] font-mono focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 placeholder-[#6B7A72]";
const labelCls = "text-xs font-medium text-[#10231C]";
const subsectionCls = "space-y-4 p-4 rounded-xl bg-amber-50/50 border border-amber-100";
const headerCls = "flex items-center justify-between cursor-pointer";

function CollapsibleSection({ title, icon, defaultOpen = false, children }: {
  title: string;
  icon: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl border border-amber-200/80 overflow-hidden">
      <div
        className={`${headerCls} px-4 py-3 bg-amber-50 hover:bg-amber-100/70 transition-colors`}
        onClick={() => setOpen(o => !o)}
      >
        <div className="flex items-center space-x-2.5">
          {icon}
          <span className="text-xs font-bold text-[#10231C]">{title}</span>
          <span className="text-[10px] font-mono text-amber-600 bg-amber-100 border border-amber-200 px-1.5 py-0.5 rounded">BUSINESS TWIN</span>
        </div>
        {open ? <ChevronUp className="w-3.5 h-3.5 text-[#6B7A72]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#6B7A72]" />}
      </div>
      {open && <div className="px-4 py-4 space-y-4">{children}</div>}
    </div>
  );
}

// ── Electricity Tariff Section ──
function ElectricityEconomics({ tariffs, onChange }: {
  tariffs: ElectricityTariffEntry[];
  onChange: (t: ElectricityTariffEntry[]) => void;
}) {
  const primary = tariffs[0] || {} as ElectricityTariffEntry;
  const update = (patch: Partial<ElectricityTariffEntry>) => {
    const updated = [{ ...primary, ...patch }, ...tariffs.slice(1)];
    onChange(updated);
  };
  // If no tariff entries yet, initialize one
  const init = () => onChange([{
    source_type: 'GRID_DISCOM',
    energy_charge_per_kwh: 0,
    demand_charge_per_kva: 0,
  }]);

  if (!tariffs.length) {
    return (
      <button type="button" onClick={init}
        className="text-[11px] text-amber-600 hover:text-amber-700 font-semibold border border-amber-200 rounded-lg px-3 py-2 bg-amber-50 hover:bg-amber-100 transition-all">
        + Add Electricity Tariff Data
      </button>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[
        ['DISCOM / Supplier', 'DISCOM', primary.DISCOM ?? '', (v: string) => update({ DISCOM: v }), 'text', undefined, 'e.g. JVVNL, TANGEDCO'],
        ['Energy Charge', 'energy_charge_per_kwh', primary.energy_charge_per_kwh ?? '', (v: number) => update({ energy_charge_per_kwh: v }), 'number', '₹/kWh', 'e.g. 7.50'],
        ['Demand Charge', 'demand_charge_per_kva', primary.demand_charge_per_kva ?? '', (v: number) => update({ demand_charge_per_kva: v }), 'number', '₹/kVA/mo', 'e.g. 350'],
        ['Wheeling Charge', 'wheeling_charge_per_kwh', primary.wheeling_charge_per_kwh ?? '', (v: number) => update({ wheeling_charge_per_kwh: v }), 'number', '₹/kWh', 'e.g. 0.65'],
        ['CSS', 'CSS_per_kwh', primary.CSS_per_kwh ?? '', (v: number) => update({ CSS_per_kwh: v }), 'number', '₹/kWh', 'Cross-Subsidy Surcharge'],
        ['Additional Surcharge', 'additional_surcharge_per_kwh', primary.additional_surcharge_per_kwh ?? '', (v: number) => update({ additional_surcharge_per_kwh: v }), 'number', '₹/kWh', ''],
        ['PPA / Captive Price', 'PPA_price_per_kwh', primary.PPA_price_per_kwh ?? '', (v: number) => update({ PPA_price_per_kwh: v }), 'number', '₹/kWh', 'If applicable'],
        ['Tariff Order Reference', 'tariff_order_reference', primary.tariff_order_reference ?? '', (v: string) => update({ tariff_order_reference: v }), 'text', undefined, 'e.g. MYT Order 2024'],
      ].map(([label, field, value, handler, type, unit, placeholder]: any) => (
        <div key={field as string}>
          <label className={`${labelCls} flex items-center gap-1 mb-1`}>
            {label as string}
            {unit && <span className="text-[10px] text-amber-600 font-mono bg-amber-50 border border-amber-200 px-1 rounded">[{unit}]</span>}
          </label>
          <input
            type={type as string}
            step="any"
            value={value as any}
            onChange={e => (handler as any)(type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)}
            placeholder={placeholder as string}
            className={inputCls}
          />
        </div>
      ))}
    </div>
  );
}

// ── Fuel Economics Section ──
function FuelEconomicsSection({ economics, onChange }: {
  economics: FuelEconomicsEntry[];
  onChange: (e: FuelEconomicsEntry[]) => void;
}) {
  const primary = economics[0] || {} as FuelEconomicsEntry;
  const update = (patch: Partial<FuelEconomicsEntry>) => {
    const updated = [{ ...primary, ...patch }, ...economics.slice(1)];
    onChange(updated);
  };
  const init = () => onChange([{ fuel_id: 'fuel-econ-1' }]);

  if (!economics.length) {
    return (
      <button type="button" onClick={init}
        className="text-[11px] text-amber-600 hover:text-amber-700 font-semibold border border-amber-200 rounded-lg px-3 py-2 bg-amber-50 hover:bg-amber-100 transition-all">
        + Add Fuel Economics
      </button>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[
        ['Contract Price', 'contract_price_per_tonne', primary.contract_price_per_tonne ?? '', (v: number) => update({ contract_price_per_tonne: v }), '₹/tonne', 'e.g. 5500'],
        ['Freight Cost', 'freight_cost_per_tonne', primary.freight_cost_per_tonne ?? '', (v: number) => update({ freight_cost_per_tonne: v }), '₹/tonne', 'e.g. 850'],
        ['Port Charge', 'port_charge_per_tonne', primary.port_charge_per_tonne ?? '', (v: number) => update({ port_charge_per_tonne: v }), '₹/tonne', 'If applicable'],
        ['Handling Cost', 'handling_cost_per_tonne', primary.handling_cost_per_tonne ?? '', (v: number) => update({ handling_cost_per_tonne: v }), '₹/tonne', 'e.g. 120'],
        ['Storage Cost', 'storage_cost_per_tonne', primary.storage_cost_per_tonne ?? '', (v: number) => update({ storage_cost_per_tonne: v }), '₹/tonne', 'e.g. 45'],
        ['Transit Loss', 'loss_pct', primary.loss_pct ?? '', (v: number) => update({ loss_pct: v }), '%', 'e.g. 0.5'],
        ['Inventory Days', 'inventory_days', primary.inventory_days ?? '', (v: number) => update({ inventory_days: v }), 'days', 'e.g. 21'],
      ].map(([label, field, value, handler, unit, placeholder]: any) => (
        <div key={field as string}>
          <label className={`${labelCls} flex items-center gap-1 mb-1`}>
            {label as string}
            <span className="text-[10px] text-amber-600 font-mono bg-amber-50 border border-amber-200 px-1 rounded">[{unit}]</span>
          </label>
          <input
            type="number" step="any"
            value={value as any}
            onChange={e => (handler as any)(parseFloat(e.target.value) || 0)}
            placeholder={placeholder as string}
            className={inputCls}
          />
        </div>
      ))}
      {/* Derived landed cost display */}
      {primary.contract_price_per_tonne != null && (
        <div className="md:col-span-3 flex items-center justify-between p-3 rounded-lg bg-amber-100/60 border border-amber-200">
          <span className="text-[11px] text-amber-700 font-semibold">Estimated Landed Cost</span>
          <span className="text-[13px] font-mono font-bold text-amber-700">
            ₹{(
              (primary.contract_price_per_tonne || 0) +
              (primary.freight_cost_per_tonne || 0) +
              (primary.port_charge_per_tonne || 0) +
              (primary.handling_cost_per_tonne || 0) +
              (primary.storage_cost_per_tonne || 0)
            ).toLocaleString()}/tonne
          </span>
          <span className="text-[10px] text-amber-500 font-mono">ESTIMATE — verify against invoice</span>
        </div>
      )}
    </div>
  );
}

// ── Operating Costs ──
function OperatingCosts({ inputs, onChange }: {
  inputs: BusinessTwinInputsV2;
  onChange: (patch: Partial<BusinessTwinInputsV2>) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[
        ['Labour Cost', 'labour_cost_cr', inputs.labour_cost_cr ?? '', '₹ Cr/yr', 'e.g. 18'],
        ['Maintenance Cost', 'maintenance_cost_cr', inputs.maintenance_cost_cr ?? '', '₹ Cr/yr', 'e.g. 12'],
        ['Admin / Overhead', 'admin_cost_cr', inputs.admin_cost_cr ?? '', '₹ Cr/yr', 'e.g. 8'],
        ['Compliance / Regulatory', 'compliance_cost_cr', inputs.compliance_cost_cr ?? '', '₹ Cr/yr', 'e.g. 2'],
      ].map(([label, field, value, unit, placeholder]: any) => (
        <div key={field as string}>
          <label className={`${labelCls} flex items-center gap-1 mb-1`}>
            {label as string}
            <span className="text-[10px] text-amber-600 font-mono bg-amber-50 border border-amber-200 px-1 rounded">[{unit}]</span>
          </label>
          <input
            type="number" step="any"
            value={value as any}
            onChange={e => onChange({ [field]: parseFloat(e.target.value) || undefined })}
            placeholder={placeholder as string}
            className={inputCls}
          />
        </div>
      ))}
    </div>
  );
}

// ── Main Component ──
interface BusinessTwinPanelProps {
  inputs: BusinessTwinInputsV2;
  onChange: (updated: BusinessTwinInputsV2) => void;
}

export function BusinessTwinPanel({ inputs, onChange }: BusinessTwinPanelProps) {
  const update = (patch: Partial<BusinessTwinInputsV2>) =>
    onChange({ ...inputs, ...patch });

  return (
    <div className="space-y-3">
      {/* Domain Banner */}
      <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200">
        <DollarSign className="w-4 h-4 text-amber-600" />
        <span className="text-xs font-bold text-amber-700">BUSINESS TWIN DOMAIN</span>
        <span className="text-[10px] text-amber-500">— All fields in this section feed Finance, Scenario & Capital Optimizer engines</span>
      </div>

      {/* Electricity Economics */}
      <CollapsibleSection
        title="Electricity Economics — Tariff & Procurement"
        icon={<Zap className="w-4 h-4 text-amber-500" />}
        defaultOpen={true}
      >
        <p className="text-[11px] text-[#6B7A72] mb-3">
          Energy tariff data feeds landed electricity cost computation. Source: applicable SERC tariff order.
          <span className="ml-1 text-amber-600 font-semibold">BUSINESS_TWIN — must not be mixed into Scope 2 calculation.</span>
        </p>
        <ElectricityEconomics
          tariffs={inputs.electricity_tariffs || []}
          onChange={t => update({ electricity_tariffs: t })}
        />
      </CollapsibleSection>

      {/* Fuel Economics */}
      <CollapsibleSection
        title="Fuel Landed Cost — Primary Fuel Stream"
        icon={<Flame className="w-4 h-4 text-amber-500" />}
      >
        <p className="text-[11px] text-[#6B7A72] mb-3">
          Fuel landed cost = contract price + freight + port + handling − transit loss. Source: fuel invoice / freight contract.
        </p>
        <FuelEconomicsSection
          economics={inputs.fuel_economics || []}
          onChange={e => update({ fuel_economics: e })}
        />
      </CollapsibleSection>

      {/* Operating Costs */}
      <CollapsibleSection
        title="Operating Cost Structure"
        icon={<DollarSign className="w-4 h-4 text-amber-500" />}
      >
        <OperatingCosts inputs={inputs} onChange={update} />
      </CollapsibleSection>

      {/* Business Constraints */}
      <CollapsibleSection
        title="Budget & Business Constraints"
        icon={<DollarSign className="w-4 h-4 text-amber-500" />}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={`${labelCls} mb-1 flex items-center gap-1`}>
              Available CAPEX Budget
              <span className="text-[10px] text-amber-600 font-mono bg-amber-50 border border-amber-200 px-1 rounded">[₹ Cr]</span>
            </label>
            <input type="number" step="any" value={inputs.available_capex_budget_cr ?? ''}
              onChange={e => update({ available_capex_budget_cr: parseFloat(e.target.value) || undefined })}
              placeholder="e.g. 200" className={inputCls} />
          </div>
          <div>
            <label className={`${labelCls} mb-1 flex items-center gap-1`}>
              Max Acceptable Payback
              <span className="text-[10px] text-amber-600 font-mono bg-amber-50 border border-amber-200 px-1 rounded">[years]</span>
            </label>
            <input type="number" step="0.5" min={1} max={20} value={inputs.maximum_acceptable_payback_years ?? ''}
              onChange={e => update({ maximum_acceptable_payback_years: parseFloat(e.target.value) || undefined })}
              placeholder="e.g. 5" className={inputCls} />
          </div>
          <div>
            <label className={`${labelCls} mb-1 flex items-center gap-1`}>
              Risk Tolerance
            </label>
            <select value={inputs.risk_tolerance ?? 'MEDIUM'}
              onChange={e => update({ risk_tolerance: e.target.value as 'LOW' | 'MEDIUM' | 'HIGH' })}
              className="w-full bg-white border border-[#E4E9E6] rounded-lg px-3 py-2 text-xs text-[#10231C] font-semibold focus:outline-none focus:border-amber-400">
              <option value="LOW">Low — Prefer proven technology only</option>
              <option value="MEDIUM">Medium — Accept moderate execution risk</option>
              <option value="HIGH">High — Accept higher risk for better returns</option>
            </select>
          </div>
        </div>
      </CollapsibleSection>
    </div>
  );
}
