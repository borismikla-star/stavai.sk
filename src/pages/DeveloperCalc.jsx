import React, { useState, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { Save, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const fmt = (n) => new Intl.NumberFormat('sk-SK', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n || 0);
const fmtEur = (n) => `€ ${fmt(n)}`;

function calcIRR(cashflows) {
  let low = -0.99, high = 5;
  for (let i = 0; i < 200; i++) {
    const mid = (low + high) / 2;
    const npv = cashflows.reduce((s, cf, t) => s + cf / Math.pow(1 + mid, t / 12), 0);
    if (Math.abs(npv) < 100) return mid * 100;
    npv > 0 ? (low = mid) : (high = mid);
  }
  return ((low + high) / 2) * 100;
}

const defaults = {
  name: 'Developer Projekt',
  // Pozemok
  land_price: 2000000,
  land_purchase_month: 1,
  // Projekt
  project_duration: 36,
  nfa: 4500,
  units: 60,
  avg_unit_price_sqm: 3800,
  // Náklady
  const_cost_per_sqm_hpp: 1450,
  hpp: 5400,
  project_mgmt_pct: 3,
  engineering_pct: 4,
  marketing_pct: 3,
  admin_pct: 2,
  contingency_pct: 5,
  // Financovanie
  equity_pct: 30,
  loan_interest_rate: 5.5,
  loan_duration: 30,
  // Predaj
  presales_start_month: 6,
  sales_pace_units_month: 3,
};

export default function DeveloperCalc() {
  const [d, setD] = useState(defaults);
  const queryClient = useQueryClient();

  const set = (k, v) => setD(p => ({ ...p, [k]: parseFloat(v) || v }));

  const r = useMemo(() => {
    const construction = d.hpp * d.const_cost_per_sqm_hpp;
    const projectMgmt = construction * (d.project_mgmt_pct / 100);
    const engineering = construction * (d.engineering_pct / 100);
    const marketing = construction * (d.marketing_pct / 100);
    const admin = construction * (d.admin_pct / 100);
    const contingency = construction * (d.contingency_pct / 100);
    const totalDevCosts = construction + projectMgmt + engineering + marketing + admin + contingency;
    const totalCost = d.land_price + totalDevCosts;

    const totalRevenue = d.nfa * d.avg_unit_price_sqm;
    const grossProfit = totalRevenue - totalCost;
    const margin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;
    const roi = totalCost > 0 ? (grossProfit / totalCost) * 100 : 0;

    const loanAmount = totalCost * (1 - d.equity_pct / 100);
    const equityAmount = totalCost * (d.equity_pct / 100);
    const monthlyRate = d.loan_interest_rate / 100 / 12;
    const interestTotal = loanAmount * monthlyRate * d.project_duration;

    // Monthly cashflow
    const salesStart = d.presales_start_month;
    const monthlyRevenue = totalRevenue / Math.max(d.units / d.sales_pace_units_month, 1);
    
    const cashflowMonths = Array.from({ length: d.project_duration }, (_, m) => {
      const month = m + 1;
      const constPhaseEnd = Math.floor(d.project_duration * 0.8);
      const costOutflow = month <= constPhaseEnd
        ? -(totalDevCosts / constPhaseEnd) - (month === 1 ? d.land_price : 0)
        : 0;
      const revenue = month >= salesStart ? Math.min(monthlyRevenue, totalRevenue - (monthlyRevenue * (month - salesStart))) : 0;
      return { month: `M${month}`, cashflow: costOutflow + Math.max(revenue, 0), cumulative: 0 };
    });

    let cum = 0;
    cashflowMonths.forEach(m => { cum += m.cashflow; m.cumulative = cum; });

    const flatCF = [-equityAmount, ...cashflowMonths.map(m => m.cashflow)];
    const irr = calcIRR(flatCF);
    const npv = flatCF.reduce((s, cf, t) => s + cf / Math.pow(1 + 0.08 / 12, t), 0);
    const dscr = grossProfit > 0 ? grossProfit / Math.max(interestTotal, 1) : 0;

    return {
      construction, projectMgmt, engineering, marketing, admin, contingency,
      totalDevCosts, totalCost, totalRevenue, grossProfit, margin, roi,
      loanAmount, equityAmount, interestTotal, cashflowMonths, irr, npv, dscr
    };
  }, [d]);

  const saveMutation = useMutation({
    mutationFn: () => base44.entities.Project.create({
      name: d.name,
      type: 'residential',
      area: d.hpp,
      status: 'analysis',
      estimated_cost: r.totalCost,
      estimated_duration: d.project_duration,
      description: `NFA: ${fmt(d.nfa)} m², Jednotky: ${d.units}, Marža: ${r.margin.toFixed(1)}%`
    }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['recentProjects'] })
  });

  const F = ({ label, field, suffix = '' }) => (
    <div>
      <Label className="text-xs text-slate-500 mb-1 block">{label}</Label>
      <div className="relative">
        <Input type="number" value={d[field]} onChange={(e) => set(field, e.target.value)} className="text-sm bg-white border-slate-200 pr-10" />
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">{suffix}</span>}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="text-xs text-blue-600 uppercase tracking-widest font-semibold mb-1">Nástroj</div>
          <h1 className="text-3xl font-black text-[#0F172A]">Developer Kalkulačka</h1>
          <p className="text-slate-500 text-sm mt-1">Kompletný finančný model – cashflow, IRR, NPV, DSCR</p>
        </div>
        <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Save className="w-4 h-4 mr-2" />{saveMutation.isPending ? 'Ukladá...' : 'Uložiť projekt'}
        </Button>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Inputs */}
        <div className="lg:col-span-2">
          <div className="mb-4">
            <Label className="text-xs text-slate-500 mb-1 block">Názov projektu</Label>
            <Input value={d.name} onChange={(e) => setD(p => ({ ...p, name: e.target.value }))} className="bg-white border-slate-200" />
          </div>

          <Tabs defaultValue="land">
            <TabsList className="grid grid-cols-4 w-full mb-4">
              <TabsTrigger value="land" className="text-xs">Pozemok</TabsTrigger>
              <TabsTrigger value="costs" className="text-xs">Náklady</TabsTrigger>
              <TabsTrigger value="finance" className="text-xs">Financovanie</TabsTrigger>
              <TabsTrigger value="sales" className="text-xs">Predaj</TabsTrigger>
            </TabsList>

            <TabsContent value="land">
              <Card className="bg-white border-slate-200">
                <CardContent className="p-5 space-y-4">
                  <F label="Cena pozemku" field="land_price" suffix="€" />
                  <F label="Mesiac nákupu pozemku" field="land_purchase_month" suffix="mes." />
                  <F label="Dĺžka projektu" field="project_duration" suffix="mes." />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="costs">
              <Card className="bg-white border-slate-200">
                <CardContent className="p-5 space-y-4">
                  <F label="HPP (hrubá podlažná plocha)" field="hpp" suffix="m²" />
                  <F label="Stavebné náklady" field="const_cost_per_sqm_hpp" suffix="€/m²" />
                  <F label="Project management" field="project_mgmt_pct" suffix="%" />
                  <F label="Inžinierska činnosť" field="engineering_pct" suffix="%" />
                  <F label="Marketing" field="marketing_pct" suffix="%" />
                  <F label="Admin / Legal" field="admin_pct" suffix="%" />
                  <F label="Rezerva (contingency)" field="contingency_pct" suffix="%" />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="finance">
              <Card className="bg-white border-slate-200">
                <CardContent className="p-5 space-y-4">
                  <F label="Vlastné zdroje (equity)" field="equity_pct" suffix="%" />
                  <F label="Úroková sadzba" field="loan_interest_rate" suffix="%" />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sales">
              <Card className="bg-white border-slate-200">
                <CardContent className="p-5 space-y-4">
                  <F label="Predajná plocha NFA" field="nfa" suffix="m²" />
                  <F label="Počet jednotiek" field="units" />
                  <F label="Priemerná predajná cena" field="avg_unit_price_sqm" suffix="€/m²" />
                  <F label="Začiatok predaja" field="presales_start_month" suffix="mes." />
                  <F label="Tempo predaja" field="sales_pace_units_month" suffix="j/mes." />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Results */}
        <div className="lg:col-span-3 space-y-6">
          {/* KPI Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'IRR', value: `${r.irr.toFixed(1)}%`, dark: true },
              { label: 'Marža', value: `${r.margin.toFixed(1)}%`, dark: true },
              { label: 'ROI', value: `${r.roi.toFixed(1)}%`, dark: true },
              { label: 'DSCR', value: r.dscr.toFixed(2), dark: true },
            ].map((m, i) => (
              <Card key={i} className="bg-[#0F172A] border-slate-700">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-black text-blue-400">{m.value}</div>
                  <div className="text-slate-400 text-xs mt-1">{m.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* P&L Summary */}
          <Card className="bg-white border-slate-200">
            <CardHeader><CardTitle className="text-base text-[#0F172A]">Výkaz ziskov a strát</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2.5">
                {[
                  { l: 'Celkové tržby z predaja', v: fmtEur(r.totalRevenue), bold: true, green: true },
                  null,
                  { l: 'Pozemok', v: fmtEur(d.land_price) },
                  { l: `Výstavba (${fmt(d.hpp)} m² × ${fmt(d.const_cost_per_sqm_hpp)} €)`, v: fmtEur(r.construction) },
                  { l: `Project management (${d.project_mgmt_pct}%)`, v: fmtEur(r.projectMgmt) },
                  { l: `Inžinierska činnosť (${d.engineering_pct}%)`, v: fmtEur(r.engineering) },
                  { l: `Marketing (${d.marketing_pct}%)`, v: fmtEur(r.marketing) },
                  { l: `Admin / Legal (${d.admin_pct}%)`, v: fmtEur(r.admin) },
                  { l: `Rezerva (${d.contingency_pct}%)`, v: fmtEur(r.contingency) },
                  { l: 'Odhadované úroky z úveru', v: fmtEur(r.interestTotal) },
                  { l: 'CELKOVÉ NÁKLADY', v: fmtEur(r.totalCost), bold: true },
                  null,
                  { l: 'HRUBÝ ZISK', v: fmtEur(r.grossProfit), bold: true, green: r.grossProfit > 0 },
                  { l: 'NPV (diskontný faktor 8%)', v: fmtEur(r.npv) },
                ].map((row, i) => row === null ? (
                  <div key={i} className="border-t border-slate-100 my-1" />
                ) : (
                  <div key={i} className="flex justify-between text-sm">
                    <span className={row.bold ? 'font-bold text-[#0F172A]' : 'text-slate-600'}>{row.l}</span>
                    <span className={`font-semibold ${row.green ? 'text-green-600' : row.bold ? 'text-[#0F172A]' : 'text-slate-700'}`}>{row.v}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Financing */}
          <Card className="bg-white border-slate-200">
            <CardHeader><CardTitle className="text-base text-[#0F172A]">Štruktúra financovania</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-xs text-blue-600 font-semibold mb-1">Vlastné zdroje ({d.equity_pct}%)</div>
                  <div className="text-xl font-black text-[#0F172A]">{fmtEur(r.equityAmount)}</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="text-xs text-slate-600 font-semibold mb-1">Bankový úver ({100 - d.equity_pct}%)</div>
                  <div className="text-xl font-black text-[#0F172A]">{fmtEur(r.loanAmount)}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cashflow Chart */}
          <Card className="bg-white border-slate-200">
            <CardHeader><CardTitle className="text-base text-[#0F172A]">Kumulatívny cashflow</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={r.cashflowMonths.filter((_, i) => i % 3 === 0)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tickFormatter={(v) => `€${(v / 1000000).toFixed(1)}M`} tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(v) => fmtEur(v)} />
                  <Line type="monotone" dataKey="cumulative" stroke="#3B82F6" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}