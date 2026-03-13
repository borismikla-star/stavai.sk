import { useState } from 'react';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart2, Calculator, Clock, TrendingUp, ChevronRight,
  Shield, Target, ArrowRight, Check, Star, Building2,
  BookOpen, FileSpreadsheet, ChevronDown, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import LandingListingsPreview from '@/components/portal/LandingListingsPreview';

export default function Landing() {
  const [openFaq, setOpenFaq] = useState(null);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  const { data: settings } = useQuery({
    queryKey: ['platformSettings'],
    queryFn: async () => {
      const list = await base44.entities.PlatformSettings.filter({ key: 'main' });
      return list[0] || null;
    }
  });

  const handleLogin = () => {
    base44.auth.redirectToLogin(createPageUrl('Dashboard'));
  };

  const tools = [
    { icon: BarChart2, title: 'Land Feasibility Analyzer', desc: 'Reziduálna hodnota pozemku, IRR, NPV. Rozhodujte na dátach.', tag: 'Pro' },
    { icon: Calculator, title: 'Developer Kalkulačka', desc: 'Kompletný finančný model — cashflow, DSCR, bankový export.', tag: 'Pro' },
    { icon: Clock, title: 'Harmonogram Povolení', desc: 'Gantt diagram ÚR, SP, EIA s dopadom na cashflow.', tag: 'Pro' },
    { icon: BarChart2, title: 'Cost Benchmark', desc: 'Databáza stavebných nákladov podľa regiónu a štandardu.', tag: 'Free' },
    { icon: TrendingUp, title: 'Sensitivity Engine', desc: 'Scenáriové simulácie dopadu zmien na IRR a zisk.', tag: 'Pro' },
    { icon: BookOpen, title: 'Odborné Články', desc: 'Analýzy trhu, legislatíva, case studies pre SK trh.', tag: 'Free' },
  ];

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
    { q: 'Je platforma vhodná pre začiatočníkov?', a: 'Áno, nástroje sú navrhnuté pre každého — od začiatočníkov až po skúsených developerov.' },
  ];

  const isBeta = settings?.beta_mode;
  const betaBannerText = settings?.beta_banner || 'BETA · Pridajte sa ako prví adopteri platformy!';

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif" }}>

      {/* Beta Banner */}
      {isBeta && !bannerDismissed && (
        <div className="bg-amber-400 text-amber-900 text-sm font-semibold py-2.5 px-4 text-center relative">
          <span>🚀 {betaBannerText}</span>
          <button
            onClick={() => setBannerDismissed(true)}
            className="absolute right-4 top-1/2 -translate-y-1/2 hover:opacity-70"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 285 72" height="36">
              <defs>
                <filter id="shadow2" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#4F46E5" floodOpacity="0.22"/>
                </filter>
              </defs>
              <g filter="url(#shadow2)">
                <rect x="0" y="0" width="72" height="72" rx="20" fill="#4F46E5"/>
                <rect x="0" y="0" width="72" height="36" rx="20" fill="white" opacity="0.04"/>
                <path d="M36 18L55 32V54H17V32L36 18Z" stroke="white" strokeWidth="3" strokeLinejoin="round" fill="rgba(255,255,255,0.1)"/>
                <rect x="30" y="41" width="12" height="13" rx="3" fill="white"/>
                <rect x="43" y="31" width="6" height="6" rx="1.5" fill="white" opacity="0.55"/>
              </g>
              <text x="88" y="54" fontFamily="'Outfit', sans-serif" fontSize="52" fontWeight="900" letterSpacing="-2">
                <tspan fill="#111118">stav</tspan><tspan fill="#4F46E5">ai</tspan>
              </text>
            </svg>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-500">
            <a href="#nastroje" className="hover:text-slate-900 transition-colors">Nástroje</a>
            <a href="#preco" className="hover:text-slate-900 transition-colors">Prečo stavai</a>
            <a href="#cennik" className="hover:text-slate-900 transition-colors">Cenník</a>
            <a href="#faq" className="hover:text-slate-900 transition-colors">FAQ</a>
            <a href="#kontakt" className="hover:text-slate-900 transition-colors">Kontakt</a>
            <button onClick={handleLogin} className="flex items-center gap-1.5 text-indigo-600 font-semibold hover:text-indigo-800 transition-colors">
              <Building2 className="w-4 h-4" /> Portál
            </button>
          </nav>

          <div className="flex items-center gap-2">
            <button onClick={handleLogin} className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-3 py-2 rounded-lg hover:bg-slate-100">
              Prihlásiť sa
            </button>
            <Button onClick={handleLogin} className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-xl font-semibold shadow-sm">
              Začať zadarmo
            </Button>
          </div>
        </div>
      </header>

      {/* Portal Listings Strip */}
      <section className="bg-slate-50 border-b border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-5">
            <div>
              <span className="text-xs font-semibold text-indigo-600 uppercase tracking-widest">Realitný portál</span>
              <h2 className="text-xl font-bold text-slate-900 mt-0.5">Najnovšie ponuky</h2>
            </div>
            <button
              onClick={handleLogin}
              className="flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              Zobraziť všetky <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <LandingListingsPreview onLogin={handleLogin} />
        </div>
      </section>

      {/* Hero */}
      <section className="bg-white pt-20 pb-28 lg:pt-28 lg:pb-36 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-indigo-50 rounded-full blur-3xl pointer-events-none opacity-60" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-50 rounded-full blur-3xl pointer-events-none opacity-60" />

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          {isBeta && (
            <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-8 border border-amber-200">
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse"></span>
              BETA · Pridajte sa ako prví
            </div>
          )}
          <h1 className="text-4xl lg:text-5xl xl:text-6xl font-extrabold text-slate-900 leading-[1.1] mb-6 tracking-tight">
            Investujte do{' '}
            <span className="text-indigo-600">nehnuteľností</span>{' '}
            inteligentne
          </h1>
          <p className="text-lg text-slate-500 mb-10 leading-relaxed max-w-xl mx-auto">
            Profesionálne kalkulačky a AI analýzy pre investorov, developerov a stavebné firmy na slovenskom trhu.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
            <Button onClick={handleLogin} className="bg-indigo-600 hover:bg-indigo-700 text-white px-7 py-3 text-sm font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-200">
              {isBeta ? 'Pripojiť sa do beta' : 'Začať zadarmo'} <ArrowRight className="w-4 h-4" />
            </Button>
            <Button variant="outline" onClick={handleLogin} className="px-7 py-3 text-sm rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 font-medium">
              Zobraziť nástroje
            </Button>
          </div>
          <div className="flex items-center justify-center gap-6 text-sm text-slate-400">
            <div className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-500" /><span>Bez kreditky</span></div>
            <div className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-500" /><span>Free plán</span></div>
            <div className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-500" /><span>SK dáta</span></div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="bg-slate-50 border-y border-slate-100 py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '5+', label: 'analytických nástrojov' },
              { value: '100+', label: 'premenných v modeli' },
              { value: 'PDF', label: 'export reportov' },
              { value: 'SK', label: 'lokalizované dáta' },
            ].map((s, i) => (
              <div key={i}>
                <div className="text-2xl font-bold text-indigo-600 mb-1">{s.value}</div>
                <div className="text-sm text-slate-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools */}
      <section id="nastroje" className="py-24 bg-[#f5f6fa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl mb-14">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3">Nástroje</p>
            <h2 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">Všetko čo developer potrebuje</h2>
            <p className="text-gray-500 leading-relaxed">Od prvej analýzy pozemku až po bankový report. Jeden ekosystém pre slovenský trh.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {tools.map((tool, i) => (
              <div key={i}
                className="group bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-xl hover:shadow-blue-100/40 hover:-translate-y-1 transition-all duration-200 cursor-pointer"
                onClick={handleLogin}
              >
                <div className="w-11 h-11 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center mb-5 border border-blue-100 shadow-sm">
                  <tool.icon className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-gray-900 text-sm group-hover:text-blue-600 transition-colors leading-snug pr-2">{tool.title}</h3>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex-shrink-0 ${
                    tool.tag === 'Pro' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'
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
      <section id="preco" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3">Prečo stavai.sk</p>
            <h2 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">Pretože generické tabuľky nestačia</h2>
            <p className="text-gray-500 leading-relaxed max-w-xl mx-auto">Profesionálne analytické nástroje, ktoré doteraz existovali len v Exceli konzultantov za tisíce eur.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Target, title: 'Developer-First dizajn', desc: 'Metriky, ktoré skutočne rozhodujú: IRR, NPV, DSCR, reziduálna hodnota.' },
              { icon: Shield, title: 'Slovenský trh', desc: 'Dáta, benchmarky a legislatívne rámce prispôsobené slovenským podmienkam.' },
              { icon: FileSpreadsheet, title: 'Profesionálne výstupy', desc: 'PDF reporty vhodné pre banky, investorov a developerské tímy.' },
            ].map((item, i) => (
              <div key={i} className="text-center p-8 rounded-2xl border border-gray-100 hover:border-blue-100 hover:shadow-lg transition-all">
                <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <item.icon className="w-5 h-5 text-blue-600" />
                </div>
                <div className="font-semibold text-gray-900 mb-2">{item.title}</div>
                <div className="text-gray-500 text-sm leading-relaxed">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3">Referencie</p>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Čo hovoria používatelia</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-2xl p-7 hover:shadow-lg transition-all">
                <div className="flex gap-0.5 mb-5">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-gray-600 leading-relaxed mb-6 text-sm">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{t.name.charAt(0)}</span>
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
      <section id="cennik" className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3">Cenník</p>
            <h2 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">Jednoduchá, transparentná cena</h2>
            <p className="text-gray-500 text-sm mb-4">Začnite zadarmo, upgradujte keď ste pripravení</p>
            {isBeta && (
              <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 text-sm font-medium px-4 py-2 rounded-full border border-amber-200">
                🎉 Počas beta verzie majú všetci používatelia Pro funkcie zadarmo!
              </div>
            )}
          </div>
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {[
              {
                name: isBeta ? 'Beta prístup' : 'Free', price: 'Zadarmo', period: '',
                desc: isBeta ? 'Pridajte sa ako prví adopteri' : 'Základné funkcie zadarmo',
                features: isBeta
                  ? ['Plné Pro funkcie', 'Neobmedzené projekty', 'Všetky kalkulačky', 'AI analýza', 'Prioritná podpora', 'Lifetime early adopter výhody']
                  : ['5 projektov', 'Základné kalkulačky', 'Cost Benchmark', 'Články'],
                cta: isBeta ? 'Pripojiť sa do beta' : 'Začať zadarmo', highlight: true, badge: isBeta ? 'Teraz dostupné' : 'Free'
              },
              {
                name: 'Pro', price: null, period: '/mesiac',
                desc: 'Profesionálne funkcie už čoskoro.',
                features: ['Neobmedzené projekty', 'Všetky kalkulačky', 'AI analýza', 'PDF export', 'Detailné benchmarky SK'],
                cta: 'Pripojiť sa k Waiting List', highlight: false, badge: 'Čoskoro'
              },
              {
                name: 'Enterprise', price: null, period: '',
                desc: 'Pre tímy a firmy.',
                features: ['Všetko z Pro', 'Tímová spolupráca', 'Bankové modely', 'API prístup', 'Dedikovaná podpora'],
                cta: 'Pripojiť sa k Waiting List', highlight: false, badge: 'Čoskoro'
              }
            ].map((plan, i) => (
              <div key={i} className={`rounded-2xl p-7 border relative ${
                plan.highlight
                  ? 'bg-indigo-600 border-indigo-600 shadow-xl shadow-indigo-100'
                  : 'bg-white border-slate-200'
              }`}>
                <div className="absolute -top-3 left-6">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    plan.highlight ? 'bg-white text-indigo-600' : 'bg-slate-100 text-slate-500'
                  }`}>{plan.badge}</span>
                </div>
                <div className={`text-xs font-semibold uppercase tracking-wider mb-2 mt-2 ${plan.highlight ? 'text-indigo-200' : 'text-slate-400'}`}>{plan.name}</div>
                {plan.price === null ? (
                  <div className="text-5xl font-bold mb-1 tracking-tight text-slate-300">Čoskoro</div>
                ) : (
                  <div className={`text-3xl font-bold mb-1 tracking-tight ${plan.highlight ? 'text-white' : 'text-slate-900'}`}>
                    {plan.price}<span className={`text-sm font-normal ml-1 ${plan.highlight ? 'text-indigo-200' : 'text-slate-400'}`}>{plan.period}</span>
                  </div>
                )}
                <div className={`text-sm mb-7 ${plan.highlight ? 'text-indigo-100' : 'text-slate-400'}`}>{plan.desc}</div>
                <ul className="space-y-2.5 mb-8">
                  {plan.features.map((f, j) => (
                    <li key={j} className={`flex items-center gap-2.5 text-sm ${plan.highlight ? 'text-white/90' : 'text-slate-600'}`}>
                      <Check className={`w-4 h-4 flex-shrink-0 ${plan.highlight ? 'text-indigo-200' : 'text-indigo-500'}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button onClick={handleLogin} className={`w-full py-2.5 font-semibold rounded-xl text-sm ${
                  plan.highlight ? 'bg-white text-indigo-600 hover:bg-indigo-50 shadow-lg' : plan.price === null ? 'bg-transparent text-slate-400 hover:text-slate-600 border-0 shadow-none' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`} variant={plan.price === null ? 'ghost' : 'default'}>
                  {plan.cta}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 bg-gray-50">
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
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ml-3 ${openFaq === i ? 'rotate-180' : ''}`} />
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
      <section className="py-20 bg-indigo-600 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">Pripravený na lepšie rozhodnutia?</h2>
          <p className="text-indigo-100 mb-8 leading-relaxed">Pripojte sa k developerom, ktorí rozhodujú na dátach, nie na odhadoch.</p>
          <Button onClick={handleLogin} className="bg-white text-indigo-600 hover:bg-indigo-50 px-7 py-3 text-sm font-bold rounded-xl shadow-lg">
            {isBeta ? 'Pripojiť sa do beta' : 'Začať zadarmo'} <ArrowRight className="w-4 h-4 ml-2 inline" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer id="kontakt" className="border-t border-gray-100 bg-white pt-14 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-2">
              <div className="mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 285 72" height="32">
                  <defs>
                    <filter id="shadow3" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#4F46E5" floodOpacity="0.22"/>
                    </filter>
                  </defs>
                  <g filter="url(#shadow3)">
                    <rect x="0" y="0" width="72" height="72" rx="20" fill="#4F46E5"/>
                    <rect x="0" y="0" width="72" height="36" rx="20" fill="white" opacity="0.04"/>
                    <path d="M36 18L55 32V54H17V32L36 18Z" stroke="white" strokeWidth="3" strokeLinejoin="round" fill="rgba(255,255,255,0.1)"/>
                    <rect x="30" y="41" width="12" height="13" rx="3" fill="white"/>
                    <rect x="43" y="31" width="6" height="6" rx="1.5" fill="white" opacity="0.55"/>
                  </g>
                  <text x="88" y="54" fontFamily="'Outfit', sans-serif" fontSize="52" fontWeight="900" letterSpacing="-2">
                    <tspan fill="#111118">stav</tspan><tspan fill="#4F46E5">ai</tspan>
                  </text>
                </svg>
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