import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const benchmarks = {
  standard: {
    residential: [
      { category: 'Výkopové a zemné práce', unit: '€/m³', min: 18, avg: 26, max: 38, trend: 1 },
      { category: 'Základy a základ. doska', unit: '€/m²', min: 85, avg: 120, max: 180, trend: 0 },
      { category: 'Nosná konštrukcia (ŽB)', unit: '€/m²', min: 180, avg: 240, max: 310, trend: 1 },
      { category: 'Murivo a deliace priečky', unit: '€/m²', min: 40, avg: 60, max: 90, trend: 0 },
      { category: 'Stropy a schodiská', unit: '€/m²', min: 90, avg: 130, max: 175, trend: 1 },
      { category: 'Strecha a izolácia', unit: '€/m²', min: 80, avg: 115, max: 165, trend: 0 },
      { category: 'Fasáda a zateplenie', unit: '€/m²', min: 60, avg: 95, max: 145, trend: 1 },
      { category: 'Okná a dvere', unit: '€/m²', min: 120, avg: 180, max: 260, trend: 0 },
      { category: 'TZB – vykurovanie', unit: '€/m²', min: 45, avg: 75, max: 110, trend: 1 },
      { category: 'TZB – elektroinštalácia', unit: '€/m²', min: 35, avg: 55, max: 85, trend: 0 },
      { category: 'TZB – vodovod/kanalizácia', unit: '€/m²', min: 30, avg: 50, max: 75, trend: 0 },
      { category: 'Výťahy', unit: '€/ks', min: 28000, avg: 40000, max: 65000, trend: 1 },
      { category: 'Podlahy a obklady', unit: '€/m²', min: 50, avg: 80, max: 130, trend: 0 },
      { category: 'Maľby a povrch. úpravy', unit: '€/m²', min: 15, avg: 25, max: 45, trend: 0 },
      { category: 'Vonkajšie terénne úpravy', unit: '€/m²', min: 25, avg: 45, max: 80, trend: 1 },
    ],
    commercial: [
      { category: 'Nosná konštrukcia (ŽB)', unit: '€/m²', min: 200, avg: 270, max: 360, trend: 1 },
      { category: 'Fasáda – sklo/kov', unit: '€/m²', min: 180, avg: 280, max: 420, trend: 1 },
      { category: 'Okná a presklenie', unit: '€/m²', min: 160, avg: 250, max: 380, trend: 0 },
      { category: 'TZB – klimatizácia', unit: '€/m²', min: 80, avg: 130, max: 200, trend: 1 },
      { category: 'TZB – elektroinštalácia', unit: '€/m²', min: 60, avg: 90, max: 140, trend: 0 },
      { category: 'Požiarna ochrana', unit: '€/m²', min: 20, avg: 35, max: 60, trend: 0 },
      { category: 'Dokončovacie práce', unit: '€/m²', min: 80, avg: 140, max: 220, trend: 0 },
    ]
  },
  premium: {
    residential: [
      { category: 'Nosná konštrukcia (ŽB)', unit: '€/m²', min: 240, avg: 310, max: 420, trend: 1 },
      { category: 'Fasáda a zateplenie', unit: '€/m²', min: 110, avg: 170, max: 250, trend: 1 },
      { category: 'Okná a dvere (premium)', unit: '€/m²', min: 200, avg: 320, max: 480, trend: 0 },
      { category: 'TZB – podlahové kúrenie', unit: '€/m²', min: 65, avg: 95, max: 140, trend: 1 },
      { category: 'Kuchyne (dodávka)', unit: '€/ks', min: 8000, avg: 18000, max: 40000, trend: 0 },
      { category: 'Kúpeľne (dodávka)', unit: '€/ks', min: 5000, avg: 12000, max: 30000, trend: 0 },
      { category: 'Podlahy (parkety/dlažba)', unit: '€/m²', min: 80, avg: 140, max: 260, trend: 1 },
      { category: 'Smart home systém', unit: '€/byt', min: 2500, avg: 6000, max: 15000, trend: 1 },
    ],
    commercial: []
  }
};

