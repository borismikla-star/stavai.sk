import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

// SK trhové benchmarky 2024
const INPUT_BENCHMARKS = [
  { key: 'above_ground_unit_price', label: 'Stavba nad zemou', low: 1200, high: 1900, unit: '€/m²' },
  { key: 'below_ground_unit_price', label: 'Stavba pod zemou', low: 750, high: 1400, unit: '€/m²' },
  { key: 'apartments_unit_price', label: 'Predajná cena bytov (BA)', low: 2800, high: 5500, unit: '€/m²' },
  { key: 'parking_indoor_unit_price', label: 'Kryté parkovanie', low: 18000, high: 40000, unit: '€/ks' },
  { key: 'own_resources_percent', label: 'Vlastné zdroje', low: 20, high: 45, unit: '%' },
  { key: 'bank_interest_percent', label: 'Úroková sadzba banky', low: 4.5, high: 8.5, unit: '%' },
];

const RESULT_BENCHMARKS = [
  { key: 'irr', label: 'IRR projektu', low: 10, high: 25, unit: '%' },
  { key: 'developerMargin', label: 'Dev. marža', low: 15, high: 30, unit: '%' },
  { key: 'profitMargin', label: 'Zisková marža', low: 12, high: 25, unit: '%' },
];

function BenchmarkRow({ label, value, low, high, unit }) {
  if (value == null || value === 0 || isNaN(value)) return null;
  const n = Number(value);
  const pct = Math.min(100, Math.max(0, ((n - low) / (high - low)) * 100));
  const isBelow = n < low;
  const isAbove = n > high;
  const isInRange = !isBelow && !isAbove;

  const statusLabel = isBelow ? 'Pod' : isAbove ? 'Nad' : 'V norme';
  const statusColor = isBelow ? 'text-amber-600 bg-amber-50' : isAbove ? 'text-emerald-600 bg-emerald-50' : 'text-blue-600 bg-blue-50';
  const Icon = isBelow ? TrendingDown : isAbove ? TrendingUp : Minus;

  return (
    <div className="py-2.5 border-b border-gray-100 last:border-0">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-gray-600">{label}</span>
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-gray-900">
            {typeof n === 'number' && n >= 1000 ? n.toLocaleString('sk-SK') : n.toFixed(1)} {unit}
          </span>
          <span className={`flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${statusColor}`}>
            <Icon className="w-3 h-3" />{statusLabel}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 text-[10px] text-gray-400">
        <span className="w-10 text-right">{low.toLocaleString()}</span>
        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-200 via-blue-300 to-emerald-300 rounded-full opacity-60" />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-gray-800 border-2 border-white shadow-sm"
            style={{ left: `clamp(0%, ${pct}%, 100%)`, transform: 'translate(-50%, -50%)' }}
          />
        </div>
        <span className="w-10">{high.toLocaleString()}</span>
      </div>
    </div>
  );
}

export default function BenchmarkContext({ data, results }) {
  const r = results || {};

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-xs text-blue-700 leading-relaxed">
        Porovnanie vašich vstupov a výsledkov s <strong>SK trhovými benchmarkmi 2024</strong>.
        Rozsah indikuje typické hodnoty na slovenskom trhu.
      </div>
      <div>
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Vstupné parametre</div>
        {INPUT_BENCHMARKS.map(b => (
          <BenchmarkRow key={b.key} label={b.label} value={data?.[b.key]} low={b.low} high={b.high} unit={b.unit} />
        ))}
      </div>
      <div>
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Výsledky projektu</div>
        {RESULT_BENCHMARKS.map(b => (
          <BenchmarkRow key={b.key} label={b.label} value={r[b.key]} low={b.low} high={b.high} unit={b.unit} />
        ))}
      </div>
    </div>
  );
}