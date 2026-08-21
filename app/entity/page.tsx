'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/navigation/Header';
import { getEntities, getEntityById, getSectors } from '@/lib/api';
import { Entity } from '@/lib/types';
import { formatEmissions, formatTonnes, formatGEI, formatCurrencyCr } from '@/lib/formatters';
import { useAppStore } from '@/lib/store';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { Activity, CheckCircle2, ShieldAlert, Cpu, Flame, Zap, BarChart2, Building2, Layers } from 'lucide-react';

const EMISSION_COLORS = ['#38bdf8', '#fbbf24', '#34d399'];
const CHART_GRID = '#1e293b';
const CHART_TEXT = '#94a3b8';

// Custom dark tooltip
const PieCustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const data = payload[0];
  return (
    <div className="bg-[#0E1524] border border-slate-700 rounded-lg p-2.5 text-xs shadow-xl">
      <div className="flex items-center space-x-2">
        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.payload.fill }} />
        <span className="text-white font-bold">{data.name}</span>
      </div>
      <div className="mt-1 text-slate-300 font-mono">
        {data.value?.toLocaleString('en-IN')} tCO₂e ({data.payload.pct}%)
      </div>
    </div>
  );
};

export default function EntityInputPage() {
  const {
    currentSector, currentEntityId, reportingYear,
    sectors, entities,
    setSector, setEntityId, setReportingYear,
    setSectors, setEntities
  } = useAppStore();

  const [entity, setEntity] = useState<Entity | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        let currentEnts = entities;
        if (sectors.length === 0 || entities.length === 0) {
          const [s, e] = await Promise.all([getSectors(), getEntities(currentSector)]);
          setSectors(s);
          setEntities(e);
          currentEnts = e;
        }
        const activeId = currentEntityId || (currentEnts[0]?.entity_id) || 'SYN-CEM-001';
        const e = await getEntityById(activeId);
        setEntity(e);
      } catch (err) {
        console.error('Failed to load entity:', err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [currentEntityId, currentSector]);

  const handleSelect = async (id: string) => {
    setEntityId(id);
    const e = await getEntityById(id);
    setEntity(e);
  };

  const rp = entity?.reporting_periods['2025-26'];

  // Pie chart data: Breakdown of Scope 1 fuel, Scope 1 process, Scope 2 electricity
  const emissionsBreakdown = rp ? [
    {
      name: 'Scope 2 (Grid Electricity)',
      value: Math.round((rp.source_streams.electricity_mwh * 0.716)),
      pct: 0,
      fill: '#38bdf8'
    },
    {
      name: 'Scope 1 (Thermal Fuel)',
      value: Math.round(rp.source_streams.fuel_quantity_tonnes * (rp.source_streams.fuel_type === 'petcoke' ? 3.24 : 1.95)),
      pct: 0,
      fill: '#fbbf24'
    },
    {
      name: 'Scope 1 (Process Calcination)',
      value: Math.round(rp.source_streams.process_emissions_tco2e || 0),
      pct: 0,
      fill: '#34d399'
    }
  ].filter(d => d.value > 0) : [];

  const totalVal = emissionsBreakdown.reduce((sum, d) => sum + d.value, 0) || 1;
  emissionsBreakdown.forEach(d => {
    d.pct = Math.round((d.value / totalVal) * 100);
  });

  return (
    <div className="min-h-screen bg-[#070B11] flex flex-col">
      <Header
        currentSector={currentSector}
        currentEntityId={currentEntityId}
        reportingYear={reportingYear}
        onSectorChange={async (sec) => {
          setSector(sec);
          const ents = await getEntities(sec);
          setEntities(ents);
          if (ents.length > 0) setEntityId(ents[0].entity_id);
        }}
        onEntityChange={handleSelect}
        onYearChange={setReportingYear}
        sectorsList={sectors}
        entitiesList={entities}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Banner */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-white tracking-tight">{entity?.entity_name || 'Industrial Facility Profile'}</h1>
              <span className="px-2.5 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800/60 font-mono text-[11px] font-bold">
                CALIBRATED DEMO ENTITY
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Deterministic operational activity, mass balance fuel streams & statutory GHG accounting profile
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400">Select Facility:</span>
            <select
              value={currentEntityId}
              onChange={(e) => handleSelect(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
            >
              {entities.map((ent) => (
                <option key={ent.entity_id} value={ent.entity_id}>
                  {ent.entity_name} ({ent.entity_id})
                </option>
              ))}
            </select>
          </div>
        </div>

        {entity && rp && (
          <div className="space-y-6">
            {/* Top 3 Info Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Facility & Capacity */}
              <div className="glass-panel rounded-xl p-5 border-slate-800">
                <h3 className="text-sm font-bold text-white mb-3.5 flex items-center space-x-2 pb-2 border-b border-slate-800">
                  <Cpu className="w-4 h-4 text-emerald-400" />
                  <span>Nameplate & Production Activity</span>
                </h3>
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Registration ID:</span>
                    <span className="font-mono text-white font-bold">{entity.facility.facility_id}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">State / Grid Region:</span>
                    <span className="text-white">{entity.state}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Rated Annual Capacity:</span>
                    <span className="font-mono text-white">{formatTonnes(entity.facility.capacity)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">2025-26 Actual Output:</span>
                    <span className="font-mono text-emerald-400 font-bold">{formatTonnes(rp.actual_output)}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Capacity Utilisation:</span>
                    <span className="font-mono text-white font-semibold">{rp.utilisation_pct.toFixed(1)}%</span>
                  </div>
                </div>
              </div>

              {/* Source Streams Activity */}
              <div className="glass-panel rounded-xl p-5 border-slate-800">
                <h3 className="text-sm font-bold text-white mb-3.5 flex items-center space-x-2 pb-2 border-b border-slate-800">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>Energy & Fuel Streams</span>
                </h3>
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Grid Electricity:</span>
                    <span className="font-mono text-white">{rp.source_streams.electricity_mwh.toLocaleString('en-IN')} MWh</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Thermal Fuel Type:</span>
                    <span className="text-amber-400 font-semibold uppercase">{rp.source_streams.fuel_type}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Fuel Quantity:</span>
                    <span className="font-mono text-white">{formatTonnes(rp.source_streams.fuel_quantity_tonnes)}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Process Emissions:</span>
                    <span className="font-mono text-white">{formatEmissions(rp.source_streams.process_emissions_tco2e || 0)}</span>
                  </div>
                </div>
              </div>

              {/* Primary Abatement Project */}
              <div className="glass-panel rounded-xl p-5 border-slate-800">
                <h3 className="text-sm font-bold text-white mb-3.5 flex items-center space-x-2 pb-2 border-b border-slate-800">
                  <Zap className="w-4 h-4 text-teal-400" />
                  <span>Primary Abatement Project</span>
                </h3>
                <div className="space-y-2.5 text-xs">
                  <div>
                    <span className="text-slate-400 text-[11px]">Project Title:</span>
                    <div className="font-bold text-white mt-0.5 leading-snug">{entity.primary_project.name}</div>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Project CAPEX:</span>
                    <span className="font-mono text-emerald-400 font-bold">{formatCurrencyCr(entity.primary_project.capex_cr)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Annual Abatement:</span>
                    <span className="font-mono text-emerald-400 font-bold">{formatEmissions(entity.primary_project.expected_reduction_tco2e)}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">BEE Methodology:</span>
                    <span className="font-mono text-sky-400 font-semibold">{entity.primary_project.methodology_code}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Emissions Breakdown Chart */}
            <div className="glass-panel rounded-xl p-5 border-slate-800">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <BarChart2 className="w-4 h-4 text-sky-400" />
                  <h3 className="text-sm font-bold text-white">GHG Emissions Inventory Breakdown (Scope 1 & 2)</h3>
                </div>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  MASS BALANCE VERIFIED
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* Pie Chart */}
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={emissionsBreakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {emissionsBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} stroke="#0B0F17" strokeWidth={2} />
                        ))}
                      </Pie>
                      <Tooltip content={<PieCustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Legend & Summary List */}
                <div className="space-y-3">
                  {emissionsBreakdown.map((item, idx) => (
                    <div key={idx} className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }} />
                        <div>
                          <div className="text-xs font-semibold text-white">{item.name}</div>
                          <div className="text-[10px] text-slate-400">{item.pct}% of total facility footprint</div>
                        </div>
                      </div>
                      <div className="text-xs font-mono font-bold text-slate-200">
                        {item.value.toLocaleString('en-IN')} tCO₂e
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
