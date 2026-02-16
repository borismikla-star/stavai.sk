import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MapPin, Building2, TrendingUp, DollarSign, FileText, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

export default function DealTeaser() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showNDAModal, setShowNDAModal] = useState(false);
  const [ndaAccepted, setNdaAccepted] = useState(false);
  const [typedName, setTypedName] = useState('');

  const urlParams = new URLSearchParams(window.location.search);
  const listingId = urlParams.get('id');

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me()
  });

  const { data: listing } = useQuery({
    queryKey: ['listing', listingId],
    queryFn: () => base44.entities.Listing.filter({ id: listingId }).then(res => res[0]),
    enabled: !!listingId
  });

  const { data: existingRequest } = useQuery({
    queryKey: ['accessRequest', listingId, user?.id],
    queryFn: async () => {
      const requests = await base44.entities.AccessRequest.filter({ 
        investor_id: user.id, 
        deal_id: listingId 
      });
      return requests[0];
    },
    enabled: !!listingId && !!user
  });

  const signNDAMutation = useMutation({
    mutationFn: async () => {
      // Create NDA record
      await base44.entities.NDARecord.create({
        deal_id: listingId,
        investor_id: user.id,
        signed_at: new Date().toISOString(),
        typed_name: typedName,
        ip_address: 'client-ip'
      });

      // Create or update access request
      if (existingRequest) {
        await base44.entities.AccessRequest.update(existingRequest.id, {
          status: 'nda_signed'
        });
      } else {
        await base44.entities.AccessRequest.create({
          investor_id: user.id,
          deal_id: listingId,
          status: 'nda_signed'
        });
      }

      // Create notification for broker
      await base44.entities.Notification.create({
        user_id: listing.owner_id,
        type: 'access_requested',
        title: 'New Access Request',
        message: `${user.full_name} has signed NDA and requested access to ${listing.title}`,
        link: createPageUrl('AccessRequests')
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accessRequest'] });
      setShowNDAModal(false);
      setNdaAccepted(false);
      setTypedName('');
    }
  });

  const handleRequestAccess = () => {
    if (existingRequest?.status === 'approved') {
      navigate(createPageUrl('DealRoom') + `?id=${listingId}`);
    } else {
      setShowNDAModal(true);
    }
  };

  const handleSignNDA = () => {
    if (ndaAccepted && typedName.trim()) {
      signNDAMutation.mutate();
    }
  };

  if (!listing) {
    return <div className="max-w-5xl mx-auto px-4 py-12 text-center">Loading...</div>;
  }

  const getRequestButtonText = () => {
    if (!existingRequest) return 'Request Access';
    if (existingRequest.status === 'approved') return 'Enter Deal Room';
    if (existingRequest.status === 'nda_signed') return 'Access Pending';
    if (existingRequest.status === 'rejected') return 'Access Denied';
    return 'Request Access';
  };

  const isButtonDisabled = existingRequest?.status === 'nda_signed' || existingRequest?.status === 'rejected';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Badge variant="outline" className="capitalize">
            {listing.asset_class.replace('_', ' ')}
          </Badge>
          <span className="text-sm text-slate-500">{listing.deal_id}</span>
        </div>
        <h1 className="text-4xl font-bold text-[#111827] mb-4">{listing.title}</h1>
        <div className="flex items-center gap-2 text-slate-600">
          <MapPin className="w-5 h-5 text-[#C6A756]" />
          <span className="text-lg">{listing.city_region}, {listing.country}</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {listing.ticket_size_min && (
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <Building2 className="w-8 h-8 text-[#C6A756] mb-3" />
              <div className="text-sm text-slate-600 mb-1">Investment Ticket</div>
              <div className="text-2xl font-bold text-[#111827]">
                €{(listing.ticket_size_min / 1000).toFixed(0)}k - €{(listing.ticket_size_max / 1000).toFixed(0)}k
              </div>
            </CardContent>
          </Card>
        )}

        {listing.target_irr && (
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <TrendingUp className="w-8 h-8 text-[#C6A756] mb-3" />
              <div className="text-sm text-slate-600 mb-1">Target IRR</div>
              <div className="text-2xl font-bold text-[#111827]">{listing.target_irr}%</div>
            </CardContent>
          </Card>
        )}

        {listing.price_range_min && (
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <DollarSign className="w-8 h-8 text-[#C6A756] mb-3" />
              <div className="text-sm text-slate-600 mb-1">Price Range</div>
              <div className="text-2xl font-bold text-[#111827]">
                €{(listing.price_range_min / 1000000).toFixed(1)}M - €{(listing.price_range_max / 1000000).toFixed(1)}M
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Teaser Summary */}
      <Card className="bg-white border-slate-200 shadow-sm mb-8">
        <CardHeader>
          <CardTitle className="text-[#111827]">Investment Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-700 leading-relaxed whitespace-pre-line">
            {listing.teaser_summary}
          </p>
        </CardContent>
      </Card>

      {/* CTA */}
      <Card className="bg-[#111827] border-slate-700 shadow-lg">
        <CardContent className="p-8 text-center">
          <FileText className="w-12 h-12 text-[#C6A756] mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-3">
            Request Full Access
          </h3>
          <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
            Sign NDA to access full investment thesis, financials, legal documents, and deal room
          </p>
          {existingRequest?.status === 'nda_signed' && (
            <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4 mb-6 text-blue-200">
              <CheckCircle className="w-5 h-5 inline mr-2" />
              NDA signed. Waiting for broker approval.
            </div>
          )}
          {existingRequest?.status === 'rejected' && (
            <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 mb-6 text-red-200">
              Access request was declined by the broker.
            </div>
          )}
          <Button
            onClick={handleRequestAccess}
            disabled={isButtonDisabled}
            className="bg-[#C6A756] text-[#111827] hover:bg-[#B8994D] px-8 py-6 text-lg font-semibold"
          >
            {getRequestButtonText()}
          </Button>
        </CardContent>
      </Card>

      {/* NDA Modal */}
      <Dialog open={showNDAModal} onOpenChange={setShowNDAModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#111827]">Non-Disclosure Agreement</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="bg-slate-50 p-6 rounded-lg max-h-96 overflow-y-auto text-sm text-slate-700 leading-relaxed">
              <h3 className="font-bold mb-3">CONFIDENTIALITY AND NON-DISCLOSURE AGREEMENT</h3>
              <p className="mb-3">
                This Non-Disclosure Agreement ("Agreement") is entered into by and between Brickbridge and the undersigned party ("Recipient").
              </p>
              <p className="mb-3">
                <strong>1. Confidential Information:</strong> All information, documents, data, and materials provided through the Brickbridge platform regarding this investment opportunity shall be considered confidential.
              </p>
              <p className="mb-3">
                <strong>2. Obligations:</strong> Recipient agrees to maintain strict confidentiality and not to disclose, distribute, or use any confidential information for any purpose other than evaluating this investment opportunity.
              </p>
              <p className="mb-3">
                <strong>3. Duration:</strong> This Agreement shall remain in effect for 2 years from the date of execution.
              </p>
              <p className="mb-3">
                <strong>4. Return of Materials:</strong> Upon request, all confidential materials shall be returned or destroyed.
              </p>
            </div>

            <div>
              <Label htmlFor="typed_name">Type your full name to sign *</Label>
              <Input
                id="typed_name"
                value={typedName}
                onChange={(e) => setTypedName(e.target.value)}
                placeholder="John Doe"
                className="mt-2"
              />
            </div>

            <div className="flex items-start gap-3">
              <Checkbox
                id="nda_accept"
                checked={ndaAccepted}
                onCheckedChange={setNdaAccepted}
              />
              <Label htmlFor="nda_accept" className="cursor-pointer text-sm">
                I have read and agree to the terms of this Non-Disclosure Agreement. I understand that my electronic signature constitutes a legally binding agreement.
              </Label>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setShowNDAModal(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSignNDA}
                disabled={!ndaAccepted || !typedName.trim() || signNDAMutation.isPending}
                className="flex-1 bg-[#C6A756] text-[#111827] hover:bg-[#B8994D]"
              >
                {signNDAMutation.isPending ? 'Signing...' : 'Sign & Submit'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}