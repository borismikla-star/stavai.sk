import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Eye, MessageSquare, Heart, Pencil, Trash2, MoreVertical } from 'lucide-react';
import PortalNav from '@/components/portal/PortalNav';

const STATUS_LABELS = { draft: 'Koncept', active: 'Aktívny', under_offer: 'V rokovaní', sold: 'Predaný', expired: 'Expirovaný' };
const STATUS_COLORS = { draft: 'bg-slate-100 text-slate-600', active: 'bg-green-100 text-green-700', under_offer: 'bg-amber-100 text-amber-700', sold: 'bg-blue-100 text-blue-700', expired: 'bg-red-100 text-red-700' };
const TYPE_LABELS = { residential: 'Rezidenčné', commercial: 'Komerčné', land: 'Pozemok', development: 'Development' };
const fmt = (n) => Math.round(n || 0).toLocaleString('sk-SK');

export default function MyListings() {
  const queryClient = useQueryClient();
  const [editingStatus, setEditingStatus] = useState(null);

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
    retry: false
  });

  const { data: listings = [], isLoading } = useQuery({
    queryKey: ['myListings', user?.email],
    queryFn: () => base44.entities.Listing.filter({ created_by: user.email }, '-created_date'),
    enabled: !!user
  });

  const { data: inquiries = [] } = useQuery({
    queryKey: ['myInquiries-received', user?.id],
    queryFn: () => base44.entities.ListingInquiry.filter({ recipient_id: user.id }),
    enabled: !!user
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Listing.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['myListings'] })
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => base44.entities.Listing.update(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myListings'] });
      setEditingStatus(null);
    }
  });

  const inquiryCountMap = inquiries.reduce((acc, inq) => {
    acc[inq.listing_id] = (acc[inq.listing_id] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <PortalNav />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Moje inzeráty</h1>
          <p className="text-slate-500 text-sm">{listings.length} inzerátov</p>
        </div>
        <Link to="/NewListing">
          <Button className="bg-indigo-600 hover:bg-indigo-700 gap-2">
            <Plus className="w-4 h-4" /> Nový inzerát
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => <div key={i} className="bg-slate-100 rounded-2xl h-24 animate-pulse" />)}
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-3">📋</div>
          <div className="font-bold text-slate-600 mb-2">Nemáte žiadne inzeráty</div>
          <p className="text-slate-400 text-sm mb-4">Pridajte prvý inzerát a oslovte záujemcov</p>
          <Link to="/NewListing"><Button className="bg-indigo-600 hover:bg-indigo-700">Pridať inzerát</Button></Link>
        </div>
      ) : (
        <div className="space-y-3">
          {listings.map(listing => (
            <Card key={listing.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex gap-4 items-start">
                  {/* Thumbnail */}
                  <div className="w-20 h-16 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                    {listing.images?.[0]
                      ? <img src={listing.images[0]} alt="" className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-2xl">🏠</div>
                    }
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link to={`/ListingDetail?id=${listing.id}`} className="font-bold text-slate-800 hover:text-indigo-600 line-clamp-1">{listing.title}</Link>
                        <div className="text-xs text-slate-400 mt-0.5">{TYPE_LABELS[listing.property_type]} · {listing.location_city}, {listing.location_region} · {fmt(listing.area_total)} m²</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-bold text-slate-800">{listing.price > 0 ? `€ ${fmt(listing.price)}` : 'Na dopyt'}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      {/* Status edit */}
                      {editingStatus === listing.id ? (
                        <Select
                          value={listing.status}
                          onValueChange={(v) => updateStatusMutation.mutate({ id: listing.id, status: v })}
                        >
                          <SelectTrigger className="h-6 text-xs w-36"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {Object.entries(STATUS_LABELS).map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      ) : (
                        <button onClick={() => setEditingStatus(listing.id)}>
                          <Badge className={`text-xs cursor-pointer ${STATUS_COLORS[listing.status]}`}>{STATUS_LABELS[listing.status]}</Badge>
                        </button>
                      )}

                      {listing.visibility === 'off_market' && <Badge className="text-xs bg-violet-100 text-violet-700">Off-Market</Badge>}

                      {/* Stats */}
                      <span className="flex items-center gap-1 text-xs text-slate-400"><Eye className="w-3 h-3" />{listing.view_count || 0}</span>
                      <span className="flex items-center gap-1 text-xs text-slate-400"><MessageSquare className="w-3 h-3" />{inquiryCountMap[listing.id] || 0}</span>
                      <span className="flex items-center gap-1 text-xs text-slate-400"><Heart className="w-3 h-3" />{listing.saved_count || 0}</span>

                      {/* Actions */}
                      <div className="ml-auto flex gap-2">
                        <Button size="sm" variant="ghost" className="h-7 text-xs text-slate-500 gap-1" asChild>
                          <Link to={`/ListingDetail?id=${listing.id}`}><Eye className="w-3 h-3" />Detail</Link>
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 text-xs text-red-400 hover:text-red-600 hover:bg-red-50"
                          onClick={() => { if (confirm('Zmazať inzerát?')) deleteMutation.mutate(listing.id); }}>
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}