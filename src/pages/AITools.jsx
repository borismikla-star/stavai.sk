import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import { 
  DollarSign, Clock, BarChart3, Brain, Building2, 
  TrendingUp, FileText, Zap, ArrowRight, Lock, CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AITools() {
  const freeTools = [
    {
      name: 'Cost Estimator',
      description: 'AI-powered ultra-detailný odhad nákladov s grafmi a rozpisom materiálov',
      icon: DollarSign,
      path: 'CostEstimator',
      color: 'from-cyan-500 to-blue-500',
      features: ['Detailný rozpis materiálov', 'Grafická vizualizácia', 'Regional pricing', 'Možnosti úspor']
    },
    {
      name: 'Timeline Generator',
      description: 'Gantt chart harmonogram s kritickou cestou a risk analýzou',
      icon: Clock,
      path: 'TimelineGenerator',
      color: 'from-blue-500 to-violet-500',
      features: ['Gantt chart vizualizácia', 'Kritická cesta', 'Rizikové faktory', 'Optimalizácie']
    },
    {
      name: 'Quick ROI Calculator',
      description: 'Rýchly odhad ROI pre investičné rozhodnutia v reálnom čase',
      icon: TrendingUp,
      path: 'QuickROI',
      color: 'from-green-500 to-emerald-500',
      features: ['Instant výpočet ROI', 'Payback period', 'Break-even analýza', 'Profit margin']
    },
    {
      name: 'Building Analyzer',
      description: 'AI analýza existujúcich budov - stav, energetika, potenciál',
      icon: Building2,
      path: 'BuildingAnalyzer',
      color: 'from-orange-500 to-red-500',
      features: ['Stavebný stav', 'Energetická efektivita', 'Renovation potenciál', 'Value estimation']
    }
  ];

  const premiumTools = [
    {
      name: 'Feasibility Analyzer',
      description: 'Kompletná investment feasibility analysis s ROI, IRR, NPV a cashflow modelom',
      icon: BarChart3,
      path: 'FeasibilityAnalyzer',
      color: 'from-violet-600 to-purple-600',
      features: ['ROI & IRR kalkulácie', 'NPV & Payback Period', 'Cashflow model', 'Sensitivity analysis', 'Risk assessment']
    },
    {
      name: 'Market Intelligence',
      description: 'Real estate market insights, cenové trendy a predikcie pre CEE',
      icon: Brain,
      path: 'MarketIntelligence',
      color: 'from-indigo-600 to-blue-600',
      features: ['Cenové trendy', 'Demand forecasting', 'Competitor analysis', 'Location scoring', 'Investment hotspots']
    },
    {
      name: 'Document Generator',
      description: 'AI generovanie profesionálnych reportov, business plánov a presentations',
      icon: FileText,
      path: 'DocumentGenerator',
      color: 'from-pink-600 to-rose-600',
      features: ['Investment memos', 'Business plans', 'Pitch decks', 'Due diligence reports', 'White-label PDF']
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-200">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-violet-500/5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Zap className="w-16 h-16 mx-auto mb-6 text-cyan-600" />
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
              AI Nástroje
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Inteligentné nástroje pre stavebníctvo, development a real estate analytics.
              <br />
              Od základných odhadov po pokročilé investičné modelovanie.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Free Tools */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-4">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-600 font-medium">FREE TOOLS</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Základné AI Nástroje
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl">
            Zadarmo pre všetkých používateľov — žiadna registrácia potrebná
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {freeTools.map((tool, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={createPageUrl(tool.path)}>
                <Card className="bg-white border-slate-200 hover:border-cyan-500 hover:shadow-xl transition-all group h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <tool.icon className="w-7 h-7 text-white" />
                      </div>
                      <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-600 text-xs font-bold">
                        FREE
                      </span>
                    </div>
                    <CardTitle className="text-2xl text-slate-900 group-hover:gradient-text transition-all">
                      {tool.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 mb-6">{tool.description}</p>
                    <div className="space-y-2 mb-6">
                      {tool.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-slate-700">
                          <CheckCircle className="w-4 h-4 text-cyan-600 flex-shrink-0" />
                          {feature}
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 text-cyan-600 font-semibold group-hover:gap-3 transition-all">
                      Vyskúšať nástroj
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Premium Tools */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-200">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-4">
            <span className="text-sm text-violet-600 font-medium">⭐ PRO TOOLS - Stavai.sk</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Professional Investment Analytics
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl">
            Pokročilé nástroje pre serious developers a investorov
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {premiumTools.map((tool, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={createPageUrl(tool.path)}>
                <Card className="bg-white border-slate-200 hover:border-violet-500 hover:shadow-xl transition-all group h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <tool.icon className="w-7 h-7 text-white" />
                      </div>
                      <span className="px-3 py-1 rounded-full bg-violet-500/20 text-violet-600 text-xs font-bold">
                        PRO
                      </span>
                    </div>
                    <CardTitle className="text-2xl text-slate-900 group-hover:gradient-text transition-all">
                      {tool.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 mb-6">{tool.description}</p>
                    <div className="space-y-2 mb-6">
                      {tool.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-slate-700">
                          <CheckCircle className="w-4 h-4 text-violet-600 flex-shrink-0" />
                          {feature}
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 text-violet-600 font-semibold group-hover:gap-3 transition-all">
                      Vyskúšať nástroj
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Coming Soon */}
        <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-slate-300">
          <CardContent className="p-8 text-center">
            <Zap className="w-12 h-12 mx-auto mb-4 text-slate-400" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">Ďalšie nástroje pripravujeme</h3>
            <p className="text-slate-600">
              Market Intelligence, Building Analyzer a ďalšie AI nástroje už čoskoro...
            </p>
          </CardContent>
        </Card>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-200">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Ako to funguje?
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Tri jednoduché kroky k inteligentným rozhodnutiam
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { step: '1', title: 'Zadaj parametre', description: 'Vyplň základné informácie o projekte alebo investícii' },
            { step: '2', title: 'AI spracuje dáta', description: 'Naše AI modely analyzujú stovky parametrov a trhovú dátu' },
            { step: '3', title: 'Získaj výsledky', description: 'Detailné odhady, analýzy a AI odporúčania okamžite' }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-2xl font-bold text-white mx-auto mb-6">
                {item.step}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
              <p className="text-slate-600">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}