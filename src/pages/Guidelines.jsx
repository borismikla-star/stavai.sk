import React from 'react';
import { BookOpen, Check, X, Layers, Maximize2, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Guidelines() {
  const logoUsage = {
    dos: [
      'Use official logo files provided',
      'Maintain minimum clear space',
      'Respect minimum size requirements',
      'Use on approved background colors',
      'Maintain aspect ratio when scaling'
    ],
    donts: [
      'Alter colors or gradients',
      'Rotate or skew the logo',
      'Add effects (shadows, outlines, 3D)',
      'Place on busy backgrounds',
      'Recreate or redraw the logo'
    ]
  };

  const colorUsage = {
    primary: {
      name: 'Primary Blue (#0EA5E9)',
      usage: 'CTAs, links, primary actions, active states',
      avoid: 'Large text blocks, backgrounds for white text'
    },
    secondary: {
      name: 'Violet (#8B5CF6)',
      usage: 'Premium features, gradients, accent elements',
      avoid: 'Small text, primary navigation'
    },
    neutral: {
      name: 'Slate Greys',
      usage: 'Backgrounds, surfaces, borders, secondary text',
      avoid: 'Primary CTAs, important highlights'
    }
  };

  const typographyRules = [
    {
      element: 'Headings (H1-H3)',
      font: 'Inter Bold/Semibold',
      size: '36px - 72px',
      usage: 'Hero sections, page titles, section headings',
      avoid: 'Long paragraphs, body text'
    },
    {
      element: 'Body Text',
      font: 'Inter Regular',
      size: '16px - 18px',
      usage: 'Paragraphs, descriptions, article content',
      avoid: 'Headings, CTAs, navigation'
    },
    {
      element: 'UI Elements',
      font: 'Inter Medium',
      size: '14px - 16px',
      usage: 'Buttons, labels, navigation, forms',
      avoid: 'Long form content'
    },
    {
      element: 'Small Text',
      font: 'Inter Regular',
      size: '12px - 14px',
      usage: 'Captions, metadata, footnotes',
      avoid: 'Primary content, headings'
    }
  ];

  const spacing = [
    { size: '4px', usage: 'Icon-text gaps, tight elements' },
    { size: '8px', usage: 'Input padding, button gaps' },
    { size: '16px', usage: 'Card padding, list items' },
    { size: '24px', usage: 'Section gaps, component spacing' },
    { size: '48px', usage: 'Section margins, major breaks' },
    { size: '80px+', usage: 'Page sections, hero padding' }
  ];

  const applications = [
    {
      context: 'Web Platform',
      specifications: [
        'Responsive design (mobile-first)',
        'Glass morphism for cards',
        'Neural grid background pattern',
        'Smooth animations (framer-motion)',
        'Hover states with glow effects'
      ]
    },
    {
      context: 'Social Media',
      specifications: [
        'Profile image: Symbol only (square)',
        'Cover/Header: Wordmark with tagline',
        'Post templates: Brand colors + gradient',
        'Consistent filters & style',
        'Logo on gradient backgrounds'
      ]
    },
    {
      context: 'Documents & Presentations',
      specifications: [
        'PDF exports: Full color logo',
        'Slide decks: Dark theme by default',
        'White papers: Professional, minimal branding',
        'Reports: Header/footer with symbol',
        'Email signatures: Wordmark + link'
      ]
    },
    {
      context: 'Marketing Materials',
      specifications: [
        'Print: CMYK color profile',
        'Digital ads: RGB, high contrast',
        'Banners: Wordmark + key message',
        'Business cards: Minimal, premium feel',
        'Merchandise: Symbol on branded items'
      ]
    }
  ];

  const accessibility = [
    'WCAG 2.1 AA compliance minimum',
    'Color contrast ratio 4.5:1 for text',
    'Focus states clearly visible',
    'Alternative text for all images',
    'Keyboard navigation support',
    'Screen reader friendly markup'
  ];

  const euMarkets = [
    {
      market: 'Slovakia',
      considerations: ['Slovak language primary', 'EUR currency', 'SK-specific regulations', 'Local payment methods']
    },
    {
      market: 'Czech Republic',
      considerations: ['Czech language', 'CZK currency', 'Different VAT rules', 'Market-specific content']
    },
    {
      market: 'Poland',
      considerations: ['Polish language', 'PLN currency', 'Large market opportunity', 'Local partnerships']
    },
    {
      market: 'Western EU',
      considerations: ['English as lingua franca', 'GDPR strict compliance', 'Premium positioning', 'Bank integrations']
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 border border-rose-500/20 mb-6">
              <BookOpen className="w-4 h-4 text-rose-400" />
              <span className="text-sm text-rose-400 font-medium">Brand Guidelines</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Usage Guidelines
            </h1>
            <p className="text-xl text-slate-400">
              Standards, best practices, dos & don'ts, a scalability rules pre EU markets
            </p>
          </motion.div>
        </div>
      </section>

      {/* Logo Usage */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="mb-12">
          <Layers className="w-12 h-12 mb-4 text-cyan-400" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Logo Usage Rules
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl">
            Pravidlá pre správne použitie loga
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Do's */}
          <div className="glass-effect rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                <Check className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-white">Do's</h3>
            </div>
            <ul className="space-y-4">
              {logoUsage.dos.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                  <span className="text-slate-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Don'ts */}
          <div className="glass-effect rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                <X className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-2xl font-bold text-white">Don'ts</h3>
            </div>
            <ul className="space-y-4">
              {logoUsage.donts.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <X className="w-5 h-5 text-red-400 mt-1 flex-shrink-0" />
                  <span className="text-slate-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Logo Examples */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="glass-effect rounded-xl p-8 text-center">
            <div className="mb-4 text-green-400 font-semibold">✓ Correct</div>
            <div className="bg-slate-900 rounded-lg p-8 mb-4">
              <div className="inline-flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                  <span className="text-white font-bold">S</span>
                </div>
                <div className="text-xl font-bold gradient-text">Stavai.sk</div>
              </div>
            </div>
            <p className="text-sm text-slate-400">Proper spacing, colors, ratio</p>
          </div>

          <div className="glass-effect rounded-xl p-8 text-center border-red-500/30">
            <div className="mb-4 text-red-400 font-semibold">✗ Incorrect</div>
            <div className="bg-slate-900 rounded-lg p-8 mb-4">
              <div className="inline-flex items-center gap-3 transform rotate-12">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                  <span className="text-white font-bold">S</span>
                </div>
                <div className="text-xl font-bold text-white">Stavai.sk</div>
              </div>
            </div>
            <p className="text-sm text-slate-400">Don't rotate or skew</p>
          </div>

          <div className="glass-effect rounded-xl p-8 text-center border-red-500/30">
            <div className="mb-4 text-red-400 font-semibold">✗ Incorrect</div>
            <div className="bg-gradient-to-r from-red-500 to-yellow-500 rounded-lg p-8 mb-4">
              <div className="inline-flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                  <span className="text-slate-900 font-bold">S</span>
                </div>
                <div className="text-xl font-bold text-white">Stavai.sk</div>
              </div>
            </div>
            <p className="text-sm text-slate-400">Don't alter colors</p>
          </div>
        </div>
      </section>

      {/* Color Guidelines */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-800">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Color Usage Guidelines
          </h2>
        </div>

        <div className="space-y-6">
          {Object.entries(colorUsage).map(([key, value], index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-effect rounded-xl p-6"
            >
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <div className="text-sm text-slate-500 mb-1">Color</div>
                  <div className="text-white font-bold">{value.name}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-500 mb-1">✓ Use For</div>
                  <div className="text-slate-300">{value.usage}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-500 mb-1">✗ Avoid</div>
                  <div className="text-slate-300">{value.avoid}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Typography Guidelines */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-800">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Typography Guidelines
          </h2>
        </div>

        <div className="space-y-4">
          {typographyRules.map((rule, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-effect rounded-xl p-6"
            >
              <div className="grid md:grid-cols-5 gap-4 items-center">
                <div>
                  <div className="text-sm text-slate-500 mb-1">Element</div>
                  <div className="text-white font-semibold">{rule.element}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-500 mb-1">Font</div>
                  <div className="text-slate-300">{rule.font}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-500 mb-1">Size</div>
                  <div className="text-slate-300">{rule.size}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-500 mb-1">✓ Use For</div>
                  <div className="text-slate-300 text-sm">{rule.usage}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-500 mb-1">✗ Avoid</div>
                  <div className="text-slate-300 text-sm">{rule.avoid}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Spacing System */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-800">
        <div className="mb-12">
          <Maximize2 className="w-12 h-12 mb-4 text-cyan-400" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Spacing System
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl">
            8px base unit spacing scale
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {spacing.map((item, index) => (
            <div key={index} className="glass-effect rounded-xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <div 
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded" 
                  style={{ width: item.size, height: item.size }}
                ></div>
                <div className="text-2xl font-bold text-white">{item.size}</div>
              </div>
              <p className="text-sm text-slate-400">{item.usage}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Applications */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-800">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Brand Applications
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl">
            Použitie brand identity v rôznych kontextoch
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {applications.map((app, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-effect rounded-2xl p-8"
            >
              <h3 className="text-xl font-bold text-white mb-6">{app.context}</h3>
              <ul className="space-y-3">
                {app.specifications.map((spec, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-300">{spec}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Accessibility */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-800">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Accessibility Standards
          </h2>
        </div>

        <div className="glass-effect rounded-2xl p-8">
          <div className="grid md:grid-cols-2 gap-6">
            {accessibility.map((standard, index) => (
              <div key={index} className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                <span className="text-slate-300">{standard}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EU Market Scalability */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-800">
        <div className="mb-12">
          <Globe className="w-12 h-12 mb-4 text-cyan-400" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            EU Market Scalability
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl">
            Prispôsobenie brand identity pre rôzne európske trhy
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {euMarkets.map((market, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="glass-effect rounded-xl p-6"
            >
              <h3 className="text-xl font-bold text-white mb-4">{market.market}</h3>
              <ul className="space-y-2">
                {market.considerations.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0"></div>
                    <span className="text-slate-300 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 glass-effect rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            Modulárny brand systém
          </h3>
          <p className="text-slate-400 max-w-3xl mx-auto">
            Vizuálna identita je navrhnutá tak, aby sa dala škálovať po celej Európe 
            bez straty konzistencie. Logo, farby a typografia ostávajú jednotné, 
            zatiaľ čo copywriting a content sa lokalizujú pre každý trh.
          </p>
        </div>
      </section>
    </div>
  );
}