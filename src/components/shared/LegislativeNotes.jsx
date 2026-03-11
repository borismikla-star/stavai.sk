import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Scale, AlertTriangle } from 'lucide-react';

const NOTES = [
  {
    category: 'DPH a dane z príjmu',
    items: [
      { title: 'DPH pri predaji bytov', text: 'Predaj novostavby (prvý prevod stavby) podlieha DPH 20%. Sociálne bývanie — byt ≤ 150 m², rodinný dom ≤ 300 m² — znížená sadzba 10%.', ref: '§ 38 zákona č. 222/2004 Zb. (zákon o DPH)' },
      { title: 'Daň z príjmu PO (s.r.o., a.s.)', text: 'Sadzba 21% zo základu dane. Možnosť odložiť daň pri reinvestícii, odpočty výdavkov súvisiacich s projektom.', ref: '§ 15 zákona č. 595/2003 Zb.' },
      { title: 'Daň z príjmu FO — podnikateľ', text: 'Obrat ≤ 100 000 €/rok: 15% paušálna sadzba. Nad 100 000 €: 19% do 38 553 € zdaniteľného základu, 25% nad túto hranicu.', ref: '§ 15 zákona č. 595/2003 Zb.' },
      { title: 'Odpočet DPH zo stavieb', text: 'Platiteľ DPH si môže odpočítať DPH zo vstupov (stavba, materiál). Pozor: pri predaji bytov FO (neplatiaci) odpočet nie je možný.', ref: '§ 49-51 zákona č. 222/2004 Zb.' },
    ],
  },
  {
    category: 'Stavebné konania (zákon 50/1976 + nový 200/2022)',
    items: [
      { title: 'Nový stavebný zákon (NSZ) — od 2027', text: 'Zákon č. 200/2022 Zb. zavádza integrované konanie (ÚK + SK spojené), digitalizáciu, nové lehoty. Povinnosť od 1.4.2027 pre väčšinu projektov.', ref: 'Zákon č. 200/2022 Zb.' },
      { title: 'Územné rozhodnutie (ÚR)', text: 'Vydáva stavebný úrad. Štandardná lehota 30 dní (jednoduchý prípad), 60 dní (zložitejší). EIA môže predĺžiť proces o 6–18 mesiacov.', ref: '§ 37–39 zákona č. 50/1976 Zb.' },
      { title: 'Stavebné povolenie (SP)', text: 'Platnosť 2 roky od vydania, možno predĺžiť o 2 roky. Podmienka: začatie stavby do 2 rokov. Kolaudačné rozhodnutie vydáva stavebný úrad.', ref: '§ 67, § 82 zákona č. 50/1976 Zb.' },
      { title: 'EIA (Hodnotenie vplyvov na ŽP)', text: 'Povinná pre projekty ≥ 200 bytových jednotiek alebo ≥ 10 000 m² GFA. Predlžuje proces o 6–24 mesiacov.', ref: 'Zákon č. 24/2006 Zb. (zákon o EIA)' },
    ],
  },
  {
    category: 'Bankové financovanie',
    items: [
      { title: 'DSCR — Debt Service Coverage Ratio', text: 'Banky štandardne vyžadujú DSCR ≥ 1.25 pre developerské úvery. Výpočet: prevádzkový zisk / ročné splátky dlhu. Nižší DSCR = vyššie riziko pre banku.', ref: 'Basel III, interné kritériá bánk SR' },
      { title: 'LTV (Loan-to-Value)', text: 'Maximálne 70–80% LTV pre developerský úver. Pri presale > 50% predaných jednotiek možná výnimka až 85% LTV. Hodnota zabezpečenia = trhová hodnota pozemku + stavieb.', ref: 'Smernica 2013/36/EU (CRD IV), NBS usmernenia' },
      { title: 'Presale požiadavky', text: 'Slovenské banky väčšinou vyžadujú min. 30–40% predpredaj (podpísané zmluvy o budúcej zmluve) pred uvoľnením developerskej linky.', ref: 'Interné kritériá bánk (SLSP, Tatra, UniCredit)' },
    ],
  },
];

export default function LegislativeNotes() {
  const [open, setOpen] = useState(null);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-3">
        <Scale className="w-4 h-4 text-blue-600 flex-shrink-0" />
        <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Relevantná legislatíva SK</span>
      </div>
      {NOTES.map((section, si) => (
        <div key={si} className="border border-gray-200 rounded-xl overflow-hidden">
          <button
            onClick={() => setOpen(open === si ? null : si)}
            className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors"
          >
            <span className="text-xs font-semibold text-gray-800">{section.category}</span>
            {open === si
              ? <ChevronDown className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              : <ChevronRight className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            }
          </button>
          {open === si && (
            <div className="border-t border-gray-100 divide-y divide-gray-50">
              {section.items.map((item, ii) => (
                <div key={ii} className="px-4 py-3 bg-gray-50/50">
                  <div className="text-xs font-semibold text-gray-800 mb-1">{item.title}</div>
                  <p className="text-xs text-gray-500 leading-relaxed mb-1">{item.text}</p>
                  <span className="text-[10px] text-blue-600 font-medium">{item.ref}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
      <div className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-xl p-3 mt-2">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
        <p className="text-[11px] text-amber-700 leading-relaxed">
          Informácie majú orientačný charakter. Pre záväzné stanoviská konzultujte s daňovým poradcom alebo advokátom.
        </p>
      </div>
    </div>
  );
}