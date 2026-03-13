import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Clock, CheckCircle2, XCircle, FileText } from 'lucide-react';

const NDA_TEXT = `DOHODA O MLČANLIVOSTI (NDA)

Týmto potvrdzujem, že informácie poskytnuté v rámci tohto off-market inzerátu sú dôverné. Zaväzujem sa:
1. Neposkytovať tieto informácie tretím stranám bez súhlasu predajcu.
2. Používať informácie výlučne na účely posúdenia investičnej príležitosti.
3. Nevyužívať informácie na akékoľvek iné komerčné účely.

Porušenie tejto dohody môže mať právne následky.`;

export default function NDARequestBlock({ listing, user }) {
  const queryClient = useQueryClient();
  const [ndaAccepted, setNdaAccepted] = useState(false);
  const [showNdaText, setShowNdaText] = useState(false);

  const { data: ndaRequests = [] } = useQuery({
    queryKey: ['ndaRequests', listing.id, user?.id],
    queryFn: () => base44.entities.NDARequest.filter({ listing_id: listing.id, requester_id: user.id }),
    enabled: !!user
  });

  const myNda = ndaRequests[0];

  const requestMutation = useMutation({
    mutationFn: () => base44.entities.NDARequest.create({
      listing_id: listing.id,
      requester_id: user.id,
      seller_id: listing.created_by,
      status: 'pending',
      nda_accepted_at: new Date().toISOString(),
      nda_text_version: 'v1'
    }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['ndaRequests'] })
  });

  if (!user) {
    return (
      <Card className="border-violet-200 bg-violet-50">
        <CardContent className="p-4 text-center">
          <Lock className="w-6 h-6 text-violet-500 mx-auto mb-2" />
          <p className="text-sm font-semibold text-violet-800 mb-1">Off-Market nehnuteľnosť</p>
          <p className="text-xs text-violet-600 mb-3">Pre zobrazenie detailov sa prihláste</p>
          <Button size="sm" onClick={() => base44.auth.redirectToLogin(window.location.href)}
            className="bg-violet-600 hover:bg-violet-700">Prihlásiť sa</Button>
        </CardContent>
      </Card>
    );
  }

  if (myNda?.status === 'approved') {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-4 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-green-800">Prístup schválený</p>
            <p className="text-xs text-green-600">Máte plný prístup k detailom tejto nehnuteľnosti</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (myNda?.status === 'pending') {
    return (
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="p-4 flex items-center gap-3">
          <Clock className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-amber-800">Žiadosť čaká na schválenie</p>
            <p className="text-xs text-amber-600">Predajca skontroluje vašu žiadosť a čoskoro vás kontaktuje</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (myNda?.status === 'rejected') {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-4 flex items-center gap-3">
          <XCircle className="w-5 h-5 text-red-500 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-red-800">Žiadosť zamietnutá</p>
            <p className="text-xs text-red-600">{myNda.seller_notes || 'Predajca vašu žiadosť zamietol'}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-violet-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Lock className="w-4 h-4 text-violet-600" /> Off-Market — Požiadať o prístup
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-3">
        <p className="text-xs text-slate-500">
          Táto nehnuteľnosť je off-market. Pre zobrazenie plných detailov a kontaktu predajcu musíte podpísať NDA.
        </p>

        <button onClick={() => setShowNdaText(v => !v)}
          className="flex items-center gap-1.5 text-xs text-indigo-600 hover:underline">
          <FileText className="w-3.5 h-3.5" /> {showNdaText ? 'Skryť text NDA' : 'Zobraziť text NDA'}
        </button>

        {showNdaText && (
          <div className="bg-slate-50 rounded-lg p-3 text-xs text-slate-600 whitespace-pre-wrap max-h-32 overflow-y-auto border border-slate-200">
            {NDA_TEXT}
          </div>
        )}

        <label className="flex items-start gap-2 cursor-pointer">
          <input type="checkbox" checked={ndaAccepted} onChange={e => setNdaAccepted(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded accent-violet-600" />
          <span className="text-xs text-slate-600">Súhlasím s podmienkami NDA a žiadam o prístup k detailom</span>
        </label>

        <Button
          onClick={() => requestMutation.mutate()}
          disabled={!ndaAccepted || requestMutation.isPending}
          className="w-full bg-violet-600 hover:bg-violet-700 gap-2"
          size="sm"
        >
          <Lock className="w-3.5 h-3.5" />
          {requestMutation.isPending ? 'Odosielam...' : 'Požiadať o prístup'}
        </Button>
      </CardContent>
    </Card>
  );
}