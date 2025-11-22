import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { BarChart3, Loader, Download, TrendingUp, AlertTriangle, CheckCircle, DollarSign, Percent, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart } from 'recharts';

export default function FeasibilityAnalyzer() {
  const [formData, setFormData] = useState({
    project_name: '',
    investment_amount: '',
    expected_revenue: '',
    timeline_years: '5',
    operating_costs_yearly: ''
  });

  const [result, setResult] = useState(null);

  const analyzeMutation = useMutation({
    mutationFn: async (data) => {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Ako senior investment analyst pre CEE real estate, urob kompletnú feasibility analysis:

Projekt: ${data.project_name}
Celková investícia: €${data.investment_amount}
Očakávaný príjem: €${data.expected_revenue}
Investičný horizont: ${data.timeline_years} rokov
Ročné prevádzkové náklady: €${data.operating_costs_yearly || '0'}

VYPOČÍTAJ DETAILNE:

1. ZÁKLADNÉ METRIKY:
- ROI (Return on Investment) v %
- IRR (Internal Rate of Return) v %
- NPV (Net Present Value) - použij discount rate 6% pre CEE trh
- Payback Period (doba návratnosti v rokoch)

2. CASHFLOW ANALÝZA:
- Vytvor ročný cashflow model pre celý investičný horizont
- Zahrnú prevádzkové náklady, daňové dopady
- Kumulatívny cashflow

3. SENSITIVITY ANALYSIS:
- Ako sa zmení ROI pri +/- 10% zmene príjmov
- Ako sa zmení ROI pri +/- 10% zmene nákladov
- Best case, base case, worst case scenáre

4. RISK ASSESSMENT:
- Identifikuj top 5 rizík projektu
- Ohodnoť každé riziko (low/medium/high)
- Navrhni mitigačné stratégie

5. INVESTMENT RECOMMENDATION:
- Celkové hodnotenie: proceed/review/reject
- Detailné odôvodnenie
- Silné stránky projektu
- Slabé stránky projektu

Použij realistické predpoklady pre CEE real estate trh 2025.`,
        response_json_schema: {
          type: "object",
          properties: {
            roi: { type: "number" },
            irr: { type: "number" },
            npv: { type: "number" },
            payback_period: { type: "number" },
            yearly_cashflow: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  year: { type: "number" },
                  revenue: { type: "number" },
                  costs: { type: "number" },
                  net_cashflow: { type: "number" },
                  cumulative_cashflow: { type: "number" }
                }
              }
            },
            sensitivity: {
              type: "object",
              properties: {
                revenue_minus_10: { type: "number" },
                revenue_plus_10: { type: "number" },
                costs_minus_10: { type: "number" },
                costs_plus_10: { type: "number" },
                best_case_roi: { type: "number" },
                worst_case_roi: { type: "number" }
              }
            },
            risk_assessment: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  risk: { type: "string" },
                  level: { type: "string", enum: ["low", "medium", "high"] },
                  impact: { type: "string" },
                  mitigation: { type: "string" }
                }
              }
            },
            risk_score: { type: "string", enum: ["low", "medium", "high"] },
            recommendation: { type: "string", enum: ["proceed", "review", "reject"] },
            recommendation_reasoning: { type: "string" },
            strengths: { type: "array", items: { type: "string" } },
            weaknesses: { type: "array", items: { type: "string" } },
            executive_summary: { type: "string" }
          }
        }
      });

      const analysis = await base44.entities.FeasibilityAnalysis.create({
        project_name: data.project_name,
        investment_amount: parseFloat(data.investment_amount),
        expected_revenue: parseFloat(data.expected_revenue),
        roi: response.roi,
        irr: response.irr,
        npv: response.npv,
        payback_period: response.payback_period,
        risk_score: response.risk_score,
        recommendation: response.recommendation,
        analysis_details: {
          strengths: response.strengths,
          risks: response.risk_assessment,
          summary: response.executive_summary
        },
        tier: 'premium'
      });

      return { ...response, analysis_id: analysis.id };
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

  const getRiskColor = (risk) => {
    if (risk === 'low') return 'bg-green-100 text-green-700 border-green-200';
    if (risk === 'medium') return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    return 'bg-red-100 text-red-700 border-red-200';
  };

  const getRecommendationColor = (rec) => {
    if (rec === 'proceed') return 'bg-green-100 text-green-700 border-green-300';
    if (rec === 'review') return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    return 'bg-red-100 text-red-700 border-red-300';
  };

  const sensitivityData = result?.sensitivity ? [
    { scenario: 'Revenue -10%', roi: result.sensitivity.revenue_minus_10 },
    { scenario: 'Base Case', roi: result.roi },
    { scenario: 'Revenue +10%', roi: result.sensitivity.revenue_plus_10 },
    { scenario: 'Costs -10%', roi: result.sensitivity.costs_minus_10 },
    { scenario: 'Costs +10%', roi: result.sensitivity.costs_plus_10 }
  ] : [];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
              <BarChart3 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900">Feasibility Analyzer</h1>
              <p className="text-slate-600">Kompletná investičná analýza s ROI, IRR, NPV a sensitivity analysis</p>
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
                  <DollarSign className="w-5 h-5 text-violet-600" />
                  Investment Parameters
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
                      placeholder="napr. Premium Office Center"
                      className="bg-white border-slate-300"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="investment_amount" className="text-slate-700">Celková investícia (EUR)</Label>
                    <Input
                      id="investment_amount"
                      type="number"
                      value={formData.investment_amount}
                      onChange={(e) => handleInputChange('investment_amount', e.target.value)}
                      placeholder="2000000"
                      className="bg-white border-slate-300"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="expected_revenue" className="text-slate-700">Očakávaný celkový príjem (EUR)</Label>
                    <Input
                      id="expected_revenue"
                      type="number"
                      value={formData.expected_revenue}
                      onChange={(e) => handleInputChange('expected_revenue', e.target.value)}
                      placeholder="3500000"
                      className="bg-white border-slate-300"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="operating_costs_yearly" className="text-slate-700">Ročné prevádzkové náklady (EUR)</Label>
                    <Input
                      id="operating_costs_yearly"
                      type="number"
                      value={formData.operating_costs_yearly}
                      onChange={(e) => handleInputChange('operating_costs_yearly', e.target.value)}
                      placeholder="50000"
                      className="bg-white border-slate-300"
                    />
                  </div>

                  <div>
                    <Label htmlFor="timeline_years" className="text-slate-700">Investičný horizont (roky)</Label>
                    <Input
                      id="timeline_years"
                      type="number"
                      value={formData.timeline_years}
                      onChange={(e) => handleInputChange('timeline_years', e.target.value)}
                      placeholder="5"
                      className="bg-white border-slate-300"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={analyzeMutation.isPending}
                    className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:shadow-lg hover:shadow-violet-500/50 text-lg py-6"
                  >
                    {analyzeMutation.isPending ? (
                      <>
                        <Loader className="w-5 h-5 mr-2 animate-spin" />
                        AI analyzuje investíciu...
                      </>
                    ) : (
                      <>
                        <BarChart3 className="w-5 h-5 mr-2" />
                        Analyzovať investíciu
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
                <Card className="bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200 border-2 shadow-xl">
                  <CardContent className="p-8">
                    <div className="grid grid-cols-2 gap-8 mb-6">
                      <div className="text-center">
                        <div className="text-sm text-violet-600 font-semibold mb-2">ROI</div>
                        <div className="text-5xl font-bold gradient-text">{result.roi?.toFixed(1) || '0'}%</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-violet-600 font-semibold mb-2">IRR</div>
                        <div className="text-5xl font-bold gradient-text">{result.irr?.toFixed(1) || '0'}%</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center bg-white rounded-lg p-4">
                        <div className="text-sm text-slate-600 mb-1">NPV</div>
                        <div className="text-2xl font-bold text-slate-900">
                          €{result.npv ? (result.npv / 1000).toFixed(0) : '0'}k
                        </div>
                      </div>
                      <div className="text-center bg-white rounded-lg p-4">
                        <div className="text-sm text-slate-600 mb-1">Payback Period</div>
                        <div className="text-2xl font-bold text-slate-900">
                          {result.payback_period?.toFixed(1) || '0'} rokov
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-slate-200 shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-slate-900">Investment Recommendation</CardTitle>
                      <div className={`px-4 py-2 rounded-lg border-2 font-bold text-lg ${getRecommendationColor(result.recommendation)}`}>
                        {result.recommendation.toUpperCase()}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-slate-700 font-semibold">Risk Level</span>
                      <span className={`px-4 py-2 rounded-lg border font-semibold ${getRiskColor(result.risk_score)}`}>
                        {result.risk_score.toUpperCase()}
                      </span>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-4">
                      <p className="text-slate-700">{result.recommendation_reasoning}</p>
                    </div>
                  </CardContent>
                </Card>

                {result.yearly_cashflow && result.yearly_cashflow.length > 0 && (
                  <Card className="bg-white border-slate-200 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-slate-900 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                        Cashflow Analýza
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={result.yearly_cashflow}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="year" label={{ value: 'Rok', position: 'insideBottom', offset: -5 }} />
                          <YAxis />
                          <Tooltip formatter={(value) => `€${value.toLocaleString()}`} />
                          <Legend />
                          <Area type="monotone" dataKey="cumulative_cashflow" name="Kumulatívny CF" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} />
                          <Area type="monotone" dataKey="net_cashflow" name="Ročný CF" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                        </AreaChart>
                      </ResponsiveContainer>
                      <div className="mt-6 overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-slate-100">
                            <tr>
                              <th className="text-left p-2 text-slate-700">Rok</th>
                              <th className="text-right p-2 text-slate-700">Príjmy</th>
                              <th className="text-right p-2 text-slate-700">Náklady</th>
                              <th className="text-right p-2 text-slate-700">Čistý CF</th>
                              <th className="text-right p-2 text-slate-700">Kumulatívny CF</th>
                            </tr>
                          </thead>
                          <tbody>
                            {result.yearly_cashflow.map((row, index) => (
                              <tr key={index} className="border-b border-slate-100">
                                <td className="p-2 text-slate-900 font-medium">Rok {row.year}</td>
                                <td className="p-2 text-right text-green-600">€{row.revenue.toLocaleString()}</td>
                                <td className="p-2 text-right text-red-600">€{row.costs.toLocaleString()}</td>
                                <td className="p-2 text-right text-slate-900 font-semibold">€{row.net_cashflow.toLocaleString()}</td>
                                <td className="p-2 text-right text-blue-600 font-bold">€{row.cumulative_cashflow.toLocaleString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {result.sensitivity && (
                  <Card className="bg-white border-slate-200 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-slate-900 flex items-center gap-2">
                        <Percent className="w-5 h-5 text-violet-600" />
                        Sensitivity Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={sensitivityData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="scenario" angle={-20} textAnchor="end" height={80} />
                          <YAxis label={{ value: 'ROI %', angle: -90, position: 'insideLeft' }} />
                          <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
                          <Bar dataKey="roi" fill="#8B5CF6" />
                        </BarChart>
                      </ResponsiveContainer>
                      <div className="grid grid-cols-3 gap-4 mt-6">
                        <div className="bg-red-50 rounded-lg p-4 text-center border border-red-200">
                          <div className="text-xs text-red-600 mb-1">Worst Case</div>
                          <div className="text-xl font-bold text-red-700">{result.sensitivity?.worst_case_roi?.toFixed(1) || '0'}%</div>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-4 text-center border border-slate-200">
                          <div className="text-xs text-slate-600 mb-1">Base Case</div>
                          <div className="text-xl font-bold text-slate-900">{result.roi?.toFixed(1) || '0'}%</div>
                        </div>
                        <div className="bg-green-50 rounded-lg p-4 text-center border border-green-200">
                          <div className="text-xs text-green-600 mb-1">Best Case</div>
                          <div className="text-xl font-bold text-green-700">{result.sensitivity?.best_case_roi?.toFixed(1) || '0'}%</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-md">
                    <CardHeader>
                      <CardTitle className="text-slate-900 text-lg flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        Silné stránky
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {result.strengths?.map((strength, index) => (
                          <li key={index} className="flex items-start gap-2 text-slate-700">
                            <span className="text-green-600 mt-1 font-bold">✓</span>
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-200 shadow-md">
                    <CardHeader>
                      <CardTitle className="text-slate-900 text-lg flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                        Slabé stránky
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {result.weaknesses?.map((weakness, index) => (
                          <li key={index} className="flex items-start gap-2 text-slate-700">
                            <span className="text-red-600 mt-1 font-bold">⚠</span>
                            {weakness}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                {result.risk_assessment && result.risk_assessment.length > 0 && (
                  <Card className="bg-white border-slate-200 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-slate-900 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-600" />
                        Detailné hodnotenie rizík
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {result.risk_assessment.map((risk, index) => (
                        <div key={index} className="border border-slate-200 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-slate-900">{risk.risk}</h4>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getRiskColor(risk.level)}`}>
                              {risk.level.toUpperCase()}
                            </span>
                          </div>
                          <div className="text-sm text-slate-600 mb-2">
                            <span className="font-medium">Dopad:</span> {risk.impact}
                          </div>
                          <div className="text-sm bg-blue-50 text-blue-700 px-3 py-2 rounded border border-blue-200">
                            <span className="font-medium">Mitigácia:</span> {risk.mitigation}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {result.executive_summary && (
                  <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-slate-300 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-slate-900 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-slate-600" />
                        Executive Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-700 leading-relaxed">{result.executive_summary}</p>
                    </CardContent>
                  </Card>
                )}

                <Button className="w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white text-lg py-6">
                  <Download className="w-5 h-5 mr-2" />
                  Export Investment Report (PDF)
                </Button>
              </div>
            ) : (
              <Card className="bg-white border-slate-200 h-full flex items-center justify-center shadow-lg">
                <CardContent className="text-center p-12">
                  <TrendingUp className="w-20 h-20 mx-auto mb-6 text-slate-300" />
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">Pripravený analyzovať</h3>
                  <p className="text-slate-600 max-w-md">
                    Zadaj investičné parametre a AI vytvorí kompletnú feasibility analýzu 
                    s ROI, IRR, NPV, cashflow modelom a risk assessment
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