import React from 'react';
import { AlertCircle } from 'lucide-react';

const fmt = (n) => `€ ${Math.round(n || 0).toLocaleString('sk-SK')}`;

/**
 * Informačný banner o dopade DPH na projekt.
 */
export default function VatInputBanner({ vatRate, totalRevenue }) {
  if (!vatRate || !totalRevenue) return null;

  const revenueExVat = totalRevenue / (1 + vatRate / 100);
  const vatAmount = totalRevenue - revenueExVat;

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
      <div className="flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
        <span className="text-xs font-semibold text-amber-800">DPH {vatRate}% — Dopad na projekt</span>
      </div>
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="bg-white rounded-lg p-2.5 border border-amber-100 text-center">
          <div className="text-amber-600 font-medium mb-0.5">Tržby (brutto)</div>
          <div className="font-bold text-gray-900">{fmt(totalRevenue)}</div>
        </div>
        <div className="bg-white rounded-lg p-2.5 border border-amber-100 text-center">
          <div className="text-amber-600 font-medium mb-0.5">Tržby (netto)</div>
          <div className="font-bold text-gray-900">{fmt(revenueExVat)}</div>
        </div>
        <div className="bg-white rounded-lg p-2.5 border border-red-100 text-center">
          <div className="text-red-600 font-medium mb-0.5">DPH štátu</div>
          <div className="font-bold text-red-600">- {fmt(vatAmount)}</div>
        </div>
      </div>
      <p className="text-[11px] text-amber-600 leading-relaxed">
        ⚠️ SK: Bytová výstavba 20% DPH · Sociálne bývanie ≤150 m² → 10% · Pozemky bez DPH
      </p>
    </div>
  );
}