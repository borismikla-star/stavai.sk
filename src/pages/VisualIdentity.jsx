import React from 'react';
import { Palette, Type, Layers, Grid, Sparkles, Check } from 'lucide-react';
import { motion } from 'framer-motion';

export default function VisualIdentity() {
  const colorPalette = {
    primary: [
      { name: 'Electric Blue', hex: '#0EA5E9', use: 'Primary actions, CTAs, highlights' },
      { name: 'Deep Blue', hex: '#0284C7', use: 'Hover states, depth' },
      { name: 'Cyan Accent', hex: '#06B6D4', use: 'AI elements, gradients' }
    ],
    secondary: [
      { name: 'Violet', hex: '#8B5CF6', use: 'Premium features, gradients' },
      { name: 'Purple Deep', hex: '#7C3AED', use: 'Accent elements' }
    ],
    neutrals: [
      { name: 'Slate 950', hex: '#020617', use: 'Backgrounds (darkest)' },
      { name: 'Slate 900', hex: '#0F172A', use: 'Backgrounds (dark)' },
      { name: 'Slate 800', hex: '#1E293B', use: 'Cards, surfaces' },
      { name: 'Slate 700', hex: '#334155', use: 'Borders, dividers' },
      { name: 'Slate 400', hex: '#94A3B8', use: 'Secondary text' },
      { name: 'Slate 50', hex: '#F8FAFC', use: 'Primary text (light mode)' }
    ]
  };

  const typography = {
    primary: {
      name: 'Inter',
      weights: ['Regular 400', 'Medium 500', 'Semibold 600', 'Bold 700'],
      use: 'All UI elements, body text, headings'
    },
    fallback: 'System fonts: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto',
    sizes: {
      h1: '48px-72px (3rem-4.5rem)',
      h2: '36px-48px (2.25rem-3rem)',
      h3: '24px-30px (1.5rem-1.875rem)',
      body: '16px-18px (1rem-1.125rem)',
      small: '14px (0.875rem)'
    }
  };

  const logoСoncepts = [
    {
      name: 'Primary Mark',
      description: 'Zap/Lightning icon v gradient sphere - symbolizuje AI energy & construction power',
      elements: ['Geometric lightning', 'Circular containment', 'Gradient blue→cyan', 'Neural grid pattern']
    },
    {
      name: 'Wordmark',
      description: 'STAVAI.sk - clean, geometric, professional sans-serif',
      elements: ['Custom spacing', 'Optical weight balance', '.sk in subtle gray', 'Scalable from 16px']
    },
    {
      name: 'Symbol Usage',
      description: 'Standalone icon for apps, favicons, social profiles',
      elements: ['Works at small sizes', 'Recognizable shape', 'Single color variant', 'Transparent backgrounds']
    }
  ];

  const visualMotifs = [
    { name: 'Neural Grid', description: 'Subtle grid (50×50px) at 3% opacity for AI theme' },
    { name: 'Gradient Accents', description: 'Cyan→Blue→Violet gradients for premium elements' },
    { name: 'Glass Morphism', description: 'Frosted glass effect (backdrop-blur) for cards' },
    { name: 'Blueprint Lines', description: 'Thin architectural lines as decorative elements' },
    { name: 'Glow Effects', description: 'Subtle shadows with color (cyan/violet) on hover' }
  ];

  const iconography = [
    'Lucide React icon set',
    'Line-style icons (not filled)',
    '24px default size, 20px in tight spaces',
    'Consistent 2px stroke weight',
    'Cyan-400 color for active states'
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-6">
              <Palette className="w-4 h-4 text-violet-400" />
              <span className="text-sm text-violet-400 font-medium">Visual Identity System</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Visual Foundation
            </h1>
            <p className="text-xl text-slate-400">
              Color palette, typography, logo concepts, iconography a visual language 
              pre technologickú, profesionálnu brand identitu.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Color Palette */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="mb-12">
          <Palette className="w-12 h-12 mb-4 text-cyan-400" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Color Palette
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl">
            Cool, tech-forward palette s AI/real estate synergy
          </p>
        </div>

        {/* Primary Colors */}
        <div className="mb-12">
          <h3 className="text-xl font-bold text-white mb-6">Primary Colors</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {colorPalette.primary.map((color, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="glass-effect rounded-2xl overflow-hidden"
              >
                <div className="h-32" style={{ backgroundColor: color.hex }}></div>
                <div className="p-6">
                  <h4 className="font-bold text-white mb-1">{color.name}</h4>
                  <code className="text-cyan-400 text-sm">{color.hex}</code>
                  <p className="text-sm text-slate-400 mt-2">{color.use}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Secondary Colors */}
        <div className="mb-12">
          <h3 className="text-xl font-bold text-white mb-6">Secondary Colors</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {colorPalette.secondary.map((color, index) => (
              <div key={index} className="glass-effect rounded-2xl overflow-hidden">
                <div className="h-24" style={{ backgroundColor: color.hex }}></div>
                <div className="p-6">
                  <h4 className="font-bold text-white mb-1">{color.name}</h4>
                  <code className="text-violet-400 text-sm">{color.hex}</code>
                  <p className="text-sm text-slate-400 mt-2">{color.use}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Neutral Colors */}
        <div>
          <h3 className="text-xl font-bold text-white mb-6">Neutral Palette</h3>
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
            {colorPalette.neutrals.map((color, index) => (
              <div key={index} className="glass-effect rounded-xl overflow-hidden">
                <div className="h-20" style={{ backgroundColor: color.hex }}></div>
                <div className="p-4">
                  <div className="font-semibold text-white text-sm mb-1">{color.name}</div>
                  <code className="text-slate-400 text-xs">{color.hex}</code>
                  <p className="text-xs text-slate-500 mt-2">{color.use}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gradient Examples */}
        <div className="mt-12">
          <h3 className="text-xl font-bold text-white mb-6">Gradient Applications</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="h-32 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
              <span className="text-white font-semibold">Cyan → Blue</span>
            </div>
            <div className="h-32 rounded-2xl bg-gradient-to-r from-blue-500 to-violet-500 flex items-center justify-center">
              <span className="text-white font-semibold">Blue → Violet</span>
            </div>
            <div className="h-32 rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-500 to-violet-500 flex items-center justify-center">
              <span className="text-white font-semibold">Full Spectrum</span>
            </div>
          </div>
        </div>
      </section>

      {/* Typography */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-800">
        <div className="mb-12">
          <Type className="w-12 h-12 mb-4 text-cyan-400" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Typography System
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl">
            Geometric, clean, readable a professional typografia
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="glass-effect rounded-2xl p-8">
            <h3 className="text-xl font-bold text-white mb-6">Primary Typeface</h3>
            <div className="space-y-4">
              <div>
                <div className="text-4xl font-bold text-white mb-2">{typography.primary.name}</div>
                <div className="text-slate-400">{typography.primary.use}</div>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {typography.primary.weights.map((weight, i) => (
                  <span key={i} className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-sm">
                    {weight}
                  </span>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-slate-700">
                <div className="text-sm text-slate-500 mb-2">Fallback Stack</div>
                <code className="text-xs text-cyan-400">{typography.fallback}</code>
              </div>
            </div>
          </div>

          <div className="glass-effect rounded-2xl p-8">
            <h3 className="text-xl font-bold text-white mb-6">Type Scale</h3>
            <div className="space-y-6">
              {Object.entries(typography.sizes).map(([key, value]) => (
                <div key={key} className="border-b border-slate-800 pb-4 last:border-0">
                  <div className="text-sm text-slate-500 mb-2">{key.toUpperCase()}</div>
                  <div className="text-slate-300 font-mono text-sm">{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Type Examples */}
        <div className="mt-12 glass-effect rounded-2xl p-12">
          <div className="space-y-8">
            <div>
              <div className="text-6xl font-bold text-white mb-2">Heading 1</div>
              <div className="text-slate-500 text-sm">48-72px Bold</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">Heading 2</div>
              <div className="text-slate-500 text-sm">36-48px Bold</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-white mb-2">Heading 3</div>
              <div className="text-slate-500 text-sm">24-30px Semibold</div>
            </div>
            <div>
              <div className="text-lg text-slate-300 mb-2">
                Body text example: Stavai.sk je AI platforma pre stavebníctvo a real estate, 
                ktorá kombinuje technológiu s profesionálnymi nástrojmi.
              </div>
              <div className="text-slate-500 text-sm">16-18px Regular</div>
            </div>
          </div>
        </div>
      </section>

      {/* Logo Concepts */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-800">
        <div className="mb-12">
          <Sparkles className="w-12 h-12 mb-4 text-cyan-400" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Logo Concepts
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl">
            Minimalistické, technologické, moderné — symbol + wordmark
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {logoСoncepts.map((concept, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-effect rounded-2xl p-8"
            >
              <div className="mb-6">
                {index === 0 && (
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center glow-effect">
                    <Sparkles className="w-10 h-10 text-white" />
                  </div>
                )}
                {index === 1 && (
                  <div className="text-3xl font-bold gradient-text">STAVAI.sk</div>
                )}
                {index === 2 && (
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                )}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{concept.name}</h3>
              <p className="text-slate-400 mb-4">{concept.description}</p>
              <div className="space-y-2">
                {concept.elements.map((element, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-slate-500">
                    <Check className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                    <span>{element}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Logo Usage */}
        <div className="mt-12 glass-effect rounded-2xl p-8">
          <h3 className="text-xl font-bold text-white mb-6">Safe Zone & Spacing</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-slate-900 rounded-xl p-12 flex items-center justify-center relative">
              <div className="absolute inset-0 border-2 border-dashed border-cyan-500/30 m-8 rounded-xl"></div>
              <div className="relative flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold gradient-text">Stavai.sk</div>
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <h4 className="font-semibold text-white mb-2">Clear Space</h4>
              <p className="text-slate-400 text-sm mb-4">
                Minimum clear space = height of logo symbol (dashed border area)
              </p>
              <h4 className="font-semibold text-white mb-2">Minimum Size</h4>
              <p className="text-slate-400 text-sm">
                Digital: 120px width | Print: 30mm width
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Language */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-800">
        <div className="mb-12">
          <Layers className="w-12 h-12 mb-4 text-cyan-400" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Visual Language
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl">
            Grids, lines, AI & construction fusion motifs
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visualMotifs.map((motif, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="glass-effect rounded-xl p-6 hover:border-cyan-500/50 transition-all"
            >
              <h3 className="font-bold text-white mb-2">{motif.name}</h3>
              <p className="text-sm text-slate-400">{motif.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Visual Examples */}
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <div className="h-64 rounded-2xl overflow-hidden relative neural-grid">
            <div className="absolute inset-0 bg-slate-900/80"></div>
            <div className="relative h-full flex items-center justify-center">
              <div className="text-center">
                <Grid className="w-12 h-12 mx-auto mb-3 text-cyan-400" />
                <div className="text-white font-semibold">Neural Grid Pattern</div>
              </div>
            </div>
          </div>
          <div className="h-64 rounded-2xl overflow-hidden relative glass-effect">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-violet-500/20"></div>
            <div className="relative h-full flex items-center justify-center">
              <div className="text-center">
                <Sparkles className="w-12 h-12 mx-auto mb-3 text-white" />
                <div className="text-white font-semibold">Glass Morphism</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Iconography */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-800">
        <div className="mb-12">
          <Sparkles className="w-12 h-12 mb-4 text-cyan-400" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Iconography Style
          </h2>
        </div>

        <div className="glass-effect rounded-2xl p-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Guidelines</h3>
              <ul className="space-y-3">
                {iconography.map((rule, index) => (
                  <li key={index} className="flex items-start gap-3 text-slate-300">
                    <Check className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-slate-900 rounded-xl p-8">
              <h4 className="text-white font-semibold mb-6">Icon Examples</h4>
              <div className="grid grid-cols-4 gap-6">
                {[Sparkles, Grid, Layers, Type, Palette, Check].map((Icon, i) => (
                  <div key={i} className="flex items-center justify-center">
                    <Icon className="w-6 h-6 text-cyan-400" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}