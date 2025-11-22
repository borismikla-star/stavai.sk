import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { DollarSign, Calculator, Loader, Download, Save, TrendingUp, AlertCircle, BarChart3, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

export default function CostEstimator() {
  const [formData, setFormData] = useState({
    project_name: '',
    building_type: 'residential',
    area: '',
    floors: '',
    location: '',
    quality: 'standard'
  });

  const [result, setResult] = useState(null);

  const estimateMutation = useMutation({
    mutationFn: async (data) => {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Ako expert na stavebné náklady v CEE regióne, urob ultra-detailný odhad nákladov pre projekt:

Typ stavby: ${data.building_type}
Rozloha: ${data.area} m²
Počet podlaží: ${data.floors}
Lokalita: ${data.location}
Kvalita: ${data.quality}

Vygeneruj realistický odhad nákladov pre CEE region (Slovensko/Česko) v EUR s cenami 2025.

Hlavné kategórie nákladov:
1. Materiály - rozdeľ na: beton/oceľ, murivo/tehly, izolácie, omietky/sadrokartón, okná/dvere, podlahy, strecha, fasáda
2. Práca - rozdeľ na: hrubá stavba, dokončovacie práce, inštalácie, špeciálne práce
3. Vybavenie - rozdeľ na: vykurovanie/chladenie, elektroinštalácia, voda/kanalizácia, vzduchotechnika
4. Povolenia a služby - stavebné povolenie, projektová dokumentácia, geodézia, dozor
5. Ostatné - rezerva, manipulácia, odpady, dočasné zariadenia

Pridaj aj:
- Regional multiplier (napr. Bratislava vs ostatné mestá)
- Quality multiplier pre standard/premium/luxury
- Možné úspory a odporúčania`,
        response_json_schema: {
          type: "object",
          properties: {
            total_cost: { type: "number" },
            cost_per_sqm: { type: "number" },
            breakdown: {
              type: "object",
              properties: {
                materials: {
                  type: "object",
                  properties: {
                    concrete_steel: { type: "number" },
                    masonry_bricks: { type: "number" },
                    insulation: { type: "number" },
                    plaster_drywall: { type: "number" },
                    windows_doors: { type: "number" },
                    flooring: { type: "number" },
                    roofing: { type: "number" },
                    facade: { type: "number" }
                  }
                },
                labor: {
                  type: "object",
                  properties: {
                    rough_construction: { type: "number" },
                    finishing_works: { type: "number" },
                    installations: { type: "number" },
                    specialized_work: { type: "number" }
                  }
                },
                equipment: {
                  type: "object",
                  properties: {
                    hvac: { type: "number" },
                    electrical: { type: "number" },
                    plumbing: { type: "number" },
                    ventilation: { type: "number" }
                  }
                },
                permits_services: {
                  type: "object",
                  properties: {
                    building_permit: { type: "number" },
                    project_documentation: { type: "number" },
                    geodesy: { type: "number" },
                    supervision: { type: "number" }
                  }
                },
                other: {
                  type: "object",
                  properties: {
                    reserve: { type: "number" },
                    logistics: { type: "number" },
                    waste: { type: "number" },
                    temporary_facilities: { type: "number" }
                  }
                }
              }
            },
            multipliers: {
              type: "object",
              properties: {
                regional: { type: "number" },
                quality: { type: "number" }
              }
            },
            confidence: { type: "number" },
            notes: { type: "string" },
            savings_opportunities: { type: "array", items: { type: "string" } },
            recommendations: { type: "array", items: { type: "string" } }
          }
        }
      });

      const estimate = await base44.entities.CostEstimate.create({
        project_name: data.project_name,
        building_type: data.building_type,
        area: parseFloat(data.area),
        floors: parseInt(data.floors),
        location: data.location,
        quality: data.quality,
        total_cost: response.total_cost,
        cost_per_sqm: response.cost_per_sqm,
        breakdown: response.breakdown,
        ai_confidence: response.confidence
      });

      return { ...response, estimate_id: estimate.id };
    },
    onSuccess: (data) => {
      setResult(data);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    estimateMutation.mutate(formData);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getCategoryTotal = (category) => {
    if (!result?.breakdown?.[category]) return 0;
    return Object.values(result.breakdown[category]).reduce((sum, val) => sum + val, 0);
  };

  const mainCategories = result ? [
    { name: 'Materiály', value: getCategoryTotal('materials'), color: '#3B82F6' },
    { name: 'Práca', value: getCategoryTotal('labor'), color: '#8B5CF6' },
    { name: 'Vybavenie', value: getCategoryTotal('equipment'), color: '#06B6D4' },
    { name: 'Povolenia', value: getCategoryTotal('permits_services'), color: '#F59E0B' },
    { name: 'Ostatné', value: getCategoryTotal('other'), color: '#64748B' }
  ] : [];

  const getMaterialsData = () => {
    if (!result?.breakdown?.materials) return [];
    const labels = {
      concrete_steel: 'Beton/Oceľ',
      masonry_bricks: 'Murivo',
      insulation: 'Izolácie',
      plaster_drywall: 'Omietky',
      windows_doors: 'Okná/Dvere',
      flooring: 'Podlahy',
      roofing: 'Strecha',
      facade: 'Fasáda'
    };
    return Object.entries(result.breakdown.materials).map(([key, value]) => ({
      name: labels[key] || key,
      value: value
    }));
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
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
              <DollarSign className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900">Cost Estimator</h1>
              <p className="text-slate-600">AI-powered detailný odhad stavebných nákladov</p>
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
                  <Calculator className="w-5 h-5 text-cyan-600" />
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
                      placeholder="napr. Rezidenčný komplex Staré Mesto"
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
                        placeholder="500"
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
                        placeholder="3"
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
                      placeholder="Bratislava, Slovensko"
                      className="bg-white border-slate-300"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="quality" className="text-slate-700">Kvalita výstavby</Label>
                    <Select value={formData.quality} onValueChange={(value) => handleInputChange('quality', value)}>
                      <SelectTrigger className="bg-white border-slate-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                        <SelectItem value="luxury">Luxury</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    type="submit"
                    disabled={estimateMutation.isPending}
                    className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:shadow-lg hover:shadow-cyan-500/50 text-lg py-6"
                  >
                    {estimateMutation.isPending ? (
                      <>
                        <Loader className="w-5 h-5 mr-2 animate-spin" />
                        AI spracováva...
                      </>
                    ) : (
                      <>
                        <Calculator className="w-5 h-5 mr-2" />
                        Vypočítať náklady
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
                <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200 border-2 shadow-xl">
                  <CardContent className="p-8 text-center">
                    <div className="text-sm text-cyan-600 font-semibold mb-2">CELKOVÉ NÁKLADY</div>
                    <div className="text-6xl font-bold gradient-text mb-2">
                      €{result.total_cost.toLocaleString()}
                    </div>
                    <div className="text-slate-600 text-lg">
                      €{result.cost_per_sqm.toFixed(0)}/m² • {formData.area} m²
                    </div>
                    {result.multipliers && (
                      <div className="flex gap-4 justify-center mt-4 text-sm">
                        <div className="px-3 py-1 bg-white rounded-full text-slate-600">
                          Regional: {(result.multipliers.regional * 100).toFixed(0)}%
                        </div>
                        <div className="px-3 py-1 bg-white rounded-full text-slate-600">
                          Quality: {(result.multipliers.quality * 100).toFixed(0)}%
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-white border-slate-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-slate-900 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-blue-600" />
                      Hlavné kategórie nákladov
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={mainCategories}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {mainCategories.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `€${value.toLocaleString()}`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="bg-white border-slate-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-slate-900">Detailný rozpis materiálov</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={getMaterialsData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                        <YAxis />
                        <Tooltip formatter={(value) => `€${value.toLocaleString()}`} />
                        <Bar dataKey="value" fill="#3B82F6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {result.breakdown && (
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card className="bg-white border-slate-200 shadow-md">
                      <CardHeader>
                        <CardTitle className="text-slate-900 text-lg">Práca</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {Object.entries(result.breakdown.labor || {}).map(([key, value]) => {
                          const labels = {
                            rough_construction: 'Hrubá stavba',
                            finishing_works: 'Dokončovacie práce',
                            installations: 'Inštalácie',
                            specialized_work: 'Špeciálne práce'
                          };
                          return (
                            <div key={key} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
                              <span className="text-slate-700">{labels[key]}</span>
                              <span className="font-semibold text-slate-900">€{value.toLocaleString()}</span>
                            </div>
                          );
                        })}
                      </CardContent>
                    </Card>

                    <Card className="bg-white border-slate-200 shadow-md">
                      <CardHeader>
                        <CardTitle className="text-slate-900 text-lg">Vybavenie</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {Object.entries(result.breakdown.equipment || {}).map(([key, value]) => {
                          const labels = {
                            hvac: 'Vykurovanie/Chladenie',
                            electrical: 'Elektroinštalácia',
                            plumbing: 'Voda/Kanalizácia',
                            ventilation: 'Vzduchotechnika'
                          };
                          return (
                            <div key={key} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
                              <span className="text-slate-700">{labels[key]}</span>
                              <span className="font-semibold text-slate-900">€{value.toLocaleString()}</span>
                            </div>
                          );
                        })}
                      </CardContent>
                    </Card>
                  </div>
                )}

                <Card className="bg-white border-slate-200 shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-slate-700 font-semibold">AI Confidence Score</span>
                      <span className="text-3xl font-bold gradient-text">{result.confidence}%</span>
                    </div>
                    <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-green-500 to-cyan-500"
                        style={{ width: `${result.confidence}%` }}
                      ></div>
                    </div>
                  </CardContent>
                </Card>

                {result.savings_opportunities && result.savings_opportunities.length > 0 && (
                  <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-md">
                    <CardHeader>
                      <CardTitle className="text-slate-900 text-lg flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                        Možnosti úspor
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {result.savings_opportunities.map((item, index) => (
                          <li key={index} className="flex items-start gap-2 text-slate-700">
                            <span className="text-green-600 font-bold mt-1">↓</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {result.recommendations && result.recommendations.length > 0 && (
                  <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-md">
                    <CardHeader>
                      <CardTitle className="text-slate-900 text-lg flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-blue-600" />
                        Odporúčania
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {result.recommendations.map((item, index) => (
                          <li key={index} className="flex items-start gap-2 text-slate-700">
                            <span className="text-blue-600 font-bold mt-1">→</span>
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
                    Export PDF Report
                  </Button>
                  <Button variant="outline" className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-50">
                    <FileText className="w-4 h-4 mr-2" />
                    Save to Project
                  </Button>
                </div>
              </div>
            ) : (
              <Card className="bg-white border-slate-200 h-full flex items-center justify-center shadow-lg">
                <CardContent className="text-center p-12">
                  <TrendingUp className="w-20 h-20 mx-auto mb-6 text-slate-300" />
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">Pripravený na odhad</h3>
                  <p className="text-slate-600 max-w-md">
                    Vyplň parametre projektu a AI vygeneruje ultra-detailný odhad nákladov 
                    s rozdelením do kategórií, grafmi a odporúčaniami
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