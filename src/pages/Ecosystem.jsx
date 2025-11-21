import React from 'react';
import { Network, Zap, TrendingUp, Users, Calendar, Brain, Building2, DollarSign, FileText, BarChart3, Workflow } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Ecosystem() {
  const products = {
    stavai: {
      name: 'Stavai.sk',
      tagline: 'Content & AI Hub',
      description: 'Edukatívna platforma, AI nástroje, knowledge base',
      features: [
        'AI nástroje (cost estimation, timeline generator)',
        'Blog & knowledge hub',
        'Benchmarky a trendy',
        'Free tier pre širokú adopciu',
        'Community building'
      ],
      audience: 'B2C + B2B Entry',
      color: 'from-cyan-500 to-blue-500'
    },
    estivo: {
      name: 'Estivo.io',
      tagline: 'Professional Fintech Platform',
      description: 'Investment modeling, feasibility, ROI/IRR analytics',
      features: [
        'Investment feasibility models',
        'ROI, IRR, NPV calculations',
        'Cashflow & sensitivity analysis',
        'CEE tax & legal modules',
        'PDF export & reporting',
        'API integrations'
      ],
      audience: 'B2B Premium',
      color: 'from-violet-500 to-purple-500'
    }
  };

  const aiTools = [
    {
      name: 'Cost Estimator AI',
      description: 'Odhad nákladov na stavbu na základe parametrov',
      icon: DollarSign,
      category: 'Free Tool',
      platform: 'Stavai.sk'
    },
    {
      name: 'Timeline Generator',
      description: 'AI-generované harmonogramy projektov',
      icon: Calendar,
      category: 'Free Tool',
      platform: 'Stavai.sk'
    },
    {
      name: 'Feasibility Analyzer',
      description: 'Kompletná investment feasibility analysis',
      icon: BarChart3,
      category: 'Premium',
      platform: 'Estivo.io'
    },
    {
      name: 'ROI Calculator Pro',
      description: 'Advanced ROI/IRR modeling s cashflow',
      icon: TrendingUp,
      category: 'Premium',
      platform: 'Estivo.io'
    },
    {
      name: 'Market Intelligence',
      description: 'Real estate market trends & pricing data',
      icon: Brain,
      category: 'Free Tool',
      platform: 'Stavai.sk'
    },
    {
      name: 'Document Generator',
      description: 'PDF reports, investment memos, presentations',
      icon: FileText,
      category: 'Premium',
      platform: 'Estivo.io'
    },
    {
      name: 'Project Workflow AI',
      description: 'Optimalizácia procesov a resource allocation',
      icon: Workflow,
      category: 'Premium',
      platform: 'Estivo.io'
    },
    {
      name: 'Building Analyzer',
      description: 'Analýza existujúcich budov a properties',
      icon: Building2,
      category: 'Free Tool',
      platform: 'Stavai.sk'
    }
  ];

  const userJourney = [
    {
      stage: 'Discovery',
      platform: 'Stavai.sk',
      actions: ['Google search', 'Social media', 'Content marketing'],
      outcome: 'User learns about AI in construction'
    },
    {
      stage: 'Engagement',
      platform: 'Stavai.sk',
      actions: ['Uses free tools', 'Reads articles', 'Joins community'],
      outcome: 'User sees value, becomes regular visitor'
    },
    {
      stage: 'Conversion',
      platform: 'Stavai.sk → Estivo.io',
      actions: ['Needs advanced features', 'Signs up for trial', 'Explores premium tools'],
      outcome: 'User converts to paid Estivo.io subscription'
    },
    {
      stage: 'Retention',
      platform: 'Estivo.io',
      actions: ['Daily usage', 'Advanced modeling', 'API integration'],
      outcome: 'Power user, potential enterprise client'
    }
  ];

  const roadmap = [
    {
      year: '2025 Q1-Q2',
      milestone: 'Launch & Foundation',
      deliverables: [
        'Stavai.sk MVP (5 free AI tools)',
        'Content hub (20+ articles)',
        'Brand identity rollout',
        'Community channels'
      ]
    },
    {
      year: '2025 Q3-Q4',
      milestone: 'Estivo.io Beta',
      deliverables: [
        'Estivo.io closed beta',
        'Advanced feasibility models',
        'CEE market modules (SK, CZ, PL)',
        'B2B partnerships'
      ]
    },
    {
      year: '2026',
      milestone: 'Scale & Expansion',
      deliverables: [
        'Estivo.io public launch',
        'Mobile apps (iOS, Android)',
        'Enterprise tier',
        'API marketplace',
        'Expansion to 10 EU markets'
      ]
    },
    {
      year: '2027',
      milestone: 'Market Leadership',
      deliverables: [
        'AI Academy certification program',
        'M&A of complementary tools',
        'Strategic partnerships (banks, developers)',
        'Series A fundraising'
      ]
    },
    {
      year: '2028',
      milestone: 'Ecosystem Dominance',
      deliverables: [
        'Full EU coverage (27 markets)',
        'Enterprise SaaS dominance',
        'Construction OS platform',
        'IPO readiness'
      ]
    }
  ];

  const synergies = [
    {
      flow: 'Stavai → Estivo',
      value: 'Lead generation & user education',
      mechanism: 'Free tools create demand for premium features'
    },
    {
      flow: 'Estivo → Stavai',
      value: 'Case studies & success stories',
      mechanism: 'Premium users provide content & testimonials'
    },
    {
      flow: 'Bidirectional',
      value: 'Brand halo effect',
      mechanism: 'Professional Estivo elevates Stavai credibility'
    },
    {
      flow: 'Data synergy',
      value: 'AI model improvements',
      mechanism: 'Estivo usage data enhances Stavai free tools'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-violet-500/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 border border-pink-500/20 mb-6">
              <Network className="w-4 h-4 text-pink-400" />
              <span className="text-sm text-pink-400 font-medium">Product Ecosystem</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Ecosystem Strategy
            </h1>
            <p className="text-xl text-slate-400">
              Stavai.sk × Estivo.io synergy map, AI tools roadmap a 3-year product vision
            </p>
          </motion.div>
        </div>
      </section>

      {/* Product Overview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="mb-12 text-center">
          <Network className="w-12 h-12 mx-auto mb-4 text-cyan-400" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Dual Product Strategy
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Vzdelávaj, konvertuj, monetizuj — two platforms, one ecosystem
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {Object.values(products).map((product, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="glass-effect rounded-3xl p-8 hover:border-cyan-500/50 transition-all"
            >
              <div className={`inline-block px-4 py-2 rounded-xl bg-gradient-to-r ${product.color} bg-opacity-20 text-white font-bold text-lg mb-4`}>
                {product.name}
              </div>
              <div className="text-sm text-slate-400 mb-4">{product.tagline}</div>
              <p className="text-white text-lg mb-6">{product.description}</p>
              
              <div className="space-y-3 mb-6">
                {product.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Zap className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-300">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-slate-700">
                <div className="text-sm text-slate-500">Target Audience</div>
                <div className="text-white font-semibold mt-1">{product.audience}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* AI Tools Overview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-800">
        <div className="mb-12">
          <Brain className="w-12 h-12 mb-4 text-cyan-400" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            AI Tools Portfolio
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl">
            Free entry tools (Stavai.sk) → Premium analytics (Estivo.io)
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {aiTools.map((tool, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="glass-effect rounded-xl p-6 hover:border-cyan-500/50 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center mb-4">
                <tool.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-white mb-2">{tool.name}</h3>
              <p className="text-sm text-slate-400 mb-4">{tool.description}</p>
              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 rounded-md text-xs font-semibold ${
                  tool.category === 'Free Tool' 
                    ? 'bg-green-500/10 text-green-400' 
                    : 'bg-violet-500/10 text-violet-400'
                }`}>
                  {tool.category}
                </span>
                <span className="text-xs text-slate-500">{tool.platform}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* User Journey */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-800">
        <div className="mb-12">
          <Users className="w-12 h-12 mb-4 text-cyan-400" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            User Journey
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl">
            From discovery to power user — conversion funnel cez ecosystem
          </p>
        </div>

        <div className="relative">
          {/* Connection Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500 via-blue-500 to-violet-500 hidden md:block"></div>
          
          <div className="space-y-8">
            {userJourney.map((stage, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.15 }}
                className="relative md:pl-20"
              >
                <div className="absolute left-0 top-6 w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center font-bold text-white text-xl hidden md:flex">
                  {index + 1}
                </div>
                
                <div className="glass-effect rounded-2xl p-8">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <h3 className="text-2xl font-bold text-white">{stage.stage}</h3>
                    <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-sm font-semibold">
                      {stage.platform}
                    </span>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <div className="text-sm text-slate-500 mb-2">User Actions</div>
                      <ul className="space-y-2">
                        {stage.actions.map((action, i) => (
                          <li key={i} className="flex items-center gap-2 text-slate-300">
                            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="text-sm text-slate-500 mb-2">Outcome</div>
                      <div className="text-white font-medium">{stage.outcome}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Synergies */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-800">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Platform Synergies
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl">
            Ako sa Stavai.sk a Estivo.io vzájomne posilňujú
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {synergies.map((synergy, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-effect rounded-xl p-6 hover:border-cyan-500/50 transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="px-3 py-1 rounded-lg bg-gradient-to-r from-cyan-500 to-violet-500 text-white text-sm font-bold">
                  {synergy.flow}
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{synergy.value}</h3>
              <p className="text-slate-400">{synergy.mechanism}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3-Year Roadmap */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-800">
        <div className="mb-12">
          <Calendar className="w-12 h-12 mb-4 text-cyan-400" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            3-Year Product Roadmap
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl">
            Od MVP po market leadership — strategic milestones
          </p>
        </div>

        <div className="space-y-6">
          {roadmap.map((phase, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-effect rounded-2xl p-8 hover:border-cyan-500/50 transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <div>
                  <div className="text-cyan-400 font-bold mb-2">{phase.year}</div>
                  <h3 className="text-2xl font-bold text-white">{phase.milestone}</h3>
                </div>
                <div className="hidden md:block w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center font-bold text-white text-xl">
                  {index + 1}
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                {phase.deliverables.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 bg-slate-900/50 rounded-lg">
                    <Zap className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-300">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Ecosystem Vision */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-800">
        <div className="glass-effect rounded-3xl p-12 text-center">
          <Network className="w-16 h-16 mx-auto mb-6 text-cyan-400" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ecosystem Vision 2028
          </h2>
          <p className="text-lg text-slate-400 max-w-3xl mx-auto mb-8">
            <span className="gradient-text font-semibold">Stavai.sk</span> ako největší AI content hub pre stavebníctvo v CEE
            <br />
            <span className="gradient-text font-semibold">Estivo.io</span> ako #1 investment analytics platform pre EU real estate
            <br /><br />
            Spoločne vytvárajú <span className="text-white font-semibold">de facto štandard</span> pre AI v construction & development ekosystéme.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 text-center">
            <div>
              <div className="text-4xl font-bold gradient-text">1M+</div>
              <div className="text-sm text-slate-500">Active Users</div>
            </div>
            <div className="w-px h-12 bg-slate-700"></div>
            <div>
              <div className="text-4xl font-bold gradient-text">27</div>
              <div className="text-sm text-slate-500">EU Markets</div>
            </div>
            <div className="w-px h-12 bg-slate-700"></div>
            <div>
              <div className="text-4xl font-bold gradient-text">€50M</div>
              <div className="text-sm text-slate-500">ARR Target</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}