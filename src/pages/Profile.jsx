import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User, Mail, Building2, Phone, Globe, Bell, Shield, Save, CheckCircle, Key } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Profile() {
  const queryClient = useQueryClient();
  const [saved, setSaved] = useState(false);

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me()
  });

  const [form, setForm] = useState({
    company: user?.company || '',
    phone: user?.phone || '',
    position: user?.position || '',
    city: user?.city || '',
    notifications_email: user?.notifications_email ?? true,
    notifications_updates: user?.notifications_updates ?? true,
    language: user?.language || 'sk',
  });

  React.useEffect(() => {
    if (user) {
      setForm({
        company: user.company || '',
        phone: user.phone || '',
        position: user.position || '',
        city: user.city || '',
        notifications_email: user.notifications_email ?? true,
        notifications_updates: user.notifications_updates ?? true,
        language: user.language || 'sk',
      });
    }
  }, [user]);

  const saveMutation = useMutation({
    mutationFn: () => base44.auth.updateMe(form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="text-xs text-blue-600 uppercase tracking-widest font-semibold mb-1">Účet</div>
        <h1 className="text-3xl font-black text-[#0F172A]">Nastavenia profilu</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="md:w-72 flex-shrink-0">
          <Card className="bg-white border-slate-200">
            <CardContent className="p-6 text-center">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-black">
                  {user?.full_name?.charAt(0) || '?'}
                </span>
              </div>
              <div className="font-bold text-[#0F172A] text-lg">{user?.full_name}</div>
              <div className="text-sm text-slate-500 mb-3">{user?.email}</div>
              <Badge className={user?.role === 'admin' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}>
                {user?.role === 'admin' ? 'Admin' : 'Pro'}
              </Badge>
              {user?.beta_access && (
                <div className="mt-2">
                  <Badge className="bg-violet-100 text-violet-700">Beta používateľ</Badge>
                </div>
              )}
              <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-400">
                Člen od {user?.created_date ? new Date(user.created_date).toLocaleDateString('sk', { month: 'long', year: 'numeric' }) : '—'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main */}
        <div className="flex-1">
          <Tabs defaultValue="profile">
            <TabsList className="mb-6">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="w-4 h-4" /> Profil
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="w-4 h-4" /> Notifikácie
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="w-4 h-4" /> Bezpečnosť
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card className="bg-white border-slate-200">
                <CardHeader>
                  <CardTitle className="text-base text-[#0F172A]">Osobné údaje</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-slate-500 mb-1.5 block">Celé meno</Label>
                      <Input value={user?.full_name || ''} disabled className="bg-slate-50 text-slate-400" />
                      <p className="text-xs text-slate-400 mt-1">Meno sa mení cez prihlásenie</p>
                    </div>
                    <div>
                      <Label className="text-xs text-slate-500 mb-1.5 block">Email</Label>
                      <Input value={user?.email || ''} disabled className="bg-slate-50 text-slate-400" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-slate-500 mb-1.5 block">Spoločnosť</Label>
                      <Input
                        placeholder="napr. ABC Development s.r.o."
                        value={form.company}
                        onChange={e => setForm(p => ({ ...p, company: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-slate-500 mb-1.5 block">Pozícia</Label>
                      <Input
                        placeholder="napr. Developer"
                        value={form.position}
                        onChange={e => setForm(p => ({ ...p, position: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-slate-500 mb-1.5 block">Telefón</Label>
                      <Input
                        placeholder="+421 9XX XXX XXX"
                        value={form.phone}
                        onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-slate-500 mb-1.5 block">Mesto</Label>
                      <Input
                        placeholder="napr. Bratislava"
                        value={form.city}
                        onChange={e => setForm(p => ({ ...p, city: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-slate-500 mb-1.5 block">Jazyk rozhrania</Label>
                    <Select value={form.language} onValueChange={v => setForm(p => ({ ...p, language: v }))}>
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sk">🇸🇰 Slovenčina</SelectItem>
                        <SelectItem value="en">🇬🇧 English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="pt-2 flex items-center gap-3">
                    <Button
                      onClick={() => saveMutation.mutate()}
                      disabled={saveMutation.isPending}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {saveMutation.isPending ? 'Ukladá...' : 'Uložiť zmeny'}
                    </Button>
                    {saved && (
                      <div className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
                        <CheckCircle className="w-4 h-4" /> Uložené
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications">
              <Card className="bg-white border-slate-200">
                <CardHeader>
                  <CardTitle className="text-base text-[#0F172A]">Notifikácie</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {[
                    { key: 'notifications_email', label: 'Emailové notifikácie', desc: 'Dostávajte dôležité správy a upozornenia emailom' },
                    { key: 'notifications_updates', label: 'Novinky a aktualizácie', desc: 'Informácie o nových funkciách a vylepšeniach platformy' },
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                      <div>
                        <div className="font-medium text-[#0F172A] text-sm">{item.label}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{item.desc}</div>
                      </div>
                      <Switch
                        checked={form[item.key]}
                        onCheckedChange={v => setForm(p => ({ ...p, [item.key]: v }))}
                      />
                    </div>
                  ))}
                  <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Save className="w-4 h-4 mr-2" /> Uložiť
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security">
              <Card className="bg-white border-slate-200">
                <CardHeader>
                  <CardTitle className="text-base text-[#0F172A]">Bezpečnosť účtu</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <Key className="w-5 h-5 text-slate-500 mt-0.5" />
                    <div>
                      <div className="font-medium text-[#0F172A] text-sm mb-1">Heslo</div>
                      <p className="text-xs text-slate-500 mb-3">Zmena hesla prebieha cez prihlasovací systém. Odhlásením a novým prihlásením cez "Zabudol som heslo" môžete heslo zmeniť.</p>
                      <Button variant="outline" size="sm" onClick={() => base44.auth.logout()}>
                        Odhlásiť sa
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <Shield className="w-5 h-5 text-blue-500 mt-0.5" />
                    <div>
                      <div className="font-medium text-[#0F172A] text-sm mb-1">Typ účtu</div>
                      <p className="text-xs text-slate-500">
                        Váš účet: <span className="font-semibold text-[#0F172A]">{user?.role === 'admin' ? 'Administrátor' : 'Štandardný používateľ'}</span>
                      </p>
                      {user?.beta_access && (
                        <p className="text-xs text-violet-600 mt-1 font-medium">✓ Beta prístup aktívny</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}