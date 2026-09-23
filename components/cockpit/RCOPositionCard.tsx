'use client';

import React from 'react';
import { Sun, Wind, Zap, AlertTriangle, CheckCircle, AlertCircle, Info, ExternalLink, TrendingUp } from 'lucide-react';
import { InfoTooltip } from '@/components/ui/InfoTooltip';
import { RCOPosition } from '@/lib/types';
import { RCOEngine } from '@/lib/engines/rco';

interface RCOPositionCardProps {
  entity_id?: string;
  sector?: string;
  reporting_year?: string;
  rco_profile?: {
    current_renewable_mwh: number;
    current_total_energy_mwh: number;
    current_renewable_share_pct: number;
    obligation_target_pct: number;
    obligation_year: number;
    solar_sub_target_pct: number;
    wind_sub_target_pct: number;
    non_solar_sub_target_pct: number;
    obligation_source: string;
    obligation_source_url: string;
    obligation_status: string;
    entity_type: string;
    applicable_serc: string;
    rec_balance_mwh?: number;
  };
  state?: string;
  data_status?: string;
}

const STATUS_CONFIG = {
  COMPLIANT:       { label: 'Compliant', color: '#0B4A3D', bg: '#E8F5EE', border: '#0B4A3D', icon: CheckCircle },
  MARGINAL:        { label: 'Marginal',  color: '#C98A1E', bg: '#FEF7E8', border: '#C98A1E', icon: AlertCircle },
  DEFICIT:         { label: 'Deficit',   color: '#C33B2E', bg: '#FDECEA', border: '#C33B2E', icon: AlertTriangle },
  SEVERE_DEFICIT:  { label: 'Severe Deficit', color: '#991B1B', bg: '#FEE2E2', border: '#991B1B', icon: AlertTriangle },
};

const OBLIGATION_STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  FINAL_NOTIFICATION: { label: 'Final', color: '#0B4A3D' },
  DRAFT_TRAJECTORY:   { label: 'Draft Trajectory', color: '#C98A1E' },
  WATCHLIST:          { label: 'Watchlist', color: '#2E6BA8' },
  UNKNOWN:            { label: 'Unknown', color: '#6B7A72' },
};

// Default demo profile for when no entity data is loaded yet
const DEFAULT_PROFILE = {
  current_renewable_mwh: 10200,
  current_total_energy_mwh: 81600,
  current_renewable_share_pct: 12.5,
  obligation_target_pct: 25.0,
  obligation_year: 2026,
  solar_sub_target_pct: 10.0,
  wind_sub_target_pct: 6.0,
  non_solar_sub_target_pct: 9.0,
  obligation_source: 'MNRE RPO Trajectory Order 2022',
  obligation_source_url: 'https://mnre.gov.in/orders/rpo-order-2022/',
  obligation_status: 'DRAFT_TRAJECTORY',
  entity_type: 'OPEN_ACCESS_CONSUMER',
  applicable_serc: 'RERC (Rajasthan)',
  rec_balance_mwh: 500,
};

