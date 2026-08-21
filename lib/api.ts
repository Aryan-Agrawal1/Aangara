import {
  Entity,
  DecisionTwinData,
  ScenarioParams,
  ScenarioSimulationResult,
  RegulatorySourceItem,
  MethodologyItem
} from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

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

export async function getDecisionTwin(
  entityId: string,
  reportingYear: string = '2025-26',
  customOutput?: number,
  customEmissions?: number,
  customTarget?: number
): Promise<DecisionTwinData> {
  return await fetchJson<DecisionTwinData>('/api/strategies/compare', {
    method: 'POST',
    body: JSON.stringify({
      entity_id: entityId,
      reporting_year: reportingYear,
      custom_output: customOutput,
      custom_emissions: customEmissions,
      custom_target_gei: customTarget
    })
  });
}

export async function runScenarioSimulation(
  entityId: string,
  reportingYear: string,
  params: ScenarioParams
): Promise<ScenarioSimulationResult> {
  return await fetchJson<ScenarioSimulationResult>('/api/scenarios/run', {
    method: 'POST',
    body: JSON.stringify({
      entity_id: entityId,
      reporting_year: reportingYear,
      parameters: params
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
