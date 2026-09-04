'use client';

import React from 'react';
import { Plus, Trash2, Flame, Info } from 'lucide-react';
import {
  FuelStreamEntry,
  FUEL_TYPES,
  FUEL_EMISSION_FACTORS,
  type FuelType,
  type DataClass,
} from '@/types/facility-v2';

const FUEL_LABELS: Record<string, string> = {
  INDIAN_DOMESTIC_COAL: 'Indian Domestic Coal',
  IMPORTED_COAL: 'Imported Coal',
  WASHED_COAL: 'Washed / Beneficiated Coal',
  COAL_BLEND: 'Coal Blend',
  PETCOKE: 'Petroleum Coke (Petcoke)',
  FURNACE_OIL: 'Furnace Oil',
  LDO: 'Light Diesel Oil (LDO)',
  DIESEL: 'Diesel (HSD)',
  NAPHTHA: 'Naphtha',
  NATURAL_GAS: 'Natural Gas',
  LNG: 'LNG',
  RLNG: 'RLNG',
  LPG: 'LPG',
  REFINERY_FUEL_GAS: 'Refinery Fuel Gas',
  COKE_OVEN_GAS: 'Coke Oven Gas',
  BLAST_FURNACE_GAS: 'Blast Furnace Gas',
  LD_GAS: 'LD Gas',
  PRODUCER_GAS: 'Producer Gas',
  SYNGAS: 'Syngas',
  BIOMASS: 'Biomass / Agro-Residue',
  BAGASSE: 'Bagasse',
  BIOGAS: 'Biogas',
  BIOMETHANE: 'Biomethane',
  RDF: 'Refuse Derived Fuel (RDF)',
  SRF: 'Solid Recovered Fuel (SRF)',
  AFR: 'Alternative Fuel & Raw Material (AFR)',
  WASTE_OIL: 'Waste / Used Oil',
  HYDROGEN: 'Green Hydrogen',
  AMMONIA: 'Green Ammonia',
  OTHER: 'Other',
};

const ZERO_EF_FUELS = new Set(['BIOMASS', 'BAGASSE', 'BIOGAS', 'BIOMETHANE', 'HYDROGEN', 'AMMONIA']);

let _id = 0;
function genId() { return `fuel-${++_id}-${Date.now()}`; }

interface FuelStreamLedgerProps {
  streams: FuelStreamEntry[];
  onChange: (streams: FuelStreamEntry[]) => void;
  readOnly?: boolean;
}

