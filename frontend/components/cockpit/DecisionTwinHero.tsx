'use client';

import React from 'react';
import { StrategyResult, Project } from '@/lib/types';
import { formatCurrencyCr, formatEmissions, formatPricePerTonne, formatYears, formatGEI } from '@/lib/formatters';
import { Crown, ShoppingCart, Hammer, GitMerge, ArrowRight, Zap } from 'lucide-react';

interface DecisionTwinHeroProps {
  strategies: Record<string, StrategyResult>;
  recommendedStrategy: string;
  project: Project;
  onSelectStrategy?: (strategy: string) => void;
  onOpenCalculationTrace?: (strategy: string) => void;
}

export function DecisionTwinHero({
  strategies,
  recommendedStrategy,
  project,
  onSelectStrategy,
  onOpenCalculationTrace
}: DecisionTwinHeroProps) {
  const strategyList = ['BUY', 'BUILD', 'HYBRID'];

  const getStrategyIcon = (type: string) => {
    switch (type) {
      case 'BUY': return ShoppingCart;
      case 'BUILD': return Hammer;
      case 'HYBRID': return GitMerge;
      default: return Zap;
    }
  };

  const getStrategyColor = (type: string) => {
    switch (type) {
      case 'BUY': return { border: 'border-sky-500/40', bg: 'bg-sky-950/20', text: 'text-sky-400', badge: 'bg-sky-900/60 text-sky-300' };
      case 'BUILD': return { border: 'border-amber-500/40', bg: 'bg-amber-950/20', text: 'text-amber-400', badge: 'bg-amber-900/60 text-amber-300' };
      case 'HYBRID': return { border: 'border-emerald-500/50', bg: 'bg-emerald-950/20', text: 'text-emerald-400', badge: 'bg-emerald-900/60 text-emerald-300' };
      default: return { border: 'border-slate-700', bg: 'bg-slate-900', text: 'text-slate-200', badge: 'bg-slate-800 text-slate-300' };
    }
  };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-white tracking-tight">CarbonAlpha Decision Twin (TM)</h2>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800/60">
              Capital Optimizer Active
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Transparent comparison of BUY, BUILD, and HYBRID paths across financial lifecycle cost, internal decarbonisation, and regulatory risk.
          </p>
        </div>
      </div>

      {/* 3-Column Decision Twin Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {strategyList.map((stratKey) => {
          const strat = strategies[stratKey];
          if (!strat) return null;

          const isWinner = stratKey === recommendedStrategy;
          const Icon = getStrategyIcon(stratKey);
          const colors = getStrategyColor(stratKey);

          return (
            <div
              key={stratKey}
              className={`rounded-xl p-5 relative transition-all duration-300 flex flex-col justify-between ${
                isWinner
                  ? 'glass-panel-elevated winner-card-glow border-emerald-500'
                  : 'glass-panel hover:border-slate-600'
              }`}
            >
              {/* Winner Header Pill */}
              {isWinner && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-[11px] px-3 py-0.5 rounded-full shadow-md flex items-center space-x-1.5 border border-emerald-400/40">
                  <Crown className="w-3.5 h-3.5" />
                  <span>RECOMMENDED ALLOCATION (#1)</span>
                </div>
              )}

              <div>
                {/* Strategy Title & Rank */}
                <div className="flex items-center justify-between mt-1 mb-3">
                  <div className="flex items-center space-x-2.5">
                    <div className={`p-2 rounded-lg ${colors.bg} border ${colors.border} ${colors.text}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white tracking-tight">{stratKey} STRATEGY</h4>
                      <span className="text-[11px] text-slate-400 font-mono">Rank #{strat.rank} in Utility</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-slate-400">Utility Score</div>
                    <div className="text-base font-mono font-bold text-white">{strat.utility_score.toFixed(1)}<span className="text-xs text-slate-500">/100</span></div>
                  </div>
                </div>

                {/* Primary Cost Metric */}
                <div className="bg-slate-900/90 rounded-lg p-3.5 border border-slate-800 my-3">
                  <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Modelled 3-Year Lifecycle Cost</div>
                  <div className="text-2xl font-black text-white tnum mt-0.5">
                    {formatCurrencyCr(strat.total_cost_cr)}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
                    <span>Cost / tCO2e:</span>
                    <span className="font-mono font-semibold text-slate-200">{formatPricePerTonne(strat.cost_per_tco2e)}</span>
                  </div>
                </div>

                {/* Strategy Metrics Grid */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Internal Decarbonisation:</span>
                    <span className="font-mono font-semibold text-emerald-400">
                      {strat.internal_abatement_tco2e > 0 ? formatEmissions(strat.internal_abatement_tco2e) : '0 tCO2e (None)'}
                    </span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Market CCC Procurement:</span>
                    <span className="font-mono font-semibold text-sky-400">
                      {strat.procured_ccc_tco2e > 0 ? `${strat.procured_ccc_tco2e.toLocaleString('en-IN')} CCCs/yr` : '0 CCCs (None)'}
                    </span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Post-Strategy GEI:</span>
                    <span className="font-mono font-semibold text-white">
                      {formatGEI(strat.post_strategy_gei)}
                    </span>
                  </div>

                  {strat.npv_cr !== null && (
                    <div className="flex justify-between py-1 border-b border-slate-800/60">
                      <span className="text-slate-400">Project 10-Yr NPV:</span>
                      <span className="font-mono font-semibold text-emerald-400">{formatCurrencyCr(strat.npv_cr)}</span>
                    </div>
                  )}

                  {strat.payback_years !== null && (
                    <div className="flex justify-between py-1 border-b border-slate-800/60">
                      <span className="text-slate-400">Capital Payback:</span>
                      <span className="font-mono font-semibold text-slate-200">{formatYears(strat.payback_years)}</span>
                    </div>
                  )}

                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Risk Exposure Index:</span>
                    <span className={`font-mono font-semibold ${
                      strat.risk_score < 40 ? 'text-emerald-400' : strat.risk_score < 60 ? 'text-amber-400' : 'text-rose-400'
                    }`}>
                      {strat.risk_score.toFixed(0)} / 100
                    </span>
                  </div>
                </div>

                {/* Summary narrative */}
                <p className="text-xs text-slate-400 mt-3 pt-2 border-t border-slate-800 leading-relaxed italic">
                  "{strat.summary}"
                </p>
              </div>

              {/* Action Button */}
              <div className="mt-4 pt-2">
                <button
                  onClick={() => onOpenCalculationTrace && onOpenCalculationTrace(stratKey)}
                  className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                    isWinner
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/50'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  <span>Audit Strategy Trace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
