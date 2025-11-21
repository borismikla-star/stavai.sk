import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import { 
  Zap, Target, Users, Globe, TrendingUp, Brain, 
  Building2, ArrowRight, Sparkles, Lock, CheckCircle
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function About() {
  const mission = [
    {
      icon: Target,
      title: 'Naše poslanie',
      description: 'Prinášame umelú inteligenciu do stavebníctva, developmentu a real estate. Chceme, aby každý projekt začínal s AI insights, nie s hádaním.'
    },
    {
      icon: Brain,
      title: 'AI-First prístup',
      description: 'Veríme, že AI zásadne zmení stavebný sektor. Nenahrádzame ľudí — dávame im superschopnosti pre lepšie rozhodnutia.'
    },
    {
      icon: Globe,
      title: 'CEE focus',
      description: 'Špecializujeme sa na stredoeurópsky trh. Poznáme lokálne špecifiká, ceny, regulácie a trendy SK/CZ/PL.'
    }
  ];

  const values = [
    'Transparentnosť v odhadoch a cenách',
    'CEE market expertise',
    'AI-powered, nie AI-hype',
    'Rýchlosť bez kompromisov',
    'Developer-first mentality',
    'Data-driven decisions'
  ];

  const ecosystem = [
    {
      name: 'Stavai.sk',
      tagline: 'AI for Construction',
      description: 'Free AI nástroje pre všetkých — cost estimates, timelines, knowledge hub. Ideálne pre začiatok projektu.',
      icon: Zap,
      gradient: 'from-cyan-500 to-blue-500',
      path: 'Home',
      features: [
        'FREE AI Cost Estimator',
        'Timeline Generator',
        'Knowledge Hub',
        'Project Management'
      ]
    },
    {
      name: 'Estivo.io',
      tagline: 'Investment Intelligence',
      description: 'Professional fintech platforma pre serious developers. ROI/IRR models, CEE tax engine, API, white-label.',
      icon: Lock,
      gradient: 'from-violet-500 to-purple-500',
      path: 'Estivo',
      features: [
        'Advanced ROI/IRR Analytics',
        'CEE Tax & Legal Modules',
        'API Integrations',
        'Enterprise Support'
      ]
    }
  ];

  const timeline = [
    {
      year: '2024',
      title: 'Idea & Research',
      description: 'Identifikovali sme potrebu pre AI v CEE construction sektore'
    },
    {
      year: '2025 Q1',
      title: 'Stavai.sk Launch',
      description: 'Free AI nástroje pre každého developera a investora'
    },
    {
      year: '2025 Q2',
      title: 'Estivo.io Launch',
      description: 'Professional investment platform pre enterprise segment'
    },
    {
      year: '2025+',
      title: 'CEE Expansion',
      description: 'Rozšírenie na celý stredoeurópsky trh, nové AI features'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-violet-500/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              AI pre stavebníctvo
              <br />
              <span className="gradient-text">built in CEE</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-400 max-w-4xl mx-auto leading-relaxed">
              Prinášame novú éru do konzervatívneho stavebného sektora.
              <br />
              Dva produkty. Jeden ekosystém. Neobmedzené možnosti.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {mission.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="glass-effect border-slate-800 h-full">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center mx-auto mb-6">
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-slate-400">{item.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Naše hodnoty</h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-12">
            Princípy, ktorými sa riadime pri vývoji produktov
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="glass-effect border-slate-800 rounded-xl p-4 flex items-center gap-3"
            >
              <CheckCircle className="w-5 h-5 text-cyan-400 flex-shrink-0" />
              <span className="text-white">{value}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Ecosystem */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-800">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-cyan-400 font-medium">Dva produkty, jeden ekosystém</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Stavai.sk + Estivo.io
          </h2>
          <p className="text-lg text-slate-400 max-w-3xl mx-auto">
            Bratské produkty navrhnuté pre rôzne potreby — od free nástrojov až po enterprise analytics
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {ecosystem.map((product, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
            >
              <Card className={`glass-effect border-2 ${index === 0 ? 'border-cyan-500/50' : 'border-violet-500/50'} h-full`}>
                <CardContent className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${product.gradient} flex items-center justify-center`}>
                      <product.icon className="w-7 h-7 text-white" />
                    </div>
                    {index === 0 ? (
                      <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold">
                        FREE
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-violet-500/20 text-violet-400 text-xs font-bold">
                        PRO
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-2">{product.name}</h3>
                  <div className="text-sm text-slate-500 mb-4">{product.tagline}</div>
                  <p className="text-slate-400 mb-6">{product.description}</p>

                  <ul className="space-y-2 mb-6">
                    {product.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                        <CheckCircle className={`w-4 h-4 flex-shrink-0 ${index === 0 ? 'text-cyan-400' : 'text-violet-400'}`} />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Link to={createPageUrl(product.path)}>
                    <Button className={`w-full ${index === 0 ? 'bg-gradient-to-r from-cyan-600 to-blue-600' : 'bg-gradient-to-r from-violet-600 to-purple-600'}`}>
                      Prejsť na {product.name}
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-effect border-slate-800 rounded-2xl p-8 text-center"
        >
          <TrendingUp className="w-12 h-12 mx-auto mb-4 text-cyan-400" />
          <h3 className="text-xl font-bold text-white mb-2">Seamless Transition</h3>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Začni zadarmo so Stavai.sk pre základné odhady a analýzy. 
            Keď potrebuješ pokročilé investment modeling a enterprise features, upgrade na Estivo.io je otázkou jedného kliknutia.
          </p>
        </motion.div>
      </section>

      {/* Timeline */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-800">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Naša cesta</h2>
          <p className="text-lg text-slate-400">Od nápadu po CEE lídra v AI construction tech</p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {timeline.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative pl-8 pb-12 last:pb-0"
            >
              {index < timeline.length - 1 && (
                <div className="absolute left-2 top-8 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500 to-violet-500"></div>
              )}
              <div className="absolute left-0 top-0 w-5 h-5 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 border-4 border-slate-900"></div>
              
              <div className="glass-effect border-slate-800 rounded-xl p-6">
                <div className="text-sm font-bold text-cyan-400 mb-1">{item.year}</div>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-slate-400">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Team CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-800">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-blue-600 to-violet-600"></div>
          <div className="relative px-8 md:px-16 py-16 text-center">
            <Users className="w-16 h-16 mx-auto mb-6 text-white" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Máme veľké plány
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Ak zdieľaš našu víziu pre AI v stavebníctve a chceš byť súčasťou niečoho veľkého, kontaktuj nás.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a href="mailto:hello@stavai.sk">
                <Button className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg font-bold rounded-xl">
                  hello@stavai.sk
                </Button>
              </a>
              <Link to={createPageUrl('AITools')}>
                <Button variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg font-semibold rounded-xl">
                  Vyskúšať AI nástroje
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}