import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Settings, Globe, Bell, Shield, Save, CheckCircle, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';


export default function AdminSettings() {
  const [saved, setSaved] = useState(false);

  const [settings, setSettings] = useState({
    platform_name: 'stavai.sk',
    beta_mode: true,
    beta_banner: 'Vitajte v beta verzii stavai.sk! Počas beta fázy máte prístup ku všetkým Pro funkciám zadarmo.',
    maintenance_mode: false,
    allow_registrations: true,
    contact_email: 'info@stavai.sk',
    announcement: '',
  });

  const handleSave = () => {
    // In production this would persist to a settings entity
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const sections = [
    {
      icon: Globe,
      title: 'Všeobecné nastavenia',
      content: (
        <div className="space-y-4">
          <div>
            <Label className="text-xs text-slate-500 mb-1.5 block">Názov platformy</Label>
            <Input value={settings.platform_name} onChange={e => setSettings(p => ({ ...p, platform_name: e.target.value }))} />
          </div>
          <div>
            <Label className="text-xs text-slate-500 mb-1.5 block">Kontaktný email</Label>
            <Input value={settings.contact_email} onChange={e => setSettings(p => ({ ...p, contact_email: e.target.value }))} />
          </div>
          <div>
            <Label className="text-xs text-slate-500 mb-1.5 block">Systémové oznámenie (zobrazí sa všetkým)</Label>
            <Textarea
              value={settings.announcement}
              onChange={e => setSettings(p => ({ ...p, announcement: e.target.value }))}
              placeholder="Nechajte prázdne ak nie je aktívne oznámenie..."
              rows={2}
            />
          </div>
        </div>
      )
    },
    {
      icon: Shield,
      title: 'Beta režim',
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <div className="font-medium text-[#0F172A] text-sm">Beta režim aktívny</div>
              <div className="text-xs text-slate-500">Používatelia s beta prístupom majú všetky Pro funkcie zadarmo</div>
            </div>
            <Switch checked={settings.beta_mode} onCheckedChange={v => setSettings(p => ({ ...p, beta_mode: v }))} />
          </div>
          {settings.beta_mode && (
            <div>
              <Label className="text-xs text-slate-500 mb-1.5 block">Text beta bannera</Label>
              <Textarea
                value={settings.beta_banner}
                onChange={e => setSettings(p => ({ ...p, beta_banner: e.target.value }))}
                rows={2}
              />
            </div>
          )}
          <div className="flex items-center justify-between py-2">
            <div>
              <div className="font-medium text-[#0F172A] text-sm">Povolené registrácie</div>
              <div className="text-xs text-slate-500">Noví používatelia sa môžu registrovať</div>
            </div>
            <Switch checked={settings.allow_registrations} onCheckedChange={v => setSettings(p => ({ ...p, allow_registrations: v }))} />
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <div className="font-medium text-[#0F172A] text-sm">Maintenance mód</div>
              <div className="text-xs text-slate-500">Platforma bude dočasne nedostupná pre bežných používateľov</div>
            </div>
            <Switch checked={settings.maintenance_mode} onCheckedChange={v => setSettings(p => ({ ...p, maintenance_mode: v }))} />
          </div>
        </div>
      )
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <div className="text-xs text-blue-600 uppercase tracking-widest font-semibold mb-1">Admin</div>
        <h1 className="text-3xl font-black text-[#0F172A]">Nastavenia platformy</h1>
      </div>

      {/* Current Status */}
      <Card className="bg-white border-slate-200 mb-6">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-4 h-4 text-blue-500" />
            <span className="font-semibold text-[#0F172A] text-sm">Aktuálny stav platformy</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge className={settings.beta_mode ? 'bg-violet-100 text-violet-700' : 'bg-slate-100 text-slate-600'}>
              {settings.beta_mode ? '🚀 Beta aktívna' : 'Beta vypnutá'}
            </Badge>
            <Badge className={settings.allow_registrations ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
              {settings.allow_registrations ? '✓ Registrácie povolené' : '✗ Registrácie zakázané'}
            </Badge>
            <Badge className={settings.maintenance_mode ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}>
              {settings.maintenance_mode ? '⚠ Maintenance mód' : '✓ Online'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {sections.map((section, i) => (
          <Card key={i} className="bg-white border-slate-200">
            <CardHeader>
              <CardTitle className="text-base text-[#0F172A] flex items-center gap-2">
                <section.icon className="w-4 h-4 text-blue-600" />
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent>{section.content}</CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-3">
        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Save className="w-4 h-4 mr-2" /> Uložiť nastavenia
        </Button>
        {saved && (
          <div className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
            <CheckCircle className="w-4 h-4" /> Uložené
          </div>
        )}
      </div>
    </div>
  );
}