'use client';

import { UtilityBar } from "@/components/ui/UtilityBar";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import React, { useState, useEffect } from 'react';
import { Header } from '@/components/navigation/Header';
import { getSources, getMethodologies } from '@/lib/api';
import { RegulatorySourceItem, MethodologyItem } from '@/lib/types';
import { ProvenanceFooter } from '@/components/ui/ProvenanceFooter';
import { StatusBadge } from '@/components/ui/StatusBadge';
import {
  FileText, ExternalLink, ShieldCheck, CheckCircle2, BookOpen,
  Cpu, Database, Layers, Check, AlertCircle
} from 'lucide-react';

export default function SourcesPage() {
  const [sources, setSources] = useState<RegulatorySourceItem[]>([]);
  const [methodologies, setMethodologies] = useState<MethodologyItem[]>([]);
  
        const CATEGORIES = [
          { id: 'all', label: 'All Sources' },
          { id: 'acts', label: 'Acts & Regulations' },
          { id: 'notifications', label: 'Notifications' },
          { id: 'methodologies', label: 'Methodologies' },
          { id: 'targets', label: 'Targets & Benchmarks' },
          { id: 'datasets', label: 'Datasets' },
        ];
        const [activeCategory, setActiveCategory] = useState('all');
    
  const [activeTab, setActiveTab] = useState<'statutory' | 'methodologies' | 'models' | 'provenance'>('statutory');

  useEffect(() => {
    async function load() {
      const [s, m] = await Promise.all([getSources(), getMethodologies()]);
      setSources(s);
      setMethodologies(m);
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <UtilityBar />
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={[{ label: "Evidence Center" }]} />
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-[#10231C] tracking-tight">Regulatory Source & Model Registry</h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#EBF3FB] text-[#2E6BA8] border border-sky-800/60 font-semibold">
                AUDITABLE PROVENANCE
              </span>
            </div>
            <p className="text-sm text-[#4B5A54] mt-1">
              Complete inventory of Indian Gazette notifications, BEE offset methodologies, ML model cards, and dataset provenance.
            </p>
          </div>
        </div>

        
        
        
        <div className="mb-8 p-4 bg-[#F6F8F7] border border-[#E4E9E6] rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-[#E8F5F2] text-[#0B4A3D] border-[#0B4A3D]/20">REGULATORY WATCH</span>
            <h2 className="text-sm font-bold text-[#10231C]">Recent Regulatory Changes</h2>
          </div>
          <div className="space-y-2">
            {[
              { date: 'Jan 2026', event: 'G.S.R. 25(E): 8 sectors notified as FINAL under CCTS Phase 1 (Cement, Aluminium, Chlor-Alkali, Pulp & Paper, Petrochemicals, Petroleum Refinery, Textile + one more). Iron & Steel excluded from final notification — still at draft stage.', status: 'FACT' },
              { date: 'Jun 2026', event: 'Iron & Steel GEI targets issued as Revised Draft G.S.R. 517(E) covering 255 units — public comment period open, final gazette notification pending', status: 'FACT' },
              { date: 'Jul 2025', event: 'Fertiliser sector methodology updated to reflect urea process-emission boundary revision', status: 'FACT' },
              { date: 'Mar 2025', event: 'CEA Grid Emission Factor updated to 0.716 tCO2e/MWh for FY2024', status: 'FACT' },
            ].map(({ date, event, status }) => (
              <div key={date} className="flex items-start gap-3 py-2 border-b border-[#E4E9E6] last:border-0">
                <span className="text-[10px] font-mono text-[#6B7A72] w-16 flex-shrink-0 pt-0.5">{date}</span>
                <span className="text-xs text-[#4B5A54] flex-1">{event}</span>
                <StatusBadge type="FACT" />
              </div>
            ))}
          </div>
        </div>



        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-[#E4E9E6] pb-3">
          {[
            { id: 'statutory', label: '1. Statutory Authorities & Gazettes', icon: ShieldCheck },
            { id: 'methodologies', label: '2. BEE Offset Methodologies (12)', icon: BookOpen },
            { id: 'models', label: '3. ML Model Registry & Cards', icon: Cpu },
            { id: 'provenance', label: '4. Dataset Provenance', icon: Database },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`py-2 px-3.5 rounded-lg text-xs font-semibold flex items-center space-x-2 transition-all cursor-pointer ${
                activeTab === t.id
                  ? 'bg-white border border-[#E4E9E6] text-[#10231C] border border-[#E4E9E6] shadow-sm'
                  : 'text-[#4B5A54] hover:text-[#4B5A54] bg-[#F6F8F7]'
              }`}
            >
              <t.icon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Tab 1: Primary Legal Sources */}
        {activeTab === 'statutory' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sources.map((src) => (
                <div key={src.source_id} className="glass-panel rounded-xl p-5 border-[#E4E9E6] flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-2.5">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#EBF3FB] text-[#2E6BA8] border border-[#2E6BA8]/20">
                        TIER {src.tier} · {src.authority}
                      </span>
                      <span className="text-xs text-[#6B7A72] font-mono">{src.date}</span>
                    </div>
                    <h3 className="text-sm font-bold text-[#10231C] mb-2 leading-snug">{src.title}</h3>
                    <p className="text-xs text-[#4B5A54] leading-relaxed mb-4">{src.notes}</p>
                  </div>

                  <div className="pt-3 border-t border-[#E4E9E6]/80 flex justify-between items-center text-xs">
                    <span className="text-[#6B7A72] font-mono">{src.source_id}</span>
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#2E6BA8] hover:text-sky-300 font-semibold flex items-center space-x-1"
                    >
                      <span>View Gazette Source</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: BEE 12 Methodologies */}
        {activeTab === 'methodologies' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {methodologies.map((m) => (
              <div key={m.code} className="glass-panel rounded-xl p-4 border-[#E4E9E6] text-xs flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-mono font-bold text-[#0B4A3D] bg-emerald-950/60 px-2 py-0.5 rounded border border-[#0B4A3D]/20">
                      {m.code}
                    </span>
                    <span className="text-[10px] text-[#4B5A54] font-semibold">{m.sector}</span>
                  </div>
                  <h4 className="font-bold text-[#10231C] mb-2 leading-snug">{m.title}</h4>
                  <div className="text-[11px] text-[#4B5A54] mb-3">
                    <span className="font-medium text-[#4B5A54]">Applicable Tech:</span> {m.applicable_technologies.join(', ')}
                  </div>
                </div>
                <div className="pt-2 border-t border-[#E4E9E6]/60 text-[10px] text-[#6B7A72] flex justify-between">
                  <span>Status: Active Gazette Notification</span>
                  <span className="text-teal-400 font-semibold">Tier 1 Approved</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Model Registry & Cards */}
        {activeTab === 'models' && (
          <div className="space-y-4">
            {[
              {
                id: 'CA-GEI-BENCHMARK-V2',
                name: 'Industrial GEI Peer Benchmark Model',
                algo: 'HistGradientBoostingRegressor (scikit-learn)',
                tier: 'CALIBRATED',
                features: ['sector_enc', 'annual_production', 'electricity_intensity_kwh', 'renewable_electricity_pct', 'thermal_fuel_gj'],
                target: 'actual_gei (tCO₂e/t output)',
                mae: '0.1430 tCO₂e/t',
                lift: '3.25x improvement over naive sector-median baseline',
                notes: 'Trained on calibrated synthetic data v2 with log-normal noise and facility-level train/holdout split. Advisory peer ranking only.'
              },
              {
                id: 'CA-ENERGY-BENCHMARK-V1',
                name: 'Energy Intensity Benchmark Model',
                algo: 'HistGradientBoostingRegressor (scikit-learn)',
                tier: 'CALIBRATED',
                features: ['sector_enc', 'annual_production', 'renewable_electricity_pct', 'thermal_fuel_gj', 'actual_gei'],
                target: 'electricity_intensity_kwh_t (kWh/t)',
                mae: '38.27 kWh/t',
                lift: '14.69x improvement over sector-median baseline',
                notes: 'Predicts plant electrical intensity relative to thermodynamic best practices.'
              },
              {
                id: 'CA-ANOMALY-ISO-V2',
                name: 'Operational Anomaly Detector',
                algo: 'IsolationForest (contamination=0.05, n_estimators=200)',
                tier: 'CALIBRATED',
                features: ['electricity_intensity_kwh', 'renewable_electricity_pct', 'thermal_fuel_gj', 'actual_gei'],
                target: 'Operational outlier classification (1 = Normal, -1 = Anomaly)',
                mae: 'N/A (Unsupervised)',
                lift: 'Identifies top 5% thermodynamic deviations with deterministic reason codes',
                notes: 'Advisory data-quality signal only — does not constitute a formal compliance audit.'
              }
            ].map((m) => (
              <div key={m.id} className="glass-panel rounded-xl p-5 border-[#E4E9E6]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-[#E4E9E6] gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-sm font-bold text-[#0B4A3D]">{m.id}</span>
                    <span className="text-sm font-bold text-[#10231C]">· {m.name}</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-[#E8F5EE] text-[#0B4A3D] border border-emerald-800/30 self-start sm:self-auto">
                    TIER: {m.tier}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-2">
                    <div><span className="text-[#4B5A54] font-medium">Algorithm:</span> <span className="font-mono text-[#4B5A54]">{m.algo}</span></div>
                    <div><span className="text-[#4B5A54] font-medium">Target:</span> <span className="font-mono text-[#10231C]">{m.target}</span></div>
                    <div><span className="text-[#4B5A54] font-medium">Features ({m.features.length}):</span> <span className="font-mono text-[#2E6BA8]">{m.features.join(', ')}</span></div>
                  </div>
                  <div className="space-y-2">
                    <div><span className="text-[#4B5A54] font-medium">Holdout MAE:</span> <span className="font-mono text-[#0B4A3D] font-bold">{m.mae}</span></div>
                    <div><span className="text-[#4B5A54] font-medium">Lift over Baseline:</span> <span className="font-mono text-[#4B5A54]">{m.lift}</span></div>
                    <div><span className="text-[#4B5A54] font-medium">Governance:</span> <span className="text-[#4B5A54]">{m.notes}</span></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 4: Dataset Provenance */}
        {activeTab === 'provenance' && (
          <div className="space-y-4">
            {[
              {
                id: 'REG-TRUTH-2026-08',
                name: 'Regulatory Truth — CCTS Sector Targets & Trajectories',
                type: 'REAL_OFFICIAL',
                authority: 'MoEFCC / Bureau of Energy Efficiency (BEE)',
                records: '9 Sectors (7 Final, 2 Draft/Watchlist)',
                source: 'MoEFCC Notification G.S.R. 25(E) & Draft G.S.R. 517(E)'
              },
              {
                id: 'SYNTH-2026-08-v2',
                name: 'Industrial Calibrated Synthetic Training Set v2',
                type: 'CALIBRATED_SYNTHETIC',
                authority: 'CarbonAlpha Engineering Generator v2',
                records: '1,600 Facilities (16 reporting intervals per facility)',
                source: 'Distributions calibrated against BEE PAT BAT, CEA grid factor (0.716), CMA cement reports, and BRSR corporate filings'
              },
              {
                id: 'HOLDOUT-2026-08-v2',
                name: 'Model Validation Holdout Dataset v2',
                type: 'VALIDATION_HOLDOUT',
                authority: 'CarbonAlpha Governance Pipeline',
                records: '320 Records (20 independent facilities — 0% train leakage)',
                source: 'Used exclusively for unbiased holdout validation in test_ml_governance.py'
              }
            ].map((p) => (
              <div key={p.id} className="glass-panel rounded-xl p-5 border-[#E4E9E6] text-xs">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-mono text-sm font-bold text-[#2E6BA8]">{p.id}</span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white border border-[#E4E9E6] text-[#4B5A54]">
                    {p.type}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-[#10231C] mb-2">{p.name}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[#4B5A54] mb-2">
                  <div><strong className="text-[#4B5A54]">Authority:</strong> {p.authority}</div>
                  <div><strong className="text-[#4B5A54]">Record Count:</strong> {p.records}</div>
                </div>
                <div className="p-2.5 rounded-lg bg-[#F6F8F7] text-[#4B5A54] font-mono text-[11px] leading-relaxed">
                  {p.source}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
