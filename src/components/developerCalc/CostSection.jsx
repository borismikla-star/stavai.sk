import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

const fmt = (n) => n > 0 ? `€ ${Math.round(n).toLocaleString('sk-SK')}` : '—';
const n = (v) => { const p = Number(v); return isNaN(p) ? 0 : p; };

function CostRow({ label, field, data, onChange, calcValue, area, areaLabel, unitLabel = '€/m²', isManual, manualToggle }) {
  const manual = data[`${field}_manual`];

  const handleToggle = (val) => {
    const updated = { ...data, [`${field}_manual`]: val };
    if (!val) delete updated[`${field}_manual_value`];
    else updated[`${field}_manual_value`] = Math.round(calcValue);
    onChange(updated);
  };

  return (
    <div className="grid grid-cols-12 gap-2 items-center py-2 border-b border-gray-100 last:border-0">
      <div className="col-span-4 text-xs text-gray-600">{label}</div>
      {!manual ? (
        <>
          <div className="col-span-3">
            <div className="text-xs text-gray-400 mb-0.5">{areaLabel || 'Plocha'}</div>
            <div className="text-xs font-medium">{area > 0 ? `${Math.round(area).toLocaleString('sk-SK')} m²` : '—'}</div>
          </div>
          <div className="col-span-3">
            <div className="text-xs text-gray-400 mb-0.5">{unitLabel}</div>
            <Input
              type="number"
              value={data[`${field}_unit_price`] ?? ''}
              onChange={e => onChange({ ...data, [`${field}_unit_price`]: e.target.value === '' ? '' : Number(e.target.value) })}
              className="h-7 text-xs"
            />
          </div>
        </>
      ) : (
        <div className="col-span-6">
          <div className="text-xs text-gray-400 mb-0.5">Suma (€)</div>
          <Input
            type="number"
            value={data[`${field}_manual_value`] ?? ''}
            onChange={e => onChange({ ...data, [`${field}_manual_value`]: e.target.value === '' ? '' : Number(e.target.value) })}
            className="h-7 text-xs"
          />
        </div>
      )}
      <div className="col-span-1 flex justify-center">
        <Switch checked={!!manual} onCheckedChange={handleToggle} className="scale-75" />
      </div>
      <div className="col-span-1 text-right text-xs font-semibold text-blue-700">{fmt(calcValue)}</div>
    </div>
  );
}

function AutoRow({ label, field, data, onChange, calcValue, defaultPct }) {
  const manual = data[`${field}_manual`];
  const handleToggle = (val) => {
    const updated = { ...data, [`${field}_manual`]: val };
    if (val) updated[`${field}_manual_value`] = Math.round(calcValue);
    onChange(updated);
  };
  return (
    <div className="grid grid-cols-12 gap-2 items-center py-2 border-b border-gray-100 last:border-0">
      <div className="col-span-5 text-xs text-gray-600">{label} <span className="text-gray-400">({defaultPct})</span></div>
      <div className="col-span-4">
        {manual && (
          <Input
            type="number"
            value={data[`${field}_manual_value`] ?? ''}
            onChange={e => onChange({ ...data, [`${field}_manual_value`]: e.target.value === '' ? '' : Number(e.target.value) })}
            className="h-7 text-xs"
          />
        )}
      </div>
      <div className="col-span-1 flex justify-center">
        <Switch checked={!!manual} onCheckedChange={handleToggle} className="scale-75" />
      </div>
      <div className="col-span-2 text-right text-xs font-semibold text-blue-700">{fmt(calcValue)}</div>
    </div>
  );
}

