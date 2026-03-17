import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Heart, MessageSquare, PlusCircle, Building2, Lock, ShieldCheck, Map, Shield } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

const links = [
  { to: '/PortalHome', label: 'Realitný portál', Icon: Home },
  { to: '/PortalMap', label: 'Mapa', Icon: Map },
  { to: '/OffMarketHub', label: 'Off-Market', Icon: ShieldCheck },
  { to: '/MyListings', label: 'Moje inzeráty', Icon: Building2 },
  { to: '/SavedListings', label: 'Uložené', Icon: Heart },
  { to: '/MyInquiries', label: 'Dopyty', Icon: MessageSquare },
  { to: '/NDARequests', label: 'NDA žiadosti', Icon: Lock },
];

export default function PortalNav() {
  const location = useLocation();

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
    retry: false
  });

  const { data: pendingNda = [] } = useQuery({
    queryKey: ['ndaPendingCount', user?.email],
    queryFn: () => base44.entities.NDARequest.filter({ seller_id: user.email, status: 'pending' }),
    enabled: !!user?.email
  });

  return (
    <div className="flex items-center gap-1 mb-6 bg-white rounded-2xl border border-slate-200 p-1.5 overflow-x-auto">
      {links.map(({ to, label, Icon }) => {
        const active = location.pathname === to;
        const isNda = to === '/NDARequests';
        return (
          <Link key={to} to={to}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${active ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}>
            <Icon className="w-4 h-4" strokeWidth={2} />
            {label}
            {isNda && pendingNda.length > 0 && (
              <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${active ? 'bg-white text-indigo-600' : 'bg-amber-500 text-white'}`}>
                {pendingNda.length}
              </span>
            )}
          </Link>
        );
      })}
      <Link to="/NewListing"
        className="ml-auto flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-all whitespace-nowrap">
        <PlusCircle className="w-4 h-4" />
        Pridať inzerát
      </Link>
    </div>
  );
}