import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from './utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart2, Calculator, Clock, BookOpen, LogOut, Menu, X,
  ChevronDown, Home, User, Settings, Rocket, Building2
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
    return <div className="min-h-screen bg-gray-50" />;
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
    { name: 'Portfólio', path: 'Portfolio', icon: Building2 },
    { name: 'Články', path: 'Articles', icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>
      {/* Top nav */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* Logo */}
            <Link to={createPageUrl('Landing')} className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-gray-900 text-lg tracking-tight">
                stavai<span className="text-blue-600">.sk</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {nav.map((item) => (
                <Link
                  key={item.path}
                  to={createPageUrl(item.path)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    currentPageName === item.path
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Link>
              ))}

              {/* Tools Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setToolsOpen(o => !o)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    tools.some(t => t.path === currentPageName)
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Calculator className="w-4 h-4" />
                  Nástroje
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${toolsOpen ? 'rotate-180' : ''}`} />
                </button>
                {toolsOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setToolsOpen(false)} />
                    <div className="absolute top-full left-0 mt-1.5 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-50 py-1.5">
                      {tools.map((tool) => (
                        <Link
                          key={tool.path}
                          to={createPageUrl(tool.path)}
                          onClick={() => setToolsOpen(false)}
                          className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-all ${
                            currentPageName === tool.path
                              ? 'text-blue-700 bg-blue-50 font-medium'
                              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                          }`}
                        >
                          <tool.icon className="w-4 h-4" />
                          {tool.name}
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Right */}
            <div className="hidden md:flex items-center gap-3">
              {user?.beta_access && (
                <span className="text-xs font-semibold bg-violet-100 text-violet-700 px-2.5 py-1 rounded-full border border-violet-200">
                  Beta
                </span>
              )}
              <div className="relative group">
                <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all">
                  <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{user?.full_name?.charAt(0) || '?'}</span>
                  </div>
                  <span>{user?.full_name?.split(' ')[0]}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>
                <div className="absolute right-0 top-full mt-1.5 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-50 py-1.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="text-sm font-semibold text-gray-900">{user?.full_name}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{user?.role === 'admin' ? 'Admin' : 'Pro'}</div>
                  </div>
                  <Link to={createPageUrl('Profile')} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all">
                    <User className="w-4 h-4" /> Profil
                  </Link>
                  <Link to={createPageUrl('BetaAccess')} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all">
                    <Rocket className="w-4 h-4" /> Beta program
                  </Link>
                  {user?.role === 'admin' && (
                    <>
                      <div className="border-t border-gray-100 my-1" />
                      <Link to={createPageUrl('Admin')} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all">
                        <Settings className="w-4 h-4" /> Admin panel
                      </Link>
                      <Link to={createPageUrl('AdminUsers')} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all">
                        <User className="w-4 h-4" /> Správa používateľov
                      </Link>
                      <Link to={createPageUrl('AdminSettings')} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all">
                        <Settings className="w-4 h-4" /> Nastavenia platformy
                      </Link>
                    </>
                  )}
                  <div className="border-t border-gray-100 my-1" />
                  <button onClick={() => base44.auth.logout()} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 transition-all">
                    <LogOut className="w-4 h-4" /> Odhlásiť sa
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile toggle */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
            {nav.map((item) => (
              <Link key={item.path} to={createPageUrl(item.path)} onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium ${
                  currentPageName === item.path ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
                }`}>
                <item.icon className="w-4 h-4" />{item.name}
              </Link>
            ))}
            <div className="border-t border-gray-100 pt-2 mt-2">
              <div className="text-xs text-gray-400 uppercase tracking-wider px-4 mb-2 font-medium">Nástroje</div>
              {tools.map((tool) => (
                <Link key={tool.path} to={createPageUrl(tool.path)} onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm ${
                    currentPageName === tool.path ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
                  }`}>
                  <tool.icon className="w-4 h-4" />{tool.name}
                </Link>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-2 mt-2">
              <Link to={createPageUrl('Profile')} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                <User className="w-4 h-4" /> Profil
              </Link>
              <Link to={createPageUrl('BetaAccess')} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                <Rocket className="w-4 h-4" /> Beta program
              </Link>
              <button onClick={() => base44.auth.logout()} className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-lg mt-1">
                <LogOut className="w-4 h-4" /> Odhlásiť sa
              </button>
            </div>
          </div>
        )}
      </nav>

      <main className="min-h-[calc(100vh-4rem)]">{children}</main>
    </div>
  );
}