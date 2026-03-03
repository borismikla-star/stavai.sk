import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from './utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { BarChart2, Calculator, Clock, BookOpen, LogOut, Menu, X, ChevronDown, Home, User, Settings, Rocket } from 'lucide-react';

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

  // Wait for auth check to finish
  if (isLoading) {
    return <div className="min-h-screen bg-[#F1F5F9]" />;
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
    { name: 'Sensitivity Engine', path: 'SensitivityEngine', icon: BarChart2 },
  ];

  const nav = [
    { name: 'Dashboard', path: 'Dashboard', icon: Home },
    { name: 'Články', path: 'Articles', icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-[#F1F5F9]" style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <nav className="bg-[#0F172A] border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* Logo */}
            <Link to={createPageUrl('Dashboard')} className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white font-black text-sm">S</span>
              </div>
              <span className="text-white font-bold text-lg tracking-tight">stavai<span className="text-blue-400">.sk</span></span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {nav.map((item) => (
                <Link
                  key={item.path}
                  to={createPageUrl(item.path)}
                  className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-medium transition ${
                    currentPageName === item.path
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Link>
              ))}

              {/* Tools Dropdown */}
              <div className="relative" onMouseEnter={() => setToolsOpen(true)} onMouseLeave={() => setToolsOpen(false)}>
                <button className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-medium transition ${
                  tools.some(t => t.path === currentPageName)
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}>
                  <Calculator className="w-4 h-4" />
                  Nástroje
                  <ChevronDown className="w-4 h-4" />
                </button>
                {toolsOpen && (
                  <div className="absolute top-full left-0 mt-1 w-52 bg-[#1E293B] border border-slate-700 rounded-lg shadow-xl z-50 py-1">
                    {tools.map((tool) => (
                      <Link
                        key={tool.path}
                        to={createPageUrl(tool.path)}
                        className={`flex items-center gap-3 px-4 py-2.5 text-sm transition ${
                          currentPageName === tool.path
                            ? 'text-blue-400 bg-blue-600/10'
                            : 'text-slate-300 hover:text-white hover:bg-slate-700'
                        }`}
                      >
                        <tool.icon className="w-4 h-4" />
                        {tool.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right */}
            <div className="hidden md:flex items-center gap-3">
              {user?.beta_access && (
                <span className="text-xs font-semibold bg-violet-600/20 text-violet-300 px-2 py-1 rounded-full border border-violet-600/30">Beta</span>
              )}
              <div className="relative group">
                <button className="flex items-center gap-2 px-3 py-2 rounded text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition">
                  <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{user?.full_name?.charAt(0) || '?'}</span>
                  </div>
                  <span>{user?.full_name?.split(' ')[0]}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
                <div className="absolute right-0 top-full mt-1 w-52 bg-[#1E293B] border border-slate-700 rounded-lg shadow-xl z-50 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="px-4 py-2.5 border-b border-slate-700">
                    <div className="text-xs font-semibold text-white">{user?.full_name}</div>
                    <div className="text-xs text-slate-400">{user?.role === 'admin' ? 'Admin' : 'Pro'}</div>
                  </div>
                  <Link to={createPageUrl('Profile')} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-700 transition">
                    <User className="w-4 h-4" /> Profil
                  </Link>
                  <Link to={createPageUrl('BetaAccess')} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-700 transition">
                    <Rocket className="w-4 h-4" /> Beta program
                  </Link>
                  {user?.role === 'admin' && (
                    <>
                      <div className="border-t border-slate-700 my-1" />
                      <Link to={createPageUrl('Admin')} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-700 transition">
                        <Settings className="w-4 h-4" /> Admin panel
                      </Link>
                      <Link to={createPageUrl('AdminUsers')} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-700 transition">
                        <User className="w-4 h-4" /> Správa používateľov
                      </Link>
                      <Link to={createPageUrl('AdminSettings')} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-700 transition">
                        <Settings className="w-4 h-4" /> Nastavenia platformy
                      </Link>
                    </>
                  )}
                  <div className="border-t border-slate-700 my-1" />
                  <button onClick={() => base44.auth.logout()} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-slate-700 transition">
                    <LogOut className="w-4 h-4" /> Odhlásiť sa
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile toggle */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-slate-300">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-800 bg-[#0F172A] px-4 py-4 space-y-1">
            {nav.map((item) => (
              <Link key={item.path} to={createPageUrl(item.path)} onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded text-sm font-medium ${
                  currentPageName === item.path ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                }`}>
                <item.icon className="w-4 h-4" />{item.name}
              </Link>
            ))}
            <div className="border-t border-slate-800 pt-3 mt-3">
              <div className="text-xs text-slate-500 uppercase tracking-wider px-4 mb-2">Nástroje</div>
              {tools.map((tool) => (
                <Link key={tool.path} to={createPageUrl(tool.path)} onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded text-sm ${
                    currentPageName === tool.path ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                  }`}>
                  <tool.icon className="w-4 h-4" />{tool.name}
                </Link>
              ))}
            </div>
            <Link to={createPageUrl('Profile')} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 rounded text-sm text-slate-300 hover:bg-slate-800">
              <User className="w-4 h-4" /> Profil
            </Link>
            <Link to={createPageUrl('BetaAccess')} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 rounded text-sm text-slate-300 hover:bg-slate-800">
              <Rocket className="w-4 h-4" /> Beta program
            </Link>
            <button onClick={() => base44.auth.logout()} className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-slate-800 rounded">Odhlásiť sa</button>
          </div>
        )}
      </nav>

      <main className="min-h-[calc(100vh-4rem)]">{children}</main>
    </div>
  );
}