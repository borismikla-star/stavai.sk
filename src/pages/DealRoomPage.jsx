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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import PortalNav from '@/components/portal/PortalNav';

const STATUS_LABELS = { active: 'Aktívny', reservation_signed: 'Rezervácia podpísaná', completed: 'Uzavretý', cancelled: 'Zrušený' };
const STATUS_COLORS = { active: 'bg-blue-100 text-blue-700', reservation_signed: 'bg-amber-100 text-amber-700', completed: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700' };
const DOC_TYPE_LABELS = { nda: 'NDA', reservation: 'Rezervačná zmluva', due_diligence: 'Due Diligence', spa_draft: 'Návrh kúpnej zmluvy', other: 'Iné' };

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
  const [reportedPriceInput, setReportedPriceInput] = useState('');
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [uploadingContract, setUploadingContract] = useState(false);
  const [docVisibility, setDocVisibility] = useState('both');
  const [showReservationClickwrap, setShowReservationClickwrap] = useState(false);
  const [reservationChecked, setReservationChecked] = useState(false);

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

  // #11 — fetch only relevant participants, not all users
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

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    const newDoc = {
      name: file.name,
      url: file_url,
      type: docType,
      uploaded_by: user.id,
      uploaded_at: new Date().toISOString(),
      visible_to: 'both'
    };
    const newLog = {
      user_id: user.id,
      action: `Nahrál dokument: ${file.name}`,
      document_name: file.name,
      timestamp: new Date().toISOString()
    };
    await updateMutation.mutateAsync({
      documents: [...(deal.documents || []), newDoc],
      audit_log: [...(deal.audit_log || []), newLog]
    });
    setUploading(false);
    toast({ title: 'Dokument nahraný' });
  };

  const handleStatusChange = async (newStatus) => {
    // Cancellation fee required if reservation already signed
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
    // Auto-update listing status when deal is closed
    if (newStatus === 'completed' && deal.listing_id) {
      await base44.entities.Listing.update(deal.listing_id, { status: 'sold' });
      // #9 — notify buyer when seller closes deal
      const buyerUser = participantUsers.find(u => u.id === deal.buyer_id);
      if (buyerUser?.email) {
        base44.integrations.Core.SendEmail({
          to: buyerUser.email,
          subject: `Predávajúci uzavrel deal — potvrďte predajnú cenu`,
          body: `Dobrý deň,\n\npredávajúci nahlásil uzavretie dealu pre listing: ${listing?.title || ''}.\n\nProsím prihláste sa do Deal Roomu a potvrďte predajnú cenu.\n\nhttps://stavai.sk/DealRoomPage?id=${dealId}\n\nTím stavai.sk`
        }).catch(() => {});
      }
    }
    toast({ title: `Status zmenený na: ${STATUS_LABELS[newStatus]}` });
  };

  // #3 — buyer can only request cancellation, not directly cancel
  const handleBuyerCancelRequest = async () => {
    const logEntry = {
      user_id: user.id,
      action: 'Kupujúci požiadal o zrušenie dealu — čaká na schválenie predávajúceho',
      timestamp: new Date().toISOString()
    };
    await updateMutation.mutateAsync({
      audit_log: [...(deal.audit_log || []), logEntry]
    });
    // Notify seller
    const sellerUser = participantUsers.find(u => u.id === deal.seller_id);
    if (sellerUser?.email) {
      base44.integrations.Core.SendEmail({
        to: sellerUser.email,
        subject: `Kupujúci požiadal o zrušenie dealu`,
        body: `Dobrý deň,\n\nkupujúci požiadal o zrušenie dealu pre listing: ${listing?.title || ''}.\n\nProsím prihláste sa do Deal Roomu a potvrďte alebo zamietnte žiadosť.\n\nhttps://stavai.sk/DealRoomPage?id=${dealId}\n\nTím stavai.sk`
      }).catch(() => {});
    }
    toast({ title: 'Žiadosť o zrušenie odoslaná', description: 'Predávajúci bol upozornený. Čaká na jeho schválenie.' });
  };

  const handleCancellationFeePaid = async () => {
    const logEntry = {
      user_id: user.id,
      action: 'Zaplatil Cancellation Fee €500 (€300 kredit kupujúcemu / €200 platforma)',
      timestamp: new Date().toISOString()
    };
    await updateMutation.mutateAsync({
      status: 'cancelled',
      cancellation_fee_paid: true,
      cancellation_paid_at: new Date().toISOString(),
      buyer_credit_issued: 300,
      audit_log: [...(deal.audit_log || []), logEntry]
    });
    setShowCancelConfirm(false);
    toast({ title: 'Deal zrušený', description: 'Cancellation Fee €500 zaplatené. Kupujúci dostane kredit €300.' });
  };

  const handleReportPrice = async () => {
    const isSeller = deal.seller_id === user.id;
    // #7 — buyer can confirm seller's price without re-entering it
    const price = parseFloat(reportedPriceInput) || (!isSeller && deal.reported_price ? deal.reported_price : 0);
    if (!price) return;

    // Red flag: reported price >20% below listing price (only applies to seller)
    const listingPrice = listing?.price || 0;
    const priceDrop = isSeller && listingPrice > 0 ? (listingPrice - price) / listingPrice : 0;
    const isRedFlag = priceDrop > 0.20;

    // Fee table: base 1%, red flag requires contract scan upload
    const fee = Math.round(price * 0.01);

    const logEntry = {
      user_id: user.id,
      action: `Nahlásil predajnú cenu: €${price.toLocaleString('sk-SK')}${isRedFlag ? ' ⚠️ Red Flag (pokles >20% od listingovej ceny)' : ''}`,
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
      // Notify admin via email
      base44.integrations.Core.SendEmail({
        to: 'info@stavai.sk',
        subject: `⚠️ Red Flag aktivovaný — Deal Room ${dealId}`,
        body: `Deal Room ID: ${dealId}\nListing: ${listing?.title || ''}\nNahlásená cena: €${price.toLocaleString('sk-SK')}\nListing cena: €${listingPrice.toLocaleString('sk-SK')}\nPokles: ${Math.round(priceDrop * 100)}%\n\nProsím overte zmluvu v administrácii.`
      }).catch(() => {}); // fire and forget
      toast({
        title: '⚠️ Red Flag aktivovaný',
        description: `Cena je o ${Math.round(priceDrop * 100)}% nižšia ako listing cena. Nahrajte sken zmluvy. Admin bol upozornený.`,
        variant: 'destructive'
      });
    } else {
      toast({ title: 'Cena zaznamenaná', description: `Success fee (1%): €${fee.toLocaleString('sk-SK')}` });
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-6">
        <PortalNav />
        <div className="space-y-3 mt-6">
          {[...Array(3)].map((_, i) => <div key={i} className="bg-slate-100 rounded-2xl h-20 animate-pulse" />)}
        </div>
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-6">
        <PortalNav />
        <div className="text-center py-20">
          <div className="text-5xl mb-3">🚪</div>
          <div className="font-bold text-slate-700">Deal Room nenájdený</div>
        </div>
      </div>
    );
  }

  const isSeller = deal.seller_id === user?.id;
  const isBuyer = deal.buyer_id === user?.id;
  const isAgent = deal.agent_id === user?.id;
  const isParticipant = isSeller || isBuyer || isAgent || user?.role === 'admin';

  if (!isParticipant) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-6">
        <PortalNav />
        <div className="text-center py-20">
          <Shield className="w-12 h-12 mx-auto mb-4 text-slate-300" />
          <div className="font-bold text-slate-700">Nemáte prístup k tomuto Deal Roomu</div>
        </div>
      </div>
    );
  }

  const visibleDocs = (deal.documents || []).filter(doc => {
    if (doc.visible_to === 'both') return true;
    if (doc.visible_to === 'seller_only' && isSeller) return true;
    if (doc.visible_to === 'buyer_only' && isBuyer) return true;
    return user?.role === 'admin';
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <PortalNav />

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
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
        <Badge className={`text-sm px-3 py-1 ${STATUS_COLORS[deal.status]}`}>
          {STATUS_LABELS[deal.status]}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left — main content */}
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
                        </div>
                      </div>
                    </div>
                    <a href={doc.url} target="_blank" rel="noreferrer"
                      className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
                      <Download className="w-4 h-4 text-slate-500" />
                    </a>
                  </div>
                ))}
              </div>
            )}

            {/* Upload */}
            {deal.status !== 'completed' && deal.status !== 'cancelled' && (
              <div className="border-t border-slate-100 pt-4">
                <div className="flex gap-2 items-center mb-2">
                  <select
                    value={docType}
                    onChange={e => setDocType(e.target.value)}
                    className="flex-1 h-9 rounded-lg border border-slate-200 text-sm px-2 text-slate-700 bg-white"
                  >
                    {Object.entries(DOC_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                  <label className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer transition-colors ${uploading ? 'bg-slate-100 text-slate-400' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}>
                    <Upload className="w-4 h-4" />
                    {uploading ? 'Nahrávam...' : 'Nahrať dokument'}
                    <input type="file" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Audit log */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <button
              onClick={() => setShowAuditLog(p => !p)}
              className="w-full flex items-center justify-between text-left"
            >
              <h2 className="font-bold text-slate-800 flex items-center gap-2"><Clock className="w-4 h-4" /> Audit Log</h2>
              {showAuditLog ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>
            {showAuditLog && (
              <div className="mt-4 space-y-2">
                {(deal.audit_log || []).length === 0 ? (
                  <div className="text-sm text-slate-400 text-center py-4">Žiadne záznamy</div>
                ) : (
                  [...(deal.audit_log || [])].reverse().map((entry, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium text-slate-700">{userMap[entry.user_id]?.full_name || 'Používateľ'}</span>
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

          {/* Status actions — seller only for main actions */}
          {deal.status !== 'completed' && deal.status !== 'cancelled' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <h2 className="font-bold text-slate-800 mb-3 text-sm">Správa dealu</h2>
              {isSeller ? (
                <div className="space-y-2">
                  {deal.status === 'active' && (
                    <Button size="sm" className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                      onClick={() => handleStatusChange('reservation_signed')}>
                      <CheckCircle2 className="w-4 h-4 mr-2" /> Potvrdiť podpis rezervácie
                    </Button>
                  )}
                  {(deal.status === 'active' || deal.status === 'reservation_signed') && (
                    <div className="space-y-1">
                      <Button size="sm" className="w-full bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => handleStatusChange('completed')}
                        disabled={!deal.reported_price}>
                        <CheckCircle2 className="w-4 h-4 mr-2" /> Uzavrieť deal
                      </Button>
                      {!deal.reported_price && (
                        <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
                          ⚠️ Pred uzavretím zadajte predajnú cenu — potrebná pre výpočet fee.
                        </p>
                      )}
                    </div>
                  )}
                  <Button size="sm" variant="outline" className="w-full border-red-200 text-red-500 hover:bg-red-50"
                    onClick={() => handleStatusChange('cancelled')}>
                    Zrušiť deal
                  </Button>
                </div>
              ) : isBuyer ? (
                <div className="space-y-2">
                  <div className="text-xs text-slate-500 bg-slate-50 rounded-xl p-3">
                    Správu dealu vykonáva predávajúci. Vy budete informovaný o každej zmene.
                  </div>
                  {/* #3 — buyer only requests cancellation, doesn't cancel directly */}
                  <Button size="sm" variant="outline" className="w-full border-red-200 text-red-500 hover:bg-red-50"
                    onClick={handleBuyerCancelRequest}>
                    Požiadať o zrušenie
                  </Button>
                </div>
              ) : null}
            </div>
          )}

          {/* Red flag warning + contract upload */}
          {deal.red_flag && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <span className="font-bold text-red-700 text-sm">Red Flag — Nahrajte sken zmluvy</span>
              </div>
              <p className="text-xs text-red-600">Nahlásená cena je o viac ako 20% nižšia od listingovej ceny. Prosím nahrajte sken podpísanej kúpnej zmluvy na manuálne overenie.</p>

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
                  {user?.role === 'admin' && (
                    <div className="border-t border-slate-100 pt-2 space-y-2">
                      <p className="text-xs font-semibold text-slate-600">Admin: Manuálne overenie</p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1 text-xs border-green-300 text-green-700 hover:bg-green-50"
                          onClick={async () => {
                            const recalcPrice = deal.reported_price || deal.buyer_confirmed_price;
                            const verifiedFee = recalcPrice ? Math.round(recalcPrice * 0.01) : deal.fee_calculated;
                            const log = { user_id: user.id, action: `Admin overil zmluvu — fee potvrdený: €${verifiedFee?.toLocaleString('sk-SK')}`, timestamp: new Date().toISOString() };
                            await updateMutation.mutateAsync({ red_flag: false, fee_calculated: verifiedFee, audit_log: [...(deal.audit_log || []), log] });
                            toast({ title: 'Zmluva overená', description: `Red Flag zrušený. Fee: €${verifiedFee?.toLocaleString('sk-SK')}` });
                          }}
                          disabled={updateMutation.isPending}>
                          ✓ Potvrdiť
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 text-xs border-red-300 text-red-600 hover:bg-red-50"
                          onClick={async () => {
                            const log = { user_id: user.id, action: 'Admin zamietol zmluvu — Red Flag ostáva aktívny', timestamp: new Date().toISOString() };
                            await updateMutation.mutateAsync({ audit_log: [...(deal.audit_log || []), log] });
                            toast({ title: 'Zmluva zamietnutá', description: 'Red Flag ostáva aktívny.', variant: 'destructive' });
                          }}
                          disabled={updateMutation.isPending}>
                          ✗ Zamietnuť
                        </Button>
                      </div>
                    </div>
                  )}
                  {user?.role !== 'admin' && (
                    <p className="text-xs text-slate-400">Čaká na manuálne overenie administrátorom.</p>
                  )}
                </div>
              ) : (
                <label className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold cursor-pointer border-2 border-dashed transition-colors ${uploadingContract ? 'border-slate-200 text-slate-400' : 'border-red-300 text-red-600 hover:bg-red-100'}`}>
                  <Upload className="w-4 h-4" />
                  {uploadingContract ? 'Nahrávam...' : 'Nahrať sken kúpnej zmluvy'}
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" disabled={uploadingContract}
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      setUploadingContract(true);
                      const { file_url } = await base44.integrations.Core.UploadFile({ file });
                      const log = { user_id: user.id, action: `Nahral sken kúpnej zmluvy: ${file.name}`, timestamp: new Date().toISOString() };
                      await updateMutation.mutateAsync({ contract_url: file_url, audit_log: [...(deal.audit_log || []), log] });
                      setUploadingContract(false);
                      toast({ title: 'Sken nahraný', description: 'Zmluva čaká na manuálne overenie.' });
                    }}
                  />
                </label>
              )}
            </div>
          )}

          {/* Cancellation fee info */}
          {deal.status === 'cancelled' && deal.cancellation_fee_paid && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm">
              <div className="font-bold text-amber-800 mb-1">Cancellation Fee zaplatené</div>
              <div className="text-amber-700">€500 · Kupujúci dostal kredit €300 · Platforma €200</div>
            </div>
          )}

          {/* Report price — seller reports, buyer confirms */}
          {(deal.status === 'reservation_signed' || deal.status === 'completed') && (isSeller || isBuyer) && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <h2 className="font-bold text-slate-800 mb-1 text-sm">
                {isSeller ? 'Nahlásiť predajnú cenu' : 'Potvrdiť predajnú cenu'}
              </h2>
              {/* #7 — buyer sees seller price prefilled */}
              {!isSeller && deal.reported_price && !deal.buyer_confirmed_price && (
                <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2 mb-3">
                  Predávajúci nahlásil: <strong>€{deal.reported_price.toLocaleString('sk-SK')}</strong> — potvrďte alebo opravte.
                </p>
              )}
              {isSeller && deal.reported_price ? (
                <p className="text-xs text-green-600 bg-green-50 rounded-lg px-3 py-2">
                  ✓ Cena nahlásená: <strong>€{deal.reported_price.toLocaleString('sk-SK')}</strong>
                </p>
              ) : isBuyer && deal.buyer_confirmed_price ? (
                <p className="text-xs text-green-600 bg-green-50 rounded-lg px-3 py-2">
                  ✓ Cena potvrdená: <strong>€{deal.buyer_confirmed_price.toLocaleString('sk-SK')}</strong>
                </p>
              ) : (
                <>
                  {listing?.price > 0 && (
                    <p className="text-xs text-slate-400 mb-3">Listing cena: €{listing.price.toLocaleString('sk-SK')} · Red flag pri poklese &gt;20%</p>
                  )}
                  <div className="flex gap-2">
                    <input
                      type="number"
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
                    {deal.fee_paid ? '✓ Zaplatené' : 'Čaká na platbu'}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Price info */}
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
                  <span className="text-xs text-red-600 font-medium">Ceny sa nezhodujú — Red Flag</span>
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

      {/* Cancellation Fee Dialog */}
      <Dialog open={showCancelConfirm} onOpenChange={setShowCancelConfirm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <XCircle className="w-5 h-5" /> Zrušenie rezervácie — Cancellation Fee
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-red-50 rounded-xl p-4 text-sm text-red-700">
              Rezervačná zmluva už bola podpísaná. Zrušenie vyžaduje zaplatenie <strong>Cancellation Fee €500</strong>.
            </div>
            <div className="bg-slate-50 rounded-xl p-4 space-y-2 text-sm">
              <div className="font-semibold text-slate-700 mb-2">Rozdelenie poplatku:</div>
              <div className="flex justify-between">
                <span className="text-slate-600">Kredit kupujúcemu</span>
                <span className="font-bold text-blue-600">€300</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Platforma stavai.sk</span>
                <span className="font-bold text-slate-700">€200</span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between font-bold">
                <span>Celkom</span>
                <span>€500</span>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowCancelConfirm(false)}>Späť</Button>
              <Button
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                onClick={handleCancellationFeePaid}
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? 'Spracovávam...' : 'Potvrdiť zrušenie (€500)'}
              </Button>
            </div>
            <p className="text-xs text-slate-400 text-center">Platba bude spracovaná cez Stripe platobný link.</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}