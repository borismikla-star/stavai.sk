import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Users, FileText, BarChart2, Trash2, Plus, Edit, CheckCircle, XCircle, Clock, Building2, AlertTriangle, Shield, Star, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Link } from 'react-router-dom';

const LISTING_STATUS_COLORS = { draft: 'bg-slate-100 text-slate-600', active: 'bg-green-100 text-green-700', under_offer: 'bg-amber-100 text-amber-700', sold: 'bg-blue-100 text-blue-700', expired: 'bg-red-100 text-red-600' };
const LISTING_STATUS_LABELS = { draft: 'Draft', active: 'Aktívny', under_offer: 'Pod ponukou', sold: 'Predaný', expired: 'Expirovaný' };
const TYPE_LABELS = { residential: 'Rezidenčné', commercial: 'Komerčné', land: 'Pozemok', development: 'Development' };
const REGION_LABELS = { BA:'BA', TT:'TT', TN:'TN', NR:'NR', ZA:'ZA', BB:'BB', PO:'PO', KE:'KE' };
const fmt = (n) => n ? new Intl.NumberFormat('sk-SK', { maximumFractionDigits: 0 }).format(n) + ' €' : '—';

const categoryLabels = {
  ai: 'AI & Technológie', construction: 'Stavebníctvo', real_estate: 'Reality',
  investment: 'Investície', trends: 'Trendy', tutorial: 'Návody',
};

