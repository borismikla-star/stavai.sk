import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, LineChart, Line, Legend } from 'recharts';

const fmt = (n) => `€ ${Math.round(n || 0).toLocaleString('sk-SK')}`;
const fmtPct = (n) => `${(n || 0).toFixed(0)}%`;

const PHASES = [
  { key: 'presale', label: 'Predpredaj', color: '#6366F1' },
  { key: 'construction', label: 'Počas výstavby', color: '#3B82F6' },
  { key: 'completion', label: 'Po dokončení', color: '#10B981' },
];

// Default: 30% presale, 40% during construction, 30% after completion
const DEFAULT_SPLIT = { presale: 30, construction: 40, completion: 30 };

export default function SalesPlanTab({ baseData, results }) {
  const r = results || {};
  const totalRevenue = r.totalGrossRevenue || 0;
  const durationMonths = Number(baseData?.project_duration_months) || 36;
  const salesStartMonth = Number(baseData?.sales_start_month) || 9;

  const [split, setSplit] = useState(DEFAULT_SPLIT);
  const [presaleDiscount, setPresaleDiscount] = useState(5); // % discount for presale buyers

  // Keep sum at 100%
  const total = split.presale + split.construction + split.completion;

  const handleSplit = (key, val) => {
    const clamped = Math.max(0, Math.min(100, val));
    const others = Object.keys(split).filter(k => k !== key);
    const remaining = 100 - clamped;
    const otherTotal = others.reduce((s, k) => s + split[k], 0);
    const newSplit = { ...split, [key]: clamped };
    if (otherTotal > 0) {
      others.forEach(k => { newSplit[k] = Math.round((split[k] / otherTotal) * remaining); });
    } else {
      const each = Math.floor(remaining / others.length);
      others.forEach((k, i) => { newSplit[k] = i === 0 ? remaining - each * (others.length - 1) : each; });
    }
    setSplit(newSplit);
  };

  // Revenue per phase (presale gets discount)
  const presaleRevenue = totalRevenue * (split.presale / 100) * (1 - presaleDiscount / 100);
  const constructionRevenue = totalRevenue * (split.construction / 100);
  const completionRevenue = totalRevenue * (split.completion / 100);
  const effectiveTotalRevenue = presaleRevenue + constructionRevenue + completionRevenue;
  const revenueImpact = effectiveTotalRevenue - totalRevenue;

  // Monthly cash-inflow chart
  const presaleEnd = salesStartMonth;
  const constructionEnd = durationMonths;
  const completionEnd = durationMonths + 6; // 6 months after delivery

  const monthlyRevenue = useMemo(() => {
    return Array.from({ length: completionEnd }, (_, i) => {
      const m = i + 1;
      let rev = 0;
      if (m <= presaleEnd && split.presale > 0) {
        rev = presaleRevenue / presaleEnd;
      } else if (m > presaleEnd && m <= constructionEnd && split.construction > 0) {
        const span = constructionEnd - presaleEnd;
        rev = constructionRevenue / span;
      } else if (m > constructionEnd && split.completion > 0) {
        rev = completionRevenue / 6;
      }
      return { month: `M${m}`, revenue: rev, phase: m <= presaleEnd ? 'Predpredaj' : m <= constructionEnd ? 'Výstavba' : 'Po dokončení' };
    });
  }, [split, presaleRevenue, constructionRevenue, completionRevenue, presaleEnd, constructionEnd, completionEnd]);

  // Cumulative
  let cum = 0;
  const cumulativeData = monthlyRevenue.map(m => { cum += m.revenue; return { ...m, cumulative: cum }; });

  const breakEvenRevenue = r.totalProjectCosts || 0;
  const breakEvenMonth = cumulativeData.find(m => m.cumulative >= breakEvenRevenue)?.month;

  return (
    <div className="space-y-4">

      {/* Phase split */}
      <div className="grid grid-cols-3 gap-3">
        {PHASES.map(p => (
          <div key={p.key} className="rounded-xl border border-gray-200 p-3 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />
              <span className="text-xs font-semibold text-gray-700">{p.label}</span>
            </div>
            <div className="flex items-center gap-1">
              <input
                type="range" min={0} max={100} value={split[p.key]}
                onChange={e => handleSplit(p.key, Number(e.target.value))}
                className="flex-1 accent-blue-600"
              />
              <span className="text-sm font-bold w-9 text-right" style={{ color: p.color }}>{split[p.key]}%</span>
            </div>
            <div className="text-xs text-gray-500 font-medium">{fmt(
              p.key === 'presale' ? presaleRevenue : p.key === 'construction' ? constructionRevenue : completionRevenue
            )}</div>
          </div>
        ))}
      </div>

      {/* Presale discount */}
      <div className="flex items-center gap-4 bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3">
        <div className="flex-1">
          <div className="text-xs font-semibold text-indigo-700">Predpredajová zľava</div>
          <div className="text-xs text-gray-500">Zľava pre kupujúcich v predpredaji</div>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="range" min={0} max={20} value={presaleDiscount}
            onChange={e => setPresaleDiscount(Number(e.target.value))}
            className="w-24 accent-indigo-600"
          />
          <span className="text-sm font-bold text-indigo-700 w-8">{presaleDiscount}%</span>
        </div>
        <div className={`text-xs font-semibold ${revenueImpact < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
          {revenueImpact < 0 ? '- ' : '+ '}{fmt(Math.abs(revenueImpact))}
        </div>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-3">
          <div className="text-xs text-gray-500 mb-1">Efektívne tržby</div>
          <div className="text-base font-bold text-gray-900">{fmt(effectiveTotalRevenue)}</div>
        </div>
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-3">
          <div className="text-xs text-gray-500 mb-1">Dopad predpredaja</div>
          <div className={`text-base font-bold ${revenueImpact < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
            {revenueImpact >= 0 ? '+' : ''}{fmt(revenueImpact)}
          </div>
        </div>
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-3">
          <div className="text-xs text-gray-500 mb-1">Break-even mesiac</div>
          <div className="text-base font-bold text-blue-700">{breakEvenMonth || 'N/A'}</div>
        </div>
      </div>

      {/* Monthly inflow chart */}
      <div>
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Mesačné príjmy z predaja</div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={monthlyRevenue} barSize={6}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 9 }} interval={5} />
            <YAxis tickFormatter={v => `€${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 9 }} />
            <Tooltip formatter={v => fmt(v)} labelFormatter={l => l} />
            <Bar dataKey="revenue" name="Príjmy" fill="#6366F1" radius={[2, 2, 0, 0]} />
            <ReferenceLine x={`M${Math.round(durationMonths)}`} stroke="#ef4444" strokeDasharray="4 2" label={{ value: 'Odovzdanie', position: 'top', fontSize: 9, fill: '#ef4444' }} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Cumulative revenue vs costs */}
      <div>
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Kumulatívne príjmy vs. náklady projektu</div>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={cumulativeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 9 }} interval={5} />
            <YAxis tickFormatter={v => `€${(v / 1000000).toFixed(1)}M`} tick={{ fontSize: 9 }} />
            <Tooltip formatter={v => fmt(v)} />
            <ReferenceLine y={breakEvenRevenue} stroke="#f59e0b" strokeDasharray="4 2" label={{ value: 'Break-even', position: 'right', fontSize: 9, fill: '#f59e0b' }} />
            <Line type="monotone" dataKey="cumulative" stroke="#10B981" strokeWidth={2} dot={false} name="Kumulatívne príjmy" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}