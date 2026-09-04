'use client';

import { ClientChartWrapper } from "@/components/ui/ClientChartWrapper";

import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';
import { StrategyResult, Project } from '@/lib/types';
import { formatEmissions, formatYears, formatGEI } from '@/lib/formatters';
import { Crown, ShoppingCart, Hammer, GitMerge, ArrowRight, Zap, BarChart2, Activity } from 'lucide-react';
import { useCurrency } from '@/lib/context/CurrencyContext';

// ── Colour palette (preserves existing dark glass-panel design system) ──
const STRATEGY_COLORS: Record<string, string> = {
  BUY: '#38bdf8',     // sky-400
  BUILD: '#fbbf24',   // amber-400
  HYBRID: '#34d399',  // emerald-400
};

const CHART_GRID = '#E4E9E6';      // slate-800
const CHART_TEXT = '#6B7A72';      // slate-400
const CHART_BG = 'rgba(15,23,42,0)'; // transparent — panels handle background

// Custom tooltip for dark theme
const DarkTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-[#E4E9E6] shadow-lg border border-[#E4E9E6] rounded-lg px-3 py-2 text-xs shadow-xl">
      <p className="text-[#4B5A54] font-semibold mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }} className="font-mono">
          {p.name}: {typeof p.value === 'number' ? p.value.toFixed(2) : p.value}
        </p>
      ))}
    </div>
  );
};

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
  onOpenCalculationTrace,
}: DecisionTwinHeroProps) {
  const { symbol, formatCr } = useCurrency();
  const [chartView, setChartView] = useState<'bars' | 'radar'>('bars');
  const strategyList = ['BUY', 'BUILD', 'HYBRID'];

  // ── Build chart data ──
  const costData = strategyList.map((key) => ({
    name: key,
    'Lifecycle Cost (Cr)': strategies[key]?.total_cost_cr ?? 0,
    fill: STRATEGY_COLORS[key],
  }));

  const co2Data = strategyList.map((key) => ({
    name: key,
    'Internal Abatement (kt)': Math.round((strategies[key]?.internal_abatement_tco2e ?? 0) / 1000),
    fill: STRATEGY_COLORS[key],
  }));

  const radarData = strategyList.map((key) => {
    const s = strategies[key];
    if (!s) return null;
    return {
      strategy: key,
      'Cost Efficiency': Math.max(0, 100 - s.utility_score),
      'CO₂ Reduction': Math.min(100, (s.internal_abatement_tco2e / 50000) * 100),
      'Low Risk': 100 - s.risk_score,
      'Financial Return': s.npv_cr ? Math.min(100, (s.npv_cr / 50) * 100) : 20,
      'Speed': Math.max(0, 100 - (s.payback_years ?? 5) * 10),
    };
  }).filter(Boolean);

  const getStrategyIcon = (type: string) => {
    switch (type) {
      case 'BUY': return ShoppingCart;
      case 'BUILD': return Hammer;
      case 'HYBRID': return GitMerge;
      default: return Zap;
    }
  };

  return (
    <div className="mt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-[#10231C] tracking-tight">AANGARA Decision Twin™</h2>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#E8F2EB] text-[#1F4D2E] border border-[#1F4D2E]/25">
              Capital Optimizer Active
            </span>
          </div>
          <p className="text-xs text-[#4B5A54] mt-0.5">
            Transparent comparison of BUY, BUILD, and HYBRID paths across financial lifecycle cost, internal decarbonisation, and regulatory risk.
          </p>
        </div>
        {/* Chart view toggle */}
        <div className="flex items-center space-x-1 bg-[#F6F8F7] rounded-lg p-1 border border-[#E4E9E6]">
          <button
            onClick={() => setChartView('bars')}
            className={`p-1.5 rounded-md transition-colors ${chartView === 'bars' ? 'bg-[#E4E9E6] text-[#10231C]' : 'text-[#6B7A72] hover:text-[#4B5A54]'}`}
            title="Bar charts"
          >
            <BarChart2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setChartView('radar')}
            className={`p-1.5 rounded-md transition-colors ${chartView === 'radar' ? 'bg-[#E4E9E6] text-[#10231C]' : 'text-[#6B7A72] hover:text-[#4B5A54]'}`}
            title="Radar chart"
          >
            <Activity className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── CHARTS ROW ── */}
      <div className="glass-panel rounded-xl p-4 mb-5">
        {chartView === 'bars' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Cost comparison */}
            <div>
              <p className="text-[11px] font-semibold text-[#4B5A54] uppercase tracking-widest mb-2">3-Year Lifecycle Cost (₹ Crore)</p>
              <ClientChartWrapper>
