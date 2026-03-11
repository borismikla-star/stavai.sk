import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Loader2, Sparkles, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const fmt = (n) => `€ ${Math.round(n || 0).toLocaleString('sk-SK')}`;
const fmtPct = (n) => `${(n || 0).toFixed(1)}%`;

export default function AISummary({ results, projectName, entityType }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  const r = results || {};

  const generate = async () => {
    setLoading(true);
    setSummary(null);
    const prompt = `Si expert na developerské projekty na Slovensku. Analyzuj tento finančný model a daj stručné, profesionálne hodnotenie v slovenčine.

Projekt: ${projectName || 'Bez názvu'}
Typ subjektu: ${entityType === 'FO' ? 'Fyzická osoba (FO)' : 'Právnická osoba (PO)'}

FINANČNÉ VÝSLEDKY:
- Celkové tržby: ${fmt(r.totalGrossRevenue)}
- Celkové náklady: ${fmt(r.totalProjectCosts)}
- Hrubý zisk: ${fmt(r.grossProfit)}
- Zisková marža: ${fmtPct(r.profitMargin)}
- Developer marža: ${fmtPct(r.developerMargin)}
- IRR: ${r.irr != null ? fmtPct(r.irr) : 'N/A'}
- Násobok kapitálu: ${r.equityMultiple > 0 ? r.equityMultiple.toFixed(2) + 'x' : 'N/A'}
- Zisk po dani: ${fmt(r.profitAfterTax)}
- Efektívna daňová sadzba: ${fmtPct(r.taxRate)}
- DSCR: ${r.dscr != null ? r.dscr.toFixed(2) : 'N/A'}

Daj odpoveď v tomto JSON formáte:`;

    const res = await base44.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: 'object',
        properties: {
          verdict: { type: 'string', enum: ['Výborný projekt', 'Solídny projekt', 'Priemerný projekt', 'Rizikový projekt', 'Neodporúčaný projekt'] },
          score: { type: 'number', description: '0-100 skóre projektu' },
          summary: { type: 'string', description: '2-3 vety celkové zhodnotenie' },
          strengths: { type: 'array', items: { type: 'string' }, description: '2-3 silné stránky' },
          risks: { type: 'array', items: { type: 'string' }, description: '2-3 riziká alebo slabé stránky' },
          recommendation: { type: 'string', description: '1-2 vety konkrétne odporúčanie' },
        }
      }
    });

    setSummary(res);
    setLoading(false);
  };

  const verdictColor = (v) => {
    if (!v) return 'bg-gray-100 text-gray-600';
    if (v.includes('Výborný')) return 'bg-emerald-100 text-emerald-800';
    if (v.includes('Solídny')) return 'bg-blue-100 text-blue-800';
    if (v.includes('Priemerný')) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-4">
      {!summary && !loading && (
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-violet-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-6 h-6 text-violet-500" />
          </div>
          <p className="text-sm text-gray-600 mb-1 font-medium">AI Sumarizácia projektu</p>
          <p className="text-xs text-gray-400 mb-4">Nechaj AI zhodnotiť finančné výsledky a identifikovať riziká</p>
          <Button onClick={generate} className="bg-violet-600 hover:bg-violet-700 text-white text-sm">
            <Sparkles className="w-4 h-4 mr-2" /> Generovať analýzu
          </Button>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-10 gap-3">
          <Loader2 className="w-7 h-7 animate-spin text-violet-500" />
          <p className="text-sm text-gray-500">AI analyzuje projekt…</p>
        </div>
      )}

      {summary && (
        <div className="space-y-4">
          {/* Verdict + score */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <span className={`text-sm font-bold px-3 py-1.5 rounded-full ${verdictColor(summary.verdict)}`}>
              {summary.verdict}
            </span>
            <div className="flex items-center gap-2">
              <div className="text-xs text-gray-400">Skóre projektu</div>
              <div className="w-24 bg-gray-100 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-violet-500 to-blue-500"
                  style={{ width: `${summary.score || 0}%` }}
                />
              </div>
              <div className="text-sm font-bold text-gray-700">{summary.score}/100</div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 leading-relaxed border border-gray-200">
            {summary.summary}
          </div>

          {/* Strengths & Risks */}
          <div className="grid md:grid-cols-2 gap-3">
            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
              <div className="text-xs font-semibold text-emerald-700 mb-2 uppercase tracking-wide">Silné stránky</div>
              <ul className="space-y-1.5">
                {(summary.strengths || []).map((s, i) => (
                  <li key={i} className="text-xs text-emerald-800 flex gap-2">
                    <span className="text-emerald-400 mt-0.5">✓</span>{s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-red-50 rounded-xl p-4 border border-red-100">
              <div className="text-xs font-semibold text-red-700 mb-2 uppercase tracking-wide">Riziká</div>
              <ul className="space-y-1.5">
                {(summary.risks || []).map((r, i) => (
                  <li key={i} className="text-xs text-red-800 flex gap-2">
                    <span className="text-red-400 mt-0.5">!</span>{r}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recommendation */}
          <div className="bg-violet-50 rounded-xl p-4 border border-violet-100">
            <div className="text-xs font-semibold text-violet-700 mb-1 uppercase tracking-wide">Odporúčanie</div>
            <p className="text-sm text-violet-900">{summary.recommendation}</p>
          </div>

          <Button variant="outline" size="sm" onClick={generate} className="w-full text-xs gap-2">
            <RefreshCw className="w-3.5 h-3.5" /> Regenerovať
          </Button>
        </div>
      )}
    </div>
  );
}