'use client';

import { UtilityBar } from "@/components/ui/UtilityBar";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import React, { useEffect } from 'react';
import { Header } from '@/components/navigation/Header';
import { CarbonPositionCard } from '@/components/cockpit/CarbonPositionCard';
import { MRVReadinessCard } from '@/components/cockpit/MRVReadinessCard';
import { DecisionTwinHero } from '@/components/cockpit/DecisionTwinHero';
import { ScenarioSliders } from '@/components/cockpit/ScenarioSliders';
import { ExplainabilityCard } from '@/components/cockpit/ExplainabilityCard';
import dynamic from 'next/dynamic';
import { getSectors, getEntities, getDecisionTwin, runScenarioSimulation } from '@/lib/api';

const SourceTraceDrawer = dynamic(() => import('@/components/drawers/SourceTraceDrawer').then(mod => mod.SourceTraceDrawer), { ssr: false });
const StrategyTraceDrawer = dynamic(() => import('@/components/drawers/StrategyTraceDrawer').then(mod => mod.StrategyTraceDrawer), { ssr: false });
import { ScenarioParams } from '@/lib/types';
import { useAppStore, ManagementObjectiveType } from '@/lib/store';
import { Loader2, AlertTriangle, RefreshCw } from 'lucide-react';
import { ProvenanceFooter } from '@/components/ui/ProvenanceFooter';
import { exportACVAVerificationDossier, exportBoardroomReport } from '@/lib/exportPdf';

