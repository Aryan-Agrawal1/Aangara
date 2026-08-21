'use client';

import React, { useState } from 'react';
import { DecisionTwinData } from '@/lib/types';
import { Sparkles, FileText, CheckCircle2, AlertTriangle, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';
import { getAIExplanation } from '@/lib/api';

interface ExplainabilityCardProps {
  decisionData: DecisionTwinData;
  onOpenSourceTrace: () => void;
}

export function ExplainabilityCard({ decisionData, onOpenSourceTrace }: ExplainabilityCardProps) {
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<any | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleGenerateAIExecutiveSummary = async () => {
    setIsAiLoading(true);
    try {
      const res = await getAIExplanation(
        decisionData.entity_id,
        decisionData.reporting_year,
        decisionData
      );
      setAiResponse(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="glass-panel rounded-xl p-5 mt-6 border-[#E4E9E6]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-lg bg-white border border-[#E4E9E6] border border-[#E4E9E6] text-[#1F8A5F]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white tracking-tight">Explainability & Decision Provenance</h3>
            <p className="text-xs text-[#4B5A54]">Audit-ready mathematical causality and regulatory citation trace</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleGenerateAIExecutiveSummary}
            disabled={isAiLoading}
            className="text-xs font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-3 py-1.5 rounded-lg flex items-center space-x-1.5 shadow-sm transition-all disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isAiLoading ? 'Synthesizing...' : 'Generate AI Executive Narrative'}</span>
          </button>
        </div>
      </div>

      {/* Core Deterministic Reason */}
      <div className="bg-[#F6F8F7] rounded-lg p-4 border border-[#E4E9E6] text-xs text-[#4B5A54] leading-relaxed">
        <div className="font-semibold text-white mb-1.5 flex items-center space-x-1.5">
          <CheckCircle2 className="w-4 h-4 text-[#1F8A5F]" />
          <span>Why {decisionData.recommended_strategy} Strategy Ranked #1:</span>
        </div>
        <p>{decisionData.recommendation_reason}</p>

        {/* AI synthesized expansion if available */}
        {aiResponse && (
          <div className="mt-3 pt-3 border-t border-[#E4E9E6] text-[#10231C]">
            <div className="flex items-center space-x-1.5 text-[#0B4A3D] font-semibold mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Executive Briefing ({aiResponse.service_status}):</span>
            </div>
            <p className="whitespace-pre-line text-[11px] leading-relaxed text-[#4B5A54]">
              {aiResponse.narrative}
            </p>
          </div>
        )}
      </div>

      {/* Anomaly Intelligence Banner */}
      {decisionData.anomaly_intelligence && (
        <div className={`mt-3 p-3 rounded-lg border text-xs flex items-center justify-between ${
          decisionData.anomaly_intelligence.anomaly_detected
            ? 'bg-[#FEF7E8] border-amber-800/60 text-[#C98A1E]'
            : 'bg-[#F6F8F7] border-[#E4E9E6]/80 text-[#4B5A54]'
        }`}>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-[#1F8A5F] flex-shrink-0" />
            <span>
              <strong>Data Quality Intelligence:</strong> {decisionData.anomaly_intelligence.reason_codes[0]}
            </span>
          </div>
          <span className="text-[10px] font-mono opacity-75">
            {decisionData.anomaly_intelligence.status}
          </span>
        </div>
      )}
    </div>
  );
}
