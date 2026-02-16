import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from './utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Bell, LogOut, Menu, X } from 'lucide-react';

export default function Layout({ children, currentPageName }) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  
  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
    retry: false
  });

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: () => user ? base44.entities.Notification.filter({ user_id: user.id, read: false }, '-created_date', 10) : [],
    enabled: !!user
  });

  const handleLogout = async () => {
    await base44.auth.logout();
  };

  // Show minimal layout for landing/auth pages
  if (!user || currentPageName === 'Landing') {
    return (
      <div className="min-h-screen bg-slate-50">
        {children}
      </div>
    );
  }

  const roleNavigation = {
    investor: [
      { name: 'Dashboard', path: 'InvestorDashboard' },
      { name: 'Deal Flow', path: 'DealFlow' },
      { name: 'My Deals', path: 'MyDeals' },
      { name: 'Messages', path: 'Messages' }
    ],
    broker: [
      { name: 'Dashboard', path: 'BrokerDashboard' },
      { name: 'My Listings', path: 'MyListings' },
      { name: 'Access Requests', path: 'AccessRequests' },
      { name: 'Messages', path: 'Messages' }
    ],
    admin: [
      { name: 'Dashboard', path: 'AdminDashboard' },
      { name: 'User Verification', path: 'UserVerification' },
      { name: 'All Listings', path: 'AllListings' },
      { name: 'Audit Log', path: 'AuditLog' }
    ]
  };

  const navigation = roleNavigation[user?.role] || [];

  return (
    <div className="min-h-screen bg-slate-50">
      <style>{`
        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
      `}</style>

      {/* Top Navigation */}
      <nav className="bg-[#111827] border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to={createPageUrl('InvestorDashboard')} className="flex items-center">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6920d2b958e59092776f7607/016f05dc7_IMG_1285.png" 
                alt="Brickbridge" 
                className="h-10"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {navigation.map((item) => (
                <Link
                  key={item.path}
                  to={createPageUrl(item.path)}
                  className={`text-sm font-medium transition ${
                    currentPageName === item.path
                      ? 'text-[#C6A756]'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Right Section */}
            <div className="hidden md:flex items-center gap-4">
              {/* Notifications */}
              <Link to={createPageUrl('Notifications')} className="relative">
                <Bell className="w-5 h-5 text-slate-300 hover:text-white transition" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#C6A756] text-[#111827] text-xs rounded-full flex items-center justify-center font-bold">
                    {notifications.length}
                  </span>
                )}
              </Link>

              {/* User Info */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-sm font-medium text-white">{user?.full_name}</div>
                  <div className="text-xs text-slate-400 capitalize">{user?.role}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-300 hover:text-white transition"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-300"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-700 bg-[#111827]">
            <div className="px-4 py-4 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.path}
                  to={createPageUrl(item.path)}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-2 rounded-lg text-sm font-medium transition ${
                    currentPageName === item.path
                      ? 'bg-[#C6A756] text-[#111827]'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 rounded-lg"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-4rem)]">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-[#111827] border-t border-slate-700 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-slate-400 text-sm">
              © 2026 Brickbridge. All rights reserved.
            </div>
            <div className="flex gap-6 text-sm">
              <Link to={createPageUrl('Terms')} className="text-slate-400 hover:text-white transition">
                Terms of Service
              </Link>
              <Link to={createPageUrl('Privacy')} className="text-slate-400 hover:text-white transition">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}