import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Cell, LineChart, Line, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';
import Paywall from '../components/shared/Paywall';

const fmt = (n) => new Intl.NumberFormat('sk-SK', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n || 0);
const fmtEur = (n) => `€ ${fmt(n)}`;
const fmtPct = (n) => `${n >= 0 ? '+' : ''}${n.toFixed(1)}%`;

function calcProject({ totalRevenue, totalCost, durationMonths }) {
  const grossProfit = totalRevenue - totalCost;
  const margin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;
  const roi = totalCost > 0 ? (grossProfit / totalCost) * 100 : 0;
  const breakEvenRevenue = totalCost;
  const breakEvenUnits = totalRevenue > 0 ? (totalCost / totalRevenue) * 100 : 100;
  // Simplified IRR
  const years = durationMonths / 12;
  const irr = grossProfit > 0 && years > 0 ? (Math.pow(totalRevenue / totalCost, 1 / years) - 1) * 100 : 0;
  return { grossProfit, margin, roi, irr, breakEvenUnits };
}

const baseDefaults = {
  name: 'Môj projekt',
  total_revenue: 18000000,
  total_cost: 14500000,
  duration_months: 36,
};

export default function SensitivityEngine() {
  const [base, setBase] = useState(baseDefaults);

  const baseResult = useMemo(() => calcProject({
    totalRevenue: base.total_revenue,
    totalCost: base.total_cost,
    durationMonths: base.duration_months,
  }), [base]);

  const scenarios = useMemo(() => {
    const scenarios = [
      { id: 'base', label: 'Základný scenár', priceChange: 0, costChange: 0, rateChange: 0, delayMonths: 0 },
      { id: 'price_down_5', label: 'Predajná cena −5%', priceChange: -5, costChange: 0, rateChange: 0, delayMonths: 0 },
      { id: 'price_down_10', label: 'Predajná cena −10%', priceChange: -10, costChange: 0, rateChange: 0, delayMonths: 0 },
      { id: 'price_down_15', label: 'Predajná cena −15%', priceChange: -15, costChange: 0, rateChange: 0, delayMonths: 0 },
      { id: 'cost_up_10', label: 'Nákl. výstavby +10%', priceChange: 0, costChange: 10, rateChange: 0, delayMonths: 0 },
      { id: 'cost_up_15', label: 'Nákl. výstavby +15%', priceChange: 0, costChange: 15, rateChange: 0, delayMonths: 0 },
      { id: 'cost_up_20', label: 'Nákl. výstavby +20%', priceChange: 0, costChange: 20, rateChange: 0, delayMonths: 0 },
      { id: 'delay_3', label: 'Oneskorenie 3 mes.', priceChange: 0, costChange: 0, rateChange: 0, delayMonths: 3 },
      { id: 'delay_6', label: 'Oneskorenie 6 mes.', priceChange: 0, costChange: 0, rateChange: 0, delayMonths: 6 },
      { id: 'delay_12', label: 'Oneskorenie 12 mes.', priceChange: 0, costChange: 0, rateChange: 0, delayMonths: 12 },
      { id: 'combo_bad', label: 'Stresový scenár', priceChange: -10, costChange: 15, rateChange: 1, delayMonths: 6 },
      { id: 'combo_good', label: 'Optimistický scenár', priceChange: 5, costChange: -5, rateChange: 0, delayMonths: -3 },
    ];

    return scenarios.map(sc => {
      const adjRevenue = base.total_revenue * (1 + sc.priceChange / 100);
      const adjCost = base.total_cost * (1 + sc.costChange / 100) + (sc.delayMonths * base.total_cost * 0.003);
      const adjDuration = base.duration_months + sc.delayMonths;
      const result = calcProject({ totalRevenue: adjRevenue, totalCost: adjCost, durationMonths: adjDuration });
      return { ...sc, ...result, adjRevenue, adjCost };
    });
  }, [base]);

  const baseScenario = scenarios.find(s => s.id === 'base');

  // Tornado data - impact of each variable ±10%
  const tornadoData = useMemo(() => {
    const vars = [
      { label: 'Predajná cena', down: calcProject({ totalRevenue: base.total_revenue * 0.9, totalCost: base.total_cost, durationMonths: base.duration_months }), up: calcProject({ totalRevenue: base.total_revenue * 1.1, totalCost: base.total_cost, durationMonths: base.duration_months }) },
      { label: 'Stavebné náklady', down: calcProject({ totalRevenue: base.total_revenue, totalCost: base.total_cost * 0.9, durationMonths: base.duration_months }), up: calcProject({ totalRevenue: base.total_revenue, totalCost: base.total_cost * 1.1, durationMonths: base.duration_months }) },
      { label: 'Dĺžka projektu', down: calcProject({ totalRevenue: base.total_revenue, totalCost: base.total_cost, durationMonths: base.duration_months * 0.85 }), up: calcProject({ totalRevenue: base.total_revenue, totalCost: base.total_cost * 1.05, durationMonths: base.duration_months * 1.15 }) },
      { label: 'Cena pozemku', down: calcProject({ totalRevenue: base.total_revenue, totalCost: base.total_cost * 0.95, durationMonths: base.duration_months }), up: calcProject({ totalRevenue: base.total_revenue, totalCost: base.total_cost * 1.05, durationMonths: base.duration_months }) },
    ];
    return vars.map(v => ({
      label: v.label,
      impact_down: v.down.margin - baseResult.margin,
      impact_up: v.up.margin - baseResult.margin,
      range: Math.abs(v.up.margin - v.down.margin),
    })).sort((a, b) => b.range - a.range);
  }, [base, baseResult]);

  const B = ({ label, field, suffix = '' }) => (
    <div>
      <Label className="text-xs text-slate-500 mb-1 block">{label}</Label>
      <div className="relative">
        <Input type="number" value={base[field]} onChange={(e) => setBase(p => ({ ...p, [field]: parseFloat(e.target.value) || 0 }))} className="text-sm bg-white border-slate-200 pr-12" />
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">{suffix}</span>}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="text-xs text-blue-600 uppercase tracking-widest font-semibold mb-1">Nástroj</div>
        <h1 className="text-3xl font-black text-[#0F172A]">Sensitivity & Risk Engine</h1>
        <p className="text-slate-500 text-sm mt-1">Scenárové simulácie – dopad zmien na IRR, zisk a maržu</p>
      </div>

      <Paywall feature="Sensitivity & Risk Engine je Pro funkcia" minHeight={400}>
        <div className="grid lg:grid-cols-4 gap-8">
        {/* Base Inputs */}
        <div className="space-y-6">
          <Card className="bg-white border-slate-200">
            <CardHeader className="pb-3"><CardTitle className="text-sm font-bold uppercase tracking-wider text-[#0F172A]">Základný scenár</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs text-slate-500 mb-1 block">Názov projektu</Label>
                <Input value={base.name} onChange={(e) => setBase(p => ({ ...p, name: e.target.value }))} className="text-sm bg-white border-slate-200" />
              </div>
              <B label="Celkové tržby" field="total_revenue" suffix="€" />
              <B label="Celkové náklady" field="total_cost" suffix="€" />
              <B label="Dĺžka projektu" field="duration_months" suffix="mes." />
            </CardContent>
          </Card>

          {/* Base Result */}
          <Card className="bg-[#0F172A] border-slate-700">
            <CardHeader className="pb-3"><CardTitle className="text-sm font-bold text-slate-300 uppercase tracking-wider">Základné výsledky</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {[
                { l: 'Hrubý zisk', v: fmtEur(baseResult.grossProfit) },
                { l: 'Marža', v: `${baseResult.margin.toFixed(1)}%` },
                { l: 'ROI', v: `${baseResult.roi.toFixed(1)}%` },
                { l: 'IRR (anuál.)', v: `${baseResult.irr.toFixed(1)}%` },
                { l: 'Break-even', v: `${baseResult.breakEvenUnits.toFixed(0)}%` },
              ].map((m, i) => (
                <div key={i} className="flex justify-between">
                  <span className="text-slate-400 text-sm">{m.l}</span>
                  <span className="text-blue-400 font-bold text-sm">{m.v}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <div className="lg:col-span-3 space-y-6">
          {/* Scenario Table */}
          <Card className="bg-white border-slate-200">
            <CardHeader><CardTitle className="text-base text-[#0F172A]">Scenárová analýza</CardTitle></CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="text-left px-5 py-3 text-slate-600 font-semibold">Scenár</th>
                      <th className="text-right px-4 py-3 text-slate-600 font-semibold">Zisk</th>
                      <th className="text-right px-4 py-3 text-slate-600 font-semibold">Marža</th>
                      <th className="text-right px-4 py-3 text-slate-600 font-semibold">Δ Marža</th>
                      <th className="text-right px-4 py-3 text-slate-600 font-semibold">IRR</th>
                      <th className="text-center px-4 py-3 text-slate-600 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scenarios.map((sc) => {
                      const deltaMargin = sc.margin - baseResult.margin;
                      const isBase = sc.id === 'base';
                      const status = sc.margin > 15 ? { l: 'OK', cls: 'bg-green-100 text-green-700' } : sc.margin > 8 ? { l: 'Pozor', cls: 'bg-amber-100 text-amber-700' } : { l: 'Riziko', cls: 'bg-red-100 text-red-700' };
                      return (
                        <tr key={sc.id} className={`border-b border-slate-100 ${isBase ? 'bg-blue-50' : 'hover:bg-slate-50'}`}>
                          <td className="px-5 py-3 font-medium text-[#0F172A]">
                            {sc.label} {isBase && <Badge className="ml-1 bg-blue-100 text-blue-700 text-xs">Základ</Badge>}
                          </td>
                          <td className="px-4 py-3 text-right font-semibold text-[#0F172A]">{fmtEur(sc.grossProfit)}</td>
                          <td className="px-4 py-3 text-right font-bold text-[#0F172A]">{sc.margin.toFixed(1)}%</td>
                          <td className="px-4 py-3 text-right">
                            {!isBase && (
                              <span className={`flex items-center justify-end gap-1 font-semibold text-xs ${deltaMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {deltaMargin >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                {fmtPct(deltaMargin)}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right text-slate-700">{sc.irr.toFixed(1)}%</td>
                          <td className="px-4 py-3 text-center">
                            <Badge className={`text-xs ${status.cls}`}>{status.l}</Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Charts Row */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Margin Chart */}
            <Card className="bg-white border-slate-200">
              <CardHeader><CardTitle className="text-sm text-[#0F172A]">Marža podľa scenárov</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={scenarios} layout="vertical" margin={{ left: 10 }}>
                    <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={(v) => `${v.toFixed(0)}%`} />
                    <YAxis type="category" dataKey="label" tick={{ fontSize: 9 }} width={115} />
                    <Tooltip formatter={(v) => `${v.toFixed(1)}%`} />
                    <ReferenceLine x={0} stroke="#94A3B8" />
                    <Bar dataKey="margin" radius={[0, 3, 3, 0]}>
                      {scenarios.map((sc) => (
                        <Cell key={sc.id} fill={sc.margin > 15 ? '#10B981' : sc.margin > 8 ? '#F59E0B' : '#EF4444'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Tornado Chart */}
            <Card className="bg-white border-slate-200">
              <CardHeader><CardTitle className="text-sm text-[#0F172A]">Tornado – citlivosť marže (±10%)</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-4 mt-2">
                  {tornadoData.map((item, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-xs text-slate-500 mb-1">
                        <span>{item.label}</span>
                        <span className="font-medium text-slate-700">Rozsah: {item.range.toFixed(1)} p.p.</span>
                      </div>
                      <div className="relative h-6 bg-slate-100 rounded overflow-hidden">
                        <div className="absolute inset-y-0 left-1/2 w-0.5 bg-slate-300 z-10" />
                        {item.impact_down < 0 && (
                          <div className="absolute inset-y-0 right-1/2 bg-red-400 rounded-l"
                            style={{ width: `${Math.min(Math.abs(item.impact_down) * 2, 50)}%` }} />
                        )}
                        {item.impact_up > 0 && (
                          <div className="absolute inset-y-0 left-1/2 bg-green-400 rounded-r"
                            style={{ width: `${Math.min(item.impact_up * 2, 50)}%` }} />
                        )}
                      </div>
                      <div className="flex justify-between text-xs mt-0.5">
                        <span className="text-red-600">{fmtPct(item.impact_down)}</span>
                        <span className="text-green-600">{fmtPct(item.impact_up)}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-slate-400 mt-4 border-t border-slate-100 pt-3">
                  <span className="text-red-500">Nepriaznivá strana (−10%)</span>
                  <span className="text-green-500">Priaznivá strana (+10%)</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Break-even info */}
          <Card className="bg-white border-slate-200">
            <CardHeader><CardTitle className="text-sm text-[#0F172A]">Break-even analýza</CardTitle></CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { label: 'Minimálna predajná cena (break-even)', value: fmtEur(base.total_cost / (base.total_revenue / Math.max(base.total_revenue, 1) || 1) * (base.total_revenue / Math.max(base.total_revenue, 1))), sub: 'pri súčasnom objeme' },
                  { label: 'Min. % predaných jednotiek', value: `${baseResult.breakEvenUnits.toFixed(0)}%`, sub: 'pred dosiahnutím zisku' },
                  { label: 'Max. nárast nákladov (break-even)', value: `+${((base.total_revenue / base.total_cost - 1) * 100).toFixed(1)}%`, sub: 'pred dosiahnutím straty' },
                ].map((m, i) => (
                  <div key={i} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="text-xs text-slate-500 mb-2">{m.label}</div>
                    <div className="text-xl font-black text-[#0F172A]">{m.value}</div>
                    <div className="text-xs text-slate-400 mt-1">{m.sub}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      </Paywall>
    </div>
  );
}