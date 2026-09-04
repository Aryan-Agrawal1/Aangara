import {
  Entity,
  DecisionTwinData,
  ScenarioParams,
  ScenarioSimulationResult,
  RegulatorySourceItem,
  MethodologyItem
} from './types';

// Force relative URLs since backend is now natively running in Next.js App Router
const API_BASE = '';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {})
    }
  });
  if (!res.ok) {
    throw new Error(`API call failed: ${res.status} ${res.statusText}`);
  }
  const json = await res.json();
  if (json.success === false) {
    throw new Error(json.errors?.[0]?.message || 'API request reported failure');
  }
  return json.data;
}

export async function getSectors(): Promise<any[]> {
  const data = await fetchJson<{ sectors: any[] }>('/api/sectors');
  return data.sectors;
}

export async function getEntities(sector?: string): Promise<Entity[]> {
  const query = sector ? `?sector=${sector}` : '';
  const data = await fetchJson<{ entities: Entity[] }>(`/api/entities${query}`);
  return data.entities;
}

export async function getEntityById(entityId: string): Promise<Entity> {
  return await fetchJson<Entity>(`/api/entities/${entityId}`);
}

/**
 * Fetches full Decision Twin data for an entity.
 * scenarioParams (optional): when provided, initializes with live CCC price and objective
 * so the first render matches exactly what the sliders show.
 */
export async function getDecisionTwin(
  entityId: string,
  reportingYear: string = '2025-26',
  scenarioParams?: ScenarioParams & { management_objective?: string },
  customOutput?: number,
  customEmissions?: number,
  customTarget?: number
): Promise<DecisionTwinData> {
  return await fetchJson<DecisionTwinData>('/api/strategies/compare', {
    method: 'POST',
    body: JSON.stringify({
      entity_id: entityId,
      reporting_year: reportingYear,
      // Pass live scenario params so API doesn't use hardcoded defaults on initial render
      ccc_price_inr: scenarioParams?.ccc_price_inr,
      project_output_delivery_pct: scenarioParams?.project_output_pct,
      project_delay_months: scenarioParams?.project_delay_months,
      financing_rate_pct: scenarioParams?.financing_rate_pct,
      management_objective: scenarioParams?.management_objective,
      custom_output: customOutput,
      custom_emissions: customEmissions,
      custom_target_gei: customTarget,
    })
  });
}

export async function runScenarioSimulation(
  entityId: string,
  reportingYear: string,
  params: ScenarioParams & { management_objective?: string }
): Promise<ScenarioSimulationResult> {
  return await fetchJson<ScenarioSimulationResult>('/api/scenarios/run', {
    method: 'POST',
    body: JSON.stringify({
      entity_id: entityId,
      reporting_year: reportingYear,
      parameters: {
        ccc_price_inr: params.ccc_price_inr,
        project_output_pct: params.project_output_pct,
        project_output_delivery_pct: params.project_output_pct, // both aliases
        project_delay_months: params.project_delay_months,
        financing_rate_pct: params.financing_rate_pct,
        management_objective: params.management_objective,
      }
    })
  });
}

export async function getAIExplanation(
  entityId: string,
  reportingYear: string,
  decisionData: DecisionTwinData
): Promise<any> {
  return await fetchJson<any>('/api/ai/explain', {
    method: 'POST',
    body: JSON.stringify({
      entity_id: entityId,
      reporting_year: reportingYear,
      decision_twin_data: decisionData
    })
  });
}

export async function getSources(): Promise<RegulatorySourceItem[]> {
  const data = await fetchJson<{ sources: RegulatorySourceItem[] }>('/api/sources');
  return data.sources;
}

export async function getMethodologies(): Promise<MethodologyItem[]> {
  const data = await fetchJson<{ methodologies: MethodologyItem[] }>('/api/methodologies');
  return data.methodologies;
}
