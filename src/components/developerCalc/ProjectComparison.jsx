import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const fmt = (n) => n != null ? `€ ${Math.round(n).toLocaleString('sk-SK')}` : '—';
const fmtPct = (n) => n != null ? `${Number(n).toFixed(1)}%` : '—';
const fmtX = (n) => n != null && n > 0 ? `${Number(n).toFixed(2)}×` : '—';

const METRICS = [
  { key: 'totalGrossRevenue', label: 'Celkové tržby', format: fmt, better: 'high' },
  { key: 'totalProjectCosts', label: 'Celkové náklady', format: fmt, better: 'low' },
  { key: 'grossProfit', label: 'Hrubý zisk', format: fmt, better: 'high' },
  { key: 'profitMargin', label: 'Zisková marža', format: fmtPct, better: 'high', suffix: '%' },
  { key: 'developerMargin', label: 'Dev. marža', format: fmtPct, better: 'high' },
  { key: 'irr', label: 'IRR', format: fmtPct, better: 'high' },
  { key: 'equityMultiple', label: 'Násobok kapitálu', format: fmtX, better: 'high' },
  { key: 'profitAfterTax', label: 'Zisk po dani', format: fmt, better: 'high' },
  { key: 'costPerM2', label: 'Náklady/m²', format: (n) => n ? `€ ${Math.round(n)}` : '—', better: 'low' },
  { key: 'revenuePerM2', label: 'Výnos/m²', format: (n) => n ? `€ ${Math.round(n)}` : '—', better: 'high' },
];

function getBest(projects, key, better) {
  const vals = projects.map(p => (p.results || {})[key]).filter(v => v != null && !isNaN(v));
  if (!vals.length) return null;
  return better === 'high' ? Math.max(...vals) : Math.min(...vals);
}

function Cell({ value, best, better, format }) {
  const numVal = Number(value);
  const isBest = best != null && Math.abs(numVal - best) < 0.001;
  const isGood = better === 'high' ? numVal >= 0 : numVal >= 0;
  return (
    <td className={`px-3 py-2.5 text-right text-xs font-mono whitespace-nowrap border-l border-gray-100
      ${isBest ? 'bg-emerald-50 font-bold text-emerald-700' : ''}
      ${!isBest && value != null && numVal < 0 ? 'text-red-500' : !isBest ? 'text-gray-700' : ''}
    `}>
      <div className="flex items-center justify-end gap-1">
        {isBest && <span className="text-emerald-500 text-[10px]">★</span>}
        {format(value)}
      </div>
    </td>
  );
}

export default function ProjectComparison({ projects }) {
  const parsed = projects.map(p => {
    let results = p.results || {};
    try {
      const desc = JSON.parse(p.description || '{}');
      if (desc.results) results = desc.results;
    } catch {}
    return { ...p, results };
  });

  if (parsed.length < 2) {
    return (
      <div className="text-center py-10 text-gray-400 text-sm">
        Uložte aspoň 2 projekty pre porovnanie.
      </div>
    );
  }

  return (
    <div className="overflow-auto">
      <table className="w-full min-w-[600px] text-xs">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="text-left px-3 py-2.5 font-semibold text-gray-500 uppercase tracking-wide text-[10px] sticky left-0 bg-gray-50 z-10">
              Metrika
            </th>
            {parsed.map(p => (
              <th key={p.id} className="px-3 py-2.5 font-semibold text-gray-800 text-right max-w-[120px]">
                <div className="truncate max-w-[110px] ml-auto" title={p.name}>{p.name}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {METRICS.map((metric, i) => {
            const best = getBest(parsed, metric.key, metric.better);
            return (
              <tr key={metric.key} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/60'}>
                <td className="px-3 py-2.5 text-gray-500 font-medium sticky left-0 bg-inherit z-10 text-[11px]">
                  {metric.label}
                </td>
                {parsed.map(p => (
                  <Cell
                    key={p.id}
                    value={p.results[metric.key]}
                    best={best}
                    better={metric.better}
                    format={metric.format}
                  />
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="text-[10px] text-gray-400 mt-2 px-1">★ = najlepšia hodnota v riadku</div>
    </div>
  );
}