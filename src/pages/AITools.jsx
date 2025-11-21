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
      description: 'AI-powered odhad nákladov na stavbu na základe základných parametrov projektu',
      icon: DollarSign,
      path: 'CostEstimator',
      color: 'from-cyan-500 to-blue-500',
      features: ['Odhad materiálov', 'Pracovné náklady', 'Vybavenie', 'Povolenia']
    },
    {
      name: 'Timeline Generator',
      description: 'Automatické generovanie harmonogramu projektu s míľnikmi a fázami',
      icon: Clock,
      path: 'TimelineGenerator',
      color: 'from-blue-500 to-violet-500',
      features: ['Fázy projektu', 'Míľniky', 'Časový odhad', 'Kritická cesta']
    },
    {
      name: 'Market Intelligence',
      description: 'Real estate market insights a trendy pre informované rozhodnutia',
      icon: Brain,
      path: 'MarketIntelligence',
      color: 'from-violet-500 to-purple-500',
      features: ['Cenové trendy', 'Lokálny trh', 'Benchmarky', 'Predikcie']
    },
    {
      name: 'Building Analyzer',
      description: 'Analýza existujúcich budov a properties s AI odporúčaniami',
      icon: Building2,
      path: 'BuildingAnalyzer',
      color: 'from-purple-500 to-pink-500',
      features: ['Stavebný stav', 'Energetika', 'Potenciál', 'Odporúčania']
    }
  ];

  const premiumTools = [
    {
      name: 'Feasibility Analyzer',
      description: 'Kompletná investment feasibility analysis s ROI, IRR a NPV kalkuláciami',
      icon: BarChart3,
      path: 'FeasibilityAnalyzer',
      color: 'from-violet-600 to-purple-600',
      features: ['ROI & IRR', 'NPV analýza', 'Cashflow model', 'Risk assessment', 'Sensitivity analysis']
    },
    {
      name: 'Advanced ROI Calculator',
      description: 'Pokročilé investičné modelovanie s multi-scenario planning',
      icon: TrendingUp,
      path: 'ROICalculator',
      color: 'from-purple-600 to-pink-600',
      features: ['Multi-scenario', 'Tax modeling', 'Exit strategy', 'Portfolio view', 'API access']
    },
    {
      name: 'Document Generator',
      description: 'Profesionálne PDF reporty, investment memos a prezentácie',
      icon: FileText,
      path: 'DocumentGenerator',
      color: 'from-pink-600 to-rose-600',
      features: ['Custom templates', 'Branding', 'Export PDF', 'Investor reports', 'White-label']
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-violet-500/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Zap className="w-16 h-16 mx-auto mb-6 text-cyan-400" />
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              AI Nástroje
            </h1>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Inteligentné nástroje pre stavebníctvo, development a real estate analytics.
              <br />
              Od jednoduchých odhadov po pokročilé investičné modelovanie.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Free Tools */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-4">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-sm text-green-400 font-medium">FREE TOOLS</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Základné AI Nástroje
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl">
            Zadarmo pre všetkých používateľov — žiadna registrácia potrebná
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {freeTools.map((tool, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={createPageUrl(tool.path)}>
                <Card className="glass-effect border-slate-800 hover:border-cyan-500/50 transition-all group h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <tool.icon className="w-7 h-7 text-white" />
                      </div>
                      <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold">
                        FREE
                      </span>
                    </div>
                    <CardTitle className="text-2xl text-white group-hover:gradient-text transition-all">
                      {tool.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-400 mb-6">{tool.description}</p>
                    <div className="space-y-2 mb-6">
                      {tool.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-slate-500">
                          <CheckCircle className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                          {feature}
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 text-cyan-400 font-semibold group-hover:gap-3 transition-all">
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-800">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
            <Lock className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-blue-400 font-medium">PREMIUM TOOLS</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Professional Analytics
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl">
            Pokročilé nástroje pre serious developers a investorov — Estivo.io
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {premiumTools.map((tool, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="glass-effect border-slate-800 hover:border-blue-500/50 transition-all group h-full">
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <tool.icon className="w-7 h-7 text-white" />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold">
                      PRO
                    </span>
                  </div>
                  <CardTitle className="text-xl text-white">
                    {tool.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400 text-sm mb-6">{tool.description}</p>
                  <div className="space-y-2">
                    {tool.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-500">
                        <CheckCircle className="w-3 h-3 text-blue-400 flex-shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Premium CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative overflow-hidden rounded-3xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700"></div>
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.3) 0%, transparent 50%)'
          }}></div>
          
          <div className="relative px-8 md:px-16 py-16 text-center">
            <Lock className="w-12 h-12 mx-auto mb-6 text-white" />
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Unlock Professional Features
            </h3>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
              Získaj prístup k pokročilým investment analytics, 
              API integráciám a priority support s Estivo.io Pro
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link to={createPageUrl('Estivo')}>
                <Button className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg font-bold rounded-xl">
                  Preskúmať Estivo.io
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg font-semibold rounded-xl">
                Porovnať plány
              </Button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-800">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ako to funguje?
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
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
              <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
              <p className="text-slate-400">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}