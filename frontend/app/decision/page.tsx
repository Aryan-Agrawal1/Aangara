'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/navigation/Header';
import { CarbonPositionCard } from '@/components/cockpit/CarbonPositionCard';
import { MRVReadinessCard } from '@/components/cockpit/MRVReadinessCard';
import { DecisionTwinHero } from '@/components/cockpit/DecisionTwinHero';
import { ScenarioSliders } from '@/components/cockpit/ScenarioSliders';
import { ExplainabilityCard } from '@/components/cockpit/ExplainabilityCard';
import { SourceTraceDrawer } from '@/components/drawers/SourceTraceDrawer';
import { getSectors, getEntities, getDecisionTwin, runScenarioSimulation } from '@/lib/api';
import { DecisionTwinData, Entity, ScenarioParams } from '@/lib/types';
import { Sparkles, Loader2, RefreshCw } from 'lucide-react';

export default function DecisionCockpitPage() {
  const [sectors, setSectors] = useState<any[]>([]);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [currentSector, setCurrentSector] = useState('cement');
  const [currentEntityId, setCurrentEntityId] = useState('SYN-CEM-001');
  const [reportingYear, setReportingYear] = useState('2025-26');
  
  const [decisionData, setDecisionData] = useState<DecisionTwinData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Scenario parameters
  const [scenarioParams, setScenarioParams] = useState<ScenarioParams>({
    ccc_price_inr: 1000.0,
    project_output_pct: 100.0,
    project_delay_months: 0,
    financing_rate_pct: 9.5
  });

  // Load initial sectors & entities
  useEffect(() => {
    async function init() {
      try {
        const [secs, ents] = await Promise.all([getSectors(), getEntities(currentSector)]);
        setSectors(secs);
        setEntities(ents);
        if (ents.length > 0) {
          const firstEnt = ents[0].entity_id;
          setCurrentEntityId(firstEnt);
        }
      } catch (e) {
        console.error('Failed to load initial data:', e);
      }
    }
    init();
  }, []);

  // When sector changes, load sector entities
  const handleSectorChange = async (newSector: string) => {
    setCurrentSector(newSector);
    try {
      const ents = await getEntities(newSector);
      setEntities(ents);
      if (ents.length > 0) {
        setCurrentEntityId(ents[0].entity_id);
      }
    } catch (e) {
      console.error('Failed to change sector:', e);
    }
  };

  // Fetch Decision Twin Data whenever entity or year changes
  useEffect(() => {
    async function loadDecisionData() {
      if (!currentEntityId) return;
      setLoading(true);
      try {
        const data = await getDecisionTwin(currentEntityId, reportingYear);
        setDecisionData(data);
      } catch (e) {
        console.error('Failed to fetch decision data:', e);
      } finally {
        setLoading(false);
      }
    }
    loadDecisionData();
  }, [currentEntityId, reportingYear]);

  // Handle Scenario Slider Changes
  const handleScenarioChange = async (newParams: ScenarioParams) => {
    setScenarioParams(newParams);
    if (!currentEntityId || !decisionData) return;

    try {
      const simResult = await runScenarioSimulation(currentEntityId, reportingYear, newParams);
      setDecisionData((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          strategies: simResult.strategies,
          recommended_strategy: simResult.winner_strategy,
          recommendation_reason: simResult.winner_summary,
          assumptions_applied: {
            ccc_price_inr: newParams.ccc_price_inr,
            project_output_delivery_pct: newParams.project_output_pct,
            project_delay_months: newParams.project_delay_months,
            financing_rate_pct: newParams.financing_rate_pct
          }
        };
      });
    } catch (e) {
      console.error('Scenario simulation failed:', e);
    }
  };

  const handleResetScenario = () => {
    const defaultParams: ScenarioParams = {
      ccc_price_inr: 1000.0,
      project_output_pct: 100.0,
      project_delay_months: 0,
      financing_rate_pct: 9.5
    };
    handleScenarioChange(defaultParams);
  };

  return (
    <div className="min-h-screen bg-[#070B11] flex flex-col">
      <Header
        currentSector={currentSector}
        currentEntityId={currentEntityId}
        reportingYear={reportingYear}
        onSectorChange={handleSectorChange}
        onEntityChange={setCurrentEntityId}
        onYearChange={setReportingYear}
        sectorsList={sectors}
        entitiesList={entities}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading || !decisionData ? (
          <div className="h-[60vh] flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
            <span className="text-sm font-mono text-slate-400">Loading CarbonAlpha Decision Engine...</span>
          </div>
        ) : (
          <div>
            {/* Top Grid: Carbon Position & MRV Readiness */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2">
                <CarbonPositionCard
                  position={decisionData.baseline_position}
                  onOpenSourceTrace={() => setIsDrawerOpen(true)}
                />
              </div>
              <div>
                <MRVReadinessCard mrv={decisionData.mrv_readiness} />
              </div>
            </div>

            {/* Central Decision Twin Hero */}
            <DecisionTwinHero
              strategies={decisionData.strategies}
              recommendedStrategy={decisionData.recommended_strategy}
              project={decisionData.project_profile}
              onOpenCalculationTrace={() => setIsDrawerOpen(true)}
            />

            {/* Interactive Scenario Sensitivity Sliders */}
            <ScenarioSliders
              params={scenarioParams}
              onChange={handleScenarioChange}
              onReset={handleResetScenario}
            />

            {/* Explainability & AI Executive Narrative Card */}
            <ExplainabilityCard
              decisionData={decisionData}
              onOpenSourceTrace={() => setIsDrawerOpen(true)}
            />
          </div>
        )}
      </main>

      {/* Slide-in Source Trace Drawer */}
      <SourceTraceDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        position={decisionData?.baseline_position}
        sectorName={decisionData?.sector}
      />
    </div>
  );
}
