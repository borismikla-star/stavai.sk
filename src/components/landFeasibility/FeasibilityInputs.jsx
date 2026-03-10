import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ChevronDown, ChevronUp } from 'lucide-react';
import InfoTooltip from '../shared/InfoTooltip';

const t = {
  title: "Vstupné údaje pozemku",
  land_area: "Celková výmera pozemku (m²)",
  iz: "Index zastavanosti (IZ) napr. 0,40",
  kpp: "KPP (koeficient podlažných plôch) — alebo prázdne",
  floors: "Počet nadzemných podlaží — alebo prázdne",
  kpp_hint: "Ak je zadaný KPP, počet podlaží sa ignoruje.",
  project_type: "Typ projektu",
  building: "Bytová výstavba",
  subdivision: "Parcelácia / Rodinné domy",
  non_res_pct: "Nebytové priestory % (0–100)",
  min_green_pct: "Min. % zelene na teréne",
  avg_apt: "Priemerná výmera bytu (m²)",
  mode: "Režim výpočtu",
  conservative: "Konzervatívny (72%)",
  realistic: "Realistický (75%)",
  efficient: "Efektívny (80%)",
  green_on_structure: "Zeleň na konštrukcii",
  sub_title: "Parametre parcelácie",
  public_roads_pct: "Verejné komunikácie / infraštruktúra (%)",
  green_pct: "Min. výmera zelene na pozemku (%)",
  paved_pct_house: "Spevnené plochy / parcela (%)",
  min_parcel_size: "Min. výmera parcely (m²)",
  max_plot_coverage: "Max. zastavanosť parcely (%)",
  floors_per_house: "Počet podlaží (dom)",
  kpp_house: "KPP / parcelu — alebo prázdne",
  kpp_house_hint: "Ak je zadaný KPP, počet podlaží sa ignoruje.",
  typology: "Typológia domu",
  detached: "Samostatne stojaci",
  semi: "Dvojdom",
  row: "Radový dom",
  risk_buffer_pct: "Efektivita návrhu stavby (%)",
  parking_per_house: "Parkovanie / dom",
  advanced_title: "Pokročilé predpoklady",
  parking_ratio: "Kryté parkovanie / byt",
  outdoor_ratio: "Vonkajšie parkovanie / byt",
  paved_pct: "Spevnené plochy (% pozemku)",
  urban_risk_buffer: "Urban risk buffer (%)",
  advanced_hint: "Znižuje HPP o regulatívnu/projektovú neistotu",
};

const tooltips = {
  land_area: "Celková výmera pozemku v m² podľa katastra nehnuteľností.",
  iz: "Podiel zastavanej plochy k celkovej výmere pozemku. Napr. IZ 0,40 znamená, že 40 % pozemku môže byť zastavané.",
  kpp: "Koeficient podlažných plôch voči výmere pozemku. Ak je zadaný, prepíše výpočet podlaží × IZ.",
  floors: "Počet nadzemných podlaží. Slúži na odhad HPP ako zastavená plocha × podlažia.",
  non_res_pct: "Podiel čistej úžitkovej plochy určenej na nebytové využitie (obchod, kancelárie).",
  min_green_pct: "Minimálny podiel plochy pozemku, ktorý musí zostať ako nezastavená zeleň na teréne.",
  avg_apt: "Priemerná úžitková plocha jednej bytovej jednotky. Ovplyvňuje odhadovaný počet bytov.",
  mode: "Koeficient efektivity (čistá úžitková / hrubá podlažná plocha): Konzervatívny 72 %, Realistický 75 %, Efektívny 80 %.",
  urban_risk_buffer: "Redukcia hrubej podlažnej plochy zohľadňujúca regulatívne obmedzenia a projektové riziká.",
};

