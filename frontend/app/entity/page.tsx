'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/navigation/Header';
import { getEntities, getEntityById } from '@/lib/api';
import { Entity } from '@/lib/types';
import { formatEmissions, formatTonnes, formatGEI } from '@/lib/formatters';
import { Activity, CheckCircle2, ShieldAlert, Cpu, Flame, Zap } from 'lucide-react';

export default function EntityInputPage() {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [selectedEntityId, setSelectedEntityId] = useState('SYN-CEM-001');
  const [entity, setEntity] = useState<Entity | null>(null);

  useEffect(() => {
    async function load() {
      const ents = await getEntities();
      setEntities(ents);
      if (ents.length > 0) {
        const e = await getEntityById('SYN-CEM-001');
        setEntity(e);
      }
    }
    load();
  }, []);

  const handleSelect = async (id: string) => {
    setSelectedEntityId(id);
    const e = await getEntityById(id);
    setEntity(e);
  };

  const rp = entity?.reporting_periods['2025-26'];

  return (
    <div className="min-h-screen bg-[#070B11] flex flex-col">
      <Header currentEntityId={selectedEntityId} onEntityChange={handleSelect} entitiesList={entities} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">{entity?.entity_name || 'Industrial Facility Profile'}</h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Synthetic Operational Activity, Fuel Streams & GHG Accounting Verification
            </p>
          </div>
          <span className="px-3 py-1 rounded bg-blue-950 text-blue-400 border border-blue-800/60 font-mono text-xs font-bold">
            DATA STATUS: SYNTHETIC
          </span>
        </div>

        {entity && rp && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Facility & Capacity */}
            <div className="glass-panel rounded-xl p-5">
              <h3 className="text-base font-bold text-white mb-4 flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-emerald-400" />
                <span>Nameplate & Production</span>
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Facility ID:</span>
                  <span className="font-mono text-white">{entity.facility.facility_id}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">State / Location:</span>
                  <span className="text-white">{entity.state}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Rated Capacity:</span>
                  <span className="font-mono text-white">{formatTonnes(entity.facility.capacity)}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Actual Output (2025-26):</span>
                  <span className="font-mono text-emerald-400 font-bold">{formatTonnes(rp.actual_output)}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-400">Capacity Utilisation:</span>
                  <span className="font-mono text-white">{rp.utilisation_pct.toFixed(1)}%</span>
                </div>
              </div>
            </div>

            {/* Source Streams Activity */}
            <div className="glass-panel rounded-xl p-5">
              <h3 className="text-base font-bold text-white mb-4 flex items-center space-x-2">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>Energy & Thermal Streams</span>
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Grid Electricity:</span>
                  <span className="font-mono text-white">{rp.source_streams.electricity_mwh.toLocaleString('en-IN')} MWh</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Thermal Fuel Type:</span>
                  <span className="text-amber-400 font-semibold">{rp.source_streams.fuel_type.toUpperCase()}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Fuel Consumption:</span>
                  <span className="font-mono text-white">{formatTonnes(rp.source_streams.fuel_quantity_tonnes)}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-400">Process Emissions (Calcination):</span>
                  <span className="font-mono text-white">{formatEmissions(rp.source_streams.process_emissions_tco2e)}</span>
                </div>
              </div>
            </div>

            {/* Active Decarbonisation Project */}
            <div className="glass-panel rounded-xl p-5">
              <h3 className="text-base font-bold text-white mb-4 flex items-center space-x-2">
                <Zap className="w-4 h-4 text-teal-400" />
                <span>Primary Abatement Project</span>
              </h3>
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 text-[11px]">Project Title:</span>
                  <div className="font-bold text-white mt-0.5">{entity.primary_project.name}</div>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Project CAPEX:</span>
                  <span className="font-mono text-emerald-400 font-bold">?{entity.primary_project.capex_cr.toFixed(1)} Cr</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Annual Abatement:</span>
                  <span className="font-mono text-emerald-400 font-bold">{formatEmissions(entity.primary_project.expected_reduction_tco2e)}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-400">Methodology:</span>
                  <span className="font-mono text-sky-400">{entity.primary_project.methodology_code}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
