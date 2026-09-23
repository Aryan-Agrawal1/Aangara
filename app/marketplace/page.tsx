'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from '@/components/navigation/Header';
import { ProvenanceFooter } from '@/components/ui/ProvenanceFooter';
import { MarketplaceItem, MarketplaceDataStatus, MarketplaceItemType } from '@/lib/types';
import { Zap, Leaf, TrendingDown, Filter, Search, ShieldCheck, X, ExternalLink, Info, Award, BarChart2, Wind, Sun, Building2, FlaskConical, ChevronDown } from 'lucide-react';
import { InfoTooltip } from '@/components/ui/InfoTooltip';

const DATA_STATUS_CONFIG: Record<MarketplaceDataStatus, { label: string; color: string; bg: string; border: string; icon: React.ElementType; tooltip: string }> = {
  OBSERVED_MARKET_DATA:   { label: 'OBSERVED MARKET DATA',   color: '#0B4A3D', bg: '#E8F5EE', border: '#0B4A3D', icon: ShieldCheck, tooltip: 'Price or quantity sourced from a verified real-world market transaction, regulated tariff, or official exchange record. Suitable for decision use.' },
  USER_DEFINED_SCENARIO:  { label: 'USER-DEFINED SCENARIO',  color: '#2E6BA8', bg: '#EBF3FB', border: '#2E6BA8', icon: BarChart2,  tooltip: 'Value set by the user as a scenario assumption. Not independently verified. Change it in the Scenario Sliders.' },
  MODEL_ESTIMATE:         { label: 'MODEL ESTIMATE',          color: '#C98A1E', bg: '#FEF7E8', border: '#C98A1E', icon: FlaskConical,tooltip: 'Computed by the AANGARA financial or regulatory model from input assumptions. Indicative only — not a market price or regulatory determination.' },
  ILLUSTRATIVE_VALUE:     { label: 'ILLUSTRATIVE VALUE',      color: '#7C5CBF', bg: '#F4F0FB', border: '#7C5CBF', icon: Info,       tooltip: 'Illustrative figure used for demonstration. Does not represent a real offer, real price, or regulatory position. For analytical exploration only.' },
};

const ITEM_TYPE_CONFIG: Record<MarketplaceItemType, { label: string; icon: React.ElementType; color: string }> = {
  DECARBONISATION_PROJECT: { label: 'Decarbonisation Project', icon: TrendingDown, color: '#0B4A3D' },
  RENEWABLE_PPA:           { label: 'Renewable PPA / Energy',  icon: Sun,         color: '#C98A1E' },
  CCC_LISTING:             { label: 'CCC Market Position',     icon: Leaf,         color: '#2E6BA8' },
};

const MRV_COLOR = (s: number) => s >= 80 ? '#0B4A3D' : s >= 65 ? '#C98A1E' : '#C33B2E';
const CVS_COLOR = (s: number) => s >= 70 ? '#0B4A3D' : s >= 50 ? '#C98A1E' : '#C33B2E';

function DataStatusBadge({ status }: { status: MarketplaceDataStatus }) {
  const cfg = DATA_STATUS_CONFIG[status];
  const Icon = cfg.icon;
  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-[9px] font-mono font-bold uppercase tracking-wider border"
      style={{ color: cfg.color, background: cfg.bg, borderColor: cfg.border }}>
      <Icon className="w-2.5 h-2.5" />{cfg.label}
      <InfoTooltip content={cfg.tooltip} iconSize="w-2.5 h-2.5" />
    </span>
  );
}

