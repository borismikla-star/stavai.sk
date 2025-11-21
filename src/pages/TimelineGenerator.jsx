import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Clock, Loader, Download, Calendar, CheckCircle } from 'lucide-react';
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
        prompt: `Ako expert na projektové riadenie stavebných projektov, vytvor realistický harmonogram pre projekt:

Typ stavby: ${data.building_type}
Rozloha: ${data.area} m²
Počet podlaží: ${data.floors}
Lokalita: ${data.location}

Vytvor detailný harmonogram s fázami projektu a míľnikmi pre CEE región (Slovensko/Česko).
Uvažuj štandardné stavebné procesy - príprava, výstavba, kolaudácia.
Zadaj realistické trvanie jednotlivých fáz v mesiacoch.`,
        response_json_schema: {
          type: "object",
          properties: {
            total_duration: { type: "number" },
            phases: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  duration: { type: "number" },
                  description: { type: "string" }
                }
              }
            },
            milestones: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  month: { type: "number" }
                }
              }
            },
            critical_path: { type: "string" }
          }
        }
      });

      const timeline = await base44.entities.Timeline.create({
        project_name: data.project_name,
        total_duration: response.total_duration,
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
    <div className="min-h-screen">
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
              <h1 className="text-4xl font-bold text-white">Timeline Generator</h1>
              <p className="text-slate-400">AI harmonogram projektu za minútu</p>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20">
            <span className="text-sm text-green-400 font-medium">✨ FREE TOOL</span>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="glass-effect border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Parametre projektu</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="project_name" className="text-slate-300">Názov projektu</Label>
                    <Input
                      id="project_name"
                      value={formData.project_name}
                      onChange={(e) => handleInputChange('project_name', e.target.value)}
                      placeholder="napr. Bytový dom Nové Mesto"
                      className="bg-slate-900 border-slate-700 text-white"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="building_type" className="text-slate-300">Typ stavby</Label>
                    <Select value={formData.building_type} onValueChange={(value) => handleInputChange('building_type', value)}>
                      <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
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
                      <Label htmlFor="area" className="text-slate-300">Rozloha (m²)</Label>
                      <Input
                        id="area"
                        type="number"
                        value={formData.area}
                        onChange={(e) => handleInputChange('area', e.target.value)}
                        placeholder="800"
                        className="bg-slate-900 border-slate-700 text-white"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="floors" className="text-slate-300">Počet podlaží</Label>
                      <Input
                        id="floors"
                        type="number"
                        value={formData.floors}
                        onChange={(e) => handleInputChange('floors', e.target.value)}
                        placeholder="4"
                        className="bg-slate-900 border-slate-700 text-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="location" className="text-slate-300">Lokalita</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="Košice, Slovensko"
                      className="bg-slate-900 border-slate-700 text-white"
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
          >
            {result ? (
              <div className="space-y-6">
                <Card className="glass-effect border-slate-800 border-2 border-blue-500/50 glow-effect">
                  <CardContent className="p-8 text-center">
                    <div className="text-sm text-blue-400 font-semibold mb-2">CELKOVÉ TRVANIE</div>
                    <div className="text-5xl font-bold gradient-text mb-2">
                      {result.total_duration} mes.
                    </div>
                    <div className="text-slate-400">
                      {result.phases?.length || 0} fáz • {result.milestones?.length || 0} míľnikov
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-effect border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white">Fázy projektu</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {result.phases?.map((phase, index) => (
                      <div key={index} className="border border-slate-700 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white text-sm font-bold">
                              {index + 1}
                            </div>
                            <div>
                              <h3 className="font-semibold text-white">{phase.name}</h3>
                              <p className="text-sm text-slate-400">{phase.description}</p>
                            </div>
                          </div>
                          <span className="text-blue-400 font-semibold">{phase.duration} mes.</span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="glass-effect border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white">Kľúčové míľniky</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {result.milestones?.map((milestone, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                        <div className="flex-1">
                          <span className="text-white">{milestone.title}</span>
                        </div>
                        <span className="text-sm text-slate-500">Mesiac {milestone.month}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {result.critical_path && (
                  <Card className="glass-effect border-slate-800">
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-white mb-2">Kritická cesta</h3>
                      <p className="text-sm text-slate-400">{result.critical_path}</p>
                    </CardContent>
                  </Card>
                )}

                <div className="flex gap-4">
                  <Button variant="outline" className="flex-1 border-slate-700 text-slate-300">
                    <Download className="w-4 h-4 mr-2" />
                    Export PDF
                  </Button>
                  <Button variant="outline" className="flex-1 border-slate-700 text-slate-300">
                    <Calendar className="w-4 h-4 mr-2" />
                    Uložiť
                  </Button>
                </div>
              </div>
            ) : (
              <Card className="glass-effect border-slate-800 h-full flex items-center justify-center">
                <CardContent className="text-center p-12">
                  <Calendar className="w-16 h-16 mx-auto mb-4 text-slate-600" />
                  <h3 className="text-xl font-bold text-white mb-2">Pripravený generovať</h3>
                  <p className="text-slate-400">
                    Vyplň parametre a AI vytvorí detailný harmonogram projektu
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