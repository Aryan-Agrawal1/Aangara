"use client";
import React, { useEffect, useState } from "react";
import { Header } from "@/components/navigation/Header";
import { UtilityBar } from "@/components/ui/UtilityBar";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ProvenanceFooter } from "@/components/ui/ProvenanceFooter";
import { ShieldCheck, Database, FileText, Cpu, ExternalLink, AlertTriangle, CheckCircle2, Clock, Info } from "lucide-react";

// Data-label badge definitions
const DATA_LABELS: Record<string, { label: string; bg: string; text: string; description: string }> = {
  FACT:         { label: 'FACT',        bg: 'bg-[#E8F5EE]', text: 'text-[#0B4A3D]', description: 'Direct official regulatory value — exactly as published in the Gazette.' },
  CALCULATION:  { label: 'CALCULATION', bg: 'bg-[#EBF3FB]', text: 'text-[#2E6BA8]', description: 'Computed from FACT inputs using a documented, versioned formula.' },
  MODEL:        { label: 'MODEL',       bg: 'bg-purple-50',  text: 'text-purple-700', description: 'Statistical or ML-based estimate from historical distributions. Labelled uncertainty applies.' },
  ASSUMPTION:   { label: 'ASSUMPTION',  bg: 'bg-[#FEF7E8]', text: 'text-[#C98A1E]', description: 'Reasonable default value; should be overridden with your facility-specific data.' },
  SCENARIO:     { label: 'SCENARIO',    bg: 'bg-[#FEF7E8]', text: 'text-[#C98A1E]', description: 'Hypothetical future value — sensitivity analysis only, not a regulatory determination.' },
};

const SECTORS_TRUST_DATA = [
  { name: 'Cement',             sector_key: 'cement',             status: 'FINAL',     gazette: 'G.S.R. 25(E) — MoEFCC 2025', url: 'https://egazette.gov.in/WriteReadData/2026/269375.pdf',  note: 'Active compliance window. Statutory GEI targets apply to all integrated cement plants.' },
  { name: 'Aluminium',          sector_key: 'aluminium',          status: 'FINAL',     gazette: 'G.S.R. 25(E) — MoEFCC 2025', url: 'https://egazette.gov.in/WriteReadData/2026/269375.pdf',  note: 'Applies to primary aluminium smelting (BF-BOF excluded).' },
  { name: 'Chlor-Alkali',       sector_key: 'chlor_alkali',       status: 'FINAL',     gazette: 'G.S.R. 25(E) — MoEFCC 2025', url: 'https://egazette.gov.in/WriteReadData/2026/269375.pdf',  note: 'Membrane cell technology benchmarks. Mercury cell excluded from CCTS scope.' },
  { name: 'Pulp & Paper',       sector_key: 'pulp_paper',         status: 'FINAL',     gazette: 'G.S.R. 25(E) — MoEFCC 2025', url: 'https://egazette.gov.in/WriteReadData/2026/269375.pdf',  note: 'Wood-based integrated mills. Agro-based and waste-paper mills on separate schedule.' },
  { name: 'Petrochemicals',     sector_key: 'petrochemicals',     status: 'FINAL',     gazette: 'G.S.R. 25(E) — MoEFCC 2025', url: 'https://egazette.gov.in/WriteReadData/2026/269375.pdf',  note: 'Naphtha and gas-based cracker complexes.' },
  { name: 'Petroleum Refinery', sector_key: 'petroleum_refinery', status: 'FINAL',     gazette: 'G.S.R. 25(E) — MoEFCC 2025', url: 'https://egazette.gov.in/WriteReadData/2026/269375.pdf',  note: 'Nelson Complexity-adjusted GEI basis. MBN (Modified Barrel Number) denominator.' },
  { name: 'Textile',            sector_key: 'textile',            status: 'FINAL',     gazette: 'G.S.R. 25(E) — MoEFCC 2025', url: 'https://egazette.gov.in/WriteReadData/2026/269375.pdf',  note: 'Composite fabric mills. Spinning, weaving, and dyeing sub-processes included.' },
  { name: 'Iron & Steel',       sector_key: 'iron_steel',         status: 'DRAFT',     gazette: 'G.S.R. 517(E) — DRAFT',       url: 'https://moef.gov.in/en/notifications/',                 note: 'Draft targets under Phase 2 consultations. Obligated units: 255 (estimated).' },
  { name: 'Fertiliser',         sector_key: 'fertiliser',         status: 'WATCHLIST', gazette: 'Watchlist — no notification',  url: 'https://fert.gov.in/',                                  note: 'Integration with NGHM (Green Hydrogen) pending. No finalised GEI as of Aug 2026.' },
];

