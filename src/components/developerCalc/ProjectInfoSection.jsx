import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function F({ label, field, data, onChange, suffix }) {
  return (
    <div>
      <Label className="text-xs text-gray-500 mb-1 block">{label}</Label>
      <div className="relative">
        <Input
          type="number"
          value={data[field] ?? ''}
          onChange={e => onChange({ ...data, [field]: e.target.value === '' ? '' : Number(e.target.value) })}
          className="h-8 text-sm pr-10"
        />
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{suffix}</span>}
      </div>
    </div>
  );
}

export default function ProjectInfoSection({ data, onChange }) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">Plochy projektu</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          <F label="HPP nadzemné" field="gfa_above" data={data} onChange={onChange} suffix="m²" />
          <F label="HPP podzemné" field="gfa_below" data={data} onChange={onChange} suffix="m²" />
          <F label="ČPP nad terénom" field="nfa_above" data={data} onChange={onChange} suffix="m²" />
          <F label="ČPP pod terénom" field="nfa_below" data={data} onChange={onChange} suffix="m²" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">Predajné plochy</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          <F label="Byty" field="sales_area_apartments" data={data} onChange={onChange} suffix="m²" />
          <F label="Nebytové priestory" field="sales_area_non_residential" data={data} onChange={onChange} suffix="m²" />
          <F label="Balkóny" field="sales_area_balconies" data={data} onChange={onChange} suffix="m²" />
          <F label="Záhrady" field="sales_area_gardens" data={data} onChange={onChange} suffix="m²" />
          <F label="Pivnice" field="basement_area" data={data} onChange={onChange} suffix="m²" />
          <F label="Spevnené plochy" field="paved_areas" data={data} onChange={onChange} suffix="m²" />
          <F label="Zeleň na teréne" field="green_areas_terrain" data={data} onChange={onChange} suffix="m²" />
          <F label="Zeleň na konštrukcii" field="green_areas_structure" data={data} onChange={onChange} suffix="m²" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">Parkovanie & harmonogram</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          <F label="Kryté parkovacie miesta" field="parking_indoor_count" data={data} onChange={onChange} suffix="ks" />
          <F label="Vonkajšie parkovacie miesta" field="parking_outdoor_count" data={data} onChange={onChange} suffix="ks" />
          <F label="Trvanie projektu" field="project_duration_months" data={data} onChange={onChange} suffix="mes." />
          <F label="Začiatok predaja" field="sales_start_month" data={data} onChange={onChange} suffix="mes." />
        </CardContent>
      </Card>
    </div>
  );
}