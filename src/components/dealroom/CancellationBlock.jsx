import React, { useState } from 'react';
import { XCircle, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function CancellationBlock({ deal, user, listing, isSeller, isBuyer, participantUsers }) {
  const [showModal, setShowModal] = useState(false);
  const [reason, setReason] = useState('');
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: requests = [] } = useQuery({
    queryKey: ['cancellation-requests', deal.id],
    queryFn: () => base44.entities.CancellationRequest.filter({ deal_room_id: deal.id }),
  });

  const pending = requests.find(r => r.status === 'pending');

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.CancellationRequest.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cancellation-requests', deal.id] });
      setShowModal(false);
      setReason('');
      // Notify seller
      const sellerUser = participantUsers.find(u => u.id === deal.seller_id);
      if (sellerUser?.email) {
        base44.integrations.Core.SendEmail({
          to: sellerUser.email,
          subject: `Kupujúci žiada o zrušenie dealu`,
          body: `Kupujúci požiadal o zrušenie dealu pre: ${listing?.title || ''}.\n\nDôvod: ${reason}\n\nProsím prihláste sa a rozhodnite o žiadosti.\nhttps://stavai.sk/DealRoomPage?id=${deal.id}`
        }).catch(() => {});
      }
      toast({ title: 'Žiadosť odoslaná', description: 'Predávajúci bol upozornený.' });
    }
  });

  const resolveMutation = useMutation({
    mutationFn: ({ id, status, note }) => base44.entities.CancellationRequest.update(id, {
      status, seller_note: note, resolved_at: new Date().toISOString()
    }),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['cancellation-requests', deal.id] });
      queryClient.invalidateQueries({ queryKey: ['deal-room', deal.id] });
      if (vars.status === 'approved') {
        // If reservation_signed → Cancellation Fee flow (placeholder for Stripe)
        if (deal.status === 'reservation_signed') {
          toast({
            title: 'Žiadosť schválená — Cancellation Fee',
            description: 'Stripe platba bude aktivovaná čoskoro. Deal bude zrušený po zaplatení €500.',
            variant: 'default'
          });
        } else {
          // Free cancellation if just active
          base44.entities.DealRoom.update(deal.id, {
            status: 'cancelled',
            audit_log: [...(deal.audit_log || []), {
              user_id: user.id,
              action: 'Seller schválil žiadosť kupujúceho o zrušenie (bez poplatku)',
              timestamp: new Date().toISOString()
            }]
          }).then(() => queryClient.invalidateQueries({ queryKey: ['deal-room', deal.id] }));
          toast({ title: 'Deal zrušený', description: 'Zrušenie bez poplatku — rezervácia nebola podpísaná.' });
        }
      } else {
        toast({ title: 'Žiadosť zamietnutá' });
      }
      setShowApproveConfirm(false);
    }
  });

  if (deal.status === 'completed' || deal.status === 'cancelled') return null;

  return (
    <>
      {/* Buyer button */}
      {isBuyer && !pending && (
        <Button size="sm" variant="outline" className="w-full border-red-200 text-red-500 hover:bg-red-50"
          onClick={() => setShowModal(true)}>
          <XCircle className="w-4 h-4 mr-2" /> Požiadať o zrušenie
        </Button>
      )}

      {/* Pending badge visible to both */}
      {pending && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 space-y-2">
          <div className="flex items-center gap-2 text-amber-700 text-sm font-semibold">
            <Clock className="w-4 h-4" /> Žiadosť o zrušenie čaká
          </div>
          <p className="text-xs text-amber-600">Dôvod: {pending.reason}</p>
          {isSeller && (
            <div className="flex gap-2 pt-1">
              <Button size="sm" className="flex-1 text-xs bg-red-600 hover:bg-red-700 text-white"
                onClick={() => setShowApproveConfirm(true)}
                disabled={resolveMutation.isPending}>
                <CheckCircle2 className="w-3 h-3 mr-1" /> Schváliť
              </Button>
              <Button size="sm" variant="outline" className="flex-1 text-xs border-slate-300"
                onClick={() => resolveMutation.mutate({ id: pending.id, status: 'rejected', note: '' })}
                disabled={resolveMutation.isPending}>
                Zamietnuť
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Buyer modal — reason input */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <XCircle className="w-5 h-5" /> Žiadosť o zrušenie dealu
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800">
              <AlertTriangle className="w-4 h-4 inline mr-1" />
              Vaša žiadosť bude odoslaná predávajúcemu. Zrušenie schvaľuje predávajúci.
              {deal.status === 'reservation_signed' && ' Ak bola podpísaná rezervácia, zrušenie podlieha Cancellation Fee €500.'}
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">Dôvod zrušenia *</label>
              <textarea
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder="Uveďte dôvod žiadosti o zrušenie..."
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-red-300"
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowModal(false)}>Späť</Button>
              <Button
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                disabled={!reason.trim() || createMutation.isPending}
                onClick={() => createMutation.mutate({ deal_room_id: deal.id, requester_id: user.id, reason })}
              >
                {createMutation.isPending ? 'Odosielam...' : 'Odoslať žiadosť'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Seller approve confirm */}
      <Dialog open={showApproveConfirm} onOpenChange={setShowApproveConfirm}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-red-600">Potvrdiť schválenie zrušenia?</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm text-slate-600">
            {deal.status === 'reservation_signed'
              ? <p>Rezervácia bola podpísaná — zrušenie vyžaduje <strong>Cancellation Fee €500</strong> (Stripe platba bude aktivovaná čoskoro).</p>
              : <p>Rezervácia nebola podpísaná — zrušenie je <strong>bez poplatku</strong>.</p>
            }
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowApproveConfirm(false)}>Späť</Button>
              <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                onClick={() => resolveMutation.mutate({ id: pending?.id, status: 'approved', note: '' })}
                disabled={resolveMutation.isPending}>
                Schváliť zrušenie
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}