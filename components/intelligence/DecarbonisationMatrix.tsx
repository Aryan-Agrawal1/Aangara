'use client';

import { ClientChartWrapper } from "@/components/ui/ClientChartWrapper";
import React, { useState } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { formatCurrencyCr, formatEmissions, formatPricePerTonne, formatYears } from '@/lib/formatters';
import {
  Zap,
  Clock,
  FileCheck,
  BarChart2,
  Filter,
  HelpCircle
} from 'lucide-react';

interface DecarbonisationMatrixProps {
  opportunities: any[];
}

const getPaybackTier = (paybackYears: number) => {
  if (paybackYears <= 2.5) {
    return {
      id: 'fast',
      label: 'Fast Payback (< 2.5 yrs)',
      shortLabel: '< 2.5 yrs',
      color: '#10b981', // emerald-500
      badgeBg: 'bg-[#E8F5EE] text-[#1F4D2E] border-[#1F4D2E]/25',
      pillColor: 'bg-emerald-500'
    };
  }
  if (paybackYears <= 4.5) {
    return {
      id: 'medium',
      label: 'Medium Payback (2.5 – 4.5 yrs)',
      shortLabel: '2.5 - 4.5 yrs',
      color: '#0284c7', // sky-600
      badgeBg: 'bg-[#EBF3FB] text-[#2E6BA8] border-[#2E6BA8]/25',
      pillColor: 'bg-sky-600'
    };
  }
  return {
    id: 'strategic',
    label: 'Strategic / Long-Term (> 4.5 yrs)',
    shortLabel: '> 4.5 yrs',
    color: '#d97706', // amber-600
    badgeBg: 'bg-[#FEF7E8] text-[#C98A1E] border-[#C98A1E]/30',
    pillColor: 'bg-amber-600'
  };
};

