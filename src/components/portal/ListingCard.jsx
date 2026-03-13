import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Heart, MapPin, Maximize2, Eye } from 'lucide-react';

const TYPE_LABELS = { residential: 'Rezidenčné', commercial: 'Komerčné', land: 'Pozemok', development: 'Development' };
const TYPE_COLORS = { residential: 'bg-blue-100 text-blue-700', commercial: 'bg-amber-100 text-amber-700', land: 'bg-green-100 text-green-700', development: 'bg-purple-100 text-purple-700' };
const LISTING_LABELS = { sale: 'Predaj', lease: 'Nájom', investment: 'Investícia' };
const fmt = (n) => Math.round(n || 0).toLocaleString('sk-SK');

export default function ListingCard({ listing, isSaved, onSaveToggle, viewMode = 'grid' }) {
  const pricePerM2 = listing.price > 0 && listing.area_total > 0
    ? Math.round(listing.price / listing.area_total) : null;

  const isOffMarket = listing.visibility === 'off_market';

  if (viewMode === 'list') {
    return (
      <Link to={`/ListingDetail?id=${listing.id}`} className="flex bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-all duration-200 group">
        <div className="w-48 shrink-0 bg-slate-100 relative overflow-hidden">
          {listing.images?.[0]
            ? <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            : <div className="w-full h-full flex items-center justify-center text-slate-300 text-4xl">🏠</div>
          }
          {isOffMarket && <div className="absolute top-2 left-2"><Badge className="text-xs bg-violet-600 text-white">Off-Market</Badge></div>}
        </div>
        <div className="flex-1 p-4 flex justify-between items-center">
          <div>
            <div className="flex gap-1.5 mb-1.5">
              <Badge className={`text-xs ${TYPE_COLORS[listing.property_type]}`}>{TYPE_LABELS[listing.property_type]}</Badge>
              <Badge className="text-xs bg-slate-100 text-slate-600">{LISTING_LABELS[listing.listing_type]}</Badge>
            </div>
            <div className="font-bold text-slate-800 mb-1">{listing.title}</div>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{listing.location_city}, {listing.location_region}</span>
              <span className="flex items-center gap-1"><Maximize2 className="w-3 h-3" />{fmt(listing.area_total)} m²</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xl font-black text-slate-900">{listing.price > 0 ? `€ ${fmt(listing.price)}` : 'Na dopyt'}</div>
            {pricePerM2 && <div className="text-xs text-slate-400">€ {fmt(pricePerM2)}/m²</div>}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-200 group">
      <Link to={`/ListingDetail?id=${listing.id}`} className="block relative">
        <div className="aspect-[4/3] bg-slate-100 overflow-hidden">
          {listing.images?.[0]
            ? <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            : <div className="w-full h-full flex items-center justify-center text-5xl">🏠</div>
          }
        </div>
        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
          <Badge className={`text-xs ${TYPE_COLORS[listing.property_type]}`}>{TYPE_LABELS[listing.property_type]}</Badge>
          <Badge className="text-xs bg-slate-700 text-white">{LISTING_LABELS[listing.listing_type]}</Badge>
          {isOffMarket && <Badge className="text-xs bg-violet-600 text-white">Off-Market</Badge>}
          {listing.is_featured && <Badge className="text-xs bg-yellow-500 text-white">⭐ Featured</Badge>}
        </div>
        {onSaveToggle && (
          <button
            onClick={(e) => { e.preventDefault(); onSaveToggle(listing.id); }}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-sm hover:scale-110 transition-transform z-10"
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-red-500 text-red-500' : 'text-slate-400'}`} />
          </button>
        )}
      </Link>
      <Link to={`/ListingDetail?id=${listing.id}`} className="block p-4">
        <div className="font-bold text-slate-800 text-sm leading-tight line-clamp-2 mb-2">{listing.title}</div>
        <div className="text-xl font-black text-slate-900 mb-1">
          {listing.price > 0 ? `€ ${fmt(listing.price)}` : 'Na dopyt'}
          {pricePerM2 && <span className="text-xs font-normal text-slate-400 ml-2">€ {fmt(pricePerM2)}/m²</span>}
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1"><Maximize2 className="w-3 h-3" />{fmt(listing.area_total)} m²</span>
          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{listing.location_city}, {listing.location_region}</span>
        </div>
        {listing.view_count > 0 && (
          <div className="flex items-center gap-1 text-xs text-slate-400 mt-2">
            <Eye className="w-3 h-3" />{listing.view_count} zobrazení
          </div>
        )}
      </Link>
    </div>
  );
}