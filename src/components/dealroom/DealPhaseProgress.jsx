import React from 'react';
import { CheckCircle2, Lock, Circle } from 'lucide-react';

const PHASES = [
  { id: 1, label: 'Deal Room otvorený', key: 'active' },
  { id: 2, label: 'Due Diligence', key: 'due_diligence' },
  { id: 3, label: 'Rezervačná dohoda', key: 'reservation_signed' },
  { id: 4, label: 'Uzavretie', key: 'completed' },
];

function getPhaseIndex(status) {
  if (status === 'active') return 1;
  if (status === 'due_diligence') return 2;
  if (status === 'reservation_signed') return 3;
  if (status === 'completed') return 4;
  if (status === 'cancelled') return 0;
  return 1;
}

export default function DealPhaseProgress({ status }) {
  const current = getPhaseIndex(status);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-6">
      <h2 className="text-sm font-bold text-slate-700 mb-4">Priebeh transakcie</h2>
      <div className="flex items-center gap-0">
        {PHASES.map((phase, i) => {
          const done = current > phase.id;
          const active = current === phase.id;
          const locked = current < phase.id;
          return (
            <React.Fragment key={phase.id}>
              <div className="flex flex-col items-center flex-1 min-w-0">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center mb-2 transition-all
                  ${done ? 'bg-green-500' : active ? 'bg-indigo-600' : 'bg-slate-100'}`}>
                  {done
                    ? <CheckCircle2 className="w-5 h-5 text-white" />
                    : active
                      ? <Circle className="w-5 h-5 text-white fill-white" />
                      : <Lock className="w-4 h-4 text-slate-400" />
                  }
                </div>
                <span className={`text-xs text-center leading-tight px-1
                  ${done ? 'text-green-600 font-medium' : active ? 'text-indigo-700 font-bold' : 'text-slate-400'}`}>
                  {phase.label}
                </span>
              </div>
              {i < PHASES.length - 1 && (
                <div className={`h-0.5 flex-shrink-0 w-6 mb-5 ${done ? 'bg-green-400' : 'bg-slate-200'}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}