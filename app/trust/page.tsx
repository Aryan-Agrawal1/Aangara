"use client";
import React from "react";
import { Header } from "@/components/navigation/Header";
import { UtilityBar } from "@/components/ui/UtilityBar";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ProvenanceFooter } from "@/components/ui/ProvenanceFooter";
import { ShieldCheck, Database, FileText, Cpu, AlertTriangle } from "lucide-react";

export default function TrustCenterPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <UtilityBar />
      <Header />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8" id="main-content">
        <Breadcrumb items={[{ label: "Trust Center" }]} />
        <div className="mb-8">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-[#0B4A3D]" />
            <h1 className="text-2xl font-bold text-[#10231C] tracking-tight">CarbonAlpha Trust Center</h1>
          </div>
          <p className="text-sm text-[#4B5A54] mt-2">Technical Evidence, Data Provenance, and Regulatory Alignment.</p>
        </div>

        <div className="space-y-6">
          <section className="bg-white border border-[#E4E9E6] rounded-xl p-6 shadow-resting">
            <div className="flex items-center gap-2 mb-4">
              <Database className="w-5 h-5 text-[#2E6BA8]" />
              <h2 className="text-lg font-bold text-[#10231C]">Data Provenance</h2>
              <StatusBadge type="MODEL" />
            </div>
            <p className="text-sm text-[#4B5A54] mb-4">
              All platform data displayed in the current demonstration environment is synthetically generated to protect proprietary industrial facility data.
            </p>
            <div className="bg-[#F6F8F7] p-4 rounded-lg border border-[#E4E9E6]">
              <ul className="list-disc list-inside text-sm text-[#4B5A54] space-y-2">
                <li><strong className="text-[#10231C]">252,000+ rows</strong> of operational facility data have been synthetically generated.</li>
                <li>Data models accurately reflect the statistical distribution and operational realities of Indian industrial sectors.</li>
                <li>Zero exposure of actual corporate proprietary data.</li>
              </ul>
            </div>
          </section>

          <section className="bg-white border border-[#E4E9E6] rounded-xl p-6 shadow-resting">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-[#C98A1E]" />
              <h2 className="text-lg font-bold text-[#10231C]">Regulatory Registry Status</h2>
              <StatusBadge type="FACT" />
            </div>
            <p className="text-sm text-[#4B5A54] mb-4">
              Alignment with the Ministry of Environment, Forest and Climate Change (MoEFCC) and Bureau of Energy Efficiency (BEE) gazette notifications.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#F6F8F7] p-4 rounded-lg border border-[#E4E9E6]">
                <h3 className="text-sm font-bold text-[#10231C] mb-1">Iron &amp; Steel</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FEF7E8] text-[#C98A1E] border border-[#C98A1E]/30">DRAFT (G.S.R. 517(E))</span>
                <p className="text-xs text-[#4B5A54] mt-2">Pending final target finalization under phase 2 consultations.</p>
              </div>
              <div className="bg-[#F6F8F7] p-4 rounded-lg border border-[#E4E9E6]">
                <h3 className="text-sm font-bold text-[#10231C] mb-1">Cement</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#E8F5EE] text-[#1F8A5F] border border-[#1F8A5F]/30">NOTIFIED</span>
                <p className="text-xs text-[#4B5A54] mt-2">Active statutory compliance targets in effect.</p>
              </div>
            </div>
          </section>

          <section className="bg-white border border-[#E4E9E6] rounded-xl p-6 shadow-resting">
            <div className="flex items-center gap-2 mb-4">
              <Cpu className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-bold text-[#10231C]">ML Model Cards: GEI Benchmark Model</h2>
              <StatusBadge type="CALCULATION" />
            </div>
            <p className="text-sm text-[#4B5A54] mb-4">
              Transparency documentation for the predictive models powering CarbonAlpha's Decision Intelligence.
            </p>
            <div className="bg-[#F6F8F7] p-4 rounded-lg border border-[#E4E9E6] space-y-4">
              <div>
                <h3 className="text-sm font-bold text-[#10231C]">Model Overview</h3>
                <p className="text-xs text-[#4B5A54] mt-1">
                  Predicts Greenhouse Gas Emission Intensity (GEI) trajectories based on historical operational configurations and regulatory constraints.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#10231C] flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-[#C98A1E]" />
                  <span>Known Limitations &amp; Biases</span>
                </h3>
                <ul className="list-disc list-inside text-xs text-[#4B5A54] mt-2 space-y-1">
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