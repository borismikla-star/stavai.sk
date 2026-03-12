import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from './utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart2, Calculator, Clock, BookOpen, LogOut, Menu, X,
  ChevronDown, Home, User, Settings, Rocket, Building2, Zap
} from 'lucide-react';

export default function Layout({ children, currentPageName }) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [toolsOpen, setToolsOpen] = React.useState(false);

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
    return <div className="min-h-screen bg-slate-950" />;
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
    { name: 'Portfólio', path: 'Portfolio', icon: Building2 },
    { name: 'Články', path: 'Articles', icon: BookOpen },
  ];

  const isToolActive = tools.some(t => t.path === currentPageName);

  return (
    <div className="min-h-screen" style={{
      fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif",
      background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
      backgroundAttachment: 'fixed',
    }}>
      {/* Top nav */}
      <nav style={{
        background: 'rgba(15, 12, 41, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }} className="sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* Logo */}
            <Link to={createPageUrl('Landing')} className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg"
                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                <Building2 className="w-4.5 h-4.5 text-white" style={{ width: 18, height: 18 }} />
              </div>
              <span className="font-extrabold text-white text-lg tracking-tight">
                stavai<span style={{ color: '#818cf8' }}>.sk</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {nav.map((item) => {
                const isActive = currentPageName === item.path;
                return (
                  <Link
                    key={item.path}
                    to={createPageUrl(item.path)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
                    style={isActive ? {
                      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                      color: '#fff',
                      boxShadow: '0 4px 15px rgba(99,102,241,0.4)',
                    } : {
                      color: 'rgba(255,255,255,0.65)',
                    }}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
                    onMouseLeave={e => { if (!isActive) { e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; e.currentTarget.style.background = 'transparent'; } }}
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
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
                  style={isToolActive ? {
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    color: '#fff',
                    boxShadow: '0 4px 15px rgba(99,102,241,0.4)',
                  } : {
                    color: 'rgba(255,255,255,0.65)',
                    background: toolsOpen ? 'rgba(255,255,255,0.08)' : 'transparent',
                  }}
                >
                  <Calculator className="w-4 h-4" />
                  Nástroje
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${toolsOpen ? 'rotate-180' : ''}`} />
                </button>

                {toolsOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setToolsOpen(false)} />
                    <div className="absolute top-full left-0 mt-2 w-60 rounded-2xl z-50 py-2 overflow-hidden"
                      style={{
                        background: 'rgba(15, 12, 41, 0.97)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                        backdropFilter: 'blur(20px)',
                      }}>
                      {tools.map((tool) => {
                        const active = currentPageName === tool.path;
                        return (
                          <Link
                            key={tool.path}
                            to={createPageUrl(tool.path)}
                            onClick={() => setToolsOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm transition-all duration-150"
                            style={active ? {
                              color: '#818cf8',
                              background: 'rgba(99,102,241,0.15)',
                              fontWeight: 600,
                            } : {
                              color: 'rgba(255,255,255,0.7)',
                            }}
                            onMouseEnter={e => { if (!active) { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; } }}
                            onMouseLeave={e => { if (!active) { e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; e.currentTarget.style.background = 'transparent'; } }}
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
            <div className="hidden md:flex items-center gap-3">
              {user?.beta_access && (
                <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                  style={{ background: 'rgba(139,92,246,0.2)', color: '#c4b5fd', border: '1px solid rgba(139,92,246,0.3)' }}>
                  Beta
                </span>
              )}
              <div className="relative group">
                <button className="flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all duration-200"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                    {user?.full_name?.charAt(0) || '?'}
                  </div>
                  <span className="text-sm font-semibold text-white">{user?.full_name?.split(' ')[0]}</span>
                  <ChevronDown className="w-3.5 h-3.5" style={{ color: 'rgba(255,255,255,0.4)' }} />
                </button>
                <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl z-50 py-2 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
                  style={{
                    background: 'rgba(15, 12, 41, 0.97)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                    backdropFilter: 'blur(20px)',
                  }}>
                  <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <div className="text-sm font-bold text-white">{user?.full_name}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{user?.role === 'admin' ? 'Admin' : 'Pro'}</div>
                  </div>

                  {[
                    { path: 'Profile', icon: User, label: 'Profil' },
                    { path: 'BetaAccess', icon: Rocket, label: 'Beta program' },
                  ].map(item => (
                    <Link key={item.path} to={createPageUrl(item.path)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm transition-all duration-150"
                      style={{ color: 'rgba(255,255,255,0.65)' }}
                      onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                      onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; e.currentTarget.style.background = 'transparent'; }}>
                      <item.icon className="w-4 h-4" />{item.label}
                    </Link>
                  ))}

                  {user?.role === 'admin' && (
                    <>
                      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', margin: '4px 0' }} />
                      {[
                        { path: 'Admin', icon: Settings, label: 'Admin panel' },
                        { path: 'AdminUsers', icon: User, label: 'Správa používateľov' },
                        { path: 'AdminSettings', icon: Settings, label: 'Nastavenia platformy' },
                      ].map(item => (
                        <Link key={item.path} to={createPageUrl(item.path)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm transition-all duration-150"
                          style={{ color: 'rgba(255,255,255,0.65)' }}
                          onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; e.currentTarget.style.background = 'transparent'; }}>
                          <item.icon className="w-4 h-4" />{item.label}
                        </Link>
                      ))}
                    </>
                  )}

                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', margin: '4px 0' }} />
                  <button onClick={() => base44.auth.logout()}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-all duration-150"
                    style={{ color: '#f87171' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(248,113,113,0.1)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                    <LogOut className="w-4 h-4" /> Odhlásiť sa
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile toggle */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg transition-all"
              style={{ color: 'rgba(255,255,255,0.7)', background: 'rgba(255,255,255,0.08)' }}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden px-4 py-3 space-y-1"
            style={{ borderTop: '1px solid rgba(255,255,255,0.08)', background: 'rgba(15,12,41,0.97)' }}>
            {nav.map((item) => {
              const isActive = currentPageName === item.path;
              return (
                <Link key={item.path} to={createPageUrl(item.path)} onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
                  style={isActive ? {
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    color: '#fff',
                  } : { color: 'rgba(255,255,255,0.65)' }}>
                  <item.icon className="w-4 h-4" />{item.name}
                </Link>
              );
            })}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 8, marginTop: 8 }}>
              <div className="text-xs font-bold uppercase tracking-wider px-4 mb-2" style={{ color: 'rgba(255,255,255,0.3)' }}>Nástroje</div>
              {tools.map((tool) => (
                <Link key={tool.path} to={createPageUrl(tool.path)} onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all"
                  style={currentPageName === tool.path ? {
                    background: 'rgba(99,102,241,0.2)', color: '#818cf8',
                  } : { color: 'rgba(255,255,255,0.65)' }}>
                  <tool.icon className="w-4 h-4" />{tool.name}
                </Link>
              ))}
            </div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 8, marginTop: 8 }}>
              <Link to={createPageUrl('Profile')} onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all"
                style={{ color: 'rgba(255,255,255,0.65)' }}>
                <User className="w-4 h-4" /> Profil
              </Link>
              <Link to={createPageUrl('BetaAccess')} onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all"
                style={{ color: 'rgba(255,255,255,0.65)' }}>
                <Rocket className="w-4 h-4" /> Beta program
              </Link>
              <button onClick={() => base44.auth.logout()}
                className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm rounded-xl mt-1 transition-all"
                style={{ color: '#f87171' }}>
                <LogOut className="w-4 h-4" /> Odhlásiť sa
              </button>
            </div>
          </div>
        )}
      </nav>

      <main className="min-h-[calc(100vh-4rem)]">
        {children}
      </main>
    </div>
  );
}