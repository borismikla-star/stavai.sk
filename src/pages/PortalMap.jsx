import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import { Link } from 'react-router-dom';
import { MapPin, Filter, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import PortalNav from '@/components/portal/PortalNav';
import 'leaflet/dist/leaflet.css';

// Fix leaflet default marker icons
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const TYPE_COLORS = { residential: '#3b82f6', commercial: '#f97316', land: '#22c55e', development: '#a855f7' };
const TYPE_LABELS = { residential: 'Rezidenčné', commercial: 'Komerčné', land: 'Pozemok', development: 'Development' };
const LISTING_TYPE_LABELS = { sale: 'Predaj', lease: 'Nájom', investment: 'Investícia' };

function formatPrice(price) {
  if (!price || price === 0) return 'Na dopyt';
  return new Intl.NumberFormat('sk-SK', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(price);
}

export default function PortalMap() {
  const [propertyType, setPropertyType] = useState('all');
  const [listingType, setListingType] = useState('all');
  const [selected, setSelected] = useState(null);

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
    retry: false
  });
  const isPro = user?.role === 'admin' || user?.beta_access;

  const { data: listings = [], isLoading } = useQuery({
    queryKey: ['listings-map'],
    queryFn: () => base44.entities.Listing.filter({ status: 'active' }, '-created_date', 200)
  });

  const filtered = useMemo(() => {
    return listings.filter(l => {
      if (!l.location_lat || !l.location_lng) return false;
      if (l.visibility === 'off_market' && !isPro) return false;
      if (propertyType !== 'all' && l.property_type !== propertyType) return false;
      if (listingType !== 'all' && l.listing_type !== listingType) return false;
      return true;
    });
  }, [listings, propertyType, listingType, isPro]);

  const noCoords = listings.filter(l => !l.location_lat || !l.location_lng).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <PortalNav />

      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Mapa nehnuteľností</h1>
          <p className="text-slate-500 text-sm">{filtered.length} nehnuteľností s GPS súradnicami</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3 mb-4 flex flex-wrap gap-3 items-center">
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

        {/* Legend */}
        <div className="ml-auto flex flex-wrap gap-3">
          {Object.entries(TYPE_LABELS).map(([type, label]) => (
            <div key={type} className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: TYPE_COLORS[type] }} />
              <span className="text-xs text-slate-500">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Map container */}
      <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm" style={{ height: '65vh' }}>
        {isLoading ? (
          <div className="h-full bg-slate-100 flex items-center justify-center">
            <div className="text-slate-400">Načítavam mapu...</div>
          </div>
        ) : (
          <MapContainer
            center={[48.669, 19.699]}
            zoom={7}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {filtered.map(listing => (
              <CircleMarker
                key={listing.id}
                center={[listing.location_lat, listing.location_lng]}
                radius={listing.visibility === 'off_market' ? 10 : 8}
                pathOptions={{
                  color: listing.visibility === 'off_market' ? '#7c3aed' : TYPE_COLORS[listing.property_type],
                  fillColor: listing.visibility === 'off_market' ? '#7c3aed' : TYPE_COLORS[listing.property_type],
                  fillOpacity: 0.8,
                  weight: 2
                }}
                eventHandlers={{ click: () => setSelected(listing) }}
              >
                <Popup>
                  <div className="min-w-[200px]">
                    <div className="font-bold text-sm mb-1">{listing.visibility === 'off_market' ? `Off-Market · ${TYPE_LABELS[listing.property_type]}` : listing.title}</div>
                    <div className="text-xs text-gray-500 mb-2">{listing.location_city}, {listing.location_region}</div>
                    <div className="font-bold text-indigo-600 mb-2">{formatPrice(listing.price)}</div>
                    <Link
                      to={`/ListingDetail?id=${listing.id}`}
                      className="block text-center py-1.5 px-3 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700"
                    >
                      Zobraziť detail
                    </Link>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        )}
      </div>

      {noCoords > 0 && (
        <p className="text-xs text-slate-400 mt-2 text-center">
          {noCoords} inzerátov nemá GPS súradnice a nie je zobrazených na mape
        </p>
      )}
    </div>
  );
}