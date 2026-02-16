import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Users, Building2, AlertCircle, CheckCircle, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function AdminDashboard() {
  const { data: pendingUsers = [] } = useQuery({
    queryKey: ['pendingUsers'],
    queryFn: () => base44.entities.User.filter({ verification_status: 'pending' }, '-created_date')
  });

  const { data: allListings = [] } = useQuery({
    queryKey: ['allListings'],
    queryFn: () => base44.entities.Listing.list('-created_date')
  });

  const { data: allUsers = [] } = useQuery({
    queryKey: ['allUsers'],
    queryFn: () => base44.entities.User.list('-created_date')
  });

  const verifiedUsers = allUsers.filter(u => u.verification_status === 'verified').length;
  const rejectedUsers = allUsers.filter(u => u.verification_status === 'rejected').length;
  const liveDeals = allListings.filter(l => l.status === 'teaser_live' || l.status === 'full_live').length;

  const stats = [
    { label: 'Pending Verifications', value: pendingUsers.length, icon: AlertCircle, color: 'text-amber-600' },
    { label: 'Verified Users', value: verifiedUsers, icon: CheckCircle, color: 'text-green-600' },
    { label: 'Live Deals', value: liveDeals, icon: Building2, color: 'text-[#C6A756]' },
    { label: 'Total Users', value: allUsers.length, icon: Users, color: 'text-blue-600' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#111827] mb-2">Admin Dashboard</h1>
        <p className="text-slate-600">Platform management and oversight</p>
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

      {/* Pending User Verifications */}
      <Card className="bg-white border-slate-200 shadow-sm mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-[#111827]">Pending User Verifications</CardTitle>
          <Link to={createPageUrl('UserVerification')}>
            <Button variant="outline" className="border-slate-300">View All</Button>
          </Link>
        </CardHeader>
        <CardContent>
          {pendingUsers.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              No pending verifications
            </div>
          ) : (
            <div className="space-y-3">
              {pendingUsers.slice(0, 5).map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <div className="font-semibold text-[#111827]">{user.full_name}</div>
                      <Badge variant="outline" className="capitalize">{user.role}</Badge>
                    </div>
                    <div className="text-sm text-slate-600">
                      {user.email} • {user.company} • {user.country}
                    </div>
                  </div>
                  <Link to={createPageUrl('UserVerification') + `?id=${user.id}`}>
                    <Button className="bg-[#C6A756] text-[#111827] hover:bg-[#B8994D]">
                      <Eye className="w-4 h-4 mr-2" />
                      Review
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Listings */}
      <Card className="bg-white border-slate-200 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-[#111827]">Recent Listings</CardTitle>
          <Link to={createPageUrl('AllListings')}>
            <Button variant="outline" className="border-slate-300">View All</Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {allListings.slice(0, 5).map((listing) => (
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
                    {listing.city_region}, {listing.country} • Deal ID: {listing.deal_id}
                  </div>
                </div>
                <Button variant="outline" className="border-slate-300">
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}