import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import VatInputBanner from '../shared/VatInputBanner';

const fmt = (n) => n > 0 ? `€ ${Math.round(n).toLocaleString('sk-SK')}` : '—';
const n = (v) => { const p = Number(v); return isNaN(p) ? 0 : p; };

function RevenueRow({ label, areaField, priceField, countField, area, count, calcValue, data, onChange, pd }) {
  const displayArea = area !== undefined ? area : (count !== undefined ? count : null);
  const displayUnit = countField ? 'ks' : 'm²';

  return (
    <div className="grid grid-cols-12 gap-2 items-center py-2 border-b border-gray-100 last:border-0">
      <div className="col-span-4 text-xs text-gray-600">{label}</div>
      <div className="col-span-3">
        <div className="text-xs text-gray-400">{displayUnit === 'ks' ? 'Počet' : 'Plocha'}</div>
        <div className="text-xs font-medium">{displayArea != null ? `${Math.round(displayArea).toLocaleString('sk-SK')} ${displayUnit}` : '—'}</div>
      </div>
      <div className="col-span-3">
        <div className="text-xs text-gray-400">{countField ? '€/ks' : '€/m²'}</div>
        <Input
          type="number"
          value={data[priceField] ?? ''}
          onChange={e => onChange({ ...data, [priceField]: e.target.value === '' ? '' : Number(e.target.value) })}
          className="h-7 text-xs"
        />
      </div>
      <div className="col-span-2 text-right text-xs font-semibold text-emerald-700">{fmt(calcValue)}</div>
    </div>
  );
}

export default function RevenueSection({ data, projectData, results, onChange }) {
  const r = results || {};
  const pd = projectData || {};

  return (
    <Card>
      <CardHeader className="pb-2"><CardTitle className="text-sm">Tržby z predaja</CardTitle></CardHeader>
      <CardContent>
        <div className="grid grid-cols-12 gap-2 pb-2 border-b text-gray-400 text-xs">
          <div className="col-span-4">Položka</div>
          <div className="col-span-3">Množstvo</div>
          <div className="col-span-3">Cena</div>
          <div className="col-span-2 text-right">Výsledok</div>
        </div>
        <RevenueRow label="Byty" priceField="apartments_unit_price" area={n(pd.sales_area_apartments)} calcValue={r.apartmentsRevenue || 0} data={data} onChange={onChange} pd={pd} />
        <RevenueRow label="Nebytové priestory" priceField="non_residential_unit_price" area={n(pd.sales_area_non_residential)} calcValue={r.nonResRevenue || 0} data={data} onChange={onChange} pd={pd} />
        <RevenueRow label="Kryté parkovanie" priceField="parking_indoor_unit_price" countField count={n(pd.parking_indoor_count)} calcValue={r.parkingIndoorRevenue || 0} data={data} onChange={onChange} pd={pd} />
        <RevenueRow label="Vonkajšie parkovanie" priceField="parking_outdoor_unit_price" countField count={n(pd.parking_outdoor_count)} calcValue={r.parkingOutdoorRevenue || 0} data={data} onChange={onChange} pd={pd} />
        <RevenueRow label="Balkóny" priceField="balconies_unit_price" area={n(pd.sales_area_balconies)} calcValue={r.balconiesRevenue || 0} data={data} onChange={onChange} pd={pd} />
        <RevenueRow label="Záhrady" priceField="gardens_unit_price" area={n(pd.sales_area_gardens)} calcValue={r.gardensRevenue || 0} data={data} onChange={onChange} pd={pd} />
        <RevenueRow label="Pivnice" priceField="basements_unit_price" area={n(pd.basement_area)} calcValue={r.basementsRevenue || 0} data={data} onChange={onChange} pd={pd} />
        <div className="py-2 border-b border-gray-100">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-600">Ostatné príjmy</span>
            <span className="text-xs font-semibold text-emerald-700">{fmt(r.otherRevenue || 0)}</span>
          </div>
          <Input type="number" value={data.other_revenue ?? ''} onChange={e => onChange({ ...data, other_revenue: e.target.value === '' ? '' : Number(e.target.value) })} className="h-7 text-xs" placeholder="€" />
        </div>
        <div className="flex justify-between pt-3 text-sm font-bold text-gray-900">
          <span>Hrubé tržby spolu</span>
          <span className="text-emerald-600">{fmt(r.totalGrossRevenue || 0)}</span>
        </div>
      </CardContent>
    </Card>
  );
}