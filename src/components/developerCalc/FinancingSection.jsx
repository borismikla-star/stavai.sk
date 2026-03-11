import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

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

const FMT_PCT = (n) => `${(n || 0).toFixed(1)}%`;

export default function FinancingSection({ data, results, onChange }) {
  const r = results || {};
  const ownPct = Number(data.own_resources_percent) || 30;
  const entityType = data.entity_type || 'PO';
  const vatRate = Number(data.vat_rate) || 0;

  return (
    <div className="space-y-4">

      {/* Daňové nastavenia */}
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">Daňové nastavenia (SK)</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {/* FO / PO toggle */}
          <div>
            <Label className="text-xs text-gray-500 mb-2 block">Typ subjektu</Label>
            <div className="flex items-center bg-gray-100 rounded-lg p-1 gap-1">
              {['FO', 'PO'].map(t => (
                <button
                  key={t}
                  onClick={() => onChange({ ...data, entity_type: t })}
                  className={`flex-1 text-xs font-semibold py-1.5 rounded-md transition-all ${entityType === t ? 'bg-white shadow text-blue-700' : 'text-gray-500 hover:text-gray-800'}`}
                >
                  {t === 'FO' ? 'Fyzická osoba (FO)' : 'Právnická osoba (PO)'}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-1.5">
              {entityType === 'FO'
                ? 'Daň z príjmu FO: 15% (obrat ≤ €100k) alebo 19% (nad €100k)'
                : 'Daň z príjmu PO: 21% zo zisku'}
            </p>
          </div>

          {/* DPH */}
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-xs font-medium text-gray-700">DPH na tržbách</Label>
              <p className="text-xs text-gray-400">Zahrnúť DPH (20%) do cien</p>
            </div>
            <Switch
              checked={vatRate > 0}
              onCheckedChange={(v) => onChange({ ...data, vat_rate: v ? 20 : 0 })}
            />
          </div>
          {vatRate > 0 && (
            <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 text-xs space-y-1">
              <div className="flex justify-between text-amber-700">
                <span>DPH zahrnuté v tržbách</span>
                <span className="font-semibold">{fmt(r.vatOnRevenue)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tržby bez DPH</span>
                <span>{fmt(r.revenueExVat)}</span>
              </div>
            </div>
          )}

          {/* Tax summary */}
          {r.grossProfit > 0 && (
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-xs space-y-1">
              <div className="flex justify-between text-blue-700">
                <span>Daňová sadzba ({entityType})</span>
                <span className="font-semibold">{FMT_PCT(r.taxRate)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Daň z príjmu</span>
                <span className="font-medium text-red-600">- {fmt(r.taxAmount)}</span>
              </div>
              <div className="flex justify-between font-bold text-emerald-700 pt-1 border-t border-blue-200">
                <span>Zisk po dani</span>
                <span>{fmt(r.profitAfterTax)}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

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