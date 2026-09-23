'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { TERMINAL_WATCHLIST, TERMINAL_CCC_CURVE, TERMINAL_BLOTTER, TERMINAL_REG_FEED } from '@/lib/staticData';
import { Search, Activity, Clock, Wifi } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// ── Terminal colour system ────────────────────────────────────────────
const C = {
  surplus: '#34D399',
  shortfall: '#F87171',
  marginal: '#FBBF24',
  neutral: '#94A3B8',
  blue: '#60A5FA',
  bg: '#0A0E0B',
  surface: '#0F1710',
  border: '#1C2B1F',
  text: '#D1FAE5',
  muted: '#6B7A72',
};

type WEntry = typeof TERMINAL_WATCHLIST[0];

function ComplianceDot({ status }: { status: string }) {
  const col = status === 'SURPLUS' ? C.surplus : status === 'SHORTFALL' ? C.shortfall : C.marginal;
  return <span className="w-2 h-2 rounded-full inline-block flex-shrink-0" style={{ backgroundColor: col }} />;
}

const CCC_TOOLTIP = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="text-xs p-2 rounded-lg border" style={{ background: C.surface, borderColor: C.border, color: C.text }}>
      <p className="font-mono font-bold mb-1" style={{ color: C.muted }}>{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="font-mono" style={{ color: p.color }}>{p.name}: Rs {p.value.toLocaleString('en-IN')}</p>
      ))}
      <p className="text-[9px] mt-1" style={{ color: C.muted }}>MODEL ESTIMATE — NOT LIVE MARKET DATA</p>
    </div>
  );
};

