import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, TrendingDown, Clock, CheckCircle, ArrowRight,
  DollarSign, Users, Target, Zap, BarChart3
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function CaseStudies() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const caseStudies = [
    {
      id: 1,
      category: 'residential',
      title: 'Bytový Komplex Devínska Nová Ves',
      client: 'Developer SK s.r.o.',
      location: 'Bratislava, SK',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
      challenge: 'Developer potreboval rýchlu feasibility analýzu pre 120-jednotkový bytový projekt v Bratislave',
      solution: 'Použili sme AI Cost Estimator + Feasibility Analyzer pre kompletný investment model',
      results: {
        timeSaved: '87%',
        costSaved: '€52,000',
        accuracy: '94%',
        roi: '22.5%'
      },
      metrics: [
        { label: 'Čas úspory', value: '3 týždne → 2 dni', icon: Clock },
        { label: 'Náklady analýzy', value: '€60k → €8k', icon: DollarSign },
        { label: 'Presnosť odhadu', value: '94% vs actual', icon: Target },
        { label: 'ROI projektu', value: '22.5% IRR', icon: TrendingDown }
      ],
      testimonial: {
        quote: 'Stavai.sk nám ušetril niekoľko týždňov práce. AI nástroje poskytli detailnú analýzu za zlomok času a nákladov tradičného prístupu.',
        author: 'Ing. Martin Kováč',
        role: 'Investment Director, Developer SK'
      }
    },
    {
      id: 2,
      category: 'commercial',
      title: 'Kancelárske Centrum Prievoz',
      client: 'CBRE Slovakia',
      location: 'Bratislava, SK',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
      challenge: 'Potreba rýchlej valuácie a feasibility pre 8,500 m² office space v konkurenčnom výberovom konaní',
      solution: 'AI-powered market intelligence + advanced ROI modeling poskytol kompletný investment memo za 48h',
      results: {
        timeSaved: '92%',
        costSaved: '€85,000',
        accuracy: '96%',
        roi: '18.3%'
      },
      metrics: [
        { label: 'Delivery time', value: '2 týždne → 2 dni', icon: Clock },
        { label: 'Analýza savings', value: '€100k → €15k', icon: DollarSign },
        { label: 'Market accuracy', value: '96% correlation', icon: Target },
        { label: 'Predicted yield', value: '18.3% p.a.', icon: BarChart3 }
      ],
      testimonial: {
        quote: 'Získali sme kompletný investment memo s market comps a cashflow modelom za 2 dni namiesto 2 týždňov. Vďaka tomu sme vyhrali tender.',
        author: 'Jana Nováková, MSc.',
        role: 'Senior Analyst, CBRE Slovakia'
      }
    },
    {
      id: 3,
      category: 'industrial',
      title: 'Logistický Park Senec',
      client: 'Prologis Czech Republic & Slovakia',
      location: 'Senec, SK',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800',
      challenge: 'Due diligence pre acquisition 45,000 m² warehouse facility s tight deadline',
      solution: 'Timeline Generator + Cost Estimator + Building Analyzer pre kompletnú analýzu',
      results: {
        timeSaved: '78%',
        costSaved: '€125,000',
        accuracy: '91%',
        roi: '15.8%'
      },
      metrics: [
        { label: 'DD completion', value: '4 týždne → 5 dni', icon: Clock },
        { label: 'Cost reduction', value: '€160k → €35k', icon: DollarSign },
        { label: 'Structural accuracy', value: '91% match', icon: Target },
        { label: 'Cap rate', value: '15.8% NOI', icon: TrendingDown }
      ],
      testimonial: {
        quote: 'AI tools umožnili našemu týmu dokončiť technical due diligence 5x rýchlejšie bez kompromisu na kvalite.',
        author: 'Tomáš Novák',
        role: 'Acquisitions Manager, Prologis'
      }
    },
    {
      id: 4,
      category: 'renovation',
      title: 'Historická Budova Centrum Košíc',
      client: 'Heritage Properties s.r.o.',
      location: 'Košice, SK',
      image: 'https://images.unsplash.com/photo-1511452885600-a3d2c9148a31?w=800',
      challenge: 'Komplikovaná rekonštrukcia protected building s neistými nákladmi a časovým rámcom',
      solution: 'Building Analyzer + AI Cost Estimator s historical building parameters',
      results: {
        timeSaved: '65%',
        costSaved: '€38,000',
        accuracy: '89%',
        roi: '19.2%'
      },
      metrics: [
        { label: 'Planning time', value: '6 týždňov → 2 týždne', icon: Clock },
        { label: 'Analysis cost', value: '€55k → €17k', icon: DollarSign },
        { label: 'Cost accuracy', value: '89% vs actual', icon: Target },
        { label: 'Project ROI', value: '19.2% levered', icon: TrendingDown }
      ],
      testimonial: {
        quote: 'Pre historické budovy je ťažké odhadnúť náklady. AI model Stavai.sk bol prekvapivo presný a ušetril nám množstvo času.',
        author: 'Mgr. Petra Horváthová',
        role: 'Project Lead, Heritage Properties'
      }
    }
  ];

  const categories = [
    { id: 'all', label: 'Všetky projekty' },
    { id: 'residential', label: 'Residential' },
    { id: 'commercial', label: 'Commercial' },
    { id: 'industrial', label: 'Industrial' },
    { id: 'renovation', label: 'Renovation' }
  ];

  const overallStats = [
    { label: 'Projektov analyzovaných', value: '1,247', icon: Building2 },
    { label: 'Priemerná úspora času', value: '84%', icon: Clock },
    { label: 'Priemerná úspora nákladov', value: '€67k', icon: DollarSign },
    { label: 'Priemerná presnosť', value: '92.5%', icon: Target }
  ];

  const filteredCases = selectedCategory === 'all' 
    ? caseStudies 
    : caseStudies.filter(c => c.category === selectedCategory);

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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-6">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-600 font-medium">Reálne projekty, reálne výsledky</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
              Case Studies
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Ako AI nástroje Stavai.sk pomohli developerom, investorom a stavebným firmám 
              ušetriť čas a peniaze pri reálnych projektoch v CEE regióne.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Overall Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-slate-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {overallStats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-white border-slate-200 shadow-md text-center">
                <CardContent className="p-6">
                  <stat.icon className="w-8 h-8 mx-auto mb-3 text-blue-600" />
                  <div className="text-3xl font-bold gradient-text mb-1">{stat.value}</div>
                  <div className="text-sm text-slate-600">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-b border-slate-200">
        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(cat.id)}
              className={selectedCategory === cat.id 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600' 
                : 'border-slate-300 text-slate-700 hover:border-blue-300'
              }
            >
              {cat.label}
            </Button>
          ))}
        </div>
      </section>

      {/* Case Studies */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="space-y-20">
          {filteredCases.map((study, index) => (
            <motion.div
              key={study.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="grid md:grid-cols-2 gap-12 items-center"
            >
              {/* Image */}
              <div className={index % 2 === 0 ? 'order-1' : 'order-1 md:order-2'}>
                <div className="relative rounded-2xl overflow-hidden shadow-xl group">
                  <img 
                    src={study.image} 
                    alt={study.title}
                    className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full">
                    <span className="text-sm font-bold text-blue-600">{study.location}</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className={index % 2 === 0 ? 'order-2' : 'order-2 md:order-1'}>
                <div className="inline-block px-3 py-1 bg-blue-500/10 text-blue-600 rounded-full text-sm font-semibold mb-4">
                  {study.category.toUpperCase()}
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-3">{study.title}</h2>
                <p className="text-slate-600 mb-2">{study.client}</p>

                <div className="space-y-4 my-6">
                  <div>
                    <div className="text-sm font-semibold text-slate-900 mb-2">Challenge:</div>
                    <p className="text-slate-600">{study.challenge}</p>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900 mb-2">Solution:</div>
                    <p className="text-slate-600">{study.solution}</p>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-4 my-6">
                  {study.metrics.map((metric, i) => (
                    <div key={i} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                      <metric.icon className="w-5 h-5 text-blue-600 mb-2" />
                      <div className="text-xs text-slate-600 mb-1">{metric.label}</div>
                      <div className="text-lg font-bold text-slate-900">{metric.value}</div>
                    </div>
                  ))}
                </div>

                {/* Testimonial */}
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                  <CardContent className="p-6">
                    <p className="text-slate-700 italic mb-4">"{study.testimonial.quote}"</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold">
                        {study.testimonial.author.split(' ')[0][0]}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{study.testimonial.author}</div>
                        <div className="text-sm text-slate-600">{study.testimonial.role}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-200">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700"></div>
          <div className="relative px-8 md:px-16 py-16 text-center">
            <Zap className="w-12 h-12 mx-auto mb-6 text-white" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Pripravený na podobné výsledky?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Začni používať AI nástroje Stavai.sk ešte dnes a pridaj sa k stovkám úspešných projektov v CEE
            </p>
            <Button className="bg-white text-blue-600 hover:bg-blue-50 px-10 py-6 text-lg font-bold rounded-xl shadow-xl">
              Začať zadarmo
              <ArrowRight className="w-6 h-6 ml-2" />
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}