import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Grid, List, Search } from 'lucide-react';
import ListingCard from '@/components/portal/ListingCard';
import PortalNav from '@/components/portal/PortalNav';

const REGIONS = ['BA','TT','TN','NR','ZA','BB','PO','KE'];
const REGION_LABELS = { BA:'Bratislava', TT:'Trnava', TN:'Trenčín', NR:'Nitra', ZA:'Žilina', BB:'Banská Bystrica', PO:'Prešov', KE:'Košice' };

export default function PortalHome() {
  const [search, setSearch] = useState('');
  const [propertyType, setPropertyType] = useState('all');
  const [listingType, setListingType] = useState('all');
  const [region, setRegion] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
    retry: false
  });

  const { data: listings = [], isLoading } = useQuery({
    queryKey: ['listings-active'],
    queryFn: () => base44.entities.Listing.filter({ status: 'active' }, '-created_date', 100)
  });

  const { data: savedListings = [] } = useQuery({
    queryKey: ['savedListings', user?.id],
    queryFn: () => base44.entities.SavedListing.filter({ user_id: user.id }),
    enabled: !!user
  });

  const saveMutation = useMutation({
    mutationFn: async (listingId) => {
      const existing = savedListings.find(s => s.listing_id === listingId);
      if (existing) await base44.entities.SavedListing.delete(existing.id);
      else await base44.entities.SavedListing.create({ listing_id: listingId, user_id: user.id });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['savedListings'] })
  });

  const isPro = user?.role === 'admin' || user?.beta_access;
  const savedIds = new Set(savedListings.map(s => s.listing_id));

  const filtered = useMemo(() => {
    let result = listings.filter(l => {
      if (search) {
        const q = search.toLowerCase();
        if (!l.title?.toLowerCase().includes(q) && !l.location_city?.toLowerCase().includes(q)) return false;
      }
      if (propertyType !== 'all' && l.property_type !== propertyType) return false;
      if (listingType !== 'all' && l.listing_type !== listingType) return false;
      if (region !== 'all' && l.location_region !== region) return false;
      if (l.visibility === 'off_market' && !isPro) return false;
      return true;
    });
    if (sortBy === 'newest') result.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    else if (sortBy === 'price_asc') result.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price_desc') result.sort((a, b) => b.price - a.price);
    else if (sortBy === 'area_asc') result.sort((a, b) => a.area_total - b.area_total);
    return result;
  }, [listings, search, propertyType, listingType, region, sortBy, isPro]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <PortalNav />

      {/* Title */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Realitný portál</h1>
          <p className="text-slate-500 text-sm">{filtered.length} nehnuteľností</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input placeholder="Hľadať podľa názvu alebo mesta..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-9" />
        </div>
        <Select value={propertyType} onValueChange={setPropertyType}>
          <SelectTrigger className="w-40 h-9"><SelectValue placeholder="Typ" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Všetky typy</SelectItem>
            <SelectItem value="residential">Rezidenčné</SelectItem>
            <SelectItem value="commercial">Komerčné</SelectItem>
            <SelectItem value="land">Pozemky</SelectItem>
            <SelectItem value="development">Development</SelectItem>
          </SelectContent>
        </Select>
        <Select value={listingType} onValueChange={setListingType}>
          <SelectTrigger className="w-36 h-9"><SelectValue placeholder="Predaj/Nájom" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Všetko</SelectItem>
            <SelectItem value="sale">Predaj</SelectItem>
            <SelectItem value="lease">Nájom</SelectItem>
            <SelectItem value="investment">Investícia</SelectItem>
          </SelectContent>
        </Select>
        <Select value={region} onValueChange={setRegion}>
          <SelectTrigger className="w-36 h-9"><SelectValue placeholder="Kraj" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Všetky kraje</SelectItem>
            {REGIONS.map(r => <SelectItem key={r} value={r}>{REGION_LABELS[r]}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-36 h-9"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Najnovšie</SelectItem>
            <SelectItem value="price_asc">Cena ↑</SelectItem>
            <SelectItem value="price_desc">Cena ↓</SelectItem>
            <SelectItem value="area_asc">Plocha ↑</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex gap-1">
          <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-indigo-100 text-indigo-600' : 'text-slate-400 hover:bg-slate-100'}`}><Grid className="w-4 h-4" /></button>
          <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-indigo-100 text-indigo-600' : 'text-slate-400 hover:bg-slate-100'}`}><List className="w-4 h-4" /></button>
        </div>
      </div>

      {/* Listings */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <div key={i} className="bg-slate-100 rounded-2xl h-64 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24 text-slate-400">
          <div className="text-6xl mb-4">🏠</div>
          <div className="font-bold text-slate-600 mb-1">Žiadne výsledky</div>
          <div className="text-sm">Upravte filtre alebo pridajte nový inzerát</div>
        </div>
      ) : (
        <div className={viewMode === 'grid'
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          : 'flex flex-col gap-4'
        }>
          {filtered.map(listing => (
            <ListingCard
              key={listing.id}
              listing={listing}
              isSaved={savedIds.has(listing.id)}
              onSaveToggle={user ? (id) => saveMutation.mutate(id) : null}
              viewMode={viewMode}
            />
          ))}
        </div>
      )}
    </div>
  );
}