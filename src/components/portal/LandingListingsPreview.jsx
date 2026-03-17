import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { MapPin, Maximize2, Search, SlidersHorizontal } from 'lucide-react';

const TYPE_LABELS = { residential: 'Rezidenčné', commercial: 'Komerčné', land: 'Pozemok', development: 'Development' };
const LISTING_LABELS = { sale: 'Predaj', lease: 'Nájom', investment: 'Investícia' };
const REGION_LABELS = { BA:'Bratislava', TT:'Trnava', TN:'Trenčín', NR:'Nitra', ZA:'Žilina', BB:'Banská Bystrica', PO:'Prešov', KE:'Košice' };

const TYPE_COLORS = {
  residential: 'bg-emerald-100 text-emerald-700',
  commercial: 'bg-blue-100 text-blue-700',
  land: 'bg-amber-100 text-amber-700',
  development: 'bg-violet-100 text-violet-700',
};

const fmt = (n) => n > 0 ? new Intl.NumberFormat('sk', { maximumFractionDigits: 0 }).format(n) + ' €' : 'Na dopyt';

function ListingCard({ listing, onLogin }) {
  const img = listing.images?.[0];
  return (
    <div
      onClick={onLogin}
      className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:shadow-indigo-100/50 hover:-translate-y-1 transition-all duration-200 cursor-pointer group"
    >
      <div className="relative h-44 bg-slate-100 overflow-hidden">
        {img ? (
          <img src={img} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-200 text-5xl bg-gradient-to-br from-slate-50 to-slate-100">🏠</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <div className="absolute top-2.5 left-2.5 flex gap-1.5">
          <span className="text-xs font-bold bg-white/95 backdrop-blur-sm text-slate-700 px-2.5 py-1 rounded-full shadow-sm">
            {LISTING_LABELS[listing.listing_type]}
          </span>
          {listing.visibility === 'off_market' && (
            <span className="text-xs font-bold bg-violet-600 text-white px-2.5 py-1 rounded-full shadow-sm">Off-market</span>
          )}
        </div>
        {listing.property_type && (
          <div className="absolute bottom-2.5 left-2.5">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${TYPE_COLORS[listing.property_type]}`}>
              {TYPE_LABELS[listing.property_type]}
            </span>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="font-bold text-slate-800 text-sm leading-snug line-clamp-1 mb-2 group-hover:text-indigo-600 transition-colors">{listing.title}</div>
        <div className="flex items-center gap-1 text-slate-400 text-xs mb-3">
          <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-slate-300" />
          <span>{listing.location_city}{listing.location_region ? `, ${REGION_LABELS[listing.location_region]}` : ''}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-indigo-600 font-bold text-base">{fmt(listing.price)}</span>
          {listing.area_total && (
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Maximize2 className="w-3 h-3" />{listing.area_total} m²
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LandingListingsPreview({ onLogin }) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [listingFilter, setListingFilter] = useState('all');

  const { data: listings = [], isLoading } = useQuery({
    queryKey: ['landing-listings-preview'],
    queryFn: () => base44.entities.Listing.filter({ status: 'active', visibility: 'public' }, '-created_date', 20),
  });

  const filtered = useMemo(() => {
    return listings.filter(l => {
      const matchSearch = !search || l.title?.toLowerCase().includes(search.toLowerCase()) || l.location_city?.toLowerCase().includes(search.toLowerCase());
      const matchType = typeFilter === 'all' || l.property_type === typeFilter;
      const matchListing = listingFilter === 'all' || l.listing_type === listingFilter;
      return matchSearch && matchType && matchListing;
    }).slice(0, 6);
  }, [listings, search, typeFilter, listingFilter]);

  return (
    <div>
      {/* Search & filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Hľadať podľa názvu alebo mesta..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all"
          />
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="pl-9 pr-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 appearance-none cursor-pointer text-slate-600"
            >
              <option value="all">Všetky typy</option>
              <option value="residential">Rezidenčné</option>
              <option value="commercial">Komerčné</option>
              <option value="land">Pozemok</option>
              <option value="development">Development</option>
            </select>
          </div>
          <select
            value={listingFilter}
            onChange={e => setListingFilter(e.target.value)}
            className="px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 appearance-none cursor-pointer text-slate-600"
          >
            <option value="all">Predaj & Nájom</option>
            <option value="sale">Predaj</option>
            <option value="lease">Nájom</option>
            <option value="investment">Investícia</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-52 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <div className="text-4xl mb-3">🏗️</div>
          <div className="text-sm font-medium">
            {listings.length === 0 ? 'Čoskoro prvé inzeráty' : 'Žiadne výsledky pre zadané filtre'}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {filtered.map(l => (
            <ListingCard key={l.id} listing={l} onLogin={onLogin} />
          ))}
        </div>
      )}
    </div>
  );
}