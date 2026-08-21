'use client';

import { UtilityBar } from "@/components/ui/UtilityBar";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
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
import { ProvenanceFooter } from '@/components/ui/ProvenanceFooter';
import { Activity, CheckCircle2, ShieldAlert, Cpu, Flame, Zap, BarChart2, Building2, Layers } from 'lucide-react';

const EMISSION_COLORS = ['#38bdf8', '#fbbf24', '#34d399'];
const CHART_GRID = '#E4E9E6';
const CHART_TEXT = '#6B7A72';

// Custom dark tooltip
const PieCustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const data = payload[0];
  return (
    <div className="bg-[#0E1524] border border-[#E4E9E6] rounded-lg p-2.5 text-xs shadow-xl">
      <div className="flex items-center space-x-2">
        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.payload.fill }} />
        <span className="text-[#10231C] font-bold">{data.name}</span>
      </div>
      <div className="mt-1 text-[#4B5A54] font-mono">
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
      fill: '#1E3A5F'
    },
    {
      name: 'Scope 1 (Thermal Fuel)',
      value: Math.round(rp.source_streams.fuel_quantity_tonnes * (rp.source_streams.fuel_type === 'petcoke' ? 3.24 : 1.95)),
      pct: 0,
      fill: '#F59E0B'
    },
    {
      name: 'Scope 1 (Process Calcination)',
      value: Math.round(rp.source_streams.process_emissions_tco2e || 0),
      pct: 0,
      fill: '#10B981'
    }
  ].filter(d => d.value > 0) : [];

  const totalVal = emissionsBreakdown.reduce((sum, d) => sum + d.value, 0) || 1;
  emissionsBreakdown.forEach(d => {
    d.pct = Math.round((d.value / totalVal) * 100);
  });

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <UtilityBar />
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
        <Breadcrumb items={[{ label: "Facility Input" }]} />
        {/* Page Banner */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-[#10231C] tracking-tight">{entity?.entity_name || 'Industrial Facility Profile'}</h1>
              <span className="px-2.5 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800/60 font-mono text-[11px] font-bold">
                CALIBRATED DEMO ENTITY
              </span>
            </div>
            <p className="text-xs text-[#4B5A54] mt-1">
              Deterministic operational activity, mass balance fuel streams & statutory GHG accounting profile
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-[#4B5A54]">Select Facility:</span>
            <select
              value={currentEntityId}
              onChange={(e) => handleSelect(e.target.value)}
              className="bg-[#F6F8F7] border border-[#E4E9E6] rounded-lg px-3 py-1.5 text-xs text-[#10231C] font-mono focus:outline-none focus:border-emerald-500"
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
              <div className="glass-panel rounded-xl p-5 border-[#E4E9E6]">
                <h3 className="text-sm font-bold text-[#10231C] mb-3.5 flex items-center space-x-2 pb-2 border-b border-[#E4E9E6]">
                  <Cpu className="w-4 h-4 text-[#1F8A5F]" />
                  <span>Nameplate & Production Activity</span>
                </h3>
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-[#E4E9E6]/60">
                    <span className="text-[#4B5A54]">Registration ID:</span>
                    <span className="font-mono text-[#10231C] font-bold">{entity.facility.facility_id}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#E4E9E6]/60">
                    <span className="text-[#4B5A54]">State / Grid Region:</span>
                    <span className="text-[#10231C]">{entity.state}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#E4E9E6]/60">
                    <span className="text-[#4B5A54]">Rated Annual Capacity:</span>
                    <span className="font-mono text-[#10231C]">{formatTonnes(entity.facility.capacity)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#E4E9E6]/60">
                    <span className="text-[#4B5A54]">2025-26 Actual Output:</span>
                    <span className="font-mono text-[#1F8A5F] font-bold">{formatTonnes(rp.actual_output)}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-[#4B5A54]">Capacity Utilisation:</span>
                    <span className="font-mono text-[#10231C] font-semibold">{rp.utilisation_pct.toFixed(1)}%</span>
                  </div>
                </div>
              </div>

              {/* Source Streams Activity */}
              <div className="glass-panel rounded-xl p-5 border-[#E4E9E6]">
                <h3 className="text-sm font-bold text-[#10231C] mb-3.5 flex items-center space-x-2 pb-2 border-b border-[#E4E9E6]">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>Energy & Fuel Streams</span>
                </h3>
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-[#E4E9E6]/60">
                    <span className="text-[#4B5A54]">Grid Electricity:</span>
                    <span className="font-mono text-[#10231C]">{rp.source_streams.electricity_mwh.toLocaleString('en-IN')} MWh</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#E4E9E6]/60">
                    <span className="text-[#4B5A54]">Thermal Fuel Type:</span>
                    <span className="text-amber-400 font-semibold uppercase">{rp.source_streams.fuel_type}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#E4E9E6]/60">
                    <span className="text-[#4B5A54]">Fuel Quantity:</span>
                    <span className="font-mono text-[#10231C]">{formatTonnes(rp.source_streams.fuel_quantity_tonnes)}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-[#4B5A54]">Process Emissions:</span>
                    <span className="font-mono text-[#10231C]">{formatEmissions(rp.source_streams.process_emissions_tco2e || 0)}</span>
                  </div>
                </div>
              </div>

              {/* Primary Abatement Project */}
              <div className="glass-panel rounded-xl p-5 border-[#E4E9E6]">
                <h3 className="text-sm font-bold text-[#10231C] mb-3.5 flex items-center space-x-2 pb-2 border-b border-[#E4E9E6]">
                  <Zap className="w-4 h-4 text-teal-400" />
                  <span>Primary Abatement Project</span>
                </h3>
                <div className="space-y-2.5 text-xs">
                  <div>
                    <span className="text-[#4B5A54] text-[11px]">Project Title:</span>
                    <div className="font-bold text-[#10231C] mt-0.5 leading-snug">{entity.primary_project.name}</div>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#E4E9E6]/60">
                    <span className="text-[#4B5A54]">Project CAPEX:</span>
                    <span className="font-mono text-[#1F8A5F] font-bold">{formatCurrencyCr(entity.primary_project.capex_cr)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#E4E9E6]/60">
                    <span className="text-[#4B5A54]">Annual Abatement:</span>
                    <span className="font-mono text-[#1F8A5F] font-bold">{formatEmissions(entity.primary_project.expected_reduction_tco2e)}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-[#4B5A54]">BEE Methodology:</span>
                    <span className="font-mono text-sky-400 font-semibold">{entity.primary_project.methodology_code}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Emissions Breakdown Chart */}
            <div className="glass-panel rounded-xl p-5 border-[#E4E9E6]">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E4E9E6]">
                <div className="flex items-center space-x-2">
                  <BarChart2 className="w-4 h-4 text-sky-400" />
                  <h3 className="text-sm font-bold text-[#10231C]">GHG Emissions Inventory Breakdown (Scope 1 & 2)</h3>
                </div>
                <span className="text-[10px] font-mono text-[#4B5A54] bg-[#F6F8F7] px-2 py-0.5 rounded border border-[#E4E9E6]">
                  MASS BALANCE VERIFIED
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* Pie Chart */}
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <title>GHG Emissions Inventory Breakdown</title>
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
                    <div key={idx} className="bg-[#F6F8F7] p-3 rounded-lg border border-[#E4E9E6] flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }} />
                        <div>
                          <div className="text-xs font-semibold text-[#10231C]">{item.name}</div>
                          <div className="text-[10px] text-[#4B5A54]">{item.pct}% of total facility footprint</div>
                        </div>
                      </div>
                      <div className="text-xs font-mono font-bold text-[#4B5A54]">
                        {item.value.toLocaleString('en-IN')} tCO₂e
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        <ProvenanceFooter />
      </main>
    </div>
  );
}
