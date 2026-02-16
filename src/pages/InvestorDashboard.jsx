import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Building2, Eye, Clock, MessageSquare, TrendingUp, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function InvestorDashboard() {
  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me()
  });

  const { data: myAccessRequests = [] } = useQuery({
    queryKey: ['myAccessRequests', user?.id],
    queryFn: () => user ? base44.entities.AccessRequest.filter({ investor_id: user.id }, '-created_date') : [],
    enabled: !!user
  });

  const { data: listings = [] } = useQuery({
    queryKey: ['liveListings'],
    queryFn: () => base44.entities.Listing.filter({ status: 'teaser_live' }, '-created_date', 10)
  });

  const { data: messages = [] } = useQuery({
    queryKey: ['myMessages', user?.id],
    queryFn: () => user ? base44.entities.Message.filter({ recipient_id: user.id, read: false }, '-created_date', 5) : [],
    enabled: !!user
  });

  const approvedDeals = myAccessRequests.filter(r => r.status === 'approved').length;
  const pendingRequests = myAccessRequests.filter(r => r.status === 'nda_signed').length;

  const stats = [
    { label: 'Active Deals', value: approvedDeals, icon: Building2, color: 'text-[#C6A756]' },
    { label: 'New Opportunities', value: listings.length, icon: TrendingUp, color: 'text-blue-600' },
    { label: 'Pending Requests', value: pendingRequests, icon: Clock, color: 'text-amber-600' },
    { label: 'Unread Messages', value: messages.length, icon: MessageSquare, color: 'text-emerald-600' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#111827] mb-2">Welcome back, {user?.full_name}</h1>
        <p className="text-slate-600">Your investment dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-white border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
                <div className="text-3xl font-bold text-[#111827]">{stat.value}</div>
              </div>
              <div className="text-sm text-slate-600">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Opportunities */}
      <Card className="bg-white border-slate-200 shadow-sm mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-[#111827]">Recent Opportunities</CardTitle>
          <Link to={createPageUrl('DealFlow')}>
            <Button variant="outline" className="border-slate-300">View All</Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {listings.slice(0, 5).map((listing) => (
              <div key={listing.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:border-[#C6A756] transition">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-[#111827]">{listing.title}</h3>
                    <Badge variant="outline" className="capitalize">{listing.asset_class.replace('_', ' ')}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {listing.city_region}, {listing.country}
                    </div>
                    {listing.ticket_size_min && (
                      <div>
                        Ticket: €{(listing.ticket_size_min / 1000).toFixed(0)}k - €{(listing.ticket_size_max / 1000).toFixed(0)}k
                      </div>
                    )}
                    {listing.target_irr && (
                      <div>Target IRR: {listing.target_irr}%</div>
                    )}
                  </div>
                </div>
                <Link to={createPageUrl('DealTeaser') + `?id=${listing.id}`}>
                  <Button className="bg-[#C6A756] text-[#111827] hover:bg-[#B8994D]">
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* My Requests */}
      {myAccessRequests.length > 0 && (
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-[#111827]">My Access Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {myAccessRequests.slice(0, 5).map((request) => (
                <div key={request.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <div className="font-medium text-[#111827]">Deal #{request.deal_id}</div>
                    <div className="text-sm text-slate-600">Status: {request.status}</div>
                  </div>
                  <Badge 
                    className={
                      request.status === 'approved' ? 'bg-green-100 text-green-800' :
                      request.status === 'nda_signed' ? 'bg-blue-100 text-blue-800' :
                      request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-amber-100 text-amber-800'
                    }
                  >
                    {request.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}