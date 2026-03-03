import React, { useState } from 'react';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import {
  BarChart2, Calculator, Clock, TrendingUp, FileText, ChevronRight,
  Shield, Zap, Target, ArrowRight, Check, Star, Building2, Users, BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Landing() {
  const [calcInputs, setCalcInputs] = useState({ investment: '', revenue: '', duration: '' });
  const [calcResult, setCalcResult] = useState(null);

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
    { icon: BarChart2, title: 'Land Feasibility Analyzer', desc: 'Reziduálna hodnota pozemku, IRR, NPV. Rozhodujte na dátach.', tag: 'Pro', color: 'bg-blue-100 text-blue-600' },
    { icon: Calculator, title: 'Developer Kalkulačka', desc: 'Kompletný finančný model — cashflow, DSCR, bankový export.', tag: 'Pro', color: 'bg-violet-100 text-violet-600' },
    { icon: Clock, title: 'Harmonogram Povolení', desc: 'Gantt diagram ÚR, SP, EIA s dopadom na cashflow.', tag: 'Pro', color: 'bg-amber-100 text-amber-700' },
    { icon: BarChart2, title: 'Cost Benchmark', desc: 'Databáza stavebných nákladov podľa regiónu a štandardu.', tag: 'Free', color: 'bg-emerald-100 text-emerald-600' },
    { icon: TrendingUp, title: 'Sensitivity Engine', desc: 'Scenáriové simulácie dopadu zmien na IRR a zisk.', tag: 'Pro', color: 'bg-rose-100 text-rose-600' },
    { icon: BookOpen, title: 'Odborné Články', desc: 'Analýzy trhu, legislatíva, case studies pre SK/CZ.', tag: 'Free', color: 'bg-sky-100 text-sky-600' },
  ];

  const testimonials = [
    { name: 'Martin S.', role: 'Developerská firma', text: 'Konečne nástroj, ktorý hovorí jazykom čísel. Land Feasibility Analyzer ušetril naše tímu desiatky hodín v Exceli.' },
    { name: 'Jana K.', role: 'Investičný poradca', text: 'Výstupy sú na takej úrovni, že ich predkladáme priamo bankám. Developer Kalkulačka je geniálna.' },
    { name: 'Peter V.', role: 'Realitný developer', text: 'Sensitivity Engine nám pomohol identifikovať tri scenáre, kde projekt nebol rentabilný. Ušetrili sme státisíce.' },
  ];

  const faqs = [
    { q: 'Pre koho je stavai.sk určený?', a: 'Pre developerov, investorov, stavebné firmy a finančných poradcov pôsobiacich na slovenskom a českom trhu.' },
    { q: 'Môžem exportovať výsledky?', a: 'Áno, Pro plán umožňuje export do PDF formátu vhodného pre banky a investorov.' },
    { q: 'Odkiaľ pochádzajú dáta v Cost Benchmark?', a: 'Z reálnych projektov realizovaných na slovenskom trhu, pravidelne aktualizované.' },
    { q: 'Je možné uložiť viac projektov?', a: 'Áno, všetky analýzy a projekty sú uložené vo vašom účte a prístupné kedykoľvek.' },
  ];

  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>

      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-sm">S</span>
            </div>
            <span className="font-bold text-gray-900 text-lg tracking-tight">stavai<span className="text-blue-600">.sk</span></span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-500">
            <a href="#nastroje" className="hover:text-gray-900 transition">Nástroje</a>
            <a href="#cennik" className="hover:text-gray-900 transition">Cenník</a>
            <a href="#faq" className="hover:text-gray-900 transition">FAQ</a>
            <a href="#kontakt" className="hover:text-gray-900 transition">Kontakt</a>
          </nav>

          <div className="flex items-center gap-3">
            <button onClick={handleLogin} className="text-sm font-medium text-gray-500 hover:text-gray-900 transition px-3 py-2">
              Prihlásiť sa
            </button>
            <Button onClick={handleLogin} className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-5 py-2 rounded-lg font-semibold">
              Začať zadarmo →
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-16 pb-20 lg:pt-24 lg:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left */}
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 border border-blue-100">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
                Beta — Slovensko & Česká republika
              </div>
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-black text-gray-900 leading-[1.1] mb-6">
                Analytická platforma pre <span className="text-blue-600">development</span>
              </h1>
              <p className="text-lg text-gray-500 mb-8 leading-relaxed max-w-lg">
                Decision-support nástroje pre investorov, developerov a stavebné firmy. Profesionálne výstupy — nie tabuľky v Exceli.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mb-10">
                <Button onClick={handleLogin} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-base font-semibold rounded-xl flex items-center gap-2">
                  Začať zadarmo <ArrowRight className="w-4 h-4" />
                </Button>
                <Button variant="outline" onClick={handleLogin} className="px-6 py-3 text-base rounded-xl border-gray-200 text-gray-700 hover:bg-gray-50">
                  Zobraziť nástroje
                </Button>
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-1.5"><Check className="w-4 h-4 text-green-500" />Bez kreditky</div>
                <div className="flex items-center gap-1.5"><Check className="w-4 h-4 text-green-500" />Free plán navždy</div>
                <div className="flex items-center gap-1.5"><Check className="w-4 h-4 text-green-500" />SK/CZ dáta</div>
              </div>
            </div>

            {/* Right — Quick Calculator */}
            <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <Target className="w-5 h-5 text-blue-600" />
                <span className="font-bold text-gray-900">Rýchly ROI Check</span>
              </div>
              <p className="text-sm text-gray-500 mb-6">Rýchly odhad rentability projektu</p>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Investícia (€)</label>
                  <input
                    type="number"
                    placeholder="napr. 1 000 000"
                    value={calcInputs.investment}
                    onChange={e => setCalcInputs(p => ({ ...p, investment: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Očakávaný výnos (€)</label>
                  <input
                    type="number"
                    placeholder="napr. 1 400 000"
                    value={calcInputs.revenue}
                    onChange={e => setCalcInputs(p => ({ ...p, revenue: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Trvanie projektu (roky)</label>
                  <input
                    type="number"
                    placeholder="napr. 3"
                    value={calcInputs.duration}
                    onChange={e => setCalcInputs(p => ({ ...p, duration: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
                <Button onClick={calcROI} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-semibold">
                  Vypočítať
                </Button>
              </div>

              {calcResult && (
                <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-xl font-black text-gray-900">
                      {calcResult.profit >= 0 ? '+' : ''}{new Intl.NumberFormat('sk', { maximumFractionDigits: 0 }).format(calcResult.profit)} €
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">Zisk</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-xl font-black ${parseFloat(calcResult.roi) >= 15 ? 'text-green-600' : parseFloat(calcResult.roi) >= 5 ? 'text-amber-600' : 'text-red-600'}`}>
                      {calcResult.roi}%
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">ROI</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-xl font-black ${parseFloat(calcResult.irr) >= 12 ? 'text-green-600' : parseFloat(calcResult.irr) >= 5 ? 'text-amber-600' : 'text-red-600'}`}>
                      {calcResult.irr}%
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">IRR / rok</div>
                  </div>
                </div>
              )}

              {!calcResult && (
                <p className="mt-4 text-xs text-gray-400 text-center">Pre detailnú analýzu použite naše Pro nástroje →</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Logos/stats strip */}
      <section className="border-y border-gray-100 bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '5+', label: 'analytických nástrojov' },
              { value: '100+', label: 'premenných v modeli' },
              { value: 'PDF', label: 'export reportov' },
              { value: 'SK', label: 'lokalizované dáta' },
            ].map((s, i) => (
              <div key={i}>
                <div className="text-2xl font-black text-blue-600 mb-1">{s.value}</div>
                <div className="text-sm text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools */}
      <section id="nastroje" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3">Nástroje</div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">Všetko čo developer potrebuje</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">Od prvej analýzy pozemku až po bankový report. Jeden ekosystém.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool, i) => (
              <div key={i} className="group bg-white border border-gray-200 rounded-2xl p-6 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer" onClick={handleLogin}>
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-5 ${tool.color}`}>
                  <tool.icon className="w-5 h-5" />
                </div>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-gray-900 text-base group-hover:text-blue-600 transition leading-tight pr-2">{tool.title}</h3>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${
                    tool.tag === 'Pro' ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'bg-gray-100 text-gray-500 border border-gray-200'
                  }`}>{tool.tag}</span>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">{tool.desc}</p>
                <div className="flex items-center gap-1 mt-4 text-xs font-semibold text-blue-600 group-hover:gap-2 transition-all">
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
              <div className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3">Prečo stavai.sk</div>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6">
                Pretože generické tabuľky nestačia
              </h2>
              <p className="text-gray-500 text-lg mb-10 leading-relaxed">
                Profesionálne analytické nástroje, ktoré doteraz existovali len v Exceli konzultantov za tisíce eur. Teraz dostupné pre každého.
              </p>
              <div className="space-y-6">
                {[
                  { icon: Target, title: 'Developer-First dizajn', desc: 'Metriky, ktoré skutočne rozhodujú: IRR, NPV, DSCR, reziduálna hodnota.' },
                  { icon: Shield, title: 'Slovenský trh', desc: 'Dáta, benchmarky a legislatívne rámce prispôsobené slovenským podmienkam.' },
                  { icon: Zap, title: 'Profesionálne výstupy', desc: 'PDF reporty vhodné pre banky, investorov a developerské tímy.' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 mb-1">{item.title}</div>
                      <div className="text-gray-500 text-sm leading-relaxed">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <Building2 className="w-6 h-6 text-blue-600" />
                <span className="font-bold text-gray-900">Postavené pre slovenský trh</span>
              </div>
              <p className="text-gray-600 leading-relaxed mb-8">
                stavai.sk vzniklo z frustrácie developerov, ktorí museli kombinovať desiatky tabuliek, odhadov a konzultantov. Náš cieľ: jeden nástroj, všetky odpovede — prispôsobený slovenským podmienkam.
              </p>
              <div className="grid grid-cols-2 gap-4">
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
          <div className="text-center mb-14">
            <div className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3">Referencie</div>
            <h2 className="text-3xl font-black text-gray-900">Čo hovoria používatelia</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-2xl p-7 shadow-sm">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-gray-600 leading-relaxed mb-6 text-sm">"{t.text}"</p>
                <div>
                  <div className="font-bold text-gray-900 text-sm">{t.name}</div>
                  <div className="text-xs text-gray-400">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="cennik" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3">Cenník</div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">Vyberte si plán</h2>
            <p className="text-gray-500">Začnite zadarmo, upgradujte keď ste pripravení</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
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
                features: ['Land Feasibility Analyzer', 'Developer Kalkulačka', 'Harmonogram Povolení', 'Sensitivity Engine', 'PDF export reportov', 'Detailné benchmarky SK/CZ'],
                cta: 'Vyskúšať Pro', highlight: true
              },
              {
                name: 'Enterprise', price: 'Na mieru', period: '',
                desc: 'Pre tímy',
                features: ['Všetko z Pro', 'Bankové modely', 'API prístup', 'Dedikovaná podpora'],
                cta: 'Kontaktovať', highlight: false
              }
            ].map((plan, i) => (
              <div key={i} className={`rounded-2xl p-8 border ${plan.highlight ? 'bg-blue-600 border-blue-500 shadow-xl shadow-blue-200' : 'bg-white border-gray-200'}`}>
                {plan.highlight && <div className="text-xs font-semibold text-blue-200 uppercase tracking-wider mb-3">Najpopulárnejší</div>}
                <div className={`text-sm font-semibold mb-2 ${plan.highlight ? 'text-blue-100' : 'text-gray-500'}`}>{plan.name}</div>
                <div className={`text-4xl font-black mb-1 ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>
                  {plan.price}<span className={`text-sm font-normal ml-1 ${plan.highlight ? 'text-blue-200' : 'text-gray-400'}`}>{plan.period}</span>
                </div>
                <div className={`text-sm mb-7 ${plan.highlight ? 'text-blue-100' : 'text-gray-400'}`}>{plan.desc}</div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f, j) => (
                    <li key={j} className={`flex items-center gap-2.5 text-sm ${plan.highlight ? 'text-blue-50' : 'text-gray-600'}`}>
                      <Check className={`w-4 h-4 flex-shrink-0 ${plan.highlight ? 'text-blue-200' : 'text-blue-500'}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button onClick={handleLogin} className={`w-full py-2.5 font-semibold rounded-xl ${
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
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3">FAQ</div>
            <h2 className="text-3xl font-black text-gray-900">Časté otázky</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left px-6 py-4 flex items-center justify-between font-semibold text-gray-900 hover:bg-gray-50 transition text-sm"
                >
                  {faq.q}
                  <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${openFaq === i ? 'rotate-90' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4 text-sm text-gray-500 leading-relaxed">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-blue-600">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Pripravený na lepšie rozhodnutia?</h2>
          <p className="text-blue-100 text-lg mb-8">Pripojte sa k developerom, ktorí rozhodujú na dátach, nie na odhadoch.</p>
          <Button onClick={handleLogin} className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 text-base font-bold rounded-xl">
            Začať zadarmo <ArrowRight className="w-4 h-4 ml-2 inline" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer id="kontakt" className="border-t border-gray-100 bg-gray-50 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-black text-sm">S</span>
                </div>
                <span className="font-bold text-gray-900 text-lg">stavai<span className="text-blue-600">.sk</span></span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                Analytická platforma pre real estate development na Slovensku. Rozhodujte na dátach, nie na odhadoch.
              </p>
              <div className="mt-5 flex items-center gap-2">
                <span className="text-xs text-gray-400">Dostupné pre:</span>
                <span className="text-xs font-semibold bg-gray-200 text-gray-600 px-2 py-0.5 rounded">🇸🇰 Slovensko</span>
              </div>
            </div>

            {/* Links */}
            <div>
              <div className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-4">Platforma</div>
              <ul className="space-y-2.5 text-sm text-gray-500">
                <li><a href="#nastroje" className="hover:text-gray-900 transition">Nástroje</a></li>
                <li><a href="#cennik" className="hover:text-gray-900 transition">Cenník</a></li>
                <li><a href="#faq" className="hover:text-gray-900 transition">FAQ</a></li>
                <li><button onClick={handleLogin} className="hover:text-gray-900 transition">Prihlásiť sa</button></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <div className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-4">Kontakt</div>
              <ul className="space-y-2.5 text-sm text-gray-500">
                <li><a href="mailto:info@stavai.sk" className="hover:text-gray-900 transition">info@stavai.sk</a></li>
                <li><span>Slovenská republika</span></li>
                <li className="pt-2">
                  <Button onClick={handleLogin} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-4">
                    Začať zadarmo
                  </Button>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-400">
            <span>© 2026 stavai.sk — Všetky práva vyhradené</span>
            <div className="flex gap-4">
              <a href="#" className="hover:text-gray-600 transition">Ochrana súkromia</a>
              <a href="#" className="hover:text-gray-600 transition">Podmienky použitia</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}