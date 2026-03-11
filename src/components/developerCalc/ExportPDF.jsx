import { jsPDF } from 'jspdf';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

const fmt = (n) => `€ ${Math.round(n || 0).toLocaleString('sk-SK')}`;
const fmtPct = (n) => `${(n || 0).toFixed(1)} %`;

function addPageFooter(doc, pageNum) {
  doc.setFontSize(8);
  doc.setTextColor(160, 160, 160);
  doc.text('stavai.sk — Developer Kalkulačka', 14, 290);
  doc.text(`Strana ${pageNum}`, 196, 290, { align: 'right' });
  doc.setTextColor(0, 0, 0);
}

function sectionTitle(doc, text, y) {
  doc.setFontSize(10);
  doc.setTextColor(30, 64, 175); // blue-800
  doc.setFont(undefined, 'bold');
  doc.text(text, 14, y);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(0, 0, 0);
  doc.setDrawColor(200, 210, 240);
  doc.line(14, y + 1.5, 196, y + 1.5);
  return y + 8;
}

function row(doc, label, value, y, highlight = false) {
  if (highlight) {
    doc.setFillColor(240, 249, 255);
    doc.roundedRect(13, y - 4.5, 183, 6.5, 1, 1, 'F');
    doc.setFont(undefined, 'bold');
  }
  doc.setFontSize(9);
  doc.setTextColor(60, 60, 60);
  doc.text(label, 16, y);
  doc.setTextColor(20, 20, 20);
  doc.text(value, 194, y, { align: 'right' });
  if (highlight) doc.setFont(undefined, 'normal');
  return y + 7;
}

