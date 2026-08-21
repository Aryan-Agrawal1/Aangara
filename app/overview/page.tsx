'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/navigation/Header';
import { getSectors, getEntities } from '@/lib/api';
import { useAppStore } from '@/lib/store';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, Cell
} from 'recharts';
import {
  Building2, ShieldCheck, ArrowUpRight, CheckCircle2, Clock,
  BarChart3, Layers, FileText, Scale
} from 'lucide-react';
import Link from 'next/link';

const CHART_GRID = '#1e293b';
const CHART_TEXT = '#94a3b8';

// Custom dark tooltip for sector comparison
const SectorTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0E1524] border border-slate-700 rounded-lg p-3 text-xs shadow-2xl">
      <p className="text-white font-bold mb-1.5">{label} Sector</p>
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex justify-between items-center space-x-3 py-0.5">
          <span style={{ color: p.color }} className="font-medium">{p.name}:</span>
          <span className="font-mono text-white font-bold">
            {typeof p.value === 'number' ? `${p.value.toFixed(3)} ${p.payload.unit || ''}` : p.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function OverviewPage() {
  const { setSector } = useAppStore();
  const [sectors, setSectors] = useState<any[]>([]);
  const [entities, setEntities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [secs, ents] = await Promise.all([getSectors(), getEntities()]);
        setSectors(secs);
        setEntities(ents);
      } catch (e) {
        console.error('Failed to load overview data:', e);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const monitoredSectors = sectors.filter((s) => s.category === 'CCTS_MONITORED');
  const watchlistSectors = sectors.filter((s) => s.category === 'WATCHLIST');

  // Chart data: Baseline GEI vs Target GEI across sectors
  const chartData = monitoredSectors.map((s) => {
    const tgt = s.targets?.[0] || {};
    return {
      name: s.name,
      'Baseline GEI': tgt.baseline_gei_default || 0,
      '2025-26 Target GEI': tgt.target_gei_2025_26 || 0,
      '2026-27 Target GEI': tgt.target_gei_2026_27 || 0,
      unit: tgt.gei_unit || 'tCO₂e/t'
    };
  });

  return (
    <div className="min-h-screen bg-[#070B11] flex flex-col">
      <Header sectorsList={sectors} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Banner */}
        <div className="mb-8">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">National CCTS Sector Landscape</h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60 font-semibold">
              STATUTORY COMPLIANCE MAP
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Official Indian compliance obligations across 7 notified sectors (490+ obligated industrial units) and active watchlist sectors under MoEFCC & BEE Gazette G.S.R. 25(E).
          </p>
        </div>

        {/* National Macro KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="glass-panel rounded-xl p-4 border-slate-800">
            <div className="text-[11px] text-slate-400 font-medium">Notified Compliance Units</div>
            <div className="text-2xl font-bold text-white font-mono mt-1">490+</div>
            <div className="text-[10px] text-emerald-400 mt-0.5">Under 7 Notified Sectors</div>
          </div>
          <div className="glass-panel rounded-xl p-4 border-slate-800">
            <div className="text-[11px] text-slate-400 font-medium">Draft Expansion Units</div>
            <div className="text-2xl font-bold text-sky-400 font-mono mt-1">255</div>
            <div className="text-[10px] text-sky-400 mt-0.5">Iron & Steel (G.S.R. 517(E))</div>
          </div>
          <div className="glass-panel rounded-xl p-4 border-slate-800">
            <div className="text-[11px] text-slate-400 font-medium">Statutory Benchmark Act</div>
            <div className="text-base font-bold text-slate-200 font-mono mt-1">EC Act 2001 (14AA)</div>
            <div className="text-[10px] text-slate-400 mt-0.5">CCTS Gazette 2023</div>
          </div>
          <div className="glass-panel rounded-xl p-4 border-slate-800">
            <div className="text-[11px] text-slate-400 font-medium">National Grid Emission Factor</div>
            <div className="text-2xl font-bold text-teal-400 font-mono mt-1">0.716</div>
            <div className="text-[10px] text-slate-400 mt-0.5">tCO₂e/MWh (CEA v20.0)</div>
          </div>
        </div>

        {/* National Sector GEI Benchmark Chart */}
        {chartData.length > 0 && (
          <div className="glass-panel rounded-xl p-5 border-slate-800 mb-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 pb-3 border-b border-slate-800 gap-2">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-slate-800 text-emerald-400 border border-slate-700">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Statutory GHG Emission Intensity (GEI) Trajectories by Sector</h3>
                  <p className="text-xs text-slate-400">Comparing baseline intensity with 2025-26 & 2026-27 statutory Gazette targets</p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 self-start sm:self-auto">
                GAZETTE G.S.R. 25(E)
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: CHART_TEXT, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: CHART_TEXT, fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<SectorTooltip />} />
                  <Legend formatter={(val) => <span style={{ color: CHART_TEXT, fontSize: 11 }}>{val}</span>} />
                  <Bar dataKey="Baseline GEI" fill="#64748b" radius={[3, 3, 0, 0]} maxBarSize={28} />
                  <Bar dataKey="2025-26 Target GEI" fill="#38bdf8" radius={[3, 3, 0, 0]} maxBarSize={28} />
                  <Bar dataKey="2026-27 Target GEI" fill="#34d399" radius={[3, 3, 0, 0]} maxBarSize={28} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* 7 Monitored Compliance Sectors Grid */}
        <div className="mb-10">
          <div className="flex items-center space-x-2 mb-4">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">7 Monitored Compliance Sectors</h2>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60 font-mono font-semibold">
              FINAL GAZETTE TARGETS ACTIVE
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {monitoredSectors.map((sec) => (
              <div key={sec.sector_id} className="glass-panel rounded-xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base font-bold text-white">{sec.name}</h3>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/50">
                      {sec.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-4 leading-relaxed">{sec.notes}</p>
                  
                  <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 text-xs space-y-1 font-mono">
                    <div className="flex justify-between text-slate-400">
                      <span>Baseline Period:</span>
                      <span className="text-slate-200">{sec.baseline_period}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Compliance Window:</span>
                      <span className="text-slate-200">{sec.target_period}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-mono">{sec.source_id}</span>
                  <Link
                    href={`/decision?sector=${sec.sector_id}`}
                    onClick={() => setSector(sec.sector_id)}
                    className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center space-x-1"
                  >
                    <span>Launch Cockpit</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Watchlist Scope (Iron & Steel Draft + Fertiliser) */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Clock className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white">Watchlist & Draft Transition Scope</h2>
            <span className="text-xs px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800/60 font-mono font-semibold">
              DRAFT CONSULTATION / PHASE 2
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {watchlistSectors.map((sec) => (
              <div key={sec.sector_id} className="glass-panel rounded-xl p-5 border-dashed border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base font-bold text-white">{sec.name}</h3>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-950/80 text-amber-400 border border-amber-800/50">
                      {sec.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-4 leading-relaxed">{sec.notes}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-mono">{sec.source_id}</span>
                  <Link
                    href={`/industrial-intelligence?sector=${sec.sector_id}`}
                    className="text-amber-400 hover:text-amber-300 font-semibold flex items-center space-x-1"
                  >
                    <span>Test Facility Intelligence</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
