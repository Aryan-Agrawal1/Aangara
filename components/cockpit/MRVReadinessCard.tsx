'use client';

import React from 'react';
import { MRVReadiness } from '@/lib/types';
import { ShieldCheck } from 'lucide-react';
import { InfoTooltip } from '@/components/ui/InfoTooltip';

interface MRVReadinessCardProps {
  mrv: MRVReadiness;
}

const MRV_DIMENSION_TOOLTIPS: Record<string, string> = {
  'Measurement Completeness':
    'What % of your emission sources are covered by calibrated, traceable measurement instruments (e.g. NABL-accredited flow meters, calibrated fuel analysis). Higher = fewer estimated values in your GHG inventory.',
  'Activity Data Integrity':
    'Quality and completeness of the underlying activity data: fuel purchase invoices, electricity bills, production logs. Verifiable activity data is mandatory for a clean ACVA third-party audit.',
  'Factor Traceability':
    'Whether emission factors used (CEA grid factor: 0.716 tCO₂e/MWh, BEE combustion factors, IPCC process EFs) are correctly version-controlled and applied with documented regulatory references.',
  'Methodology Mapping':
    'How closely your calculation method matches an approved BEE/ACVA methodology (e.g. BEE-ACC-CEMENT-V1). Higher = lower risk of methodology rejection during statutory audit.',
  'Verification Readiness':
    'Preparedness for third-party ACVA verification: data trails, sampling plans, variance logs, and calibration records must be in a format an accredited verifier can audit in a standard engagement.',
  'Composite Score':
    'Weighted composite across all 5 MRV dimensions. ≥80 = HIGH READINESS (audit-ready). 65–79 = MODERATE (gaps exist, remediation recommended). <65 = LOW (significant audit risk).',
};

const DIM_COLOR = (score: number) =>
  score >= 80 ? '#0B4A3D' : score >= 65 ? '#C98A1E' : '#C33B2E';

const DIM_TRACK = (score: number) =>
  score >= 80
    ? 'from-teal-500 to-emerald-400'
    : score >= 65
    ? 'from-amber-400 to-amber-500'
    : 'from-red-400 to-red-500';

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

  const badgeStyle =
    mrv.composite_score >= 80
      ? 'bg-[#E8F5EE]/70 text-[#0B4A3D] border-[#0B4A3D]/30'
      : mrv.composite_score >= 65
      ? 'bg-[#FEF7E8]/70 text-[#C98A1E] border-[#C98A1E]/30'
      : 'bg-[#FDECEA]/70 text-[#C33B2E] border-[#C33B2E]/30';

  return (
    <div className="glass-panel rounded-xl p-4 transition-all duration-300 hover:border-[#E4E9E6] h-full">
      {/* ── Header row ── */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2 min-w-0">
          <div className="p-1.5 rounded-lg bg-white border border-[#E4E9E6] text-[#0B4A3D] flex-shrink-0">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-xs font-semibold text-[#10231C] tracking-tight leading-tight flex items-center gap-1.5">
              MRV &amp; Evidence Readiness
              <InfoTooltip
                content="Measurement, Reporting & Verification readiness across 5 statutory dimensions. Determines your audit-readiness for ACVA third-party verification — a mandatory step before CCC issuance or compliance submission."
                iconSize="w-3 h-3"
              />
            </h3>
            <p className="text-[10px] text-[#4B5A54] leading-tight">5-Dimension ACVA Audit Readiness</p>
          </div>
        </div>

        {/* Composite score */}
        <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
          <InfoTooltip content={MRV_DIMENSION_TOOLTIPS['Composite Score']} iconSize="w-3 h-3" />
          <span className={`text-lg font-black font-mono ${compositeColor}`}>
            {mrv.composite_score.toFixed(0)}
          </span>
          <span className="text-[10px] text-[#6B7A72] font-mono">/100</span>
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${badgeStyle}`}>
            {mrv.status}
          </span>
        </div>
      </div>

      {/* ── 2-column dimension grid ── */}
      <div className="grid grid-cols-2 gap-1.5">
        {dimensions.slice(0, 4).map((dim) => (
          <DimBar key={dim.label} dim={dim} tooltip={MRV_DIMENSION_TOOLTIPS[dim.label]} />
        ))}
        {/* Verification Readiness spans full width */}
        <div className="col-span-2">
          <DimBar dim={dimensions[4]} tooltip={MRV_DIMENSION_TOOLTIPS[dimensions[4].label]} />
        </div>
      </div>

      {/* ── Disclaimer ── */}
      <p className="text-[10px] text-[#6B7A72] mt-2 leading-snug">
        Analytical readiness score only — not a statutory ACVA audit certificate.
      </p>
    </div>
  );
}

function DimBar({ dim, tooltip }: { dim: { label: string; score: number }; tooltip: string }) {
  return (
    <div className="bg-[#F6F8F7] px-2.5 py-2 rounded-lg border border-[#E4E9E6]/80">
      <div className="flex justify-between items-center text-[10px] mb-1">
        <span className="text-[#4B5A54] flex items-center gap-1 leading-tight">
          <span className="truncate max-w-[90px]" title={dim.label}>{dim.label}</span>
          <InfoTooltip content={tooltip} iconSize="w-2.5 h-2.5" />
        </span>
        <span
          className="font-mono font-bold flex-shrink-0"
          style={{ color: DIM_COLOR(dim.score) }}
        >
          {dim.score.toFixed(0)}%
        </span>
      </div>
      <div className="w-full bg-white border border-[#E4E9E6] rounded-full h-1 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${DIM_TRACK(dim.score)}`}
          style={{ width: `${Math.min(100, Math.max(0, dim.score))}%` }}
        />
      </div>
    </div>
  );
}