const SOURCE_DATA = [
  { authority: 'Parliament of India', title: 'Energy Conservation Act, 2001 (as amended 2022) — §14AA', date: '2022-12-19', url: 'https://www.indiacode.nic.in/handle/123456789/14657', tier: 1, status: 'STATUTORY_FOUNDATION' },
  { authority: 'Ministry of Power', title: 'Carbon Credit Trading Scheme, 2023 (S.O. 2825(E))', date: '2023-06-28', url: 'https://powermin.gov.in/', tier: 1, status: 'REGULATORY_SCHEME' },
  { authority: 'MoEFCC', title: 'GEI Notification — 7 Sectors (G.S.R. 25(E))', date: '2025-01-09', url: 'https://egazette.gov.in/WriteReadData/2026/269375.pdf', tier: 1, status: 'FACT' },
  { authority: 'MoEFCC', title: 'Iron & Steel Draft GEI (G.S.R. 517(E))', date: '2026-07-15', url: 'https://moef.gov.in/en/notifications/', tier: 1, status: 'DRAFT' },
  { authority: 'BEE', title: 'PAT Cycle Baseline Data — Sector Cohorts', date: '2023-04-01', url: 'https://beeindia.gov.in/en/schemes/pat-scheme', tier: 2, status: 'MODEL_INPUT' },
  { authority: 'CEA', title: 'CO₂ Baseline Database for the Indian Power Sector — v20.0', date: '2024-03-31', url: 'https://cea.nic.in/annual-growth-report/', tier: 2, status: 'FACT' },
  { authority: 'IPCC', title: '2006 IPCC Guidelines for National GHG Inventories (Volume 3: Industrial)', date: '2006-01-01', url: 'https://www.ipcc-nggip.iges.or.jp/public/2006gl/', tier: 2, status: 'METHODOLOGY' },
];

function StatusChip({ status }: { status: string }) {
  const c = status === 'FINAL'
    ? 'bg-[#E8F5EE] text-[#0B4A3D] border-[#0B4A3D]/30'
    : status === 'DRAFT'
    ? 'bg-[#FEF7E8] text-[#C98A1E] border-[#C98A1E]/30'
    : 'bg-slate-50 text-slate-500 border-slate-300';
  const Icon = status === 'FINAL' ? CheckCircle2 : status === 'DRAFT' ? AlertTriangle : Clock;
  return (
    <span className={`inline-flex items-center space-x-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${c}`}>
      <Icon className="w-2.5 h-2.5" />
      <span>{status}</span>
    </span>
  );
}

