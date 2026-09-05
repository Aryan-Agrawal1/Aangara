'use client';

import React from 'react';
import { ScenarioParams } from '@/lib/types';
import { Sliders, RotateCcw } from 'lucide-react';
import { useCurrency } from '@/lib/context/CurrencyContext';
import { ManagementObjectiveSelector } from '@/components/ui/ManagementObjectiveSelector';
import { ManagementObjectiveType } from '@/lib/store';
import { InfoTooltip } from '@/components/ui/InfoTooltip';

interface ScenarioSlidersProps {
  params: ScenarioParams;
  managementObjective?: ManagementObjectiveType;
  onChange: (newParams: ScenarioParams) => void;
  onObjectiveChange?: (objective: ManagementObjectiveType) => void;
  onReset: () => void;
  isSimulating?: boolean;
}

const TOOLTIPS = {
  ccc_price:
    'Prevailing market price per Carbon Credit Certificate (CCC) on the CCTS exchange. Range: ₹300/t (bear market) to ₹3,500/t (bull market). Directly controls the cost of the BUY strategy. Base assumption: ₹1,000/t based on PAT Credit historical range and MoPNG projections.',
  delivery:
    'The % of planned abatement output that your BUILD project actually delivers. 100% = on-spec performance. 50% = severe underperformance due to technology or execution failure. 130% = overperformance. Affects how much shortfall remains unresolved after the BUILD capex.',
  delay:
    'Additional months beyond the planned commissioning date. Every month of delay means your facility continues to operate above the GEI target — forcing CCC purchases in the interim period at prevailing market prices. Typical cause: equipment procurement, grid connection, regulatory approvals.',
  wacc:
    'Weighted Average Cost of Capital — the discount rate applied to all future cash flows when computing NPV and payback periods. Higher WACC raises the hurdle for capital-intensive BUILD projects relative to the BUY option. RBI policy-aligned; typical Indian industrial range: 9–14%.',
  objective:
    'Management Objective sets the optimization bias for the AANGARA Capital Optimizer. COST_MIN: minimize total lifecycle spend. CARBON_MIN: maximize GEI reduction. BALANCED: equal weight. RISK_MIN: minimize execution and regulatory risk. COMPLIANCE_FIRST: prioritize full compliance within shortest timeframe.',
};

