import React from 'react';
import { Target, Users, TrendingUp, Compass, MessageCircle, Award, Globe, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Strategy() {
  const uvpPoints = [
    {
      title: 'AI-First Construction Intelligence',
      description: 'Jediná platforma v CEE, ktorá komplexne spája AI s celým lifecycle stavebného projektu'
    },
    {
      title: 'Professional Grade Tools',
      description: 'Od edukatívneho contentu (Stavai.sk) po profesionálnu fintech analytiku (Estivo.io)'
    },
    {
      title: 'European Market Focus',
      description: 'Zamerané na CEE región s pochopením lokálneho trhu, daní a legislatívy'
    }
  ];

  const audienceSegments = [
    {
      name: 'Real Estate Developeri',
      size: 'Primary',
      needs: ['Investment ROI', 'Feasibility Studies', 'Timeline Optimization'],
      color: 'from-cyan-500 to-blue-500'
    },
    {
      name: 'Investori & Fondy',
      size: 'Primary',
      needs: ['IRR Analysis', 'Portfolio Modeling', 'Risk Assessment'],
      color: 'from-blue-500 to-violet-500'
    },
    {
      name: 'Stavebné Firmy',
      size: 'Secondary',
      needs: ['Cost Estimation', 'Project Planning', 'Resource Management'],
      color: 'from-violet-500 to-purple-500'
    },
    {
      name: 'Architekti & Projektanti',
      size: 'Secondary',
      needs: ['BIM Integration', 'Design Optimization', 'Regulation Compliance'],
      color: 'from-purple-500 to-pink-500'
    },
    {
      name: 'Realitné Agentúry',
      size: 'Tertiary',
      needs: ['Market Analysis', 'Property Valuation', 'Client Presentation'],
      color: 'from-pink-500 to-rose-500'
    },
    {
      name: 'Tech Enthusiasts',
      size: 'Tertiary',
      needs: ['PropTech Trends', 'AI Applications', 'Innovation News'],
      color: 'from-rose-500 to-orange-500'
    }
  ];

  const competitiveEdges = [
    {
      competitor: 'Traditional Tools',
      edge: 'AI-augmented vs manual processes',
      advantage: 'Stavai.sk: 10x faster analytics'
    },
    {
      competitor: 'PlanRadar / Buildots',
      edge: 'Full lifecycle vs construction-only',
      advantage: 'Investment + Development + Construction'
    },
    {
      competitor: 'PriceHubble / Reelly',
      edge: 'CEE-specialized vs generic EU',
      advantage: 'Local market intelligence'
    },
    {
      competitor: 'Excel Spreadsheets',
      edge: 'Smart automation vs static models',
      advantage: 'Real-time, AI-powered insights'
    }
  ];

  const messaging = {
    primary: 'The New Standard in Construction & Real Estate Intelligence',
    secondary: [
      'AI, ktoré stavia budúcnosť',
      'From Education to Execution',
      'Built for European Real Estate Professionals'
    ],
    investor: 'Disrupting €13T European construction industry with AI-first platform',
    developer: 'Make smarter investment decisions with AI-powered feasibility analysis',
    architect: 'Design with confidence using intelligent planning tools'
  };

  const brandPersonality = [
    { trait: 'Technologická', description: 'Cutting-edge AI, modern UX' },
    { trait: 'Profesionálna', description: 'Bank-level trust & precision' },
    { trait: 'Expertná', description: 'Deep construction & finance knowledge' },
    { trait: 'Európska', description: 'Not local-only, pan-EU ambition' }
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6">
              <Target className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-cyan-400 font-medium">Brand Strategy & Positioning</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Strategic Foundation
            </h1>
            <p className="text-xl text-slate-400">
              Stavai.sk positioning, value proposition, audience segmentation a competitive 
              advantages v AI-driven construction & real estate ekosystéme.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Unique Value Proposition */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <Zap className="w-12 h-12 mx-auto mb-4 text-cyan-400" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Unique Value Proposition
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Čo robí Stavai.sk jedinečným na európskom trhu
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {uvpPoints.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-effect rounded-2xl p-8 hover:border-cyan-500/50 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-white">{index + 1}</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{point.title}</h3>
              <p className="text-slate-400">{point.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Audience Segmentation */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-800">
        <div className="text-center mb-12">
          <Users className="w-12 h-12 mx-auto mb-4 text-cyan-400" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Target Audience Segments
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Stratifikácia používateľov s ich potrebami a pain points
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {audienceSegments.map((segment, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="glass-effect rounded-2xl p-6 hover:border-cyan-500/50 transition-all"
            >
              <div className={`inline-block px-3 py-1 rounded-full bg-gradient-to-r ${segment.color} bg-opacity-20 text-white text-xs font-semibold mb-4`}>
                {segment.size}
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{segment.name}</h3>
              <div className="space-y-2">
                {segment.needs.map((need, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-slate-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
                    {need}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Competitive Positioning */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-800">
        <div className="text-center mb-12">
          <Award className="w-12 h-12 mx-auto mb-4 text-cyan-400" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Competitive Advantages
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Prečo Stavai.sk vs existujúce riešenia
          </p>
        </div>

        <div className="space-y-4">
          {competitiveEdges.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-effect rounded-xl p-6 hover:border-cyan-500/50 transition-all"
            >
              <div className="grid md:grid-cols-3 gap-4 items-center">
                <div>
                  <div className="text-sm text-slate-500 mb-1">Competitor</div>
                  <div className="font-semibold text-white">{item.competitor}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-500 mb-1">Differentiation</div>
                  <div className="text-cyan-400 font-medium">{item.edge}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-500 mb-1">Stavai.sk Advantage</div>
                  <div className="text-white font-medium">{item.advantage}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Primary Messaging */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-800">
        <div className="text-center mb-12">
          <MessageCircle className="w-12 h-12 mx-auto mb-4 text-cyan-400" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Core Messaging Framework
          </h2>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          <div className="glass-effect rounded-2xl p-8 border-2 border-cyan-500/30 glow-effect">
            <div className="text-sm text-cyan-400 font-semibold mb-2">PRIMARY MESSAGE</div>
            <h3 className="text-3xl font-bold gradient-text">{messaging.primary}</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {messaging.secondary.map((msg, index) => (
              <div key={index} className="glass-effect rounded-xl p-6 text-center">
                <div className="text-white font-semibold">{msg}</div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="glass-effect rounded-xl p-6">
              <div className="text-sm text-slate-500 mb-2">For Investors</div>
              <p className="text-slate-300">{messaging.investor}</p>
            </div>
            <div className="glass-effect rounded-xl p-6">
              <div className="text-sm text-slate-500 mb-2">For Developers</div>
              <p className="text-slate-300">{messaging.developer}</p>
            </div>
            <div className="glass-effect rounded-xl p-6">
              <div className="text-sm text-slate-500 mb-2">For Architects</div>
              <p className="text-slate-300">{messaging.architect}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Personality */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-800">
        <div className="text-center mb-12">
          <Compass className="w-12 h-12 mx-auto mb-4 text-cyan-400" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Brand Personality
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {brandPersonality.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-effect rounded-xl p-6 text-center hover:border-cyan-500/50 transition-all"
            >
              <h3 className="text-xl font-bold gradient-text mb-2">{item.trait}</h3>
              <p className="text-sm text-slate-400">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Market Positioning */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-800">
        <div className="glass-effect rounded-3xl p-12 text-center">
          <Globe className="w-16 h-16 mx-auto mb-6 text-cyan-400" />
          <h2 className="text-3xl font-bold text-white mb-4">
            EU/CEE Market Leadership
          </h2>
          <p className="text-lg text-slate-400 max-w-3xl mx-auto mb-8">
            Stavai.sk je pozicionovaný ako <span className="text-cyan-400 font-semibold">prvá AI-first platforma</span> v CEE regióne, 
            ktorá komplexne pokrýva construction, development a real estate investment lifecycle. 
            <br/><br/>
            Target: stať sa <span className="gradient-text font-semibold">de facto štandardom</span> pre profesionálov 
            v európskom stavebníctve do 2028.
          </p>
          <div className="flex items-center justify-center gap-8 text-center">
            <div>
              <div className="text-4xl font-bold gradient-text">€13T</div>
              <div className="text-sm text-slate-500">EU Construction Market</div>
            </div>
            <div className="w-px h-12 bg-slate-700"></div>
            <div>
              <div className="text-4xl font-bold gradient-text">€2.5T</div>
              <div className="text-sm text-slate-500">CEE Development Value</div>
            </div>
            <div className="w-px h-12 bg-slate-700"></div>
            <div>
              <div className="text-4xl font-bold gradient-text">#1</div>
              <div className="text-sm text-slate-500">AI Platform Position</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}