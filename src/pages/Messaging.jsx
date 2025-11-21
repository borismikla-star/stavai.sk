import React, { useState } from 'react';
import { MessageSquare, Copy, Check, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Messaging() {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const taglines = [
    { text: 'AI, ktoré stavia budúcnosť', segment: 'Universal', emotion: 'Inspirational' },
    { text: 'Smart construction. Smarter decisions.', segment: 'Global', emotion: 'Professional' },
    { text: 'The new standard in real estate intelligence', segment: 'Premium', emotion: 'Authoritative' },
    { text: 'Build faster. Build smarter.', segment: 'Developer', emotion: 'Action-oriented' },
    { text: 'AI pre investorov, developerov a stavebníctvo', segment: 'SK Market', emotion: 'Inclusive' },
    { text: 'Where AI meets construction', segment: 'Tech', emotion: 'Simple' },
    { text: 'Inteligentné riešenia pre stavebný priemysel', segment: 'SK Corporate', emotion: 'Professional' },
    { text: 'From blueprint to ROI — powered by AI', segment: 'Investor', emotion: 'Results-focused' },
    { text: 'The AI platform for European real estate', segment: 'EU Market', emotion: 'Positioned' },
    { text: 'Stavať s istotou. Investovať s prehľadom.', segment: 'SK B2C', emotion: 'Trust-building' },
    { text: 'Construction intelligence for modern builders', segment: 'Construction', emotion: 'Focused' },
    { text: 'Transforming real estate with artificial intelligence', segment: 'PropTech', emotion: 'Innovation' },
    { text: 'Think. Build. Profit.', segment: 'Investor', emotion: 'Direct' },
    { text: 'Vaša AI architektka úspechu', segment: 'SK Personal', emotion: 'Warm' },
    { text: 'The future of construction starts here', segment: 'Vision', emotion: 'Bold' },
    { text: 'AI-powered insights for every project', segment: 'Universal', emotion: 'Accessible' },
    { text: 'Make better real estate decisions', segment: 'Investor', emotion: 'Benefit-focused' },
    { text: 'Stavebníctvo 2.0', segment: 'SK Modern', emotion: 'Revolutionary' },
    { text: 'Intelligence built in', segment: 'Product', emotion: 'Clever' },
    { text: 'Elevate your construction game', segment: 'Aspirational', emotion: 'Motivational' },
    { text: 'From concept to completion — intelligently', segment: 'Lifecycle', emotion: 'Comprehensive' },
    { text: 'Precision meets innovation', segment: 'Premium', emotion: 'Technical' },
    { text: 'AI asistent pre realitný trh', segment: 'SK RealEstate', emotion: 'Helpful' },
    { text: 'Build with confidence. Invest with clarity.', segment: 'Dual Audience', emotion: 'Reassuring' }
  ];

  const heroHeadings = [
    { heading: 'The AI Platform Transforming European Construction', subheading: 'From feasibility to ROI — intelligent tools for developers, investors, and builders' },
    { heading: 'Make Smarter Real Estate Decisions', subheading: 'AI-powered analytics, cost estimation, and investment modeling for CEE markets' },
    { heading: 'Stavebníctvo sa stretáva s AI', subheading: 'Profesionálne nástroje pre analýzu, kalkuláciu a optimalizáciu vašich projektov' },
    { heading: 'Build the Future with Intelligence', subheading: 'Next-generation platform connecting construction, development, and real estate' },
    { heading: 'Your AI Partner in Construction & Investment', subheading: 'Reduce risk. Maximize returns. Build smarter.' }
  ];

  const toneOfVoice = {
    attributes: [
      { trait: 'Professional', description: 'Bank-level credibility, expertise-driven', example: 'Our AI models analyze 500+ data points for accurate feasibility' },
      { trait: 'Innovative', description: 'Forward-thinking, tech-savvy language', example: 'Leveraging neural networks to predict construction timelines' },
      { trait: 'Accessible', description: 'Complex made simple, jargon-free when possible', example: 'Get instant cost estimates — no spreadsheets needed' },
      { trait: 'Confident', description: 'Authoritative without arrogance', example: 'The most advanced AI platform for CEE real estate' }
    ],
    dos: [
      'Use active voice and strong verbs',
      'Lead with benefits, not features',
      'Be specific with numbers and data',
      'Show expertise through insights',
      'Balance technical with accessible'
    ],
    donts: [
      'Avoid hype or overstatement',
      'Don\'t use buzzwords without context',
      'Never promise unrealistic outcomes',
      'Avoid overly casual tone',
      'Don\'t oversimplify complex topics'
    ]
  };

  const audienceMessaging = [
    {
      segment: 'Real Estate Developers',
      headline: 'Turn Concepts into Profitable Projects Faster',
      body: 'AI-powered feasibility analysis cuts your pre-development timeline by 60%. Model ROI, cashflows, and IRR before breaking ground.',
      cta: 'Start Project Analysis'
    },
    {
      segment: 'Investors & Funds',
      headline: 'Investment Intelligence That Scales',
      body: 'Portfolio-level analytics across CEE markets. Tax-optimized structures, risk modeling, and real-time market insights.',
      cta: 'Explore Investment Tools'
    },
    {
      segment: 'Construction Companies',
      headline: 'Estimate, Plan, Execute — All in One Platform',
      body: 'Generate accurate cost estimates and project timelines in minutes, not days. Keep projects on budget and on schedule.',
      cta: 'Get Cost Estimates'
    },
    {
      segment: 'Architects & Engineers',
      headline: 'Design with Data-Backed Confidence',
      body: 'Integrate building specs with cost analysis and regulation compliance. Optimize designs for both aesthetics and economics.',
      cta: 'Try Design Tools'
    }
  ];

  const microcopy = {
    ctas: [
      { context: 'Primary CTA', copy: 'Get Started Free' },
      { context: 'Secondary CTA', copy: 'See How It Works' },
      { context: 'Tools Page', copy: 'Try This Tool' },
      { context: 'Pricing', copy: 'Start Your Free Trial' },
      { context: 'Demo Request', copy: 'Schedule Demo' },
      { context: 'Contact', copy: 'Talk to an Expert' },
      { context: 'Sign Up', copy: 'Create Account' },
      { context: 'Learn More', copy: 'Explore Features' }
    ],
    notifications: [
      { context: 'Success', copy: 'Analysis complete! View your results.' },
      { context: 'Processing', copy: 'AI is crunching the numbers...' },
      { context: 'Error', copy: 'Something went wrong. Please try again.' },
      { context: 'Info', copy: 'Pro tip: Upload floor plans for more accurate estimates' }
    ]
  };

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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
              <MessageSquare className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-purple-400 font-medium">Messaging & Copywriting</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Brand Voice & Copy
            </h1>
            <p className="text-xl text-slate-400">
              20+ tagline options, hero headings, microcopy, tone of voice a messaging 
              framework pre všetky segmenty
            </p>
          </motion.div>
        </div>
      </section>

      {/* Taglines */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="mb-12">
          <Sparkles className="w-12 h-12 mb-4 text-cyan-400" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Tagline Options
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl">
            24 tagline directions — zvolených pre rôzne segmenty a emočné tóny
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {taglines.map((tagline, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02 }}
              className="glass-effect rounded-xl p-6 hover:border-cyan-500/50 transition-all group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="text-lg font-semibold text-white mb-2 group-hover:gradient-text transition-all">
                    "{tagline.text}"
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 rounded-md bg-cyan-500/10 text-cyan-400 text-xs">
                      {tagline.segment}
                    </span>
                    <span className="px-2 py-1 rounded-md bg-violet-500/10 text-violet-400 text-xs">
                      {tagline.emotion}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(tagline.text, index)}
                  className="p-2 rounded-lg hover:bg-slate-800 transition-colors flex-shrink-0"
                >
                  {copiedIndex === index ? (
                    <Check className="w-5 h-5 text-green-400" />
                  ) : (
                    <Copy className="w-5 h-5 text-slate-500 group-hover:text-cyan-400" />
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Hero Headings */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-800">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Hero Heading Options
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl">
            Powerful headlines s supporting subheadings pre homepage
          </p>
        </div>

        <div className="space-y-6">
          {heroHeadings.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-effect rounded-2xl p-8 hover:border-cyan-500/50 transition-all"
            >
              <div className="text-sm text-slate-500 mb-3">Option {index + 1}</div>
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {item.heading}
              </h3>
              <p className="text-lg text-slate-400">
                {item.subheading}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Tone of Voice */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-800">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Tone of Voice
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl">
            Ako komunikuje Stavai.sk — character traits a guidelines
          </p>
        </div>

        {/* Attributes */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {toneOfVoice.attributes.map((attr, index) => (
            <div key={index} className="glass-effect rounded-xl p-6">
              <h3 className="text-xl font-bold gradient-text mb-2">{attr.trait}</h3>
              <p className="text-slate-400 mb-4">{attr.description}</p>
              <div className="bg-slate-900 rounded-lg p-4 border-l-4 border-cyan-500">
                <div className="text-sm text-slate-500 mb-1">Example:</div>
                <div className="text-slate-300 italic">"{attr.example}"</div>
              </div>
            </div>
          ))}
        </div>

        {/* Do's and Don'ts */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="glass-effect rounded-2xl p-8">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Check className="w-6 h-6 text-green-400" />
              Do's
            </h3>
            <ul className="space-y-3">
              {toneOfVoice.dos.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="glass-effect rounded-2xl p-8">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-6 h-6 flex items-center justify-center rounded-full bg-red-500/20 text-red-400">✕</span>
              Don'ts
            </h3>
            <ul className="space-y-3">
              {toneOfVoice.donts.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-5 h-5 flex items-center justify-center rounded-full bg-red-500/20 text-red-400 text-xs mt-0.5 flex-shrink-0">✕</span>
                  <span className="text-slate-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Segment Messaging */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-800">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Audience-Specific Messaging
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl">
            Tailored messaging pre každý target segment
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {audienceMessaging.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-effect rounded-2xl p-8"
            >
              <div className="text-sm text-cyan-400 font-semibold mb-3">{item.segment}</div>
              <h3 className="text-2xl font-bold text-white mb-4">{item.headline}</h3>
              <p className="text-slate-400 mb-6">{item.body}</p>
              <div className="inline-flex px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg font-semibold">
                {item.cta}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Microcopy */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-800">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Microcopy Library
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl">
            Button labels, notifications a UI copy
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="glass-effect rounded-2xl p-8">
            <h3 className="text-xl font-bold text-white mb-6">CTA Buttons</h3>
            <div className="space-y-3">
              {microcopy.ctas.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
                  <div>
                    <div className="text-sm text-slate-500">{item.context}</div>
                    <div className="text-white font-medium mt-1">{item.copy}</div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(item.copy, `cta-${i}`)}
                    className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    {copiedIndex === `cta-${i}` ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-slate-500" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-effect rounded-2xl p-8">
            <h3 className="text-xl font-bold text-white mb-6">Notifications</h3>
            <div className="space-y-3">
              {microcopy.notifications.map((item, i) => (
                <div key={i} className="p-4 bg-slate-900 rounded-lg border-l-4 border-cyan-500">
                  <div className="text-xs text-slate-500 mb-1">{item.context}</div>
                  <div className="text-slate-300">{item.copy}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}