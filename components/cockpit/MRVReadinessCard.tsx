'use client';

import React from 'react';
import { MRVReadiness } from '@/lib/types';
import { ShieldCheck, HelpCircle } from 'lucide-react';

interface MRVReadinessCardProps {
  mrv: MRVReadiness;
}

// Tooltip descriptions for each MRV dimension
const MRV_DIMENSION_TOOLTIPS: Record<string, string> = {
  'Measurement Completeness':
    'Percentage of emission sources covered by calibrated, traceable measurement systems (NABL-accredited or equivalent). Higher = more of your emissions are actually measured, not estimated.',
  'Activity Data Integrity':
    'Quality and completeness of activity data (fuel purchase invoices, electricity bills, production logs). Verifiable activity data is a prerequisite for a clean ACVA audit.',
  'Factor Traceability':
    'Whether emission factors used (CEA grid EF, BEE combustion factors, IPCC process factors) are correctly sourced, version-controlled, and applied with documented authority references.',
  'Methodology Mapping':
    'The degree to which your emission calculation methodology matches an approved BEE/ACVA methodology (e.g., BEE-ACC-CEMENT-V1). Higher = less risk of methodology rejection at audit.',
  'Verification Readiness':
    'Preparedness for third-party ACVA verification: whether data trails, sampling plans, variance logs, and calibration records are in a format that an accredited verifier can audit within a standard engagement.',
};

export function MRVReadinessCard({ mrv }: MRVReadinessCardProps) {
  const dimensions = [
    { label: 'Measurement Completeness', score: mrv.measurement_completeness },
    { label: 'Activity Data Integrity',  score: mrv.activity_data_completeness },
    { label: 'Factor Traceability',      score: mrv.factor_traceability },
    { label: 'Methodology Mapping',      score: mrv.methodology_mapping },
    { label: 'Verification Readiness',   score: mrv.verification_readiness },
  ];

  const compositeColor =
    mrv.composite_score >= 85 ? 'text-[#0B4A3D]'
    : mrv.composite_score >= 70 ? 'text-[#C98A1E]'
    : 'text-[#C33B2E]';

  return (
    <div className="glass-panel rounded-xl p-5 relative overflow-hidden transition-all duration-300 hover:border-[#E4E9E6]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-lg bg-white border border-[#E4E9E6] text-[#0B4A3D]">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#10231C] tracking-tight">MRV &amp; Evidence Readiness</h3>
            <p className="text-xs text-[#4B5A54]">5-Dimension Measurement, Reporting &amp; Verification Quality</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className={`text-xl font-black font-mono ${compositeColor}`}>
            {mrv.composite_score.toFixed(0)}
          </span>
          <span className="text-xs text-[#6B7A72] font-mono">/ 100</span>
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${
            mrv.composite_score >= 80
              ? 'bg-[#E8F5EE]/70 text-[#0B4A3D] border-[#0B4A3D]/30'
              : mrv.composite_score >= 65
              ? 'bg-[#FEF7E8]/70 text-[#C98A1E] border-[#C98A1E]/30'
              : 'bg-[#FDECEA]/70 text-[#C33B2E] border-[#C33B2E]/30'
          }`}>
            {mrv.status}
          </span>
        </div>
      </div>

      {/* Progress Bars for 5 Dimensions with tooltips */}
      <div className="space-y-2.5 mt-3">
        {dimensions.map((dim, idx) => (
          <div key={idx} className="bg-[#F6F8F7] p-2.5 rounded-lg border border-[#E4E9E6]/80">
            <div className="flex justify-between items-center text-[11px] mb-1.5">
              <span
                className="text-[#4B5A54] flex items-center space-x-1.5 cursor-help"
                title={MRV_DIMENSION_TOOLTIPS[dim.label] ?? dim.label}
              >
                <span>{dim.label}</span>
                <HelpCircle className="w-2.5 h-2.5 text-[#6B7A72] opacity-70 flex-shrink-0" />
              </span>
              <span className={`font-mono font-bold ${
                dim.score >= 80 ? 'text-[#0B4A3D]'
                : dim.score >= 65 ? 'text-[#C98A1E]'
                : 'text-[#C33B2E]'
              }`}>{dim.score.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-white border border-[#E4E9E6] rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  dim.score >= 80 ? 'bg-gradient-to-r from-teal-500 to-emerald-400'
                  : dim.score >= 65 ? 'bg-gradient-to-r from-amber-400 to-amber-500'
                  : 'bg-gradient-to-r from-red-400 to-red-500'
                }`}
                style={{ width: `${Math.min(100, Math.max(0, dim.score))}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="text-[10px] text-[#6B7A72] mt-3 flex items-start space-x-1 leading-relaxed">
        <HelpCircle className="w-3 h-3 flex-shrink-0 mt-0.5" />
        <span>
          Analytical readiness score only — not an ACVA statutory audit certificate or official BEE determination.
          Hover each dimension for a full description.
        </span>
      </div>
    </div>
  );
}