export function RCOPositionCard({ entity_id = 'SYN-CEM-001', sector = 'cement', reporting_year = '2025-26', rco_profile, state = 'Rajasthan', data_status = 'SYNTHETIC' }: RCOPositionCardProps) {
  const profile = rco_profile ?? DEFAULT_PROFILE;

  const position = RCOEngine.computePosition(
    entity_id, sector, reporting_year,
    { ...profile, obligation_status: profile.obligation_status as any, entity_type: profile.entity_type as any },
    state,
    data_status as any,
  );

  const cfg = STATUS_CONFIG[position.compliance_status] ?? STATUS_CONFIG.DEFICIT;
  const StatusIcon = cfg.icon;
  const progressPct = Math.min(100, (profile.current_renewable_share_pct / position.profile.obligation_target_pct) * 100);
  const obligationCfg = OBLIGATION_STATUS_CONFIG[profile.obligation_status] ?? OBLIGATION_STATUS_CONFIG.UNKNOWN;

  return (
    <div className="bg-white rounded-2xl border border-[#E4E9E6] overflow-hidden shadow-sm" data-autopilot="rco-card">
      {/* Header */}
      <div className="px-5 py-3.5 flex items-center justify-between border-b border-[#E4E9E6]">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-[#FEF7E8] border border-[#C98A1E]/20">
            <Sun className="w-4 h-4 text-[#C98A1E]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-[#10231C]">Renewable Consumption Obligation</h3>
              <InfoTooltip content="Renewable Consumption Obligation (RCO): The percentage of total energy consumption that must come from renewable sources, mandated by MNRE's RPO Trajectory 2022-2030. Sector-specific targets apply. Non-compliance attracts SERC surcharge." />
            </div>
            <p className="text-xs text-[#6B7A72] mt-0.5">RCO Position — {reporting_year}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border" style={{ color: obligationCfg.color, borderColor: `${obligationCfg.color}40`, background: `${obligationCfg.color}10` }}>{obligationCfg.label}</span>
          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#F6F8F7] border border-[#E4E9E6] text-[#6B7A72]">{data_status}</span>
        </div>
      </div>

      <div className="p-5">
        {/* Status badge + main numbers */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border mb-2" style={{ color: cfg.color, background: cfg.bg, borderColor: `${cfg.border}50` }}>
              <StatusIcon className="w-3.5 h-3.5" />
              <span className="text-xs font-bold">{cfg.label}</span>
            </div>
            <p className="text-3xl font-black text-[#10231C] font-mono">{profile.current_renewable_share_pct.toFixed(1)}<span className="text-base font-normal text-[#6B7A72] ml-1">%</span></p>
            <p className="text-xs text-[#6B7A72] mt-0.5">Current RE share of energy mix</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-[#6B7A72] flex items-center gap-1 justify-end">Target <InfoTooltip content={`MNRE RPO Trajectory target for ${reporting_year}. Source: ${profile.obligation_source}. Status: ${profile.obligation_status}.`} iconSize="w-2.5 h-2.5" /></p>
            <p className="text-2xl font-black text-[#C98A1E] font-mono">{profile.obligation_target_pct.toFixed(0)}<span className="text-sm font-normal ml-0.5">%</span></p>
            <p className="text-[9px] text-[#6B7A72] mt-0.5">{position.gap_pct_points > 0 ? `${position.gap_pct_points.toFixed(1)} pp gap` : 'Gap closed ✓'}</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] text-[#6B7A72] font-mono">Progress to RCO Target</span>
            <span className="text-[10px] font-bold font-mono" style={{ color: cfg.color }}>{progressPct.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-[#F6F8F7] rounded-full h-3 border border-[#E4E9E6] overflow-hidden relative">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progressPct}%`, background: progressPct >= 100 ? '#0B4A3D' : progressPct >= 70 ? '#C98A1E' : '#C33B2E' }} />
            {/* Target marker */}
            <div className="absolute top-0 bottom-0 w-px bg-[#0B4A3D]" style={{ left: '100%' }} />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[9px] text-[#6B7A72]">0%</span>
            <span className="text-[9px] text-[#0B4A3D] font-bold">Target: {profile.obligation_target_pct}%</span>
          </div>
        </div>

        {/* Key metrics grid */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-[#F6F8F7] rounded-xl p-3 border border-[#E4E9E6]">
            <div className="flex items-center gap-1 mb-1">
              <Zap className="w-3 h-3 text-[#6B7A72]" />
              <p className="text-[9px] text-[#6B7A72] font-mono uppercase">Current RE</p>
              <InfoTooltip content="Current renewable energy consumption (MWh/year) from all sources: captive solar/wind, open access, PPAs, rooftop solar, green tariff." iconSize="w-2 h-2" />
            </div>
            <p className="text-sm font-black text-[#10231C] font-mono">{(profile.current_renewable_mwh / 1000).toFixed(1)}k</p>
            <p className="text-[9px] text-[#6B7A72]">MWh/yr</p>
          </div>
          <div className="bg-[#FEF7E8]/60 rounded-xl p-3 border border-[#C98A1E]/20">
            <div className="flex items-center gap-1 mb-1">
              <TrendingUp className="w-3 h-3 text-[#C98A1E]" />
              <p className="text-[9px] text-[#C98A1E] font-mono uppercase">RCO Obligation</p>
              <InfoTooltip content="Minimum renewable MWh that must be consumed to meet the RCO target. = (Target% / 100) × Total Energy MWh." iconSize="w-2 h-2" />
            </div>
            <p className="text-sm font-black text-[#C98A1E] font-mono">{(position.obligation_target_mwh / 1000).toFixed(1)}k</p>
            <p className="text-[9px] text-[#C98A1E]">MWh/yr required</p>
          </div>
          <div className={`rounded-xl p-3 border ${position.gap_mwh > 0 ? 'bg-[#FDECEA]/60 border-[#C33B2E]/20' : 'bg-[#E8F5EE] border-[#0B4A3D]/20'}`}>
            <div className="flex items-center gap-1 mb-1">
              <AlertTriangle className="w-3 h-3" style={{ color: position.gap_mwh > 0 ? '#C33B2E' : '#0B4A3D' }} />
              <p className="text-[9px] font-mono uppercase" style={{ color: position.gap_mwh > 0 ? '#C33B2E' : '#0B4A3D' }}>Gap / Surplus</p>
            </div>
            <p className="text-sm font-black font-mono" style={{ color: position.gap_mwh > 0 ? '#C33B2E' : '#0B4A3D' }}>{position.gap_mwh > 0 ? '' : '+'}{(-(position.gap_mwh - 0)).toFixed(0) === '0' ? `+${(profile.current_renewable_mwh - position.obligation_target_mwh).toFixed(0)}` : `-${position.gap_mwh.toFixed(0)}`}</p>
            <p className="text-[9px]" style={{ color: position.gap_mwh > 0 ? '#C33B2E' : '#0B4A3D' }}>MWh {position.gap_mwh > 0 ? 'deficit' : 'surplus'}</p>
          </div>
        </div>

        {/* Sub-target breakdown */}
        <div className="bg-[#F6F8F7] rounded-xl p-3 border border-[#E4E9E6] mb-3">
          <p className="text-[10px] font-semibold text-[#10231C] mb-2 flex items-center gap-1">
            Sub-target breakdown
            <InfoTooltip content="MNRE RPO trajectory specifies separate sub-targets for solar, wind, and non-solar renewable sources. An entity must meet each sub-target independently, not just the aggregate." />
          </p>
          <div className="flex gap-4 text-xs">
            {[
              { label: 'Solar', icon: Sun, target: profile.solar_sub_target_pct, color: '#C98A1E' },
              { label: 'Wind', icon: Wind, target: profile.wind_sub_target_pct, color: '#2E6BA8' },
              { label: 'Other RE', icon: Zap, target: profile.non_solar_sub_target_pct, color: '#0B4A3D' },
            ].map(t => (
              <div key={t.label} className="flex items-center gap-1.5">
                <t.icon className="w-3 h-3 flex-shrink-0" style={{ color: t.color }} />
                <span className="text-[#6B7A72]">{t.label}:</span>
                <span className="font-mono font-bold" style={{ color: t.color }}>{t.target}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Penalty estimate */}
        {position.gap_mwh > 0 && (
          <div className="flex items-start gap-2 bg-[#FDECEA]/40 rounded-xl p-3 border border-[#C33B2E]/20">
            <AlertTriangle className="w-3.5 h-3.5 text-[#C33B2E] flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold text-[#C33B2E]">Estimated SERC Non-Compliance Surcharge</p>
              <p className="text-base font-black text-[#C33B2E] font-mono">₹{position.estimated_penalty_cr.toFixed(2)} Cr</p>
              <p className="text-[9px] text-[#4B5A54] mt-0.5">@ ₹{position.penalty_rate_inr_per_kwh}/kWh ({profile.applicable_serc}). REC balance: {profile.rec_balance_mwh ?? 0} MWh after balance. <a href={profile.obligation_source_url} target="_blank" rel="noopener noreferrer" className="text-[#2E6BA8] underline inline-flex items-center gap-0.5">Source <ExternalLink className="w-2.5 h-2.5" /></a></p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
