'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/navigation/Header';
import { ScenarioSliders } from '@/components/cockpit/ScenarioSliders';
import { runScenarioSimulation, getEntities, getSectors } from '@/lib/api';
import { ScenarioParams, ScenarioSimulationResult } from '@/lib/types';
import { formatCurrencyCr, formatEmissions, formatPricePerTonne } from '@/lib/formatters';
import { useAppStore } from '@/lib/store';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, Cell
} from 'recharts';
import { Sliders, Crown, TrendingUp, AlertTriangle, ShieldCheck, HelpCircle, Layers, Activity } from 'lucide-react';

const STRATEGY_COLORS: Record<string, string> = {
  BUY: '#38bdf8',     // sky-400
  BUILD: '#fbbf24',   // amber-400
  HYBRID: '#34d399',  // emerald-400
};

const CHART_GRID = '#1e293b';
const CHART_TEXT = '#94a3b8';

// Custom dark tooltip
const ScenarioTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0E1524] border border-slate-700 rounded-lg p-3 text-xs shadow-2xl">
      <p className="text-slate-300 font-semibold mb-1.5">{label}</p>
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex justify-between items-center space-x-3 py-0.5">
          <span style={{ color: p.color }} className="font-medium">{p.name}:</span>
          <span className="font-mono text-white font-bold">
            {typeof p.value === 'number' ? `₹${p.value.toFixed(2)} Cr` : p.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function ScenariosPage() {
  const {
    currentSector, currentEntityId, reportingYear,
    sectors, entities, scenarioParams,
    setSector, setEntityId, setReportingYear,
    setSectors, setEntities, setScenarioParams, resetScenarioParams
  } = useAppStore();

  const [result, setResult] = useState<ScenarioSimulationResult | null>(null);
  const [sensitivityData, setSensitivityData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize sectors/entities if not already populated
  useEffect(() => {
    async function init() {
      if (sectors.length === 0 || entities.length === 0) {
        try {
          const [s, e] = await Promise.all([getSectors(), getEntities(currentSector)]);
          setSectors(s);
          setEntities(e);
        } catch (err) {
          console.error('Failed to init scenarios data:', err);
        }
      }
    }
    init();
  }, []);

  // Compute sensitivity curves across price spectrum (₹200 to ₹2,500/t)
  const computeSensitivity = async (baseParams: ScenarioParams) => {
    const pricePoints = [300, 600, 900, 1200, 1500, 1800, 2200, 2600];
    const curve = [];

    for (const p of pricePoints) {
      try {
        const sim = await runScenarioSimulation(currentEntityId, reportingYear, {
          ...baseParams,
          ccc_price_inr: p
        });
        curve.push({
          priceLabel: `₹${p}/t`,
          price: p,
          BUY: sim.strategies.BUY?.total_cost_cr || 0,
          BUILD: sim.strategies.BUILD?.total_cost_cr || 0,
          HYBRID: sim.strategies.HYBRID?.total_cost_cr || 0,
        });
      } catch {
        // Continue
      }
    }
    setSensitivityData(curve);
  };

  const runSim = async (p: ScenarioParams) => {
    setScenarioParams(p);
    setIsLoading(true);
    try {
      const res = await runScenarioSimulation(currentEntityId, reportingYear, p);
      setResult(res);
      computeSensitivity(p);
      useAppStore.getState().updateDecisionStrategies(res, p);
    } catch (e) {
      console.error('Simulation failed:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runSim(scenarioParams);
  }, [currentEntityId, reportingYear]);

  return (
    <div className="min-h-screen bg-[#070B11] flex flex-col">
      <Header
        currentSector={currentSector}
        currentEntityId={currentEntityId}
        reportingYear={reportingYear}
        onSectorChange={async (sec) => {
          setSector(sec);
          const ents = await getEntities(sec);
          setEntities(ents);
          if (ents.length > 0) setEntityId(ents[0].entity_id);
        }}
        onEntityChange={setEntityId}
        onYearChange={setReportingYear}
        sectorsList={sectors}
        entitiesList={entities}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-white tracking-tight">Scenario Stress Testing Matrix</h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800/60 font-semibold">
                SENSITIVITY & RISK LAB
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Simulate volatile carbon credit market prices, commissioning delays, project derating, and cost of capital shocks.
            </p>
          </div>
          <span className="text-[11px] font-mono text-slate-500 bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
            Active Entity: <strong className="text-slate-300">{currentEntityId}</strong>
          </span>
        </div>

        {/* Sliders Control Panel */}
        <ScenarioSliders
          params={scenarioParams}
          onChange={runSim}
          onReset={resetScenarioParams}
        />
        <p className="text-xs text-slate-500 mt-4">These scenario parameters sync with the Decision Twin. Navigate to Decision Twin to see updated recommendations.</p>

        {result && (
          <div className="mt-8 space-y-6">
            {/* Winner Banner */}
            <div className="glass-panel-elevated winner-card-glow rounded-xl p-5 border-emerald-500/70">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-emerald-900/60 border border-emerald-400/40 text-emerald-400">
                    <Crown className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-emerald-400 font-bold uppercase tracking-wider">Optimal Capital Allocation Path</div>
                    <h3 className="text-lg font-bold text-white tracking-tight">
                      Recommended: {result.winner_strategy} STRATEGY
                    </h3>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] font-mono px-3 py-1 rounded bg-slate-900 text-slate-300 border border-slate-700">
                    Scenario Utility Rank: #1
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mt-3 pt-3 border-t border-slate-800/80">
                {result.winner_summary}
              </p>
            </div>

            {/* Sensitivity Curve Chart */}
            <div className="glass-panel rounded-xl p-5 border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 pb-3 border-b border-slate-800 gap-2">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 rounded-lg bg-slate-800 text-sky-400 border border-slate-700">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Carbon Market Price Sensitivity Curve (₹200 – ₹2,600 / tCO₂e)</h3>
                    <p className="text-xs text-slate-400">Shows total 3-year lifecycle cost trajectory and economic switching points across strategies</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 self-start sm:self-auto">
                  LIVE MONTE CARLO SWEEP
                </span>
              </div>

              {sensitivityData.length > 0 ? (
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sensitivityData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} vertical={false} />
                      <XAxis dataKey="priceLabel" tick={{ fill: CHART_TEXT, fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: CHART_TEXT, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v.toFixed(0)}Cr`} />
                      <Tooltip content={<ScenarioTooltip />} />
                      <Legend formatter={(val) => <span style={{ color: STRATEGY_COLORS[val], fontSize: 12 }}>{val} Strategy</span>} />
                      <Line type="monotone" dataKey="BUY" stroke={STRATEGY_COLORS.BUY} strokeWidth={2} dot={{ r: 3 }} />
                      <Line type="monotone" dataKey="BUILD" stroke={STRATEGY_COLORS.BUILD} strokeWidth={2} dot={{ r: 3 }} />
                      <Line type="monotone" dataKey="HYBRID" stroke={STRATEGY_COLORS.HYBRID} strokeWidth={3} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-48 flex items-center justify-center text-xs text-slate-500 font-mono">
                  Calculating multi-price sensitivity sweep...
                </div>
              )}
            </div>

            {/* Strategy Cards Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {Object.values(result.strategies).map((s) => {
                const isWinner = s.strategy === result.winner_strategy;
                const color = STRATEGY_COLORS[s.strategy];

                return (
                  <div
                    key={s.strategy}
                    className={`rounded-xl p-5 relative transition-all flex flex-col justify-between ${
                      isWinner ? 'glass-panel-elevated border-emerald-500' : 'glass-panel hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center space-x-2">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                          <h4 className="text-base font-bold text-white">{s.strategy} Strategy</h4>
                        </div>
                        <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                          isWinner ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-slate-800 text-slate-300'
                        }`}>
                          Rank #{s.rank}
                        </span>
                      </div>

                      <div className="bg-slate-900/90 rounded-lg p-3 border border-slate-800 my-3">
                        <div className="text-[10px] text-slate-400 uppercase font-medium">Scenario 3-Yr Cost</div>
                        <div className="text-xl font-bold text-white tnum mt-0.5">
                          {formatCurrencyCr(s.total_cost_cr)}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1 flex justify-between">
                          <span>Cost / tCO₂e:</span>
                          <span className="font-mono text-slate-200 font-semibold">{formatPricePerTonne(s.cost_per_tco2e)}</span>
                        </div>
                      </div>

                      <div className="text-xs space-y-2 font-mono">
                        <div className="flex justify-between py-1 border-b border-slate-800/60">
                          <span className="text-slate-400">Internal Abatement:</span>
                          <span className="text-emerald-400 font-semibold">{formatEmissions(s.internal_abatement_tco2e)}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-800/60">
                          <span className="text-slate-400">Market CCCs:</span>
                          <span className="text-sky-400 font-semibold">{s.procured_ccc_tco2e.toLocaleString('en-IN')} CCCs</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-800/60">
                          <span className="text-slate-400">Utility Score:</span>
                          <span className="text-white font-bold">{s.utility_score.toFixed(1)}/100</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-slate-400">Risk Score:</span>
                          <span className={`${s.risk_score < 40 ? 'text-emerald-400' : s.risk_score < 60 ? 'text-amber-400' : 'text-rose-400'}`}>
                            {s.risk_score.toFixed(0)}/100
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 italic mt-3 pt-2 border-t border-slate-800 leading-relaxed">
                      "{s.summary}"
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
