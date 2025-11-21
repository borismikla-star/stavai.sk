import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { DollarSign, Calculator, Loader, Download, Save, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
      // AI Cost Estimation using Core.InvokeLLM
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Ako expert na stavebné náklady, urob detailný odhad nákladov na stavbu s týmito parametrami:
        
Typ stavby: ${data.building_type}
Rozloha: ${data.area} m²
Počet podlaží: ${data.floors}
Lokalita: ${data.location}
Kvalita: ${data.quality}

Vygeneruj realistický odhad nákladov pre CEE region (Slovensko/Česko) v EUR. 
Rozdeľ náklady na: materiály, práca, vybavenie, povolenia, ostatné.
Uvažuj priemerné ceny pre rok 2025.`,
        response_json_schema: {
          type: "object",
          properties: {
            total_cost: { type: "number" },
            cost_per_sqm: { type: "number" },
            breakdown: {
              type: "object",
              properties: {
                materials: { type: "number" },
                labor: { type: "number" },
                equipment: { type: "number" },
                permits: { type: "number" },
                other: { type: "number" }
              }
            },
            confidence: { type: "number" },
            notes: { type: "string" }
          }
        }
      });

      // Save to database
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

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
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
              <h1 className="text-4xl font-bold text-white">Cost Estimator</h1>
              <p className="text-slate-400">AI-powered odhad nákladov na stavbu</p>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20">
            <span className="text-sm text-green-400 font-medium">✨ FREE TOOL</span>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="glass-effect border-slate-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-cyan-400" />
                  Parametre projektu
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="project_name" className="text-slate-300">Názov projektu</Label>
                    <Input
                      id="project_name"
                      value={formData.project_name}
                      onChange={(e) => handleInputChange('project_name', e.target.value)}
                      placeholder="napr. Rezidenčný komplex Staré Mesto"
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
                        placeholder="500"
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
                        placeholder="3"
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
                      placeholder="Bratislava, Slovensko"
                      className="bg-slate-900 border-slate-700 text-white"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="quality" className="text-slate-300">Kvalita výstavby</Label>
                    <Select value={formData.quality} onValueChange={(value) => handleInputChange('quality', value)}>
                      <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
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

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {result ? (
              <div className="space-y-6">
                {/* Total Cost */}
                <Card className="glass-effect border-slate-800 border-2 border-cyan-500/50 glow-effect">
                  <CardContent className="p-8 text-center">
                    <div className="text-sm text-cyan-400 font-semibold mb-2">CELKOVÉ NÁKLADY</div>
                    <div className="text-5xl font-bold gradient-text mb-2">
                      €{result.total_cost.toLocaleString()}
                    </div>
                    <div className="text-slate-400">
                      €{result.cost_per_sqm.toFixed(0)}/m² • {formData.area} m²
                    </div>
                  </CardContent>
                </Card>

                {/* Breakdown */}
                <Card className="glass-effect border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white">Rozpis nákladov</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Object.entries(result.breakdown).map(([key, value]) => {
                      const labels = {
                        materials: 'Materiály',
                        labor: 'Práca',
                        equipment: 'Vybavenie',
                        permits: 'Povolenia',
                        other: 'Ostatné'
                      };
                      const percentage = ((value / result.total_cost) * 100).toFixed(1);
                      return (
                        <div key={key}>
                          <div className="flex justify-between mb-2">
                            <span className="text-slate-300">{labels[key]}</span>
                            <span className="text-white font-semibold">€{value.toLocaleString()}</span>
                          </div>
                          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-slate-500 mt-1">{percentage}%</div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>

                {/* AI Confidence */}
                <Card className="glass-effect border-slate-800">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-slate-300">AI Confidence Score</span>
                      <span className="text-2xl font-bold gradient-text">{result.confidence}%</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-green-500 to-cyan-500"
                        style={{ width: `${result.confidence}%` }}
                      ></div>
                    </div>
                    {result.notes && (
                      <p className="text-sm text-slate-400 mt-4">{result.notes}</p>
                    )}
                  </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex gap-4">
                  <Button variant="outline" className="flex-1 border-slate-700 text-slate-300">
                    <Download className="w-4 h-4 mr-2" />
                    Export PDF
                  </Button>
                  <Button variant="outline" className="flex-1 border-slate-700 text-slate-300">
                    <Save className="w-4 h-4 mr-2" />
                    Uložiť
                  </Button>
                </div>
              </div>
            ) : (
              <Card className="glass-effect border-slate-800 h-full flex items-center justify-center">
                <CardContent className="text-center p-12">
                  <TrendingUp className="w-16 h-16 mx-auto mb-4 text-slate-600" />
                  <h3 className="text-xl font-bold text-white mb-2">Pripravený na odhad</h3>
                  <p className="text-slate-400">
                    Vyplň parametre projektu a AI vygeneruje detailný odhad nákladov
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