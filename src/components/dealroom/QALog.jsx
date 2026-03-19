import React, { useState } from 'react';
import { MessageSquare, Send, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/utils';

export default function QALog({ deal, user, userMap, onAddEntry }) {
  const [open, setOpen] = useState(true);
  const [question, setQuestion] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  const qaEntries = (deal.audit_log || []).filter(e => e.type === 'qa');

  const handleAsk = async () => {
    if (!question.trim()) return;
    await onAddEntry({
      user_id: user.id,
      action: question,
      type: 'qa',
      timestamp: new Date().toISOString()
    });
    setQuestion('');
  };

  const handleReply = async (parentIdx) => {
    if (!replyText.trim()) return;
    await onAddEntry({
      user_id: user.id,
      action: replyText,
      type: 'qa',
      reply_to: parentIdx,
      timestamp: new Date().toISOString()
    });
    setReplyText('');
    setReplyTo(null);
  };

  const topLevel = qaEntries.filter(e => e.reply_to === undefined || e.reply_to === null);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5">
      <button className="w-full flex items-center justify-between mb-1" onClick={() => setOpen(v => !v)}>
        <h2 className="font-bold text-slate-800 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-indigo-600" /> Q&A Log
          {qaEntries.length > 0 && (
            <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-semibold">{qaEntries.length}</span>
          )}
        </h2>
        {open ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>

      {open && (
        <div className="mt-4 space-y-4">
          {topLevel.length === 0 && (
            <p className="text-sm text-slate-400 text-center py-4">Žiadne otázky zatiaľ</p>
          )}

          {topLevel.map((entry, i) => {
            const globalIdx = (deal.audit_log || []).indexOf(entry);
            const replies = qaEntries.filter(e => e.reply_to === globalIdx);
            const isMe = entry.user_id === user.id;
            return (
              <div key={i} className="space-y-2">
                <div className={`rounded-xl p-3 ${isMe ? 'bg-indigo-50 border border-indigo-100' : 'bg-slate-50 border border-slate-100'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {userMap[entry.user_id]?.full_name?.charAt(0) || '?'}
                    </div>
                    <span className="text-xs font-semibold text-slate-700">{userMap[entry.user_id]?.full_name || 'Neznámy'}</span>
                    <span className="text-xs text-slate-400 ml-auto">{formatDate(entry.timestamp)}</span>
                  </div>
                  <p className="text-sm text-slate-700 ml-8">{entry.action}</p>
                  <button
                    className="ml-8 mt-1 text-xs text-indigo-500 hover:underline"
                    onClick={() => setReplyTo(replyTo === globalIdx ? null : globalIdx)}
                  >
                    Odpovedať
                  </button>
                </div>

                {replies.map((r, j) => (
                  <div key={j} className="ml-8 rounded-xl p-3 bg-white border border-slate-100">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-5 h-5 rounded-full bg-slate-300 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {userMap[r.user_id]?.full_name?.charAt(0) || '?'}
                      </div>
                      <span className="text-xs font-semibold text-slate-600">{userMap[r.user_id]?.full_name || 'Neznámy'}</span>
                      <span className="text-xs text-slate-400 ml-auto">{formatDate(r.timestamp)}</span>
                    </div>
                    <p className="text-sm text-slate-600 ml-7">{r.action}</p>
                  </div>
                ))}

                {replyTo === globalIdx && (
                  <div className="ml-8 flex gap-2">
                    <input
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      placeholder="Vaša odpoveď..."
                      className="flex-1 h-8 text-sm rounded-lg border border-slate-200 px-3 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                      onKeyDown={e => e.key === 'Enter' && handleReply(globalIdx)}
                    />
                    <Button size="sm" className="h-8 bg-indigo-600 hover:bg-indigo-700 text-white px-3"
                      onClick={() => handleReply(globalIdx)}>
                      <Send className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
            );
          })}

          {/* New question */}
          {deal.status !== 'completed' && deal.status !== 'cancelled' && (
            <div className="border-t border-slate-100 pt-3 flex gap-2">
              <input
                value={question}
                onChange={e => setQuestion(e.target.value)}
                placeholder="Položiť otázku..."
                className="flex-1 h-9 text-sm rounded-xl border border-slate-200 px-3 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                onKeyDown={e => e.key === 'Enter' && handleAsk()}
              />
              <Button size="sm" className="h-9 bg-indigo-600 hover:bg-indigo-700 text-white px-3"
                onClick={handleAsk} disabled={!question.trim()}>
                <Send className="w-3 h-3" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}