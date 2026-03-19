import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import {
  FileText, Upload, CheckCircle2, Clock, AlertTriangle,
  Download, Eye, Shield, User, Building2, ChevronDown, ChevronUp, XCircle
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import PortalNav from '@/components/portal/PortalNav';
import DealPhaseProgress from '@/components/dealroom/DealPhaseProgress';
import DDChecklist from '@/components/dealroom/DDChecklist';
import CancellationBlock from '@/components/dealroom/CancellationBlock';
import QALog from '@/components/dealroom/QALog';
import { getChecklist, isChecklistComplete } from '@/components/dealroom/ddChecklists';

const STATUS_LABELS = {
  active: 'Aktívny',
  due_diligence: 'Due Diligence',
  reservation_signed: 'Rezervácia podpísaná',
  completed: 'Uzavretý',
  cancelled: 'Zrušený'
};
const STATUS_COLORS = {
  active: 'bg-blue-100 text-blue-700',
  due_diligence: 'bg-violet-100 text-violet-700',
  reservation_signed: 'bg-amber-100 text-amber-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700'
};
const DOC_TYPE_LABELS = {
  nda: 'NDA',
  reservation: 'Rezervačná zmluva',
  due_diligence: 'Due Diligence',
  spa_draft: 'Návrh kúpnej zmluvy',
  other: 'Iné'
};

function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('sk-SK', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function DealRoomPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const dealId = urlParams.get('id');
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [showAuditLog, setShowAuditLog] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [docType, setDocType] = useState('other');
  const [docVisibility, setDocVisibility] = useState('both');
  const [reportedPriceInput, setReportedPriceInput] = useState('');
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [uploadingContract, setUploadingContract] = useState(false);
  const [showReservationClickwrap, setShowReservationClickwrap] = useState(false);
  const [reservationChecked, setReservationChecked] = useState(false);
  const [buyerDDConfirmed, setBuyerDDConfirmed] = useState(false);
  const [showBuyerClickwrap, setShowBuyerClickwrap] = useState(false);
  const [buyerReservationChecked, setBuyerReservationChecked] = useState(false);
  const [showAdminUnlock, setShowAdminUnlock] = useState(false);

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
    retry: false
  });

  const { data: deal, isLoading } = useQuery({
    queryKey: ['deal-room', dealId],
    queryFn: () => base44.entities.DealRoom.get(dealId),
    enabled: !!dealId
  });

  const { data: listing } = useQuery({
    queryKey: ['listing', deal?.listing_id],
    queryFn: () => base44.entities.Listing.get(deal.listing_id),
    enabled: !!deal?.listing_id
  });

  const participantIds = deal ? [deal.seller_id, deal.buyer_id, deal.agent_id].filter(Boolean) : [];
  const { data: participantUsers = [] } = useQuery({
    queryKey: ['deal-participants', ...participantIds],
    queryFn: () => base44.entities.User.filter({ id: { $in: participantIds } }),
    enabled: participantIds.length > 0
  });
  const userMap = Object.fromEntries(participantUsers.map(u => [u.id, u]));

  const updateMutation = useMutation({
    mutationFn: (data) => base44.entities.DealRoom.update(dealId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['deal-room', dealId] })
  });

  // DD checklist update
  const handleDDItemUpdate = async (itemId, data) => {
    const existingItems = deal.dd_items || [];
    const idx = existingItems.findIndex(d => d.checklist_id === itemId);
    let newItems;
    if (idx >= 0) {
      newItems = existingItems.map((d, i) => i === idx ? { ...d, ...data, checklist_id: itemId } : d);
    } else {
      newItems = [...existingItems, { checklist_id: itemId, ...data }];
    }
    const logEntry = {
      user_id: user.id,
      action: `DD checklist: ${itemId} — ${data.status === 'uploaded' ? `nahraté (${data.file_name})` : `označené ako nedostupné: ${data.waive_reason}`}`,
      timestamp: new Date().toISOString()
    };
    await updateMutation.mutateAsync({
      dd_items: newItems,
      audit_log: [...(deal.audit_log || []), logEntry]
    });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    const newDoc = {
      name: file.name, url: file_url, type: docType,
      uploaded_by: user.id, uploaded_at: new Date().toISOString(), visible_to: docVisibility
    };
    const newLog = { user_id: user.id, action: `Nahrál dokument: ${file.name}`, timestamp: new Date().toISOString() };
    await updateMutation.mutateAsync({
      documents: [...(deal.documents || []), newDoc],
      audit_log: [...(deal.audit_log || []), newLog]
    });
    setUploading(false);
    toast({ title: 'Dokument nahraný' });
  };

  const handleStatusChange = async (newStatus) => {
    if (newStatus === 'cancelled' && deal.status === 'reservation_signed') {
      setShowCancelConfirm(true);
      return;
    }
    const logEntry = {
      user_id: user.id,
      action: `Zmenil status na: ${STATUS_LABELS[newStatus]}`,
      timestamp: new Date().toISOString()
    };
    const updates = {
      status: newStatus,
      audit_log: [...(deal.audit_log || []), logEntry]
    };
    if (newStatus === 'reservation_signed') updates.reservation_signed_at = new Date().toISOString();
    if (newStatus === 'completed') updates.deal_closed_at = new Date().toISOString();
    await updateMutation.mutateAsync(updates);

    if (newStatus === 'completed' && deal.listing_id) {
      await base44.entities.Listing.update(deal.listing_id, { status: 'sold' });
      const buyerUser = participantUsers.find(u => u.id === deal.buyer_id);
      if (buyerUser?.email) {
        base44.integrations.Core.SendEmail({
          to: buyerUser.email,
          subject: `Predávajúci uzavrel deal — potvrďte predajnú cenu`,
          body: `Predávajúci nahlásil uzavretie dealu pre: ${listing?.title || ''}.\n\nProsím potvrďte predajnú cenu:\nhttps://stavai.sk/DealRoomPage?id=${dealId}\n\nTím stavai.sk`
        }).catch(() => {});
      }
    }
    toast({ title: `Status: ${STATUS_LABELS[newStatus]}` });
  };

  const handleCancellationFeePaid = async () => {
    // Stripe placeholder
    toast({
      title: 'Stripe platba — čoskoro',
      description: 'Platba Cancellation Fee €500 bude aktivovaná po konfigurácii Stripe.',
    });
    setShowCancelConfirm(false);
  };

  const handleReportPrice = async () => {
    const isSeller = deal.seller_id === user.id;
    const price = parseFloat(reportedPriceInput) || (!isSeller && deal.reported_price ? deal.reported_price : 0);
    if (!price) return;
    const listingPrice = listing?.price || 0;
    const priceDrop = isSeller && listingPrice > 0 ? (listingPrice - price) / listingPrice : 0;
    const isRedFlag = priceDrop > 0.20;
    const fee = computeFee(price);
    const logEntry = {
      user_id: user.id,
      action: `Nahlásil predajnú cenu: €${price.toLocaleString('sk-SK')}${isRedFlag ? ' ⚠️ Red Flag (pokles >20%)' : ''}`,
      timestamp: new Date().toISOString()
    };
    const updates = {
      ...(isSeller ? { reported_price: price } : { buyer_confirmed_price: price }),
      fee_calculated: fee,
      audit_log: [...(deal.audit_log || []), logEntry]
    };
    if (isRedFlag) updates.red_flag = true;
    await updateMutation.mutateAsync(updates);
    setReportedPriceInput('');
    if (isRedFlag) {
      base44.integrations.Core.SendEmail({
        to: 'info@stavai.sk',
        subject: `⚠️ Red Flag — Deal ${dealId}`,
        body: `Deal: ${dealId}\nCena: €${price.toLocaleString('sk-SK')}\nListing: €${listingPrice.toLocaleString('sk-SK')}\nPokles: ${Math.round(priceDrop * 100)}%`
      }).catch(() => {});
      toast({ title: '⚠️ Red Flag', description: `Pokles ${Math.round(priceDrop * 100)}%. Nahrajte sken zmluvy.`, variant: 'destructive' });
    } else {
      toast({ title: 'Cena zaznamenaná', description: `Success fee (1%): €${fee.toLocaleString('sk-SK')}` });
    }
  };

  const handleAddQAEntry = async (entry) => {
    await updateMutation.mutateAsync({
      audit_log: [...(deal.audit_log || []), entry]
    });
  };

  if (isLoading) return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <PortalNav />
      <div className="space-y-3 mt-6">
        {[...Array(3)].map((_, i) => <div key={i} className="bg-slate-100 rounded-2xl h-20 animate-pulse" />)}
      </div>
    </div>
  );

  if (!deal) return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <PortalNav />
      <div className="text-center py-20">
        <div className="text-5xl mb-3">🚪</div>
        <div className="font-bold text-slate-700">Deal Room nenájdený</div>
      </div>
    </div>
  );

  const isSeller = deal.seller_id === user?.id;
  const isBuyer = deal.buyer_id === user?.id;
  const isAgent = deal.agent_id === user?.id;
  const isAdmin = user?.role === 'admin';
  const isParticipant = isSeller || isBuyer || isAgent || isAdmin;

  if (!isParticipant) return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <PortalNav />
      <div className="text-center py-20">
        <Shield className="w-12 h-12 mx-auto mb-4 text-slate-300" />
        <div className="font-bold text-slate-700">Nemáte prístup k tomuto Deal Roomu</div>
      </div>
    </div>
  );

  const visibleDocs = (deal.documents || []).filter(doc => {
    if (doc.visible_to === 'both') return true;
    if (doc.visible_to === 'seller_only' && isSeller) return true;
    if (doc.visible_to === 'buyer_only' && isBuyer) return true;
    return isAdmin;
  });

  // DD checklist logic
  const checklist = listing ? getChecklist(listing.property_type) : [];
  const ddComplete = isChecklistComplete(checklist, deal.dd_items);

  // Phase advance conditions
  const canMoveToDueDiligence = deal.status === 'active';
  const buyerSignedReservation = !!(deal.buyer_reservation_signed_at);
  const canMoveToReservation = deal.status === 'due_diligence' && ddComplete;
  const canClose = (deal.status === 'reservation_signed') && !!deal.reported_price && buyerSignedReservation;

  // Fee with 14-day timeout logic
  const computeFee = (price) => {
    if (!price || !listing?.price) return Math.round(price * 0.01);
    const listingPrice = listing.price;
    const priceDrop = (listingPrice - price) / listingPrice;
    // 14-day timeout: if deal in reservation_signed for more than 14 days without close → reduced fee
    const reservedAt = deal.reservation_signed_at ? new Date(deal.reservation_signed_at) : null;
    const daysSinceReservation = reservedAt ? Math.floor((Date.now() - reservedAt.getTime()) / 86400000) : 0;
    const baseRate = daysSinceReservation > 14 ? 0.005 : 0.01; // 0.5% po timeout
    return Math.round(price * (priceDrop > 0.20 ? 0.01 : baseRate));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <PortalNav />

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-2xl font-black text-slate-900">Deal Room</h1>
          </div>
          {listing && (
            <p className="text-slate-500 text-sm">
              <Link to={`/ListingDetail?id=${listing.id}`} className="hover:text-indigo-600 transition-colors">{listing.title}</Link>
              {' · '}{listing.location_city}
            </p>
          )}
        </div>
        <Badge className={`text-sm px-3 py-1 ${STATUS_COLORS[deal.status] || 'bg-slate-100 text-slate-600'}`}>
          {STATUS_LABELS[deal.status] || deal.status}
        </Badge>
      </div>

      {/* Phase progress */}
      <DealPhaseProgress status={deal.status} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left */}
        <div className="lg:col-span-2 space-y-6">

          {/* Participants */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><User className="w-4 h-4" /> Účastníci</h2>
            <div className="space-y-3">
              {[
                { role: 'Predávajúci', id: deal.seller_id, color: 'bg-orange-100 text-orange-700' },
                { role: 'Kupujúci', id: deal.buyer_id, color: 'bg-blue-100 text-blue-700' },
                ...(deal.agent_id ? [{ role: 'Agent', id: deal.agent_id, color: 'bg-purple-100 text-purple-700' }] : [])
              ].map(p => (
                <div key={p.id} className="flex items-center gap-3">
                  <Badge className={`text-xs w-24 text-center ${p.color}`}>{p.role}</Badge>
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold">
                    {userMap[p.id]?.full_name?.charAt(0) || '?'}
                  </div>
                  <span className="text-sm font-medium text-slate-700">
                    {userMap[p.id]?.full_name || p.id}
                    {p.id === user?.id && <span className="text-xs text-slate-400 ml-1">(ty)</span>}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* DD Checklist — visible from phase 1 */}
          {checklist.length > 0 && (
            <DDChecklist
              checklist={checklist}
              ddItems={deal.dd_items}
              isSeller={isSeller}
              isBuyer={isBuyer}
              onUpdate={handleDDItemUpdate}
              disabled={deal.status === 'completed' || deal.status === 'cancelled'}
            />
          )}

          {/* Documents */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><FileText className="w-4 h-4" /> Dokumenty</h2>
            {visibleDocs.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-sm">Žiadne dokumenty zatiaľ</div>
            ) : (
              <div className="space-y-2 mb-4">
                {visibleDocs.map((doc, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-slate-400" />
                      <div>
                        <div className="text-sm font-medium text-slate-700">{doc.name}</div>
                        <div className="text-xs text-slate-400">
                          {DOC_TYPE_LABELS[doc.type] || doc.type} · {formatDate(doc.uploaded_at)}
                          {' · '}{userMap[doc.uploaded_by]?.full_name || 'neznámy'}
                          {doc.visible_to !== 'both' && (
                            <span className="ml-1 text-violet-500">· {doc.visible_to === 'seller_only' ? '🔒 len predávajúci' : '🔒 len kupujúci'}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <a href={doc.url} target="_blank" rel="noreferrer" className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
                      <Download className="w-4 h-4 text-slate-500" />
                    </a>
                  </div>
                ))}
              </div>
            )}
            {deal.status !== 'completed' && deal.status !== 'cancelled' && (
              <div className="border-t border-slate-100 pt-4 space-y-2">
                <div className="flex gap-2">
                  <select value={docType} onChange={e => setDocType(e.target.value)}
                    className="flex-1 h-9 rounded-lg border border-slate-200 text-sm px-2 text-slate-700 bg-white">
                    {Object.entries(DOC_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                  <select value={docVisibility} onChange={e => setDocVisibility(e.target.value)}
                    className="h-9 rounded-lg border border-slate-200 text-sm px-2 text-slate-700 bg-white">
                    <option value="both">Obaja</option>
                    <option value="seller_only">Len predávajúci</option>
                    <option value="buyer_only">Len kupujúci</option>
                  </select>
                </div>
                <label className={`flex items-center justify-center gap-2 w-full py-2 rounded-xl text-sm font-semibold cursor-pointer transition-colors ${uploading ? 'bg-slate-100 text-slate-400' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}>
                  <Upload className="w-4 h-4" />
                  {uploading ? 'Nahrávam...' : 'Nahrať dokument'}
                  <input type="file" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                </label>
              </div>
            )}
          </div>

          {/* Q&A Log */}
          <QALog deal={deal} user={user} userMap={userMap} onAddEntry={handleAddQAEntry} />

          {/* Audit log */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <button onClick={() => setShowAuditLog(p => !p)} className="w-full flex items-center justify-between text-left">
              <h2 className="font-bold text-slate-800 flex items-center gap-2"><Clock className="w-4 h-4" /> Audit Log</h2>
              {showAuditLog ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>
            {showAuditLog && (
              <div className="mt-4 space-y-2">
                {(deal.audit_log || []).filter(e => e.type !== 'qa').length === 0 ? (
                  <div className="text-sm text-slate-400 text-center py-4">Žiadne záznamy</div>
                ) : (
                  [...(deal.audit_log || [])].filter(e => e.type !== 'qa').reverse().map((entry, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium text-slate-700">{userMap[entry.user_id]?.full_name || 'Systém'}</span>
                        <span className="text-slate-500"> · {entry.action}</span>
                        <div className="text-xs text-slate-400">{formatDate(entry.timestamp)}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">

          {/* Phase actions */}
          {deal.status !== 'completed' && deal.status !== 'cancelled' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <h2 className="font-bold text-slate-800 mb-3 text-sm">Správa dealu</h2>

              {isSeller && (
                <div className="space-y-2">
                  {/* Phase 1→2: Start Due Diligence */}
                  {deal.status === 'active' && (
                    <Button size="sm" className="w-full bg-violet-600 hover:bg-violet-700 text-white"
                      onClick={() => handleStatusChange('due_diligence')}>
                      <CheckCircle2 className="w-4 h-4 mr-2" /> Spustiť Due Diligence
                    </Button>
                  )}

                  {/* Phase 2→3: DD complete → Reservation */}
                  {deal.status === 'due_diligence' && (
                    <div className="space-y-1">
                      <Button size="sm" className="w-full bg-amber-500 hover:bg-amber-600 text-white disabled:opacity-50"
                        disabled={!ddComplete}
                        onClick={() => { setReservationChecked(false); setShowReservationClickwrap(true); }}>
                        <CheckCircle2 className="w-4 h-4 mr-2" /> Podpísať rezerváciu
                      </Button>
                      {!ddComplete && (
                        <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
                          ⚠️ Dokončite DD checklist — nahrajte alebo označte všetky povinné dokumenty.
                        </p>
                      )}
                    </div>
                  )}

                  {/* Phase 3→4: Close deal */}
                  {deal.status === 'reservation_signed' && (
                    <div className="space-y-1">
                      <Button size="sm" className="w-full bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
                        disabled={!canClose}
                        onClick={() => handleStatusChange('completed')}>
                        <CheckCircle2 className="w-4 h-4 mr-2" /> Uzavrieť deal
                      </Button>
                      {!deal.reported_price && (
                        <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
                          ⚠️ Pred uzavretím zadajte predajnú cenu.
                        </p>
                      )}
                      {!buyerSignedReservation && (
                        <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
                          ⚠️ Kupujúci ešte nepodpísal rezervačnú dohodu.
                        </p>
                      )}
                    </div>
                  )}

                  <Button size="sm" variant="outline" className="w-full border-red-200 text-red-500 hover:bg-red-50"
                    onClick={() => handleStatusChange('cancelled')}>
                    Zrušiť deal
                  </Button>
                </div>
              )}

              {isBuyer && (
                <div className="space-y-2">
                  <div className="text-xs text-slate-500 bg-slate-50 rounded-xl p-3">
                    Správu dealu vykonáva predávajúci. Vy budete informovaný o každej zmene.
                  </div>
                  {/* Phase 2: Buyer confirms DD complete */}
                  {deal.status === 'due_diligence' && (
                    <div className="space-y-2">
                      <label className="flex items-start gap-2 cursor-pointer">
                        <input type="checkbox" checked={buyerDDConfirmed} onChange={e => setBuyerDDConfirmed(e.target.checked)}
                          className="mt-0.5 w-4 h-4 accent-indigo-600" />
                        <span className="text-xs text-slate-600">Prešiel/a som Due Diligence dokumenty a mám záujem pokračovať.</span>
                      </label>
                      {buyerDDConfirmed && (
                        <div className="text-xs text-green-600 bg-green-50 rounded-lg px-3 py-2 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> DD potvrdené — čaká na predávajúceho
                        </div>
                      )}
                    </div>
                  )}
                  {/* Phase 3: Buyer signs reservation */}
                  {deal.status === 'reservation_signed' && !buyerSignedReservation && (
                    <div className="space-y-1">
                      <Button size="sm" className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                        onClick={() => { setBuyerReservationChecked(false); setShowBuyerClickwrap(true); }}>
                        <CheckCircle2 className="w-4 h-4 mr-2" /> Podpísať rezerváciu (kupujúci)
                      </Button>
                      <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
                        ⚠️ Pred uzavretím dealu musíte tiež podpísať rezervačnú dohodu.
                      </p>
                    </div>
                  )}
                  {deal.status === 'reservation_signed' && buyerSignedReservation && (
                    <div className="text-xs text-green-600 bg-green-50 rounded-lg px-3 py-2 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Rezervácia podpísaná — {new Date(deal.buyer_reservation_signed_at).toLocaleDateString('sk-SK')}
                    </div>
                  )}
                  {/* Cancellation request — rendered below */}
                </div>
              )}

              {/* Admin phase unlock */}
              {isAdmin && deal.status !== 'completed' && deal.status !== 'cancelled' && (
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <button className="text-xs text-slate-400 hover:text-indigo-600 underline"
                    onClick={() => setShowAdminUnlock(v => !v)}>
                    Admin: manuálne odomknúť fázu
                  </button>
                  {showAdminUnlock && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {['active', 'due_diligence', 'reservation_signed', 'completed'].map(s => (
                        <button key={s}
                          className={`text-xs px-2 py-1 rounded-lg border transition-colors ${deal.status === s ? 'bg-indigo-100 text-indigo-700 border-indigo-300' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}
                          onClick={async () => {
                            const log = { user_id: user.id, action: `Admin manuálne nastavil fázu: ${s}`, timestamp: new Date().toISOString() };
                            await updateMutation.mutateAsync({ status: s, audit_log: [...(deal.audit_log || []), log] });
                            setShowAdminUnlock(false);
                            toast({ title: `Fáza nastavená: ${s}` });
                          }}>
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Cancellation request block (buyer) */}
              <div className="mt-2">
                <CancellationBlock
                  deal={deal}
                  user={user}
                  listing={listing}
                  isSeller={isSeller}
                  isBuyer={isBuyer}
                  participantUsers={participantUsers}
                />
              </div>
            </div>
          )}

          {/* Red flag + contract upload */}
          {deal.red_flag && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <span className="font-bold text-red-700 text-sm">Red Flag — Nahrajte sken zmluvy</span>
              </div>
              <p className="text-xs text-red-600">Nahlásená cena je o viac ako 20% nižšia od listingovej ceny.</p>
              {deal.contract_url ? (
                <div className="bg-white border border-red-200 rounded-xl p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-xs font-semibold text-green-700">Sken nahraný</span>
                    </div>
                    <a href={deal.contract_url} target="_blank" rel="noreferrer"
                      className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium">
                      <Eye className="w-3.5 h-3.5" /> Zobraziť
                    </a>
                  </div>
                  {isAdmin && (
                    <div className="border-t border-slate-100 pt-2 space-y-2">
                      <p className="text-xs font-semibold text-slate-600">Admin: Manuálne overenie</p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1 text-xs border-green-300 text-green-700 hover:bg-green-50"
                          onClick={async () => {
                            const p = deal.reported_price || deal.buyer_confirmed_price;
                            const fee = p ? Math.round(p * 0.01) : deal.fee_calculated;
                            const log = { user_id: user.id, action: `Admin overil zmluvu — fee: €${fee?.toLocaleString('sk-SK')}`, timestamp: new Date().toISOString() };
                            await updateMutation.mutateAsync({ red_flag: false, fee_calculated: fee, audit_log: [...(deal.audit_log || []), log] });
                            toast({ title: 'Zmluva overená' });
                          }} disabled={updateMutation.isPending}>✓ Potvrdiť</Button>
                        <Button size="sm" variant="outline" className="flex-1 text-xs border-red-300 text-red-600 hover:bg-red-50"
                          onClick={async () => {
                            const log = { user_id: user.id, action: 'Admin zamietol zmluvu', timestamp: new Date().toISOString() };
                            await updateMutation.mutateAsync({ audit_log: [...(deal.audit_log || []), log] });
                            toast({ title: 'Zamietnuté', variant: 'destructive' });
                          }} disabled={updateMutation.isPending}>✗ Zamietnuť</Button>
                      </div>
                    </div>
                  )}
                  {!isAdmin && <p className="text-xs text-slate-400">Čaká na overenie administrátorom.</p>}
                </div>
              ) : (
                <label className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold cursor-pointer border-2 border-dashed transition-colors ${uploadingContract ? 'border-slate-200 text-slate-400' : 'border-red-300 text-red-600 hover:bg-red-100'}`}>
                  <Upload className="w-4 h-4" />
                  {uploadingContract ? 'Nahrávam...' : 'Nahrať sken zmluvy'}
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" disabled={uploadingContract}
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      setUploadingContract(true);
                      const { file_url } = await base44.integrations.Core.UploadFile({ file });
                      const log = { user_id: user.id, action: `Nahral sken zmluvy: ${file.name}`, timestamp: new Date().toISOString() };
                      await updateMutation.mutateAsync({ contract_url: file_url, audit_log: [...(deal.audit_log || []), log] });
                      setUploadingContract(false);
                      toast({ title: 'Sken nahraný' });
                    }} />
                </label>
              )}
            </div>
          )}

          {/* Cancellation fee info */}
          {deal.status === 'cancelled' && deal.cancellation_fee_paid && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm">
              <div className="font-bold text-amber-800 mb-1">Cancellation Fee zaplatené</div>
              <div className="text-amber-700">€500 · Kupujúci kredit €300 · Platforma €200</div>
            </div>
          )}

          {/* Report/confirm price */}
          {(deal.status === 'reservation_signed' || deal.status === 'completed') && (isSeller || isBuyer) && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <h2 className="font-bold text-slate-800 mb-1 text-sm">
                {isSeller ? 'Nahlásiť predajnú cenu' : 'Potvrdiť predajnú cenu'}
              </h2>
              {!isSeller && deal.reported_price && !deal.buyer_confirmed_price && (
                <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2 mb-3">
                  Predávajúci nahlásil: <strong>€{deal.reported_price.toLocaleString('sk-SK')}</strong>
                </p>
              )}
              {isSeller && deal.reported_price ? (
                <p className="text-xs text-green-600 bg-green-50 rounded-lg px-3 py-2">✓ Cena: <strong>€{deal.reported_price.toLocaleString('sk-SK')}</strong></p>
              ) : isBuyer && deal.buyer_confirmed_price ? (
                <p className="text-xs text-green-600 bg-green-50 rounded-lg px-3 py-2">✓ Potvrdená: <strong>€{deal.buyer_confirmed_price.toLocaleString('sk-SK')}</strong></p>
              ) : (
                <>
                  {listing?.price > 0 && (
                    <p className="text-xs text-slate-400 mb-3">Listing: €{listing.price.toLocaleString('sk-SK')} · Red flag pri poklese &gt;20%</p>
                  )}
                  <div className="flex gap-2">
                    <input type="number"
                      placeholder={!isSeller && deal.reported_price ? `${deal.reported_price}` : 'Cena v EUR'}
                      value={reportedPriceInput || (!isSeller && deal.reported_price && !deal.buyer_confirmed_price ? deal.reported_price : '')}
                      onChange={e => setReportedPriceInput(e.target.value)}
                      className="flex-1 h-9 rounded-lg border border-slate-200 text-sm px-3"
                    />
                    <Button size="sm" onClick={handleReportPrice} disabled={!reportedPriceInput && !(!isSeller && deal.reported_price)}>OK</Button>
                  </div>
                </>
              )}
              {deal.fee_calculated && (
                <div className={`mt-3 p-3 rounded-xl ${deal.red_flag ? 'bg-red-50' : 'bg-indigo-50'}`}>
                  <div className={`text-xs font-semibold ${deal.red_flag ? 'text-red-600' : 'text-indigo-600'}`}>Success Fee (1%){deal.red_flag ? ' · ⚠️ Red Flag' : ''}</div>
                  <div className={`text-lg font-black ${deal.red_flag ? 'text-red-700' : 'text-indigo-700'}`}>€{deal.fee_calculated?.toLocaleString('sk-SK')}</div>
                  <div className={`text-xs mt-0.5 ${deal.red_flag ? 'text-red-500' : 'text-indigo-500'}`}>
                    {deal.fee_paid ? '✓ Zaplatené' : '⏳ Stripe platba — čoskoro'}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Prices summary */}
          {(deal.reported_price || deal.buyer_confirmed_price) && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <h2 className="font-bold text-slate-800 mb-3 text-sm">Ceny</h2>
              {deal.reported_price && (
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-500">Predávajúci</span>
                  <span className="font-bold text-slate-700">€{deal.reported_price.toLocaleString('sk-SK')}</span>
                </div>
              )}
              {deal.buyer_confirmed_price && (
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-500">Kupujúci</span>
                  <span className="font-bold text-slate-700">€{deal.buyer_confirmed_price.toLocaleString('sk-SK')}</span>
                </div>
              )}
              {deal.reported_price && deal.buyer_confirmed_price && deal.reported_price !== deal.buyer_confirmed_price && (
                <div className="mt-2 p-2 bg-red-50 rounded-lg flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  <span className="text-xs text-red-600 font-medium">Ceny sa nezhodujú</span>
                </div>
              )}
            </div>
          )}

          {/* Listing link */}
          {listing && (
            <Link to={`/ListingDetail?id=${listing.id}`}
              className="block bg-slate-50 border border-slate-200 rounded-2xl p-4 hover:bg-slate-100 transition-colors">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-slate-400" />
                <div>
                  <div className="text-xs text-slate-400">Listing</div>
                  <div className="text-sm font-semibold text-slate-700 leading-tight">{listing.title}</div>
                </div>
              </div>
            </Link>
          )}
        </div>
      </div>

      {/* Reservation Clickwrap */}
      <Dialog open={showReservationClickwrap} onOpenChange={setShowReservationClickwrap}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-amber-700">
              <CheckCircle2 className="w-5 h-5" /> Podpis rezervačnej zmluvy
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 max-h-40 overflow-y-auto">
              <p className="font-semibold mb-2">Rezervačná dohoda</p>
              <p>Týmto potvrdzujem súhlas s podmienkami rezervácie nehnuteľnosti. Zrušenie po podpise podlieha Cancellation Fee €500 (€300 kredit kupujúcemu / €200 platforma stavai.sk).</p>
              <p className="mt-2">Zaväzujem sa pokračovať v obchodnom procese v dobrej viere v súlade s podmienkami platformy stavai.sk.</p>
            </div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={reservationChecked} onChange={e => setReservationChecked(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-slate-300 accent-amber-500" />
              <span className="text-sm text-slate-700">Súhlasím s podmienkami rezervačnej dohody a beriem na vedomie Cancellation Fee €500.</span>
            </label>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowReservationClickwrap(false)}>Zrušiť</Button>
              <Button className="flex-1 bg-amber-500 hover:bg-amber-600 text-white"
                disabled={!reservationChecked || updateMutation.isPending}
                onClick={async () => { await handleStatusChange('reservation_signed'); setShowReservationClickwrap(false); }}>
                Podpísať rezerváciu
              </Button>
            </div>
            <p className="text-xs text-slate-400 text-center">Timestamp: {new Date().toLocaleString('sk-SK')}</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Cancellation Fee Dialog (Seller) — Stripe placeholder */}
      <Dialog open={showCancelConfirm} onOpenChange={setShowCancelConfirm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <XCircle className="w-5 h-5" /> Zrušenie rezervácie — Cancellation Fee
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-red-50 rounded-xl p-4 text-sm text-red-700">
              Rezervačná zmluva bola podpísaná. Zrušenie vyžaduje <strong>Cancellation Fee €500</strong>.
            </div>
            <div className="bg-slate-50 rounded-xl p-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-slate-600">Kredit kupujúcemu</span><span className="font-bold text-blue-600">€300</span></div>
              <div className="flex justify-between"><span className="text-slate-600">Platforma stavai.sk</span><span className="font-bold text-slate-700">€200</span></div>
              <div className="border-t border-slate-200 pt-2 flex justify-between font-bold"><span>Celkom</span><span>€500</span></div>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700">
              💳 Stripe platba bude aktivovaná čoskoro. Momentálne nie je možné pokračovať.
            </div>
            <Button variant="outline" className="w-full" onClick={() => setShowCancelConfirm(false)}>Zavrieť</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}