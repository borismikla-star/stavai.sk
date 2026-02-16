import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Building2, Users, MessageSquare, FileText, Plus, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function BrokerDashboard() {
  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me()
  });

  const { data: myListings = [] } = useQuery({
    queryKey: ['myListings', user?.id],
    queryFn: () => user ? base44.entities.Listing.filter({ owner_id: user.id }, '-created_date') : [],
    enabled: !!user
  });

  const { data: accessRequests = [] } = useQuery({
    queryKey: ['accessRequests', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const myDeals = await base44.entities.Listing.filter({ owner_id: user.id });
      const dealIds = myDeals.map(d => d.id);
      if (dealIds.length === 0) return [];
      
      const requests = await base44.entities.AccessRequest.list('-created_date');
      return requests.filter(r => dealIds.includes(r.deal_id) && r.status === 'nda_signed');
    },
    enabled: !!user
  });

  const { data: messages = [] } = useQuery({
    queryKey: ['myMessages', user?.id],
    queryFn: () => user ? base44.entities.Message.filter({ recipient_id: user.id, read: false }, '-created_date', 5) : [],
    enabled: !!user
  });

  const liveListings = myListings.filter(l => l.status === 'teaser_live' || l.status === 'full_live').length;
  const draftListings = myListings.filter(l => l.status === 'draft').length;

  const stats = [
    { label: 'Live Listings', value: liveListings, icon: Building2, color: 'text-[#C6A756]' },
    { label: 'Pending Approvals', value: accessRequests.length, icon: Users, color: 'text-blue-600' },
    { label: 'Draft Listings', value: draftListings, icon: FileText, color: 'text-amber-600' },
    { label: 'Unread Messages', value: messages.length, icon: MessageSquare, color: 'text-emerald-600' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#111827] mb-2">Broker Dashboard</h1>
          <p className="text-slate-600">Manage your listings and investor requests</p>
        </div>
        <Link to={createPageUrl('CreateListing')}>
          <Button className="bg-[#C6A756] text-[#111827] hover:bg-[#B8994D]">
            <Plus className="w-4 h-4 mr-2" />
            New Listing
          </Button>
        </Link>
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

      {/* Pending Access Requests */}
      {accessRequests.length > 0 && (
        <Card className="bg-white border-slate-200 shadow-sm mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-[#111827]">Pending Access Requests</CardTitle>
            <Link to={createPageUrl('AccessRequests')}>
              <Button variant="outline" className="border-slate-300">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {accessRequests.slice(0, 5).map((request) => (
                <div key={request.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                  <div>
                    <div className="font-medium text-[#111827]">Investor Request</div>
                    <div className="text-sm text-slate-600">Deal ID: {request.deal_id}</div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">NDA Signed</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* My Listings */}
      <Card className="bg-white border-slate-200 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-[#111827]">My Listings</CardTitle>
          <Link to={createPageUrl('MyListings')}>
            <Button variant="outline" className="border-slate-300">View All</Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {myListings.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                No listings yet. Create your first listing to get started.
              </div>
            ) : (
              myListings.slice(0, 5).map((listing) => (
                <div key={listing.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-[#111827]">{listing.title}</h3>
                      <Badge variant="outline" className="capitalize">{listing.asset_class.replace('_', ' ')}</Badge>
                      <Badge 
                        className={
                          listing.status === 'teaser_live' || listing.status === 'full_live' ? 'bg-green-100 text-green-800' :
                          listing.status === 'draft' ? 'bg-slate-200 text-slate-800' :
                          'bg-blue-100 text-blue-800'
                        }
                      >
                        {listing.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="text-sm text-slate-600">
                      {listing.city_region}, {listing.country}
                    </div>
                  </div>
                  <Button variant="outline" className="border-slate-300">
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}