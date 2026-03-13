import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Heart, MessageSquare, PlusCircle, Building2 } from 'lucide-react';

const links = [
  { to: '/PortalHome', label: 'Portál', Icon: Home },
  { to: '/MyListings', label: 'Moje inzeráty', Icon: Building2 },
  { to: '/SavedListings', label: 'Uložené', Icon: Heart },
  { to: '/MyInquiries', label: 'Dopyty', Icon: MessageSquare },
];

export default function PortalNav() {
  const location = useLocation();
  return (
    <div className="flex items-center gap-1 mb-6 bg-white rounded-2xl border border-slate-200 p-1.5 overflow-x-auto">
      {links.map(({ to, label, Icon }) => {
        const active = location.pathname === to;
        return (
          <Link key={to} to={to}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${active ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}>
            <Icon className="w-4 h-4" />
            {label}
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