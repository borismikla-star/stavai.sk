import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FileText, MessageSquare, DollarSign, Info, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function DealRoom() {
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const listingId = urlParams.get('id');

  const [newQuestion, setNewQuestion] = useState('');
  const [offerData, setOfferData] = useState({
    indicative_price: '',
    conditions: '',
    timeline: '',
    financing_type: 'cash',
    note: ''
  });

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me()
  });

  const { data: listing } = useQuery({
    queryKey: ['listing', listingId],
    queryFn: () => base44.entities.Listing.filter({ id: listingId }).then(res => res[0]),
    enabled: !!listingId
  });

  const { data: documents = [] } = useQuery({
    queryKey: ['documents', listingId],
    queryFn: () => base44.entities.Document.filter({ deal_id: listingId }, '-created_date'),
    enabled: !!listingId
  });

  const { data: qaThreads = [] } = useQuery({
    queryKey: ['qaThreads', listingId],
    queryFn: () => base44.entities.QAThread.filter({ deal_id: listingId }, '-created_date'),
    enabled: !!listingId
  });

  const { data: myOffers = [] } = useQuery({
    queryKey: ['myOffers', listingId, user?.id],
    queryFn: () => base44.entities.Offer.filter({ deal_id: listingId, investor_id: user.id }, '-created_date'),
    enabled: !!listingId && !!user
  });

  const askQuestionMutation = useMutation({
    mutationFn: async () => {
      await base44.entities.QAThread.create({
        deal_id: listingId,
        created_by: user.id,
        question: newQuestion,
        status: 'open'
      });

      await base44.entities.Notification.create({
        user_id: listing.owner_id,
        type: 'access_requested',
        title: 'New Q&A Question',
        message: `${user.full_name} asked a question on ${listing.title}`,
        link: `DealRoom?id=${listingId}`
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['qaThreads'] });
      setNewQuestion('');
    }
  });

  const submitOfferMutation = useMutation({
    mutationFn: async () => {
      await base44.entities.Offer.create({
        deal_id: listingId,
        investor_id: user.id,
        indicative_price: parseFloat(offerData.indicative_price),
        conditions: offerData.conditions,
        timeline: offerData.timeline,
        financing_type: offerData.financing_type,
        note: offerData.note,
        status: 'submitted'
      });

      await base44.entities.Notification.create({
        user_id: listing.owner_id,
        type: 'offer_submitted',
        title: 'New Offer Received',
        message: `${user.full_name} submitted an offer for ${listing.title}`,
        link: `DealRoom?id=${listingId}`
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myOffers'] });
      setOfferData({
        indicative_price: '',
        conditions: '',
        timeline: '',
        financing_type: 'cash',
        note: ''
      });
    }
  });

  if (!listing) {
    return <div className="max-w-6xl mx-auto px-4 py-12 text-center">Loading...</div>;
  }

  const documentsByCategory = {
    teaser: documents.filter(d => d.category === 'teaser'),
    financials: documents.filter(d => d.category === 'financials'),
    legal: documents.filter(d => d.category === 'legal'),
    technical: documents.filter(d => d.category === 'technical')
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Badge variant="outline" className="mb-3 capitalize">
          {listing.asset_class.replace('_', ' ')}
        </Badge>
        <h1 className="text-3xl font-bold text-[#111827] mb-2">{listing.title}</h1>
        <p className="text-slate-600">Deal ID: {listing.deal_id}</p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="financials">Financials</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="qa">Q&A</TabsTrigger>
          <TabsTrigger value="offer">Submit Offer</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-[#111827] flex items-center gap-2">
                <Info className="w-5 h-5 text-[#C6A756]" />
                Full Investment Thesis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-[#111827] mb-2">Location Details</h3>
                  <p className="text-slate-700">{listing.exact_location || listing.city_region + ', ' + listing.country}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-[#111827] mb-2">Investment Summary</h3>
                  <p className="text-slate-700 whitespace-pre-line">
                    {listing.full_summary || listing.teaser_summary}
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-4 pt-4 border-t">
                  <div>
                    <div className="text-sm text-slate-600 mb-1">Investment Ticket</div>
                    <div className="font-bold text-[#111827]">
                      €{(listing.ticket_size_min / 1000).toFixed(0)}k - €{(listing.ticket_size_max / 1000).toFixed(0)}k
                    </div>
                  </div>
                  {listing.target_irr && (
                    <div>
                      <div className="text-sm text-slate-600 mb-1">Target IRR</div>
                      <div className="font-bold text-[#111827]">{listing.target_irr}%</div>
                    </div>
                  )}
                  <div>
                    <div className="text-sm text-slate-600 mb-1">Asset Class</div>
                    <div className="font-bold text-[#111827] capitalize">{listing.asset_class.replace('_', ' ')}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Financials Tab */}
        <TabsContent value="financials">
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-[#111827]">Financial Documents</CardTitle>
            </CardHeader>
            <CardContent>
              {documentsByCategory.financials.length === 0 ? (
                <div className="text-center py-8 text-slate-500">No financial documents available</div>
              ) : (
                <div className="space-y-3">
                  {documentsByCategory.financials.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-[#C6A756]" />
                        <div>
                          <div className="font-medium text-[#111827]">{doc.name}</div>
                          <div className="text-sm text-slate-600">Version {doc.version}</div>
                        </div>
                      </div>
                      <Button variant="outline" onClick={() => window.open(doc.file_url, '_blank')}>
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents">
          <div className="space-y-6">
            {Object.entries(documentsByCategory).map(([category, docs]) => (
              <Card key={category} className="bg-white border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-[#111827] capitalize">{category} Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  {docs.length === 0 ? (
                    <div className="text-center py-6 text-slate-500">No documents in this category</div>
                  ) : (
                    <div className="space-y-3">
                      {docs.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-[#C6A756]" />
                            <div>
                              <div className="font-medium text-[#111827]">{doc.name}</div>
                              <div className="text-sm text-slate-600">Version {doc.version || '1.0'}</div>
                            </div>
                          </div>
                          <Button variant="outline" onClick={() => window.open(doc.file_url, '_blank')}>
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Q&A Tab */}
        <TabsContent value="qa">
          <div className="space-y-6">
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-[#111827]">Ask a Question</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="Type your question here..."
                  rows={4}
                  className="mb-4"
                />
                <Button
                  onClick={() => askQuestionMutation.mutate()}
                  disabled={!newQuestion.trim() || askQuestionMutation.isPending}
                  className="bg-[#C6A756] text-[#111827] hover:bg-[#B8994D]"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  {askQuestionMutation.isPending ? 'Submitting...' : 'Submit Question'}
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-[#111827]">Questions & Answers</CardTitle>
              </CardHeader>
              <CardContent>
                {qaThreads.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">No questions yet</div>
                ) : (
                  <div className="space-y-6">
                    {qaThreads.map((thread) => (
                      <div key={thread.id} className="border-b border-slate-200 pb-6 last:border-0">
                        <div className="flex items-start gap-3 mb-3">
                          <MessageSquare className="w-5 h-5 text-[#C6A756] mt-1" />
                          <div className="flex-1">
                            <div className="font-medium text-[#111827] mb-2">{thread.question}</div>
                            <div className="text-xs text-slate-500">
                              Asked {new Date(thread.created_date).toLocaleDateString()}
                            </div>
                          </div>
                          <Badge className={thread.status === 'answered' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}>
                            {thread.status}
                          </Badge>
                        </div>
                        {thread.answer && (
                          <div className="ml-8 p-4 bg-slate-50 rounded-lg">
                            <div className="text-sm text-slate-700">{thread.answer}</div>
                            <div className="text-xs text-slate-500 mt-2">
                              Answered {new Date(thread.answered_at).toLocaleDateString()}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Offer Tab */}
        <TabsContent value="offer">
          <div className="space-y-6">
            {myOffers.length > 0 && (
              <Card className="bg-white border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-[#111827]">Your Previous Offers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {myOffers.map((offer) => (
                      <div key={offer.id} className="p-4 border border-slate-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-bold text-[#111827]">€{offer.indicative_price.toLocaleString()}</div>
                          <Badge className={
                            offer.status === 'accepted' ? 'bg-green-100 text-green-800' :
                            offer.status === 'declined' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                          }>
                            {offer.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-slate-600">
                          Submitted {new Date(offer.created_date).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="bg-white border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-[#111827] flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-[#C6A756]" />
                  Submit Indicative Offer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => { e.preventDefault(); submitOfferMutation.mutate(); }} className="space-y-6">
                  <div>
                    <Label htmlFor="indicative_price">Indicative Price (EUR) *</Label>
                    <Input
                      id="indicative_price"
                      type="number"
                      value={offerData.indicative_price}
                      onChange={(e) => setOfferData(prev => ({ ...prev, indicative_price: e.target.value }))}
                      placeholder="5000000"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="financing_type">Financing Type *</Label>
                    <Select value={offerData.financing_type} onValueChange={(val) => setOfferData(prev => ({ ...prev, financing_type: val }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="debt">Debt</SelectItem>
                        <SelectItem value="mixed">Mixed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="timeline">Proposed Timeline</Label>
                    <Input
                      id="timeline"
                      value={offerData.timeline}
                      onChange={(e) => setOfferData(prev => ({ ...prev, timeline: e.target.value }))}
                      placeholder="e.g., 60 days to closing"
                    />
                  </div>

                  <div>
                    <Label htmlFor="conditions">Conditions</Label>
                    <Textarea
                      id="conditions"
                      value={offerData.conditions}
                      onChange={(e) => setOfferData(prev => ({ ...prev, conditions: e.target.value }))}
                      placeholder="Any conditions or requirements"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="note">Additional Notes</Label>
                    <Textarea
                      id="note"
                      value={offerData.note}
                      onChange={(e) => setOfferData(prev => ({ ...prev, note: e.target.value }))}
                      placeholder="Any additional information"
                      rows={3}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={!offerData.indicative_price || submitOfferMutation.isPending}
                    className="w-full bg-[#C6A756] text-[#111827] hover:bg-[#B8994D] py-6 text-lg font-semibold"
                  >
                    {submitOfferMutation.isPending ? 'Submitting...' : 'Submit Offer'}
                  </Button>

                  <p className="text-xs text-slate-500 text-center">
                    This is a non-binding indicative offer. Final terms subject to due diligence and negotiation.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}