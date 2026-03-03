import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Rocket, CheckCircle, Users, Zap, Star, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function BetaAccess() {
  const queryClient = useQueryClient();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ company: '', position: '', use_case: '' });

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me()
  });

  const requestMutation = useMutation({
    mutationFn: () => base44.auth.updateMe({
      beta_requested: true,
      beta_request_data: form,
      company: form.company,
      position: form.position,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      setSubmitted(true);
    }
  });

  const hasBeta = user?.beta_access;
  const hasRequested = user?.beta_requested || submitted;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-violet-50 text-violet-700 text-xs font-semibold px-4 py-2 rounded-full mb-6 border border-violet-200">
          <span className="w-2 h-2 bg-violet-500 rounded-full animate-pulse"></span>
          Beta program
        </div>
        <h1 className="text-4xl font-black text-[#0F172A] mb-4">
          Staňte sa súčasťou beta programu
        </h1>
        <p className="text-slate-500 text-lg leading-relaxed">
          Počas beta fázy majú vybraní používatelia prístup ku všetkým Pro funkciám zadarmo. Pomôžte nám tvarovať platformu.
        </p>
      </div>

      {hasBeta ? (
        /* Already has beta */
        <Card className="bg-gradient-to-br from-violet-50 to-blue-50 border-violet-200 text-center">
          <CardContent className="p-10">
            <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-violet-600" />
            </div>
            <h2 className="text-2xl font-black text-[#0F172A] mb-2">Beta prístup aktívny!</h2>
            <p className="text-slate-600 mb-6">Máte plný prístup ku všetkým Pro funkciám stavai.sk. Ďakujeme za vašu dôveru!</p>
            <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
              {['Land Feasibility', 'Dev. Kalkulačka', 'Sensitivity'].map((t, i) => (
                <div key={i} className="bg-white rounded-xl p-3 border border-violet-100 text-xs font-semibold text-[#0F172A]">{t}</div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : hasRequested ? (
        /* Request submitted */
        <Card className="bg-white border-slate-200 text-center">
          <CardContent className="p-10">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Rocket className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-black text-[#0F172A] mb-2">Žiadosť odoslaná!</h2>
            <p className="text-slate-500">Vaša žiadosť o beta prístup bola odoslaná. Budeme vás kontaktovať emailom.</p>
          </CardContent>
        </Card>
      ) : (
        /* Request form */
        <div className="grid md:grid-cols-2 gap-8">
          {/* Benefits */}
          <div className="space-y-5">
            <h2 className="font-bold text-[#0F172A] text-lg">Čo získate</h2>
            {[
              { icon: Zap, title: 'Všetky Pro funkcie', desc: 'Plný prístup ku všetkým analytickým nástrojom počas beta fázy zadarmo.' },
              { icon: Star, title: 'Early Adopter výhody', desc: 'Zľava na Pro plán po ukončení beta. Vaša spätná väzba tvorí produkt.' },
              { icon: Users, title: 'Prioritná podpora', desc: 'Priamy prístup k tímu. Vaše otázky riešime prednostne.' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold text-[#0F172A] text-sm">{item.title}</div>
                  <div className="text-xs text-slate-500 mt-0.5 leading-relaxed">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <Card className="bg-white border-slate-200">
            <CardContent className="p-6 space-y-4">
              <h3 className="font-bold text-[#0F172A]">Požiadať o prístup</h3>
              <div>
                <Label className="text-xs text-slate-500 mb-1.5 block">Spoločnosť / firma *</Label>
                <Input
                  placeholder="napr. ABC Development s.r.o."
                  value={form.company}
                  onChange={e => setForm(p => ({ ...p, company: e.target.value }))}
                />
              </div>
              <div>
                <Label className="text-xs text-slate-500 mb-1.5 block">Vaša pozícia *</Label>
                <Input
                  placeholder="napr. Developer, Investor, Architekt"
                  value={form.position}
                  onChange={e => setForm(p => ({ ...p, position: e.target.value }))}
                />
              </div>
              <div>
                <Label className="text-xs text-slate-500 mb-1.5 block">Ako plánujete používať stavai.sk?</Label>
                <Input
                  placeholder="napr. Analýza rezidenčných projektov"
                  value={form.use_case}
                  onChange={e => setForm(p => ({ ...p, use_case: e.target.value }))}
                />
              </div>
              <Button
                onClick={() => requestMutation.mutate()}
                disabled={!form.company || !form.position || requestMutation.isPending}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              >
                {requestMutation.isPending ? 'Odosiela...' : <>Požiadať o beta prístup <ArrowRight className="w-4 h-4 ml-1 inline" /></>}
              </Button>
              <p className="text-xs text-slate-400 text-center">Odpovieme do 24 hodín</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}