export default function DecisionCockpitPage() {
  const {
    currentSector, currentEntityId, reportingYear,
    sectors, entities, decisionData, scenarioParams,
    managementObjective, decisionLoading, decisionError,
    setSector, setEntityId, setReportingYear,
    setSectors, setEntities, setDecisionData, setScenarioParams,
    setManagementObjective, setDecisionLoading, setDecisionError, resetScenarioParams
  } = useAppStore();

  const [isSourceDrawerOpen, setIsSourceDrawerOpen] = React.useState(false);
  const [isStrategyDrawerOpen, setIsStrategyDrawerOpen] = React.useState(false);
  const [activeStrategyName, setActiveStrategyName] = React.useState('BUY');

  // Load initial sectors & entities (once, unless sector changes)
  useEffect(() => {
    async function init() {
      try {
        const [secs, ents] = await Promise.all([getSectors(), getEntities(currentSector)]);
        setSectors(secs);
        setEntities(ents);
        if (ents.length > 0 && !currentEntityId) {
          setEntityId(ents[0].entity_id);
        }
      } catch (e) {
        console.error('Failed to load initial data:', e);
      }
    }
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle sector change
  const handleSectorChange = async (newSector: string) => {
    setSector(newSector);
    try {
      const ents = await getEntities(newSector);
      setEntities(ents);
      if (ents.length > 0) setEntityId(ents[0].entity_id);
    } catch (e) {
      console.error('Failed to load entities for sector:', e);
    }
  };

  // Load decision data when entity or year changes — passes live scenario params on initial load
  useEffect(() => {
    if (!currentEntityId) return;

    if (
      decisionData &&
      decisionData.entity_id === currentEntityId &&
      decisionData.reporting_year === reportingYear
    ) {
      return;
    }

    setDecisionLoading(true);
    setDecisionError(null);
    // Pass live scenarioParams (including CCC price) so first render matches slider state
    getDecisionTwin(currentEntityId, reportingYear, {
      ...scenarioParams,
      management_objective: managementObjective,
    })
      .then((data) => setDecisionData(data))
      .catch((e) => {
        console.error('Decision fetch failed:', e);
        setDecisionError('Backend API unavailable. Please try again in a moment.');
        setDecisionData(null);
      })
      .finally(() => setDecisionLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentEntityId, reportingYear]);

  // Scenario slider changes — live recalculate
  const handleScenarioChange = async (newParams: ScenarioParams) => {
    setScenarioParams(newParams);
    if (!currentEntityId || !decisionData) return;
    try {
      const simResult = await runScenarioSimulation(currentEntityId, reportingYear, {
        ...newParams,
        management_objective: managementObjective,
      });
      setDecisionData({
        ...decisionData,
        strategies: simResult.strategies,
        recommended_strategy: simResult.winner_strategy ?? simResult.recommended_strategy,
        recommendation_reason: simResult.winner_summary ?? simResult.recommendation_reason,
        assumptions_applied: {
          ccc_price_inr: newParams.ccc_price_inr,
          project_output_delivery_pct: newParams.project_output_pct,
          project_delay_months: newParams.project_delay_months,
          financing_rate_pct: newParams.financing_rate_pct,
        }
      });
    } catch (e) {
      console.error('Scenario simulation failed:', e);
    }
  };

  // Management objective change — triggers full re-simulation
  const handleObjectiveChange = async (objective: ManagementObjectiveType) => {
    setManagementObjective(objective);
    if (!currentEntityId || !decisionData) return;
    try {
      const simResult = await runScenarioSimulation(currentEntityId, reportingYear, {
        ...scenarioParams,
        management_objective: objective,
      });
      setDecisionData({
        ...decisionData,
        strategies: simResult.strategies,
        recommended_strategy: simResult.winner_strategy ?? simResult.recommended_strategy,
        recommendation_reason: simResult.winner_summary ?? simResult.recommendation_reason,
        assumptions_applied: decisionData.assumptions_applied,
      });
    } catch (e) {
      console.error('Objective change simulation failed:', e);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col tnum">
      <UtilityBar />
      <Header
        currentSector={currentSector}
        currentEntityId={currentEntityId}
        reportingYear={reportingYear}
        onSectorChange={handleSectorChange}
        onEntityChange={setEntityId}
        onYearChange={setReportingYear}
        sectorsList={sectors}
        entitiesList={entities}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Breadcrumb items={[{ label: "Decision Twin" }]} />
        {decisionLoading ? (
          /* Loading skeleton */
          <div className="h-[60vh] flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 text-[#0B4A3D] animate-spin" />
            <span className="text-sm font-mono text-[#4B5A54]">Loading AANGARA Decision Engine...</span>
          </div>
        ) : decisionError ? (
          /* Graceful error state — backend down */
          <div className="h-[60vh] flex flex-col items-center justify-center space-y-4 text-center">
            <div className="p-4 rounded-full bg-[#FDECEA] border border-[#C33B2E]/20">
              <AlertTriangle className="w-8 h-8 text-[#C33B2E]" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#10231C] mb-1">Decision Twin Unavailable</h3>
              <p className="text-sm text-[#4B5A54] max-w-md">{decisionError}</p>
            </div>
            <button
              onClick={() => {
                setDecisionError(null);
                setDecisionLoading(true);
                getDecisionTwin(currentEntityId, reportingYear)
                  .then(setDecisionData)
                  .catch((e) => setDecisionError(String(e)))
                  .finally(() => setDecisionLoading(false));
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-[#F6F8F7] border border-[#E4E9E6] hover:bg-[#E4E9E6] rounded-lg text-sm text-[#10231C] transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry</span>
            </button>
          </div>
        ) : !decisionData ? (
          /* Waiting for entity selection — not blank */
          <div className="h-[40vh] flex flex-col items-center justify-center space-y-3 text-center">
            <div className="w-8 h-8 border-2 border-[#0B4A3D] border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-[#4B5A54] font-mono">Loading Decision Twin analysis...</span>
          </div>
        ) : (
          <div>
            {/* Top Grid: Carbon Position & MRV Readiness */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2">
                <CarbonPositionCard
                  position={decisionData.baseline_position}
                  onOpenSourceTrace={() => setIsSourceDrawerOpen(true)}
                />
              </div>
              <div>
                <MRVReadinessCard mrv={decisionData.mrv_readiness} />
              </div>
            </div>

            {/* Decision Twin with recharts */}
            <DecisionTwinHero
              strategies={decisionData.strategies}
              recommendedStrategy={decisionData.recommended_strategy}
              project={decisionData.project_profile}
              onOpenCalculationTrace={(stratKey) => {
                setActiveStrategyName(stratKey);
                setIsStrategyDrawerOpen(true);
              }}
            />

            {/* Scenario Sliders + Management Objective */}
            <ScenarioSliders
              params={scenarioParams}
              managementObjective={managementObjective}
              onChange={handleScenarioChange}
              onObjectiveChange={handleObjectiveChange}
              onReset={resetScenarioParams}
            />

            {/* Explainability */}
            <ExplainabilityCard
              decisionData={decisionData}
              onOpenSourceTrace={() => setIsSourceDrawerOpen(true)}
            />

            {/* Bottom CTA for Dead End Test */}

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between bg-[#E8F2EB] border border-[#1F4D2E]/20 rounded-xl p-6 shadow-sm">
              <div className="text-center sm:text-left mb-4 sm:mb-0">
                <h3 className="text-lg font-bold text-[#1A1C18] mb-1">Ready to Finalize Strategy?</h3>
                <p className="text-sm text-[#4A5446]">Export the boardroom-ready report or generate the ACVA statutory compliance audit dossier.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <button 
                  type="button"
                  onClick={() => exportACVAVerificationDossier(decisionData, reportingYear)}
                  aria-label="Export for ACVA Verification"
                  className="px-5 py-2.5 rounded-lg text-sm font-bold bg-[#D9531E] hover:bg-[#C24514] text-white transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-[#D9531E] cursor-pointer"
                >
                  Export for ACVA Verification
                </button>
                <button 
                  type="button"
                  onClick={() => exportBoardroomReport(decisionData, scenarioParams, reportingYear)}
                  aria-label="Export board report"
                  className="px-5 py-2.5 rounded-lg text-sm font-bold bg-[#1F4D2E] hover:bg-[#27643A] text-white transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1F4D2E] cursor-pointer"
                >
                  Export Board Report
                </button>
              </div>
            </div>

            <div className="mt-4 p-4 bg-[#F6F8F7] rounded-xl border border-[#E8E2DC]">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'WHAT', text: 'Comparative cost and abatement across three capital strategies' },
                  { label: 'WHY', text: 'Statutory compliance under CCTS requires meeting GEI targets — this model finds the least-cost path' },
                  { label: 'SO WHAT', text: decisionData ? `${decisionData.recommended_strategy || 'HYBRID'} Strategy minimises 10-year lifecycle cost for this facility` : 'Run analysis to see recommendation' },
                  { label: 'WHAT NEXT', text: 'Adjust stress scenarios to test robustness of this recommendation' }
                ].map(({ label, text }) => (
                  <div key={label}>
                    <div className="text-[9px] font-mono font-bold text-[#6B7268] mb-1">{label}</div>
                    <div className="text-xs text-[#4A5446]">{text}</div>
                  </div>
                ))}
              </div>
            </div>

            <ProvenanceFooter verifiedDate="2026-08-24" />

          </div>
        )}
      </main>

      <SourceTraceDrawer
        isOpen={isSourceDrawerOpen}
        onClose={() => setIsSourceDrawerOpen(false)}
        position={decisionData?.baseline_position}
        sectorName={decisionData?.sector}
      />
      <StrategyTraceDrawer
        isOpen={isStrategyDrawerOpen}
        onClose={() => setIsStrategyDrawerOpen(false)}
        strategyName={activeStrategyName}
        strategy={decisionData?.strategies?.[activeStrategyName]}
        project={decisionData?.project_profile}
        position={decisionData?.baseline_position}
        assumptions={decisionData?.assumptions_applied}
      />
    </div>
  );
}
