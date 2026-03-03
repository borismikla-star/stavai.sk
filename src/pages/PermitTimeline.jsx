import React, { useState, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

const PHASES = [
  { id: 'predprojekt', label: 'Predprojektová príprava', color: '#6366F1' },
  { id: 'projekt', label: 'Projektová dokumentácia', color: '#3B82F6' },
  { id: 'eia', label: 'EIA (posudzovanie vplyvov)', color: '#F59E0B' },
  { id: 'ur', label: 'Územné rozhodnutie (ÚR)', color: '#8B5CF6' },
  { id: 'sp', label: 'Stavebné povolenie (SP)', color: '#10B981' },
  { id: 'vystavba', label: 'Výstavba', color: '#059669' },
  { id: 'kolaud', label: 'Kolaudácia', color: '#06B6D4' },
];

function calcTimeline(inputs) {
  const base = {
    predprojekt: { start: 0, opt: 2, real: 3, pess: 4 },
    projekt: { opt: 3, real: 5, pess: 7 },
    eia: inputs.needs_eia ? { opt: 12, real: 18, pess: 30 } : null,
    ur: { opt: inputs.type === 'small' ? 3 : 6, real: inputs.type === 'small' ? 6 : 12, pess: inputs.type === 'small' ? 9 : 18 },
    sp: { opt: inputs.type === 'small' ? 2 : 4, real: inputs.type === 'small' ? 4 : 8, pess: inputs.type === 'small' ? 6 : 14 },
    vystavba: { opt: inputs.construction_months * 0.9, real: inputs.construction_months, pess: inputs.construction_months * 1.25 },
    kolaud: { opt: 1, real: 2, pess: 4 },
  };

  if (inputs.has_demolition) {
    base.predprojekt.opt += 1;
    base.predprojekt.real += 2;
    base.predprojekt.pess += 4;
  }

  // Build sequential phases
  const scenarios = { opt: [], real: [], pess: [] };
  Object.entries(['opt', 'real', 'pess']).forEach(() => {});

  ['opt', 'real', 'pess'].forEach(sc => {
    let cursor = 0;
    PHASES.forEach(ph => {
      const d = base[ph.id];
      if (!d) { scenarios[sc].push({ id: ph.id, start: null, dur: 0, end: null }); return; }
      const dur = d[sc] || 0;
      scenarios[sc].push({ id: ph.id, start: cursor, dur, end: cursor + dur });
      cursor += dur;
    });
  });

  return { scenarios, base };
}

const defaultInputs = {
  project_name: 'Nový projekt',
  type: 'medium',
  location: 'Bratislava',
  needs_eia: false,
  has_demolition: false,
  construction_months: 24,
};

export default function PermitTimeline() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [scenario, setScenario] = useState('real');
  const queryClient = useQueryClient();

  const { scenarios, base } = useMemo(() => calcTimeline(inputs), [inputs]);

  const maxMonths = Math.max(...(scenarios[scenario] || []).map(p => p.end || 0));
  const totalMonths = maxMonths;

  const saveMutation = useMutation({
    mutationFn: () => base44.entities.Timeline.create({
      project_name: inputs.project_name,
      total_duration: totalMonths,
      phases: PHASES.map(ph => {
        const s = scenarios.real.find(p => p.id === ph.id);
        return { name: ph.label, duration: s?.dur || 0, description: ph.label };
      }),
    }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['timelines'] })
  });

  const scLabels = { opt: 'Optimistický', real: 'Realistický', pess: 'Pesimistický' };

  const totals = {
    opt: Math.max(...scenarios.opt.map(p => p.end || 0)),
    real: Math.max(...scenarios.real.map(p => p.end || 0)),
    pess: Math.max(...scenarios.pess.map(p => p.end || 0)),
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="text-xs text-blue-600 uppercase tracking-widest font-semibold mb-1">Nástroj</div>
          <h1 className="text-3xl font-black text-[#0F172A]">Harmonogram Povolení</h1>
          <p className="text-slate-500 text-sm mt-1">Gantt diagram – ÚR, SP, EIA. Scenárová analýza.</p>
        </div>
        <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Save className="w-4 h-4 mr-2" />{saveMutation.isPending ? 'Ukladá...' : 'Uložiť'}
        </Button>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Inputs */}
        <div className="space-y-6">
          <Card className="bg-white border-slate-200">
            <CardHeader className="pb-3"><CardTitle className="text-sm font-bold uppercase tracking-wider text-[#0F172A]">Parametre projektu</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs text-slate-500 mb-1 block">Názov projektu</Label>
                <Input value={inputs.project_name} onChange={(e) => setInputs(p => ({ ...p, project_name: e.target.value }))} className="text-sm bg-white border-slate-200" />
              </div>
              <div>
                <Label className="text-xs text-slate-500 mb-1 block">Lokalita</Label>
                <Input value={inputs.location} onChange={(e) => setInputs(p => ({ ...p, location: e.target.value }))} className="text-sm bg-white border-slate-200" />
              </div>
              <div>
                <Label className="text-xs text-slate-500 mb-1 block">Typ projektu</Label>
                <Select value={inputs.type} onValueChange={(v) => setInputs(p => ({ ...p, type: v }))}>
                  <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Malý (do 10 bytov)</SelectItem>
                    <SelectItem value="medium">Stredný (10–50 bytov)</SelectItem>
                    <SelectItem value="large">Veľký (50+ bytov)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-slate-500 mb-1 block">Výstavba (mesiace)</Label>
                <Input type="number" value={inputs.construction_months} onChange={(e) => setInputs(p => ({ ...p, construction_months: parseInt(e.target.value) || 24 }))} className="text-sm bg-white border-slate-200" />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm text-[#0F172A]">Vyžaduje EIA</Label>
                <Switch checked={inputs.needs_eia} onCheckedChange={(v) => setInputs(p => ({ ...p, needs_eia: v }))} />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm text-[#0F172A]">Demolácia</Label>
                <Switch checked={inputs.has_demolition} onCheckedChange={(v) => setInputs(p => ({ ...p, has_demolition: v }))} />
              </div>
            </CardContent>
          </Card>

          {/* Scenario selector */}
          <Card className="bg-white border-slate-200">
            <CardHeader className="pb-3"><CardTitle className="text-sm font-bold uppercase tracking-wider text-[#0F172A]">Scenár</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {['opt', 'real', 'pess'].map(sc => (
                <button
                  key={sc}
                  onClick={() => setScenario(sc)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border transition text-sm font-medium ${
                    scenario === sc ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300'
                  }`}
                >
                  <span>{scLabels[sc]}</span>
                  <span className="font-bold">{totals[sc]} mes.</span>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Gantt */}
        <div className="lg:col-span-3 space-y-6">
          {/* Scenario Summary Cards */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { sc: 'opt', icon: CheckCircle, cls: 'border-green-200 bg-green-50', iconCls: 'text-green-500', label: 'Optimistický' },
              { sc: 'real', icon: Clock, cls: 'border-blue-200 bg-blue-50', iconCls: 'text-blue-500', label: 'Realistický' },
              { sc: 'pess', icon: AlertTriangle, cls: 'border-amber-200 bg-amber-50', iconCls: 'text-amber-500', label: 'Pesimistický' },
            ].map(({ sc, icon: Icon, cls, iconCls, label }) => (
              <Card key={sc} className={`border ${cls}`}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className={`w-4 h-4 ${iconCls}`} />
                    <span className="text-xs font-semibold text-slate-700">{label}</span>
                  </div>
                  <div className="text-2xl font-black text-[#0F172A]">{totals[sc]} mes.</div>
                  <div className="text-xs text-slate-500">{(totals[sc] / 12).toFixed(1)} rokov</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Gantt Chart */}
          <Card className="bg-white border-slate-200">
            <CardHeader>
              <CardTitle className="text-base text-[#0F172A]">Gantt diagram – {scLabels[scenario]} scenár</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {PHASES.map(ph => {
                  const s = scenarios[scenario].find(p => p.id === ph.id);
                  if (!s || s.dur === 0) return null;
                  const leftPct = (s.start / maxMonths) * 100;
                  const widthPct = (s.dur / maxMonths) * 100;
                  return (
                    <div key={ph.id}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-slate-700 w-52 truncate">{ph.label}</span>
                        <span className="text-xs text-slate-500">{s.start}–{s.end} mes. ({s.dur} mes.)</span>
                      </div>
                      <div className="relative h-7 bg-slate-100 rounded-lg overflow-hidden">
                        <div
                          className="absolute h-full rounded-lg flex items-center px-2 text-white text-xs font-semibold"
                          style={{ left: `${leftPct}%`, width: `${Math.max(widthPct, 2)}%`, backgroundColor: ph.color }}
                        >
                          {widthPct > 8 ? `${s.dur} mes.` : ''}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* Month markers */}
              <div className="flex justify-between mt-4 text-xs text-slate-400">
                {Array.from({ length: 6 }, (_, i) => (
                  <span key={i}>{Math.round((maxMonths / 5) * i)} mes.</span>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Phase Detail Table */}
          <Card className="bg-white border-slate-200">
            <CardHeader><CardTitle className="text-base text-[#0F172A]">Detail fáz – všetky scenáre</CardTitle></CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-5 py-3 text-slate-600 font-semibold">Fáza</th>
                    <th className="text-center px-3 py-3 text-green-600 font-semibold">Optimistický</th>
                    <th className="text-center px-3 py-3 text-blue-600 font-semibold">Realistický</th>
                    <th className="text-center px-3 py-3 text-amber-600 font-semibold">Pesimistický</th>
                  </tr>
                </thead>
                <tbody>
                  {PHASES.map(ph => {
                    const opt = scenarios.opt.find(p => p.id === ph.id);
                    const real = scenarios.real.find(p => p.id === ph.id);
                    const pess = scenarios.pess.find(p => p.id === ph.id);
                    if (!opt || opt.dur === 0) return null;
                    return (
                      <tr key={ph.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="px-5 py-3 font-medium text-[#0F172A] flex items-center gap-2">
                          <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: ph.color }} />
                          {ph.label}
                        </td>
                        <td className="px-3 py-3 text-center text-green-700 font-semibold">{opt.dur} mes.</td>
                        <td className="px-3 py-3 text-center text-blue-700 font-bold">{real.dur} mes.</td>
                        <td className="px-3 py-3 text-center text-amber-700 font-semibold">{pess.dur} mes.</td>
                      </tr>
                    );
                  })}
                  <tr className="bg-slate-50 font-bold border-t-2 border-slate-300">
                    <td className="px-5 py-3 text-[#0F172A]">CELKOM</td>
                    <td className="px-3 py-3 text-center text-green-700">{totals.opt} mes.</td>
                    <td className="px-3 py-3 text-center text-blue-700">{totals.real} mes.</td>
                    <td className="px-3 py-3 text-center text-amber-700">{totals.pess} mes.</td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}