export function generatePDF(results, projectName, data) {
  const r = results || {};
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  // ─── PAGE 1 ────────────────────────────────────────────────────────
  // Header bar
  doc.setFillColor(30, 64, 175);
  doc.rect(0, 0, 210, 22, 'F');
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('Developer Kalkulačka — Finančný Report', 14, 14);
  doc.setFont(undefined, 'normal');
  doc.setFontSize(9);
  doc.text('stavai.sk', 196, 14, { align: 'right' });

  // Project name + date
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  doc.text(projectName || 'Bez názvu', 14, 32);
  doc.setFont(undefined, 'normal');
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text(`Typ subjektu: ${r.entityType === 'FO' ? 'Fyzická osoba (FO)' : 'Právnická osoba (PO)'}   ·   Vygenerované: ${new Date().toLocaleDateString('sk-SK')}`, 14, 38);
  doc.setTextColor(0, 0, 0);

  // ── KPI boxes ──
  const kpis = [
    { l: 'IRR', v: r.irr != null ? fmtPct(r.irr) : 'N/A' },
    { l: 'Zisková marža', v: fmtPct(r.profitMargin) },
    { l: 'Dev. marža', v: fmtPct(r.developerMargin) },
    { l: 'Násobok kap.', v: r.equityMultiple > 0 ? `${r.equityMultiple.toFixed(2)}×` : '—' },
    { l: `Zisk po dani (${r.entityType || 'PO'})`, v: fmt(r.profitAfterTax) },
  ];
  const boxW = 35, boxH = 20, startX = 14, startY = 44, gap = 2.5;
  kpis.forEach((k, i) => {
    const x = startX + i * (boxW + gap);
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(220, 230, 245);
    doc.roundedRect(x, startY, boxW, boxH, 2, 2, 'FD');
    doc.setFontSize(7);
    doc.setTextColor(100, 100, 100);
    doc.text(k.l, x + boxW / 2, startY + 5.5, { align: 'center' });
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(20, 20, 20);
    doc.text(k.v, x + boxW / 2, startY + 14, { align: 'center' });
    doc.setFont(undefined, 'normal');
  });

  // ── P&L ──
  let y = 74;
  y = sectionTitle(doc, 'Výkaz ziskov a strát', y);
  y = row(doc, 'Celkové tržby (hrubé)', fmt(r.totalGrossRevenue), y);
  if (r.vatRate > 0) {
    y = row(doc, `  z toho DPH (${r.vatRate}%)`, fmt(r.vatOnRevenue), y);
    y = row(doc, '  Tržby bez DPH', fmt(r.revenueExVat), y);
  }
  y += 1;
  y = row(doc, 'Pozemok a projekt', `- ${fmt(r.landAndProject)}`, y);
  y = row(doc, 'Realizácia', `- ${fmt(r.totalImplementation)}`, y);
  y = row(doc, 'Doplnkový rozpočet', `- ${fmt(r.totalAdditionalBudget)}`, y);
  y = row(doc, 'Ostatné služby', `- ${fmt(r.totalOtherServices)}`, y);
  y = row(doc, 'Predaj a marketing', `- ${fmt(r.salesCosts + r.marketingCosts)}`, y);
  y = row(doc, 'Rezerva', `- ${fmt(r.reserve)}`, y);
  y = row(doc, 'Náklady pred financovaním', `- ${fmt(r.totalCostsNet)}`, y, true);
  y = row(doc, 'Financovanie', `- ${fmt(r.totalFinancingCosts)}`, y);
  y = row(doc, 'CELKOVÉ NÁKLADY', `- ${fmt(r.totalProjectCosts)}`, y, true);
  y += 2;
  y = row(doc, 'HRUBÝ ZISK', fmt(r.grossProfit), y, true);
  y = row(doc, `Daň z príjmu ${r.entityType} (${fmtPct(r.taxRate)})`, `- ${fmt(r.taxAmount)}`, y);
  y = row(doc, 'ZISK PO DANI', fmt(r.profitAfterTax), y, true);

  // ── Financing ──
  y += 4;
  y = sectionTitle(doc, 'Štruktúra financovania', y);
  y = row(doc, `Vlastné zdroje (${data?.own_resources_percent || 30}%)`, fmt(r.ownResources), y);
  y = row(doc, 'Bankový úver', fmt(r.bankResources), y);
  y = row(doc, 'Bankové poplatky', fmt(r.bankFees), y);
  y = row(doc, 'Úroky z banky', fmt(r.bankInterest), y);
  y = row(doc, 'Celkové náklady financovania', fmt(r.totalFinancingCosts), y, true);
  if (r.dscr != null) {
    y = row(doc, 'DSCR', r.dscr.toFixed(2), y);
  }

  addPageFooter(doc, 1);

  // ─── PAGE 2 ────────────────────────────────────────────────────────
  doc.addPage();

  // Header
  doc.setFillColor(30, 64, 175);
  doc.rect(0, 0, 210, 12, 'F');
  doc.setFontSize(9);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text(`${projectName || 'Projekt'} — pokračovanie`, 14, 8);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(0, 0, 0);

  y = 22;

  // ── Revenue breakdown ──
  y = sectionTitle(doc, 'Rozloženie tržieb', y);
  const revRows = [
    { l: 'Byty', v: r.apartmentsRevenue },
    { l: 'Nebytové priestory', v: r.nonResRevenue },
    { l: 'Kryté parkovanie', v: r.parkingIndoorRevenue },
    { l: 'Vonkajšie parkovanie', v: r.parkingOutdoorRevenue },
    { l: 'Balkóny', v: r.balconiesRevenue },
    { l: 'Záhrady', v: r.gardensRevenue },
    { l: 'Pivnice', v: r.basementsRevenue },
    { l: 'Ostatné', v: r.otherRevenue },
  ].filter(x => x.v > 0);
  revRows.forEach(rr => { y = row(doc, rr.l, fmt(rr.v), y); });
  y = row(doc, 'CELKOVÉ TRŽBY', fmt(r.totalGrossRevenue), y, true);

  // ── Per m² metrics ──
  y += 4;
  y = sectionTitle(doc, 'Metriky na m² predajnej plochy', y);
  y = row(doc, 'Náklady / m²', `€ ${Math.round(r.costPerM2)}/m²`, y);
  y = row(doc, 'Výnos / m²', `€ ${Math.round(r.revenuePerM2)}/m²`, y);
  y = row(doc, 'Zisk / m²', `€ ${Math.round(r.profitPerM2)}/m²`, y);

  // ── Break-even ──
  y += 4;
  y = sectionTitle(doc, 'Bod zvratu', y);
  y = row(doc, 'Bod zvratu (tržby)', fmt(r.breakEvenRevenue), y);
  y = row(doc, 'Bod zvratu (% z predpredaja)', fmtPct(r.breakEvenPct), y);

  // ── Cash flow table (quarterly) ──
  y += 4;
  y = sectionTitle(doc, 'Cash Flow — kvartalny prehľad', y);

  const cfData = r.monthlyData?.filter((_, i) => i % 3 === 0).slice(0, 10) || [];

  // Table header
  doc.setFillColor(30, 64, 175);
  doc.roundedRect(13, y - 4, 183, 7, 1, 1, 'F');
  doc.setFontSize(8);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('Mesiac', 16, y);
  doc.text('Mesačný CF', 100, y, { align: 'right' });
  doc.text('Kumulatívny CF', 194, y, { align: 'right' });
  doc.setFont(undefined, 'normal');
  doc.setTextColor(0, 0, 0);
  y += 7;

  cfData.forEach((cf, i) => {
    if (i % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(13, y - 4.5, 183, 6.5, 'F');
    }
    doc.setFontSize(8);
    doc.setTextColor(60, 60, 60);
    doc.text(cf.month, 16, y);
    const netColor = cf.net >= 0 ? [5, 150, 105] : [220, 38, 38];
    doc.setTextColor(...netColor);
    doc.text(fmt(cf.net), 100, y, { align: 'right' });
    const cumColor = cf.cumulative >= 0 ? [5, 150, 105] : [220, 38, 38];
    doc.setTextColor(...cumColor);
    doc.text(fmt(cf.cumulative), 194, y, { align: 'right' });
    doc.setTextColor(0, 0, 0);
    y += 7;
  });

  // Disclaimer
  doc.setFontSize(7);
  doc.setTextColor(160, 160, 160);
  doc.text('Upozornenie: Tento report je orientačný a nenahrádza odborné finančné poradenstvo. stavai.sk nezodpovedá za rozhodnutia na základe tohto reportu.', 14, 282, { maxWidth: 182 });

  addPageFooter(doc, 2);

  // ── SAVE ──
  const safeName = (projectName || 'projekt').replace(/[^a-zA-Z0-9_\-áäčďéíľňóôŕšťúýžÁÄČĎÉÍĽŇÓÔŔŠŤÚÝŽ ]/g, '');
  doc.save(`${safeName || 'developer-kalkulator'}-report.pdf`);
}

export default function ExportPDFButton({ results, projectName, data }) {
  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-2 text-xs border-blue-200 text-blue-700 hover:bg-blue-50"
      onClick={() => generatePDF(results, projectName, data)}
    >
      <Download className="w-3.5 h-3.5" />
      Export PDF
    </Button>
  );
}