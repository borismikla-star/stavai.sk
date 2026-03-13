import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Home, Building2, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';

const STEPS = ['role', 'goals', 'done'];

const B2C_GOALS = [
  { id: 'buy', label: 'Chcem kúpiť nehnuteľnosť' },
  { id: 'sell', label: 'Chcem predať nehnuteľnosť' },
  { id: 'rent', label: 'Hľadám / ponúkam nájom' },
  { id: 'browse', label: 'Len prehliadam ponuky' },
];

const B2B_GOALS = [
  { id: 'develop', label: 'Developer — hľadám pozemky / projekty' },
  { id: 'invest', label: 'Investor — hľadám výnosové nehnuteľnosti' },
  { id: 'agent', label: 'Realitný agent / maklér' },
  { id: 'list_pro', label: 'Predávam komerčné / off-market nehnuteľnosti' },
];

export default function PortalOnboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [role, setRole] = useState(null); // 'b2c' | 'b2b'
  const [selectedGoals, setSelectedGoals] = useState([]);

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
    retry: false
  });

  const saveMutation = useMutation({
    mutationFn: (data) => base44.auth.updateMe(data),
    onSuccess: () => {
      navigate('/PortalHome');
    }
  });

  const toggleGoal = (id) => {
    setSelectedGoals(prev =>
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
  };

  const handleFinish = () => {
    saveMutation.mutate({
      portal_role: role,
      portal_goals: selectedGoals,
      portal_onboarded: true,
    });
  };

  const goals = role === 'b2c' ? B2C_GOALS : B2B_GOALS;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 w-full max-w-lg p-8">

        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {['Rola', 'Ciele', 'Hotovo'].map((label, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className={`h-1.5 w-full rounded-full transition-colors ${i <= step ? 'bg-indigo-600' : 'bg-slate-200'}`} />
              <span className={`text-xs ${i <= step ? 'text-indigo-600 font-semibold' : 'text-slate-400'}`}>{label}</span>
            </div>
          ))}
        </div>

        {/* Step 0 — Choose role */}
        {step === 0 && (
          <div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">Vitaj na portáli!</h2>
            <p className="text-slate-500 mb-6">Povedz nám, kto si — prispôsobíme ti zážitok.</p>

            <div className="grid grid-cols-1 gap-4 mb-8">
              <button
                onClick={() => setRole('b2c')}
                className={`p-5 rounded-2xl border-2 text-left transition-all ${role === 'b2c' ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-indigo-200'}`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${role === 'b2c' ? 'bg-indigo-600' : 'bg-slate-100'}`}>
                    <Home className={`w-5 h-5 ${role === 'b2c' ? 'text-white' : 'text-slate-500'}`} />
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">Súkromná osoba (B2C)</div>
                    <div className="text-xs text-slate-500">Hľadám alebo predávam nehnuteľnosť</div>
                  </div>
                  {role === 'b2c' && <CheckCircle2 className="w-5 h-5 text-indigo-600 ml-auto" />}
                </div>
                <div className="text-xs text-slate-500 mt-2 pl-13">
                  Jednoduchý UX · Inzeráty od €5 · Štandardné listingy
                </div>
              </button>

              <button
                onClick={() => setRole('b2b')}
                className={`p-5 rounded-2xl border-2 text-left transition-all ${role === 'b2b' ? 'border-violet-500 bg-violet-50' : 'border-slate-200 hover:border-violet-200'}`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${role === 'b2b' ? 'bg-violet-600' : 'bg-slate-100'}`}>
                    <Building2 className={`w-5 h-5 ${role === 'b2b' ? 'text-white' : 'text-slate-500'}`} />
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">Profesionál (B2B / Pro)</div>
                    <div className="text-xs text-slate-500">Developer · Investor · Agent · Firma</div>
                  </div>
                  {role === 'b2b' && <CheckCircle2 className="w-5 h-5 text-violet-600 ml-auto" />}
                </div>
                <div className="text-xs text-slate-500 mt-2">
                  Off-Market Vault · Deal Room · Analytika · Pro predplatné €49/mes
                </div>
              </button>
            </div>

            <button
              onClick={() => setStep(1)}
              disabled={!role}
              className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Pokračovať <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 1 — Goals */}
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">Čo ťa najviac zaujíma?</h2>
            <p className="text-slate-500 mb-6">Vyber všetko, čo platí (môžeš vybrať viac).</p>

            <div className="space-y-3 mb-8">
              {goals.map(goal => (
                <button
                  key={goal.id}
                  onClick={() => toggleGoal(goal.id)}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                    selectedGoals.includes(goal.id)
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-slate-200 hover:border-indigo-200'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    selectedGoals.includes(goal.id) ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'
                  }`}>
                    {selectedGoals.includes(goal.id) && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  <span className={`text-sm font-semibold ${selectedGoals.includes(goal.id) ? 'text-indigo-800' : 'text-slate-700'}`}>
                    {goal.label}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(0)} className="flex items-center gap-1 px-4 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Späť
              </button>
              <button
                onClick={() => setStep(2)}
                disabled={selectedGoals.length === 0}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Pokračovať <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2 — Done */}
        {step === 2 && (
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">Všetko nastavené!</h2>
            <p className="text-slate-500 mb-2">
              Tvoj profil: <span className="font-bold text-slate-700">{role === 'b2b' ? 'Profesionál (B2B)' : 'Súkromná osoba (B2C)'}</span>
            </p>
            {role === 'b2b' && (
              <div className="bg-violet-50 border border-violet-200 rounded-xl p-4 mb-6 text-sm text-violet-800">
                🔐 Pre plný prístup k Off-Market Vault aktivuj Pro predplatné v nastaveniach.
              </div>
            )}
            <button
              onClick={handleFinish}
              disabled={saveMutation.isPending}
              className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors disabled:opacity-60"
            >
              {saveMutation.isPending ? 'Ukladám...' : 'Prejsť na portál'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}