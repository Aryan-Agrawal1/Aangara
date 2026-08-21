'use client';
import React from 'react';

export type StatusType = 'FACT' | 'CALCULATION' | 'MODEL' | 'SCENARIO' | 'SYNTHETIC';

const STATUS_CONFIG: Record<StatusType, { label: string; bg: string; text: string; border: string; description: string }> = {
  FACT: { label: 'FACT', bg: 'bg-blue-950/60', text: 'text-blue-400', border: 'border-blue-700/40', description: 'Verified government-published data' },
  CALCULATION: { label: 'CALC', bg: 'bg-emerald-950/60', text: 'text-emerald-400', border: 'border-emerald-700/40', description: 'Deterministic engine output' },
  MODEL: { label: 'MODEL', bg: 'bg-purple-950/60', text: 'text-purple-400', border: 'border-purple-700/40', description: 'ML model prediction' },
  SCENARIO: { label: 'SCENARIO', bg: 'bg-amber-950/60', text: 'text-amber-400', border: 'border-amber-700/40', description: 'Stress-test scenario' },
  SYNTHETIC: { label: 'SYNTHETIC', bg: 'bg-slate-800/60', text: 'text-slate-400', border: 'border-slate-600/40', description: 'Synthetic demonstration data' },
};

interface StatusBadgeProps {
  type: StatusType;
  size?: 'xs' | 'sm';
  className?: string;
}

export function StatusBadge({ type, size = 'xs', className = '' }: StatusBadgeProps) {
  const config = STATUS_CONFIG[type];
  return (
    <span
      title={config.description}
      className={`inline-flex items-center font-mono font-bold tracking-wider border rounded px-1.5 py-0.5 ${
        size === 'xs' ? 'text-[9px]' : 'text-[10px]'
      } ${config.bg} ${config.text} ${config.border} ${className}`}
    >
      {config.label}
    </span>
  );
}
