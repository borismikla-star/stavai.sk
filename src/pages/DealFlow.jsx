import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { MapPin, TrendingUp, Building2, Filter } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

export default function DealFlow() {
  const [filters, setFilters] = useState({
    country: '',
    asset_class: '',
    min_ticket: '',
    max_ticket: '',
    min_irr: ''
  });

  const { data: listings = [], isLoading } = useQuery({
    queryKey: ['dealFlow'],
    queryFn: () => base44.entities.Listing.filter({ status: 'teaser_live' }, '-created_date')
  });

  const filteredListings = listings.filter(listing => {
    if (filters.country && listing.country !== filters.country) return false;
    if (filters.asset_class && listing.asset_class !== filters.asset_class) return false;
    if (filters.min_ticket && listing.ticket_size_max < parseFloat(filters.min_ticket)) return false;
    if (filters.max_ticket && listing.ticket_size_min > parseFloat(filters.max_ticket)) return false;
    if (filters.min_irr && listing.target_irr < parseFloat(filters.min_irr)) return false;
    return true;
  });

  const uniqueCountries = [...new Set(listings.map(l => l.country))];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#111827] mb-2">Deal Flow</h1>
        <p className="text-slate-600">Browse exclusive off-market opportunities</p>
      </div>

      {/* Filters */}
      <Card className="bg-white border-slate-200 shadow-sm mb-8">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-[#C6A756]" />
            <h3 className="font-semibold text-[#111827]">Filters</h3>
          </div>
          <div className="grid md:grid-cols-5 gap-4">
            <Select value={filters.country} onValueChange={(val) => setFilters(prev => ({ ...prev, country: val }))}>
              <SelectTrigger>
                <SelectValue placeholder="Country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={null}>All Countries</SelectItem>
                {uniqueCountries.map(country => (
                  <SelectItem key={country} value={country}>{country}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.asset_class} onValueChange={(val) => setFilters(prev => ({ ...prev, asset_class: val }))}>
              <SelectTrigger>
                <SelectValue placeholder="Asset Class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={null}>All Types</SelectItem>
                <SelectItem value="residential">Residential</SelectItem>
                <SelectItem value="development_land">Development Land</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="number"
              placeholder="Min Ticket (€)"
              value={filters.min_ticket}
              onChange={(e) => setFilters(prev => ({ ...prev, min_ticket: e.target.value }))}
            />

            <Input
              type="number"
              placeholder="Max Ticket (€)"
              value={filters.max_ticket}
              onChange={(e) => setFilters(prev => ({ ...prev, max_ticket: e.target.value }))}
            />

            <Input
              type="number"
              placeholder="Min IRR (%)"
              value={filters.min_irr}
              onChange={(e) => setFilters(prev => ({ ...prev, min_irr: e.target.value }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="mb-6 text-sm text-slate-600">
        Showing {filteredListings.length} {filteredListings.length === 1 ? 'opportunity' : 'opportunities'}
      </div>

      {/* Listings Grid */}
      {isLoading ? (
        <div className="text-center py-12 text-slate-500">Loading opportunities...</div>
      ) : filteredListings.length === 0 ? (
        <div className="text-center py-12 text-slate-500">No opportunities match your filters</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredListings.map((listing) => (
            <Card key={listing.id} className="bg-white border-slate-200 shadow-sm hover:shadow-md transition group">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <Badge variant="outline" className="capitalize">
                    {listing.asset_class.replace('_', ' ')}
                  </Badge>
                  <div className="text-xs text-slate-500">{listing.deal_id}</div>
                </div>

                <h3 className="text-xl font-bold text-[#111827] mb-3 group-hover:text-[#C6A756] transition">
                  {listing.title}
                </h3>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin className="w-4 h-4 text-[#C6A756]" />
                    <span>{listing.city_region}, {listing.country}</span>
                  </div>

                  {listing.ticket_size_min && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <Building2 className="w-4 h-4 text-[#C6A756]" />
                      <span>Ticket: €{(listing.ticket_size_min / 1000).toFixed(0)}k - €{(listing.ticket_size_max / 1000).toFixed(0)}k</span>
                    </div>
                  )}

                  {listing.target_irr && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <TrendingUp className="w-4 h-4 text-[#C6A756]" />
                      <span>Target IRR: {listing.target_irr}%</span>
                    </div>
                  )}
                </div>

                <p className="text-sm text-slate-600 mb-6 line-clamp-3">
                  {listing.teaser_summary}
                </p>

                <Link to={createPageUrl('DealTeaser') + `?id=${listing.id}`}>
                  <Button className="w-full bg-[#C6A756] text-[#111827] hover:bg-[#B8994D]">
                    View Details
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}