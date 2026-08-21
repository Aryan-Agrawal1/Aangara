"use client";
import React from "react";
import { AlertTriangle, RefreshCcw, WifiOff } from "lucide-react";
export function ErrorState({ title = "Unable to Load Data", message = "The backend API is temporarily unavailable.", onRetry, type = "error" }: { title?: string; message?: string; onRetry?: () => void; type?: "backend" | "empty" | "error"; }) {
  const Icon = type === "backend" ? WifiOff : AlertTriangle;
  return (
    <div className="flex flex-col items-center justify-center min-h-[320px] p-8 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#FDECEA] border border-[#C33B2E]/20 flex items-center justify-center mb-4">
        <Icon className="w-7 h-7 text-[#C33B2E]" />
      </div>
      <h3 className="text-lg font-semibold text-[#10231C] mb-2">{title}</h3>
      <p className="text-sm text-[#4B5A54] max-w-sm mb-6">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="flex items-center gap-2 px-4 py-2 bg-[#F6F8F7] hover:bg-[#E4E9E6] text-[#10231C] rounded-lg text-sm font-medium transition-colors border border-[#E4E9E6]">
          <RefreshCcw className="w-4 h-4" />Retry
        </button>
      )}
    </div>
  );
}