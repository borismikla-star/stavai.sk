import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, TrendingDown, Clock, DollarSign, Users, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ComparisonCalculator() {
  const [projectType, setProjectType] = useState('residential');
  const [projectSize, setProjectSize] = useState('');
  const [teamSize, setTeamSize] = useState('3');
  const [showResults, setShowResults] = useState(false);

  const projectTypes = {
    residential: { label: 'Residential Development', avgDays: 35, avgCost: 45000 },
    commercial: { label: 'Commercial Office', avgDays: 28, avgCost: 65000 },
    industrial: { label: 'Industrial / Logistics', avgDays: 42, avgCost: 85000 },
    renovation: { label: 'Renovation Project', avgDays: 21, avgCost: 35000 }
  };

  const calculateSavings = () => {
    const size = parseInt(projectSize) || 5000;
    const team = parseInt(teamSize) || 3;
    const typeData = projectTypes[projectType];

    // Traditional approach
    const traditionalDays = typeData.avgDays;
    const traditionalCost = typeData.avgCost + (team * 500 * traditionalDays / 20); // daily rate x days
    const traditionalHours = traditionalDays * 8 * team;

    // AI approach
    const aiDays = Math.ceil(traditionalDays * 0.15); // 85% time reduction
    const aiCost = 8000 + (team * 500 * aiDays / 20); // fixed AI cost + reduced labor
    const aiHours = aiDays * 8 * team;

    return {
      traditional: {
        days: traditionalDays,
        cost: traditionalCost,
        hours: traditionalHours
      },
      ai: {
        days: aiDays,
        cost: aiCost,
        hours: aiHours
      },
      savings: {
        days: traditionalDays - aiDays,
        daysPercent: Math.round(((traditionalDays - aiDays) / traditionalDays) * 100),
        cost: traditionalCost - aiCost,
        costPercent: Math.round(((traditionalCost - aiCost) / traditionalCost) * 100),
        hours: traditionalHours - aiHours
      }
    };
  };

  const results = showResults ? calculateSavings() : null;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-200">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-blue-600/5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Calculator className="w-16 h-16 mx-auto mb-6 text-blue-600" />
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
              Traditional vs AI Approach
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Zisti koľko času a peňazí ušetríš použitím AI nástrojov Stavai.sk 
              namiesto tradičného prístupu k projektovej analýze.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Calculator */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-white border-slate-200 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-slate-900">Kalkulačka úspor</CardTitle>
              <p className="text-slate-600">Vyplň parametre svojho projektu</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="projectType">Typ projektu</Label>
                  <Select value={projectType} onValueChange={setProjectType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(projectTypes).map(([key, value]) => (
                        <SelectItem key={key} value={key}>{value.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="projectSize">Rozloha (m²)</Label>
                  <Input
                    id="projectSize"
                    type="number"
                    placeholder="napr. 5000"
                    value={projectSize}
                    onChange={(e) => setProjectSize(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="teamSize">Veľkosť tímu</Label>
                  <Select value={teamSize} onValueChange={setTeamSize}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 osoba</SelectItem>
                      <SelectItem value="2">2 osoby</SelectItem>
                      <SelectItem value="3">3 osoby</SelectItem>
                      <SelectItem value="5">5 osôb</SelectItem>
                      <SelectItem value="10">10+ osôb</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                onClick={() => setShowResults(true)}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 py-6 text-lg"
              >
                Vypočítať úspory
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results */}
        {showResults && results && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 space-y-8"
          >
            {/* Summary Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <CardContent className="p-6 text-center">
                  <Clock className="w-10 h-10 mx-auto mb-3 text-green-600" />
                  <div className="text-4xl font-bold text-green-600 mb-1">
                    {results.savings.daysPercent}%
                  </div>
                  <div className="text-slate-700 font-semibold mb-2">Úspora času</div>
                  <div className="text-sm text-slate-600">
                    {results.savings.days} dní ušetrených
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                <CardContent className="p-6 text-center">
                  <DollarSign className="w-10 h-10 mx-auto mb-3 text-blue-600" />
                  <div className="text-4xl font-bold text-blue-600 mb-1">
                    {results.savings.costPercent}%
                  </div>
                  <div className="text-slate-700 font-semibold mb-2">Úspora nákladov</div>
                  <div className="text-sm text-slate-600">
                    €{results.savings.cost.toLocaleString()} ušetrených
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
                <CardContent className="p-6 text-center">
                  <Users className="w-10 h-10 mx-auto mb-3 text-purple-600" />
                  <div className="text-4xl font-bold text-purple-600 mb-1">
                    {results.savings.hours}h
                  </div>
                  <div className="text-slate-700 font-semibold mb-2">Úspora hodín</div>
                  <div className="text-sm text-slate-600">
                    Pre váš tím {teamSize} ľudí
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Comparison */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Traditional */}
              <Card className="border-slate-300 bg-slate-50">
                <CardHeader>
                  <CardTitle className="text-xl text-slate-900 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-slate-600" />
                    Tradičný prístup
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between py-3 border-b border-slate-200">
                    <span className="text-slate-600">Čas realizácie:</span>
                    <span className="font-bold text-slate-900">{results.traditional.days} dní</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-slate-200">
                    <span className="text-slate-600">Celkové náklady:</span>
                    <span className="font-bold text-slate-900">€{results.traditional.cost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-slate-200">
                    <span className="text-slate-600">Pracovné hodiny:</span>
                    <span className="font-bold text-slate-900">{results.traditional.hours}h</span>
                  </div>
                  <div className="bg-white rounded-lg p-4 mt-4">
                    <div className="text-sm font-semibold text-slate-900 mb-2">Typický proces:</div>
                    <ul className="space-y-2 text-sm text-slate-600">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5"></div>
                        <span>Manuálne zbieranie dát (5-7 dní)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5"></div>
                        <span>Excel modelovanie (7-10 dní)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5"></div>
                        <span>Konzultácie s expertmi (3-5 dní)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5"></div>
                        <span>Finálny report (5-7 dní)</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* AI Approach */}
              <Card className="border-blue-300 bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardHeader>
                  <CardTitle className="text-xl text-blue-900 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                    AI prístup (Stavai.sk)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between py-3 border-b border-blue-200">
                    <span className="text-blue-700">Čas realizácie:</span>
                    <span className="font-bold text-blue-900">{results.ai.days} dní</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-blue-200">
                    <span className="text-blue-700">Celkové náklady:</span>
                    <span className="font-bold text-blue-900">€{results.ai.cost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-blue-200">
                    <span className="text-blue-700">Pracovné hodiny:</span>
                    <span className="font-bold text-blue-900">{results.ai.hours}h</span>
                  </div>
                  <div className="bg-white rounded-lg p-4 mt-4">
                    <div className="text-sm font-semibold text-blue-900 mb-2">AI-powered proces:</div>
                    <ul className="space-y-2 text-sm text-blue-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>AI data aggregation (2 hodiny)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Automatické modelovanie (1 deň)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>AI validácia a insights (4 hodiny)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Instant PDF reports (1 hodina)</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* ROI Message */}
            <Card className="bg-gradient-to-r from-green-600 to-emerald-600 border-0 text-white">
              <CardContent className="p-8 text-center">
                <TrendingDown className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">
                  Návratnosť investície: Okamžitá
                </h3>
                <p className="text-lg text-green-100 mb-6">
                  Pri úspore €{results.savings.cost.toLocaleString()} na projekte sa nástroje Stavai.sk 
                  oplatia už pri prvom použití. A to je len začiatok.
                </p>
                <Button className="bg-white text-green-600 hover:bg-green-50 px-8 py-6 text-lg font-bold">
                  Začať ušetrovať dnes
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </section>

      {/* Additional Benefits */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-200 bg-slate-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Ďalšie výhody AI prístupu
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Okrem času a peňazí získaš aj tieto benefity
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: TrendingDown,
              title: 'Vyššia presnosť',
              description: '92.5% priemerná accuracy vs 75-80% pri manuálnych odhadoch'
            },
            {
              icon: Users,
              title: 'Škálovateľnosť',
              description: 'Analyzuj 10 projektov za čas, ktorý by ti zabrala analýza jedného'
            },
            {
              icon: CheckCircle,
              title: 'Konzistentná kvalita',
              description: 'AI eliminuje ľudské chyby a zabezpečuje rovnakú kvalitu každého outputu'
            }
          ].map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-white border-slate-200 h-full shadow-md">
                <CardContent className="p-6 text-center">
                  <benefit.icon className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{benefit.title}</h3>
                  <p className="text-slate-600">{benefit.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}