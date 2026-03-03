import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Users, FileText, BarChart2, Trash2, Plus, Edit, CheckCircle, XCircle, Clock } from 'lucide-react';
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

  const deleteArticleMutation = useMutation({
    mutationFn: (id) => base44.entities.Article.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['allArticles'] })
  });

  const stats = [
    { label: 'Používatelia', value: users.length, icon: Users, color: 'text-blue-600' },
    { label: 'Článkov', value: articles.length, icon: FileText, color: 'text-purple-600' },
    { label: 'Analýz', value: analyses.length, icon: BarChart2, color: 'text-emerald-600' },
    { label: 'Projektov', value: projects.length, icon: BarChart2, color: 'text-amber-600' },
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

      <Tabs defaultValue="users">
        <TabsList className="mb-6">
          <TabsTrigger value="users">Používatelia</TabsTrigger>
          <TabsTrigger value="articles">Články</TabsTrigger>
          <TabsTrigger value="analyses">Analýzy</TabsTrigger>
        </TabsList>

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