const totalCostBenchmarks = [
  { label: 'Rezidenčný – Štandard', hpp_min: 1200, hpp_avg: 1450, hpp_max: 1700, nfa_min: 1450, nfa_avg: 1750, nfa_max: 2100 },
  { label: 'Rezidenčný – Premium', hpp_min: 1600, hpp_avg: 1950, hpp_max: 2400, nfa_min: 1900, nfa_avg: 2350, nfa_max: 2900 },
  { label: 'Rezidenčný – Luxury', hpp_min: 2200, hpp_avg: 2800, hpp_max: 3800, nfa_min: 2650, nfa_avg: 3370, nfa_max: 4600 },
  { label: 'Komerčný – Kancelárie', hpp_min: 1400, hpp_avg: 1750, hpp_max: 2200, nfa_min: 1600, nfa_avg: 2100, nfa_max: 2600 },
  { label: 'Logistika / Sklad', hpp_min: 400, hpp_avg: 550, hpp_max: 750, nfa_min: 420, nfa_avg: 580, nfa_max: 800 },
];

const historicalData = [
  { year: '2019', residential: 1050, commercial: 1180 },
  { year: '2020', residential: 1100, commercial: 1220 },
  { year: '2021', residential: 1280, commercial: 1380 },
  { year: '2022', residential: 1580, commercial: 1750 },
  { year: '2023', residential: 1520, commercial: 1680 },
  { year: '2024', residential: 1450, commercial: 1620 },
  { year: '2025', residential: 1490, commercial: 1680 },
];

