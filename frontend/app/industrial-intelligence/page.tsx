'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/navigation/Header';
import { FacilityInputForm, FacilityFormData } from '@/components/intelligence/FacilityInputForm';
import { PeerBenchmarkCard } from '@/components/intelligence/PeerBenchmarkCard';
import { DecarbonisationMatrix } from '@/components/intelligence/DecarbonisationMatrix';
import { DecisionTwinHero } from '@/components/cockpit/DecisionTwinHero';
import { SourceTraceDrawer } from '@/components/drawers/SourceTraceDrawer';
import { formatCurrencyCr, formatEmissions, formatGEI } from '@/lib/formatters';
import { Sparkles, ShieldCheck, AlertTriangle, CheckCircle2, TrendingUp, TrendingDown, Target, Building2 } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8008';

export default function IndustrialIntelligencePage() {
  const [formData, setFormData] = useState<FacilityFormData>({
    facility_name: 'Western Rajasthan Cement Works',
    sector: 'cement',
    sub_sector: 'Integrated Plant (OPC/PPC)',
    state: 'Rajasthan',
    annual_production: 1200000.0,
    production_unit: 'tonnes',
    electricity_mwh: 98000.0,
    renewable_electricity_pct: 12.5,
    thermal_fuel_type: 'petcoke',
    thermal_fuel_tonnes: 95000.0,
    clinker_factor_pct: 74.0,
    whrs_installed_mw: 0.0,
    custom_target_gei: undefined
  });

  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const runAnalysis = async (dataToAnalyze = formData) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/intelligence/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToAnalyze)
      });
      const json = await res.json();
      if (json.success) {
        setAnalysisResult(json.data);
      }
    } catch (e) {
      console.error('Failed to run facility analysis:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runAnalysis();
  }, []);

  const carbon = analysisResult?.carbon_profile;
  const isSurplus = carbon && carbon.gei_delta <= 0;

  return (
    <div className="min-h-screen bg-[#070B11] flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Banner */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-white tracking-tight">CarbonAlpha Industrial Intelligence(TM)</h1>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60 font-semibold">
                PERSONALIZED DECISION ENGINE
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Enter plant-specific production and fuel parameters to receive bespoke carbon accounting, ML peer benchmarks, decarbonisation plans, and capital allocation strategies.
            </p>
          </div>
        </div>

        {/* Top Input Form */}
        <FacilityInputForm
          formData={formData}
          onChange={(newForm: FacilityFormData) => {
            setFormData(newForm);
          }}
          onSubmit={() => runAnalysis(formData)}
          isLoading={isLoading}
          dataQuality={analysisResult?.data_quality}
        />

        {/* Personalized Analysis Results */}
        {analysisResult && carbon && (
          <div className="mt-8 space-y-6">
            {/* Carbon Position & Anomaly Banner */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Carbon Compliance Position */}
              <div className="lg:col-span-2 glass-panel rounded-xl p-5 border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-emerald-400">
                      <Target className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">Your Modelled Compliance Standing (2025-26)</h3>
                      <p className="text-xs text-slate-400">Calculated from physical Scope 1 + Scope 2 fuel & process inputs</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsDrawerOpen(true)}
                    className="text-xs text-sky-400 hover:text-sky-300 font-semibold cursor-pointer"
                  >
                    View Source Trace
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800">
                    <div className="text-[11px] text-slate-400 uppercase">Calculated GEI</div>
                    <div className="text-lg font-bold text-white font-mono mt-0.5">{formatGEI(carbon.actual_gei)}</div>
                    <div className="text-[10px] text-slate-500 mt-1">Total: {formatEmissions(carbon.total_ghg_tco2e)}</div>
                  </div>

                  <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800">
                    <div className="text-[11px] text-slate-400 uppercase">Notified Target</div>
                    <div className="text-lg font-bold text-sky-400 font-mono mt-0.5">{formatGEI(carbon.target_gei)}</div>
                    <div className="text-[10px] text-slate-500 mt-1">MoEFCC Gazette Trajectory</div>
                  </div>

                  <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800">
                    <div className="text-[11px] text-slate-400 uppercase">Intensity Delta</div>
                    <div className={`text-lg font-bold font-mono mt-0.5 flex items-center space-x-1 ${
                      isSurplus ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {isSurplus ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
                      <span>{carbon.gei_delta > 0 ? `+${carbon.gei_delta.toFixed(4)}` : carbon.gei_delta.toFixed(4)}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">{isSurplus ? 'Below Target' : 'Above Target'}</div>
                  </div>

                  <div className={`p-3 rounded-lg border ${
                    isSurplus ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-400' : 'bg-rose-950/30 border-rose-800/40 text-rose-400'
                  }`}>
                    <div className="text-[11px] uppercase font-semibold">{isSurplus ? 'Surplus Scope' : 'Shortfall Obligation'}</div>
                    <div className="text-lg font-bold font-mono mt-0.5">
                      {isSurplus ? formatEmissions(carbon.potential_surplus_tco2e) : formatEmissions(carbon.potential_shortfall_tco2e)}
                    </div>
                    <div className="text-[10px] opacity-80 mt-1">{isSurplus ? 'Potential CCC Issuance' : 'Mandatory Surrender'}</div>
                  </div>
                </div>
              </div>

              {/* Anomaly & Data Quality */}
              <div className="glass-panel rounded-xl p-5 border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-semibold text-white">Operational Anomaly Engine</h3>
                  </div>

                  <div className={`p-3 rounded-lg border text-xs mb-3 ${
                    analysisResult.anomaly_intelligence?.status === 'NORMAL'
                      ? 'bg-slate-900/80 border-slate-800 text-slate-300'
                      : 'bg-amber-950/40 border-amber-800/60 text-amber-300'
                  }`}>
                    <div className="font-semibold text-white mb-1">
                      Status: {analysisResult.anomaly_intelligence?.status}
                    </div>
                    <p>{analysisResult.anomaly_intelligence?.interpretation}</p>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-800">
                  Data Quality Audit Score: <strong className="text-emerald-400">{analysisResult.data_quality?.quality_score}/100</strong>
                </div>
              </div>
            </div>

            {/* ML Peer Benchmark */}
            <PeerBenchmarkCard
              benchmark={analysisResult.peer_benchmark}
              actualGei={carbon.actual_gei}
              targetGei={carbon.target_gei}
            />

            {/* Decarbonisation Opportunities Matrix */}
            <DecarbonisationMatrix opportunities={analysisResult.opportunities} />

            {/* Capital Allocation: BUY vs BUILD vs HYBRID */}
            {analysisResult.strategy_recommendation && (
              <DecisionTwinHero
                strategies={analysisResult.strategy_recommendation.strategies}
                recommendedStrategy={analysisResult.strategy_recommendation.recommended_strategy}
                project={analysisResult.opportunities?.[0] || {}}
                onOpenCalculationTrace={() => setIsDrawerOpen(true)}
              />
            )}

            {/* Executive Explanation */}
            {analysisResult.executive_explanation && (
              <div className="glass-panel rounded-xl p-5 border-slate-800">
                <div className="flex items-center space-x-2 mb-2 text-teal-400 font-bold text-sm">
                  <Sparkles className="w-4 h-4" />
                  <span>Executive AI Strategic Action Brief</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                  {analysisResult.executive_explanation.narrative}
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Source Trace Drawer */}
      <SourceTraceDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        position={{
          entity_id: formData.facility_name,
          reporting_year: '2025-26',
          output: formData.annual_production,
          output_unit: formData.production_unit,
          total_ghg_tco2e: carbon?.total_ghg_tco2e || 0,
          actual_gei: carbon?.actual_gei || 0,
          target_gei: carbon?.target_gei || 0,
          gei_delta: carbon?.gei_delta || 0,
          status: isSurplus ? 'POTENTIAL_SURPLUS' : 'POTENTIAL_SHORTFALL',
          potential_surplus_tco2e: carbon?.potential_surplus_tco2e || 0,
          potential_shortfall_tco2e: carbon?.potential_shortfall_tco2e || 0,
          calculation_trace: carbon?.calculation_trace || [],
          data_status: 'USER_SUBMITTED_CALCULATION'
        }}
        sectorName={formData.sector}
      />
    </div>
  );
}
