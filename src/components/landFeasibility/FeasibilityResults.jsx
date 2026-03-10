import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, AlertCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import LandBalanceBlock from './LandBalanceBlock';
import { HelpCircle } from 'lucide-react';

const fmt = (n) => Math.round(n ?? 0).toLocaleString('sk-SK');

const SK = {
  land_balance_title: "Bilancia pozemku",
  lb_land_area: "Výmera pozemku",
  lb_building_footprint: "Zastavaná plocha",
  lb_roads: "Komunikácie / infraštruktúra",
  lb_paved: "Spevnené plochy",
  lb_green: "Zeleň na teréne",
  lb_total: "Celkom",
  lb_ok: "Bilancia OK",
  lb_exceeded: "Bilancia PREKROČENÁ",
  lb_unallocated: "Nealokovaná plocha",
  lb_infra_note: "Dopravná a technická infraštruktúra nie je predmetom detailného posúdenia v module Land Feasibility. Náklady na komunikácie a technické siete sa zohľadňujú v Development Calculator.",
  title: "Výstupy konceptu",
  sub_title: "Výstupy parcelácie",
  disclaimer: "Predbežný odhad – bez architektonickej štúdie",
  land_area: "Výmera pozemku",
  built_area: "Zastavaná plocha",
  hpp_above: "HPP nadzemné",
  effective_hpp_above: "Efektívne HPP nadzemné (po risk bufferi)",
  hpp_below: "HPP podzemné",
  npp_above: "ČPP nadzemné",
  npp_below: "ČPP podzemné",
  apartments_area: "Byty",
  non_residential_area: "Nebytové priestory",
  balconies_area: "Balkóny",
  front_gardens_area: "Predzáhradky",
  parking_covered: "Kryté parkovacie miesta",
  parking_outdoor: "Vonkajšie parkovacie miesta",
  paved_area: "Spevnené plochy (vr. vonkajšie parkovanie)",
  green_terrain: "Zeleň na teréne",
  green_on_structure: "Zeleň na konštrukcii",
  cellars_area: "Pivnice",
  apartment_count: "Odhad počtu bytov",
  development_area: "Rozvojová plocha (parcely)",
  roads_area: "Verejné komunikácie",
  public_green_area: "Verejná / spoločná zeleň",
  green_area: "Zeleň celkom (celý pozemok)",
  total_paved_area: "Spevnené plochy celkom (všetky parcely)",
  number_of_parcels: "Počet parciel",
  avg_parcel_size: "Priemerná výmera parcely",
  footprint_per_house: "Max. zastavaná plocha / dom",
  hpp_per_house: "HPP / dom",
  total_hpp: "Celkové HPP (hrubé)",
  effective_total_hpp: "Efektívne HPP (po risk bufferi)",
  total_built_footprint: "Celková zastavaná plocha",
  total_parking: "Celkové parkovacie miesta",
  m2: "m²",
  pcs: "ks",
  warnings: {
    cpp_exceeds_hpp: "ČPP presahuje HPP – skontrolujte KPP/podlažia.",
    green_below_minimum: "Zeleň na teréne je pod minimálnou požiadavkou.",
    parking_insufficient: "Parkovacích miest je nedostatok pre počet bytov.",
    coverage_too_high: "Max. zastavanosť parcely presahuje 50 % – skontrolujte miestne predpisy.",
    parcel_too_small: "Min. výmera parcely je pod 250 m².",
    no_parcels: "Výmera parcely alebo pozemku je príliš malá – žiadne stavebné parcely.",
    kpp_floors_mismatch: "Nesúlad KPP vs. podlažia >25 % – skontrolujte regulatívne vstupy.",
    apartments_area_clamped: "Plocha bytov je záporná – nastavená na 0. Skontrolujte vstupy.",
    coverage_capped_to_max: "Zastavanosť bola obmedzená na 50 % – typologická úprava prekročila limit.",
    effective_parcel_too_small: "Efektívna výmera parcely (po typologickej úprave) je pod 250 m².",
    green_negative_clamped: "Zeleň na teréne je záporná – nastavená na 0. Znížte spevnené plochy alebo IZ.",
    land_balance_exceeded: (v) => `Bilancia pozemku prekročená o ${v?.excess_m2 ?? '?'} m² (${v?.excess_pct ?? '?'}%). Znížte spevnené plochy alebo zastavanú plochu.`,
    land_unallocated: "Nealokovaná plocha pozemku – celková alokácia je menšia ako výmera pozemku.",
    parcel_balance_mismatch: "Nesúlad bilancie parcely – komponenty parcely sa nerovno priemernej výmere.",
  }
};

