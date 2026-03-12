import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart2, Calculator, Clock, TrendingUp, ChevronRight,
  FileText, BookOpen, ArrowUpRight, Zap
} from 'lucide-react';

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
      title: 'Land Feasibility',
      desc: 'Reziduálna hodnota pozemku, IRR, ROI',
      path: 'LandFeasibility',
      tag: 'Pro',
      accent: 'blue',
    },
    {
      icon: Calculator,
      title: 'Developer Kalkulačka',
      desc: 'Finančný model – cashflow, DSCR, export',
      path: 'DeveloperCalc',
      tag: 'Pro',
      accent: 'emerald',
    },
    {
      icon: Clock,
      title: 'Harmonogram Povolení',
      desc: 'Gantt diagram ÚR, SP, EIA',
      path: 'PermitTimeline',
      tag: 'Pro',
      accent: 'amber',
    },
    {
      icon: BarChart2,
      title: 'Cost Benchmark',
      desc: 'Stavebné náklady podľa regiónu',
      path: 'CostBenchmark',
      tag: 'Free',
      accent: 'violet',
    },
    {
      icon: TrendingUp,
      title: 'Sensitivity Engine',
      desc: 'Scenáriové simulácie dopadu na IRR',
      path: 'SensitivityEngine',
      tag: 'Pro',
      accent: 'rose',
    },
    {
      icon: BookOpen,
      title: 'Odborné Články',
      desc: 'Analýzy, legislatíva, trendy SK trhu',
      path: 'Articles',
      tag: 'Free',
      accent: 'sky',
    }
  ];

  const accentMap = {
    blue:   { bg: 'bg-blue-50',   icon: 'text-blue-600',   border: 'border-blue-100',   badge: 'bg-blue-100 text-blue-700' },
    emerald:{ bg: 'bg-emerald-50',icon: 'text-emerald-600',border: 'border-emerald-100',badge: 'bg-emerald-100 text-emerald-700' },
    amber:  { bg: 'bg-amber-50',  icon: 'text-amber-600',  border: 'border-amber-100',  badge: 'bg-amber-100 text-amber-700' },
    violet: { bg: 'bg-violet-50', icon: 'text-violet-600', border: 'border-violet-100', badge: 'bg-violet-100 text-violet-700' },
    rose:   { bg: 'bg-rose-50',   icon: 'text-rose-600',   border: 'border-rose-100',   badge: 'bg-rose-100 text-rose-700' },
    sky:    { bg: 'bg-sky-50',    icon: 'text-sky-600',    border: 'border-sky-100',    badge: 'bg-sky-100 text-sky-700' },
  };

  return (
    <div className="bg-slate-50 min-h-screen" style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}>

      {/* Hero header */}
      <div className="bg-white border-b border-slate-100 px-4 sm:px-6 lg:px-8 pt-10 pb-10">
        <div className="max-w-7xl mx-auto">
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-600 inline-block mb-3">
            Dashboard
          </span>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">
            Dobrý deň, {user?.full_name?.split(' ')[0]} 👋
          </h1>
          <p className="text-sm text-slate-500">Vyberte nástroj alebo pokračujte v rozpracovanom projekte.</p>
        </div>
      </div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Tools */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-slate-900">Analytické nástroje</h2>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-500">
            {tools.length} nástrojov
          </span>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool, i) => {
            const a = accentMap[tool.accent];
            return (
              <Link key={i} to={createPageUrl(tool.path)}>
                <div className="group bg-white rounded-2xl p-5 border border-slate-200 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-50 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer h-full flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${a.bg} border ${a.border}`}>
                      <tool.icon className={`w-5 h-5 ${a.icon}`} />
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      tool.tag === 'Pro'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-500'
                    }`}>
                      {tool.tag}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mb-1.5 group-hover:text-indigo-600 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed flex-1">{tool.desc}</p>
                  <div className="flex items-center gap-1 mt-4 text-xs font-bold text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    Otvoriť <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* Analyses */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900">Posledné analýzy</h2>
            <Link to={createPageUrl('LandFeasibility')} className="text-xs font-semibold flex items-center gap-1 text-indigo-600 hover:text-indigo-700">
              Nová <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            {recentAnalyses.length === 0 ? (
              <div className="py-12 text-center">
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <FileText className="w-5 h-5 text-indigo-400" />
                </div>
                <p className="text-slate-500 text-sm font-medium mb-1">Zatiaľ žiadne analýzy</p>
                <Link to={createPageUrl('LandFeasibility')} className="text-indigo-600 text-xs font-medium hover:underline">
                  Vytvoriť prvú analýzu →
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentAnalyses.map((a) => (
                  <div key={a.id} className="flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors">
                    <div>
                      <div className="font-semibold text-slate-900 text-sm">{a.project_name}</div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        IRR: {a.irr ? `${a.irr}%` : 'N/A'} · {new Date(a.created_date).toLocaleDateString('sk')}
                      </div>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      a.recommendation === 'proceed' ? 'bg-emerald-100 text-emerald-700' :
                      a.recommendation === 'reject' ? 'bg-red-100 text-red-600' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {a.recommendation === 'proceed' ? 'Odporúčané' : a.recommendation === 'reject' ? 'Zamietnuté' : 'Na zváženie'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Projects */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900">Moje projekty</h2>
            <div className="flex items-center gap-3">
              <Link to={createPageUrl('Portfolio')} className="text-xs text-slate-400 hover:text-slate-600 font-medium">Portfólio →</Link>
              <Link to={createPageUrl('DeveloperCalc')} className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1">
                Nový <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            {recentProjects.length === 0 ? (
              <div className="py-12 text-center">
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Calculator className="w-5 h-5 text-indigo-400" />
                </div>
                <p className="text-slate-500 text-sm font-medium mb-1">Zatiaľ žiadne projekty</p>
                <Link to={createPageUrl('DeveloperCalc')} className="text-indigo-600 text-xs font-medium hover:underline">
                  Vytvoriť prvý projekt →
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentProjects.map((p) => (
                  <div key={p.id} className="flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors">
                    <div>
                      <div className="font-semibold text-slate-900 text-sm">{p.name}</div>
                      <div className="text-xs text-slate-400 mt-0.5 capitalize">
                        {p.type} · {p.location || 'Bez lokality'}
                      </div>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      p.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                      p.status === 'in_progress' ? 'bg-indigo-100 text-indigo-700' :
                      'bg-slate-100 text-slate-500'
                    }`}>
                      {p.status === 'planning' ? 'Plánovaný' :
                       p.status === 'in_progress' ? 'Prebieha' :
                       p.status === 'completed' ? 'Dokončený' : 'Analýza'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Beta banner */}
      {user?.beta_access && (
        <div className="mt-8 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-5 flex items-center gap-4 shadow-lg shadow-indigo-100">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-white text-sm">Beta prístup aktívny</div>
            <div className="text-xs text-white/70 mt-0.5">Máte prístup ku všetkým Pro funkciám počas beta fázy. Ďakujeme za spätnú väzbu!</div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}