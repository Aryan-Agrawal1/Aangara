'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { WatchlistEntry, CCCScenarioPoint, OrderBlotterEntry } from '@/lib/types';
import { TrendingUp, TrendingDown, Minus, Activity, Search, Terminal as TerminalIcon, Clock, Zap, ShieldAlert, AlertTriangle, ChevronUp, ChevronDown, Wifi, WifiOff, Settings, RefreshCw, BarChart2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

// ── Design System (Terminal Mode) ─────────────────────────────────────────────
// Semantic colour palette — consistent with AANGARA cockpit semantics
const C = {
  surplus:  '#34D399', // green
  shortfall:'#F87171', // red
  marginal: '#FBBF24', // amber
  neutral:  '#94A3B8', // slate
  blue:     '#60A5FA', // analytical/source
  bg:       '#0A0E0B', // near-black with slight green tint
  surface:  '#0F1710', // panel bg
  border:   '#1C2B1F', // panel border
  text:     '#D1FAE5', // primary text
  muted:    '#6B7A72', // secondary text
};

function ComplianceDot({ status }: { status: WatchlistEntry['compliance_status'] }) {
  const col = status === 'SURPLUS' ? C.surplus : status === 'COMPLIANT' ? C.surplus : status === 'SHORTFALL' ? C.shortfall : '#EF4444';
  return <span className="w-2 h-2 rounded-full inline-block flex-shrink-0" style={{ backgroundColor: col }} />;
}

function SectorTickerItem({ entry }: { entry: WatchlistEntry }) {
  const isSurplus = entry.gei_delta <= 0;
  return (
    <span className="inline-flex items-center gap-2 mr-8 whitespace-nowrap">
      <span style={{ color: C.muted }} className="text-[10px] font-mono uppercase">{entry.sector.toUpperCase().slice(0, 6)}</span>
      <span style={{ color: isSurplus ? C.surplus : C.shortfall }} className="text-[10px] font-mono font-bold">
        GEI {isSurplus ? '▼' : '▲'}{Math.abs(entry.gei_delta).toFixed(3)}
      </span>
      <span style={{ color: C.muted }} className="text-[9px] font-mono">|</span>
      <span style={{ color: C.marginal }} className="text-[10px] font-mono">RCO {entry.rco_share_pct.toFixed(1)}%/{entry.rco_target_pct.toFixed(0)}%</span>
      <span style={{ color: C.muted }} className="text-[9px] font-mono">SCENARIO:</span>
    </span>
  );
}

const CCC_CHART_TOOLTIP = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="text-xs p-2 rounded-lg border" style={{ background: C.surface, borderColor: C.border, color: C.text }}>
      <p className="font-mono font-bold mb-1" style={{ color: C.muted }}>{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="font-mono" style={{ color: p.color }}>
          {p.name}: ₹{p.value.toLocaleString('en-IN')}/CCC
        </p>
      ))}
      <p className="text-[9px] mt-1" style={{ color: C.muted }}>DATA_STATUS: MODEL_ESTIMATE</p>
    </div>
  );
};

