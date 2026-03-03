import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { BarChart2, Calculator, Clock, Shield, ChevronRight, TrendingUp, FileText, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Landing() {
  const handleLogin = () => {
    base44.auth.redirectToLogin(createPageUrl('Dashboard'));
  };



  const tools = [
    {
      icon: BarChart2,
      title: 'Land Feasibility Analyzer',
      desc: 'Reziduálna hodnota pozemku, IRR, NPV. Rozhodujte na dátach, nie na odhadoch.',
      tag: 'Pro'
    },
    {
      icon: Calculator,
      title: 'Developer Kalkulačka',
      desc: 'Kompletný finančný model projektu – cashflow, DSCR, marže, bankový export.',
      tag: 'Pro'
    },
    {
      icon: Clock,
      title: 'Harmonogram Povolení',
      desc: 'Gantt diagram procesov ÚR, SP, EIA. Scenárová analýza a dopad na cashflow.',
      tag: 'Pro'
    },
    {
      icon: BarChart2,
      title: 'Cost Benchmark',
      desc: 'Databáza stavebných nákladov podľa štandardu a regiónu. Historické trendy.',
      tag: 'Free'
    },
    {
      icon: TrendingUp,
      title: 'Sensitivity Engine',
      desc: 'Automatický prepočet IRR a zisku pri zmenách cien, nákladov, oneskorení.',
      tag: 'Pro'
    },
    {
      icon: FileText,
      title: 'Odborné Články',
      desc: 'Analýzy trhu, legislatíva, case studies. Obsah od praktikov pre praktikov.',
      tag: 'Free'
    }
  ];

  const stats = [
    { value: '5+', label: 'analytických nástrojov' },
    { value: '100+', label: 'premenných v modeli' },
    { value: 'PDF', label: 'export reportov' },
    { value: 'SK/CZ', label: 'trh' },
  ];

  return (
    <div className="min-h-screen bg-[#0F172A]" style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>

      {/* Top bar */}
      <header className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white font-black text-sm">S</span>
            </div>
            <span className="text-white font-bold text-lg tracking-tight">stavai<span className="text-blue-400">.sk</span></span>
          </div>
          <Button
            onClick={handleLogin}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-5 py-2"
          >
            Prihlásiť sa
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 md:py-32 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-blue-600/10 border border-blue-600/30 text-blue-400 text-xs font-medium px-3 py-1.5 rounded-full mb-8">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></span>
              Beta – Slovensko & Česká republika
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6">
              Analytická platforma<br />
              <span className="text-blue-400">pre development</span>
            </h1>
            <p className="text-xl text-slate-400 mb-10 max-w-2xl leading-relaxed">
              Decision-support nástroje pre investorov, developerov a stavebné firmy.
              Nie kalkulačka — ekosystém.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleLogin}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-base font-semibold"
              >
                Začať zadarmo
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                variant="outline"
                onClick={handleLogin}
                className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white px-8 py-6 text-base"
              >
                Zobraziť nástroje
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-b border-slate-800 bg-[#0F172A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-800">
            {stats.map((stat, i) => (
              <div key={i} className="py-8 px-6 text-center">
                <div className="text-3xl font-black text-blue-400 mb-1">{stat.value}</div>
                <div className="text-sm text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <div className="text-xs text-blue-400 uppercase tracking-widest font-semibold mb-3">Nástroje</div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Všetko čo developer potrebuje
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl">
              Od prvej analýzy pozemku až po bankový report. Jeden ekosystém, nie rôzne tabuľky.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {tools.map((tool, i) => (
              <div key={i} className="bg-[#1E293B] border border-slate-700 rounded-xl p-6 hover:border-blue-600/50 transition group">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 bg-blue-600/10 rounded-lg flex items-center justify-center border border-blue-600/20">
                    <tool.icon className="w-5 h-5 text-blue-400" />
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded ${
                    tool.tag === 'Pro'
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30'
                      : 'bg-slate-700 text-slate-400 border border-slate-600'
                  }`}>
                    {tool.tag}
                  </span>
                </div>
                <h3 className="text-white font-bold text-lg mb-2 group-hover:text-blue-400 transition">
                  {tool.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">{tool.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bloomberg quote */}
      <section className="py-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#1E293B] border border-slate-700 rounded-2xl p-10 md:p-16">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <blockquote className="text-2xl md:text-3xl font-bold text-white leading-tight mb-2">
                  "Bloomberg pre development"
                </blockquote>
                <p className="text-slate-400">
                  Profesionálne analytické nástroje, ktoré doteraz existovali len v Exceli konzultantov za tisíce eur.
                </p>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-6 mt-10 pt-10 border-t border-slate-700">
              {[
                { icon: Shield, title: 'Dôveryhodné dáta', desc: 'Benchmarky z reálnych projektov, nie odhady' },
                { icon: TrendingUp, title: 'Profesionálne výstupy', desc: 'PDF reporty vhodné pre banky a investorov' },
                { icon: BarChart2, title: 'Scenárová analýza', desc: 'Sensitivity analýza s automatickým prepočtom' }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-600/10 rounded flex items-center justify-center flex-shrink-0 mt-1">
                    <item.icon className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm mb-1">{item.title}</div>
                    <div className="text-slate-400 text-sm">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing tiers */}
      <section className="py-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="text-xs text-blue-400 uppercase tracking-widest font-semibold mb-3">Cenník</div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Vyberte si plán</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                name: 'Free',
                price: '0 €',
                period: '/mesiac',
                desc: 'Pre začatie',
                features: ['Základné kalkulačky', 'Cost Benchmark', 'Odborné články', 'Orientačné benchmarky'],
                cta: 'Začať zadarmo',
                highlight: false
              },
              {
                name: 'Pro',
                price: '79 €',
                period: '/mesiac',
                desc: 'Pre profesionálov',
                features: ['Land Feasibility Analyzer', 'Developer Kalkulačka', 'Harmonogram Povolení', 'Sensitivity Engine', 'PDF export reportov', 'Detailné benchmarky'],
                cta: 'Vyskúšať Pro',
                highlight: true
              },
              {
                name: 'Enterprise',
                price: 'Na mieru',
                period: '',
                desc: 'Pre tímy a firmy',
                features: ['Všetko z Pro', 'Bankové modely', 'Custom exporty', 'API prístup k dátam', 'Dedikovaná podpora'],
                cta: 'Kontaktovať',
                highlight: false
              }
            ].map((plan, i) => (
              <div key={i} className={`rounded-xl p-8 border ${
                plan.highlight
                  ? 'bg-blue-600 border-blue-500'
                  : 'bg-[#1E293B] border-slate-700'
              }`}>
                <div className={`text-sm font-semibold mb-2 ${plan.highlight ? 'text-blue-100' : 'text-slate-400'}`}>{plan.name}</div>
                <div className={`text-4xl font-black mb-1 ${plan.highlight ? 'text-white' : 'text-white'}`}>
                  {plan.price}<span className={`text-sm font-normal ${plan.highlight ? 'text-blue-200' : 'text-slate-400'}`}>{plan.period}</span>
                </div>
                <div className={`text-sm mb-6 ${plan.highlight ? 'text-blue-100' : 'text-slate-400'}`}>{plan.desc}</div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f, j) => (
                    <li key={j} className={`flex items-center gap-2 text-sm ${plan.highlight ? 'text-blue-100' : 'text-slate-300'}`}>
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${plan.highlight ? 'bg-blue-500' : 'bg-slate-700'}`}>
                        <span className={`text-xs ${plan.highlight ? 'text-white' : 'text-blue-400'}`}>✓</span>
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={handleLogin}
                  className={`w-full py-5 font-semibold ${
                    plan.highlight
                      ? 'bg-white text-blue-600 hover:bg-blue-50'
                      : 'bg-slate-700 text-white hover:bg-slate-600'
                  }`}
                >
                  {plan.cta}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white font-black text-xs">S</span>
              </div>
              <span className="text-white font-bold">stavai<span className="text-blue-400">.sk</span></span>
            </div>
            <div className="text-slate-500 text-sm">© 2026 stavai.sk — Všetky práva vyhradené</div>
          </div>
        </div>
      </footer>
    </div>
  );
}