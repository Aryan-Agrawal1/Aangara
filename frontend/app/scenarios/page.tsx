'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/navigation/Header';
import { ScenarioSliders } from '@/components/cockpit/ScenarioSliders';
import { runScenarioSimulation, getEntities } from '@/lib/api';
import { ScenarioParams, ScenarioSimulationResult } from '@/lib/types';
import { formatCurrencyCr, formatEmissions } from '@/lib/formatters';
import { Sliders, Crown, TrendingUp, AlertTriangle } from 'lucide-react';

export default function ScenariosPage() {
  const [selectedEntityId, setSelectedEntityId] = useState('SYN-CEM-001');
  const [params, setParams] = useState<ScenarioParams>({
    ccc_price_inr: 1000.0,
    project_output_pct: 100.0,
    project_delay_months: 0,
    financing_rate_pct: 9.5
  });
  const [result, setResult] = useState<ScenarioSimulationResult | null>(null);

  const runSim = async (p: ScenarioParams) => {
    setParams(p);
    try {
      const res = await runScenarioSimulation(selectedEntityId, '2025-26', p);
      setResult(res);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    runSim(params);
  }, [selectedEntityId]);

  return (
    <div className="min-h-screen bg-[#070B11] flex flex-col">
      <Header currentEntityId={selectedEntityId} onEntityChange={setSelectedEntityId} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white tracking-tight">Scenario Stress Testing Matrix</h1>
          <p className="text-sm text-slate-400 mt-1">
            Simulate volatile market prices, operational slippages, and capital cost shocks across BUY, BUILD, and HYBRID strategies.
          </p>
        </div>

        <ScenarioSliders
          params={params}
          onChange={runSim}
          onReset={() => runSim({ ccc_price_inr: 1000, project_output_pct: 100, project_delay_months: 0, financing_rate_pct: 9.5 })}
        />

        {result && (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Winner Banner */}
            <div className="glass-panel rounded-xl p-5 border-emerald-500/50 lg:col-span-3">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold mb-2">
                <Crown className="w-5 h-5" />
                <span className="text-base">Optimal Path under Scenario: {result.winner_strategy}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{result.winner_summary}</p>
            </div>

            {/* Strategy Comparison Cards */}
            {Object.values(result.strategies).map((s) => (
              <div key={s.strategy} className="glass-panel rounded-xl p-5">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-white">{s.strategy} Strategy</h3>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-white">
                    Rank #{s.rank}
                  </span>
                </div>
                <div className="text-xl font-bold text-white mb-2">{formatCurrencyCr(s.total_cost_cr)}</div>
                <div className="text-xs text-slate-400 space-y-1.5">
                  <div className="flex justify-between">
                    <span>Internal Abatement:</span>
                    <span className="font-mono text-emerald-400">{formatEmissions(s.internal_abatement_tco2e)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>CCC Procured:</span>
                    <span className="font-mono text-sky-400">{s.procured_ccc_tco2e.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Utility Score:</span>
                    <span className="font-mono font-bold text-white">{s.utility_score.toFixed(1)}/100</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
