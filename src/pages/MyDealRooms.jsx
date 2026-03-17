import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle, ChevronRight } from 'lucide-react';
import PortalNav from '@/components/portal/PortalNav';
import { formatDistanceToNow } from 'date-fns';
import { sk } from 'date-fns/locale';

const STATUS_LABELS = { active: 'Aktívny', reservation_signed: 'Rezervácia podpísaná', completed: 'Uzavretý', cancelled: 'Zrušený' };
const STATUS_COLORS = { active: 'bg-blue-100 text-blue-700', reservation_signed: 'bg-amber-100 text-amber-700', completed: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700' };

export default function MyDealRooms() {
  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
    retry: false
  });

  const { data: asSeller = [], isLoading: l1 } = useQuery({
    queryKey: ['deals-seller', user?.id],
    queryFn: () => base44.entities.DealRoom.filter({ seller_id: user.id }, '-created_date'),
    enabled: !!user
  });

  const { data: asBuyer = [], isLoading: l2 } = useQuery({
    queryKey: ['deals-buyer', user?.id],
    queryFn: () => base44.entities.DealRoom.filter({ buyer_id: user.id }, '-created_date'),
    enabled: !!user
  });

  const { data: listings = [] } = useQuery({
    queryKey: ['listings-mini'],
    queryFn: () => base44.entities.Listing.list(),
    enabled: !!user
  });
  const listingMap = Object.fromEntries(listings.map(l => [l.id, l]));

  const allDeals = [...asSeller, ...asBuyer].filter((d, i, arr) => arr.findIndex(x => x.id === d.id) === i)
    .sort((a, b) => new Date(b.created_date) - new Date(a.created_date));

  const isLoading = l1 || l2;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <PortalNav />
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900">Deal Rooms</h1>
        <p className="text-slate-500 text-sm">Vaše aktívne a uzavreté obchody</p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => <div key={i} className="bg-slate-100 rounded-2xl h-20 animate-pulse" />)}
        </div>
      ) : allDeals.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <Shield className="w-12 h-12 mx-auto mb-3 text-slate-200" />
          <div className="font-medium">Zatiaľ žiadne Deal Rooms</div>
          <p className="text-sm mt-1">Deal Room sa vytvorí keď predávajúci schváli dopyt.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {allDeals.map(deal => {
            const listing = listingMap[deal.listing_id];
            const role = deal.seller_id === user?.id ? 'Predávajúci' : 'Kupujúci';
            const roleColor = role === 'Predávajúci' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700';
            return (
              <Link key={deal.id} to={`/DealRoomPage?id=${deal.id}`}
                className="flex items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-4 hover:shadow-md transition-all group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-indigo-500" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800 text-sm leading-tight">
                      {listing?.title || deal.listing_id}
                    </div>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <Badge className={`text-xs ${STATUS_COLORS[deal.status]}`}>{STATUS_LABELS[deal.status]}</Badge>
                      <Badge className={`text-xs ${roleColor}`}>{role}</Badge>
                      {deal.red_flag && (
                        <Badge className="text-xs bg-red-100 text-red-600 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Red Flag
                        </Badge>
                      )}
                      <span className="text-xs text-slate-400">
                        {formatDistanceToNow(new Date(deal.created_date), { addSuffix: true, locale: sk })}
                      </span>
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-400 transition-colors shrink-0" />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}