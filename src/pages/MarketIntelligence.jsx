import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Brain, Loader, MapPin, TrendingUp, AlertCircle, Target, DollarSign, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function MarketIntelligence() {
  const [formData, setFormData] = useState({
    location: '',
    property_type: 'residential',
    analysis_scope: 'comprehensive'
  });

  const [result, setResult] = useState(null);

  const analyzeMutation = useMutation({
    mutationFn: async (data) => {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Ako senior real estate market analyst pre CEE región, urob kompletnú market intelligence analýzu:

Lokalita: ${data.location}
Typ nehnuteľnosti: ${data.property_type}
Rozsah analýzy: ${data.analysis_scope}

MARKET INTELLIGENCE REPORT 2025:

1. CENOVÉ TRENDY (2020-2025):
- Historický vývoj cien (ročný)
- Current average price per m²
- Year-over-year growth rate
- 3-year projection (2025-2028)

2. DEMAND FORECASTING:
- Current demand level (high/medium/low)
- Supply vs Demand balance
- Vacancy rates
- Time to sell/rent average
- Future demand outlook

3. COMPETITOR ANALYSIS:
- Key developers in area
- Recent major projects
- Pipeline projects (upcoming)
- Market share leaders
- Competitive positioning

4. LOCATION SCORING (1-10):
- Accessibility & Transport
- Infrastructure & Amenities
- Economic activity
- Demographics & Population growth
- Investment potential

5. INVESTMENT HOTSPOTS:
- Top 3 micro-locations for investment
- Emerging neighborhoods
- Gentrification areas
- Price appreciation potential

6. MARKET RISKS:
- Oversupply risk
- Economic factors
- Regulatory changes
- Market saturation

7. KEY INSIGHTS & RECOMMENDATIONS

Použij aktuálne dáta pre CEE trh 2025, SK/CZ/PL focus.`,
        response_json_schema: {
          type: "object",
          properties: {
            price_trends: {
              type: "object",
              properties: {
                historical_data: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      year: { type: "number" },
                      avg_price_per_sqm: { type: "number" }
                    }
                  }
                },
                current_avg_price: { type: "number" },
                yoy_growth: { type: "number" },
                projection_2026: { type: "number" },
                projection_2027: { type: "number" },
                projection_2028: { type: "number" }
              }
            },
            demand_forecast: {
              type: "object",
              properties: {
                demand_level: { type: "string", enum: ["high", "medium", "low"] },
                supply_demand_balance: { type: "string" },
                vacancy_rate: { type: "number" },
                avg_time_to_sell_days: { type: "number" },
                future_outlook: { type: "string" }
              }
            },
            competitor_analysis: {
              type: "object",
              properties: {
                key_developers: { type: "array", items: { type: "string" } },
                recent_projects: { type: "array", items: { type: "string" } },
                pipeline_projects: { type: "array", items: { type: "string" } },
                market_leaders: { type: "array", items: { type: "string" } }
              }
            },
            location_score: {
              type: "object",
              properties: {
                accessibility: { type: "number" },
                infrastructure: { type: "number" },
                economic_activity: { type: "number" },
                demographics: { type: "number" },
                investment_potential: { type: "number" },
                overall_score: { type: "number" }
              }
            },
            investment_hotspots: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  description: { type: "string" },
                  potential_score: { type: "number" }
                }
              }
            },
            market_risks: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  risk: { type: "string" },
                  severity: { type: "string", enum: ["low", "medium", "high"] },
                  mitigation: { type: "string" }
                }
              }
            },
            key_insights: { type: "array", items: { type: "string" } },
            recommendations: { type: "array", items: { type: "string" } },
            executive_summary: { type: "string" }
          }
        },
        add_context_from_internet: true
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

  const getRiskColor = (severity) => {
    if (severity === 'low') return 'bg-green-100 text-green-700 border-green-200';
    if (severity === 'medium') return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    return 'bg-red-100 text-red-700 border-red-200';
  };

  const getDemandColor = (level) => {
    if (level === 'high') return 'text-green-600';
    if (level === 'medium') return 'text-yellow-600';
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
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900">Market Intelligence</h1>
              <p className="text-slate-600">Real estate market insights, cenové trendy a predikcie pre CEE</p>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20">
            <span className="text-sm text-violet-600 font-medium">⭐ PRO TOOL - Stavai.sk</span>
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
                  <MapPin className="w-5 h-5 text-indigo-600" />
                  Market Parameters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="location" className="text-slate-700">Lokalita / Mesto</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="napr. Bratislava - Staré Mesto"
                      className="bg-white border-slate-300"
                      required
                    />
                    <p className="text-xs text-slate-500 mt-1">Zadaj konkrétne mesto alebo mestskú časť</p>
                  </div>

                  <div>
                    <Label htmlFor="property_type" className="text-slate-700">Typ nehnuteľnosti</Label>
                    <Select value={formData.property_type} onValueChange={(value) => handleInputChange('property_type', value)}>
                      <SelectTrigger className="bg-white border-slate-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="residential">Rezidenčné byty</SelectItem>
                        <SelectItem value="houses">Rodinné domy</SelectItem>
                        <SelectItem value="commercial">Komerčné priestory</SelectItem>
                        <SelectItem value="office">Kancelárske budovy</SelectItem>
                        <SelectItem value="industrial">Industriálne areály</SelectItem>
                        <SelectItem value="land">Pozemky</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="analysis_scope" className="text-slate-700">Rozsah analýzy</Label>
                    <Select value={formData.analysis_scope} onValueChange={(value) => handleInputChange('analysis_scope', value)}>
                      <SelectTrigger className="bg-white border-slate-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="quick">Quick Overview</SelectItem>
                        <SelectItem value="comprehensive">Comprehensive Analysis</SelectItem>
                        <SelectItem value="deep_dive">Deep Dive + Forecasting</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    type="submit"
                    disabled={analyzeMutation.isPending}
                    className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:shadow-lg hover:shadow-indigo-500/50 text-lg py-6"
                  >
                    {analyzeMutation.isPending ? (
                      <>
                        <Loader className="w-5 h-5 mr-2 animate-spin" />
                        AI zbiera market data...
                      </>
                    ) : (
                      <>
                        <Brain className="w-5 h-5 mr-2" />
                        Analyzovať trh
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
                <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200 border-2 shadow-xl">
                  <CardContent className="p-8">
                    <div className="grid grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="text-sm text-indigo-600 font-semibold mb-2">Current Price</div>
                        <div className="text-3xl font-bold text-slate-900">
                          €{result.price_trends?.current_avg_price?.toLocaleString() || '0'}/m²
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-indigo-600 font-semibold mb-2">YoY Growth</div>
                        <div className={`text-3xl font-bold ${(result.price_trends?.yoy_growth || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {(result.price_trends?.yoy_growth || 0) >= 0 ? '+' : ''}{(result.price_trends?.yoy_growth || 0).toFixed(1)}%
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-indigo-600 font-semibold mb-2">Demand</div>
                        <div className={`text-2xl font-bold uppercase ${getDemandColor(result.demand_forecast?.demand_level)}`}>
                          {result.demand_forecast?.demand_level}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-slate-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-slate-900 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                      Cenové trendy & Predikcia
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={result.price_trends?.historical_data || []}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis label={{ value: 'EUR/m²', angle: -90, position: 'insideLeft' }} />
                        <Tooltip formatter={(value) => `€${value.toLocaleString()}/m²`} />
                        <Legend />
                        <Line type="monotone" dataKey="avg_price_per_sqm" name="Priemerná cena" stroke="#3B82F6" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                    <div className="grid grid-cols-3 gap-4 mt-6">
                      <div className="bg-blue-50 rounded-lg p-3 text-center border border-blue-200">
                        <div className="text-xs text-blue-600 mb-1">2026 Predikcia</div>
                        <div className="text-lg font-bold text-blue-700">€{result.price_trends?.projection_2026?.toLocaleString() || '0'}/m²</div>
                      </div>
                      <div className="bg-indigo-50 rounded-lg p-3 text-center border border-indigo-200">
                        <div className="text-xs text-indigo-600 mb-1">2027 Predikcia</div>
                        <div className="text-lg font-bold text-indigo-700">€{result.price_trends?.projection_2027?.toLocaleString() || '0'}/m²</div>
                      </div>
                      <div className="bg-violet-50 rounded-lg p-3 text-center border border-violet-200">
                        <div className="text-xs text-violet-600 mb-1">2028 Predikcia</div>
                        <div className="text-lg font-bold text-violet-700">€{result.price_trends?.projection_2028?.toLocaleString() || '0'}/m²</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-slate-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-slate-900">Demand Forecast</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-50 rounded-lg">
                        <div className="text-sm text-slate-600 mb-1">Supply vs Demand</div>
                        <div className="text-lg font-semibold text-slate-900">{result.demand_forecast?.supply_demand_balance}</div>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-lg">
                        <div className="text-sm text-slate-600 mb-1">Vacancy Rate</div>
                        <div className="text-lg font-semibold text-slate-900">{result.demand_forecast?.vacancy_rate || 0}%</div>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-lg">
                        <div className="text-sm text-slate-600 mb-1">Avg Time to Sell</div>
                        <div className="text-lg font-semibold text-slate-900">{result.demand_forecast?.avg_time_to_sell_days || 0} dní</div>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-lg">
                        <div className="text-sm text-slate-600 mb-1">Future Outlook</div>
                        <div className="text-lg font-semibold text-slate-900">{result.demand_forecast?.future_outlook}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-slate-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-slate-900 flex items-center gap-2">
                      <Target className="w-5 h-5 text-orange-600" />
                      Location Score
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-6">
                      <div className="text-5xl font-bold gradient-text mb-2">
                        {(result.location_score?.overall_score || 0).toFixed(1)}/10
                      </div>
                      <p className="text-slate-600">Overall Investment Score</p>
                    </div>
                    <div className="space-y-3">
                      {Object.entries(result.location_score || {}).filter(([key]) => key !== 'overall_score').map(([key, value]) => {
                        const labels = {
                          accessibility: 'Dostupnosť & Doprava',
                          infrastructure: 'Infraštruktúra',
                          economic_activity: 'Ekonomická aktivita',
                          demographics: 'Demografia',
                          investment_potential: 'Investment Potenciál'
                        };
                        return (
                          <div key={key}>
                            <div className="flex justify-between mb-1">
                              <span className="text-slate-700 text-sm">{labels[key]}</span>
                              <span className="font-bold text-slate-900">{value}/10</span>
                            </div>
                            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-indigo-500 to-blue-500"
                                style={{ width: `${value * 10}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-slate-900 flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      Investment Hotspots
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {result.investment_hotspots?.map((hotspot, index) => (
                      <div key={index} className="bg-white rounded-lg p-4 border border-green-200">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-slate-900">{hotspot.name}</h4>
                          <div className="text-green-600 font-bold">{hotspot.potential_score}/10</div>
                        </div>
                        <p className="text-sm text-slate-600">{hotspot.description}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="bg-white border-slate-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-slate-900 flex items-center gap-2">
                      <Users className="w-5 h-5 text-purple-600" />
                      Competitor Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2">Key Developers</h4>
                      <div className="flex flex-wrap gap-2">
                        {result.competitor_analysis?.key_developers?.map((dev, i) => (
                          <span key={i} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">{dev}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2">Recent Projects</h4>
                      <ul className="space-y-1 text-sm text-slate-700">
                        {result.competitor_analysis?.recent_projects?.map((proj, i) => (
                          <li key={i}>• {proj}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2">Pipeline (Upcoming)</h4>
                      <ul className="space-y-1 text-sm text-slate-700">
                        {result.competitor_analysis?.pipeline_projects?.map((proj, i) => (
                          <li key={i}>• {proj}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {result.market_risks && result.market_risks.length > 0 && (
                  <Card className="bg-white border-slate-200 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-slate-900 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-yellow-600" />
                        Market Risks
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {result.market_risks.map((risk, index) => (
                        <div key={index} className="border border-slate-200 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-slate-900">{risk.risk}</h4>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getRiskColor(risk.severity)}`}>
                              {risk.severity.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 mb-2">
                            <span className="font-medium">Mitigácia:</span> {risk.mitigation}
                          </p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-md">
                    <CardHeader>
                      <CardTitle className="text-slate-900 text-lg">Key Insights</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {result.key_insights?.map((insight, index) => (
                          <li key={index} className="flex items-start gap-2 text-slate-700">
                            <span className="text-blue-600 font-bold mt-1">→</span>
                            {insight}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-md">
                    <CardHeader>
                      <CardTitle className="text-slate-900 text-lg">Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {result.recommendations?.map((rec, index) => (
                          <li key={index} className="flex items-start gap-2 text-slate-700">
                            <span className="text-green-600 font-bold mt-1">✓</span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                {result.executive_summary && (
                  <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-slate-300 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-slate-900">Executive Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-700 leading-relaxed">{result.executive_summary}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <Card className="bg-white border-slate-200 h-full flex items-center justify-center shadow-lg">
                <CardContent className="text-center p-12">
                  <Brain className="w-20 h-20 mx-auto mb-6 text-slate-300" />
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">Pripravený analyzovať</h3>
                  <p className="text-slate-600 max-w-md">
                    Zadaj lokalitu a AI vytvorí kompletnú market intelligence s cenovými trendmi, 
                    demand forecastom a investment hotspots pre CEE trh
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