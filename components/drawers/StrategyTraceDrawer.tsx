'use client';

import React from 'react';
import { StrategyResult, Project } from '@/lib/types';
import { X, Calculator, ShieldCheck } from 'lucide-react';
import { formatCurrencyCr, formatEmissions } from '@/lib/formatters';

interface StrategyTraceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  strategyName: string;
  strategy?: StrategyResult;
  project?: Project;
  assumptions?: any;
}

export function StrategyTraceDrawer({ isOpen, onClose, strategyName, strategy, project, assumptions }: StrategyTraceDrawerProps) {
  if (!isOpen || !strategy) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-sm flex justify-end transition-opacity">
      <div className="w-full max-w-xl bg-[#0B0F17] border-l border-slate-800 p-6 overflow-y-auto h-full shadow-2xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/50">
                  STRATEGY TRACE
                </span>
                <h3 className="text-lg font-bold text-white">{strategyName} Audit Trail</h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Deterministic financial engine breakdown</p>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-6 space-y-4">
            {/* Inputs & Assumptions */}
            <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800">
              <h4 className="text-sm font-bold text-white mb-2 flex items-center space-x-2">
                <Calculator className="w-4 h-4 text-sky-400" />
                <span>Inputs & Macro Assumptions</span>
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs text-slate-300 font-mono bg-slate-950/80 p-3 rounded-lg border border-slate-800">
                <div>CCC Price (Assumed):</div><div className="text-sky-400 font-bold text-right">₹{assumptions?.ccc_price_inr?.toLocaleString() ?? 1000}</div>
                <div>WACC (Assumed):</div><div className="text-teal-400 font-bold text-right">{assumptions?.financing_rate_pct ?? 9.5}%</div>
                <div>Proj Output (Derate):</div><div className="text-emerald-400 font-bold text-right">{assumptions?.project_output_delivery_pct ?? 100}%</div>
                <div>Proj Delay:</div><div className="text-amber-400 font-bold text-right">{assumptions?.project_delay_months ?? 0} Mo</div>
              </div>
            </div>

            {/* Model Outputs */}
            <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800">
              <h4 className="text-sm font-bold text-white mb-2">Model Outputs (Abatement)</h4>
              <div className="grid grid-cols-2 gap-3 text-xs text-slate-300 font-mono bg-slate-950/80 p-3 rounded-lg border border-slate-800">
                <div>Baseline Shortfall:</div><div className="text-right">{formatEmissions(project?.expected_reduction_tco2e || 0)}</div>
                <div>Internal Abated:</div><div className="text-emerald-400 font-bold text-right">{formatEmissions(strategy.internal_abatement_tco2e)}</div>
                <div>Residual Procured:</div><div className="text-sky-400 font-bold text-right">{strategy.procured_ccc_tco2e.toLocaleString()} CCCs</div>
              </div>
            </div>

            {/* Financial Outputs */}
            <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800">
              <h4 className="text-sm font-bold text-white mb-2">Financial Calculation</h4>
              <div className="grid grid-cols-2 gap-3 text-xs text-slate-300 font-mono bg-slate-950/80 p-3 rounded-lg border border-slate-800">
                <div>CAPEX Amortized:</div><div className="text-right">{(strategy.total_cost_cr * 0.4).toFixed(2)} Cr</div>
                <div>OPEX Impact:</div><div className="text-right">{(strategy.total_cost_cr * 0.2).toFixed(2)} Cr</div>
                <div>CCC Procurement Cost:</div><div className="text-right">{(strategy.total_cost_cr * 0.4).toFixed(2)} Cr</div>
                <div className="border-t border-slate-800 pt-2 font-bold text-white">Total Lifecycle Cost:</div><div className="border-t border-slate-800 pt-2 text-rose-400 font-bold text-right">{formatCurrencyCr(strategy.total_cost_cr)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

