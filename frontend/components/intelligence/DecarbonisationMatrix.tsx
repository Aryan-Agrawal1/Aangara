'use client';

import React from 'react';
import { formatCurrencyCr, formatEmissions, formatPricePerTonne, formatYears } from '@/lib/formatters';
import { Zap, CheckCircle2, ArrowRight, TrendingDown } from 'lucide-react';

interface DecarbonisationMatrixProps {
  opportunities: any[];
}

export function DecarbonisationMatrix({ opportunities }: DecarbonisationMatrixProps) {
  if (!opportunities || opportunities.length === 0) return null;

  return (
    <div className="glass-panel rounded-xl p-5 border-slate-800 mt-6">
      <div className="flex items-center space-x-2 mb-4">
        <div className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-teal-400">
          <Zap className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white tracking-tight">Techno-Economic Decarbonisation Opportunities</h3>
          <p className="text-xs text-slate-400">Validated engineering measures with CAPEX, energy cost savings, payback and 10-Yr NPV</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {opportunities.map((opp) => (
          <div key={opp.opportunity_id} className="bg-slate-900/80 rounded-xl p-4 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-teal-950 text-teal-400 border border-teal-800/50">
                  {opp.category}
                </span>
                <span className="text-xs font-mono text-emerald-400 font-bold">
                  -{formatEmissions(opp.annual_reduction_tco2e)}/yr
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mb-1.5">{opp.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">{opp.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 text-xs space-y-1.5 font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Estimated CAPEX:</span>
                <span className="text-white font-bold">{formatCurrencyCr(opp.capex_cr)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Annual Energy Cost Savings:</span>
                <span className="text-emerald-400 font-bold">{formatCurrencyCr(opp.annual_energy_savings_cr)}/yr</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Capital Payback:</span>
                <span className="text-slate-200">{formatYears(opp.payback_years)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>10-Yr NPV @ 9.5% WACC:</span>
                <span className="text-emerald-400 font-bold">{formatCurrencyCr(opp.npv_10yr_cr)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
