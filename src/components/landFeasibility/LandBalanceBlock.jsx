import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, AlertTriangle, AlertCircle, Info } from 'lucide-react';

const fmt = (n) => Math.round(n ?? 0).toLocaleString('sk-SK');
const BALANCE_TOLERANCE = 0.01;

export default function LandBalanceBlock({ balance, t }) {
  if (!balance || !balance.land_area) return null;

  const { land_area, building_footprint, roads_area, paved_area, green_area, total } = balance;
  const diff = total - land_area;
  const pct = land_area > 0 ? Math.abs(diff) / land_area : 0;
  const isOk = pct <= BALANCE_TOLERANCE;
  const isExceeded = diff > 0 && pct > BALANCE_TOLERANCE;

  const rows = [
    { label: t.lb_building_footprint, value: building_footprint, color: 'bg-blue-500' },
    { label: t.lb_roads, value: roads_area, color: 'bg-yellow-500' },
    { label: t.lb_paved, value: paved_area, color: 'bg-orange-400' },
    { label: t.lb_green, value: green_area, color: 'bg-green-500' },
  ];

  return (
    <Card className={`border-2 ${isOk ? 'border-green-300' : isExceeded ? 'border-red-400' : 'border-amber-300'}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {t.land_balance_title}
          </CardTitle>
          {isOk
            ? <span className="flex items-center gap-1 text-xs font-semibold text-green-600"><CheckCircle2 className="h-4 w-4" />{t.lb_ok}</span>
            : isExceeded
              ? <span className="flex items-center gap-1 text-xs font-semibold text-red-600"><AlertCircle className="h-4 w-4" />{t.lb_exceeded}</span>
              : <span className="flex items-center gap-1 text-xs font-semibold text-amber-600"><AlertTriangle className="h-4 w-4" />{t.lb_unallocated}</span>
          }
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="w-full h-4 rounded-full overflow-hidden flex bg-muted">
          {rows.map((r, i) => {
            const w = land_area > 0 ? (r.value / land_area) * 100 : 0;
            return w > 0 ? (
              <div key={i} className={`${r.color} h-full`} style={{ width: `${Math.min(w, 100)}%` }} title={`${r.label}: ${fmt(r.value)} m²`} />
            ) : null;
          })}
        </div>
        <div className="pt-1 space-y-1">
          <div className="flex justify-between text-xs font-semibold text-foreground border-b border-border pb-1">
            <span>{t.lb_land_area}</span>
            <span>{fmt(land_area)} m²</span>
          </div>
          {rows.map((r, i) => (
            <div key={i} className="flex justify-between items-center text-xs text-muted-foreground">
              <span className="flex items-center gap-2">
                <span className={`inline-block w-2.5 h-2.5 rounded-sm ${r.color}`} />
                {r.label}
              </span>
              <span className="font-medium text-foreground">{fmt(r.value)} m²</span>
            </div>
          ))}
          <div className={`flex justify-between text-xs font-semibold pt-1 border-t border-border ${isOk ? 'text-green-700' : isExceeded ? 'text-red-700' : 'text-amber-700'}`}>
            <span>{t.lb_total}</span>
            <span>{fmt(total)} m²</span>
          </div>
        </div>
        {roads_area === 0 && (
          <div className="mt-3 flex items-start gap-2 rounded-lg bg-blue-50 border border-blue-200 p-3 text-xs text-blue-800">
            <Info className="h-3.5 w-3.5 mt-0.5 shrink-0 text-blue-500" />
            <p>{t.lb_infra_note}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}