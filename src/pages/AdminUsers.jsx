import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Users, UserPlus, Shield, CheckCircle, Clock, MoreVertical, Search, Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export default function AdminUsers() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [inviteModal, setInviteModal] = useState(false);
  const [inviteForm, setInviteForm] = useState({ email: '', role: 'user' });
  const [inviteStatus, setInviteStatus] = useState(null);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['allUsers'],
    queryFn: () => base44.entities.User.list('-created_date')
  });

  const inviteMutation = useMutation({
    mutationFn: () => base44.users.inviteUser(inviteForm.email, inviteForm.role),
    onSuccess: () => {
      setInviteStatus('success');
      queryClient.invalidateQueries({ queryKey: ['allUsers'] });
      setTimeout(() => { setInviteModal(false); setInviteStatus(null); setInviteForm({ email: '', role: 'user' }); }, 2000);
    },
    onError: () => setInviteStatus('error')
  });

  const grantBetaMutation = useMutation({
    mutationFn: (userId) => base44.entities.User.update(userId, { beta_access: true }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['allUsers'] })
  });

  const filteredUsers = users.filter(u =>
    (u.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(search.toLowerCase())
  );

  const betaRequests = users.filter(u => u.beta_requested && !u.beta_access);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <div className="text-xs text-blue-600 uppercase tracking-widest font-semibold mb-1">Admin</div>
        <h1 className="text-3xl font-black text-[#0F172A]">Správa používateľov</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Celkom', value: users.length, icon: Users, color: 'text-blue-600' },
          { label: 'Admin', value: users.filter(u => u.role === 'admin').length, icon: Shield, color: 'text-violet-600' },
          { label: 'Beta aktívny', value: users.filter(u => u.beta_access).length, icon: CheckCircle, color: 'text-emerald-600' },
          { label: 'Beta požiadavky', value: betaRequests.length, icon: Clock, color: 'text-amber-600' },
        ].map((s, i) => (
          <Card key={i} className="bg-white border-slate-200">
            <CardContent className="p-5 flex items-center gap-4">
              <s.icon className={`w-7 h-7 ${s.color}`} />
              <div>
                <div className="text-2xl font-black text-[#0F172A]">{s.value}</div>
                <div className="text-xs text-slate-500">{s.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Beta Requests Alert */}
      {betaRequests.length > 0 && (
        <Card className="bg-amber-50 border-amber-200 mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-amber-600" />
              <span className="font-semibold text-amber-800 text-sm">{betaRequests.length} nevybavených beta žiadostí</span>
            </div>
            <div className="space-y-2">
              {betaRequests.map(u => (
                <div key={u.id} className="flex items-center justify-between bg-white rounded-lg px-4 py-2.5 border border-amber-100">
                  <div>
                    <span className="font-medium text-[#0F172A] text-sm">{u.full_name || u.email}</span>
                    <span className="text-xs text-slate-500 ml-2">{u.beta_request_data?.company}</span>
                  </div>
                  <Button size="sm" onClick={() => grantBetaMutation.mutate(u.id)} className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-7 px-3">
                    Schváliť beta
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Users Table */}
      <Card className="bg-white border-slate-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base text-[#0F172A]">Všetci používatelia</CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  placeholder="Hľadať..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-9 h-8 text-sm w-52"
                />
              </div>
              <Button onClick={() => setInviteModal(true)} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                <UserPlus className="w-4 h-4 mr-1.5" /> Pozvať
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-5 py-3 text-slate-600 font-semibold">Meno</th>
                <th className="text-left px-5 py-3 text-slate-600 font-semibold">Email</th>
                <th className="text-center px-4 py-3 text-slate-600 font-semibold">Rola</th>
                <th className="text-center px-4 py-3 text-slate-600 font-semibold">Beta</th>
                <th className="text-center px-4 py-3 text-slate-600 font-semibold">Registrácia</th>
                <th className="text-center px-4 py-3 text-slate-600 font-semibold">Akcie</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(u => (
                <tr key={u.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                  <td className="px-5 py-3 font-medium text-[#0F172A]">{u.full_name || '—'}</td>
                  <td className="px-5 py-3 text-slate-600">{u.email}</td>
                  <td className="px-4 py-3 text-center">
                    <Badge className={u.role === 'admin' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}>
                      {u.role === 'admin' ? 'Admin' : 'User'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {u.beta_access
                      ? <Badge className="bg-violet-100 text-violet-700">Aktívny</Badge>
                      : u.beta_requested
                      ? <Badge className="bg-amber-100 text-amber-700">Čaká</Badge>
                      : <span className="text-slate-300 text-xs">—</span>}
                  </td>
                  <td className="px-4 py-3 text-center text-slate-500 text-xs">
                    {u.created_date ? new Date(u.created_date).toLocaleDateString('sk') : '—'}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {!u.beta_access && (
                      <Button variant="ghost" size="sm" onClick={() => grantBetaMutation.mutate(u.id)} className="text-xs h-7 text-violet-600 hover:text-violet-700 hover:bg-violet-50">
                        Beta
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-8 text-center text-slate-400">Žiadni používatelia</td></tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Invite Modal */}
      <Dialog open={inviteModal} onOpenChange={setInviteModal}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Pozvať používateľa</DialogTitle>
          </DialogHeader>
          {inviteStatus === 'success' ? (
            <div className="text-center py-6">
              <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-2" />
              <p className="font-semibold text-[#0F172A]">Pozvánka odoslaná!</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label className="text-xs text-slate-500 mb-1.5 block">Email *</Label>
                <Input
                  type="email"
                  placeholder="email@example.com"
                  value={inviteForm.email}
                  onChange={e => setInviteForm(p => ({ ...p, email: e.target.value }))}
                />
              </div>
              <div>
                <Label className="text-xs text-slate-500 mb-1.5 block">Rola</Label>
                <Select value={inviteForm.role} onValueChange={v => setInviteForm(p => ({ ...p, role: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">Používateľ</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {inviteStatus === 'error' && (
                <p className="text-xs text-red-500">Nastala chyba pri odoslaní pozvánky.</p>
              )}
              <div className="flex gap-2 pt-1">
                <Button variant="outline" onClick={() => setInviteModal(false)} className="flex-1">Zrušiť</Button>
                <Button
                  onClick={() => inviteMutation.mutate()}
                  disabled={!inviteForm.email || inviteMutation.isPending}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Mail className="w-4 h-4 mr-1.5" />
                  {inviteMutation.isPending ? 'Odosiela...' : 'Pozvať'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}