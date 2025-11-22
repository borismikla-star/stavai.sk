import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Clock, Loader, Download, Calendar, CheckCircle, AlertCircle, TrendingUp, Flag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function TimelineGenerator() {
  const [formData, setFormData] = useState({
    project_name: '',
    building_type: 'residential',
    area: '',
    floors: '',
    location: ''
  });

  const [result, setResult] = useState(null);

  const generateMutation = useMutation({
    mutationFn: async (data) => {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Ako expert na projektové riadenie stavebných projektov v CEE regióne, vytvor ultra-detailný harmonogram:

Typ stavby: ${data.building_type}
Rozloha: ${data.area} m²
Počet podlaží: ${data.floors}
Lokalita: ${data.location}

Vytvor realistický harmonogram pre CEE región (Slovensko/Česko) s cenami a procesmi 2025.

FÁZY PROJEKTU:
1. Prípravná fáza - územné rozhodnutie, projektová dokumentácia, stavebné povolenie, výber dodávateľov
2. Zemné práce - výkopy, základy, pilóty, odvodnenie
3. Hrubá stavba - nosná konštrukcia, obvodové múry, stropy, strecha
4. Dokončovacie práce - omietky, podlahy, obklady, maliarské práce
5. Technické inštalácie - elektroinštalácia, vykurovanie, voda/kanalizácia, vzduchotechnika
6. Exteriér - fasáda, terénne úpravy, prípojky
7. Kolaudácia - technické skúšky, kolaudačné konanie, odovzdanie

Pre každú fázu zadaj:
- Názov a detailný popis
- Realistické trvanie v týždňoch
- Závislosti (ktoré fázy musia byť pred ňou)
- Počet pracovníkov
- Kritické body

MÍĽNIKY - zadaj konkrétne míľniky s týždňom dokončenia

RIZIKOVÉ FAKTORY - identifikuj možné riziká oneskorenia

OPTIMALIZÁCIE - navrhni ako skrátiť celkový čas`,
        response_json_schema: {
          type: "object",
          properties: {
            total_duration_weeks: { type: "number" },
            total_duration_months: { type: "number" },
            phases: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  description: { type: "string" },
                  duration_weeks: { type: "number" },
                  start_week: { type: "number" },
                  end_week: { type: "number" },
                  dependencies: { type: "array", items: { type: "string" } },
                  workers_count: { type: "number" },
                  critical_points: { type: "array", items: { type: "string" } }
                }
              }
            },
            milestones: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  week: { type: "number" },
                  description: { type: "string" }
                }
              }
            },
            critical_path: { 
              type: "array",
              items: { type: "string" }
            },
            risk_factors: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  risk: { type: "string" },
                  impact: { type: "string" },
                  mitigation: { type: "string" }
                }
              }
            },
            optimizations: { type: "array", items: { type: "string" } }
          }
        }
      });

      const timeline = await base44.entities.Timeline.create({
        project_name: data.project_name,
        total_duration: response.total_duration_months,
        phases: response.phases,
        milestones: response.milestones
      });

      return { ...response, timeline_id: timeline.id };
    },
    onSuccess: (data) => {
      setResult(data);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    generateMutation.mutate(formData);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center">
              <Clock className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900">Timeline Generator</h1>
              <p className="text-slate-600">AI harmonogram projektu s Gantt chart vizualizáciou</p>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20">
            <span className="text-sm text-green-600 font-medium">✨ FREE TOOL</span>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <Card className="bg-white border-slate-200 shadow-lg sticky top-24">
              <CardHeader>
                <CardTitle className="text-slate-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Parametre projektu
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="project_name" className="text-slate-700">Názov projektu</Label>
                    <Input
                      id="project_name"
                      value={formData.project_name}
                      onChange={(e) => handleInputChange('project_name', e.target.value)}
                      placeholder="napr. Bytový dom Nové Mesto"
                      className="bg-white border-slate-300"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="building_type" className="text-slate-700">Typ stavby</Label>
                    <Select value={formData.building_type} onValueChange={(value) => handleInputChange('building_type', value)}>
                      <SelectTrigger className="bg-white border-slate-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="residential">Rezidenčná</SelectItem>
                        <SelectItem value="commercial">Komerčná</SelectItem>
                        <SelectItem value="industrial">Priemyselná</SelectItem>
                        <SelectItem value="infrastructure">Infraštruktúra</SelectItem>
                        <SelectItem value="renovation">Rekonštrukcia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="area" className="text-slate-700">Rozloha (m²)</Label>
                      <Input
                        id="area"
                        type="number"
                        value={formData.area}
                        onChange={(e) => handleInputChange('area', e.target.value)}
                        placeholder="800"
                        className="bg-white border-slate-300"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="floors" className="text-slate-700">Počet podlaží</Label>
                      <Input
                        id="floors"
                        type="number"
                        value={formData.floors}
                        onChange={(e) => handleInputChange('floors', e.target.value)}
                        placeholder="4"
                        className="bg-white border-slate-300"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="location" className="text-slate-700">Lokalita</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="Košice, Slovensko"
                      className="bg-white border-slate-300"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={generateMutation.isPending}
                    className="w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:shadow-lg hover:shadow-blue-500/50 text-lg py-6"
                  >
                    {generateMutation.isPending ? (
                      <>
                        <Loader className="w-5 h-5 mr-2 animate-spin" />
                        AI generuje harmonogram...
                      </>
                    ) : (
                      <>
                        <Clock className="w-5 h-5 mr-2" />
                        Generovať harmonogram
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >
            {result ? (
              <div className="space-y-6">
                <Card className="bg-gradient-to-br from-blue-50 to-violet-50 border-blue-200 border-2 shadow-xl">
                  <CardContent className="p-8">
                    <div className="text-center mb-6">
                      <div className="text-sm text-blue-600 font-semibold mb-2">CELKOVÉ TRVANIE</div>
                      <div className="text-6xl font-bold gradient-text mb-2">
                        {result.total_duration_weeks} týždňov
                      </div>
                      <div className="text-slate-600 text-lg">
                        {result.total_duration_months} mesiacov • {result.phases?.length || 0} fáz • {result.milestones?.length || 0} míľnikov
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-slate-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-slate-900 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-blue-600" />
                      Gantt Chart - Fázy projektu
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {result.phases?.map((phase, index) => {
                      const percentage = ((phase.end_week - phase.start_week) / result.total_duration_weeks) * 100;
                      const startPercentage = (phase.start_week / result.total_duration_weeks) * 100;
                      
                      return (
                        <div key={index} className="border border-slate-200 rounded-lg p-4 hover:border-blue-300 transition">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3 flex-1">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                                {index + 1}
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-slate-900">{phase.name}</h3>
                                <p className="text-sm text-slate-600">{phase.description}</p>
                              </div>
                            </div>
                            <div className="text-right flex-shrink-0 ml-4">
                              <div className="text-blue-600 font-bold">{phase.duration_weeks} týž.</div>
                              <div className="text-xs text-slate-500">T{phase.start_week} - T{phase.end_week}</div>
                            </div>
                          </div>
                          
                          <div className="relative h-8 bg-slate-100 rounded-full overflow-hidden mb-3">
                            <div 
                              className="absolute h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full"
                              style={{ 
                                left: `${startPercentage}%`, 
                                width: `${percentage}%` 
                              }}
                            ></div>
                          </div>

                          <div className="flex flex-wrap gap-2 text-xs">
                            <div className="flex items-center gap-1 px-2 py-1 bg-slate-100 rounded text-slate-700">
                              <span className="font-semibold">👷</span>
                              {phase.workers_count} pracovníkov
                            </div>
                            {phase.dependencies && phase.dependencies.length > 0 && (
                              <div className="px-2 py-1 bg-orange-100 text-orange-700 rounded">
                                Závislosti: {phase.dependencies.join(', ')}
                              </div>
                            )}
                          </div>

                          {phase.critical_points && phase.critical_points.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-slate-200">
                              <div className="text-xs font-semibold text-slate-700 mb-1">Kritické body:</div>
                              <ul className="text-xs text-slate-600 space-y-1">
                                {phase.critical_points.map((point, i) => (
                                  <li key={i} className="flex items-start gap-1">
                                    <span className="text-orange-500">⚠</span>
                                    {point}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>

                <Card className="bg-white border-slate-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-slate-900 flex items-center gap-2">
                      <Flag className="w-5 h-5 text-green-600" />
                      Kľúčové míľniky
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {result.milestones?.map((milestone, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <div className="font-semibold text-slate-900">{milestone.title}</div>
                          <div className="text-sm text-slate-600">{milestone.description}</div>
                        </div>
                        <div className="text-sm font-semibold text-green-700 flex-shrink-0">
                          Týždeň {milestone.week}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {result.critical_path && result.critical_path.length > 0 && (
                  <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200 shadow-md">
                    <CardHeader>
                      <CardTitle className="text-slate-900 text-lg flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-orange-600" />
                        Kritická cesta projektu
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {result.critical_path.map((item, index) => (
                          <div key={index} className="px-3 py-2 bg-white rounded-lg border border-orange-300 text-slate-900 font-medium text-sm">
                            {item}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {result.risk_factors && result.risk_factors.length > 0 && (
                  <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200 shadow-md">
                    <CardHeader>
                      <CardTitle className="text-slate-900 text-lg flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-yellow-600" />
                        Rizikové faktory
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {result.risk_factors.map((factor, index) => (
                        <div key={index} className="bg-white rounded-lg p-4 border border-yellow-200">
                          <div className="font-semibold text-slate-900 mb-1">{factor.risk}</div>
                          <div className="text-sm text-slate-600 mb-2">
                            <span className="font-medium">Dopad:</span> {factor.impact}
                          </div>
                          <div className="text-sm text-green-700 bg-green-50 px-3 py-2 rounded">
                            <span className="font-medium">Mitigácia:</span> {factor.mitigation}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {result.optimizations && result.optimizations.length > 0 && (
                  <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200 shadow-md">
                    <CardHeader>
                      <CardTitle className="text-slate-900 text-lg flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-cyan-600" />
                        Možnosti optimalizácie
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {result.optimizations.map((item, index) => (
                          <li key={index} className="flex items-start gap-2 text-slate-700">
                            <span className="text-cyan-600 font-bold mt-1">→</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                <div className="flex gap-4">
                  <Button className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                    <Download className="w-4 h-4 mr-2" />
                    Export Gantt Chart (PDF)
                  </Button>
                  <Button variant="outline" className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-50">
                    <Calendar className="w-4 h-4 mr-2" />
                    Save to Project
                  </Button>
                </div>
              </div>
            ) : (
              <Card className="bg-white border-slate-200 h-full flex items-center justify-center shadow-lg">
                <CardContent className="text-center p-12">
                  <Calendar className="w-20 h-20 mx-auto mb-6 text-slate-300" />
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">Pripravený generovať</h3>
                  <p className="text-slate-600 max-w-md">
                    Vyplň parametre a AI vytvorí detailný harmonogram s Gantt chart vizualizáciou, 
                    kritickou cestou a risk analýzou
                  </p>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}