import React, { useState, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Save, TrendingUp, Building2, Calculator } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function calcIRR(cashflows) {
  let low = -0.99, high = 5;
  for (let i = 0; i < 200; i++) {
    const mid = (low + high) / 2;
    const npv = cashflows.reduce((s, cf, t) => s + cf / Math.pow(1 + mid, t), 0);
    if (Math.abs(npv) < 1) return mid * 100;
    npv > 0 ? (low = mid) : (high = mid);
  }
  return ((low + high) / 2) * 100;
}

const fmt = (n) => new Intl.NumberFormat('sk-SK', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);
const fmtEur = (n) => `€ ${fmt(n)}`;

const defaultInputs = {
  project_name: 'Nová analýza',
  land_area: 5000,
  land_price_total: 1500000,
  floor_area_ratio: 1.8,
  efficiency_ratio: 0.83,
  avg_unit_size: 72,
  sales_price_per_sqm: 3800,
  construction_cost_per_sqm: 1450,
  other_costs_pct: 18,
  developer_fee_pct: 8,
  project_duration_months: 36,
  parking_ratio: 1.1,
  parking_price: 18000,
};

export default function LandFeasibility() {
  const [inputs, setInputs] = useState(defaultInputs);
  const queryClient = useQueryClient();

  const { data: user } = useQuery({ queryKey: ['currentUser'], queryFn: () => base44.auth.me() });

  const r = useMemo(() => {
    const hpp = inputs.land_area * inputs.floor_area_ratio;
    const nfa = hpp * inputs.efficiency_ratio;
    const units = Math.floor(nfa / inputs.avg_unit_size);
    const parking = Math.floor(units * inputs.parking_ratio);

    const revenueApts = nfa * inputs.sales_price_per_sqm;
    const revenueParking = parking * inputs.parking_price;
    const totalRevenue = revenueApts + revenueParking;

    const constructionCost = hpp * inputs.construction_cost_per_sqm;
    const otherCosts = constructionCost * (inputs.other_costs_pct / 100);
    const developerFee = totalRevenue * (inputs.developer_fee_pct / 100);
    const totalCostExLand = constructionCost + otherCosts + developerFee;

    const residualLandValue = totalRevenue - totalCostExLand;
    const maxLandPrice = residualLandValue;
    const totalCost = totalCostExLand + inputs.land_price_total;
    const grossProfit = totalRevenue - totalCost;
    const margin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;
    const roi = inputs.land_price_total > 0 ? (grossProfit / totalCost) * 100 : 0;

    // Simple annual cashflows for IRR (investment year 0, returns split over project)
    const investmentPhase = Math.floor(inputs.project_duration_months / 12);
    const annualCost = totalCost / Math.max(investmentPhase, 1);
    const annualRevenue = totalRevenue / Math.max(Math.ceil((inputs.project_duration_months - 12) / 12), 1);
    const cashflows = [
      -totalCost * 0.3,
      -totalCost * 0.5,
      ...Array(Math.max(Math.ceil(inputs.project_duration_months / 12) - 1, 1)).fill(0).map((_, i) =>
        i === Math.ceil(inputs.project_duration_months / 12) - 2 ? totalRevenue : 0
      )
    ];
    const irr = calcIRR(cashflows);
    const npv = cashflows.reduce((s, cf, t) => s + cf / Math.pow(1.08, t), 0);

    return { hpp, nfa, units, parking, revenueApts, revenueParking, totalRevenue, constructionCost, otherCosts, developerFee, totalCostExLand, residualLandValue, maxLandPrice, totalCost, grossProfit, margin, roi, irr, npv };
  }, [inputs]);

  const saveMutation = useMutation({
    mutationFn: () => base44.entities.FeasibilityAnalysis.create({
      project_name: inputs.project_name,
      investment_amount: r.totalCost,
      expected_revenue: r.totalRevenue,
      roi: parseFloat(r.roi.toFixed(1)),
      irr: parseFloat(r.irr.toFixed(1)),
      payback_period: parseFloat((inputs.project_duration_months / 12).toFixed(1)),
      npv: parseFloat(r.npv.toFixed(0)),
      risk_score: r.margin > 20 ? 'low' : r.margin > 10 ? 'medium' : 'high',
      recommendation: r.margin > 15 ? 'proceed' : r.margin > 8 ? 'review' : 'reject',
      tier: 'premium',
      analysis_details: { inputs, results: r }
    }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['recentAnalyses'] })
  });

  const set = (k, v) => setInputs(prev => ({ ...prev, [k]: parseFloat(v) || v }));

  const chartData = [
    { name: 'Pozemok', value: inputs.land_price_total, color: '#3B82F6' },
    { name: 'Výstavba', value: r.constructionCost, color: '#6366F1' },
    { name: 'Iné náklady', value: r.otherCosts + r.developerFee, color: '#8B5CF6' },
    { name: 'Zisk', value: Math.max(r.grossProfit, 0), color: '#10B981' },
  ];

  const recommendation = r.margin > 15 ? { label: 'Odporúčané', cls: 'bg-green-100 text-green-700 border-green-200' }
    : r.margin > 8 ? { label: 'Na zváženie', cls: 'bg-amber-100 text-amber-700 border-amber-200' }
    : { label: 'Rizikové', cls: 'bg-red-100 text-red-700 border-red-200' };

  const InputField = ({ label, field, suffix = '' }) => (
    <div>
      <Label className="text-xs text-slate-500 mb-1 block">{label}</Label>
      <div className="relative">
        <Input
          type="number"
          value={inputs[field]}
          onChange={(e) => set(field, e.target.value)}
          className="text-sm pr-10 bg-white border-slate-200"
        />
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">{suffix}</span>}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="text-xs text-blue-600 uppercase tracking-widest font-semibold mb-1">Nástroj</div>
          <h1 className="text-3xl font-black text-[#0F172A]">Land Feasibility Analyzer</h1>
          <p className="text-slate-500 text-sm mt-1">Maximálna cena pozemku, reziduálna hodnota, IRR projektu</p>
        </div>
        <Button
          onClick={() => saveMutation.mutate()}
          disabled={saveMutation.isPending}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Save className="w-4 h-4 mr-2" />
          {saveMutation.isPending ? 'Ukladá...' : 'Uložiť analýzu'}
        </Button>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Inputs */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-[#0F172A] uppercase tracking-wider">Projekt</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-xs text-slate-500 mb-1 block">Názov projektu</Label>
                <Input value={inputs.project_name} onChange={(e) => setInputs(p => ({ ...p, project_name: e.target.value }))} className="text-sm bg-white border-slate-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-[#0F172A] uppercase tracking-wider">Pozemok</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <InputField label="Plocha pozemku" field="land_area" suffix="m²" />
              <InputField label="Cena pozemku (celkom)" field="land_price_total" suffix="€" />
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-[#0F172A] uppercase tracking-wider">Developérske parametre</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <InputField label="Koeficient podlažnosti (KP)" field="floor_area_ratio" />
              <InputField label="Koef. predajnosti NFA/HPP" field="efficiency_ratio" />
              <InputField label="Priemerná veľkosť bytu" field="avg_unit_size" suffix="m²" />
              <InputField label="Parkovací koef. (miesta/byt)" field="parking_ratio" />
              <InputField label="Cena parkovacieho miesta" field="parking_price" suffix="€" />
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-[#0F172A] uppercase tracking-wider">Financie</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <InputField label="Predajná cena" field="sales_price_per_sqm" suffix="€/m²" />
              <InputField label="Stavebné náklady" field="construction_cost_per_sqm" suffix="€/m²" />
              <InputField label="Ostatné náklady (% zo stavby)" field="other_costs_pct" suffix="%" />
              <InputField label="Developer fee (% z tržieb)" field="developer_fee_pct" suffix="%" />
              <InputField label="Dĺžka projektu" field="project_duration_months" suffix="mes." />
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <div className="lg:col-span-3 space-y-6">
          {/* Recommendation Banner */}
          <div className={`p-4 rounded-xl border font-semibold text-sm flex items-center justify-between ${recommendation.cls}`}>
            <span>Odporúčanie AI: <strong>{recommendation.label}</strong></span>
            <span>Marža projektu: <strong>{r.margin.toFixed(1)}%</strong></span>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'HPP (hrubá plocha)', value: `${fmt(r.hpp)} m²`, icon: Building2 },
              { label: 'Predajná plocha NFA', value: `${fmt(r.nfa)} m²`, icon: Building2 },
              { label: 'Počet jednotiek', value: `${r.units} bytov`, icon: Calculator },
              { label: 'Parkovacie miesta', value: `${r.parking} miest`, icon: Calculator },
            ].map((kpi, i) => (
              <Card key={i} className="bg-white border-slate-200">
                <CardContent className="p-4">
                  <div className="text-xs text-slate-500 mb-1">{kpi.label}</div>
                  <div className="text-lg font-bold text-[#0F172A]">{kpi.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Financial Summary */}
          <Card className="bg-white border-slate-200">
            <CardHeader>
              <CardTitle className="text-[#0F172A] text-base">Finančný prehľad</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { label: 'Celkové tržby z predaja bytov', value: fmtEur(r.revenueApts), highlight: false },
                  { label: `Tržby z parkovacích miest (${r.parking}x)`, value: fmtEur(r.revenueParking), highlight: false },
                  { label: 'CELKOVÉ TRŽBY', value: fmtEur(r.totalRevenue), highlight: true, bold: true },
                  null,
                  { label: 'Náklady na pozemok', value: fmtEur(inputs.land_price_total), highlight: false },
                  { label: `Stavebné náklady (${fmt(r.hpp)} m² × ${fmt(inputs.construction_cost_per_sqm)} €)`, value: fmtEur(r.constructionCost), highlight: false },
                  { label: `Ostatné náklady (${inputs.other_costs_pct}%)`, value: fmtEur(r.otherCosts), highlight: false },
                  { label: `Developer fee (${inputs.developer_fee_pct}%)`, value: fmtEur(r.developerFee), highlight: false },
                  { label: 'CELKOVÉ NÁKLADY', value: fmtEur(r.totalCost), highlight: true, bold: true },
                  null,
                  { label: 'HRUBÝ ZISK', value: fmtEur(r.grossProfit), highlight: true, bold: true, green: r.grossProfit > 0 },
                ].map((row, i) => row === null ? (
                  <div key={i} className="border-t border-slate-100" />
                ) : (
                  <div key={i} className={`flex justify-between items-center py-1.5 ${row.highlight ? 'border-t border-slate-200 pt-2' : ''}`}>
                    <span className={`text-sm ${row.bold ? 'font-bold text-[#0F172A]' : 'text-slate-600'}`}>{row.label}</span>
                    <span className={`text-sm font-semibold ${row.green ? 'text-green-600' : row.bold ? 'text-[#0F172A]' : 'text-slate-700'}`}>{row.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Key Ratios */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Marža projektu', value: `${r.margin.toFixed(1)} %`, sub: 'Zisk / Tržby' },
              { label: 'ROI', value: `${r.roi.toFixed(1)} %`, sub: 'Zisk / Náklady' },
              { label: 'IRR (anualizované)', value: `${r.irr.toFixed(1)} %`, sub: 'Vnútorná miera výnosnosti' },
            ].map((m, i) => (
              <Card key={i} className="bg-[#0F172A] border-slate-700">
                <CardContent className="p-5 text-center">
                  <div className="text-2xl font-black text-blue-400 mb-1">{m.value}</div>
                  <div className="text-white text-xs font-semibold mb-1">{m.label}</div>
                  <div className="text-slate-400 text-xs">{m.sub}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Residual Land Value */}
          <Card className="bg-white border-2 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-500 mb-1">Reziduálna hodnota pozemku</div>
                  <div className="text-3xl font-black text-[#0F172A]">{fmtEur(r.residualLandValue)}</div>
                  <div className="text-sm text-slate-500 mt-1">
                    Maximálna cena, ktorú môžete zaplatiť za pozemok pri zachovaní požadovaného výnosu
                  </div>
                </div>
                <div className={`text-right px-4 py-2 rounded-lg ${inputs.land_price_total <= r.residualLandValue ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <div className={`text-sm font-bold ${inputs.land_price_total <= r.residualLandValue ? 'text-green-700' : 'text-red-700'}`}>
                    {inputs.land_price_total <= r.residualLandValue ? '✓ Pozemok je v cene' : '✗ Pozemok predražený'}
                  </div>
                  <div className="text-xs text-slate-500">
                    o {fmtEur(Math.abs(r.residualLandValue - inputs.land_price_total))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Chart */}
          <Card className="bg-white border-slate-200">
            <CardHeader>
              <CardTitle className="text-[#0F172A] text-base">Štruktúra nákladov a zisku</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData} layout="vertical">
                  <XAxis type="number" tickFormatter={(v) => `€${(v / 1000000).toFixed(1)}M`} tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={90} />
                  <Tooltip formatter={(v) => fmtEur(v)} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {chartData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}