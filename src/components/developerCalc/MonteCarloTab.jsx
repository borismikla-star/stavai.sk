import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { calculateDevelopment } from './devCalcEngine';

const fmt = (n) => `€ ${Math.round(n || 0).toLocaleString('sk-SK')}`;
const fmtPct = (n) => `${(n || 0).toFixed(1)}%`;

// Box-Muller normal random
function randNormal(mean = 0, std = 1) {
  const u1 = Math.random(), u2 = Math.random();
  return mean + std * Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

const N_RUNS = 1000;

export default function MonteCarloTab({ baseData }) {
  const [priceStd, setPriceStd] = useState(8);
  const [costStd, setCostStd] = useState(10);
  const [interestStd, setInterestStd] = useState(1.5);

  const { profits, irrs, stats } = useMemo(() => {
    const profits = [];
    const irrs = [];

    for (let i = 0; i < N_RUNS; i++) {
      const priceMult = 1 + randNormal(0, priceStd / 100);
      const costMult = 1 + randNormal(0, costStd / 100);
      const interestDelta = randNormal(0, interestStd);

      const simData = {
        ...baseData,
        apartments_unit_price: (baseData.apartments_unit_price || 0) * priceMult,
        non_residential_unit_price: (baseData.non_residential_unit_price || 0) * priceMult,
        parking_indoor_unit_price: (baseData.parking_indoor_unit_price || 0) * priceMult,
        parking_outdoor_unit_price: (baseData.parking_outdoor_unit_price || 0) * priceMult,
        balconies_unit_price: (baseData.balconies_unit_price || 0) * priceMult,
        gardens_unit_price: (baseData.gardens_unit_price || 0) * priceMult,
        basements_unit_price: (baseData.basements_unit_price || 0) * priceMult,
        above_ground_unit_price: (baseData.above_ground_unit_price || 0) * costMult,
        below_ground_unit_price: (baseData.below_ground_unit_price || 0) * costMult,
        bank_interest_percent: Math.max(0, (baseData.bank_interest_percent || 6) + interestDelta),
      };

      const r = calculateDevelopment(simData);
      profits.push(r.grossProfit || 0);
      irrs.push(r.irr || 0);
    }

    profits.sort((a, b) => a - b);
    irrs.sort((a, b) => a - b);

    const p = (arr, pct) => arr[Math.floor(pct / 100 * arr.length)];
    const mean = profits.reduce((s, v) => s + v, 0) / profits.length;
    const positiveCount = profits.filter(v => v > 0).length;

    return {
      profits,
      irrs,
      stats: {
        p10: p(profits, 10),
        p25: p(profits, 25),
        p50: p(profits, 50),
        p75: p(profits, 75),
        p90: p(profits, 90),
        mean,
        probPositive: (positiveCount / N_RUNS) * 100,
        irrP10: p(irrs, 10),
        irrP50: p(irrs, 50),
        irrP90: p(irrs, 90),
      },
    };
  }, [baseData, priceStd, costStd, interestStd]);

  // Build histogram bins
  const histData = useMemo(() => {
    if (!profits.length) return [];
    const min = profits[0], max = profits[profits.length - 1];
    const BINS = 30;
    const binSize = (max - min) / BINS;
    const bins = Array.from({ length: BINS }, (_, i) => ({
      start: min + i * binSize,
      mid: min + (i + 0.5) * binSize,
      count: 0,
    }));
    profits.forEach(v => {
      const idx = Math.min(Math.floor((v - min) / binSize), BINS - 1);
      bins[idx].count++;
    });
    return bins.map(b => ({
      label: `${(b.mid / 1000000).toFixed(1)}M`,
      count: b.count,
      fill: b.mid >= 0 ? '#10B981' : '#EF4444',
    }));
  }, [profits]);

  const sliders = [
    { label: 'Rozptyl cien', key: 'price', value: priceStd, set: setPriceStd, color: '#6366F1', max: 25, unit: '%' },
    { label: 'Rozptyl nákladov', key: 'cost', value: costStd, set: setCostStd, color: '#F59E0B', max: 30, unit: '%' },
    { label: 'Rozptyl úrokovej sadzby', key: 'interest', value: interestStd, set: setInterestStd, color: '#EF4444', max: 5, unit: 'p.b.' },
  ];

  return (
    <div className="space-y-4">
      {/* Slider controls */}
      <div className="grid grid-cols-3 gap-3">
        {sliders.map(s => (
          <div key={s.key} className="rounded-xl border border-gray-200 p-3">
            <div className="text-xs font-semibold text-gray-600 mb-1">{s.label}</div>
            <div className="flex items-center gap-2">
              <input
                type="range" min={0} max={s.max} step={0.5} value={s.value}
                onChange={e => s.set(Number(e.target.value))}
                className="flex-1"
                style={{ accentColor: s.color }}
              />
              <span className="text-sm font-bold w-14 text-right" style={{ color: s.color }}>
                ±{s.value}{s.unit}
              </span>
            </div>
            <div className="text-xs text-gray-400 mt-0.5">Štandardná odchýlka (1σ)</div>
          </div>
        ))}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Pravdepodobnosť zisku', value: `${stats.probPositive.toFixed(0)}%`, color: stats.probPositive > 80 ? 'text-emerald-600' : stats.probPositive > 50 ? 'text-amber-600' : 'text-red-600', bg: 'bg-gray-50' },
          { label: 'Medián zisku (P50)', value: fmt(stats.p50), color: stats.p50 >= 0 ? 'text-emerald-700' : 'text-red-600', bg: 'bg-gray-50' },
          { label: 'Pesimistický (P10)', value: fmt(stats.p10), color: stats.p10 >= 0 ? 'text-emerald-700' : 'text-red-600', bg: 'bg-red-50' },
          { label: 'Optimistický (P90)', value: fmt(stats.p90), color: 'text-emerald-700', bg: 'bg-emerald-50' },
        ].map((s, i) => (
          <div key={i} className={`${s.bg} rounded-xl border border-gray-200 p-3`}>
            <div className="text-xs text-gray-500 mb-1">{s.label}</div>
            <div className={`text-base font-bold ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Histogram */}
      <div>
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Rozdelenie zisku — {N_RUNS} simulácií
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={histData} barCategoryGap="2%">
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 9 }} interval={4} />
            <YAxis tick={{ fontSize: 9 }} />
            <Tooltip
              formatter={(v) => [`${v} simulácií`, 'Počet']}
              labelFormatter={(l) => `Zisk ~${l}`}
            />
            <ReferenceLine x={histData.find(b => b.label.startsWith('0') || parseFloat(b.label) >= 0)?.label} stroke="#374151" strokeDasharray="4 2" />
            <Bar dataKey="count" name="Počet" radius={[2, 2, 0, 0]}>
              {histData.map((entry, i) => (
                <rect key={i} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* IRR distribution */}
      <div className="grid grid-cols-3 gap-3 text-center text-xs">
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-3">
          <div className="text-gray-500 mb-1">IRR P10</div>
          <div className="font-bold text-red-600">{fmtPct(stats.irrP10)}</div>
        </div>
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-3">
          <div className="text-gray-500 mb-1">IRR P50 (medián)</div>
          <div className="font-bold text-blue-700">{fmtPct(stats.irrP50)}</div>
        </div>
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-3">
          <div className="text-gray-500 mb-1">IRR P90</div>
          <div className="font-bold text-emerald-600">{fmtPct(stats.irrP90)}</div>
        </div>
      </div>
    </div>
  );
}