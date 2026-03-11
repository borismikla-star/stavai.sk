import React from 'react';
import { Check, X, Zap, Building2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const PLANS = [
  {
    name: 'Free',
    price: '0 €',
    period: '/mesiac',
    desc: 'Pre začiatok a orientáciu',
    highlight: false,
    cta: 'Začať zadarmo',
    ctaVariant: 'outline',
  },
  {
    name: 'Pro',
    price: '79 €',
    period: '/mesiac',
    desc: 'Pre profesionálnych developerov',
    highlight: true,
    badge: 'Najpopulárnejší',
    cta: 'Vyskúšať Pro',
  },
  {
    name: 'Enterprise',
    price: 'Na mieru',
    period: '',
    desc: 'Pre developerské tímy',
    highlight: false,
    cta: 'Kontaktovať',
    ctaVariant: 'outline',
  },
];

const FEATURES = [
  { category: 'Nástroje', items: [
    { label: 'Cost Benchmark', free: true, pro: true, ent: true },
    { label: 'Odborné články', free: true, pro: true, ent: true },
    { label: 'Orientačná ROI kalkulačka', free: true, pro: true, ent: true },
    { label: 'Developer Kalkulačka (plná)', free: false, pro: true, ent: true },
    { label: 'Land Feasibility Analyzer', free: false, pro: true, ent: true },
    { label: 'Harmonogram Povolení', free: false, pro: true, ent: true },
    { label: 'Sensitivity Engine', free: false, pro: true, ent: true },
  ]},
  { category: 'Analýzy', items: [
    { label: 'AI Sumarizácia projektu', free: false, pro: true, ent: true },
    { label: 'Monte Carlo simulácia (1 000×)', free: false, pro: true, ent: true },
    { label: 'Scenárová analýza (3 scenáre)', free: false, pro: true, ent: true },
    { label: 'Benchmark porovnanie', free: false, pro: true, ent: true },
    { label: 'Predajný plán s cashflow', free: false, pro: true, ent: true },
  ]},
  { category: 'Export & reporty', items: [
    { label: 'PDF export (bankový formát)', free: false, pro: true, ent: true },
    { label: 'Ukladanie projektov', free: '3 projekty', pro: 'Neobmedzene', ent: 'Neobmedzene' },
    { label: 'Šablóny projektov', free: false, pro: true, ent: true },
    { label: 'Portfólio prehľad', free: false, pro: true, ent: true },
  ]},
  { category: 'Enterprise', items: [
    { label: 'Viac používateľov / tím', free: false, pro: false, ent: true },
    { label: 'API prístup', free: false, pro: false, ent: true },
    { label: 'Dedikovaná podpora', free: false, pro: false, ent: true },
    { label: 'Bankové šablóny na mieru', free: false, pro: false, ent: true },
    { label: 'Onboarding a školenie', free: false, pro: false, ent: true },
  ]},
];

function FeatureCell({ value }) {
  if (value === true) return <Check className="w-4 h-4 text-emerald-500 mx-auto" />;
  if (value === false) return <X className="w-4 h-4 text-gray-300 mx-auto" />;
  return <span className="text-xs text-gray-600">{value}</span>;
}

export default function Pricing() {
  const handleCta = (plan) => {
    if (plan.name === 'Enterprise') {
      window.location.href = 'mailto:info@stavai.sk?subject=Enterprise plán';
    } else {
      base44.auth.redirectToLogin(createPageUrl('Dashboard'));
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back */}
      <Link to={createPageUrl('Dashboard')} className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 mb-8 transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" /> Späť na Dashboard
      </Link>

      {/* Header */}
      <div className="text-center mb-12">
        <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3">Cenník</p>
        <h1 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">Vyberte si plán</h1>
        <p className="text-gray-500 text-sm">Začnite zadarmo · Upgradujte kedykoľvek · Bez viazanosti</p>
      </div>

      {/* Plan cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-16">
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-2xl border p-7 relative ${
              plan.highlight
                ? 'border-blue-500 shadow-xl shadow-blue-50 bg-white'
                : 'border-gray-200 bg-white'
            }`}
          >
            {plan.badge && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                  <Zap className="w-3 h-3" />{plan.badge}
                </span>
              </div>
            )}
            <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">{plan.name}</div>
            <div className="text-3xl font-bold text-gray-900 tracking-tight mb-1">
              {plan.price}
              {plan.period && <span className="text-sm font-normal text-gray-400 ml-1">{plan.period}</span>}
            </div>
            <div className="text-sm text-gray-400 mb-7">{plan.desc}</div>
            <Button
              onClick={() => handleCta(plan)}
              className={`w-full font-semibold rounded-xl text-sm py-2.5 ${
                plan.highlight
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-900 hover:bg-gray-800 text-white'
              }`}
            >
              {plan.cta}
            </Button>
          </div>
        ))}
      </div>

      {/* Feature comparison table */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Porovnanie plánov</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide w-1/2">Funkcia</th>
                {PLANS.map(p => (
                  <th key={p.name} className={`px-4 py-3 text-center text-xs font-bold ${p.highlight ? 'text-blue-600' : 'text-gray-600'}`}>
                    {p.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FEATURES.map((section) => (
                <React.Fragment key={section.category}>
                  <tr className="bg-gray-50/70">
                    <td colSpan={4} className="px-6 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      {section.category}
                    </td>
                  </tr>
                  {section.items.map((item, i) => (
                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/40 transition-colors">
                      <td className="px-6 py-3 text-sm text-gray-700">{item.label}</td>
                      <td className="px-4 py-3 text-center"><FeatureCell value={item.free} /></td>
                      <td className="px-4 py-3 text-center bg-blue-50/30"><FeatureCell value={item.pro} /></td>
                      <td className="px-4 py-3 text-center"><FeatureCell value={item.ent} /></td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CTA bottom */}
      <div className="mt-10 text-center bg-blue-600 rounded-2xl p-10">
        <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Pripravený na lepšie rozhodnutia?</h3>
        <p className="text-blue-100 text-sm mb-6">Pripojte sa k developerom, ktorí rozhodujú na dátach.</p>
        <Button
          onClick={() => base44.auth.redirectToLogin(createPageUrl('Dashboard'))}
          className="bg-white text-blue-600 hover:bg-blue-50 font-bold px-8 py-2.5 rounded-xl text-sm"
        >
          Začať zadarmo →
        </Button>
      </div>
    </div>
  );
}