export default function Admin() {
  const queryClient = useQueryClient();
  const [articleModal, setArticleModal] = useState(null); // null | 'new' | article object

  const { data: users = [] } = useQuery({
    queryKey: ['allUsers'],
    queryFn: () => base44.entities.User.list('-created_date')
  });

  const { data: articles = [] } = useQuery({
    queryKey: ['allArticles'],
    queryFn: () => base44.entities.Article.list('-created_date')
  });

  const { data: analyses = [] } = useQuery({
    queryKey: ['allAnalyses'],
    queryFn: () => base44.entities.FeasibilityAnalysis.list('-created_date', 20)
  });

  const { data: projects = [] } = useQuery({
    queryKey: ['allProjects'],
    queryFn: () => base44.entities.Project.list('-created_date', 20)
  });

  const { data: allListings = [] } = useQuery({
    queryKey: ['admin-listings'],
    queryFn: () => base44.entities.Listing.list('-created_date', 200)
  });

  const { data: allNdaRequests = [] } = useQuery({
    queryKey: ['admin-nda-requests'],
    queryFn: () => base44.entities.NDARequest.list('-created_date', 100)
  });

  const { data: allDealRooms = [] } = useQuery({
    queryKey: ['admin-deal-rooms'],
    queryFn: () => base44.entities.DealRoom.list('-created_date', 100)
  });

  const deleteArticleMutation = useMutation({
    mutationFn: (id) => base44.entities.Article.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['allArticles'] })
  });

  const updateListingMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Listing.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-listings'] })
  });

  const deleteListingMutation = useMutation({
    mutationFn: (id) => base44.entities.Listing.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-listings'] })
  });

  const updateDealMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.DealRoom.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-deal-rooms'] })
  });

  const activeListings = allListings.filter(l => l.status === 'active').length;
  const offMarketListings = allListings.filter(l => l.visibility === 'off_market').length;
  const pendingNda = allNdaRequests.filter(n => n.status === 'pending').length;
  const redFlagDeals = allDealRooms.filter(d => d.red_flag).length;
  const unpaidFees = allDealRooms.filter(d => d.fee_calculated && !d.fee_paid).length;

  const stats = [
    { label: 'Používatelia', value: users.length, icon: Users, color: 'text-blue-600' },
    { label: 'Aktívne listingy', value: activeListings, icon: Building2, color: 'text-emerald-600' },
    { label: 'Čakajúce NDA', value: pendingNda, icon: Shield, color: 'text-violet-600' },
    { label: 'Red Flags', value: redFlagDeals, icon: AlertTriangle, color: 'text-red-600' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="text-xs text-blue-600 uppercase tracking-widest font-semibold mb-1">Administrácia</div>
        <h1 className="text-3xl font-black text-[#0F172A]">Admin Panel</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
        {stats.map((s, i) => (
          <Card key={i} className="bg-white border-slate-200">
            <CardContent className="p-5 flex items-center gap-4">
              <s.icon className={`w-8 h-8 ${s.color}`} />
              <div>
                <div className="text-2xl font-black text-[#0F172A]">{s.value}</div>
                <div className="text-xs text-slate-500">{s.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="listings">
        <TabsList className="mb-6 flex-wrap">
          <TabsTrigger value="listings">Listingy ({allListings.length})</TabsTrigger>
          <TabsTrigger value="dealrooms">Deal Rooms ({allDealRooms.length})</TabsTrigger>
          <TabsTrigger value="nda">NDA Požiadavky ({allNdaRequests.length})</TabsTrigger>
          <TabsTrigger value="users">Používatelia</TabsTrigger>
          <TabsTrigger value="articles">Články</TabsTrigger>
          <TabsTrigger value="analyses">Analýzy</TabsTrigger>
        </TabsList>

        {/* Listings Tab */}
        <TabsContent value="listings">
          <Card className="bg-white border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base text-[#0F172A]">Všetky listingy</CardTitle>
              <div className="flex gap-2 text-xs text-slate-500">
                <span className="bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full font-medium">{offMarketListings} off-market</span>
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-4 py-3 text-slate-600 font-semibold">Názov</th>
                    <th className="text-center px-3 py-3 text-slate-600 font-semibold">Typ</th>
                    <th className="text-center px-3 py-3 text-slate-600 font-semibold">Status</th>
                    <th className="text-center px-3 py-3 text-slate-600 font-semibold">Viditeľnosť</th>
                    <th className="text-right px-3 py-3 text-slate-600 font-semibold">Cena</th>
                    <th className="text-center px-3 py-3 text-slate-600 font-semibold">Featured</th>
                    <th className="text-center px-3 py-3 text-slate-600 font-semibold">Akcie</th>
                  </tr>
                </thead>
                <tbody>
                  {allListings.map(l => (
                    <tr key={l.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <Link to={`/ListingDetail?id=${l.id}`} className="font-medium text-slate-800 hover:text-indigo-600 max-w-[200px] block truncate">
                          {l.title}
                        </Link>
                        <div className="text-xs text-slate-400">{l.location_city}, {REGION_LABELS[l.location_region]}</div>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <Badge variant="outline" className="text-xs">{TYPE_LABELS[l.property_type]}</Badge>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <Badge className={`text-xs ${LISTING_STATUS_COLORS[l.status]}`}>{LISTING_STATUS_LABELS[l.status]}</Badge>
                      </td>
                      <td className="px-3 py-3 text-center">
                        {l.visibility === 'off_market'
                          ? <Badge className="text-xs bg-violet-100 text-violet-700"><EyeOff className="w-3 h-3 mr-1 inline" />Off-Market</Badge>
                          : <Badge className="text-xs bg-slate-100 text-slate-600"><Eye className="w-3 h-3 mr-1 inline" />Verejný</Badge>
                        }
                      </td>
                      <td className="px-3 py-3 text-right font-semibold text-slate-700">{fmt(l.price)}</td>
                      <td className="px-3 py-3 text-center">
                        <button
                          onClick={() => updateListingMutation.mutate({ id: l.id, data: { is_featured: !l.is_featured } })}
                          className={`transition-colors ${l.is_featured ? 'text-amber-500' : 'text-slate-200 hover:text-amber-400'}`}
                        >
                          <Star className="w-4 h-4" fill={l.is_featured ? 'currentColor' : 'none'} />
                        </button>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Select value={l.status} onValueChange={(v) => updateListingMutation.mutate({ id: l.id, data: { status: v } })}>
                            <SelectTrigger className="h-7 w-28 text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {Object.entries(LISTING_STATUS_LABELS).map(([k, v]) => <SelectItem key={k} value={k} className="text-xs">{v}</SelectItem>)}
                            </SelectContent>
                          </Select>
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => deleteListingMutation.mutate(l.id)}>
                            <Trash2 className="w-3.5 h-3.5 text-red-400" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {allListings.length === 0 && (
                    <tr><td colSpan={7} className="px-5 py-8 text-center text-slate-400">Žiadne listingy</td></tr>
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Deal Rooms Tab */}
        <TabsContent value="dealrooms">
          {unpaidFees > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 flex items-center gap-2 text-sm text-amber-800">
              <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <span><strong>{unpaidFees}</strong> deal roomov má nezaplatený success fee</span>
            </div>
          )}
          <Card className="bg-white border-slate-200">
            <CardHeader><CardTitle className="text-base text-[#0F172A]">Deal Rooms</CardTitle></CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-4 py-3 text-slate-600 font-semibold">Deal Room ID</th>
                    <th className="text-center px-3 py-3 text-slate-600 font-semibold">Status</th>
                    <th className="text-right px-3 py-3 text-slate-600 font-semibold">Nahlásená cena</th>
                    <th className="text-right px-3 py-3 text-slate-600 font-semibold">Success Fee (1%)</th>
                    <th className="text-center px-3 py-3 text-slate-600 font-semibold">Fee zaplatený</th>
                    <th className="text-center px-3 py-3 text-slate-600 font-semibold">Red Flag</th>
                    <th className="text-center px-3 py-3 text-slate-600 font-semibold">Akcie</th>
                  </tr>
                </thead>
                <tbody>
                  {allDealRooms.map(d => (
                    <tr key={d.id} className={`border-b border-slate-100 hover:bg-slate-50 ${d.red_flag ? 'bg-red-50' : ''}`}>
                      <td className="px-4 py-3">
                        <Link to={`/DealRoomPage?id=${d.id}`} className="font-mono text-xs text-indigo-600 hover:underline">{d.id.slice(0, 8)}...</Link>
                        <div className="text-xs text-slate-400">{new Date(d.created_date).toLocaleDateString('sk')}</div>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <Badge className={`text-xs ${
                          d.status === 'completed' ? 'bg-green-100 text-green-700' :
                          d.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                          d.status === 'reservation_signed' ? 'bg-amber-100 text-amber-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {d.status === 'active' ? 'Aktívny' : d.status === 'reservation_signed' ? 'Rezerv. podpísaná' : d.status === 'completed' ? 'Uzavretý' : 'Zrušený'}
                        </Badge>
                      </td>
                      <td className="px-3 py-3 text-right text-slate-700">{fmt(d.reported_price)}</td>
                      <td className="px-3 py-3 text-right font-bold text-emerald-700">{fmt(d.fee_calculated)}</td>
                      <td className="px-3 py-3 text-center">
                        {d.fee_calculated ? (
                          <button
                            onClick={() => updateDealMutation.mutate({ id: d.id, data: { fee_paid: !d.fee_paid, fee_paid_at: !d.fee_paid ? new Date().toISOString() : null } })}
                            className={`text-xs font-semibold px-2 py-1 rounded-full transition-colors ${d.fee_paid ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-slate-100 text-slate-500 hover:bg-amber-100 hover:text-amber-700'}`}
                          >
                            {d.fee_paid ? '✓ Zaplatený' : 'Označiť'}
                          </button>
                        ) : <span className="text-slate-300">—</span>}
                      </td>
                      <td className="px-3 py-3 text-center">
                        <button
                          onClick={() => updateDealMutation.mutate({ id: d.id, data: { red_flag: !d.red_flag } })}
                          className={`transition-colors ${d.red_flag ? 'text-red-500' : 'text-slate-200 hover:text-red-400'}`}
                        >
                          <AlertTriangle className="w-4 h-4" />
                        </button>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <Link to={`/DealRoomPage?id=${d.id}`}>
                          <Button variant="outline" size="sm" className="h-7 text-xs">Detail</Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {allDealRooms.length === 0 && (
                    <tr><td colSpan={7} className="px-5 py-8 text-center text-slate-400">Žiadne deal roomy</td></tr>
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* NDA Requests Tab */}
        <TabsContent value="nda">
          <Card className="bg-white border-slate-200">
            <CardHeader><CardTitle className="text-base text-[#0F172A]">NDA Požiadavky</CardTitle></CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-4 py-3 text-slate-600 font-semibold">Listing ID</th>
                    <th className="text-left px-3 py-3 text-slate-600 font-semibold">Žiadateľ</th>
                    <th className="text-center px-3 py-3 text-slate-600 font-semibold">Status</th>
                    <th className="text-left px-3 py-3 text-slate-600 font-semibold">Poznámka predávajúceho</th>
                    <th className="text-center px-3 py-3 text-slate-600 font-semibold">Dátum</th>
                  </tr>
                </thead>
                <tbody>
                  {allNdaRequests.map(n => (
                    <tr key={n.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <Link to={`/ListingDetail?id=${n.listing_id}`} className="font-mono text-xs text-indigo-600 hover:underline">{n.listing_id.slice(0, 8)}...</Link>
                      </td>
                      <td className="px-3 py-3 text-xs text-slate-600 font-mono">{n.requester_id.slice(0, 8)}...</td>
                      <td className="px-3 py-3 text-center">
                        <Badge className={`text-xs ${
                          n.status === 'approved' ? 'bg-green-100 text-green-700' :
                          n.status === 'rejected' ? 'bg-red-100 text-red-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {n.status === 'pending' ? 'Čakajúce' : n.status === 'approved' ? 'Schválené' : 'Zamietnuté'}
                        </Badge>
                      </td>
                      <td className="px-3 py-3 text-xs text-slate-500 max-w-[200px] truncate">{n.seller_notes || '—'}</td>
                      <td className="px-3 py-3 text-center text-xs text-slate-400">{new Date(n.created_date).toLocaleDateString('sk')}</td>
                    </tr>
                  ))}
                  {allNdaRequests.length === 0 && (
                    <tr><td colSpan={5} className="px-5 py-8 text-center text-slate-400">Žiadne NDA požiadavky</td></tr>
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users">
          <Card className="bg-white border-slate-200">
            <CardHeader><CardTitle className="text-base text-[#0F172A]">Všetci používatelia</CardTitle></CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-5 py-3 text-slate-600 font-semibold">Meno</th>
                    <th className="text-left px-5 py-3 text-slate-600 font-semibold">Email</th>
                    <th className="text-center px-4 py-3 text-slate-600 font-semibold">Rola</th>
                    <th className="text-center px-4 py-3 text-slate-600 font-semibold">Registrácia</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-5 py-3 font-medium text-[#0F172A]">{u.full_name || '—'}</td>
                      <td className="px-5 py-3 text-slate-600">{u.email}</td>
                      <td className="px-4 py-3 text-center">
                        <Badge className={u.role === 'admin' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}>
                          {u.role}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-center text-slate-500 text-xs">
                        {new Date(u.created_date).toLocaleDateString('sk')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Articles Tab */}
        <TabsContent value="articles">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-slate-500">{articles.length} článkov</span>
            <Button onClick={() => setArticleModal('new')} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" />Nový článok
            </Button>
          </div>
          <Card className="bg-white border-slate-200">
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-5 py-3 text-slate-600 font-semibold">Nadpis</th>
                    <th className="text-center px-4 py-3 text-slate-600 font-semibold">Kategória</th>
                    <th className="text-center px-4 py-3 text-slate-600 font-semibold">Stav</th>
                    <th className="text-center px-4 py-3 text-slate-600 font-semibold">Featured</th>
                    <th className="text-center px-4 py-3 text-slate-600 font-semibold">Akcie</th>
                  </tr>
                </thead>
                <tbody>
                  {articles.map((a) => (
                    <tr key={a.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-5 py-3 font-medium text-[#0F172A] max-w-xs truncate">{a.title}</td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant="outline" className="text-xs">{categoryLabels[a.category] || a.category}</Badge>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {a.published
                          ? <span className="flex items-center justify-center gap-1 text-green-600 text-xs"><CheckCircle className="w-3 h-3" />Publikovaný</span>
                          : <span className="flex items-center justify-center gap-1 text-slate-400 text-xs"><Clock className="w-3 h-3" />Draft</span>}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {a.featured ? <CheckCircle className="w-4 h-4 text-amber-500 mx-auto" /> : <span className="text-slate-300">—</span>}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Button variant="ghost" size="icon" onClick={() => setArticleModal(a)} className="h-7 w-7">
                            <Edit className="w-3.5 h-3.5 text-slate-500" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => deleteArticleMutation.mutate(a.id)} className="h-7 w-7">
                            <Trash2 className="w-3.5 h-3.5 text-red-400" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {articles.length === 0 && (
                    <tr><td colSpan={5} className="px-5 py-8 text-center text-slate-400">Žiadne články</td></tr>
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analyses Tab */}
        <TabsContent value="analyses">
          <Card className="bg-white border-slate-200">
            <CardHeader><CardTitle className="text-base text-[#0F172A]">Uložené analýzy</CardTitle></CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-5 py-3 text-slate-600 font-semibold">Projekt</th>
                    <th className="text-right px-4 py-3 text-slate-600 font-semibold">Investícia</th>
                    <th className="text-right px-4 py-3 text-slate-600 font-semibold">IRR</th>
                    <th className="text-right px-4 py-3 text-slate-600 font-semibold">Marža</th>
                    <th className="text-center px-4 py-3 text-slate-600 font-semibold">Odporúčanie</th>
                    <th className="text-center px-4 py-3 text-slate-600 font-semibold">Dátum</th>
                  </tr>
                </thead>
                <tbody>
                  {analyses.map((a) => (
                    <tr key={a.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-5 py-3 font-medium text-[#0F172A]">{a.project_name}</td>
                      <td className="px-4 py-3 text-right text-slate-600">€ {new Intl.NumberFormat('sk').format(a.investment_amount)}</td>
                      <td className="px-4 py-3 text-right font-semibold text-blue-600">{a.irr ? `${a.irr}%` : '—'}</td>
                      <td className="px-4 py-3 text-right text-slate-600">{a.roi ? `${a.roi}%` : '—'}</td>
                      <td className="px-4 py-3 text-center">
                        <Badge className={
                          a.recommendation === 'proceed' ? 'bg-green-100 text-green-700' :
                          a.recommendation === 'reject' ? 'bg-red-100 text-red-700' :
                          'bg-amber-100 text-amber-700'
                        }>
                          {a.recommendation === 'proceed' ? 'Odporúčané' : a.recommendation === 'reject' ? 'Zamietnuté' : 'Na zváženie'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-center text-slate-500 text-xs">
                        {new Date(a.created_date).toLocaleDateString('sk')}
                      </td>
                    </tr>
                  ))}
                  {analyses.length === 0 && (
                    <tr><td colSpan={6} className="px-5 py-8 text-center text-slate-400">Žiadne analýzy</td></tr>
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Article Modal */}
      {articleModal !== null && (
        <ArticleModal
          article={articleModal === 'new' ? null : articleModal}
          onClose={() => setArticleModal(null)}
          onSaved={() => {
            queryClient.invalidateQueries({ queryKey: ['allArticles'] });
            queryClient.invalidateQueries({ queryKey: ['articles'] });
            setArticleModal(null);
          }}
        />
      )}
    </div>
  );
}

function ArticleModal({ article, onClose, onSaved }) {
  const [form, setForm] = useState({
    title: article?.title || '',
    category: article?.category || 'construction',
    excerpt: article?.excerpt || '',
    content: article?.content || '',
    image_url: article?.image_url || '',
    read_time: article?.read_time || 5,
    published: article?.published ?? true,
    featured: article?.featured ?? false,
    tags: article?.tags?.join(', ') || '',
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const data = { ...form, tags: form.tags ? form.tags.split(',').map(t => t.trim()) : [], read_time: parseInt(form.read_time) || 5 };
      if (article?.id) {
        return base44.entities.Article.update(article.id, data);
      } else {
        return base44.entities.Article.create(data);
      }
    },
    onSuccess: onSaved
  });

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{article ? 'Upraviť článok' : 'Nový článok'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="text-xs text-slate-500 mb-1 block">Nadpis *</Label>
            <Input value={form.title} onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs text-slate-500 mb-1 block">Kategória</Label>
              <Select value={form.category} onValueChange={(v) => setForm(p => ({ ...p, category: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(categoryLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-slate-500 mb-1 block">Čas čítania (min)</Label>
              <Input type="number" value={form.read_time} onChange={(e) => setForm(p => ({ ...p, read_time: e.target.value }))} />
            </div>
          </div>
          <div>
            <Label className="text-xs text-slate-500 mb-1 block">Perex</Label>
            <Textarea value={form.excerpt} onChange={(e) => setForm(p => ({ ...p, excerpt: e.target.value }))} rows={2} />
          </div>
          <div>
            <Label className="text-xs text-slate-500 mb-1 block">Obsah (markdown)</Label>
            <Textarea value={form.content} onChange={(e) => setForm(p => ({ ...p, content: e.target.value }))} rows={8} className="font-mono text-xs" />
          </div>
          <div>
            <Label className="text-xs text-slate-500 mb-1 block">URL obrázka</Label>
            <Input value={form.image_url} onChange={(e) => setForm(p => ({ ...p, image_url: e.target.value }))} placeholder="https://..." />
          </div>
          <div>
            <Label className="text-xs text-slate-500 mb-1 block">Tagy (čiarkami oddelené)</Label>
            <Input value={form.tags} onChange={(e) => setForm(p => ({ ...p, tags: e.target.value }))} placeholder="development, IRR, financovanie" />
          </div>
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <Switch checked={form.published} onCheckedChange={(v) => setForm(p => ({ ...p, published: v }))} />
              <Label className="text-sm">Publikovaný</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.featured} onCheckedChange={(v) => setForm(p => ({ ...p, featured: v }))} />
              <Label className="text-sm">Featured</Label>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={onClose} className="flex-1">Zrušiť</Button>
            <Button onClick={() => saveMutation.mutate()} disabled={!form.title || saveMutation.isPending} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
              {saveMutation.isPending ? 'Ukladá...' : 'Uložiť'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}