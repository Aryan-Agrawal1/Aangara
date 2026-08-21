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
      <div className="w-full max-w-xl bg-[#0B0F17] border-l border-[#E4E9E6] p-6 overflow-y-auto h-full shadow-2xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-[#E4E9E6]">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#E8F5EE] text-[#1F8A5F] border border-emerald-800/50">
                  STRATEGY TRACE
                </span>
                <h3 className="text-lg font-bold text-white">{strategyName} Audit Trail</h3>
              </div>
              <p className="text-xs text-[#4B5A54] mt-0.5">Deterministic financial engine breakdown</p>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg bg-[#F6F8F7] hover:bg-white border border-[#E4E9E6] text-[#4B5A54] hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-6 space-y-4">
            {/* Inputs & Assumptions */}
            <div className="bg-[#F6F8F7] rounded-xl p-4 border border-[#E4E9E6]">
              <h4 className="text-sm font-bold text-white mb-2 flex items-center space-x-2">
                <Calculator className="w-4 h-4 text-[#2E6BA8]" />
                <span>Inputs & Macro Assumptions</span>
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs text-[#4B5A54] font-mono bg-white/80 p-3 rounded-lg border border-[#E4E9E6]">
                <div>CCC Price (Assumed):</div><div className="text-[#2E6BA8] font-bold text-right">₹{assumptions?.ccc_price_inr?.toLocaleString() ?? 1000}</div>
                <div>WACC (Assumed):</div><div className="text-[#0B4A3D] font-bold text-right">{assumptions?.financing_rate_pct ?? 9.5}%</div>
                <div>Proj Output (Derate):</div><div className="text-[#1F8A5F] font-bold text-right">{assumptions?.project_output_delivery_pct ?? 100}%</div>
                <div>Proj Delay:</div><div className="text-[#C98A1E] font-bold text-right">{assumptions?.project_delay_months ?? 0} Mo</div>
              </div>
            </div>

            {/* Model Outputs */}
            <div className="bg-[#F6F8F7] rounded-xl p-4 border border-[#E4E9E6]">
              <h4 className="text-sm font-bold text-white mb-2">Model Outputs (Abatement)</h4>
              <div className="grid grid-cols-2 gap-3 text-xs text-[#4B5A54] font-mono bg-white/80 p-3 rounded-lg border border-[#E4E9E6]">
                <div>Baseline Shortfall:</div><div className="text-right">{formatEmissions(project?.expected_reduction_tco2e || 0)}</div>
                <div>Internal Abated:</div><div className="text-[#1F8A5F] font-bold text-right">{formatEmissions(strategy.internal_abatement_tco2e)}</div>
                <div>Residual Procured:</div><div className="text-[#2E6BA8] font-bold text-right">{strategy.procured_ccc_tco2e.toLocaleString()} CCCs</div>
              </div>
            </div>

            {/* Financial Outputs */}
            <div className="bg-[#F6F8F7] rounded-xl p-4 border border-[#E4E9E6]">
              <h4 className="text-sm font-bold text-white mb-2">Financial Calculation</h4>
              <div className="grid grid-cols-2 gap-3 text-xs text-[#4B5A54] font-mono bg-white/80 p-3 rounded-lg border border-[#E4E9E6]">
                <div>CAPEX Amortized:</div><div className="text-right">{(strategy.total_cost_cr * 0.4).toFixed(2)} Cr</div>
                <div>OPEX Impact:</div><div className="text-right">{(strategy.total_cost_cr * 0.2).toFixed(2)} Cr</div>
                <div>CCC Procurement Cost:</div><div className="text-right">{(strategy.total_cost_cr * 0.4).toFixed(2)} Cr</div>
                <div className="border-t border-[#E4E9E6] pt-2 font-bold text-white">Total Lifecycle Cost:</div><div className="border-t border-[#E4E9E6] pt-2 text-[#C33B2E] font-bold text-right">{formatCurrencyCr(strategy.total_cost_cr)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

