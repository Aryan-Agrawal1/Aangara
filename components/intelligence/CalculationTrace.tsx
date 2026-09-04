'use client';

import React, { useState } from 'react';
import { ShieldCheck, Info, FileText, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import { FORMULA_REGISTRY, FormulaId } from '@/lib/registries/formula-registry';

export interface SourceTraceProps {
  metricName: string;
  value: string | number;
  unit?: string;
  formulaId: string;
  formulaVersion?: string;
  authorityClass?: 'STATUTORY_CCTS' | 'INVENTORY_STANDARD' | 'ENGINEERING_ANALYTICAL' | 'SCENARIO_METHOD' | 'SYNTHETIC';
  inputs?: Record<string, any>;
  gazetteRef?: string;
  limitations?: string;
  compact?: boolean;
}

export function CalculationTrace({
  metricName,
  value,
  unit = '',
  formulaId,
  formulaVersion,
  authorityClass = 'STATUTORY_CCTS',
  inputs = {},
  gazetteRef,
  limitations,
  compact = false,
}: SourceTraceProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const formulaMeta = FORMULA_REGISTRY[formulaId as FormulaId];
  const version = formulaVersion || formulaMeta?.version || '1.0';
  const authority = authorityClass || formulaMeta?.authority_class || 'STATUTORY_CCTS';

  const getAuthorityBadge = (auth: string) => {
    switch (auth) {
      case 'STATUTORY_CCTS':
        return {
          label: 'STATUTORY CCTS',
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
          dot: 'bg-emerald-500',
        };
      case 'INVENTORY_STANDARD':
        return {
          label: 'INVENTORY STANDARD',
          bg: 'bg-blue-50 text-blue-800 border-blue-300',
          dot: 'bg-blue-500',
        };
      case 'ENGINEERING_ANALYTICAL':
        return {
          label: 'ENGINEERING ANALYTICAL',
          bg: 'bg-teal-50 text-teal-800 border-teal-300',
          dot: 'bg-teal-500',
        };
      case 'SCENARIO_METHOD':
        return {
          label: 'SCENARIO ASSUMPTION',
          bg: 'bg-amber-50 text-amber-800 border-amber-300',
          dot: 'bg-amber-500',
        };
      case 'SYNTHETIC':
      default:
        return {
          label: 'SYNTHETIC DISCLOSED',
          bg: 'bg-rose-50 text-rose-800 border-rose-300',
          dot: 'bg-rose-500',
        };
    }
  };

  const badge = getAuthorityBadge(authority);

  const handleCopyTrace = () => {
    const traceJson = JSON.stringify(
      {
        metric: metricName,
        value,
        unit,
        formula_id: formulaId,
        formula_version: version,
        authority_class: authority,
        inputs,
        gazette_reference: gazetteRef || formulaMeta?.gazette_reference,
        methodology: formulaMeta?.description,
      },
      null,
      2
    );
    navigator.clipboard.writeText(traceJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-[#E2E8F0] bg-white shadow-xs overflow-hidden transition-all text-xs">
      {/* Header Summary Row */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 rounded-lg bg-slate-100 text-slate-700">
            <ShieldCheck className="w-4 h-4 text-[#0B4A3D]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-slate-900">{metricName}</span>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${badge.bg}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${badge.dot}`}></span>
                {badge.label}
              </span>
            </div>
            <div className="text-[11px] text-slate-500 font-mono mt-0.5">
              {formulaId} v{version}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="text-right">
            <span className="font-mono font-bold text-sm text-slate-900">
              {typeof value === 'number' ? value.toLocaleString('en-IN') : value}
            </span>
            {unit && <span className="text-[11px] text-slate-500 ml-1 font-mono">{unit}</span>}
          </div>
          <button
            type="button"
            className="text-slate-400 hover:text-slate-700 p-1"
            aria-label="Toggle trace details"
          >
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expandable Trace Drawer */}
      {isOpen && (
        <div className="p-4 bg-[#F8FAFC] border-t border-[#E2E8F0] space-y-3 font-mono">
          {formulaMeta && (
            <div className="space-y-1">
              <div className="text-[11px] font-semibold text-slate-600 uppercase tracking-wide">
                Governing Methodology
              </div>
              <div className="text-xs text-slate-800 bg-white p-2.5 rounded-lg border border-slate-200">
                {formulaMeta.description}
              </div>
              <div className="text-[10px] text-slate-500">
                Source Document:{' '}
                <span className="text-slate-700 font-semibold">{formulaMeta.source_document}</span>
              </div>
            </div>
          )}

          {/* Inputs Table */}
          {inputs && Object.keys(inputs).length > 0 && (
            <div className="space-y-1">
              <div className="text-[11px] font-semibold text-slate-600 uppercase tracking-wide">
                Inputs Applied
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] bg-white p-2.5 rounded-lg border border-slate-200">
                {Object.entries(inputs).map(([k, v]) => (
                  <div key={k} className="flex justify-between py-0.5 border-b border-slate-100 last:border-0">
                    <span className="text-slate-500">{k}:</span>
                    <span className="font-semibold text-slate-900">
                      {typeof v === 'number' ? v.toLocaleString('en-IN') : String(v)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Gazette / Statutory Citation */}
          {(gazetteRef || formulaMeta?.gazette_reference) && (
            <div className="flex items-start space-x-2 bg-emerald-50/60 p-2 rounded-lg border border-emerald-200/60 text-[11px] text-emerald-900">
              <FileText className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Statutory Reference:</span>{' '}
                {gazetteRef || formulaMeta?.gazette_reference}
              </div>
            </div>
          )}

          {/* Limitations Disclaimer */}
          {limitations && (
            <div className="flex items-start space-x-2 bg-amber-50/70 p-2 rounded-lg border border-amber-200/70 text-[11px] text-amber-900">
              <Info className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Limitation Note:</span> {limitations}
              </div>
            </div>
          )}

          {/* Action Row */}
          <div className="flex justify-between items-center pt-2 text-[11px]">
            <span className="text-slate-400">Deterministic ACVA verification artifact</span>
            <button
              onClick={handleCopyTrace}
              className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-medium transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied Trace JSON</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Copy Trace</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