export function FuelStreamLedger({ streams, onChange, readOnly }: FuelStreamLedgerProps) {
  const addRow = () => {
    onChange([
      ...streams,
      {
        fuel_id: genId(),
        fuel_type: 'INDIAN_DOMESTIC_COAL',
        quantity: 0,
        quantity_unit: 'TONNES',
        data_class: 'REAL_FACILITY_INPUT' as DataClass,
      },
    ]);
  };

  const removeRow = (id: string) => {
    onChange(streams.filter(s => s.fuel_id !== id));
  };

  const updateRow = (id: string, patch: Partial<FuelStreamEntry>) => {
    onChange(streams.map(s => s.fuel_id !== id ? s : { ...s, ...patch }));
  };

  // Derived totals
  const totalTonnes = streams.reduce((sum, s) => {
    if (s.quantity_unit === 'TONNES') return sum + (s.quantity || 0);
    if (s.quantity_unit === 'KG') return sum + (s.quantity || 0) / 1000;
    return sum + (s.quantity || 0); // GJ — approximate
  }, 0);

  const totalScope1 = streams.reduce((sum, s) => {
    let qty = s.quantity || 0;
    if (s.quantity_unit === 'KG') qty /= 1000;
    if (s.quantity_unit === 'GJ') qty /= 28;
    const ef = s.emission_factor_override ?? FUEL_EMISSION_FACTORS[s.fuel_type] ?? 1.95;
    return sum + qty * ef;
  }, 0);

  const biogenicTonnes = streams.filter(s => ZERO_EF_FUELS.has(s.fuel_type))
    .reduce((sum, s) => sum + (s.quantity_unit === 'TONNES' ? (s.quantity || 0) : 0), 0);

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-md bg-amber-950/20 border border-amber-800/40">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div>
            <span className="text-xs font-bold text-[#10231C]">Thermal Fuel Stream Ledger</span>
            <span className="ml-2 text-[10px] font-mono text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">SCOPE 1 COMBUSTION</span>
          </div>
        </div>
        <div className="flex items-center space-x-1.5 text-[10px] text-[#6B7A72]">
          <Info className="w-3 h-3" />
          <span>Each fuel stream has its own EF — no single-type approximation</span>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="rounded-xl border border-[#E4E9E6] overflow-hidden">
        {/* Column Headers */}
        <div className="grid grid-cols-12 gap-0 bg-[#F6F8F7] border-b border-[#E4E9E6] px-3 py-2">
          <div className="col-span-3 text-[10px] font-semibold text-[#6B7A72] uppercase tracking-wide">Fuel Type</div>
          <div className="col-span-2 text-[10px] font-semibold text-[#6B7A72] uppercase tracking-wide">Quantity</div>
          <div className="col-span-1 text-[10px] font-semibold text-[#6B7A72] uppercase tracking-wide">Unit</div>
          <div className="col-span-2 text-[10px] font-semibold text-[#6B7A72] uppercase tracking-wide">EF Override</div>
          <div className="col-span-2 text-[10px] font-semibold text-[#6B7A72] uppercase tracking-wide text-right">Default EF (tCO₂/t)</div>
          <div className="col-span-1 text-[10px] font-semibold text-[#6B7A72] uppercase tracking-wide text-right">Scope 1</div>
          <div className="col-span-1"></div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-[#E4E9E6]">
          {streams.map((stream) => {
            let qty_t = stream.quantity || 0;
            if (stream.quantity_unit === 'KG') qty_t /= 1000;
            if (stream.quantity_unit === 'GJ') qty_t /= 28;
            const defaultEf = FUEL_EMISSION_FACTORS[stream.fuel_type] ?? 1.95;
            const ef = stream.emission_factor_override ?? defaultEf;
            const scope1 = qty_t * ef;
            const isZeroCarbon = ZERO_EF_FUELS.has(stream.fuel_type);

            return (
              <div key={stream.fuel_id} className="grid grid-cols-12 gap-0 px-3 py-2 items-center bg-white hover:bg-[#F6F8F7]/50 transition-colors">
                {/* Fuel Type */}
                <div className="col-span-3 pr-2">
                  <select
                    value={stream.fuel_type}
                    onChange={e => updateRow(stream.fuel_id, { fuel_type: e.target.value as FuelType })}
                    disabled={readOnly}
                    className="w-full bg-white border border-[#E4E9E6] rounded-md px-2 py-1.5 text-[11px] text-[#10231C] focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 font-medium disabled:opacity-60"
                  >
                    {FUEL_TYPES.map(t => (
                      <option key={t} value={t}>{FUEL_LABELS[t] || t}</option>
                    ))}
                  </select>
                </div>

                {/* Quantity */}
                <div className="col-span-2 pr-2">
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={stream.quantity || ''}
                    onChange={e => updateRow(stream.fuel_id, { quantity: parseFloat(e.target.value) || 0 })}
                    disabled={readOnly}
                    placeholder="Quantity"
                    className="w-full bg-white border border-[#E4E9E6] rounded-md px-2 py-1.5 text-[11px] text-[#10231C] font-mono focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 disabled:opacity-60"
                  />
                </div>

                {/* Unit */}
                <div className="col-span-1 pr-2">
                  <select
                    value={stream.quantity_unit}
                    onChange={e => updateRow(stream.fuel_id, { quantity_unit: e.target.value as FuelStreamEntry['quantity_unit'] })}
                    disabled={readOnly}
                    className="w-full bg-white border border-[#E4E9E6] rounded-md px-2 py-1.5 text-[11px] text-[#10231C] focus:outline-none focus:border-amber-500 disabled:opacity-60"
                  >
                    <option value="TONNES">t</option>
                    <option value="KG">kg</option>
                    <option value="NM3">Nm³</option>
                    <option value="KL">kL</option>
                    <option value="GJ">GJ</option>
                  </select>
                </div>

                {/* EF Override */}
                <div className="col-span-2 pr-2">
                  <input
                    type="number"
                    min="0"
                    step="0.001"
                    value={stream.emission_factor_override ?? ''}
                    onChange={e => updateRow(stream.fuel_id, {
                      emission_factor_override: e.target.value ? parseFloat(e.target.value) : undefined
                    })}
                    disabled={readOnly}
                    placeholder="Default"
                    className="w-full bg-white border border-[#E4E9E6] rounded-md px-2 py-1.5 text-[11px] text-[#10231C] font-mono focus:outline-none focus:border-amber-500 disabled:opacity-60 placeholder-[#6B7A72]"
                  />
                </div>

                {/* Default EF */}
                <div className="col-span-2 pr-2 text-right">
                  <span className={`text-[11px] font-mono font-semibold ${isZeroCarbon ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {defaultEf.toFixed(2)}
                  </span>
                  {isZeroCarbon && (
                    <span className="ml-1 text-[9px] text-emerald-500 font-mono">biogenic</span>
                  )}
                </div>

                {/* Scope 1 */}
                <div className="col-span-1 pr-2 text-right">
                  <span className={`text-[11px] font-mono font-bold ${scope1 === 0 ? 'text-emerald-600' : 'text-[#10231C]'}`}>
                    {scope1 >= 1000
                      ? `${(scope1 / 1000).toFixed(1)}k`
                      : scope1.toFixed(0)}
                  </span>
                </div>

                {/* Remove */}
                <div className="col-span-1 flex justify-center">
                  {!readOnly && streams.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRow(stream.fuel_id)}
                      className="p-1 rounded hover:bg-rose-50 text-[#6B7A72] hover:text-rose-500 transition-colors"
                      title="Remove fuel stream"
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
        <div className="grid grid-cols-12 gap-0 px-3 py-2.5 bg-amber-50 border-t border-amber-200">
          <div className="col-span-3 text-[11px] font-bold text-[#10231C] flex items-center space-x-1.5">
            <span>TOTALS</span>
            <span className="text-[10px] text-[#6B7A72] font-normal">({streams.length} stream{streams.length !== 1 ? 's' : ''})</span>
          </div>
          <div className="col-span-2 text-[11px] font-mono font-bold text-amber-700">
            {totalTonnes >= 1000 ? `${(totalTonnes / 1000).toFixed(1)}k` : totalTonnes.toFixed(0)} t
          </div>
          <div className="col-span-1"></div>
          <div className="col-span-2 text-[10px] text-emerald-600 font-mono">
            {biogenicTonnes > 0 ? `${biogenicTonnes.toLocaleString()}t biogenic` : ''}
          </div>
          <div className="col-span-2 text-right text-[10px] text-[#6B7A72] font-mono">
            Weighted EF: {totalTonnes > 0 ? (totalScope1 / totalTonnes).toFixed(3) : '—'}
          </div>
          <div className="col-span-1 text-right text-[11px] font-mono font-bold text-amber-700">
            {totalScope1 >= 1000
              ? `${(totalScope1 / 1000).toFixed(1)}k`
              : totalScope1.toFixed(0)}
          </div>
          <div className="col-span-1"></div>
        </div>
      </div>

      {/* Add Row */}
      {!readOnly && (
        <button
          type="button"
          onClick={addRow}
          className="flex items-center space-x-2 text-[11px] font-semibold text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 hover:border-amber-300 rounded-lg px-3 py-2 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Fuel Stream</span>
        </button>
      )}

      {/* Summary chips */}
      <div className="flex flex-wrap gap-2 text-[10px]">
        <span className="px-2 py-1 rounded-md bg-[#F6F8F7] border border-[#E4E9E6] text-[#4B5A54] font-mono">
          Total: <strong className="text-amber-600">{totalTonnes >= 1000 ? `${(totalTonnes / 1000).toFixed(1)}k` : totalTonnes.toFixed(0)} tonnes</strong>
        </span>
        <span className="px-2 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-700 font-mono">
          Scope 1 combustion: <strong>{totalScope1 >= 1000 ? `${(totalScope1 / 1000).toFixed(1)}k` : totalScope1.toFixed(0)} tCO₂e</strong>
        </span>
        <span className="px-2 py-1 rounded-md bg-[#F6F8F7] border border-[#E4E9E6] text-[#4B5A54] font-mono">
          EF source: IPCC Tier 2 defaults — <span className="text-amber-600 font-semibold">CURATED_BENCHMARK</span>
        </span>
      </div>
    </div>
  );
}
