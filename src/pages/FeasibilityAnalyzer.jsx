import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { BarChart3, Loader, Download, TrendingUp, AlertTriangle, CheckCircle, Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function FeasibilityAnalyzer() {
  const [formData, setFormData] = useState({
    project_name: '',
    investment_amount: '',
    expected_revenue: '',
    timeline_years: '5'
  });

  const [result, setResult] = useState(null);

  const analyzeMutation = useMutation({
    mutationFn: async (data) => {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Ako expert na investičnú analýzu v real estate, urob feasibility analysis pre projekt:

Projekt: ${data.project_name}
Investícia: €${data.investment_amount}
Očakávaný príjem: €${data.expected_revenue}
Timeline: ${data.timeline_years} rokov

Vypočítaj:
- ROI (Return on Investment) v %
- IRR (Internal Rate of Return) v %
- NPV (Net Present Value)
- Payback Period (doba návratnosti v rokoch)
- Risk Score (low/medium/high)
- Investment Recommendation (proceed/review/reject)

Použij štandardné metódy investičnej analýzy pre CEE real estate trh.
Uvažuj discount rate 5-7% pre NPV.`,
        response_json_schema: {
          type: "object",
          properties: {
            roi: { type: "number" },
            irr: { type: "number" },
            npv: { type: "number" },
            payback_period: { type: "number" },
            risk_score: { type: "string", enum: ["low", "medium", "high"] },
            recommendation: { type: "string", enum: ["proceed", "review", "reject"] },
            analysis_details: {
              type: "object",
              properties: {
                strengths: { type: "array", items: { type: "string" } },
                risks: { type: "array", items: { type: "string" } },
                summary: { type: "string" }
              }
            }
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
        analysis_details: response.analysis_details,
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
    if (risk === 'low') return 'text-green-400 bg-green-500/20';
    if (risk === 'medium') return 'text-yellow-400 bg-yellow-500/20';
    return 'text-red-400 bg-red-500/20';
  };

  const getRecommendationColor = (rec) => {
    if (rec === 'proceed') return 'text-green-400 bg-green-500/20';
    if (rec === 'review') return 'text-yellow-400 bg-yellow-500/20';
    return 'text-red-400 bg-red-500/20';
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
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
              <BarChart3 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Feasibility Analyzer</h1>
              <p className="text-slate-400">Investičná analýza s ROI, IRR a NPV</p>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20">
            <Lock className="w-4 h-4 text-violet-400" />
            <span className="text-sm text-violet-400 font-medium">PREMIUM TOOL</span>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="glass-effect border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Investment Parameters</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="project_name" className="text-slate-300">Názov projektu</Label>
                    <Input
                      id="project_name"
                      value={formData.project_name}
                      onChange={(e) => handleInputChange('project_name', e.target.value)}
                      placeholder="napr. Premium Office Center"
                      className="bg-slate-900 border-slate-700 text-white"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="investment_amount" className="text-slate-300">Investičná suma (EUR)</Label>
                    <Input
                      id="investment_amount"
                      type="number"
                      value={formData.investment_amount}
                      onChange={(e) => handleInputChange('investment_amount', e.target.value)}
                      placeholder="2000000"
                      className="bg-slate-900 border-slate-700 text-white"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="expected_revenue" className="text-slate-300">Očakávaný príjem (EUR)</Label>
                    <Input
                      id="expected_revenue"
                      type="number"
                      value={formData.expected_revenue}
                      onChange={(e) => handleInputChange('expected_revenue', e.target.value)}
                      placeholder="3500000"
                      className="bg-slate-900 border-slate-700 text-white"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="timeline_years" className="text-slate-300">Investičný horizont (roky)</Label>
                    <Input
                      id="timeline_years"
                      type="number"
                      value={formData.timeline_years}
                      onChange={(e) => handleInputChange('timeline_years', e.target.value)}
                      placeholder="5"
                      className="bg-slate-900 border-slate-700 text-white"
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
                        AI analyzuje...
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
          >
            {result ? (
              <div className="space-y-6">
                <Card className="glass-effect border-slate-800 border-2 border-violet-500/50 glow-effect">
                  <CardContent className="p-8">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="text-center">
                        <div className="text-sm text-violet-400 font-semibold mb-2">ROI</div>
                        <div className="text-4xl font-bold gradient-text">{result.roi.toFixed(1)}%</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-violet-400 font-semibold mb-2">IRR</div>
                        <div className="text-4xl font-bold gradient-text">{result.irr.toFixed(1)}%</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-2 gap-4">
                  <Card className="glass-effect border-slate-800">
                    <CardContent className="p-6 text-center">
                      <div className="text-sm text-slate-400 mb-2">NPV</div>
                      <div className="text-2xl font-bold text-white">
                        €{(result.npv / 1000).toFixed(0)}k
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="glass-effect border-slate-800">
                    <CardContent className="p-6 text-center">
                      <div className="text-sm text-slate-400 mb-2">Payback</div>
                      <div className="text-2xl font-bold text-white">
                        {result.payback_period.toFixed(1)} rokov
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="glass-effect border-slate-800">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-slate-300">Risk Level</span>
                      <span className={`px-4 py-2 rounded-full text-sm font-bold ${getRiskColor(result.risk_score)}`}>
                        {result.risk_score.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Recommendation</span>
                      <span className={`px-4 py-2 rounded-full text-sm font-bold ${getRecommendationColor(result.recommendation)}`}>
                        {result.recommendation.toUpperCase()}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {result.analysis_details && (
                  <>
                    <Card className="glass-effect border-slate-800">
                      <CardHeader>
                        <CardTitle className="text-white text-lg flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-400" />
                          Silné stránky
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {result.analysis_details.strengths?.map((strength, index) => (
                            <li key={index} className="text-sm text-slate-300 flex items-start gap-2">
                              <span className="text-green-400 mt-1">•</span>
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    <Card className="glass-effect border-slate-800">
                      <CardHeader>
                        <CardTitle className="text-white text-lg flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5 text-yellow-400" />
                          Riziká
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {result.analysis_details.risks?.map((risk, index) => (
                            <li key={index} className="text-sm text-slate-300 flex items-start gap-2">
                              <span className="text-yellow-400 mt-1">•</span>
                              {risk}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    {result.analysis_details.summary && (
                      <Card className="glass-effect border-slate-800">
                        <CardContent className="p-6">
                          <h3 className="font-semibold text-white mb-2">Executive Summary</h3>
                          <p className="text-sm text-slate-400">{result.analysis_details.summary}</p>
                        </CardContent>
                      </Card>
                    )}
                  </>
                )}

                <Button variant="outline" className="w-full border-slate-700 text-slate-300">
                  <Download className="w-4 h-4 mr-2" />
                  Export Investment Report (PDF)
                </Button>
              </div>
            ) : (
              <Card className="glass-effect border-slate-800 h-full flex items-center justify-center">
                <CardContent className="text-center p-12">
                  <TrendingUp className="w-16 h-16 mx-auto mb-4 text-slate-600" />
                  <h3 className="text-xl font-bold text-white mb-2">Pripravený analyzovať</h3>
                  <p className="text-slate-400">
                    Zadaj investičné parametre a AI vytvorí kompletnú feasibility analýzu
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