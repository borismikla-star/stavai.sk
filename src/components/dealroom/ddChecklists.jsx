// Due Diligence checklisty podľa property_type

export const DD_CHECKLISTS = {
  land: [
    { id: 'lv', label: 'List vlastníctva (LV)', description: 'Výpis z katastra — nie starší ako 30 dní.', required: true },
    { id: 'upi', label: 'Územnoplánovacia informácia (ÚPI)', description: 'Vydáva príslušný stavebný úrad. Definuje funkčné využitie, koeficienty zastavanosti.', required: true },
    { id: 'katastralna_mapa', label: 'Katastrálna mapa', description: 'Prehľad parcely v kontexte okolia, hranice pozemku, prístupové komunikácie.', required: true },
    { id: 'foto', label: 'Fotodokumentácia + situačná mapa', description: 'Min. 10 fotografií pozemku, prístupu, okolia.', required: true },
    { id: 'geom_plan', label: 'Geometrický plán', description: 'Povinné ak je pozemok rozdelený alebo zlúčený.', required: false },
    { id: 'napojenie_is', label: 'Stanovisko o napojení na IS', description: 'Vyjadrenia správcov sietí (voda, kanalizácia, elektrika, plyn).', required: false },
    { id: 'geo_prieskum', label: 'Inžiniersko-geologický prieskum', description: 'Nosnosť pôdy, hladina spodnej vody, radon.', required: false },
    { id: 'studia', label: 'Štúdia zástavnosti / ÚR', description: 'Ak existuje územné rozhodnutie alebo architektonická štúdia.', required: false },
  ],
  development: [
    { id: 'lv', label: 'List vlastníctva pozemku', description: 'LV pozemku + príp. LV rozostavanej stavby. Nie starší ako 30 dní.', required: true },
    { id: 'sp', label: 'Stavebné povolenie (SP)', description: 'Overenie platnosti (2 roky od vydania). Musí byť právoplatné a vykonateľné.', required: true },
    { id: 'ur', label: 'Územné rozhodnutie (ÚR)', description: 'Ak je projekt vo fáze pred SP — ÚR je kľúčový dokument.', required: true },
    { id: 'pd', label: 'Projektová dokumentácia (PD)', description: 'Min. situácia + pôdorysy všetkých podlaží. Ideálne DUR alebo DSP stupeň.', required: true },
    { id: 'financny_model', label: 'Finančný model projektu', description: 'Cashflow, náklady, tržby, IRR. Môže byť export z Developer Kalkulačky stavai.sk.', required: true },
    { id: 'zod', label: 'Zmluva o dielo (ZoD)', description: 'S generálnym dodávateľom — cena, harmonogram, záruky, penále.', required: false },
    { id: 'dotknuty_organy', label: 'Vyjadrenia dotknutých orgánov', description: 'EIA, pamiatky, správcovia IS, záchranná služba.', required: false },
    { id: 'harmonogram', label: 'Harmonogram výstavby', description: 'Gantt alebo tabuľka míľnikov.', required: false },
    { id: 'presale', label: 'Zmluvy o predpredaji (presale)', description: 'Rezervačné zmluvy / zmluvy o budúcej zmluve.', required: false },
    { id: 'poistenie', label: 'Poistenie staveniska', description: 'Ak výstavba prebieha — poistná zmluva.', required: false },
  ],
  residential: [
    { id: 'lv', label: 'List vlastníctva (LV)', description: 'Výpis z katastra — vlastník, ťarchy, záložné práva. Nie starší ako 30 dní.', required: true },
    { id: 'energeticky_cert', label: 'Energetický certifikát', description: 'Povinný zo zákona od 2013. Bez neho nie je možný predaj.', required: true },
    { id: 'kolaudacne', label: 'Kolaudačné rozhodnutie', description: 'Doklad o legálnosti stavby.', required: true },
    { id: 'spravca_nedoplatky', label: 'Potvrdenie správcu — nedoplatky', description: 'Potvrdenie správcu bytového domu o neexistencii dlhov.', required: true },
    { id: 'foto', label: 'Fotodokumentácia', description: 'Min. 10 fotografií všetkých miestností, spoločných priestorov, fasády.', required: true },
    { id: 'revizia_elektro', label: 'Revízna správa elektroinštalácie', description: 'Platnosť 5 rokov pre byt, 3 roky pre dom.', required: false },
    { id: 'revizia_plyn', label: 'Revízna správa plynu / komína', description: 'Ak je v nehnuteľnosti plynový kotol alebo komín.', required: false },
  ],
  commercial: [
    { id: 'lv', label: 'List vlastníctva (LV)', description: 'Výpis z katastra. Nie starší ako 30 dní.', required: true },
    { id: 'najomne_zmluvy', label: 'Nájomné zmluvy (všetky aktívne)', description: 'Kompletné nájomné zmluvy so všetkými dodatkami.', required: true },
    { id: 'wault', label: 'Prehľad WAULT', description: 'Weighted Average Unexpired Lease Term.', required: true },
    { id: 'noi', label: 'NOI za posledné 2 roky', description: 'Čistý prevádzkový výnos (nájomné − prevádzkové náklady).', required: true },
    { id: 'energeticky_cert', label: 'Energetický certifikát', description: 'Trieda energetickej hospodárnosti budovy.', required: false },
    { id: 'technicka_sprava', label: 'Technická správa budovy', description: 'Stav strechy, fasády, technických zariadení.', required: false },
    { id: 'pojistenie', label: 'Poistná zmluva budovy', description: 'Poistenie nehnuteľnosti a zodpovednosti.', required: false },
  ],
};

export function getChecklist(propertyType) {
  return DD_CHECKLISTS[propertyType] || DD_CHECKLISTS['residential'];
}

// Check if all required items are uploaded or waived
export function isChecklistComplete(checklist, ddItems) {
  return checklist
    .filter(item => item.required)
    .every(item => {
      const found = (ddItems || []).find(d => d.checklist_id === item.id);
      return found && (found.status === 'uploaded' || found.status === 'waived');
    });
}