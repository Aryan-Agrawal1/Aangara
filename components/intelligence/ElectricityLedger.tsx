'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Zap, Info } from 'lucide-react';
import {
  ElectricitySourceEntry,
  ELECTRICITY_SOURCE_TYPES,
  getElectricityEmissionFactor,
  type ElectricitySourceType,
  type DataClass,
} from '@/types/facility-v2';

const SOURCE_LABELS: Record<string, string> = {
  GRID_DISCOM: 'Grid — DISCOM',
  CAPTIVE_COAL: 'Captive — Coal CPP',
  CAPTIVE_GAS: 'Captive — Gas CPP',
  CAPTIVE_SOLAR: 'Captive — Solar',
  CAPTIVE_WIND: 'Captive — Wind',
  CAPTIVE_HYDRO: 'Captive — Hydro',
  CAPTIVE_BIOMASS: 'Captive — Biomass',
  ROOFTOP_SOLAR: 'Rooftop Solar',
  GROUP_CAPTIVE_SOLAR: 'Group Captive Solar',
  GROUP_CAPTIVE_WIND: 'Group Captive Wind',
  OPEN_ACCESS_SOLAR: 'Open Access — Solar',
  OPEN_ACCESS_WIND: 'Open Access — Wind',
  OPEN_ACCESS_HYBRID: 'Open Access — Hybrid',
  LONG_TERM_PPA: 'Long-Term PPA',
  MEDIUM_TERM_PPA: 'Medium-Term PPA',
  SHORT_TERM_PPA: 'Short-Term PPA',
  GREEN_TARIFF: 'Green Tariff',
  POWER_EXCHANGE: 'Power Exchange (IEX/PXIL)',
  BATTERY_DISCHARGE: 'Battery Storage Discharge',
  WHRS_GENERATION: 'WHRS Generation',
  TRT_GENERATION: 'TRT / CDQ Generation',
  OTHER: 'Other',
};

const RENEWABLE_SOURCES = new Set([
  'CAPTIVE_SOLAR', 'CAPTIVE_WIND', 'CAPTIVE_HYDRO', 'CAPTIVE_BIOMASS',
  'ROOFTOP_SOLAR', 'GROUP_CAPTIVE_SOLAR', 'GROUP_CAPTIVE_WIND',
  'OPEN_ACCESS_SOLAR', 'OPEN_ACCESS_WIND', 'OPEN_ACCESS_HYBRID',
  'LONG_TERM_PPA', 'MEDIUM_TERM_PPA', 'SHORT_TERM_PPA', 'GREEN_TARIFF',
  'WHRS_GENERATION', 'TRT_GENERATION', 'BATTERY_DISCHARGE',
]);

let _id = 0;
function genId() { return `src-${++_id}-${Date.now()}`; }

interface ElectricityLedgerProps {
  sources: ElectricitySourceEntry[];
  onChange: (sources: ElectricitySourceEntry[]) => void;
  state?: string;
  readOnly?: boolean;
}

