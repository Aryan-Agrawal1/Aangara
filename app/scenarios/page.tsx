'use client';

import { UtilityBar } from "@/components/ui/UtilityBar";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ProvenanceFooter } from "@/components/ui/ProvenanceFooter";
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

const CHART_GRID = '#E4E9E6';
const CHART_TEXT = '#6B7A72';

// Custom dark tooltip
const ScenarioTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-[#E4E9E6] shadow-lg border border-[#E4E9E6] rounded-lg p-3 text-xs shadow-2xl">
      <p className="text-[#4B5A54] font-semibold mb-1.5">{label}</p>
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex justify-between items-center space-x-3 py-0.5">
          <span style={{ color: p.color }} className="font-medium">{p.name}:</span>
          <span className="font-mono text-[#10231C] font-bold">
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
    <div className="min-h-screen bg-white flex flex-col">
      <UtilityBar />
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
        <Breadcrumb items={[{ label: "Stress Scenarios" }]} />
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-[#10231C] tracking-tight">Scenario Stress Testing Matrix</h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FEF7E8] text-[#C98A1E] border border-[#C98A1E]/30 font-semibold">
                SENSITIVITY & RISK LAB
              </span>
            </div>
            <p className="text-xs text-[#4B5A54] mt-1">
              Simulate volatile carbon credit market prices, commissioning delays, project derating, and cost of capital shocks.
            </p>
          </div>
          <span className="text-[11px] font-mono text-[#6B7A72] bg-[#F6F8F7] px-2.5 py-1 rounded border border-[#E4E9E6]">
            Active Entity: <strong className="text-[#4B5A54]">{currentEntityId}</strong>
          </span>
        </div>

        {/* Sliders Control Panel */}
        <ScenarioSliders
          params={scenarioParams}
          onChange={runSim}
          onReset={resetScenarioParams}
        />
        <p className="text-xs text-[#6B7A72] mt-4">These scenario parameters sync with the Decision Twin. Navigate to Decision Twin to see updated recommendations.</p>

        {result && (
          <div className="mt-8 space-y-6">
            {/* Winner Banner */}
            <div className="glass-panel-elevated winner-card-glow rounded-xl p-5 border-emerald-500/70">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-emerald-900/60 border border-emerald-400/40 text-[#0B4A3D]">
                    <Crown className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-[#0B4A3D] font-bold uppercase tracking-wider">Optimal Capital Allocation Path</div>
                    <h3 className="text-lg font-bold text-[#10231C] tracking-tight">
                      Recommended: {result.winner_strategy} STRATEGY
                    </h3>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] font-mono px-3 py-1 rounded bg-[#F6F8F7] text-[#4B5A54] border border-[#E4E9E6]">
                    Scenario Utility Rank: #1
                  </span>
                </div>
              </div>
              <p className="text-xs text-[#4B5A54] leading-relaxed mt-3 pt-3 border-t border-[#E4E9E6]/80">
                {result.winner_summary}
              </p>
            </div>

            {/* Sensitivity Curve Chart */}
            <div className="glass-panel rounded-xl p-5 border-[#E4E9E6]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 pb-3 border-b border-[#E4E9E6] gap-2">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 rounded-lg bg-white border border-[#E4E9E6] text-[#2E6BA8] border border-[#E4E9E6]">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#10231C]">Carbon Market Price Sensitivity Curve (₹200 – ₹2,600 / tCO₂e)</h3>
                    <p className="text-xs text-[#4B5A54]">Shows total 3-year lifecycle cost trajectory and economic switching points across strategies</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-[#4B5A54] bg-[#F6F8F7] px-2 py-0.5 rounded border border-[#E4E9E6] self-start sm:self-auto">
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
                <div className="h-48 flex items-center justify-center text-xs text-[#6B7A72] font-mono">
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
                      isWinner ? 'glass-panel-elevated border-emerald-500' : 'glass-panel hover:border-[#E4E9E6]'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center space-x-2">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                          <h4 className="text-base font-bold text-[#10231C]">{s.strategy} Strategy</h4>
                        </div>
                        <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                          isWinner ? 'bg-[#E8F5EE] text-[#0B4A3D] border border-emerald-800' : 'bg-white border border-[#E4E9E6] text-[#4B5A54]'
                        }`}>
                          Rank #{s.rank}
                        </span>
                      </div>

                      <div className="bg-[#F6F8F7]/90 rounded-lg p-3 border border-[#E4E9E6] my-3">
                        <div className="text-[10px] text-[#4B5A54] uppercase font-medium">Scenario 3-Yr Cost</div>
                        <div className="text-xl font-bold text-[#10231C] tnum mt-0.5">
                          {formatCurrencyCr(s.total_cost_cr)}
                        </div>
                        <div className="text-[11px] text-[#4B5A54] mt-1 flex justify-between">
                          <span>Cost / tCO₂e:</span>
                          <span className="font-mono text-[#4B5A54] font-semibold">{formatPricePerTonne(s.cost_per_tco2e)}</span>
                        </div>
                      </div>

                      <div className="text-xs space-y-2 font-mono">
                        <div className="flex justify-between py-1 border-b border-[#E4E9E6]/60">
                          <span className="text-[#4B5A54]">Internal Abatement:</span>
                          <span className="text-[#0B4A3D] font-semibold">{formatEmissions(s.internal_abatement_tco2e)}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-[#E4E9E6]/60">
                          <span className="text-[#4B5A54]">Market CCCs:</span>
                          <span className="text-[#2E6BA8] font-semibold">{s.procured_ccc_tco2e.toLocaleString('en-IN')} CCCs</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-[#E4E9E6]/60">
                          <span className="text-[#4B5A54]">Utility Score:</span>
                          <span className="text-[#10231C] font-bold">{s.utility_score.toFixed(1)}/100</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-[#4B5A54]">Risk Score:</span>
                          <span className={`${s.risk_score < 40 ? 'text-[#0B4A3D]' : s.risk_score < 60 ? 'text-[#C98A1E]' : 'text-[#C33B2E]'}`}>
                            {s.risk_score.toFixed(0)}/100
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-[#4B5A54] italic mt-3 pt-2 border-t border-[#E4E9E6] leading-relaxed">
                      "{s.summary}"
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        <ProvenanceFooter verifiedDate="2026-01-09" />
      </main>
    </div>
  );
}
