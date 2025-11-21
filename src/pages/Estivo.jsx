import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import { 
  TrendingUp, BarChart3, Lock, CheckCircle, ArrowRight, 
  Zap, Building2, DollarSign, FileText, Globe, Users, Code
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Estivo() {
  const features = [
    {
      icon: BarChart3,
      title: 'Advanced ROI & IRR Models',
      description: 'Multi-scenario investment modeling s pokročilými cash flow projekciami'
    },
    {
      icon: Building2,
      title: 'CEE Tax & Legal Engine',
      description: 'Daňové a právne moduly špecifické pre Slovensko, Česko, Poľsko'
    },
    {
      icon: Code,
      title: 'API Access',
      description: 'REST API pre integráciu s vlastnými systémami a workflow'
    },
    {
      icon: FileText,
      title: 'Professional Reports',
      description: 'White-label PDF reporty, investor memos, pitch decks'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Multi-user workspace s rolami a permissions'
    },
    {
      icon: Globe,
      title: 'Portfolio Management',
      description: 'Správa portfólia projektov s konsolidovanými metrikami'
    }
  ];

  const plans = [
    {
      name: 'Starter',
      price: '€99',
      period: '/mesiac',
      description: 'Pre začínajúcich investorov',
      features: [
        '5 projektov mesačne',
        'Základné ROI/IRR kalkulácie',
        'PDF export',
        'Email support',
        'CEE market data'
      ],
      cta: 'Začať teraz',
      highlight: false
    },
    {
      name: 'Professional',
      price: '€299',
      period: '/mesiac',
      description: 'Pre serious developerov',
      features: [
        'Unlimited projekty',
        'Advanced modeling & sensitivity analysis',
        'White-label reports',
        'API access',
        'CEE tax & legal modules',
        'Priority support',
        'Team collaboration (5 users)'
      ],
      cta: 'Upgrade na Pro',
      highlight: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'Pre veľké organizácie',
      features: [
        'Všetko z Professional',
        'Custom integrations',
        'Dedicated account manager',
        'SLA guarantee',
        'Custom AI models',
        'Unlimited users',
        'On-premise deployment'
      ],
      cta: 'Kontaktovať sales',
      highlight: false
    }
  ];

  const useCases = [
    {
      title: 'Real Estate Developeri',
      description: 'Feasibility studies, multi-project portfolio management, investor presentations',
      icon: Building2
    },
    {
      title: 'Investment Fondy',
      description: 'Due diligence, portfolio tracking, LP reporting, exit modeling',
      icon: TrendingUp
    },
    {
      title: 'Banky & Financie',
      description: 'Loan underwriting, collateral valuation, risk assessment',
      icon: DollarSign
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-200">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-blue-600/5"></div>
        <div className="absolute inset-0" style={{
        backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.08) 0%, transparent 50%)'
        }}></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-8">
              <Lock className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-blue-400 font-medium">Professional Investment Platform</span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8">
              <span className="gradient-text">Estivo.io</span>
              <br />
              <span className="text-slate-900">Investment Intelligence</span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto mb-12 leading-relaxed">
              Profesionálna fintech platforma pre real estate investment modeling.
              <br />
              ROI, IRR, NPV analytics + CEE tax/legal engine + API integrations.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6">
              <Button className="px-10 py-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-blue-500/50 transition-all">
                Začať 14-dňový trial
                <ArrowRight className="w-6 h-6 ml-2" />
              </Button>
              <Button variant="outline" className="px-10 py-6 border-2 border-slate-700 text-white rounded-xl font-bold text-lg hover:border-blue-500 hover:bg-slate-800/50 transition-all">
                Zistiť viac
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-20"
          >
            <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-8 max-w-5xl mx-auto shadow-lg">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">500+</div>
                  <div className="text-sm text-slate-600">Active projects</div>
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">€2.5B</div>
                  <div className="text-sm text-slate-600">Assets analyzed</div>
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">98%</div>
                  <div className="text-sm text-slate-600">Accuracy rate</div>
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">24/7</div>
                  <div className="text-sm text-slate-600">API uptime</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stavai.sk Connection */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-b border-slate-200">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/10 border border-sky-500/20 mb-6">
            <Zap className="w-4 h-4 text-sky-400" />
            <span className="text-sm text-sky-400 font-medium">Powered by Stavai.sk Ecosystem</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Bratská platforma ku Stavai.sk
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Stavai.sk prináša AI do stavebníctva pre všetkých. 
            Estivo.io je pokročilá investment platforma pre serious players.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="bg-white border-slate-200 shadow-md">
            <CardHeader>
              <CardTitle className="text-slate-900 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                Stavai.sk — For Everyone
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-sky-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-slate-900 font-semibold">FREE AI nástroje</div>
                  <div className="text-sm text-slate-600">Cost estimates, timelines, basic analytics</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-sky-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-slate-900 font-semibold">Knowledge Hub</div>
                  <div className="text-sm text-slate-600">Vzdelávací obsah o AI v stavebníctve</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-sky-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-slate-900 font-semibold">Project management</div>
                  <div className="text-sm text-slate-600">Organizácia projektov a analýz</div>
                </div>
              </div>
              <Link to={createPageUrl('Home')}>
                <Button variant="outline" className="w-full mt-4 border-sky-500/50 text-sky-400 hover:bg-sky-500/10">
                  Prejsť na Stavai.sk
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-white border-blue-200 shadow-md">
            <CardHeader>
              <CardTitle className="text-slate-900 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-white" />
                </div>
                Estivo.io — For Professionals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-slate-900 font-semibold">Advanced ROI/IRR modeling</div>
                  <div className="text-sm text-slate-600">Multi-scenario, sensitivity analysis, NPV</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-violet-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-slate-900 font-semibold">CEE tax & legal modules</div>
                  <div className="text-sm text-slate-600">Slovakia, Czech, Poland specific</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-violet-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-slate-900 font-semibold">API & integrations</div>
                  <div className="text-sm text-slate-600">Custom workflows, white-label</div>
                </div>
              </div>
              <Button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600">
                Začať s Estivo.io
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-b border-slate-200">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Enterprise-grade Features
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Všetko čo potrebuješ pre profesionálne investment analytics
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-white border-slate-200 hover:border-blue-300 transition-all h-full shadow-md">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-slate-600">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Use Cases */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-b border-slate-200">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Pre koho je Estivo.io?
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {useCases.map((useCase, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-white border-slate-200 text-center h-full shadow-md">
                <CardContent className="p-8">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center mx-auto mb-6">
                    <useCase.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{useCase.title}</h3>
                  <p className="text-slate-600">{useCase.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Transparent Pricing
          </h2>
          <p className="text-lg text-slate-600">
            Začni zadarmo so Stavai.sk, upgrade keď potrebuješ profesionálne features
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`bg-white ${plan.highlight ? 'border-blue-500 border-2 scale-105 shadow-xl' : 'border-slate-200 shadow-md'} h-full`}>
                {plan.highlight && (
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center py-2 text-sm font-bold rounded-t-xl">
                    MOST POPULAR
                  </div>
                )}
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold gradient-text">{plan.price}</span>
                    <span className="text-slate-600">{plan.period}</span>
                  </div>
                  <p className="text-slate-600 mb-6">{plan.description}</p>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className={`w-full ${plan.highlight ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' : 'border-slate-300 text-slate-700'}`} variant={plan.highlight ? 'default' : 'outline'}>
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700"></div>
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.3) 0%, transparent 50%)'
          }}></div>
          <div className="relative px-8 md:px-16 py-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Pripravený na serious analytics?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Začni 14-dňový free trial Estivo.io Professional — žiadna kreditka potrebná
            </p>
            <Button className="bg-white text-blue-600 hover:bg-blue-50 px-10 py-6 text-lg font-bold rounded-xl shadow-xl">
              Začať free trial
              <ArrowRight className="w-6 h-6 ml-2" />
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}