import React, { useState, useMemo } from 'react';
import { calculateDevelopment } from './devCalcEngine';

const STEPS = [-20, -15, -10, -5, 0, 5, 10, 15, 20];

const VARIABLES = [
  { key: 'apartments_unit_price', label: 'Predajná cena bytov (€/m²)' },
  { key: 'above_ground_unit_price', label: 'Nákl. výstavby nadzemné (€/m²)' },
  { key: 'land_and_project', label: 'Pozemok a projekt (€)' },
  { key: 'bank_interest_percent', label: 'Úroková sadzba banky (%)' },
];

function cellColor(value, metric) {
  if (metric === 'irr') {
    if (value === null) return 'bg-gray-100 text-gray-400';
    if (value >= 20) return 'bg-emerald-200 text-emerald-900 font-bold';
    if (value >= 12) return 'bg-emerald-100 text-emerald-800';
    if (value >= 6) return 'bg-yellow-50 text-yellow-800';
    if (value >= 0) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  } else {
    if (value >= 25) return 'bg-emerald-200 text-emerald-900 font-bold';
    if (value >= 15) return 'bg-emerald-100 text-emerald-800';
    if (value >= 8) return 'bg-yellow-50 text-yellow-800';
    if (value >= 0) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  }
}

export default function SensitivityTab({ baseData }) {
  const [metric, setMetric] = useState('profitMargin'); // 'profitMargin' | 'irr'

  const table = useMemo(() => {
    return VARIABLES.map(v => {
      const row = STEPS.map(pct => {
        const modified = { ...baseData, [v.key]: (Number(baseData[v.key]) || 0) * (1 + pct / 100) };
        const r = calculateDevelopment(modified);
        return metric === 'irr' ? r.irr : r.profitMargin;
      });
      return { label: v.label, key: v.key, values: row };
    });
  }, [baseData, metric]);

  const fmt = (v) => {
    if (v === null || v === undefined) return 'N/A';
    return `${v.toFixed(1)}%`;
  };

  return (
    <div className="space-y-4">
      {/* Metric toggle */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500 font-medium">Zobrazuje:</span>
        <button
          onClick={() => setMetric('profitMargin')}
          className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${metric === 'profitMargin' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
        >
          Zisková marža
        </button>
        <button
          onClick={() => setMetric('irr')}
          className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${metric === 'irr' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
        >
          IRR
        </button>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 flex-wrap text-xs">
        <span className="text-gray-400">Legenda:</span>
        {[
          { cls: 'bg-red-100 text-red-800', l: '< 0%' },
          { cls: 'bg-orange-100 text-orange-800', l: '0–8%' },
          { cls: 'bg-yellow-50 text-yellow-800', l: '8–15%' },
          { cls: 'bg-emerald-100 text-emerald-800', l: '15–25%' },
          { cls: 'bg-emerald-200 text-emerald-900', l: '> 25%' },
        ].map(({ cls, l }) => (
          <span key={l} className={`px-2 py-0.5 rounded ${cls}`}>{l}</span>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-3 py-2 font-semibold text-gray-600 min-w-[180px]">Premenná \ Zmena</th>
              {STEPS.map(s => (
                <th key={s} className={`px-2 py-2 font-semibold text-center min-w-[60px] ${s === 0 ? 'bg-blue-50 text-blue-700' : s < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                  {s > 0 ? `+${s}%` : `${s}%`}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.map((row) => (
              <tr key={row.key} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                <td className="px-3 py-2.5 font-medium text-gray-700 text-xs leading-tight">{row.label}</td>
                {row.values.map((val, i) => (
                  <td key={i} className={`px-2 py-2.5 text-center rounded-sm ${cellColor(val, metric)} ${STEPS[i] === 0 ? 'ring-1 ring-inset ring-blue-300' : ''}`}>
                    {fmt(val)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-400">Každá bunka zobrazuje {metric === 'irr' ? 'IRR' : 'ziskovú maržu'} pri danej percentuálnej zmene vstupu, ostatné vstupy sú fixné.</p>
    </div>
  );
}