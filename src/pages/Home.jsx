import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import { 
  ArrowRight, Zap, Brain, TrendingUp, Building2, BarChart3, 
  Clock, DollarSign, CheckCircle, Sparkles, Users, Globe
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function Home() {
  const benefits = [
    {
      icon: Brain,
      title: 'AI-Powered Analytics',
      description: 'Inteligentné modely pre presné odhady a predikcie'
    },
    {
      icon: TrendingUp,
      title: 'Investment Intelligence',
      description: 'ROI, IRR a cashflow analýzy na profesionálnej úrovni'
    },
    {
      icon: Clock,
      title: 'Instant Results',
      description: 'Minúty namiesto dní — AI pracuje za vás'
    },
    {
      icon: Building2,
      title: 'Full Lifecycle Coverage',
      description: 'Od konceptu po realizáciu a monitoring'
    }
  ];

  const tools = [
    {
      name: 'Cost Estimator',
      description: 'AI odhad nákladov na stavbu',
      icon: DollarSign,
      tag: 'FREE',
      color: 'from-cyan-500 to-blue-500'
    },
    {
      name: 'Timeline Generator',
      description: 'Harmonogram projektu za minútu',
      icon: Clock,
      tag: 'FREE',
      color: 'from-blue-500 to-violet-500'
    },
    {
      name: 'Feasibility Analyzer',
      description: 'Kompletná investment analýza',
      icon: BarChart3,
      tag: 'PRO',
      color: 'from-violet-500 to-purple-500'
    }
  ];

  const stats = [
    { value: '1,247', label: 'Projektov' },
    { value: '€8.4M', label: 'Ušetrených' },
    { value: '84%', label: 'Avg. Úspora' },
    { value: '92.5%', label: 'AI Presnosť' }
  ];

  const testimonials = [
    {
      quote: 'Konečne nástroj, ktorý chápe reálne potreby developerov v našom regióne.',
      author: 'Martin K.',
      role: 'Real Estate Developer',
      company: 'Prague'
    },
    {
      quote: 'AI analytics nám ušetrili stovky hodín pri investment modeling.',
      author: 'Anna S.',
      role: 'Investment Analyst',
      company: 'Bratislava'
    },
    {
      quote: 'Presnosť odhadov je neuveriteľná. Game changer pre stavebný biznis.',
      author: 'Tomáš V.',
      role: 'Construction Manager',
      company: 'Kraków'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
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
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-blue-400 font-medium">AI Construction Intelligence Platform</span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8">
              <span className="gradient-text">Stavai.sk</span>
              <br />
              <span className="text-slate-900">AI pre stavebníctvo</span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto mb-12 leading-relaxed">
              Inteligentné nástroje pre developerov, investorov a stavebné firmy.
              <br />
              Od analýzy po realizáciu — rýchlejšie, presnejšie, s AI.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6">
              <Link to={createPageUrl('AITools')}>
                <button className="px-10 py-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-blue-500/50 transition-all">
                  Vyskúšať AI Nástroje
                  <ArrowRight className="w-6 h-6 ml-2 inline" />
                </button>
              </Link>
              <Link to={createPageUrl('About')}>
                <button className="px-10 py-6 border-2 border-slate-700 text-white rounded-xl font-bold text-lg hover:border-blue-500 hover:bg-slate-800/50 transition-all">
                  Zistiť viac
                </button>
              </Link>
            </div>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-20"
          >
            <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-8 max-w-5xl mx-auto shadow-lg">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                {stats.map((stat, index) => (
                  <div key={index}>
                    <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">{stat.value}</div>
                    <div className="text-sm text-slate-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Prečo Stavai.sk?
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Spojenie umelej inteligencie s odbornou znalosťou stavebníctva a real estate
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-white border-slate-200 hover:border-blue-300 transition-all h-full shadow-md">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center mx-auto mb-6">
                    <benefit.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{benefit.title}</h3>
                  <p className="text-slate-600">{benefit.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Tools Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-200 bg-slate-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Zap className="w-12 h-12 mx-auto mb-6 text-blue-600" />
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            AI Nástroje
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Od jednoduchých odhadov po komplexné investment analytics
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {tools.map((tool, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative glass-effect rounded-2xl p-8 hover:border-cyan-500/50 transition-all group"
            >
              <div className="absolute top-6 right-6">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  tool.tag === 'FREE' 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-blue-500/20 text-blue-400'
                }`}>
                  {tool.tag}
                </span>
              </div>
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <tool.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">{tool.name}</h3>
              <p className="text-slate-400 mb-6">{tool.description}</p>
              <div className="flex items-center gap-2 text-blue-400 font-semibold group-hover:gap-3 transition-all">
                Vyskúšať
                <ArrowRight className="w-5 h-5" />
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link
            to={createPageUrl('AITools')}
            className="inline-flex items-center gap-3 px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-xl font-semibold hover:bg-blue-600 hover:text-white transition-all"
          >
            Zobraziť všetky nástroje
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-200">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Users className="w-12 h-12 mx-auto mb-6 text-blue-600" />
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Dôveruje nám komunita
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Profesionáli z celej CEE využívajú Stavai.sk dennodenne
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-effect rounded-2xl p-8"
            >
              <div className="mb-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">★</span>
                  ))}
                </div>
                <p className="text-slate-300 italic">"{testimonial.quote}"</p>
              </div>
              <div className="border-t border-slate-700 pt-4">
                <div className="font-semibold text-white">{testimonial.author}</div>
                <div className="text-sm text-slate-500">{testimonial.role}</div>
                <div className="text-sm text-slate-500">{testimonial.company}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section - Estivo */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-200 bg-slate-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700"></div>
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.3) 0%, transparent 50%)'
          }}></div>
          
          <div className="relative px-8 md:px-16 py-16 md:py-24">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm mb-6">
                <TrendingUp className="w-4 h-4 text-white" />
                <span className="text-sm text-white font-medium">Bratská platforma — Professional Tools</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Potrebujete viac?
                <br />
                Spoznajte Estivo.io
              </h2>
              
              <p className="text-xl text-blue-100 mb-8 max-w-2xl">
                Profesionálna fintech platforma pre investment modeling, ROI/IRR analytics 
                a feasibility studies. Pre serious developers a investorov.
              </p>
              
              <ul className="space-y-3 mb-10">
                {['Advanced ROI & IRR models', 'CEE tax & legal modules', 'API integrations', 'Enterprise support'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-white">
                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link to={createPageUrl('Estivo')}>
                <button className="px-8 py-6 bg-white text-blue-600 hover:bg-blue-50 rounded-xl font-bold text-lg transition-all">
                  Preskúmať Estivo.io
                  <ArrowRight className="w-5 h-5 ml-2 inline" />
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Final CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-200">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Globe className="w-12 h-12 mx-auto mb-6 text-blue-600" />
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Pripravení stavať budúcnosť?
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
            Pripojte sa k stovkám profesionálov, ktorí používajú AI 
            pre lepšie rozhodnutia v stavebníctve a real estate.
          </p>
          <Link to={createPageUrl('AITools')}>
            <button className="px-10 py-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-blue-500/50 transition-all">
              Začať zadarmo
              <ArrowRight className="w-6 h-6 ml-2 inline" />
            </button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}