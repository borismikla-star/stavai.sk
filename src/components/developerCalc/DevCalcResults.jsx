import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import InfoTooltip from '../shared/InfoTooltip';
import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import SensitivityTab from './SensitivityTab';
import AISummary from './AISummary';

const fmt = (n) => Math.round(n || 0).toLocaleString('sk-SK');
const fmtEur = (n) => `€ ${fmt(n)}`;
const fmtPct = (n) => `${(n || 0).toFixed(1)}%`;

function KPI({ label, value, sub, color = 'blue', tooltip }) {
  const colors = {
    blue: 'bg-blue-50 border-blue-100 text-blue-700',
    green: 'bg-emerald-50 border-emerald-100 text-emerald-700',
    red: 'bg-red-50 border-red-100 text-red-700',
    amber: 'bg-amber-50 border-amber-100 text-amber-700',
    dark: 'bg-gray-900 border-gray-700 text-blue-400',
  };
  return (
    <div className={`rounded-xl border p-4 ${colors[color]}`}>
      <div className="flex items-center gap-1 mb-1">
        <div className="text-xs font-medium opacity-70">{label}</div>
        {tooltip && <InfoTooltip content={tooltip} />}
      </div>
      <div className={`text-xl font-bold ${color === 'dark' ? 'text-blue-400' : ''}`}>{value}</div>
      {sub && <div className="text-xs opacity-60 mt-0.5">{sub}</div>}
    </div>
  );
}

const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#6366F1', '#EC4899', '#14B8A6', '#F97316'];

