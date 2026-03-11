import React, { useState, useMemo } from 'react';
import { calculateDevelopment } from './devCalcEngine';

const fmt = (n) => `€ ${Math.round(n || 0).toLocaleString('sk-SK')}`;
const fmtPct = (n) => `${(n || 0).toFixed(1)}%`;

const DEFAULT_SCENARIOS = [
  {
    key: 'pessimistic',
    label: 'Pesimistický',
    color: 'red',
    adjustments: { price_pct: -10, cost_pct: +10, interest_delta: +1 },
  },
  {
    key: 'base',
    label: 'Základný',
    color: 'blue',
    adjustments: { price_pct: 0, cost_pct: 0, interest_delta: 0 },
  },
  {
    key: 'optimistic',
    label: 'Optimistický',
    color: 'green',
    adjustments: { price_pct: +10, cost_pct: -5, interest_delta: -1 },
  },
];

const COLORS = {
  red: { header: 'bg-red-600', badge: 'bg-red-100 text-red-700', cell: 'text-red-600', border: 'border-red-200' },
  blue: { header: 'bg-blue-600', badge: 'bg-blue-100 text-blue-700', cell: 'text-blue-700', border: 'border-blue-200' },
  green: { header: 'bg-emerald-600', badge: 'bg-emerald-100 text-emerald-700', cell: 'text-emerald-600', border: 'border-emerald-200' },
};

const REVENUE_KEYS = ['apartments_unit_price', 'non_residential_unit_price', 'parking_indoor_unit_price', 'parking_outdoor_unit_price', 'balconies_unit_price', 'gardens_unit_price', 'basements_unit_price'];
const COST_KEYS = ['above_ground_unit_price', 'below_ground_unit_price', 'outdoor_areas_unit_price', 'greenery_terrain_unit_price', 'land_and_project', 'development_fee_per_m2'];

function applyScenario(baseData, adj) {
  const d = { ...baseData };
  const priceMult = 1 + adj.price_pct / 100;
  const costMult = 1 + adj.cost_pct / 100;
  REVENUE_KEYS.forEach(k => { if (d[k]) d[k] = d[k] * priceMult; });
  COST_KEYS.forEach(k => { if (d[k]) d[k] = d[k] * costMult; });
  d.bank_interest_percent = Math.max(0, (Number(d.bank_interest_percent) || 6) + adj.interest_delta);
  return d;
}

function AdjInput({ label, value, onChange, suffix }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-xs text-gray-500 whitespace-nowrap">{label}</span>
      <div className="flex items-center gap-0.5">
        <input
          type="number"
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="w-14 text-center text-xs font-semibold border border-gray-200 rounded-md px-1.5 py-1 focus:outline-none focus:ring-1 focus:ring-blue-400"
        />
        <span className="text-xs text-gray-400">{suffix}</span>
      </div>
    </div>
  );
}

const METRICS = [
  { key: 'totalGrossRevenue', label: 'Celkové tržby', format: fmt },
  { key: 'totalProjectCosts', label: 'Celkové náklady', format: fmt },
  { key: 'grossProfit', label: 'Hrubý zisk', format: fmt, highlight: true },
  { key: 'profitMargin', label: 'Zisková marža', format: fmtPct, highlight: true },
  { key: 'developerMargin', label: 'Dev. marža', format: fmtPct },
  { key: 'irr', label: 'IRR', format: v => v != null ? fmtPct(v) : 'N/A', highlight: true },
  { key: 'equityMultiple', label: 'Násobok kapitálu', format: v => v > 0 ? `${v.toFixed(2)}×` : '—' },
  { key: 'profitAfterTax', label: 'Zisk po dani', format: fmt, highlight: true },
  { key: 'dscr', label: 'DSCR', format: v => v != null ? v.toFixed(2) : '—' },
  { key: 'totalFinancingCosts', label: 'Náklady financovania', format: fmt },
];

export default function ScenariosTab({ baseData }) {
  const [scenarios, setScenarios] = useState(DEFAULT_SCENARIOS);

  const results = useMemo(() =>
    scenarios.map(s => ({
      ...s,
      r: calculateDevelopment(applyScenario(baseData, s.adjustments)),
    })),
    [baseData, scenarios]
  );

  const updateAdj = (key, field, value) => {
    setScenarios(prev => prev.map(s => s.key === key ? { ...s, adjustments: { ...s.adjustments, [field]: value } } : s));
  };

  return (
    <div className="space-y-4">
      {/* Adjustment controls */}
      <div className="grid grid-cols-3 gap-3">
        {scenarios.map(s => {
          const c = COLORS[s.color];
          return (
            <div key={s.key} className={`rounded-xl border ${c.border} p-3 space-y-3`}>
              <div className={`text-xs font-bold px-2 py-1 rounded-full text-center ${c.badge}`}>{s.label}</div>
              <div className="space-y-2">
                <AdjInput label="Ceny predaja" value={s.adjustments.price_pct} onChange={v => updateAdj(s.key, 'price_pct', v)} suffix="%" />
                <AdjInput label="Stav. náklady" value={s.adjustments.cost_pct} onChange={v => updateAdj(s.key, 'cost_pct', v)} suffix="%" />
                <AdjInput label="Úrok ±" value={s.adjustments.interest_delta} onChange={v => updateAdj(s.key, 'interest_delta', v)} suffix="p.b." />
              </div>
            </div>
          );
        })}
      </div>

      {/* Comparison table */}
      <div className="rounded-xl overflow-hidden border border-gray-200">
        {/* Header row */}
        <div className="grid grid-cols-4 text-xs font-bold">
          <div className="bg-gray-50 px-4 py-3 text-gray-500 uppercase tracking-wide">Metrika</div>
          {results.map(s => (
            <div key={s.key} className={`${COLORS[s.color].header} text-white px-4 py-3 text-center`}>{s.label}</div>
          ))}
        </div>

        {/* Data rows */}
        {METRICS.map((m, i) => (
          <div key={m.key} className={`grid grid-cols-4 text-xs border-t border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} ${m.highlight ? 'font-semibold' : ''}`}>
            <div className="px-4 py-2.5 text-gray-600">{m.label}</div>
            {results.map(s => {
              const val = s.r[m.key];
              return (
                <div key={s.key} className={`px-4 py-2.5 text-center ${m.highlight ? COLORS[s.color].cell : 'text-gray-700'}`}>
                  {m.format(val)}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400 text-center">% odchýlky sa aplikujú na predajné ceny, stavebné náklady a úrokovú sadzbu voči základnému scenáru.</p>
    </div>
  );
}