export default function TerminalPage() {
  const [data, setData] = useState<{ watchlist: WatchlistEntry[]; ccc_scenario_curve: CCCScenarioPoint[]; order_blotter: OrderBlotterEntry[]; regulatory_feed: any[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedEntity, setSelectedEntity] = useState<WatchlistEntry | null>(null);
  const [commandQuery, setCommandQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const tickerRef = useRef<HTMLDivElement>(null);
  const commandRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/terminal').then(r => r.json()).then(d => {
      setData(d.data);
      setSelectedEntity(d.data.watchlist[0]);
      setLoading(false);
    });
    const timer = setInterval(() => setSessionTime(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // Ticker scroll animation
  useEffect(() => {
    const el = tickerRef.current;
    if (!el) return;
    let pos = 0;
    const tick = () => {
      pos -= 0.5;
      if (pos < -el.scrollWidth / 2) pos = 0;
      el.style.transform = `translateX(${pos}px)`;
      requestAnimationFrame(tick);
    };
    const id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [data]);

  // Keyboard shortcut: / to focus command bar
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== commandRef.current) {
        e.preventDefault();
        commandRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const fmtTime = (s: number) => `${String(Math.floor(s / 3600)).padStart(2, '0')}:${String(Math.floor((s % 3600) / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const filtered = useMemo(() => {
    if (!data || !commandQuery) return data?.watchlist ?? [];
    const q = commandQuery.toLowerCase();
    return data.watchlist.filter(e => e.entity_name.toLowerCase().includes(q) || e.sector.toLowerCase().includes(q));
  }, [data, commandQuery]);

  const entity = selectedEntity;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: C.bg }}>
        <div className="text-center" style={{ color: C.text }}>
          <Activity className="w-8 h-8 mx-auto mb-3 animate-pulse" style={{ color: C.surplus }} />
          <p className="font-mono text-sm">INITIALISING AANGARA TERMINAL...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-mono select-none" style={{ background: C.bg, color: C.text }}>
      {/* ── TOP BAR ──────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-2 border-b" style={{ borderColor: C.border, background: C.surface }}>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#34D399] animate-pulse" />
            <span className="text-xs font-black tracking-widest" style={{ color: C.surplus }}>AANGARA</span>
            <span className="text-[9px] uppercase tracking-widest ml-1" style={{ color: C.muted }}>TERMINAL</span>
          </div>
          <span className="text-[9px] px-1.5 py-0.5 rounded border" style={{ color: C.marginal, borderColor: C.marginal, background: '#1F1500' }}>SCENARIO MODE — NO LIVE DATA</span>
        </div>
        {/* Command Bar */}
        <div className="relative flex-1 max-w-xs mx-4">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3" style={{ color: C.muted }} />
          <input
            ref={commandRef}
            value={commandQuery}
            onChange={e => { setCommandQuery(e.target.value); setShowDropdown(true); }}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
            placeholder="Search entity or sector... [press /]"
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded border focus:outline-none"
            style={{ background: C.bg, borderColor: showDropdown ? C.surplus : C.border, color: C.text }}
          />
          {showDropdown && filtered.length > 0 && (
            <div className="absolute top-full mt-1 left-0 right-0 z-50 rounded border overflow-hidden shadow-2xl" style={{ background: C.surface, borderColor: C.border }}>
              {filtered.map(e => (
                <button key={e.entity_id} onClick={() => { setSelectedEntity(e); setCommandQuery(''); setShowDropdown(false); }}
                  className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-white/5 transition-colors">
                  <ComplianceDot status={e.compliance_status} />
                  <span style={{ color: C.text }}>{e.entity_name}</span>
                  <span className="ml-auto text-[9px]" style={{ color: C.muted }}>{e.sector}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[9px] flex items-center gap-1.5" style={{ color: C.muted }}><Clock className="w-3 h-3" />SESSION {fmtTime(sessionTime)}</span>
          <span className="text-[9px] flex items-center gap-1.5" style={{ color: C.surplus }}><Wifi className="w-3 h-3" />LOCAL</span>
        </div>
      </div>

      {/* ── MAIN 3-COL GRID ───────────────────────────────────────────── */}
      <div className="flex-1 grid grid-cols-12 gap-px" style={{ background: C.border }}>

        {/* COL 1: Watchlist */}
        <div className="col-span-3 flex flex-col" style={{ background: C.surface }}>
          <div className="px-3 py-2 border-b flex items-center justify-between" style={{ borderColor: C.border }}>
            <span className="text-[9px] uppercase tracking-widest font-bold" style={{ color: C.muted }}>WATCHLIST — {data?.watchlist.length} ENTITIES</span>
          </div>
          <div className="flex-1 overflow-y-auto">
            {data?.watchlist.map(e => (
              <button key={e.entity_id} onClick={() => setSelectedEntity(e)}
                className="w-full px-3 py-2.5 border-b text-left flex flex-col gap-1 transition-colors hover:bg-white/5"
                style={{ borderColor: C.border, background: selectedEntity?.entity_id === e.entity_id ? '#1A2E1E' : 'transparent' }}>
                <div className="flex items-center gap-2 w-full">
                  <ComplianceDot status={e.compliance_status} />
                  <span className="text-[10px] font-bold truncate flex-1" style={{ color: C.text }}>{e.entity_name}</span>
                  <span className="text-[9px] font-bold flex-shrink-0 font-mono" style={{ color: e.gei_delta > 0 ? C.shortfall : C.surplus }}>
                    {e.gei_delta > 0 ? '+' : ''}{e.gei_delta.toFixed(3)}
                  </span>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <span className="text-[9px]" style={{ color: C.muted }}>{e.sector}</span>
                  <span className="text-[9px] font-mono" style={{ color: e.rco_share_pct >= e.rco_target_pct ? C.surplus : C.marginal }}>
                    RE {e.rco_share_pct}%/{e.rco_target_pct}%
                  </span>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <span className="text-[9px] font-mono" style={{ color: C.muted }}>CVS</span>
                  <div className="flex-1 bg-[#1C2B1F] rounded-full h-1">
                    <div className="h-full rounded-full transition-all" style={{ width: `${e.compliance_value_score}%`, background: e.compliance_value_score >= 70 ? C.surplus : e.compliance_value_score >= 50 ? C.marginal : C.shortfall }} />
                  </div>
                  <span className="text-[9px] font-mono font-bold" style={{ color: e.compliance_value_score >= 70 ? C.surplus : e.compliance_value_score >= 50 ? C.marginal : C.shortfall }}>{e.compliance_value_score}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* COL 2: CCC Scenario Curve + Compliance Value */}
        <div className="col-span-6 flex flex-col" style={{ background: C.surface }}>
          {/* CCC Curve */}
          <div className="flex-1 flex flex-col border-b" style={{ borderColor: C.border, minHeight: 0 }}>
            <div className="px-3 py-2 flex items-center justify-between flex-shrink-0">
              <div>
                <span className="text-[9px] uppercase tracking-widest font-bold" style={{ color: C.muted }}>CCC PRICE SCENARIO CURVE</span>
                <span className="ml-2 text-[9px] px-1.5 py-0.5 rounded border" style={{ color: C.marginal, borderColor: C.marginal, background: '#1F1500' }}>MODEL ESTIMATE — NOT LIVE MARKET DATA</span>
              </div>
              <span className="text-[9px]" style={{ color: C.muted }}>₹/CCC · FY26–FY30</span>
            </div>
            <div className="flex-1 px-2 pb-2" style={{ minHeight: 180 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data?.ccc_scenario_curve ?? []} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
                  <CartesianGrid strokeDasharray="2 4" stroke={C.border} />
                  <XAxis dataKey="year" tick={{ fill: C.muted, fontSize: 10, fontFamily: 'monospace' }} axisLine={{ stroke: C.border }} tickLine={false} />
                  <YAxis tick={{ fill: C.muted, fontSize: 10, fontFamily: 'monospace' }} axisLine={{ stroke: C.border }} tickLine={false} tickFormatter={v => `₹${v}`} />
                  <Tooltip content={<CCC_CHART_TOOLTIP />} />
                  <Legend wrapperStyle={{ fontSize: 9, color: C.muted, fontFamily: 'monospace' }} />
                  <Line type="monotone" dataKey="price_bull_inr" name="Bull" stroke={C.shortfall} strokeWidth={1.5} dot={{ r: 3, fill: C.shortfall }} strokeDasharray="4 2" />
                  <Line type="monotone" dataKey="price_base_inr" name="Base" stroke={C.surplus} strokeWidth={2} dot={{ r: 4, fill: C.surplus }} />
                  <Line type="monotone" dataKey="price_bear_inr" name="Bear" stroke={C.neutral} strokeWidth={1.5} dot={{ r: 3, fill: C.neutral }} strokeDasharray="4 2" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Compliance Value Score Breakdown */}
          {entity && (
            <div className="px-3 py-3 flex-shrink-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[9px] uppercase tracking-widest font-bold" style={{ color: C.muted }}>COMPLIANCE VALUE SCORE — {entity.entity_name}</span>
                <span className="text-[9px] font-mono font-black ml-auto" style={{ color: entity.compliance_value_score >= 70 ? C.surplus : entity.compliance_value_score >= 50 ? C.marginal : C.shortfall }}>{entity.compliance_value_score}/100</span>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {[
                  { label: 'Financial', val: entity.compliance_value_score + 5, w: 0.30, color: C.blue },
                  { label: 'CCTS Impact', val: entity.compliance_value_score - 10, w: 0.25, color: C.surplus },
                  { label: 'RCO Impact', val: entity.rco_share_pct >= entity.rco_target_pct ? 80 : 35, w: 0.20, color: C.marginal },
                  { label: 'Risk', val: 100 - entity.compliance_value_score * 0.4, w: 0.15, color: C.neutral },
                  { label: 'Timing', val: 70, w: 0.10, color: C.neutral },
                ].map(s => (
                  <div key={s.label} className="flex flex-col items-center gap-1">
                    <div className="w-full rounded h-12 flex items-end" style={{ background: C.bg }}>
                      <div className="w-full rounded transition-all" style={{ height: `${Math.min(100, Math.max(5, s.val))}%`, background: s.color, opacity: 0.85 }} />
                    </div>
                    <span className="text-[8px] text-center" style={{ color: C.muted }}>{s.label}</span>
                    <span className="text-[9px] font-mono font-bold" style={{ color: s.color }}>{s.val.toFixed(0)}</span>
                    <span className="text-[8px]" style={{ color: C.muted }}>{(s.w * 100).toFixed(0)}%wt</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* COL 3: Entity Position + News Feed */}
        <div className="col-span-3 flex flex-col" style={{ background: C.surface }}>
          {/* Entity Carbon Position */}
          {entity && (
            <div className="p-3 border-b" style={{ borderColor: C.border }}>
              <span className="text-[9px] uppercase tracking-widest font-bold block mb-2" style={{ color: C.muted }}>ENTITY CARBON POSITION</span>
              <p className="text-[10px] font-bold mb-3 leading-tight" style={{ color: C.text }}>{entity.entity_name}</p>
              <div className="space-y-2">
                <div>
                  <span className="text-[9px]" style={{ color: C.muted }}>ACTUAL GEI</span>
                  <p className="text-2xl font-black font-mono" style={{ color: entity.gei_delta > 0 ? C.shortfall : C.surplus }}>{entity.actual_gei.toFixed(3)}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-1.5 rounded" style={{ background: C.bg }}>
                    <p className="text-[8px]" style={{ color: C.muted }}>TARGET</p>
                    <p className="text-sm font-black font-mono" style={{ color: C.blue }}>{entity.target_gei.toFixed(3)}</p>
                  </div>
                  <div className="p-1.5 rounded" style={{ background: C.bg }}>
                    <p className="text-[8px]" style={{ color: C.muted }}>DELTA</p>
                    <p className="text-sm font-black font-mono" style={{ color: entity.gei_delta > 0 ? C.shortfall : C.surplus }}>{entity.gei_delta > 0 ? '+' : ''}{entity.gei_delta.toFixed(3)}</p>
                  </div>
                </div>
                {entity.shortfall_tco2e > 0 && (
                  <div className="p-2 rounded border" style={{ background: '#200D0D', borderColor: C.shortfall + '40' }}>
                    <p className="text-[8px] font-bold" style={{ color: C.shortfall }}>SHORTFALL</p>
                    <p className="text-base font-black font-mono" style={{ color: C.shortfall }}>{entity.shortfall_tco2e.toLocaleString('en-IN')}</p>
                    <p className="text-[8px]" style={{ color: C.muted }}>tCO₂e CCC obligation</p>
                  </div>
                )}
                <div className="p-2 rounded" style={{ background: C.bg }}>
                  <p className="text-[8px]" style={{ color: C.muted }}>RCO: {entity.rco_share_pct}% of {entity.rco_target_pct}% target</p>
                  <div className="mt-1 w-full rounded-full h-1.5" style={{ background: C.border }}>
                    <div className="h-full rounded-full" style={{ width: `${Math.min(100, (entity.rco_share_pct / entity.rco_target_pct) * 100)}%`, background: entity.rco_share_pct >= entity.rco_target_pct ? C.surplus : C.marginal }} />
                  </div>
                </div>
                <div className="text-[8px] pt-1 border-t" style={{ color: C.muted, borderColor: C.border }}>DATA_STATUS: {entity.data_status} · SYNTHETIC ENTITY</div>
              </div>
            </div>
          )}

          {/* Regulatory News Feed */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-3 py-2 border-b sticky top-0" style={{ borderColor: C.border, background: C.surface }}>
              <span className="text-[9px] uppercase tracking-widest font-bold" style={{ color: C.muted }}>REGULATORY SOURCE FEED</span>
            </div>
            {data?.regulatory_feed.map(f => (
              <div key={f.id} className="px-3 py-2.5 border-b" style={{ borderColor: C.border }}>
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[8px] font-bold px-1 py-0.5 rounded" style={{ background: f.status === 'FINAL' ? '#0D2B20' : f.status === 'DRAFT' ? '#1F1500' : '#1A1C20', color: f.status === 'FINAL' ? C.surplus : f.status === 'DRAFT' ? C.marginal : C.neutral }}>{f.status}</span>
                  <span className="text-[8px]" style={{ color: C.muted }}>{f.date}</span>
                  <span className="text-[8px] ml-auto" style={{ color: C.blue }}>{f.sector}</span>
                </div>
                <p className="text-[10px] leading-snug" style={{ color: C.text }}>{f.headline}</p>
                <p className="text-[8px] mt-1" style={{ color: C.muted }}>{f.source}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── ROW 2: Order Blotter ──────────────────────────────────────── */}
      <div className="border-t" style={{ borderColor: C.border, background: C.surface }}>
        <div className="px-4 py-1.5 flex items-center gap-3 border-b" style={{ borderColor: C.border }}>
          <span className="text-[9px] uppercase tracking-widest font-bold" style={{ color: C.muted }}>SCENARIO ORDER BLOTTER</span>
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded border" style={{ color: C.shortfall, borderColor: C.shortfall + '50', background: '#200D0D' }}>NO LIVE EXECUTION — SCENARIO INTENT ONLY</span>
          <span className="ml-auto text-[9px]" style={{ color: C.muted }}>{data?.order_blotter.length} ENTRIES</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[10px]">
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                {['ENTITY', 'DIR', 'QTY (tCO₂e)', 'SCENARIO PRICE (₹/CCC)', 'SCENARIO VALUE (₹ Cr)', 'STRATEGY', 'STATUS', 'DATA STATUS'].map(h => (
                  <th key={h} className="px-3 py-1.5 text-left text-[8px] uppercase tracking-wider" style={{ color: C.muted }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data?.order_blotter.map(o => (
                <tr key={o.entry_id} className="hover:bg-white/5 transition-colors" style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td className="px-3 py-2 font-bold" style={{ color: C.text }}>{o.entity_name}</td>
                  <td className="px-3 py-2 font-black font-mono" style={{ color: o.direction === 'BUY' ? C.surplus : C.shortfall }}>{o.direction}</td>
                  <td className="px-3 py-2 font-mono" style={{ color: C.text }}>{o.quantity_tco2e.toLocaleString('en-IN')}</td>
                  <td className="px-3 py-2 font-mono" style={{ color: C.text }}>₹{o.scenario_price_inr.toLocaleString('en-IN')}</td>
                  <td className="px-3 py-2 font-mono font-bold" style={{ color: o.direction === 'BUY' ? C.shortfall : C.surplus }}>₹{o.scenario_value_cr.toFixed(2)} Cr</td>
                  <td className="px-3 py-2 text-[9px]" style={{ color: C.blue }}>{o.strategy}</td>
                  <td className="px-3 py-2"><span className="px-1.5 py-0.5 rounded text-[8px] font-bold border" style={{ color: C.marginal, borderColor: C.marginal + '60', background: '#1F1500' }}>SCENARIO_INTENT</span></td>
                  <td className="px-3 py-2 text-[8px]" style={{ color: C.muted }}>USER_DEFINED_SCENARIO</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── TICKER STRIP ─────────────────────────────────────────────── */}
      <div className="border-t py-1.5 overflow-hidden relative" style={{ borderColor: C.border, background: '#070B08' }}>
        <div className="flex items-center gap-2 mr-4 flex-shrink-0 absolute left-0 top-0 bottom-0 px-3 z-10" style={{ background: '#070B08' }}>
          <span className="text-[8px] font-black uppercase tracking-widest" style={{ color: C.surplus }}>SCENARIO</span>
        </div>
        <div className="ml-24 overflow-hidden">
          <div ref={tickerRef} className="flex items-center whitespace-nowrap will-change-transform">
            {[...(data?.watchlist ?? []), ...(data?.watchlist ?? [])].map((e, i) => (
              <SectorTickerItem key={`${e.entity_id}-${i}`} entry={e} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
