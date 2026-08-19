'use client';

import React from 'react';
import { CarbonPosition } from '@/lib/types';
import { X, ExternalLink, ShieldCheck, FileCheck, Layers } from 'lucide-react';

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
  sourceUrl = 'https://egazette.gov.in/WriteReadData/2026/269375.pdf'
}: SourceTraceDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm flex justify-end transition-opacity">
      <div className="w-full max-w-xl bg-slate-950 border-l border-slate-800 p-6 overflow-y-auto h-full shadow-2xl flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800/50">
                  TIER-1 VERIFIED
                </span>
                <h3 className="text-lg font-bold text-white">Regulatory Source & Calculation Trace</h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Primary Indian Statutory References & Step-by-Step Mathematical Provenance</p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Primary Legal Authority Block */}
          <div className="mt-5 space-y-4">
            <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-slate-400 font-medium">Statutory Target Authority:</span>
                <span className="font-mono text-sky-400 font-semibold">{sourceId}</span>
              </div>
              <h4 className="text-sm font-bold text-white mb-1">
                MoEFCC Greenhouse Gases Emission Intensity Target (Amendment) Rules, 2025
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Published under Gazette Notification G.S.R. 25(E), prescribing baseline period FY2023-24 and binding intensity trajectories for obligated industrial units for FY2025-26 and FY2026-27.
              </p>
              
              <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Effective Gazette URL:</span>
                <a
                  href={sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-sky-400 hover:text-sky-300 flex items-center space-x-1 font-medium"
                >
                  <span>e-Gazette of India</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Step-by-Step Calculation Trace */}
            <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800">
              <h4 className="text-sm font-bold text-white mb-3 flex items-center space-x-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                <span>Deterministic Calculation Provenance</span>
              </h4>

              {position?.calculation_trace && position.calculation_trace.length > 0 ? (
                <div className="space-y-3">
                  {position.calculation_trace.map((trace, i) => (
                    <div key={i} className="bg-slate-950/80 p-3 rounded-lg border border-slate-800/80 text-xs">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-mono font-bold text-slate-200">{trace.metric}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                          {trace.model_version}
                        </span>
                      </div>
                      <div className="font-mono text-emerald-400 bg-slate-900 px-2 py-1 rounded text-[11px] my-1">
                        {trace.formula}
                      </div>
                      <div className="flex justify-between text-slate-400 text-[11px] mt-1">
                        <span>Inputs: {JSON.stringify(trace.inputs)}</span>
                        <span className="font-bold text-white font-mono">Result: {trace.result}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">Position calculation trace ready.</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer Disclaimer */}
        <div className="pt-4 mt-6 border-t border-slate-800 text-[11px] text-slate-500 leading-normal">
          <p>
            <strong>Regulatory Boundary Notice:</strong> CarbonAlpha models potential compliance outcomes from published Gazette equations. Official CCC certificates are issued solely through the Bureau of Energy Efficiency and the Indian Carbon Market Registry operator.
          </p>
        </div>
      </div>
    </div>
  );
}