export function DecarbonisationMatrix({ opportunities }: DecarbonisationMatrixProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  if (!opportunities || opportunities.length === 0) return null;

  // Extract unique categories for filtering
  const categories = ['ALL', ...Array.from(new Set(opportunities.map((o) => o.category)))];

  // Filtered opportunities
  const filteredOpps = selectedCategory === 'ALL'
    ? opportunities
    : opportunities.filter((o) => o.category === selectedCategory);

  // Transform opportunities data for Recharts Scatter/Bubble Chart
  const scatterData = filteredOpps.map((opp, idx) => {
    const abatementKt = Number(((opp.annual_reduction_tco2e || 0) / 1000).toFixed(1));
    const baseTimeline = opp.implementation_months || opp.timeline_months || 12;
    const timeline = baseTimeline + (idx * 0.15);
    const npv = opp.npv_10yr_cr || 0;
    const capex = opp.capex_cr || 0;
    const payback = opp.payback_years || 0;
    const tier = getPaybackTier(payback);

    return {
      id: opp.opportunity_id || `opp-${idx}`,
      title: opp.title,
      category: opp.category,
      timeline,
      abatement_kt: abatementKt,
      abatement_tco2e: opp.annual_reduction_tco2e,
      npv_cr: npv,
      capex_cr: capex,
      opex_change_cr: opp.annual_opex_change_cr || 0,
      energy_savings_cr: opp.annual_energy_savings_cr || 0,
      payback_years: payback,
      cost_per_tco2e_inr: opp.cost_per_tco2e_inr,
      methodology: opp.applicable_methodology || 'BEE Compliance Pathway',
      mrv_complexity: opp.mrv_complexity || 'MEDIUM',
      confidence_tier: opp.confidence_tier || 'CALIBRATED',
      tierLabel: tier.label,
      color: tier.color,
      zScore: Math.max(10, Math.min(100, Math.abs(npv) * 2 + 20))
    };
  });

  // Custom 2D Scatter Tooltip
  const CustomScatterTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;
    const d = payload[0].payload;
    const tier = getPaybackTier(d.payback_years);

    return (
      <div className="bg-white border border-[#E8E2DC] rounded-xl p-4 text-xs shadow-2xl max-w-sm z-50 pointer-events-none">
        <div className="flex items-center justify-between gap-2 mb-2">

          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#E8F2EB] text-[#1F4D2E] border border-[#1F4D2E]/25">
            {d.category}
          </span>
          <span
            className="text-[10px] font-mono font-bold px-2 py-0.5 rounded text-white"
            style={{ backgroundColor: tier.color }}
          >
            {tier.shortLabel}
          </span>
        </div>

        <div className="font-bold text-[#1A1C18] mb-2 leading-snug text-xs">{d.title}</div>

        <div className="space-y-1.5 font-mono text-[11px] bg-[#F6F8F7] p-2.5 rounded-lg border border-[#E8E2DC]">
          <div className="flex justify-between text-[#4A5446]">
            <span>Annual Abatement:</span>
            <span className="text-[#1F4D2E] font-bold">
              {d.abatement_kt} kt/yr ({formatEmissions(d.abatement_tco2e)})
            </span>
          </div>
          <div className="flex justify-between text-[#4A5446]">
            <span>Implementation Timeline:</span>
            <span className="text-[#2E6BA8] font-semibold">{d.timeline.toFixed(0)} months</span>
          </div>
          <div className="flex justify-between text-[#4A5446]">
            <span>10-Yr NPV @ 9.5%:</span>
            <span className="text-[#1F4D2E] font-bold">{formatCurrencyCr(d.npv_cr)}</span>
          </div>
          <div className="flex justify-between text-[#4A5446]">
            <span>Capital Cost (CAPEX):</span>
            <span className="text-[#1A1C18] font-semibold">{formatCurrencyCr(d.capex_cr)}</span>
          </div>
          <div className="flex justify-between text-[#4A5446]">
            <span>Capital Payback:</span>
            <span className="text-[#1A1C18] font-semibold">{formatYears(d.payback_years)}</span>
          </div>
          {d.cost_per_tco2e_inr !== undefined && (
            <div className="flex justify-between text-[#4A5446] pt-1 border-t border-[#E8E2DC]">
              <span>Abatement Cost / tCO₂e:</span>
              <span className="text-[#D9531E] font-semibold">{formatPricePerTonne(d.cost_per_tco2e_inr)}</span>
            </div>
          )}
        </div>

        <div className="mt-2 text-[10px] text-[#6B7268] font-mono flex items-center space-x-1.5">
          <FileCheck className="w-3.5 h-3.5 text-[#1F4D2E] flex-shrink-0" />
          <span className="truncate">{d.methodology}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="card-base rounded-xl border border-[#E8E2DC] overflow-hidden shadow-sm mt-6 space-y-6 pb-6 bg-white">
      {/* Header */}
      <div className="relative border-b border-[#E8E2DC] bg-[#F6F8F7]/50">
        <div className="relative z-10 p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-lg bg-[#E8F2EB] text-[#1F4D2E] border border-[#1F4D2E]/20 shadow-sm">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold text-[#1A1C18] tracking-tight">
                  Techno-Economic Decarbonisation Matrix
                </h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#E8F2EB] text-[#1F4D2E] border border-[#1F4D2E]/25">
                  CAPITAL ALLOCATION
                </span>
              </div>
              <p className="text-xs text-[#4A5446] mt-1 font-medium">
                Marginal Abatement & Feasibility Map: CAPEX, energy savings, payback period, 10-Yr NPV & BEE methodologies.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono font-bold px-3 py-1.5 rounded-md bg-white text-[#1A1C18] border border-[#E8E2DC] shadow-sm">
              {opportunities.length} VALIDATED INITIATIVES
            </span>
          </div>
        </div>
      </div>

      <div className="px-5 sm:px-6 space-y-6">

        {/* 2D Recharts Marginal Abatement & Feasibility Map */}
        <div className="bg-[#F6F8F7] rounded-xl p-4 sm:p-5 border border-[#E8E2DC]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 pb-3 border-b border-[#E8E2DC] gap-2">
            <div>
              <h4 className="text-sm font-bold text-[#1A1C18] flex items-center space-x-2">
                <BarChart2 className="w-4 h-4 text-[#1F4D2E]" />
                <span>Decarbonisation Marginal Abatement & Feasibility Map</span>
              </h4>
              <p className="text-[11px] text-[#6B7268] mt-0.5">
                X-axis: Timeline (Months) • Y-axis: Annual CO₂e Reduction (kt/yr) • Bubble Size: 10-Yr NPV (₹ Cr) • Color: Payback Tier
              </p>
            </div>

            {/* Payback Legend */}
            <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono">
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-[#4A5446]">Fast Payback (&lt; 2.5y)</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-600" />
                <span className="text-[#4A5446]">Medium (2.5-4.5y)</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
                <span className="text-[#4A5446]">Strategic (&gt; 4.5y)</span>
              </div>
            </div>
          </div>

          {/* Recharts Scatter/Bubble Chart Container */}
          <div className="w-full overflow-x-auto pb-2">
            <div className="h-72 min-w-[620px] w-full">
              <ClientChartWrapper>
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E8E2DC" />
                    <XAxis
                      type="number"
                      dataKey="timeline"
                      name="Implementation Timeline"
                      unit="m"
                      stroke="#6B7268"
                      tick={{ fill: '#4A5446', fontSize: 11 }}
                      label={{ value: 'Implementation Timeline (Months)', position: 'insideBottom', offset: -12, fill: '#1A1C18', fontSize: 11, fontWeight: 500 }}
                    />
                    <YAxis
                      type="number"
                      dataKey="abatement_kt"
                      name="Annual CO₂e Reduction"
                      unit=" kt"
                      stroke="#6B7268"
                      tick={{ fill: '#4A5446', fontSize: 11 }}
                      label={{ value: 'Annual CO₂e Reduction (kt/yr)', angle: -90, position: 'insideLeft', offset: 0, fill: '#1A1C18', fontSize: 11, fontWeight: 500 }}
                    />
                    <ZAxis
                      type="number"
                      dataKey="zScore"
                      range={[200, 1000]}
                      name="NPV Scale"
                    />
                    <Tooltip content={<CustomScatterTooltip />} cursor={{ strokeDasharray: '3 3', stroke: '#1F4D2E' }} />
                    <Scatter name="Projects" data={scatterData}>
                      {scatterData.map((entry) => (
                        <Cell
                          key={entry.id}
                          fill={entry.color}
                          stroke="#ffffff"
                          strokeWidth={2}
                          className="transition-all hover:opacity-90 hover:scale-110 cursor-pointer"
                        />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </ClientChartWrapper>
            </div>
          </div>
        </div>

        {/* Category Filter Chips */}
        {categories.length > 2 && (
          <div className="flex items-center space-x-2 overflow-x-auto pb-1">
            <span className="text-[11px] font-semibold text-[#4A5446] flex items-center space-x-1 flex-shrink-0">
              <Filter className="w-3 h-3 text-[#1F4D2E]" />
              <span>Filter by Category:</span>
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-3 py-1 rounded-full font-medium transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#1F4D2E] text-white font-bold shadow-sm'
                    : 'bg-[#F6F8F7] text-[#4A5446] hover:text-[#1A1C18] border border-[#E8E2DC]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Opportunity Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredOpps.map((opp) => {
            const tier = getPaybackTier(opp.payback_years || 0);

            return (
              <div
                key={opp.opportunity_id}
                className="bg-white rounded-xl p-5 border border-[#E8E2DC] hover:border-[#CFC8C2] transition-all flex flex-col justify-between shadow-sm hover:shadow-md"
              >
                <div>
                  {/* Header Badges */}
                  <div className="flex justify-between items-start mb-2.5 gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#E8F2EB] text-[#1F4D2E] border border-[#1F4D2E]/25">
                        {opp.category}
                      </span>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${tier.badgeBg}`}>
                        {tier.label}
                      </span>
                    </div>

                    <span className="text-xs font-mono text-[#1F4D2E] font-bold bg-[#E8F2EB] px-2.5 py-0.5 rounded border border-[#1F4D2E]/20 whitespace-nowrap">
                      -{formatEmissions(opp.annual_reduction_tco2e)}/yr
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-[#1A1C18] mb-1.5 leading-snug">{opp.title}</h4>
                  <p className="text-xs text-[#4A5446] leading-relaxed mb-4">{opp.description}</p>
                </div>

                <div>
                  {/* Financial & Engineering Metrics 6-Box Grid */}
                  <div className="bg-[#F6F8F7] rounded-xl p-3.5 border border-[#E8E2DC] text-xs font-mono grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-3">
                    <div className="bg-white p-2 rounded-lg border border-[#E8E2DC]">
                      <div className="text-[10px] text-[#6B7268] uppercase">CAPEX</div>
                      <div className="text-xs font-bold text-[#1A1C18] mt-0.5">{formatCurrencyCr(opp.capex_cr)}</div>
                    </div>

                    <div className="bg-white p-2 rounded-lg border border-[#E8E2DC]">
                      <div className="text-[10px] text-[#6B7268] uppercase">Net Energy Savings</div>
                      <div className="text-xs font-bold text-[#1F4D2E] mt-0.5">
                        {formatCurrencyCr(opp.annual_energy_savings_cr)}/yr
                      </div>
                    </div>

                    <div className="bg-white p-2 rounded-lg border border-[#E8E2DC]">
                      <div className="text-[10px] text-[#6B7268] uppercase">Capital Payback</div>
                      <div className="text-xs font-bold text-[#1A1C18] mt-0.5">{formatYears(opp.payback_years)}</div>
                    </div>

                    <div className="bg-white p-2 rounded-lg border border-[#E8E2DC]">
                      <div className="text-[10px] text-[#6B7268] uppercase flex items-center justify-between cursor-help" title="Net Present Value over 10 years, discounting future cash flows with WACC assumptions.">
                        <span>10-Yr NPV @ 9.5%</span>
                        <HelpCircle className="w-3 h-3 text-[#6B7268]" />
                      </div>
                      <div className="text-xs font-bold text-[#1F4D2E] mt-0.5">{formatCurrencyCr(opp.npv_10yr_cr)}</div>
                    </div>

                    <div className="bg-white p-2 rounded-lg border border-[#E8E2DC]">
                      <div className="text-[10px] text-[#6B7268] uppercase">OPEX Change</div>
                      <div className="text-xs font-bold text-[#4A5446] mt-0.5">
                        {formatCurrencyCr(opp.annual_opex_change_cr)}/yr
                      </div>
                    </div>

                    <div className="bg-white p-2 rounded-lg border border-[#E8E2DC]">
                      <div className="text-[10px] text-[#6B7268] uppercase">Abatement Cost</div>
                      <div className="text-xs font-bold text-[#D9531E] mt-0.5">
                        {opp.cost_per_tco2e_inr !== undefined ? formatPricePerTonne(opp.cost_per_tco2e_inr) : '—'}
                      </div>
                    </div>
                  </div>

                  {/* Regulatory, Methodology & MRV Footer */}
                  <div className="pt-2.5 border-t border-[#E8E2DC] flex flex-wrap justify-between items-center text-[11px] gap-2">
                    <div className="flex items-center space-x-1.5 text-[#4A5446]">
                      <FileCheck className="w-3.5 h-3.5 text-[#1F4D2E] flex-shrink-0" />
                      <span className="font-mono text-[#4A5446] truncate max-w-[240px]">
                        {opp.applicable_methodology || 'BEE Compliance Protocol'}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-[#4A5446] font-mono flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-[#6B7268]" />
                        <span>{opp.implementation_months || 12}m</span>
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-white border border-[#E8E2DC] text-[#4A5446]">
                        MRV: {opp.mrv_complexity || 'MEDIUM'}
                      </span>
                      {opp.confidence_tier && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-white text-[#1F4D2E] border border-[#1F4D2E]/25 flex items-center space-x-1 cursor-help" title="Confidence tier of the model. 'CALIBRATED' means tuned with industry parameters.">
                          <span>{opp.confidence_tier}</span>
                          <HelpCircle className="w-2.5 h-2.5 text-[#1F4D2E] opacity-80" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