function NumericInput({ label, value, onChange, step = 1, min, tooltip, hint }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1.5">
        <Label className="text-xs font-medium text-gray-700">{label}</Label>
        {tooltip && <InfoTooltip content={tooltip} />}
      </div>
      <Input
        type="number"
        step={step}
        min={min}
        value={value ?? ''}
        onChange={e => {
          const val = e.target.value === '' ? null : Number(e.target.value);
          onChange(val);
        }}
        className="h-9 text-sm"
      />
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export default function FeasibilityInputs({ inputs, onChange }) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const set = (key, value) => onChange({ ...inputs, [key]: value });

  const isSubdivision = inputs.project_type === 'subdivision';

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">{t.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <NumericInput label={t.land_area} value={inputs.land_area} onChange={v => set('land_area', v)} step={10} min={0} tooltip={tooltips.land_area} />

          {/* Project type */}
          <div className="space-y-1">
            <Label className="text-xs font-medium text-gray-700">{t.project_type}</Label>
            <Select value={inputs.project_type} onValueChange={v => set('project_type', v)}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="building">{t.building}</SelectItem>
                <SelectItem value="subdivision">{t.subdivision}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {!isSubdivision && (
            <>
              <NumericInput label={t.iz} value={inputs.iz} onChange={v => set('iz', v)} step={0.01} min={0} tooltip={tooltips.iz} />
              <NumericInput label={t.kpp} value={inputs.kpp} onChange={v => set('kpp', v)} step={0.1} min={0} tooltip={tooltips.kpp} hint={t.kpp_hint} />
              <NumericInput label={t.floors} value={inputs.floors} onChange={v => set('floors', v)} step={1} min={0} tooltip={tooltips.floors} />
              <NumericInput label={t.non_res_pct} value={inputs.non_residential_pct} onChange={v => set('non_residential_pct', v)} step={1} min={0} tooltip={tooltips.non_res_pct} />
              <NumericInput label={t.min_green_pct} value={inputs.min_green_pct != null ? Math.round(inputs.min_green_pct * 100) : ''} onChange={v => set('min_green_pct', v != null ? v / 100 : null)} step={1} min={0} tooltip={tooltips.min_green_pct} />
              <NumericInput label={t.avg_apt} value={inputs.avg_apartment_size} onChange={v => set('avg_apartment_size', v)} step={1} min={1} tooltip={tooltips.avg_apt} />

              {/* Mode */}
              <div className="space-y-1">
                <Label className="text-xs font-medium text-gray-700">{t.mode}</Label>
                <Select value={inputs.mode} onValueChange={v => set('mode', v)}>
                  <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="conservative">{t.conservative}</SelectItem>
                    <SelectItem value="realistic">{t.realistic}</SelectItem>
                    <SelectItem value="efficient">{t.efficient}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Green on structure */}
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium text-gray-700">{t.green_on_structure}</Label>
                <Switch checked={!!inputs.green_on_structure} onCheckedChange={v => set('green_on_structure', v)} />
              </div>

              {/* Advanced toggle */}
              <button
                type="button"
                className="flex items-center gap-1.5 text-xs text-blue-600 font-medium mt-2"
                onClick={() => setShowAdvanced(!showAdvanced)}
              >
                {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                {t.advanced_title}
              </button>

              {showAdvanced && (
                <div className="space-y-4 pt-2 border-t">
                  <p className="text-xs text-muted-foreground">{t.advanced_hint}</p>
                  <NumericInput label={t.parking_ratio} value={inputs.parking_ratio} onChange={v => set('parking_ratio', v)} step={0.1} min={0} tooltip={tooltips.urban_risk_buffer} />
                  <NumericInput label={t.outdoor_ratio} value={inputs.outdoor_ratio} onChange={v => set('outdoor_ratio', v)} step={0.1} min={0} />
                  <NumericInput label={t.paved_pct} value={inputs.paved_pct != null ? Math.round(inputs.paved_pct * 100) : ''} onChange={v => set('paved_pct', v != null ? v / 100 : null)} step={1} min={0} />
                  <NumericInput label={t.urban_risk_buffer} value={inputs.urban_risk_buffer != null ? Math.round(inputs.urban_risk_buffer * 100) : ''} onChange={v => set('urban_risk_buffer', v != null ? v / 100 : null)} step={1} min={0} tooltip={tooltips.urban_risk_buffer} />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Subdivision params */}
      {isSubdivision && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">{t.sub_title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <NumericInput label={t.public_roads_pct} value={inputs.public_roads_pct != null ? Math.round(inputs.public_roads_pct * 100) : ''} onChange={v => set('public_roads_pct', v != null ? v / 100 : null)} step={1} min={0} />
            <NumericInput label={t.green_pct} value={inputs.green_pct != null ? Math.round(inputs.green_pct * 100) : ''} onChange={v => set('green_pct', v != null ? v / 100 : null)} step={1} min={0} />
            <NumericInput label={t.paved_pct_house} value={inputs.paved_pct_house != null ? Math.round(inputs.paved_pct_house * 100) : ''} onChange={v => set('paved_pct_house', v != null ? v / 100 : null)} step={1} min={0} />
            <NumericInput label={t.min_parcel_size} value={inputs.min_parcel_size} onChange={v => set('min_parcel_size', v)} step={10} min={50} />
            <NumericInput label={t.max_plot_coverage} value={inputs.max_plot_coverage != null ? Math.round(inputs.max_plot_coverage * 100) : ''} onChange={v => set('max_plot_coverage', v != null ? v / 100 : null)} step={1} min={0} />
            <NumericInput label={t.floors_per_house} value={inputs.floors_per_house} onChange={v => set('floors_per_house', v)} step={1} min={1} />
            <NumericInput label={t.kpp_house} value={inputs.kpp_house} onChange={v => set('kpp_house', v)} step={0.1} min={0} hint={t.kpp_house_hint} />

            {/* Typology */}
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-700">{t.typology}</Label>
              <Select value={inputs.typology} onValueChange={v => set('typology', v)}>
                <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="detached">{t.detached}</SelectItem>
                  <SelectItem value="semi">{t.semi}</SelectItem>
                  <SelectItem value="row">{t.row}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <NumericInput label={t.risk_buffer_pct} value={inputs.risk_buffer_pct != null ? Math.round(inputs.risk_buffer_pct * 100) : ''} onChange={v => set('risk_buffer_pct', v != null ? v / 100 : null)} step={1} min={0} />
            <NumericInput label={t.parking_per_house} value={inputs.parking_per_house} onChange={v => set('parking_per_house', v)} step={1} min={0} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}