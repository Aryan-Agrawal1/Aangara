'use client';

import React from 'react';
import { Header } from '@/components/navigation/Header';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ProvenanceFooter } from '@/components/ui/ProvenanceFooter';
import { ShieldCheck, Database, FileText, Cpu, AlertTriangle } from 'lucide-react';

export default function TrustCenterPage() {
  return (
    <div className="min-h-screen bg-[#070B11] flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">CarbonAlpha Trust Center</h1>
          </div>
          <p className="text-sm text-slate-400 mt-2">
            Technical Evidence, Data Provenance, and Regulatory Alignment.
          </p>
        </div>

        <div className="space-y-6">
          {/* Data Provenance */}
          <section className="glass-panel rounded-xl p-6 border-slate-800">
            <div className="flex items-center space-x-2 mb-4">
              <Database className="w-5 h-5 text-sky-400" />
              <h2 className="text-lg font-bold text-white">Data Provenance</h2>
              <StatusBadge type="MODEL" />
            </div>
            <p className="text-sm text-slate-300 mb-4">
              All platform data displayed in the current demonstration environment is synthetically generated to protect proprietary industrial facility data.
            </p>
            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800">
              <ul className="list-disc list-inside text-sm text-slate-400 space-y-2">
                <li><strong className="text-slate-200">252,000+ rows</strong> of operational facility data have been synthetically generated.</li>
                <li>Data models accurately reflect the statistical distribution and operational realities of Indian industrial sectors.</li>
                <li>Zero exposure of actual corporate proprietary data.</li>
              </ul>
            </div>
          </section>

          {/* Regulatory Registry */}
          <section className="glass-panel rounded-xl p-6 border-slate-800">
            <div className="flex items-center space-x-2 mb-4">
              <FileText className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-bold text-white">Regulatory Registry Status</h2>
              <StatusBadge type="FACT" />
            </div>
            <p className="text-sm text-slate-300 mb-4">
              Alignment with the Ministry of Environment, Forest and Climate Change (MoEFCC) and Bureau of Energy Efficiency (BEE) gazette notifications.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                <h3 className="text-sm font-bold text-slate-200 mb-1">Iron & Steel</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800/60">DRAFT (G.S.R. 517(E))</span>
                <p className="text-xs text-slate-400 mt-2">Pending final target finalization under phase 2 consultations.</p>
              </div>
              <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                <h3 className="text-sm font-bold text-slate-200 mb-1">Cement</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60">NOTIFIED</span>
                <p className="text-xs text-slate-400 mt-2">Active statutory compliance targets in effect.</p>
              </div>
            </div>
          </section>

          {/* ML Model Cards */}
          <section className="glass-panel rounded-xl p-6 border-slate-800">
            <div className="flex items-center space-x-2 mb-4">
              <Cpu className="w-5 h-5 text-purple-400" />
              <h2 className="text-lg font-bold text-white">ML Model Cards: GEI Benchmark Model</h2>
              <StatusBadge type="CALCULATION" />
            </div>
            <p className="text-sm text-slate-300 mb-4">
              Transparency documentation for the predictive models powering CarbonAlpha's Decision Intelligence.
            </p>
            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-200">Model Overview</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Predicts Greenhouse Gas Emission Intensity (GEI) trajectories based on historical operational configurations and regulatory constraints.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-200 flex items-center space-x-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  <span>Known Limitations & Biases</span>
                </h3>
                <ul className="list-disc list-inside text-xs text-slate-400 mt-2 space-y-1">
                  <li>Trained on synthetic baseline distributions; accuracy on real-world edge cases is unverified.</li>
                  <li>Assumes linear grid emission factor reduction (CEA v20.0 to v22.0 projections).</li>
                  <li>Does not fully account for sudden technological breakthroughs in specific sub-processes.</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
        <ProvenanceFooter verifiedDate="2026-01-09" />
      </main>
    </div>
  );
}
