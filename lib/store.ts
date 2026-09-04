/**
 * CarbonAlpha — Global App State Store (Zustand)
 *
 * Single source of truth for sector/entity/year/scenario selections
 * so /decision, /scenarios, and /industrial-intelligence stay in sync
 * without redundant re-fetching.
 */
import { create } from 'zustand';
import { DecisionTwinData, Entity, ScenarioParams } from '@/lib/types';

export type ManagementObjectiveType =
  | 'BALANCED'
  | 'LOWEST_CASH_COST'
  | 'MINIMUM_CAPEX'
  | 'MAXIMUM_NPV'
  | 'MAXIMUM_IRR'
  | 'MINIMUM_EXECUTION_RISK'
  | 'MAXIMUM_CO2_REDUCTION'
  | 'FASTEST_COMPLIANCE';

export const MANAGEMENT_OBJECTIVE_LABELS: Record<ManagementObjectiveType, { label: string; description: string; icon: string }> = {
  BALANCED:              { label: 'Balanced',          description: 'Equal weight across cost, climate, compliance, and timing', icon: '⚖️' },
  LOWEST_CASH_COST:      { label: 'Lowest Cash Cost',   description: 'Minimise total cash outflow — ideal for capital-constrained facilities', icon: '💸' },
  MINIMUM_CAPEX:         { label: 'Minimum CapEx',      description: 'Minimise upfront capital — prioritises BUY and lighter BUILD projects', icon: '📉' },
  MAXIMUM_NPV:           { label: 'Maximum NPV',        description: 'Optimise long-term net present value over 10 years', icon: '📈' },
  MAXIMUM_IRR:           { label: 'Maximum IRR',        description: 'Maximise internal rate of return on invested capital', icon: '🎯' },
  MINIMUM_EXECUTION_RISK:{ label: 'Minimum Risk',       description: 'Prioritise lowest execution, technology, and regulatory risk', icon: '🛡️' },
  MAXIMUM_CO2_REDUCTION: { label: 'Max CO₂ Reduction',  description: 'Maximise total tCO₂e abated — ESG / climate-first priority', icon: '🌿' },
  FASTEST_COMPLIANCE:    { label: 'Fastest Compliance', description: 'Achieve GEI target by earliest possible date — regulatory urgency', icon: '⚡' },
};

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
  managementObjective: ManagementObjectiveType;
  decisionLoading: boolean;
  decisionError: string | null;

  // ── Facility Intelligence Analysis Bridge ──
  // Stores the last analysis result from /industrial-intelligence so /decision can pick it up
  facilityAnalysisResult: any | null;

  // ── Actions ──
  setSector: (sector: string) => void;
  setEntityId: (entityId: string) => void;
  setReportingYear: (year: string) => void;
  setSectors: (sectors: any[]) => void;
  setEntities: (entities: Entity[]) => void;
  setDecisionData: (data: DecisionTwinData | null) => void;
  setScenarioParams: (params: ScenarioParams) => void;
  setManagementObjective: (objective: ManagementObjectiveType) => void;
  setFacilityAnalysisResult: (result: any | null) => void;
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
  managementObjective: 'BALANCED',
  decisionLoading: false,
  decisionError: null,
  facilityAnalysisResult: null,

  // Actions
  setSector: (sector) => set({ currentSector: sector }),
  setEntityId: (entityId) => set({ currentEntityId: entityId }),
  setReportingYear: (year) => set({ reportingYear: year }),
  setSectors: (sectors) => set({ sectors }),
  setEntities: (entities) => set({ entities }),
  setDecisionData: (data) => set({ decisionData: data }),
  setScenarioParams: (params) => set({ scenarioParams: params }),
  setManagementObjective: (objective) => set({ managementObjective: objective }),
  setFacilityAnalysisResult: (result) => set({ facilityAnalysisResult: result }),

  updateDecisionStrategies: (simResult, params) => set((state) => {
    if (!state.decisionData) return state;
    return {
      decisionData: {
        ...state.decisionData,
        strategies: simResult.strategies,
        recommended_strategy: simResult.winner_strategy ?? simResult.recommended_strategy,
        recommendation_reason: simResult.winner_summary ?? simResult.recommendation_reason,
        assumptions_applied: {
          ccc_price_inr: params.ccc_price_inr,
          project_output_delivery_pct: params.project_output_pct,
          project_delay_months: params.project_delay_months,
          financing_rate_pct: params.financing_rate_pct,
        }
      }
    };
  }),

  setDecisionLoading: (loading) => set({ decisionLoading: loading }),
  setDecisionError: (error) => set({ decisionError: error }),
  resetScenarioParams: () => set({ scenarioParams: DEFAULT_SCENARIO_PARAMS }),
}));
