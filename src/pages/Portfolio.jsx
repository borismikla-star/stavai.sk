import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { BarChart2, TrendingUp, ArrowRight, Building2, Loader2, Plus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

const fmt = (n) => n != null ? `€ ${Math.round(n).toLocaleString('sk-SK')}` : '—';
const fmtPct = (n) => n != null ? `${Number(n).toFixed(1)}%` : '—';
const fmtM = (n) => n != null ? `€ ${(n / 1000000).toFixed(2)}M` : '—';

function parseProject(p) {
  let results = p.results || {};
  try {
    const desc = JSON.parse(p.description || '{}');
    if (desc.results) results = desc.results;
  } catch {}
  return { ...p, results };
}

const MARGIN_COLOR = (m) => m >= 20 ? '#10B981' : m >= 10 ? '#F59E0B' : '#EF4444';

export default function Portfolio() {
  const { data: rawProjects = [], isLoading } = useQuery({
    queryKey: ['devProjects'],
    queryFn: () => base44.entities.Project.list('-created_date'),
  });

  const projects = useMemo(() => rawProjects.map(parseProject), [rawProjects]);

  // Portfolio-level KPIs
  const kpis = useMemo(() => {
    if (!projects.length) return null;
    const totalInvestment = projects.reduce((s, p) => s + (p.results?.totalProjectCosts || 0), 0);
    const totalRevenue = projects.reduce((s, p) => s + (p.results?.totalGrossRevenue || 0), 0);
    const totalProfit = projects.reduce((s, p) => s + (p.results?.grossProfit || 0), 0);
    const irrValues = projects.map(p => p.results?.irr).filter(v => v != null && !isNaN(v));
    const avgIrr = irrValues.length ? irrValues.reduce((s, v) => s + v, 0) / irrValues.length : null;
    const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
    return { totalInvestment, totalRevenue, totalProfit, avgIrr, profitMargin, count: projects.length };
  }, [projects]);

  const chartData = useMemo(() => projects.map(p => ({
    name: p.name?.length > 14 ? p.name.substring(0, 14) + '…' : p.name,
    margin: Number((p.results?.developerMargin || 0).toFixed(1)),
    irr: Number((p.results?.irr || 0).toFixed(1)),
  })), [projects]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <div>
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-1">Prehľad</p>
          <h1 className="text-2xl font-bold text-gray-900">Portfólio projektov</h1>
          <p className="text-sm text-gray-500 mt-0.5">Agregovaný prehľad všetkých vašich developerských projektov</p>
        </div>
        <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white">
          <Link to={createPageUrl('DeveloperCalc')}>
            <Plus className="w-4 h-4 mr-2" /> Nový projekt
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-7 h-7 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">Žiadne projekty</h3>
          <p className="text-sm text-gray-500 mb-4">Začnite pridaním prvého developerského projektu.</p>
          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
            <Link to={createPageUrl('DeveloperCalc')}>Vytvoriť projekt</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Portfolio KPIs */}
          {kpis && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { label: 'Projektov spolu', value: kpis.count, suffix: '', color: 'blue' },
                { label: 'Celková investícia', value: fmtM(kpis.totalInvestment), suffix: '', color: 'gray' },
                { label: 'Celkové tržby', value: fmtM(kpis.totalRevenue), suffix: '', color: 'emerald' },
                { label: 'Celkový zisk', value: fmtM(kpis.totalProfit), suffix: '', color: kpis.totalProfit >= 0 ? 'emerald' : 'red' },
                { label: 'Priemerné IRR', value: kpis.avgIrr != null ? fmtPct(kpis.avgIrr) : '—', suffix: '', color: 'blue' },
              ].map((k, i) => (
                <div key={i} className={`rounded-xl border p-4 ${
                  k.color === 'emerald' ? 'bg-emerald-50 border-emerald-100' :
                  k.color === 'red' ? 'bg-red-50 border-red-100' :
                  k.color === 'blue' ? 'bg-blue-50 border-blue-100' : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="text-xs text-gray-500 font-medium mb-1">{k.label}</div>
                  <div className={`text-xl font-bold ${
                    k.color === 'emerald' ? 'text-emerald-700' :
                    k.color === 'red' ? 'text-red-600' :
                    k.color === 'blue' ? 'text-blue-700' : 'text-gray-900'
                  }`}>{k.value}</div>
                </div>
              ))}
            </div>
          )}

          {/* Chart */}
          {chartData.length > 1 && (
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Výkonnosť projektov — Dev. marža (%)</h3>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={chartData} barSize={28}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} unit="%" />
                  <Tooltip formatter={v => [`${v}%`, 'Dev. marža']} />
                  <Bar dataKey="margin" name="Dev. marža" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, i) => (
                      <Cell key={i} fill={MARGIN_COLOR(entry.margin)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Project cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map(p => {
              const r = p.results || {};
              const margin = r.developerMargin || 0;
              const marginColor = margin >= 20 ? 'text-emerald-600' : margin >= 10 ? 'text-amber-600' : 'text-red-500';
              return (
                <div key={p.id} className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm truncate">{p.name}</h3>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {p.created_date ? format(new Date(p.created_date), 'dd.MM.yyyy') : '—'}
                      </p>
                    </div>
                    <Badge variant="outline" className={`text-xs ml-2 flex-shrink-0 ${marginColor}`}>
                      {fmtPct(margin)}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {[
                      { label: 'Tržby', value: fmtM(r.totalGrossRevenue) },
                      { label: 'Zisk', value: fmt(r.grossProfit) },
                      { label: 'IRR', value: fmtPct(r.irr) },
                      { label: 'Násobok', value: r.equityMultiple > 0 ? `${r.equityMultiple?.toFixed(2)}×` : '—' },
                    ].map((m, i) => (
                      <div key={i} className="bg-gray-50 rounded-xl p-2.5">
                        <div className="text-[10px] text-gray-400 font-medium">{m.label}</div>
                        <div className="text-xs font-bold text-gray-900 mt-0.5">{m.value}</div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" className="w-full text-xs" asChild>
                    <Link to={createPageUrl('DeveloperCalc')}>
                      Otvoriť projekt <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </Link>
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}