function Row({ label, value, unit, tooltip, bold, highlight }) {
  return (
    <div className={`flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0 ${bold ? 'font-semibold' : ''} ${highlight ? 'bg-blue-50 -mx-4 px-4 rounded' : ''}`}>
      <span className="flex items-center gap-1.5 text-xs text-gray-700">
        {label}
        {tooltip && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button type="button" className="text-muted-foreground hover:text-foreground">
                  <HelpCircle className="w-3.5 h-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs"><p className="text-xs">{tooltip}</p></TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </span>
      <span className={`text-xs font-medium tabular-nums ${bold ? 'text-blue-700' : 'text-gray-900'}`}>
        {value} {unit}
      </span>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 mt-4 first:mt-0">{title}</div>
      {children}
    </div>
  );
}

export default function FeasibilityResults({ results }) {
  if (!results) return null;

  const t = SK;
  const isSubdivision = results.mode === 'subdivision';

  const warnings = results.validations?.filter(v => v.type === 'warning') || [];
  const errors = results.validations?.filter(v => v.type === 'error') || [];

  return (
    <div className="space-y-4">
      {/* Warnings */}
      {(errors.length > 0 || warnings.length > 0) && (
        <div className="space-y-2">
          {errors.map((e, i) => (
            <div key={i} className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-800">
              <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0 text-red-600" />
              <span>{typeof t.warnings[e.key] === 'function' ? t.warnings[e.key](e) : (t.warnings[e.key] || e.key)}</span>
            </div>
          ))}
          {warnings.map((w, i) => (
            <div key={i} className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
              <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0 text-amber-500" />
              <span>{typeof t.warnings[w.key] === 'function' ? t.warnings[w.key](w) : (t.warnings[w.key] || w.key)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Land Balance */}
      <LandBalanceBlock balance={results.land_balance} t={t} />

      {/* Results Card */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">{isSubdivision ? t.sub_title : t.title}</CardTitle>
            <Badge variant="outline" className="text-xs text-muted-foreground">{t.disclaimer}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {!isSubdivision ? (
            <>
              <Section title="Plošná bilancia">
                <Row label={t.land_area} value={fmt(results.land_area)} unit={t.m2} />
                <Row label={t.built_area} value={fmt(results.built_area)} unit={t.m2} />
                <Row label={t.paved_area} value={fmt(results.paved_area)} unit={t.m2} />
                <Row label={t.green_terrain} value={fmt(results.green_terrain)} unit={t.m2} />
                {results.green_on_structure_area > 0 && <Row label={t.green_on_structure} value={fmt(results.green_on_structure_area)} unit={t.m2} />}
              </Section>
              <Section title="Hrubá podlažná plocha">
                <Row label={t.hpp_above} value={fmt(results.hpp_above)} unit={t.m2} />
                <Row label={t.effective_hpp_above} value={fmt(results.effective_hpp_above)} unit={t.m2} bold highlight />
                <Row label={t.hpp_below} value={fmt(results.hpp_below)} unit={t.m2} />
              </Section>
              <Section title="Čistá podlažná plocha">
                <Row label={t.npp_above} value={fmt(results.npp_above)} unit={t.m2} bold />
                <Row label={t.apartments_area} value={fmt(results.apartments_area)} unit={t.m2} />
                <Row label={t.non_residential_area} value={fmt(results.non_residential_area)} unit={t.m2} />
                <Row label={t.balconies_area} value={fmt(results.balconies_area)} unit={t.m2} />
                <Row label={t.front_gardens_area} value={fmt(results.front_gardens_area)} unit={t.m2} />
                <Row label={t.npp_below} value={fmt(results.npp_below)} unit={t.m2} />
                <Row label={t.cellars_area} value={fmt(results.cellars_area)} unit={t.m2} />
              </Section>
              <Section title="Byty & parkovanie">
                <Row label={t.apartment_count} value={fmt(results.apartment_count)} unit={t.pcs} bold />
                <Row label={t.parking_covered} value={fmt(results.parking_covered)} unit={t.pcs} />
                <Row label={t.parking_outdoor} value={fmt(results.parking_outdoor)} unit={t.pcs} />
              </Section>
            </>
          ) : (
            <>
              <Section title="Plošná bilancia">
                <Row label={t.land_area} value={fmt(results.land_area)} unit={t.m2} />
                <Row label={t.development_area} value={fmt(results.development_area)} unit={t.m2} bold />
                <Row label={t.roads_area} value={fmt(results.roads_area)} unit={t.m2} />
                <Row label={t.public_green_area} value={fmt(results.public_green_area)} unit={t.m2} />
                <Row label={t.green_area} value={fmt(results.green_area)} unit={t.m2} />
                <Row label={t.total_paved_area} value={fmt(results.total_paved_area)} unit={t.m2} />
                <Row label={t.total_built_footprint} value={fmt(results.total_built_footprint)} unit={t.m2} />
              </Section>
              <Section title="Parcely">
                <Row label={t.number_of_parcels} value={fmt(results.number_of_parcels)} unit={t.pcs} bold highlight />
                <Row label={t.avg_parcel_size} value={fmt(results.avg_parcel_size)} unit={t.m2} />
                <Row label={t.footprint_per_house} value={fmt(results.footprint_per_house)} unit={t.m2} />
                <Row label={t.hpp_per_house} value={fmt(results.hpp_per_house)} unit={t.m2} />
              </Section>
              <Section title="HPP & parkovanie">
                <Row label={t.total_hpp} value={fmt(results.total_hpp)} unit={t.m2} />
                <Row label={t.effective_total_hpp} value={fmt(results.effective_total_hpp)} unit={t.m2} bold highlight />
                <Row label={t.total_parking} value={fmt(results.total_parking)} unit={t.pcs} />
              </Section>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}