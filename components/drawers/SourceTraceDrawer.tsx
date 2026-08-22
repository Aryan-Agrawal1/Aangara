'use client';

import React from 'react';
import { CarbonPosition } from '@/lib/types';
import { X, ExternalLink, ShieldCheck, FileCheck, Layers, Cpu, Database, CheckCircle2 } from 'lucide-react';

interface SourceTraceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  position?: CarbonPosition;
  sectorName?: string;
  sourceId?: string;
  sourceUrl?: string;
}

export function SourceTraceDrawer({
  isOpen,
  onClose,
  position,
  sectorName = 'Cement',
  sourceId = 'REG-MOEFCC-2025-GEI',
  sourceUrl = 'https://moef.gov.in/en/notifications/'
}: SourceTraceDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-sm flex justify-end transition-opacity">
      <div className="w-full max-w-xl bg-[#0B0F17] border-l border-[#E4E9E6] p-6 overflow-y-auto h-full shadow-2xl flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#E4E9E6]">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#EBF3FB] text-[#2E6BA8] border border-[#2E6BA8]/20">
                  TIER-1 VERIFIED
                </span>
                <h3 className="text-lg font-bold text-[#10231C]">Regulatory Source & Traceability</h3>
              </div>
              <p className="text-xs text-[#4B5A54] mt-0.5">Primary Indian Statutory References, Mathematical Steps & Data Status Labels</p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-[#F6F8F7] hover:bg-white border border-[#E4E9E6] text-[#4B5A54] hover:text-[#10231C] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Data Status Labels Guide */}
          <div className="mt-4 bg-[#F6F8F7] rounded-xl p-3.5 border border-[#E4E9E6] text-xs">
            <h4 className="text-xs font-bold text-[#4B5A54] mb-2 flex items-center space-x-1.5">
              <Database className="w-3.5 h-3.5 text-[#0B4A3D]" />
              <span>Data Provenance & Status Hierarchy</span>
            </h4>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="p-2 rounded bg-white/80 border border-[#E4E9E6]">
                <span className="text-[#0B4A3D] font-bold">FACT</span>
                <p className="text-[#4B5A54] text-[10px] mt-0.5">Official MoEFCC Gazette targets & CEA grid emission factor (0.716)</p>
              </div>
              <div className="p-2 rounded bg-white/80 border border-[#E4E9E6]">
                <span className="text-[#2E6BA8] font-bold">CALCULATION</span>
                <p className="text-[#4B5A54] text-[10px] mt-0.5">Deterministic mass balance & thermodynamic engine outputs</p>
              </div>
              <div className="p-2 rounded bg-white/80 border border-[#E4E9E6]">
                <span className="text-[#C98A1E] font-bold">MODEL</span>
                <p className="text-[#4B5A54] text-[10px] mt-0.5">HistGBM / IsolationForest ML predictions with confidence tier (CALIBRATED)</p>
              </div>
              <div className="p-2 rounded bg-white/80 border border-[#E4E9E6]">
                <span className="text-violet-400 font-bold">SCENARIO</span>
                <p className="text-[#4B5A54] text-[10px] mt-0.5">User-moved sensitivity sliders & stress parameters</p>
              </div>
            </div>
          </div>

          {/* Primary Legal Authority Block */}
          <div className="mt-4 space-y-4">
            <div className="bg-[#F6F8F7] rounded-xl p-4 border border-[#E4E9E6]">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-[#4B5A54] font-medium">Statutory Authority:</span>
                <span className="font-mono text-[#2E6BA8] font-semibold">{sourceId}</span>
              </div>
              <h4 className="text-sm font-bold text-[#10231C] mb-1">
                MoEFCC Greenhouse Gases Emission Intensity Target Rules, 2025-26
              </h4>
              <p className="text-xs text-[#4B5A54] leading-relaxed">
                Published under Gazette Notification G.S.R. 25(E) and Draft G.S.R. 517(E), prescribing baseline period FY2023-24 and binding intensity trajectories for obligated industrial units.
              </p>
              
              <div className="mt-3 pt-3 border-t border-[#E4E9E6]/80 flex items-center justify-between text-xs">
                <span className="text-[#4B5A54]">Authority: <strong className="text-[#10231C]">MoEFCC & BEE</strong></span>
                <a
                  href={sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#2E6BA8] hover:text-[#2E6BA8] flex items-center space-x-1 font-medium"
                >
                  <span>MoEFCC Notifications Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Step-by-Step Calculation Trace */}
            <div className="bg-[#F6F8F7] rounded-xl p-4 border border-[#E4E9E6]">
              <h4 className="text-sm font-bold text-white mb-3 flex items-center space-x-2">
                <Layers className="w-4 h-4 text-[#0B4A3D]" />
                <span>Deterministic Calculation Step Provenance</span>
              </h4>

              {position?.calculation_trace && position.calculation_trace.length > 0 ? (
                <div className="space-y-3">
                  {position.calculation_trace.map((trace, i) => (
                    <div key={i} className="bg-white/80 p-3 rounded-lg border border-[#E4E9E6]/80 text-xs">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-mono font-bold text-[#10231C]">{trace.metric}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#F6F8F7] text-[#4B5A54] border border-[#E4E9E6]">
                          {trace.model_version}
                        </span>
                      </div>
                      <div className="font-mono text-[#0B4A3D] bg-[#F6F8F7] px-2 py-1 rounded text-[11px] my-1 overflow-x-auto">
                        {trace.formula}
                      </div>
                      <div className="flex flex-col sm:flex-row justify-between text-[#4B5A54] text-[11px] mt-1 gap-1">
                        <span className="truncate">Inputs: {JSON.stringify(trace.inputs)}</span>
                        <span className="font-bold text-white font-mono flex-shrink-0">Result: {trace.result}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white p-3 rounded-lg text-xs font-mono text-[#4B5A54]">
                  Calculated using CarbonEngine Scope 1 (mass balance) + Scope 2 (CEA grid factor 0.716) deterministic formulas.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Disclaimer */}
        <div className="pt-4 mt-6 border-t border-[#E4E9E6] text-[11px] text-[#6B7A72] leading-normal">
          <p>
            <strong>Statutory Boundary Notice:</strong> CarbonAlpha models decision intelligence from notified Gazette equations. Official CCC issuance is governed by BEE under the Energy Conservation Act, 2001 (Section 14AA).
          </p>
        </div>
      </div>
    </div>
  );
}