export default function TrustCenterPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <UtilityBar />
      <Header />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8" id="main-content">
        <Breadcrumb items={[{ label: "Trust Center" }]} />

        {/* Page header */}
        <div className="mb-8">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-[#1F4D2E]" />
            <h1 className="text-2xl font-bold text-[#10231C] tracking-tight">AANGARA Trust Center</h1>
          </div>
          <p className="text-sm text-[#4B5A54] mt-2 max-w-2xl">
            Technical evidence, data provenance, regulatory alignment, and model transparency for all numbers
            displayed across the CarbonAlpha platform. Every figure is labeled as FACT, CALCULATION, MODEL, ASSUMPTION, or SCENARIO.
          </p>
        </div>

        {/* Version Stamps */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Regulatory Version', value: 'REG-2026-08-REV3', color: 'text-[#0B4A3D]' },
            { label: 'Emission Factor Version', value: 'CEA-EF-V20.0', color: 'text-[#2E6BA8]' },
            { label: 'Model Version', value: 'CA-MVP-3.0 / AANGARA v4.0', color: 'text-purple-700' },
            { label: 'Last Data Verification', value: '2026-08-24', color: 'text-[#C98A1E]' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-[#F6F8F7] border border-[#E4E9E6] rounded-lg p-3">
              <div className="text-[10px] text-[#6B7A72] uppercase tracking-wider font-medium">{label}</div>
              <div className={`text-xs font-mono font-bold mt-1 ${color}`}>{value}</div>
            </div>
          ))}
        </div>

        <div className="space-y-6">

          {/* Data Label Legend */}
          <section className="bg-white border border-[#E4E9E6] rounded-xl p-6 shadow-resting">
            <div className="flex items-center gap-2 mb-4">
              <Info className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-bold text-[#10231C]">Data Label Definitions</h2>
            </div>
            <p className="text-sm text-[#4B5A54] mb-4">
              Every number displayed on CarbonAlpha carries one of 5 labels. Understanding them helps you know
              how much confidence to place in each figure.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {Object.entries(DATA_LABELS).map(([key, meta]) => (
                <div key={key} className={`p-3 rounded-lg border border-current/20 ${meta.bg}`}>
                  <div className={`text-[10px] font-mono font-bold tracking-widest ${meta.text}`}>{meta.label}</div>
                  <p className={`text-[11px] mt-1 leading-relaxed ${meta.text} opacity-80`}>{meta.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Regulatory Registry — All 9 Sectors */}
          <section className="bg-white border border-[#E4E9E6] rounded-xl p-6 shadow-resting">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-[#C98A1E]" />
              <h2 className="text-lg font-bold text-[#10231C]">Regulatory GEI Target Registry</h2>
              <StatusBadge type="FACT" />
            </div>
            <p className="text-sm text-[#4B5A54] mb-4">
              All 9 sectors in the CCTS scope — 7 with FINAL gazette targets, 1 in DRAFT consultation, and 1 on watchlist.
              Platform GEI targets are sourced directly from the gazette documents linked below.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {SECTORS_TRUST_DATA.map((sec) => (
                <div key={sec.sector_key} className="bg-[#F6F8F7] p-4 rounded-lg border border-[#E4E9E6]">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-sm font-bold text-[#10231C]">{sec.name}</h3>
                    <StatusChip status={sec.status} />
                  </div>
                  <p className="text-xs text-[#4B5A54] mb-2 leading-relaxed">{sec.note}</p>
                  <div className="text-[10px] font-mono text-[#6B7A72] mb-2">{sec.gazette}</div>
                  <a
                    href={sec.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-[11px] text-[#2E6BA8] hover:text-[#1A4F7D] font-medium transition-colors"
                  >
                    <span>View Source</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))}
            </div>
          </section>

          {/* Source Register */}
          <section className="bg-white border border-[#E4E9E6] rounded-xl p-6 shadow-resting">
            <div className="flex items-center gap-2 mb-4">
              <Database className="w-5 h-5 text-[#2E6BA8]" />
              <h2 className="text-lg font-bold text-[#10231C]">Regulatory Source Register</h2>
              <StatusBadge type="MODEL" />
            </div>
            <p className="text-sm text-[#4B5A54] mb-4">
              Full authority chain for every regulatory input, emission factor, and methodology used by the AANGARA engine.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#E4E9E6] text-left">
                    <th className="py-2 pr-4 text-[#6B7A72] font-medium uppercase tracking-wider">Tier</th>
                    <th className="py-2 pr-4 text-[#6B7A72] font-medium uppercase tracking-wider">Authority</th>
                    <th className="py-2 pr-4 text-[#6B7A72] font-medium uppercase tracking-wider">Document</th>
                    <th className="py-2 pr-4 text-[#6B7A72] font-medium uppercase tracking-wider">Date</th>
                    <th className="py-2 text-[#6B7A72] font-medium uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {SOURCE_DATA.map((src, i) => (
                    <tr key={i} className="border-b border-[#E4E9E6]/50 hover:bg-[#F6F8F7] transition-colors">
                      <td className="py-2 pr-4">
                        <span className={`font-mono font-bold ${src.tier === 1 ? 'text-[#0B4A3D]' : 'text-[#4B5A54]'}`}>
                          T{src.tier}
                        </span>
                      </td>
                      <td className="py-2 pr-4 font-medium text-[#10231C]">{src.authority}</td>
                      <td className="py-2 pr-4 text-[#4B5A54]">
                        <a
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-[#2E6BA8] transition-colors inline-flex items-center space-x-1"
                        >
                          <span>{src.title}</span>
                          <ExternalLink className="w-2.5 h-2.5 opacity-50" />
                        </a>
                      </td>
                      <td className="py-2 pr-4 font-mono text-[#6B7A72]">{src.date}</td>
                      <td className="py-2">
                        <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                          src.status === 'FACT' ? 'bg-[#E8F5EE] text-[#0B4A3D] border-[#0B4A3D]/30'
                          : src.status === 'DRAFT' ? 'bg-[#FEF7E8] text-[#C98A1E] border-[#C98A1E]/30'
                          : 'bg-[#EBF3FB] text-[#2E6BA8] border-[#2E6BA8]/30'
                        }`}>{src.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Data Provenance */}
          <section className="bg-white border border-[#E4E9E6] rounded-xl p-6 shadow-resting">
            <div className="flex items-center gap-2 mb-4">
              <Database className="w-5 h-5 text-[#2E6BA8]" />
              <h2 className="text-lg font-bold text-[#10231C]">Data Provenance</h2>
              <StatusBadge type="MODEL" />
            </div>
            <p className="text-sm text-[#4B5A54] mb-4">
              Platform benchmark distributions are calibrated against historical BEE PAT cycle baselines and ASI manufacturing census data.
            </p>
            <div className="bg-[#F6F8F7] p-4 rounded-lg border border-[#E4E9E6]">
              <ul className="list-disc list-inside text-sm text-[#4B5A54] space-y-2">
                <li><strong className="text-[#10231C]">252,000+ calibrated facility records</strong> represent nationwide industrial distribution curves.</li>
                <li>Data models accurately reflect the statistical distribution and operational realities of Indian industrial sectors.</li>
                <li>Zero exposure of actual corporate proprietary data — all facility records are synthetic calibrations to official distributions.</li>
                <li>Grid emission factor uses CEA v20.0 (0.716 tCO₂e/MWh) with planned update to v21.0 upon release.</li>
              </ul>
            </div>
          </section>

          {/* ML Model Cards */}
          <section className="bg-white border border-[#E4E9E6] rounded-xl p-6 shadow-resting">
            <div className="flex items-center gap-2 mb-4">
              <Cpu className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-bold text-[#10231C]">ML Model Cards: GEI Benchmark & Anomaly Engine</h2>
              <StatusBadge type="CALCULATION" />
            </div>
            <p className="text-sm text-[#4B5A54] mb-4">
              Transparency documentation for the predictive models powering AANGARA's Decision Intelligence.
            </p>
            <div className="bg-[#F6F8F7] p-4 rounded-lg border border-[#E4E9E6] space-y-4">
              <div>
                <h3 className="text-sm font-bold text-[#10231C]">GEI Benchmark Model</h3>
                <p className="text-xs text-[#4B5A54] mt-1">
                  Predicts GHG Emission Intensity trajectories based on historical BEE PAT operational configurations and regulatory constraints.
                  Sector-specific thermodynamic envelope validation via Robust Z-Score (MAD method per §36.2) and IQR screening (§36.3).
                </p>
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#10231C] flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-[#C98A1E]" />
                  <span>Known Limitations &amp; Biases</span>
                </h3>
                <ul className="list-disc list-inside text-xs text-[#4B5A54] mt-2 space-y-1">
                  <li>Anomaly detection is a data-quality signal — it is NOT a compliance determination or statutory audit.</li>
                  <li>Trained on empirical statistical distributions calibrated to historical BEE PAT cycles.</li>
                  <li>Assumes linear grid emission factor reduction (CEA v20.0 → v22.0 projections).</li>
                  <li>Does not account for sudden technological breakthroughs in specific sub-processes.</li>
                  <li>CCC price sensitivity curves are scenario-only — not market forecasts.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Master Disclaimer */}
          <section className="bg-[#FEF7E8] border border-[#C98A1E]/30 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-[#C98A1E] flex-shrink-0 mt-0.5" />
              <div>
                <h2 className="text-base font-bold text-[#10231C] mb-2">Platform Disclaimer</h2>
                <p className="text-sm text-[#4B5A54] leading-relaxed">
                  CarbonAlpha / AANGARA is a <strong>decision-intelligence platform</strong> — not a regulatory body, an Accredited Carbon Verification Agency (ACVA),
                  an Indian Carbon Market Exchange (ICEX), or a legal advisor. All outputs are analytical models
                  intended to support internal management decisions. They do not constitute statutory compliance
                  determinations, tradeable CCC certificates, or legal advice. Compliance obligations must be verified
                  with accredited verifiers and legal counsel. All model outputs are clearly labeled with their epistemic
                  status (FACT / CALCULATION / MODEL / ASSUMPTION / SCENARIO).
                </p>
              </div>
            </div>
          </section>

        </div>
        <ProvenanceFooter verifiedDate="2026-08-24" />
      </main>
    </div>
  );
}