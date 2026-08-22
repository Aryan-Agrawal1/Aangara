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
    <div className="glass-panel rounded-xl p-5 relative overflow-hidden transition-all duration-300 hover:border-[#E4E9E6] border-[#E4E9E6] bg-white">
      {/* Subtle industrial image as right-side accent */}
      <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[url('https://images.unsplash.com/photo-1542361345-89e58247f2d5?q=80&w=600&auto=format&fit=crop')] bg-cover bg-center opacity-8 pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-transparent to-white pointer-events-none"></div>

      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-lg bg-[#E8F5F2] border border-[#0B4A3D]/20 text-[#0B4A3D]">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#10231C] tracking-tight">CCTS Carbon Compliance Position</h3>
            <p className="text-xs text-[#4B5A54]">Actual GHG Emission Intensity vs Government Target</p>
          </div>
        </div>

        <button
          onClick={onOpenSourceTrace}
          className="text-[10px] uppercase font-mono font-bold text-[#2E6BA8] hover:text-[#1A4F7D] flex items-center space-x-1.5 bg-[#EBF3FB] px-3 py-1.5 rounded border border-[#2E6BA8]/20 transition-colors cursor-pointer"
        >
          <span>Source Trace</span>
          <HelpCircle className="w-3 h-3" />
        </button>
      </div>

      {/* Main KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1 relative z-10">
        {/* Actual GEI */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-[#E4E9E6]/50">
          <div className="text-[11px] font-medium text-[#4B5A54] uppercase tracking-wider">Actual GEI</div>
          <div className="text-lg font-bold text-[#10231C] tnum mt-0.5">
            {formatGEI(position.actual_gei)}
          </div>
          <div className="text-[10px] text-[#6B7A72] mt-1">
            Total: {formatEmissions(position.total_ghg_tco2e)}
          </div>
        </div>

        {/* Notified Target GEI */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-[#E4E9E6]/50">
          <div className="text-[11px] font-medium text-[#4B5A54] uppercase tracking-wider">Notified Target</div>
          <div className="text-lg font-bold text-[#2E6BA8] tnum mt-0.5">
            {formatGEI(position.target_gei)}
          </div>
          <div className="text-[10px] text-sky-500/80 mt-1">
            MoEFCC Gazette Reference
          </div>
        </div>

        {/* Delta */}
        <div className="bg-[#F6F8F7] rounded-lg p-3 border border-[#E4E9E6]">
          <div className="text-[11px] font-medium text-[#4B5A54] uppercase tracking-wider">Intensity Delta (Delta)</div>
          <div className={`text-lg font-bold tnum mt-0.5 flex items-center space-x-1 ${
            isSurplus ? 'text-[#0B4A3D]' : 'text-[#C33B2E]'
          }`}>
            {isSurplus ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
            <span>{position.gei_delta > 0 ? `+${position.gei_delta.toFixed(4)}` : position.gei_delta.toFixed(4)}</span>
          </div>
          <div className="text-[10px] text-[#6B7A72] mt-1">
            {isSurplus ? 'Below Target Ceiling' : 'Above Target Ceiling'}
          </div>
        </div>

        {/* Compliance Exposure / Shortfall Quantity */}
        <div className={`rounded-lg p-3 border ${
          isSurplus
            ? 'bg-[#E8F5EE] border-[#0B4A3D]/20 text-[#0B4A3D]'
            : 'bg-[#FDECEA] border-[#C33B2E]/20 text-[#C33B2E]'
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