export default function DevCalcResults({ results, baseData, projectName }) {
  if (!results) return null;
  const r = results;

  const profitPositive = r.grossProfit >= 0;

  const costPieData = [
    { name: 'Pozemok a projekt', value: r.landAndProject },
    { name: 'Realizácia', value: r.totalImplementation },
    { name: 'Doplnkový rozpočet', value: r.totalAdditionalBudget },
    { name: 'Ostatné služby', value: r.totalOtherServices },
    { name: 'Predaj a marketing', value: r.salesCosts + r.marketingCosts },
    { name: 'Rezerva', value: r.reserve },
    { name: 'Financovanie', value: r.totalFinancingCosts },
  ].filter(d => d.value > 0);

  const revPieData = [
    { name: 'Byty', value: r.apartmentsRevenue },
    { name: 'Nebytové priestory', value: r.nonResRevenue },
    { name: 'Kryté parkovanie', value: r.parkingIndoorRevenue },
    { name: 'Vonkajšie parkovanie', value: r.parkingOutdoorRevenue },
    { name: 'Balkóny', value: r.balconiesRevenue },
    { name: 'Záhrady', value: r.gardensRevenue },
    { name: 'Pivnice', value: r.basementsRevenue },
    { name: 'Ostatné', value: r.otherRevenue },
  ].filter(d => d.value > 0);

  const chartData = r.monthlyData?.filter((_, i) => i % 3 === 0) || [];

  return (
    <div className="space-y-4">
      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <KPI label="IRR" value={r.irr != null ? fmtPct(r.irr) : 'N/A'} sub="ročná návratnosť" color="dark" tooltip="Internal Rate of Return – ročná percentuálna návratnosť zohľadňujúca časovú hodnotu peňazí." />
        <KPI label="Zisková marža" value={fmtPct(r.profitMargin)} sub="zisk / tržby" color={r.profitMargin >= 15 ? 'green' : r.profitMargin >= 5 ? 'amber' : 'red'} tooltip="Zisk ako percento z celkových tržieb." />
        <KPI label="Dev. marža" value={fmtPct(r.developerMargin)} sub="zisk / náklady" color={r.developerMargin >= 20 ? 'green' : r.developerMargin >= 10 ? 'amber' : 'red'} tooltip="Zisk ako percento z celkových nákladov projektu." />
        <KPI label="Násobok kapitálu" value={r.equityMultiple > 0 ? `${r.equityMultiple.toFixed(2)}×` : '—'} sub="vlastný kapitál" color="blue" tooltip="Koľkokrát sa vráti investovaný vlastný kapitál." />
        <KPI label={`Zisk po dani (${r.entityType || 'PO'})`} value={fmtEur(r.profitAfterTax)} sub={`sadzba ${fmtPct(r.taxRate)}`} color={r.profitAfterTax >= 0 ? 'green' : 'red'} tooltip="Zisk po zdanení podľa SK daňových pravidiel pre FO alebo PO." />
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="w-full grid grid-cols-5 mb-0">
          <TabsTrigger value="overview" className="text-xs">Prehľad</TabsTrigger>
          <TabsTrigger value="charts" className="text-xs">Grafy</TabsTrigger>
          <TabsTrigger value="cashflow" className="text-xs">Cash Flow</TabsTrigger>
          <TabsTrigger value="sensitivity" className="text-xs">Citlivosť</TabsTrigger>
          <TabsTrigger value="ai" className="text-xs">✦ AI</TabsTrigger>
        </TabsList>

        {/* OVERVIEW */}
        <TabsContent value="overview" className="space-y-4 mt-3">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <KPI label="Celkové tržby" value={fmtEur(r.totalGrossRevenue)} color="green" tooltip="Celkové očakávané príjmy z predaja všetkých položiek." />
            <KPI label="Celkové náklady" value={fmtEur(r.totalProjectCosts)} color="blue" tooltip="Súčet všetkých nákladov projektu vrátane financovania." />
            <KPI label={profitPositive ? 'Hrubý zisk' : 'Strata'} value={fmtEur(Math.abs(r.grossProfit))} color={profitPositive ? 'green' : 'red'} />
            <KPI label="Náklady/m²" value={r.costPerM2 > 0 ? `€ ${fmt(r.costPerM2)}/m²` : '—'} color="blue" tooltip="Celkové náklady vydelené celkovou predajnou plochou." />
            <KPI label="Výnos/m²" value={r.revenuePerM2 > 0 ? `€ ${fmt(r.revenuePerM2)}/m²` : '—'} color="green" tooltip="Celkové tržby vydelené celkovou predajnou plochou." />
            <KPI label="Ročná návratnosť" value={r.annualizedReturn > 0 ? fmtPct(r.annualizedReturn) : '—'} color="blue" tooltip="Priemerná ročná návratnosť vlastného kapitálu za celé trvanie projektu." />
          </div>

          {/* P&L Summary */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Výkaz ziskov a strát</CardTitle></CardHeader>
            <CardContent className="space-y-1.5 text-sm">
              <div className="flex justify-between font-bold text-emerald-600 pb-1 border-b">
                <span>Celkové tržby</span><span>{fmtEur(r.totalGrossRevenue)}</span>
              </div>
              {[
                { l: 'Pozemok a projekt', v: r.landAndProject },
                { l: 'Realizácia', v: r.totalImplementation },
                { l: 'Doplnkový rozpočet', v: r.totalAdditionalBudget },
                { l: 'Ostatné služby', v: r.totalOtherServices },
                { l: 'Predaj a marketing', v: r.salesCosts + r.marketingCosts },
                { l: 'Rezerva', v: r.reserve },
              ].map((row, i) => (
                <div key={i} className="flex justify-between text-gray-600">
                  <span>{row.l}</span><span>- {fmtEur(row.v)}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold pt-1 border-t">
                <span>Náklady pred financovaním</span><span>- {fmtEur(r.totalCostsNet)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Náklady financovania</span><span>- {fmtEur(r.totalFinancingCosts)}</span>
              </div>
              <div className={`flex justify-between font-bold text-base pt-2 border-t ${profitPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                <span>Hrubý zisk</span><span>{profitPositive ? '' : '-'}{fmtEur(Math.abs(r.grossProfit))}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-400 pt-1">
                <span>Bod zvratu</span>
                <span>{fmtEur(r.breakEvenRevenue)} ({fmtPct(r.breakEvenPct)} z tržieb)</span>
              </div>
              {r.dscr != null && (
                <div className="flex justify-between text-xs text-gray-500">
                  <span>DSCR (zisk / úroky)</span>
                  <span className={r.dscr >= 1.25 ? 'text-emerald-600' : 'text-red-600'}>{r.dscr.toFixed(2)}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* CHARTS */}
        <TabsContent value="charts" className="space-y-4 mt-3">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-xs uppercase tracking-wide text-gray-500">Rozloženie nákladov</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={costPieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                      {costPieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(v) => fmtEur(v)} />
                    <Legend iconSize={10} wrapperStyle={{ fontSize: '10px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-xs uppercase tracking-wide text-gray-500">Rozloženie tržieb</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={revPieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                      {revPieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(v) => fmtEur(v)} />
                    <Legend iconSize={10} wrapperStyle={{ fontSize: '10px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* CASHFLOW */}
        <TabsContent value="cashflow" className="mt-3">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Kumulatívny Cash Flow</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tickFormatter={(v) => `€${(v / 1000000).toFixed(1)}M`} tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(v) => fmtEur(v)} />
                  <Line type="monotone" dataKey="cumulative" stroke="#2563EB" strokeWidth={2} dot={false} name="Kumul. CF" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SENSITIVITY */}
        <TabsContent value="sensitivity" className="mt-3">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Analýza citlivosti</CardTitle></CardHeader>
            <CardContent>
              {baseData ? <SensitivityTab baseData={baseData} /> : <p className="text-xs text-gray-400">Načítavam...</p>}
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI */}
        <TabsContent value="ai" className="mt-3">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">AI Sumarizácia projektu</CardTitle></CardHeader>
            <CardContent>
              <AISummary results={r} projectName={projectName} entityType={r.entityType} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}