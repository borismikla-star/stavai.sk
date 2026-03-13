import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { MapPin, Maximize2, ArrowRight, Eye } from 'lucide-react';

const TYPE_LABELS = { residential: 'Rezidenčné', commercial: 'Komerčné', land: 'Pozemok', development: 'Development' };
const LISTING_LABELS = { sale: 'Predaj', lease: 'Nájom', investment: 'Investícia' };
const REGION_LABELS = { BA:'Bratislava', TT:'Trnava', TN:'Trenčín', NR:'Nitra', ZA:'Žilina', BB:'Banská Bystrica', PO:'Prešov', KE:'Košice' };

const fmt = (n) => n > 0 ? new Intl.NumberFormat('sk', { maximumFractionDigits: 0 }).format(n) + ' €' : 'Na dopyt';

function MiniCard({ listing }) {
  const img = listing.images?.[0];
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
      <div className="relative h-32 bg-slate-100 overflow-hidden">
        {img ? (
          <img src={img} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300 text-3xl">🏠</div>
        )}
        <div className="absolute top-2 left-2 flex gap-1">
          <span className="text-xs font-semibold bg-white/90 backdrop-blur-sm text-slate-700 px-2 py-0.5 rounded-full">
            {LISTING_LABELS[listing.listing_type]}
          </span>
          {listing.visibility === 'off_market' && (
            <span className="text-xs font-bold bg-violet-600 text-white px-2 py-0.5 rounded-full">Off-market</span>
          )}
        </div>
      </div>
      <div className="p-3">
        <div className="font-semibold text-slate-800 text-xs leading-snug line-clamp-1 mb-1">{listing.title}</div>
        <div className="flex items-center gap-1 text-slate-400 text-xs mb-2">
          <MapPin className="w-3 h-3 flex-shrink-0" />
          <span>{listing.location_city}, {REGION_LABELS[listing.location_region]}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-indigo-600 font-bold text-sm">{fmt(listing.price)}</span>
          {listing.area_total && (
            <span className="text-xs text-slate-400 flex items-center gap-0.5">
              <Maximize2 className="w-3 h-3" />{listing.area_total} m²
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LandingListingsPreview({ onLogin }) {
  const { data: listings = [], isLoading } = useQuery({
    queryKey: ['landing-listings-preview'],
    queryFn: () => base44.entities.Listing.filter({ status: 'active', visibility: 'public' }, '-created_date', 6),
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-100 overflow-hidden">
      {/* Listings grid */}
      <div>
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-44 bg-slate-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <div className="text-3xl mb-2">🏗️</div>
            <div className="text-xs">Čoskoro prvé inzeráty</div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {listings.slice(0, 4).map(l => (
              <MiniCard key={l.id} listing={l} />
            ))}
          </div>
        )}

        {listings.length > 0 && (
          <button
            onClick={onLogin}
            className="mt-3 w-full flex items-center justify-center gap-2 text-xs font-semibold text-slate-500 hover:text-indigo-600 py-2.5 rounded-xl border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50 transition-all"
          >
            <Eye className="w-3.5 h-3.5" />
            {listings.length > 4 ? `+ ${listings.length - 4} ďalších inzerátov` : 'Otvoriť portál'}
          </button>
        )}
      </div>
    </div>
  );
}