'use client';

import React from 'react';
import { CarbonPosition } from '@/lib/types';
import { formatGEI, formatEmissions } from '@/lib/formatters';
import { Target, TrendingDown, TrendingUp, HelpCircle, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface CarbonPositionCardProps {
  position: CarbonPosition;
  onOpenSourceTrace: () => void;
}

export function CarbonPositionCard({ position, onOpenSourceTrace }: CarbonPositionCardProps) {
  const isSurplus = position.gei_delta <= 0;

  return (
    <div className="glass-panel rounded-xl p-5 relative overflow-hidden transition-all duration-300 hover:border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-emerald-400">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white tracking-tight">CCTS Carbon Compliance Position</h3>
            <p className="text-xs text-slate-400">Actual GHG Emission Intensity vs Government Target</p>
          </div>
        </div>

        <button
          onClick={onOpenSourceTrace}
          className="text-xs text-sky-400 hover:text-sky-300 flex items-center space-x-1 bg-sky-950/40 px-2.5 py-1 rounded border border-sky-800/40 transition-colors cursor-pointer"
        >
          <span>Source Trace</span>
          <HelpCircle className="w-3 h-3" />
        </button>
      </div>

      {/* Main KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
        {/* Actual GEI */}
        <div className="bg-slate-900/80 rounded-lg p-3 border border-slate-800">
          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Actual GEI</div>
          <div className="text-lg font-bold text-white tnum mt-0.5">
            {formatGEI(position.actual_gei)}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            Total: {formatEmissions(position.total_ghg_tco2e)}
          </div>
        </div>

        {/* Notified Target GEI */}
        <div className="bg-slate-900/80 rounded-lg p-3 border border-slate-800">
          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Notified Target</div>
          <div className="text-lg font-bold text-sky-400 tnum mt-0.5">
            {formatGEI(position.target_gei)}
          </div>
          <div className="text-[10px] text-sky-500/80 mt-1">
            MoEFCC Gazette Verified
          </div>
        </div>

        {/* Delta */}
        <div className="bg-slate-900/80 rounded-lg p-3 border border-slate-800">
          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Intensity Delta (Delta)</div>
          <div className={`text-lg font-bold tnum mt-0.5 flex items-center space-x-1 ${
            isSurplus ? 'text-emerald-400' : 'text-rose-400'
          }`}>
            {isSurplus ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
            <span>{position.gei_delta > 0 ? `+${position.gei_delta.toFixed(4)}` : position.gei_delta.toFixed(4)}</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            {isSurplus ? 'Below Target Ceiling' : 'Above Target Ceiling'}
          </div>
        </div>

        {/* Compliance Exposure / Shortfall Quantity */}
        <div className={`rounded-lg p-3 border ${
          isSurplus
            ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-400'
            : 'bg-rose-950/30 border-rose-800/40 text-rose-400'
        }`}>
          <div className="text-[11px] font-medium uppercase tracking-wider">
            {isSurplus ? 'Modelled Potential Surplus' : 'Modelled Shortfall'}
          </div>
          <div className="text-lg font-bold tnum mt-0.5">
            {isSurplus
              ? formatEmissions(position.potential_surplus_tco2e)
              : formatEmissions(position.potential_shortfall_tco2e)}
          </div>
          <div className="text-[10px] opacity-80 mt-1 flex items-center space-x-1">
            {isSurplus ? <CheckCircle2 className="w-3 h-3 inline" /> : <ShieldAlert className="w-3 h-3 inline" />}
            <span>{isSurplus ? 'Potential CCC Issuance Scope' : 'CCC Surrender Obligation'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
