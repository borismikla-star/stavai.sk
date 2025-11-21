import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { 
  Sparkles, Target, Palette, MessageSquare, Network, BookOpen,
  ArrowRight, Zap, TrendingUp, Users, Globe
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function BrandHome() {
  const sections = [
    {
      icon: Target,
      title: 'Stratégia & Positioning',
      description: 'Value proposition, audience segmentation, competitive positioning a messaging framework',
      path: 'Strategy',
      color: 'from-cyan-500 to-blue-500',
      stats: ['UVP', 'Target Segments', 'Market Position']
    },
    {
      icon: Palette,
      title: 'Visual Identity',
      description: 'Logo concepts, color palette, typography system, iconography a visual language',
      path: 'VisualIdentity',
      color: 'from-blue-500 to-violet-500',
      stats: ['Colors', 'Typography', 'Logo Concepts']
    },
    {
      icon: MessageSquare,
      title: 'Messaging & Copy',
      description: '20+ tagline options, hero headings, microcopy a tone of voice pre rôzne segmenty',
      path: 'Messaging',
      color: 'from-violet-500 to-purple-500',
      stats: ['20+ Taglines', 'Voice Guides', 'Copywriting']
    },
    {
      icon: Network,
      title: 'Product Ecosystem',
      description: 'Stavai.sk × Estivo.io synergy map, AI tools overview a 3-year product roadmap',
      path: 'Ecosystem',
      color: 'from-purple-500 to-pink-500',
      stats: ['Ecosystem Map', 'AI Tools', 'Roadmap']
    },
    {
      icon: BookOpen,
      title: 'Brand Guidelines',
      description: 'Usage rules, dos & don\'ts, spacing, applications a scalability pre EU markets',
      path: 'Guidelines',
      color: 'from-pink-500 to-rose-500',
      stats: ['Standards', 'Usage', 'Scalability']
    }
  ];

  const keyMetrics = [
    { label: 'Target Markets', value: 'EU/CEE', icon: Globe },
    { label: 'Audience Segments', value: '8+', icon: Users },
    { label: 'Growth Focus', value: 'AI-First', icon: TrendingUp },
    { label: 'Brand Level', value: 'Premium', icon: Sparkles }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-violet-500/10"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(14, 165, 233, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)'
        }}></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/10 to-violet-500/10 border border-cyan-500/20 mb-8">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-cyan-400 font-medium">Brand Identity System</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="gradient-text">Stavai.sk</span>
              <br />
              <span className="text-white">Brand Universe</span>
            </h1>

            <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-8">
              Komplexná brand identity pre AI platformu, ktorá mení stavebníctvo, 
              development a real estate. Technologický, profesionálny a škálovateľný 
              systém pre európsky trh.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to={createPageUrl('Strategy')}
                className="group px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-2xl hover:shadow-cyan-500/50 transition-all flex items-center gap-2"
              >
                Preskúmať Stratégiu
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to={createPageUrl('VisualIdentity')}
                className="px-8 py-4 border-2 border-slate-700 text-white rounded-xl font-semibold hover:border-cyan-500 hover:bg-slate-800/50 transition-all"
              >
                Visual Identity
              </Link>
            </div>
          </motion.div>

          {/* Key Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20"
          >
            {keyMetrics.map((metric, index) => (
              <div key={index} className="glass-effect rounded-2xl p-6 text-center group hover:border-cyan-500/50 transition-all">
                <metric.icon className="w-8 h-8 mx-auto mb-3 text-cyan-400 group-hover:scale-110 transition-transform" />
                <div className="text-3xl font-bold text-white mb-1">{metric.value}</div>
                <div className="text-sm text-slate-400">{metric.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Brand Sections Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Brand Identity Komponenty
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Každá sekcia obsahuje strategické, vizuálne a komunikačné komponenty 
            pripravené na implementáciu
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {sections.map((section, index) => (
            <motion.div
              key={section.path}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link to={createPageUrl(section.path)} className="group block">
                <div className="glass-effect rounded-2xl p-8 hover:border-cyan-500/50 transition-all h-full">
                  <div className="flex items-start justify-between mb-6">
                    <div className={`p-4 rounded-xl bg-gradient-to-br ${section.color} bg-opacity-10 group-hover:scale-110 transition-transform`}>
                      <section.icon className="w-8 h-8 text-white" />
                    </div>
                    <ArrowRight className="w-6 h-6 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:gradient-text transition-all">
                    {section.title}
                  </h3>
                  <p className="text-slate-400 mb-6">{section.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {section.stats.map((stat, i) => (
                      <span key={i} className="px-3 py-1 rounded-full bg-slate-800/50 text-slate-400 text-xs border border-slate-700">
                        {stat}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="relative overflow-hidden rounded-3xl">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-blue-600 to-violet-600"></div>
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.2) 0%, transparent 50%)'
          }}></div>
          
          <div className="relative px-8 md:px-16 py-16 md:py-20 text-center">
            <Zap className="w-16 h-16 mx-auto mb-6 text-white" />
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Ready to Build the Future?
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
              Táto brand identity je pripravená škálovať po celej Európe a stať sa 
              štandardom v AI pre stavebníctvo a real estate.
            </p>
            <Link
              to={createPageUrl('Home')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-all shadow-2xl"
            >
              Prejsť na Hlavný Web
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}