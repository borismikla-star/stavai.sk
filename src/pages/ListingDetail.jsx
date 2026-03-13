import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, MapPin, Maximize2, ChevronLeft, ExternalLink, Calculator, BarChart2, Send, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const TYPE_LABELS = { residential: 'Rezidenčné', commercial: 'Komerčné', land: 'Pozemok', development: 'Development' };
const LISTING_LABELS = { sale: 'Predaj', lease: 'Nájom', investment: 'Investícia' };
const REGION_LABELS = { BA:'Bratislava', TT:'Trnava', TN:'Trenčín', NR:'Nitra', ZA:'Žilina', BB:'Banská Bystrica', PO:'Prešov', KE:'Košice' };
const fmt = (n) => Math.round(n || 0).toLocaleString('sk-SK');

export default function ListingDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeImg, setActiveImg] = useState(0);
  const [inquiry, setInquiry] = useState({ message: '', email: '', phone: '' });
  const [inquirySent, setInquirySent] = useState(false);

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
    retry: false
  });

  const { data: listing, isLoading } = useQuery({
    queryKey: ['listing', id],
    queryFn: () => base44.entities.Listing.get(id),
    enabled: !!id
  });

  const { data: savedListings = [] } = useQuery({
    queryKey: ['savedListings', user?.id],
    queryFn: () => base44.entities.SavedListing.filter({ user_id: user.id }),
    enabled: !!user
  });

  const isSaved = savedListings.some(s => s.listing_id === id);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const existing = savedListings.find(s => s.listing_id === id);
      if (existing) await base44.entities.SavedListing.delete(existing.id);
      else await base44.entities.SavedListing.create({ listing_id: id, user_id: user.id });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['savedListings'] })
  });

  const inquiryMutation = useMutation({
    mutationFn: () => base44.entities.ListingInquiry.create({
      listing_id: id,
      sender_id: user.id,
      recipient_id: listing.created_by,
      message: inquiry.message,
      sender_contact_email: inquiry.email || user.email,
      sender_contact_phone: inquiry.phone,
      is_off_market: listing.visibility === 'off_market'
    }),
    onSuccess: () => {
      setInquirySent(true);
      base44.entities.Listing.update(id, { inquiry_count: (listing.inquiry_count || 0) + 1 });
    }
  });

  // Increment view count
  useEffect(() => {
    if (listing) {
      base44.entities.Listing.update(id, { view_count: (listing.view_count || 0) + 1 });
    }
  }, [listing?.id]);

  if (isLoading) return <div className="max-w-5xl mx-auto px-4 py-12 text-center text-slate-400">Načítavam...</div>;
  if (!listing) return <div className="max-w-5xl mx-auto px-4 py-12 text-center text-slate-400">Listing neexistuje.</div>;

  const pricePerM2 = listing.price > 0 && listing.area_total > 0 ? Math.round(listing.price / listing.area_total) : null;
  const images = listing.images?.length ? listing.images : [];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-400 mb-5">
        <Link to="/PortalHome" className="hover:text-indigo-600 flex items-center gap-1"><ChevronLeft className="w-3.5 h-3.5" /> Portál</Link>
        <span>/</span>
        <span className="text-slate-600">{listing.title}</span>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left */}
        <div className="lg:col-span-2 space-y-6">
          {/* Gallery */}
          <div className="bg-slate-100 rounded-2xl overflow-hidden">
            {images.length > 0 ? (
              <>
                <div className="aspect-[16/9] overflow-hidden">
                  <img src={images[activeImg]} alt={listing.title} className="w-full h-full object-cover" />
                </div>
                {images.length > 1 && (
                  <div className="flex gap-2 p-3 overflow-x-auto">
                    {images.map((img, i) => (
                      <button key={i} onClick={() => setActiveImg(i)}
                        className={`w-16 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${i === activeImg ? 'border-indigo-500' : 'border-transparent'}`}>
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="aspect-[16/9] flex items-center justify-center text-7xl">🏠</div>
            )}
          </div>

          {/* Title + badges */}
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge className="bg-blue-100 text-blue-700">{TYPE_LABELS[listing.property_type]}</Badge>
              <Badge className="bg-slate-100 text-slate-600">{LISTING_LABELS[listing.listing_type]}</Badge>
              {listing.visibility === 'off_market' && <Badge className="bg-violet-600 text-white">Off-Market</Badge>}
              {listing.is_featured && <Badge className="bg-yellow-500 text-white">⭐ Featured</Badge>}
              <Badge variant="outline" className="capitalize">{listing.status === 'active' ? 'Aktívny' : listing.status}</Badge>
            </div>
            <h1 className="text-2xl font-black text-slate-900 mb-2">{listing.title}</h1>
            <div className="flex items-center gap-2 text-slate-500 text-sm mb-4">
              <MapPin className="w-4 h-4" />
              {listing.visibility === 'off_market' ? `${listing.location_city}, ${REGION_LABELS[listing.location_region]} (adresa skrytá)` : `${listing.location_address || listing.location_city}, ${REGION_LABELS[listing.location_region]}`}
            </div>
            {/* Price */}
            <div className="flex items-end gap-3">
              <div className="text-3xl font-black text-slate-900">{listing.price > 0 ? `€ ${fmt(listing.price)}` : 'Na dopyt'}</div>
              {pricePerM2 && <div className="text-slate-400 text-sm mb-1">€ {fmt(pricePerM2)}/m²</div>}
            </div>
          </div>

          {/* Key facts */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className="bg-slate-50 rounded-xl p-3 text-center">
              <div className="text-xs text-slate-400 mb-1">Plocha</div>
              <div className="font-bold text-slate-800">{fmt(listing.area_total)} m²</div>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 text-center">
              <div className="text-xs text-slate-400 mb-1">Kraj</div>
              <div className="font-bold text-slate-800">{REGION_LABELS[listing.location_region]}</div>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 text-center">
              <div className="text-xs text-slate-400 mb-1">Kontakt</div>
              <div className="font-bold text-slate-800 capitalize">{listing.contact_type}</div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="font-bold text-slate-800 mb-2">Popis</h2>
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">{listing.description}</p>
          </div>

          {/* Category data */}
          {listing.category_data && Object.keys(listing.category_data).length > 0 && (
            <div>
              <h2 className="font-bold text-slate-800 mb-3">Detaily nehnuteľnosti</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {Object.entries(listing.category_data).map(([k, v]) => (
                  <div key={k} className="bg-slate-50 rounded-xl p-3">
                    <div className="text-xs text-slate-400 capitalize">{k.replace(/_/g, ' ')}</div>
                    <div className="font-semibold text-slate-700 text-sm">{String(v)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Analytika prepojenie */}
          {(listing.property_type === 'land' || listing.property_type === 'development') && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 flex items-center justify-between gap-4">
              <div>
                <div className="font-bold text-indigo-800 text-sm mb-0.5">Analytické nástroje</div>
                <div className="text-xs text-indigo-600">Analyzujte tento pozemok priamo v kalkulačkách stavai.sk</div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Link to="/LandFeasibility">
                  <Button size="sm" variant="outline" className="text-indigo-600 border-indigo-300 gap-1.5">
                    <BarChart2 className="w-3.5 h-3.5" /> Land Feasibility
                  </Button>
                </Link>
                <Link to="/DeveloperCalc">
                  <Button size="sm" variant="outline" className="text-indigo-600 border-indigo-300 gap-1.5">
                    <Calculator className="w-3.5 h-3.5" /> Dev. Kalkulačka
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          {/* Actions */}
          <Card>
            <CardContent className="p-4 space-y-3">
              {user && (
                <Button
                  onClick={() => saveMutation.mutate()}
                  variant="outline"
                  className={`w-full gap-2 ${isSaved ? 'text-red-500 border-red-200' : ''}`}
                >
                  <Heart className={`w-4 h-4 ${isSaved ? 'fill-red-500' : ''}`} />
                  {isSaved ? 'Uložené' : 'Uložiť do obľúbených'}
                </Button>
              )}
              {listing.documents?.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Dokumenty</div>
                  {listing.documents.map((doc, i) => (
                    <a key={i} href={doc} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-indigo-600 hover:underline">
                      <ExternalLink className="w-3.5 h-3.5" /> Dokument {i + 1}
                    </a>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Inquiry form */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Kontaktovať inzerenta</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              {!user ? (
                <div className="text-center py-4">
                  <p className="text-sm text-slate-500 mb-3">Pre zaslanie dopytu sa prihláste</p>
                  <Button size="sm" onClick={() => base44.auth.redirectToLogin(window.location.href)}>Prihlásiť sa</Button>
                </div>
              ) : inquirySent ? (
                <div className="text-center py-4">
                  <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="font-semibold text-slate-700">Dopyt odoslaný</p>
                  <p className="text-xs text-slate-400 mt-1">Inzerent vás čoskoro kontaktuje</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs mb-1 block">Správa *</Label>
                    <Textarea value={inquiry.message} onChange={e => setInquiry(p => ({ ...p, message: e.target.value }))}
                      placeholder="Mám záujem o túto nehnuteľnosť..." rows={4} className="text-sm" />
                  </div>
                  <div>
                    <Label className="text-xs mb-1 block">Telefón (voliteľné)</Label>
                    <Input value={inquiry.phone} onChange={e => setInquiry(p => ({ ...p, phone: e.target.value }))}
                      placeholder="+421..." className="h-8 text-sm" />
                  </div>
                  <Button
                    onClick={() => inquiryMutation.mutate()}
                    disabled={!inquiry.message.trim() || inquiryMutation.isPending}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 gap-2"
                    size="sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {inquiryMutation.isPending ? 'Odosielam...' : 'Odoslať dopyt'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="bg-slate-50 rounded-xl p-3">
              <div className="text-xs text-slate-400 mb-0.5">Zobrazení</div>
              <div className="font-bold text-slate-700">{listing.view_count || 0}</div>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <div className="text-xs text-slate-400 mb-0.5">Dopytov</div>
              <div className="font-bold text-slate-700">{listing.inquiry_count || 0}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}