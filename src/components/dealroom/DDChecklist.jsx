import React, { useState } from 'react';
import { CheckCircle2, Upload, AlertCircle, ChevronDown, ChevronUp, FileText, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { useToast } from '@/components/ui/use-toast';

const STATUS_CONFIG = {
  pending: { label: 'Čaká', color: 'text-slate-400', bg: 'bg-slate-50' },
  uploaded: { label: 'Nahraté', color: 'text-green-600', bg: 'bg-green-50' },
  waived: { label: 'Nedostupné', color: 'text-amber-600', bg: 'bg-amber-50' },
};

function ChecklistItem({ item, ddItem, isSeller, onUpdate, disabled }) {
  const [showWaiveInput, setShowWaiveInput] = useState(false);
  const [waiveReason, setWaiveReason] = useState('');
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const status = ddItem?.status || 'pending';
  const cfg = STATUS_CONFIG[status];

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    onUpdate(item.id, { status: 'uploaded', file_url, file_name: file.name, uploaded_at: new Date().toISOString() });
    setUploading(false);
    toast({ title: `${item.label} — nahraté` });
  };

  const handleWaive = () => {
    if (!waiveReason.trim()) return;
    onUpdate(item.id, { status: 'waived', waive_reason: waiveReason, waived_at: new Date().toISOString() });
    setShowWaiveInput(false);
    setWaiveReason('');
  };

  return (
    <div className={`rounded-xl border p-3 ${cfg.bg} ${status === 'pending' ? 'border-slate-200' : status === 'uploaded' ? 'border-green-200' : 'border-amber-200'}`}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex-shrink-0">
          {status === 'uploaded' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
          {status === 'waived' && <AlertCircle className="w-4 h-4 text-amber-500" />}
          {status === 'pending' && <div className={`w-4 h-4 rounded-full border-2 ${item.required ? 'border-red-400' : 'border-slate-300'}`} />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-slate-700">{item.label}</span>
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${item.required ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'}`}>
              {item.required ? 'povinné' : 'voliteľné'}
            </span>
            <span className={`text-xs font-medium ${cfg.color}`}>{cfg.label}</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{item.description}</p>

          {status === 'uploaded' && ddItem?.file_name && (
            <a href={ddItem.file_url} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:underline mt-1">
              <FileText className="w-3 h-3" /> {ddItem.file_name}
            </a>
          )}
          {status === 'waived' && ddItem?.waive_reason && (
            <p className="text-xs text-amber-700 mt-1 italic">Dôvod: {ddItem.waive_reason}</p>
          )}

          {/* Seller actions */}
          {isSeller && !disabled && status === 'pending' && (
            <div className="flex gap-2 mt-2 flex-wrap">
              <label className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg cursor-pointer font-medium transition-colors ${uploading ? 'bg-slate-100 text-slate-400' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}>
                <Upload className="w-3 h-3" />
                {uploading ? 'Nahrávam...' : 'Nahrať'}
                <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} />
              </label>
              <button
                onClick={() => setShowWaiveInput(v => !v)}
                className="text-xs px-3 py-1.5 rounded-lg border border-amber-300 text-amber-600 hover:bg-amber-50 font-medium transition-colors"
              >
                Nedostupné
              </button>
            </div>
          )}

          {isSeller && !disabled && status === 'uploaded' && (
            <label className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-lg cursor-pointer text-indigo-600 hover:bg-indigo-50 font-medium transition-colors mt-1">
              <Upload className="w-3 h-3" /> Nahradiť
              <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} />
            </label>
          )}

          {showWaiveInput && (
            <div className="mt-2 space-y-1">
              <textarea
                value={waiveReason}
                onChange={e => setWaiveReason(e.target.value)}
                placeholder="Uveďte dôvod nedostupnosti dokumentu..."
                className="w-full text-xs rounded-lg border border-amber-300 px-3 py-2 resize-none h-16 focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
              <div className="flex gap-2">
                <Button size="sm" className="text-xs h-7 bg-amber-500 hover:bg-amber-600 text-white" onClick={handleWaive}>Potvrdiť</Button>
                <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => setShowWaiveInput(false)}>Zrušiť</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DDChecklist({ checklist, ddItems, isSeller, isBuyer, onUpdate, disabled }) {
  const [open, setOpen] = useState(true);
  const required = checklist.filter(i => i.required);
  const optional = checklist.filter(i => !i.required);
  const doneCount = required.filter(i => {
    const found = ddItems?.find(d => d.checklist_id === i.id);
    return found && (found.status === 'uploaded' || found.status === 'waived');
  }).length;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5">
      <button className="w-full flex items-center justify-between mb-1" onClick={() => setOpen(v => !v)}>
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-indigo-600" />
          <h2 className="font-bold text-slate-800">Due Diligence checklist</h2>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${doneCount === required.length ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
            {doneCount}/{required.length} povinné
          </span>
          {open ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>
      </button>

      {open && (
        <div className="mt-4 space-y-3">
          {required.length > 0 && (
            <>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Povinné dokumenty</div>
              {required.map(item => (
                <ChecklistItem
                  key={item.id}
                  item={item}
                  ddItem={ddItems?.find(d => d.checklist_id === item.id)}
                  isSeller={isSeller}
                  onUpdate={(id, data) => onUpdate(id, data)}
                  disabled={disabled}
                />
              ))}
            </>
          )}
          {optional.length > 0 && (
            <>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-4">Voliteľné dokumenty</div>
              {optional.map(item => (
                <ChecklistItem
                  key={item.id}
                  item={item}
                  ddItem={ddItems?.find(d => d.checklist_id === item.id)}
                  isSeller={isSeller}
                  onUpdate={(id, data) => onUpdate(id, data)}
                  disabled={disabled}
                />
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}