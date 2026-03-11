/**
 * SK Tax utilities pre Developer Kalkulačku
 * Daňové sadzby platné pre SR (2024/2025)
 */

export const SK_TAX_RATES = {
  PO: 0.21,
  FO_LOW: 0.15,
  FO_MID: 0.19,
  FO_HIGH: 0.25,
  VAT_STANDARD: 0.20,
  VAT_REDUCED: 0.10,
};

const FO_REVENUE_THRESHOLD = 100000;
const FO_PROGRESSIVE_THRESHOLD = 38553;

export function calculateIncomeTax(grossProfit, entityType = 'PO', annualRevenue = 0) {
  if (grossProfit <= 0) return { taxAmount: 0, taxRate: 0, effectiveRate: 0 };

  if (entityType === 'FO') {
    if (annualRevenue <= FO_REVENUE_THRESHOLD) {
      const taxAmount = grossProfit * SK_TAX_RATES.FO_LOW;
      return { taxAmount, taxRate: 15, effectiveRate: 15 };
    }
    let taxAmount;
    if (grossProfit <= FO_PROGRESSIVE_THRESHOLD) {
      taxAmount = grossProfit * SK_TAX_RATES.FO_MID;
    } else {
      taxAmount =
        FO_PROGRESSIVE_THRESHOLD * SK_TAX_RATES.FO_MID +
        (grossProfit - FO_PROGRESSIVE_THRESHOLD) * SK_TAX_RATES.FO_HIGH;
    }
    return { taxAmount, taxRate: 19, effectiveRate: (taxAmount / grossProfit) * 100 };
  }

  const taxAmount = grossProfit * SK_TAX_RATES.PO;
  return { taxAmount, taxRate: 21, effectiveRate: 21 };
}

export function calculateVAT(totalRevenue, vatRate) {
  if (!vatRate || vatRate === 0) return { vatAmount: 0, revenueExVat: totalRevenue, vatRate: 0 };
  const revenueExVat = totalRevenue / (1 + vatRate / 100);
  const vatAmount = totalRevenue - revenueExVat;
  return { vatAmount, revenueExVat, vatRate };
}

export const SK_VAT_RULES = [
  { type: 'Bytové domy (štandard)', rate: 20, note: 'Základná sadzba — prvý predaj novostavby' },
  { type: 'Sociálne bývanie (≤150 m²)', rate: 10, note: 'Znížená sadzba pre byty do 150 m²' },
  { type: 'Pozemky', rate: 0, note: 'Predaj pozemkov oslobodený od DPH (§38)' },
  { type: 'Stavebné práce', rate: 20, note: 'Základná sadzba na stavebné práce' },
];

export function getTaxLabel(entityType, annualRevenue = 0) {
  if (entityType === 'FO') {
    return annualRevenue <= FO_REVENUE_THRESHOLD ? 'FO — 15%' : 'FO — 19%/25%';
  }
  return 'PO — 21%';
}