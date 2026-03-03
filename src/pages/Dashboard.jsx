import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { BarChart2, Calculator, Clock, TrendingUp, ChevronRight, FileText, BookOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function Dashboard() {
  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me()
  });

  const { data: recentAnalyses = [] } = useQuery({
    queryKey: ['recentAnalyses'],
    queryFn: () => base44.entities.FeasibilityAnalysis.list('-created_date', 5)
  });

  const { data: recentProjects = [] } = useQuery({
    queryKey: ['recentProjects'],
    queryFn: () => base44.entities.Project.list('-created_date', 5)
  });

  const tools = [
    {
      icon: BarChart2,
      title: 'Land Feasibility Analyzer',
      desc: 'Reziduálna hodnota pozemku, IRR, ROI projektu',
      path: 'LandFeasibility',
      tag: 'Pro',
      color: 'text-blue-400',
      bg: 'bg-blue-600/10 border-blue-600/20'
    },
    {
      icon: Calculator,
      title: 'Developer Kalkulačka',
      desc: 'Kompletný finančný model – cashflow, DSCR, bankový export',
      path: 'DeveloperCalc',
      tag: 'Pro',
      color: 'text-emerald-400',
      bg: 'bg-emerald-600/10 border-emerald-600/20'
    },
    {
      icon: Clock,
      title: 'Harmonogram Povolení',
      desc: 'Gantt diagram ÚR, SP, EIA s cashflow dopadom',
      path: 'PermitTimeline',
      tag: 'Pro',
      color: 'text-amber-400',
      bg: 'bg-amber-600/10 border-amber-600/20'
    },
    {
      icon: BarChart2,
      title: 'Cost Benchmark',
      desc: 'Databáza stavebných nákladov podľa regiónu',
      path: 'CostBenchmark',
      tag: 'Free',
      color: 'text-purple-400',
      bg: 'bg-purple-600/10 border-purple-600/20'
    },
    {
      icon: TrendingUp,
      title: 'Sensitivity Engine',
      desc: 'Scenáriové simulácie dopadu zmien na IRR a zisk',
      path: 'SensitivityEngine',
      tag: 'Pro',
      color: 'text-rose-400',
      bg: 'bg-rose-600/10 border-rose-600/20'
    },
    {
      icon: BookOpen,
      title: 'Odborné Články',
      desc: 'Analýzy, legislatíva, trendy slovenského trhu',
      path: 'Articles',
      tag: 'Free',
      color: 'text-sky-400',
      bg: 'bg-sky-600/10 border-sky-600/20'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-10">
        <div className="text-xs text-blue-400 uppercase tracking-widest font-semibold mb-2">Dashboard</div>
        <h1 className="text-3xl font-black text-[#0F172A] mb-2">
          Dobrý deň, {user?.full_name?.split(' ')[0]}
        </h1>
        <p className="text-slate-500">Vyberte nástroj alebo pokračujte v rozpracovanom projekte</p>
      </div>

      {/* Tools Grid */}
      <div className="mb-12">
        <h2 className="text-lg font-bold text-[#0F172A] mb-5">Analytické nástroje</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {tools.map((tool, i) => (
            <Link key={i} to={createPageUrl(tool.path)}>
              <Card className="bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md transition group cursor-pointer h-full">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${tool.bg}`}>
                      <tool.icon className={`w-5 h-5 ${tool.color}`} />
                    </div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded border ${
                      tool.tag === 'Pro'
                        ? 'bg-blue-50 text-blue-600 border-blue-200'
                        : 'bg-slate-50 text-slate-500 border-slate-200'
                    }`}>
                      {tool.tag}
                    </span>
                  </div>
                  <h3 className="font-bold text-[#0F172A] mb-1 group-hover:text-blue-600 transition text-sm">
                    {tool.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{tool.desc}</p>
                  <div className="flex items-center gap-1 mt-4 text-xs text-blue-600 font-semibold group-hover:gap-2 transition-all">
                    Otvoriť <ChevronRight className="w-3 h-3" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Recent Analyses */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#0F172A]">Posledné analýzy</h2>
            <Link to={createPageUrl('LandFeasibility')} className="text-xs text-blue-600 hover:text-blue-700 font-medium">
              Nová analýza
            </Link>
          </div>
          <Card className="bg-white border border-slate-200">
            <CardContent className="p-0">
              {recentAnalyses.length === 0 ? (
                <div className="py-10 text-center">
                  <FileText className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-400 text-sm">Zatiaľ žiadne analýzy</p>
                  <Link to={createPageUrl('LandFeasibility')} className="text-blue-600 text-sm font-medium hover:underline mt-2 inline-block">
                    Vytvoriť prvú analýzu →
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {recentAnalyses.map((a) => (
                    <div key={a.id} className="flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition">
                      <div>
                        <div className="font-medium text-[#0F172A] text-sm">{a.project_name}</div>
                        <div className="text-xs text-slate-500">
                          IRR: {a.irr ? `${a.irr}%` : 'N/A'} · {new Date(a.created_date).toLocaleDateString('sk')}
                        </div>
                      </div>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        a.recommendation === 'proceed' ? 'bg-green-100 text-green-700' :
                        a.recommendation === 'reject' ? 'bg-red-100 text-red-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {a.recommendation === 'proceed' ? 'Odporúčané' : a.recommendation === 'reject' ? 'Zamietnuté' : 'Na zváženie'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Projects */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#0F172A]">Moje projekty</h2>
            <Link to={createPageUrl('DeveloperCalc')} className="text-xs text-blue-600 hover:text-blue-700 font-medium">
              Nový projekt
            </Link>
          </div>
          <Card className="bg-white border border-slate-200">
            <CardContent className="p-0">
              {recentProjects.length === 0 ? (
                <div className="py-10 text-center">
                  <Calculator className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-400 text-sm">Zatiaľ žiadne projekty</p>
                  <Link to={createPageUrl('DeveloperCalc')} className="text-blue-600 text-sm font-medium hover:underline mt-2 inline-block">
                    Vytvoriť prvý projekt →
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {recentProjects.map((p) => (
                    <div key={p.id} className="flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition">
                      <div>
                        <div className="font-medium text-[#0F172A] text-sm">{p.name}</div>
                        <div className="text-xs text-slate-500 capitalize">
                          {p.type} · {p.location || 'Bez lokality'}
                        </div>
                      </div>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        p.status === 'completed' ? 'bg-green-100 text-green-700' :
                        p.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {p.status === 'planning' ? 'Plánovaný' :
                         p.status === 'in_progress' ? 'Prebieha' :
                         p.status === 'completed' ? 'Dokončený' : 'Analýza'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}