function MechanismTags({ tags }: { tags: { ccts: boolean; rco: boolean; offset: boolean } }) {
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {tags.ccts  && <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#E8F5EE] text-[#0B4A3D] border border-[#0B4A3D]/30">CCTS ✓</span>}
      {tags.rco   && <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#FEF7E8] text-[#C98A1E] border border-[#C98A1E]/30">RCO ✓</span>}
      {tags.offset && <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#EBF3FB] text-[#2E6BA8] border border-[#2E6BA8]/30">OFFSET ✓</span>}
      {!tags.ccts  && <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#F6F8F7] text-[#9CA3A0] border border-[#E4E9E6]">CCTS ✗</span>}
      {!tags.rco   && <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#F6F8F7] text-[#9CA3A0] border border-[#E4E9E6]">RCO ✗</span>}
    </div>
  );
}

function MarketplaceCard({ item, onExpand }: { item: MarketplaceItem; onExpand: (item: MarketplaceItem) => void }) {
  const TypeCfg = ITEM_TYPE_CONFIG[item.item_type];
  const Icon = TypeCfg.icon;

  return (
    <div className="bg-white border border-[#E4E9E6] rounded-xl p-4 hover:border-[#C4CFC9] hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col gap-3"
      onClick={() => onExpand(item)}>
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-1.5 rounded-lg flex-shrink-0" style={{ background: `${TypeCfg.color}15` }}>
            <Icon className="w-3.5 h-3.5" style={{ color: TypeCfg.color }} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-mono text-[#6B7A72] uppercase tracking-wider">{TypeCfg.label}</p>
            <h3 className="text-sm font-semibold text-[#10231C] leading-tight mt-0.5 line-clamp-2">{item.title}</h3>
          </div>
        </div>
        {item.compliance_value_score && (
          <div className="flex-shrink-0 text-right">
            <p className="text-[9px] text-[#6B7A72] flex items-center gap-1 justify-end">CVS<InfoTooltip content="Compliance Value Score: weighted composite of financial, CCTS impact, RCO impact, risk, and timing sub-scores (0–100). Higher = better combined compliance value." iconSize="w-2.5 h-2.5" /></p>
            <p className="text-base font-black font-mono" style={{ color: CVS_COLOR(item.compliance_value_score) }}>{item.compliance_value_score}</p>
          </div>
        )}
      </div>

      {/* Key metrics */}
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
            <p className="text-sm font-bold text-[#C98A1E] font-mono">₹{item.tariff_inr_per_mwh}/MWh</p>
          </div>
        )}
        {item.illustrative_price_inr && !item.capex_band_low_cr && !item.tariff_inr_per_mwh && (
          <div className="bg-[#EBF3FB]/60 rounded-lg p-2 border border-[#2E6BA8]/20 col-span-2">
            <p className="text-[9px] text-[#2E6BA8] font-mono uppercase">Scenario Price</p>
            <p className="text-sm font-bold text-[#2E6BA8] font-mono">₹{item.illustrative_price_inr.toLocaleString('en-IN')} <span className="text-[10px] font-normal">{item.price_unit?.split('(')[0]}</span></p>
          </div>
        )}
        {item.mrv_readiness_score && (
          <div className="bg-[#F6F8F7] rounded-lg p-2 border border-[#E4E9E6]">
            <p className="text-[9px] text-[#6B7A72] font-mono uppercase">MRV Readiness</p>
            <p className="text-sm font-bold font-mono" style={{ color: MRV_COLOR(item.mrv_readiness_score) }}>{item.mrv_readiness_score}/100</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 border-t border-[#E4E9E6]">
        <div className="flex items-center gap-2">
          <MechanismTags tags={item.mechanism_tags} />
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-[9px] text-[#6B7A72]">{item.state}</span>
          <DataStatusBadge status={item.data_status} />
        </div>
      </div>
    </div>
  );
}

function TrustPackDrawer({ item, onClose }: { item: MarketplaceItem; onClose: () => void }) {
  const TypeCfg = ITEM_TYPE_CONFIG[item.item_type];
  return (
    <div className="fixed inset-0 z-50 flex" onClick={onClose}>
      <div className="flex-1 bg-black/40 backdrop-blur-sm" />
      <div className="w-full max-w-xl bg-white border-l border-[#E4E9E6] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-[#E4E9E6] px-6 py-4 flex items-center justify-between z-10">
          <div>
            <p className="text-[10px] font-mono text-[#6B7A72] uppercase">{TypeCfg.label} — Trust Pack</p>
            <h2 className="text-sm font-bold text-[#10231C] mt-0.5">{item.title}</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-[#F6F8F7] text-[#6B7A72]"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-6 space-y-5">
          <DataStatusBadge status={item.data_status} />
          {/* WHY */}
          <section>
            <h3 className="text-xs font-bold text-[#10231C] uppercase tracking-wider mb-2 flex items-center gap-2"><span className="w-5 h-5 rounded bg-[#E8F5EE] text-[#0B4A3D] text-[10px] font-black flex items-center justify-center">W</span>WHY this action</h3>
            <p className="text-sm text-[#4B5A54] leading-relaxed">{item.description}</p>
          </section>
          {/* MECHANISM */}
          <section>
            <h3 className="text-xs font-bold text-[#10231C] uppercase tracking-wider mb-2 flex items-center gap-2"><span className="w-5 h-5 rounded bg-[#EBF3FB] text-[#2E6BA8] text-[10px] font-black flex items-center justify-center">M</span>MECHANISM ELIGIBILITY</h3>
            <MechanismTags tags={item.mechanism_tags} />
            <p className="text-xs text-[#6B7A72] mt-2">Mechanism tags indicate which regulatory compliance mechanisms this action counts toward. One action can serve multiple mechanisms simultaneously — provided no physical unit (MWh/tCO₂e) is counted twice across mechanisms (double-count guard enforced).</p>
          </section>
          {/* SOURCE */}
          <section>
            <h3 className="text-xs font-bold text-[#10231C] uppercase tracking-wider mb-2 flex items-center gap-2"><span className="w-5 h-5 rounded bg-[#F4F0FB] text-[#7C5CBF] text-[10px] font-black flex items-center justify-center">S</span>SOURCE & DATA STATUS</h3>
            <div className="bg-[#F6F8F7] rounded-lg p-3 border border-[#E4E9E6] space-y-2 text-xs text-[#4B5A54]">
              <div className="flex justify-between"><span className="font-medium">Trust Pack Ref:</span><span className="font-mono">{item.trust_pack_ref}</span></div>
              <div className="flex justify-between"><span className="font-medium">Data Status:</span><DataStatusBadge status={item.data_status} /></div>
              {item.developer && <div className="flex justify-between"><span className="font-medium">Developer:</span><span>{item.developer}</span></div>}
              <div className="flex justify-between"><span className="font-medium">Location:</span><span>{item.state}</span></div>
              {item.technology_trl && <div className="flex justify-between"><span className="font-medium">Technology TRL:</span><span className="font-mono">{item.technology_trl}/9</span></div>}
            </div>
          </section>
          {/* KEY METRICS */}
          <section>
            <h3 className="text-xs font-bold text-[#10231C] uppercase tracking-wider mb-2 flex items-center gap-2"><span className="w-5 h-5 rounded bg-[#FEF7E8] text-[#C98A1E] text-[10px] font-black flex items-center justify-center">K</span>KEY METRICS</h3>
            <div className="space-y-2 text-xs">
              {item.expected_reduction_tco2e_yr && <div className="flex justify-between py-1.5 border-b border-[#E4E9E6]"><span className="text-[#6B7A72]">Expected CCTS Abatement</span><span className="font-mono font-bold text-[#0B4A3D]">{item.expected_reduction_tco2e_yr.toLocaleString('en-IN')} tCO₂e/yr</span></div>}
              {item.renewable_capacity_mw && <div className="flex justify-between py-1.5 border-b border-[#E4E9E6]"><span className="text-[#6B7A72]">Renewable Capacity</span><span className="font-mono font-bold text-[#C98A1E]">{item.renewable_capacity_mw} MW</span></div>}
              {item.ppa_term_years && <div className="flex justify-between py-1.5 border-b border-[#E4E9E6]"><span className="text-[#6B7A72]">PPA Term</span><span className="font-mono font-bold">{item.ppa_term_years} years</span></div>}
              {item.capex_band_low_cr && <div className="flex justify-between py-1.5 border-b border-[#E4E9E6]"><span className="text-[#6B7A72]">CAPEX Band</span><span className="font-mono font-bold">₹{item.capex_band_low_cr}–{item.capex_band_high_cr} Cr</span></div>}
              {item.tariff_inr_per_mwh && <div className="flex justify-between py-1.5 border-b border-[#E4E9E6]"><span className="text-[#6B7A72]">PPA Tariff (Indicative)</span><span className="font-mono font-bold text-[#C98A1E]">₹{item.tariff_inr_per_mwh}/MWh</span></div>}
              {item.illustrative_price_inr && <div className="flex justify-between py-1.5 border-b border-[#E4E9E6]"><span className="text-[#6B7A72]">Scenario Price</span><span className="font-mono font-bold text-[#2E6BA8]">₹{item.illustrative_price_inr.toLocaleString('en-IN')} {item.price_unit}</span></div>}
              {item.mrv_readiness_score && <div className="flex justify-between py-1.5 border-b border-[#E4E9E6]"><span className="text-[#6B7A72]">MRV Readiness</span><span className="font-mono font-bold" style={{ color: MRV_COLOR(item.mrv_readiness_score) }}>{item.mrv_readiness_score}/100</span></div>}
              {item.compliance_value_score && <div className="flex justify-between py-1.5"><span className="text-[#6B7A72]">Compliance Value Score</span><span className="font-mono font-bold" style={{ color: CVS_COLOR(item.compliance_value_score) }}>{item.compliance_value_score}/100</span></div>}
            </div>
          </section>
          {/* RISK */}
          <section>
            <h3 className="text-xs font-bold text-[#10231C] uppercase tracking-wider mb-2 flex items-center gap-2"><span className="w-5 h-5 rounded bg-[#FDECEA] text-[#C33B2E] text-[10px] font-black flex items-center justify-center">R</span>RISK & ASSUMPTIONS</h3>
            <div className="bg-[#FDECEA]/40 rounded-lg p-3 border border-[#C33B2E]/20 text-xs text-[#4B5A54] space-y-1.5">
              <p>• Prices labeled <strong>ILLUSTRATIVE VALUE</strong> or <strong>MODEL ESTIMATE</strong> are not live market prices and cannot be used for procurement decisions without independent verification.</p>
              <p>• CCTS abatement quantities are modelled projections, not verified/issued Carbon Credit Certificates (CCCs).</p>
              <p>• RCO eligibility depends on SERC jurisdiction, metering configuration, and entity registration status.</p>
              <p>• Technology TRL ≤7 carries higher execution risk — engage technology vendor for pre-FEED before committing capex.</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

const SECTORS = ['all', 'cement', 'petroleum_refinery', 'aluminium', 'steel', 'textile', 'petrochemicals', 'pulp_paper', 'chlor_alkali'];
const ITEM_TYPES = ['all', 'DECARBONISATION_PROJECT', 'RENEWABLE_PPA', 'CCC_LISTING'];
const MECHANISMS = ['all', 'ccts', 'rco'];

export default function MarketplacePage() {
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedItem, setExpandedItem] = useState<MarketplaceItem | null>(null);
  const [search, setSearch] = useState('');
  const [sectorFilter, setSectorFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [mechanismFilter, setMechanismFilter] = useState('all');

  useEffect(() => {
    fetch('/api/marketplace').then(r => r.json()).then(d => {
      setItems(d.data?.items ?? []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return items.filter(i => {
      if (sectorFilter !== 'all' && i.sector !== sectorFilter) return false;
      if (typeFilter !== 'all' && i.item_type !== typeFilter) return false;
      if (mechanismFilter === 'ccts' && !i.mechanism_tags.ccts) return false;
      if (mechanismFilter === 'rco' && !i.mechanism_tags.rco) return false;
      if (search) {
        const q = search.toLowerCase();
        return i.title.toLowerCase().includes(q) || i.description.toLowerCase().includes(q) || i.sector.includes(q);
      }
      return true;
    });
  }, [items, sectorFilter, typeFilter, mechanismFilter, search]);

  return (
    <div className="min-h-screen bg-[#F6F8F7]">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Page header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-xl bg-[#E8F5EE] border border-[#0B4A3D]/20">
              <Building2 className="w-5 h-5 text-[#0B4A3D]" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-[#10231C] tracking-tight">Project & CCC Marketplace</h1>
              <p className="text-sm text-[#4B5A54] mt-0.5">Analytical matching platform — decarbonisation projects, renewable PPAs, and CCC positions. No live execution.</p>
            </div>
          </div>
          {/* Data status legend */}
          <div className="flex flex-wrap gap-2 mt-4 p-3 bg-white rounded-xl border border-[#E4E9E6]">
            <span className="text-[10px] font-semibold text-[#6B7A72] uppercase tracking-wider self-center mr-2">Data Labels:</span>
            {(Object.keys(DATA_STATUS_CONFIG) as MarketplaceDataStatus[]).map(s => <DataStatusBadge key={s} status={s} />)}
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar filters */}
          <aside className="w-56 flex-shrink-0 space-y-4">
            <div className="bg-white rounded-xl border border-[#E4E9E6] p-4">
              <div className="flex items-center gap-2 mb-3">
                <Filter className="w-3.5 h-3.5 text-[#6B7A72]" />
                <span className="text-xs font-semibold text-[#10231C] uppercase tracking-wider">Filters</span>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-[#6B7A72] uppercase tracking-wider">Sector</label>
                  <select value={sectorFilter} onChange={e => setSectorFilter(e.target.value)} className="mt-1 w-full text-xs border border-[#E4E9E6] rounded-lg px-2 py-1.5 bg-white text-[#10231C] focus:outline-none focus:border-[#0B4A3D]">
                    {SECTORS.map(s => <option key={s} value={s}>{s === 'all' ? 'All Sectors' : s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#6B7A72] uppercase tracking-wider">Type</label>
                  <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="mt-1 w-full text-xs border border-[#E4E9E6] rounded-lg px-2 py-1.5 bg-white text-[#10231C] focus:outline-none focus:border-[#0B4A3D]">
                    {ITEM_TYPES.map(t => <option key={t} value={t}>{t === 'all' ? 'All Types' : ITEM_TYPE_CONFIG[t as MarketplaceItemType]?.label ?? t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#6B7A72] uppercase tracking-wider">Mechanism</label>
                  <select value={mechanismFilter} onChange={e => setMechanismFilter(e.target.value)} className="mt-1 w-full text-xs border border-[#E4E9E6] rounded-lg px-2 py-1.5 bg-white text-[#10231C] focus:outline-none focus:border-[#0B4A3D]">
                    <option value="all">All Mechanisms</option>
                    <option value="ccts">CCTS Eligible</option>
                    <option value="rco">RCO Eligible</option>
                  </select>
                </div>
                <button onClick={() => { setSectorFilter('all'); setTypeFilter('all'); setMechanismFilter('all'); setSearch(''); }}
                  className="w-full text-xs text-[#6B7A72] hover:text-[#10231C] py-1.5 border border-[#E4E9E6] rounded-lg hover:bg-[#F6F8F7] transition-colors">
                  Clear Filters
                </button>
              </div>
            </div>

            {/* Summary stats */}
            <div className="bg-white rounded-xl border border-[#E4E9E6] p-4 space-y-3">
              <span className="text-[10px] font-bold text-[#6B7A72] uppercase tracking-wider">Summary</span>
              <div className="text-center">
                <p className="text-2xl font-black text-[#10231C]">{filtered.length}</p>
                <p className="text-[10px] text-[#6B7A72]">Listings Shown</p>
              </div>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between"><span className="text-[#6B7A72]">Projects</span><span className="font-mono font-bold text-[#0B4A3D]">{filtered.filter(i => i.item_type === 'DECARBONISATION_PROJECT').length}</span></div>
                <div className="flex justify-between"><span className="text-[#6B7A72]">PPAs</span><span className="font-mono font-bold text-[#C98A1E]">{filtered.filter(i => i.item_type === 'RENEWABLE_PPA').length}</span></div>
                <div className="flex justify-between"><span className="text-[#6B7A72]">CCC Positions</span><span className="font-mono font-bold text-[#2E6BA8]">{filtered.filter(i => i.item_type === 'CCC_LISTING').length}</span></div>
              </div>
            </div>
          </aside>

          {/* Main grid */}
          <div className="flex-1 min-w-0">
            <div className="mb-4 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3A0]" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search projects, PPAs, sectors..."
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-[#E4E9E6] rounded-xl bg-white text-[#10231C] placeholder-[#9CA3A0] focus:outline-none focus:border-[#0B4A3D] transition-colors" />
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white border border-[#E4E9E6] rounded-xl p-4 animate-pulse h-64">
                    <div className="h-3 bg-[#F6F8F7] rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-[#F6F8F7] rounded w-full mb-2"></div>
                    <div className="h-4 bg-[#F6F8F7] rounded w-5/6"></div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16 text-[#6B7A72]">
                <Building2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="font-medium">No listings match your filters</p>
                <button onClick={() => { setSectorFilter('all'); setTypeFilter('all'); setMechanismFilter('all'); setSearch(''); }} className="mt-3 text-sm text-[#0B4A3D] underline">Clear all filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map(item => <MarketplaceCard key={item.item_id} item={item} onExpand={setExpandedItem} />)}
              </div>
            )}
          </div>
        </div>
      </main>
      <ProvenanceFooter />
      {expandedItem && <TrustPackDrawer item={expandedItem} onClose={() => setExpandedItem(null)} />}
    </div>
  );
}
