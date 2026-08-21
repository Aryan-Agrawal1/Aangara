/**
 * CarbonAlpha — Global App State Store (Zustand)
 *
 * Single source of truth for sector/entity/year/scenario selections
 * so /decision, /scenarios, and /industrial-intelligence stay in sync
 * without redundant re-fetching.
 */
import { create } from 'zustand';
import { DecisionTwinData, Entity, ScenarioParams } from '@/lib/types';

interface AppState {
  // ── Selection State ──
  currentSector: string;
  currentEntityId: string;
  reportingYear: string;
  sectors: any[];
  entities: Entity[];

  // ── Decision / Scenario State ──
  decisionData: DecisionTwinData | null;
  scenarioParams: ScenarioParams;
  decisionLoading: boolean;
  decisionError: string | null;

  // ── Actions ──
  setSector: (sector: string) => void;
  setEntityId: (entityId: string) => void;
  setReportingYear: (year: string) => void;
  setSectors: (sectors: any[]) => void;
  setEntities: (entities: Entity[]) => void;
  setDecisionData: (data: DecisionTwinData | null) => void;
  setScenarioParams: (params: ScenarioParams) => void;
  updateDecisionStrategies: (simResult: any, params: ScenarioParams) => void;
  setDecisionLoading: (loading: boolean) => void;
  setDecisionError: (error: string | null) => void;
  resetScenarioParams: () => void;
}

const DEFAULT_SCENARIO_PARAMS: ScenarioParams = {
  ccc_price_inr: 1000.0,
  project_output_pct: 100.0,
  project_delay_months: 0,
  financing_rate_pct: 9.5,
};

export const useAppStore = create<AppState>((set) => ({
  // Defaults
  currentSector: 'cement',
  currentEntityId: 'SYN-CEM-001',
  reportingYear: '2025-26',
  sectors: [],
  entities: [],
  decisionData: null,
  scenarioParams: DEFAULT_SCENARIO_PARAMS,
  decisionLoading: false,
  decisionError: null,

  // Actions
  setSector: (sector) => set({ currentSector: sector }),
  setEntityId: (entityId) => set({ currentEntityId: entityId }),
  setReportingYear: (year) => set({ reportingYear: year }),
  setSectors: (sectors) => set({ sectors }),
  setEntities: (entities) => set({ entities }),
  setDecisionData: (data) => set({ decisionData: data }),
  setScenarioParams: (params) => set({ scenarioParams: params }),
  updateDecisionStrategies: (simResult, params) => set((state) => {
    if (!state.decisionData) return state;
    return {
      decisionData: {
        ...state.decisionData,
        strategies: simResult.strategies,
        recommended_strategy: simResult.winner_strategy,
        recommendation_reason: simResult.winner_summary,
        assumptions_applied: {
          ccc_price_inr: params.ccc_price_inr,
          project_output_delivery_pct: params.project_output_pct,
          project_delay_months: params.project_delay_months,
          financing_rate_pct: params.financing_rate_pct
        }
      }
    };
  }),
  setDecisionLoading: (loading) => set({ decisionLoading: loading }),
  setDecisionError: (error) => set({ decisionError: error }),
  resetScenarioParams: () => set({ scenarioParams: DEFAULT_SCENARIO_PARAMS }),
}));
