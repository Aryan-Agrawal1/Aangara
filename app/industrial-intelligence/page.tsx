'use client';

import { UtilityBar } from "@/components/ui/UtilityBar";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import React, { useState, useEffect } from 'react';
import { Header } from '@/components/navigation/Header';
import { FacilityInputForm, FacilityFormData } from '@/components/intelligence/FacilityInputForm';
import { PeerBenchmarkCard } from '@/components/intelligence/PeerBenchmarkCard';
import { DecarbonisationMatrix } from '@/components/intelligence/DecarbonisationMatrix';
import { DecisionTwinHero } from '@/components/cockpit/DecisionTwinHero';
import { SourceTraceDrawer } from '@/components/drawers/SourceTraceDrawer';
import { StrategyTraceDrawer } from '@/components/drawers/StrategyTraceDrawer';
import { formatCurrencyCr, formatEmissions, formatGEI } from '@/lib/formatters';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ProvenanceFooter } from '@/components/ui/ProvenanceFooter';
import { ErrorState } from '@/components/ui/ErrorState';
import { Sparkles, ShieldCheck, AlertTriangle, CheckCircle2, TrendingUp, TrendingDown, Target, Building2 } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

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
  const [isSourceDrawerOpen, setIsSourceDrawerOpen] = useState(false);
  const [isStrategyDrawerOpen, setIsStrategyDrawerOpen] = useState(false);
  const [activeStrategyName, setActiveStrategyName] = useState('BUY');
  const [apiError, setApiError] = useState<string | null>(null);

  const runAnalysis = async (dataToAnalyze = formData) => {
    setIsLoading(true);
    setApiError(null);
    try {
      const res = await fetch(`${API_BASE}/api/intelligence/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToAnalyze)
      });
      if (!res.ok) {
         throw new Error(`HTTP error! status: ${res.status}`);
      }
      const json = await res.json();
      if (json.success) {
        setAnalysisResult(json.data);
      } else {
        throw new Error(json.message || 'Failed to process intelligence request.');
      }
    } catch (e) {
      console.error('Failed to run facility analysis:', e);
      setApiError('Unable to connect to CarbonAlpha Intelligence Core. Please ensure the backend services are running.');
      setAnalysisResult(null);
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
    <div className="min-h-screen bg-white flex flex-col">
      <UtilityBar />
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={[{ label: "Facility Analysis" }]} />
        {/* Page Banner */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-[#10231C] tracking-tight">CarbonAlpha Industrial Intelligence(TM)</h1>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-[#1F8A5F] border border-emerald-800/60 font-semibold">
                PERSONALIZED DECISION ENGINE
              </span>
            </div>
            <p className="text-xs text-[#4B5A54] mt-1">
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
        {apiError && (
          <div className="mt-8"><ErrorState type="backend" message={apiError} onRetry={() => runAnalysis()} /></div>
        )}

        {analysisResult && carbon && !apiError && (
          <div className="mt-8 space-y-6">
            {/* Carbon Position & Anomaly Banner */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Carbon Compliance Position */}
              <div className="lg:col-span-2 glass-panel rounded-xl p-5 border-[#E4E9E6]">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 rounded-lg bg-white border border-[#E4E9E6] border border-[#E4E9E6] text-[#1F8A5F]">
                      <Target className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-[#10231C]">Your Modelled Compliance Standing (2025-26)</h3>
                      <p className="text-xs text-[#4B5A54]">Calculated from physical Scope 1 + Scope 2 fuel & process inputs</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsSourceDrawerOpen(true)}
                    className="text-xs text-sky-400 hover:text-sky-300 font-semibold cursor-pointer"
                  >
                    View Source Trace
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-[#F6F8F7]/90 p-3 rounded-lg border border-[#E4E9E6]">
                    <div className="text-[11px] text-[#4B5A54] uppercase">Calculated GEI</div>
                    <div className="text-lg font-bold text-[#10231C] font-mono mt-0.5">{formatGEI(carbon.actual_gei)} <StatusBadge type="CALCULATION" /></div>
                    <div className="text-[10px] text-[#6B7A72] mt-1">Total: {formatEmissions(carbon.total_ghg_tco2e)}</div>
                  </div>

                  <div className="bg-[#F6F8F7]/90 p-3 rounded-lg border border-[#E4E9E6]">
                    <div className="text-[11px] text-[#4B5A54] uppercase">Notified Target</div>
                    <div className="text-lg font-bold text-sky-400 font-mono mt-0.5">{formatGEI(carbon.target_gei)} <StatusBadge type="FACT" /></div>
                    <div className="text-[10px] text-[#6B7A72] mt-1">MoEFCC Gazette Trajectory</div>
                  </div>

                  <div className="bg-[#F6F8F7]/90 p-3 rounded-lg border border-[#E4E9E6]">
                    <div className="text-[11px] text-[#4B5A54] uppercase">Intensity Delta</div>
                    <div className={`text-lg font-bold font-mono mt-0.5 flex items-center space-x-1 ${
                      isSurplus ? 'text-[#1F8A5F]' : 'text-rose-400'
                    }`}>
                      {isSurplus ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
                      <span>{carbon.gei_delta > 0 ? `+${carbon.gei_delta.toFixed(4)}` : carbon.gei_delta.toFixed(4)}</span>
                    </div>
                    <div className="text-[10px] text-[#6B7A72] mt-1">{isSurplus ? 'Below Target' : 'Above Target'}</div>
                  </div>

                  <div className={`p-3 rounded-lg border ${
                    isSurplus ? 'bg-emerald-950/30 border-emerald-800/40 text-[#1F8A5F]' : 'bg-rose-950/30 border-rose-800/40 text-rose-400'
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
              <div className="glass-panel rounded-xl p-5 border-[#E4E9E6] flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <ShieldCheck className="w-4 h-4 text-[#1F8A5F]" />
                    <h3 className="text-sm font-semibold text-[#10231C]">Operational Anomaly Engine</h3>
                  </div>

                  <div className={`p-3 rounded-lg border text-xs mb-3 ${
                    analysisResult.anomaly_intelligence?.status === 'NORMAL'
                      ? 'bg-[#F6F8F7] border-[#E4E9E6] text-[#4B5A54]'
                      : 'bg-amber-950/40 border-amber-800/60 text-amber-300'
                  }`}>
                    <div className="font-semibold text-[#10231C] mb-1">
                      Status: {analysisResult.anomaly_intelligence?.status}
                    </div>
                    <p>{analysisResult.anomaly_intelligence?.interpretation}</p>
                  </div>
                </div>

                <div className="text-[11px] text-[#6B7A72] pt-2 border-t border-[#E4E9E6]">
                  Data Quality Audit Score: <strong className="text-[#1F8A5F]">{analysisResult.data_quality?.quality_score}/100</strong>
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
                onOpenCalculationTrace={(stratKey) => {
                  setActiveStrategyName(stratKey);
                  setIsStrategyDrawerOpen(true);
                }}
              />
            )}

            {/* Executive Explanation */}
            {analysisResult.executive_explanation && (
              <div className="glass-panel rounded-xl p-5 border-[#E4E9E6]">
                <div className="flex items-center space-x-2 mb-2 text-teal-400 font-bold text-sm">
                  <Sparkles className="w-4 h-4" />
                  <span>Executive AI Strategic Action Brief</span>
                </div>
                <p className="text-xs text-[#4B5A54] leading-relaxed whitespace-pre-line">
                  {analysisResult.executive_explanation.narrative}
                </p>
              </div>
            )}
          </div>
        )}
        <ProvenanceFooter />
      </main>

      {/* Source Trace Drawer */}
      <SourceTraceDrawer
        isOpen={isSourceDrawerOpen}
        onClose={() => setIsSourceDrawerOpen(false)}
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
      <StrategyTraceDrawer
        isOpen={isStrategyDrawerOpen}
        onClose={() => setIsStrategyDrawerOpen(false)}
        strategyName={activeStrategyName}
        strategy={analysisResult?.strategy_recommendation?.strategies?.[activeStrategyName]}
        project={analysisResult?.opportunities?.[0]}
        assumptions={{ ccc_price_inr: 1000, financing_rate_pct: 9.5, project_output_delivery_pct: 100, project_delay_months: 0 }}
      />
    </div>
  );
}
