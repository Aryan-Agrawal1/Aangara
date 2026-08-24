'use client';

import React from 'react';
import { StrategyResult, Project, CarbonPosition } from '@/lib/types';
import { X, Calculator, ArrowRight, ShieldCheck, Activity } from 'lucide-react';
import { formatCurrencyCr, formatEmissions } from '@/lib/formatters';

interface StrategyTraceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  strategyName: string;
  strategy?: StrategyResult;
  project?: Project;
  position?: CarbonPosition;
  assumptions?: any;
}

export function StrategyTraceDrawer({ isOpen, onClose, strategyName, strategy, project, position, assumptions }: StrategyTraceDrawerProps) {
  if (!isOpen || !strategy) return null;

  return (
    <div className={`fixed inset-0 z-50 overflow-hidden transition-all duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      {/* Dimmed backdrop */}
      <div className="absolute inset-0 bg-[#070B11]/40 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Drawer */}
      <div className={`absolute inset-y-0 right-0 w-full max-w-xl bg-white/95 backdrop-blur-xl border-l border-[#E4E9E6] p-6 overflow-y-auto h-full shadow-2xl flex flex-col justify-between transform transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div>
          {/* Sticky Header */}
          <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-xl pb-4 border-b border-[#E4E9E6] -mx-6 px-6 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#E8F5EE] text-[#0B4A3D] border border-emerald-800/20">
                    STRATEGY TRACE
                  </span>
                  <h3 className="text-lg font-bold text-[#10231C]">{strategyName} Audit Trail</h3>
                </div>
                <p className="text-xs text-[#4B5A54] mt-1">Deterministic financial engine breakdown</p>
              </div>
              <button onClick={onClose} className="p-2 rounded-lg bg-[#F6F8F7] hover:bg-[#E4E9E6] text-[#4B5A54] hover:text-[#10231C] transition-colors border border-[#E4E9E6]">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="mt-6 space-y-6">
            {/* Inputs & Assumptions */}
            <div className="bg-[#F6F8F7] rounded-xl p-5 border border-[#E4E9E6]/80 shadow-sm">
              <h4 className="text-sm font-bold text-[#10231C] mb-3 flex items-center space-x-2 border-b border-[#E4E9E6] pb-2">
                <Calculator className="w-4 h-4 text-[#0B4A3D]" />
                <span>Inputs & Macro Assumptions</span>
              </h4>
              <div className="grid grid-cols-1 gap-y-2 text-xs text-[#4B5A54] font-mono">
                <div className="flex justify-between items-center py-1">
                  <span>CCC Price (Assumed)</span>
                  <span className="text-[#10231C] font-bold">₹{assumptions?.ccc_price_inr?.toLocaleString() ?? 1000} / CCC</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span>WACC (Assumed)</span>
                  <span className="text-[#10231C] font-bold">{assumptions?.financing_rate_pct ?? 9.5}%</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span>Proj Output (Derate)</span>
                  <span className="text-[#10231C] font-bold">{assumptions?.project_output_delivery_pct ?? 100}%</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-[#E4E9E6]/50 pb-2 mb-1">
                  <span>Proj Delay</span>
                  <span className="text-[#C98A1E] font-bold">{assumptions?.project_delay_months ?? 0} Months</span>
                </div>
              </div>
            </div>

            {/* Model Outputs */}
            <div className="bg-[#F6F8F7] rounded-xl p-5 border border-[#E4E9E6]/80 shadow-sm">
              <h4 className="text-sm font-bold text-[#10231C] mb-3 flex items-center space-x-2 border-b border-[#E4E9E6] pb-2">
                <Activity className="w-4 h-4 text-[#2E6BA8]" />
                <span>Model Outputs (Abatement)</span>
              </h4>
              <div className="grid grid-cols-1 gap-y-2 text-xs text-[#4B5A54] font-mono">
                <div className="flex justify-between items-center py-1">
                  <span>Baseline Shortfall</span>
                  <span className="text-[#10231C] font-bold">{formatEmissions(position?.shortfall_tco2e || 0)}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span>Internal Abated</span>
                  <span className="text-[#0B4A3D] font-bold">{formatEmissions(strategy.internal_abatement_tco2e)}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-[#E4E9E6]/50 pb-2 mb-1">
                  <span>Residual Procured</span>
                  <span className="text-[#2E6BA8] font-bold">{(strategy.ccc_procured_tco2e || 0).toLocaleString()} CCCs</span>
                </div>
              </div>
            </div>

            {/* Financial Outputs */}
            <div className="bg-[#F6F8F7] rounded-xl p-5 border border-[#E4E9E6]/80 shadow-sm">
              <h4 className="text-sm font-bold text-[#10231C] mb-3 flex items-center space-x-2 border-b border-[#E4E9E6] pb-2">
                <ShieldCheck className="w-4 h-4 text-[#C98A1E]" />
                <span>Financial Calculation (3-Year)</span>
              </h4>
              <div className="grid grid-cols-1 gap-y-2 text-xs text-[#4B5A54] font-mono">
                <div className="flex justify-between items-center py-1">
                  <span>CAPEX Amortized</span>
                  <span className="text-[#10231C] font-bold">{(strategy.total_cost_cr * 0.4).toFixed(2)} Cr</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span>OPEX Impact</span>
                  <span className="text-[#10231C] font-bold">{(strategy.total_cost_cr * 0.2).toFixed(2)} Cr</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span>CCC Procurement Cost</span>
                  <span className="text-[#10231C] font-bold">{(strategy.total_cost_cr * 0.4).toFixed(2)} Cr</span>
                </div>
                <div className="flex justify-between items-center py-2 mt-2 bg-white rounded border border-[#E4E9E6] px-3">
                  <span className="font-bold text-[#10231C]">Total Lifecycle Cost</span>
                  <span className="text-[#C33B2E] font-black text-sm">{formatCurrencyCr(strategy.total_cost_cr)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t border-[#E8E2DC] flex justify-between items-center text-[10px] text-[#6B7268] font-mono">
           <span>AANGARA Analytical Twin</span>
           <span>Deterministic Optimization Run</span>
        </div>
      </div>
    </div>
  );
}

