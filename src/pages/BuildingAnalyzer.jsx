import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Building2, Loader, Upload, Zap, AlertCircle, TrendingUp, CheckCircle, Home } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export default function BuildingAnalyzer() {
  const [formData, setFormData] = useState({
    building_name: '',
    address: '',
    year_built: '',
    building_type: 'residential',
    area: '',
    floors: '',
    current_condition: 'average',
    additional_notes: ''
  });

  const [result, setResult] = useState(null);

  const analyzeMutation = useMutation({
    mutationFn: async (data) => {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Ako expert na stavebné inšpekcie a real estate valuation v CEE regióne, urob kompletnú analýzu budovy:

Názov: ${data.building_name}
Adresa: ${data.address}
Rok výstavby: ${data.year_built}
Typ: ${data.building_type}
Rozloha: ${data.area} m²
Počet podlaží: ${data.floors}
Aktuálny stav: ${data.current_condition}
Poznámky: ${data.additional_notes}

ANALÝZA:

1. STAVEBNÝ STAV (1-10):
- Konštrukcia a nosné prvky
- Strecha a fasáda
- Okná a dvere
- Vnútorné priestory
- Inštalácie (elektroinštalácia, vykurovanie, voda)

2. ENERGETICKÁ EFEKTÍVNOSŤ:
- Odhad energetickej triedy (A-G)
- Ročná spotreba energie
- Potenciál pre zníženie nákladov
- Odporúčania pre zlepšenie

3. RENOVATION POTENCIÁL:
- Nutné okamžité opravy
- Krátkodobé zlepšenia (1-2 roky)
- Dlhodobé investície (3-5 rokov)
- Odhad nákladov na renovations

4. VALUE ESTIMATION:
- Current market value
- Value after basic renovation
- Value after full modernization
- ROI na renovation investície

5. ODPORÚČANIA:
- Priority pre opravy
- Možnosti modernizácie
- Investment opportunities
- Potenciálne problémy

Použij realistické odhady pre CEE trh 2025.`,
        response_json_schema: {
          type: "object",
          properties: {
            overall_score: { type: "number" },
            condition_assessment: {
              type: "object",
              properties: {
                structure: { type: "number" },
                roof_facade: { type: "number" },
                windows_doors: { type: "number" },
                interior: { type: "number" },
                installations: { type: "number" }
              }
            },
            energy_efficiency: {
              type: "object",
              properties: {
                energy_class: { type: "string" },
                yearly_consumption_kwh: { type: "number" },
                savings_potential: { type: "number" },
                improvement_suggestions: { type: "array", items: { type: "string" } }
              }
            },
            renovation_potential: {
              type: "object",
              properties: {
                immediate_repairs: { type: "array", items: { type: "string" } },
                short_term: { type: "array", items: { type: "string" } },
                long_term: { type: "array", items: { type: "string" } },
                estimated_costs: {
                  type: "object",
                  properties: {
                    immediate: { type: "number" },
                    short_term: { type: "number" },
                    long_term: { type: "number" }
                  }
                }
              }
            },
            value_estimation: {
              type: "object",
              properties: {
                current_value: { type: "number" },
                after_basic_renovation: { type: "number" },
                after_full_modernization: { type: "number" },
                renovation_roi: { type: "number" }
              }
            },
            recommendations: { type: "array", items: { type: "string" } },
            potential_issues: { type: "array", items: { type: "string" } },
            summary: { type: "string" }
          }
        }
      });

      return response;
    },
    onSuccess: (data) => {
      setResult(data);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    analyzeMutation.mutate(formData);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
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
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900">Building Analyzer</h1>
              <p className="text-slate-600">AI analýza existujúcich budov - stav, energetika, renovation potenciál</p>
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
                  <Home className="w-5 h-5 text-orange-600" />
                  Informácie o budove
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="building_name" className="text-slate-700">Názov budovy</Label>
                    <Input
                      id="building_name"
                      value={formData.building_name}
                      onChange={(e) => handleInputChange('building_name', e.target.value)}
                      placeholder="napr. Bytový dom Nová Doba"
                      className="bg-white border-slate-300"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="address" className="text-slate-700">Adresa</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Hlavná 123, Bratislava"
                      className="bg-white border-slate-300"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="year_built" className="text-slate-700">Rok výstavby</Label>
                      <Input
                        id="year_built"
                        type="number"
                        value={formData.year_built}
                        onChange={(e) => handleInputChange('year_built', e.target.value)}
                        placeholder="1985"
                        className="bg-white border-slate-300"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="building_type" className="text-slate-700">Typ budovy</Label>
                      <Select value={formData.building_type} onValueChange={(value) => handleInputChange('building_type', value)}>
                        <SelectTrigger className="bg-white border-slate-300">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="residential">Rezidenčná</SelectItem>
                          <SelectItem value="commercial">Komerčná</SelectItem>
                          <SelectItem value="industrial">Priemyselná</SelectItem>
                          <SelectItem value="mixed">Mixed-use</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="area" className="text-slate-700">Rozloha (m²)</Label>
                      <Input
                        id="area"
                        type="number"
                        value={formData.area}
                        onChange={(e) => handleInputChange('area', e.target.value)}
                        placeholder="1200"
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
                        placeholder="5"
                        className="bg-white border-slate-300"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="current_condition" className="text-slate-700">Aktuálny stav</Label>
                    <Select value={formData.current_condition} onValueChange={(value) => handleInputChange('current_condition', value)}>
                      <SelectTrigger className="bg-white border-slate-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excellent">Výborný</SelectItem>
                        <SelectItem value="good">Dobrý</SelectItem>
                        <SelectItem value="average">Priemerný</SelectItem>
                        <SelectItem value="poor">Zlý</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="additional_notes" className="text-slate-700">Dodatočné poznámky</Label>
                    <Textarea
                      id="additional_notes"
                      value={formData.additional_notes}
                      onChange={(e) => handleInputChange('additional_notes', e.target.value)}
                      placeholder="Špecifické problémy, nedávne opravy, plány..."
                      className="bg-white border-slate-300 h-24"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={analyzeMutation.isPending}
                    className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:shadow-lg hover:shadow-orange-500/50 text-lg py-6"
                  >
                    {analyzeMutation.isPending ? (
                      <>
                        <Loader className="w-5 h-5 mr-2 animate-spin" />
                        AI analyzuje budovu...
                      </>
                    ) : (
                      <>
                        <Building2 className="w-5 h-5 mr-2" />
                        Analyzovať budovu
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
                <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200 border-2 shadow-xl">
                  <CardContent className="p-8 text-center">
                    <div className="text-sm text-orange-600 font-semibold mb-2">OVERALL SCORE</div>
                    <div className={`text-6xl font-bold mb-2 ${getScoreColor(result.overall_score || 0)}`}>
                      {(result.overall_score || 0).toFixed(1)}/10
                    </div>
                    <p className="text-slate-600">
                      {result.overall_score >= 8 && 'Výborný stav - minimálne investície potrebné'}
                      {result.overall_score >= 6 && result.overall_score < 8 && 'Dobrý stav - štandardná údržba postačuje'}
                      {result.overall_score < 6 && 'Vyžaduje pozornosť - odporúčame renovations'}
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white border-slate-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-slate-900">Stavebný stav - detailné hodnotenie</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Object.entries(result.condition_assessment || {}).map(([key, value]) => {
                      const labels = {
                        structure: 'Konštrukcia',
                        roof_facade: 'Strecha & Fasáda',
                        windows_doors: 'Okná & Dvere',
                        interior: 'Interiér',
                        installations: 'Inštalácie'
                      };
                      return (
                        <div key={key} className="flex items-center gap-4">
                          <div className="flex-1">
                            <div className="flex justify-between mb-2">
                              <span className="text-slate-700 font-medium">{labels[key]}</span>
                              <span className={`font-bold ${getScoreColor(value)}`}>{value}/10</span>
                            </div>
                            <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${value >= 8 ? 'bg-green-500' : value >= 6 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                style={{ width: `${value * 10}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>

                <Card className="bg-white border-slate-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-slate-900 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-yellow-600" />
                      Energetická efektívnosť
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg border border-yellow-200">
                        <div className="text-sm text-slate-600 mb-1">Energetická trieda</div>
                        <div className="text-3xl font-bold text-yellow-700">{result.energy_efficiency?.energy_class || 'N/A'}</div>
                      </div>
                      <div className="text-center p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="text-sm text-slate-600 mb-1">Ročná spotreba</div>
                        <div className="text-2xl font-bold text-slate-900">{result.energy_efficiency?.yearly_consumption_kwh?.toLocaleString() || '0'} kWh</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="text-sm text-slate-600 mb-1">Potenciál úspor</div>
                        <div className="text-2xl font-bold text-green-600">{result.energy_efficiency?.savings_potential || 0}%</div>
                      </div>
                    </div>
                    {result.energy_efficiency?.improvement_suggestions?.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-2">Návrhy na zlepšenie:</h4>
                        <ul className="space-y-1">
                          {result.energy_efficiency.improvement_suggestions.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                              <TrendingUp className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-white border-slate-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-slate-900">Renovation Plán & Náklady</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                        <div className="text-sm font-semibold text-red-600 mb-2">Okamžité opravy</div>
                        <div className="text-2xl font-bold text-red-700 mb-2">
                          €{result.renovation_potential?.estimated_costs?.immediate?.toLocaleString() || '0'}
                        </div>
                        <ul className="text-xs space-y-1">
                          {result.renovation_potential?.immediate_repairs?.slice(0, 3).map((item, i) => (
                            <li key={i} className="text-slate-700">• {item}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                        <div className="text-sm font-semibold text-yellow-600 mb-2">Krátkodobé (1-2r)</div>
                        <div className="text-2xl font-bold text-yellow-700 mb-2">
                          €{result.renovation_potential?.estimated_costs?.short_term?.toLocaleString() || '0'}
                        </div>
                        <ul className="text-xs space-y-1">
                          {result.renovation_potential?.short_term?.slice(0, 3).map((item, i) => (
                            <li key={i} className="text-slate-700">• {item}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="text-sm font-semibold text-blue-600 mb-2">Dlhodobé (3-5r)</div>
                        <div className="text-2xl font-bold text-blue-700 mb-2">
                          €{result.renovation_potential?.estimated_costs?.long_term?.toLocaleString() || '0'}
                        </div>
                        <ul className="text-xs space-y-1">
                          {result.renovation_potential?.long_term?.slice(0, 3).map((item, i) => (
                            <li key={i} className="text-slate-700">• {item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-slate-900">Value Estimation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-3 border-b border-green-200">
                        <span className="text-slate-700">Current Market Value</span>
                        <span className="text-2xl font-bold text-slate-900">€{result.value_estimation?.current_value?.toLocaleString() || '0'}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-green-200">
                        <span className="text-slate-700">After Basic Renovation</span>
                        <span className="text-2xl font-bold text-green-600">€{result.value_estimation?.after_basic_renovation?.toLocaleString() || '0'}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-green-200">
                        <span className="text-slate-700">After Full Modernization</span>
                        <span className="text-2xl font-bold text-emerald-600">€{result.value_estimation?.after_full_modernization?.toLocaleString() || '0'}</span>
                      </div>
                      <div className="bg-white rounded-lg p-4 mt-4">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-700 font-semibold">Renovation ROI</span>
                          <span className="text-3xl font-bold gradient-text">{(result.value_estimation?.renovation_roi || 0).toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-md">
                    <CardHeader>
                      <CardTitle className="text-slate-900 text-lg flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-blue-600" />
                        Odporúčania
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {result.recommendations?.map((item, index) => (
                          <li key={index} className="flex items-start gap-2 text-slate-700">
                            <span className="text-blue-600 font-bold mt-1">→</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-200 shadow-md">
                    <CardHeader>
                      <CardTitle className="text-slate-900 text-lg flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                        Potenciálne problémy
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {result.potential_issues?.map((item, index) => (
                          <li key={index} className="flex items-start gap-2 text-slate-700">
                            <span className="text-red-600 font-bold mt-1">⚠</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                {result.summary && (
                  <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-slate-300 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-slate-900">Zhrnutie analýzy</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-700 leading-relaxed">{result.summary}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <Card className="bg-white border-slate-200 h-full flex items-center justify-center shadow-lg">
                <CardContent className="text-center p-12">
                  <Building2 className="w-20 h-20 mx-auto mb-6 text-slate-300" />
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">Pripravený analyzovať</h3>
                  <p className="text-slate-600 max-w-md">
                    Zadaj informácie o budove a AI vytvorí kompletnú analýzu stavebného stavu, 
                    energetickej efektívnosti a renovation potenciálu
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