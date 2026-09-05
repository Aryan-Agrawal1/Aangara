'use client';

/**
 * AANGARA Autopilot Context
 * Provides engine state + controls to all UI components (HUD, Spotlight, FAB).
 */
import React, { createContext, useContext, useCallback, useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AutopilotEngine, AutopilotStatus } from '@/lib/autopilot/engine';
import { AUTOPILOT_STEPS } from '@/lib/autopilot/steps';

interface AutopilotContextValue {
  status: AutopilotStatus;
  currentStep: number;
  totalSteps: number;
  stepLabel: string;
  spotlightSelector: string | null;
  start: () => void;
  pause: () => void;
  resume: () => void;
  skip: () => void;
  stop: () => void;
}

const AutopilotContext = createContext<AutopilotContextValue | null>(null);

export function useAutopilot() {
  const ctx = useContext(AutopilotContext);
  if (!ctx) throw new Error('useAutopilot must be used inside AutopilotProvider');
  return ctx;
}

export function AutopilotProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const engineRef = useRef<AutopilotEngine | null>(null);

  const [status, setStatus] = useState<AutopilotStatus>('idle');
  const [currentStep, setCurrentStep] = useState(0);
  const [stepLabel, setStepLabel] = useState('');
  const [spotlightSelector, setSpotlightSelector] = useState<string | null>(null);

  // Initialise engine once with stable navigate fn
  const getEngine = useCallback(() => {
    if (!engineRef.current) {
      const eng = new AutopilotEngine((path) => router.push(path));
      eng.onStatusChange = setStatus;
      eng.onStepChange = (idx, label) => { setCurrentStep(idx); setStepLabel(label); };
      eng.onSpotlight = setSpotlightSelector;
      engineRef.current = eng;
    }
    return engineRef.current;
  }, [router]);

  // Pause on any real user interaction while running
  useEffect(() => {
    const handleInteraction = () => {
      if (status === 'running') getEngine().pause();
    };
    // Only attach when tour is running to save performance
    if (status === 'running') {
      window.addEventListener('mousedown', handleInteraction, { capture: true, passive: true });
      window.addEventListener('keydown', handleInteraction, { capture: true, passive: true });
    }
    return () => {
      window.removeEventListener('mousedown', handleInteraction, { capture: true });
      window.removeEventListener('keydown', handleInteraction, { capture: true });
    };
  }, [status, getEngine]);

  const start   = useCallback(() => { getEngine().start(AUTOPILOT_STEPS); }, [getEngine]);
  const pause   = useCallback(() => { getEngine().pause(); }, [getEngine]);
  const resume  = useCallback(() => { getEngine().resume(); }, [getEngine]);
  const skip    = useCallback(() => { getEngine().skip(); }, [getEngine]);
  const stop    = useCallback(() => { getEngine().stop(); }, [getEngine]);

  return (
    <AutopilotContext.Provider value={{
      status, currentStep, totalSteps: AUTOPILOT_STEPS.length,
      stepLabel, spotlightSelector,
      start, pause, resume, skip, stop,
    }}>
      {children}
    </AutopilotContext.Provider>
  );
}
