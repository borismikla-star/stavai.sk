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
    <div style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}>

      {/* Hero header */}
      <div className="px-4 sm:px-6 lg:px-8 pt-10 pb-14"
        style={{ background: 'transparent' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(99,102,241,0.2)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.3)' }}>
              Dashboard
            </span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-white mb-2 tracking-tight">
            Dobrý deň, {user?.full_name?.split(' ')[0]} 👋
          </h1>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>Vyberte nástroj alebo pokračujte v rozpracovanom projekte.</p>
        </div>
      </div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">

      {/* Tools */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-white">Analytické nástroje</h2>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }}>
            {tools.length} nástrojov
          </span>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool, i) => {
            const a = accentMap[tool.accent];
            return (
              <Link key={i} to={createPageUrl(tool.path)}>
                <div className="group rounded-2xl p-5 hover:-translate-y-1 transition-all duration-200 cursor-pointer h-full flex flex-col"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.3)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.boxShadow = 'none'; }}>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${a.bg} border ${a.border}`}
                      style={{ boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
                      <tool.icon className={`w-5 h-5 ${a.icon}`} />
                    </div>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                      style={tool.tag === 'Pro' ? {
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        color: '#fff',
                      } : {
                        background: 'rgba(255,255,255,0.08)',
                        color: 'rgba(255,255,255,0.45)',
                      }}>
                      {tool.tag}
                    </span>
                  </div>
                  <h3 className="font-bold text-white text-sm mb-1.5">
                    {tool.title}
                  </h3>
                  <p className="text-xs leading-relaxed flex-1" style={{ color: 'rgba(255,255,255,0.5)' }}>{tool.desc}</p>
                  <div className="flex items-center gap-1 mt-4 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: '#818cf8' }}>
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
            <h2 className="text-base font-bold text-white">Posledné analýzy</h2>
            <Link to={createPageUrl('LandFeasibility')} className="text-xs font-semibold flex items-center gap-1 transition-colors"
              style={{ color: '#818cf8' }}>
              Nová <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="rounded-2xl overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
            {recentAnalyses.length === 0 ? (
              <div className="py-12 text-center">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
                  style={{ background: 'rgba(99,102,241,0.15)' }}>
                  <FileText className="w-5 h-5" style={{ color: '#818cf8' }} />
                </div>
                <p className="text-sm font-medium mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Zatiaľ žiadne analýzy</p>
                <Link to={createPageUrl('LandFeasibility')} className="text-xs font-medium" style={{ color: '#818cf8' }}>
                  Vytvoriť prvú analýzu →
                </Link>
              </div>
            ) : (
              <div>
                {recentAnalyses.map((a) => (
                  <div key={a.id} className="flex items-center justify-between px-5 py-4 transition-colors"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <div>
                      <div className="font-semibold text-white text-sm">{a.project_name}</div>
                      <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
                        IRR: {a.irr ? `${a.irr}%` : 'N/A'} · {new Date(a.created_date).toLocaleDateString('sk')}
                      </div>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={a.recommendation === 'proceed' ? { background: 'rgba(16,185,129,0.15)', color: '#34d399' } :
                             a.recommendation === 'reject' ? { background: 'rgba(239,68,68,0.15)', color: '#f87171' } :
                             { background: 'rgba(245,158,11,0.15)', color: '#fbbf24' }}>
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
            <h2 className="text-base font-bold text-white">Moje projekty</h2>
            <div className="flex items-center gap-3">
              <Link to={createPageUrl('Portfolio')} className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.4)' }}>Portfólio →</Link>
              <Link to={createPageUrl('DeveloperCalc')} className="text-xs font-semibold flex items-center gap-1" style={{ color: '#818cf8' }}>
                Nový <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
            {recentProjects.length === 0 ? (
              <div className="py-12 text-center">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
                  style={{ background: 'rgba(99,102,241,0.15)' }}>
                  <Calculator className="w-5 h-5" style={{ color: '#818cf8' }} />
                </div>
                <p className="text-sm font-medium mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Zatiaľ žiadne projekty</p>
                <Link to={createPageUrl('DeveloperCalc')} className="text-xs font-medium" style={{ color: '#818cf8' }}>
                  Vytvoriť prvý projekt →
                </Link>
              </div>
            ) : (
              <div>
                {recentProjects.map((p) => (
                  <div key={p.id} className="flex items-center justify-between px-5 py-4 transition-colors"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <div>
                      <div className="font-semibold text-white text-sm">{p.name}</div>
                      <div className="text-xs mt-0.5 capitalize" style={{ color: 'rgba(255,255,255,0.4)' }}>
                        {p.type} · {p.location || 'Bez lokality'}
                      </div>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={p.status === 'completed' ? { background: 'rgba(16,185,129,0.15)', color: '#34d399' } :
                             p.status === 'in_progress' ? { background: 'rgba(99,102,241,0.15)', color: '#818cf8' } :
                             { background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }}>
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
        <div className="mt-8 rounded-2xl p-5 flex items-center gap-4"
          style={{
            background: 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.3))',
            border: '1px solid rgba(139,92,246,0.4)',
            boxShadow: '0 8px 30px rgba(99,102,241,0.2)',
          }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.15)' }}>
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-white text-sm">Beta prístup aktívny</div>
            <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>Máte prístup ku všetkým Pro funkciám počas beta fázy. Ďakujeme za spätnú väzbu!</div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}