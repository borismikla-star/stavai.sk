import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, MapPin, Maximize2, Building2, TrendingUp, FileText, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import PortalNav from '@/components/portal/PortalNav';

const REGION_LABELS = { BA:'Bratislava', TT:'Trnava', TN:'Trenčín', NR:'Nitra', ZA:'Žilina', BB:'Banská Bystrica', PO:'Prešov', KE:'Košice' };
const TYPE_LABELS = { residential:'Rezidenčné', commercial:'Komerčné', land:'Pozemok', development:'Development' };
const TYPE_COLORS = { residential:'bg-blue-100 text-blue-700', commercial:'bg-orange-100 text-orange-700', land:'bg-green-100 text-green-700', development:'bg-purple-100 text-purple-700' };

function formatPrice(price) {
  if (!price || price === 0) return 'Na dopyt';
  return new Intl.NumberFormat('sk-SK', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(price);
}

export default function OffMarketHub() {
  const [propertyType, setPropertyType] = useState('all');
  const [region, setRegion] = useState('all');
  const [listingType, setListingType] = useState('all');

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
    retry: false
  });

  const isPro = user?.role === 'admin' || user?.beta_access;

  const { data: listings = [], isLoading } = useQuery({
    queryKey: ['off-market-listings'],
    queryFn: () => base44.entities.Listing.filter({ visibility: 'off_market', status: 'active' }, '-created_date', 100)
  });

  const { data: myNdaRequests = [] } = useQuery({
    queryKey: ['my-nda-requests', user?.id],
    queryFn: () => base44.entities.NDARequest.filter({ requester_id: user.id }),
    enabled: !!user
  });

  const filtered = useMemo(() => {
    return listings.filter(l => {
      if (propertyType !== 'all' && l.property_type !== propertyType) return false;
      if (region !== 'all' && l.location_region !== region) return false;
      if (listingType !== 'all' && l.listing_type !== listingType) return false;
      return true;
    });
  }, [listings, propertyType, region, listingType]);

  const getNdaStatus = (listingId) => {
    const req = myNdaRequests.find(r => r.listing_id === listingId);
    return req?.status || null;
  };

  if (!isPro) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <PortalNav />
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center mb-6">
            <Lock className="w-10 h-10 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-3">Off-Market Vault</h2>
          <p className="text-slate-500 max-w-md mb-6">
            Exkluzívne príležitosti chránené NDA — dostupné len pre Pro používateľov.
            Žiadny iný SK portál toto neponúka.
          </p>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-sm w-full mb-6">
            <div className="text-sm font-bold text-slate-700 mb-3">Pro plán zahŕňa:</div>
            {['Off-Market Vault prístup', 'NDA workflow', 'Deal Room', 'Prepojenie na DevCalc', 'Neobmedzené inzeráty'].map(f => (
              <div key={f} className="flex items-center gap-2 text-sm text-slate-600 py-1.5 border-b border-slate-100 last:border-0">
                <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                </div>
                {f}
              </div>
            ))}
          </div>
          <Link to="/BetaAccess" className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors">
            Získať Pro prístup
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <PortalNav />

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
              <Lock className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-2xl font-black text-slate-900">Off-Market Vault</h1>
          </div>
          <p className="text-slate-500 text-sm">{filtered.length} anonymizovaných príležitostí · adresy skryté do schválenia NDA</p>
        </div>
      </div>

      {/* Info banner */}
      <div className="bg-violet-50 border border-violet-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
        <EyeOff className="w-5 h-5 text-violet-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-violet-800">
          <span className="font-semibold">Anonymizované listingy</span> — presná adresa a kontakt sú skryté.
          Pre prístup k detailom podpíšte NDA a počkajte na schválenie predávajúcim.
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 flex flex-wrap gap-3 items-center">
        <Filter className="w-4 h-4 text-slate-400" />
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
          <SelectTrigger className="w-40 h-9"><SelectValue placeholder="Kraj" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Všetky kraje</SelectItem>
            {Object.entries(REGION_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Listings */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <div key={i} className="bg-slate-100 rounded-2xl h-48 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24 text-slate-400">
          <Lock className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <div className="font-bold text-slate-600 mb-1">Žiadne off-market príležitosti</div>
          <div className="text-sm">Skúste zmeniť filtre</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(listing => {
            const ndaStatus = getNdaStatus(listing.id);
            const pricePerM2 = listing.price && listing.area_total ? Math.round(listing.price / listing.area_total) : null;

            return (
              <div key={listing.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
                {/* Anonymous image placeholder */}
                <div className="h-40 bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center relative">
                  <div className="text-center">
                    <Lock className="w-8 h-8 text-violet-400 mx-auto mb-1" />
                    <span className="text-xs text-violet-500 font-medium">Skryté do NDA</span>
                  </div>
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge className={`text-xs ${TYPE_COLORS[listing.property_type]}`}>
                      {TYPE_LABELS[listing.property_type]}
                    </Badge>
                    <Badge className="text-xs bg-violet-600 text-white">Off-Market</Badge>
                  </div>
                  {ndaStatus === 'approved' && (
                    <div className="absolute top-3 right-3">
                      <Badge className="text-xs bg-green-600 text-white">Prístup schválený</Badge>
                    </div>
                  )}
                  {ndaStatus === 'pending' && (
                    <div className="absolute top-3 right-3">
                      <Badge className="text-xs bg-yellow-500 text-white">NDA čaká</Badge>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  {/* Anonymized title */}
                  <h3 className="font-bold text-slate-800 mb-2">
                    {TYPE_LABELS[listing.property_type]} · {REGION_LABELS[listing.location_region]}
                  </h3>

                  <div className="flex items-center gap-1 text-slate-400 text-xs mb-3">
                    <MapPin className="w-3 h-3" />
                    <span>{REGION_LABELS[listing.location_region]} · adresa skrytá</span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-lg font-black text-slate-900">{formatPrice(listing.price)}</div>
                      {pricePerM2 && <div className="text-xs text-slate-400">{formatPrice(pricePerM2)}/m²</div>}
                    </div>
                    <div className="flex items-center gap-1 text-slate-500 text-sm">
                      <Maximize2 className="w-3.5 h-3.5" />
                      {listing.area_total?.toLocaleString('sk-SK')} m²
                    </div>
                  </div>

                  {/* Action */}
                  <Link
                    to={`/ListingDetail?id=${listing.id}`}
                    className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                      ndaStatus === 'approved'
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : ndaStatus === 'pending'
                        ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  >
                    {ndaStatus === 'approved' ? (
                      <><Eye className="w-4 h-4" /> Zobraziť detail</>
                    ) : ndaStatus === 'pending' ? (
                      <><FileText className="w-4 h-4" /> NDA čaká na schválenie</>
                    ) : (
                      <><Lock className="w-4 h-4" /> Podpísať NDA a požiadať</>
                    )}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}