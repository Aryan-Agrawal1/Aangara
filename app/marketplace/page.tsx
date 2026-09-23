'use client';

import React, { useState, useMemo } from 'react';
import { Header } from '@/components/navigation/Header';
import { ProvenanceFooter } from '@/components/ui/ProvenanceFooter';
import { MARKETPLACE_DATA } from '@/lib/staticData';
import { Filter, Search, ShieldCheck, X, TrendingDown, Sun, Leaf, Info, FlaskConical, BarChart2, Building2 } from 'lucide-react';
import { InfoTooltip } from '@/components/ui/InfoTooltip';

type DataStatus = 'ILLUSTRATIVE_VALUE' | 'MODEL_ESTIMATE' | 'OBSERVED_MARKET_DATA' | 'USER_DEFINED_SCENARIO';
type ItemType = 'DECARBONISATION_PROJECT' | 'RENEWABLE_PPA' | 'CCC_LISTING';

const STATUS_CFG: Record<DataStatus, { label: string; color: string; bg: string; border: string; icon: React.ElementType; tip: string }> = {
  OBSERVED_MARKET_DATA:  { label: 'OBSERVED MARKET DATA',  color: '#0B4A3D', bg: '#E8F5EE', border: '#0B4A3D', icon: ShieldCheck,  tip: 'Sourced from a verified real-world market transaction, regulated tariff, or official exchange record.' },
  USER_DEFINED_SCENARIO: { label: 'USER SCENARIO',         color: '#2E6BA8', bg: '#EBF3FB', border: '#2E6BA8', icon: BarChart2,   tip: 'Value set by user as a scenario assumption. Not independently verified.' },
  MODEL_ESTIMATE:        { label: 'MODEL ESTIMATE',        color: '#C98A1E', bg: '#FEF7E8', border: '#C98A1E', icon: FlaskConical, tip: 'Computed by the AANGARA model from input assumptions. Indicative only.' },
  ILLUSTRATIVE_VALUE:    { label: 'ILLUSTRATIVE VALUE',    color: '#7C5CBF', bg: '#F4F0FB', border: '#7C5CBF', icon: Info,        tip: 'Illustrative figure for demonstration. Not a real market price or regulatory position.' },
};

const TYPE_CFG: Record<ItemType, { label: string; icon: React.ElementType; color: string }> = {
  DECARBONISATION_PROJECT: { label: 'Decarbonisation Project', icon: TrendingDown, color: '#0B4A3D' },
  RENEWABLE_PPA:           { label: 'Renewable PPA / Energy',  icon: Sun,          color: '#C98A1E' },
  CCC_LISTING:             { label: 'CCC Market Position',     icon: Leaf,          color: '#2E6BA8' },
};

const CVS_COLOR = (s: number) => s >= 75 ? '#0B4A3D' : s >= 55 ? '#C98A1E' : '#C33B2E';
const MRV_COLOR = (s: number) => s >= 80 ? '#0B4A3D' : s >= 65 ? '#C98A1E' : '#C33B2E';

function DataBadge({ status }: { status: string }) {
  const cfg = STATUS_CFG[status as DataStatus] ?? STATUS_CFG.ILLUSTRATIVE_VALUE;
  const Icon = cfg.icon;
  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-[9px] font-mono font-bold uppercase tracking-wider border"
      style={{ color: cfg.color, background: cfg.bg, borderColor: cfg.border }}>
      <Icon className="w-2.5 h-2.5" />{cfg.label}
      <InfoTooltip content={cfg.tip} iconSize="w-2.5 h-2.5" />
    </span>
  );
}

function MechTags({ tags }: { tags: { ccts: boolean; rco: boolean; offset: boolean } }) {
  return (
    <div className="flex items-center gap-1 flex-wrap">
      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${tags.ccts ? 'bg-[#E8F5EE] text-[#0B4A3D] border-[#0B4A3D]/30' : 'bg-[#F6F8F7] text-[#9CA3A0] border-[#E4E9E6]'}`}>CCTS {tags.ccts ? '✓' : '✗'}</span>
      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${tags.rco ? 'bg-[#FEF7E8] text-[#C98A1E] border-[#C98A1E]/30' : 'bg-[#F6F8F7] text-[#9CA3A0] border-[#E4E9E6]'}`}>RCO {tags.rco ? '✓' : '✗'}</span>
    </div>
  );
}

