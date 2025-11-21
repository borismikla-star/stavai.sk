import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from './utils';
import { Menu, X, Zap, Sparkles } from 'lucide-react';

export default function Layout({ children, currentPageName }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const mainNavigation = [
    { name: 'Domov', path: 'Home' },
    { name: 'Dashboard', path: 'Dashboard' },
    { name: 'AI Nástroje', path: 'AITools' },
    { name: 'Projekty', path: 'Projects' },
    { name: 'Poznatky', path: 'Knowledge' },
  ];

  const navigation = mainNavigation;

  return (
    <div className="min-h-screen bg-white">
      <style>{`
        :root {
          --color-primary: #0EA5E9;
          --color-primary-dark: #0284C7;
          --color-secondary: #06B6D4;
          --color-accent: #8B5CF6;
          --color-dark: #0F172A;
          --color-darker: #020617;
          --color-light: #F8FAFC;
          --color-grey: #64748B;
        }
        
        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .neural-grid {
          background-image: 
            linear-gradient(rgba(59, 130, 246, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.03) 1px, transparent 1px);
          background-size: 50px 50px;
        }

        .gradient-text {
          background: linear-gradient(135deg, #3B82F6 0%, #6366F1 50%, #8B5CF6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .glass-effect {
          background: rgba(15, 23, 42, 0.7);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(148, 163, 184, 0.1);
        }

        .glow-effect {
          box-shadow: 0 0 40px rgba(59, 130, 246, 0.15);
        }
      `}</style>

      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to={createPageUrl('Home')} className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg blur opacity-30 group-hover:opacity-50 transition"></div>
                <div className="relative bg-white p-2 rounded-lg border border-slate-200">
                  <Zap className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div>
                <div className="text-xl font-bold gradient-text">Stavai.sk</div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navigation.map((item) => (
                <Link
                  key={item.path}
                  to={createPageUrl(item.path)}
                  className={`text-sm font-medium transition-all relative group ${
                    currentPageName === item.path
                      ? 'text-blue-600'
                      : 'text-slate-600 hover:text-slate-900'
                  } ${item.highlight ? 'px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-blue-500/50' : ''}`}
                >
                  {item.name}
                  {!item.highlight && currentPageName === item.path && (
                    <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
                  )}
                </Link>
              ))}
            </div>

            {/* User actions */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                to={createPageUrl('Dashboard')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-blue-500/50 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-semibold">Dashboard</span>
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-xl">
            <div className="px-4 py-4 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.path}
                  to={createPageUrl(item.path)}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition ${
                    currentPageName === item.path
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                to={createPageUrl('Dashboard')}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
              >
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-semibold">Dashboard</span>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="neural-grid">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg blur opacity-30"></div>
                  <div className="relative bg-white p-2 rounded-lg border border-slate-200">
                    <Zap className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <div className="text-xl font-bold gradient-text">Stavai.sk</div>
              </div>
              <p className="text-slate-600 text-sm max-w-md">
                AI platforma pre stavebníctvo, development a real estate. 
                Prinášame nový štandard inteligentných riešení pre profesionálov.
              </p>
            </div>

            <div>
              <h3 className="text-slate-900 font-semibold mb-4">Produkty</h3>
              <ul className="space-y-2">
                <li><Link to={createPageUrl('Dashboard')} className="text-slate-600 hover:text-blue-600 text-sm transition">Dashboard</Link></li>
                <li><Link to={createPageUrl('AITools')} className="text-slate-600 hover:text-blue-600 text-sm transition">AI Nástroje</Link></li>
                <li><Link to={createPageUrl('Projects')} className="text-slate-600 hover:text-blue-600 text-sm transition">Projekty</Link></li>
                <li><Link to={createPageUrl('Knowledge')} className="text-slate-600 hover:text-blue-600 text-sm transition">Knowledge Hub</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-slate-900 font-semibold mb-4">Spoločnosť</h3>
              <ul className="space-y-2">
                <li><Link to={createPageUrl('About')} className="text-slate-600 hover:text-blue-600 text-sm transition">O Nás</Link></li>
                <li><a href="mailto:hello@stavai.sk" className="text-slate-600 hover:text-blue-600 text-sm transition">Kontakt</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-200 text-center text-slate-500 text-sm">
            <p>&copy; 2025 Stavai.sk — Built for the future of construction & real estate</p>
          </div>
        </div>
      </footer>
    </div>
  );
}