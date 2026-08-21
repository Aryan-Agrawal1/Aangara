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
    <div className="glass-panel rounded-xl p-5 relative overflow-hidden transition-all duration-300 hover:border-slate-700 border-slate-800">
      {/* Photographic Background Overlay */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542361345-89e58247f2d5?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center opacity-20 pointer-events-none mix-blend-overlay"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B1019]/90 to-[#06090E] pointer-events-none"></div>

      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-lg bg-emerald-950/80 border border-emerald-800/60 text-emerald-400 shadow-md backdrop-blur-md">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white tracking-tight">CCTS Carbon Compliance Position</h3>
            <p className="text-xs text-slate-400">Actual GHG Emission Intensity vs Government Target</p>
          </div>
        </div>

        <button
          onClick={onOpenSourceTrace}
          className="text-[10px] uppercase font-mono font-bold text-sky-400 hover:text-sky-300 flex items-center space-x-1.5 bg-sky-950/40 px-3 py-1.5 rounded border border-sky-800/40 transition-colors cursor-pointer"
        >
          <span>Source Trace</span>
          <HelpCircle className="w-3 h-3" />
        </button>
      </div>

      {/* Main KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1 relative z-10">
        {/* Actual GEI */}
        <div className="bg-[#06090E]/80 backdrop-blur-sm rounded-lg p-3 border border-slate-700/50">
          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Actual GEI</div>
          <div className="text-lg font-bold text-white tnum mt-0.5">
            {formatGEI(position.actual_gei)}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            Total: {formatEmissions(position.total_ghg_tco2e)}
          </div>
        </div>

        {/* Notified Target GEI */}
        <div className="bg-[#06090E]/80 backdrop-blur-sm rounded-lg p-3 border border-slate-700/50">
          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Notified Target</div>
          <div className="text-lg font-bold text-sky-400 tnum mt-0.5">
            {formatGEI(position.target_gei)}
          </div>
          <div className="text-[10px] text-sky-500/80 mt-1">
            MoEFCC Gazette Reference
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
          <div className="text-[11px] font-medium uppercase tracking-wider flex items-center justify-between cursor-help" title={isSurplus ? "Estimated compliance surplus before ACVA verification. Potential for trading." : "Estimated shortfall before ACVA verification. Potential compliance penalty risk."}>
            <span>{isSurplus ? 'Modelled Potential Surplus' : 'Modelled Shortfall'}</span>
            <HelpCircle className="w-3 h-3 opacity-70" />
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