<ResponsiveContainer width="100%" height={180}>
                <BarChart data={costData} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: CHART_TEXT, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: CHART_TEXT, fontSize: 10 }} axisLine={false} tickLine={false} width={55}
                    tickFormatter={(v) => `${symbol}${v.toFixed(0)}Cr`} />
                  <Tooltip content={<DarkTooltip />} />
                  <Bar dataKey="Lifecycle Cost (Cr)" radius={[4, 4, 0, 0]} maxBarSize={56}>
                    {costData.map((entry) => (
                      <Cell key={entry.name} fill={STRATEGY_COLORS[entry.name]}
                        opacity={entry.name === recommendedStrategy ? 1 : 0.5} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
</ClientChartWrapper>
            </div>

            {/* CO2 abatement comparison */}
            <div>
              <p className="text-[11px] font-semibold text-[#4B5A54] uppercase tracking-widest mb-2">Internal CO₂ Abatement (kt CO₂e/yr)</p>
              <ClientChartWrapper>
<ResponsiveContainer width="100%" height={180}>
                <BarChart data={co2Data} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: CHART_TEXT, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: CHART_TEXT, fontSize: 10 }} axisLine={false} tickLine={false} width={45}
                    tickFormatter={(v) => `${v}kt`} />
                  <Tooltip content={<DarkTooltip />} />
                  <Bar dataKey="Internal Abatement (kt)" radius={[4, 4, 0, 0]} maxBarSize={56}>
                    {co2Data.map((entry) => (
                      <Cell key={entry.name} fill={STRATEGY_COLORS[entry.name]}
                        opacity={entry.name === recommendedStrategy ? 1 : 0.5} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
</ClientChartWrapper>
            </div>
          </div>
        ) : (
          /* Radar view */
          <div className="flex flex-col items-center">
            <p className="text-[11px] font-semibold text-[#4B5A54] uppercase tracking-widest mb-2">Multi-Dimension Strategy Profile</p>
            <ClientChartWrapper>
<ResponsiveContainer width="100%" height={240}>
              <RadarChart data={radarData[0] ? [
                { axis: 'Cost Efficiency', BUY: radarData[0]?.['Cost Efficiency'] ?? 0, BUILD: radarData[1]?.['Cost Efficiency'] ?? 0, HYBRID: radarData[2]?.['Cost Efficiency'] ?? 0 },
                { axis: 'CO₂ Reduction', BUY: radarData[0]?.['CO₂ Reduction'] ?? 0, BUILD: radarData[1]?.['CO₂ Reduction'] ?? 0, HYBRID: radarData[2]?.['CO₂ Reduction'] ?? 0 },
                { axis: 'Low Risk', BUY: radarData[0]?.['Low Risk'] ?? 0, BUILD: radarData[1]?.['Low Risk'] ?? 0, HYBRID: radarData[2]?.['Low Risk'] ?? 0 },
                { axis: 'Financial Return', BUY: radarData[0]?.['Financial Return'] ?? 0, BUILD: radarData[1]?.['Financial Return'] ?? 0, HYBRID: radarData[2]?.['Financial Return'] ?? 0 },
                { axis: 'Speed', BUY: radarData[0]?.['Speed'] ?? 0, BUILD: radarData[1]?.['Speed'] ?? 0, HYBRID: radarData[2]?.['Speed'] ?? 0 },
              ] : []}>
                <PolarGrid stroke={CHART_GRID} />
                <PolarAngleAxis dataKey="axis" tick={{ fill: CHART_TEXT, fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: CHART_TEXT, fontSize: 9 }} />
                {strategyList.map((key) => (
                  <Radar key={key} name={key} dataKey={key}
                    stroke={STRATEGY_COLORS[key]} fill={STRATEGY_COLORS[key]}
                    fillOpacity={key === recommendedStrategy ? 0.25 : 0.08}
                    strokeOpacity={key === recommendedStrategy ? 1 : 0.5}
                    strokeWidth={key === recommendedStrategy ? 2 : 1}
                  />
                ))}
                <Legend formatter={(val) => <span style={{ color: STRATEGY_COLORS[val] ?? CHART_TEXT, fontSize: 11 }}>{val}</span>} />
                <Tooltip content={<DarkTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
</ClientChartWrapper>
          </div>
        )}
      </div>

      {/* ── 3-Column Strategy Cards ── */}
      {/* ── 3-Column Strategy Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {strategyList.map((stratKey) => {
          const strat = strategies[stratKey];
          if (!strat) return null;
          const isWinner = stratKey === recommendedStrategy;
          const Icon = getStrategyIcon(stratKey);
          const color = STRATEGY_COLORS[stratKey] || '#1F4D2E';

          return (
            <div
              key={stratKey}
              className={`rounded-xl p-5 relative transition-all duration-300 flex flex-col justify-between card-glass border ${
                isWinner
                  ? 'border-[#1F4D2E] shadow-[0_8px_24px_rgba(31,77,46,0.12)] ring-2 ring-[#1F4D2E]/20'
                  : 'border-[#E8E2DC] hover:border-[#CBD5CE] hover:shadow-md'
              }`}
              style={{
                background: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(12px)'
              }}
            >
              {isWinner && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1F4D2E] text-white font-bold text-[11px] px-3 py-0.5 rounded-full shadow-md flex items-center space-x-1.5 border border-[#1F4D2E]/40">
                  <Crown className="w-3.5 h-3.5 text-amber-300" />
                  <span>RECOMMENDED (#1)</span>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mt-1 mb-3">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 rounded-lg" style={{ background: `${color}18`, border: `1px solid ${color}40` }}>
                      <Icon className="w-4 h-4" style={{ color }} />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-[#1A1C18] tracking-tight">{stratKey} STRATEGY</h4>
                      <span className="text-[11px] text-[#6B7268] font-mono">Rank #{strat.rank || 1} in Utility</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-[#6B7268]">Utility</div>
                    <div className="text-base font-mono font-bold text-[#1A1C18]">{strat.utility_score.toFixed(1)}<span className="text-xs text-[#6B7268]">/100</span></div>
                  </div>
                </div>

                {/* Primary Cost */}
                <div className="bg-[#F6F8F7] rounded-lg p-3.5 border border-[#E8E2DC] my-3">
                  <div className="text-[11px] font-medium text-[#6B7268] uppercase tracking-wider">
                    Modelled 3-Year Lifecycle Cost
                    <span className="ml-1.5 px-1.5 py-0.5 rounded text-[9px] bg-[#FEF7E8] text-[#C98A1E] border border-amber-500/30 font-mono font-bold">MODEL</span>
                  </div>
                  <div className="text-2xl font-black text-[#1A1C18] tnum mt-0.5">{formatCr(strat.total_cost_cr)}</div>
                  <div className="text-[11px] text-[#6B7268] mt-1 flex items-center justify-between">
                    <span>Cost / tCO₂e:</span>
                    <span className="font-mono font-semibold text-[#1A1C18]">{strat.cost_per_tco2e ? `${symbol}${Math.round(strat.cost_per_tco2e).toLocaleString('en-IN')}/tCO₂e` : `${symbol}0/tCO₂e`}</span>
                  </div>
                </div>

                {/* Metrics */}
                <div className="space-y-2 text-xs">
                  {[
                    { label: 'Internal Decarbonisation', value: strat.internal_abatement_tco2e > 0 ? formatEmissions(strat.internal_abatement_tco2e) : '0 tCO₂e', color: '#1F4D2E' },
                    { label: 'Market CCC Procurement', value: (strat.ccc_procured_tco2e || 0) > 0 ? `${(strat.ccc_procured_tco2e || 0).toLocaleString('en-IN')} CCCs/yr` : '0 CCCs', color: '#2E6BA8' },
                    { label: 'Post-Strategy GEI', value: formatGEI(strat.post_strategy_gei), color: '#1A1C18' },
                    strat.npv_cr !== null && strat.npv_cr !== undefined ? { label: '10-Yr NPV', value: formatCr(strat.npv_cr), color: '#1F4D2E' } : null,
                    strat.payback_years !== null && strat.payback_years !== undefined ? { label: 'Capital Payback', value: formatYears(strat.payback_years), color: '#1A1C18' } : null,
                    { label: 'Risk Index', value: `${strat.risk_score.toFixed(0)} / 100`, color: strat.risk_score < 40 ? '#1F4D2E' : strat.risk_score < 60 ? '#C98A1E' : '#D9531E' },
                  ].filter(Boolean).map((row: any, i) => (
                    <div key={i} className="flex justify-between py-1 border-b border-[#E8E2DC]/70 last:border-0">
                      <span className="text-[#6B7268]">{row.label}:</span>
                      <span className="font-mono font-bold" style={{ color: row.color }}>{row.value}</span>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-[#4A5446] mt-3 pt-2 border-t border-[#E8E2DC] leading-relaxed italic">
                  "{strat.summary || strat.name}"
                </p>
              </div>

              <div className="mt-4 pt-2">
                <button
                  onClick={() => onOpenCalculationTrace && onOpenCalculationTrace(stratKey)}
                  className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                    isWinner ? 'bg-[#1F4D2E] hover:bg-[#27643A] text-white shadow-sm' : 'bg-white border border-[#E8E2DC] hover:bg-[#F5F2F3] text-[#1A1C18]'
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