export function ScenarioSliders({ params, managementObjective = 'BALANCED', onChange, onObjectiveChange, onReset }: ScenarioSlidersProps) {
  const { format, convert } = useCurrency();

  const handleSlider = (key: keyof ScenarioParams, value: number) => {
    onChange({ ...params, [key]: value });
  };

  return (
    <div className="glass-panel rounded-xl p-5 transition-all hover:border-[#E4E9E6]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-lg bg-white border border-[#E4E9E6] text-[#2E6BA8]">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#10231C] tracking-tight">Interactive Scenario Controls</h3>
            <p className="text-xs text-[#4B5A54]">Stress-test strategy rankings across core carbon-finance variables in real-time</p>
          </div>
        </div>

        <button
          onClick={onReset}
          className="text-xs text-[#4B5A54] hover:text-[#10231C] flex items-center space-x-1 bg-[#F6F8F7] hover:bg-white border border-[#E4E9E6] px-2.5 py-1 rounded transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* 5 Interactive Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">

        {/* Slider 1: CCC Price */}
        <div className="bg-[#F6F8F7]/70 p-3.5 rounded-lg border border-[#E4E9E6]/80">
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="text-[#4B5A54] font-medium flex items-center gap-1.5">
              <span>CCC Market Price</span>
              <InfoTooltip content={TOOLTIPS.ccc_price} iconSize="w-3 h-3" />
              <span className="px-1 py-0.5 rounded text-[8px] bg-[#FEF7E8] text-amber-500 border border-amber-900/50 uppercase tracking-wider">Assumption</span>
            </span>
            <span className="font-mono font-bold text-[#2E6BA8]">{convert(params.ccc_price_inr).formatted}/t</span>
          </div>
          <input
            type="range" min="300" max="3500" step="100"
            value={params.ccc_price_inr}
            onChange={(e) => handleSlider('ccc_price_inr', parseFloat(e.target.value))}
            aria-label="CCC Market Price"
            className="w-full h-1.5 bg-white border border-[#E4E9E6] rounded-lg appearance-none cursor-pointer accent-sky-500"
          />
          <div className="flex justify-between text-[10px] text-[#6B7A72] mt-1">
            <span>{format(300)} (Bear)</span>
            <span>{format(1000)} (Base)</span>
            <span>{format(3500)} (Bull)</span>
          </div>
        </div>

        {/* Slider 2: Project Delivery */}
        <div className="bg-[#F6F8F7]/70 p-3.5 rounded-lg border border-[#E4E9E6]/80">
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="text-[#4B5A54] font-medium flex items-center gap-1.5">
              <span>Project Delivery Rate</span>
              <InfoTooltip content={TOOLTIPS.delivery} iconSize="w-3 h-3" />
            </span>
            <span className="font-mono font-bold text-[#0B4A3D]">{params.project_output_pct.toFixed(0)}%</span>
          </div>
          <input
            type="range" min="50" max="130" step="5"
            value={params.project_output_pct}
            onChange={(e) => handleSlider('project_output_pct', parseFloat(e.target.value))}
            aria-label="Project Delivery Rate"
            className="w-full h-1.5 bg-white border border-[#E4E9E6] rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <div className="flex justify-between text-[10px] text-[#6B7A72] mt-1">
            <span>50% (Derated)</span>
            <span>100% (Nominal)</span>
            <span>130% (Surge)</span>
          </div>
        </div>

        {/* Slider 3: Delay */}
        <div className="bg-[#F6F8F7]/70 p-3.5 rounded-lg border border-[#E4E9E6]/80">
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="text-[#4B5A54] font-medium flex items-center gap-1.5">
              <span>Project Execution Delay</span>
              <InfoTooltip content={TOOLTIPS.delay} iconSize="w-3 h-3" />
            </span>
            <span className="font-mono font-bold text-[#C98A1E]">{params.project_delay_months} Months</span>
          </div>
          <input
            type="range" min="0" max="18" step="1"
            value={params.project_delay_months}
            onChange={(e) => handleSlider('project_delay_months', parseInt(e.target.value))}
            aria-label="Project Execution Delay"
            className="w-full h-1.5 bg-white border border-[#E4E9E6] rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <div className="flex justify-between text-[10px] text-[#6B7A72] mt-1">
            <span>0 Mo (On-Time)</span>
            <span>6 Mo</span>
            <span>18 Mo (Slippage)</span>
          </div>
        </div>

        {/* Slider 4: WACC */}
        <div className="bg-[#F6F8F7]/70 p-3.5 rounded-lg border border-[#E4E9E6]/80">
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="text-[#4B5A54] font-medium flex items-center gap-1.5">
              <span>Cost of Capital / WACC</span>
              <InfoTooltip content={TOOLTIPS.wacc} iconSize="w-3 h-3" />
            </span>
            <span className="font-mono font-bold text-[#0B4A3D]">{params.financing_rate_pct.toFixed(1)}%</span>
          </div>
          <input
            type="range" min="6.0" max="18.0" step="0.5"
            value={params.financing_rate_pct}
            onChange={(e) => handleSlider('financing_rate_pct', parseFloat(e.target.value))}
            aria-label="Cost of Capital"
            className="w-full h-1.5 bg-white border border-[#E4E9E6] rounded-lg appearance-none cursor-pointer accent-teal-500"
          />
          <div className="flex justify-between text-[10px] text-[#6B7A72] mt-1">
            <span>6.0% (Subsidised)</span>
            <span>9.5% (Base)</span>
            <span>18.0% (Tight)</span>
          </div>
        </div>

        {/* Control 5: Management Objective */}
        <div className="bg-[#F6F8F7]/70 p-3.5 rounded-lg border border-[#E4E9E6]/80">
          <div className="text-xs text-[#4B5A54] font-medium flex items-center gap-1.5 mb-1.5">
            <span>Management Objective</span>
            <InfoTooltip content={TOOLTIPS.objective} iconSize="w-3 h-3" />
          </div>
          <ManagementObjectiveSelector
            value={managementObjective}
            onChange={onObjectiveChange ?? (() => {})}
          />
        </div>

      </div>
    </div>
  );
}
