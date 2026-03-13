import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare, Eye, ExternalLink } from 'lucide-react';
import PortalNav from '@/components/portal/PortalNav';
import { formatDistanceToNow } from 'date-fns';
import { sk } from 'date-fns/locale';

const STATUS_COLORS = { sent: 'bg-blue-100 text-blue-700', read: 'bg-slate-100 text-slate-600', replied: 'bg-green-100 text-green-700', archived: 'bg-slate-100 text-slate-400' };
const STATUS_LABELS = { sent: 'Odoslaný', read: 'Prečítaný', replied: 'Odpovedaný', archived: 'Archivovaný' };

export default function MyInquiries() {
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
    retry: false
  });

  const { data: received = [] } = useQuery({
    queryKey: ['inquiries-received', user?.id],
    queryFn: () => base44.entities.ListingInquiry.filter({ recipient_id: user.id }, '-created_date'),
    enabled: !!user
  });

  const { data: sent = [] } = useQuery({
    queryKey: ['inquiries-sent', user?.id],
    queryFn: () => base44.entities.ListingInquiry.filter({ sender_id: user.id }, '-created_date'),
    enabled: !!user
  });

  const markReadMutation = useMutation({
    mutationFn: (id) => base44.entities.ListingInquiry.update(id, { status: 'read', read_at: new Date().toISOString() }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['inquiries-received'] })
  });

  const InquiryRow = ({ inq, isReceived }) => (
    <Card className="hover:shadow-sm transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Badge className={`text-xs ${STATUS_COLORS[inq.status]}`}>{STATUS_LABELS[inq.status]}</Badge>
              {inq.is_off_market && <Badge className="text-xs bg-violet-100 text-violet-700">Off-Market</Badge>}
              <span className="text-xs text-slate-400">
                {formatDistanceToNow(new Date(inq.created_date), { addSuffix: true, locale: sk })}
              </span>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed line-clamp-3">{inq.message}</p>
            {inq.sender_contact_email && (
              <div className="text-xs text-slate-400 mt-1">📧 {inq.sender_contact_email}</div>
            )}
            {inq.sender_contact_phone && (
              <div className="text-xs text-slate-400">📞 {inq.sender_contact_phone}</div>
            )}
          </div>
          <div className="flex flex-col gap-2 items-end shrink-0">
            <Link to={`/ListingDetail?id=${inq.listing_id}`} className="text-xs text-indigo-600 hover:underline flex items-center gap-1">
              <ExternalLink className="w-3 h-3" /> Listing
            </Link>
            {isReceived && inq.status === 'sent' && (
              <button onClick={() => markReadMutation.mutate(inq.id)} className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1">
                <Eye className="w-3 h-3" /> Označiť prečítané
              </button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <PortalNav />

      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900">Dopyty</h1>
        <p className="text-slate-500 text-sm">Prijaté a odoslané dopyty</p>
      </div>

      <Tabs defaultValue="received">
        <TabsList className="mb-4">
          <TabsTrigger value="received" className="gap-2">
            <MessageSquare className="w-3.5 h-3.5" />
            Prijaté <Badge className="ml-1 bg-indigo-100 text-indigo-700 text-xs">{received.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="sent">
            Odoslané <Badge className="ml-1 bg-slate-100 text-slate-600 text-xs">{sent.length}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="received" className="space-y-3">
          {received.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <MessageSquare className="w-10 h-10 mx-auto mb-2 text-slate-200" />
              <div>Zatiaľ žiadne prijaté dopyty</div>
            </div>
          ) : received.map(inq => <InquiryRow key={inq.id} inq={inq} isReceived />)}
        </TabsContent>

        <TabsContent value="sent" className="space-y-3">
          {sent.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <div>Zatiaľ ste neodoslali žiadne dopyty</div>
            </div>
          ) : sent.map(inq => <InquiryRow key={inq.id} inq={inq} isReceived={false} />)}
        </TabsContent>
      </Tabs>
    </div>
  );
}