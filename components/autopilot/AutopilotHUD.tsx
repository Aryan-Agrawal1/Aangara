'use client';

/**
 * AutopilotHUD — On-screen tour progress indicator
 * Styled with the existing AANGARA design system tokens.
 * Bottom-left corner, never covers content.
 */
import React from 'react';
import { PlayCircle, Pause, Play, SkipForward, X, Clapperboard } from 'lucide-react';
import { useAutopilot } from '@/lib/autopilot/context';

export function AutopilotHUD() {
  const { status, currentStep, totalSteps, stepLabel, pause, resume, skip, stop } = useAutopilot();

  if (status === 'idle') return null;

  const progress = totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0;
  const isPaused = status === 'paused';

  return (
    <div
      className="fixed bottom-24 left-4 z-50 w-[280px] bg-white border border-[#E4E9E6] rounded-xl shadow-[0_8px_32px_rgba(26,28,24,0.18)] overflow-hidden animate-in slide-in-from-bottom-3 fade-in duration-300"
      role="status"
      aria-live="polite"
      aria-label="Autopilot tour in progress"
    >
      {/* Header bar */}
      <div className="flex items-center justify-between px-3 py-2.5 bg-[#F6F8F7] border-b border-[#E4E9E6]">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isPaused ? 'bg-[#C98A1E]' : 'bg-[#1F8A5F] animate-pulse'}`} />
          <span className="text-[11px] font-bold text-[#1F4D2E] uppercase tracking-wider font-mono">
            {isPaused ? 'Paused' : 'Autopilot'}
          </span>
          <span className="text-[10px] text-[#6B7A72] font-mono">
            {currentStep + 1}/{totalSteps}
          </span>
        </div>
        <div className="flex items-center gap-0.5">
          <Clapperboard className="w-3.5 h-3.5 text-[#4B5A54]" />
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-[#E4E9E6] w-full">
        <div
          className="h-full bg-gradient-to-r from-[#1F4D2E] to-[#1F8A5F] transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Step label */}
      <div className="px-3 py-2.5">
        <p className="text-[11px] text-[#10231C] font-medium leading-snug line-clamp-2">
          {stepLabel || 'Starting tour…'}
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-1 px-3 pb-3">
        <button
          onClick={isPaused ? resume : pause}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#1F4D2E] hover:bg-[#27643A] text-white text-[11px] font-semibold transition-colors"
          title={isPaused ? 'Resume tour' : 'Pause tour'}
        >
          {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
          <span>{isPaused ? 'Resume' : 'Pause'}</span>
        </button>

        <button
          onClick={skip}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#F6F8F7] border border-[#E4E9E6] text-[#4B5A54] hover:text-[#10231C] hover:bg-[#E4E9E6] text-[11px] font-medium transition-colors"
          title="Skip to next step"
        >
          <SkipForward className="w-3 h-3" />
          <span>Skip</span>
        </button>

        <button
          onClick={stop}
          className="ml-auto flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#FDECEA] border border-[#C33B2E]/20 text-[#C33B2E] hover:bg-[#FDECEA]/80 text-[11px] font-medium transition-colors"
          title="Stop autopilot tour"
        >
          <X className="w-3 h-3" />
          <span>Stop</span>
        </button>
      </div>
    </div>
  );
}
