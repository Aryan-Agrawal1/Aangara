'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/navigation/Header';
import { getSectors, getEntities } from '@/lib/api';
import { Building2, ShieldCheck, ArrowUpRight, CheckCircle2, Clock } from 'lucide-react';
import Link from 'next/link';

export default function OverviewPage() {
  const [sectors, setSectors] = useState<any[]>([]);
  const [entities, setEntities] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [secs, ents] = await Promise.all([getSectors(), getEntities()]);
        setSectors(secs);
        setEntities(ents);
      } catch (e) {
        console.error(e);
      }
    }
    loadData();
  }, []);

  const monitoredSectors = sectors.filter((s) => s.category === 'CCTS_MONITORED');
  const watchlistSectors = sectors.filter((s) => s.category === 'WATCHLIST');

  return (
    <div className="min-h-screen bg-[#070B11] flex flex-col">
      <Header sectorsList={sectors} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white tracking-tight">National CCTS Sector Landscape</h1>
          <p className="text-sm text-slate-400 mt-1">
            Tracking Indian compliance obligations across 7 notified sectors (490 obligated units) and active watchlist sectors.
          </p>
        </div>

        {/* 7 Monitored Sectors Grid */}
        <div className="mb-10">
          <div className="flex items-center space-x-2 mb-4">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">7 Current Monitored Compliance Sectors</h2>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60 font-mono font-semibold">
              FINAL GEI TARGETS ACTIVE
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

        {/* Watchlist Scope */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Clock className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white">Watchlist & Transition Scope</h2>
            <span className="text-xs px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800/60 font-mono font-semibold">
              ACTIVE DRAFT / PHASE 2
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
                  <span className="text-slate-400 italic">Pre-compliance Modeling Active</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
