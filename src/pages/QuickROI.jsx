import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Calculator, DollarSign, Percent, Clock, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function QuickROI() {
  const [formData, setFormData] = useState({
    investment: '',
    yearly_revenue: '',
    yearly_costs: '',
    exit_value: ''
  });

  const [result, setResult] = useState(null);

  const calculateROI = (e) => {
    e.preventDefault();
    
    const investment = parseFloat(formData.investment);
    const yearlyRevenue = parseFloat(formData.yearly_revenue);
    const yearlyCosts = parseFloat(formData.yearly_costs);
    const exitValue = parseFloat(formData.exit_value || investment);
    
    const netYearlyProfit = yearlyRevenue - yearlyCosts;
    const totalReturn = exitValue - investment;
    const roi = (totalReturn / investment) * 100;
    const yearlyROI = (netYearlyProfit / investment) * 100;
    const paybackPeriod = investment / netYearlyProfit;
    const breakEvenRevenue = yearlyCosts + (investment / 5); // Assuming 5 year horizon
    const profitMargin = (netYearlyProfit / yearlyRevenue) * 100;

    setResult({
      roi: roi,
      yearlyROI: yearlyROI,
      paybackPeriod: paybackPeriod,
      breakEvenRevenue: breakEvenRevenue,
      profitMargin: profitMargin,
      totalReturn: totalReturn,
      netYearlyProfit: netYearlyProfit
    });
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900">Quick ROI Calculator</h1>
              <p className="text-slate-600">Rýchly odhad ROI a payback period pre investičné rozhodnutia</p>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20">
            <span className="text-sm text-green-600 font-medium">✨ FREE TOOL</span>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="bg-white border-slate-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-slate-900 flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-green-600" />
                  Investment Parameters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={calculateROI} className="space-y-6">
                  <div>
                    <Label htmlFor="investment" className="text-slate-700">Celková investícia (EUR)</Label>
                    <Input
                      id="investment"
                      type="number"
                      value={formData.investment}
                      onChange={(e) => handleInputChange('investment', e.target.value)}
                      placeholder="500000"
                      className="bg-white border-slate-300"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="yearly_revenue" className="text-slate-700">Ročný príjem (EUR)</Label>
                    <Input
                      id="yearly_revenue"
                      type="number"
                      value={formData.yearly_revenue}
                      onChange={(e) => handleInputChange('yearly_revenue', e.target.value)}
                      placeholder="80000"
                      className="bg-white border-slate-300"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="yearly_costs" className="text-slate-700">Ročné náklady (EUR)</Label>
                    <Input
                      id="yearly_costs"
                      type="number"
                      value={formData.yearly_costs}
                      onChange={(e) => handleInputChange('yearly_costs', e.target.value)}
                      placeholder="30000"
                      className="bg-white border-slate-300"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="exit_value" className="text-slate-700">Exit hodnota (EUR) - voliteľné</Label>
                    <Input
                      id="exit_value"
                      type="number"
                      value={formData.exit_value}
                      onChange={(e) => handleInputChange('exit_value', e.target.value)}
                      placeholder="600000"
                      className="bg-white border-slate-300"
                    />
                    <p className="text-xs text-slate-500 mt-1">Ak nevyplníš, použije sa pôvodná investícia</p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:shadow-lg hover:shadow-green-500/50 text-lg py-6"
                  >
                    <Calculator className="w-5 h-5 mr-2" />
                    Vypočítať ROI
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
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 border-2 shadow-xl">
                  <CardContent className="p-8 text-center">
                    <div className="text-sm text-green-600 font-semibold mb-2">RETURN ON INVESTMENT</div>
                    <div className="text-6xl font-bold gradient-text mb-4">
                      {result.roi.toFixed(1)}%
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg p-3">
                        <div className="text-xs text-slate-600 mb-1">Yearly ROI</div>
                        <div className="text-xl font-bold text-green-600">{result.yearlyROI.toFixed(1)}%</div>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <div className="text-xs text-slate-600 mb-1">Total Return</div>
                        <div className="text-xl font-bold text-slate-900">€{result.totalReturn.toLocaleString()}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-slate-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-slate-900 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-blue-600" />
                      Payback Period
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-4">
                      <div className="text-5xl font-bold text-blue-600 mb-2">
                        {result.paybackPeriod.toFixed(1)} rokov
                      </div>
                      <p className="text-slate-600">Čas potrebný na návrat investície</p>
                    </div>
                    <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                        style={{ width: `${Math.min((1 / result.paybackPeriod) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="bg-white border-slate-200 shadow-md">
                    <CardHeader>
                      <CardTitle className="text-slate-900 text-lg flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-emerald-600" />
                        Profitability
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-slate-100">
                          <span className="text-slate-700">Ročný zisk</span>
                          <span className="font-bold text-green-600">€{result.netYearlyProfit.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-slate-100">
                          <span className="text-slate-700">Profit Margin</span>
                          <span className="font-bold text-slate-900">{result.profitMargin.toFixed(1)}%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white border-slate-200 shadow-md">
                    <CardHeader>
                      <CardTitle className="text-slate-900 text-lg flex items-center gap-2">
                        <Target className="w-5 h-5 text-orange-600" />
                        Break-Even
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-slate-100">
                          <span className="text-slate-700">Break-Even Revenue</span>
                          <span className="font-bold text-orange-600">€{result.breakEvenRevenue.toLocaleString()}</span>
                        </div>
                        <div className="text-xs text-slate-600">
                          Minimálny ročný príjem potrebný na pokrytie nákladov a návrat investície za 5 rokov
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-md">
                  <CardHeader>
                    <CardTitle className="text-slate-900 text-lg">Quick Insights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-slate-700">
                      {result.roi > 20 && <li className="flex items-start gap-2"><span className="text-green-600 font-bold">✓</span>Výborný ROI - projekt je vysoko atraktívny</li>}
                      {result.roi > 10 && result.roi <= 20 && <li className="flex items-start gap-2"><span className="text-blue-600 font-bold">✓</span>Dobrý ROI - projekt má potenciál</li>}
                      {result.roi <= 10 && <li className="flex items-start gap-2"><span className="text-yellow-600 font-bold">⚠</span>Nízky ROI - zvážte alternatívy</li>}
                      {result.paybackPeriod < 5 && <li className="flex items-start gap-2"><span className="text-green-600 font-bold">✓</span>Rýchla návratnosť - nízke riziko</li>}
                      {result.paybackPeriod >= 5 && result.paybackPeriod < 10 && <li className="flex items-start gap-2"><span className="text-blue-600 font-bold">→</span>Stredná návratnosť - bežné pre real estate</li>}
                      {result.paybackPeriod >= 10 && <li className="flex items-start gap-2"><span className="text-red-600 font-bold">⚠</span>Dlhá návratnosť - vyššie riziko</li>}
                      {result.profitMargin > 30 && <li className="flex items-start gap-2"><span className="text-green-600 font-bold">✓</span>Vysoká marža - zdravý business model</li>}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="bg-white border-slate-200 h-full flex items-center justify-center shadow-lg">
                <CardContent className="text-center p-12">
                  <Percent className="w-20 h-20 mx-auto mb-6 text-slate-300" />
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">Pripravený vypočítať</h3>
                  <p className="text-slate-600 max-w-md">
                    Zadaj základné údaje a okamžite získaj ROI, payback period a profitability metriky
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