function Card({ item, onOpen }: { item: typeof MARKETPLACE_DATA[0]; onOpen: (i: typeof MARKETPLACE_DATA[0]) => void }) {
  const tc = TYPE_CFG[item.item_type as ItemType];
  const Icon = tc.icon;
  const cvs = item.compliance_value_score ?? 0;
  return (
    <div onClick={() => onOpen(item)} className="bg-white border border-[#E4E9E6] rounded-xl p-4 cursor-pointer flex flex-col gap-3 hover:border-[#C4CFC9] hover:shadow-lg transition-all duration-200 group">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-1.5 rounded-lg flex-shrink-0" style={{ background: `${tc.color}15` }}>
            <Icon className="w-3.5 h-3.5" style={{ color: tc.color }} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-mono text-[#6B7A72] uppercase tracking-wider">{tc.label}</p>
            <h3 className="text-sm font-semibold text-[#10231C] leading-snug mt-0.5 line-clamp-2 group-hover:text-[#0B4A3D] transition-colors">{item.title}</h3>
          </div>
        </div>
        {cvs > 0 && (
          <div className="flex-shrink-0 text-right">
            <p className="text-[9px] text-[#6B7A72] flex items-center gap-1 justify-end">CVS <InfoTooltip content="Compliance Value Score (0-100): weighted composite of financial, CCTS, RCO, risk and timing sub-scores. Higher = better combined compliance value." iconSize="w-2.5 h-2.5" /></p>
            <p className="text-xl font-black font-mono" style={{ color: CVS_COLOR(cvs) }}>{cvs}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {item.expected_reduction_tco2e_yr && (
          <div className="bg-[#F6F8F7] rounded-lg p-2 border border-[#E4E9E6]">
            <p className="text-[9px] text-[#6B7A72] font-mono uppercase">CCTS Abatement</p>
            <p className="text-sm font-bold text-[#0B4A3D] font-mono">{(item.expected_reduction_tco2e_yr / 1000).toFixed(1)}kt CO₂e/yr</p>
          </div>
        )}
        {item.renewable_capacity_mw && (
          <div className="bg-[#FEF7E8]/60 rounded-lg p-2 border border-[#C98A1E]/20">
            <p className="text-[9px] text-[#C98A1E] font-mono uppercase">RE Capacity</p>
            <p className="text-sm font-bold text-[#C98A1E] font-mono">{item.renewable_capacity_mw} MW</p>
          </div>
        )}
        {item.capex_band_low_cr && item.capex_band_high_cr && (
          <div className="bg-[#F6F8F7] rounded-lg p-2 border border-[#E4E9E6]">
            <p className="text-[9px] text-[#6B7A72] font-mono uppercase">CAPEX Band</p>
            <p className="text-sm font-bold text-[#10231C] font-mono">₹{item.capex_band_low_cr}–{item.capex_band_high_cr} Cr</p>
          </div>
        )}
        {item.tariff_inr_per_mwh && (
          <div className="bg-[#FEF7E8]/60 rounded-lg p-2 border border-[#C98A1E]/20">
            <p className="text-[9px] text-[#C98A1E] font-mono uppercase">PPA Tariff</p>
            <p className="text-sm font-bold text-[#C98A1E] font-mono">₹{item.tariff_inr_per_mwh.toLocaleString('en-IN')}/MWh</p>
          </div>
        )}
        {item.illustrative_price_inr && !item.capex_band_low_cr && !item.tariff_inr_per_mwh && (
          <div className="bg-[#EBF3FB]/60 rounded-lg p-2 border border-[#2E6BA8]/20 col-span-2">
            <p className="text-[9px] text-[#2E6BA8] font-mono uppercase">Scenario Price</p>
            <p className="text-sm font-bold text-[#2E6BA8] font-mono">₹{item.illustrative_price_inr.toLocaleString('en-IN')} <span className="text-[10px] font-normal">{item.price_unit}</span></p>
          </div>
        )}
        {item.mrv_readiness_score && (
          <div className="bg-[#F6F8F7] rounded-lg p-2 border border-[#E4E9E6]">
            <p className="text-[9px] text-[#6B7A72] font-mono uppercase">MRV Readiness</p>
            <p className="text-sm font-bold font-mono" style={{ color: MRV_COLOR(item.mrv_readiness_score) }}>{item.mrv_readiness_score}/100</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-[#E4E9E6]">
        <MechTags tags={item.mechanism_tags} />
        <div className="flex flex-col items-end gap-1">
          <span className="text-[9px] text-[#6B7A72]">{item.state}</span>
          <DataBadge status={item.data_status} />
        </div>
      </div>
    </div>
  );
}

function Drawer({ item, onClose }: { item: typeof MARKETPLACE_DATA[0]; onClose: () => void }) {
  const tc = TYPE_CFG[item.item_type as ItemType];
  return (
    <div className="fixed inset-0 z-50 flex" onClick={onClose}>
      <div className="flex-1 bg-black/40 backdrop-blur-sm" />
      <div className="w-full max-w-lg bg-white border-l border-[#E4E9E6] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-[#E4E9E6] px-5 py-4 flex items-start justify-between z-10">
          <div>
            <p className="text-[10px] font-mono text-[#6B7A72] uppercase">{tc.label}</p>
            <h2 className="text-sm font-bold text-[#10231C] mt-0.5 pr-4 leading-tight">{item.title}</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-[#F6F8F7] text-[#6B7A72] flex-shrink-0"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-5 space-y-5">
          <DataBadge status={item.data_status} />
          <section>
            <h3 className="text-xs font-bold text-[#10231C] uppercase tracking-wider mb-2">Why This Action</h3>
            <p className="text-sm text-[#4B5A54] leading-relaxed">{item.description}</p>
          </section>
          <section>
            <h3 className="text-xs font-bold text-[#10231C] uppercase tracking-wider mb-2">Mechanism Eligibility</h3>
            <MechTags tags={item.mechanism_tags} />
            <p className="text-xs text-[#6B7A72] mt-2">One action can serve multiple mechanisms simultaneously — provided no physical unit (MWh/tCO₂e) is counted twice across mechanisms (double-count guard enforced).</p>
          </section>
          <section>
            <h3 className="text-xs font-bold text-[#10231C] uppercase tracking-wider mb-2">Key Metrics</h3>
            <div className="space-y-1.5 text-xs">
              {item.expected_reduction_tco2e_yr && <div className="flex justify-between py-1.5 border-b border-[#E4E9E6]"><span className="text-[#6B7A72]">CCTS Abatement</span><span className="font-mono font-bold text-[#0B4A3D]">{item.expected_reduction_tco2e_yr.toLocaleString('en-IN')} tCO₂e/yr</span></div>}
              {item.renewable_capacity_mw && <div className="flex justify-between py-1.5 border-b border-[#E4E9E6]"><span className="text-[#6B7A72]">RE Capacity</span><span className="font-mono font-bold text-[#C98A1E]">{item.renewable_capacity_mw} MW</span></div>}
              {item.ppa_term_years && <div className="flex justify-between py-1.5 border-b border-[#E4E9E6]"><span className="text-[#6B7A72]">PPA Term</span><span className="font-mono font-bold">{item.ppa_term_years} years</span></div>}
              {item.capex_band_low_cr && <div className="flex justify-between py-1.5 border-b border-[#E4E9E6]"><span className="text-[#6B7A72]">CAPEX Band</span><span className="font-mono font-bold">₹{item.capex_band_low_cr}–{item.capex_band_high_cr} Cr</span></div>}
              {item.tariff_inr_per_mwh && <div className="flex justify-between py-1.5 border-b border-[#E4E9E6]"><span className="text-[#6B7A72]">PPA Tariff (Indicative)</span><span className="font-mono font-bold text-[#C98A1E]">₹{item.tariff_inr_per_mwh.toLocaleString('en-IN')}/MWh</span></div>}
              {item.illustrative_price_inr && <div className="flex justify-between py-1.5 border-b border-[#E4E9E6]"><span className="text-[#6B7A72]">Scenario Price</span><span className="font-mono font-bold text-[#2E6BA8]">₹{item.illustrative_price_inr.toLocaleString('en-IN')} {item.price_unit}</span></div>}
              {item.mrv_readiness_score && <div className="flex justify-between py-1.5 border-b border-[#E4E9E6]"><span className="text-[#6B7A72]">MRV Readiness</span><span className="font-mono font-bold" style={{ color: MRV_COLOR(item.mrv_readiness_score) }}>{item.mrv_readiness_score}/100</span></div>}
              {item.technology_trl && <div className="flex justify-between py-1.5 border-b border-[#E4E9E6]"><span className="text-[#6B7A72]">Technology TRL</span><span className="font-mono font-bold">{item.technology_trl}/9</span></div>}
              {item.compliance_value_score && <div className="flex justify-between py-1.5"><span className="text-[#6B7A72]">Compliance Value Score</span><span className="font-mono font-bold" style={{ color: CVS_COLOR(item.compliance_value_score) }}>{item.compliance_value_score}/100</span></div>}
            </div>
          </section>
          <section>
            <h3 className="text-xs font-bold text-[#10231C] uppercase tracking-wider mb-2">Source & Trust Pack</h3>
            <div className="bg-[#F6F8F7] rounded-lg p-3 border border-[#E4E9E6] text-xs text-[#4B5A54] space-y-1.5">
              <div className="flex justify-between"><span className="font-medium">Trust Pack Ref:</span><span className="font-mono">{item.trust_pack_ref}</span></div>
              <div className="flex justify-between"><span className="font-medium">State:</span><span>{item.state}</span></div>
              {item.developer && <div className="flex justify-between"><span className="font-medium">Developer:</span><span className="text-right max-w-[220px]">{item.developer}</span></div>}
              <div className="flex justify-between"><span className="font-medium">Status:</span><span className="font-mono">{item.status}</span></div>
            </div>
          </section>
          <section>
            <div className="bg-[#FDECEA]/40 rounded-lg p-3 border border-[#C33B2E]/20 text-xs text-[#4B5A54] space-y-1.5">
              <p className="font-bold text-[#C33B2E]">Risk Disclosure</p>
              <p>• Prices labeled ILLUSTRATIVE VALUE or MODEL ESTIMATE are not live market prices and cannot be used for procurement without independent verification.</p>
              <p>• CCTS abatement quantities are modelled projections, not issued/verified Carbon Credit Certificates.</p>
              <p>• RCO eligibility depends on SERC jurisdiction, metering config, and entity registration.</p>
              <p>• Technology TRL ≤7 carries elevated execution risk.</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

const SECTORS = ['all','cement','petroleum_refinery','aluminium','steel','textile','petrochemicals','pulp_paper','chlor_alkali'];
const ITEM_TYPES = ['all','DECARBONISATION_PROJECT','RENEWABLE_PPA','CCC_LISTING'];

export default function MarketplacePage() {
  const [selected, setSelected] = useState<typeof MARKETPLACE_DATA[0] | null>(null);
  const [search, setSearch] = useState('');
  const [sector, setSector] = useState('all');
  const [type, setType] = useState('all');
  const [mech, setMech] = useState('all');

  const filtered = useMemo(() => {
    return MARKETPLACE_DATA.filter(i => {
      if (sector !== 'all' && i.sector !== sector) return false;
      if (type !== 'all' && i.item_type !== type) return false;
      if (mech === 'ccts' && !i.mechanism_tags.ccts) return false;
      if (mech === 'rco' && !i.mechanism_tags.rco) return false;
      if (search) {
        const q = search.toLowerCase();
        return i.title.toLowerCase().includes(q) || i.description.toLowerCase().includes(q) || i.sector.includes(q);
      }
      return true;
    });
  }, [sector, type, mech, search]);

  const reset = () => { setSector('all'); setType('all'); setMech('all'); setSearch(''); };

  return (
    <div className="min-h-screen bg-[#F6F8F7]">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Page header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-xl bg-[#E8F5EE] border border-[#0B4A3D]/20">
              <Building2 className="w-5 h-5 text-[#0B4A3D]" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-[#10231C] tracking-tight">Project & CCC Marketplace</h1>
              <p className="text-sm text-[#4B5A54] mt-0.5">Analytical matching platform — decarbonisation projects, renewable PPAs, CCC positions. No live execution.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-3 p-3 bg-white rounded-xl border border-[#E4E9E6]">
            <span className="text-[10px] font-semibold text-[#6B7A72] uppercase tracking-wider self-center mr-2">Data Labels:</span>
            {(['OBSERVED_MARKET_DATA','MODEL_ESTIMATE','ILLUSTRATIVE_VALUE'] as DataStatus[]).map(s => <DataBadge key={s} status={s} />)}
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="w-52 flex-shrink-0 space-y-4">
            <div className="bg-white rounded-xl border border-[#E4E9E6] p-4">
              <div className="flex items-center gap-2 mb-3">
                <Filter className="w-3.5 h-3.5 text-[#6B7A72]" />
                <span className="text-xs font-semibold text-[#10231C] uppercase tracking-wider">Filters</span>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Sector', val: sector, set: setSector, opts: SECTORS.map(s => ({ v: s, l: s === 'all' ? 'All Sectors' : s.replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase()) })) },
                  { label: 'Type', val: type, set: setType, opts: ITEM_TYPES.map(t => ({ v: t, l: t === 'all' ? 'All Types' : (TYPE_CFG[t as ItemType]?.label ?? t) })) },
                  { label: 'Mechanism', val: mech, set: setMech, opts: [{ v:'all',l:'All' },{ v:'ccts',l:'CCTS Eligible' },{ v:'rco',l:'RCO Eligible' }] },
                ].map(f => (
                  <div key={f.label}>
                    <label className="text-[10px] font-bold text-[#6B7A72] uppercase tracking-wider">{f.label}</label>
                    <select value={f.val} onChange={e => f.set(e.target.value)} className="mt-1 w-full text-xs border border-[#E4E9E6] rounded-lg px-2 py-1.5 bg-white text-[#10231C] focus:outline-none focus:border-[#0B4A3D]">
                      {f.opts.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                    </select>
                  </div>
                ))}
                <button onClick={reset} className="w-full text-xs text-[#6B7A72] hover:text-[#10231C] py-1.5 border border-[#E4E9E6] rounded-lg hover:bg-[#F6F8F7] transition-colors">Clear Filters</button>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-[#E4E9E6] p-4 space-y-2">
              <span className="text-[10px] font-bold text-[#6B7A72] uppercase tracking-wider">Summary</span>
              <div className="text-center"><p className="text-3xl font-black text-[#10231C]">{filtered.length}</p><p className="text-[10px] text-[#6B7A72]">Listings Shown</p></div>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between"><span className="text-[#6B7A72]">Projects</span><span className="font-mono font-bold text-[#0B4A3D]">{filtered.filter(i=>i.item_type==='DECARBONISATION_PROJECT').length}</span></div>
                <div className="flex justify-between"><span className="text-[#6B7A72]">PPAs</span><span className="font-mono font-bold text-[#C98A1E]">{filtered.filter(i=>i.item_type==='RENEWABLE_PPA').length}</span></div>
                <div className="flex justify-between"><span className="text-[#6B7A72]">CCC Positions</span><span className="font-mono font-bold text-[#2E6BA8]">{filtered.filter(i=>i.item_type==='CCC_LISTING').length}</span></div>
              </div>
            </div>
          </aside>

          {/* Main */}
          <div className="flex-1 min-w-0">
            <div className="mb-4 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3A0]" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search projects, PPAs, sectors..."
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-[#E4E9E6] rounded-xl bg-white text-[#10231C] placeholder-[#9CA3A0] focus:outline-none focus:border-[#0B4A3D] transition-colors" />
            </div>
            {filtered.length === 0 ? (
              <div className="text-center py-16 text-[#6B7A72]">
                <Building2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="font-medium">No listings match your filters</p>
                <button onClick={reset} className="mt-3 text-sm text-[#0B4A3D] underline">Clear all filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map(item => <Card key={item.item_id} item={item} onOpen={setSelected} />)}
              </div>
            )}
          </div>
        </div>
      </main>
      <ProvenanceFooter />
      {selected && <Drawer item={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