export default function CostBenchmark() {
  const [standard, setStandard] = useState('standard');
  const [type, setType] = useState('residential');

  const data = benchmarks[standard]?.[type] || [];

  const TrendIcon = ({ t }) => t === 1 ? <TrendingUp className="w-4 h-4 text-red-500" /> : t === -1 ? <TrendingDown className="w-4 h-4 text-green-500" /> : <Minus className="w-4 h-4 text-slate-400" />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="text-xs text-blue-600 uppercase tracking-widest font-semibold mb-1">Nástroj</div>
        <h1 className="text-3xl font-black text-[#0F172A]">Cost Benchmark</h1>
        <p className="text-slate-500 text-sm mt-1">Databáza stavebných nákladov – Slovensko 2025</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8">
        <div className="w-48">
          <Select value={standard} onValueChange={setStandard}>
            <SelectTrigger className="bg-white"><SelectValue placeholder="Štandard" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Štandard</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-48">
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="bg-white"><SelectValue placeholder="Typ" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="residential">Rezidenčný</SelectItem>
              <SelectItem value="commercial">Komerčný</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Benchmark Table */}
          <Card className="bg-white border-slate-200">
            <CardHeader>
              <CardTitle className="text-base text-[#0F172A]">Nákladové položky – {standard === 'standard' ? 'Štandard' : 'Premium'} / {type === 'residential' ? 'Rezidenčný' : 'Komerčný'}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="text-left px-5 py-3 text-slate-600 font-semibold">Kategória</th>
                      <th className="text-center px-4 py-3 text-slate-600 font-semibold">Jednotka</th>
                      <th className="text-right px-4 py-3 text-green-600 font-semibold">Min</th>
                      <th className="text-right px-4 py-3 text-blue-600 font-semibold">Priemer</th>
                      <th className="text-right px-4 py-3 text-red-600 font-semibold">Max</th>
                      <th className="text-center px-4 py-3 text-slate-600 font-semibold">Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((row, i) => (
                      <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 transition">
                        <td className="px-5 py-3 font-medium text-[#0F172A]">{row.category}</td>
                        <td className="px-4 py-3 text-center text-slate-500 text-xs">{row.unit}</td>
                        <td className="px-4 py-3 text-right text-green-700 font-semibold">{row.min.toLocaleString('sk')}</td>
                        <td className="px-4 py-3 text-right text-blue-700 font-bold">{row.avg.toLocaleString('sk')}</td>
                        <td className="px-4 py-3 text-right text-red-700 font-semibold">{row.max.toLocaleString('sk')}</td>
                        <td className="px-4 py-3 text-center"><TrendIcon t={row.trend} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {data.length === 0 && <div className="py-8 text-center text-slate-400">Žiadne dáta pre zvolený filter</div>}
            </CardContent>
          </Card>

          {/* Total Cost Benchmarks */}
          <Card className="bg-white border-slate-200">
            <CardHeader><CardTitle className="text-base text-[#0F172A]">Celkové náklady stavby (€/m²)</CardTitle></CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-5 py-3 text-slate-600 font-semibold">Typ projektu</th>
                    <th className="text-right px-4 py-3 text-green-600 font-semibold">Min HPP</th>
                    <th className="text-right px-4 py-3 text-blue-600 font-semibold">Avg HPP</th>
                    <th className="text-right px-4 py-3 text-red-600 font-semibold">Max HPP</th>
                    <th className="text-right px-4 py-3 text-blue-600 font-semibold">Avg NFA</th>
                  </tr>
                </thead>
                <tbody>
                  {totalCostBenchmarks.map((row, i) => (
                    <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 transition">
                      <td className="px-5 py-3 font-medium text-[#0F172A]">{row.label}</td>
                      <td className="px-4 py-3 text-right text-green-700">€ {row.hpp_min}</td>
                      <td className="px-4 py-3 text-right text-blue-700 font-bold">€ {row.hpp_avg}</td>
                      <td className="px-4 py-3 text-right text-red-700">€ {row.hpp_max}</td>
                      <td className="px-4 py-3 text-right text-blue-700 font-bold">€ {row.nfa_avg}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Historical Trend */}
          <Card className="bg-white border-slate-200">
            <CardHeader><CardTitle className="text-base text-[#0F172A]">Historický vývoj (€/m² HPP)</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="residential" name="Rezidenčný" fill="#3B82F6" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="commercial" name="Komerčný" fill="#6366F1" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex gap-4 mt-2 justify-center">
                <div className="flex items-center gap-1.5 text-xs text-slate-600"><div className="w-3 h-3 rounded bg-blue-500" /> Rezidenčný</div>
                <div className="flex items-center gap-1.5 text-xs text-slate-600"><div className="w-3 h-3 rounded bg-indigo-500" /> Komerčný</div>
              </div>
            </CardContent>
          </Card>

          {/* Info Cards */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-5">
              <h3 className="font-bold text-[#0F172A] text-sm mb-3">Poznámky k dátam</h3>
              <ul className="space-y-2 text-xs text-slate-600">
                <li>• Ceny sú bez DPH</li>
                <li>• Platné pre región Bratislava a okolie</li>
                <li>• V iných regiónoch môžu byť ceny o 10–20% nižšie</li>
                <li>• Aktualizované Q1 2025</li>
                <li>• Zdrojom sú reálne projekty a verejné obstarávania</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200">
            <CardContent className="p-5">
              <h3 className="font-bold text-[#0F172A] text-sm mb-3">Regionálne korekcie</h3>
              <div className="space-y-2">
                {[
                  { region: 'Bratislava', coef: '1.00', label: 'Základná hodnota' },
                  { region: 'Trnava / Nitra', coef: '0.92', label: '-8%' },
                  { region: 'Trenčín / Žilina', coef: '0.90', label: '-10%' },
                  { region: 'B. Bystrica', coef: '0.88', label: '-12%' },
                  { region: 'Košice', coef: '0.91', label: '-9%' },
                  { region: 'Ostatné regióny', coef: '0.82', label: '-18%' },
                ].map((r, i) => (
                  <div key={i} className="flex justify-between items-center text-xs">
                    <span className="text-slate-600">{r.region}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-mono text-xs">{r.coef}</Badge>
                      <span className="text-slate-400">{r.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}