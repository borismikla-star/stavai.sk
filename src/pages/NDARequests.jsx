import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle2, XCircle, Clock, Building2 } from 'lucide-react';
import PortalNav from '@/components/portal/PortalNav';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

const STATUS_LABELS = { pending: 'Čaká', approved: 'Schválená', rejected: 'Zamietnutá' };
const STATUS_COLORS = { pending: 'bg-amber-100 text-amber-700', approved: 'bg-green-100 text-green-700', rejected: 'bg-red-100 text-red-700' };

export default function NDARequests() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [rejectNotes, setRejectNotes] = useState({});
  const [showRejectForm, setShowRejectForm] = useState({});

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
    retry: false
  });

  const { data: ndaRequests = [], isLoading } = useQuery({
    queryKey: ['ndaRequests-seller', user?.id],
    queryFn: () => base44.entities.NDARequest.filter({ seller_id: user.id }, '-created_date'),
    enabled: !!user
  });

  // Fetch listing titles for context
  const listingIds = [...new Set(ndaRequests.map(r => r.listing_id))];
  const { data: listings = [] } = useQuery({
    queryKey: ['ndaListings', listingIds.join(',')],
    queryFn: async () => {
      const results = await Promise.all(listingIds.map(id => base44.entities.Listing.get(id)));
      return results.filter(Boolean);
    },
    enabled: listingIds.length > 0
  });
  const listingMap = Object.fromEntries(listings.map(l => [l.id, l]));

  // Fetch user names for requesters
  const requesterIds = [...new Set(ndaRequests.map(r => r.requester_id))];
  const { data: users = [] } = useQuery({
    queryKey: ['ndaUsers', requesterIds.join(',')],
    queryFn: () => base44.entities.User.list(),
    enabled: requesterIds.length > 0
  });
  const userMap = Object.fromEntries(users.map(u => [u.id, u]));

  const updateMutation = useMutation({
    mutationFn: ({ id, status, notes }) => base44.entities.NDARequest.update(id, {
      status,
      seller_notes: notes,
      ...(status === 'approved' ? { approved_at: new Date().toISOString() } : { rejected_at: new Date().toISOString() })
    }),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['ndaRequests-seller'] });
      toast({ title: vars.status === 'approved' ? 'Žiadosť schválená' : 'Žiadosť zamietnutá' });
      setShowRejectForm(p => ({ ...p, [vars.id]: false }));
    }
  });

  const pendingCount = ndaRequests.filter(r => r.status === 'pending').length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <PortalNav />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900">NDA Žiadosti</h1>
          <p className="text-slate-500 text-sm">
            {pendingCount > 0 ? <span className="text-amber-600 font-medium">{pendingCount} čakajúcich</span> : 'Žiadne čakajúce žiadosti'}
            {ndaRequests.length > 0 && ` · ${ndaRequests.length} celkom`}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => <div key={i} className="bg-slate-100 rounded-2xl h-20 animate-pulse" />)}
        </div>
      ) : ndaRequests.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-3">🔐</div>
          <div className="font-bold text-slate-600 mb-1">Žiadne NDA žiadosti</div>
          <p className="text-slate-400 text-sm">Keď niekto požiada o prístup k vašim off-market inzerátom, zobrazí sa tu</p>
        </div>
      ) : (
        <div className="space-y-3">
          {ndaRequests.map(req => {
            const listing = listingMap[req.listing_id];
            const requester = userMap[req.requester_id];
            return (
              <Card key={req.id} className={req.status === 'pending' ? 'border-amber-200' : ''}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={`text-xs ${STATUS_COLORS[req.status]}`}>{STATUS_LABELS[req.status]}</Badge>
                        {req.status === 'pending' && <Clock className="w-3.5 h-3.5 text-amber-500" />}
                      </div>
                      <div className="font-bold text-slate-800 text-sm">
                        {requester?.full_name || req.requester_id}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        {listing?.title || req.listing_id}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {new Date(req.created_date).toLocaleDateString('sk-SK')}
                      </div>
                      {req.seller_notes && req.status === 'rejected' && (
                        <div className="text-xs text-red-500 mt-1">Dôvod: {req.seller_notes}</div>
                      )}
                    </div>

                    {req.status === 'pending' && (
                      <div className="flex flex-col gap-2 shrink-0">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 gap-1.5 h-8 text-xs"
                          onClick={() => updateMutation.mutate({ id: req.id, status: 'approved' })}>
                          <CheckCircle2 className="w-3.5 h-3.5" /> Schváliť
                        </Button>
                        <Button size="sm" variant="outline" className="border-red-200 text-red-500 hover:bg-red-50 gap-1.5 h-8 text-xs"
                          onClick={() => setShowRejectForm(p => ({ ...p, [req.id]: !p[req.id] }))}>
                          <XCircle className="w-3.5 h-3.5" /> Zamietnuť
                        </Button>
                      </div>
                    )}
                  </div>

                  {showRejectForm[req.id] && (
                    <div className="mt-3 space-y-2 border-t border-slate-100 pt-3">
                      <Textarea
                        placeholder="Dôvod zamietnutia (voliteľné)..."
                        value={rejectNotes[req.id] || ''}
                        onChange={e => setRejectNotes(p => ({ ...p, [req.id]: e.target.value }))}
                        rows={2} className="text-sm"
                      />
                      <Button size="sm" className="bg-red-500 hover:bg-red-600 text-xs"
                        onClick={() => updateMutation.mutate({ id: req.id, status: 'rejected', notes: rejectNotes[req.id] || '' })}>
                        Potvrdiť zamietnutie
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}