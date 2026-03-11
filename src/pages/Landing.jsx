import React, { useState } from 'react';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart2, Calculator, Clock, TrendingUp, ChevronRight,
  Shield, Target, ArrowRight, Check, Star, Building2,
  BookOpen, Users, LineChart, Zap, FileSpreadsheet, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Landing() {
  const [calcInputs, setCalcInputs] = useState({ investment: '', revenue: '', duration: '' });
  const [calcResult, setCalcResult] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  const { data: settingsRecords } = useQuery({
    queryKey: ['platformSettings'],
    queryFn: () => base44.entities.PlatformSettings.filter({ key: 'main' }),
    staleTime: 5 * 60 * 1000,
  });
  const platformSettings = settingsRecords?.[0] || null;

  const handleLogin = () => {
    base44.auth.redirectToLogin(createPageUrl('Dashboard'));
  };

  const calcROI = () => {
    const inv = parseFloat(calcInputs.investment) || 0;
    const rev = parseFloat(calcInputs.revenue) || 0;
    const dur = parseFloat(calcInputs.duration) || 1;
    if (!inv || !rev) return;
    const profit = rev - inv;
    const roi = ((profit / inv) * 100).toFixed(1);
    const irr = (((Math.pow(rev / inv, 1 / dur)) - 1) * 100).toFixed(1);
    setCalcResult({ profit, roi, irr });
  };

  const tools = [
    { icon: BarChart2, title: 'Land Feasibility Analyzer', desc: 'Reziduálna hodnota pozemku, IRR, NPV. Rozhodujte na dátach.', tag: 'Pro', accent: 'blue' },
    { icon: Calculator, title: 'Developer Kalkulačka', desc: 'Kompletný finančný model — cashflow, DSCR, bankový export.', tag: 'Pro', accent: 'emerald' },
    { icon: Clock, title: 'Harmonogram Povolení', desc: 'Gantt diagram ÚR, SP, EIA s dopadom na cashflow.', tag: 'Pro', accent: 'amber' },
    { icon: BarChart2, title: 'Cost Benchmark', desc: 'Databáza stavebných nákladov podľa regiónu a štandardu.', tag: 'Free', accent: 'violet' },
    { icon: TrendingUp, title: 'Sensitivity Engine', desc: 'Scenáriové simulácie dopadu zmien na IRR a zisk.', tag: 'Pro', accent: 'rose' },
    { icon: BookOpen, title: 'Odborné Články', desc: 'Analýzy trhu, legislatíva, case studies pre SK trh.', tag: 'Free', accent: 'sky' },
  ];

  const accentMap = {
    blue:   'bg-blue-50 text-blue-600',
    emerald:'bg-emerald-50 text-emerald-600',
    amber:  'bg-amber-50 text-amber-600',
    violet: 'bg-violet-50 text-violet-600',
    rose:   'bg-rose-50 text-rose-600',
    sky:    'bg-sky-50 text-sky-600',
  };

  const testimonials = [
    { name: 'Martin S.', role: 'Developerská firma', text: 'Konečne nástroj, ktorý hovorí jazykom čísel. Land Feasibility Analyzer ušetril nášmu tímu desiatky hodín.' },
    { name: 'Jana K.', role: 'Investičný poradca', text: 'Výstupy predkladáme priamo bankám. Developer Kalkulačka je presne to, čo sme potrebovali.' },
    { name: 'Peter V.', role: 'Realitný developer', text: 'Sensitivity Engine nám pomohol identifikovať tri scenáre, kde projekt nebol rentabilný. Ušetrili sme státisíce.' },
  ];

  const faqs = [
    { q: 'Pre koho je stavai.sk určený?', a: 'Pre developerov, investorov, stavebné firmy a finančných poradcov na slovenskom trhu.' },
    { q: 'Môžem exportovať výsledky?', a: 'Áno, Pro plán umožňuje export do PDF vhodného pre banky a investorov.' },
    { q: 'Odkiaľ pochádzajú dáta v Cost Benchmark?', a: 'Z reálnych projektov realizovaných na slovenskom trhu, pravidelne aktualizované.' },
    { q: 'Je možné uložiť viac projektov?', a: 'Áno, všetky analýzy a projekty sú uložené vo vašom účte.' },
  ];

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>

      {/* Beta Banner */}
      {platformSettings?.beta_mode && !bannerDismissed && (
        <div className="bg-violet-600 text-white text-sm py-2.5 px-4 flex items-center justify-center gap-3 relative">
          <span className="font-semibold">🚀 Beta</span>
          <span>{platformSettings.beta_banner || 'Vitajte v beta verzii stavai.sk!'}</span>
          <button onClick={() => setBannerDismissed(true)} className="absolute right-4 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg tracking-tight">
              stavai<span className="text-blue-600">.sk</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-500">
            <a href="#nastroje" className="hover:text-gray-900 transition-colors">Nástroje</a>
            <a href="#cennik" className="hover:text-gray-900 transition-colors">Cenník</a>
            <a href="#faq" className="hover:text-gray-900 transition-colors">FAQ</a>
            <a href="#kontakt" className="hover:text-gray-900 transition-colors">Kontakt</a>
          </nav>

          <div className="flex items-center gap-2">
            <button onClick={handleLogin} className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-3 py-2 rounded-lg hover:bg-gray-50">
              Prihlásiť sa
            </button>
            <Button onClick={handleLogin} className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg font-semibold shadow-sm">
              Začať zadarmo
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-20 pb-24 lg:pt-28 lg:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left */}
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-8 border border-blue-100">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
                Beta · Slovensko
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-[1.15] mb-6 tracking-tight">
                Analytická platforma pre{' '}
                <span className="text-blue-600">real estate</span>{' '}
                development
              </h1>
              <p className="text-lg text-gray-500 mb-8 leading-relaxed">
                Profesionálne decision-support nástroje pre investorov, developerov a stavebné firmy. Výsledky, nie tabuľky.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mb-10">
                <Button onClick={handleLogin} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-sm font-semibold rounded-xl flex items-center justify-center gap-2 shadow-sm">
                  Začať zadarmo <ArrowRight className="w-4 h-4" />
                </Button>
                <Button variant="outline" onClick={handleLogin} className="px-6 py-3 text-sm rounded-xl border-gray-200 text-gray-700 hover:bg-gray-50 font-medium">
                  Zobraziť nástroje
                </Button>
              </div>
              <div className="flex items-center gap-5 text-sm text-gray-400">
                <div className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-500" /><span>Bez kreditky</span></div>
                <div className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-500" /><span>Free plán</span></div>
                <div className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-500" /><span>SK dáta</span></div>
              </div>
            </div>

            {/* Right — Quick Calc */}
            <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Target className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <span className="font-semibold text-gray-900 text-sm">Rýchly ROI Check</span>
              </div>
              <p className="text-xs text-gray-500 mb-6 ml-9">Rýchly odhad rentability projektu</p>

              <div className="space-y-3.5">
                {[
                  { label: 'Investícia (€)', key: 'investment', placeholder: 'napr. 1 000 000' },
                  { label: 'Očakávaný výnos (€)', key: 'revenue', placeholder: 'napr. 1 400 000' },
                  { label: 'Trvanie projektu (roky)', key: 'duration', placeholder: 'napr. 3' },
                ].map(field => (
                  <div key={field.key}>
                    <label className="text-xs font-medium text-gray-600 mb-1.5 block">{field.label}</label>
                    <input
                      type="number"
                      placeholder={field.placeholder}
                      value={calcInputs[field.key]}
                      onChange={e => setCalcInputs(p => ({ ...p, [field.key]: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition-shadow"
                    />
                  </div>
                ))}
                <Button onClick={calcROI} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-semibold text-sm shadow-sm">
                  Vypočítať
                </Button>
              </div>

              {calcResult && (
                <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-3 gap-3">
                  {[
                    { label: 'Zisk', value: `${calcResult.profit >= 0 ? '+' : ''}${new Intl.NumberFormat('sk', { maximumFractionDigits: 0 }).format(calcResult.profit)} €`, color: 'text-gray-900' },
                    { label: 'ROI', value: `${calcResult.roi}%`, color: parseFloat(calcResult.roi) >= 15 ? 'text-emerald-600' : parseFloat(calcResult.roi) >= 5 ? 'text-amber-600' : 'text-red-500' },
                    { label: 'IRR / rok', value: `${calcResult.irr}%`, color: parseFloat(calcResult.irr) >= 12 ? 'text-emerald-600' : parseFloat(calcResult.irr) >= 5 ? 'text-amber-600' : 'text-red-500' },
                  ].map(m => (
                    <div key={m.label} className="bg-white rounded-xl p-3 text-center border border-gray-100">
                      <div className={`text-lg font-bold ${m.color}`}>{m.value}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{m.label}</div>
                    </div>
                  ))}
                </div>
              )}

              {!calcResult && (
                <p className="mt-4 text-xs text-gray-400 text-center">Pre detailnú analýzu použite naše Pro nástroje</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-y border-gray-100 bg-gray-50 py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '5+', label: 'analytických nástrojov' },
              { value: '100+', label: 'premenných v modeli' },
              { value: 'PDF', label: 'export reportov' },
              { value: 'SK', label: 'lokalizované dáta' },
            ].map((s, i) => (
              <div key={i}>
                <div className="text-2xl font-bold text-blue-600 mb-1">{s.value}</div>
                <div className="text-sm text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools */}
      <section id="nastroje" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl mb-14">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3">Nástroje</p>
            <h2 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">Všetko čo developer potrebuje</h2>
            <p className="text-gray-500 leading-relaxed">Od prvej analýzy pozemku až po bankový report. Jeden ekosystém pre slovenský trh.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {tools.map((tool, i) => (
              <div key={i}
                className="group bg-white border border-gray-200 rounded-2xl p-6 hover:border-gray-300 hover:shadow-lg transition-all cursor-pointer"
                onClick={handleLogin}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-5 ${accentMap[tool.accent]}`}>
                  <tool.icon className="w-5 h-5" />
                </div>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 text-sm group-hover:text-blue-600 transition-colors leading-snug pr-2">{tool.title}</h3>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${
                    tool.tag === 'Pro' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-gray-100 text-gray-500'
                  }`}>{tool.tag}</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{tool.desc}</p>
                <div className="flex items-center gap-1 mt-5 text-xs font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  Otvoriť <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why stavai */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3">Prečo stavai.sk</p>
              <h2 className="text-3xl font-bold text-gray-900 mb-5 tracking-tight">
                Pretože generické tabuľky nestačia
              </h2>
              <p className="text-gray-500 leading-relaxed mb-10">
                Profesionálne analytické nástroje, ktoré doteraz existovali len v Exceli konzultantov za tisíce eur. Teraz dostupné pre každého.
              </p>
              <div className="space-y-6">
                {[
                  { icon: Target, title: 'Developer-First dizajn', desc: 'Metriky, ktoré skutočne rozhodujú: IRR, NPV, DSCR, reziduálna hodnota.' },
                  { icon: Shield, title: 'Slovenský trh', desc: 'Dáta, benchmarky a legislatívne rámce prispôsobené slovenským podmienkam.' },
                  { icon: FileSpreadsheet, title: 'Profesionálne výstupy', desc: 'PDF reporty vhodné pre banky, investorov a developerské tímy.' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-9 h-9 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm mb-1">{item.title}</div>
                      <div className="text-gray-500 text-sm leading-relaxed">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-blue-600" />
                </div>
                <span className="font-semibold text-gray-900 text-sm">Postavené pre slovenský trh</span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed mb-7">
                stavai.sk vzniklo z frustrácie developerov, ktorí museli kombinovať desiatky tabuliek, odhadov a konzultantov. Jeden nástroj, všetky odpovede.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Land Feasibility', sub: 'Reziduálna metóda' },
                  { label: 'Dev. Kalkulačka', sub: 'Cashflow + DSCR' },
                  { label: 'Sensitivity', sub: 'Scenárová analýza' },
                  { label: 'Cost Benchmark', sub: 'Trhové dáta SK' },
                ].map((item, i) => (
                  <div key={i} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className="font-semibold text-gray-900 text-sm">{item.label}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{item.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl mb-14">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3">Referencie</p>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Čo hovoria používatelia</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-2xl p-7">
                <div className="flex gap-0.5 mb-5">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-gray-600 leading-relaxed mb-6 text-sm">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-700 text-xs font-bold">{t.name.charAt(0)}</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{t.name}</div>
                    <div className="text-xs text-gray-400">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="cennik" className="py-24 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3">Cenník</p>
            <h2 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">Vyberte si plán</h2>
            <p className="text-gray-500 text-sm">Začnite zadarmo, upgradujte keď ste pripravení</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Free', price: '0 €', period: '/mesiac',
                desc: 'Pre začiatok',
                features: ['Cost Benchmark', 'Odborné články', 'Orientačné kalkulačky'],
                cta: 'Začať zadarmo', highlight: false
              },
              {
                name: 'Pro', price: '79 €', period: '/mesiac',
                desc: 'Pre profesionálov',
                features: ['Land Feasibility Analyzer', 'Developer Kalkulačka', 'Harmonogram Povolení', 'Sensitivity Engine', 'PDF export reportov', 'Detailné benchmarky SK'],
                cta: 'Vyskúšať Pro', highlight: true
              },
              {
                name: 'Enterprise', price: 'Na mieru', period: '',
                desc: 'Pre tímy',
                features: ['Všetko z Pro', 'Bankové modely', 'API prístup', 'Dedikovaná podpora'],
                cta: 'Kontaktovať', highlight: false
              }
            ].map((plan, i) => (
              <div key={i} className={`rounded-2xl p-7 border relative ${
                plan.highlight
                  ? 'bg-blue-600 border-blue-500 shadow-xl shadow-blue-100'
                  : 'bg-white border-gray-200'
              }`}>
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full">Najpopulárnejší</span>
                  </div>
                )}
                <div className={`text-xs font-semibold uppercase tracking-wider mb-2 ${plan.highlight ? 'text-blue-200' : 'text-gray-400'}`}>{plan.name}</div>
                <div className={`text-3xl font-bold mb-1 tracking-tight ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>
                  {plan.price}<span className={`text-sm font-normal ml-1 ${plan.highlight ? 'text-blue-200' : 'text-gray-400'}`}>{plan.period}</span>
                </div>
                <div className={`text-sm mb-7 ${plan.highlight ? 'text-blue-100' : 'text-gray-400'}`}>{plan.desc}</div>
                <ul className="space-y-2.5 mb-8">
                  {plan.features.map((f, j) => (
                    <li key={j} className={`flex items-center gap-2.5 text-sm ${plan.highlight ? 'text-blue-50' : 'text-gray-600'}`}>
                      <Check className={`w-4 h-4 flex-shrink-0 ${plan.highlight ? 'text-blue-200' : 'text-blue-500'}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button onClick={handleLogin} className={`w-full py-2.5 font-semibold rounded-xl text-sm ${
                  plan.highlight ? 'bg-white text-blue-600 hover:bg-blue-50' : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}>
                  {plan.cta}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3">FAQ</p>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Časté otázky</h2>
          </div>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left px-5 py-4 flex items-center justify-between font-medium text-gray-900 hover:bg-gray-50 transition-colors text-sm"
                >
                  {faq.q}
                  <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ml-3 ${openFaq === i ? 'rotate-90' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-sm text-gray-500 leading-relaxed">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">Pripravený na lepšie rozhodnutia?</h2>
          <p className="text-blue-100 mb-8 leading-relaxed">Pripojte sa k developerom, ktorí rozhodujú na dátach, nie na odhadoch.</p>
          <Button onClick={handleLogin} className="bg-white text-blue-600 hover:bg-blue-50 px-7 py-3 text-sm font-bold rounded-xl shadow-sm">
            Začať zadarmo <ArrowRight className="w-4 h-4 ml-2 inline" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer id="kontakt" className="border-t border-gray-100 bg-white pt-14 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                  <Building2 className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-gray-900 text-lg">stavai<span className="text-blue-600">.sk</span></span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                Analytická platforma pre real estate development na Slovensku.
              </p>
              <div className="mt-4">
                <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">🇸🇰 Slovensko</span>
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-4">Platforma</div>
              <ul className="space-y-2.5 text-sm text-gray-500">
                <li><a href="#nastroje" className="hover:text-gray-900 transition-colors">Nástroje</a></li>
                <li><a href="#cennik" className="hover:text-gray-900 transition-colors">Cenník</a></li>
                <li><a href="#faq" className="hover:text-gray-900 transition-colors">FAQ</a></li>
                <li><button onClick={handleLogin} className="hover:text-gray-900 transition-colors">Prihlásiť sa</button></li>
              </ul>
            </div>

            <div>
              <div className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-4">Kontakt</div>
              <ul className="space-y-2.5 text-sm text-gray-500">
                <li><a href="mailto:info@stavai.sk" className="hover:text-gray-900 transition-colors">info@stavai.sk</a></li>
                <li>Slovenská republika</li>
                <li className="pt-1">
                  <Button onClick={handleLogin} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 rounded-lg">
                    Začať zadarmo
                  </Button>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-400">
            <span>© 2026 stavai.sk — Všetky práva vyhradené</span>
            <div className="flex gap-5">
              <a href="#" className="hover:text-gray-600 transition-colors">Ochrana súkromia</a>
              <a href="#" className="hover:text-gray-600 transition-colors">Podmienky použitia</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}