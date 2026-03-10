import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const fmt = (n) => `€ ${Math.round(n || 0).toLocaleString('sk-SK')}`;

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

export default function FinancingSection({ data, results, onChange }) {
  const r = results || {};
  const ownPct = Number(data.own_resources_percent) || 30;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">Štruktúra financovania</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <F label="Vlastné zdroje (%)" field="own_resources_percent" data={data} onChange={onChange} suffix="%" />
          <F label="Úroková sadzba banky" field="bank_interest_percent" data={data} onChange={onChange} suffix="%" />
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
              <div className="text-xs text-blue-600 font-semibold mb-1">Vlastné zdroje ({ownPct}%)</div>
              <div className="text-base font-bold text-gray-900">{fmt(r.ownResources)}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <div className="text-xs text-gray-500 font-semibold mb-1">Bankový úver ({100 - ownPct}%)</div>
              <div className="text-base font-bold text-gray-900">{fmt(r.bankResources)}</div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">Náklady financovania</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {[
            { l: 'Bankové poplatky (0,2%)', v: r.bankFees },
            { l: 'Úroky z úveru', v: r.bankInterest },
            { l: 'Náklady vlastných zdrojov (3% p.a.)', v: r.ownResourcesInterestCost },
          ].map((row, i) => (
            <div key={i} className="flex justify-between text-xs">
              <span className="text-gray-500">{row.l}</span>
              <span className="font-medium">{fmt(row.v)}</span>
            </div>
          ))}
          <div className="flex justify-between text-sm font-bold pt-2 border-t">
            <span>Náklady financovania spolu</span>
            <span>{fmt(r.totalFinancingCosts)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}