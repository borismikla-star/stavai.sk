import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from './utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart2, Calculator, Clock, BookOpen, LogOut, Menu, X,
  ChevronDown, Home, User, Settings, Rocket, Building2, Zap
} from 'lucide-react';

export default function Layout({ children, currentPageName }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);

  const { data: user, isLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      try { return await base44.auth.me(); } catch { return null; }
    },
    retry: false
  });

  const publicPages = ['Landing'];
  if (publicPages.includes(currentPageName)) {
    return <>{children}</>;
  }

  if (isLoading) {
    return <div className="min-h-screen bg-slate-50" />;
  }

  if (!user) {
    base44.auth.redirectToLogin(window.location.href);
    return null;
  }

  const tools = [
    { name: 'Land Feasibility', path: 'LandFeasibility', icon: BarChart2 },
    { name: 'Developer Kalkulačka', path: 'DeveloperCalc', icon: Calculator },
    { name: 'Harmonogram Povolení', path: 'PermitTimeline', icon: Clock },
    { name: 'Cost Benchmark', path: 'CostBenchmark', icon: BarChart2 },
    { name: 'Sensitivity Engine', path: 'SensitivityEngine', icon: Zap },
  ];

  const nav = [
    { name: 'Dashboard', path: 'Dashboard', icon: Home },
    { name: 'Portál nehnuteľností', path: 'PortalHome', icon: Building2 },
    { name: 'Portfólio', path: 'Portfolio', icon: Building2 },
    { name: 'Články', path: 'Articles', icon: BookOpen },
  ];

  const isToolActive = tools.some(t => t.path === currentPageName);

  return (
    <div className="min-h-screen bg-slate-50" style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif" }}>

      {/* Top nav */}
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-15" style={{ height: 60 }}>

            {/* Logo */}
            <Link to={createPageUrl('Landing')} className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 285 72" height="36">
                <defs>
                  <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#4F46E5" floodOpacity="0.22"/>
                  </filter>
                </defs>
                <g filter="url(#shadow)">
                  <rect x="0" y="0" width="72" height="72" rx="20" fill="#4F46E5"/>
                  <rect x="0" y="0" width="72" height="36" rx="20" fill="white" opacity="0.04"/>
                  <path d="M36 18L55 32V54H17V32L36 18Z" stroke="white" strokeWidth="3" strokeLinejoin="round" fill="rgba(255,255,255,0.1)"/>
                  <rect x="30" y="41" width="12" height="13" rx="3" fill="white"/>
                  <rect x="43" y="31" width="6" height="6" rx="1.5" fill="white" opacity="0.55"/>
                </g>
                <text x="88" y="54" fontFamily="'Outfit', sans-serif" fontSize="52" fontWeight="900" letterSpacing="-2">
                  <tspan fill="#111118">stav</tspan><tspan fill="#4F46E5">ai</tspan>
                </text>
              </svg>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-0.5">
              {nav.map((item) => {
                const isActive = currentPageName === item.path;
                return (
                  <Link
                    key={item.path}
                    to={createPageUrl(item.path)}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-150"
                    style={isActive ? {
                      background: 'linear-gradient(135deg, #eef2ff, #ede9fe)',
                      color: '#4f46e5',
                    } : {
                      color: '#64748b',
                    }}
                    onMouseEnter={e => { if (!isActive) { e.currentTarget.style.color = '#1e293b'; e.currentTarget.style.background = '#f8fafc'; } }}
                    onMouseLeave={e => { if (!isActive) { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.background = 'transparent'; } }}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                );
              })}

              {/* Tools Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setToolsOpen(o => !o)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-150"
                  style={isToolActive ? {
                    background: 'linear-gradient(135deg, #eef2ff, #ede9fe)',
                    color: '#4f46e5',
                  } : {
                    color: '#64748b',
                    background: toolsOpen ? '#f8fafc' : 'transparent',
                  }}
                  onMouseEnter={e => { if (!isToolActive) { e.currentTarget.style.color = '#1e293b'; e.currentTarget.style.background = '#f8fafc'; } }}
                  onMouseLeave={e => { if (!isToolActive && !toolsOpen) { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.background = 'transparent'; } }}
                >
                  <Calculator className="w-4 h-4" />
                  Nástroje
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${toolsOpen ? 'rotate-180' : ''}`} />
                </button>

                {toolsOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setToolsOpen(false)} />
                    <div className="absolute top-full left-0 mt-2 w-56 rounded-2xl z-50 py-1.5 overflow-hidden bg-white"
                      style={{
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                      }}>
                      {tools.map((tool) => {
                        const active = currentPageName === tool.path;
                        return (
                          <Link
                            key={tool.path}
                            to={createPageUrl(tool.path)}
                            onClick={() => setToolsOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm transition-all duration-100"
                            style={active ? {
                              color: '#4f46e5',
                              background: '#eef2ff',
                              fontWeight: 600,
                            } : {
                              color: '#475569',
                            }}
                            onMouseEnter={e => { if (!active) { e.currentTarget.style.color = '#1e293b'; e.currentTarget.style.background = '#f8fafc'; } }}
                            onMouseLeave={e => { if (!active) { e.currentTarget.style.color = '#475569'; e.currentTarget.style.background = 'transparent'; } }}
                          >
                            <tool.icon className="w-4 h-4" />
                            {tool.name}
                          </Link>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Right */}
            <div className="hidden md:flex items-center gap-2">
              {user?.beta_access && (
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-violet-100 text-violet-700">
                  Beta
                </span>
              )}
              <div className="relative group">
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all duration-150 hover:bg-slate-100"
                  style={{ border: '1px solid #e2e8f0' }}>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                    {user?.full_name?.charAt(0) || '?'}
                  </div>
                  <span className="text-sm font-semibold text-slate-700">{user?.full_name?.split(' ')[0]}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>
                <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl z-50 py-1.5 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 bg-white"
                  style={{
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                  }}>
                  <div className="px-4 py-3 border-b border-slate-100">
                    <div className="text-sm font-bold text-slate-800">{user?.full_name}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{user?.role === 'admin' ? 'Admin' : 'Pro'}</div>
                  </div>

                  {[
                    { path: 'Profile', icon: User, label: 'Profil' },
                    { path: 'BetaAccess', icon: Rocket, label: 'Beta program' },
                  ].map(item => (
                    <Link key={item.path} to={createPageUrl(item.path)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm transition-all duration-100 text-slate-600"
                      onMouseEnter={e => { e.currentTarget.style.color = '#1e293b'; e.currentTarget.style.background = '#f8fafc'; }}
                      onMouseLeave={e => { e.currentTarget.style.color = '#475569'; e.currentTarget.style.background = 'transparent'; }}>
                      <item.icon className="w-4 h-4" />{item.label}
                    </Link>
                  ))}

                  {user?.role === 'admin' && (
                    <>
                      <div className="border-t border-slate-100 my-1" />
                      {[
                        { path: 'Admin', icon: Settings, label: 'Admin panel' },
                        { path: 'AdminUsers', icon: User, label: 'Správa používateľov' },
                        { path: 'AdminSettings', icon: Settings, label: 'Nastavenia platformy' },
                      ].map(item => (
                        <Link key={item.path} to={createPageUrl(item.path)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm transition-all duration-100 text-slate-600"
                          onMouseEnter={e => { e.currentTarget.style.color = '#1e293b'; e.currentTarget.style.background = '#f8fafc'; }}
                          onMouseLeave={e => { e.currentTarget.style.color = '#475569'; e.currentTarget.style.background = 'transparent'; }}>
                          <item.icon className="w-4 h-4" />{item.label}
                        </Link>
                      ))}
                    </>
                  )}

                  <div className="border-t border-slate-100 my-1" />
                  <button onClick={() => base44.auth.logout()}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 transition-all duration-100"
                    onMouseEnter={e => { e.currentTarget.style.background = '#fff5f5'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                    <LogOut className="w-4 h-4" /> Odhlásiť sa
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile toggle */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg transition-all text-slate-600 hover:bg-slate-100">
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden px-4 py-3 space-y-0.5 border-t border-slate-100 bg-white">
            {nav.map((item) => {
              const isActive = currentPageName === item.path;
              return (
                <Link key={item.path} to={createPageUrl(item.path)} onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
                  style={isActive ? {
                    background: '#eef2ff', color: '#4f46e5',
                  } : { color: '#475569' }}>
                  <item.icon className="w-4 h-4" />{item.name}
                </Link>
              );
            })}
            <div className="border-t border-slate-100 pt-2 mt-2">
              <div className="text-xs font-bold uppercase tracking-wider px-4 mb-2 text-slate-400">Nástroje</div>
              {tools.map((tool) => (
                <Link key={tool.path} to={createPageUrl(tool.path)} onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all"
                  style={currentPageName === tool.path ? {
                    background: '#eef2ff', color: '#4f46e5',
                  } : { color: '#475569' }}>
                  <tool.icon className="w-4 h-4" />{tool.name}
                </Link>
              ))}
            </div>
            <div className="border-t border-slate-100 pt-2 mt-2">
              <Link to={createPageUrl('Profile')} onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-slate-600 transition-all">
                <User className="w-4 h-4" /> Profil
              </Link>
              <Link to={createPageUrl('BetaAccess')} onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-slate-600 transition-all">
                <Rocket className="w-4 h-4" /> Beta program
              </Link>
              <button onClick={() => base44.auth.logout()}
                className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm rounded-xl mt-1 text-red-500">
                <LogOut className="w-4 h-4" /> Odhlásiť sa
              </button>
            </div>
          </div>
        )}
      </nav>

      <main className="min-h-[calc(100vh-60px)]">
        {children}
      </main>
    </div>
  );
}