'use client';

import React from 'react';
import { MRVReadiness } from '@/lib/types';
import { ShieldCheck, CheckCircle2, AlertTriangle } from 'lucide-react';

interface MRVReadinessCardProps {
  mrv: MRVReadiness;
}

export function MRVReadinessCard({ mrv }: MRVReadinessCardProps) {
  const dimensions = [
    { label: 'Measurement Completeness', score: mrv.measurement_completeness },
    { label: 'Activity Data Integrity', score: mrv.activity_data_completeness },
    { label: 'Factor Traceability', score: mrv.factor_traceability },
    { label: 'Methodology Mapping', score: mrv.methodology_mapping },
    { label: 'Verification Readiness', score: mrv.verification_readiness },
  ];

  return (
    <div className="glass-panel rounded-xl p-5 relative overflow-hidden transition-all duration-300 hover:border-[#E4E9E6]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-lg bg-white border border-[#E4E9E6] border border-[#E4E9E6] text-[#0B4A3D]">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white tracking-tight">MRV & Evidence Readiness</h3>
            <p className="text-xs text-[#4B5A54]">5-Dimension Measurement, Reporting & Verification Quality</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono font-bold text-white px-2 py-0.5 rounded bg-white border border-[#E4E9E6] border border-[#E4E9E6]">
            {mrv.composite_score.toFixed(1)} / 100
          </span>
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${
            mrv.composite_score >= 80
              ? 'bg-[#E8F5EE]/70 text-[#1F8A5F] border-emerald-800/60'
              : 'bg-[#FEF7E8]/70 text-[#C98A1E] border-amber-800/60'
          }`}>
            {mrv.status}
          </span>
        </div>
      </div>

      {/* Progress Bars for 5 Dimensions */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 mt-3">
        {dimensions.map((dim, idx) => (
          <div key={idx} className="bg-[#F6F8F7] p-2.5 rounded-lg border border-[#E4E9E6]/80">
            <div className="flex justify-between items-center text-[11px] mb-1">
              <span className="text-[#4B5A54] truncate pr-1">{dim.label}</span>
              <span className="font-mono font-semibold text-white">{dim.score.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-white border border-[#E4E9E6] rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-500"
                style={{ width: `${dim.score}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-[10px] text-[#6B7A72] mt-3 flex items-center space-x-1">
        <span>Disclaimer: Proprietary analytical readiness assessment ? not a statutory BEE/ACVA audit certificate.</span>
      </div>
    </div>
  );
}
