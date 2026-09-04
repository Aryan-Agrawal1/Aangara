'use client';

import React, { useState } from 'react';
import { ManagementObjectiveType, MANAGEMENT_OBJECTIVE_LABELS } from '@/lib/store';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface ManagementObjectiveSelectorProps {
  value: ManagementObjectiveType;
  onChange: (objective: ManagementObjectiveType) => void;
  className?: string;
}

export function ManagementObjectiveSelector({ value, onChange, className = '' }: ManagementObjectiveSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const current = MANAGEMENT_OBJECTIVE_LABELS[value];

  return (
    <div className={`relative ${className}`}>
      <div className="bg-[#F6F8F7]/70 p-3.5 rounded-lg border border-[#E4E9E6]/80">
        <div className="flex justify-between items-center text-xs mb-2">
          <span className="text-[#4B5A54] font-medium flex items-center space-x-1.5">
            <span>Management Objective</span>
            <span
              className="px-1 py-0.5 rounded text-[8px] bg-[#EBF3FB] text-[#2E6BA8] border border-[#2E6BA8]/30 uppercase tracking-wider"
              title="Defines how the optimizer weights Cost vs Climate vs Risk vs Speed when ranking strategies"
            >
              Strategy
            </span>
          </span>
          <span
            className="text-[#2E6BA8] cursor-help"
            title="The management objective shifts how the Capital Optimizer weights financial cost, CO₂ reduction, execution risk, compliance speed, and MRV quality when ranking BUY / BUILD / HYBRID."
          >
            <HelpCircle className="w-3 h-3" />
          </span>
        </div>

        {/* Dropdown trigger */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between bg-white border border-[#E4E9E6] rounded-md px-3 py-2 text-xs font-medium text-[#10231C] hover:border-[#2E6BA8]/40 transition-colors cursor-pointer"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-label="Select management objective"
        >
          <span className="flex items-center space-x-2">
            <span className="text-sm">{current.icon}</span>
            <span className="font-semibold">{current.label}</span>
          </span>
          <ChevronDown className={`w-3.5 h-3.5 text-[#6B7A72] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Current description */}
        <p className="text-[10px] text-[#6B7A72] mt-1.5 leading-relaxed">{current.description}</p>

        {/* Dropdown panel */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E4E9E6] rounded-lg shadow-xl z-50 overflow-hidden">
            {(Object.entries(MANAGEMENT_OBJECTIVE_LABELS) as [ManagementObjectiveType, typeof MANAGEMENT_OBJECTIVE_LABELS[ManagementObjectiveType]][]).map(([key, meta]) => (
              <button
                key={key}
                type="button"
                onClick={() => { onChange(key); setIsOpen(false); }}
                className={`w-full text-left px-3 py-2.5 text-xs hover:bg-[#F6F8F7] transition-colors border-b border-[#E4E9E6]/50 last:border-0 cursor-pointer ${
                  key === value ? 'bg-[#E8F5EE] text-[#0B4A3D]' : 'text-[#10231C]'
                }`}
                aria-selected={key === value}
              >
                <div className="flex items-start space-x-2">
                  <span className="text-sm mt-0.5 flex-shrink-0">{meta.icon}</span>
                  <div>
                    <div className="font-semibold">{meta.label}</div>
                    <div className="text-[10px] text-[#6B7A72] mt-0.5 leading-relaxed">{meta.description}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
