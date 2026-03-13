import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import ListingCard from '@/components/portal/ListingCard';
import PortalNav from '@/components/portal/PortalNav';

export default function SavedListings() {
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
    retry: false
  });

  const { data: savedEntries = [], isLoading: loadingSaved } = useQuery({
    queryKey: ['savedListings', user?.id],
    queryFn: () => base44.entities.SavedListing.filter({ user_id: user.id }),
    enabled: !!user
  });

  const listingIds = savedEntries.map(s => s.listing_id);

  const { data: listings = [], isLoading: loadingListings } = useQuery({
    queryKey: ['savedListingDetails', listingIds.join(',')],
    queryFn: async () => {
      if (!listingIds.length) return [];
      const all = await base44.entities.Listing.list();
      return all.filter(l => listingIds.includes(l.id));
    },
    enabled: listingIds.length > 0
  });

  const removeMutation = useMutation({
    mutationFn: async (listingId) => {
      const entry = savedEntries.find(s => s.listing_id === listingId);
      if (entry) await base44.entities.SavedListing.delete(entry.id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['savedListings'] })
  });

  const isLoading = loadingSaved || loadingListings;
  const savedIds = new Set(savedEntries.map(s => s.listing_id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <PortalNav />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Uložené nehnuteľnosti</h1>
          <p className="text-slate-500 text-sm">{savedEntries.length} uložených</p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => <div key={i} className="bg-slate-100 rounded-2xl h-64 animate-pulse" />)}
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-20">
          <Heart className="w-12 h-12 text-slate-200 mx-auto mb-3" />
          <div className="font-bold text-slate-600 mb-1">Žiadne uložené nehnuteľnosti</div>
          <p className="text-slate-400 text-sm mb-4">Ukladajte nehnuteľnosti kliknutím na ikonu srdca</p>
          <Link to="/PortalHome"><Button className="bg-indigo-600 hover:bg-indigo-700">Prechádzať portál</Button></Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map(listing => (
            <ListingCard
              key={listing.id}
              listing={listing}
              isSaved={savedIds.has(listing.id)}
              onSaveToggle={(id) => removeMutation.mutate(id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}