export default function TerminalPage() {
  const [selected, setSelected] = useState<WEntry>(TERMINAL_WATCHLIST[0]);
  const [query, setQuery] = useState('');
  const [showDrop, setShowDrop] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const tickerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setInterval(() => setSessionTime(s => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault(); inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Ticker scroll
  useEffect(() => {
    const el = tickerRef.current;
    if (!el) return;
    let pos = 0;
    let rafId: number;
    const tick = () => { pos -= 0.4; if (pos < -el.scrollWidth / 2) pos = 0; el.style.transform = `translateX(${pos}px)`; rafId = requestAnimationFrame(tick); };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const filteredList = useMemo(() => {
    if (!query) return TERMINAL_WATCHLIST;
    const q = query.toLowerCase();
    return TERMINAL_WATCHLIST.filter(e => e.entity_name.toLowerCase().includes(q) || e.sector.toLowerCase().includes(q));
  }, [query]);

  const fmt = (s: number) => `${String(Math.floor(s / 3600)).padStart(2, '0')}:${String(Math.floor((s % 3600) / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const e = selected;

  return (
    <div className="min-h-screen flex flex-col font-mono select-none overflow-hidden" style={{ background: C.bg, color: C.text }}>

      {/* TOP BAR */}
      <div className="flex items-center justify-between px-4 py-2 border-b flex-shrink-0" style={{ borderColor: C.border, background: C.surface }}>
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: C.surplus }} />
            <span className="text-xs font-black tracking-widest" style={{ color: C.surplus }}>AANGARA</span>
            <span className="text-[9px] uppercase tracking-widest ml-1" style={{ color: C.muted }}>TERMINAL</span>
          </div>
          <span className="text-[9px] px-1.5 py-0.5 rounded border font-mono font-bold" style={{ color: C.marginal, borderColor: C.marginal, background: '#1F1500' }}>
            SCENARIO MODE — NO LIVE DATA
          </span>
        </div>

        <div className="relative flex-1 max-w-xs mx-4">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3" style={{ color: C.muted }} />
          <input ref={inputRef} value={query}
            onChange={e => { setQuery(e.target.value); setShowDrop(true); }}
            onFocus={() => setShowDrop(true)}
            onBlur={() => setTimeout(() => setShowDrop(false), 150)}
            placeholder="Search entity or sector... [press /]"
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded border focus:outline-none"
            style={{ background: C.bg, borderColor: showDrop ? C.surplus : C.border, color: C.text }}
          />
          {showDrop && filteredList.length > 0 && (
            <div className="absolute top-full mt-1 left-0 right-0 z-50 rounded border overflow-hidden" style={{ background: C.surface, borderColor: C.border }}>
              {filteredList.slice(0, 6).map(en => (
                <button key={en.entity_id} onClick={() => { setSelected(en); setQuery(''); setShowDrop(false); }}
                  className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-white/5 transition-colors">
                  <ComplianceDot status={en.compliance_status} />
                  <span style={{ color: C.text }}>{en.entity_name}</span>
                  <span className="ml-auto text-[9px]" style={{ color: C.muted }}>{en.sector}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-[9px] flex items-center gap-1.5" style={{ color: C.muted }}><Clock className="w-3 h-3" />SESSION {fmt(sessionTime)}</span>
          <span className="text-[9px] flex items-center gap-1.5" style={{ color: C.surplus }}><Wifi className="w-3 h-3" />LOCAL</span>
        </div>
      </div>

      {/* MAIN 3-COL GRID */}
      <div className="flex-1 grid grid-cols-12 gap-px overflow-hidden" style={{ background: C.border }}>

        {/* COL 1 — Watchlist */}
        <div className="col-span-3 flex flex-col overflow-hidden" style={{ background: C.surface }}>
          <div className="px-3 py-2 border-b flex-shrink-0 flex items-center justify-between" style={{ borderColor: C.border }}>
            <span className="text-[9px] uppercase tracking-widest font-bold" style={{ color: C.muted }}>WATCHLIST — {TERMINAL_WATCHLIST.length} ENTITIES</span>
          </div>
          <div className="flex-1 overflow-y-auto">
            {TERMINAL_WATCHLIST.map(en => (
              <button key={en.entity_id} onClick={() => setSelected(en)}
                className="w-full px-3 py-2.5 border-b text-left flex flex-col gap-1 transition-colors hover:bg-white/5"
                style={{ borderColor: C.border, background: selected?.entity_id === en.entity_id ? '#1A2E1E' : 'transparent' }}>
                <div className="flex items-center gap-2 w-full">
                  <ComplianceDot status={en.compliance_status} />
                  <span className="text-[10px] font-bold truncate flex-1" style={{ color: C.text }}>{en.entity_name}</span>
                  <span className="text-[9px] font-bold flex-shrink-0 font-mono" style={{ color: en.gei_delta > 0 ? C.shortfall : C.surplus }}>
                    {en.gei_delta > 0 ? '+' : ''}{en.gei_delta.toFixed(3)}
                  </span>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <span className="text-[9px]" style={{ color: C.muted }}>{en.sector}</span>
                  <span className="text-[9px] font-mono" style={{ color: en.rco_share_pct >= en.rco_target_pct ? C.surplus : C.marginal }}>
                    RE {en.rco_share_pct}%/{en.rco_target_pct}%
                  </span>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <span className="text-[9px] font-mono" style={{ color: C.muted }}>CVS</span>
                  <div className="flex-1 rounded-full h-1" style={{ background: C.bg }}>
                    <div className="h-full rounded-full" style={{ width: `${en.compliance_value_score}%`, background: en.compliance_value_score >= 70 ? C.surplus : en.compliance_value_score >= 50 ? C.marginal : C.shortfall }} />
                  </div>
                  <span className="text-[9px] font-mono font-bold" style={{ color: en.compliance_value_score >= 70 ? C.surplus : en.compliance_value_score >= 50 ? C.marginal : C.shortfall }}>{en.compliance_value_score}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* COL 2 — CCC Curve + CVS Bars */}
        <div className="col-span-6 flex flex-col overflow-hidden" style={{ background: C.surface }}>
          <div className="flex-1 flex flex-col border-b overflow-hidden" style={{ borderColor: C.border }}>
            <div className="px-3 py-2 flex items-center justify-between flex-shrink-0">
              <div>
                <span className="text-[9px] uppercase tracking-widest font-bold" style={{ color: C.muted }}>CCC SCENARIO PRICE CURVE</span>
                <span className="ml-2 text-[9px] px-1.5 py-0.5 rounded border font-mono font-bold" style={{ color: C.marginal, borderColor: C.marginal, background: '#1F1500' }}>MODEL ESTIMATE</span>
              </div>
              <span className="text-[9px]" style={{ color: C.muted }}>Rs/CCC · FY26–FY30</span>
            </div>
            <div className="flex-1 px-2 pb-2" style={{ minHeight: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={TERMINAL_CCC_CURVE} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
                  <CartesianGrid strokeDasharray="2 4" stroke={C.border} />
                  <XAxis dataKey="year" tick={{ fill: C.muted, fontSize: 10, fontFamily: 'monospace' }} axisLine={{ stroke: C.border }} tickLine={false} />
                  <YAxis tick={{ fill: C.muted, fontSize: 10, fontFamily: 'monospace' }} axisLine={{ stroke: C.border }} tickLine={false} tickFormatter={v => `Rs${v}`} />
                  <Tooltip content={<CCC_TOOLTIP />} />
                  <Legend wrapperStyle={{ fontSize: 9, color: C.muted, fontFamily: 'monospace' }} />
                  <Line type="monotone" dataKey="price_bull_inr" name="Bull" stroke={C.shortfall} strokeWidth={1.5} dot={{ r: 3, fill: C.shortfall }} strokeDasharray="4 2" />
                  <Line type="monotone" dataKey="price_base_inr" name="Base" stroke={C.surplus} strokeWidth={2.5} dot={{ r: 4, fill: C.surplus }} />
                  <Line type="monotone" dataKey="price_bear_inr" name="Bear" stroke={C.neutral} strokeWidth={1.5} dot={{ r: 3, fill: C.neutral }} strokeDasharray="4 2" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* CVS sub-score bars */}
          <div className="px-4 py-3 flex-shrink-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[9px] uppercase tracking-widest font-bold" style={{ color: C.muted }}>COMPLIANCE VALUE SCORE — {e.entity_name}</span>
              <span className="text-[9px] font-mono font-black ml-auto" style={{ color: e.compliance_value_score >= 70 ? C.surplus : e.compliance_value_score >= 50 ? C.marginal : C.shortfall }}>{e.compliance_value_score}/100</span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {[
                { label: 'Financial', val: Math.min(99, e.compliance_value_score + 5), color: C.blue },
                { label: 'CCTS', val: e.compliance_status === 'SURPLUS' ? 85 : Math.max(20, e.compliance_value_score - 8), color: C.surplus },
                { label: 'RCO', val: e.rco_share_pct >= e.rco_target_pct ? 80 : Math.round((e.rco_share_pct / e.rco_target_pct) * 80), color: C.marginal },
                { label: 'Risk', val: Math.round(100 - e.compliance_value_score * 0.35), color: C.neutral },
                { label: 'Timing', val: 70, color: C.neutral },
              ].map(s => (
                <div key={s.label} className="flex flex-col items-center gap-1">
                  <div className="w-full rounded h-14 flex items-end" style={{ background: C.bg }}>
                    <div className="w-full rounded transition-all duration-500" style={{ height: `${Math.min(100, Math.max(5, s.val))}%`, background: s.color, opacity: 0.9 }} />
                  </div>
                  <span className="text-[8px] text-center leading-tight" style={{ color: C.muted }}>{s.label}</span>
                  <span className="text-[9px] font-mono font-bold" style={{ color: s.color }}>{s.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* COL 3 — Entity position + Regulatory Feed */}
        <div className="col-span-3 flex flex-col overflow-hidden" style={{ background: C.surface }}>
          {/* Entity Carbon Position */}
          <div className="p-3 border-b flex-shrink-0" style={{ borderColor: C.border }}>
            <span className="text-[9px] uppercase tracking-widest font-bold block mb-2" style={{ color: C.muted }}>ENTITY CARBON POSITION</span>
            <p className="text-[10px] font-bold mb-3 leading-tight" style={{ color: C.text }}>{e.entity_name}</p>
            <div className="space-y-2.5">
              <div>
                <span className="text-[9px]" style={{ color: C.muted }}>ACTUAL GEI</span>
                <p className="text-3xl font-black font-mono" style={{ color: e.gei_delta > 0 ? C.shortfall : C.surplus }}>{e.actual_gei.toFixed(3)}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 rounded" style={{ background: C.bg }}>
                  <p className="text-[8px]" style={{ color: C.muted }}>TARGET</p>
                  <p className="text-sm font-black font-mono" style={{ color: C.blue }}>{e.target_gei.toFixed(3)}</p>
                </div>
                <div className="p-2 rounded" style={{ background: C.bg }}>
                  <p className="text-[8px]" style={{ color: C.muted }}>DELTA</p>
                  <p className="text-sm font-black font-mono" style={{ color: e.gei_delta > 0 ? C.shortfall : C.surplus }}>{e.gei_delta > 0 ? '+' : ''}{e.gei_delta.toFixed(3)}</p>
                </div>
              </div>
              {e.shortfall_tco2e > 0 && (
                <div className="p-2 rounded border" style={{ background: '#200D0D', borderColor: C.shortfall + '40' }}>
                  <p className="text-[8px] font-bold" style={{ color: C.shortfall }}>CCTS SHORTFALL</p>
                  <p className="text-xl font-black font-mono" style={{ color: C.shortfall }}>{e.shortfall_tco2e.toLocaleString('en-IN')}</p>
                  <p className="text-[8px]" style={{ color: C.muted }}>tCO₂e CCC obligation</p>
                </div>
              )}
              {e.shortfall_tco2e === 0 && (
                <div className="p-2 rounded border" style={{ background: '#0D2B1F', borderColor: C.surplus + '40' }}>
                  <p className="text-[8px] font-bold" style={{ color: C.surplus }}>CCTS SURPLUS</p>
                  <p className="text-sm font-black font-mono" style={{ color: C.surplus }}>CCC eligible to sell</p>
                </div>
              )}
              <div className="p-2 rounded" style={{ background: C.bg }}>
                <div className="flex justify-between items-center mb-1">
                  <p className="text-[8px]" style={{ color: C.muted }}>RCO: {e.rco_share_pct}% / {e.rco_target_pct}% target</p>
                  <p className="text-[8px] font-bold" style={{ color: e.rco_share_pct >= e.rco_target_pct ? C.surplus : C.marginal }}>{e.rco_share_pct >= e.rco_target_pct ? '✓' : `${(e.rco_target_pct - e.rco_share_pct).toFixed(1)}pp gap`}</p>
                </div>
                <div className="w-full rounded-full h-1.5" style={{ background: C.border }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(100, (e.rco_share_pct / e.rco_target_pct) * 100)}%`, background: e.rco_share_pct >= e.rco_target_pct ? C.surplus : C.marginal }} />
                </div>
              </div>
              <p className="text-[8px]" style={{ color: C.muted }}>DATA_STATUS: {e.data_status} · SYNTHETIC ENTITY</p>
            </div>
          </div>

          {/* Regulatory Feed */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-3 py-2 border-b sticky top-0 flex-shrink-0" style={{ borderColor: C.border, background: C.surface }}>
              <span className="text-[9px] uppercase tracking-widest font-bold" style={{ color: C.muted }}>REGULATORY SOURCE FEED</span>
            </div>
            {TERMINAL_REG_FEED.map(f => (
              <div key={f.id} className="px-3 py-2.5 border-b" style={{ borderColor: C.border }}>
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[8px] font-bold px-1 py-0.5 rounded" style={{
                    background: f.status === 'FINAL' ? '#0D2B20' : f.status === 'DRAFT' ? '#1F1500' : '#1A1C20',
                    color: f.status === 'FINAL' ? C.surplus : f.status === 'DRAFT' ? C.marginal : C.neutral
                  }}>{f.status}</span>
                  <span className="text-[8px]" style={{ color: C.muted }}>{f.date}</span>
                  <span className="text-[8px] ml-auto font-mono" style={{ color: C.blue }}>{f.sector}</span>
                </div>
                <p className="text-[10px] leading-snug" style={{ color: C.text }}>{f.headline}</p>
                <p className="text-[8px] mt-0.5" style={{ color: C.muted }}>{f.source}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BLOTTER */}
      <div className="border-t flex-shrink-0" style={{ borderColor: C.border, background: C.surface }}>
        <div className="px-4 py-1.5 flex items-center gap-3 border-b" style={{ borderColor: C.border }}>
          <span className="text-[9px] uppercase tracking-widest font-bold" style={{ color: C.muted }}>SCENARIO ORDER BLOTTER</span>
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded border" style={{ color: C.shortfall, borderColor: C.shortfall + '50', background: '#200D0D' }}>NO LIVE EXECUTION — SCENARIO INTENT ONLY</span>
          <span className="ml-auto text-[9px]" style={{ color: C.muted }}>{TERMINAL_BLOTTER.length} ENTRIES</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[10px]">
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                {['ENTITY','DIR','QTY (tCO₂e)','SCENARIO PRICE','SCENARIO VALUE','STRATEGY','STATUS'].map(h => (
                  <th key={h} className="px-3 py-1.5 text-left text-[8px] uppercase tracking-wider" style={{ color: C.muted }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TERMINAL_BLOTTER.map(o => (
                <tr key={o.entry_id} className="hover:bg-white/5 transition-colors" style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td className="px-3 py-2 font-bold" style={{ color: C.text }}>{o.entity_name}</td>
                  <td className="px-3 py-2 font-black font-mono" style={{ color: o.direction === 'BUY' ? C.surplus : C.shortfall }}>{o.direction}</td>
                  <td className="px-3 py-2 font-mono" style={{ color: C.text }}>{o.quantity_tco2e.toLocaleString('en-IN')}</td>
                  <td className="px-3 py-2 font-mono" style={{ color: C.text }}>Rs {o.scenario_price_inr.toLocaleString('en-IN')}</td>
                  <td className="px-3 py-2 font-mono font-bold" style={{ color: o.direction === 'BUY' ? C.shortfall : C.surplus }}>Rs {o.scenario_value_cr.toFixed(2)} Cr</td>
                  <td className="px-3 py-2 text-[9px]" style={{ color: C.blue }}>{o.strategy}</td>
                  <td className="px-3 py-2"><span className="px-1.5 py-0.5 rounded text-[8px] font-bold border" style={{ color: C.marginal, borderColor: C.marginal + '60', background: '#1F1500' }}>SCENARIO</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* TICKER */}
      <div className="border-t py-1.5 overflow-hidden relative flex-shrink-0" style={{ borderColor: C.border, background: '#070B08' }}>
        <div className="flex items-center absolute left-0 top-0 bottom-0 px-3 z-10" style={{ background: '#070B08' }}>
          <span className="text-[8px] font-black uppercase tracking-widest" style={{ color: C.surplus }}>SCENARIO</span>
        </div>
        <div className="ml-24 overflow-hidden">
          <div ref={tickerRef} className="flex items-center whitespace-nowrap will-change-transform">
            {[...TERMINAL_WATCHLIST, ...TERMINAL_WATCHLIST].map((en, i) => (
              <span key={`${en.entity_id}-${i}`} className="inline-flex items-center gap-2 mr-8 whitespace-nowrap">
                <span style={{ color: C.muted }} className="text-[10px] font-mono uppercase">{en.sector.slice(0,8).toUpperCase()}</span>
                <span style={{ color: en.gei_delta > 0 ? C.shortfall : C.surplus }} className="text-[10px] font-mono font-bold">GEI {en.gei_delta > 0 ? '▲' : '▼'}{Math.abs(en.gei_delta).toFixed(3)}</span>
                <span style={{ color: C.muted }} className="text-[9px] font-mono">|</span>
                <span style={{ color: C.marginal }} className="text-[10px] font-mono">RE {en.rco_share_pct}/{en.rco_target_pct}%</span>
                <span style={{ color: C.muted }} className="text-[9px] font-mono mx-2">·</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