export function ElectricityLedger({ sources, onChange, state, readOnly }: ElectricityLedgerProps) {
  const addRow = () => {
    onChange([
      ...sources,
      {
        source_id: genId(),
        source_type: 'GRID_DISCOM',
        annual_mwh: 0,
        renewable_status: false,
        data_class: 'REAL_FACILITY_INPUT' as DataClass,
      },
    ]);
  };

  const removeRow = (id: string) => {
    onChange(sources.filter(s => s.source_id !== id));
  };

  const updateRow = (id: string, patch: Partial<ElectricitySourceEntry>) => {
    onChange(sources.map(s => {
      if (s.source_id !== id) return s;
      const updated = { ...s, ...patch };
      // Auto-set renewable_status based on source type
      if (patch.source_type) {
        updated.renewable_status = RENEWABLE_SOURCES.has(patch.source_type);
      }
      return updated;
    }));
  };

  // Derived totals
  const totalMwh = sources.reduce((sum, s) => sum + (s.annual_mwh || 0), 0);
  const reMwh = sources.filter(s => s.renewable_status).reduce((sum, s) => sum + (s.annual_mwh || 0), 0);
  const gridMwh = totalMwh - reMwh;
  const totalScope2 = sources.reduce((sum, s) => {
    const ef = s.factor_override ?? getElectricityEmissionFactor(s.source_type, s.renewable_status, state);
    return sum + (s.annual_mwh || 0) * ef;
  }, 0);

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-md bg-sky-950/40 border border-sky-800/40">
            <Zap className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <div>
            <span className="text-xs font-bold text-[#10231C]">Electricity Source Ledger</span>
            <span className="ml-2 text-[10px] font-mono text-sky-600 bg-sky-50 border border-sky-200 px-1.5 py-0.5 rounded">SCOPE 2</span>
          </div>
        </div>
        <div className="flex items-center space-x-1.5 text-[10px] text-[#6B7A72]">
          <Info className="w-3 h-3" />
          <span>Each source gets its own emission factor — no single-field totals</span>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="rounded-xl border border-[#E4E9E6] overflow-hidden">
        {/* Column Headers */}
        <div className="grid grid-cols-12 gap-0 bg-[#F6F8F7] border-b border-[#E4E9E6] px-3 py-2">
          <div className="col-span-4 text-[10px] font-semibold text-[#6B7A72] uppercase tracking-wide">Source Type</div>
          <div className="col-span-2 text-[10px] font-semibold text-[#6B7A72] uppercase tracking-wide">Annual MWh</div>
          <div className="col-span-2 text-[10px] font-semibold text-[#6B7A72] uppercase tracking-wide">RE Status</div>
          <div className="col-span-2 text-[10px] font-semibold text-[#6B7A72] uppercase tracking-wide text-right">EF (tCO₂/MWh)</div>
          <div className="col-span-1 text-[10px] font-semibold text-[#6B7A72] uppercase tracking-wide text-right">Scope 2</div>
          <div className="col-span-1"></div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-[#E4E9E6]">
          {sources.map((src, idx) => {
            const ef = src.factor_override ?? getElectricityEmissionFactor(src.source_type, src.renewable_status, state);
            const scope2 = (src.annual_mwh || 0) * ef;
            return (
              <div key={src.source_id} className="grid grid-cols-12 gap-0 px-3 py-2 items-center bg-white hover:bg-[#F6F8F7]/50 transition-colors">
                {/* Source Type */}
                <div className="col-span-4 pr-2">
                  <select
                    value={src.source_type}
                    onChange={e => updateRow(src.source_id, { source_type: e.target.value as ElectricitySourceType })}
                    disabled={readOnly}
                    className="w-full bg-white border border-[#E4E9E6] rounded-md px-2 py-1.5 text-[11px] text-[#10231C] focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/30 font-medium disabled:opacity-60"
                  >
                    {ELECTRICITY_SOURCE_TYPES.map(t => (
                      <option key={t} value={t}>{SOURCE_LABELS[t] || t}</option>
                    ))}
                  </select>
                </div>

                {/* Annual MWh */}
                <div className="col-span-2 pr-2">
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={src.annual_mwh || ''}
                    onChange={e => updateRow(src.source_id, { annual_mwh: parseFloat(e.target.value) || 0 })}
                    disabled={readOnly}
                    placeholder="MWh/yr"
                    className="w-full bg-white border border-[#E4E9E6] rounded-md px-2 py-1.5 text-[11px] text-[#10231C] font-mono focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/30 disabled:opacity-60"
                  />
                </div>

                {/* RE Status badge */}
                <div className="col-span-2 pr-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold ${
                    src.renewable_status
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-[#F6F8F7] text-[#6B7A72] border border-[#E4E9E6]'
                  }`}>
                    {src.renewable_status ? '✓ Zero-emission' : '⚡ Grid EF applied'}
                  </span>
                </div>

                {/* Emission Factor */}
                <div className="col-span-2 pr-2 text-right">
                  <span className={`text-[11px] font-mono font-semibold ${ef === 0 ? 'text-emerald-600' : 'text-sky-600'}`}>
                    {ef.toFixed(3)}
                  </span>
                  {src.factor_override != null && (
                    <span className="ml-1 text-[9px] text-amber-500 font-mono">[OVERRIDE]</span>
                  )}
                </div>

                {/* Scope 2 tCO2e */}
                <div className="col-span-1 pr-2 text-right">
                  <span className={`text-[11px] font-mono font-bold ${scope2 === 0 ? 'text-emerald-600' : 'text-[#10231C]'}`}>
                    {scope2 >= 1000
                      ? `${(scope2 / 1000).toFixed(1)}k`
                      : scope2.toFixed(0)}
                  </span>
                </div>

                {/* Remove */}
                <div className="col-span-1 flex justify-center">
                  {!readOnly && sources.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRow(src.source_id)}
                      className="p-1 rounded hover:bg-rose-50 text-[#6B7A72] hover:text-rose-500 transition-colors"
                      title="Remove source"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Totals Row */}
        <div className="grid grid-cols-12 gap-0 px-3 py-2.5 bg-sky-50 border-t border-sky-200">
          <div className="col-span-4 text-[11px] font-bold text-[#10231C] flex items-center space-x-1.5">
            <span>TOTALS</span>
            <span className="text-[10px] text-[#6B7A72] font-normal">({sources.length} source{sources.length !== 1 ? 's' : ''})</span>
          </div>
          <div className="col-span-2 text-[11px] font-mono font-bold text-sky-700">
            {totalMwh >= 1000 ? `${(totalMwh / 1000).toFixed(1)}k` : totalMwh.toFixed(0)} MWh
          </div>
          <div className="col-span-2 text-[11px] font-mono text-emerald-600">
            RE: {totalMwh > 0 ? ((reMwh / totalMwh) * 100).toFixed(1) : '0.0'}%
          </div>
          <div className="col-span-2 text-right">
            <span className="text-[10px] text-[#6B7A72]">Weighted avg EF:</span>
            <span className="ml-1 text-[11px] font-mono font-semibold text-sky-600">
              {totalMwh > 0 ? (totalScope2 / totalMwh).toFixed(3) : '0.000'}
            </span>
          </div>
          <div className="col-span-1 text-right text-[11px] font-mono font-bold text-sky-700">
            {totalScope2 >= 1000
              ? `${(totalScope2 / 1000).toFixed(1)}k`
              : totalScope2.toFixed(0)}
          </div>
          <div className="col-span-1"></div>
        </div>
      </div>

      {/* Add Row */}
      {!readOnly && (
        <button
          type="button"
          onClick={addRow}
          className="flex items-center space-x-2 text-[11px] font-semibold text-sky-600 hover:text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 hover:border-sky-300 rounded-lg px-3 py-2 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Electricity Source</span>
        </button>
      )}

      {/* Summary chips */}
      <div className="flex flex-wrap gap-2 text-[10px]">
        <span className="px-2 py-1 rounded-md bg-[#F6F8F7] border border-[#E4E9E6] text-[#4B5A54] font-mono">
          Grid: <strong className="text-sky-600">{gridMwh >= 1000 ? `${(gridMwh / 1000).toFixed(1)}k` : gridMwh.toFixed(0)} MWh</strong>
        </span>
        <span className="px-2 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono">
          Zero-emission: <strong>{reMwh >= 1000 ? `${(reMwh / 1000).toFixed(1)}k` : reMwh.toFixed(0)} MWh</strong>
        </span>
        <span className="px-2 py-1 rounded-md bg-sky-50 border border-sky-200 text-sky-700 font-mono">
          Scope 2: <strong>{totalScope2 >= 1000 ? `${(totalScope2 / 1000).toFixed(1)}k` : totalScope2.toFixed(0)} tCO₂e</strong>
        </span>
        <span className="px-2 py-1 rounded-md bg-[#F6F8F7] border border-[#E4E9E6] text-[#4B5A54] font-mono">
          CEA EF: 0.716 tCO₂/MWh (v21.0, FY2023-24) <span className="text-[#0B4A3D] font-semibold">FACT</span>
        </span>
      </div>
    </div>
  );
}
