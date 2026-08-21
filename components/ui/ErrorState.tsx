'use client';
import React from 'react';
import { AlertTriangle, RefreshCcw, WifiOff } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  type?: 'backend' | 'empty' | 'error';
}

export function ErrorState({
  title = 'Unable to Load Data',
  message = 'The backend API is temporarily unavailable.',
  onRetry,
  type = 'error'
}: ErrorStateProps) {
  const Icon = type === 'backend' ? WifiOff : AlertTriangle;
  return (
    <div className="flex flex-col items-center justify-center min-h-[320px] p-8 text-center">
      <div className="w-16 h-16 rounded-2xl bg-red-950/40 border border-red-800/30 flex items-center justify-center mb-4">
        <Icon className="w-7 h-7 text-red-400" />
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-400 max-w-sm mb-6">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition-colors"
        >
          <RefreshCcw className="w-4 h-4" />
          Retry
        </button>
      )}
    </div>
  );
}