export default function CostSection({ data, projectData, results, onChange }) {
  const r = results || {};
  const pd = projectData || {};

  return (
    <div className="space-y-4">
      {/* Land & Project */}
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">1. Pozemok a projekt</CardTitle></CardHeader>
        <CardContent>
          <div>
            <Label className="text-xs text-gray-500 mb-1 block">Pozemok a projekt (€)</Label>
            <Input
              type="number"
              value={data.land_and_project ?? ''}
              onChange={e => onChange({ ...data, land_and_project: e.target.value === '' ? '' : Number(e.target.value) })}
              className="h-9 text-sm"
            />
          </div>
        </CardContent>
      </Card>

      {/* Implementation */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">2. Realizácia</CardTitle>
            <Badge variant="outline" className="text-xs">Auto / Manuál</Badge>
          </div>
        </CardHeader>
        <CardContent className="text-xs">
          <div className="grid grid-cols-12 gap-2 pb-2 border-b text-gray-400 text-xs">
            <div className="col-span-4">Položka</div>
            <div className="col-span-3">Plocha</div>
            <div className="col-span-3">Jed. cena</div>
            <div className="col-span-1 text-center">M</div>
            <div className="col-span-1 text-right">Výsledok</div>
          </div>
          <CostRow label="Nadzemné podlažia" field="above_ground" data={data} onChange={onChange} calcValue={r.aboveGroundCost || 0} area={n(pd.gfa_above)} />
          <CostRow label="Podzemné podlažia" field="below_ground" data={data} onChange={onChange} calcValue={r.belowGroundCost || 0} area={n(pd.gfa_below)} />
          <CostRow label="Spevnené plochy" field="outdoor_areas" data={data} onChange={onChange} calcValue={r.outdoorAreasCost || 0} area={n(pd.paved_areas)} />
          <CostRow label="Zeleň na teréne" field="greenery_terrain" data={data} onChange={onChange} calcValue={r.greeneryTerrainCost || 0} area={n(pd.green_areas_terrain)} />
          <CostRow label="Zeleň na konštrukcii" field="greenery_structure" data={data} onChange={onChange} calcValue={r.greeneryStructureCost || 0} area={n(pd.green_areas_structure)} />
          <AutoRow label="Inžinierske siete" field="engineering_networks" data={data} onChange={onChange} calcValue={r.engineeringNetworks || 0} defaultPct="4% z 2.1-2.5" />
          <div className="flex justify-between pt-2 text-xs font-bold text-gray-900">
            <span>Realizácia spolu</span>
            <span>{fmt(r.totalImplementation || 0)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Additional budget */}
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">3. Doplnkový rozpočet</CardTitle></CardHeader>
        <CardContent>
          <AutoRow label="Riadenie projektu" field="project_management" data={data} onChange={onChange} calcValue={r.projectManagement || 0} defaultPct="3,5%" />
          <AutoRow label="Zariadenie staveniska" field="site_equipment" data={data} onChange={onChange} calcValue={r.siteEquipment || 0} defaultPct="3%" />
          <AutoRow label="Projektová činnosť" field="project_activity" data={data} onChange={onChange} calcValue={r.projectActivity || 0} defaultPct="3,5%" />
          <AutoRow label="Inžinierska činnosť" field="engineering_activity" data={data} onChange={onChange} calcValue={r.engineeringActivity || 0} defaultPct="1%" />
          <AutoRow label="Technický dozor" field="technical_supervision" data={data} onChange={onChange} calcValue={r.technicalSupervision || 0} defaultPct="1,5%" />
          <div className="flex justify-between pt-2 text-xs font-bold text-gray-900">
            <span>Doplnkový rozpočet spolu</span>
            <span>{fmt(r.totalAdditionalBudget || 0)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Other services */}
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">4. Ostatné služby & rezerva</CardTitle></CardHeader>
        <CardContent>
          <AutoRow label="Právne služby" field="legal_services" data={data} onChange={onChange} calcValue={r.legalServices || 0} defaultPct="0,5% real." />
          <div className="py-2 border-b border-gray-100">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-600">Developerský poplatok</span>
              <span className="text-xs font-semibold text-blue-700">{fmt(r.developmentFee || 0)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Label className="text-xs text-gray-400">€/m² pred. plochy</Label>
              <Input type="number" value={data.development_fee_per_m2 ?? ''} onChange={e => onChange({ ...data, development_fee_per_m2: e.target.value === '' ? '' : Number(e.target.value) })} className="h-7 text-xs w-24" />
            </div>
          </div>
          <AutoRow label="Ostatné poplatky" field="other_fees" data={data} onChange={onChange} calcValue={r.otherFees || 0} defaultPct="1% real." />
          <AutoRow label="Predaj (provízia)" field="sales_costs" data={data} onChange={onChange} calcValue={r.salesCosts || 0} defaultPct="2% tržieb" />
          <AutoRow label="Marketing" field="marketing_costs" data={data} onChange={onChange} calcValue={r.marketingCosts || 0} defaultPct="0,8% tržieb" />
          <AutoRow label="Rezerva" field="reserve" data={data} onChange={onChange} calcValue={r.reserve || 0} defaultPct="5% real." />
        </CardContent>
      </Card>
    </div>
  );
}